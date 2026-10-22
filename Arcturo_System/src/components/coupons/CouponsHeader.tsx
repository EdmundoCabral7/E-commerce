import { CouponFormModal } from "@/components/coupons/CouponFormModal";
export function CouponsHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
                <div className="text-3xl font-extrabold text-content-primary tracking-tight">
                    Cupons de Desconto
                </div>
                <div className="text-base text-content-muted font-medium">
                    Gerencie e crie novas campanhas promocionais para seus clientes.
                </div>
            </div>
            <div className="flex-shrink-0">
                <CouponFormModal />
            </div>
        </div>
    );
}