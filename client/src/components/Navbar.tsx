import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); 

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      localStorage.removeItem('token');
      // รีเฟรชหน้าจอ 1 ครั้งเพื่อให้ปุ่มเปลี่ยนกลับเป็น Login
      window.location.href = "/login"; 
    }
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-black border-b border-gray-800 sticky top-0 z-50">
      {/* 1. Logo - กดแล้วกลับบ้าน */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 cursor-pointer"
      >
        <img src={logoImg} alt="Logo" className="h-10 object-contain" />
        <span className="text-white font-bold text-xl tracking-wider hidden sm:block">
          NEXUS <span className="text-red-600">GEAR</span>
        </span>
      </div>

      {/* 2. Menu กลาง */}
      <div className="flex gap-8 text-gray-400 font-medium">
        <Link to="/" className="hover:text-red-500 transition">หน้าแรก</Link>
        <Link to="/shop" className="hover:text-red-500 transition">สินค้าทั้งหมด</Link>
      </div>

      {/* 3. ปุ่มขวา (Login/Logout) */}
      <div className="flex gap-4">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="text-white hover:text-red-500 transition text-sm"
          >
            ออกจากระบบ
          </button>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-red-500 transition text-sm flex items-center">
              เข้าสู่ระบบ
            </Link>
            <Link 
              to="/register" 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition"
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;