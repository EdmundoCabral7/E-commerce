import { ShoppingBag, Landmark, Percent, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface WalletData {
    totalBalance?: number
    pendingPayout?: number
    gatewayFees?: number
    netProfit?: number
    monthlyRevenue?: number
}

export type WalletStat = {
    title: string
    value: string
    sub: string
    color: string
    icon: LucideIcon
}

function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function buildWalletStats(data: WalletData | undefined, isLoading: boolean): WalletStat[] {
    return [
        {
            title: "SALDO TOTAL",
            value: isLoading ? "..." : formatCurrency(data?.totalBalance ?? 0),
            sub: "Receita acumulada",
            color: "text-emerald-400",
            icon: ShoppingBag,
        },
        {
            title: "A RECEBER (REPASSE)",
            value: isLoading ? "..." : formatCurrency(data?.pendingPayout ?? 0),
            sub: "Saques pendentes",
            color: "text-blue-400",
            icon: Landmark,
        },
        {
            title: "TAXAS DE GATEWAY",
            value: isLoading ? "..." : formatCurrency(data?.gatewayFees ?? 0),
            sub: "3.8% de taxa média",
            color: "text-content-muted",
            icon: Percent,
        },
        {
            title: "LUCRO LÍQUIDO",
            value: isLoading ? "..." : formatCurrency(data?.netProfit ?? 0),
            sub: `Mês atual: ${isLoading ? "..." : formatCurrency(data?.monthlyRevenue ?? 0)}`,
            color: "text-emerald-400",
            icon: Wallet,
        },
    ]
}
