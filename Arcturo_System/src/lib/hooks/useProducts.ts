import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts, getProductById, searchProducts, getCategories,
  createCategory, updateCategory, deleteCategory,
  CreateCategoryDto, UpdateCategoryDto,
} from "@/lib/api/product-service";

export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  organizationId?: string;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ["search-products", query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  });
};

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: getCategories });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) => updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};
