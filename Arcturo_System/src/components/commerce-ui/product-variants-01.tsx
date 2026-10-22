"use client";

import ImageViewer from "@/components/commerce-ui/image-viewer-basic";
import PriceFormat_Sale from "@/components/commerce-ui/price-format-sale";
import QuantityInputBasic from "@/components/commerce-ui/quantity-input-basic";
import VariantSelectorBasic, {
  VariantItem as BaseVariantItem,
} from "@/components/commerce-ui/variant-selector-basic";
import { Button } from "@/components/ui/button";
import { Clock, Leaf, Shield, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProductQuestions from "@/components/products/ProductQuestions";
import ProductReviews from "@/components/products/ProductReviews";
import { SellerCard } from "@/components/products/SellerCard";

interface VariantItem extends BaseVariantItem {
  price: number;
  salePrice?: number;
  imageUrl?: string;
  isInStock?: boolean;
  availableQuantity?: number | null;
}

interface VariantSelectionPayload {
  variantId: string;
  variantLabel: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  totalPrice: number;
  isOnSale: boolean;
}

interface ProductVariant01Props {
  productId?: string;
  title?: string;
  description?: string;
  category?: string;
  badge?: string | null;
  shippingInfo?: string;
  variants: VariantItem[];
  defaultImage?: string;
  gallery?: string[];
  initialVariant?: string;
  variantLabel?: string;
  onAddToCart?: (payload: VariantSelectionPayload) => void;
  onBuyNow?: (payload: VariantSelectionPayload) => void;
  selectedVariant?: string;
  onVariantChange?: (variant: string) => void;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  seller?: {
    id: string;
    name: string;
    salesCount: string;
    stockCount: number;
  };
}

const ProductVariant_01 = ({
  productId = "",
  badge = "Novo",
  category = "",
  defaultImage,
  description = "",
  errorMessage = null,
  gallery = [],
  initialVariant,
  isLoading = false,
  onAddToCart = () => { },
  onBuyNow = () => { },
  onQuantityChange,
  onVariantChange,
  quantity: controlledQuantity,
  selectedVariant: controlledVariant,
  shippingInfo,
  title = "",
  variantLabel = "Opções",
  variants,
  seller = {
    id: "123",
    name: "Arcturo Tech Official",
    salesCount: "+50.000",
    stockCount: 150,
  },
}: ProductVariant01Props) => {
  const [internalSelectedVariant, setInternalSelectedVariant] = useState(initialVariant || (variants[0]?.value || ""));
  const [internalQuantity, setInternalQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(defaultImage || gallery[0] || "");
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  useEffect(() => {
    if (defaultImage || gallery[0]) {
      setActiveImage(defaultImage || gallery[0]);
    }
  }, [defaultImage, gallery]);

  if (!variants.length) {
    return <div className="p-4 text-red-500 font-bold">Nenhuma variante disponível</div>;
  }

  const isVariantControlled = controlledVariant !== undefined;
  const isQuantityControlled = controlledQuantity !== undefined;

  const selectedVariantId = isVariantControlled ? controlledVariant : internalSelectedVariant;
  const quantity = isQuantityControlled ? controlledQuantity : internalQuantity;

  const handleVariantChange = (newVariant: string) => {
    if (isVariantControlled) {
      onVariantChange?.(newVariant);
    } else {
      setInternalSelectedVariant(newVariant);
    }
    const vari = variants.find(v => v.value === newVariant);
    if (vari?.imageUrl) setActiveImage(vari.imageUrl);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (isQuantityControlled) {
      onQuantityChange?.(newQuantity);
    } else {
      setInternalQuantity(newQuantity);
    }
  };

  const selectedVariant = variants.find((v) => v.value === selectedVariantId) || variants[0];
  const currentPrice = selectedVariant.price;
  const currentSalePrice = selectedVariant.salePrice;
  const isOnSale = currentSalePrice !== undefined && currentSalePrice < currentPrice;
  const isInStock = selectedVariant.isInStock !== undefined ? selectedVariant.isInStock : true;
  const availableQuantity = selectedVariant.availableQuantity;
  const effectivePrice = isOnSale ? currentSalePrice : currentPrice;

  const handleAddToCart = () => {
    onAddToCart({
      isOnSale,
      originalPrice: isOnSale ? currentPrice : undefined,
      price: currentPrice,
      quantity,
      salePrice: isOnSale ? currentSalePrice : undefined,
      totalPrice: quantity * effectivePrice,
      variantId: selectedVariantId,
      variantLabel: selectedVariant?.label || "",
    });
  };

  const handleBuyNow = () => {
    onBuyNow({
      isOnSale,
      originalPrice: isOnSale ? currentPrice : undefined,
      price: currentPrice,
      quantity,
      salePrice: isOnSale ? currentSalePrice : undefined,
      totalPrice: quantity * effectivePrice,
      variantId: selectedVariantId,
      variantLabel: selectedVariant?.label || "",
    });
  };

  if (errorMessage) {
    return (
      <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-6 text-red-600">
        <div className="font-bold">Erro ao carregar produto</div>
        <div className="text-sm">{errorMessage}</div>
      </div>
    );
  }

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const galleryList = gallery.length > 0 ? gallery : [defaultImage || ""];

  return (
    <div className="flex flex-col gap-6 md:gap-16 max-w-7xl mx-auto px-4 md:px-6 my-4 md:my-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="hidden md:flex flex-col gap-3 w-20 flex-shrink-0">
              {galleryList.map((img, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-20 h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all bg-white shadow-none hover:shadow-none",
                    activeImage === img ? "border-gold scale-105" : "border-border hover:border-gold/30"
                  )}
                  onClick={() => setActiveImage(img)}
                >
                  {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden bg-white border border-border shadow-none aspect-square flex-1 flex items-center justify-center p-4">
              {badge && (
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 bg-gold text-obsidian-nav px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-none">
                  {badge}
                </div>
              )}
              <ImageViewer
                imageUrl={activeImage}
                classNameThumbnailViewer="w-full h-full object-contain max-h-[400px] md:max-h-[600px]"
              />
            </div>

            <div className="flex md:hidden gap-1.5 pb-4 justify-center items-center">
              {galleryList.map((img, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  className={cn(
                    "w-1.5 h-1.5 rounded-full p-0 transition-all min-w-0",
                    activeImage === img ? "bg-gold scale-125 hover:bg-gold" : "bg-border/40 hover:bg-border/60"
                  )}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-8 max-w-2xl px-2">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-content-muted">
              A Essência do Design
            </div>
            <div className="text-xl font-medium text-content-primary leading-relaxed italic border-l-2 border-gold pl-6">
              "Este produto é o resultado de uma busca incansável pela perfeição técnica aliada ao conforto atemporal. Cada detalhe foi meticulosamente planejado para elevar sua experiência cotidiana."
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 items-start">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              {badge && (
                <span className="text-[10px] font-black uppercase text-gold bg-gold/10 px-2 py-0.5 rounded">
                  {badge}
                </span>
              )}
              {category && (
                <span className="text-[10px] font-black uppercase text-content-muted tracking-widest">
                  {category}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black text-content-primary tracking-tight leading-tight mt-1">
              {title}
            </h1>
            
            <div className="flex flex-col gap-1 mt-2">
              <PriceFormat_Sale
                originalPrice={currentPrice}
                salePrice={isOnSale ? currentSalePrice : undefined}
                showSavePercentage
                className="items-baseline gap-2"
                classNameOriginalPrice="text-sm text-content-muted line-through"
                classNameSalePrice="text-3xl md:text-4xl font-black text-gold"
                classNameSalePercentage="text-[10px] font-black uppercase text-green-500"
              />
            </div>
          </div>

          {variants.length > 1 && (
            <div className="flex flex-col gap-4 border-y border-border py-6 w-full">
              <div className="text-xs font-black text-content-primary uppercase tracking-widest">
                {variantLabel}
              </div>
              <VariantSelectorBasic
                value={selectedVariantId}
                onValueChange={handleVariantChange}
                variants={variants.map(v => ({ ...v, label: v.label }))}
                className="grid-cols-2 sm:grid-cols-3"
                itemClassName="h-12 border-border bg-obsidian-nav text-content-primary data-[state=checked]:border-gold data-[state=checked]:bg-gold data-[state=checked]:text-obsidian-nav"
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-black uppercase tracking-widest text-content-primary leading-none">
                Quantidade
              </div>
              <QuantityInputBasic
                quantity={quantity}
                onChange={handleQuantityChange}
                max={availableQuantity || undefined}
                className="bg-obsidian-nav border-border rounded-xl w-fit text-content-primary"
                disabled={!isInStock}
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 w-full">
              <div className="flex flex-col gap-3 w-full">
                <Button
                  className="w-full h-14 rounded-full bg-gold text-obsidian-nav font-black tracking-wide uppercase shadow-lg hover:bg-gold/90 transition-all text-sm"
                  onClick={handleBuyNow}
                  disabled={!isInStock || isLoading}
                >
                  Comprar agora
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-14 rounded-full border border-gold/20 bg-gold/5 text-gold font-bold tracking-wide uppercase hover:bg-gold/10 transition-all text-sm"
                  onClick={handleAddToCart}
                  disabled={!isInStock || isLoading}
                >
                  Adicionar ao carrinho
                </Button>
              </div>
            </div>

            <div className="px-4 md:px-0">
              {seller && (
                <SellerCard
                  sellerId={seller.id}
                  name={seller.name}
                  salesCount={seller.salesCount}
                  stockCount={seller.stockCount}
                />
              )}
            </div>

            <div className="flex flex-col gap-4 text-content-muted leading-relaxed text-[13px] font-medium py-2 italic border-l border-border pl-4 mx-4 md:mx-0">
              <div>{description}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-card border border-border gap-3 text-center transition-hover hover:shadow-none hover:bg-obsidian-hover">
                <Truck className="size-6 text-gold" />
                <div className="text-[10px] font-black uppercase tracking-widest text-content-primary italic">Frete Rápido</div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-card border border-border gap-3 text-center transition-hover hover:shadow-none hover:bg-obsidian-hover">
                <Shield className="size-6 text-gold" />
                <div className="text-[10px] font-black uppercase tracking-widest text-content-primary italic">Garantia Total</div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-card border border-border gap-3 text-center transition-hover hover:shadow-none hover:bg-obsidian-hover">
                <Leaf className="size-6 text-gold" />
                <div className="text-[10px] font-black uppercase tracking-widest text-content-primary italic">Sustentável</div>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-card border border-border gap-3 text-center transition-hover hover:shadow-none hover:bg-obsidian-hover">
                <Clock className="size-6 text-gold" />
                <div className="text-[10px] font-black uppercase tracking-widest text-content-primary italic">Atendimento 24h</div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border">
            {[
              { id: "overview", title: "Visão Geral do Produto", content: "Este produto artesanal é fabricado com materiais de primeira linha para garantir durabilidade e performance excepcional. Cada detalhe foi pensado para proporcionar a melhor experiênca de uso no dia a dia." },
              { id: "shipping", title: "Envio e Devoluções", content: "Enviamos para todo o Brasil via transportadora expressa. O prazo de entrega é calculado no checkout. Aceitamos devoluções em até 7 dias úteis após o recebimento em perfeitas condições." },
              { id: "specs", title: "Especificações Técnicas", content: "Material: Lã Premium / Tecnologia: Isolamento Térmico Pro-Heat / Peso: 850g / Resistência à água: 10.000mm" }
            ].map((sec) => (
              <div key={sec.id} className="border-b border-border overflow-hidden text-content-primary">
                <div
                  className="flex items-center justify-between py-6 cursor-pointer hover:bg-obsidian-hover px-2 transition-colors"
                  onClick={() => toggleSection(sec.id)}
                >
                  <div className="font-black text-sm uppercase tracking-widest">{sec.title}</div>
                  {expandedSection === sec.id ? <ChevronUp className="size-4 text-gold" /> : <ChevronDown className="size-4 text-gold" />}
                </div>
                <div className={cn(
                  "overflow-hidden transition-all duration-300 px-2",
                  expandedSection === sec.id ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="text-[14px] leading-relaxed text-content-muted font-medium">
                    {sec.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductQuestions productId={productId} />
      <ProductReviews productId={productId} />
    </div>
  );
};

export default ProductVariant_01;
export type { ProductVariant01Props, VariantItem, VariantSelectionPayload };
