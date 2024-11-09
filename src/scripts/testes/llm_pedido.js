return async ({
    utils,
    input
}) => {

    let rows = []
    for (let i = 0; i < 1000000; i++) {
        rows.push({
            id: i,
            data: i,
            status: 'teste_' + i
        })
    }

    await utils.bigquery.insert('ltf_data_lake', 'llm_pedido', rows, {
        projectId: 'learntofly-180002'
    })

    return {
        success: true,
    }
}