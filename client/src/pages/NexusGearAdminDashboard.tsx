import React from 'react';
// 1. [Commit 2] เพิ่มนำเข้า Icon TrendingUp สำหรับใช้ตรงหัวข้อกราฟ
import { BarChart3, ShoppingBag, Package, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function NexusGearAdminDashboard({ setActiveTab }: AdminDashboardProps) { 
  
  const stats = [
    { title: "ยอดขายรวม", value: "฿459,200", change: "+12.5%", icon: <BarChart3 />, link: null },
    { title: "คำสั่งซื้อ", value: "1,245", change: "+8.2%", icon: <ShoppingBag />, link: 'orders' },
    { title: "สินค้าในคลัง", value: "156", change: "-2.4%", icon: <Package />, link: 'products' },
    { title: "สินค้าใกล้หมด", value: "5", change: "Alert", icon: <AlertTriangle />, alert: true, link: 'stock' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      
      <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
        DASHBOARD
      </h2>
      
      {/* --- [Commit 1] การ์ด 4 ใบ --- */}
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

      {/* --- [Commit 2] ฟีเจอร์ใหม่: กราฟยอดขาย --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* กล่องกราฟยอดขาย จะกินพื้นที่ 2 ใน 3 (lg:col-span-2) */}
        <div className="lg:col-span-2 bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 backdrop-blur-md">
            
            {/* ส่วนหัวของกราฟ และ Dropdown สำหรับกรองช่วงเวลา */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#F2F4F6] font-['Kanit'] flex items-center gap-2">
                    <TrendingUp className="text-[#FF0000]" /> ภาพรวมยอดขาย (Revenue)
                </h3>
                <select className="bg-black border border-[#990000]/30 text-[#F2F4F6] text-xs rounded px-2 py-1 outline-none font-['Kanit']">
                    <option>7 วันล่าสุด</option>
                    <option>เดือนนี้</option>
                </select>
            </div>

            {/* แท่งกราฟจำลอง (Mock Graph Bars) */}
            <div className="flex items-end justify-between h-48 gap-2 px-2">
                {[40, 65, 30, 85, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-[#2E0505] rounded-t-lg relative group overflow-hidden">
                        <div 
                            style={{ height: `${h}%` }} 
                            className="absolute bottom-0 w-full bg-gradient-to-t from-[#990000] to-[#FF0000] opacity-80 group-hover:opacity-100 transition-all duration-500"
                        ></div>
                    </div>
                ))}
            </div>

            {/* ป้ายกำกับวันใต้แท่งกราฟ */}
            <div className="flex justify-between mt-2 text-[#F2F4F6]/40 text-xs font-['Orbitron']">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
        </div>

        {/* พื้นที่ว่างข้างๆ กราฟ จองไว้สำหรับกิจกรรมล่าสุด (ทำใน Commit ที่ 3) */}

      </div>
      
    </div>
  );
}