// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // SVG Icons
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
    <div className="register-page-wrapper">
      {/* --- แถบดำบน (Top Bar) --- */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="brand-group">
            <div className="logo-placeholder"></div> {/* หรือใส่ <img src={logo} /> */}
            <h2 className="brand-name">Nexus Gear</h2>
          </div>
        </div>
      </div>

      <div className="register-container">
        <div className="bg-glow"></div>
        <div className="register-card">
          <div className="register-header">
            <Link to="/" className="btn-back-home">Back to home</Link>
            <h3 className="form-title">Create Account</h3>
          </div>

          <form className="register-form">
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <input type="text" placeholder="Username" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input type="email" placeholder="Email Address" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="Password" className="form-input" />
                <div className="icon-group">
                  <div className="icon-info"><IconInfo /></div>
                  <button type="button" className="btn-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" className="form-input" />
                <div className="icon-group">
                  <div className="icon-info"><IconInfo /></div>
                  <button type="button" className="btn-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <IconEye /> : <IconEyeOff />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  I agree to <span className="highlight">Terms & Conditions and Privacy Policy </span> 
                </label>
          </div>

            <button type="submit" className="btn-submit">Register</button>
          </form>

          <div className="register-footer-text">
            <p>Already have an account? <Link to="/login" className="link-login">Login</Link></p>
          </div>
        </div>
      </div>

      {/* --- แถบดำล่าง (Bottom Bar) --- */}
      <div className="bottom-bar"></div>
    </div>
  );
};

export default Register;