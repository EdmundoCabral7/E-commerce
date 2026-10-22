import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavoritesAPI, toggleFavoriteAPI } from "@/lib/api/favorite-service";
import { useUserStore } from "@/lib/store/useUserStore";

export const useFavorites = () => {
    const { isAuthenticated } = useUserStore();
    return useQuery({
        queryKey: ["favorites"],
        queryFn: getFavoritesAPI,
        enabled: isAuthenticated,
    });
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => toggleFavoriteAPI(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });
};
