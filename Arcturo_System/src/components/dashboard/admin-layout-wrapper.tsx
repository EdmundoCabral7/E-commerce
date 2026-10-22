"use client";

import { usePathname } from "next/navigation";
import { AdminLayout } from "./admin-layout";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === "/auth" || pathname?.startsWith("/auth/")) {
        return <div className="bg-[#ebebeb] min-h-screen flex flex-col">{children}</div>;
    }

    return <AdminLayout>{children}</AdminLayout>;
}
