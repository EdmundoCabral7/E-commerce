"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BANNERS = [
    {
        id: 1,
        title: "OFERTAS IMPERDÍVEIS",
        subtitle: "Válido até 30/04/2026",
        highlight: "QUALIDADE ARCTUROSHOP",
        discount: "ATÉ 40% OFF",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
        bgColor: "#D9CC9F",
        textColor: "text-black",
        pillBg: "bg-black text-white"
    },
    {
        id: 2,
        title: "TECNOLOGIA DE PONTA",
        subtitle: "As melhores marcas",
        highlight: "ENVIO IMEDIATO",
        discount: "EM ATÉ 12X",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
        bgColor: "#8FA6CC",
        textColor: "text-white",
        pillBg: "bg-white text-blue-600"
    }
];

export const BannerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[650px] overflow-hidden group rounded-3xl">
            <div className="flex w-full h-full relative">
                {BANNERS.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center ${currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                        style={{ backgroundColor: banner.bgColor }}
                    >
                        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 relative z-20 pb-0">
                            <div className="flex flex-col gap-4 md:gap-6 max-w-lg">
                                <div className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] md:leading-[1] tracking-tight ${banner.textColor || "text-obsidian-nav"}`}>
                                    {banner.title}
                                </div>

                                <div className="flex gap-2 items-center">
                                    <div className={`${banner.pillBg || "bg-obsidian-nav text-white"} text-[9px] md:text-xs font-bold px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase`}>
                                        {banner.highlight}
                                    </div>
                                    <div className={`bg-black/5 backdrop-blur-sm ${banner.textColor || "text-obsidian-nav"} text-[9px] md:text-xs font-bold px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase border border-current/10`}>
                                        {banner.discount}
                                    </div>
                                </div>

                                <div className={`text-xs md:text-sm font-bold tracking-widest uppercase opacity-70 ${banner.textColor || "text-obsidian-nav"}`}>
                                    {banner.subtitle}
                                </div>
                            </div>

                            <div className="hidden lg:block w-[550px] h-[500px] relative">
                                <img
                                    src={banner.image}
                                    alt=""
                                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-border/50 md:bg-border backdrop-blur-md size-10 md:size-16 flex items-center justify-center rounded-full border border-border text-gold opacity-0 md:group-hover:opacity-100 transition-all hover:bg-border hover:scale-110 hidden md:flex"
            >
                <ChevronLeft className="size-6 md:size-10" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-border/50 md:bg-border backdrop-blur-md size-10 md:size-16 flex items-center justify-center rounded-full border border-border text-gold opacity-0 md:group-hover:opacity-100 transition-all hover:bg-border hover:scale-110 hidden md:flex"
            >
                <ChevronRight className="size-6 md:size-10" />
            </Button>

            <div className="absolute bottom-8 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {BANNERS.map((_, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 md:h-2 rounded-full p-0 transition-all duration-500 ${currentIndex === index ? "bg-obsidian-nav w-8 md:w-10" : "bg-obsidian-nav/20 w-1.5 md:w-2"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};
