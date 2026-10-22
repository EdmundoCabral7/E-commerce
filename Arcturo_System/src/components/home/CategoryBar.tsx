"use client";

import { Tag } from "lucide-react";
import { useCategories } from "@/lib/hooks/useProducts";
import Link from "next/link";

export const CategoryBar = () => {
    const { data: categories = [], isLoading } = useCategories();

    if (isLoading) {
        return <div className="w-full py-4 px-4 text-content-muted text-sm">Carregando categorias...</div>;
    }

    if (categories.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex sm:grid sm:grid-cols-8 gap-2.5 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-0">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/search?category=${category.id}`}
                        className="flex flex-col items-center gap-3 p-3 bg-obsidian-card rounded-2xl shadow-none border border-border hover:bg-obsidian-hover transition-all duration-300 min-w-[85px] sm:w-full cursor-pointer group snap-start"
                    >
                        <div className="size-10 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 bg-gold/10 text-gold">
                            {category.imageUrl ? (
                                <img src={category.imageUrl} alt={category.name} className="size-6 object-contain" />
                            ) : (
                                <Tag className="size-6" />
                            )}
                        </div>
                        <div className="text-[9px] font-black text-content-muted uppercase tracking-widest text-center group-hover:text-gold transition-colors">
                            {category.name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
