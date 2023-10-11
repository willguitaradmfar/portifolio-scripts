return async ({
    utils,
    input
}) => {
    const allQuotes = await utils.coll('stock_action').find({
        is_active: true,
        can_update: true
    }).sort({
        updated_info_at: 1
    }).limit(20)


    const puppeteer = utils.puppeteer

    const browser = await puppeteer.newBrowser();

    const results = await Promise.all(allQuotes.map(async quote => {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');

        try {
            await page.goto(`https://www.dadosdemercado.com.br/bolsa/acoes/${quote.quote_name.toUpperCase()}`);

            const selector = '#content'

            await page.waitForSelector(selector, {
                timeout: 1000
            })

            const result = await page.evaluate((selector) => {
                const LPA_LABEL = document.querySelector(`${selector} > div:nth-child(6) > div:nth-child(1) > span:nth-child(2)`).innerText
                const VPA_LABEL = document.querySelector(`${selector} > div:nth-child(6) > div:nth-child(2) > span:nth-child(2)`).innerText

                const LPA = LPA_LABEL === 'LPA' ?
                    document.querySelector(`${selector} > div:nth-child(6) > div:nth-child(1) > span:nth-child(1)`).innerText.replace(',', '.') : 0
                const VPA = VPA_LABEL === 'VPA' ?
                    document.querySelector(`${selector} > div:nth-child(6) > div:nth-child(2) > span:nth-child(1)`).innerText.replace(',', '.') : 0
                const setor = document.querySelector(`${selector} > div.about > div:nth-child(1) > div > div:nth-child(4) > span:nth-child(1)`).innerText
                return {
                    setor,
                    LPA,
                    VPA
                };
            }, selector);

            const lpa = parseFloat(result.LPA)
            const vpa = parseFloat(result.VPA)

            const graham = Math.sqrt(22.5 * lpa * vpa)

            const toUpdate = {
                lpa,
                vpa,
                graham,
                setor: result.setor,
            }

            await utils.coll('stock_action').updateOne({
                _id: quote._id
            }, {
                $set: {
                    ...toUpdate,
                    updated_info_at: new Date()
                }
            })

            return {
                quote_name: quote.quote_name,
                result,
                ...toUpdate
            }
        } catch (err) {
            await utils.coll('stock_action').updateOne({
                _id: quote._id
            }, {
                $set: {
                    updated_info_at: new Date()
                }
            })
            return {
                name: quote.name,
                error: err.message
            }
        } finally {
            await page.close()
        }
    }))

    await browser.close();

    await utils.invoke('consolidate_wallet')

    return {
        results
    }
}