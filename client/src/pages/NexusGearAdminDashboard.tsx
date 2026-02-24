import React from 'react';
// 1. นำเข้าเฉพาะ Icon ที่ต้องใช้สำหรับการ์ด 4 กล่องแรกก่อน 
import { BarChart3, ShoppingBag, Package, AlertTriangle, ArrowRight } from 'lucide-react';

// 2. [TypeScript] สร้าง Interface เพื่อกำหนดว่า Component นี้ต้องรับ Props อะไรบ้าง
// setActiveTab เป็นฟังก์ชันที่รับค่าเป็น string เพื่อเอาไว้เปลี่ยนหน้าจอ
interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

// 3. สร้าง Component หลัก และใส่ Type ให้กับ Props ที่รับเข้ามา
export default function NexusGearAdminDashboard({ setActiveTab }: AdminDashboardProps) { 
  
  // 4. ข้อมูลจำลอง (Mock Data) สำหรับการ์ด 4 กล่องบนสุด
  // (เดี๋ยวเราจะมาเขียนฟังก์ชันดึงจาก Database จริงๆ ในฟีเจอร์หลังๆ ครับ)
  const stats = [
    { title: "ยอดขายรวม", value: "฿459,200", change: "+12.5%", icon: <BarChart3 />, link: null },
    { title: "คำสั่งซื้อ", value: "1,245", change: "+8.2%", icon: <ShoppingBag />, link: 'orders' },
    { title: "สินค้าในคลัง", value: "156", change: "-2.4%", icon: <Package />, link: 'products' },
    { title: "สินค้าใกล้หมด", value: "5", change: "Alert", icon: <AlertTriangle />, alert: true, link: 'stock' },
  ];

  return (
    // 5. กล่อง Container หลักของหน้านี้ ห่อหุ้มเนื้อหาทั้งหมด พร้อมแอนิเมชันเปิดตัว
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      
      {/* 6. หัวข้อหลักของหน้าเพจ (DASHBOARD) */}
      <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
        DASHBOARD
      </h2>
      
      {/* 7. ฟีเจอร์ของ Commit นี้: Grid สำหรับแสดงการ์ดสถิติ 4 ใบ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            onClick={() => stat.link && setActiveTab(stat.link)} 
            className={`p-6 rounded-2xl border transition-all duration-300 ${
                stat.alert ? 'bg-[#2E0505]/80 border-[#FF0000] shadow-[0_0_15px_#FF0000]' : 'bg-[#000000]/60 border-[#990000]/30 hover:border-[#FF0000]'
            } relative overflow-hidden group cursor-pointer backdrop-blur-md`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#F2F4F6]/60 text-sm font-['Kanit']">{stat.title}</p>
                <h3 className="text-2xl font-bold text-[#F2F4F6] mt-1 font-['Orbitron']">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.alert ? 'bg-[#FF0000] text-white' : 'bg-[#2E0505] text-[#990000] border border-[#990000]/50'}`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <span className={`text-xs block font-['Orbitron'] ${stat.alert ? 'text-[#FF0000]' : 'text-green-500'}`}>
                    {stat.change} from last month
                </span>
                {stat.link && (
                    <ArrowRight size={16} className="text-[#F2F4F6]/30 group-hover:text-[#FF0000] transition-colors" />
                )}
            </div>
          </div>
        ))}
      </div>

      {/* พื้นที่จองไว้สำหรับ กราฟยอดขาย (จะมาทำใน Commit ที่ 2 ครับ) */}
      
    </div>
  );
}