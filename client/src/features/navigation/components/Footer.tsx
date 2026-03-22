import { Link } from 'react-router-dom';
import { useLanguage } from '../../../shared/context/LanguageContext';
import logoImg from '../../../assets/logo.png';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <>
      <style>{`
        .ft-root {
          position: relative; overflow: hidden;
          background: #050000; border-top: 1px solid rgba(127,29,29,0.35);
          color: rgba(255,255,255,0.5); font-family: 'Kanit', sans-serif;
        }
        .ft-glow {
          position:absolute; top:-120px; left:50%; transform:translateX(-50%);
          width:600px; height:240px; background:radial-gradient(ellipse,rgba(220,38,38,0.08),transparent 70%);
          pointer-events:none;
        }
        .ft-inner {
          position:relative; z-index:1; max-width:1200px; margin:0 auto;
          padding:3rem 2rem 1.5rem; display:grid;
          grid-template-columns:1.4fr 1fr 1fr 1fr; gap:2.5rem;
        }
        @media(max-width:768px){ .ft-inner{grid-template-columns:1fr 1fr; gap:1.5rem;} }
        @media(max-width:480px){ .ft-inner{grid-template-columns:1fr;} }

        .ft-brand-name {
          font-family:'Orbitron',sans-serif; font-weight:900; font-size:1.1rem;
          letter-spacing:0.18em; color:#fff; margin-top:0.6rem;
          text-shadow:0 0 20px rgba(220,38,38,0.4);
        }
        .ft-brand-name span { color:#dc2626; }
        .ft-brand-desc { font-size:0.82rem; line-height:1.6; margin-top:0.6rem; color:rgba(255,255,255,0.4); }

        .ft-col-title {
          font-family:'Orbitron',sans-serif; font-weight:700; font-size:0.65rem;
          letter-spacing:0.2em; color:rgba(255,255,255,0.7); margin-bottom:1rem;
          text-transform:uppercase;
        }
        .ft-link {
          display:block; font-size:0.85rem; color:rgba(255,255,255,0.45);
          text-decoration:none; padding:0.3rem 0; transition:color 0.2s;
        }
        .ft-link:hover { color:#f87171; }

        .ft-bottom {
          position:relative; z-index:1; max-width:1200px; margin:0 auto;
          padding:1rem 2rem; border-top:1px solid rgba(127,29,29,0.2);
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;
        }
        .ft-copy { font-size:0.72rem; font-family:'Orbitron',sans-serif; letter-spacing:0.1em; color:rgba(255,255,255,0.25); }
        .ft-socials { display:flex; gap:0.6rem; }
        .ft-social-dot {
          width:32px; height:32px; border-radius:50%;
          border:1px solid rgba(127,29,29,0.4); background:rgba(255,255,255,0.03);
          display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,0.4); font-size:0.75rem; cursor:pointer; transition:all 0.2s;
        }
        .ft-social-dot:hover { border-color:#dc2626; color:#fff; background:rgba(220,38,38,0.12); }
      `}</style>

      <footer className="ft-root">
        <div className="ft-glow" />

        <div className="ft-inner">
          {/* Brand */}
          <div>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.5rem', textDecoration:'none' }}>
              <img src={logoImg} alt="" style={{ height:32 }} />
              <span className="ft-brand-name">NEXUS<span>GEAR</span></span>
            </Link>
            <p className="ft-brand-desc">{t('footerDesc')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="ft-col-title">{t('quickLinks')}</div>
            <Link to="/" className="ft-link">{t('home')}</Link>
            <Link to="/shop" className="ft-link">{t('shop')}</Link>
            <Link to="/cart" className="ft-link">{t('cart')}</Link>
            <Link to="/profile" className="ft-link">{t('profile')}</Link>
          </div>

          {/* Support */}
          <div>
            <div className="ft-col-title">{t('support')}</div>
            <Link to="/forgot-password" className="ft-link">{t('forgotPassword')}</Link>
            <span className="ft-link" style={{ cursor:'default' }}>{t('returnPolicy')}</span>
            <span className="ft-link" style={{ cursor:'default' }}>{t('contact')}</span>
            <span className="ft-link" style={{ cursor:'default' }}>{t('faq')}</span>
          </div>

          {/* Contact */}
          <div>
            <div className="ft-col-title">Contact</div>
            <span className="ft-link" style={{ cursor:'default' }}>� support@nexusgear.com</span>
            <span className="ft-link" style={{ cursor:'default' }}>� 02-XXX-XXXX</span>
            <span className="ft-link" style={{ cursor:'default' }}>� กรุงเทพมหานคร, ประเทศไทย</span>
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-copy">© {new Date().getFullYear()} NEXUS GEAR — {t('allRightsReserved')}</span>
          <div className="ft-socials">
            <div className="ft-social-dot" title="Facebook">f</div>
            <div className="ft-social-dot" title="X / Twitter">𝕏</div>
            <div className="ft-social-dot" title="Instagram">ig</div>
            <div className="ft-social-dot" title="Discord">dc</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
