import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      setMessage(response.data.message || 'ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้วครับ');
      setEmail('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="auth-bg-lines" aria-hidden="true" />
        <div className="auth-card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <Link
              to="/login"
              style={{
                background: 'var(--color-primary-hover)', color: '#fff',
                padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none',
                zIndex: 10
              }}
            >
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>

          <h1 className="auth-title">ลืมรหัสผ่าน</h1>

          <p style={{ color: '#999', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            กรุณากรอกอีเมลที่คุณใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้คุณ
          </p>

          {/* แสดงข้อความสำเร็จ */}
          {message && (
            <div style={{
              background: 'rgba(22, 163, 74, 0.15)', border: '1px solid rgba(22, 163, 74, 0.4)',
              color: '#86efac', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem',
              fontSize: '0.9rem', textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          {/* แสดงข้อความ Error */}
          {error && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#fca5a5', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem',
              fontSize: '0.9rem', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', textAlign: 'left' }}>อีเมล</label>
              <div className="auth-input-wrap">
                <input
                  id="email" type="email" placeholder="your@email.com"
                  className="auth-input" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>

            <button
              type="submit" disabled={isLoading} className="btn-primary"
              style={{
                width: '100%', padding: '14px', fontFamily: 'Orbitron, sans-serif',
                fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'กำลังส่งข้อมูล...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
            </button>
          </form>
        </div>
      </div>
      <div className="auth-bottom-bar" aria-hidden="true" />
    </div>
  );
};

export default ForgotPassword;
