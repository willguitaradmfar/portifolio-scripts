export interface UpdateQuantity {
    execute({ code, quantity }: { code: string, quantity: number }): Promise<any>
}

export interface UpdateAverageClosingPrice {
    execute({ code, average_closing_price }: { code: string, average_closing_price: number }): Promise<any>
}

export interface Consolidate {
    execute(): Promise<any>
}