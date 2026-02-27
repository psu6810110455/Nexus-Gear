export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string;
  image_url?: string;
  category?: Category | string;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CategoryCount {
  name: string;
  count: number;
}