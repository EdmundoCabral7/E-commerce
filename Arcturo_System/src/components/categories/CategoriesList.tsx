"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, ListFilter, MoreVertical, Pencil, Trash2, Check } from "lucide-react"
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCategories, useDeleteCategory } from "@/lib/hooks/useProducts"
import { CategoryFormModal } from "./CategoryFormModal"
import { Category } from "@/lib/types/product"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

const DESCRICAO_OPTIONS = [
    { value: "com", label: "Com Descrição" },
    { value: "sem", label: "Sem Descrição" },
] as const

export function CategoriesList() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [filterDescricao, setFilterDescricao] = useState<string[]>([])

    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const { data: categories = [], isLoading } = useCategories()
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory()

    const handleDelete = async () => {
        if (!deletingId) return
        try {
            await deleteCategory(deletingId)
            toast.success("Categoria removida")
        } catch {
            toast.error("Erro ao remover categoria")
        } finally {
            setDeletingId(null)
        }
    }

    const toggleDescricao = (v: string) =>
        setFilterDescricao((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v])

    const clearFilters = () => setFilterDescricao([])
    const activeFiltersCount = filterDescricao.length

    const filteredCategories = useMemo(() => categories.filter((c) => {
        if (!c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
        if (filterDescricao.length > 0) {
            const hasDesc = !!c.description
            if (filterDescricao.includes("com") && !hasDesc) return false
            if (filterDescricao.includes("sem") && hasDesc) return false
        }
        return true
    }), [categories, searchTerm, filterDescricao])

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Filtrar categorias..."
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
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Descrição</DropdownMenuLabel>
                                {DESCRICAO_OPTIONS.map(({ value, label }) => (
                                    <DropdownMenuItem key={value} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => toggleDescricao(value)}>
                                        {label}
                                        {filterDescricao.includes(value) && <Check className="h-3.5 w-3.5 text-gold" />}
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

            {isLoading && (
                <div className="text-center py-10 text-content-muted">Carregando categorias...</div>
            )}

            {!isLoading && (
                <>
                    <div className="hidden md:block rounded-3xl border border-border bg-obsidian-card shadow-none overflow-hidden">
                        <div className="w-full overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader className="bg-obsidian-nav/30 border-b border-border">
                                    <TableRow className="hover:bg-transparent border-border">
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Nome</TableHead>
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Descrição</TableHead>
                                        <TableHead className="px-6 py-4 whitespace-nowrap">Slug</TableHead>
                                        <TableHead className="px-6 py-4 text-right whitespace-nowrap">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCategories.map((category) => (
                                        <TableRow key={category.id} className="border-b border-border hover:bg-obsidian-hover transition-colors last:border-0">
                                            <TableCell className="font-bold text-content-primary px-6 py-4 whitespace-nowrap">
                                                {category.name}
                                            </TableCell>
                                            <TableCell className="text-content-muted px-6 py-4 max-w-[300px] truncate font-medium whitespace-nowrap">
                                                {category.description ?? "—"}
                                            </TableCell>
                                            <TableCell className="text-content-muted px-6 py-4 whitespace-nowrap font-mono text-xs">
                                                {category.slug}
                                            </TableCell>
                                            <TableCell className="text-right px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-gold rounded-full transition-colors" onClick={() => setEditingCategory(category)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-red-500 rounded-full transition-colors" onClick={() => setDeletingId(category.id)}>
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
                        {paginatedCategories.map((category) => (
                            <div key={category.id} className="bg-obsidian-card border border-border rounded-xl p-5 relative flex flex-col gap-3">
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={cn(
                                            buttonVariants({ variant: "ghost", size: "icon" }),
                                            "h-9 w-9 rounded-full text-content-muted hover:bg-obsidian-hover hover:text-gold transition-all border border-transparent hover:border-border/50"
                                        )}>
                                            <MoreVertical className="h-5 w-5" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-obsidian-nav border-border rounded-xl p-1.5 shadow-2xl">
                                            <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-obsidian-hover focus:text-gold transition-colors cursor-pointer" onClick={() => setEditingCategory(category)}>
                                                <Pencil className="h-4 w-4" />
                                                Editar Categoria
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-red-500/10 focus:text-red-500 transition-colors cursor-pointer" onClick={() => setDeletingId(category.id)}>
                                                <Trash2 className="h-4 w-4" />
                                                Remover Categoria
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex flex-col gap-1 pr-10">
                                    <div className="text-base font-black text-content-primary leading-tight">{category.name}</div>
                                    <div className="text-xs text-content-muted line-clamp-2">{category.description ?? "—"}</div>
                                </div>

                                <div className="text-[10px] font-mono text-content-muted py-2 border-t border-border/50">
                                    /{category.slug}
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
                </>
            )}
        {editingCategory && (
            <CategoryFormModal
                editing={editingCategory}
                onClose={() => setEditingCategory(null)}
            />
        )}
        <ConfirmDialog
            open={!!deletingId}
            onOpenChange={(o) => !o && setDeletingId(null)}
            title="Excluir categoria"
            description="Essa categoria será removida permanentemente. Deseja continuar?"
            onConfirm={handleDelete}
            isLoading={isDeleting}
        />
        </div>
    )
}
