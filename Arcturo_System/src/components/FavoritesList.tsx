"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconShare, IconArrowsSort, IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Lock } from "lucide-react";
import ProductGrid from "@/components/search/ProductGrid";
import { useFavorites, useToggleFavorite } from "@/lib/hooks/useFavorites";
import { useCart } from "@/lib/hooks/useCart";
import { Favorite } from "@/lib/api/favorite-service";

function FavoriteItem({ favorite }: { favorite: Favorite }) {
    const router = useRouter();
    const { addItem } = useCart();
    const toggleMutation = useToggleFavorite();

    const { product } = favorite;
    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const imageUrl = product.images?.[0]?.url ?? product.imageUrl ?? undefined;
    const addedDate = new Date(favorite.createdAt).toLocaleDateString("pt-BR", {
        day: "numeric", month: "short", year: "numeric",
    });

    return (
        <div className="flex flex-col sm:flex-row gap-5 p-4 sm:p-5">
            <div className="shrink-0">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="size-24 object-cover rounded-lg bg-white border border-border p-1"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/400x400/1C1C20/888884?text=Sem+Foto";
                    }}
                />
            </div>

            <div className="flex flex-col flex-1 justify-between">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="text-[15px] font-bold text-content-primary leading-snug">
                            {product.name}
                        </div>
                        {product.category?.name && (
                            <div className="text-[13px] font-medium text-content-muted mt-0.5">
                                {product.category.name}
                            </div>
                        )}
                        <div className="text-[16px] font-black text-gold tracking-tight mt-2">
                            R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={toggleMutation.isPending}
                        onClick={() => toggleMutation.mutate(product.id)}
                        className="h-auto w-auto text-red-500 hover:text-red-600 hover:bg-transparent transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
                        title="Remover dos favoritos"
                    >
                        <IconHeart className="size-5 fill-current" />
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4 sm:mt-2 gap-3">
                    <div className="text-[12px] font-semibold text-content-muted">
                        Adicionado em {addedDate}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => addItem(product)}
                            className="h-9 px-4 border-border text-content-primary bg-obsidian-nav hover:bg-obsidian-hover rounded-full text-[12px]"
                        >
                            <IconShoppingCart className="size-3.5 mr-2 text-gold" />
                            Adicionar
                        </Button>
                        <Button
                            onClick={() => router.push(`/product/${product.id}`)}
                            className="h-9 px-5 font-bold bg-gold text-obsidian-nav hover:bg-gold/90 rounded-full text-[12px]"
                        >
                            Comprar Agora
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const FavoritesList = () => {
    const router = useRouter();
    const { data: favorites, isLoading } = useFavorites();

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-gold" />
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <EmptyState
                icon={Lock}
                title="Sua lista de favoritos está vazia"
                subtitle="Explore nossa loja e salve seus produtos favoritos!"
                actionLabel="VOLTAR PARA A LOJA"
                onAction={() => router.push("/")}
                recommendationsTitle="Recomendações exclusivas ArcturoShop"
            >
                <ProductGrid viewMode="grid" />
            </EmptyState>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-2">
                <div className="flex flex-col gap-1">
                    <div className="text-xl font-black tracking-tight text-content-primary sm:text-4xl font-heading">
                        Itens Favoritos
                    </div>
                    <div className="text-[15px] font-medium text-content-muted mt-1">
                        {favorites.length} {favorites.length === 1 ? "item" : "itens"} na sua lista de desejos
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <Button variant="outline" className="h-10 px-4 font-bold border-border text-content-primary bg-obsidian-card hover:bg-obsidian-hover rounded-full">
                        <IconShare className="size-4 mr-2 text-gold" />
                        Compartilhar Lista
                    </Button>
                    <Button variant="outline" className="h-10 px-4 font-bold border-border text-content-primary bg-obsidian-card hover:bg-obsidian-hover rounded-full">
                        <IconArrowsSort className="size-4 mr-2 text-gold" />
                        Data de Adição
                    </Button>
                </div>
            </div>

            <div className="bg-obsidian-card border border-border rounded-xl flex flex-col divide-y divide-border shadow-none overflow-hidden">
                {favorites.map((favorite) => (
                    <FavoriteItem key={favorite.id} favorite={favorite} />
                ))}
            </div>
        </div>
    );
};
