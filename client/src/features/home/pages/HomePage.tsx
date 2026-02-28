// ============================================================
// src/features/home/pages/HomePage.tsx
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../../shared/services/api';
import type { Product } from '../../../shared/types';
import ProductCard from '../../products/components/ProductCard';

// ── WelcomePopup (รวมไว้ที่นี่) ──────────────────────────────
interface WelcomePopupProps { isOpen: boolean; onEnter: () => void; }

function WelcomePopup({ isOpen, onEnter }: WelcomePopupProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500">
      <div className="bg-black border-2 border-red-600 rounded-[30px] p-8 w-full max-w-sm mx-4 shadow-[0_0_60px_rgba(220,38,38,0.6)] flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 w-full h-24 bg-linear-to-b from-red-900/40 to-transparent pointer-events-none" />
        <h2 className="text-xl font-bold text-white mb-1 tracking-wider mt-4">WELCOME TO NEXUS GEAR</h2>
        <p className="text-white text-md mb-6 font-medium">ยินดีต้อนรับสู่ NEXUS GEAR</p>
        <div className="w-full text-left mb-6">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">PLEASE SELECT YOUR LANGUAGE</p>
          <div className="relative">
            <select className="w-full bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-lg px-4 py-3 appearance-none focus:border-red-600 outline-none cursor-pointer">
              <option>ภาษาไทย</option>
              <option>English</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
        </div>
        <button onClick={onEnter} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-900/50 mt-2">
          เข้าสู่เว็บไซต์
        </button>
      </div>
    </div>
  );
}

// ── Mock Data ─────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'ROG Phone 7',    price: 34990, imageUrl: 'https://dlcdnwebimgs.asus.com/gain/44268636-6202-4048-96bd-276632057342/w800' },
  { id: 2, name: 'Black Shark 5',  price: 18900, imageUrl: 'https://m.media-amazon.com/images/I/61imgK9J+lL.jpg' },
  { id: 3, name: 'HyperX Cloud',   price:  2990, imageUrl: 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_alpha_red_1_main_900x.jpg' },
  { id: 4, name: 'Kishi V2',       price:  3590, imageUrl: 'https://m.media-amazon.com/images/I/61iXE1nZkGL.jpg' },
  { id: 5, name: 'ROG Kunai 3',    price:  3990, imageUrl: 'https://dlcdnwebimgs.asus.com/gain/57F833C8-94D9-4824-913A-98C152B336A1' },
  { id: 6, name: 'Flydigi Apex 3', price:  2990, imageUrl: 'https://m.media-amazon.com/images/I/61K-x+w+pXIL._AC_SL1500_.jpg' },
  { id: 7, name: 'Finger Sleeve',  price:   190, imageUrl: 'https://m.media-amazon.com/images/I/61+y+w+pXIL._AC_SL1500_.jpg' },
  { id: 8, name: 'Cooler Fan',     price:   990, imageUrl: 'https://m.media-amazon.com/images/I/61t-XhJ-xRL.jpg' },
];

// ── Page ──────────────────────────────────────────────────────
function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [products, setProducts]       = useState<Product[]>(MOCK_PRODUCTS);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('visitedNexusGear')) setShowWelcome(true);
    getProducts()
      .then((data) => {
        if (data?.length > 0) {
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 8));
        }
      })
      .catch(() => setProducts(MOCK_PRODUCTS.slice(0, 8)));
  }, []);

  const handleEnterSite = () => {
    sessionStorage.setItem('visitedNexusGear', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden flex flex-col items-center">
      <WelcomePopup isOpen={showWelcome} onEnter={handleEnterSite} />
      <div className="text-center mt-12 mb-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight drop-shadow-xl">
          <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">โทรศัพท์เกมมิ่ง</span>
          <br />
          <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">อุปกรณ์เกมมิ่ง</span>
        </h1>
        <button onClick={() => navigate('/shop')} className="mt-6 bg-white text-black text-sm font-bold px-8 py-2.5 rounded hover:scale-105 transition shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          ดูสินค้าทั้งหมด
        </button>
      </div>
      <div className="w-full max-w-5xl px-4 pb-20 z-10">
        <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-2xl min-h-125">
          <div className="text-center mb-8">
            <h2 className="text-red-600 font-extrabold text-lg inline-block border-b-2 border-red-600 pb-1">สินค้าแนะนำ</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => navigate('/shop')} className="text-gray-400 hover:text-red-600 font-bold text-sm transition-colors border border-gray-200 px-6 py-2 rounded-full hover:border-red-600">
              ดูสินค้าทั้งหมด →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;