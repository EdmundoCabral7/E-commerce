"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types/product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
    products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <div className="relative group/list">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("left")}
                className="absolute left-0 md:-left-6 top-[42%] -translate-y-1/2 z-40 bg-obsidian-card hover:bg-obsidian-hover backdrop-blur-sm border border-border rounded-full h-12 w-12 shadow-none transition-all duration-300 opacity-0 md:group-hover/list:opacity-100 hover:scale-110 hidden md:flex"
                aria-label="Anterior"
            >
                <ArrowLeft className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </Button>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-2 py-4 scroll-smooth"
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[240px] md:min-w-[280px] snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => scroll("right")}
                className="absolute right-0 md:-right-6 top-[42%] -translate-y-1/2 z-40 bg-obsidian-card hover:bg-obsidian-hover backdrop-blur-sm border border-border rounded-full h-12 w-12 shadow-none transition-all duration-300 opacity-0 md:group-hover/list:opacity-100 hover:scale-110 hidden md:flex"
                aria-label="Próximo"
            >
                <ArrowRight className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </Button>
        </div>
    );
};