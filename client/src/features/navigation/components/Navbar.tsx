import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../../assets/logo.png';
import { useAuth } from '../../../context/AuthContext';
import type { NavLink } from '../types/nav.types';

const PUBLIC_LINKS: NavLink[] = [
  { label: 'หน้าแรก', to: '/' },
  { label: 'สินค้าทั้งหมด', to: '/shop' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header role="banner">
      <nav
        aria-label="เมนูหลัก"
        className="flex items-center justify-between px-10 py-4 bg-black border-b border-gray-800 sticky top-0 z-50"
      >
        {/* Logo */}
        <Link to="/" aria-label="NEXUS GEAR — หน้าแรก" className="flex items-center gap-2">
          <img src={logoImg} alt="" aria-hidden="true" className="h-10 object-contain" />
          <span className="text-white font-bold text-xl tracking-wider hidden sm:block">
            NEXUS <span className="text-red-600">GEAR</span>
          </span>
        </Link>

        {/* Primary nav links */}
        <ul className="flex gap-8 text-gray-400 font-medium list-none p-0 m-0" role="list">
          {PUBLIC_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} className="hover:text-red-500 transition">
                {label}
              </Link>
            </li>
          ))}

          {/* แสดงเฉพาะตอน Login — ทำ Role ภายหลัง */}
          {isLoggedIn && (
            <li>
              <Link to="/admin" className="text-yellow-500/70 hover:text-yellow-400 transition">
                จัดการสินค้า
              </Link>
            </li>
          )}
        </ul>

        {/* Auth actions */}
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
                type="button"
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
    </header>
  );
};

export default Navbar;