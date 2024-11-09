// # Porcentagem de recomendação de alocação
// - name: recommendation_allocation
//   description: Porcentagem de Recomendação de Alocação
//   typeField: Number
// # Percentual alocado
// - name: allocated
//   description: Percentual Alocado
//   typeField: Number
// # Percentual que precisa alocar
// - name: need_to_allocate
//   description: Percentual que Precisa Alocar
//   typeField: Number

import { Orki, OrkiInjectTypes, OrkiTest } from "orki-core-runtime";
import { Consolidate } from "./interfaces";

@Orki('Consolidate')
export class ConsolidatePortifolio implements Consolidate {

    constructor(
        private database: OrkiInjectTypes.Database,
        private schema: OrkiInjectTypes.Schema
    ) { }

    @OrkiTest()
    async execute(): Promise<any> {
        const invest_positions_groued: Array<{
            _id: string
            docs: Array<OrkiSchemaTypes.Portifolio.InvestPosition>
        }> = await this.database
            .getCollection("invest_position")
            .aggregate([{
                $group: {
                    _id: "$invest_wallet",
                    docs: { $push: "$$ROOT" }
                }
            }])

        const results = []

        for (const invest_position_groued of invest_positions_groued) {
            const invest_positions = invest_position_groued.docs

            let toUpdate = invest_positions?.map((invest_position: any): Partial<OrkiSchemaTypes.Portifolio.InvestPosition> => {
                const closing_price = invest_position.closing_price
                const average_closing_price = invest_position.average_closing_price

                const gross_value = closing_price * invest_position.quantity
                const applied_value = average_closing_price * invest_position.quantity
                const net_value = gross_value - applied_value
                const average_profit = (applied_value / net_value) * 100
                const average_profit_variation = (closing_price / average_closing_price) * 100

                return {
                    _id: invest_position._id,
                    gross_value,
                    applied_value,
                    net_value,
                    average_profit,
                    average_profit_variation,
                    recommendation_allocation: invest_position.recommendation_allocation
                }
            })

            const total_wallet = toUpdate.reduce((acc: any, curr) => {
                acc.gross_value += curr.gross_value
                acc.applied_value += curr.applied_value
                return acc
            }, {
                gross_value: 0,
                applied_value: 0
            } as Partial<OrkiSchemaTypes.Portifolio.InvestPosition>)

            results.push(total_wallet)

            toUpdate = toUpdate
                .map((invest_position: Partial<OrkiSchemaTypes.Portifolio.InvestPosition>) => {
                    const gross_value = invest_position?.gross_value || 0
                    const recommendation_allocation = invest_position?.recommendation_allocation

                    if (!recommendation_allocation) {
                        return invest_position
                    }

                    let allocated = (gross_value * 100) / total_wallet.gross_value
                    let need_to_allocate = recommendation_allocation - allocated

                    if (Number.isNaN(allocated)) {
                        allocated = 0
                    }

                    if (Number.isNaN(need_to_allocate)) {
                        need_to_allocate = 0
                    }

                    return {
                        ...invest_position,
                        recommendation_allocation: undefined,
                        allocated,
                        need_to_allocate
                    }
                })

            await this.schema
                .getApi("invest_position")
                .updateMany(toUpdate)
        }

        return results
    }
}