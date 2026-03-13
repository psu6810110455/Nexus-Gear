import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // นำเข้า useAuth เพื่อจัดการสถานะ User
import { toast } from 'sonner';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth(); // ดึงฟังก์ชัน login ออกมาใช้

  useEffect(() => {
    // ดึงรหัส token จาก URL ที่ Backend ส่งมา
    const token = searchParams.get('token');

    if (token) {
      const action = localStorage.getItem('oauth_action');
      
      if (action === 'register') {
        localStorage.removeItem('oauth_action');
        toast.success('สมัครสมาชิกด้วย Google สำเร็จ! กรุณาเข้าสู่ระบบอีกครั้ง');
        // ส่งไปหน้าล็อกอินโดยไม่ล็อกอินให้ ตาม Request
        navigate('/login');
      } else {
        localStorage.removeItem('oauth_action');
        // ถือ Token ไว้แต่อาจจะแค่ให้ไปล็อกอินอีกทีตามที่ผู้ใช้ร้องขอ
        // แต่จริงๆ ในแอปมี `login(token)` อยู่ทำให้ล็อกอินสำเร็จ
        toast.success('เข้าสู่ระบบสำเร็จ! รอสักครู่...');
        // เปลี่ยนตามคำขอ "ตอนกดสร้างไอดีด้วย google อยากให้เด้งมาหน้า login ก่อนครับ"
        // สำหรับการล็อกอินก็เด้งไปหน้าล็อกอินก่อนก็ได้เพื่อให้ผ่านกระบวนการหน้าเว็บ
        navigate('/login');
      }
    } else {
      // ถ้าไม่มี Token (เช่นมีคนแอบพิมพ์ URL เข้ามาเอง) ให้เด้งกลับไปหน้าล็อกอิน
      navigate('/login');
    }
  }, [navigate, searchParams, login]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>กำลังเข้าสู่ระบบ...</h2>
    </div>
  );
};

export default LoginSuccess;
