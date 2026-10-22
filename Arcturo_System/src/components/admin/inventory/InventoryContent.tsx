"use client"

import { useState, useMemo } from "react"
import { InventoryHeader } from "@/components/inventory/InventoryHeader"
import { InventoryStats } from "@/components/inventory/InventoryStats"
import { InventoryList } from "@/components/inventory/InventoryList"
import { ProductFormModal } from "@/components/inventory/ProductFormModal"
import { InventoryItem } from "@/lib/utils/inventoryData"
import { useAdminProducts, useDeleteProduct } from "@/lib/hooks/useAdminProducts"
import { Product } from "@/lib/types/product"
import { toast } from "sonner"

function toInventoryStatus(stock: number): InventoryItem["status"] {
    if (stock === 0) return "esgotado"
    if (stock <= 10) return "estoque_baixo"
    return "em_estoque"
}

export function InventoryContent() {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const { data: products = [], isLoading } = useAdminProducts()
    const { mutateAsync: deleteProduct } = useDeleteProduct()

    const inventoryItems: InventoryItem[] = useMemo(() =>
        products.map((p) => {
            const price = typeof p.price === "string" ? parseFloat(p.price) : p.price
            return {
                id: p.id,
                nome: p.name ?? "Produto",
                categoria: p.category?.name ?? "—",
                preco: `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                estoque: p.stock,
                status: toInventoryStatus(p.stock),
            }
        }), [products])

    const handleEdit = (id: string) => {
        const product = products.find((p) => p.id === id)
        if (product) setEditingProduct(product)
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id)
            toast.success("Produto removido")
        } catch {
            toast.error("Erro ao remover produto")
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <InventoryHeader />
            <InventoryStats products={products} isLoading={isLoading} />
            <div className="mt-8">
                <InventoryList
                    items={inventoryItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {editingProduct && (
                <ProductFormModal
                    editing={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    )
}
