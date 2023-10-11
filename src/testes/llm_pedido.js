return async ({
    utils,
    input
}) => {

    const is_metadata = utils.path(input, 'is_metadata')

    if (is_metadata) {
        return {
            parameters: {
                type: 'object',
                properties: {
                    customerName: {
                        type: 'string',
                        description: 'Nome do cliente'
                    },
                    product: {
                        type: 'string',
                        description: 'Nome do produto'                
                    },
                    address: {
                        type: 'string',
                        description: 'Endereço de entrega'
                    },
                    preferenceColor: {
                        type: 'string',
                        description: 'Cor preferida'
                    },
                },
                required: ['customerName', 'product', 'address', 'preferenceColor']
            }
        }
    }    

    return {
        success: true,    
    }
}