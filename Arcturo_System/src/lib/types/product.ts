export interface ProductImage {
  url: string;
  public_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
}

export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string | null;
  price: number | string;
  stock: number;
  imageUrl?: string | null;
  images?: ProductImage[] | null;
  isActive?: boolean;
  createdAt?: string;
  category?: Category | null;
  categoryId?: string | null;
  organizationId?: string;
}

export interface ProductListMeta {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export interface ProductListResponse {
  items: Product[];
  meta: ProductListMeta;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
