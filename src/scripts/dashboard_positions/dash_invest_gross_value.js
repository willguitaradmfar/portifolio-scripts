return async ({
    utils,
    input
}) => {
    const is_metadata = utils.path(input, 'is_metadata')
    const pipeline = utils.path(input, 'pipeline', [])

    const { invest_wallet } = input.options

    if (is_metadata) {
        const fields = [{
            label: 'Carteira',
            name: 'invest_wallet',
            typeField: 'String',
        }, {
            label: 'Criado em',
            name: 'created_at',
            typeField: 'Date',
        }, {
            label: 'Total',
            name: 'gross_value',
            typeField: 'Number',
        }, {
            label: 'Variação (R$)',
            name: 'gross_value_variation',
            typeField: 'Number',
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
        $project: {
            _id: 1,
            invest_wallet: '$invest_wallet.name',
            created_at: 1,
            gross_value: 1,
            gross_value_variation: 1
        }
    })

    aggregate.push({
        $group: {
            _id: {
                invest_wallet: '$invest_wallet',
                created_at: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$created_at'
                    }
                }
            },
            invest_wallet: {
                $last: '$invest_wallet'
            },
            gross_value: {
                $last: '$gross_value'
            },
            gross_value_variation: {
                $last: '$gross_value_variation'
            },
            created_at: {
                $last: '$created_at'
            }
        }
    })

    return {
        data: await utils
            .coll('invest_position_history')
            .aggregate(aggregate.concat(pipeline))        
    }
}