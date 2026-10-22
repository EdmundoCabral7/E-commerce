"use client"

import {
    IconUserCircle,
    IconShoppingBag,
    IconHeart,
    IconLogout,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useUserStore } from "@/lib/store/useUserStore"

export function NavUser({
    user,
    onItemClick,
}: {
    user: {
        name: string
        email: string
        avatar?: string
    }
    onItemClick?: () => void
}) {
    const router = useRouter()
    const { logout } = useUserStore()

    const handleLogout = () => {
        logout()
        if (onItemClick) onItemClick()
        router.push("/login")
    }

    const handleItemClick = (path: string) => {
        if (onItemClick) onItemClick()
        router.push(path)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity outline-none bg-transparent border-none p-0"
            >
                <div className="flex items-center gap-1">
                    <Avatar className="size-10 rounded-full border border-border group-hover:border-gold/30 transition-colors shadow-none">
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-gold text-xs font-black text-obsidian-nav border border-gold/10">AC</AvatarFallback>
                    </Avatar>
                    <span className="md:hidden font-bold text-sm text-content-primary ml-2 whitespace-nowrap">{user.name}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-56 rounded-xl bg-obsidian-nav/95 backdrop-blur-md border border-border shadow-none"
                align="end"
                side="bottom"
                sideOffset={10}
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-2 py-2.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg border border-border">
                                <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                <AvatarFallback className="rounded-lg bg-gold text-[10px] font-black text-obsidian-nav">AC</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <div className="truncate font-black text-content-primary">{user.name}</div>
                                <div className="truncate text-[10px] font-medium text-content-muted">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        onClick={() => handleItemClick("/profile")}
                        className="cursor-pointer font-medium text-content-muted focus:text-content-primary focus:bg-obsidian-hover rounded-md my-0.5"
                    >
                        <IconUserCircle className="size-4 mr-2" />
                        Minha Conta
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => handleItemClick("/orders")}
                        className="cursor-pointer font-medium text-content-muted focus:text-content-primary focus:bg-obsidian-hover rounded-md my-0.5"
                    >
                        <IconShoppingBag className="size-4 mr-2" />
                        Histórico de Compras
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => handleItemClick("/favorites")}
                        className="cursor-pointer font-medium text-content-muted focus:text-content-primary focus:bg-obsidian-hover rounded-md my-0.5"
                    >
                        <IconHeart className="size-4 mr-2" />
                        Favoritos
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer font-medium text-red-500 focus:text-red-500 focus:bg-red-500/10 rounded-md mt-0.5 transition-colors"
                >
                    <IconLogout className="size-4 mr-2" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

