// ============================================================
// src/components/ProductList.tsx
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../shared/services/api';
import type { Product } from '../../../shared/types';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';

function ProductList() {
  const [products, setProducts]             = useState<Product[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [categories, setCategories]         = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice]             = useState('');
  const [maxPrice, setMaxPrice]             = useState('');
  const [appliedMin, setAppliedMin]         = useState(0);
  const [appliedMax, setAppliedMax]         = useState(Infinity);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      if (!Array.isArray(data)) { setLoading(false); return; }

      setProducts(data);

      const counts: Record<string, number> = { All: data.length };
      const catSet = new Set<string>(['All']);

      data.forEach((p: Product) => {
        const catName =
          p.category && typeof p.category === 'object' && 'name' in p.category
            ? p.category.name
            : typeof p.category === 'string'
            ? p.category
            : 'Uncategorized';
        catSet.add(catName);
        counts[catName] = (counts[catName] || 0) + 1;
      });

      setCategories(Array.from(catSet));
      setCategoryCounts(counts);
    } catch (err) {
      console.error('fetchProducts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = () => {
    setAppliedMin(minPrice === '' ? 0 : Number(minPrice));
    setAppliedMax(maxPrice === '' ? Infinity : Number(maxPrice));
  };

  const handleClearFilter = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setAppliedMin(0);
    setAppliedMax(Infinity);
    setSearchTerm('');
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const catName =
      typeof p.category === 'object' && p.category !== null
        ? p.category.name
        : typeof p.category === 'string'
        ? p.category
        : 'Uncategorized';
    const matchCat = selectedCategory === 'All' || catName === selectedCategory;
    const price = Number(p.price);
    const matchPrice = price >= appliedMin && price <= appliedMax;
    return matchSearch && matchCat && matchPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans pb-20">
      <div className="container mx-auto px-6 py-8">

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-3xl">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-xl">🔍</span>
            <input
              type="text"
              placeholder="ค้นหาอุปกรณ์เทพของคุณ..."
              className="w-full bg-[#2a0b0b] border border-white/5 rounded-full py-4 pl-14 pr-6 text-white/70 placeholder-white/30 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/30 transition shadow-lg text-lg font-light tracking-wider"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Filter */}
          <ProductFilter
            categories={categories}
            categoryCounts={categoryCounts}
            selectedCategory={selectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onSelectCategory={setSelectedCategory}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onApplyPrice={handlePriceFilter}
          />

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 block" />
                {selectedCategory === 'All' ? 'สินค้าทั้งหมด' : selectedCategory}
                <span className="text-gray-500 text-base font-normal ml-2">
                  ({filteredProducts.length} รายการ)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="shop"
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">ไม่พบสินค้าในหมวดหมู่นี้</p>
                <button
                  onClick={handleClearFilter}
                  className="mt-4 text-red-500 underline hover:text-red-400"
                >
                  ล้างตัวกรองและดูสินค้าทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;