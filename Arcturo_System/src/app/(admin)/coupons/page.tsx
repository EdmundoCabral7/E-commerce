import { CouponsHeader } from "@/components/coupons/CouponsHeader";
import { CouponsList } from "@/components/coupons/CouponsList";

export default function CouponsPage() {
    return (
        <div className="flex flex-col gap-8 w-full">
            <CouponsHeader />
            <CouponsList />
        </div>
    );
}
