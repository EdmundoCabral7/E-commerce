"use client";

import { cn } from "@/lib/utils";
import { Product } from "@/lib/types/product";
import Link from "next/link";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Lock } from "lucide-react";

interface ProductGridProps {
    viewMode: "grid" | "list";
    products?: Product[];
}

export default function ProductGrid({ viewMode, products = [] }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <EmptyState
                icon={Lock}
                title="Nenhum produto encontrado"
                subtitle="Não encontramos resultados para sua busca. Tente usar termos mais genéricos ou explore nossas categorias!"
                actionLabel="VOLTAR PARA A LOJA"
                onAction={() => window.location.href = "/"}
                recommendationsTitle="Recomendações exclusivas ArcturoShop"
            />
        );
    }

    return (
        <div className={cn(
            "grid gap-3 md:gap-6 w-full pb-20",
            viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 gap-4"
        )}>
            {products.map((p) => {
                const displayName = p.name ?? p.title ?? "Produto";
                const imageUrl = p.images?.[0]?.url ?? p.imageUrl ?? undefined;
                const price = typeof p.price === "string" ? parseFloat(p.price) : p.price;

                return (
                    <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        className={cn(
                            "group relative flex flex-col bg-obsidian-card rounded-2xl overflow-hidden border border-border shadow-none hover:shadow-none transition-shadow duration-300 w-full",
                            viewMode === "list" && "md:flex-row md:h-64"
                        )}
                    >
                        <div className={cn(
                            "relative flex items-center justify-center shrink-0",
                            viewMode === "list" ? "w-full md:w-64 h-64 md:h-full border-b md:border-b-0 md:border-r border-border bg-obsidian-card overflow-hidden" : "h-[180px] md:h-[300px] bg-obsidian-card overflow-hidden"
                        )}>
                            <img
                                src={imageUrl}
                                alt={displayName}
                                className={cn("w-full h-full", viewMode === "list" ? "object-contain" : "object-cover")}
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/300x200/f8fafc/94a3b8?text=Sem+Foto"; }}
                            />
                        </div>

                        <div className="flex flex-col p-3 md:p-4 flex-1 bg-obsidian-card relative z-10">
                            <div className="flex flex-col gap-1 mb-2">
                                <div className="text-[12px] md:text-[14px] font-bold text-content-primary leading-snug transition-colors group-hover:text-gold font-heading min-h-[44px] md:min-h-[66px]">
                                    {displayName}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-content-muted">
                                    <Star className="size-2.5 fill-gold text-gold" />
                                    <div className="text-gold font-medium">4.8</div>
                                </div>
                            </div>

                            <div className="flex flex-col mt-auto pt-3 border-t border-border">
                                <div className="text-[22px] font-black text-gold whitespace-nowrap">
                                    R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
