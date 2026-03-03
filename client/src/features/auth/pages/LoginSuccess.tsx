import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // ดึงรหัส token จาก URL ที่ Backend ส่งมา
    const token = searchParams.get('token');

    if (token) {
      // เอาไปเก็บในเครื่อง (เหมือนตอนล็อกอินปกติ)
      localStorage.setItem('token', token);
      
      // เก็บเสร็จปุ๊บ พาไปหน้าแรกเลย!
      navigate('/');
    } else {
      // ถ้าไม่มี Token (เช่นมีคนแอบพิมพ์ URL เข้ามาเอง) ให้เด้งกลับไปหน้าล็อกอิน
      navigate('/login');
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>กำลังเข้าสู่ระบบ...</h2>
    </div>
  );
};

export default LoginSuccess;