import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../navigation/components/Navbar';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  image_url?: string;
  tagline?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'ROG Phone 7',    price: 34990, tagline: 'Ultimate Gaming Beast',   imageUrl: 'https://dlcdnwebimgs.asus.com/gain/44268636-6202-4048-96bd-276632057342/w800' },
  { id: 2, name: 'Black Shark 5',  price: 18900, tagline: 'Born to Dominate',        imageUrl: 'https://m.media-amazon.com/images/I/61imgK9J+lL.jpg' },
  { id: 3, name: 'HyperX Cloud',   price: 2990,  tagline: 'Hear Every Footstep',     imageUrl: 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_alpha_red_1_main_900x.jpg' },
  { id: 4, name: 'Kishi V2',       price: 3590,  tagline: 'Console Feel. Mobile Power.', imageUrl: 'https://m.media-amazon.com/images/I/61iXE1nZkGL.jpg' },
  { id: 5, name: 'ROG Kunai 3',    price: 3990,  tagline: 'Precision. Redefined.',   imageUrl: 'https://dlcdnwebimgs.asus.com/gain/57F833C8-94D9-4824-913A-98C152B336A1' },
  { id: 6, name: 'Flydigi Apex 3', price: 2990,  tagline: 'Pro-Level Control',       imageUrl: 'https://m.media-amazon.com/images/I/61K-x+w+pXIL._AC_SL1500_.jpg' },
  { id: 7, name: 'Finger Sleeve',  price: 190,   tagline: 'Swipe Faster. Win More.', imageUrl: 'https://m.media-amazon.com/images/I/61+y+w+pXIL._AC_SL1500_.jpg' },
  { id: 8, name: 'Cooler Fan',     price: 990,   tagline: 'Stay Cool. Stay Sharp.',  imageUrl: 'https://m.media-amazon.com/images/I/61t-XhJ-xRL.jpg' },
];

function HomePage() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome]     = useState(false);
  const [products, setProducts]           = useState<Product[]>(MOCK_PRODUCTS);
  const [language, setLanguage]           = useState<'TH' | 'EN'>('TH');
  const [showLangModal, setShowLangModal] = useState(false);
  const [activeSlide, setActiveSlide]     = useState(0);
  const [isAnimating, setIsAnimating]     = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem('visitedNexusGear')) setShowWelcome(true);
    axios.get('http://localhost:3000/products')
      .then(res => { if (res.data?.length > 0) { const s = [...res.data].sort(() => 0.5 - Math.random()); setProducts(s.slice(0, 8)); } })
      .catch(() => setProducts(MOCK_PRODUCTS.slice(0, 8)));
  }, []);

  // Auto-play carousel
  useEffect(() => {
    autoplayRef.current = setInterval(() => goTo((prev) => (prev + 1) % products.length), 4500);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [products.length]);

  const goTo = (indexOrFn: number | ((prev: number) => number)) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(typeof indexOrFn === 'function' ? indexOrFn : () => indexOrFn);
    setTimeout(() => setIsAnimating(false), 600);
    if (autoplayRef.current) { clearInterval(autoplayRef.current); autoplayRef.current = setInterval(() => goTo((p) => (p + 1) % products.length), 4500); }
  };

  const prev = () => goTo((p) => (p - 1 + products.length) % products.length);
  const next = () => goTo((p) => (p + 1) % products.length);

  const handleEnterSite = () => { sessionStorage.setItem('visitedNexusGear', 'true'); setShowWelcome(false); };

  const t = {
    TH: { shop: 'ร้านค้า', about: 'เกี่ยวกับ', contact: 'ติดต่อ', explore: 'สำรวจสินค้า', promo: 'สินค้าแนะนำ', viewAll: 'ดูสินค้าทั้งหมด', login: 'เข้าสู่ระบบ', select: 'กรุณาเลือกภาษา', learnMore: 'เรียนรู้เพิ่มเติม', buy: 'ซื้อเลย' },
    EN: { shop: 'SHOP', about: 'ABOUT', contact: 'CONTACT', explore: 'EXPLORE', promo: 'FEATURED PRODUCTS', viewAll: 'VIEW ALL PRODUCTS', login: 'LOGIN', select: 'SELECT YOUR LANGUAGE', learnMore: 'LEARN MORE', buy: 'BUY NOW' },
  }[language];

  const current = products[activeSlide] ?? products[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#F2F4F6] overflow-x-hidden relative selection:bg-[#990000] selection:text-white" style={{ fontFamily: "'Kanit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');

        :root {
          --color-primary: #dc2626;
          --color-primary-hover: #b91c1c;
          --color-primary-dark: #7f1d1d;
          --color-primary-glow: rgba(220,38,38,0.3);
          --color-bg: #0a0a0a;
          --color-bg-deep: #050000;
          --color-bg-card: #18181b;
          --color-border: rgba(127,29,29,0.3);
          --color-text-primary: #f87171;
          --color-text-muted: #9ca3af;
        }

        .orbitron { font-family: 'Orbitron', sans-serif; }



        /* ── Promo Banner ── */
        .promo-banner {
          background: linear-gradient(90deg, transparent, #dc2626, transparent);
          text-align: center; padding: 8px; font-size: 0.75rem;
          font-family: 'Orbitron', sans-serif; letter-spacing: 0.2em; color: #fff;
          position: relative; overflow: hidden;
        }
        .promo-banner::before {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer { to { left: 100%; } }

        /* ── Hero Slider ── */
        .hero-wrapper {
          position: relative; width: 100%; height: 100vh; min-height: 600px;
          overflow: hidden; display: flex; align-items: center;
        }
        .hero-bg-layer {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 50%, #2e0505 0%, #050000 60%, #000 100%);
        }
        .hero-grid {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: linear-gradient(rgba(220,38,38,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.5) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .hero-accent-left {
          position: absolute; left: 0; top: 0; width: 6px; height: 100%;
          background: linear-gradient(to bottom, transparent, #dc2626, transparent);
        }
        .hero-content {
          position: relative; z-index: 10; width: 100%; padding: 0 4rem;
          margin: 0 auto; padding: 0 2rem;
          display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 4rem;
        }
        .hero-text-side { }
        .hero-tag {
          display: inline-block; font-family: 'Orbitron', sans-serif;
          font-size: 0.65rem; letter-spacing: 0.3em; color: #dc2626;
          border: 1px solid rgba(220,38,38,0.4); padding: 4px 14px;
          border-radius: 2px; margin-bottom: 1.5rem;
          background: rgba(220,38,38,0.08);
        }
        .hero-product-name {
          font-family: 'Orbitron', sans-serif; font-weight: 900;
          font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1;
          letter-spacing: -0.02em; color: #fff;
          text-shadow: 0 0 60px rgba(220,38,38,0.3);
          transition: opacity 0.4s, transform 0.4s;
        }
        .hero-product-name.slide-exit { opacity: 0; transform: translateX(-30px); }
        .hero-product-name.slide-enter { opacity: 1; transform: translateX(0); }
        .hero-tagline {
          font-size: 1.1rem; font-weight: 300; color: rgba(255,255,255,0.5);
          margin-top: 0.75rem; letter-spacing: 0.05em;
          transition: opacity 0.4s 0.1s, transform 0.4s 0.1s;
        }
        .hero-tagline.slide-exit { opacity: 0; transform: translateX(-20px); }
        .hero-tagline.slide-enter { opacity: 1; transform: translateX(0); }
        .hero-price {
          font-family: 'Orbitron', sans-serif; font-size: 2rem; font-weight: 700;
          color: #dc2626; margin-top: 2rem;
          text-shadow: 0 0 20px rgba(220,38,38,0.5);
        }
        .hero-btns { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
        .btn-hero-primary {
          font-family: 'Orbitron', sans-serif; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.15em; padding: 14px 36px; border: none; border-radius: 4px;
          background: #dc2626; color: #fff; cursor: pointer;
          box-shadow: 0 0 30px rgba(220,38,38,0.5); transition: all 0.3s;
        }
        .btn-hero-primary:hover { background: #b91c1c; transform: translateY(-2px); box-shadow: 0 0 50px rgba(220,38,38,0.7); }
        .btn-hero-ghost {
          font-family: 'Orbitron', sans-serif; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.15em; padding: 14px 36px; border-radius: 4px;
          background: transparent; color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s;
        }
        .btn-hero-ghost:hover { border-color: #dc2626; color: #fff; background: rgba(220,38,38,0.1); }

        .hero-image-side {
          display: flex; align-items: center; justify-content: center;
          position: relative; height: 70vh;
        }
        .hero-image-glow {
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%);
        }
        .hero-img {
          max-height: 80%; max-width: 90%; object-fit: contain;
          filter: drop-shadow(0 20px 60px rgba(220,38,38,0.4));
          transition: opacity 0.5s, transform 0.5s;
          position: relative; z-index: 2;
        }
        .hero-img.slide-exit { opacity: 0; transform: scale(0.9) translateX(40px); }
        .hero-img.slide-enter { opacity: 1; transform: scale(1) translateX(0); }

        /* Slider controls */
        .slider-nav {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 1.5rem; z-index: 20;
        }
        .slider-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(0,0,0,0.6); border: 1px solid rgba(220,38,38,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #dc2626; transition: all 0.2s;
        }
        .slider-arrow:hover { background: rgba(220,38,38,0.3); border-color: #dc2626; transform: scale(1.1); }
        .slider-dots { display: flex; gap: 8px; align-items: center; }
        .slider-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s;
        }
        .slider-dot.active {
          background: #dc2626; width: 24px; border-radius: 3px;
          box-shadow: 0 0 8px rgba(220,38,38,0.6);
        }
        .slide-counter {
          font-family: 'Orbitron', sans-serif; font-size: 0.7rem; color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
        }

        /* ── Featured Grid ── */
        .section-label {
          font-family: 'Orbitron', sans-serif; font-size: 0.65rem; letter-spacing: 0.4em;
          color: #dc2626; text-align: center; margin-bottom: 0.5rem;
        }
        .section-title {
          font-family: 'Orbitron', sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 900; text-align: center; color: #fff; letter-spacing: 0.05em;
          margin-bottom: 3rem;
        }
        .product-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5px;
        }
        @media(max-width:900px){ .product-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:600px){ .product-grid { grid-template-columns: repeat(2,1fr); } .hero-content { grid-template-columns: 1fr; } .hero-image-side { height: 40vh; } }
        .product-tile {
          background: #111; position: relative; overflow: hidden;
          cursor: pointer; aspect-ratio: 1 / 1;
          transition: z-index 0s;
        }
        .product-tile::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 60%, rgba(220,38,38,0.06) 100%);
          z-index: 1;
        }
        .product-tile-overlay {
          position: absolute; inset: 0; background: rgba(220,38,38,0.85);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.35s; z-index: 3;
        }
        .product-tile:hover .product-tile-overlay { opacity: 1; }
        .product-tile-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
          filter: grayscale(20%);
        }
        .product-tile:hover .product-tile-img { transform: scale(1.08); filter: grayscale(0%); }
        .product-tile-info {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
          padding: 1.5rem 1rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
          transform: translateY(8px); transition: transform 0.3s;
        }
        .product-tile:hover .product-tile-info { transform: translateY(0); }
        .tile-name {
          font-family: 'Orbitron', sans-serif; font-size: 0.85rem; font-weight: 700;
          color: #fff; letter-spacing: 0.05em;
        }
        .tile-price { font-size: 0.8rem; color: #f87171; font-weight: 600; margin-top: 2px; }
        .tile-overlay-text {
          font-family: 'Orbitron', sans-serif; font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.2em; color: #fff; margin-top: 0.5rem;
        }

        /* ── Divider ── */
        .red-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, #dc2626, transparent);
          margin: 0;
        }

        /* ── Footer strip ── */
        .footer-strip {
          padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(127,29,29,0.3); background: #050000;
          font-family: 'Orbitron', sans-serif; font-size: 0.65rem; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.25);
        }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-box {
          background: #111; border: 1px solid rgba(220,38,38,0.4);
          border-radius: 12px; padding: 2rem; width: 100%; max-width: 400px;
          text-align: center; box-shadow: 0 0 60px rgba(220,38,38,0.2);
          animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes modal-in { from { opacity:0; transform: scale(0.9); } to { opacity:1; transform: scale(1); } }
        .modal-close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; color: rgba(255,255,255,0.4);
          cursor: pointer; font-size: 1.2rem; transition: color 0.2s;
        }
        .modal-close:hover { color: #dc2626; }
        .lang-btn {
          width: 100%; padding: 14px; border-radius: 6px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.6); font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }
        .lang-btn.active { background: #dc2626; border-color: #dc2626; color: #fff; box-shadow: 0 0 20px rgba(220,38,38,0.4); }
        .lang-btn:not(.active):hover { border-color: #dc2626; color: #fff; }

        /* Welcome popup */
        .welcome-box {
          background: #000; border: 2px solid #dc2626; border-radius: 20px;
          padding: 2.5rem 2rem; max-width: 360px; width: 100%; text-align: center;
          box-shadow: 0 0 80px rgba(220,38,38,0.5);
          animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .welcome-logo { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; letter-spacing: 0.2em; color: #fff; margin-bottom: 0.25rem; }
        .welcome-logo span { color: #dc2626; }
        .welcome-sub { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-bottom: 2rem; }
        .btn-enter {
          width: 100%; padding: 14px; background: #dc2626; color: #fff;
          font-family: 'Orbitron', sans-serif; font-weight: 700; letter-spacing: 0.15em;
          font-size: 0.8rem; border: none; border-radius: 6px; cursor: pointer;
          box-shadow: 0 0 25px rgba(220,38,38,0.5); transition: all 0.3s;
        }
        .btn-enter:hover { background: #b91c1c; transform: translateY(-2px); }

        /* Floating globe */
        .globe-btn {
          position: fixed; bottom: 2rem; right: 2rem; z-index: 100;
          width: 52px; height: 52px; border-radius: 50%;
          background: #18181b; border: 1px solid rgba(127,29,29,0.6);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s; color: rgba(255,255,255,0.6);
          box-shadow: 0 0 20px rgba(220,38,38,0.2);
        }
        .globe-btn:hover { border-color: #dc2626; color: #dc2626; transform: scale(1.1); box-shadow: 0 0 30px rgba(220,38,38,0.4); }

        /* scan line effect */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scan-line {
          position: fixed; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(220,38,38,0.3), transparent);
          pointer-events: none; z-index: 999;
          animation: scanline 8s linear infinite;
        }
      `}</style>

      {/* Scan line */}
      <div className="scan-line"></div>

      {/* ── Welcome Popup ── */}
      {showWelcome && (
        <div className="modal-backdrop">
          <div className="welcome-box">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
            <div className="welcome-logo">NEXUS<span>GEAR</span></div>
            <div className="welcome-sub">ยินดีต้อนรับ · Welcome</div>
            <button className="btn-enter" onClick={handleEnterSite}>
              เข้าสู่เว็บไซต์ · ENTER
            </button>
          </div>
        </div>
      )}

      {/* ── Language Modal ── */}
      {showLangModal && (
        <div className="modal-backdrop" onClick={() => setShowLangModal(false)}>
          <div className="modal-box" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLangModal(false)}>✕</button>
            <Globe style={{ width: 36, height: 36, color: '#dc2626', margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.2em', color: '#fff', marginBottom: '0.35rem' }}>LANGUAGE</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{t.select}</div>
            <button className={`lang-btn ${language === 'TH' ? 'active' : ''}`} style={{ fontFamily: 'Kanit' }} onClick={() => { setLanguage('TH'); setShowLangModal(false); }}>🇹🇭 ภาษาไทย</button>
            <button className={`lang-btn ${language === 'EN' ? 'active' : ''}`} style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '0.15em' }} onClick={() => { setLanguage('EN'); setShowLangModal(false); }}>🇬🇧 ENGLISH</button>
          </div>
        </div>
      )}
      
      {/* ── Hero Slider ── */}
      <section className="hero-wrapper">
        <div className="hero-bg-layer"></div>
        <div className="hero-grid"></div>
        <div className="hero-accent-left"></div>

        {/* Slide number indicator */}
        <div style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.slice(0, 6).map((_, i) => (
            <div key={i} onClick={() => goTo(i)} className={`slider-dot${i === activeSlide ? ' active' : ''}`} style={{ cursor: 'pointer' }}></div>
          ))}
        </div>

        <div className="hero-content" style={{ paddingTop: '4rem' }}>
          {/* Text */}
          <div className="hero-text-side">
            <div className="hero-tag">NEXUS GEAR — MUST-HAVE PRODUCT</div>
            <h1 className={`hero-product-name ${isAnimating ? 'slide-exit' : 'slide-enter'}`}>
              {current.name}
            </h1>
            <p className={`hero-tagline ${isAnimating ? 'slide-exit' : 'slide-enter'}`}>
              {current.tagline}
            </p>
            <div className="hero-price">
              ฿{Number(current.price).toLocaleString()}
            </div>
            <div className="hero-btns">
              <button className="btn-hero-primary" onClick={() => navigate(`/products/${current.id}`)}>
                {t.buy}
              </button>
              <button className="btn-hero-ghost" onClick={() => navigate(`/products/${current.id}`)}>
                {t.learnMore}
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="hero-image-side">
            <div className="hero-image-glow"></div>
            <img
              key={activeSlide}
              src={current.imageUrl ?? current.image_url}
              alt={current.name}
              className={`hero-img ${isAnimating ? 'slide-exit' : 'slide-enter'}`}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/111/dc2626?text=NEXUS'; }}
            />
          </div>
        </div>

        {/* Slider nav */}
        <div className="slider-nav">
          <button className="slider-arrow" onClick={prev}><ChevronLeft size={18} /></button>
          <div className="slider-dots">
            {products.map((_, i) => (
              <div key={i} className={`slider-dot${i === activeSlide ? ' active' : ''}`} onClick={() => goTo(i)}></div>
            ))}
          </div>
          <button className="slider-arrow" onClick={next}><ChevronRight size={18} /></button>
          <div className="slide-counter">{String(activeSlide + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</div>
        </div>
      </section>

      <div className="red-divider"></div>

      {/* ── Featured Products Grid ── */}
      <section style={{ padding: '5rem 2rem'}}>
        <div className="section-label">— {language === 'TH' ? 'คัดสรรมาเพื่อคุณ' : 'HAND PICKED'} —</div>
        <h2 className="section-title">{t.promo}</h2>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-tile" onClick={() => navigate(`/products/${product.id}`)}>
              <img
                src={product.imageUrl ?? product.image_url}
                alt={product.name}
                className="product-tile-img"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/111/dc2626?text=NO+IMG'; }}
              />
              <div className="product-tile-info">
                <div className="tile-name">{product.name}</div>
                <div className="tile-price">฿{Number(product.price).toLocaleString()}</div>
              </div>
              <div className="product-tile-overlay">
                <ShoppingCart size={28} color="#fff" />
                <div className="tile-overlay-text">{language === 'TH' ? 'ดูสินค้า' : 'VIEW PRODUCT'}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={() => navigate('/shop')}
            style={{
              fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.2em',
              padding: '14px 48px', background: 'transparent', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(127,29,29,0.6)', borderRadius: '4px', cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(127,29,29,0.6)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {t.viewAll} →
          </button>
        </div>
      </section>

      {/* ── Footer strip ── */}
      <div className="red-divider"></div>
      <footer className="footer-strip">
        <div>© 2026 NEXUSGEAR</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(220,38,38,0.7)' }}>NEXUS<span style={{ color: 'rgba(255,255,255,0.2)' }}>GEAR</span></div>
        <div>POWERED BY PASSION</div>
      </footer>

      {/* Floating Globe */}
      <button className="globe-btn" onClick={() => setShowLangModal(true)} title="Language">
        <Globe size={20} />
      </button>
    </div>
  );
}

export default HomePage;