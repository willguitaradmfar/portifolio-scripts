return async ({
    utils,
    input
}) => {
    const is_metadata = utils.path(input, 'is_metadata')
    const pipeline = utils.path(input, 'pipeline', [])

    if (is_metadata) {
        const fields = [{
            name: 'tipoProduto',
            label: 'Carteira',
            typeField: 'String',
        }, {
            name: 'updated_at',
            label: 'Atualizado em',
            typeField: 'Date',
        }, {
            name: 'quantidade',
            label: 'Quantidade',
            typeField: 'Number',
        }, {
            name: 'codigoNegociacao',
            label: 'Ticker',
            typeField: 'String',
        }, {
            name: 'valorAtualizado',
            label: 'Total acumulado',
            typeField: 'Number',
        }, {
            name: 'lucroMedio',
            label: 'Lucro acumulado',
            typeField: 'Number',
        }, {
            name: 'precoFechamento',
            label: 'Preço atual',
            typeField: 'Number',
        }, {
            name: 'lucroMedio',
            label: 'Lucro acumulado projetado',
            typeField: 'Number',
        }, {
            name: 'lucroMedioVariacao',
            label: 'Variação da carteira',
            typeField: 'Number',
        }]
        return { fields }
    }

    let aggregate = []

    return {
        data: await utils
            .coll('position')
            .aggregate(aggregate.concat(pipeline))
    }
}