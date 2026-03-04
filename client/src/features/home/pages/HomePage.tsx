import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  image_url?: string;
  tagline?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'ROG Phone 7',    price: 34990, tagline: 'Ultimate Gaming Beast',       imageUrl: 'https://dlcdnwebimgs.asus.com/gain/44268636-6202-4048-96bd-276632057342/w800' },
  { id: 2, name: 'Black Shark 5',  price: 18900, tagline: 'Born to Dominate',            imageUrl: 'https://m.media-amazon.com/images/I/61imgK9J+lL.jpg' },
  { id: 3, name: 'HyperX Cloud',   price: 2990,  tagline: 'Hear Every Footstep',         imageUrl: 'https://row.hyperx.com/cdn/shop/products/hyperx_cloud_alpha_red_1_main_900x.jpg' },
  { id: 4, name: 'Kishi V2',       price: 3590,  tagline: 'Console Feel. Mobile Power.', imageUrl: 'https://m.media-amazon.com/images/I/61iXE1nZkGL.jpg' },
  { id: 5, name: 'ROG Kunai 3',    price: 3990,  tagline: 'Precision. Redefined.',       imageUrl: 'https://dlcdnwebimgs.asus.com/gain/57F833C8-94D9-4824-913A-98C152B336A1' },
  { id: 6, name: 'Flydigi Apex 3', price: 2990,  tagline: 'Pro-Level Control',           imageUrl: 'https://m.media-amazon.com/images/I/61K-x+w+pXIL._AC_SL1500_.jpg' },
  { id: 7, name: 'Finger Sleeve',  price: 190,   tagline: 'Swipe Faster. Win More.',     imageUrl: 'https://m.media-amazon.com/images/I/61+y+w+pXIL._AC_SL1500_.jpg' },
  { id: 8, name: 'Cooler Fan',     price: 990,   tagline: 'Stay Cool. Stay Sharp.',      imageUrl: 'https://m.media-amazon.com/images/I/61t-XhJ-xRL.jpg' },
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

  useEffect(() => {
    autoplayRef.current = setInterval(() => goTo((prev) => (prev + 1) % products.length), 4500);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [products.length]);

  const goTo = (indexOrFn: number | ((prev: number) => number)) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(typeof indexOrFn === 'function' ? indexOrFn : () => indexOrFn);
    setTimeout(() => setIsAnimating(false), 600);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => goTo((p) => (p + 1) % products.length), 4500);
    }
  };

  const prev = () => goTo((p) => (p - 1 + products.length) % products.length);
  const next = () => goTo((p) => (p + 1) % products.length);
  const handleEnterSite = () => { sessionStorage.setItem('visitedNexusGear', 'true'); setShowWelcome(false); };

  const t = {
    TH: { promo: 'สินค้าแนะนำ', viewAll: 'ดูสินค้าทั้งหมด', select: 'กรุณาเลือกภาษา', learnMore: 'เรียนรู้เพิ่มเติม', buy: 'ซื้อเลย' },
    EN: { promo: 'FEATURED PRODUCTS', viewAll: 'VIEW ALL PRODUCTS', select: 'SELECT YOUR LANGUAGE', learnMore: 'LEARN MORE', buy: 'BUY NOW' },
  }[language];

  const current = products[activeSlide] ?? products[0];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        overflowX: 'hidden',
        fontFamily: "'Kanit', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');

        /* ── Hero ── */
        .hero-wrapper {
          position: relative; width: 100%; height: 100vh; min-height: 600px;
          overflow: hidden; display: flex; align-items: center;
        }
        .hero-bg-layer {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 50%, var(--color-bg-deep) 0%, #050000 60%, #000 100%);
        }
        .hero-grid {
          position: absolute; inset: 0; opacity: 0.04;
          background-image:
            linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .hero-accent-left {
          position: absolute; left: 0; top: 0; width: 5px; height: 100%;
          background: linear-gradient(to bottom, transparent, var(--color-primary), transparent);
        }
        .hero-content {
          position: relative; z-index: 10; width: 100%;
          padding: 0 5vw;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 4rem;
        }
        .hero-tag {
          display: inline-block; font-family: 'Orbitron', sans-serif;
          font-size: 0.62rem; letter-spacing: 0.3em; color: var(--color-primary);
          border: 1px solid rgba(220,38,38,0.4); padding: 4px 14px;
          border-radius: 2px; margin-bottom: 1.5rem;
          background: rgba(220,38,38,0.08);
        }
        .hero-product-name {
          font-family: 'Orbitron', sans-serif; font-weight: 900;
          font-size: clamp(2.2rem, 4.5vw, 4.5rem); line-height: 1.05;
          color: var(--color-text);
          text-shadow: 0 0 60px var(--color-primary-glow);
          transition: opacity 0.4s, transform 0.4s;
        }
        .hero-product-name.slide-exit { opacity: 0; transform: translateX(-30px); }
        .hero-product-name.slide-enter { opacity: 1; transform: translateX(0); }
        .hero-tagline {
          font-size: 1.05rem; font-weight: 300; color: rgba(255,255,255,0.45);
          margin-top: 0.75rem; letter-spacing: 0.05em;
          transition: opacity 0.4s 0.1s, transform 0.4s 0.1s;
        }
        .hero-tagline.slide-exit { opacity: 0; transform: translateX(-20px); }
        .hero-tagline.slide-enter { opacity: 1; transform: translateX(0); }
        .hero-price {
          font-family: 'Orbitron', sans-serif; font-size: 2rem; font-weight: 700;
          color: var(--color-primary); margin-top: 2rem;
          text-shadow: 0 0 20px var(--color-primary-glow);
        }
        .hero-btns { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
        .btn-hero-primary {
          font-family: 'Orbitron', sans-serif; font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.15em; padding: 13px 34px; border: none; border-radius: 4px;
          background: var(--color-primary); color: #fff; cursor: pointer;
          box-shadow: 0 0 28px var(--color-primary-glow); transition: all 0.3s;
        }
        .btn-hero-primary:hover { background: var(--color-primary-hover); transform: translateY(-2px); box-shadow: 0 0 48px rgba(220,38,38,0.7); }
        .btn-hero-ghost {
          font-family: 'Orbitron', sans-serif; font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.15em; padding: 13px 34px; border-radius: 4px;
          background: transparent; color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.18); cursor: pointer; transition: all 0.3s;
        }
        .btn-hero-ghost:hover { border-color: var(--color-primary); color: #fff; background: rgba(220,38,38,0.1); }
        .hero-image-side {
          display: flex; align-items: center; justify-content: center;
          position: relative; height: 70vh;
        }
        .hero-image-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%);
        }
        .hero-img {
          max-height: 80%; max-width: 90%; object-fit: contain;
          filter: drop-shadow(0 20px 60px rgba(220,38,38,0.35));
          transition: opacity 0.5s, transform 0.5s; position: relative; z-index: 2;
        }
        .hero-img.slide-exit { opacity: 0; transform: scale(0.9) translateX(40px); }
        .hero-img.slide-enter { opacity: 1; transform: scale(1) translateX(0); }

        /* Slider controls */
        .slider-nav {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 1.5rem; z-index: 20;
        }
        .slider-arrow {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(0,0,0,0.6); border: 1px solid rgba(220,38,38,0.4);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--color-primary); transition: all 0.2s;
        }
        .slider-arrow:hover { background: rgba(220,38,38,0.25); border-color: var(--color-primary); transform: scale(1.1); }
        .slider-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s;
        }
        .slider-dot.active {
          background: var(--color-primary); width: 24px; border-radius: 3px;
          box-shadow: 0 0 8px var(--color-primary-glow);
        }
        .slide-counter {
          font-family: 'Orbitron', sans-serif; font-size: 0.7rem;
          color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
        }

        /* ── Featured section ── */
        .section-label {
          font-family: 'Orbitron', sans-serif; font-size: 0.62rem; letter-spacing: 0.4em;
          color: var(--color-primary); text-align: center; margin-bottom: 0.5rem;
        }
        .section-title {
          font-family: 'Orbitron', sans-serif; font-size: clamp(1.4rem, 2.5vw, 2.2rem);
          font-weight: 900; text-align: center; color: var(--color-text);
          letter-spacing: 0.05em; margin-bottom: 3rem;
        }
        .product-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5px;
        }
        @media(max-width:900px){ .product-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:600px){
          .product-grid { grid-template-columns: repeat(2,1fr); }
          .hero-content { grid-template-columns: 1fr; }
          .hero-image-side { height: 40vh; }
        }
        .product-tile {
          background: var(--color-bg-card); position: relative; overflow: hidden;
          cursor: pointer; aspect-ratio: 1 / 1;
        }
        .product-tile::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 60%, rgba(220,38,38,0.05) 100%);
          z-index: 1;
        }
        .product-tile-overlay {
          position: absolute; inset: 0; background: rgba(220,38,38,0.88);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.35s; z-index: 3;
        }
        .product-tile:hover .product-tile-overlay { opacity: 1; }
        .product-tile-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); filter: grayscale(15%);
        }
        .product-tile:hover .product-tile-img { transform: scale(1.08); filter: grayscale(0%); }
        .product-tile-info {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
          padding: 1.5rem 1rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%);
          transform: translateY(6px); transition: transform 0.3s;
        }
        .product-tile:hover .product-tile-info { transform: translateY(0); }
        .tile-name {
          font-family: 'Orbitron', sans-serif; font-size: 0.82rem; font-weight: 700;
          color: var(--color-text); letter-spacing: 0.04em;
        }
        .tile-price { font-size: 0.78rem; color: var(--color-text-primary); font-weight: 600; margin-top: 3px; }
        .tile-overlay-text {
          font-family: 'Orbitron', sans-serif; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.2em; color: #fff; margin-top: 0.5rem;
        }

        /* ── Dividers & Footer ── */
        .red-divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
        }
        .footer-strip {
          padding: 1.5rem 5vw; display: flex; align-items: center; justify-content: space-between;
          background: var(--color-bg-deep);
          font-family: 'Orbitron', sans-serif; font-size: 0.62rem; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.22);
        }

        /* ── Modals ── */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.88); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-box {
          background: var(--color-bg-card); border: 1px solid rgba(220,38,38,0.4);
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
        .modal-close:hover { color: var(--color-primary); }
        .lang-btn {
          width: 100%; padding: 13px; border-radius: 6px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem;
        }
        .lang-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; box-shadow: 0 0 20px var(--color-primary-glow); }
        .lang-btn:not(.active):hover { border-color: var(--color-primary); color: #fff; }

        /* Welcome */
        .welcome-box {
          background: #000; border: 2px solid var(--color-primary); border-radius: 20px;
          padding: 2.5rem 2rem; max-width: 360px; width: 100%; text-align: center;
          box-shadow: 0 0 80px var(--color-primary-glow);
          animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .welcome-logo { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; letter-spacing: 0.2em; color: #fff; margin-bottom: 0.25rem; }
        .welcome-logo span { color: var(--color-primary); }
        .welcome-sub { color: rgba(255,255,255,0.38); font-size: 0.85rem; margin-bottom: 2rem; }
        .btn-enter {
          width: 100%; padding: 13px; background: var(--color-primary); color: #fff;
          font-family: 'Orbitron', sans-serif; font-weight: 700; letter-spacing: 0.15em;
          font-size: 0.78rem; border: none; border-radius: 6px; cursor: pointer;
          box-shadow: 0 0 25px var(--color-primary-glow); transition: all 0.3s;
        }
        .btn-enter:hover { background: var(--color-primary-hover); transform: translateY(-2px); }

        /* Globe fab */
        .globe-btn {
          position: fixed; bottom: 2rem; right: 2rem; z-index: 100;
          width: 50px; height: 50px; border-radius: 50%;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s; color: rgba(255,255,255,0.55);
          box-shadow: 0 0 18px var(--color-primary-glow);
        }
        .globe-btn:hover { border-color: var(--color-primary); color: var(--color-primary); transform: scale(1.1); }

        /* Scanline */
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .scan-line {
          position: fixed; top: 0; left: 0; right: 0; height: 2px; pointer-events: none; z-index: 9999;
          background: linear-gradient(90deg, transparent, var(--color-primary-glow), transparent);
          animation: scanline 8s linear infinite;
        }
      `}</style>

      <div className="scan-line" />

      {/* ── Welcome Popup ── */}
      {showWelcome && (
        <div className="modal-backdrop">
          <div className="welcome-box">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
            <div className="welcome-logo">NEXUS<span>GEAR</span></div>
            <div className="welcome-sub">ยินดีต้อนรับ · Welcome</div>
            <button className="btn-enter" onClick={handleEnterSite}>เข้าสู่เว็บไซต์ · ENTER</button>
          </div>
        </div>
      )}

      {/* ── Language Modal ── */}
      {showLangModal && (
        <div className="modal-backdrop" onClick={() => setShowLangModal(false)}>
          <div className="modal-box" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLangModal(false)}>✕</button>
            <Globe style={{ width: 36, height: 36, color: 'var(--color-primary)', margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.2em', color: '#fff', marginBottom: '0.35rem' }}>LANGUAGE</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.78rem', marginBottom: '1.5rem' }}>{t.select}</div>
            <button className={`lang-btn ${language === 'TH' ? 'active' : ''}`} style={{ fontFamily: 'Kanit' }} onClick={() => { setLanguage('TH'); setShowLangModal(false); }}>🇹🇭 ภาษาไทย</button>
            <button className={`lang-btn ${language === 'EN' ? 'active' : ''}`} style={{ fontFamily: 'Orbitron', fontSize: '0.78rem', letterSpacing: '0.15em' }} onClick={() => { setLanguage('EN'); setShowLangModal(false); }}>🇬🇧 ENGLISH</button>
          </div>
        </div>
      )}

      {/* ── Hero Slider ── */}
      <section className="hero-wrapper">
        <div className="hero-bg-layer" />
        <div className="hero-grid" />
        <div className="hero-accent-left" />

        {/* Side dots */}
        <div style={{ position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.slice(0, 6).map((_, i) => (
            <div key={i} onClick={() => goTo(i)} className={`slider-dot${i === activeSlide ? ' active' : ''}`} style={{ cursor: 'pointer' }} />
          ))}
        </div>

        <div className="hero-content" style={{ paddingTop: '2rem' }}>
          <div>
            <div className="hero-tag">NEXUS GEAR — FEATURED PRODUCT</div>
            <h1 className={`hero-product-name ${isAnimating ? 'slide-exit' : 'slide-enter'}`}>{current.name}</h1>
            <p className={`hero-tagline ${isAnimating ? 'slide-exit' : 'slide-enter'}`}>{current.tagline}</p>
            <div className="hero-price">฿{Number(current.price).toLocaleString()}</div>
            <div className="hero-btns">
              <button className="btn-hero-primary" onClick={() => navigate(`/products/${current.id}`)}>{t.buy}</button>
              <button className="btn-hero-ghost" onClick={() => navigate(`/products/${current.id}`)}>{t.learnMore}</button>
            </div>
          </div>

          <div className="hero-image-side">
            <div className="hero-image-glow" />
            <img
              key={activeSlide}
              src={current.imageUrl ?? current.image_url}
              alt={current.name}
              className={`hero-img ${isAnimating ? 'slide-exit' : 'slide-enter'}`}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/111/dc2626?text=NEXUS'; }}
            />
          </div>
        </div>

        <div className="slider-nav">
          <button className="slider-arrow" onClick={prev}><ChevronLeft size={18} /></button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {products.map((_, i) => (
              <div key={i} className={`slider-dot${i === activeSlide ? ' active' : ''}`} onClick={() => goTo(i)} style={{ cursor: 'pointer' }} />
            ))}
          </div>
          <button className="slider-arrow" onClick={next}><ChevronRight size={18} /></button>
          <div className="slide-counter">{String(activeSlide + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</div>
        </div>
      </section>

      <div className="red-divider" />

      {/* ── Featured Products ── */}
      <section style={{ padding: '5rem 5vw' }}>
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
            style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.2em', padding: '13px 48px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = 'var(--color-primary)'; b.style.color = '#fff'; b.style.background = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'var(--color-border)'; b.style.color = 'rgba(255,255,255,0.55)'; b.style.background = 'transparent'; }}
          >
            {t.viewAll} →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="red-divider" />
      <footer className="footer-strip">
        <div>© 2026 NEXUSGEAR</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(220,38,38,0.65)' }}>NEXUS<span style={{ color: 'rgba(255,255,255,0.18)' }}>GEAR</span></div>
        <div>POWERED BY PASSION</div>
      </footer>

      {/* Globe FAB */}
      <button className="globe-btn" onClick={() => setShowLangModal(true)} title="Language">
        <Globe size={20} />
      </button>
    </div>
  );
}

export default HomePage;