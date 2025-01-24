import { Orki, OrkiInjectTypes, OrkiLLM } from "orki-core-runtime";
import { InsertStock, Summarize, UpdateAverageClosingPrice, UpdateQuantity, UpdateRecommendationAllocation } from "./usecases/interfaces";

@Orki()
export class LLMCapabilities {
    constructor(
        private database: OrkiInjectTypes.Database,
        private context: OrkiInjectTypes.Context,
        private logger: OrkiInjectTypes.RuntimeLogger,
        private portifolio$UpdateQuantity: UpdateQuantity,
        private portifolio$UpdateAverageClosingPrice: UpdateAverageClosingPrice,
        private portifolio$InsertStock: InsertStock,
        private portifolio$UpdateRecommendationAllocation: UpdateRecommendationAllocation,
        private portifolio$Summarize: Summarize
    ) { }

    @OrkiLLM({
        description: "Update multiple quantities by codes",
        parameters: {
            type: "object",
            properties: {
                list: {
                    description: "List of investments to update",
                    type: "array",
                    items: {
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
                }
            },
            required: ["list"],
            additionalProperties: false,
        }
    })
    async updateQuantitiesByCodes(input: { list: Array<{ code: string, quantity: number }> }) {
        return this.portifolio$UpdateQuantity
            .execute(input.list)
    }

    @OrkiLLM({
        description: "Update multiples average_closing_price by codes",
        parameters: {
            type: "object",
            properties: {
                list: {
                    description: "List of investments to update",
                    type: "array",
                    items: {
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
                }
            },
            required: ["list"],
            additionalProperties: false,
        }
    })
    async updateAvgClosEPricesByCodes(input: { list: Array<{ code: string, average_closing_price: number }> }) {
        return this.portifolio$UpdateAverageClosingPrice
            .execute(input.list)
    }

    @OrkiLLM({
        description: "Update multiples recommendations allocations by codes",
        parameters: {
            type: "object",
            properties: {
                list: {
                    description: "List of investments to update",
                    type: "array",
                    items: {
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
                }
            },
            required: ["list"],
            additionalProperties: false,
        }
    })
    async updateRecommAllocsByCodes(input: { list: Array<{ code: string, recommendation_allocation: number }> }) {
        return this.portifolio$UpdateRecommendationAllocation
            .execute(input.list)
    }

    @OrkiLLM({
        description: "Insert multiples stocks",
        parameters: {
            type: "object",
            properties: {
                list: {
                    description: "List of stocks to insert",
                    type: "array",
                    items: {
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
                }
            },
            required: ["list"],
            additionalProperties: false,
        }
    })
    async insertStocks(input: { list: Array<{ code: string, quantity: number, average_closing_price: number, wallet_code: string }> }) {
        return this.portifolio$InsertStock
            .execute(input.list)
    }

    @OrkiLLM({
        description: "List my investments",
        parameters: {
            type: "object",
            properties: {
            },
            required: [],
            additionalProperties: false,
        }
    })
    async listMyInvestments() {
        const authentication = await this.context.get("authentication")

        const invest_wallets: Array<OrkiSchemaTypes.Portifolio.InvestWallet> = await this.database
            .getCollection("invest_wallet")
            .find({
                authentication
            })

        const invest_positions = await this.database
            .getCollection<OrkiSchemaTypes.Portifolio.InvestPosition>("invest_position")
            .find({
                invest_wallet: {
                    $in: invest_wallets.map((wallet: any) => wallet._id)
                }
            }).populate("invest_wallet") as OrkiSchemaTypes.Portifolio.InvestPosition[]
        

        return invest_positions.map((position) => {
            return {
                codigo: position.code,
                carteira: position?.invest_wallet?.code,
                precisa_compra_em_percentual: (position.need_to_allocate || 0) > 0 ? position.need_to_allocate : 0,
                precisa_vender_em_percentual: (position.need_to_allocate || 0) < 0 ? position.need_to_allocate : 0,
                lucro_prejuizo_em_percentual: position.net_value_percentage,
                total_alocado_em_reais: position.gross_value,
            }
        })
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
    async summarizeByWallet() {
        return this.portifolio$Summarize.execute()
    }
}