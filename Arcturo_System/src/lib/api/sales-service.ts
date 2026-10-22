import { api, buildOrgUrl } from "./axios";

export interface Sale {
    id: string;
    buyerName: string;
    buyerEmail: string;
    status: string;
    total: number | string;
    paymentMethod: string;
    createdAt: string;
    items?: Array<{ productName?: string; quantity: number; price: number | string }>;
}

export interface SalesListResponse {
    items: Sale[];
    meta: { total: number };
}

export interface CheckoutItem {
    productId: string;
    quantity: number;
}

export interface CheckoutDTO {
    buyerName: string;
    buyerEmail: string;
    paymentMethod: string;
    items: CheckoutItem[];
    promotionId?: string;
    orgId: string;
}

export const getSales = async (params?: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<SalesListResponse> => {
    const url = buildOrgUrl("/sales");
    const response = await api.get(url, { params });
    return {
        items: response.data.data ?? [],
        meta: response.data.meta ?? { total: 0 },
    };
};

export const createCheckout = async ({ orgId, ...data }: CheckoutDTO): Promise<Sale> => {
    const response = await api.post(`/org/${orgId}/sales`, data);
    return response.data.data ?? response.data;
};

export const updateSaleStatus = async (saleId: string, status: string): Promise<Sale> => {
    const url = buildOrgUrl(`/sales/${saleId}/status`);
    const response = await api.patch(url, { status });
    return response.data.data;
};
