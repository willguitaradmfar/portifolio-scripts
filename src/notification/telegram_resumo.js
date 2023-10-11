return async ({
    utils,
    input
}) => {

    const nowWeek = utils.dayjs().format('d')
    const nowHour = parseInt(utils.dayjs().add(-3, 'hour').format('HH'))

    if (['6', '0'].includes(nowWeek)) {
        return {
            message: `Semana fora do pregão: ${nowWeek}`,
            nowHour
        }
    }

    if (nowHour > 18 || nowHour < 10) {
        return {
            message: `Horário fora do pregão: ${nowHour}`,
            nowHour
        }
    }

    const WalletTargetUserHistory = await utils.coll('wallet_target_user_history')

    const telegram_token = await utils.param('TELEGRAM_TOKEN')
    const chat_id = await utils.param('CHAT_ID')

    const active_wallets = await utils.coll('wallet').find({
        is_active: true
    }, {
        _id: 1
    })

    const wallet_user = await utils.coll('wallet_target_user').aggregate([{
        $match: {
            wallet: {
                $in: active_wallets.map(wallet => wallet._id)
            }
        }
    }, {
        $group: {
            _id: {
                user: "$user",
                wallet: "$wallet",
            },
            variation_wallet: {
                $sum: "$variation_wallet"
            },
            variation: {
                $avg: "$variation_wallet_total"
            },
            wallet_total: {
                $first: "$wallet_total"
            }
        }
    }, {
        $sort: {
            '_id.wallet': 1
        }
    }])

    const results = []

    let message = ''

    for (const wallet of wallet_user) {
        const wallet_populate = await utils.coll('wallet')
            .findById(wallet._id.wallet)

        const text = `
${wallet_populate.name}: ${wallet.variation.toFixed(2)}%
${wallet.variation_wallet.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}. 
`
        message += text

        const history = new WalletTargetUserHistory({
            created_at: new Date(),
            user: wallet._id.user,
            wallet: wallet._id.wallet,
            variation: wallet.variation,
            variation_wallet: wallet.variation_wallet,
            wallet_total: wallet.wallet_total
        })

        await history.save()
    }

    const result = await utils.fetch(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id,
            text: message,
            disable_notification: true
        })
    }).then(res => res.json())

    results.push({
        message,
        result
    })

    return {
        results
    }
}