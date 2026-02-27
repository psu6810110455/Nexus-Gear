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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const refetch = useCallback(async (filters?: ProductFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(filters);
      setProducts(data);

      const counts = extractCategoriesFromProducts(data);
      setCategories(Object.keys(counts));
      setCategoryCounts(counts);
    } catch (err: any) {
      const message = err.response?.data?.message ?? err.message ?? 'เกิดข้อผิดพลาดในการโหลดสินค้า';
      setError(message);
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