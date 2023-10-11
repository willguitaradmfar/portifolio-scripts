return async ({
    utils,
    input
}) => {
    const list = utils.path(input, 'body')
    const StockAction = utils.coll('stock_action')

    const result = []

    for (const item of list) {
        const quote_name = item.ticker
        const current_price = parseFloat(item.price.replace(',', '.'))
        const variation = parseFloat(item.change.replace(',', '.'))

        let stock = await StockAction.findOne({
            quote_name
        })

        if (!stock) {
            stock = new StockAction({
                name: quote_name,
                quote_name: quote_name,
                current_price,
                variation,
                updated_price_at: new Date(),
                is_active: true
            })

            await stock.save()
        }

        const toUpdate = {
            current_price,
            variation,
            updated_price_at: new Date(),
            has_error_update_price: false
        }

        await StockAction.updateOne({
            _id: stock._id
        }, {
            $set: toUpdate
        })

        result.push(toUpdate)
    }

    return {
        result
    }
}