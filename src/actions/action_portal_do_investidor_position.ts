export interface Root {
    paginaAtual: number
    totalPaginas: number
    itens: Iten[]
    detalheStatusCode: number
    excecoes: any[]
}

export interface Iten {
    categoriaProduto: string
    tipoProduto: string
    descricaoTipoProduto: string
    posicoes: Posic[]
    totalPosicao: number
    totalItemsPagina: number
}

export interface Posic {
    id: string
    tipoProduto: string
    temBloqueio: boolean
    instituicao: string
    codigoConta?: string
    quantidade: number
    valorAtualizado: number
    precoFechamento?: number
    produto: string
    tipo?: string
    marcacoes: any[]
    codigoNegociacao?: string
    documentoInstituicao: string
    existeLogotipo: boolean
    disponivel: number
    documento: string
    razaoSocial?: string
    codigoIsin: string
    distribuicao?: string
    escriturador?: string
    valorBruto: number
    numeroDocumentoEmissor?: string
    administrador?: string
    vencimento?: string
    valorAplicado?: number
    indexador?: string
    indisponivel?: number
    nomeTituloPublico?: string
    valorLiquido?: number
    percRentabilidadeContratada?: number
}

const Main: OrkiAction = {
    main: async function ({ input, utils }: OrkiScriptServer<OrkiScriptActionInput>): Promise<any> {
        if(!input?.input?.json) utils.throw('ERROR_NO_JSON', 'No json input', 400)

        const json = JSON.parse(input?.input?.json) as Root

        const posics: Posic[] = []

        for (const iten of json.itens) {
            for (const posic of iten.posicoes) {
                posics.push(posic)
            }
        }

        let total = 0

        for (const posicao of posics) {
            const codigoNegociacao = posicao.codigoNegociacao || posicao.codigoIsin

            const exists = await utils.coll('position')
                .findOne({
                    codigoNegociacao
                })

            if (exists) {
                await utils.coll('position')
                    .updateOne({
                        _id: exists._id
                    }, {
                        $set: {
                            ...posicao,
                            codigoNegociacao,
                            updated_at: new Date()
                        }
                    })
            } else {
                await utils.coll('position')
                    .create({
                        ...posicao,
                        codigoNegociacao,
                        updated_at: new Date()
                    })
            }

            total += posicao.valorAtualizado
        }

        return {
            total
        }
    }
}

export const main = Main.main.bind(Main)