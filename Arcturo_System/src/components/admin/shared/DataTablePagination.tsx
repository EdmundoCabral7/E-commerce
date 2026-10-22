"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTablePaginationProps {
    currentPage: number
    totalPages: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (items: number) => void
}

export function DataTablePagination({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: DataTablePaginationProps) {

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-transparent border-t border-border">
            <div className="flex items-center gap-4">
                <Select value={String(itemsPerPage)} onValueChange={(v) => onItemsPerPageChange(Number(v))}>
                    <SelectTrigger className="bg-obsidian-card border border-border rounded-lg text-xs font-bold text-content-primary h-9 px-3 w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-obsidian-nav border-border rounded-xl">
                        <SelectItem value="5">5 itens</SelectItem>
                        <SelectItem value="10">10 itens</SelectItem>
                        <SelectItem value="20">20 itens</SelectItem>
                        <SelectItem value="50">50 itens</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border text-content-primary hover:bg-obsidian-hover disabled:opacity-30 transition-all"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant="ghost"
                            onClick={() => onPageChange(page)}
                            className={`h-9 w-9 rounded-full text-[11px] font-bold transition-all p-0 ${
                                currentPage === page
                                ? "bg-gold text-obsidian-nav shadow-none hover:bg-gold"
                                : "text-content-muted hover:bg-obsidian-hover hover:text-content-primary"
                            }`}
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-border text-content-primary hover:bg-obsidian-hover disabled:opacity-30 transition-all"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
