import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock Data สินค้า (เดี๋ยวเราเปลี่ยนไปดึงจาก Backend ได้)
// หรือใช้ Component ProductList ที่เราทำไว้แล้วมาใส่ก็ได้ครับ
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true); // ควบคุม Popup
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงสินค้ามาโชว์ (ตัวอย่าง 8 ชิ้น)
    axios.get('http://localhost:3000/products').then(res => {
        setProducts(res.data.slice(0, 8));
    });
  }, []);

  const handleEnterSite = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white relative font-sans">
      
      {/* === 1. Welcome Overlay (Popup) === */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500">
          <div className="bg-black border-2 border-red-600 rounded-3xl p-10 text-center max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.5)] mx-4">
             <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-2">
                Welcome to <span className="text-red-600">Nexus Gear</span>
             </h1>
             <p className="text-gray-400 text-sm mb-8">ยินดีต้อนรับสู่ NEXUS GEAR</p>

             <div className="mb-8">
                <label className="text-xs text-gray-500 block mb-2">PLEASE SELECT YOUR LANGUAGE</label>
                <select className="w-full bg-[#18181b] text-white border border-gray-700 rounded p-2 focus:border-red-600 outline-none">
                    <option>ภาษาไทย</option>
                    <option>English</option>
                </select>
             </div>

             <button 
                onClick={handleEnterSite}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition shadow-lg shadow-red-900/50"
             >
                เข้าสู่เว็บไซต์
             </button>
          </div>
        </div>
      )}

      {/* === 2. Main Content (Home Page 2 & 3) === */}
      <nav className="flex justify-between items-center p-6 container mx-auto">
        <div className="text-2xl font-bold text-white">NEXUS <span className="text-red-600">GEAR</span></div>
        <div className="flex gap-4 text-sm font-medium">
             <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-red-500">Admin Login</button>
             <button className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-200 font-bold">เข้าสู่ระบบ</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 mt-8 text-center">
         <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            โทรศัพท์เกมมิ่ง <br/> <span className="text-red-600">อุปกรณ์เกมมิ่ง</span>
         </h1>
         <button className="bg-white text-black font-bold px-8 py-2 rounded-full hover:bg-gray-200 transition mt-4 mb-16">
            ดูสินค้า
         </button>

         {/* Grid สินค้า */}
         <div className="bg-white rounded-[40px] p-8 md:p-12 min-h-[500px] shadow-2xl relative z-10">
            <h2 className="text-red-600 font-bold text-xl mb-6 text-left border-b border-gray-200 pb-2">โปรโมชั่นแนะนำ</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                        <div className="aspect-square bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden p-4">
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="object-contain max-h-full group-hover:scale-110 transition duration-300"
                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200'; }}
                            />
                        </div>
                        {/* <h3 className="text-black font-bold text-sm truncate">{product.name}</h3> */}
                        {/* ตามดีไซน์ Home page อาจจะไม่โชว์ชื่อ เน้นรูปสวยๆ */}
                    </div>
                ))}
            </div>
         </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="h-24 bg-gradient-to-t from-red-900/20 to-transparent fixed bottom-0 w-full -z-10"></div>
    </div>
  );
}

export default HomePage;