const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Dados de inflação diário (dia a dia) no Brasil.',
                parameters: {
                    type: 'object',
                    properties: {
                        start_date: {
                            type: 'string',
                            description: 'Data de início da busca. Formato: DD/MM/AAAA'
                        } as any
                    },
                    required: ['start_date']
                }
            }

            return metadata
        }

        const brapiHost = await utils.param('BRAPI_HOST')
        const brapiToken = await utils.param('BRAPI_TOKEN')

        const start = input.start_date
        const end = utils.dayjs().format('DD/MM/YYYY')

        const response = await utils.fetch(`${brapiHost}/api/v2/inflation?country=brazil&start=${start}&end=${end}&token=${brapiToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status !== 200) {
            return {
                success: false,
                error: 'Erro ao buscar dados: ' + await response.text()
            }
        }

        const data = await response.json()

        data['inflation'] = (data['inflation'] || [])

        const list = {} as any

        for (const item of data['inflation']) {
            list[item.value] = item
        }

        return {
            success: true,
            data: Object
                .keys(list)
                .map(key => list[key])
        }
    }
}

export const main = Main.main.bind(Main)