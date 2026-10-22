"use client";

import { AddRegionModal } from "./AddRegionModal";
import { Bike, Package, Zap, MapPin, Edit2, Trash2, Search, ListFilter, ChevronDown, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/admin/shared/DataTablePagination";
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useDeliveryRegions, useDeleteDeliveryRegion } from "@/lib/hooks/useDelivery";
import { DeliveryRegion } from "@/lib/api/delivery-service";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

function formatCurrency(value: number | string): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
}

function TipoIcon({ tipo }: { tipo: string }) {
    if (tipo === "Motoboy") return <Bike className="w-4 h-4 text-orange-400" />;
    if (tipo === "Correios") return <Package className="w-4 h-4 text-blue-400" />;
    if (tipo === "Express") return <Zap className="w-4 h-4 text-gold" />;
    return null;
}

const TIPOS = ["Motoboy", "Correios", "Express"] as const;

export function DeliveryOptions() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [editTarget, setEditTarget] = useState<DeliveryRegion | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filterTipos, setFilterTipos] = useState<string[]>([]);
    const [filterCidades, setFilterCidades] = useState<string[]>([]);

    const { data: regions = [], isLoading } = useDeliveryRegions();
    const { mutate: deleteRegion, isPending: isDeleting } = useDeleteDeliveryRegion();

    const uniqueCidades = useMemo(
        () => [...new Set(regions.map((r) => r.cidade))].sort(),
        [regions]
    );

    const activeFiltersCount = filterTipos.length + filterCidades.length;

    const toggleTipo = (tipo: string) =>
        setFilterTipos((prev) =>
            prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
        );

    const toggleCidade = (cidade: string) =>
        setFilterCidades((prev) =>
            prev.includes(cidade) ? prev.filter((c) => c !== cidade) : [...prev, cidade]
        );

    const clearFilters = () => { setFilterTipos([]); setFilterCidades([]); };

    const handleDelete = () => {
        if (!deletingId) return;
        deleteRegion(deletingId, {
            onSuccess: () => { toast.success("Região removida"); setDeletingId(null); },
            onError: () => { toast.error("Erro ao remover região"); setDeletingId(null); },
        });
    };

    const filtered = regions.filter((item) => {
        const matchesSearch =
            item.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.regiao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = filterTipos.length === 0 || filterTipos.includes(item.tipo);
        const matchesCidade = filterCidades.length === 0 || filterCidades.includes(item.cidade);
        return matchesSearch && matchesTipo && matchesCidade;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex flex-col gap-1">
                    <div className="text-2xl font-black tracking-tight text-content-primary sm:text-4xl font-heading break-words leading-tight">
                        Opções de Entrega
                    </div>
                    <div className="text-sm text-content-muted font-medium">
                        Gerencie as taxas de frete por região e modalidade.
                    </div>
                </div>
                <div className="flex shrink-0">
                    <AddRegionModal editTarget={editTarget} onClose={() => setEditTarget(null)} />
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Filtrar por região..."
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
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-gold text-obsidian-nav text-[9px] font-black flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 bg-obsidian-nav border-border rounded-xl p-2 shadow-2xl">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Tipo de Entrega</DropdownMenuLabel>
                                    {TIPOS.map((tipo) => (
                                        <DropdownMenuItem
                                            key={tipo}
                                            onSelect={(e) => { e.preventDefault(); toggleTipo(tipo); }}
                                            className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 focus:bg-obsidian-hover"
                                        >
                                            <div className={cn("size-4 rounded border flex items-center justify-center shrink-0 transition-colors", filterTipos.includes(tipo) ? "bg-gold border-gold" : "border-border")}>
                                                {filterTipos.includes(tipo) && <span className="text-obsidian-nav text-[10px] font-black">✓</span>}
                                            </div>
                                            <TipoIcon tipo={tipo} />
                                            <span className="text-sm font-medium text-content-primary">{tipo}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>

                                {uniqueCidades.length > 0 && (
                                    <>
                                        <DropdownMenuSeparator className="bg-border my-2" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-content-muted px-2 pb-1">Cidade</DropdownMenuLabel>
                                            {uniqueCidades.map((cidade) => (
                                                <DropdownMenuItem
                                                    key={cidade}
                                                    onSelect={(e) => { e.preventDefault(); toggleCidade(cidade); }}
                                                    className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 focus:bg-obsidian-hover"
                                                >
                                                    <div className={cn("size-4 rounded border flex items-center justify-center shrink-0 transition-colors", filterCidades.includes(cidade) ? "bg-gold border-gold" : "border-border")}>
                                                        {filterCidades.includes(cidade) && <span className="text-obsidian-nav text-[10px] font-black">✓</span>}
                                                    </div>
                                                    <MapPin className="w-3.5 h-3.5 text-content-muted shrink-0" />
                                                    <span className="text-sm font-medium text-content-primary truncate">{cidade}</span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuGroup>
                                    </>
                                )}

                                {activeFiltersCount > 0 && (
                                    <>
                                        <DropdownMenuSeparator className="bg-border my-2" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                onSelect={(e) => { e.preventDefault(); clearFilters(); }}
                                                className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                                            >
                                                <X className="w-4 h-4" />
                                                <span className="text-sm font-bold">Limpar filtros</span>
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
                            <TableHeader className="bg-obsidian-nav/30 border-b border-border">
                                <TableRow className="hover:bg-transparent border-border">
                                    <TableHead className="px-6 py-4 whitespace-nowrap">Cidade</TableHead>
                                    <TableHead className="px-6 py-4 whitespace-nowrap">Região</TableHead>
                                    <TableHead className="px-6 py-4 text-center whitespace-nowrap">Entrega</TableHead>
                                    <TableHead className="px-6 py-4 text-center whitespace-nowrap">Preço</TableHead>
                                    <TableHead className="px-6 py-4 text-right whitespace-nowrap">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-xs text-content-muted py-8">Carregando...</TableCell>
                                    </TableRow>
                                ) : paginated.map((item) => (
                                    <TableRow key={item.id} className="border-b border-border hover:bg-obsidian-hover transition-colors last:border-0">
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-border text-content-muted shrink-0">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <div className="font-bold text-content-primary text-[15px] truncate shrink">{item.cidade}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-content-muted text-[14px]">{item.regiao}</div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <TipoIcon tipo={item.tipo} />
                                                <span className="font-bold text-content-primary text-[14px]">{item.tipo}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="font-bold text-gold text-[15px]">{formatCurrency(item.preco)}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-gold rounded-full transition-colors" onClick={() => setEditTarget(item)}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-content-muted hover:text-red-500 rounded-full transition-colors" onClick={() => setDeletingId(item.id)}>
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
                    {paginated.map((item) => (
                        <div key={item.id} className="bg-obsidian-card border border-border rounded-xl p-5 relative flex flex-col gap-3">
                            <div className="absolute top-4 right-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "h-9 w-9 rounded-full text-content-muted hover:bg-obsidian-hover hover:text-gold transition-all border border-transparent hover:border-border/50"
                                    )}>
                                        <MoreVertical className="h-5 w-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 bg-obsidian-nav border-border rounded-xl p-1.5 shadow-2xl">
                                        <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-obsidian-hover focus:text-gold transition-colors cursor-pointer" onClick={() => setEditTarget(item)}>
                                            <Edit2 className="h-4 w-4" />
                                            Editar Região
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="flex items-center gap-2 font-bold text-sm py-2.5 px-3 rounded-lg focus:bg-red-500/10 focus:text-red-500 transition-colors cursor-pointer" onClick={() => setDeletingId(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            Remover Região
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex flex-col gap-1 pr-10">
                                <div className="text-base font-black text-content-primary leading-tight">{item.cidade}</div>
                                <div className="text-[11px] font-bold text-content-muted uppercase tracking-wider">{item.regiao}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                                <div className="flex flex-col gap-1">
                                    <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Tipo de Entrega</div>
                                    <div className="flex items-center gap-2">
                                        <TipoIcon tipo={item.tipo} />
                                        <span className="text-sm font-bold text-content-primary">{item.tipo}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">Taxa de Frete</div>
                                    <div className="text-base font-black text-gold">{formatCurrency(item.preco)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!isLoading && filtered.length === 0 && (
                    <div className="flex items-center justify-center py-10 bg-obsidian-card rounded-3xl border border-border">
                        <span className="text-content-muted font-medium">Nenhuma região encontrada.</span>
                    </div>
                )}

                <DataTablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(val) => {
                        setItemsPerPage(val);
                        setCurrentPage(1);
                    }}
                />
            </div>
            <ConfirmDialog
                open={!!deletingId}
                onOpenChange={(o) => !o && setDeletingId(null)}
                title="Excluir região"
                description="Essa região de entrega será removida permanentemente. Deseja continuar?"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
