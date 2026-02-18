import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate สำหรับเปลี่ยนหน้า
import axios from 'axios'; // เพิ่ม axios สำหรับเชื่อมต่อ API
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  
  // --- 1. เพิ่ม State สำหรับเก็บข้อมูลการเข้าสู่ระบบ ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- 2. ฟังก์ชันจัดการการ Login ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ยิงข้อมูลไปที่ API Login ของ NestJS
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      // เมื่อสำเร็จ จะได้รับ access_token กลับมา
      const { access_token } = response.data;
      
      // 💾 เก็บ "บัตรผ่าน" ไว้ใน localStorage เพื่อใช้ยืนยันตัวตนในหน้าอื่นๆ
      localStorage.setItem('token', access_token);
      
      alert('ยินดีต้อนรับกลับสู่ Nexus Gear!');
      navigate('/'); // พาผู้ใช้ไปที่หน้าหลัก
    } catch (error: any) {
      // แจ้งเตือนหากอีเมลหรือรหัสผ่านผิด
      const message = error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้องครับ';
      alert(message);
    }
  };

  // SVG Icons (คงเดิม)
  const IconInfo = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
  );
  const IconEye = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  );
  const IconEyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  );

  return (
    <div className="login-page-wrapper">
      <div className="top-bar">
        <div className="brand-group">
          <h2 className="brand-name">Nexus Gear</h2>
        </div>
      </div>

      <div className="login-container">
        <div className="bg-lines"></div>

        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="btn-back-home">กลับสู่หน้าหลัก</Link>
            <h1 className="form-title">เข้าสู่ระบบ</h1>
          </div>

          {/* --- 3. เพิ่ม onSubmit ให้ฟอร์ม --- */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>อีเมล</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="ที่อยู่อีเมล" 
                  className="form-input"
                  value={email} // เชื่อมข้อมูลกับ State
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>รหัสผ่าน</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="กรอกรหัสผ่านของคุณ" 
                  className="form-input"
                  value={password} // เชื่อมข้อมูลกับ State
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <div className="icon-group">
                  <div className="icon-info"><IconInfo /></div>
                  <button type="button" className="btn-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>
            </div>

            <div className="login-helpers">
              <label className="remember-me">
                <input type="checkbox" />
                <span>จดจำฉัน</span>
              </label>
              <Link to="/forgot" className="forgot-link">ลืมรหัสผ่าน?</Link>
            </div>

            <button type="submit" className="btn-submit">เข้าสู่ระบบ</button>

            <div className="login-footer">
              <p>ยังไม่มีบัญชี? <Link to="/register" className="link-red">สมัครสมาชิก</Link></p>
            </div>
          </form>
        </div>
      </div>

      <div className="bottom-bar"></div>
    </div>
  );
};

export default Login;