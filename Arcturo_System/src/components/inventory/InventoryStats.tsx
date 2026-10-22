import { Package, AlertTriangle, XCircle } from "lucide-react"
import { Product } from "@/lib/types/product"

interface InventoryStatsProps {
    products?: Product[]
    isLoading?: boolean
}

export function InventoryStats({ products = [], isLoading }: InventoryStatsProps) {
    const total = products.length
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length
    const outOfStock = products.filter((p) => p.stock === 0).length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-obsidian-card rounded-2xl border border-border shadow-none p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Package size={18} className="text-emerald-400" />
                </div>
                <div className="flex flex-col">
                    <div className="text-[10px] font-black uppercase tracking-widest text-content-muted">Total de Produtos</div>
                    <div className="text-2xl font-black text-content-primary">{isLoading ? "—" : total}</div>
                </div>
            </div>
            <div className="bg-obsidian-card rounded-2xl border border-border shadow-none p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-amber-400" />
                </div>
                <div className="flex flex-col">
                    <div className="text-[10px] font-black uppercase tracking-widest text-content-muted">Estoque Baixo</div>
                    <div className="text-2xl font-black text-amber-400">{isLoading ? "—" : lowStock}</div>
                </div>
            </div>
            <div className="bg-obsidian-card rounded-2xl border border-border shadow-none p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <XCircle size={18} className="text-red-400" />
                </div>
                <div className="flex flex-col">
                    <div className="text-[10px] font-black uppercase tracking-widest text-content-muted">Esgotados</div>
                    <div className="text-2xl font-black text-red-400">{isLoading ? "—" : outOfStock}</div>
                </div>
            </div>
        </div>
    )
}
