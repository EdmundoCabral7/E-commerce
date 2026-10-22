import { AdminLayoutWrapper } from "@/components/dashboard/admin-layout-wrapper"
import { AdminGuard } from "@/components/auth/AdminGuard"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminLayoutWrapper>
                {children}
            </AdminLayoutWrapper>
        </AdminGuard>
    )
}
