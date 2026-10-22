export type InventoryStatus = "em_estoque" | "estoque_baixo" | "esgotado"

export type InventoryItem = {
    id: string
    nome: string
    categoria: string
    preco: string
    estoque: number
    status: InventoryStatus
}
