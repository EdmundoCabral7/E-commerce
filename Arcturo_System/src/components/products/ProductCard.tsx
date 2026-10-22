"use client";

import { useState } from "react";
import { Product } from "@/lib/types/product";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useFavorites, useToggleFavorite } from "@/lib/hooks/useFavorites";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
    product: Product;
    onAddToCart?: () => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useUserStore();
    const { data: favorites } = useFavorites();
    const toggleMutation = useToggleFavorite();

    const displayName = product.name ?? product.title ?? "Produto";
    const firstImage = product.images?.[0];
    const imageUrl = (typeof firstImage === "string" ? firstImage : firstImage?.url) ?? product.imageUrl ?? undefined;
    const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
    const isFavorite = favorites?.some((f) => f.productId === product.id) ?? false;

    const handleHeartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        toggleMutation.mutate(product.id, {
            onSuccess: () => {
                if (isFavorite) {
                    toast("Removido dos favoritos");
                } else {
                    toast.success("Adicionado aos favoritos!");
                }
            },
        });
    };

    return (
        <Link href={`/product/${product.id}`} className="group relative flex flex-col bg-obsidian-card rounded-2xl overflow-hidden shadow-none border border-border hover:border-border transition-all duration-300 w-full">
            <div className="relative bg-obsidian-page flex items-center justify-center shrink-0 h-[240px]">
                <div
                    className={`absolute top-3 right-4 z-20 transition-all hover:scale-110 cursor-pointer ${isFavorite || isHovered ? 'text-red-500' : 'text-white'} ${toggleMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleHeartClick}
                    title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                    <Heart
                        className="size-[28px] transition-all duration-300"
                        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }}
                        fill={isFavorite || isHovered ? "currentColor" : "none"}
                        strokeWidth={2}
                    />
                </div>

                <img
                    src={imageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/300x200/f8fafc/94a3b8?text=Sem+Foto";
                    }}
                />
            </div>

            <div className="flex flex-col p-4 flex-1 relative z-10">
                <div className="flex flex-col gap-1.5 mb-3">
                    <div className="text-[14px] font-bold text-content-primary leading-snug transition-colors group-hover:text-gold font-heading min-h-[66px]">
                        {displayName}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-content-muted">
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gold/10 text-gold rounded-md font-bold">
                            <Star className="size-3 fill-current" />
                            4.8
                        </div>
                        <div className="font-medium">vendidos</div>
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
};
