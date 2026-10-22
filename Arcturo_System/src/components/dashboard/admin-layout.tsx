import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex w-full min-h-screen bg-obsidian-page text-content-primary shadow-none">
            <div className="hidden w-64 shrink-0 border-r border-border bg-obsidian-nav md:block">
                <AppSidebar />
            </div>

            <div className="flex flex-1 flex-col min-w-0 bg-obsidian-page">
                <SiteHeader />

                <div className="flex-1 overflow-auto p-4 md:p-10">
                    <div className="mx-auto max-w-[1400px]">
                        {children}
                    </div>
                </div>
                <div className="h-10 border-t border-border bg-obsidian-nav flex items-center px-8 shrink-0">
                    <div className="text-[10px] text-content-muted uppercase tracking-widest font-medium">
                        ArcturoShop © 2026 — Painel Administrativo
                    </div>
                </div>
            </div>
        </div>
    )
}
