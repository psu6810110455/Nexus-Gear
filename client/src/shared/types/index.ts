// ============================================================
// src/shared/types/index.ts
// ============================================================

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock?: number;
  imageUrl?: string;
  image_url?: string;
  isHidden?: boolean;
  category?: Category | string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: { name: string; image_url: string };
  rating?: number;
  review?: string;
}

export interface Order {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
  shipping_address: string;
  items: OrderItem[];
  is_rated?: boolean;
  user?: { username: string; email?: string };
  payment?: { slip_image_url?: string; method?: string };
}

export interface CartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  total_price: string;
}

export interface SalesData {
  name: string;
  sales: number;
}