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

    await utils.invoke('consolidate')

    let porTipo = await utils.coll('position').aggregate([{
        $group: {
            _id: '$tipoProduto',
            total: {
                $sum: '$valorAtualizado'
            },
            totalVariacao: {
                $sum: '$variacaoValorAtualizado'
            }
        }
    }])

    const results = []

    // add TOTAL
    porTipo.push({
        _id: 'TOTAL',
        total: porTipo.reduce((acc, curr) => acc + curr.total, 0),
        totalVariacao: porTipo.reduce((acc, curr) => acc + curr.totalVariacao, 0)
    })

    let message = ''

    const dateNow = new Date()

    for (const tipo of porTipo.sort((a, b) => a._id.localeCompare(b._id))) {
        const percent = tipo.totalVariacao / tipo.total

        const text = `
${percent.toLocaleString('pt-br', { style: 'percent', minimumFractionDigits: 2 })}: ${tipo._id}`
        
        message += text

        await utils.coll('position_history').create({
            tipoProduto: tipo._id,
            valorAtualizado: tipo.total,
            percent: percent * 100,
            variacaoValorAtualizado: tipo.totalVariacao,
            created_at: dateNow
        })
    }

    message += `
=================`

    for (const tipo of porTipo.sort((a, b) => a._id.localeCompare(b._id))) {
        const percent = tipo.totalVariacao / tipo.total

        const text = `
${tipo._id}: 
${tipo.totalVariacao.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
${tipo.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}.
`
        message += text
    }

    const telegram_token = await utils.param('TELEGRAM_TOKEN')
    const chat_id = await utils.param('CHAT_ID')

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