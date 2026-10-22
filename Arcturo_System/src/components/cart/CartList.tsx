"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Truck } from "lucide-react";
import CartItem from "./CartItem";
import { Product } from "@/lib/types/product";

interface CartItemDisplay extends Product {
    quantity: number;
    selected: boolean;
}

interface CartListProps {
    items: CartItemDisplay[];
    onToggle: (id: string) => void;
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onToggleAll: (selected: boolean) => void;
    onClear: () => void;
    allSelected: boolean;
}

export default function CartList({ items, onToggle, onUpdateQty, onRemove, onToggleAll, onClear, allSelected }: CartListProps) {
    const [cep, setCep] = useState("");

    return (
        <Card className="border border-border shadow-none rounded-lg bg-obsidian-card overflow-hidden">
            <div className="p-4 border-b border-border bg-obsidian-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="select-all"
                        checked={allSelected}
                        onCheckedChange={(val) => onToggleAll(!!val)}
                        className="border-gold data-[state=checked]:bg-gold data-[state=checked]:text-obsidian-nav"
                    />
                    <div className="font-bold text-sm text-content-primary">
                        Produtos ArcturoShop Direct
                    </div>
                </div>
                <Button 
                    variant="ghost"
                    onClick={onClear}
                    className="h-auto text-[10px] font-black uppercase tracking-widest text-red-500/80 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-500/5 cursor-pointer shadow-none"
                >
                    <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpar Carrinho
                </Button>
            </div>

            <div className="flex flex-col">
                {items.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onToggle={() => onToggle(item.id)}
                        onUpdateQty={(delta) => onUpdateQty(item.id, delta)}
                        onRemove={() => onRemove(item.id)}
                    />
                ))}
            </div>

            {items.length > 0 && (
                <div className="p-6 bg-obsidian-card border-t border-border flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gold">
                            <div className="flex items-center gap-2">
                                <Truck className="size-4" />
                                Você ganhou frete grátis!
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div className="h-full w-full bg-gold rounded-full shadow-[0_0_10px_rgba(212,172,74,0.3)]" />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                        <div className="flex flex-col gap-1">
                            <div className="text-sm font-bold text-content-primary">Entrega</div>
                            <div className="text-xs text-content-muted font-medium">Calcular frete e prazos de entrega</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-muted group-focus-within:text-gold transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="00000-000"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                    className="h-10 pl-9 pr-4 w-36 rounded-lg border border-border bg-obsidian-nav text-sm font-medium text-content-primary focus:ring-gold transition-all"
                                />
                            </div>
                            <Button className="h-10 px-4 bg-gold text-obsidian-nav text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-gold/90 transition-all active:scale-95 flex items-center justify-center cursor-pointer">
                                Calcular
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </Card>
    );
}
