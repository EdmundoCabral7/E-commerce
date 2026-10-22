"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackagePlus, Boxes, Ticket, Settings, Package, ShoppingBag, Star, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useDashboardMetrics, useSalesSummary } from "@/lib/hooks/useAdminProducts"
import { useSales } from "@/lib/hooks/useSales"
import { useUserStore } from "@/lib/store/useUserStore"

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    PENDING:    { label: "Pendente",    className: "bg-yellow-500/10 text-yellow-400" },
    PROCESSING: { label: "Processando", className: "bg-blue-500/10 text-blue-400" },
    SHIPPED:    { label: "Enviado",     className: "bg-indigo-500/10 text-indigo-400" },
    PAID:       { label: "Concluído",   className: "bg-emerald-500/10 text-emerald-400" },
    DELIVERED:  { label: "Entregue",    className: "bg-emerald-500/10 text-emerald-400" },
    CANCELLED:  { label: "Cancelado",   className: "bg-red-500/10 text-red-400" },
}

function fmt(value: number | string | undefined, loading: boolean) {
    if (loading) return "—"
    const n = typeof value === "string" ? parseFloat(value) : (value ?? 0)
    return n.toLocaleString("pt-BR")
}

function fmtBRL(value: number | string | undefined, loading: boolean) {
    if (loading) return "—"
    const n = typeof value === "string" ? parseFloat(value) : (value ?? 0)
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function DashboardContent() {
    const { user } = useUserStore()
    const { data: metrics, isLoading: loadingMetrics } = useDashboardMetrics()
    const { data: summary, isLoading: loadingSummary } = useSalesSummary()
    const { data: recentSales, isLoading: loadingSales } = useSales({ limit: 5 })

    const firstName = user?.name?.split(" ")[0] ?? "Administrador"

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-1 mb-8">
                <div className="text-2xl font-black tracking-tight text-content-primary sm:text-4xl font-heading leading-tight">
                    Olá, {firstName}!
                </div>
                <div className="text-content-muted text-sm font-medium">
                    Aqui está o resumo do seu ArcturoShop hoje.
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-obsidian-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-content-muted flex items-center gap-2">
                                <TrendingUp className="size-4 text-gold" /> Receita do Mês
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gold">{fmtBRL(summary?.monthlyRevenue, loadingSummary)}</div>
                            <div className="text-xs text-content-muted">Vendas pagas no mês atual</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-obsidian-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-content-muted flex items-center gap-2">
                                <ShoppingBag className="size-4 text-gold" /> Vendas Pagas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-content-primary">{fmt(summary?.totalPaidSales, loadingSummary)}</div>
                            <div className="text-xs text-content-muted">Total histórico de pedidos</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-obsidian-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-content-muted flex items-center gap-2">
                                <Package className="size-4 text-gold" /> Produtos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-content-primary">{fmt(metrics?.products.total, loadingMetrics)}</div>
                            <div className="text-xs text-content-muted">{fmt(metrics?.products.totalStock, loadingMetrics)} un. em estoque</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-obsidian-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-content-muted flex items-center gap-2">
                                <Star className="size-4 text-gold" /> Engajamento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-content-primary">{fmt(metrics?.engagement.totalReviews, loadingMetrics)}</div>
                            <div className="text-xs text-content-muted flex items-center gap-1">
                                <MessageSquare className="size-3" />
                                {fmt(metrics?.engagement.pendingQuestions, loadingMetrics)} perguntas pendentes
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                    <Card className="lg:col-span-4 bg-obsidian-card border border-border shadow-none">
                        <CardHeader>
                            <CardTitle className="text-content-primary">Atalhos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/inventory" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-obsidian-nav/30 hover:bg-obsidian-hover cursor-pointer transition-colors border-dashed">
                                    <PackagePlus className="h-6 w-6 text-gold" />
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm font-bold text-content-primary">Adicionar Produto</div>
                                        <div className="text-[10px] text-content-muted uppercase tracking-widest">Novo Item</div>
                                    </div>
                                </Link>
                                <Link href="/inventory" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-obsidian-nav/30 hover:bg-obsidian-hover cursor-pointer transition-colors border-dashed">
                                    <Boxes className="h-6 w-6 text-content-muted" />
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm font-bold text-content-primary">Gerenciar Estoque</div>
                                        <div className="text-[10px] text-content-muted uppercase tracking-widest">Inventário</div>
                                    </div>
                                </Link>
                                <Link href="/coupons" className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-obsidian-nav/30 hover:bg-obsidian-hover cursor-pointer transition-colors border-dashed">
                                    <Ticket className="h-6 w-6 text-content-muted" />
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm font-bold text-content-primary">Cupons</div>
                                        <div className="text-[10px] text-content-muted uppercase tracking-widest">Promoções</div>
                                    </div>
                                </Link>
                                <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-obsidian-nav/30 hover:bg-obsidian-hover cursor-pointer transition-colors border-dashed">
                                    <Settings className="h-6 w-6 text-content-muted" />
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm font-bold text-content-primary">Configurações</div>
                                        <div className="text-[10px] text-content-muted uppercase tracking-widest">Sistema</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3 bg-obsidian-card border border-border shadow-none">
                        <CardHeader>
                            <CardTitle className="text-content-primary">Vendas Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingSales ? (
                                <div className="flex justify-center py-8">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-gold" />
                                </div>
                            ) : !recentSales?.items?.length ? (
                                <div className="text-center text-content-muted text-sm py-8">Nenhuma venda registrada ainda.</div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {recentSales.items.map((sale) => {
                                        const badge = STATUS_MAP[sale.status] ?? { label: sale.status, className: "bg-border text-content-muted" }
                                        const total = typeof sale.total === "string" ? parseFloat(sale.total) : sale.total
                                        return (
                                            <div key={sale.id} className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-2">
                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                    <div className="text-sm font-bold text-content-primary truncate">{sale.buyerName}</div>
                                                    <div className="text-[10px] text-content-muted uppercase truncate">{sale.buyerEmail}</div>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${badge.className}`}>{badge.label}</div>
                                                <div className="text-sm font-black text-content-primary shrink-0">
                                                    {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
