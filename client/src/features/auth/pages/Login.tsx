// ============================================================
// src/features/auth/pages/Login.tsx
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../shared/services/api';
import { useAuth } from '../context/AuthContext';

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
function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { access_token } = await login(email, password);
      localStorage.setItem('token', access_token);
      authLogin(access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้องครับ');
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
            <h1 className="auth-title">เข้าสู่ระบบ</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <AuthInput label="อีเมล" type="email" placeholder="ที่อยู่อีเมล" value={email} onChange={setEmail} required />
            <AuthInput label="รหัสผ่าน" type="password" placeholder="กรอกรหัสผ่านของคุณ" value={password} onChange={setPassword} required showToggle />
            <div className="auth-helpers">
              <label className="auth-remember">
                <input type="checkbox" /><span>จดจำฉัน</span>
              </label>
              <Link to="/forgot" className="auth-forgot-link">ลืมรหัสผ่าน?</Link>
            </div>
            {error && <p style={{ color: '#ff4444', fontSize: '0.9rem', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
            <div className="auth-footer">
              <p>ยังไม่มีบัญชี?<Link to="/register" className="auth-link">สมัครสมาชิก</Link></p>
            </div>
          </form>
        </div>
      </div>
      <div className="auth-bottom-bar" />
    </div>
  );
}

export default Login;