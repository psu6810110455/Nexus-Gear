import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { initialUserData } from '../data/mockData';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [userData, setUserData] = useState(initialUserData);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white pb-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');`}</style>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 object-contain relative z-10" />
              </div>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest">NEXUS GEAR</h1>
            </div>
            {/* เดี๋ยวเราจะมาเติมฟังก์ชันกดโชว์ Modal ลงในปุ่มนี้ใน Part หลังครับ */}
            <button onClick={() => console.log('Show Logout Modal')} className="flex items-center gap-2 text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider">
              <LogOut className="w-4 h-4" /> <span className="hidden md:inline">LOGOUT</span>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* ซ้าย: Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar 
                userData={userData} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>

            {/* ขวา: Content area (เดี๋ยวเราจะเอา Tab components มาใส่ตรงนี้ใน Part 3) */}
            <div className="lg:col-span-3">
              {activeTab === 'info' && <div className="p-8 text-center text-[#F2F4F6]/50 border border-[#990000]/30 rounded-2xl bg-[#000000]/60 animate-in fade-in">รอเพิ่มเนื้อหา Tab: ข้อมูลส่วนตัว (Part 3)</div>}
              {activeTab === 'addresses' && <div className="p-8 text-center text-[#F2F4F6]/50 border border-[#990000]/30 rounded-2xl bg-[#000000]/60 animate-in fade-in">รอเพิ่มเนื้อหา Tab: ที่อยู่จัดส่ง (Part 3)</div>}
              {activeTab === 'orders' && <div className="p-8 text-center text-[#F2F4F6]/50 border border-[#990000]/30 rounded-2xl bg-[#000000]/60 animate-in fade-in">รอเพิ่มเนื้อหา Tab: ประวัติการสั่งซื้อ (Part 3)</div>}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};