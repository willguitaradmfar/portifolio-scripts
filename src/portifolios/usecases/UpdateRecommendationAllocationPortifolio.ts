import { Orki, OrkiInjectTypes } from "orki-core-runtime";
import { Consolidate, UpdateQuantity, UpdateRecommendationAllocation } from "./interfaces";

@Orki('UpdateRecommendationAllocation')
export class UpdateRecommendationAllocationPortifolio implements UpdateRecommendationAllocation {
    
    constructor(
        private database: OrkiInjectTypes.Database,
        private schema: OrkiInjectTypes.Schema,
        private context: OrkiInjectTypes.Context,
        private portifolio$Consolidate: Consolidate
    ) { }

    async execute(list: Array<{ code: string; recommendation_allocation: number; }>): Promise<any> {
        if (!list.length) {
            throw new Error("List is required")
        }

        const authentication = await this.context.get("authentication")

        const invest_wallets = await this.database
            .getCollection("invest_wallet")
            .find({
                authentication
            })

        let toUpdates = await Promise.all(list.map(async ({ code, recommendation_allocation }) => {
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
                return
            }

            return {
                invest_position,
                recommendation_allocation
            }
        }))

        toUpdates = toUpdates.filter(Boolean)

        if (!toUpdates.length) {
            throw new Error("Investment code not found")
        }

        await this.schema
            .getApi('invest_position')
            .updateMany(toUpdates.map(({ invest_position, recommendation_allocation }: any) => ({
                _id: invest_position._id,
                recommendation_allocation
            })))

        await this.portifolio$Consolidate
            .execute()
        
        return {
            success: true,
            message: "Recommendation allocation updated"
        }
    }
}
