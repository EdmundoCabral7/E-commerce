"use client";

import { IconPackage } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { Lock } from "lucide-react";
import ProductGrid from "@/components/search/ProductGrid";
import { useOrderHistory } from "@/lib/hooks/useOrders";
import { Order } from "@/lib/api/order-service";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    PENDING:    { label: "Pedido Confirmado",  className: "bg-gold/10 text-gold" },
    PROCESSING: { label: "Processando",         className: "bg-blue-500/10 text-blue-400" },
    SHIPPED:    { label: "Enviado",             className: "bg-indigo-500/10 text-indigo-400" },
    DELIVERED:  { label: "Entregue",            className: "bg-emerald-500/10 text-emerald-400" },
    CANCELLED:  { label: "Cancelado",           className: "bg-red-500/10 text-red-400" },
};

function formatPrice(value: number | string) {
    const n = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function OrderCard({ order }: { order: Order }) {
    const badge = STATUS_MAP[order.status] ?? { label: order.status, className: "bg-border text-content-muted" };
    const shortId = order.id.slice(0, 8).toUpperCase();

    return (
        <div className="rounded-3xl border border-border bg-obsidian-card shadow-none overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6 bg-obsidian-nav border-b border-border">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-bold text-content-muted uppercase tracking-wider">Número do Pedido</div>
                        <div className="font-black text-content-primary">ARC-{shortId}</div>
                    </div>
                    <div className="hidden h-10 w-px bg-border md:block" />
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-bold text-content-muted uppercase tracking-wider">Data</div>
                        <div className="font-black text-content-primary">{formatDate(order.createdAt)}</div>
                    </div>
                    <div className="hidden h-10 w-px bg-border md:block" />
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-bold text-content-muted uppercase tracking-wider">Total</div>
                        <div className="font-black text-gold">{formatPrice(order.total)}</div>
                    </div>
                </div>
                <div className={cn("px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg", badge.className)}>
                    {badge.label}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 text-lg font-black text-content-primary mb-5">
                    <IconPackage className="size-6 text-gold" />
                    Itens do Pedido
                </div>
                <div className="space-y-5">
                    {order.items.map((item, index) => {
                        const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                        const imageUrl = item.product?.imageUrl ?? undefined;
                        const name = item.product?.name ?? "Produto";

                        return (
                            <div key={item.id}>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
                                    <div className="flex gap-5 flex-1">
                                        <div className="size-24 shrink-0 rounded-2xl bg-white border border-border p-1 overflow-hidden flex items-center justify-center">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <IconPackage className="size-8 text-border" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
                                            <div className="font-black text-content-primary text-base">{name}</div>
                                            <div className="text-[13px] font-bold text-content-muted">Qtd: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-lg text-gold">{formatPrice(price * item.quantity)}</div>
                                        {item.quantity > 1 && (
                                            <div className="text-[13px] font-bold text-content-muted">{formatPrice(price)} cada</div>
                                        )}
                                    </div>
                                </div>
                                {index < order.items.length - 1 && <div className="mt-5 border-b border-border" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function OrdersList() {
    const { data: orders, isLoading } = useOrderHistory();

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-gold" />
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <EmptyState
                icon={Lock}
                title="Você ainda não possui pedidos"
                subtitle="Sua lista de compras está vazia. Comece a explorar nossa loja e aproveite as melhores ofertas!"
                actionLabel="VOLTAR PARA A LOJA"
                onAction={() => window.location.href = "/"}
                recommendationsTitle="Recomendações exclusivas ArcturoShop"
            >
                <ProductGrid viewMode="grid" />
            </EmptyState>
        );
    }

    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}
