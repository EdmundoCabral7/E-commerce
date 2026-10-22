import { api, buildOrgUrl } from "./axios";

export type PromotionType = "PERCENTAGE" | "FIXED";

export interface Promotion {
    id: string;
    name: string;
    type: PromotionType;
    value: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    minOrderValue: number;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePromotionDto {
    name: string;
    type: PromotionType;
    value: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    minOrderValue?: number;
}

export type UpdatePromotionDto = Partial<CreatePromotionDto>;

export const getPromotions = async (): Promise<Promotion[]> => {
    const url = buildOrgUrl("/promotions");
    const response = await api.get(url);
    return response.data.data ?? [];
};

export const createPromotion = async (data: CreatePromotionDto): Promise<Promotion> => {
    const url = buildOrgUrl("/promotions");
    const response = await api.post(url, data);
    return response.data.data;
};

export const updatePromotion = async (id: string, data: UpdatePromotionDto): Promise<Promotion> => {
    const url = buildOrgUrl(`/promotions/${id}`);
    const response = await api.put(url, data);
    return response.data.data;
};

export const deletePromotion = async (id: string): Promise<void> => {
    const url = buildOrgUrl(`/promotions/${id}`);
    await api.delete(url);
};
