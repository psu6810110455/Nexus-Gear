import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  image_url?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'ROG Phone 7',    price: 34990, imageUrl: 'https://dlcdnwebimgs.asus.com/gain/44268636-6202-4048-96bd-276632057342/w800' },
  { id: 2, name: 'Black Shark 5',  price: 18900, imageUrl: 'https://m.media-amazon.com/images/I/61imgK9J+lL.jpg' },
  { id: 3, name: 'HyperX Cloud',   price: 2990,  imageUrl: 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_alpha_red_1_main_900x.jpg' },
  { id: 4, name: 'Kishi V2',       price: 3590,  imageUrl: 'https://m.media-amazon.com/images/I/61iXE1nZkGL.jpg' },
  { id: 5, name: 'ROG Kunai 3',    price: 3990,  imageUrl: 'https://dlcdnwebimgs.asus.com/gain/57F833C8-94D9-4824-913A-98C152B336A1' },
  { id: 6, name: 'Flydigi Apex 3', price: 2990,  imageUrl: 'https://m.media-amazon.com/images/I/61K-x+w+pXIL._AC_SL1500_.jpg' },
  { id: 7, name: 'Finger Sleeve',  price: 190,   imageUrl: 'https://m.media-amazon.com/images/I/61+y+w+pXIL._AC_SL1500_.jpg' },
  { id: 8, name: 'Cooler Fan',     price: 990,   imageUrl: 'https://m.media-amazon.com/images/I/61t-XhJ-xRL.jpg' },
];

function HomePage() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome]   = useState(false);
  const [products, setProducts]         = useState<Product[]>(MOCK_PRODUCTS);
  const [language, setLanguage]         = useState<'TH' | 'EN'>('TH');
  const [showLangModal, setShowLangModal] = useState(false); // เปลี่ยนจาก Menu เป็น Modal

  useEffect(() => {
    if (!sessionStorage.getItem('visitedNexusGear')) setShowWelcome(true);

    axios.get('http://localhost:3000/products')
      .then(res => {
        if (res.data?.length > 0) {
          const shuffled = [...res.data].sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 8));
        }
      })
      .catch(() => setProducts(MOCK_PRODUCTS.slice(0, 8)));
  }, []);

  const handleEnterSite = () => {
    sessionStorage.setItem('visitedNexusGear', 'true');
    setShowWelcome(false);
  };

  const text = {
    TH: { title: 'โทรศัพท์เกมมิ่ง\nอุปกรณ์เกมมิ่ง', btn: 'ดูสินค้า', promo: 'สินค้าแนะนำ', login: 'เข้าสู่ระบบ', register: 'สร้างบัญชีผู้ใช้', viewAll: 'ดูสินค้าทั้งหมด →', select: 'กรุณาเลือกภาษาที่คุณต้องการใช้งาน' },
    EN: { title: 'GAMING PHONE\nGAMING GEAR',    btn: 'View Product', promo: 'PROMOTION',    login: 'Login',        register: 'Register',          viewAll: 'View All →',           select: 'PLEASE SELECT YOUR LANGUAGE' },
  };
  const t = text[language];

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] overflow-x-hidden relative selection:bg-[#990000] selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');`}</style>

      {/* ── Background Effects ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#2E0505] blur-[150px] opacity-60 rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#2E0505] blur-[150px] opacity-60 rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#FF0000] rounded-tl-3xl opacity-70 drop-shadow-[0_0_10px_#FF0000]"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-[#FF0000] rounded-tr-3xl opacity-70 drop-shadow-[0_0_10px_#FF0000]"></div>
      </div>

      {/* ── Welcome Popup ── */}
      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="bg-[#000000] border-2 border-[#FF0000] rounded-[30px] p-8 w-full max-w-sm mx-4 shadow-[0_0_60px_rgba(255,0,0,0.6)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#2E0505]/60 to-transparent pointer-events-none"></div>
            <h2 className="text-xl font-['Orbitron'] font-bold text-white mb-1 tracking-wider mt-4">WELCOME TO NEXUS GEAR</h2>
            <p className="text-[#F2F4F6]/70 text-sm mb-6 font-['Kanit']">ยินดีต้อนรับสู่ NEXUS GEAR</p>

            <button
              onClick={handleEnterSite}
              className="w-full bg-[#990000] hover:bg-[#FF0000] text-white font-['Orbitron'] font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(153,0,0,0.5)] tracking-wider"
            >
              เข้าสู่เว็บไซต์
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Language Button ── */}
      <button
        onClick={() => setShowLangModal(true)}
        className="fixed bottom-8 right-8 z-[100] bg-[#1a0505] border border-[#990000] hover:border-[#FF0000] hover:bg-[#2E0505] text-[#F2F4F6] p-4 rounded-full shadow-[0_0_15px_rgba(153,0,0,0.5)] transition-all hover:scale-110 flex items-center justify-center group"
        title="Select Language"
      >
        <Globe className="w-6 h-6 group-hover:text-[#FF0000] transition-colors" />
      </button>

      {/* ── Language Selection Pop-up (Modal) ── */}
      {showLangModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111111] border-2 border-[#990000] rounded-2xl p-8 w-full max-w-sm text-center shadow-[0_0_40px_rgba(255,0,0,0.4)] relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLangModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#FF0000] transition-colors"
            >
              ✕
            </button>
            <Globe className="w-12 h-12 text-[#FF0000] mx-auto mb-4 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
            <h3 className="text-xl font-['Orbitron'] text-white mb-2 tracking-wider">LANGUAGE</h3>
            <p className="text-sm text-gray-400 font-['Kanit'] mb-6">{t.select}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => { setLanguage('TH'); setShowLangModal(false); }}
                className={`w-full py-3 rounded-lg font-['Kanit'] font-bold transition-all ${language === 'TH' ? 'bg-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'bg-transparent border border-gray-600 text-gray-300 hover:border-[#FF0000] hover:text-[#FF0000]'}`}
              >
                ภาษาไทย
              </button>
              <button
                onClick={() => { setLanguage('EN'); setShowLangModal(false); }}
                className={`w-full py-3 rounded-lg font-['Orbitron'] font-bold transition-all ${language === 'EN' ? 'bg-[#FF0000] text-white shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'bg-transparent border border-gray-600 text-gray-300 hover:border-[#FF0000] hover:text-[#FF0000]'}`}
              >
                ENGLISH
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 flex flex-col items-center pt-20 pb-20">

        {/* ── Welcome Title ── */}
        <div className="text-center space-y-2 mb-10 animate-in fade-in zoom-in duration-700">
          <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-bold text-white uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {language === 'EN' ? 'WELCOME TO NEXUS GEAR' : 'ยินดีต้อนรับสู่ NEXUS GEAR'}
          </h2>
          {language === 'EN' && <p className="text-xl text-[#F2F4F6]/60 font-['Kanit']">ยินดีต้อนรับสู่ NEXUS GEAR</p>}
        </div>

        {/* ── Hero Banner ── */}
        <div className="relative w-full max-w-4xl mx-auto text-center py-16 mb-12 px-8">
          <div className="absolute top-0 left-4 w-14 h-full border-l-4 border-t-4 border-b-4 border-[#FF0000] rounded-l-3xl opacity-80 drop-shadow-[0_0_12px_#FF0000] hidden md:block"></div>
          <div className="absolute top-0 right-4 w-14 h-full border-r-4 border-t-4 border-b-4 border-[#FF0000] rounded-r-3xl opacity-80 drop-shadow-[0_0_12px_#FF0000] hidden md:block"></div>

          <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-black text-white leading-tight tracking-widest whitespace-pre-line drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
            {t.title}
          </h1>

          <button
            onClick={() => navigate('/shop')}
            className="mt-10 bg-white text-black font-['Orbitron'] font-black py-3 px-10 rounded-lg text-lg tracking-widest hover:bg-[#FF0000] hover:text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)]"
          >
            {t.btn}
          </button>
        </div>

        {/* ── Featured Products (White Box) ── */}
        <div className="w-full max-w-5xl px-4">
          <h3 className="text-center font-['Orbitron'] font-bold text-2xl mb-6 text-white tracking-widest drop-shadow-md">
            {t.promo}
          </h3>

          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_0_50px_rgba(255,0,0,0.1)] min-h-[500px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="flex flex-col items-center group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-full aspect-square flex items-center justify-center mb-3">
                    <img
                      src={product.imageUrl ?? product.image_url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150?text=No+Image'; }}
                    />
                  </div>
                  <p className="text-gray-800 font-bold text-sm mb-1 group-hover:text-[#FF0000] transition truncate w-full text-center font-['Kanit']">
                    {product.name}
                  </p>
                  <span className="text-[#FF0000] text-xs font-['Orbitron'] font-bold bg-red-50 px-2 py-1 rounded">
                    ฿{Number(product.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => navigate('/shop')}
                className="text-gray-400 hover:text-[#FF0000] font-bold text-sm transition-colors border border-gray-200 px-6 py-2 rounded-full hover:border-[#FF0000] font-['Kanit']"
              >
                {t.viewAll}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer accent */}
      <div className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-40"></div>
    </div>
  );
}

export default HomePage;