"use client"

import { AddMemberModal } from "./AddMemberModal"
import { useState, useMemo } from "react"
import { Users, ShoppingBag, DollarSign, Search, ListFilter, ChevronDown, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Mail, Trash2, Edit2 } from "lucide-react"
import { useTeamMembers, useTeamStats, useRemoveMember } from "@/lib/hooks/useTeam"
import { TeamMember } from "@/lib/api/team-service"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

const ROLE_LABELS: Record<string, string> = {
    OWNER: "Proprietário",
    ADMIN: "Administrador",
    STAFF: "Colaborador",
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR")
}

const ROLE_OPTIONS = [
    { value: "OWNER", label: "Proprietário" },
    { value: "ADMIN", label: "Administrador" },
    { value: "STAFF", label: "Colaborador" },
] as const

export function TeamManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [editTarget, setEditTarget] = useState<TeamMember | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [filterRoles, setFilterRoles] = useState<string[]>([])

    const { data: members = [], isLoading } = useTeamMembers()
    const { data: stats } = useTeamStats()
    const { mutate: removeMember, isPending: isDeleting } = useRemoveMember()

    const handleDelete = () => {
        if (!deletingId) return
        removeMember(deletingId, {
            onSuccess: () => { toast.success("Membro removido"); setDeletingId(null) },
            onError: () => { toast.error("Erro ao remover membro"); setDeletingId(null) },
        })
    }

    const toggleRole = (v: string) =>
        setFilterRoles((prev) => prev.includes(v) ? prev.filter((r) => r !== v) : [...prev, v])

    const clearFilters = () => setFilterRoles([])
    const activeFiltersCount = filterRoles.length

    const filtered = useMemo(() => members.filter((m) => {
        const term = searchTerm.toLowerCase()
        if (term && !(m.user.name ?? "").toLowerCase().includes(term) && !m.user.email.toLowerCase().includes(term)) return false
        if (filterRoles.length > 0 && !filterRoles.includes(m.role)) return false
        return true
    }), [members, searchTerm, filterRoles])

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex flex-col gap-1">
                    <div className="text-2xl font-black tracking-tight text-content-primary sm:text-4xl font-heading break-words leading-tight">
                        Gestão de Equipe
                    </div>
                    <div className="text-sm text-content-muted font-medium">
                        Visão consolidada do desempenho de todos os membros.
                    </div>
                </div>
                <div className="shrink-0 flex">
                    <AddMemberModal editTarget={editTarget} onClose={() => setEditTarget(null)} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                <div className="bg-obsidian-card border border-border rounded-2xl px-5 shadow-none flex flex-col justify-center gap-2.5 h-24 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                            <DollarSign className="h-4 w-4" />
                        </div>
                        <div className="text-[10px] font-black text-content-muted uppercase tracking-widest truncate">Receita Total</div>
                    </div>
                    <div className="text-2xl font-black text-content-primary tracking-tight truncate">
                        {stats ? formatCurrency(stats.totalRevenue) : "..."}
                    </div>
                </div>

                <div className="bg-obsidian-card border border-border rounded-2xl px-5 shadow-none flex flex-col justify-center gap-2.5 h-24 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-400 shrink-0">
                            <ShoppingBag className="h-4 w-4" />
                        </div>
                        <div className="text-[10px] font-black text-content-muted uppercase tracking-widest truncate">Pedidos Pagos</div>
                    </div>
                    <div className="text-2xl font-black text-content-primary tracking-tight truncate">
                        {stats ? stats.totalOrders.toLocaleString('pt-BR') : "..."}
                    </div>
                </div>

                <div className="bg-obsidian-card border border-border rounded-2xl px-5 shadow-none flex flex-col justify-center gap-2.5 h-24 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10 text-purple-400 shrink-0">
                            <Users className="h-4 w-4" />
                        </div>
                        <div className="text-[10px] font-black text-content-muted uppercase tracking-widest truncate">Total de Membros</div>
                    </div>
                    <div className="text-2xl font-black text-content-primary tracking-tight truncate">
                        {stats ? stats.memberCount : "..."}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Filtrar membros..."
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
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Cargo</DropdownMenuLabel>
                                    {ROLE_OPTIONS.map(({ value, label }) => (
                                        <DropdownMenuItem key={value} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => toggleRole(value)}>
                                            {label}
                                            {filterRoles.includes(value) && <Check className="h-3.5 w-3.5 text-gold" />}
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

                <div className="hidden md:block rounded-3xl border border-border bg-obsidian-card shadow-none overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader className="bg-muted/30 border-b border-border">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="px-6 py-4 whitespace-nowrap">Membro</TableHead>
                                    <TableHead className="px-6 py-4 text-center whitespace-nowrap">Cargo</TableHead>
                                    <TableHead className="px-6 py-4 text-center whitespace-nowrap">Desde</TableHead>
                                    <TableHead className="px-6 py-4 text-right whitespace-nowrap">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-xs text-content-muted py-8">Carregando...</TableCell>
                                    </TableRow>
                                ) : paginated.map((member) => (
                                    <TableRow key={member.id} className="border-b border-border hover:bg-obsidian-hover transition-colors last:border-0">
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col min-w-0 justify-center gap-0.5">
                                                <div className="font-bold text-content-primary text-[15px] truncate">{member.user.name ?? "—"}</div>
                                                <div className="text-[13px] font-medium text-content-muted truncate">{member.user.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                            <Badge variant="secondary" className={`${member.role === 'OWNER' ? 'bg-orange-500/10 text-orange-400' : 'bg-muted text-content-muted'} text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 border border-transparent`}>
                                                {ROLE_LABELS[member.role] ?? member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center text-xs text-content-muted font-medium whitespace-nowrap">
                                            {formatDate(member.createdAt)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-gold rounded-full transition-colors" onClick={() => setEditTarget(member)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-red-500 rounded-full transition-colors" onClick={() => setDeletingId(member.id)} disabled={member.role === "OWNER"}>
                                                    <Trash2 className="w-4 h-4" />
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
                    {paginated.map((member) => (
                        <div key={member.id} className="bg-obsidian-card border border-border rounded-xl p-5 relative flex flex-col gap-3">
                            <div className="absolute top-4 right-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "h-9 w-9 rounded-full text-content-muted hover:bg-obsidian-hover hover:text-gold transition-all border border-transparent hover:border-border/50"
                                    )}>
                                        <MoreVertical className="h-5 w-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-obsidian-nav border-border rounded-xl p-1.5 shadow-2xl">
                                        <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-obsidian-hover focus:text-gold transition-colors cursor-pointer" onClick={() => setEditTarget(member)}>
                                            <Edit2 className="h-4 w-4" />
                                            Editar Cargo
                                        </DropdownMenuItem>
                                        {member.role !== "OWNER" && (
                                            <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-red-500/10 focus:text-red-500 transition-colors cursor-pointer" onClick={() => setDeletingId(member.id)}>
                                                <Trash2 className="h-4 w-4" />
                                                Remover Membro
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex flex-col gap-1 pr-10">
                                <div className="flex items-center gap-2">
                                    <div className="text-base font-black text-content-primary leading-tight">{member.user.name ?? "—"}</div>
                                    <Badge variant="secondary" className={`${member.role === 'OWNER' ? 'bg-orange-500/10 text-orange-400' : 'bg-muted text-content-muted'} text-[8px] uppercase font-bold tracking-widest px-1.5 py-0 border border-transparent`}>
                                        {ROLE_LABELS[member.role] ?? member.role}
                                    </Badge>
                                </div>
                                <div className="text-[11px] font-bold text-content-muted">{member.user.email}</div>
                            </div>

                            <div className="py-2 border-t border-border/50">
                                <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Membro desde</div>
                                <div className="text-sm font-bold text-content-primary mt-1">{formatDate(member.createdAt)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {!isLoading && filtered.length === 0 && (
                    <div className="flex items-center justify-center py-10 bg-obsidian-card rounded-3xl border border-border">
                        <span className="text-content-muted font-medium">Nenhum membro encontrado.</span>
                    </div>
                )}

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
            <ConfirmDialog
                open={!!deletingId}
                onOpenChange={(o) => !o && setDeletingId(null)}
                title="Remover membro"
                description="Esse membro perderá o acesso ao painel. Deseja continuar?"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    )
}
