import { api } from "./axios";

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number | string;
    subtotal?: number | string;
    product?: {
        id: string;
        name: string;
        imageUrl?: string | null;
    };
}

export interface Order {
    id: string;
    status: string;
    total: number | string;
    discount?: number | string;
    paymentMethod: string;
    buyerName: string;
    buyerEmail: string;
    createdAt: string;
    items: OrderItem[];
}

export const getOrderHistoryAPI = async (): Promise<Order[]> => {
    const response = await api.get("/orders/history");
    return response.data.data ?? [];
};
