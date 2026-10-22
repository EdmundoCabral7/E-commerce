"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin-login") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/wallet") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/inventory") ||
    pathname?.startsWith("/coupons") ||
    pathname?.startsWith("/categories") ||
    pathname?.startsWith("/team") ||
    pathname?.startsWith("/sales") ||
    pathname?.startsWith("/delivery");


  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 pt-24 bg-obsidian-page">
        {children}
      </div>
      <Footer />
    </>
  );
}
