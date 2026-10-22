import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    CreatePromotionDto,
    UpdatePromotionDto,
} from "@/lib/api/promotion-service";

export const usePromotions = () =>
    useQuery({ queryKey: ["promotions"], queryFn: getPromotions });

export const useCreatePromotion = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePromotionDto) => createPromotion(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
    });
};

export const useUpdatePromotion = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePromotionDto }) =>
            updatePromotion(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
    });
};

export const useDeletePromotion = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePromotion(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
    });
};
