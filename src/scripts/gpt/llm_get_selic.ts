const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Dados da taxa Selic no Brasil.',
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

        const response = await utils.fetch(`${brapiHost}/api/v2/prime-rate?historical=true&country=brazil&start=${start}&end=${end}&token=${brapiToken}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status !== 200) {
            return {
                success: false,
                error: 'Erro ao buscar dados: ' + await response.text() + ' status: ' + response.status + `https://brapi.dev/api/v2/prime-rate?historical=true&country=brazil&start=${start}&end=${end}&token=${brapiToken}`
            }
        }

        const data: any = await response.json()

        data['prime-rate'] = (data['prime-rate'] || [])

        const list = {} as any

        for (const item of data['prime-rate']) {
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