const Main: OrkiLLM = {
    async main({ input, utils }: OrkiScriptServer<OrkiScriptLLMBotInput>): Promise<OrkiScriptLLMBotOutput> {
        if (input.is_metadata) {
            const metadata: OrkiScriptLLMBotMetadata = {
                description: 'Retorna o histórico de posição em um periodo',
                parameters: {
                    type: 'object',
                    properties: {
                        tipo: {
                            type: 'string',
                            enum: ['total', 'detalhado'],
                            description: 'Tipo de resumo, total ou detalhado. Total é a soma de todos os produtos, detalhado é a lista de produtos.'
                        } as any,
                        data_inicio: {
                            type: 'string',
                            description: 'Data de inicio do periodo. DateISO, exemplo: 2021-01-01T00:00:00.000Z'
                        },
                        data_fim: {
                            type: 'string',
                            description: 'Data de fim do periodo. DateISO, exemplo: 2021-01-01T00:00:00.000Z'
                        },
                        agrupamento_periodo: {
                            type: 'string',
                            enum: ['hora', 'dia', 'semana', 'mes'],
                            description: 'Agrupamento de periodo. Hora retorna a média por hora, dia por dia, semana por semana e mes por mes.'
                        } as any,
                    },
                    required: ['agrupamento_periodo', 'data_inicio', 'data_fim']
                }
            }

            return metadata
        }

        const agrupamento_periodo = input.agrupamento_periodo
        const data_inicio = new Date(input.data_inicio)
        const data_fim = new Date(input.data_fim)
        const tipo = input.tipo

        const history = await utils.coll('position_history')
            .aggregate([{
                $match: {
                    created_at: {
                        $gte: data_inicio,
                        $lte: data_fim
                    },
                    tipoProduto: tipo === 'total' ? { $eq: 'TOTAL' } : { $ne: 'TOTAL' }
                }            
            }, {
                $group: {
                    _id: {
                        tipoProduto: '$tipoProduto',
                        data: {
                            $switch: {
                                branches: [
                                    { case: { $eq: [agrupamento_periodo, 'hora'] }, then: { $dateToString: { format: '%Y-%m-%d %H', date: '$created_at' } } },
                                    { case: { $eq: [agrupamento_periodo, 'dia'] }, then: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } } },
                                    { case: { $eq: [agrupamento_periodo, 'semana'] }, then: { $dateToString: { format: '%Y-%U', date: '$created_at' } } },
                                    { case: { $eq: [agrupamento_periodo, 'mes'] }, then: { $dateToString: { format: '%Y-%m', date: '$created_at' } } },
                                ],
                                default: null
                            }
                        }
                    },
                    valorAtualizado: { $avg: '$valorAtualizado' }
                }
            }, {
                $sort: {
                    '_id.data': -1
                }
            }])

        return {
            success: true,
            data: history.map((h: any) => ({
                tipo: h._id.tipoProduto,
                [agrupamento_periodo]: h._id.data,
                percent: h.percent,
                valor: h.valor
            }))
        }
    }
}

export const main = Main.main.bind(Main)