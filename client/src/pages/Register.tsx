import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css'; // เดี๋ยวเราสร้างไฟล์นี้ใน Phase 3

const Register = () => {
  // State สำหรับ toggle ดูรหัสผ่าน (เตรียมไว้ก่อน)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-container">
      {/* Background Effect */}
      <div className="bg-glow"></div>

      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <h2 className="brand-title">NEXUS GEAR</h2>
          <h3 className="form-title">Create Account</h3>
        </div>

        {/* Form */}
        <form className="register-form">
          
          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Username" 
              className="form-input"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              className="form-input"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password" 
                className="form-input"
              />
              <button 
                type="button" 
                className="btn-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                className="form-input"
              />
              <button 
                type="button" 
                className="btn-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className="form-checkbox">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I agree to <span className="highlight">Terms & Conditions</span> and <span className="highlight">Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit">
            Register
          </button>

        </form>

        {/* Footer */}
        <div className="register-footer">
          <p>Already have an account? <Link to="/login" className="link-login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;