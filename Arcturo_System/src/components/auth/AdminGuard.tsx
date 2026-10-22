"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { UserProfile, Membership } from "@/lib/types/auth";

function hasAdminAccess(user: UserProfile | null): boolean {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    return user.memberships?.some((m: Membership) =>
        ["OWNER", "ADMIN", "STAFF"].includes(m.role)
    ) ?? false;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, user } = useUserStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        if (!isAuthenticated || !hasAdminAccess(user)) {
            router.replace("/admin-login");
        }
    }, [hydrated, isAuthenticated, user, router]);

    if (!hydrated || !isAuthenticated || !hasAdminAccess(user)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-obsidian-page">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-gold" />
            </div>
        );
    }

    return <>{children}</>;
}
