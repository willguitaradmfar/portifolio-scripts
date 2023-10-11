return async ({
    utils,
    input
}) => {
    const total = 421

    const count = utils.progress('Meu progresso', 421)

    for (let i = 0; i < total; i++) {
        count()
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    return {
        foo: 'bar'
    }
}