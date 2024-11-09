import { Orki, OrkiInjectTypes, RuntimeError } from "orki-core-runtime";
import { Consolidate, InsertStock } from "./interfaces";

@Orki('InsertStock')
export class InsertStockPortifolio implements InsertStock {

    constructor(
        private database: OrkiInjectTypes.Database,
        private schema: OrkiInjectTypes.Schema,
        private context: OrkiInjectTypes.Context,
        private portifolio$Consolidate: Consolidate
    ) { }


    async execute({ code, quantity, average_closing_price, wallet_code }: { code: string; quantity: number; average_closing_price: number; wallet_code: string }): Promise<any> {

        if (!code) {
            throw new RuntimeError(
                "Code is required",
                "ERROR_CODE_REQUIRED",
                400
            )
        }

        if (quantity === undefined) {
            throw new RuntimeError(
                "Quantity is required",
                "ERROR_QUANTITY_REQUIRED",
                400
            )
        }

        if (average_closing_price === undefined) {
            average_closing_price = 0
        }

        const authentication = await this.context.get("authentication")

        let invest_wallet: OrkiSchemaTypes.Portifolio.InvestWallet | null

        if (wallet_code === undefined) {
            const list = await this.database
                .getCollection("invest_wallet")
                .find({
                    authentication
                })
            
            if (list.length === 1) {
                invest_wallet = list[0] as any
            } else {            
                throw new RuntimeError(
                    "Wallet is required",
                    "ERROR_WALLET_REQUIRED",
                    400
                )
            }
            
        } else {
            invest_wallet = await this.database
                .getCollection("invest_wallet")
                .findOne({
                    authentication,
                    code: wallet_code
                })
        }

        if (!invest_wallet) {
            throw new RuntimeError(
                "Wallet not found",
                "ERROR_WALLET_NOT_FOUND",
                400
            )
        }

        const invest_position = await this.database
            .getCollection("invest_position")
            .findOne({
                invest_wallet,
                code: {
                    $regex: new RegExp(`^${code}$`, "i")
                }
            })

        if (invest_position) {
            throw new RuntimeError(
                "Investment code already exists",
                "ERROR_INVESTMENT_CODE_ALREADY_EXISTS",
                400
            )
        }

        await this.schema
            .getApi("invest_position")
            .create({
                code,
                quantity,
                average_closing_price,
                invest_wallet
            })

        await this.portifolio$Consolidate
            .execute()

        return {
            success: true,
            message: "Stock inserted successfully"
        }
    }

}