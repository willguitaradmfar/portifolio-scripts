import axios from 'axios';
import * as cheerio from 'cheerio';
import dayjs from 'dayjs';
import { Orki, OrkiInjectTypes, OrkiInterfaces, OrkiTest } from "orki-core-runtime";
import { Consolidate } from './usecases/interfaces';

interface InsiderTransaction {
    date: string;
    netTransaction: number;
    volume: number;
    price: number;
}

@Orki()
export class UpdatePrice implements OrkiInterfaces.TriggerRuntime {

    constructor(
        private database: OrkiInjectTypes.Database,
        private logger: OrkiInjectTypes.RuntimeLogger,
        private schema: OrkiInjectTypes.Schema,
        private portifolio$Consolidate: Consolidate
    ) { }

    calculateWeightedAveragePrice(data: InsiderTransaction[]): {
        confidence: number;
        averagePrice: number;
    } {
        // Filtrar transações com volume positivo
        const validData = data.filter((item) => item.volume > 0);
      
        // Soma ponderada dos preços e soma total dos volumes
        const weightedSum = validData.reduce((sum, item) => sum + item.price * item.volume, 0);
        const totalVolume = validData.reduce((sum, item) => sum + item.volume, 0);
      
        // Calcular o preço médio ponderado
        const weightedAveragePrice = weightedSum / totalVolume;
      
        return {
            confidence: 0,
            averagePrice: Number.isFinite(weightedAveragePrice) ? weightedAveragePrice : 0
        };
      }
    
    async getInsidersHistoryIndicators(code: string): Promise<{
        confidence: number;
        averagePrice: number;
    }> {
        const url = `https://www.fundamentus.com.br/insiders.php?papel=${code}&tipo=1`

        const response = await axios.get(url)

        const $ = await cheerio.load(response.data)

        const table = $('#resultado')

        const data = table.find('tr').map((i, el) => {
            const row = $(el)
            const columns = row.find('td')

            const date = columns
                ?.eq(0)
                ?.text()
                ?.trim()
                ?.split('/')
                ?.reverse()
                ?.join('-')

            const volume = parseInt(columns.eq(1).text().replace('.', ''))
            const netTransaction = parseFloat(columns.eq(2).text().replace('.', '').replace(',', '.'))
            const price = parseFloat(columns.eq(3).text().replace('.', '').replace(',', '.'))

            if (isNaN(volume) || isNaN(netTransaction) || isNaN(price)) {
                return
            }

            if (!volume) {
                return
            }

            return {
                date,
                volume,
                netTransaction,
                price
            } as InsiderTransaction
        })

        const confidence = this.calculateWeightedAveragePrice(
            data
                .get()
                .filter(Boolean)
                // last 24 months
                .filter(row => dayjs(row.date).isAfter(dayjs().subtract(24, 'month')))
        )

        return confidence
    }

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

            const { confidence, averagePrice } = await this.getInsidersHistoryIndicators(position._id)

            await this.schema
                .getApi('invest_position')
                .updateMany(position?.docs?.map(doc => ({
                    _id: doc._id,
                    code: doc.code,
                    closing_price: last_quotation?.close,
                    variation_closing_price: last_quotation?.variation,
                    insiders_indicator_confidence: confidence,
                    insiders_indicator_price: averagePrice
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