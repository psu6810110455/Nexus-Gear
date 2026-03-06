import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../shared/services/api';
import { useAuth } from '../../auth/context/AuthContext';
import { toast } from 'sonner';

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

// ✅ เพิ่มไอคอน Google
const IconGoogle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
      const { data } = await api.post('/auth/login', { email, password });
      
      // 💡 ลอง console.log ดูว่า Backend ส่งอะไรมาบ้าง จะได้เห็นชัดๆ ครับ
      console.log('Login Response:', data);

      // ✅ ดักจับทั้งสองรูปแบบ: เผื่อ backend ส่งมาเป็น token หรือ access_token
      const actualToken = data.access_token || data.token; 

      if (!actualToken) {
        toast.error('ระบบไม่ได้รับ Token จากเซิร์ฟเวอร์ กรุณาตรวจสอบ Backend ครับ');
        return;
      }

      login(actualToken, data.user); 
      toast.success('ยินดีต้อนรับกลับสู่ Nexus Gear!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้องครับ');
    }
  };

  // ✅ เพิ่มฟังก์ชันสำหรับพาผู้ใช้ไปหน้าล็อกอินของ Google
  const handleGoogleLogin = () => {
    localStorage.setItem('oauth_action', 'login');
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" aria-hidden="true" />
        <div className="auth-card" style={{ position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: '1rem',
            marginTop: window.innerWidth < 768 ? '0.5rem' : '0' 
          }}>
            <Link
              to="/"
              className="auth-back-link"
              style={{
                background: 'var(--color-primary-hover)', color: '#fff',
                padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none',
                zIndex: 10
              }}
            >
              กลับสู่หน้าหลัก
            </Link>
          </div>
          <h1 className="auth-title">เข้าสู่ระบบ</h1>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', textAlign: 'left' }}>อีเมล</label>
              <div className="auth-input-wrap">
                <input
                  id="email" type="email" placeholder="ที่อยู่อีเมล"
                  className="auth-input" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="password" style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', textAlign: 'left' }}>รหัสผ่าน</label>
              <div className="auth-input-wrap">
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  placeholder="กรอกรหัสผ่านของคุณ" className="auth-input"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <span style={{ display: 'flex', gap: '6px', alignItems: 'center', color: '#888' }}>
                  
                  {/* ✅ เพิ่ม title (Tooltip) และเปลี่ยน cursor เป็น help เมื่อวางเมาส์ */}
                  <span 
                    title="รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลข" 
                    style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}
                  >
                    <IconInfo />
                  </span>
                  
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
              <Link to="/forgot-password" style={{ color: '#ccc', textDecoration: 'none' }}>ลืมรหัสผ่าน?</Link>
            </div>

            <button
              type="submit" className="btn-primary"
              style={{ width: '100%', padding: '14px', fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', textTransform: 'lowercase' }}
            >
              เข้าสู่ระบบ
            </button>
          </form>

          {/* ส่วนที่เพิ่มใหม่: ปุ่ม Login with Google */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#555' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
            <span style={{ padding: '0 10px', fontSize: '0.9rem' }}>หรือ</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <IconGoogle /> ล็อกอินด้วย Google
          </button>

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