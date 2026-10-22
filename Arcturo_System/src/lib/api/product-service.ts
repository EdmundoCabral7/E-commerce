import { api, buildOrgUrl } from "./axios";
import { Product, Category, ProductListResponse } from "@/lib/types/product";

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  organizationId?: string;
}): Promise<ProductListResponse> => {
  const response = await api.get("/products", { params });
  return { items: response.data.data, meta: response.data.meta };
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const url = buildOrgUrl("/categories");
  const response = await api.get(url);
  return response.data.data ?? response.data ?? [];
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get("/products", { params: { search: query, limit: 20 } });
  return response.data.data ?? [];
};

export interface CreateCategoryDto { name: string; description?: string; isActive?: boolean }
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
  const url = buildOrgUrl("/categories");
  const response = await api.post(url, data);
  return response.data.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
  const url = buildOrgUrl(`/categories/${id}`);
  const response = await api.put(url, data);
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const url = buildOrgUrl(`/categories/${id}`);
  await api.delete(url);
};
