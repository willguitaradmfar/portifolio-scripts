return async ({
    utils,
    input
}) => {
    const email = await utils.param('NORD_EMAIL')
    const senha = await utils.param('NORD_SENHA')

    const cookies = await utils.fetch('https://members.nordresearch.com.br/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'manual',
        body: JSON.stringify({
            "Email": email,
            "Senha": senha
        })
    }).then(res => res.headers.raw()["set-cookie"])

    let line = cookies.find(line => line.indexOf('Login') >= 0)

    if (!line) return

    line = line.split(';')

    line = line.find(line => line.indexOf('Login') >= 0)

    if (!line) return

    const token = line.split('=').pop()

    const puppeteer = utils.puppeteer

    const browser = await puppeteer.newBrowser();
    const page = await browser.newPage();

    await page.setCookie({
        name: 'Login',
        value: token,
        domain: 'members.nordresearch.com.br'
    });

    await page.goto(`https://members.nordresearch.com.br/conteudo/66-anti-trader-o-que-comprar-`);

    const selector = '#iframeEstatico'

    await page.waitForSelector(selector)

    let result = await page.evaluate((selector) => {
        return {
            iframe: document.querySelector(selector).getAttribute('src')
        };
    }, selector);

    await page.goto(result.iframe);

    await page.waitForSelector("#tableRecomendacoes")

    result = await page.evaluate((selector) => {
        const all_recomendations = Array.from(document.querySelectorAll('table.table tbody > tr'))

        return {
            all_recomendations: all_recomendations.map(doc => {
                return {
                    rank: doc.querySelector('td:nth-child(1)').innerText,
                    ticker: doc.querySelector('td:nth-child(2)').innerText.split('\n').shift().trim(),
                    recommendation: doc.querySelector('td:nth-child(4)').innerText,
                    max_price: doc.querySelector('td:nth-child(6)').innerText.replace('R$ ', '').replace('$', '').replace(',', '.'),
                    allocation: doc.querySelector('td:nth-child(7)').innerText.replace('%', '').replace(',', '.')
                }
            })
        };
    }, selector);

    await browser.close();

    const WalletTarget = utils.coll('wallet_target')
    const StockAction = utils.coll('stock_action')

    result.all_recomendations = result.all_recomendations.filter(rec => !!rec.ticker)

    const wallet = await utils.coll('wallet').findOne({
        name: 'AT'
    })

    if (!wallet) return

    let wallet_target = await WalletTarget.updateMany({
        wallet
    }, {
        $set: {
            allocation: 0,
            recommendation: 'OUT'
        }
    })

    for (const recomendation of result.all_recomendations) {
        let stock = await StockAction.findOne({
            quote_name: recomendation.ticker
        })

        if (!stock) {
            stock = new StockAction({
                name: recomendation.ticker,
                quote_name: recomendation.ticker,
                current_price: 0,
                updated_at: new Date(),
                is_active: true,
                can_update: true,
                country: 'BRAZIL',
                bolsa: 'BVMF'
            })

            await stock.save()
        }

        let wallet_target = await WalletTarget.findOne({
            wallet,
            stock
        })

        if (!wallet_target) {
            wallet_target = new WalletTarget({
                stock,
                wallet,
                rank: recomendation.rank,
                recommendation: recomendation.recommendation,
                allocation: recomendation.allocation,
                max_price: recomendation.max_price || 0,
                updated_at: new Date()
            })

            await wallet_target.save()
        } else {
            await WalletTarget.updateOne({
                _id: wallet_target._id
            }, {
                $set: {
                    rank: recomendation.rank,
                    recommendation: recomendation.recommendation,
                    allocation: recomendation.allocation,
                    max_price: recomendation.max_price || 0,
                    updated_at: new Date()
                }
            })
        }
    }

    return {
        result: result.all_recomendations
    }
}