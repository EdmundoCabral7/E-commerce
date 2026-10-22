import { Home, Wallet, Package, Ticket, Layers, Users, Truck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type MenuItem = { label: string; icon: LucideIcon; path: string }

export const adminMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Carteira", icon: Wallet, path: "/wallet" },
    { label: "Estoque", icon: Package, path: "/inventory" },
    { label: "Cupons de Desconto", icon: Ticket, path: "/coupons" },
    { label: "Categorias", icon: Layers, path: "/categories" },
    { label: "Vendas", icon: Ticket, path: "/sales" },
    { label: "Gestão de Equipe", icon: Users, path: "/team" },
    { label: "Opções de Entrega", icon: Truck, path: "/delivery" },
]

export const navLinks = [
    { title: "Produtos", href: "#" },
    { title: "Soluções", href: "#" },
    { title: "Sobre Nós", href: "#" },
    { title: "Blog", href: "#" },
];

export const footerSections = [
    {
        title: "Termos de Serviço",
        links: [
            { title: "Termos", href: "#" },
            { title: "Privacidade", href: "#" },
            { title: "Cookies", href: "#" },
            { title: "Licenças", href: "#" },
            { title: "Contato", href: "#" },
        ],
    },
    {
        title: "Produtos",
        links: [
            { title: "Visão Geral", href: "#" },
            { title: "Funcionalidades", href: "#" },
            { title: "Preços", href: "#" },
            { title: "Lançamentos", href: "#" },
            { title: "Ferramentas", href: "#" },
        ],
    },
    {
        title: "Redes Sociais",
        links: [
            { title: "Instagram", href: "#" },
            { title: "Facebook", href: "#" },
            { title: "X", href: "#" },
        ],
    },
    {
        title: "Recursos",
        links: [
            { title: "Central de Ajuda", href: "#" },
            { title: "Suporte", href: "#" },
        ],
    },
    {
        title: "Empresa",
        links: [
            { title: "Sobre nós", href: "#" },
        ],
    },
];

export const adminPageLabels: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/wallet": "Carteira",
    "/inventory": "Estoque",
    "/coupons": "Cupons de Desconto",
    "/categories": "Categorias",
    "/sales": "Lista de Vendas",
    "/team": "Gestão de Equipe",
    "/delivery": "Opções de Entrega",
}
