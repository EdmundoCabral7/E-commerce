"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSales, useUpdateSaleStatus } from "@/lib/hooks/useSales"
import { Sale } from "@/lib/api/sales-service"
import { SaleDetailsModal } from "@/components/sales/SaleDetailsModal"
import { cn } from "@/lib/utils"

const COLUMNS = [
    { id: "PENDING",   label: "Pendente",  color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { id: "PAID",      label: "Pago",      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { id: "SHIPPED",   label: "Enviado",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { id: "DELIVERED", label: "Entregue",  color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    { id: "CANCELED",  label: "Cancelado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
]

function formatPrice(val: number | string) {
    return `R$ ${Number(val).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
}

interface SaleCardProps {
    sale: Sale
    onDragStart: (saleId: string) => void
}

function SaleCard({ sale, onDragStart }: SaleCardProps) {
    const compat = {
        id: sale.id,
        produto: sale.items?.[0]?.productName ?? "Pedido",
        data: new Date(sale.createdAt).toLocaleDateString("pt-BR"),
        preco: typeof sale.total === "string" ? parseFloat(sale.total) : sale.total,
        usuario: sale.buyerName,
        status: sale.status?.toLowerCase(),
        formaEntrega: sale.paymentMethod ?? "—",
    }

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move"
                onDragStart(sale.id)
            }}
            className="bg-obsidian-nav border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-gold/30 transition-colors cursor-grab active:cursor-grabbing active:opacity-50 active:scale-95"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="text-sm font-black text-content-primary truncate">{sale.buyerName}</div>
                    <div className="text-[10px] text-content-muted truncate">{sale.buyerEmail}</div>
                </div>
                <SaleDetailsModal sale={compat} />
            </div>

            <div className="text-xs text-content-muted font-medium truncate">
                {compat.produto}
                {(sale.items?.length ?? 0) > 1 && (
                    <span className="text-content-muted/60"> +{sale.items!.length - 1} itens</span>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm font-black text-gold">{formatPrice(sale.total)}</div>
                <div className="text-[10px] text-content-muted">{compat.data}</div>
            </div>

            {sale.paymentMethod && (
                <div className="text-[10px] text-content-muted/60 uppercase tracking-widest font-bold border-t border-border/50 pt-2">
                    {sale.paymentMethod}
                </div>
            )}
        </div>
    )
}

export function SalesKanban() {
    const [search, setSearch] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [dragOverCol, setDragOverCol] = useState<string | null>(null)
    const draggingId = useRef<string | null>(null)

    const { data, isLoading } = useSales({ limit: 200 })
    const { mutate: updateStatus } = useUpdateSaleStatus()
    const allSales = data?.items ?? []

    const filtered = allSales.filter((s) => {
        const matchSearch = !search ||
            s.buyerName.toLowerCase().includes(search.toLowerCase()) ||
            s.buyerEmail.toLowerCase().includes(search.toLowerCase())
        const matchStart = !startDate || new Date(s.createdAt) >= new Date(startDate)
        const matchEnd = !endDate || new Date(s.createdAt) <= new Date(endDate + "T23:59:59")
        return matchSearch && matchStart && matchEnd
    })

    const grouped = Object.fromEntries(
        COLUMNS.map((col) => [
            col.id,
            filtered.filter((s) => s.status?.toUpperCase() === col.id),
        ])
    )

    const clearFilters = () => {
        setSearch("")
        setStartDate("")
        setEndDate("")
    }

    const handleDrop = (targetColId: string) => {
        if (!draggingId.current) return
        const sale = allSales.find((s) => s.id === draggingId.current)
        if (!sale || sale.status?.toUpperCase() === targetColId) return
        updateStatus({ saleId: draggingId.current, status: targetColId })
        draggingId.current = null
        setDragOverCol(null)
    }

    return (
        <div className="flex flex-col w-full gap-5">

            <div className="bg-obsidian-card border border-border rounded-2xl p-4 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex items-center justify-between gap-3 min-w-max w-full">
                    <div className="flex items-center gap-2">
                        <div className="text-[11px] font-black text-content-muted uppercase tracking-widest whitespace-nowrap">Cliente</div>
                        <Input
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[160px] h-9 bg-obsidian-nav border-border rounded-full text-sm text-content-primary placeholder:text-content-muted/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[11px] font-black text-content-muted uppercase tracking-widest whitespace-nowrap">De</div>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-[140px] h-9 bg-obsidian-nav border-border rounded-full text-sm text-content-primary"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[11px] font-black text-content-muted uppercase tracking-widest whitespace-nowrap">Até</div>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-[140px] h-9 bg-obsidian-nav border-border rounded-full text-sm text-content-primary"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-9 px-4 text-content-muted hover:text-red-400 hover:bg-red-500/10 rounded-full font-bold text-sm shrink-0"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Limpar
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-20 text-content-muted">Carregando vendas...</div>
            )}

            {!isLoading && (
                <div className="flex overflow-x-auto gap-5 pb-4 w-full">
                    {COLUMNS.map((col) => {
                        const sales = grouped[col.id] ?? []
                        const isOver = dragOverCol === col.id
                        return (
                            <div
                                key={col.id}
                                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id) }}
                                onDragLeave={() => setDragOverCol(null)}
                                onDrop={() => handleDrop(col.id)}
                                className={cn(
                                    "flex flex-col flex-1 min-w-[270px] rounded-2xl border transition-colors duration-150",
                                    isOver
                                        ? "bg-gold/5 border-gold/40"
                                        : "bg-obsidian-card border-border"
                                )}
                                style={{ height: "calc(100vh - 360px)", minHeight: "420px" }}
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full border ${col.color}`} />
                                        <div className="font-black text-content-primary text-sm tracking-wide">{col.label}</div>
                                    </div>
                                    <div className={`flex items-center justify-center min-w-[22px] h-6 px-2 rounded-full text-[11px] font-bold border ${col.color}`}>
                                        {sales.length}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 p-3 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {sales.length === 0 ? (
                                        <div className={cn(
                                            "flex flex-col items-center justify-center flex-1 rounded-xl border-2 border-dashed transition-colors",
                                            isOver ? "border-gold/40 text-gold/50" : "border-border/30 text-content-muted/40"
                                        )}>
                                            <div className="text-xs font-bold">
                                                {isOver ? "Soltar aqui" : "Nenhum pedido"}
                                            </div>
                                        </div>
                                    ) : (
                                        sales.map((sale) => (
                                            <SaleCard
                                                key={sale.id}
                                                sale={sale}
                                                onDragStart={(id) => { draggingId.current = id }}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
