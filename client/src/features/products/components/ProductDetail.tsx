import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productDetailStyles } from '../../../styles/productDetail.styles';
import api, { getServerUrl } from '../../../shared/services/api';

interface Product {
  id: number; name: string; description: string; price: string | number;
  stock: number; imageUrl?: string; image_url?: string;
  category?: { id: number; name: string };
}

const Stars = ({ rating = 5 }: { rating?: number }) => (
  <span aria-label={`${rating} ดาว`}>
    {[...Array(5)].map((_, i) => <span key={i} style={{ color: i < rating ? '#facc15' : '#374151', fontSize: '1rem' }}>★</span>)}
  </span>
);

const BoxItem = ({ icon, label }: { icon: string; label: string }) => (
  <div style={{ width: '3.2rem', height: '3.2rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', gap: '3px', color: 'var(--color-text-muted)' }}>
    <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    <span style={{ letterSpacing: '0.05em' }}>{label}</span>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct]                 = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [quantity, setQuantity]               = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const changeQuantity = (dir: 'inc' | 'dec') => {
    if (dir === 'dec' && quantity > 1) setQuantity(q => q - 1);
    if (dir === 'inc' && product && quantity < product.stock) setQuantity(q => q + 1);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: current } = await api.get(`/products/${id}`);
        setProduct(current);
        const { data: all } = await api.get('/products');
        setRelatedProducts(all.filter((p: Product) => p.category?.name === current.category?.name && p.id !== current.id).slice(0, 4));
        setRelatedProducts(all.filter((p: Product) => p.category?.name === current.category?.name && p.id !== current.id).slice(0, 4));
        setQuantity(1);
        setSelectedImageIndex(0);
      } catch (err) { console.error(err); }
      finally { setLoading(false); window.scrollTo(0, 0); }
    };
    load();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(220,38,38,0.2)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--color-primary)' }}>LOADING...</span>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>ไม่พบสินค้า</div>
  );

  // สร้างรายการรูปภาพทั้งหมด
  const allImages: string[] = [];
  if ((product as any).images && (product as any).images.length > 0) {
    (product as any).images.forEach((img: any) => {
      allImages.push(getServerUrl(img.imageUrl));
    });
  }
  // ถ้าไม่มี images ให้ใช้ imageUrl เดิม
  if (allImages.length === 0) {
    allImages.push(product.imageUrl ?? product.image_url ?? 'https://dummyimage.com/600x400/000/fff?text=No+Image');
  }
  const currentImage = allImages[selectedImageIndex] || allImages[0];

  return (
    <main style={{ width: '100%', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: "'Kanit', sans-serif", paddingBottom: '6rem' }}>
      {/* ── Inject styles from productDetail.styles.ts ── */}
      <style>{productDetailStyles}</style>

      {/* Back */}
      <div style={{ padding: '1.25rem 5vw', borderBottom: '1px solid var(--color-border)' }}>
        <button type="button" onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
          ← กลับหน้ารายการสินค้า
        </button>
      </div>

      {/* Hero */}
      <section className="pd-hero" aria-label="รายละเอียดสินค้า">
        <div className="pd-img-panel">
          <span className="pd-new-badge">New Arrival</span>
          {/* รูปหลัก */}
          <img src={currentImage} alt={product.name}
            style={{ maxHeight: '42rem', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.5s, opacity 0.3s', position: 'relative', zIndex: 1, mixBlendMode: 'multiply', cursor: 'zoom-in' }}
            onClick={() => setZoomOpen(true)}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            onError={e => { e.currentTarget.src = 'https://dummyimage.com/600x400/000/fff?text=Nexus+Gear'; }} />
          {/* Thumbnail Bar */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {allImages.map((imgUrl, idx) => (
                <button key={idx} type="button" onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '4rem', height: '4rem', borderRadius: '8px', overflow: 'hidden',
                    border: idx === selectedImageIndex ? '2px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.1)',
                    background: '#fff', cursor: 'pointer', padding: '4px',
                    boxShadow: idx === selectedImageIndex ? '0 0 12px rgba(220,38,38,0.4)' : 'none',
                    transition: 'all 0.2s', opacity: idx === selectedImageIndex ? 1 : 0.6,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onMouseLeave={e => { if (idx !== selectedImageIndex) { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}>
                  <img src={imgUrl} alt={`${product.name} ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    onError={e => { e.currentTarget.src = 'https://dummyimage.com/60x60/000/fff?text=N'; }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pd-info-panel">
          <span className="pd-category-badge">{product.category?.name ?? 'GAMING GEAR'}</span>
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-rating-row">
            <Stars rating={4} />
            <span style={{ color: 'var(--color-text-muted)' }}>4.0 Reviews</span>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <span style={{ color: '#4ade80', fontSize: '0.78rem' }}>ขายแล้ว 1.2k ชิ้น</span>
          </div>
          <p className="pd-price-label">ราคาพิเศษ</p>
          <div className="pd-price-row">
            <strong className="pd-price">฿{Number(product.price).toLocaleString()}</strong>
            <s className="pd-price-old">฿{Math.round(Number(product.price) * 1.2).toLocaleString()}</s>
          </div>
          <div className="pd-qty-box">
            <div className="pd-qty-label">
              <span>จำนวน</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>มีสินค้า {product.stock} ชิ้น</span>
            </div>
            <div className="pd-qty-controls">
              <button type="button" className="pd-qty-btn" onClick={() => changeQuantity('dec')} aria-label="ลดจำนวน">−</button>
              <output className="pd-qty-val">{quantity}</output>
              <button type="button" className="pd-qty-btn" onClick={() => changeQuantity('inc')} aria-label="เพิ่มจำนวน">+</button>
            </div>
          </div>
          <div className="pd-cta-row">
            <button type="button" className="pd-btn-cart">� ใส่ตะกร้า</button>
            <button type="button" className="pd-btn-buy">ซื้อเลย</button>
          </div>
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem', fontFamily: 'Orbitron, sans-serif' }}>อุปกรณ์ภายในกล่อง �</p>
            <div style={{ display: 'flex', gap: '0.75rem', opacity: 0.65 }}>
              <BoxItem icon="�" label="Manual" /><BoxItem icon="�" label="Cable" /><BoxItem icon="�" label="Warranty" />
            </div>
          </div>
        </div>
      {zoomOpen && (
        <div onClick={() => setZoomOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <button onClick={() => setZoomOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '1.5rem', width: '2.5rem', height: '2.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <img src={currentImage} alt={product.name} style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
        </div>
      )}
      </section>

      <div className="red-divider" />

      <div className="pd-content">
        {/* Description */}
        <section aria-label="รายละเอียดสินค้า" style={{ marginBottom: '3.5rem' }}>
          <h2 className="pd-section-title"><span className="pd-section-bar" aria-hidden="true" />รายละเอียดสินค้า</h2>
          <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', padding: '2rem' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{product.name}</p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {product.description || 'สัมผัสประสบการณ์การเล่นเกมที่เหนือกว่าด้วยอุปกรณ์ Gaming Gear ระดับโปร'}
            </p>
            <div className="pd-desc-grid">
              <div className="pd-desc-card">
                <h3>Key Features</h3>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-text-muted)', fontSize: '0.82rem', lineHeight: 2, margin: 0 }}>
                  <li>การเชื่อมต่อความเร็วสูง (Low Latency)</li>
                  <li>วัสดุพรีเมียม ทนทานพิเศษ</li>
                  <li>RGB Lighting ปรับแต่งได้ 16.8 ล้านสี</li>
                </ul>
              </div>
              <div className="pd-desc-card">
                <h3>Technical Specs</h3>
                <dl style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', margin: 0 }}>
                  {[['Warranty','2 Years'],['Weight','350g'],['Color','Black / Red']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <dt>{k}:</dt><dd style={{ margin: 0, color: 'var(--color-text)', fontWeight: 500 }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section aria-label="รีวิวจากลูกค้า" style={{ marginBottom: '3.5rem' }}>
          <h2 className="pd-section-title"><span className="pd-section-bar" style={{ background: 'var(--color-text-dim)' }} aria-hidden="true" />รีวิวจากลูกค้า</h2>
          <div className="pd-reviews">
            {[1,2,3,4].map(i => (
              <div key={i} className="pd-review-card">
                <div className="pd-avatar">U{i}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.82rem' }}>Pro_Gamer_{i}</strong><Stars rating={5} />
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                    "{i % 2 === 0 ? 'จัดส่งไวมาก แพ็คของมาดี สินค้าตรงปกครับ' : 'ใช้งานดีมาก เสียงเงียบ ปุ่มนิ่ม คุ้มราคาที่สุด'}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section aria-label="สินค้าที่คุณอาจจะชอบ" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '2.5rem' }}>
          <h2 className="pd-section-title" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span className="pd-section-bar" aria-hidden="true" />สินค้าที่คุณอาจจะชอบ</span>
            <button type="button" onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.78rem', textDecoration: 'underline', fontFamily: 'inherit' }}>ดูทั้งหมด →</button>
          </h2>
          {relatedProducts.length === 0
            ? <p style={{ color: 'var(--color-text-dim)', textAlign: 'center', padding: '2.5rem 0', fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', letterSpacing: '0.1em' }}>ไม่มีสินค้าแนะนำในหมวดนี้</p>
            : <div className="pd-related-grid">
                {relatedProducts.map(rel => (
                  <div key={rel.id} className="pd-rel-card" onClick={() => navigate(`/products/${rel.id}`)}>
                    <div style={{ height: '11rem', background: '#fff', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--color-primary)', color: '#fff', fontSize: '0.58rem', fontWeight: 700, padding: '2px 7px', borderRadius: '3px', fontFamily: 'Orbitron, sans-serif' }}>-15%</span>
                      <img src={getServerUrl(rel.imageUrl ?? rel.image_url ?? '') || 'https://dummyimage.com/400x400/000/fff'} alt={rel.name}
                        style={{ maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.5s', mixBlendMode: 'multiply' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        onError={e => { e.currentTarget.src = 'https://dummyimage.com/400x400/000/fff?text=NEXUS'; }}
                        onClick={e => e.stopPropagation()} />
                    </div>
                    <div style={{ padding: '0.9rem' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Orbitron, sans-serif' }}>{rel.name}</h3>
                      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.7rem', marginBottom: '0.6rem' }}>{typeof rel.category === 'object' ? rel.category?.name : rel.category}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--color-primary)', fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem' }}>฿{Number(rel.price).toLocaleString()}</strong>
                        <button type="button" aria-label={`เพิ่ม ${rel.name} ในตะกร้า`}
                          style={{ width: '1.8rem', height: '1.8rem', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', fontSize: '1rem' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                          onClick={e => e.stopPropagation()}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
