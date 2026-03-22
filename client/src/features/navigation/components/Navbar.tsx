import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ShoppingCart, X, Menu } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useLanguage } from '../../../shared/context/LanguageContext';
import logoImg from '../../../assets/logo.png';

/* ── Public navigation links ── */
// These will be translated in the component

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [showLangModal, setShowLangModal]     = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu]   = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setShowMobileMenu(false);
    logout();
    navigate('/login');
  };

  const closeMobile = () => setShowMobileMenu(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');

        /* ── Promo Banner ── */
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

        /* ── Header ── */
        .nb-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(5,0,0,0.95); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(127,29,29,0.35);
        }
        .nb-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem; height: 64px; position: relative;
        }
        @media (max-width: 768px) {
          .nb-inner { padding: 0 1rem; height: 56px; }
        }

        /* ── Logo ── */
        .nb-logo-text {
          font-family: 'Orbitron', sans-serif; font-weight: 900;
          font-size: 1.15rem; letter-spacing: 0.18em; color: #fff;
          text-shadow: 0 0 20px rgba(220,38,38,0.4);
        }
        .nb-logo-text span { color: var(--color-primary, #dc2626); }

        /* ── Desktop Nav Links (hidden on mobile) ── */
        .nb-nav {
          display: flex; gap: 2.5rem; list-style: none; padding: 0; margin: 0;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        @media (max-width: 768px) {
          .nb-nav { display: none; }
        }
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

        /* ── Desktop Actions (hidden on mobile) ── */
        .nb-actions { display: flex; align-items: center; gap: 0.75rem; }
        @media (max-width: 768px) {
          .nb-actions { display: none; }
        }

        /* ── Hamburger (visible on mobile only) ── */
        .nb-mobile-toggle {
          display: none; align-items: center; gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .nb-mobile-toggle { display: flex; }
        }
        .nb-hamburger {
          width: 40px; height: 40px; border-radius: 8px;
          border: 1px solid rgba(127,29,29,0.4); background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.7); cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .nb-hamburger:hover { border-color: var(--color-primary, #dc2626); color: #fff; }

        /* ── Mobile Drawer ── */
        .nb-mobile-backdrop {
          position: fixed; inset: 0; z-index: 998;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .nb-mobile-backdrop.open { opacity: 1; pointer-events: auto; }

        .nb-mobile-drawer {
          position: fixed; top: 0; right: -300px; z-index: 999;
          width: 280px; max-width: 85vw; height: 100vh;
          background: #0a0000; border-left: 1px solid rgba(127,29,29,0.4);
          display: flex; flex-direction: column; transition: right 0.3s ease;
          overflow-y: auto;
        }
        .nb-mobile-drawer.open { right: 0; }

        .nb-mobile-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-bottom: 1px solid rgba(127,29,29,0.3);
        }
        .nb-mobile-close {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1px solid rgba(127,29,29,0.4); background: transparent;
          color: rgba(255,255,255,0.5); cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .nb-mobile-close:hover { border-color: #dc2626; color: #fff; }

        .nb-mobile-links {
          list-style: none; padding: 0.5rem 0; margin: 0;
        }
        .nb-mobile-link {
          display: block; padding: 0.9rem 1.5rem; color: rgba(255,255,255,0.65);
          text-decoration: none; font-family: 'Kanit', sans-serif;
          font-size: 0.95rem; transition: all 0.2s;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .nb-mobile-link:hover { background: rgba(220,38,38,0.1); color: #fff; }
        .nb-mobile-link.admin { color: rgba(250,204,21,0.7); }
        .nb-mobile-link.admin:hover { background: rgba(250,204,21,0.08); color: #facc15; }

        .nb-mobile-section {
          padding: 0.75rem 1.5rem; font-family: 'Orbitron', sans-serif;
          font-size: 0.6rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.25);
          text-transform: uppercase;
        }
        .nb-mobile-btn {
          display: block; width: calc(100% - 3rem); margin: 0.4rem 1.5rem;
          padding: 0.75rem; border-radius: 8px; text-align: center;
          font-family: 'Kanit', sans-serif; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s; text-decoration: none;
        }
        .nb-mobile-btn-primary {
          background: #dc2626; color: #fff; border: none;
          box-shadow: 0 0 16px rgba(220,38,38,0.3);
        }
        .nb-mobile-btn-primary:hover { background: #b91c1c; }
        .nb-mobile-btn-outline {
          background: transparent; color: rgba(255,255,255,0.6);
          border: 1px solid rgba(127,29,29,0.5);
        }
        .nb-mobile-btn-outline:hover { border-color: #dc2626; color: #fff; }

        /* ── Shared button styles ── */
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

        /* ── Modal ── */
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
          ⚡&nbsp; {t('promoShipping')} &nbsp;⚡
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

          {/* Desktop Nav Links */}
          <ul className="nb-nav">
            <li><Link to="/" className="nb-nav-link">{t('home')}</Link></li>
            <li><Link to="/shop" className="nb-nav-link">{t('shop')}</Link></li>
            {isLoggedIn && user?.role === 'admin' && (
              <li>
                <Link to="/admin" className="nb-nav-link admin">{t('adminCenter')}</Link>
              </li>
            )}
          </ul>

          {/* Desktop Actions */}
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
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} referrerPolicy="no-referrer" />
                    ) : (
                      user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 500, fontFamily: "'Kanit', sans-serif" }}>
                    {user?.name || t('user')}
                  </span>
                </Link>
                <button type="button" onClick={() => setShowLogoutModal(true)} className="nb-btn-outline">{t('logout')}</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-text-link">{t('login')}</Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="nb-btn-primary">{t('register')}</button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Cart icon + Hamburger (hidden on desktop) */}
          <div className="nb-mobile-toggle">
            {isLoggedIn && (
              <Link to="/cart" className="nb-hamburger" style={{ textDecoration: 'none' }} title="ตะกร้า">
                <ShoppingCart size={18} />
              </Link>
            )}
            <button className="nb-hamburger" onClick={() => setShowMobileMenu(true)} aria-label="เปิดเมนู">
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Drawer Backdrop ── */}
      <div className={`nb-mobile-backdrop ${showMobileMenu ? 'open' : ''}`} onClick={closeMobile} />

      {/* ── Mobile Drawer ── */}
      <div className={`nb-mobile-drawer ${showMobileMenu ? 'open' : ''}`}>
        <div className="nb-mobile-header">
          <Link to="/" onClick={closeMobile} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <img src={logoImg} alt="" style={{ height: 28 }} />
            <span className="nb-logo-text" style={{ fontSize: '0.9rem' }}>NEXUS<span>GEAR</span></span>
          </Link>
          <button className="nb-mobile-close" onClick={closeMobile} aria-label="ปิดเมนู">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        {isLoggedIn && (
          <Link to="/profile" onClick={closeMobile} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(127,29,29,0.2)', textDecoration: 'none'
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2E0505', border: '1px solid #7F1D1D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '1rem', overflow: 'hidden', flexShrink: 0 }}>
              {user?.picture ? (
                <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Kanit' }}>{user?.name || t('user')}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{user?.email}</div>
            </div>
          </Link>
        )}

        {/* Navigation links */}
        <div className="nb-mobile-section">{language === 'TH' ? 'เมนู' : 'MENU'}</div>
        <ul className="nb-mobile-links">
          <li><Link to="/" className="nb-mobile-link" onClick={closeMobile}>{t('home')}</Link></li>
          <li><Link to="/shop" className="nb-mobile-link" onClick={closeMobile}>{t('shop')}</Link></li>
          {isLoggedIn && (
            <>
              <li><Link to="/cart" className="nb-mobile-link" onClick={closeMobile}>� {t('cart')}</Link></li>
              <li><Link to="/profile" className="nb-mobile-link" onClick={closeMobile}>� {t('profile')}</Link></li>
            </>
          )}
          {isLoggedIn && user?.role === 'admin' && (
            <li><Link to="/admin" className="nb-mobile-link admin" onClick={closeMobile}>⚙ {t('adminCenter')}</Link></li>
          )}
        </ul>

        {/* Settings */}
        <div className="nb-mobile-section">{language === 'TH' ? 'ตั้งค่า' : 'SETTINGS'}</div>
        <ul className="nb-mobile-links">
          <li>
            <button className="nb-mobile-link" onClick={() => { closeMobile(); setShowLangModal(true); }} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>
              � {language === 'TH' ? 'ภาษาไทย' : 'English'}
            </button>
          </li>
        </ul>

        {/* Auth buttons */}
        <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid rgba(127,29,29,0.2)' }}>
          {isLoggedIn ? (
            <button className="nb-mobile-btn nb-mobile-btn-outline" onClick={() => { closeMobile(); setShowLogoutModal(true); }}>
              {t('logout')}
            </button>
          ) : (
            <>
              <Link to="/login" className="nb-mobile-btn nb-mobile-btn-primary" onClick={closeMobile} style={{ marginBottom: '0.5rem' }}>
                {t('login')}
              </Link>
              <Link to="/register" className="nb-mobile-btn nb-mobile-btn-outline" onClick={closeMobile}>
                {t('register')}
              </Link>
            </>
          )}
        </div>
      </div>

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
              �� ภาษาไทย
            </button>
            <button
              className={`nb-lang-option ${language === 'EN' ? 'active' : ''}`}
              style={{ fontFamily: 'Orbitron', fontSize: '0.78rem', letterSpacing: '0.15em' }}
              onClick={() => { setLanguage('EN'); setShowLangModal(false); }}
            >
              �� ENGLISH
            </button>
          </div>
        </div>
      )}

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutModal && (
        <div className="nb-modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="nb-modal" onClick={e => e.stopPropagation()}>
            <button className="nb-modal-close" onClick={() => setShowLogoutModal(false)}>✕</button>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#dc2626' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', color: '#fff', marginBottom: '0.5rem' }}>{t('logout')}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem', fontFamily: 'Kanit' }}>
              {language === 'TH' ? 'คุณต้องการออกจากระบบหรือไม่?' : 'Are you sure you want to logout?'}
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Kanit', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >{t('cancel')}</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', boxShadow: '0 0 16px rgba(220,38,38,0.4)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'none'; }}
              >{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
