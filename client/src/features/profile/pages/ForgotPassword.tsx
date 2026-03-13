import React, { useState } from 'react';
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
      // ⚠️ ยิง API ไปที่หลังบ้าน (เปลี่ยน URL ให้ตรงกับพอร์ต Backend ของคุณ ถ้าไม่ใช่ 3000)
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      setMessage(response.data.message || 'ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้วครับ');
      setEmail(''); // ล้างช่องกรอกอีเมล
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">NEXUS GEAR</h2>
        <h3 className="text-xl font-semibold text-center mb-2">ลืมรหัสผ่านใช่ไหม?</h3>
        <p className="text-gray-400 text-center mb-6 text-sm">
          กรุณากรอกอีเมลที่คุณใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้คุณ
        </p>

        {/* แสดงข้อความสำเร็จ */}
        {message && (
          <div className="bg-green-900 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 text-sm text-center">
            {message}
          </div>
        )}

        {/* แสดงข้อความ Error */}
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 font-bold rounded transition-colors ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLoading ? 'กำลังส่งข้อมูล...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-gray-400 hover:text-red-400 transition-colors">
            กลับไปหน้าเข้าสู่ระบบ
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
