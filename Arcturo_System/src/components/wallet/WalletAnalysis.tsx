"use client";

import { ArrowRight, TrendingUp, Calendar, CreditCard, Wallet } from "lucide-react"
import { useWalletAnalysis } from "@/lib/hooks/useWallet"

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatScheduleDate(iso: string): string {
    const date = new Date(iso);
    const today = new Date();
    const diff = Math.round((date.getTime() - today.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    if (diff === -1) return "Ontem";
    return date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" });
}

export function WalletAnalysis() {
    const { data, isLoading } = useWalletAnalysis();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-obsidian-card border border-border rounded-2xl p-6 shadow-none">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-sm font-bold text-content-primary">Agenda de Recebimento</div>
                </div>
                <div className="space-y-5">
                    {isLoading ? (
                        <div className="text-xs text-content-muted">Carregando...</div>
                    ) : !data?.schedule?.length ? (
                        <div className="text-xs text-content-muted">Nenhum recebimento nos últimos 7 dias.</div>
                    ) : (
                        data.schedule.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between pb-3 ${idx < data.schedule.length - 1 ? "border-b border-border" : ""}`}
                            >
                                <div className="flex flex-col">
                                    <div className="text-xs text-content-muted font-medium capitalize">
                                        {formatScheduleDate(item.date)}
                                    </div>
                                    <div className="text-sm font-black text-content-primary">
                                        {formatCurrency(item.amount)}
                                    </div>
                                </div>
                                <ArrowRight className="h-3 w-3 text-content-muted" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-obsidian-card border border-border rounded-2xl p-6 shadow-none">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-sm font-bold text-content-primary">Performance de Hoje</div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-content-muted" />
                            <div className="text-xs font-medium text-content-muted">Taxa de Conversão</div>
                        </div>
                        <div className="text-sm font-black text-emerald-400">
                            {isLoading ? "..." : `${data?.conversionRate ?? 0}%`}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wallet className="h-4 w-4 text-content-muted" />
                            <div className="text-xs font-medium text-content-muted">Ticket Médio</div>
                        </div>
                        <div className="text-sm font-black text-content-primary">
                            {isLoading ? "..." : formatCurrency(data?.avgTicket ?? 0)}
                        </div>
                    </div>
                    <div className="mt-2 p-3 bg-muted rounded-xl border border-border">
                        <div className="text-[10px] leading-relaxed text-content-muted font-medium">
                            {isLoading
                                ? "Carregando métricas..."
                                : data?.conversionRate && data.conversionRate > 0
                                ? <>Ticket médio de <span className="text-gold font-bold">{formatCurrency(data.avgTicket)}</span> com <span className="text-emerald-400 font-bold">{data.conversionRate}%</span> de conversão hoje.</>
                                : "Nenhum pedido registrado hoje ainda."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
