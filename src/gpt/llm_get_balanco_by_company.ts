const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Dados fundamentais, balanço e indicadores das empresas.',
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

        const brapiHost = await utils.param('BRAPI_HOST')
        const brapiToken = await utils.param('BRAPI_TOKEN')

        const codigoNegociacao = input.codigoNegociacao

        const response = await utils.fetch(`${brapiHost}/api/quote/${codigoNegociacao}?modules=summaryProfile,financialData,incomeStatementHistory,defaultKeyStatistics&token=${brapiToken}`, {
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
            data
        }
    }
}

export const main = Main.main.bind(Main)