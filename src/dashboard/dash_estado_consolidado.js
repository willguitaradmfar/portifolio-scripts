return async ({
    utils,
    input
}) => {
    const is_metadata = utils.path(input, 'is_metadata')
    const pipeline = utils.path(input, 'pipeline', [])

    if (is_metadata) {
        const fields = [{
            name: 'wallet',
            label: 'Carteira',
            typeField: 'String',
        }, {
            name: 'created_at',
            label: 'Criado em',
            typeField: 'Date',
        }, {
            name: 'updated_at',
            label: 'Atualizado em',
            typeField: 'Date',
        }, {
            name: 'quantity',
            label: 'Quantidade',
            typeField: 'Number',
        }, {
            name: 'stock',
            label: 'Ticker',
            typeField: 'String',
        }, {
            name: 'total_acc',
            label: 'Total acumulado',
            typeField: 'Number',
        }, {
            name: 'profit_acc',
            label: 'Lucro acumulado',
            typeField: 'Number',
        }, {
            name: 'wallet_total',
            label: 'Total da carteira',
            typeField: 'Number',
        }, {
            name: 'wallet_allocation',
            label: 'Alocação da carteira',
            typeField: 'Number',
        }, {
            name: 'wallet_need_allocation',
            label: 'Alocação necessária',
            typeField: 'Number',
        }, {
            name: 'wallet_allocation_diff',
            label: 'Diferença de alocação',
            typeField: 'Number',
        }, {
            name: 'current_price',
            label: 'Preço atual',
            typeField: 'Number',
        }, {
            name: 'profit_acc_projection',
            label: 'Lucro acumulado projetado',
            typeField: 'Number',
        }, {
            name: 'variation_wallet',
            label: 'Variação da carteira',
            typeField: 'Number',
        }, {
            name: 'variation',
            label: 'Variação',
            typeField: 'Number',
        }, {
            name: 'current_month_sell',
            label: 'Venda do mês atual',
            typeField: 'Number',
        }, {
            name: 'current_month_sell_profit',
            label: 'Lucro da venda do mês atual',
            typeField: 'Number',
        }, {
            name: 'variation_wallet_total',
            label: 'Variação da carteira total',
            typeField: 'Number',
        },]
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
        $match: {
            "wallet.is_active": true
        }
    })

    aggregate.push({
        $lookup: {
            from: "stock_action",
            localField: "stock",
            foreignField: "_id",
            as: "stock"
        }
    })

    aggregate.push({
        $unwind: "$stock"
    })

    aggregate.push({
        $project: {
            _id: 1,
            wallet: "$wallet.name",
            created_at: 1,
            updated_at: 1,
            quantity: 1,
            stock: "$stock.name",
            total_acc: 1,
            profit_acc: 1,
            wallet_total: 1,
            wallet_allocation: 1,
            wallet_need_allocation: 1,
            wallet_allocation_diff: 1,
            current_price: 1,
            profit_acc_projection: 1,
            variation_wallet: 1,
            variation: 1,
            current_month_sell: 1,
            current_month_sell_profit: 1,
            variation_wallet_total: 1
        }
    })

    return {
        data: await utils
            .coll('wallet_target_user')
            .aggregate(aggregate.concat(pipeline))
    }
}