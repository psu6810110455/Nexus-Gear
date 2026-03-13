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
      localStorage.removeItem('oauth_action');
      
      if (action === 'register') {
        // สมัครผ่าน Google → ส่งไปหน้าล็อกอินให้กดล็อกอินอีกรอบ
        toast.success('สมัครสมาชิกด้วย Google สำเร็จ! กรุณาเข้าสู่ระบบอีกครั้ง');
        navigate('/login');
      } else {
        // ล็อกอินผ่าน Google → ✅ บันทึก Token แล้วเด้งไปหน้าหลักเลย!
        login(token);
        toast.success('เข้าสู่ระบบด้วย Google สำเร็จ! ยินดีต้อนรับ 🎮');
        navigate('/');
      }
    } else {
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
