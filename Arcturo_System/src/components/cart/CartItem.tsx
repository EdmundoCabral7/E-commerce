"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types/product";

interface CartItemDisplay extends Product {
    quantity: number;
    selected: boolean;
}

interface CartItemProps {
    item: CartItemDisplay;
    onToggle: () => void;
    onUpdateQty: (delta: number) => void;
    onRemove: () => void;
}

export default function CartItem({ item, onToggle, onUpdateQty, onRemove }: CartItemProps) {
    const displayName = item.name ?? item.title ?? "Produto";
    const imageUrl = item.images?.[0]?.url ?? item.imageUrl ?? undefined;
    const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;

    return (
        <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 border-b border-border last:border-b-0 bg-obsidian-card group select-none transition-all">
            <div className={`flex gap-4 transition-opacity duration-300 ${!item.selected ? 'opacity-40' : ''}`}>
                <div className="pt-1">
                    <Checkbox
                        checked={item.selected}
                        onCheckedChange={onToggle}
                        className="border-gold data-[state=checked]:bg-gold data-[state=checked]:text-obsidian-nav"
                    />
                </div>
                <div className="size-24 md:size-32 bg-white border border-border rounded-lg flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={displayName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/128x128/1C1C20/888884?text=Sem+Foto";
                        }}
                    />
                </div>
            </div>

            <div className={`flex-1 flex flex-col gap-4 transition-opacity duration-300 ${!item.selected ? 'opacity-40' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gold mb-1">
                            Disponibilidade Imediata
                        </div>
                        <div className="text-sm font-normal text-content-primary leading-snug max-w-md">
                            {displayName}
                        </div>
                        <div className="flex gap-4 mt-3">
                            <Button
                                variant="link"
                                onClick={onRemove}
                                className="h-auto p-0 text-[11px] font-bold text-content-muted hover:text-gold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <Trash2 className="size-3" /> Remover
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-baseline text-[22px] font-normal text-content-primary leading-none">
                            <div className="text-sm mr-0.5 font-normal">R$</div>
                            {Math.floor(price)}
                            <div className="text-xs ml-0.5 self-start pt-1">{(price % 1).toFixed(2).slice(2)}</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-border rounded-full h-9 overflow-hidden bg-obsidian-card shadow-none">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => item.selected && onUpdateQty(-1)}
                            className={`px-3 h-full flex items-center justify-center text-gold transition-all active:bg-obsidian-hover cursor-pointer rounded-none ${!item.selected ? 'opacity-20 cursor-default' : 'hover:bg-obsidian-hover'}`}
                        >
                            <Minus className="size-3" />
                        </Button>
                        <div className="px-5 text-sm font-bold border-x border-border h-full flex items-center text-content-primary">
                            {item.quantity}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => item.selected && item.quantity < item.stock && onUpdateQty(1)}
                            disabled={!item.selected || item.quantity >= item.stock}
                            className={`px-3 h-full flex items-center justify-center text-gold transition-all active:bg-obsidian-hover rounded-none ${(!item.selected || item.quantity >= item.stock) ? 'opacity-20 cursor-default' : 'hover:bg-obsidian-hover cursor-pointer'}`}
                        >
                            <Plus className="size-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
