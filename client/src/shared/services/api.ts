// ============================================================
// src/shared/services/api.ts
// ============================================================

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
  api.get('/products').then((r) => r.data);

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
  api.get('/orders').then((r) => r.data);

export const getUserOrders = (userId: number) =>
  api.get(`/orders/user/${userId}`).then((r) => r.data);

export const updateOrderStatus = (id: number, status: string) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

export const submitOrderRating = (orderId: number, ratings: Record<number, number>) =>
  api.post(`/orders/${orderId}/rating`, { ratings }).then((r) => r.data);

// ── Cart ──────────────────────────────────────────────────────
export const getCart = () =>
  api.get('/cart').then((r) => r.data);

export const addToCart = (productId: number, quantity: number) =>
  api.post('/cart/add', { productId, quantity }).then((r) => r.data);

export const removeFromCart = (id: number) =>
  api.delete(`/cart/${id}`).then((r) => r.data);

// ── Sales ─────────────────────────────────────────────────────
export const getSalesData = () =>
  api.get('/sales-data').then((r) => r.data);

// ── Re-export types (for backward compat) ────────────────────
export type { Order, OrderItem, Product, Category } from '../types';
