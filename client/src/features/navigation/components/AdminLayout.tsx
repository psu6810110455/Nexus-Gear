// ============================================================
// src/features/admin/components/AdminLayout.tsx
// Shared layout wrapper สำหรับทุกหน้า Admin
// ============================================================

import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Layers, BarChart3,
  LogOut, Home, MessageSquare,
} from 'lucide-react';

const menuItems = [
  { label: 'แดชบอร์ด',         icon: LayoutDashboard, path: '/dashboard' },
  { label: 'จัดการคำสั่งซื้อ', icon: ShoppingBag,     path: '/admin/orders' },
  { label: 'จัดการสินค้า',     icon: Package,         path: '/admin' },
  { label: 'จัดการหมวดหมู่',   icon: Layers,          path: '' }, // ✅ Use empty path to denote it as an action button
  { label: 'จัดการสต็อก',      icon: BarChart3,       path: '/admin/stock' },
  { label: 'แชทกับลูกค้า',   icon: MessageSquare,   path: '/admin/chat' },
];

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumb?: string;
  onCategoryClick?: () => void;
}

const AdminLayout = ({ children, breadcrumb = 'จัดการสินค้า', onCategoryClick }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] selection:bg-[#990000] selection:text-white relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000000;
        }
        ::-webkit-scrollbar-thumb {
          background: #2E0505;
          border-radius: 10px;
          border: 2px solid #000000;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #990000;
        }
        
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #2E0505 #000000;
        }
      `}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
      </div>

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#000000]/95 border-r border-[#990000]/50 flex flex-col z-50 backdrop-blur-xl shrink-0">
        {/* Logo */}
        <div
          className="p-6 flex items-center gap-3 border-b border-[#990000]/30 cursor-pointer group relative overflow-hidden"
          onClick={() => navigate('/')}
        >
          <div className="absolute inset-0 bg-[#FF0000]/10 blur-xl opacity-0 group-hover:opacity-50 transition duration-500" />
          <img
            src="/nexus-logo.png" alt="Logo"
            className="w-8 h-8 object-contain relative z-10"
            onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/50x50/000/fff/000000/red?text=NX'; }}
          />
          <span className="font-['Orbitron'] font-black text-[#F2F4F6] text-lg tracking-wider relative z-10 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">
            ADMIN
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'จัดการหมวดหมู่') {
                    if (onCategoryClick) onCategoryClick();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group font-['Kanit'] text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-[#990000]/40 to-transparent border-l-4 border-[#FF0000] text-white pl-5 shadow-[0_0_15px_rgba(153,0,0,0.3)]'
                    : 'text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] hover:pl-5'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#FF0000]' : 'text-[#F2F4F6]/50 group-hover:text-[#FF0000]'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[#990000]/30 space-y-1">
          {/* ── ปุ่มกลับคลังสินค้าแอดมิน ── */}
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#1a0000] hover:text-white transition text-[#F2F4F6]/40 border border-transparent hover:border-[#990000]/30 group"
          >
            <Home size={18} className="text-[#F2F4F6]/30 group-hover:text-[#FF0000] transition" />
            <span className="font-['Kanit'] text-sm">กลับหน้าหลัก (Admin)</span>
          </button>
          {/* ── Logout ── */}
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-[#990000]/20 hover:text-[#FF0000] transition text-[#F2F4F6]/40 border border-transparent hover:border-[#990000]/50 group"
          >
            <LogOut size={18} className="text-[#F2F4F6]/30 group-hover:text-[#FF0000] transition" />
            <span className="font-['Orbitron'] tracking-wide text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-3 border-b border-[#990000]/20 bg-[#0a0000]/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs text-[#F2F4F6]/40 hover:text-[#FF0000] bg-white/5 hover:bg-[#2E0505] border border-white/10 hover:border-[#990000]/50 px-3 py-1.5 rounded-lg transition font-['Kanit']"
            >
              <Home size={13} /> หน้าหลัก
            </button>
            <span className="text-[#F2F4F6]/20 text-xs">/</span>
            <span className="text-[#FF0000] text-xs font-bold font-['Kanit']">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#2E0505] flex items-center justify-center text-xs font-bold text-[#FF0000] border border-[#990000]">AD</div>
            <span className="text-xs text-[#F2F4F6]/60 font-['Kanit']">ผู้ดูแลระบบ</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
            {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
