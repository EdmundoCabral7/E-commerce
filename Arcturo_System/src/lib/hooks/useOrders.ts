import { useQuery } from "@tanstack/react-query";
import { getOrderHistoryAPI } from "@/lib/api/order-service";
import { useUserStore } from "@/lib/store/useUserStore";

export const useOrderHistory = () => {
    const { isAuthenticated } = useUserStore();
    return useQuery({
        queryKey: ["order-history"],
        queryFn: getOrderHistoryAPI,
        enabled: isAuthenticated,
    });
};
