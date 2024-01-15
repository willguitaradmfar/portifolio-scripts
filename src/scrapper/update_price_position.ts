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

const Main: OrkiTrigger = {
    main: async function ({ input, utils }: OrkiScriptServer<OrkiScriptTriggerInput>): Promise<any> {
        const all_positions = await utils.coll('position')
            .find({})
        
        let total = 0

        for (const position of all_positions) {
            utils.log(`Atualizando ${position.codigoNegociacao} ...`)
            const response = await utils.fetch(`https://open-api.kinvo.com.br/intra-day-series?tickers=${position.codigoNegociacao}&interval=5m&range=1d`)

            if (response.status !== 200) {
                utils.log(`Erro ao atualizar ${position.codigoNegociacao} ...`)
                continue
            }

            const data = await response.json() as Root
            
            const quotation = data?.data?.[position.codigoNegociacao]?.quotation

            if (!quotation) {
                utils.log(`Erro ao atualizar ${position.codigoNegociacao} ...`)
                continue
            }

            const last_quotation = quotation?.[quotation.length - 1]

            utils.log(`Atualizando ${position.codigoNegociacao} de ${last_quotation?.variation} para ${last_quotation?.close}`)

            await utils.notify('price.updated', {
                code: position.codigoNegociacao,
                price: last_quotation?.close,
                variation: last_quotation?.variation
            })

            total++
        }

        return {
            success: true,
            total
        }
    }
}

export const main = Main.main.bind(Main)