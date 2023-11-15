return async ({
    utils,
    input
}) => {
    const is_metadata = utils.path(input, 'is_metadata')
    const pipeline = utils.path(input, 'pipeline', [])

    if (is_metadata) {
        const fields = [{
            label: 'Carteira',
            name: 'wallet',
            typeField: 'String',
        }, {
            label: 'Criado em',
            name: 'created_at',
            typeField: 'Date',
        }, {
            label: 'Variação',
            name: 'variation',
            typeField: 'Number',
        }, {
            label: 'Valor',
            name: 'variation_wallet',
            typeField: 'Number',
        }, {
            label: 'Total',
            name: 'wallet_total',
            typeField: 'Number',
        }]
        return { fields }
    }

    let aggregate = []

    aggregate.push({
        $lookup: {
            from: "wallet",
            localField: "wallet",
            foreignField: "_id",
            as: "wallet"
        }
    })

    aggregate.push({
        $unwind: "$wallet"
    })

    aggregate.push({
        $project: {
            _id: 1,
            wallet: "$wallet.name",
            created_at: 1,
            variation: 1,
            variation_wallet: 1,
            wallet_total: 1
        }
    })

    return {
        data: await utils
            .coll('wallet_target_user_history')
            .aggregate(aggregate.concat(pipeline))        
    }
}