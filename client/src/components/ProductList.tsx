import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 

interface Product {
  id: number;
  name: string;
  price: number | string;
  imageUrl?: string;
  image_url?: string;
  category?: { id: number; name: string } | string; 
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>(['All']); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');      
  const [maxPrice, setMaxPrice] = useState('');      
  const [appliedMin, setAppliedMin] = useState(0);   
  const [appliedMax, setAppliedMax] = useState(Infinity); 
  
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      const data = response.data;
      setProducts(data);

      const uniqueCategories = new Set<string>(['All']);
      const counts: Record<string, number> = { 'All': data.length };

      data.forEach((p: Product) => {
        let catName = 'Uncategorized';
        if (typeof p.category === 'object' && p.category !== null && 'name' in p.category) {
            catName = p.category.name;
        } else if (typeof p.category === 'string') {
            catName = p.category;
        }
        
        uniqueCategories.add(catName);
        counts[catName] = (counts[catName] || 0) + 1;
      });

      setCategories(Array.from(uniqueCategories));
      setCategoryCounts(counts);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handlePriceFilter = () => {
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    setAppliedMin(min);
    setAppliedMax(max);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    let productCategoryName = 'Uncategorized';
    if (typeof product.category === 'object' && product.category !== null) {
        productCategoryName = product.category.name;
    } else if (typeof product.category === 'string') {
        productCategoryName = product.category;
    }
    const matchesCategory = selectedCategory === 'All' || productCategoryName === selectedCategory; 
    const price = Number(product.price);
    const matchesPrice = price >= appliedMin && price <= appliedMax;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) return <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans">
      
      {/* Navbar */}
      <nav className="bg-[#0f0f12] border-b border-white/10 py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
            {/* ✅ แก้ไข onClick ตรงนี้ให้ใช้ navigate('/') แทน scrollTo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                 <img src={logoImg} alt="Nexus Gear Logo" className="h-10 w-auto object-contain group-hover:brightness-110 transition drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                 <span className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase font-sans">
                    NEXUS <span className="text-red-600">GEAR</span>
                 </span>
            </div>
            <div className="flex items-center gap-6 md:gap-8 text-sm font-medium text-gray-400">
                {/* ✅ แก้ปุ่มหน้าแรก ให้กลับ Home */}
                <button onClick={() => navigate('/')} className="text-white font-bold transition">หน้าแรก</button>
                <button className="hover:text-white transition hidden md:block">ตะกร้า</button>
                <button className="hover:text-white transition hidden md:block">โปรไฟล์</button>
                <button className="bg-white text-black px-5 py-2 rounded hover:bg-gray-200 transition font-bold">เข้าสู่ระบบ</button>
            </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        
        {/* Search Bar */}
        <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-3xl">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
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
            
            {/* === SIDEBAR FILTER === */}
            <div className="w-full md:w-1/4 hidden md:block">
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
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left py-2 px-3 rounded transition text-sm flex justify-between items-center ${
                                    selectedCategory === cat 
                                    ? 'bg-gradient-to-r from-red-900/40 to-transparent text-red-500 font-bold border-l-2 border-red-500' 
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
                                placeholder="0" 
                                className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white focus:border-red-500 outline-none"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)} 
                             />
                             <span>-</span>
                             <input 
                                type="number" 
                                placeholder="Max" 
                                className="w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-white focus:border-red-500 outline-none"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)} 
                             />
                        </div>
                        <button 
                            onClick={handlePriceFilter}
                            className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition active:scale-95"
                        >
                            ค้นหา
                        </button>
                    </div>
                </div>
            </div>

            {/* === PRODUCT GRID === */}
            <div className="w-full md:w-3/4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-1 h-6 bg-red-600 block"></span> 
                        {selectedCategory === 'All' ? 'สินค้าทั้งหมด' : selectedCategory} 
                        <span className="text-gray-500 text-base font-normal ml-2">({filteredProducts.length} รายการ)</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div 
                            key={product.id} 
                            onClick={() => navigate(`/products/${product.id}`)} 
                            className="bg-[#18181b] rounded-xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-red-900/10 flex flex-col h-full"
                        >
                            <div className="h-[220px] bg-white p-6 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">HOT</div>
                                <img 
                                    src={product.imageUrl || product.image_url || 'https://placehold.co/400x400'} 
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-500"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/png?text=Nexus'; }}
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <p className="text-gray-500 text-xs mb-1">
                                    {typeof product.category === 'object' && product.category?.name ? product.category.name : (product.category as string || 'General')}
                                </p>
                                <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-500 transition">
                                    {product.name}
                                </h3>
                                
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                    <div>
                                        <p className="text-xs text-gray-500">ราคา</p>
                                        <p className="text-xl font-bold text-red-500">฿{Number(product.price).toLocaleString()}</p>
                                    </div>
                                    <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-lg shadow-red-900/20 active:scale-95">
                                        ซื้อเลย
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">ไม่พบสินค้าในหมวดหมู่นี้</p>
                        <button 
                            onClick={() => setSelectedCategory('All')}
                            className="mt-4 text-red-500 underline hover:text-red-400"
                        >
                            กลับไปดูสินค้าทั้งหมด
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