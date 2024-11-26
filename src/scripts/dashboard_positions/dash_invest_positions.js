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
            label: 'Código',
            name: 'code',
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
            label: 'Lucro/Prejuízo',
            name: 'net_value',
            typeField: 'Number',
        }, {
            label: 'Precisa alocar',
            name: 'need_to_allocate',
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
            code: 1,
            invest_wallet: '$invest_wallet.name',
            created_at: 1,
            gross_value: 1,
            net_value: 1,
            need_to_allocate: 1,
        }
    })

    return {
        data: await utils
            .coll('invest_position')
            .aggregate(aggregate.concat(pipeline))        
    }
}