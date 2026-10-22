"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import { SectionHeader } from "./SectionHeader";
import { ProductList } from "./ProductList";

interface ProductSectionProps {
    title: string;
}

export const ProductSection = ({ title }: ProductSectionProps) => {
    const { data, isLoading } = useProducts();
    const products = data?.items ?? [];

    if (isLoading) return <div className="p-10 text-center text-content-muted">Carregando...</div>;

    return (
        <div className="w-full relative">
            <SectionHeader title={title} />
            <div className="py-2">
                <ProductList products={products} />
            </div>
        </div>
    );
};
