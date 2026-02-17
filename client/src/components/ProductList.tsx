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
  category?: { id: number; name: string };
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // ✅ 1. เพิ่ม State สำหรับราคาสินค้า
  const [minPrice, setMinPrice] = useState('');      // ค่าในช่อง input ต่ำสุด
  const [maxPrice, setMaxPrice] = useState('');      // ค่าในช่อง input สูงสุด
  const [appliedMin, setAppliedMin] = useState(0);   // ค่าที่จะใช้กรองจริง (ต่ำสุด)
  const [appliedMax, setAppliedMax] = useState(Infinity); // ค่าที่จะใช้กรองจริง (สูงสุด)

  const navigate = useNavigate();

  const categories = ['All', 'Gaming Mouse', 'Keyboard', 'Headset', 'Monitor', 'Gaming Chair'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // ✅ 2. ฟังก์ชันเมื่อกดปุ่ม "ค้นหา" (ช่วงราคา)
  const handlePriceFilter = () => {
    // แปลงค่าจาก text เป็น number ถ้าว่างให้เป็น 0 หรือ Infinity
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    
    setAppliedMin(min);
    setAppliedMax(max);
  };

  // ✅ 3. อัปเดต Logic การกรองสินค้า
  const filteredProducts = products.filter((product) => {
    // กรองชื่อ
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    // กรองหมวดหมู่
    const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory; 
    
    // กรองราคา (แปลงราคาเป็นตัวเลขก่อนเปรียบเทียบ)
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
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
                 <img src={logoImg} alt="Nexus Gear Logo" className="h-10 w-auto object-contain group-hover:brightness-110 transition drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                 <span className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase font-sans">
                    NEXUS <span className="text-red-600">GEAR</span>
                 </span>
            </div>
            <div className="flex items-center gap-6 md:gap-8 text-sm font-medium text-gray-400">
                <button className="text-white font-bold transition">หน้าแรก</button>
                <button className="hover:text-white transition hidden md:block">ตะกร้า</button>
                <button className="hover:text-white transition hidden md:block">โปรไฟล์</button>
                <button className="bg-white text-black px-5 py-2 rounded hover:bg-gray-200 transition font-bold">เข้าสู่ระบบ</button>
            </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        
        {/* Search Bar */}
        <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-2xl">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                    type="text" 
                    placeholder="ค้นหาอุปกรณ์เกมมิ่งของคุณ..." 
                    className="w-full bg-[#18181b] border border-white/10 rounded-full py-3 pl-12 pr-6 text-gray-300 focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 transition shadow-lg"
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
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left py-2 px-3 rounded transition text-sm ${
                                    selectedCategory === cat 
                                    ? 'bg-gradient-to-r from-red-900/40 to-transparent text-red-500 font-bold border-l-2 border-red-500' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {cat === 'All' ? 'ทั้งหมด' : cat}
                            </button>
                        ))}
                    </div>

                    {/* ✅ Price Range Filter (แก้ไขแล้ว) */}
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
                        {/* ปุ่มกดเพื่อยืนยันการกรอง */}
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
                        ทั้งหมด <span className="text-gray-500 text-base font-normal">({filteredProducts.length} รายการ)</span>
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
                                <p className="text-gray-500 text-xs mb-1">{product.category?.name || 'Gaming Gear'}</p>
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
                        <p className="text-xl">ไม่พบสินค้าที่คุณค้นหา</p>
                        <p className="text-sm mt-2">ลองเปลี่ยนช่วงราคา หรือคำค้นหาดูใหม่นะครับ</p>
                        <button 
                            onClick={() => { setMinPrice(''); setMaxPrice(''); setAppliedMin(0); setAppliedMax(Infinity); }}
                            className="mt-4 text-red-500 underline hover:text-red-400"
                        >
                            ล้างค่าการค้นหา
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;