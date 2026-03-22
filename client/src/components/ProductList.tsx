import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const token = localStorage.getItem('token');
      console.log("🔑 Token ที่ส่งไป:", token ? "มี Token" : "ไม่มี Token");

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_BASE}/products`, { headers });
      
      const data = response.data;
      console.log("📦 ข้อมูลสินค้าที่ได้จาก API:", data); // ดูหน้าตาข้อมูลที่ Backend ส่งมา

      if (!Array.isArray(data)) {
        console.error("🚨 ข้อมูลไม่ใช่ Array:", data);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(data);

      const counts: Record<string, number> = { 'All': data.length };
      const categorySet = new Set<string>(['All']);

      data.forEach((p: Product) => {
        let catName = 'Uncategorized';
        // เช็คว่า backend ส่ง category มาแบบไหน
        if (p.category && typeof p.category === 'object' && 'name' in p.category) {
            catName = p.category.name;
        } else if (typeof p.category === 'string') {
            catName = p.category;
        } else {
            console.log("⚠️ สินค้านี้ไม่มี Category หรือส่งมาผิดรูปแบบ:", p);
        }
        
        categorySet.add(catName);
        counts[catName] = (counts[catName] || 0) + 1;
      });

      console.log("🏷️ หมวดหมู่ที่สกัดได้:", Array.from(categorySet));

      setCategories(Array.from(categorySet));
      setCategoryCounts(counts);
      setLoading(false);

    } catch (error: any) {
      console.error("❌ Error ดึงข้อมูล:", error.response?.status, error.response?.data || error.message);
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
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans pb-20">
      <div className="container mx-auto px-6 py-8">
        
        
        {/* Search Bar */}
        <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-3xl">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-xl">
                    🔍
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
            <div className="w-full md:w-1/4">
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
                                placeholder="Min" 
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
                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition active:scale-95"
                        >
                            ค้นหาตามราคา
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
                                    src={product.imageUrl || product.image_url || 'https://dummyimage.com/400x400/000/fff'} 
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
                                    onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/400x400/000/fff?text=Nexus'; }}
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <p className="text-gray-500 text-xs mb-1">
                                    {typeof product.category === 'object' 
                                        ? (product.category?.name || 'General') 
                                        : (product.category || 'General')}
                                </p>
                                
                                <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-500 transition">
                                    {product.name}
                                </h3>
                                
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                    <div>
                                        <p className="text-xs text-gray-500">ราคา</p>
                                        <p className="text-xl font-bold text-red-500">฿{Number(product.price).toLocaleString()}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            navigate(`/products/${product.id}`); 
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-lg shadow-red-900/20 active:scale-95 z-10"
                                    >
                                        ดูรายละเอียด
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
                            onClick={() => {
                                setSelectedCategory('All');
                                setMinPrice('');
                                setMaxPrice('');
                                setAppliedMin(0);
                                setAppliedMax(Infinity);
                                setSearchTerm('');
                            }}
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
