import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../../assets/logo.png';
import { useAuth } from "../../auth/context/AuthContext";
import { Globe, ShoppingCart, X } from 'lucide-react';
import type { NavLink } from '../types/nav.types';

const PUBLIC_LINKS: NavLink[] = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'สินค้าทั้งหมด', to: '/shop' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [showLangModal, setShowLangModal]     = useState(false);
  const [language, setLanguage]               = useState<'TH' | 'EN'>('TH');

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');

        .nb-promo {
          position: relative; overflow: hidden;
          background: var(--color-primary, #dc2626);
          text-align: center; padding: 7px 2.5rem;
          font-size: 0.72rem; letter-spacing: 0.2em; color: #fff;
          font-family: 'Orbitron', sans-serif;
        }
        .nb-promo::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: nb-shimmer 3s ease-in-out infinite;
        }
        @keyframes nb-shimmer { to { left: 140%; } }
        .nb-promo-close {
          position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.6);
          cursor: pointer; padding: 2px; line-height: 1; transition: color 0.2s;
          display: flex; align-items: center;
        }
        .nb-promo-close:hover { color: #fff; }

        .nb-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(5,0,0,0.95); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(127,29,29,0.35);
        }
        .nb-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem; height: 64px;
        }
        .nb-logo-text {
          font-family: 'Orbitron', sans-serif; font-weight: 900;
          font-size: 1.15rem; letter-spacing: 0.18em; color: #fff;
          text-shadow: 0 0 20px rgba(220,38,38,0.4);
        }
        .nb-logo-text span { color: var(--color-primary, #dc2626); }
        .nb-nav { display: flex; gap: 2.5rem; list-style: none; padding: 0; margin: 0; }
        .nb-nav-link {
          font-family: 'Orbitron', sans-serif; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: color 0.2s;
          position: relative; padding-bottom: 4px;
        }
        .nb-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px;
          background: var(--color-primary, #dc2626); transition: width 0.3s;
        }
        .nb-nav-link:hover { color: #fff; }
        .nb-nav-link:hover::after { width: 100%; }
        .nb-nav-link.admin { color: rgba(250,204,21,0.7); }
        .nb-nav-link.admin:hover { color: #facc15; }
        .nb-nav-link.admin::after { background: #facc15; }

        .nb-actions { display: flex; align-items: center; gap: 0.75rem; }
        .nb-icon-btn {
          width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(127,29,29,0.4);
          background: rgba(255,255,255,0.03); display: flex; align-items: center;
          justify-content: center; cursor: pointer; color: rgba(255,255,255,0.55);
          transition: all 0.2s; position: relative;
        }
        .nb-icon-btn:hover { border-color: var(--color-primary, #dc2626); background: rgba(220,38,38,0.12); color: #fff; }
        .nb-lang-badge {
          position: absolute; top: -4px; right: -4px;
          background: var(--color-primary, #dc2626); color: #fff;
          font-size: 0.5rem; font-family: 'Orbitron', sans-serif; font-weight: 700;
          padding: 1px 4px; border-radius: 4px; letter-spacing: 0.05em;
        }
        .nb-text-link {
          font-size: 0.8rem; color: rgba(255,255,255,0.65);
          text-decoration: none; transition: color 0.2s; font-weight: 500;
        }
        .nb-text-link:hover { color: var(--color-text-primary, #f87171); }
        .nb-btn-outline {
          font-size: 0.75rem; font-family: 'Orbitron', sans-serif; font-weight: 700;
          letter-spacing: 0.1em; padding: 7px 14px;
          background: transparent; color: rgba(255,255,255,0.5);
          border: 1px solid rgba(127,29,29,0.5); border-radius: 4px;
          cursor: pointer; transition: all 0.2s;
        }
        .nb-btn-outline:hover { border-color: var(--color-primary, #dc2626); color: #fff; background: rgba(220,38,38,0.1); }
        .nb-btn-primary {
          font-size: 0.75rem; font-family: 'Orbitron', sans-serif; font-weight: 700;
          letter-spacing: 0.1em; padding: 8px 18px;
          background: var(--color-primary, #dc2626); color: #fff;
          border: none; border-radius: 4px; cursor: pointer;
          box-shadow: 0 0 16px rgba(220,38,38,0.35); transition: all 0.2s;
        }
        .nb-btn-primary:hover { background: var(--color-primary-hover, #b91c1c); transform: translateY(-1px); box-shadow: 0 0 24px rgba(220,38,38,0.5); }
        .nb-divider { width: 1px; height: 20px; background: rgba(127,29,29,0.4); flex-shrink: 0; }

        .nb-modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .nb-modal {
          background: #111; border: 1px solid rgba(220,38,38,0.35);
          border-radius: 12px; padding: 2rem; width: 100%; max-width: 380px;
          text-align: center; position: relative;
          box-shadow: 0 0 60px rgba(220,38,38,0.18);
          animation: nb-modal-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes nb-modal-in { from { opacity:0; transform: scale(0.9); } to { opacity:1; transform: scale(1); } }
        .nb-modal-close {
          position: absolute; top: 0.9rem; right: 0.9rem;
          background: none; border: none; color: rgba(255,255,255,0.35);
          cursor: pointer; font-size: 1.1rem; transition: color 0.2s;
        }
        .nb-modal-close:hover { color: var(--color-primary, #dc2626); }
        .nb-lang-option {
          width: 100%; padding: 13px; border-radius: 6px; font-weight: 700;
          cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: rgba(255,255,255,0.5); margin-bottom: 0.6rem;
          display: flex; align-items: center; justify-content: center; gap: 0.6rem;
        }
        .nb-lang-option.active { background: var(--color-primary, #dc2626); border-color: var(--color-primary, #dc2626); color: #fff; box-shadow: 0 0 18px rgba(220,38,38,0.35); }
        .nb-lang-option:not(.active):hover { border-color: var(--color-primary, #dc2626); color: #fff; }
      `}</style>

      {/* ── Promo Banner ── */}
      {showPromoBanner && (
        <div className="nb-promo">
          ⚡&nbsp; FREE SHIPPING FOR ORDERS OVER ฿999 &nbsp;·&nbsp; ส่งฟรีเมื่อซื้อครบ ฿999 &nbsp;⚡
          <button className="nb-promo-close" onClick={() => setShowPromoBanner(false)} aria-label="ปิด">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Main Navbar ── */}
      <header role="banner" className="nb-header">
        <nav aria-label="เมนูหลัก" className="nb-inner">

          {/* Logo */}
          <Link to="/" aria-label="NEXUS GEAR — หน้าแรก" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <img src={logoImg} alt="" aria-hidden="true" style={{ height: 36, objectFit: 'contain' }} />
            <span className="nb-logo-text hidden sm:block">NEXUS<span>GEAR</span></span>
          </Link>

          {/* Nav Links */}
          <ul className="nb-nav">
            {PUBLIC_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="nb-nav-link">{label}</Link>
              </li>
            ))}
            {isLoggedIn && user?.role === 'admin' && (
              <li>
                <Link to="/admin" className="nb-nav-link admin">จัดการสินค้า</Link>
              </li>
            )}
          </ul>

          {/* Actions */}
          <div className="nb-actions">
            {/* Language */}
            <div className="nb-icon-btn" role="button" onClick={() => setShowLangModal(true)} title="Select Language">
              <Globe size={17} />
              <span className="nb-lang-badge">{language}</span>
            </div>

            {/* Cart */}
            {isLoggedIn && (
              <Link to="/cart" style={{ textDecoration: 'none' }}>
                <div className="nb-icon-btn" title="ตะกร้าสินค้า">
                  <ShoppingCart size={17} />
                </div>
              </Link>
            )}

            <div className="nb-divider"></div>

            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px 4px 4px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = 'var(--color-primary, #dc2626)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#2E0505', border: '1px solid #7F1D1D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '0.8rem', overflow: 'hidden' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 500, fontFamily: "'Kanit', sans-serif" }}>
                    {user?.name || 'ผู้ใช้งาน'}
                  </span>
                </Link>
                <button type="button" onClick={handleLogout} className="nb-btn-outline">ออกจากระบบ</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-text-link">เข้าสู่ระบบ</Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="nb-btn-primary">สมัครสมาชิก</button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Language Modal ── */}
      {showLangModal && (
        <div className="nb-modal-backdrop" onClick={() => setShowLangModal(false)}>
          <div className="nb-modal" onClick={e => e.stopPropagation()}>
            <button className="nb-modal-close" onClick={() => setShowLangModal(false)}>✕</button>
            <Globe style={{ width: 34, height: 34, color: '#dc2626', margin: '0 auto 0.8rem', display: 'block' }} />
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.2em', color: '#fff', marginBottom: '0.25rem' }}>LANGUAGE</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginBottom: '1.4rem' }}>
              {language === 'TH' ? 'กรุณาเลือกภาษาที่คุณต้องการใช้งาน' : 'PLEASE SELECT YOUR LANGUAGE'}
            </div>
            <button
              className={`nb-lang-option ${language === 'TH' ? 'active' : ''}`}
              style={{ fontFamily: 'Kanit', fontSize: '0.95rem' }}
              onClick={() => { setLanguage('TH'); setShowLangModal(false); }}
            >
              🇹🇭 ภาษาไทย
            </button>
            <button
              className={`nb-lang-option ${language === 'EN' ? 'active' : ''}`}
              style={{ fontFamily: 'Orbitron', fontSize: '0.78rem', letterSpacing: '0.15em' }}
              onClick={() => { setLanguage('EN'); setShowLangModal(false); }}
            >
              🇬🇧 ENGLISH
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
