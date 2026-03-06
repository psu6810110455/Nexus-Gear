import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductFilterParams } from '../types/product.types';

interface ProductFilterProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  filters: ProductFilterParams;
  onFilterChange: (filters: ProductFilterParams) => void;
  onReset: () => void;
}

const ProductFilter = ({
  categories,
  categoryCounts,
  filters,
  onFilterChange,
  onReset,
}: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (cat: string) => {
    onFilterChange({ ...filters, category: cat });
    setIsOpen(false); // ปิด filter หลังเลือกหมวดหมู่บนมือถือ
  };

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const min = (form.elements.namedItem('minPrice') as HTMLInputElement).value;
    const max = (form.elements.namedItem('maxPrice') as HTMLInputElement).value;
    onFilterChange({
      ...filters,
      minPrice: min !== '' ? Number(min) : undefined,
      maxPrice: max !== '' ? Number(max) : undefined,
    });
    setIsOpen(false);
  };

  const filterContent = (
    <>
      {/* Category Filter */}
      <nav aria-label="หมวดหมู่สินค้า">
        <p className="text-gray-500 text-xs font-bold uppercase mb-2">หมวดหมู่</p>
        <ul className="space-y-2">
          {categories.map((cat) => {
            const isActive = (filters.category ?? 'All') === cat;
            return (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`w-full text-left py-2 px-3 rounded transition text-sm flex justify-between items-center ${
                    isActive
                      ? 'bg-gradient-to-r from-red-900/40 to-transparent text-red-500 font-bold border-l-2 border-red-500'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{cat === 'All' ? 'ทั้งหมด' : cat}</span>
                  <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full opacity-70">
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Price Range Filter */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-gray-500 text-xs font-bold uppercase mb-3">ช่วงราคา</p>
        <form onSubmit={handlePriceSubmit} aria-label="กรองตามช่วงราคา">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <label htmlFor="minPrice" className="sr-only">ราคาต่ำสุด</label>
            <input
              id="minPrice" name="minPrice" type="number" placeholder="Min" min={0}
              defaultValue={filters.minPrice ?? ''}
              className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white focus:border-red-500 outline-none"
            />
            <span aria-hidden="true">-</span>
            <label htmlFor="maxPrice" className="sr-only">ราคาสูงสุด</label>
            <input
              id="maxPrice" name="maxPrice" type="number" placeholder="Max" min={0}
              defaultValue={filters.maxPrice ?? ''}
              className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white focus:border-red-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition active:scale-95"
          >
            ค้นหาตามราคา
          </button>
        </form>
      </div>

      <button
        type="button" onClick={onReset}
        className="w-full mt-3 text-gray-500 hover:text-red-400 text-xs underline transition"
      >
        ล้างตัวกรองทั้งหมด
      </button>
    </>
  );

  return (
    <aside aria-label="ตัวกรองสินค้า" className="w-full md:w-1/4">
      {/* Mobile: Compact toggle bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between bg-[#18181b] p-3 rounded-xl border border-white/5 mb-4"
      >
        <span className="flex items-center gap-2 text-red-500 font-bold text-sm">
          <SlidersHorizontal size={16} />
          ตัวกรอง {filters.category !== 'All' && `· ${filters.category}`}
        </span>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {/* Mobile: Collapsible content */}
      {isOpen && (
        <div className="md:hidden bg-[#18181b] p-4 rounded-xl border border-white/5 mb-4">
          {filterContent}
        </div>
      )}

      {/* Desktop: Always visible sidebar */}
      <div className="hidden md:block bg-[#18181b] p-6 rounded-xl border border-white/5 sticky top-24">
        <h2 className="text-red-600 font-bold text-lg mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
          FILTER
        </h2>
        {filterContent}
      </div>
    </aside>
  );
};

export default ProductFilter;