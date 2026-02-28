// ============================================================
// src/types/index.ts
// รวม Types / Interfaces ทั้งหมดไว้ที่เดียว
// ============================================================

// ---------- AUTH ----------
export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

// ---------- CATEGORY ----------
export interface Category {
  id: number;
  name: string;
}

// ---------- PRODUCT ----------
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock?: number;
  imageUrl?: string;
  image_url?: string;
  category?: Category | string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
}

// ---------- CART ----------
export interface CartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  total_price: string;
}

// ---------- ORDER ----------
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'to_ship'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: {
    name: string;
    price?: string;
    image_url?: string;
  };
  rating?: number;
}

export interface Order {
  id: number;
  user?: {
    username: string;
    email: string;
  };
  total_price: string;
  status: OrderStatus;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
  is_rated?: boolean;
}

// ---------- DASHBOARD ----------
export interface SalesData {
  name: string;
  sales: number;
}