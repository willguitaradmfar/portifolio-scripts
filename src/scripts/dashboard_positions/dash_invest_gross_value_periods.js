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
            net_value_variation_percent_day: {
                $first: '$net_value_variation_percent_day'
            },
            net_value_variation_percent_week: {
                $first: '$net_value_variation_percent_week'
            },
            net_value_variation_percent_month: {
                $first: '$net_value_variation_percent_month'
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
                { type: "1. Dia", valor: "$net_value_variation_percent_day" },
                { type: "2. Semana", valor: "$net_value_variation_percent_week" },
                { type: "3. Mês", valor: "$net_value_variation_percent_month" }
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

    aggregate.push({
        $sort: {
            type: 1
        }
    })

    return {
        data: await utils
            .coll('invest_position_history')
            .aggregate(aggregate.concat(pipeline))
    }
}