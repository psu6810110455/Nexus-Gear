// src/shared/services/api.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({ baseURL: BASE_URL });

// ── Auto-attach token ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────
export const loginApi = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const registerApi = (name: string, email: string, password: string) =>
  api.post('/users/register', { name, email, password }).then((r) => r.data);

// ── Products ──────────────────────────────────────────────────
export const getProducts = () =>
  api.get('/products?includeHidden=true').then((r) => r.data);

export const getProductById = (id: string | number) =>
  api.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (data: object) =>
  api.post('/products', data).then((r) => r.data);

export const updateProduct = (id: number, data: object) =>
  api.patch(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`).then((r) => r.data);

// ── Categories ────────────────────────────────────────────────
export const getCategories = () =>
  api.get('/categories').then((r) => r.data);

export const createCategory = (name: string) =>
  api.post('/categories', { name }).then((r) => r.data);

export const updateCategory = (id: number, name: string) =>
  api.patch(`/categories/${id}`, { name }).then((r) => r.data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`).then((r) => r.data);

// ── Orders ────────────────────────────────────────────────────
export const getOrders = () =>
  api.get('/api/orders').then((r) => r.data);

export const getMyOrders = () =>                                    // ✅ ใช้ token แทน userId
  api.get('/api/orders/my-orders').then((r) => r.data);

export const getUserOrders = (userId: number) =>
  api.get(`/api/orders/user/${userId}`).then((r) => r.data);

export const updateOrderStatus = (id: number, status: string) =>
  api.patch(`/api/orders/${id}/status`, { status }).then((r) => r.data);

// รองรับทั้ง ratings (ดาว) และ reviews (ข้อความรีวิว)
export const submitOrderRating = (
  orderId: number,
  ratings: Record<number, number>,
  reviews?: Record<number, string>,
) => api.post(`/api/orders/${orderId}/rating`, { ratings, reviews }).then((r) => r.data);

// ยกเลิกคำสั่งซื้อ (ลูกค้า) — ได้เฉพาะสถานะ pending / paid
export const cancelOrder = (orderId: number, reason: string) =>
  api.patch(`/api/orders/${orderId}/cancel`, { reason }).then((r) => r.data);

// ── Cart ──────────────────────────────────────────────────────
export const getCart = () =>
  api.get('/api/cart').then((r) => r.data);

export const addToCart = (productId: number, quantity: number) =>
  api.post('/api/cart/add', { productId, quantity }).then((r) => r.data);

export const removeFromCart = (id: number) =>
  api.delete(`/api/cart/${id}`).then((r) => r.data);

// ── Sales ─────────────────────────────────────────────────────
export const getSalesData = () =>
  api.get('/sales-data').then((r) => r.data);

// ── Re-export types ───────────────────────────────────────────
export type { Order, OrderItem, Product, Category } from '../types';

export default api;