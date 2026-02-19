import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 🎯 นำเข้า Hook
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate(); // 🎯 ใช้ navigate แทนการโหลดหน้าใหม่
  const { login } = useAuth(); // 🎯 ดึงฟังก์ชัน login จาก Context กลาง

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;
      
      // 🎯 ส่ง Token ไปเก็บใน Context และเปลี่ยนสถานะทันที
      login(access_token);
      
      alert('ยินดีต้อนรับกลับสู่ Nexus Gear!');
      navigate('/'); // 🎯 เปลี่ยนไปหน้าแรกทันทีโดยที่เว็บไม่ต้องกระพริบโหลดใหม่
      
    } catch (error: any) {
      const message = error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      alert(message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="top-bar"></div>

      <div className="login-container">
        <div className="login-box">
          <h2>เข้าสู่ระบบ <span className="text-red">NEXUS GEAR</span></h2>
          <p className="subtitle">ยินดีต้อนรับกลับสู่สมรภูมิเกมเมอร์</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>อีเมล</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="กรอกอีเมลของคุณ" 
                  className="form-input"
                  value={email}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button type="button" className="btn-icon" onClick={() => setShowPassword(!showPassword)}>
                   {showPassword ? "Hide" : "Show"} 
                </button>
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