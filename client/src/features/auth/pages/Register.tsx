import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

/* ฟิลด์รหัสผ่านพร้อมปุ่มโชว์ */
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
    <label htmlFor={id} style={{ display: 'block', color: '#fff', marginBottom: '0.625rem' }}>{label}</label>
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
        <IconInfo />
        <button
          type="button"
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
          aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </span>
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername]                       = useState('');
  const [email, setEmail]                             = useState('');
  const [password, setPassword]                       = useState('');
  const [confirmPassword, setConfirmPassword]         = useState('');
  const [acceptedTerms, setAcceptedTerms]             = useState(false);
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('รหัสผ่านไม่ตรงกันครับ');
    if (!acceptedTerms)               return alert('กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนครับ');

    try {
      const { data } = await axios.post('http://localhost:3000/users/register', {
        name: username, email, password,
      });
      alert(data?.message || 'สมัครสมาชิกสำเร็จ!');
      navigate('/login');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg))       alert('สมัครไม่สำเร็จ:\n- ' + msg.join('\n- '));
      else if (typeof msg === 'string') alert('สมัครไม่สำเร็จ:\n' + msg);
      else                          alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" aria-hidden="true" />

        <div className="auth-card">
          {/* Header */}
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
            <h1 className="auth-title">สร้างบัญชีผู้ใช้</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* ชื่อผู้ใช้ */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="username" style={{ display: 'block', color: '#fff', marginBottom: '0.625rem' }}>ชื่อผู้ใช้</label>
              <div className="auth-input-wrap">
                <input id="username" type="text" placeholder="ชื่อผู้ใช้" className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>

            {/* อีเมล */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="reg-email" style={{ display: 'block', color: '#fff', marginBottom: '0.625rem' }}>อีเมล</label>
              <div className="auth-input-wrap">
                <input id="reg-email" type="email" placeholder="ที่อยู่อีเมล" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <PasswordField id="password"        label="รหัสผ่าน"        value={password}        show={showPassword}        onChange={setPassword}        onToggle={() => setShowPassword(p => !p)} />
            <PasswordField id="confirmPassword" label="ยืนยันรหัสผ่าน" value={confirmPassword} show={showConfirmPassword} onChange={setConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} />

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem', color: '#ccc', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
              <span>
                ฉันยอมรับ{' '}
                <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>ข้อกำหนดและเงื่อนไขและนโยบายความเป็นส่วนตัว</span>
              </span>
            </label>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem' }}
            >
              สมัครสมาชิก
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#fff' }}>
            มีบัญชีอยู่แล้ว?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginLeft: '4px' }}>เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>

      <div className="auth-bottom-bar" aria-hidden="true" />
    </div>
  );
};

export default Register;
