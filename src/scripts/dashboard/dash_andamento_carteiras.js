return async ({
    utils,
    input
}) => {
    const is_metadata = utils.path(input, 'is_metadata')
    const pipeline = utils.path(input, 'pipeline', [])

    if (is_metadata) {
        const fields = [{
            label: 'Tipo',
            name: 'tipoProduto',
            typeField: 'String',
        }, {
            label: 'Criado em',
            name: 'created_at',
            typeField: 'Date',
        }, {
            label: 'Total',
            name: 'valorAtualizado',
            typeField: 'Number',
        }, {
            label: 'Variação',
            name: 'percent',
            typeField: 'Number',
        }, {
            label: 'Variação (R$)',
            name: 'variacaoValorAtualizado',
            typeField: 'Number',
        }]
        return { fields }
    }

    let aggregate = []    

    return {
        data: await utils
            .coll('position_history')
            .aggregate(aggregate.concat(pipeline))        
    }
}