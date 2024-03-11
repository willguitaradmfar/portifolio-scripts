return async ({
    utils,
    input
}) => {
    const results = await utils.fetch(`https://economia.awesomeapi.com.br/json/last/USD-BRL`).then(res => res.json())
    let dolar = 1

    if (results && results.length) {
        const [first] = results
        if (first && first.ask) dolar = first.ask
    }

    const Wallet = utils.coll('wallet')
    const WalletTargetUser = utils.coll('wallet_target_user')
    const Transaction = utils.coll('transaction')

    const aggregate = []

    aggregate.push({
        $lookup: {
            from: 'wallet_target',
            localField: '_id',
            foreignField: 'wallet',
            as: 'targets'
        }
    })

    const wallets = await Wallet.aggregate(aggregate)

    const result = []

    for (const wallet of wallets) {
        for (const target of wallet.targets) {
            const transactions = await Transaction.aggregate([{
                $match: {
                    stock: target.stock
                }
            }, {
                $sort: {
                    order: -1
                }
            }, {
                $group: {
                    _id: {
                        user: "$user",
                        stock: "$stock",
                    },
                    doc: {
                        $first: "$$ROOT"
                    }
                }

            }])

            for (const transaction of transactions) {
                let wallet_target_user = await WalletTargetUser.findOne({
                    user: transaction._id.user,
                    wallet_target: target
                })

                const stock = await utils.coll('stock_action').findById(transaction._id.stock)

                let factorConverter = 1

                if (stock.country === 'EUA') {
                    factorConverter = dolar
                }

                const toUpdate = {
                    quantity: transaction.doc.quantity_acc,
                    avg_price_acc: transaction.doc.avg_price_acc * factorConverter,
                    total_acc: transaction.doc.quantity_acc * stock.current_price * factorConverter,
                    profit_acc: transaction.doc.profit_acc * factorConverter,
                    wallet_need_allocation: target.allocation,
                    current_price: stock.current_price * factorConverter,
                    variation_wallet: (((stock.variation / 100) * stock.current_price) * transaction.doc.quantity_acc) * factorConverter,
                    variation: stock.variation,
                    profit_acc_projection: ((transaction.doc.quantity_acc * stock.current_price) - (transaction.doc.quantity_acc * transaction.doc.avg_price_acc)) * factorConverter,
                    updated_at: new Date()
                }

                if (!wallet_target_user) {
                    wallet_target_user = new WalletTargetUser({
                        user: transaction._id.user,
                        wallet_target: target,
                        wallet: target.wallet,
                        stock: transaction._id.stock,
                        ...toUpdate
                    })
                    await wallet_target_user.save()
                } else {
                    await WalletTargetUser.updateOne({
                        _id: wallet_target_user._id
                    }, {
                        $set: toUpdate
                    })
                }

                result.push({
                    toUpdate,
                    wallet_target: target._id
                })

                if (stock.variation < -20 || stock.variation > 20) continue

                if (wallet_target_user.variation < 6 && stock.variation > 6) {
                    await utils.notify('variation_anomaly', {
                        ...toUpdate,
                        stock,
                        user: transaction._id.user,
                        wallet: target.wallet
                    })
                }

                if (wallet_target_user.variation > -6 && stock.variation < -6) {
                    await utils.notify('variation_anomaly', {
                        ...toUpdate,
                        stock,
                        user: transaction._id.user,
                        wallet: target.wallet
                    })
                }
            }
        }
    }


    const wallet_totals = await WalletTargetUser.aggregate([{
        $group: {
            _id: {
                user: "$user",
                wallet: "$wallet",
            },
            wallet_total: {
                $sum: "$total_acc"
            },
            variation_wallet_total: {
                $sum: "$variation_wallet"
            }
        }
    }])

    for (const wallet_total of wallet_totals) {
        const variation_wallet_total = wallet_total.wallet_total ? (wallet_total.variation_wallet_total * 100) / wallet_total.wallet_total : 0

        await WalletTargetUser.updateMany({
            user: wallet_total._id.user,
            wallet: wallet_total._id.wallet
        }, {
            $set: {
                updated_at: new Date(),
                wallet_total: wallet_total.wallet_total,
                variation_wallet_total
            }
        })
    }

    const wallet_totals_month = await Transaction.aggregate([{
        $match: {
            operation: 'Venda'
        }
    }, {
        $group: {
            _id: {
                user: "$user",
                stock: "$stock",
                month: {
                    $dateToString: {
                        format: "%Y-%m",
                        date: "$date"
                    }
                }
            },
            current_month_sell: {
                $sum: "$total"
            },
            current_month_sell_profit: {
                $sum: "$profit"
            }
        }
    }, {
        $match: {
            '_id.month': utils.dayjs().format('YYYY-MM')
        }
    }])

    await WalletTargetUser.updateMany({}, {
        $set: {
            current_month_sell: 0,
            current_month_sell_profit: 0
        }
    })

    for (const wallet_total of wallet_totals_month) {
        const stock = await utils.coll('stock_action').findById(wallet_total._id.stock)

        let factorConverter = 1

        if (stock.country === 'EUA') {
            factorConverter = dolar
        }

        await WalletTargetUser.updateOne({
            user: wallet_total._id.user,
            stock: wallet_total._id.stock,
        }, {
            $set: {
                updated_at: new Date(),
                current_month_sell: wallet_total.current_month_sell * factorConverter,
                current_month_sell_profit: wallet_total.current_month_sell_profit * factorConverter
            }
        })
    }

    const wallet_target_users = await WalletTargetUser.find()

    for (const wallet_target_user of wallet_target_users) {
        const wallet_allocation = (wallet_target_user.total_acc * 100) / wallet_target_user.wallet_total

        if (isNaN(wallet_allocation)) continue

        await WalletTargetUser.updateOne({
            _id: wallet_target_user._id
        }, {
            $set: {
                wallet_allocation,
                wallet_allocation_diff: wallet_target_user.wallet_need_allocation - wallet_allocation
            }
        })
    }

    return {
        result
    }
}