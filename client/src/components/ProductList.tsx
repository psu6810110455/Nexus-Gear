import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Interface ปรับให้รองรับทั้งแบบเดิมและแบบ NestJS
interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  // รองรับทั้ง 2 ชื่อ เผื่อ Backend ส่งมาไม่เหมือนกัน
  image_url?: string; 
  imageUrl?: string;
  rating_average?: number;
  category?: { name: string };
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // รายชื่อหมวดหมู่ (ถ้าดึงจาก API ได้จะดีมาก แต่ใช้ Hardcode ไปก่อนตามดีไซน์)
  const categories = ['ทั้งหมด', 'มือถือเกมมิ่ง', 'จอยควบคุม', 'หูฟัง', 'พัดลมระบายอากาศ', 'ถุงนิ้วเกมมิ่ง'];

  useEffect(() => {
    // ดึงข้อมูลจาก Backend NestJS
    axios.get('http://localhost:3000/products')
      .then(res => {
        console.log("Data received:", res.data); // เช็คข้อมูลใน Console
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันกรองสินค้า
  const filteredProducts = selectedCategory === 'ทั้งหมด' 
    ? products 
    : products.filter(p => p.category?.name === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans">
      {/* Header Section */}
      <header className="border-b border-white/10 py-6 bg-[#1a1a1f]">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="ค้นหาอุปกรณ์เกมมิ่งของคุณ..." 
              className="w-full bg-[#27272a] border border-white/10 rounded-full py-3 px-12 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition text-sm"
            />
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div className="bg-[#18181b] p-6 rounded-xl border border-white/5 shadow-lg">
            <h3 className="text-red-500 font-bold mb-6 flex items-center gap-3 text-lg">
              <span className="w-1.5 h-6 bg-red-600 rounded-full"></span> FILTER
            </h3>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">หมวดหมู่</p>
              {categories.map((cat) => (
                <div 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'text-white bg-red-600/20 border-l-2 border-red-600 font-medium' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
               {selectedCategory} <span className="text-sm font-normal text-gray-500">({filteredProducts.length} รายการ)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Loading Skeleton
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#18181b] h-80 animate-pulse rounded-2xl border border-white/5"></div>
              ))
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="group bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 shadow-xl hover:shadow-red-900/10 flex flex-col h-full">
                  
                  {/* ส่วนแสดงรูปภาพ + Image Fallback */}
                  <div className="aspect-square bg-white p-6 relative overflow-hidden flex items-center justify-center">
                    <img 
                      // ลองใช้ image_url ก่อน ถ้าไม่มีใช้ imageUrl ถ้าไม่มีใช้ Placeholder
                      src={product.image_url || product.imageUrl || 'https://placehold.co/600x400?text=No+Image'} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
                      onError={(e) => {
                        // ถ้าโหลดรูปไม่ได้ ให้เปลี่ยนเป็นรูปนี้ทันที
                        e.currentTarget.src = 'https://placehold.co/600x400/png?text=Nexus+Gear'; 
                        e.currentTarget.onerror = null;
                      }}
                    />
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">HOT</span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                        {product.category?.name || 'GAMING GEAR'}
                    </p>
                    <h3 className="font-bold text-sm mb-4 line-clamp-2 text-gray-100 group-hover:text-red-500 transition-colors flex-1">
                        {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] text-gray-500">ราคา</p>
                        <p className="text-red-500 font-bold text-lg">฿{Number(product.price).toLocaleString()}</p>
                      </div>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-red-600/20 active:scale-95">
                        ซื้อเลย
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;