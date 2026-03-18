import axios from 'axios';

// ดึงค่าจาก Environment Variable
const BASE_URL = import.meta.env.VITE_API_URL;

export const getServerUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const api = axios.create({ baseURL: BASE_URL });

// ── Auto-attach token ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-logout on 401 ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const getProductReviews = (productId: number | string) =>
  api.get(`/products/${productId}/reviews`).then((r) => r.data);

export const createProduct = (data: object) =>
  api.post('/products', data).then((r) => r.data);

export const updateProduct = (id: number, data: object) =>
  api.patch(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`).then((r) => r.data);

// ── Product Images (ฟังก์ชันที่หายไป) ──────────────────────────
export const uploadProductImages = (productId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((f) => formData.append('images', f));
  return api.post(`/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const deleteProductImage = (productId: number, imageId: number) =>
  api.delete(`/products/${productId}/images/${imageId}`).then((r) => r.data);

// ── Categories ────────────────────────────────────────────────
export const getCategories = () =>
  api.get('/categories').then((r) => r.data);

export const createCategory = (name: string) =>
  api.post('/categories', { name }).then((r) => r.data);

export const updateCategory = (id: number, name: string) =>
  api.patch(`/categories/${id}`, { name }).then((r) => r.data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`).then((r) => r.data);

// ── Orders (ฟังก์ชันที่หายไปเยอะมาก) ──────────────────────────
export const getOrders = () =>
  api.get('/orders').then((r) => r.data);

export const getMyOrders = () =>
  api.get('/orders/my-orders').then((r) => r.data);

export const updateOrderStatus = (id: number, status: string) =>
  api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

export const cancelOrder = (orderId: number, reason: string, restock?: boolean, bankName?: string, bankAccount?: string) =>
  api.patch(`/orders/${orderId}/cancel`, { reason, restock, bankName, bankAccount }).then((r) => r.data);

export const processRefund = (orderId: number, formData: FormData) =>
  api.patch(`/orders/${orderId}/refund`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

export const rejectRefund = (orderId: number, reason?: string) =>
  api.patch(`/orders/${orderId}/reject-refund`, { reason }).then(r => r.data);

export const requestReturn = (orderId: number, reason: string, bankName?: string, bankAccount?: string) =>
  api.patch(`/orders/${orderId}/return`, { reason, bankName, bankAccount }).then(r => r.data);

export const submitOrderRating = (
  orderId: number,
  ratings: Record<number, number>,
  reviews?: Record<number, string>,
) => api.post(`/orders/${orderId}/rating`, { ratings, reviews }).then((r) => r.data);

// ── Cart ──────────────────────────────────────────────────────
export const getCart = () =>
  api.get('/cart').then((r) => r.data);

export const addToCart = (productId: number, quantity: number) =>
  api.post('/cart/add', { productId, quantity }).then((r) => r.data);

export const removeFromCart = (id: number) =>
  api.delete(`/cart/${id}`).then((r) => r.data);

export default api;
