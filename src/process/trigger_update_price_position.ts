const Main: OrkiTrigger = {
    main: async function ({ utils, input }: OrkiScriptServer<OrkiScriptTriggerInput>): Promise<any> {
        const code = input?.code
        const precoFechamento = input?.price
        // in percent
        const variacaoFechamento = input?.variation
        // calculado a partir do preco de fechamento e variacao
        const variacaoPrecoFechamento = (precoFechamento * variacaoFechamento) / 100

        if (!code) {
            return {
                success: false,
                message: 'code is required'
            }
        }

        const position: OrkiViews.Position = await utils.coll('position')
            .findOne({
                codigoNegociacao: code
            })
        
        if (!position) return

        if (!position.quantidade) { 
            throw utils.makeError('ERROR_POSITION_WITHOUT_QUANTITY', 'Position without quantity')
        }

        let valorAtualizado = position.quantidade * precoFechamento

        const response = await utils.fetch(`https://economia.awesomeapi.com.br/json/last/USD-BRL`).then(res => res.json())
        let dolar = 1

        if (response && response.length) {
            const [first] = response
            if (first && first.ask) dolar = first.ask
        }

        if (position.tipoProduto === 'NASDAQ') {
            valorAtualizado = valorAtualizado * dolar
        }

        await utils.coll('position')
            .updateOne({ _id: position._id }, {
                $set: {
                    precoFechamento,
                    variacaoFechamento,
                    variacaoPrecoFechamento,
                    valorAtualizado,
                    updated_at: new Date()
                }
            })
    }
}

export const main = Main.main.bind(Main)