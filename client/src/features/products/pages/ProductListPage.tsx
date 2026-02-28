import { useState, useCallback, useRef } from 'react';
import type { ProductFilterParams } from '../types/product.types';
import { useProducts } from '../hooks/useProducts';
import ProductFilter from '../components/ProductFilter';
import ProductGrid from '../components/ProductGrid';

const DEFAULT_FILTERS: ProductFilterParams = {
  search: '',
  category: 'All',
};

const ProductListPage = () => {
  const [filters, setFilters] = useState<ProductFilterParams>(DEFAULT_FILTERS);
  const { products, loading, error, categories, categoryCounts, refetch } = useProducts();

  // ✅ แก้: debounce search เพื่อไม่ให้ยิง API ทุกตัวอักษร
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFilterChange = useCallback(
    (newFilters: ProductFilterParams) => {
      setFilters(newFilters);

      // ถ้าเปลี่ยน search → debounce 400ms ก่อนยิง API
      if (newFilters.search !== filters.search) {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
          refetch(newFilters);
        }, 400);
      } else {
        // เปลี่ยน category / price → ยิง API ทันที
        refetch(newFilters);
      }
    },
    [refetch, filters.search],
  );

  const handleReset = useCallback(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setFilters(DEFAULT_FILTERS);
    refetch(DEFAULT_FILTERS);
  }, [refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex flex-col items-center justify-center text-white gap-4" role="status">
        <div className="w-10 h-10 border-4 border-red-800 border-t-red-500 rounded-full animate-spin" />
        <span className="text-gray-400 text-sm tracking-widest">กำลังโหลดสินค้า...</span>
      </div>
    );
  }

  if (error) {
    return (
      // ✅ แก้: Error state แสดงปุ่ม retry และข้อความชัดเจนขึ้น
      <div className="min-h-screen bg-[#0f0f12] flex flex-col items-center justify-center text-center px-6 gap-6" role="alert">
        <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center text-3xl">⚠️</div>
        <div>
          <p className="text-red-400 text-lg font-bold mb-2">โหลดสินค้าไม่สำเร็จ</p>
          <p className="text-gray-500 text-sm max-w-md">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => refetch(filters)}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-6 py-2.5 rounded transition active:scale-95"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f12] text-white font-sans pb-20">
      <div className="container mx-auto px-6 py-8">

        {/* Search Bar */}
        {/* ✅ แก้: เปลี่ยน <search> (HTML5 element ที่ TypeScript อาจ error) เป็น <div> */}
        <div className="flex justify-center mb-10" role="search">
          <div className="relative w-full max-w-3xl">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-xl" aria-hidden="true">
              🔍
            </span>
            <label htmlFor="product-search" className="sr-only">ค้นหาสินค้า</label>
            <input
              id="product-search"
              type="search"
              placeholder="ค้นหาอุปกรณ์เทพของคุณ..."
              className="w-full bg-[#2a0b0b] border border-white/5 rounded-full py-4 pl-14 pr-6 text-white/70 placeholder-white/30 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/30 transition shadow-lg text-lg font-light tracking-wider"
              value={filters.search ?? ''}
              onChange={(e) =>
                handleFilterChange({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <ProductFilter
            categories={categories}
            categoryCounts={categoryCounts}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
          <ProductGrid
            products={products}
            selectedCategory={filters.category ?? 'All'}
            onReset={handleReset}
          />
        </div>

      </div>
    </main>
  );
};

export default ProductListPage;