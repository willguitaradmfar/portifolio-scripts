return async ({
    utils,
    input
}) => {
    const telegram_token = await utils.param('TELEGRAM_TOKEN')
    const chat_id = await utils.param('CHAT_ID')

    const text = `
Anomalia na ação:
${utils.path(input, 'stock.quote_name')}. (${utils.path(input, 'variation')} %)
proj.: ${input.profit_acc_projection.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`

    // integração com o telegram

    const result = await utils.fetch(`https://api.telegram.org/bot${telegram_token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id,
            text,
            disable_notification: true
        })
    }).then(res => res.json())

    return {
        result,
        text
    }
}