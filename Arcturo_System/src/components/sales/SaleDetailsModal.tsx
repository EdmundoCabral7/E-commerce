"use client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogClose,
    DialogHeader,
    DialogDescription,
} from "@/components/ui/dialog"
import { Eye, User, Package, CreditCard } from "lucide-react"

interface SaleCompat {
    id: string
    produto: string
    data: string
    preco: number
    usuario: string
    status: string
    formaEntrega?: string
}

const statusStyle = (status: string) => {
    const s = status?.toLowerCase()
    if (s === "paid" || s === "pago") return "bg-emerald-500/10 text-emerald-400"
    if (s === "pending" || s === "pendente") return "bg-amber-500/10 text-amber-400"
    if (s === "shipped" || s === "enviado") return "bg-blue-500/10 text-blue-400"
    if (s === "delivered" || s === "entregue") return "bg-violet-500/10 text-violet-400"
    return "bg-red-500/10 text-red-400"
}

const statusLabel: Record<string, string> = {
    paid: "Pago", pago: "Pago",
    pending: "Pendente", pendente: "Pendente",
    shipped: "Enviado", enviado: "Enviado",
    delivered: "Entregue", entregue: "Entregue",
    canceled: "Cancelado", cancelado: "Cancelado",
}

export function SaleDetailsModal({ sale }: { sale: SaleCompat }) {
    return (
        <Dialog>
            <DialogTrigger className="h-8 w-8 text-content-muted hover:text-content-primary rounded-full transition-colors flex items-center justify-center bg-transparent border-none cursor-pointer shrink-0">
                <Eye className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md mx-auto p-0 overflow-hidden border-none shadow-none rounded-2xl bg-obsidian-card">
                <div className="p-5 sm:p-8 space-y-6">
                    <DialogHeader>
                        <div className="flex items-center justify-between mb-1">
                            <DialogTitle className="text-2xl font-black tracking-tight text-content-primary">
                                Detalhes da Venda
                            </DialogTitle>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle(sale.status)}`}>
                                {statusLabel[sale.status?.toLowerCase()] ?? sale.status}
                            </div>
                        </div>
                        <DialogDescription className="text-content-muted font-medium">
                            Pedido #{sale.id.slice(0, 8)} • {sale.data}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-obsidian-nav rounded-2xl border border-border gap-2">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-content-muted shrink-0" />
                                <span className="text-[11px] font-bold text-content-muted uppercase tracking-widest">Cliente</span>
                            </div>
                            <span className="text-sm font-bold text-content-primary text-right">{sale.usuario}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-obsidian-nav rounded-2xl border border-border gap-2">
                            <div className="flex items-center gap-3">
                                <Package className="h-4 w-4 text-content-muted shrink-0" />
                                <span className="text-[11px] font-bold text-content-muted uppercase tracking-widest">Produto</span>
                            </div>
                            <span className="text-sm font-bold text-content-primary text-right">{sale.produto}</span>
                        </div>

                        <div className="flex items-center justify-between p-5 bg-gold text-obsidian-nav rounded-2xl gap-2">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-obsidian-nav/50 shrink-0" />
                                <span className="text-[11px] font-bold text-obsidian-nav/60 uppercase tracking-widest">
                                    {sale.formaEntrega ?? "Pagamento"}
                                </span>
                            </div>
                            <span className="text-xl font-black">
                                R$ {sale.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <DialogClose className="w-full sm:w-auto h-11 rounded-full px-16 bg-obsidian-nav hover:bg-obsidian-hover text-content-primary text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 border border-border cursor-pointer flex items-center justify-center">
                            Fechar
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
