"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ListFilter, Check } from "lucide-react"
import { SaleDetailsModal } from "@/components/sales/SaleDetailsModal"
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye } from "lucide-react"
import { useSales } from "@/lib/hooks/useSales"
import { Sale } from "@/lib/api/sales-service"

function statusColor(status: string) {
    const s = status?.toLowerCase()
    if (s === "paid" || s === "pago") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    if (s === "pending" || s === "pendente") return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    return "bg-red-500/10 text-red-400 border-red-500/20"
}

function formatStatus(status: string) {
    const map: Record<string, string> = { paid: "Pago", pending: "Pendente", cancelled: "Cancelado", pago: "Pago", pendente: "Pendente" }
    return map[status?.toLowerCase()] ?? status
}

const STATUS_OPTIONS = [
    { value: "paid", label: "Pago" },
    { value: "pending", label: "Pendente" },
    { value: "cancelled", label: "Cancelado" },
] as const

const PAYMENT_OPTIONS = [
    { value: "credit_card", label: "Cartão de Crédito" },
    { value: "pix", label: "Pix" },
    { value: "boleto", label: "Boleto" },
] as const

export function SalesList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [filterStatuses, setFilterStatuses] = useState<string[]>([])
    const [filterPayments, setFilterPayments] = useState<string[]>([])

    const { data, isLoading } = useSales({ page: currentPage, limit: itemsPerPage })
    const allSales = data?.items ?? []
    const totalCount = data?.meta?.total ?? 0

    const toggleStatus = (v: string) =>
        setFilterStatuses((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v])

    const togglePayment = (v: string) =>
        setFilterPayments((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v])

    const clearFilters = () => { setFilterStatuses([]); setFilterPayments([]) }
    const activeFiltersCount = filterStatuses.length + filterPayments.length

    const filteredSales = useMemo(() => allSales.filter((sale) => {
        const term = searchTerm.toLowerCase()
        if (term && !sale.buyerName.toLowerCase().includes(term) && !sale.buyerEmail.toLowerCase().includes(term)) return false
        if (filterStatuses.length > 0 && !filterStatuses.includes(sale.status?.toLowerCase())) return false
        if (filterPayments.length > 0 && !filterPayments.includes(sale.paymentMethod?.toLowerCase())) return false
        return true
    }), [allSales, searchTerm, filterStatuses, filterPayments])

    const totalPages = Math.ceil(totalCount / itemsPerPage)

    const toCompatSale = (sale: Sale) => ({
        id: sale.id,
        produto: sale.items?.[0]?.productName ?? "Pedido",
        data: new Date(sale.createdAt).toLocaleDateString("pt-BR"),
        preco: typeof sale.total === "string" ? parseFloat(sale.total) : sale.total,
        usuario: sale.buyerName,
        status: formatStatus(sale.status).toLowerCase(),
        formaEntrega: sale.paymentMethod ?? "—",
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Filtrar por comprador..."
                        className="pl-9 w-full bg-obsidian-nav border-border rounded-full text-content-primary placeholder:text-content-muted/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-obsidian-card text-content-primary border border-border rounded-full hover:bg-obsidian-hover transition-colors">
                            <ListFilter className="h-4 w-4" />
                            Filtros
                            <ChevronDown className="h-4 w-4 opacity-50" />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-gold text-obsidian-nav text-[9px] font-black flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-obsidian-nav border-border rounded-xl p-2 shadow-2xl">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Status</DropdownMenuLabel>
                                {STATUS_OPTIONS.map(({ value, label }) => (
                                    <DropdownMenuItem key={value} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => toggleStatus(value)}>
                                        {label}
                                        {filterStatuses.includes(value) && <Check className="h-3.5 w-3.5 text-gold" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-border my-2" />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Pagamento</DropdownMenuLabel>
                                {PAYMENT_OPTIONS.map(({ value, label }) => (
                                    <DropdownMenuItem key={value} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => togglePayment(value)}>
                                        {label}
                                        {filterPayments.includes(value) && <Check className="h-3.5 w-3.5 text-gold" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            {activeFiltersCount > 0 && (
                                <>
                                    <DropdownMenuSeparator className="bg-border my-2" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="flex items-center justify-center font-bold text-sm py-2 px-2 rounded-lg focus:bg-red-500/10 focus:text-red-400 text-content-muted cursor-pointer" onClick={clearFilters}>
                                            Limpar filtros
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {isLoading && <div className="text-center py-10 text-content-muted">Carregando vendas...</div>}

            {!isLoading && (
                <>
                    <div className="hidden md:block rounded-xl border border-border bg-obsidian-card overflow-hidden shadow-none">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-obsidian-nav/30 hover:bg-obsidian-nav/30 border-b border-border">
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Comprador</TableHead>
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Data</TableHead>
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Total</TableHead>
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Pagamento</TableHead>
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Status</TableHead>
                                        <TableHead className="px-6 py-4 text-right whitespace-nowrap">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSales.map((sale) => {
                                        const compat = toCompatSale(sale)
                                        return (
                                            <TableRow key={sale.id} className="hover:bg-obsidian-hover border-b border-border transition-colors last:border-0">
                                                <TableCell className="px-6 py-4 font-medium text-content-primary whitespace-nowrap">
                                                    {sale.buyerName}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-content-muted font-medium whitespace-nowrap">
                                                    {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 font-bold text-gold whitespace-nowrap">
                                                    R$ {compat.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-content-muted font-medium whitespace-nowrap">
                                                    {sale.paymentMethod ?? "—"}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColor(sale.status)}`}>
                                                        {formatStatus(sale.status)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                                                    <SaleDetailsModal sale={compat} />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 md:hidden">
                        {filteredSales.map((sale) => {
                            const compat = toCompatSale(sale)
                            return (
                                <div key={sale.id} className="bg-obsidian-card border border-border rounded-xl p-5 relative flex flex-col gap-3">
                                    <div className="absolute top-4 right-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className={cn(
                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                                "h-9 w-9 rounded-full text-content-muted hover:bg-obsidian-hover hover:text-gold transition-all border border-transparent hover:border-border/50"
                                            )}>
                                                <MoreVertical className="h-5 w-5" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-obsidian-nav border-border rounded-xl p-1.5 shadow-2xl">
                                                <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-obsidian-hover focus:text-gold transition-colors cursor-pointer">
                                                    <Eye className="h-4 w-4" />
                                                    Ver Detalhes
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex flex-col gap-1 pr-10">
                                        <div className="text-base font-black text-content-primary leading-tight">{sale.buyerName}</div>
                                        <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">{sale.buyerEmail}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Valor</div>
                                            <div className="text-base font-black text-gold">R$ {compat.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Data</div>
                                            <div className="text-sm font-bold text-content-primary">{compat.data}</div>
                                        </div>
                                    </div>

                                    <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border w-fit ${statusColor(sale.status)}`}>
                                        {formatStatus(sale.status)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

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
                </>
            )}
        </div>
    )
}
