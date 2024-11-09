import { Orki, OrkiInjectTypes, OrkiLLM, OrkiTest } from "orki-core-runtime";
import { InsertStock, UpdateAverageClosingPrice, UpdateQuantity, UpdateRecommendationAllocation } from "./usecases/interfaces";
import mongoose from "mongoose";

@Orki()
export class LLMCapabilities {
    constructor(
        private database: OrkiInjectTypes.Database,
        private context: OrkiInjectTypes.Context,
        private portifolio$UpdateQuantity: UpdateQuantity,
        private portifolio$UpdateAverageClosingPrice: UpdateAverageClosingPrice,
        private portifolio$InsertStock: InsertStock,
        private portifolio$UpdateRecommendationAllocation: UpdateRecommendationAllocation
    ) { }

    @OrkiLLM({
        description: "Update quantity by code",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "Investment code. Example: 'AAPL', 'GOOGL', 'TSLA'",
                },
                quantity: {
                    type: "number",
                    description: "Quantity to update",
                },
            },
            required: ["code", "quantity"],
            additionalProperties: false,
        }
    })
    async updateQuantityByCode({ code, quantity }: { code: string, quantity: number }) {
        return this.portifolio$UpdateQuantity
            .execute({ code, quantity })
    }

    @OrkiLLM({
        description: "Update average_closing_price by code",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "Investment code. Example: 'AAPL', 'GOOGL', 'TSLA'",
                },
                average_closing_price: {
                    type: "number",
                    description: "Average closing price to update",
                },
            },
            required: ["code", "average_closing_price"],
            additionalProperties: false,
        }
    })
    async updateAverageClosingPriceByCode({ code, average_closing_price }: { code: string, average_closing_price: number }) {
        return this.portifolio$UpdateAverageClosingPrice
            .execute({ code, average_closing_price })
    }

    @OrkiLLM({
        description: "Update recommendation allocation by code",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "Investment code. Example: 'AAPL', 'GOOGL', 'TSLA'",
                },
                recommendation_allocation: {
                    type: "number",
                    description: "Recommendation allocation to update",
                },
            },
            required: ["code", "recommendation_allocation"],
            additionalProperties: false,
        }
    })
    async updateRecommAllocByCode({ code, recommendation_allocation }: { code: string, recommendation_allocation: number }) {
        return this.portifolio$UpdateRecommendationAllocation
            .execute({ code, recommendation_allocation })
    }

    @OrkiLLM({
        description: "Insert stock",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "Investment code. Example: 'AAPL', 'GOOGL', 'TSLA'",
                },
                quantity: {
                    type: "number",
                    description: "Quantity to insert",
                },
                average_closing_price: {
                    type: "number",
                    description: "Average closing price to insert",
                },
                wallet_code: {
                    type: "string",
                    description: "Wallet code. Example: 'wallet1', 'wallet2', 'wallet3'",
                },
            },
            required: ["code", "quantity"],
            additionalProperties: false,
        }
    })
    async insertStock({ code, quantity, average_closing_price, wallet_code }: { code: string, quantity: number, average_closing_price: number, wallet_code: string }) {
        return this.portifolio$InsertStock
            .execute({ code, quantity, average_closing_price, wallet_code })
    }

    @OrkiLLM({
        description: "List my investments",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "Investment code. Example: 'AAPL', 'GOOGL', 'TSLA'",
                },
            },
            required: [],
            additionalProperties: false,
        }
    })
    async listMyInvestments({ code }: { code: string }) {
        const authentication = await this.context.get("authentication")

        const invest_wallets: Array<OrkiSchemaTypes.Portifolio.InvestWallet>  = await this.database
            .getCollection("invest_wallet")
            .find({
                authentication
            })

        const invest_positions: Array<any> = await this.database
            .getCollection("invest_position")
            .find({
                invest_wallet: {
                    $in: invest_wallets.map((wallet: any) => wallet._id)
                },
                code: {
                    $regex: code ? new RegExp(`^${code}$`, "i") : /.*/
                }
            }).populate("invest_wallet")

        return invest_positions
    }

    @OrkiLLM({
        description: "Summarize investments grouped by wallet, summing the total gross amount",
        parameters: {
            type: "object",
            properties: {},
            required: [],
            additionalProperties: false,
        }
    })
    @OrkiTest()
    async summarizeByWallet() {
        const authentication = await this.context.get("authentication")

        const summary = await this.database
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
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                wallet_code: "$wallet.code",
                                wallet_name: "$wallet.name",
                                total_gross: 1
                            }
                            }],
                        total: [{
                            $group: {
                                _id: null,
                                total_gross: {
                                    $sum: "$gross_value"
                                }
                            }
                        }]
                    }
                }
            ])

        return summary
    }
}