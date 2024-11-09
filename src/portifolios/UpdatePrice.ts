import axios from 'axios'
import { Orki, OrkiInjectTypes, OrkiInterfaces, OrkiTest } from "orki-core-runtime";
import { Consolidate, UpdateQuantity } from './usecases/interfaces';

@Orki()
export class UpdatePrice implements OrkiInterfaces.TriggerRuntime {

    constructor(
        private database: OrkiInjectTypes.Database,
        private logger: OrkiInjectTypes.RuntimeLogger,
        private schema: OrkiInjectTypes.Schema,
        private portifolio$Consolidate: Consolidate
    ) { }

    @OrkiTest()
    async execute(triggerRuntimeInput: OrkiInterfaces.TriggerRuntimeInput<any>): Promise<any> {
        const all_positions: Array<{
            _id: string
            docs: Array<OrkiSchemaTypes.Portifolio.InvestPosition>
        }> = await this.database
            .getCollection('invest_position')
            .aggregate([{
                $group: {
                    _id: "$code",
                    docs: { $push: "$$ROOT" }
                }
            }])

        let total = 0

        for (const position of all_positions) {
            this.logger.log(`Atualizando ${position._id} ...`)
            const response = await axios.get(`https://open-api.kinvo.com.br/intra-day-series?tickers=${position._id}&interval=5m&range=1d`)

            if (response.status !== 200) {
                this.logger.error(`Erro ao atualizar ${position._id} ...`)
                continue
            }

            const data = response.data as Root

            const quotation = data?.data?.[position._id]?.quotation

            if (!quotation) {
                this.logger.error(`Erro ao atualizar ${position._id} ...`)
                continue
            }

            const last_quotation = quotation?.[quotation.length - 1]

            this.logger.log(`Atualizando ${position._id} de ${last_quotation?.variation} para ${last_quotation?.close}`)

            await this.schema
                .getApi('invest_position')
                .updateMany(position?.docs?.map(doc => ({
                    _id: doc._id,
                    code: doc.code,
                    closing_price: last_quotation?.close,
                    variation_closing_price: last_quotation?.variation
                })))

            total++
        }

        await this.portifolio$Consolidate
            .execute()

        return {
            success: true,
            total
        }
    }
}

export interface Root {
    success: boolean
    data: Data
}

export interface Data {
    [key: string]: Cotation
}

export interface Cotation {
    previousClose: number
    symbol: string
    chartPreviousClose: number
    timestamp: number[]
    quotation: Quotation[]
    end: number
    start: number
    dataGranularity: string
}

export interface Quotation {
    close: number
    variation: number
}