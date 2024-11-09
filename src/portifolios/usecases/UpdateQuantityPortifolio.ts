import { Orki, OrkiInjectTypes } from "orki-core-runtime";
import { Consolidate, UpdateQuantity } from "./interfaces";

@Orki('UpdateQuantity')
export class UpdateQuantityPortifolio implements UpdateQuantity {
    
    constructor(
        private database: OrkiInjectTypes.Database,
        private schema: OrkiInjectTypes.Schema,
        private context: OrkiInjectTypes.Context,
        private portifolio$Consolidate: Consolidate
    ) { }

    async execute({ code, quantity }: { code: string; quantity: number; }): Promise<any> {
        if (!code) {
            throw new Error("Code is required")
        }

        if (!quantity) {
            throw new Error("Quantity is required")
        }

        const authentication = await this.context.get("authentication")

        const invest_wallets = await this.database
            .getCollection("invest_wallet")
            .find({
                authentication
            })

        const invest_position = await this.database
            .getCollection("invest_position")
            .findOne({
                invest_wallet: {
                    $in: invest_wallets.map((wallet: any) => wallet._id)
                },
                code: {
                    $regex: new RegExp(`^${code}$`, "i")
                }
            })

        if (!invest_position) {
            throw new Error("Investment code not found")
        }

        await this.schema
            .getApi('invest_position')
            .update(
                invest_position._id.toString(),
                {
                    quantity
                }
        )

        await this.portifolio$Consolidate
            .execute()
        
        return {
            success: true,
            message: "Quantity updated successfully"
        }
    }
}
