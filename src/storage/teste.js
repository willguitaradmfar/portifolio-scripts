const fs = require('fs')
const path = require('path')

return async ({
    utils,
    input
}) => {

    const bucket = utils.storage('local_1')

    const file = await bucket
        .downloadFile('file/c93f331c-5cc0-40b2-9708-058e63d69ef7/ARISTID-Partner-API-Premium V2 - Swagger.json')

    utils.log('file size', file.length)

    await bucket
        .uploadFile('a/b/c/ovo.json', file)
    
    const file2 = await bucket
        .downloadFile('a/b/c/ovo.json')

    await bucket
        .uploadFile('a/b/c/ovo2.json', file2)
    
    await bucket
        .deleteFile('a/b/c/ovo.json')
    
    return {
        
    }
}