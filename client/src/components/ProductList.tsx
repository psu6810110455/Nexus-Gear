import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string;
  image_url?: string;
  category?: { id: number; name: string } | string;
}

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts]               = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [searchTerm, setSearchTerm]           = useState('');
  const [viewMode, setViewMode]               = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy]                   = useState('popular');

  const [categories, setCategories]           = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice]               = useState('');
  const [maxPrice, setMaxPrice]               = useState('');
  const [appliedMin, setAppliedMin]           = useState(0);
  const [appliedMax, setAppliedMax]           = useState(Infinity);
  const [categoryCounts, setCategoryCounts]   = useState<Record<string, number>>({});

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const token   = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get('http://localhost:3000/products', { headers });
      const data: Product[] = response.data;

      if (!Array.isArray(data)) { setLoading(false); return; }

      setProducts(data);

      const counts: Record<string, number> = { All: data.length };
      const categorySet = new Set<string>(['All']);

      data.forEach((p) => {
        let catName = 'Uncategorized';
        if (p.category && typeof p.category === 'object' && 'name' in p.category) catName = p.category.name;
        else if (typeof p.category === 'string') catName = p.category;
        categorySet.add(catName);
        counts[catName] = (counts[catName] || 0) + 1;
      });

      setCategories(Array.from(categorySet));
      setCategoryCounts(counts);
    } catch {
      console.log('API unavailable, using empty state');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (p: Product): string => {
    if (typeof p.category === 'object' && p.category !== null) return p.category.name;
    if (typeof p.category === 'string') return p.category;
    return 'Uncategorized';
  };

  const handlePriceFilter = () => {
    setAppliedMin(minPrice === '' ? 0 : Number(minPrice));
    setAppliedMax(maxPrice === '' ? Infinity : Number(maxPrice));
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setAppliedMin(0);
    setAppliedMax(Infinity);
    setSearchTerm('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || getCategoryName(p) === selectedCategory;
    const price           = Number(p.price);
    const matchesPrice    = price >= appliedMin && price <= appliedMax;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center text-[#F2F4F6]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#990000] border-t-[#FF0000] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Orbitron'] tracking-widest text-[#F2F4F6]/60">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');`}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#FF0000] rounded-tl-3xl opacity-80 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-[#FF0000] rounded-tr-3xl opacity-80 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"></div>
      </div>

      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="bg-[#000000]/90 border-b border-[#990000]/50 sticky top-0 z-50 backdrop-blur-md shadow-[0_4px_20px_rgba(153,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FF0000]/20 blur-xl rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                  <img
                    src="/nexus-logo.png"
                    alt="Nexus Logo"
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/64x64/000000/red?text=NX'; }}
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                    NEXUS GEAR
                  </h1>
                  <p className="text-[12px] text-[#FF0000] font-['Orbitron'] tracking-[0.3em] uppercase font-bold mt-1">
                    GAMING EQUIPMENT STORE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 font-['Kanit']">
                <button onClick={() => navigate('/login')} className="hidden md:flex items-center gap-2 text-[#F2F4F6]/70 hover:text-[#FF0000] transition-colors text-sm font-medium">เข้าสู่ระบบ</button>
                <div className="h-4 w-px bg-[#990000]/50 hidden md:block"></div>
                <button onClick={() => navigate('/register')} className="hidden md:flex items-center gap-2 text-[#F2F4F6]/70 hover:text-[#FF0000] transition-colors text-sm font-medium">สมัครสมาชิก</button>
                <button
                  onClick={() => navigate('/cart')}
                  className="p-3 bg-[#2E0505] border border-[#990000] hover:bg-[#990000] hover:text-white text-[#FF0000] rounded-lg transition-all relative group ml-4 shadow-[0_0_10px_rgba(153,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF0000] text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-[#000000] font-['Orbitron']">0</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-[#FF0000]/10 blur-lg rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาอุปกรณ์เกมส์มิ่งของคุณ..."
                className="w-full bg-[#2E0505]/80 border border-[#990000]/50 rounded-xl px-6 py-4 pl-14 text-[#F2F4F6] placeholder-[#F2F4F6]/40 focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all font-['Kanit'] text-lg relative z-10"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#F2F4F6]/50 group-focus-within:text-[#FF0000] transition-colors z-10" />
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── Sidebar Filter ── */}
            <aside className="lg:col-span-1">
              <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 sticky top-28 shadow-2xl">
                <h3 className="text-xl font-['Orbitron'] font-bold mb-6 flex items-center gap-3 text-[#FF0000] tracking-wider">
                  <Filter className="w-5 h-5" /> FILTER
                </h3>

                {/* Category */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-4 text-[#F2F4F6]/80 uppercase tracking-wider border-l-4 border-[#990000] pl-3 font-['Kanit']">หมวดหมู่สินค้า</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex justify-between items-center group font-['Kanit'] ${
                          selectedCategory === cat
                            ? 'bg-gradient-to-r from-[#990000]/40 to-transparent border-l-2 border-[#FF0000] text-white pl-5'
                            : 'text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] hover:pl-5'
                        }`}
                      >
                        <span className="font-medium">{cat === 'All' ? 'ทั้งหมด' : cat}</span>
                        <span className={`text-[10px] font-['Orbitron'] px-2 py-0.5 rounded ${selectedCategory === cat ? 'bg-[#FF0000] text-white' : 'bg-[#2E0505] text-[#F2F4F6]/50'}`}>
                          {categoryCounts[cat] ?? 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-4 text-[#F2F4F6]/80 uppercase tracking-wider border-l-4 border-[#990000] pl-3 font-['Kanit']">ช่วงราคา</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-[#000000] border border-[#990000]/30 rounded px-3 py-2 text-sm text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] transition-colors font-['Orbitron'] placeholder-[#F2F4F6]/20"
                        placeholder="MIN"
                      />
                      <span className="text-[#990000]">-</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-[#000000] border border-[#990000]/30 rounded px-3 py-2 text-sm text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] transition-colors font-['Orbitron'] placeholder-[#F2F4F6]/20"
                        placeholder="MAX"
                      />
                    </div>
                    <button onClick={handlePriceFilter} className="w-full bg-[#990000] hover:bg-[#FF0000] text-white py-2.5 rounded-lg transition-all text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#990000]/30 font-['Kanit']">
                      ค้นหา
                    </button>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full text-[#F2F4F6]/50 hover:text-[#FF0000] text-xs font-bold uppercase tracking-widest transition-colors py-2 border border-dashed border-[#990000]/30 hover:border-[#FF0000] rounded-lg font-['Kanit']"
                >
                  ล้างค่าทั้งหมด
                </button>
              </div>
            </aside>

            {/* ── Product Grid ── */}
            <main className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 bg-[#000000]/40 p-4 rounded-xl border border-[#990000]/20">
                <h2 className="text-2xl font-bold flex items-center gap-3 font-['Kanit']">
                  <span className="w-2 h-8 bg-[#FF0000] rounded-sm shadow-[0_0_10px_#FF0000]"></span>
                  {selectedCategory === 'All' ? 'สินค้าทั้งหมด' : selectedCategory}
                  <span className="text-[#F2F4F6]/50 text-sm font-normal font-['Orbitron'] mt-1">({filteredProducts.length})</span>
                </h2>

                <div className="flex items-center gap-4 w-full sm:w-auto font-['Kanit']">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FF0000] cursor-pointer hover:border-[#990000] transition-all text-[#F2F4F6]"
                  >
                    <option value="popular">ยอดนิยม</option>
                    <option value="price-low">ราคา: ต่ำไปสูง</option>
                    <option value="price-high">ราคา: สูงไปต่ำ</option>
                    <option value="newest">มาใหม่ล่าสุด</option>
                  </select>

                  <div className="flex gap-1 bg-[#000000] rounded-lg p-1 border border-[#990000]/30">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#990000] text-white shadow-[0_0_10px_rgba(153,0,0,0.5)]' : 'text-[#F2F4F6]/50 hover:text-white'}`}>
                      <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#990000] text-white shadow-[0_0_10px_rgba(153,0,0,0.5)]' : 'text-[#F2F4F6]/50 hover:text-white'}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className={`bg-[#000000] border border-[#990000]/20 rounded-2xl overflow-hidden hover:border-[#FF0000] transition-all duration-300 group cursor-pointer hover:shadow-[0_0_25px_rgba(255,0,0,0.15)] hover:-translate-y-1 relative ${viewMode === 'list' ? 'flex' : ''}`}
                    >
                      {/* Image */}
                      <div className={`relative bg-gradient-to-b from-[#2E0505]/20 to-[#000000] overflow-hidden ${viewMode === 'grid' ? 'aspect-square' : 'w-56 aspect-square'}`}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#990000]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <img
                          src={product.imageUrl ?? product.image_url ?? 'https://placehold.co/400x400/1a1a1a/red?text=Gaming+Gear'}
                          alt={product.name}
                          className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/1a1a1a/red?text=Gaming+Gear'; }}
                        />
                        <div className="absolute inset-0 bg-[#000000]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-[2px]">
                          <span className="text-[#F2F4F6] font-['Kanit'] font-bold text-lg tracking-wider border-b-2 border-[#FF0000] pb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            ดูรายละเอียด
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between bg-[#000000]">
                        <div>
                          <p className="text-[10px] font-['Orbitron'] text-[#990000] tracking-widest uppercase mb-1">
                            {getCategoryName(product)}
                          </p>
                          <h4 className="font-['Kanit'] font-bold text-lg mb-2 text-[#F2F4F6] group-hover:text-[#FF0000] transition-colors line-clamp-2 leading-tight">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center text-yellow-500 text-xs gap-1">
                              <Star className="w-3 h-3 fill-yellow-500" />
                              <span className="font-['Orbitron'] pt-0.5">4.5</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-[#990000]/20 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#F2F4F6]/50 uppercase font-['Orbitron']">Price</span>
                            <span className="text-xl font-['Orbitron'] font-bold text-[#FF0000] drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">
                              ฿{Number(product.price).toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
                            className="bg-[#FF0000] text-white hover:bg-[#990000] px-5 py-2 rounded font-bold text-xs transition-all duration-300 transform group-hover:scale-105 shadow-[0_0_10px_rgba(255,0,0,0.4)] font-['Kanit']"
                          >
                            ซื้อเลย
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-[#F2F4F6]/50">
                  <Search className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-['Kanit']">
                    {searchTerm ? `ไม่พบสินค้าที่ตรงกับ "${searchTerm}"` : 'ไม่พบสินค้าในหมวดหมู่นี้'}
                  </p>
                  <button onClick={clearFilters} className="mt-4 text-[#FF0000] hover:underline font-['Kanit']">ล้างตัวกรอง</button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;