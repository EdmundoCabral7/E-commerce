"use client";

import { useProduct } from "@/lib/hooks/useProducts";
import ProductVariant_01 from "@/components/commerce-ui/product-variants-01";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";

export function ProductDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id as string);
  const { addItem, items } = useCart();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian-page">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian-page">
        <div className="text-xl font-black text-red-500 uppercase tracking-widest">Produto não encontrado</div>
      </div>
    );
  }

  const displayName = product.name ?? product.title ?? "Produto";
  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const rawImages = (product.images ?? []) as unknown[];
  const imageUrls = rawImages
    .map((img) => (typeof img === "string" ? img : (img as { url?: string })?.url))
    .filter(Boolean) as string[];
  const gallery = imageUrls.length > 0 ? imageUrls : product.imageUrl ? [product.imageUrl] : [];

  const variants = [
    {
      label: "Padrão",
      value: "default",
      price,
      isInStock: product.stock > 0,
      availableQuantity: product.stock,
      imageUrl: gallery[0],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-obsidian-page">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 flex items-center gap-4 text-[12px] font-black uppercase tracking-widest">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-auto p-0 flex items-center gap-2 text-content-primary hover:text-gold transition-colors cursor-pointer bg-transparent hover:bg-transparent shadow-none"
          >
            <ChevronLeft className="size-4" />
            <div>Voltar</div>
          </Button>

          <div className="w-px h-4 bg-border" />

          <div className="flex items-center gap-2 text-content-muted">
            <Link href="/" className="hover:text-gold transition-colors uppercase">Home</Link>
            <ChevronRight className="size-3" />
            <div className="text-content-primary">"{displayName}"</div>
          </div>
        </div>

        <ProductVariant_01
          productId={product.id}
          title={displayName}
          description={product.description ?? undefined}
          category={product.category?.name}
          variants={variants}
          defaultImage={gallery[0]}
          gallery={gallery.slice(1)}
          badge={product.stock > 0 ? "Disponível" : "Esgotado"}
          shippingInfo="Envio imediato"
          seller={{
            id: product.organizationId ?? "1",
            name: "ArcturoShop",
            salesCount: "+1.000",
            stockCount: product.stock,
          }}
          onAddToCart={() => {
            const inCart = items.find(i => i.id === product.id)?.quantity ?? 0;
            if (inCart < product.stock) addItem(product);
          }}
          onBuyNow={() => {
            const inCart = items.find(i => i.id === product.id)?.quantity ?? 0;
            if (inCart < product.stock) addItem(product);
            router.push("/cart");
          }}
        />
      </div>
    </div>
  );
}
