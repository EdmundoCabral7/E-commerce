"use client";

import { CheckCircle2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SellerCardProps {
    sellerId: string;
    name: string;
    salesCount: string;
    stockCount: number;
}

export const SellerCard = ({ sellerId, name, salesCount, stockCount }: SellerCardProps) => {
    return (
        <div className="w-full bg-obsidian-card border border-border rounded-xl p-5 group transition-all hover:border-gold/20">
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                    <div className="size-12 rounded-full bg-obsidian-nav border border-border flex items-center justify-center text-gold">
                        <Store className="size-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <div className="text-content-primary font-bold">{name}</div>
                            <CheckCircle2 className="size-4 text-gold" />
                        </div>
                        <div className="text-content-muted text-xs font-medium mt-1">
                            Vendedor oficial ArcturoShop
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-obsidian-nav/50 rounded-lg p-3 border border-border/50">
                    <div className="text-[10px] uppercase tracking-widest text-content-muted font-black mb-1">Vendas</div>
                    <div className="text-content-primary font-bold text-sm">{salesCount} realizadas</div>
                </div>
                <div className="bg-obsidian-nav/50 rounded-lg p-3 border border-border/50">
                    <div className="text-[10px] uppercase tracking-widest text-content-muted font-black mb-1">Estoque</div>
                    <div className="text-content-primary font-bold text-sm">{stockCount} unidades</div>
                </div>
            </div>

            <Link href={`/store/${sellerId}`} className="block">
                <Button
                    variant="ghost"
                    className="w-full text-gold hover:text-gold hover:bg-gold/10 rounded-xl font-bold text-xs uppercase tracking-widest h-10 transition-colors"
                >
                    Ver loja do vendedor
                </Button>
            </Link>
        </div>
    );
};
