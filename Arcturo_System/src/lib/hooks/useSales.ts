import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSales, updateSaleStatus } from "@/lib/api/sales-service";

export const useSales = (params?: { status?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["sales", params],
        queryFn: () => getSales(params),
    });
};

export const useUpdateSaleStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ saleId, status }: { saleId: string; status: string }) =>
            updateSaleStatus(saleId, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["sales"] }),
    });
};
