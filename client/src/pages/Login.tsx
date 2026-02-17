// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  // สร้าง State สำหรับการสลับเปิด-ปิด ตาในช่อง Password
  const [showPassword, setShowPassword] = useState(false);

  // --- SVG Icons (ก๊อปปี้ไปวางใช้งานได้เลยครับ) ---
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
            <Link to="/" className="btn-back-home">Back to home</Link>
            <h3 className="form-title">Login Your Account</h3>
          </div>

          <form className="login-form">
            {/* --- 🟢 ส่วนที่ 4: เริ่มอัปเดตตรงนี้ครับ --- */}
            
            {/* Email Field */}
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input type="email" placeholder="Email Address" className="form-input" />
                {/* จองที่ว่างไว้เพื่อให้ความยาวช่องเท่ากับช่อง Password */}
                <div className="icon-group empty"></div> 
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="form-input" 
                />
                <div className="icon-group">
                  <div className="icon-info" title="Login help">
                    <IconInfo />
                  </div>
                  <button 
                    type="button" 
                    className="btn-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>
            </div>

            {/* --- 🔴 จบส่วนที่ 4 --- */}
          </form>
        </div>
      </div>

      <div className="bottom-bar"></div>
    </div>
  );
};

export default Login;