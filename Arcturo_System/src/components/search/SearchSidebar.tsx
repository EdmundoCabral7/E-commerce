"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";

interface Props {
    query: string;
}

export default function SearchSidebar({ query }: Props) {
    return (
        <div className="flex flex-col gap-8 text-content-primary pb-20 select-none">
            <div className="flex flex-col gap-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-content-muted leading-none">Resultados para</div>
                <div className="text-2xl font-black tracking-tight uppercase italic text-gold">{query || "Todos os produtos"}</div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em]">Custo de envio</div>
                <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-gold transition-colors group">
                        <Checkbox id="free" className="border-gold data-[state=checked]:bg-gold data-[state=checked]:text-obsidian-nav" />
                        <div className="group-hover:translate-x-1 transition-transform">Frete grátis</div>
                    </label>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-content-muted">Condição</div>
                <div className="flex flex-col gap-2 text-sm font-medium">
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold hover:translate-x-1 transition-all font-medium text-sm">Novo (1.240)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold hover:translate-x-1 transition-all font-medium text-sm">Usado (295)</Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-content-muted">Marca</div>
                <div className="flex flex-col gap-2 text-sm font-medium">
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold hover:translate-x-1 transition-all font-medium text-sm">Apple (842)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold hover:translate-x-1 transition-all font-medium text-sm">Samsung (156)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold hover:translate-x-1 transition-all font-medium text-sm">Xiaomi (94)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold hover:translate-x-1 transition-all font-medium text-sm">Motorola (42)</Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em]">Armazenamento</div>
                <div className="flex flex-col gap-2 text-sm font-medium text-slate-500">
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-blue-600 hover:translate-x-1 transition-all font-medium text-sm">128 GB (412)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-blue-600 hover:translate-x-1 transition-all font-medium text-sm">256 GB (328)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-blue-600 hover:translate-x-1 transition-all font-medium text-sm">512 GB (112)</Button>
                    <Button variant="ghost" className="justify-start p-0 h-auto hover:text-blue-600 hover:translate-x-1 transition-all font-medium text-sm">1 TB (45)</Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-content-muted">Preço</div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Input placeholder="Mínimo" className="h-9 rounded-lg border-border bg-obsidian-card text-content-primary placeholder:text-content-muted/30 focus:ring-gold" />
                        <div className="text-white/10">—</div>
                        <Input placeholder="Máximo" className="h-9 rounded-lg border-border bg-obsidian-card text-content-primary placeholder:text-content-muted/30 focus:ring-gold" />
                        <Button size="icon" className="p-2 bg-gold border border-border rounded-lg hover:bg-gold/90 transition-colors h-9 w-9">
                            <ChevronRight className="size-4 text-obsidian-nav" />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2 text-sm font-medium">
                        <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold transition-colors font-medium text-sm">Até R$ 50</Button>
                        <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold transition-colors font-medium text-sm">R$ 50 a R$ 150</Button>
                        <Button variant="ghost" className="justify-start p-0 h-auto hover:text-gold transition-colors font-medium text-sm">Mais de R$ 150</Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase tracking-[0.2em]">Avaliações</div>
                <div className="flex flex-col gap-2">
                    {[5, 4, 3].map((stars) => (
                        <Button key={stars} variant="ghost" className="flex items-center gap-2 hover:translate-x-1 transition-all p-0 h-auto justify-start group">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn("size-3", i < stars ? "fill-gold text-gold" : "text-white/10")}
                                    />
                                ))}
                            </div>
                            <div className="text-xs font-bold text-content-muted group-hover:text-gold leading-none">ou mais</div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
