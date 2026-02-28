import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFilterParams } from '../types/product.types';
import {
  fetchProducts,
  extractCategoriesFromProducts,
} from '../services/product.service';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  categories: string[];
  categoryCounts: Record<string, number>;
  refetch: (filters?: ProductFilterParams) => Promise<void>;
}

export const useProducts = (initialFilters?: ProductFilterParams): UseProductsReturn => {
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [categories, setCategories]       = useState<string[]>(['All']);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const refetch = useCallback(async (filters?: ProductFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(filters);

      // ✅ แก้: ตรวจสอบว่า response เป็น Array จริงก่อนใช้งาน
      // backend บางตัวส่ง { data: [...] } หรือ object อื่นมาแทน array
      const productList = Array.isArray(data) ? data : [];
      setProducts(productList);

      const counts = extractCategoriesFromProducts(productList);
      setCategories(Object.keys(counts));
      setCategoryCounts(counts);
    } catch (err: any) {
      // ✅ แก้: แยก error message ออกให้ชัดเจน ช่วย debug ได้ง่ายขึ้น
      let message = 'เกิดข้อผิดพลาดในการโหลดสินค้า';

      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        message = 'เชื่อมต่อ Server ไม่ได้ — กรุณาตรวจสอบว่า Backend กำลังรันอยู่ที่ port 3000';
      } else if (err.response?.status === 401) {
        message = 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่';
      } else if (err.response?.status === 403) {
        message = 'ไม่มีสิทธิ์เข้าถึงข้อมูล';
      } else if (err.response?.data?.message) {
        message = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ')
          : err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      // ✅ แก้: ไม่ล้าง products เมื่อ refetch ล้มเหลว (ให้ข้อมูลเดิมยังแสดงอยู่)
      // setProducts([]);  ← ลบออก: ถ้า refetch ล้มเหลว ข้อมูลเดิมยังใช้งานได้
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, error, categories, categoryCounts, refetch };
};