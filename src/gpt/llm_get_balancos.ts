const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Dados fundamentais de uma ação',
                parameters: {
                    type: 'object',
                    properties: {
                        codigoNegociacao: {
                            type: 'string',
                            description: 'Código de negociação do ativo. Exemplo: PETR4'
                        } as any
                    },
                    required: ['codigoNegociacao']
                }
            }

            return metadata
        }

        const token = 'x8SQzBqsYi5bd9tPJTtkve'

        const codigoNegociacao = input.codigoNegociacao

        const response = await utils.fetch(`https://brapi.dev/api/quote/${codigoNegociacao}?modules=summaryProfile&token=${token}`, {
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

        return {
            success: true,
            data: data?.data?.results.map((result: any) => {
                delete result.summaryProfile

                return result
            })
        }
    }
}

export const main = Main.main.bind(Main)