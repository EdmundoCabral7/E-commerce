"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface InventoryToolbarProps {
    onSearch: (term: string) => void
}

export function InventoryToolbar({ onSearch }: InventoryToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Filtrar produtos por nome ou categoria..."
                    className="pl-9 w-full bg-obsidian-nav border-border rounded-full text-content-primary placeholder:text-content-muted/30"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    )
}