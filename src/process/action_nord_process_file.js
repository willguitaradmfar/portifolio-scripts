const trataValor = (text) => {
    const regex = /\d+,\d+/g;

    const matches = text.matchAll(regex);

    for (const match of matches) {
        text = text.replace(match[0], match[0].replace(/,/g, '.'))
    }

    return text
}

function csvToObject(csvString, slug) {
    csvString = csvString
        .replace(/%/g, '')
        .replace(/R\$\s/g, '')
    csvString = trataValor(csvString)

    const rows = csvString.trim().split('\n');
    let headers = rows[0].split(',')
        .map(header => header.replace(/["]/g, '').trim());

    if (slug) {
        headers = headers.map(header => {
            return slug(header) || '_no_field'
        })
    }

    const objects = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.replace(/["]/g, '').trim());
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i];
        });
        return obj;
    });

    return objects;
}

return async ({
    utils,
    input
}) => {
    const nord_file_id = utils.path(input, 'input.nord_file')

    utils.log('Iniciando processamento')

    const nord_file = await utils.coll('nord_files')
        .findById(nord_file_id)
        .populate('wallet')

    utils.protect(nord_file, '', {
        code: 'ERROR_FILE_NOT_FOUND',
        message: `File not found: ${nord_file_id}`,
        statusCode: 400
    })

    const storate = await utils.storage('local')

    const [file] = utils.path(nord_file, 'file.list', [])

    utils.protect(file, '', {
        code: 'ERROR_FILE_NOT_FOUND',
        message: 'File not found',
        statusCode: 400
    })

    utils.log(`Baixando arquivo ${file.key}`)
    const data = await storate.downloadFile(file.key)

    const csv = data.toString()

    utils.log(`Convertendo arquivo ${file.key} para objeto`)
    const list = csvToObject(csv, utils.slug, utils.log)

    if (nord_file.wallet.name === 'AT') {
        utils.log(`Processando arquivo ${file.key} para wallet AT`)
        for (const item of list) {
            utils.log(`Processando ação ${item.empresa}`)
            const action_name = item.empresa.replace(/(\w*).*/g, '$1')

            utils.log(`Buscando ação ${action_name}`)
            const stock = await utils.coll('stock_action').findOne({
                name: action_name
            })

            if (!stock) continue
            utils.log(`Ação ${item.empresa} encontrada`)

            const wallet_target = await utils.coll('wallet_target').findOne({
                stock,
                wallet: nord_file.wallet
            })

            const max_price = parseFloat(item['preco-teto'].replace(/,/g, '.').replace(/R\$ /g, ''))

            if (!wallet_target) {
                utils.log(`Criando ação ${item.empresa}`)
                await utils.coll('wallet_target').create({
                    stock,
                    wallet: nord_file.wallet,
                    rank: item['_no_field'],
                    recommendation: item['recomendacao'],
                    allocation: item['alocacao'],
                    max_price
                })
            } else {
                utils.log(`Atualizando ação ${item.empresa}`)
                await utils.coll('wallet_target').updateOne({
                    _id: wallet_target._id
                }, {
                    $set: {
                        stock,
                        wallet: nord_file.wallet,
                        updated_at: new Date(),
                        rank: item['_no_field'],
                        recommendation: item['recomendacao'],
                        allocation: item['alocacao'],
                        max_price
                    }
                })
            }
        }
    }

    if (nord_file.wallet.name === 'Nord Fundos Imobiliários') {
        utils.log(`Processando arquivo ${file.key} para wallet Nord Fundos Imobiliários`)
        let rank = 0
        for (const item of list) {
            rank++

            utils.log(`Processando ação ${item.empresa}`)
            const action_name = item.empresa

            utils.log(`Buscando ação ${action_name}`)
            const stock = await utils.coll('stock_action').findOne({
                name: action_name
            })

            if (!stock) continue
            utils.log(`Ação ${item.empresa} encontrada`)

            const wallet_target = await utils.coll('wallet_target').findOne({
                stock,
                wallet: nord_file.wallet
            })

            const max_price = parseFloat(item['preco-teto'].replace(/,/g, '.').replace(/R\$ /g, ''))

            if(Number.isNaN(max_price)) continue

            if (!wallet_target) {
                utils.log(`Criando ação ${item.empresa}`)
                await utils.coll('wallet_target').create({
                    stock,
                    wallet: nord_file.wallet,
                    rank,
                    recommendation:
                        item['recomendacao'] === 'COMPRAR'
                            ? 'LONG' : item['recomendacao'] === 'AGUARDAR'
                                ? 'KEEP' : item['recomendacao'] === 'VENDER'
                                    ? 'SHORT' : 'OUT',
                    allocation: item['alocacao'],
                    max_price
                })
            } else {
                utils.log(`Atualizando ação ${item.empresa}`)
                await utils.coll('wallet_target').updateOne({
                    _id: wallet_target._id
                }, {
                    $set: {
                        stock,
                        wallet: nord_file.wallet,
                        updated_at: new Date(),
                        rank,
                        recommendation:
                            item['recomendacao'] === 'COMPRAR'
                                ? 'LONG' : item['recomendacao'] === 'AGUARDAR'
                                    ? 'KEEP' : item['recomendacao'] === 'VENDER'
                                        ? 'SHORT' : 'OUT',
                        allocation: item['alocacao'],
                        max_price
                    }
                })
            }
        }
    }

    return {
        success: true,
        list
    }
}