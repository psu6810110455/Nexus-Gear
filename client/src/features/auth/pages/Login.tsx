// ============================================================
// src/features/auth/pages/Login.tsx
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../shared/services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

// ── Icons ─────────────────────────────────────────────────────
const IconInfo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconEye = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token } = await loginApi(email, password);
      localStorage.setItem("token", access_token);
      authLogin(access_token);
      alert("ยินดีต้อนรับกลับสู่ Nexus Gear!");
      navigate("/");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้องครับ";
      alert(message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="bg-lines"></div>
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="btn-back-home">
              กลับสู่หน้าหลัก
            </Link>
            <h1 className="form-title">เข้าสู่ระบบ</h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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
                  <div className="icon-info">
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

            <div className="login-helpers">
              <label className="remember-me">
                <input type="checkbox" />
                <span>จดจำฉัน</span>
              </label>
              <Link to="/forgot" className="forgot-link">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <button type="submit" className="btn-submit">
              เข้าสู่ระบบ
            </button>

            <div className="login-footer">
              <p>
                ยังไม่มีบัญชี?{" "}
                <Link to="/register" className="link-red">
                  สมัครสมาชิก
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="bottom-bar"></div>
    </div>
  );
};

export default Login;
