const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

const getYear = async ({
    utils,
    input,
    year
}) => {
    const token = utils.path(input, 'input.token')

    const thisYear = new Date().getFullYear()

    let page = 1
    let totalPaginas

    const list = []

    let dataFim = `${year}-12-31`

    do {

        if (year === thisYear) {
            dataFim = utils
                .dayjs()
                .add(-3, 'days')
                .format('YYYY-MM-DD')
        }        

        const result = await utils
            .fetch(`https://investidor.b3.com.br/api/extrato-negociacao-ativos/v1/negociacao-ativos/${page}?dataInicio=${year}-01-01&dataFim=${dataFim}`, {
                method: 'GET',
                agent: httpsAgent,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())

        if (result && result.message) return utils.throw('ERROR_API_B3', result.message, 500)

        for (const item of result.itens) {
            for (const negociation of item.negociacaoAtivos) {
                list.push({
                    date: item.data,
                    ...negociation
                })
            }
        }

        totalPaginas = result.totalPaginas
        page++
    } while (totalPaginas >= page)

    page = 1
    totalPaginas = undefined

    do {

        if (year === thisYear) {
            dataFim = utils
                .dayjs()
                .add(-3, 'days')
                .format('YYYY-MM-DD')
        }
        // https://investidor.b3.com.br/api/extrato-movimentacao/v1.2/movimentacao/1?dataInicio=2022-01-01&dataFim=2022-11-28&filtroProdutos=59&cache-guid=cfc1544c-ab61-4049-85bd-4ac6cc65af1c
        const result = await utils
            .fetch(`https://investidor.b3.com.br/api/extrato-movimentacao/v1.2/movimentacao/${page}?dataInicio=${year}-01-01&dataFim=${dataFim}&filtroProdutos=59`, {
                method: 'GET',
                agent: httpsAgent,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())

        if (result && result.message) return utils.throw('ERROR_API_B3', result.message, 500)

        if (!Array.isArray(result.itens)) return utils.throw('ERROR_API_B3', result, 400)

        for (const item of result.itens) {
            for (const movimentacao of item.movimentacoes) {
                list.push({
                    date: item.data,
                    ...movimentacao
                })
            }
        }

        totalPaginas = result.totalPaginas
        page++
    } while (totalPaginas >= page)

    return list.reverse()
}

return async ({
    utils,
    input
}) => {
    const userId = utils.path(input, 'input.user')
    
    const thisYear = new Date().getFullYear()
    const results = []

    const generalProgress = utils.progress('Importação ...', 4)

    utils.log('Importing transactions from Portal do Investidor')
    generalProgress()

    for (let i = 2019; i <= thisYear; i++) {
        const list = await getYear({
            utils,
            input,
            year: i
        })
        utils.log(`Importing transactions from Portal do Investidor - ${i} - ${list.length}`)

        for (const item of list) {
            results.push({
                date: new Date(item.date.replace(/T00/, 'T03')),
                operation: item.tipoMovimentacao,
                institution: item.nomeInstituicao || item.instituicao,
                ticker: item.codigoNegociacao || item.nomeProduto,
                quantity: item.quantidade || 0,
                price: item.preco || item.precoUnitario || 0,
            })
        }
    }

    generalProgress()

    const Transaction = utils.coll('transaction')
    const StockAction = utils.coll('stock_action')

    const user = await utils.coll('authentication').findById(userId)

    utils.log(`Importing transactions from Portal do Investidor - ${results.length}`)

    const transactionProgress = utils.progress(`Criando ${results.length} transações`, results.length)

    for (const transaction of results) {
        const stocks = await StockAction.find({
            $or: [{
                quote_name: transaction.ticker
            }, {
                previous_quote_name: transaction.ticker
            }]
        })

        if (!stocks.length) {
            stock = new StockAction({
                name: transaction.ticker,
                quote_name: transaction.ticker,
                current_price: 0,
                is_active: true
            })

            await stock.save()
        }

        for (let stock of stocks) {
            utils.log
            let t = await Transaction.findOne({
                date: transaction.date,
                operation: transaction.operation,
                quantity: transaction.quantity,
                price: transaction.price,
                stock,
                user,
                was_imported: true
            })

            const toCreate = {
                stock,
                user,
                quantity: transaction.quantity,
                price: transaction.price,
                operation: transaction.operation,
                date: new Date(transaction.date),
                institution: transaction.institution,
                was_imported: true
            }

            if (!t) {                
                t = new Transaction(toCreate)
                await t.save()
            } else {                
                await Transaction.updateOne({
                    _id: t._id
                }, {
                    $set: toCreate
                })
            }
        }

        transactionProgress()
    }

    generalProgress()

    utils.log('Imported transactions from Portal do Investidor')
    await utils.notify('imported_transaction_portal_investidor', {
        userId
    })

    const consolidateProgress = utils.progress('Consolidando ...', 1)    
    await utils.invoke('consolidate')
    consolidateProgress()
    generalProgress()

    return {
        results
    }
}