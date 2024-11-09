import { Orki, OrkiInjectTypes, OrkiTest } from "orki-core-runtime";
import { Consolidate } from "./interfaces";
import axios from "axios";

@Orki('Consolidate')
export class ConsolidatePortifolio implements Consolidate {

    constructor(
        private database: OrkiInjectTypes.Database,
        private schema: OrkiInjectTypes.Schema
    ) { }

    async getFactor(investPosition: OrkiSchemaTypes.Portifolio.InvestPosition) {        
        if (!investPosition.is_dolar) { 
            return 1
        }

        const response = await axios.get(`https://economia.awesomeapi.com.br/USD-BRL/1`).then(res => res.data)

        if (response && response.length) {
            const [first] = response
            if (first && first.ask) return first.ask
        }

        return 1
    }

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

            let toUpdate = await Promise.all(invest_positions?.map(async (invest_position: any): Promise<Partial<OrkiSchemaTypes.Portifolio.InvestPosition & { [key: string]: any }>> => {

                const factor = await this.getFactor(invest_position)

                const closing_price = invest_position.closing_price
                const average_closing_price = invest_position.average_closing_price

                const gross_value = (closing_price * invest_position.quantity) * factor
                const applied_value = (average_closing_price * invest_position.quantity) * factor
                const net_value = gross_value - applied_value
                const average_profit = net_value > 0 ? (applied_value / net_value) * 100 : 0
                const average_profit_variation = average_closing_price > 0 ? (closing_price / average_closing_price) * 100 : 0

                return {
                    _id: invest_position._id,
                    gross_value,
                    applied_value,
                    net_value,
                    average_profit,
                    average_profit_variation,
                    recommendation_allocation: invest_position.recommendation_allocation
                }
            }))

            const total_wallet = toUpdate.reduce((acc: any, curr) => {
                acc.gross_value = curr.gross_value ? acc.gross_value + curr.gross_value : acc.gross_value
                acc.applied_value = curr.applied_value ? acc.applied_value + curr.applied_value : acc.applied_value
                return acc
            }, {
                gross_value: 0,
                applied_value: 0
            } as Partial<OrkiSchemaTypes.Portifolio.InvestPosition>)  
            
            results.push(total_wallet)

            toUpdate = toUpdate
                .map((invest_position: Partial<OrkiSchemaTypes.Portifolio.InvestPosition & { [key: string]: any }>) => {
                    const gross_value = invest_position?.gross_value || 0
                    const recommendation_allocation = invest_position?.recommendation_allocation
                    
                    for (const key in invest_position) { 
                        if(!invest_position[key]) {
                            delete invest_position[key]
                        }
                    }

                    if (recommendation_allocation === undefined) {
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

            results.push(toUpdate)
            
            await this.schema
                .getApi("invest_position")
                .updateMany(toUpdate)
        }

        return results
    }
}