const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Retorna a posição de um ativo',
                parameters: {
                    type: 'object',
                    properties: {
                        codigoNegociacao: {
                            type: 'string',
                            description: 'Código de negociação da ação. exemplo: PETR4.'
                        }
                    },
                    required: ['codigoNegociacao']
                }
            }

            return metadata
        }

        const position = await utils.coll('position')
            .findOne({
                codigoNegociacao: input.codigoNegociacao
            }, {
                _audit: 0
            })
        
        if (!position) {
            return {
                success: false,
                error: 'Posição não encontrada'
            }
        }
        
        return {
            success: true,
            data: position
        }
    }
}

export const main = Main.main.bind(Main)