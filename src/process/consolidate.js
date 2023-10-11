return async ({ utils, input }) => {
    const Transaction = utils.coll('transaction')

    const transaction_group = await Transaction.aggregate([{
        $group: {
            _id: {
                user: '$user',
                stock: '$stock',
            },
            sample: {
                $first: "$$ROOT"
            }
        }
    }, {
        $lookup: {
            from: 'stock_action_events',
            localField: '_id.stock',
            foreignField: 'stock',
            as: 'stock_action_events',
            pipeline: [{
                $match: {
                    type: {
                        $in: ['SPLIT', 'DIVIDEND']
                    }
                }
            }]
        }
    }])

    const results = []

    for (const trans of transaction_group) {
        await Transaction.deleteMany({
            user: trans._id.user,
            stock: trans._id.stock,
            operation: {
                $in: ['SPLIT', 'DIVIDEND']
            }
        })

        for (const event of trans.stock_action_events) {
            let transaction = await Transaction.findOne({
                user: trans._id.user,
                stock: trans._id.stock,
                operation: event.type,
                date: event.date
            })

            if (!transaction) {
                transaction = new Transaction({
                    ...trans.sample,
                    _id: undefined,
                    user: trans._id.user,
                    stock: trans._id.stock,
                    quantity: event.quantity,
                    price: event.price,
                    operation: event.type,
                    date: event.date
                })

                await transaction.save()
            } else {

                await Transaction.updateOne({
                    _id: transaction._id
                }, {
                    $set: {
                        quantity: event.quantity,
                        price: event.price,
                    }
                })
            }
        }
    }

    const aggregate = []

    /*aggregate.push({
        $match: {
          "stock.quote_name": "BPAC11"
      }
    })*/

    aggregate.push({
        $sort: {
            date: 1
        }
    })

    aggregate.push({
        $group: {
            _id: {
                user: '$user',
                stock: '$stock',
            },
            negociations: {
                $push: "$$ROOT"
            }
        }
    })

    const transactions = await utils.coll('transaction').aggregate(aggregate)

    const result = []

    for (const transaction of transactions) {
        const consolidate = {}

        consolidate.quantity_acc = consolidate.quantity_acc || 0
        consolidate.avg_price_acc = consolidate.avg_price_acc || 0
        consolidate.total_acc = consolidate.total_acc || 0
        consolidate.total = consolidate.total || 0
        consolidate.profit_acc = consolidate.profit_acc || 0
        consolidate.order = consolidate.order || 0

        let totalValorComprado = 0
        let totalQuantityComprado = 0

        transaction.negociations = transaction.negociations.sort((a, b) => {
            if (a.date.getTime() !== b.date.getTime()) return a.date.getTime() - b.date.getTime()

            return a.operation.toLowerCase() === 'split' ? -1 : 1
        })

        for (const negociation of transaction.negociations) {
            consolidate.order++

            if (negociation.operation.toLowerCase() === 'venda') {
                consolidate.total = negociation.price * negociation.quantity

                consolidate.profit = consolidate.total - (consolidate.avg_price_acc * negociation.quantity)
                consolidate.profit_acc += consolidate.profit

                consolidate.quantity_acc -= negociation.quantity
            } else if (negociation.operation.toLowerCase() === 'compra') {
                consolidate.total = negociation.price * negociation.quantity
                consolidate.profit = 0
                totalValorComprado += (negociation.price * negociation.quantity)
                totalQuantityComprado += negociation.quantity

                consolidate.total_acc += consolidate.total
                consolidate.quantity_acc += negociation.quantity
                consolidate.avg_price_acc = totalValorComprado / totalQuantityComprado

            } else if (negociation.operation.toLowerCase() === 'split') {
                consolidate.total = 0
                consolidate.profit = 0
                consolidate.quantity_acc *= negociation.quantity
                consolidate.avg_price_acc /= negociation.quantity

                totalQuantityComprado *= negociation.quantity
            } else if (negociation.operation.toLowerCase() === 'dividend') {
                consolidate.total = negociation.price * consolidate.quantity_acc

                consolidate.profit = consolidate.total
                consolidate.profit_acc += consolidate.profit
            }

            await utils.coll('transaction').updateOne({
                _id: negociation._id
            }, {
                $set: consolidate
            })

            result.push({
                ...consolidate,
                date: negociation.date,
                transaction: transaction._id
            })
        }
    }

    return {
        result
    }
}