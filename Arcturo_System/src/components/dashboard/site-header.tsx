"use client"
import { useState } from "react"

import { ChevronRight, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebar } from "./app-sidebar"
import { adminPageLabels } from "@/lib/utils/navigation"

export function SiteHeader() {
    const pathname = usePathname()
    const pageLabel = adminPageLabels[pathname] ?? "Painel"
    const [open, setOpen] = useState(false)

    return (
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:px-6 bg-obsidian-nav">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger nativeButton={false} render={
                            <div className="p-2 hover:bg-obsidian-hover rounded-lg cursor-pointer transition-colors mr-1">
                                <Menu className="h-5 w-5 text-content-primary" />
                            </div>
                        } />
                        <SheetContent side="left" className="p-0 w-64 bg-obsidian-nav border-border">
                            <AppSidebar onItemClick={() => setOpen(false)} />
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-content-muted uppercase tracking-[0.2em] whitespace-nowrap">
                    Painel Admin
                </div>
                <ChevronRight className="h-3 w-3 text-content-muted" />
                <div className="text-xs md:text-sm font-medium text-content-primary truncate max-w-[120px] md:max-w-none">
                    {pageLabel}
                </div>
            </div>
        </div>
    )
}
