"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResultsHeader from "@/components/search/ResultsHeader";
import ProductGrid from "@/components/search/ProductGrid";
import Pagination from "@/components/search/Pagination";
import { useProducts, useCategories } from "@/lib/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const LIMIT = 12;

export default function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const categoryParam = searchParams.get("category") || undefined;

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);
    const [localSearch, setLocalSearch] = useState(query);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(categoryParam);

    const { data, isLoading } = useProducts({
        search: query || undefined,
        page,
        limit: LIMIT,
        category: selectedCategory,
    });
    const { data: recommended } = useProducts({ limit: 6, page: 3 });
    const { data: categories = [] } = useCategories();

    const products = data?.items ?? [];
    const total = data?.meta?.total ?? 0;
    const totalPages = data?.meta?.pages ?? 1;
    const recommendedProducts = (recommended?.items ?? []).slice(0, 6);

    const handleSearch = () => {
        const term = localSearch.trim();
        if (!term) {
            router.push("/search");
            return;
        }
        router.push(`/search?q=${encodeURIComponent(term)}`);
    };

    return (
        <div className="min-h-dvh bg-obsidian-page max-w-full overflow-x-hidden">
            <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-6 md:py-16 flex flex-col gap-8">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-content-muted pointer-events-none" />
                    <Input
                        placeholder="Buscar produtos..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="h-12 pl-11 pr-28 rounded-full border-border bg-obsidian-card text-content-primary text-sm font-medium placeholder:text-content-muted/40 focus:border-gold transition-colors"
                    />
                    <Button
                        onClick={handleSearch}
                        className="absolute right-1.5 top-1.5 h-9 px-5 rounded-full bg-gold text-obsidian-nav hover:bg-gold/90 font-black text-xs uppercase tracking-widest"
                    >
                        Buscar
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
                        <div className="flex flex-col gap-1">
                            <div className="text-[11px] font-black uppercase tracking-widest text-content-muted">Resultados para</div>
                            <div className="text-2xl font-black tracking-tight uppercase italic text-gold">
                                {query || "Todos os produtos"}
                            </div>
                        </div>

                        {categories.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-content-muted">Categoria</div>
                                <div className="flex flex-col gap-2 text-sm font-medium">
                                    <Button
                                        variant="ghost"
                                        onClick={() => { setSelectedCategory(undefined); setPage(1); }}
                                        className={cn(
                                            "justify-start p-0 h-auto transition-all hover:text-gold hover:translate-x-1 hover:bg-transparent",
                                            !selectedCategory ? "text-gold font-bold" : "text-content-primary"
                                        )}
                                    >
                                        Todas as categorias
                                    </Button>
                                    {categories.map((cat) => (
                                        <Button
                                            key={cat.id}
                                            variant="ghost"
                                            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                                            className={cn(
                                                "justify-start p-0 h-auto transition-all hover:text-gold hover:translate-x-1 hover:bg-transparent",
                                                selectedCategory === cat.id ? "text-gold font-bold" : "text-content-primary"
                                            )}
                                        >
                                            {cat.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-9 flex flex-col gap-6 min-w-0">
                        <ResultsHeader
                            viewMode={viewMode}
                            onViewChange={setViewMode}
                            resultsCount={total}
                            query={query}
                            onFilterClick={() => {}}
                        />
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-gold" />
                            </div>
                        ) : (
                            <ProductGrid viewMode={viewMode} products={products} />
                        )}

                        {totalPages > 1 && (
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            />
                        )}

                        {recommendedProducts.length > 0 && (
                            <div className="flex flex-col gap-4 pt-8">
                                <div className="flex flex-col gap-0.5">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gold">Você também pode gostar</div>
                                    <div className="text-2xl font-black uppercase italic text-content-primary">Recomendados</div>
                                </div>
                                <ProductGrid viewMode="grid" products={recommendedProducts} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
