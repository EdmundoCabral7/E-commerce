import { api } from "./axios";
import { Product } from "@/lib/types/product";

export interface Favorite {
    id: string;
    productId: string;
    userId: string;
    createdAt: string;
    product: Product;
}

export const getFavoritesAPI = async (): Promise<Favorite[]> => {
    const response = await api.get("/favorites");
    return response.data.data ?? [];
};

export const toggleFavoriteAPI = async (productId: string): Promise<{ favorited: boolean }> => {
    const response = await api.post(`/products/${productId}/favorite`);
    return response.data.data;
};
