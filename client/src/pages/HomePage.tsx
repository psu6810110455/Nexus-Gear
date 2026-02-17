import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import logoImg from '../assets/logo.png'; 

const MOCK_PRODUCTS = [
    { id: 1, name: 'ROG Phone 7', price: 34990, imageUrl: 'https://dlcdnwebimgs.asus.com/gain/44268636-6202-4048-96bd-276632057342/w800' },
    { id: 2, name: 'Black Shark 5', price: 18900, imageUrl: 'https://m.media-amazon.com/images/I/61imgK9J+lL.jpg' },
    { id: 3, name: 'HyperX Cloud', price: 2990, imageUrl: 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_alpha_red_1_main_900x.jpg' },
    { id: 4, name: 'Kishi V2', price: 3590, imageUrl: 'https://m.media-amazon.com/images/I/61iXE1nZkGL.jpg' },
    { id: 5, name: 'ROG Kunai 3', price: 3990, imageUrl: 'https://dlcdnwebimgs.asus.com/gain/57F833C8-94D9-4824-913A-98C152B336A1' },
    { id: 6, name: 'Flydigi Apex 3', price: 2990, imageUrl: 'https://m.media-amazon.com/images/I/61K-x+w+pXIL._AC_SL1500_.jpg' },
    { id: 7, name: 'Finger Sleeve', price: 190, imageUrl: 'https://m.media-amazon.com/images/I/61+y+w+pXIL._AC_SL1500_.jpg' },
    { id: 8, name: 'Cooler Fan', price: 990, imageUrl: 'https://m.media-amazon.com/images/I/61t-XhJ-xRL.jpg' },
];

function HomePage() {
  // ✅ เริ่มต้นเป็น false ก่อน เพื่อรอเช็ค sessionStorage
  const [showWelcome, setShowWelcome] = useState(false);
  const [products, setProducts] = useState<any[]>(MOCK_PRODUCTS);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ เช็คว่าเคยเข้าเว็บมารึยัง (sessionStorage)
    const hasVisited = sessionStorage.getItem('visitedNexusGear');
    
    if (!hasVisited) {
        // ถ้ายังไม่เคยเข้า ให้โชว์ Popup
        setShowWelcome(true);
    }

    axios.get('http://localhost:3000/products')
      .then(res => {
         if(res.data && res.data.length > 0) {
            setProducts(res.data); 
         }
      })
      .catch(err => console.log("Using Mock Data"));
  }, []);

  const handleEnterSite = () => {
    // ✅ บันทึกว่าเข้าเว็บแล้ว จะได้ไม่ถามอีก
    sessionStorage.setItem('visitedNexusGear', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden flex flex-col items-center">
      
      {/* --- WELCOME POPUP --- */}
      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500">
          <div className="bg-black border-2 border-red-600 rounded-[30px] p-8 w-full max-w-sm mx-4 shadow-[0_0_60px_rgba(220,38,38,0.6)] flex flex-col items-center text-center relative overflow-hidden">
             <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-red-900/40 to-transparent pointer-events-none"></div>
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

             <button onClick={handleEnterSite} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-900/50 mt-2">
                เข้าสู่เว็บไซต์
             </button>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="w-full flex justify-between items-center px-6 py-6 max-w-6xl z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoImg} alt="Logo" className="h-8 w-auto drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]" />
            <span className="text-lg font-bold tracking-widest text-white">NEXUS GEAR</span>
        </div>
        <div className="flex gap-4 text-xs font-bold text-gray-400">
             <button className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-200 transition">เข้าสู่ระบบ</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="text-center mt-6 mb-8 relative z-10">
         <h1 className="text-3xl md:text-5xl font-black leading-tight uppercase tracking-tight drop-shadow-xl">
            <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">
                โทรศัพท์เกมมิ่ง
            </span> 
            <br/>
            {/* ✅ เปลี่ยน "อุปกรณ์เกมมิ่ง" เป็นสีแดงและมี Glow ตามคำขอ */}
            <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">
                อุปกรณ์เกมมิ่ง
            </span>
         </h1>
         
         <button 
            onClick={() => navigate('/shop')} 
            className="mt-6 bg-white text-black text-sm font-bold px-8 py-2.5 rounded hover:scale-105 transition shadow-[0_0_15px_rgba(255,255,255,0.4)]"
         >
            ดูสินค้า
         </button>
      </div>

      {/* --- PRODUCT CARD SECTION --- */}
      <div className="w-full max-w-5xl px-4 pb-20 z-10">
        <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-2xl min-h-[500px] relative">
            
            <div className="text-center mb-8">
                <h2 className="text-red-600 font-extrabold text-lg inline-block border-b-2 border-red-600 pb-1">
                    โปรโมชั่น
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="group cursor-pointer flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="w-full aspect-square flex items-center justify-center mb-3">
                            <img 
                                src={product.imageUrl || product.image_url} 
                                alt={product.name} 
                                className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {e.currentTarget.src = 'https://placehold.co/150x150?text=No+Image'}}
                            />
                        </div>
                         <div className="text-center">
                            <p className="text-gray-800 font-bold text-sm mb-1 group-hover:text-red-600 transition truncate w-32">
                                {product.name}
                            </p>
                            <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">
                                ฿{Number(product.price).toLocaleString()}
                            </span>
                         </div>
                    </div>
                ))}
            </div>

        </div>
      </div>

    </div>
  );
}

export default HomePage;