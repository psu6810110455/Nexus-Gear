import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('รหัสผ่านไม่ตรงกันครับ กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    if (!acceptedTerms) {
      alert('กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนสมัครสมาชิกครับ');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/users/register', {
        name: username,
        email: email,
        password: password,
      });

      alert(response.data?.message || 'สมัครสมาชิกสำเร็จ!');
      navigate('/login'); 
    } catch (error: any) {
      const errorData = error.response?.data?.message;
      
      if (Array.isArray(errorData)) {
        alert("สมัครไม่สำเร็จ (ข้อมูลไม่ถูกต้อง):\n- " + errorData.join('\n- '));
      } else if (typeof errorData === 'string') {
        alert("สมัครไม่สำเร็จ:\n" + errorData);
      } else {
        alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้! กรุณาเช็คว่า Backend รันอยู่หรือไม่');
      }
    }
  };

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
      <div className="register-container">
        <div className="bg-glow"></div>
        <div className="register-card">
          <div className="register-header">
            <Link to="/" className="btn-back-home">กลับสู่หน้าหลัก</Link>
            <h1 className="form-title">สร้างบัญชีผู้ใช้</h1>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ชื่อผู้ใช้</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="ชื่อผู้ใช้" 
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>อีเมล</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="ที่อยู่อีเมล" 
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
                <div className="icon-group">
                  <div className="icon-info"><IconInfo /></div>
                  <button type="button" className="btn-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>ยืนยันรหัสผ่าน</label>
              <div className="input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="ยืนยันรหัสผ่านของคุณ" 
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
                <div className="icon-group">
                  <div className="icon-info"><IconInfo /></div>
                  <button type="button" className="btn-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label htmlFor="terms">
                  ฉันยอมรับ <span className="highlight">ข้อกำหนดและเงื่อนไขและนโยบายความเป็นส่วนตัว</span>
                </label>
            </div>

            <button type="submit" className="btn-submit">สมัครสมาชิก</button>
          </form>

          <div className="register-footer-text">
            <p>มีบัญชีอยู่แล้ว? <Link to="/login" className="link-login">เข้าสู่ระบบ</Link></p>
          </div>
        </div>
      </div>

      <div className="bottom-bar"></div>
    </div>
  );
};

export default Register;