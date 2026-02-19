import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-black border-b border-gray-800 sticky top-0 z-50">
      
      {/* 1. Logo */}
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
        <Link to="/" className="hover:text-red-500 transition">
          หน้าแรก
        </Link>
        <Link to="/shop" className="hover:text-red-500 transition">
          สินค้าทั้งหมด
        </Link>

        {/* แสดงเฉพาะตอน Login แล้ว — ตอนทำ Role ค่อยเปลี่ยนเป็น isAdmin */}
        {isLoggedIn && (
          <Link
            to="/admin"
            className="text-yellow-500/70 hover:text-yellow-400 transition"
          >
            จัดการสินค้า
          </Link>
        )}
      </div>

      {/* 3. ปุ่มขวา */}
      <div className="flex gap-4 items-center">
        {isLoggedIn ? (
          <>
            <Link to="/cart" className="text-white hover:text-red-500 transition text-sm">
              ตะกร้า
            </Link>
            <Link to="/profile" className="text-white hover:text-red-500 transition text-sm">
              โปรไฟล์
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-red-600/20 border border-transparent hover:border-red-600 transition text-sm px-3 py-1.5 rounded ml-2"
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-red-500 transition text-sm">
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