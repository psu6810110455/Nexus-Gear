import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Interface ตรงตาม DB (image_url, rating_average)
interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string; 
  rating_average: number;
  category_id: number;
  category?: { name: string };
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  useEffect(() => {
    // ดึงข้อมูลจาก Backend
    axios.get('http://localhost:3000/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // ฟังก์ชันกรองสินค้า
  const filteredProducts = selectedCategory === 'ทั้งหมด' 
    ? products 
    : products.filter(p => p.category?.name === selectedCategory);

  const categories = ['ทั้งหมด', 'มือถือเกมมิ่ง', 'จอยควบคุม', 'หูฟัง', 'พัดลมระบายอากาศ', 'ถุงนิ้วเกมมิ่ง'];

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="ค้นหาอุปกรณ์เกมมิ่งของคุณ..." 
              className="w-full bg-dark-card border border-white/10 rounded-full py-3 px-12 focus:border-primary outline-none transition"
            />
            <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="bg-dark-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary"></span> FILTER
            </h3>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase font-bold">หมวดหมู่</p>
              {categories.map((cat) => (
                <div 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer p-2 rounded text-sm transition ${
                    selectedCategory === cat ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-white'
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
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary"></span> {selectedCategory} ({filteredProducts.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="bg-dark-card h-80 animate-pulse rounded-2xl"></div>)
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="group bg-dark-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-2xl">
                  <div className="aspect-square bg-white p-8 relative">
                    {/* ใช้ image_url ให้ตรงกับ Database */}
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" />
                    <span className="absolute top-3 right-3 bg-primary text-[10px] font-bold px-2 py-1 rounded">HOT</span>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-gray-500 mb-1">{product.category?.name || 'Gaming Gear'}</p>
                    <h3 className="font-bold text-sm mb-4 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-500">ราคา</p>
                        <p className="text-primary font-bold text-lg">฿{product.price.toLocaleString()}</p>
                      </div>
                      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition">
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

export default App;