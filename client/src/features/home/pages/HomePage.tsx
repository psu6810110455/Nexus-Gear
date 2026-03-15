import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { homeStyles } from '../../../styles/home.styles';

interface Product {
  id: number; name: string; price: number;
  imageUrl?: string; image_url?: string; tagline?: string;
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
    autoplayRef.current = setInterval(() => goTo(p => (p + 1) % products.length), 4500);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [products.length]);

  const goTo = (indexOrFn: number | ((prev: number) => number)) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(typeof indexOrFn === 'function' ? indexOrFn : () => indexOrFn);
    setTimeout(() => setIsAnimating(false), 600);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = setInterval(() => goTo(p => (p + 1) % products.length), 4500);
    }
  };

  const prev = () => goTo(p => (p - 1 + products.length) % products.length);
  const next = () => goTo(p => (p + 1) % products.length);
  const handleEnterSite = () => { sessionStorage.setItem('visitedNexusGear', 'true'); setShowWelcome(false); };

  const t = {
    TH: { promo: 'สินค้าแนะนำ', viewAll: 'ดูสินค้าทั้งหมด', select: 'กรุณาเลือกภาษา', learnMore: 'เรียนรู้เพิ่มเติม', buy: 'ซื้อเลย' },
    EN: { promo: 'FEATURED PRODUCTS', viewAll: 'VIEW ALL PRODUCTS', select: 'SELECT YOUR LANGUAGE', learnMore: 'LEARN MORE', buy: 'BUY NOW' },
  }[language];

  const current = products[activeSlide] ?? products[0];

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', overflowX: 'hidden', fontFamily: "'Kanit', sans-serif" }}>
      {/* ── Inject styles from home.styles.ts ── */}
      <style>{homeStyles}</style>

      <div className="scan-line" />

      {/* Welcome */}
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

      {/* Language modal */}
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

      {/* Hero */}
      <section className="hero-wrapper">
        <div className="hero-bg-layer" /><div className="hero-grid" /><div className="hero-accent-left" />
        <div className="hero-dots-vertical">
          {products.map((_, i) => <div key={i} onClick={() => goTo(i)} className={`slider-dot${i === activeSlide ? ' active' : ''}`} style={{ cursor: 'pointer' }} />)}
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
            <img key={activeSlide} src={current.imageUrl ?? current.image_url} alt={current.name}
              className={`hero-img ${isAnimating ? 'slide-exit' : 'slide-enter'}`}
              onError={e => { e.currentTarget.src = 'https://dummyimage.com/400x400/111/dc2626?text=NEXUS'; }} />
          </div>
        </div>
        <div className="slider-nav">
          <button className="slider-arrow" onClick={prev}><ChevronLeft size={18} /></button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {products.map((_, i) => <div key={i} className={`slider-dot${i === activeSlide ? ' active' : ''}`} onClick={() => goTo(i)} style={{ cursor: 'pointer' }} />)}
          </div>
          <button className="slider-arrow" onClick={next}><ChevronRight size={18} /></button>
          <div className="slide-counter">{String(activeSlide + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</div>
        </div>
      </section>

      <div className="red-divider" />

      {/* Featured */}
      <section style={{ padding: '5rem 5vw' }}>
        <div className="section-label">— {language === 'TH' ? 'คัดสรรมาเพื่อคุณ' : 'HAND PICKED'} —</div>
        <h2 className="section-title">{t.promo}</h2>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-tile" onClick={() => navigate(`/products/${product.id}`)}>
              <img src={product.imageUrl ?? product.image_url} alt={product.name} className="product-tile-img"
                onError={e => { e.currentTarget.src = 'https://dummyimage.com/400x400/111/dc2626?text=NO+IMG'; }} />
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
          <button onClick={() => navigate('/shop')}
            style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.2em', padding: '13px 48px', background: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = 'var(--color-primary)'; b.style.color = '#fff'; b.style.background = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'var(--color-border)'; b.style.color = 'rgba(255,255,255,0.55)'; b.style.background = 'transparent'; }}
          >{t.viewAll} →</button>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
