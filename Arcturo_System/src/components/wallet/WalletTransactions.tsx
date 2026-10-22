"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination"
import { useWalletTransactions } from "@/lib/hooks/useWallet"

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    credit_card: "Cartão",
    pix: "Pix",
    boleto: "Boleto",
}

const STATUS_STYLES: Record<string, string> = {
    PAID: "bg-emerald-500/10 text-emerald-400",
    PENDING: "bg-amber-500/10 text-amber-400",
    CANCELED: "bg-red-500/10 text-red-400",
    SHIPPED: "bg-blue-500/10 text-blue-400",
    DELIVERED: "bg-emerald-500/10 text-emerald-400",
}

const STATUS_LABELS: Record<string, string> = {
    PAID: "aprovado",
    PENDING: "pendente",
    CANCELED: "cancelado",
    SHIPPED: "enviado",
    DELIVERED: "entregue",
}

function formatCurrency(value: number | string): string {
    return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR")
}

type Tab = "all" | "pending" | "canceled"

const TAB_FILTERS: Record<Tab, string[]> = {
    all: [],
    pending: ["PENDING"],
    canceled: ["CANCELED"],
}

export function WalletTransactions() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [activeTab, setActiveTab] = useState<Tab>("all")

    const { data, isLoading } = useWalletTransactions(currentPage, itemsPerPage)

    const allTransactions = data?.data ?? []
    const transactions = activeTab === "all"
        ? allTransactions
        : allTransactions.filter((t) => TAB_FILTERS[activeTab].includes(t.status))

    const total = data?.meta.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center bg-obsidian-card p-1 rounded-xl border border-border shadow-none">
                    <Button variant="ghost" onClick={() => handleTabChange("all")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors h-auto ${activeTab === "all" ? "text-obsidian-nav bg-gold shadow-none hover:bg-gold" : "text-content-muted hover:text-content-primary"}`}>Últimos Pedidos</Button>
                    <Button variant="ghost" onClick={() => handleTabChange("pending")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors h-auto ${activeTab === "pending" ? "text-obsidian-nav bg-gold shadow-none hover:bg-gold" : "text-content-muted hover:text-content-primary"}`}>Aprovação</Button>
                    <Button variant="ghost" onClick={() => handleTabChange("canceled")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors h-auto ${activeTab === "canceled" ? "text-obsidian-nav bg-gold shadow-none hover:bg-gold" : "text-content-muted hover:text-content-primary"}`}>Estornos</Button>
                </div>
                <Button variant="outline" className="flex items-center gap-2 px-4 py-2 bg-obsidian-card border-border rounded-xl text-xs font-bold text-content-primary shadow-none hover:bg-obsidian-hover h-auto">
                    <Calendar className="h-3 w-3 text-content-muted" />
                    {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </Button>
            </div>

            <div className="bg-obsidian-card border border-border rounded-2xl overflow-hidden shadow-none">
                <Table>
                    <TableHeader className="bg-muted/30 border-b border-border">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-6">Data</TableHead>
                            <TableHead className="px-6">Pedido / Descrição</TableHead>
                            <TableHead className="px-6">Pagamento</TableHead>
                            <TableHead className="px-6">Status</TableHead>
                            <TableHead className="px-6 text-right">Valor Líquido</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-xs text-content-muted py-8">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-xs text-content-muted py-8">
                                    Nenhuma transação encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((t) => (
                                <TableRow key={t.id} className="border-b border-border hover:bg-obsidian-hover transition-colors">
                                    <TableCell className="text-xs text-content-muted font-medium px-6 py-4">{formatDate(t.createdAt)}</TableCell>
                                    <TableCell className="text-xs font-bold text-content-primary px-6 py-4">
                                        Pedido #{t.id.slice(0, 8).toUpperCase()} — {t.items[0]?.product?.name ?? t.buyerName}
                                    </TableCell>
                                    <TableCell className="text-xs text-content-muted font-medium px-6 py-4">
                                        {PAYMENT_METHOD_LABELS[t.paymentMethod] ?? t.paymentMethod}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full w-fit ${STATUS_STYLES[t.status] ?? "bg-muted text-content-muted"}`}>
                                            {STATUS_LABELS[t.status] ?? t.status.toLowerCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-gold text-right px-6 py-4">
                                        {formatCurrency(t.total)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(val) => {
                        setItemsPerPage(val)
                        setCurrentPage(1)
                    }}
                />
            </div>
        </div>
    )
}
