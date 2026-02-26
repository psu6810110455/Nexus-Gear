import { LayoutDashboard, ShoppingBag, Box, List, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'จัดการคำสั่งซื้อ', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'จัดการสินค้า', icon: <Box size={20} />, path: '/admin/products' },
    { name: 'จัดการหมวดหมู่', icon: <List size={20} />, path: '/admin/categories' },
  ];

  return (
    <div className="w-64 h-screen bg-black border-r border-red-900/30 flex flex-col text-gray-300 fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img src={logoImg} alt="Logo" className="w-20 h-20 object-contain" />
        <h1 className="text-xl font-bold tracking-wider text-white">ADMIN</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-red-900/50 to-transparent text-red-400 border-l-4 border-red-500' 
                  : 'hover:bg-zinc-900 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-left hover:text-red-500 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;