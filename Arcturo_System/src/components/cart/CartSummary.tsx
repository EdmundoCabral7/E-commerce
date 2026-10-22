"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
    subtotal: number;
    total: number;
    itemsCount: number;
}

export default function CartSummary({ subtotal, total, itemsCount }: CartSummaryProps) {
    const router = useRouter();

    return (
        <Card className="border border-border shadow-none rounded-lg bg-obsidian-card p-6 flex flex-col gap-6">
            <div className="text-lg font-bold text-content-primary leading-none">Resumo da compra</div>
            
            <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between">
                    <div className="text-content-muted">Produtos ({itemsCount})</div>
                    <div className="font-normal text-content-primary">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="flex justify-between">
                    <div className="text-content-muted">Frete Arcturo</div>
                    <div className="text-gold font-semibold italic">Grátis</div>
                </div>
            </div>

            <div className="text-gold text-[13px] font-medium cursor-pointer hover:underline">
                Inserir cupom de desconto
            </div>

            <Separator className="bg-border" />

            <div className="flex justify-between items-baseline">
                <div className="text-lg font-bold text-content-primary">Total</div>
                <div className="text-xl font-bold text-gold">
                    <div className="flex items-baseline gap-1">
                        <div className="text-sm font-normal">R$</div>
                        {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            <Button
                disabled={itemsCount === 0}
                onClick={() => router.push("/checkout")}
                className="w-full bg-gold hover:bg-gold/90 text-obsidian-nav font-bold h-12 rounded-full shadow-none shadow-gold/10 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
                Continuar a compra
            </Button>

            <div className="text-[11px] text-content-muted text-center leading-tight">
                Taxas e impostos calculados no checkout.
            </div>
        </Card>
    );
}
