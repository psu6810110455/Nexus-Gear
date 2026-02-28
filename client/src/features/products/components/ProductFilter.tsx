// ============================================================
// src/components/ProductFilter.tsx
// Sidebar filter แยกออกจาก ProductList
// ============================================================

interface ProductFilterProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  onSelectCategory: (cat: string) => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onApplyPrice: () => void;
}

function ProductFilter({
  categories,
  categoryCounts,
  selectedCategory,
  minPrice,
  maxPrice,
  onSelectCategory,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
}: ProductFilterProps) {
  return (
    <aside className="w-full md:w-1/4">
      <div className="bg-[#18181b] p-6 rounded-xl border border-white/5 sticky top-24">
        <h2 className="text-red-600 font-bold text-lg mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-3">
          FILTER
        </h2>

        {/* Category Filter */}
        <div className="space-y-2">
          <p className="text-gray-500 text-xs font-bold uppercase mb-2">หมวดหมู่</p>
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left py-2 px-3 rounded transition text-sm flex justify-between items-center ${
                selectedCategory === cat
                  ? 'bg-linear-to-r from-red-900/40 to-transparent text-red-500 font-bold border-l-2 border-red-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{cat === 'All' ? 'ทั้งหมด' : cat}</span>
              <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full opacity-70">
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Price Range Filter */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-xs font-bold uppercase mb-4">ช่วงราคา</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="number"
              placeholder="Min"
              className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white focus:border-red-500 outline-none"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white focus:border-red-500 outline-none"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </div>
          <button
            onClick={onApplyPrice}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition active:scale-95"
          >
            ค้นหาตามราคา
          </button>
        </div>
      </div>
    </aside>
  );
}

export default ProductFilter;