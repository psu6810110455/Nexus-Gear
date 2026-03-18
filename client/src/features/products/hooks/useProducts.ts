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
  const [isFirstLoad, setIsFirstLoad]     = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [categories, setCategories]       = useState<string[]>(['All']);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const refetch = useCallback(async (filters?: ProductFilterParams) => {
    if (isFirstLoad) setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(filters);

      // ✅ แก้: ตรวจสอบว่า response เป็น Array จริงก่อนใช้งาน
      // backend บางตัวส่ง { data: [...] } หรือ object อื่นมาแทน array
      const productList = Array.isArray(data) ? data : [];
      setProducts(productList);

      // ✅ Fix: To get accurate category counts that reflect other filters (like search or price)
      // but NOT the category filter itself, we fetch the base list without the category filter.
      let baseListForCounts = productList;
      if (filters?.category && filters.category !== 'All') {
        try {
          // Fetch products matching all current filters EXCEPT 'category'
          const baseData = await fetchProducts({ ...filters, category: 'All' });
          baseListForCounts = Array.isArray(baseData) ? baseData : [];
        } catch (err) {
          console.error("Failed to fetch base products for category counts", err);
        }
      }

      const counts = extractCategoriesFromProducts(baseListForCounts);

      setCategories((prevCategories) => {
        const newCats = Object.keys(counts).sort((a, b) => {
          if (a === 'All') return -1;
          if (b === 'All') return 1;
          return a.localeCompare(b);
        });
        // Avoid unnecessary re-renders if the categories haven't meaningfully changed length
        if (!filters?.category || filters.category === 'All' || prevCategories.length <= 1 || newCats.length !== prevCategories.length) {
          return newCats;
        }
        return prevCategories;
      });

      setCategoryCounts(() => {
        return counts; // Always update category counts to reflect the current real max
      });
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
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    refetch(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, error, categories, categoryCounts, refetch };
};