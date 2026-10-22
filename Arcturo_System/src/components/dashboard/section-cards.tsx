"use client"

import { Package, Star, MessageSquare, ShoppingCart } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardMetrics } from "@/lib/hooks/useAdminProducts"

export function SectionCards() {
    const { data: metrics, isLoading } = useDashboardMetrics()

    const val = (v: number | undefined) => isLoading ? "—" : (v ?? 0).toLocaleString("pt-BR")

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <Package className="size-4" /> Total de Produtos
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {val(metrics?.products.total)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <ShoppingCart className="size-4" /> Itens Vendidos
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {val(metrics?.sales.totalItemsSold)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <Star className="size-4" /> Avaliações
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {val(metrics?.engagement.totalReviews)}
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <MessageSquare className="size-4" /> Perguntas Pendentes
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {val(metrics?.engagement.pendingQuestions)}
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}
