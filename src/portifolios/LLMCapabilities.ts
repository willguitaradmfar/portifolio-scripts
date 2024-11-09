import { Orki, OrkiInjectTypes, OrkiLLM } from "orki-core-runtime";
import { UpdateAverageClosingPrice, UpdateQuantity } from "./usecases/interfaces";

@Orki()
export class LLMCapabilities {
    constructor(
        private database: OrkiInjectTypes.Database,
        private context: OrkiInjectTypes.Context,
        private portifolio$UpdateQuantity: UpdateQuantity,
        private portifolio$UpdateAverageClosingPrice: UpdateAverageClosingPrice
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

        const invest_positions: Array<OrkiSchemaTypes.Portifolio.InvestPosition> = await this.database
            .getCollection("invest_position")
            .find({
                invest_wallet: {
                    $in: invest_wallets.map((wallet: any) => wallet._id)
                },
                code: {
                    $regex: code ? new RegExp(`^${code}$`, "i") : /.*/
                }
            })

        return invest_positions
    }
}