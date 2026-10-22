"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useTheme } from "next-themes";
import { ResizableNavbar } from "@/components/ui/resizable-navbar";
import { navLinks } from "@/lib/utils/navigation";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/hooks/useAuth";
import { NavUser } from "@/components/nav-user";
import { useCartStore } from "@/lib/store/useCartStore";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/hooks/useProducts";

export const Header = () => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { scrollY } = useScroll();
    const { user, setUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const cartTotal = useCartStore((s) => s.totalItems());
    const { data: searchData } = useProducts({ search, limit: 8 })
    const searchResults = searchData?.items ?? [];

    useEffect(() => {
        setMounted(true);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    return (
        <div className="relative">
            <ResizableNavbar
                logo={
                    <Link href="/" className="text-xl md:text-2xl font-black tracking-tight text-gold leading-none">
                        ArcturoShop
                    </Link>
                }
                navItems={navLinks}
                actions={(setOpenSidebar) => (
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-4">
                            <Tooltip>
                                <TooltipTrigger 
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    className="p-2 hover:bg-obsidian-hover rounded-full text-content-primary transition-colors bg-transparent border-none outline-none cursor-pointer flex items-center justify-start md:justify-center"
                                >
                                    {mounted ? (
                                        theme === "dark" ? (
                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                <Sun className="size-5" />
                                                <span className="md:hidden font-bold text-sm">Modo Claro</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                <Moon className="size-5" />
                                                <span className="md:hidden font-bold text-sm">Modo Escuro</span>
                                            </div>
                                        )
                                    ) : (
                                        <div className="size-5" />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={15}>
                                    Mudar tema
                                </TooltipContent>
                            </Tooltip>

                            <AnimatePresence mode="wait">
                                {isScrolled ? (
                                    <Tooltip>
                                        <TooltipTrigger 
                                            onClick={() => setOpen(true)}
                                            className="p-2 hover:bg-obsidian-hover rounded-full text-content-primary transition-colors bg-transparent border-none outline-none cursor-pointer flex items-center justify-start md:justify-center"
                                        >
                                            <motion.div
                                                key="search-icon-scrolled"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-3 whitespace-nowrap"
                                            >
                                                <Search className="size-5" />
                                                <span className="md:hidden font-bold text-sm">Buscar Produtos</span>
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" sideOffset={15}>
                                            Pesquisar produtos
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <Tooltip>
                                            <TooltipTrigger 
                                                onClick={() => setOpen(true)}
                                                className="relative flex items-center w-64 h-10 pl-4 pr-10 rounded-full border border-border bg-obsidian-card text-sm text-content-muted text-left hover:border-border transition-all group font-medium outline-none cursor-pointer hidden lg:flex"
                                            >
                                                <motion.div
                                                    key="search-input"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="flex items-center w-full gap-3 whitespace-nowrap"
                                                >
                                                    <div className="select-none hidden md:block">Buscar na ArcturoShop...</div>
                                                    <Search className="absolute right-3 top-2.5 size-4 text-content-muted group-hover:text-gold transition-colors hidden md:block" />
                                                    <Search className="size-5 md:hidden" />
                                                    <span className="md:hidden font-bold text-sm">Buscar Produtos</span>
                                                </motion.div>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" sideOffset={15}>
                                                Abrir busca (Ctrl + K)
                                            </TooltipContent>
                                        </Tooltip>
                                        
                                        <Button
                                            variant="ghost"
                                            onClick={() => setOpen(true)}
                                            className="p-2 hover:bg-obsidian-hover rounded-full text-content-primary transition-colors flex items-center justify-start md:justify-center lg:hidden"
                                        >
                                            <div className="flex items-center gap-3 whitespace-nowrap">
                                                <Search className="size-5" />
                                                <span className="md:hidden font-bold text-sm">Buscar Produtos</span>
                                            </div>
                                        </Button>
                                    </div>
                                )}
                            </AnimatePresence>
                            
                            <Tooltip>
                                <TooltipTrigger 
                                    onClick={() => {
                                        setOpenSidebar(false)
                                        router.push("/cart")
                                    }}
                                    className="relative p-2 hover:bg-obsidian-hover rounded-full text-content-primary transition-colors group bg-transparent border-none outline-none cursor-pointer flex items-center justify-start md:justify-center gap-3 whitespace-nowrap"
                                >
                                    <div className="relative">
                                        <ShoppingCart className="size-5" />
                                        {mounted && cartTotal > 0 && (
                                            <div className="absolute -top-2 -right-2 size-4 bg-gold text-obsidian-nav text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background group-hover:scale-110 transition-transform">
                                                {cartTotal > 99 ? "99+" : cartTotal}
                                            </div>
                                        )}
                                    </div>
                                    <span className="md:hidden font-bold text-sm">Meu Carrinho</span>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={15}>
                                    Meu Carrinho
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <NavUser user={user} onItemClick={() => setOpenSidebar(false)} />
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger 
                                        className="h-10 px-2 flex items-center justify-start md:justify-center gap-3 rounded-full hover:bg-obsidian-hover text-content-primary bg-transparent border-none outline-none cursor-pointer transition-colors whitespace-nowrap"
                                        onClick={() => {
                                            setOpenSidebar(false)
                                            router.push("/login")
                                        }}
                                    >
                                        <User className="size-5" />
                                        <span className="md:hidden font-bold text-sm">Fazer Login</span>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" sideOffset={15}>
                                        Clique aqui para realizar o login
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}
            />
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="O que você está procurando?"
                    value={search}
                    onValueChange={setSearch}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && search) {
                            setOpen(false);
                            router.push(`/search?q=${encodeURIComponent(search)}`);
                        }
                    }}
                />
                <CommandList>
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    {searchResults.length > 0 && (
                        <CommandGroup heading={search ? `Resultados para "${search}"` : "Produtos em destaque"}>
                            {searchResults.map((product) => {
                                const imageUrl = product.imageUrl ?? (product.images as { url?: string }[])?.[0]?.url;
                                const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
                                return (
                                    <CommandItem
                                        key={product.id}
                                        value={product.id}
                                        className="cursor-pointer flex items-center gap-3 py-2"
                                        onSelect={() => {
                                            setOpen(false);
                                            setSearch("");
                                            router.push(`/product/${product.id}`);
                                        }}
                                    >
                                        {imageUrl && (
                                            <div className="size-8 rounded-md overflow-hidden bg-white border border-border shrink-0">
                                                <img src={imageUrl} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-content-primary truncate">{product.name ?? product.title}</span>
                                            <span className="text-xs text-gold font-bold">{price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    )}
                    {search && (
                        <CommandGroup>
                            <CommandItem
                                value="__see-all__"
                                className="cursor-pointer text-content-muted text-xs"
                                onSelect={() => {
                                    setOpen(false);
                                    router.push(`/search?q=${encodeURIComponent(search)}`);
                                }}
                            >
                                <Search className="size-3 mr-2" />
                                Ver todos os resultados para "{search}"
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </div>
    );
};
