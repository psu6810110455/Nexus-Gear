import axios from 'axios';
import type { Product, ProductFilterParams } from '../types/product.types';

const BASE_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * ดึงสินค้าทั้งหมด — ส่ง filter params ไปกับ query string
 * เพื่อให้ backend เป็นคนกรอง แทนที่จะกรองใน frontend
 */
export const fetchProducts = async (filters?: ProductFilterParams): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters?.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));

  const response = await axios.get<Product[]>(`${BASE_URL}/products`, {
    headers: getAuthHeaders(),
    params,
  });

  return response.data;
};

/**
 * ดึงรายชื่อหมวดหมู่ทั้งหมด (ถ้า backend มี endpoint นี้)
 * หากยังไม่มี ให้ fallback ไปใช้ extractCategoriesFromProducts แทน
 */
export const fetchCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${BASE_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * ดึงข้อมูลสินค้าตัวเดียว
 */
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${BASE_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * helper — สกัด category name จาก product object
 */
export const getCategoryName = (product: Product): string => {
  if (product.category && typeof product.category === 'object' && 'name' in product.category) {
    return product.category.name;
  }
  if (typeof product.category === 'string') {
    return product.category;
  }
  return 'Uncategorized';
};

/**
 * helper — สกัด unique categories + count จาก product list
 * ใช้ตอน backend ยังไม่มี /categories endpoint
 */
export const extractCategoriesFromProducts = (
  products: Product[],
): Record<string, number> => {
  const counts: Record<string, number> = { All: products.length };
  products.forEach((p) => {
    const name = getCategoryName(p);
    counts[name] = (counts[name] ?? 0) + 1;
  });
  return counts;
};