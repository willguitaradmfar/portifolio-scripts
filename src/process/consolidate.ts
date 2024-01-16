const calcularLucro = ({ position }: any) => {
    const variacaoPrecoFechamento = (position.precoFechamento * position.variacaoFechamento) / 100

    const valorAtualizado = position.quantidade * position.precoFechamento

    if (Number.isNaN(variacaoPrecoFechamento)) {
        return {}
    }

    const variacaoValorAtualizado = (position.quantidade * variacaoPrecoFechamento)

    if (Number.isNaN(variacaoValorAtualizado)) {
        return {}
    }

    const valorInvestido = position.quantidade * position.precoMedioFechamento

    const lucroMedio = valorAtualizado - valorInvestido

    const lucroMedioVariacao = (lucroMedio / valorInvestido)

    if (Number.isNaN(lucroMedioVariacao)) {
        return {}
    }

    return {
        variacaoValorAtualizado,
        lucroMedio,
        lucroMedioVariacao: lucroMedioVariacao * 100
    }
}


const Main: OrkiTrigger = {
    main: async function ({ input, utils }: OrkiScriptServer<OrkiScriptTriggerInput>): Promise<any> {
        const all_types = await utils.coll('position')
            .aggregate([{
                $group: {
                    _id: '$tipoProduto',
                    positions: { $push: '$$ROOT' }
                }
            }])

        const response = await utils.fetch(`https://economia.awesomeapi.com.br/USD-BRL/1?format=json`).then(res => res.json())
        let dolar = 1

        if (response && response.length) {
            const [first] = response
            if (first && first.ask) dolar = first.ask
        }

        for (const type of all_types) {
            const positions = type.positions.map((item: any) => {
                if (type._id === 'NASDAQ') {
                    return {
                        ...item,
                        valorAtualizado: item.valorAtualizado * dolar
                    }
                }
                return item
            })

            const total = positions.reduce((acc: number, item: any) => acc + item.valorAtualizado, 0)
            utils.log(`Total ${type._id}: ${total}`)

            for (const position of positions) {
                let recomendacaoDeAlocacao = position.recomendacaoDeAlocacao

                if (utils.isNullOrUnidefined(recomendacaoDeAlocacao)) {
                    recomendacaoDeAlocacao = 0
                }

                const alocado = (position.valorAtualizado * 100) / total
                const precisaAlocar = recomendacaoDeAlocacao - alocado

                utils.log(`Alocado ${position.codigoNegociacao}: ${alocado}/${precisaAlocar}`)

                const lucroCalculado = calcularLucro({ position })

                utils.log(`Lucro calculado ${position.codigoNegociacao}: ${JSON.stringify(lucroCalculado)}`)

                await utils.coll('position')
                    .updateOne({ _id: position._id }, {
                        $set: {
                            ...lucroCalculado,
                            alocado,
                            precisaAlocar,
                            updated_at: new Date()
                        }
                    })
            }
        }

    }
}

export const main = Main.main.bind(Main)