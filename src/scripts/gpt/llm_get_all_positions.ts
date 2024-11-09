const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Retorna a posição de um ativo',
                parameters: {
                    type: 'object',
                    properties: {
                    },
                    required: []
                }
            }

            return metadata
        }

        const positions = await utils.coll('position')
            .find({}, {
                _audit: 0
            })
        
        if (!positions.length) {
            return {
                success: false,
                error: 'Posições não encontradas'
            }
        }
        
        return {
            success: true,
            data: positions
        }
    }
}

export const main = Main.main.bind(Main)