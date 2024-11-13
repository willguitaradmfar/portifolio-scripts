import mongoose from "mongoose";

import { Orki, OrkiInjectTypes, OrkiTest, RuntimeError } from "orki-core-runtime";
import { Summarize, SummarizeInput, SummarizeOutput } from "./interfaces";

@Orki('Summarize')
export class SummarizePortifolio implements Summarize {

    constructor(
        private database: OrkiInjectTypes.Database,
        private context: OrkiInjectTypes.Context
    ) { }


    @OrkiTest()
    async test() {
        const authentications = await this.database
            .getCollection('authentication')
            .find()

        for (const authentication of authentications) {
            await this.execute({
                authentication: {
                    _id: authentication._id.toString()
                }
            })
        }
    }

    @OrkiTest()
    async execute(summarizeInput?: SummarizeInput): Promise<SummarizeOutput> {
        const authentication = summarizeInput?.authentication || await this.context.get("authentication")

        if (!authentication) {
            throw new RuntimeError(
                "Authentication not found",
                "ERROR_AUTHENTICATION_NOT_FOUND",
                401
            )
        }

        const [summary] = await this.database
            .getCollection("invest_position")
            .aggregate([
                {
                    $lookup: {
                        from: "invest_wallet",
                        localField: "invest_wallet",
                        foreignField: "_id",
                        as: "wallet"
                    }
                },
                { $unwind: "$wallet" },
                {
                    $match: {
                        "wallet.authentication": new mongoose.Types.ObjectId(authentication._id)
                    }
                },
                {
                    $facet: {
                        by_wallet: [{
                            $group: {
                                _id: "$invest_wallet",
                                wallet: { $first: "$wallet" },
                                total_gross: {
                                    $sum: "$gross_value"
                                },
                                total_net: {
                                    $sum: "$net_value"
                                },
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                wallet_id: "$_id",
                                wallet_code: "$wallet.code",
                                wallet_name: "$wallet.name",
                                total_gross: 1,
                                total_net: 1
                            }
                        }, {
                            $lookup: {
                                from: "invest_position_history",
                                localField: "wallet_id",
                                foreignField: "invest_wallet",
                                as: "invest_position_history",
                                pipeline: [{
                                    $sort: { created_at: -1 }
                                }, {
                                    $limit: 1
                                }, {
                                    $project: {
                                        _id: 0,
                                        _audit: 0
                                    }
                                }]
                            }
                        }, {
                            $unwind: {
                                path: "$invest_position_history",
                                preserveNullAndEmptyArrays: true
                            }
                        }],
                        total: [{
                            $group: {
                                _id: null,
                                total_gross: {
                                    $sum: "$gross_value"
                                },
                                total_net: {
                                    $sum: "$net_value"
                                }
                            }
                        }]
                    }
                }
            ])

        return summary
    }
}
