import { useState, useCallback, useRef } from 'react';
import type { ProductFilterParams } from '../types/product.types';
import { useProducts } from '../hooks/useProducts';
import ProductFilter from '../components/ProductFilter';
import ProductGrid from '../components/ProductGrid';
import { Search, AlertTriangle } from 'lucide-react'; // ✅ เพิ่ม Icon จาก lucide-react ให้เหมือนหน้า Admin

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
      // ✅ ปรับ UI Loading ให้เป็นธีมเกมมิ่ง ดำ-แดง มีแสง Glow
      <div className="min-h-screen bg-gradient-to-br from-[#1A0505] to-[#000000] flex flex-col items-center justify-center text-[#F2F4F6] gap-5" role="status">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#990000]/30 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-[#FF0000] rounded-full animate-spin absolute top-0 left-0 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"></div>
        </div>
        <span className="text-[#FF0000] text-sm tracking-[0.2em] font-['Orbitron'] font-bold animate-pulse">
          LOADING GEAR...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      // ✅ ปรับ UI Error state ให้ดูน่าเกรงขามและเข้ากับธีม
      <div className="min-h-screen bg-gradient-to-br from-[#1A0505] to-[#000000] flex flex-col items-center justify-center text-center px-6 gap-6" role="alert">
        <div className="w-20 h-20 rounded-2xl bg-[#2E0505]/50 border border-[#FF0000]/50 flex items-center justify-center text-[#FF0000] shadow-[0_0_30px_rgba(255,0,0,0.2)]">
          <AlertTriangle size={40} />
        </div>
        <div>
          <p className="text-[#FF0000] text-2xl font-bold mb-2 font-['Orbitron'] tracking-wider">SYSTEM ERROR</p>
          <p className="text-[#F2F4F6]/60 text-sm max-w-md font-['Kanit']">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => refetch(filters)}
          className="bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] text-white text-sm font-['Orbitron'] tracking-widest font-bold px-8 py-3 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    // ✅ พื้นหลังไล่สี ดำ-แดงเข้ม พร้อมกำหนดสี Selection
    <main className="min-h-screen bg-gradient-to-br from-[#1A0505] to-[#000000] text-[#F2F4F6] font-['Kanit'] pb-20 selection:bg-[#FF0000]/30">
      <div className="container mx-auto px-6 py-10">

        {/* ✅ เพิ่ม Header Title ให้ดูเต็มขึ้น (ลบออกได้ถ้าไม่ต้องการ) */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-[#ff6b6b] font-['Orbitron'] tracking-wider mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
            NEXUS GEAR
          </h1>
          <p className="text-[#F2F4F6]/50 text-sm tracking-widest uppercase font-['Orbitron']">Explore Our Premium Arsenal</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12" role="search">
          <div className="relative w-full max-w-3xl group">
            {/* ✅ ใช้ Icon Search จาก lucide-react พร้อม Effect เปลี่ยนสีเมื่อ Focus */}
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#F2F4F6]/40 group-focus-within:text-[#FF0000] transition-colors duration-300">
              <Search size={22} />
            </div>
            <label htmlFor="product-search" className="sr-only">ค้นหาสินค้า</label>
            <input
              id="product-search"
              type="text"
              placeholder="ค้นหาอุปกรณ์เทพของคุณ..."
              // ✅ ปรับสี Input ให้เป็นกรอบแดง มีเรืองแสงตอนคลิก
              className="w-full bg-[#000000]/60 backdrop-blur-md border border-[#990000]/30 rounded-2xl py-4 pl-14 pr-6 text-[#F2F4F6] placeholder-[#F2F4F6]/30 focus:outline-none focus:border-[#FF0000] focus:shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all duration-300 text-lg font-light tracking-wide"
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