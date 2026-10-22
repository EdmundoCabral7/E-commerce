"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const getPages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, null, totalPages];
        if (page >= totalPages - 2) return [1, null, totalPages - 2, totalPages - 1, totalPages];
        return [1, null, page - 1, page, page + 1, null, totalPages];
    };

    return (
        <div className="flex flex-col items-center gap-6 py-12 select-none w-full max-w-full overflow-hidden px-4">
            <div className="flex items-center justify-between w-full max-w-sm gap-1">
                <Button
                    variant="ghost"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="flex items-center gap-1 px-2 sm:px-4 py-2 text-sm font-bold text-content-muted hover:text-gold transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
                >
                    <ChevronLeft className="size-4" />
                    <span className="hidden xs:inline">Anterior</span>
                </Button>

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {getPages().map((p, i) =>
                        p === null ? (
                            <div key={`ellipsis-${i}`} className="mx-1 text-content-muted text-sm">...</div>
                        ) : (
                            <Button
                                key={p}
                                onClick={() => onPageChange(p)}
                                variant={p === page ? "default" : "outline"}
                                className={cn(
                                    "size-9 sm:size-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all p-0",
                                    p === page
                                        ? "bg-gold text-obsidian-nav shadow-none"
                                        : "bg-obsidian-card text-content-muted hover:bg-obsidian-hover hover:text-gold border border-border"
                                )}
                            >
                                {p}
                            </Button>
                        )
                    )}
                </div>

                <Button
                    variant="ghost"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="flex items-center gap-1 px-2 sm:px-4 py-2 text-sm font-bold text-gold hover:text-gold/80 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
                >
                    <span className="hidden xs:inline">Próxima</span>
                    <ChevronRight className="size-4" />
                </Button>
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-content-muted">
                Página {page} de {totalPages}
            </div>
        </div>
    );
}
