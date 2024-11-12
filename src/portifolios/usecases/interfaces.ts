export interface UpdateQuantity {
    execute({ code, quantity }: { code: string, quantity: number }): Promise<any>
}

export interface UpdateAverageClosingPrice {
    execute({ code, average_closing_price }: { code: string, average_closing_price: number }): Promise<any>
}

export interface InsertStock {
    execute({ code, quantity, average_closing_price, wallet_code }: { code: string, quantity: number, average_closing_price?: number, wallet_code?: string }): Promise<any>
}

export interface Consolidate {
    execute(): Promise<any>
}

export interface UpdateRecommendationAllocation {
    execute({ code, recommendation_allocation }: { code: string, recommendation_allocation: number }): Promise<any>
}

export type SummarizeOutput = {
    by_wallet: Array<{
        wallet_id: string
        wallet_code: string
        wallet_name: string
        total_gross: number,
        total_net: number,
        invest_position_history: OrkiSchemaTypes.Portifolio.InvestPositionHistoryInput
    }>,
    total: Array<{
        total_gross: number,
        total_net: number
    }>
}

export type SummarizeInput = {
    authentication?: {
        _id: string
    }
}

export interface Summarize {
    execute(summarizeInput?: SummarizeInput): Promise<SummarizeOutput>
}