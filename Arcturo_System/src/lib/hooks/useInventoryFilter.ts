import { useMemo } from "react"
import { InventoryItem } from "@/lib/utils/inventoryData"

export function useInventoryFilter(items: InventoryItem[], searchTerm: string) {
    const filteredItems = useMemo(() => {
        if (!searchTerm) return items

        const lowerTerm = searchTerm.toLowerCase()

        return items.filter((item) => 
            item.nome.toLowerCase().includes(lowerTerm) ||
            item.categoria.toLowerCase().includes(lowerTerm)
        )
    }, [items, searchTerm])

    return filteredItems
}
