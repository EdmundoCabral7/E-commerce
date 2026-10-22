"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Store, Package, ShieldCheck, Trophy, Heart, Search, Filter } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/lib/hooks/useProducts";
import { useOrgProfile } from "@/lib/hooks/useOrg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STORE_CATEGORIES } from "@/lib/utils/store-constants";

export function StoreContent({ id }: { id: string }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const { data: profile, isLoading: profileLoading } = useOrgProfile(id);
    const { data, isLoading } = useProducts({ organizationId: id, limit: 100 });
    const allProducts = data?.items ?? [];

    const filteredProducts = useMemo(() => {
        return allProducts.filter((product) => {
            const name = product.name ?? product.title ?? "";
            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "Todos" || name.toLowerCase().includes(selectedCategory.toLowerCase());
            return matchesSearch && matchesCategory;
        });
    }, [allProducts, searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-obsidian-page pb-20">
            <div className="bg-obsidian-card border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="size-20 md:size-24 rounded-2xl bg-obsidian-nav border border-border flex items-center justify-center text-gold shadow-2xl">
                                <Store className="size-10 md:size-12" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl md:text-4xl font-black text-content-primary tracking-tight">
                                        {profileLoading ? "..." : (profile?.name ?? "Loja")}
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        <CheckCircle2 className="size-6 text-gold fill-gold/10" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsFavorited(!isFavorited)}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            className="transition-all hover:scale-110 active:scale-90 cursor-pointer bg-transparent border-none outline-none p-0 flex items-center justify-center hover:bg-transparent shadow-none"
                                            title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                        >
                                            <Heart
                                                className={`size-[28px] transition-all duration-300 ${
                                                    isFavorited || isHovered ? "text-red-500" : "text-white"
                                                }`}
                                                style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }}
                                                fill={isFavorited || isHovered ? "currentColor" : "none"}
                                                strokeWidth={2}
                                            />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-content-muted text-sm font-medium">
                                        <Trophy className="size-4 text-gold" />
                                        Vendedor Verificado
                                    </div>
                                    <div className="size-1 rounded-full bg-border" />
                                    <div className="text-content-muted text-sm font-medium">
                                        {profileLoading ? "..." : profile?.createdAt
                                            ? `Membro desde ${new Date(profile.createdAt).getFullYear()}`
                                            : ""}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 md:gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-black text-content-primary tracking-tight">
                                    {profileLoading ? "..." : (profile?.totalOrders ?? 0).toLocaleString("pt-BR")}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-content-muted font-black mt-1">Vendas</div>
                            </div>
                            <div className="w-px h-10 bg-border self-center" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-content-primary tracking-tight">
                                    {profileLoading ? "..." : (profile?.totalMembers ?? 0)}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-content-muted font-black mt-1">Membros</div>
                            </div>
                            <div className="w-px h-10 bg-border self-center" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-content-primary tracking-tight">99%</div>
                                <div className="text-[10px] uppercase tracking-widest text-content-muted font-black mt-1">Envios no Prazo</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-obsidian-nav/30 border border-border/50">
                            <ShieldCheck className="size-5 text-gold" />
                            <div className="text-xs font-bold text-content-primary">Garantia ArcturoShop</div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-obsidian-nav/30 border border-border/50">
                            <Package className="size-5 text-gold" />
                            <div className="text-xs font-bold text-content-primary">Envio Imediato</div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-obsidian-nav/30 border border-border/50">
                            <CheckCircle2 className="size-5 text-gold" />
                            <div className="text-xs font-bold text-content-primary">Produtos Originais</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl md:text-2xl font-black text-content-primary tracking-tight uppercase leading-none">
                            Produtos do vendedor
                        </h2>
                        <div className="text-[11px] font-black uppercase tracking-widest text-content-muted">
                            {isLoading ? "Carregando..." : `${filteredProducts.length} itens encontrados`}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-content-muted" />
                            <Input
                                placeholder="Buscar nesta loja..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-11 pl-10 pr-4 rounded-xl border-border bg-obsidian-card text-content-primary placeholder:text-content-muted/30 focus:border-gold/50 transition-all"
                            />
                        </div>
                        <Button variant="outline" className="h-11 px-5 rounded-xl border-border bg-obsidian-card text-content-primary hover:bg-obsidian-hover gap-2 font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">
                            <Filter className="size-4" />
                            Filtros
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                    {STORE_CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            onClick={() => setSelectedCategory(cat)}
                            className={`h-auto px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 shadow-none ${
                                selectedCategory === cat
                                ? "bg-gold border-gold text-obsidian-nav"
                                : "bg-obsidian-card border-border text-content-muted hover:border-gold/30 hover:text-gold hover:bg-obsidian-hover"
                            }`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {!isLoading && filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <Search className="size-12 text-content-muted/20" />
                        <div className="text-xl font-bold text-content-primary">Nenhum produto encontrado</div>
                        <div className="text-sm text-content-muted">Tente ajustar sua busca ou categoria.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
