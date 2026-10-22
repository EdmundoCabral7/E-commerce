"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, MoreVertical, Edit2, ListFilter, ChevronDown, Check, Search } from "lucide-react"
import { InventoryItem } from "@/lib/utils/inventoryData"
import { useState, useMemo } from "react"
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface InventoryListProps {
    items: InventoryItem[]
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

const STATUS_OPTIONS = [
    { value: "em_estoque", label: "Em Estoque" },
    { value: "estoque_baixo", label: "Estoque Baixo" },
    { value: "esgotado", label: "Esgotado" },
] as const

export function InventoryList({ items, onEdit, onDelete }: InventoryListProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatuses, setFilterStatuses] = useState<string[]>([])
    const [filterCategorias, setFilterCategorias] = useState<string[]>([])

    const uniqueCategorias = useMemo(
        () => [...new Set(items.map((i) => i.categoria).filter(Boolean))].sort(),
        [items]
    )

    const toggleStatus = (v: string) =>
        setFilterStatuses((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v])

    const toggleCategoria = (v: string) =>
        setFilterCategorias((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v])

    const clearFilters = () => { setFilterStatuses([]); setFilterCategorias([]) }
    const activeFiltersCount = filterStatuses.length + filterCategorias.length

    const filtered = useMemo(() => items.filter((item) => {
        if (searchTerm && !item.nome.toLowerCase().includes(searchTerm.toLowerCase()) && !item.categoria.toLowerCase().includes(searchTerm.toLowerCase())) return false
        if (filterStatuses.length > 0 && !filterStatuses.includes(item.status)) return false
        if (filterCategorias.length > 0 && !filterCategorias.includes(item.categoria)) return false
        return true
    }), [items, searchTerm, filterStatuses, filterCategorias])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Filtrar produtos por nome ou categoria..."
                        className="pl-9 w-full bg-obsidian-nav border-border rounded-full text-content-primary placeholder:text-content-muted/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
                        {uniqueCategorias.length > 0 && (
                            <>
                                <DropdownMenuSeparator className="bg-border my-2" />
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Categoria</DropdownMenuLabel>
                                    {uniqueCategorias.map((cat) => (
                                        <DropdownMenuItem key={cat} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => toggleCategoria(cat)}>
                                            {cat}
                                            {filterCategorias.includes(cat) && <Check className="h-3.5 w-3.5 text-gold" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </>
                        )}
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

            <div className="hidden md:block bg-obsidian-card rounded-2xl border border-border shadow-none overflow-hidden">
                <div className="relative w-full overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
                                <TableHead className="py-4 px-6 whitespace-nowrap">Produto</TableHead>
                                <TableHead className="py-4 px-6 whitespace-nowrap">Categoria</TableHead>
                                <TableHead className="py-4 px-6 whitespace-nowrap">Preço</TableHead>
                                <TableHead className="py-4 px-6 whitespace-nowrap">Estoque</TableHead>
                                <TableHead className="py-4 px-6 text-center whitespace-nowrap">Status</TableHead>
                                <TableHead className="py-4 px-6 text-right whitespace-nowrap">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedItems.map((product) => (
                                <TableRow key={product.id} className="hover:bg-obsidian-hover transition-colors border-b border-border last:border-0">
                                    <TableCell className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-muted rounded-lg shrink-0" />
                                            <div className="text-sm font-bold text-content-primary">{product.nome}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-sm text-content-muted font-medium whitespace-nowrap">{product.categoria}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm font-bold text-gold whitespace-nowrap">{product.preco}</TableCell>
                                    <TableCell className="py-4 px-6 text-sm text-content-primary font-medium whitespace-nowrap">{product.estoque} un</TableCell>
                                    <TableCell className="py-4 px-6 text-center whitespace-nowrap">
                                        <div className="flex justify-center">
                                            {product.status === "em_estoque" && (
                                                <div className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 w-fit">Em Estoque</div>
                                            )}
                                            {product.status === "estoque_baixo" && (
                                                <div className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 w-fit">Estoque Baixo</div>
                                            )}
                                            {product.status === "esgotado" && (
                                                <div className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 w-fit">Esgotado</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-gold rounded-full transition-colors" onClick={() => onEdit?.(product.id)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-red-500 rounded-full transition-colors" onClick={() => setDeletingId(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:hidden">
                {paginatedItems.map((product) => (
                    <div key={product.id} className="bg-obsidian-card border border-border rounded-xl p-5 relative flex flex-col gap-3">
                        <div className="absolute top-4 right-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-9 w-9 rounded-full text-content-muted hover:bg-obsidian-hover hover:text-gold transition-all border border-transparent hover:border-border/50"
                                )}>
                                    <MoreVertical className="h-5 w-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-obsidian-nav border-border rounded-xl p-1.5 shadow-2xl">
                                    <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-obsidian-hover focus:text-gold transition-colors cursor-pointer" onClick={() => onEdit?.(product.id)}>
                                        <Edit2 className="h-4 w-4" />
                                        Editar Produto
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-red-500/10 focus:text-red-500 transition-colors cursor-pointer" onClick={() => setDeletingId(product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        Remover Item
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>


                        <div className="flex items-center gap-4 pr-10">
                            <div className="w-12 h-12 bg-muted rounded-xl shrink-0" />
                            <div className="flex flex-col gap-0.5">
                                <div className="text-base font-black text-content-primary leading-tight">{product.nome}</div>
                                <div className="text-[11px] font-bold text-gold uppercase tracking-wider">{product.categoria}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                            <div className="flex flex-col gap-1">
                                <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Preço</div>
                                <div className="text-base font-black text-content-primary">{product.preco}</div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Estoque</div>
                                <div className="text-base font-bold text-content-primary">{product.estoque} unidades</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                            {product.status === "em_estoque" && (
                                <div className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Em Estoque</div>
                            )}
                            {product.status === "estoque_baixo" && (
                                <div className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Estoque Baixo</div>
                            )}
                            {product.status === "esgotado" && (
                                <div className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Esgotado</div>
                            )}
                        </div>
                    </div>
                ))}
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
            <ConfirmDialog
                open={!!deletingId}
                onOpenChange={(o) => !o && setDeletingId(null)}
                title="Excluir produto"
                description="Esse produto será removido permanentemente do inventário. Deseja continuar?"
                onConfirm={() => { onDelete?.(deletingId!); setDeletingId(null); }}
            />
        </div>
    )
}

