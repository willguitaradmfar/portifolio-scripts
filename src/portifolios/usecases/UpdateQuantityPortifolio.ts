import { Orki, OrkiInjectTypes, RuntimeError } from "orki-core-runtime";
import { Consolidate, UpdateQuantity } from "./interfaces";

@Orki('UpdateQuantity')
export class UpdateQuantityPortifolio implements UpdateQuantity {

    constructor(
        private database: OrkiInjectTypes.Database,
        private schema: OrkiInjectTypes.Schema,
        private context: OrkiInjectTypes.Context,
        private portifolio$Consolidate: Consolidate
    ) { }

    async execute(list: Array<{ code: string, quantity: number }>) {
        if (!list.length) {
            throw new RuntimeError("List is required", "ERROR_LIST_REQUIRED", 400)
        }

        const authentication = await this.context.get("authentication")

        const invest_wallets = await this.database
            .getCollection("invest_wallet")
            .find({
                authentication
            })

        let toUpdates = await Promise.all(list.map(async ({ code, quantity }) => {
            const result = await this.database
                .getCollection("invest_position")
                .findOne({
                    invest_wallet: {
                        $in: invest_wallets.map((wallet: any) => wallet._id)
                    },
                    code: {
                        $regex: new RegExp(`^${code}$`, "i")
                    }
                })

            if (!result) {
                return
            }

            return {
                invest_position: result,
                quantity
            }
        }))

        toUpdates = toUpdates.filter(Boolean)

        if (!toUpdates.length) {
            throw new RuntimeError("Investment not found", "ERROR_INVESTMENT_NOT_FOUND", 404)
        }

        await this.schema
            .getApi('invest_position')
            .updateMany(toUpdates.map(({ invest_position, quantity }: any) => ({
                _id: invest_position._id,
                quantity
            })))

        await this.portifolio$Consolidate
            .execute()

        return {
            success: true,
            message: "Quantity updated successfully"
        }
    }
}
