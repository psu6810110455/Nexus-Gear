// ============================================================
// src/features/auth/pages/Register.tsx
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../../shared/services/api';

// ── Icons ─────────────────────────────────────────────────────
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── AuthInput (รวมไว้ที่นี่) ──────────────────────────────────
interface AuthInputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  showToggle?: boolean;
}

function AuthInput({ label, type = 'text', placeholder, value, onChange, required, showToggle = false }: AuthInputProps) {
  const [visible, setVisible] = useState(false);
  const inputType = type === 'password' && showToggle ? (visible ? 'text' : 'password') : type;
  return (
    <div className="auth-form-group">
      <label>{label}</label>
      <div className="auth-input-wrapper">
        <input type={inputType} placeholder={placeholder} className="auth-input" value={value} onChange={(e) => onChange(e.target.value)} required={required} />
        {showToggle && (
          <div className="auth-icon-group">
            <div className="auth-icon-info"><IconInfo /></div>
            <button type="button" className="auth-btn-icon" onClick={() => setVisible((v) => !v)}>
              {visible ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
function Register() {
  const navigate = useNavigate();

  const [username, setUsername]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms]     = useState(false);
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('รหัสผ่านไม่ตรงกันครับ กรุณาตรวจสอบอีกครั้ง');
    if (!acceptedTerms) return setError('กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนสมัครสมาชิกครับ');
    setLoading(true);
    try {
      const res = await register(username, email, password);
      alert(res?.message || 'สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    } catch (err: any) {
      const errorData = err.response?.data?.message;
      if (Array.isArray(errorData)) setError('ข้อมูลไม่ถูกต้อง:\n• ' + errorData.join('\n• '));
      else if (typeof errorData === 'string') setError(errorData);
      else setError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้! กรุณาเช็คว่า Backend รันอยู่หรือไม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" />
        <div className="auth-card">
          <div style={{ position: 'relative' }}>
            <Link to="/" className="auth-back-btn">กลับสู่หน้าหลัก</Link>
            <h1 className="auth-title">สร้างบัญชีผู้ใช้</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <AuthInput label="ชื่อผู้ใช้" placeholder="ชื่อผู้ใช้" value={username} onChange={setUsername} required />
            <AuthInput label="อีเมล" type="email" placeholder="ที่อยู่อีเมล" value={email} onChange={setEmail} required />
            <AuthInput label="รหัสผ่าน" type="password" placeholder="กรอกรหัสผ่านของคุณ" value={password} onChange={setPassword} required showToggle />
            <AuthInput label="ยืนยันรหัสผ่าน" type="password" placeholder="ยืนยันรหัสผ่านของคุณ" value={confirmPassword} onChange={setConfirmPassword} required showToggle />
            <div className="auth-terms">
              <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
              <label htmlFor="terms">
                ฉันยอมรับ{' '}<span className="auth-terms-highlight">ข้อกำหนดและเงื่อนไขและนโยบายความเป็นส่วนตัว</span>
              </label>
            </div>
            {error && <p style={{ color: '#ff4444', fontSize: '0.9rem', marginBottom: '16px', whiteSpace: 'pre-line' }}>{error}</p>}
            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>
          <div className="auth-footer">
            <p>มีบัญชีอยู่แล้ว?<Link to="/login" className="auth-link">เข้าสู่ระบบ</Link></p>
          </div>
        </div>
      </div>
      <div className="auth-bottom-bar" />
    </div>
  );
}

export default Register;