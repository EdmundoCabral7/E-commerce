"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List as ListIcon, ChevronDown, ListFilter } from "lucide-react";

interface Props {
    viewMode: "grid" | "list";
    onViewChange: (mode: "grid" | "list") => void;
    resultsCount: number;
    query: string;
}

export default function ResultsHeader({ viewMode, onViewChange, resultsCount, query, onFilterClick }: Props & { onFilterClick?: () => void }) {
    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between bg-obsidian-card p-3 md:p-4 rounded-xl border border-border shadow-none gap-3 md:gap-4 w-full overflow-hidden box-border">
            <div className="flex items-center justify-start gap-3">
                <Button 
                    variant="outline" 
                    onClick={onFilterClick}
                    className="flex lg:hidden items-center gap-1.5 font-black uppercase text-[9px] tracking-widest text-gold hover:text-gold/80 px-3 h-9 bg-obsidian-card border-border rounded-full shrink-0"
                >
                    <ListFilter className="size-3.5" />
                    Filtros
                </Button>
                <div className="text-[10px] font-medium text-content-muted leading-tight">
                    <span className="font-black text-content-primary tracking-tight">{resultsCount}</span> resultados <span className="hidden xs:inline">para</span> <span className="text-gold font-bold italic hidden xs:inline">"{query}"</span>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-6">
                <div className="flex items-center gap-2 text-sm">
                    <div className="text-content-muted text-[9px] uppercase font-black tracking-widest hidden xs:block">Ordenar</div>
                    <Button variant="ghost" className="flex items-center gap-1 font-black uppercase text-[9px] tracking-widest text-content-primary hover:text-gold p-0 h-auto bg-transparent">
                        Relevantes
                        <ChevronDown className="size-3" />
                    </Button>
                </div>

                <div className="hidden md:block w-px h-4 bg-border" />

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => onViewChange("grid")}
                        className={`size-8 rounded-md transition-colors ${viewMode === "grid" ? "bg-gold text-obsidian-nav" : "text-content-muted hover:text-content-primary"}`}
                    >
                        <LayoutGrid className="size-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => onViewChange("list")}
                        className={`size-8 rounded-md transition-colors ${viewMode === "list" ? "bg-gold text-obsidian-nav" : "text-content-muted hover:text-content-primary"}`}
                    >
                        <ListIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
