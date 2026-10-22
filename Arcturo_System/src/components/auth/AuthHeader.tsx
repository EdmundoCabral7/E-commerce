"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="flex flex-col items-center gap-6 pt-6 pb-2">
      <div className="font-heading text-xl tracking-widest uppercase select-none">
        <span className="text-gold">Arcturo</span>
        <span className="text-content-primary">Shop</span>
      </div>

      <div className="flex w-full">
        <Link
          href="/login"
          className="flex-1 flex flex-col items-center gap-2 pb-3 transition-colors"
        >
          <div className={`text-sm font-semibold tracking-wide transition-colors ${isLogin ? "text-content-primary" : "text-content-muted"}`}>
            Login
          </div>
          <div className={`h-[2px] w-full rounded-full transition-colors ${isLogin ? "bg-gold" : "bg-transparent"}`} />
        </Link>

        <Link
          href="/register"
          className="flex-1 flex flex-col items-center gap-2 pb-3 transition-colors"
        >
          <div className={`text-sm font-semibold tracking-wide transition-colors ${!isLogin ? "text-content-primary" : "text-content-muted"}`}>
            Cadastro
          </div>
          <div className={`h-[2px] w-full rounded-full transition-colors ${!isLogin ? "bg-gold" : "bg-transparent"}`} />
        </Link>
      </div>
    </div>
  );
}
