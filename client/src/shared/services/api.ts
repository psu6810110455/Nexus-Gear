// ============================================================
// src/services/api.ts
// Service Layer — API calls ทั้งหมดอยู่ที่นี่
// ============================================================

import axios from 'axios';
import type { Order, OrderItem, Product, CartItem, Category, SalesData } from '../types/index';


const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth Token interceptor ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ══════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════
export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get<Order[]>('/orders');
  return res.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
  const res = await api.patch<Order>(`/orders/${id}/status`, { status });
  return res.data;
};

export const getUserOrders = async (userId: number): Promise<Order[]> => {
  const res = await api.get<Order[]>(`/orders/user/${userId}`);
  return res.data;
};

export const submitOrderRating = async (
  orderId: number,
  ratings: Record<number, number>
): Promise<void> => {
  await api.post(`/orders/${orderId}/rate`, { ratings });
};

// ══════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════
export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>(`/products?t=${Date.now()}`);
  return res.data;
};

export const createProduct = async (payload: Omit<Product, 'id'>): Promise<Product> => {
  const res = await api.post<Product>('/products', payload);
  return res.data;
};

export const updateProduct = async (id: number, payload: Partial<Product>): Promise<Product> => {
  const res = await api.patch<Product>(`/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const getProductById = async (id: number): Promise<Product> => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

// ══════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════
export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories');
  return res.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const res = await api.post<Category>('/categories', { name });
  return res.data;
};

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  const res = await api.patch<Category>(`/categories/${id}`, { name });
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

// ══════════════════════════════════════════════════════════════
// CART
// ══════════════════════════════════════════════════════════════
export const getCart = async (): Promise<CartItem[]> => {
  const res = await api.get<CartItem[]>('/cart');
  return res.data;
};

export const addToCart = async (productId: number, quantity: number): Promise<void> => {
  await api.post('/cart/add', { productId, quantity });
};

export const removeFromCart = async (cartItemId: number): Promise<void> => {
  await api.delete(`/cart/${cartItemId}`);
};

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
export const getSalesData = async (): Promise<SalesData[]> => {
  const res = await api.get<SalesData[]>('/sales-data');
  return res.data;
};

// ══════════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════════
export const login = async (
  email: string,
  password: string
): Promise<{ access_token: string }> => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ message: string }> => {
  const res = await api.post('/users/register', { name, email, password });
  return res.data;
};

export default api;
export type { Order, OrderItem, Product, CartItem, Category, SalesData };