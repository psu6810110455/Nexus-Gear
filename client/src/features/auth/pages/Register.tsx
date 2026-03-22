import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useLanguage } from '../../../shared/context/LanguageContext';

// --- Components ย่อย ---

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconGoogle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

//  Component สำหรับ Modal ข้อกำหนดและเงื่อนไข
const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { language } = useLanguage();
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      backdropFilter: 'blur(5px)', padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a', border: '1px solid #333',
        borderRadius: '12px', width: '100%', maxWidth: '600px',
        maxHeight: '80vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 0 30px rgba(153, 0, 0, 0.2)'
      }}>
        <div style={{
          padding: '20px', borderBottom: '1px solid #333',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, backgroundColor: '#1a1a1a'
        }}>
          <h2 style={{ color: 'var(--color-primary)', margin: 0, fontFamily: 'Orbitron, sans-serif' }}>{language === 'TH' ? 'ข้อกำหนดและนโยบาย' : 'TERMS & PRIVACY'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ padding: '24px', color: '#ccc', lineHeight: '1.8', fontSize: '0.9rem', textAlign: 'left' }}>
          {language === 'TH' ? (
            <>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>1. ข้อกำหนดและเงื่อนไขการใช้งาน</h3>
              <p>เว็บไซต์ Nexus Gear ("เว็บไซต์") เป็นแพลตฟอร์มจำหน่ายอุปกรณ์เสริมสำหรับเล่นเกมบนมือถือ ดำเนินการโดย Nexus Gear ผู้ใช้งานตกลงปฏิบัติตามข้อกำหนดเหล่านี้เมื่อสมัครสมาชิกหรือใช้บริการเว็บไซต์</p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li>ผู้ใช้ต้องมีอายุไม่ต่ำกว่า 13 ปี หรือได้รับความยินยอมจากผู้ปกครอง</li>
                <li>ข้อมูลที่กรอกในการสมัครสมาชิกต้องเป็นข้อมูลจริงและถูกต้อง</li>
                <li>ห้ามใช้งานเว็บไซต์เพื่อวัตถุประสงค์ที่ผิดกฎหมายหรือฉ้อโกง</li>
                <li>ราคาสินค้าและโปรโมชันอาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า</li>
                <li>Nexus Gear ขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่ละเมิดข้อกำหนด</li>
              </ul>

              <h3 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. นโยบายความเป็นส่วนตัว</h3>
              <p>Nexus Gear เคารพความเป็นส่วนตัวของผู้ใช้ทุกท่าน เราเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลเท่าที่จำเป็นเพื่อการให้บริการเท่านั้น</p>

              <h4 style={{ color: '#ddd', marginTop: '1rem', marginBottom: '0.25rem' }}>ข้อมูลที่เราเก็บรวบรวม:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li><strong>ข้อมูลบัญชี:</strong> ชื่อ, อีเมล, รหัสผ่าน (เข้ารหัส bcrypt)</li>
                <li><strong>ข้อมูลการสั่งซื้อ:</strong> ที่อยู่จัดส่ง, ประวัติคำสั่งซื้อ, วิธีการชำระเงิน</li>
                <li><strong>ข้อมูลเทคนิค:</strong> IP Address, ประเภทเบราว์เซอร์ (เพื่อการรักษาความปลอดภัย)</li>
              </ul>

              <h4 style={{ color: '#ddd', marginTop: '1rem', marginBottom: '0.25rem' }}>วัตถุประสงค์ในการใช้ข้อมูล:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li>ประมวลผลคำสั่งซื้อและจัดส่งสินค้า</li>
                <li>ยืนยันตัวตนและรักษาความปลอดภัยของบัญชี</li>
                <li>ส่งการแจ้งเตือนเกี่ยวกับสถานะคำสั่งซื้อ</li>
                <li>ปรับปรุงประสบการณ์การใช้งานเว็บไซต์</li>
              </ul>

              <h4 style={{ color: '#ddd', marginTop: '1rem', marginBottom: '0.25rem' }}>สิทธิ์ของผู้ใช้:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li>เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของท่านได้ตลอดเวลา</li>
                <li>ยกเลิกการสมัครรับข่าวสารได้ทุกเมื่อ</li>
                <li>ร้องขอให้ลบบัญชีและข้อมูลทั้งหมดออกจากระบบ</li>
              </ul>

              <h3 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. การรักษาความปลอดภัย</h3>
              <p>เราใช้การเข้ารหัสรหัสผ่านด้วย bcrypt, ระบบ JWT Token สำหรับการยืนยันตัวตน, และ HTTPS สำหรับการสื่อสารข้อมูลทั้งหมด เราจะไม่เปิดเผยข้อมูลส่วนบุคคลแก่บุคคลที่สามโดยไม่ได้รับความยินยอม ยกเว้นตามที่กฎหมายกำหนด</p>
            </>
          ) : (
            <>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>1. Terms and Conditions</h3>
              <p>Nexus Gear ("Website") is a platform selling mobile gaming accessories. By registering or using our website, you agree to these terms.</p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li>Users must be at least 13 years old or have parental consent.</li>
                <li>Information provided during registration must be true and accurate.</li>
                <li>The website must not be used for illegal or fraudulent purposes.</li>
                <li>Prices and promotions are subject to change without notice.</li>
                <li>Nexus Gear reserves the right to suspend accounts that violate terms.</li>
              </ul>

              <h3 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Privacy Policy</h3>
              <p>We respect your privacy and only collect personal data necessary for our services.</p>

              <h4 style={{ color: '#ddd', marginTop: '1rem', marginBottom: '0.25rem' }}>Data we collect:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li><strong>Account Info:</strong> Name, Email, Password (bcrypt encrypted)</li>
                <li><strong>Order Info:</strong> Shipping address, order history, payment methods</li>
                <li><strong>Technical Info:</strong> IP Address, Browser type (for security)</li>
              </ul>

              <h4 style={{ color: '#ddd', marginTop: '1rem', marginBottom: '0.25rem' }}>Purpose of data usage:</h4>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                <li>Process orders and deliver products</li>
                <li>Verify identity and secure account</li>
                <li>Send order status notifications</li>
                <li>Improve website experience</li>
              </ul>

              <h3 style={{ color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Security</h3>
              <p>We use bcrypt encryption, JWT for authentication, and HTTPS for all communications. We do not disclose personal information to third parties without consent, unless required by law.</p>
            </>
          )}
          <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>{language === 'TH' ? 'อัปเดตล่าสุด' : 'Last Updated'}: 14 March 2026 | Nexus Gear &copy; 2026</p>
        </div>
        <div style={{ padding: '15px 20px', borderTop: '1px solid #333', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 25px', fontSize: '0.9rem' }}>{language === 'TH' ? 'รับทราบ' : 'DISMISS'}</button>
        </div>
      </div>
    </div>
  );
};

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
}

const PasswordField = ({ id, label, value, show, onChange, onToggle }: PasswordFieldProps) => {
  const { t } = useLanguage();
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <label htmlFor={id} style={{ display: 'block', color: '#fff', marginBottom: '0.625rem', textAlign: 'left' }}>{label}</label>
    <div className="auth-input-wrap">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={label}
        className="auth-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <span style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#888' }}>
        <span 
          title={t('pwdHint')} 
          style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}
        >
          <IconInfo />
        </span>
        <button
          type="button"
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </span>
    </div>
  </div>
);
};

// --- Component หลัก ---

const Register = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  //  State สำหรับควบคุมการเปิด/ปิด Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error(language === 'TH' ? 'รหัสผ่านไม่ตรงกันครับ' : 'Passwords do not match');
    if (!acceptedTerms) return toast.error(language === 'TH' ? 'กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนครับ' : 'Please accept terms and conditions');

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const { data } = await axios.post(`${API_BASE}/users/register`, {
        name: username, email, password,
      });
      toast.success(data?.message || (language === 'TH' ? 'สมัครสมาชิกสำเร็จ!' : 'Registration successful!'));
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) toast.error((language === 'TH' ? 'สมัครไม่สำเร็จ:\\n- ' : 'Registration failed:\\n- ') + msg.join('\\n- '));
      else if (typeof msg === 'string') toast.error((language === 'TH' ? 'สมัครไม่สำเร็จ:\\n' : 'Registration failed:\\n') + msg);
      else toast.error(language === 'TH' ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' : 'Cannot connect to server');
    }
  };

  const handleGoogleRegister = () => {
    localStorage.setItem('oauth_action', 'register');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" aria-hidden="true" />
        <div className="auth-card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <Link to="/" style={{ background: 'var(--color-primary-hover)', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '0.85rem', textDecoration: 'none', zIndex: 10 }}>
              {t('backToHome')}
            </Link>
          </div>
          <h1 className="auth-title">{language === 'TH' ? 'สร้างบัญชีผู้ใช้' : 'Create Account'}</h1>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="username" style={{ display: 'block', color: '#fff', marginBottom: '0.625rem', textAlign: 'left' }}>{t('username')}</label>
              <div className="auth-input-wrap">
                <input id="username" type="text" placeholder={t('username')} className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="reg-email" style={{ display: 'block', color: '#fff', marginBottom: '0.625rem', textAlign: 'left' }}>{t('email')}</label>
              <div className="auth-input-wrap">
                <input id="reg-email" type="email" placeholder={t('email')} className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <PasswordField id="password" label={t('password')} value={password} show={showPassword} onChange={setPassword} onToggle={() => setShowPassword(p => !p)} />
            <PasswordField id="confirmPassword" label={t('confirmPassword')} value={confirmPassword} show={showConfirmPassword} onChange={setConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.75rem', textAlign: 'left' }}>
              <input 
                type="checkbox" 
                id="terms-checkbox"
                checked={acceptedTerms} 
                onChange={(e) => setAcceptedTerms(e.target.checked)} 
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <label htmlFor="terms-checkbox" style={{ color: '#ccc', fontSize: '0.9rem', cursor: 'pointer' }}>
                {t('acceptTerms')}{' '}
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(true)}
                  style={{ 
                    background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', 
                    fontWeight: 500, cursor: 'pointer', textDecoration: 'underline',
                    fontFamily: 'inherit', fontSize: 'inherit'
                  }}
                >
                  {t('termsAndPrivacy')}
                </button>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem' }}>
              {t('register')}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#555' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
            <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>{t('or')}</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            style={{
              width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <IconGoogle /> {t('googleRegister')}
          </button>

          <p style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', color: '#ccc', fontSize: '0.95rem' }}>
            {t('haveAccount')} <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginLeft: '4px' }}>{t('login')}</Link>
          </p>
        </div>
      </div>
      
      {/*  วาง Modal ไว้ตรงนี้ */}
      <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="auth-bottom-bar" aria-hidden="true" />
    </div>
  );
};

export default Register;
