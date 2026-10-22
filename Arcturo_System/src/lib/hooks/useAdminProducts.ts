import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    getDashboardMetrics,
    getSalesSummary,
    CreateProductDto,
} from "@/lib/api/admin-service";

export const useAdminProducts = () => {
    return useQuery({
        queryKey: ["admin-products"],
        queryFn: getAdminProducts,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductDto & { images?: File[] }) => createAdminProduct(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductDto> & { images?: File[] } }) =>
            updateAdminProduct(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAdminProduct(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
    });
};

export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: ["dashboard-metrics"],
        queryFn: getDashboardMetrics,
    });
};

export const useSalesSummary = () => {
    return useQuery({
        queryKey: ["sales-summary"],
        queryFn: getSalesSummary,
    });
};
