"use client";

import { useState, useMemo, useEffect } from "react";
import { Lock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import ProductGrid from "@/components/search/ProductGrid";
import { useCart, useCartSync } from "@/lib/hooks/useCart";

export default function CartPageContent() {
    useCartSync();
    const { items, removeItem, updateQuantity, clearCart } = useCart();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            items.forEach(i => { if (!next.has(i.id)) next.add(i.id); });
            return next;
        });
    }, [items]);

    const normalizedItems = items.map(item => ({
        ...item,
        selected: selectedIds.has(item.id),
    }));

    const toggleItem = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleUpdateQty = (id: string, delta: number) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        const newQty = Math.max(1, item.quantity + delta);
        updateQuantity(id, newQty);
    };

    const toggleAll = (selected: boolean) => {
        if (selected) {
            setSelectedIds(new Set(items.map(i => i.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleClear = () => {
        clearCart();
        setSelectedIds(new Set());
    };

    const allSelected = items.length > 0 && items.every(i => selectedIds.has(i.id));

    const subtotal = useMemo(() => {
        return normalizedItems
            .filter(item => item.selected)
            .reduce((acc, item) => {
                const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                return acc + price * item.quantity;
            }, 0);
    }, [normalizedItems]);

    const selectedCount = normalizedItems.filter(i => i.selected).length;

    return (
        <div className="w-full">
            {items.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <CartList
                            items={normalizedItems}
                            onToggle={toggleItem}
                            onUpdateQty={handleUpdateQty}
                            onRemove={removeItem}
                            onToggleAll={toggleAll}
                            onClear={handleClear}
                            allSelected={allSelected}
                        />
                    </div>

                    <div className="lg:col-span-4 mt-12 lg:mt-0">
                        <CartSummary
                            subtotal={subtotal}
                            total={subtotal}
                            itemsCount={selectedCount}
                        />
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={Lock}
                    title="Seu carrinho está vazio"
                    subtitle="Parece que você ainda não adicionou nada. Que tal dar uma olhada nas nossas novidades?"
                    actionLabel="VOLTAR PARA A LOJA"
                    onAction={() => window.location.href = '/'}
                    recommendationsTitle="Recomendações exclusivas ArcturoShop"
                >
                    <ProductGrid viewMode="grid" />
                </EmptyState>
            )}
        </div>
    );
}
