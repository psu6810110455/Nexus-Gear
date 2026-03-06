import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

// ✅ Component สำหรับ Modal ข้อกำหนดและเงื่อนไข
const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
          <h2 style={{ color: 'var(--color-primary)', margin: 0, fontFamily: 'Orbitron, sans-serif' }}>TERMS & PRIVACY</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ padding: '24px', color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem', textAlign: 'left' }}>
          <h3 style={{ color: '#fff' }}>1. ข้อกำหนดและเงื่อนไข</h3>
          <p>ยินดีต้อนรับสู่ Nexus Gear ข้อมูลที่คุณให้จะถูกนำไปใช้เพื่อการซื้อขายอุปกรณ์เกมมิ่งและการยืนยันตัวตนเท่านั้น...</p>
          <h3 style={{ color: '#fff' }}>2. นโยบายความเป็นส่วนตัว</h3>
          <p>เราให้ความสำคัญกับการเก็บรักษาข้อมูลส่วนบุคคลของคุณตามมาตรฐานความปลอดภัย เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต...</p>
          <p style={{ marginTop: '40px', fontSize: '0.8rem', color: '#666' }}>อัปเดตล่าสุด: 3 มีนาคม 2026</p>
        </div>
        <div style={{ padding: '15px 20px', borderTop: '1px solid #333', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 25px', fontSize: '0.9rem' }}>รับทราบ</button>
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

const PasswordField = ({ id, label, value, show, onChange, onToggle }: PasswordFieldProps) => (
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
          title="รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลข" 
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

// --- Component หลัก ---

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // ✅ State สำหรับควบคุมการเปิด/ปิด Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('รหัสผ่านไม่ตรงกันครับ');
    if (!acceptedTerms) return alert('กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนครับ');

    try {
      const { data } = await axios.post('http://localhost:3000/users/register', {
        name: username, email, password,
      });
      alert(data?.message || 'สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) alert('สมัครไม่สำเร็จ:\n- ' + msg.join('\n- '));
      else if (typeof msg === 'string') alert('สมัครไม่สำเร็จ:\n' + msg);
      else alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" aria-hidden="true" />
        <div className="auth-card">
          <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ position: 'absolute', top: 0, right: 0, background: 'var(--color-primary-hover)', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '0.85rem', textDecoration: 'none' }}>
              กลับสู่หน้าหลัก
            </Link>
            <h1 className="auth-title">สร้างบัญชีผู้ใช้</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="username" style={{ display: 'block', color: '#fff', marginBottom: '0.625rem', textAlign: 'left' }}>ชื่อผู้ใช้</label>
              <div className="auth-input-wrap">
                <input id="username" type="text" placeholder="ชื่อผู้ใช้" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="reg-email" style={{ display: 'block', color: '#fff', marginBottom: '0.625rem', textAlign: 'left' }}>อีเมล</label>
              <div className="auth-input-wrap">
                <input id="reg-email" type="email" placeholder="ที่อยู่อีเมล" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <PasswordField id="password" label="รหัสผ่าน" value={password} show={showPassword} onChange={setPassword} onToggle={() => setShowPassword(p => !p)} />
            <PasswordField id="confirmPassword" label="ยืนยันรหัสผ่าน" value={confirmPassword} show={showConfirmPassword} onChange={setConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1.75rem', textAlign: 'left' }}>
              <input 
                type="checkbox" 
                id="terms-checkbox"
                checked={acceptedTerms} 
                onChange={(e) => setAcceptedTerms(e.target.checked)} 
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <label htmlFor="terms-checkbox" style={{ color: '#ccc', fontSize: '0.9rem', cursor: 'pointer' }}>
                ฉันยอมรับ{' '}
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(true)}
                  style={{ 
                    background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', 
                    fontWeight: 500, cursor: 'pointer', textDecoration: 'underline',
                    fontFamily: 'inherit', fontSize: 'inherit'
                  }}
                >
                  ข้อกำหนดและเงื่อนไขและนโยบายความเป็นส่วนตัว
                </button>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem' }}>
              สมัครสมาชิก
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#fff' }}>
            มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginLeft: '4px' }}>เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
      
      {/* ✅ วาง Modal ไว้ตรงนี้ */}
      <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="auth-bottom-bar" aria-hidden="true" />
    </div>
  );
};

export default Register;
