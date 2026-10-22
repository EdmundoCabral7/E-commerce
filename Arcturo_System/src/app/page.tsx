import { BannerCarousel } from "@/components/home/BannerCarousel";
import { CategoryBar } from "@/components/home/CategoryBar";
import { ProductSection } from "@/components/products/ProductSection";

export default function Home() {
  return (
    <div className="min-h-dvh bg-obsidian-page pb-24 md:pb-20">
      <div className="w-full max-w-[1550px] mx-auto px-2 md:px-4 pt-2 md:pt-4">
        <BannerCarousel />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 md:px-6 mt-6 md:mt-12 flex flex-col gap-6 md:gap-12">

        <div className="w-full">
          <div className="mb-6 md:mb-8">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-content-primary tracking-tight leading-tight">
               Explore nossas <em className="italic text-gold">categorias</em> com
               <br className="hidden md:block" />
               descontos exclusivos.
            </div>
          </div>
          <CategoryBar />
        </div>

        <div className="w-full flex flex-col gap-6 md:gap-12">
           <ProductSection title="Inspirado no último visto" />
           <ProductSection title="OFERTAS DO DIA" />
        </div>
      </div>
    </div>
  );
}
