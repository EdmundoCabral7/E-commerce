import { api } from "./axios";

export const addItemToCartAPI = async (productId: string, quantity: number) => {
  const response = await api.post('/cart/add', { productId, quantity });
  return response.data.data ?? response.data;
};

export const getCartAPI = async () => {
  const response = await api.get('/cart');
  return response.data.data ?? response.data;
};

export const syncCartWithBackend = async (items: { productId: string; quantity: number }[]) => {
  const results = await Promise.all(
    items.map((item) => addItemToCartAPI(item.productId, item.quantity))
  );
  return results;
};

export const removeItemFromCartAPI = async (productId: string) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data.data ?? response.data;
};

export const updateItemQuantityAPI = async (productId: string, quantity: number) => {
  const response = await api.patch('/cart/update', { productId, quantity });
  return response.data.data ?? response.data;
};
