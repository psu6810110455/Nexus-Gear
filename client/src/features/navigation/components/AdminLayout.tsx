// ============================================================
// src/features/admin/components/AdminLayout.tsx
// Shared layout wrapper สำหรับทุกหน้า Admin
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Home, MessageSquare, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

const menuItems = [
  { labelKey: 'dashboard',         icon: LayoutDashboard, path: '/dashboard' },
  { labelKey: 'manageOrders',      icon: ShoppingBag,     path: '/admin/orders' },
  { labelKey: 'inventory',         icon: Package,         path: '/admin' },
  { labelKey: 'manageStock',       icon: BarChart3,       path: '/admin/stock' },
  { labelKey: 'customerChat',      icon: MessageSquare,   path: '/admin/chat' },
];

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumb?: string;
}

const AdminLayout = ({ children, breadcrumb = 'ศูนย์บริหารสินค้า' }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          background: #3f3f46;
          border-radius: 10px;
          border: 2px solid #000000;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #52525b;
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
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#000000]/95 border-r border-[#990000]/50 flex flex-col z-50 backdrop-blur-xl shrink-0 transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#990000] text-white rounded-full p-1.5 border border-[#FF0000]/50 hover:bg-[#FF0000] transition shadow-[0_0_15px_rgba(255,0,0,0.6)] z-[60]"
          title={isCollapsed ? (language === 'TH' ? "ขยายแถบเมนู" : "Expand Sidebar") : (language === 'TH' ? "ซ่อนแถบเมนู" : "Collapse Sidebar")}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo */}
        <div
          className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} border-b border-[#990000]/30 cursor-pointer group relative overflow-hidden`}
          onClick={() => navigate('/')}
        >
          <div className="absolute inset-0 bg-[#FF0000]/10 blur-xl opacity-0 group-hover:opacity-50 transition duration-500" />
          <img
            src="/logo.png" alt="Logo"
            className="w-8 h-8 object-contain relative z-10"
            onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/50x50/000/fff/000000/red?text=NX'; }}
          />
          {!isCollapsed && (
            <span className="font-['Orbitron'] font-black text-[#F2F4F6] text-lg tracking-wider relative z-10 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">
              ADMIN
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const label = t(item.labelKey as any);
            return (
              <button
                key={item.labelKey}
                title={isCollapsed ? label : ""}
                onClick={() => {
                   if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all duration-300 group font-['Kanit'] text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-[#990000]/40 to-transparent border-l-4 border-[#FF0000] text-white pl-5 shadow-[0_0_15px_rgba(153,0,0,0.3)]'
                    : 'text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] hover:pl-5'
                }`}
              >
                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-[#FF0000]' : 'text-[#F2F4F6]/50 group-hover:text-[#FF0000]'}`} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[#990000]/30 space-y-2">
          {/* ── Back to Site Home ── */}
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2E0505] hover:bg-[#FF0000] text-[#FF0000] hover:text-white border border-[#990000]/30 transition group shadow-lg`}
          >
            <Home size={18} className="shrink-0 group-hover:text-white transition" />
            {!isCollapsed && <span className="font-['Kanit'] text-sm font-bold uppercase tracking-wider">{t('backToHomeShort')}</span>}
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
              <Home size={13} /> {t('home')}
            </button>
            <span className="text-[#F2F4F6]/20 text-xs">/</span>
            <span className="text-[#FF0000] text-xs font-bold font-['Kanit']">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#2E0505] flex items-center justify-center text-xs font-bold text-[#FF0000] border border-[#990000]">AD</div>
            <span className="text-xs text-[#F2F4F6]/60 font-['Kanit']">{t('administrator')}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-dark">
            {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
