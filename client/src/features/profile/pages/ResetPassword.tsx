import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  // ดึง token จาก URL (?token=...)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // 1. เช็กว่ามี Token ใน URL ไหม
    if (!token) {
      setError('ไม่พบ Token หรือลิงก์ไม่ถูกต้อง กรุณากดลิงก์จากอีเมลใหม่อีกครั้งครับ');
      return;
    }

    // 2. เช็กว่ารหัสผ่าน 2 ช่องตรงกันไหม
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกันครับ');
      return;
    }

    // 3. เช็กความยาวรหัสผ่าน (ให้ตรงกับเงื่อนไข Backend)
    if (newPassword.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรครับ');
      return;
    }

    setIsLoading(true);

    try {
      //  ยิง API ไปที่หลังบ้าน (เช็กพอร์ตให้ตรงด้วยนะครับ)
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_BASE}/auth/reset-password`, {
        token,
        newPassword,
      });

      setMessage(response.data.message || 'เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
      
      // เมื่อเปลี่ยนสำเร็จ รอ 3 วินาทีแล้วพากลับไปหน้า Login
      setTimeout(() => {
        navigate('/login'); 
      }, 3000);

    } catch (err: any) {
      setError(
        err.response?.data?.message || 'ลิงก์หมดอายุ หรือเกิดข้อผิดพลาด กรุณาขอลิงก์ใหม่อีกครั้ง'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">NEXUS GEAR</h2>
        <h3 className="text-xl font-semibold text-center mb-2">ตั้งรหัสผ่านใหม่</h3>
        <p className="text-gray-400 text-center mb-6 text-sm">
          กรุณากำหนดรหัสผ่านใหม่ที่คุณต้องการใช้งาน
        </p>

        {/* แสดงข้อความสำเร็จ */}
        {message && (
          <div className="bg-green-900 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 text-sm text-center">
            {message} <br /> ระบบกำลังพากลับไปหน้าเข้าสู่ระบบ...
          </div>
        )}

        {/* แสดงข้อความ Error */}
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* ถ้าไม่มี Token ให้ซ่อนฟอร์มไปเลย เพื่อบังคับให้ไปกดจากอีเมล */}
        {!token && !error && (
          <div className="bg-yellow-900 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-4 text-sm text-center">
             ไม่พบข้อมูล Token กรุณาเปิดลิงก์นี้จากในอีเมลของคุณโดยตรงครับ
          </div>
        )}

        <form onSubmit={handleSubmit} className={!token ? 'opacity-50 pointer-events-none' : ''}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-300 text-sm font-bold mb-2">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-bold mb-2">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านใหม่อีกครั้งให้ตรงกัน"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className={`w-full py-2 px-4 font-bold rounded transition-colors ${
              isLoading || !token
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLoading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกรหัสผ่านใหม่'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-400 hover:text-red-400 transition-colors">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
