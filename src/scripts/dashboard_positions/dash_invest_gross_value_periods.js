return async ({
    utils,
    input
}) => {
    const is_metadata = utils.path(input, 'is_metadata')
    const pipeline = utils.path(input, 'pipeline', [])

    const { invest_wallet } = input?.options || {}

    if (is_metadata) {
        const fields = [{
            label: 'Carteira',
            name: 'invest_wallet',
            typeField: 'String',
        }, {
            label: 'Tipo',
            name: 'type',
            typeField: 'String',
        }, {
            label: 'Valor',
            name: 'valor',
            typeField: 'Number',
        }, {
            label: 'Criado em',
            name: 'created_at',
            typeField: 'Date',
        }]
        return { fields }
    }

    let aggregate = []

    if (invest_wallet) {
        aggregate.push({
            $match: {
                invest_wallet: new utils.mongoose.Types
                    .ObjectId(invest_wallet)
            }
        })
    }

    aggregate.push({
        $lookup: {
            from: 'invest_wallet',
            localField: 'invest_wallet',
            foreignField: '_id',
            as: 'invest_wallet'
        }
    })

    aggregate.push({
        $unwind: '$invest_wallet'
    })

    aggregate.push({
        $sort: {
            created_at: -1
        }
    })

    aggregate.push({
        $group: {
            _id: {
                invest_wallet: '$invest_wallet.name',
                created_at: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$created_at'
                    }
                }
            },
            gross_value_variation_day: {
                $first: '$gross_value_variation_day'
            },
            gross_value_variation_week: {
                $first: '$gross_value_variation_week'
            },
            gross_value_variation_month: {
                $first: '$gross_value_variation_month'
            },
            created_at: {
                $first: '$created_at'
            }
        }
    })

    aggregate.push({
        $sort: {
            created_at: -1
        }
    })

    aggregate.push({
        $limit: 5
    })

    aggregate.push({
        $project: {
            _id: 1,
            invest_wallet: '$_id.invest_wallet',
            created_at: 1,
            valores: [
                { type: "Dia", valor: "$gross_value_variation_day" },
                { type: "Semana", valor: "$gross_value_variation_week" },
                { type: "Mês", valor: "$gross_value_variation_month" }
            ]
        }
    })

    aggregate.push({
        $unwind: '$valores'
    })

    aggregate.push({
        $group: {
            _id: {
                invest_wallet: '$_id.invest_wallet',
                type: '$valores.type'
            },
            valor: {
                $sum: '$valores.valor'
            },
            created_at: {
                $last: '$created_at'
            }
        }
    })

    aggregate.push({
        $project: {
            _id: 1,
            invest_wallet: '$_id.invest_wallet',
            type: '$_id.type',
            valor: 1,
            created_at: 1
        }
    })

    return {
        data: await utils
            .coll('invest_position_history')
            .aggregate(aggregate.concat(pipeline))
    }
}