import { LogOut, Sun, Moon } from "lucide-react"
import { adminMenuItems } from "@/lib/utils/navigation"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { useUserStore } from "@/lib/store/useUserStore"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface AppSidebarProps {
    onItemClick?: () => void
}

export function AppSidebar({ onItemClick }: AppSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user } = useAuth()
    const { logout } = useUserStore()

    const handleLogout = () => {
        logout()
        if (onItemClick) onItemClick()
        router.push("/admin/login")
    }
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleNavigate = (path: string) => {
        router.push(path)
        if (onItemClick) onItemClick()
    }

    return (
        <div className="flex h-full w-full flex-col bg-obsidian-nav border-r border-border">
            <div className="flex flex-col gap-6 px-3 py-6 flex-1 overflow-y-auto scrollbar-hide">
                <div className="text-2xl font-black tracking-tight px-3 text-gold font-heading mb-2">
                    ArcturoShop
                </div>
                <div className="flex flex-col gap-1">
                    {adminMenuItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                                pathname === item.path
                                    ? "bg-obsidian-hover text-gold font-bold"
                                    : "text-content-muted hover:bg-obsidian-hover hover:text-content-primary"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0", pathname === item.path ? "text-gold" : "text-content-muted")} />
                            <div>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto border-t border-border p-4 flex flex-col gap-3 bg-obsidian-nav/50">

                <DropdownMenu>
                    <DropdownMenuTrigger 
                        nativeButton={false}
                        render={
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-obsidian-hover transition-colors cursor-pointer border border-border hover:border-gold/30 group bg-obsidian-card/30" />
                        }
                    >
                        <Avatar className="h-8 w-8 border border-border group-hover:border-gold/50 transition-colors shrink-0">
                            <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? "User"} />
                            <AvatarFallback className="bg-gold text-obsidian-nav font-bold">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-bold text-content-primary truncate group-hover:text-gold transition-colors leading-none mb-1">
                                {user?.name || "Administrador"}
                            </span>
                            <span className="text-[10px] font-medium text-content-muted truncate leading-none">
                                {user?.email || "admin@arcturo.com"}
                            </span>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" side="top" sideOffset={12} className="w-[200px] bg-obsidian-nav border-border text-content-primary p-1 rounded-xl shadow-2xl">
                        <DropdownMenuItem
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="cursor-pointer font-bold text-xs py-2 px-3 rounded-lg focus:bg-gold/10 focus:text-gold transition-all"
                        >
                            {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                            <span>Alterar Tema</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border my-1" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer font-bold text-xs py-2 px-3 rounded-lg text-red-500 focus:text-red-400 focus:bg-red-500/10 transition-all"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
