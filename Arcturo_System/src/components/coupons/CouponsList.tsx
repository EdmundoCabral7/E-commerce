"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, MoreVertical, ListFilter, ChevronDown, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePromotions, useDeletePromotion } from "@/lib/hooks/usePromotions";
import { Promotion } from "@/lib/api/promotion-service";
import { CouponFormModal } from "./CouponFormModal";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR");

const isExpired = (p: Promotion) =>
    !p.isActive || new Date(p.endDate) < new Date();

const STATUS_FILTER_OPTIONS = [
    { value: "ativa", label: "Ativa" },
    { value: "expirada", label: "Expirada" },
] as const

const TYPE_OPTIONS = [
    { value: "PERCENTAGE", label: "Porcentagem" },
    { value: "FIXED", label: "Valor Fixo" },
] as const

export function CouponsList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
    const [filterTypes, setFilterTypes] = useState<string[]>([]);

    const { data: promotions = [], isLoading } = usePromotions();
    const { mutateAsync: del, isPending: isDeleting } = useDeletePromotion();

    const toggleStatus = (v: string) =>
        setFilterStatuses((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v]);

    const toggleType = (v: string) =>
        setFilterTypes((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v]);

    const clearFilters = () => { setFilterStatuses([]); setFilterTypes([]); };
    const activeFiltersCount = filterStatuses.length + filterTypes.length;

    const filtered = useMemo(() => promotions.filter((p) => {
        if (!p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (filterStatuses.length > 0) {
            const expired = isExpired(p);
            if (filterStatuses.includes("ativa") && expired) return false;
            if (filterStatuses.includes("expirada") && !expired) return false;
        }
        if (filterTypes.length > 0 && !filterTypes.includes(p.type)) return false;
        return true;
    }), [promotions, searchTerm, filterStatuses, filterTypes]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await del(deletingId);
            toast.success("Promoção removida");
        } catch {
            toast.error("Erro ao remover promoção");
        } finally {
            setDeletingId(null);
        }
    };

    const statusBadge = (p: Promotion) =>
        isExpired(p)
            ? <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-bold border-0 bg-red-500/10 text-red-400">Expirada</Badge>
            : <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-bold border-0 bg-emerald-500/10 text-emerald-400">Ativa</Badge>;

    const formatValue = (p: Promotion) =>
        p.type === "PERCENTAGE" ? `${p.value}%` : `R$ ${Number(p.value).toFixed(2)}`;

    if (isLoading) {
        return <div className="text-content-muted text-sm py-10 text-center">Carregando promoções...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Filtrar promoções..."
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
                                {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
                                    <DropdownMenuItem key={value} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => toggleStatus(value)}>
                                        {label}
                                        {filterStatuses.includes(value) && <Check className="h-3.5 w-3.5 text-gold" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-border my-2" />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Tipo</DropdownMenuLabel>
                                {TYPE_OPTIONS.map(({ value, label }) => (
                                    <DropdownMenuItem key={value} className="flex items-center justify-between font-medium text-sm py-2 px-2 rounded-lg focus:bg-obsidian-hover cursor-pointer" onClick={() => toggleType(value)}>
                                        {label}
                                        {filterTypes.includes(value) && <Check className="h-3.5 w-3.5 text-gold" />}
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
                                <TableHead className="px-6 py-4">Nome</TableHead>
                                <TableHead className="px-6 py-4">Tipo</TableHead>
                                <TableHead className="px-6 py-4">Valor</TableHead>
                                <TableHead className="px-6 py-4">Início</TableHead>
                                <TableHead className="px-6 py-4">Fim</TableHead>
                                <TableHead className="px-6 py-4 text-right">Status</TableHead>
                                <TableHead className="px-6 py-4 text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-content-muted py-10">
                                        Nenhuma promoção encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : paginated.map((p) => (
                                <TableRow key={p.id} className="border-b border-border hover:bg-obsidian-hover transition-colors last:border-0">
                                    <TableCell className="font-bold text-content-primary px-6 py-4">{p.name}</TableCell>
                                    <TableCell className="text-content-muted px-6 py-4 font-medium">
                                        {p.type === "PERCENTAGE" ? "Porcentagem" : "Valor Fixo"}
                                    </TableCell>
                                    <TableCell className="text-gold px-6 py-4 font-bold">{formatValue(p)}</TableCell>
                                    <TableCell className="text-content-muted px-6 py-4">{formatDate(p.startDate)}</TableCell>
                                    <TableCell className="text-content-muted px-6 py-4">{formatDate(p.endDate)}</TableCell>
                                    <TableCell className="text-right px-6 py-4">{statusBadge(p)}</TableCell>
                                    <TableCell className="text-right px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-content-muted hover:text-gold rounded-full"
                                                onClick={() => setEditingPromotion(p)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-content-muted hover:text-red-500 rounded-full"
                                                onClick={() => setDeletingId(p.id)}
                                            >
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
                {paginated.map((p) => (
                    <div key={p.id} className="bg-obsidian-card border border-border rounded-xl p-5 relative flex flex-col gap-3">
                        <div className="absolute top-4 right-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-9 w-9 rounded-full text-content-muted hover:bg-obsidian-hover"
                                )}>
                                    <MoreVertical className="h-5 w-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-obsidian-nav border-border rounded-xl p-1.5">
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg cursor-pointer focus:bg-obsidian-hover focus:text-gold"
                                        onClick={() => setEditingPromotion(p)}
                                    >
                                        <Pencil className="h-4 w-4" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg cursor-pointer focus:bg-red-500/10 focus:text-red-500"
                                        onClick={() => setDeletingId(p.id)}
                                    >
                                        <Trash2 className="h-4 w-4" /> Remover
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex flex-col gap-1 pr-10">
                            <div className="text-base font-black text-content-primary">{p.name}</div>
                            <div className="text-[11px] font-bold text-gold uppercase tracking-wider">
                                {p.type === "PERCENTAGE" ? "Porcentagem" : "Valor Fixo"}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                            <div>
                                <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Desconto</div>
                                <div className="text-base font-black text-content-primary">{formatValue(p)}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Válido até</div>
                                <div className="text-sm font-bold text-content-primary">{formatDate(p.endDate)}</div>
                            </div>
                        </div>

                        <div>{statusBadge(p)}</div>
                    </div>
                ))}
            </div>

            <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />

            {editingPromotion && (
                <CouponFormModal
                    editing={editingPromotion}
                    onClose={() => setEditingPromotion(null)}
                />
            )}
            <ConfirmDialog
                open={!!deletingId}
                onOpenChange={(o) => !o && setDeletingId(null)}
                title="Excluir promoção"
                description="Essa promoção será removida permanentemente. Deseja continuar?"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
