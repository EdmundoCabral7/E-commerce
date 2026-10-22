import { api, buildOrgUrl } from "./axios";
import { Product } from "@/lib/types/product";

export interface DashboardMetrics {
    products: { total: number; totalStock: number };
    engagement: { totalReviews: number; pendingQuestions: number };
    sales: { totalItemsSold: number };
    timestamp: string;
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: string;
    isActive?: boolean;
    organizationId: string;
}

export const getAdminProducts = async (): Promise<Product[]> => {
    const url = buildOrgUrl("/products");
    const response = await api.get(url);
    return response.data.data?.items ?? response.data.data ?? [];
};

export const createAdminProduct = async (data: CreateProductDto & { images?: File[] }): Promise<Product> => {
    const url = buildOrgUrl("/products");
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (key === "images") return;
        if (val !== undefined && val !== null) formData.append(key, String(val));
    });
    data.images?.forEach((file) => formData.append("images", file));
    const response = await api.post(url, formData);
    return response.data.data;
};

export const updateAdminProduct = async (id: string, data: Partial<CreateProductDto> & { images?: File[] }): Promise<Product> => {
    const url = buildOrgUrl(`/products/${id}`);
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (key === "images") return;
        if (val !== undefined && val !== null) formData.append(key, String(val));
    });
    data.images?.forEach((file) => formData.append("images", file));
    const response = await api.put(url, formData);
    return response.data.data;
};

export const deleteAdminProduct = async (id: string): Promise<void> => {
    const url = buildOrgUrl(`/products/${id}`);
    await api.delete(url);
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const url = buildOrgUrl("/dashboard");
    const response = await api.get(url);
    return response.data.data;
};

export interface SalesSummary {
    monthlyRevenue: number | string;
    totalPaidSales: number;
    topProductId: string | null;
    topProductQuantity: number;
}

export const getSalesSummary = async (): Promise<SalesSummary> => {
    const url = buildOrgUrl("/sales/report/summary");
    const response = await api.get(url);
    return response.data.data;
};
