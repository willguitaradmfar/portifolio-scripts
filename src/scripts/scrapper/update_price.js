return async ({
    utils,
    input
}) => {
    
    const allQuotes = await utils.coll('stock_action').find({
        is_active: true,
        can_update: true,
        investing_link: {
            $ne: null
        }
    }).sort({
        updated_price_at: 1
    }).limit(50)

    utils.log(`Scraping ${allQuotes.length} ...`)

    const puppeteer = utils.puppeteer

    const browser = await puppeteer.newBrowser();

    const results = await Promise.all(allQuotes.map(async quote => {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');

        let pageTitle

        const bolsa = quote.bolsa

        const investing_link = quote.investing_link

        utils.log(`Scraping ${investing_link} ...`)

        try {
            await page.goto(investing_link, {
                timeout: 50000,
            });

            utils.log(`Scraping link: ${investing_link} !`)

            pageTitle = await page.title();

            utils.log(`Scraping title: ${pageTitle} ...`)

            await page.waitForFunction(() =>
                document.querySelectorAll('.quotes-header-info').length || document.querySelectorAll('.cotacoes__header').length
            );

            utils.log(`Scraping selector found!`)

            const result = await page.evaluate(() => {
                if (document.querySelectorAll('.quotes-header-info').length) {
                    const price = document.querySelector('.quotes-header-info .line-info .value p').innerText
                    let variation = document.querySelector('.quotes-header-info .line-info .percentage p').innerText

                    variation = variation.replace(/\(/, '').replace(/\)/, '').replace(/%/, '').replace(',', '.')
                    variation = parseFloat(variation)

                    return {
                        price: price.replace(',', '.'),
                        variation
                    };
                } else if (document.querySelectorAll('.cotacoes__header').length) {
                    const price = document.querySelector('.cotacoes__header-price span').innerText
                    let variation = document.querySelector('.cotacoes__header-change span').innerText

                    variation = variation.replace(/\(/, '').replace(/\)/, '').replace(/%/, '').replace(',', '.')
                    variation = parseFloat(variation)

                    return {
                        price: price.replace(',', '.'),
                        variation
                    };
                }
            });

            const toUpdate = {
                current_price: parseFloat(result.price),
                variation: result.variation || 0,
                updated_price_at: new Date(),
                has_error_update_price: false
            }

            await utils.coll('stock_action').updateOne({
                _id: quote._id
            }, {
                $set: toUpdate
            })

            return {
                ...toUpdate,
                pageTitle
            }
        } catch (err) {
            await utils.coll('stock_action').updateOne({
                _id: quote._id
            }, {
                $set: {
                    updated_price_at: new Date(),
                    has_error_update_price: true
                }
            })

            return {
                name: quote.name,
                pageTitle,
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