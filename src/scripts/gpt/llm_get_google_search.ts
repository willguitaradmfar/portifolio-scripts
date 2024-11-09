const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Busca no Google.',
                parameters: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Query de busca.'
                        } as any
                    },
                    required: ['query']
                }
            }

            return metadata
        }

        const apiKey = await utils.param('GOOGLE_API_KEY')
        const cx = await utils.param('GOOGLE_CX')

        const query = input.query

        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

        const response = await utils.fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.status !== 200) {
            return {
                success: false,
                error: 'Erro ao buscar dados: ' + await response.text() + ' status: ' + response.status + url
            }
        }

        const data: any = await response.json()        

        return {
            success: true,
            data: data?.items?.map((item: any) => {
                return {
                    title: item.title,
                    link: item.link,
                    snippet: item.snippet,
                    metatags: item?.pagemap?.metatags?.map((tag: any) => {
                        return {
                            image: tag['og:image'],
                            description: tag['og:description'],
                            image_url: tag['og:image:url'],
                            published_time: tag['article:published_time'],
                        }
                    })
                }
            })
        }
    }
}

export const main = Main.main.bind(Main)