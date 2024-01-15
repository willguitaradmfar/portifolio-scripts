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

        const position = await utils.coll('position')
            .findOne({
                codigoNegociacao: code
            })
        
        if (!position) return
        
        const valorAtualizado = position.quantidade * precoFechamento

        if (Number.isNaN(variacaoPrecoFechamento)) {
            return {
                success: false,
                message: 'variacaoPrecoFechamento is NaN'
            }
        }

        const variacaoValorAtualizado = (position.quantidade * variacaoPrecoFechamento)

        if (Number.isNaN(variacaoValorAtualizado)) {
            return {
                success: false,
                message: 'variacaoValorAtualizado is NaN'
            }
        }

        await utils.coll('position')
            .updateOne({ _id: position._id }, {
                $set: {
                    precoFechamento,
                    valorAtualizado,
                    variacaoFechamento,
                    variacaoPrecoFechamento,
                    variacaoValorAtualizado,
                    updated_at: new Date()
                }
            })
    }
}

export const main = Main.main.bind(Main)