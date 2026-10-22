"use client"

import { useWalletStats } from "@/lib/hooks/useWallet"
import { buildWalletStats } from "@/lib/utils/wallet-utils"

export function WalletStats() {
    const { data, isLoading } = useWalletStats()
    const stats = buildWalletStats(data, isLoading)

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
                <div key={i} className="bg-obsidian-card border border-border rounded-2xl p-5 shadow-none flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">{s.title}</div>
                        <s.icon className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-black text-content-primary">{s.value}</div>
                        <div className={`text-[10px] font-bold ${s.color}`}>{s.sub}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
