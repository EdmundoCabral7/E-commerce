"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const ResizableNavbar = ({
  navItems,
  logo,
  actions,
}: {
  navItems: { title: string; href: string }[];
  logo?: React.ReactNode;
  actions?: React.ReactNode | ((setOpen: (open: boolean) => void) => React.ReactNode);
}) => {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      if (current < 0.05) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "flex w-full fixed top-0 inset-x-0 mx-auto z-[5000] items-center justify-center transition-all duration-300 px-4",
          !isScrolled
            ? "bg-obsidian-nav/80 backdrop-blur-md border-b border-border h-16 md:h-20"
            : "top-4"
        )}
      >
        <div
          className={cn(
            "flex w-full items-center justify-between transition-all duration-300",
            isScrolled
              ? "max-w-4xl bg-background/80 backdrop-blur-md border border-border shadow-none rounded-full px-4 py-2"
              : "max-w-7xl px-0"
          )}
        >
          <div className="flex items-center">{logo}</div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <div key={idx}>
                <Link href={item.href} className="text-content-muted hover:text-content-primary text-lg font-semibold transition-colors">
                  {item.title}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {typeof actions === 'function' ? actions(setOpen) : actions}
            </div>
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger nativeButton={false} render={
                  <div className="cursor-pointer text-content-primary p-1 hover:bg-obsidian-hover rounded-full transition-colors">
                    <Menu className="size-6" />
                  </div>
                } />
                <SheetContent side="right" className="w-[300px] bg-obsidian-nav border-border p-0">
                  <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-left">{logo}</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col p-6 gap-8">
                    <div className="flex flex-col gap-4">
                      <div className="text-[10px] font-black text-content-muted uppercase tracking-[0.2em]">Navegação</div>
                      <div className="flex flex-col gap-2">
                        {navItems.map((item, idx) => (
                          <Link key={idx} href={item.href} onClick={() => setOpen(false)} className="text-2xl font-bold text-content-primary hover:text-gold transition-colors py-1">
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-border flex flex-col gap-4">
                      <div className="text-[10px] font-black text-content-muted uppercase tracking-[0.2em]">Preferências e Conta</div>
                      <div className="flex flex-col gap-8">
                        {typeof actions === 'function' ? actions(setOpen) : actions}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

