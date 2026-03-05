import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/context/AuthContext';

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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/auth/login', { email, password });
      login(data.access_token, data.user); // ✅ ส่ง user object ไปด้วย
      alert('ยินดีต้อนรับกลับสู่ Nexus Gear!');
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้องครับ');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" aria-hidden="true" />
        <div className="auth-card">
          <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
            <Link
              to="/"
              style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--color-primary-hover)', color: '#fff',
                padding: '6px 14px', borderRadius: '4px', fontSize: '0.85rem', textDecoration: 'none',
              }}
            >
              กลับสู่หน้าหลัก
            </Link>
            <h1 className="auth-title">เข้าสู่ระบบ</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>อีเมล</label>
              <div className="auth-input-wrap">
                <input
                  id="email" type="email" placeholder="ที่อยู่อีเมล"
                  className="auth-input" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="password" style={{ display: 'block', color: '#fff', marginBottom: '0.5rem' }}>รหัสผ่าน</label>
              <div className="auth-input-wrap">
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  placeholder="กรอกรหัสผ่านของคุณ" className="auth-input"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <span style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#888' }}>
                  <IconInfo />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', color: '#ccc', fontSize: '0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>จดจำฉัน</span>
              </label>
              <Link to="/forgot" style={{ color: '#ccc', textDecoration: 'none' }}>ลืมรหัสผ่าน?</Link>
            </div>

            <button
              type="submit" className="btn-primary"
              style={{ width: '100%', padding: '14px', fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', textTransform: 'lowercase' }}
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#fff' }}>
            ยังไม่มีบัญชี?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginLeft: '4px' }}>สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
      <div className="auth-bottom-bar" aria-hidden="true" />
    </div>
  );
};

export default Login;