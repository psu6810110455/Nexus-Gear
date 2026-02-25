// 1. [Commit 4] เพิ่ม useState, useEffect สำหรับจัดการข้อมูล และ axios สำหรับยิง API
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, ShoppingBag, Package, AlertTriangle, ArrowRight, TrendingUp, Activity, User as UserIcon, Clock } from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

// 2. [Commit 4] สร้าง Interface กำหนดรูปร่างของข้อมูลสถิติที่จะได้จาก Database
interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStock: number;
}

export default function NexusGearAdminDashboard({ setActiveTab }: AdminDashboardProps) { 
  
  // 3. [Commit 4] สร้างกล่อง State เก็บข้อมูลสถิติ (ตั้งค่าเริ่มต้นเป็น 0 รอไว้ก่อน)
  const [statsData, setStatsData] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStock: 0
  });

  // 4. [Commit 4] สั่งให้ทำงาน "ทันที" ที่โหลดหน้านี้ขึ้นมา เพื่อไปดึงข้อมูลจาก API
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // 5. [Commit 4] ฟังก์ชันไปดึงข้อมูลจาก Backend
  const fetchDashboardStats = async () => {
    try {
      // ⚠️ คำเตือน: ตรงนี้คือ URL ของ Backend คุณ (คุณต้องแก้ให้ตรงกับ Route ที่คุณสร้างไว้นะครับ)
      // ตัวอย่าง: http://localhost:3000/api/admin/dashboard/stats
      const response = await axios.get('http://localhost:3000/api/admin/dashboard/stats'); 
      
      // ถ้าดึงข้อมูลสำเร็จ ให้อัปเดต State (ถ้า Backend คุณยังไม่เสร็จ โค้ดจะวิ่งไปเข้า catch แทนครับ)
      if (response.data) {
        setStatsData(response.data);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ (รอเชื่อม Backend):", error);
      // ระหว่างที่ Backend ยังไม่เสร็จ ผมขอใส่ข้อมูลจำลอง (Mock) ให้หน้าเว็บไม่ดูโล่งเกินไปครับ
      setStatsData({
        totalSales: 459200,
        totalOrders: 1245,
        totalProducts: 156,
        lowStock: 5
      });
    }
  };

  // 6. [Commit 4] แปลงโฉมตัวแปร stats ให้ดึงค่ามาจาก State (statsData) แทนการพิมพ์ตรงๆ
  const stats = [
    { title: "ยอดขายรวม", value: `฿${statsData.totalSales.toLocaleString()}`, change: "+12.5%", icon: <BarChart3 />, link: null },
    { title: "คำสั่งซื้อ", value: statsData.totalOrders.toLocaleString(), change: "+8.2%", icon: <ShoppingBag />, link: 'orders' },
    { title: "สินค้าในคลัง", value: statsData.totalProducts.toLocaleString(), change: "-2.4%", icon: <Package />, link: 'products' },
    { title: "สินค้าใกล้หมด", value: statsData.lowStock.toString(), change: "Alert", icon: <AlertTriangle />, alert: statsData.lowStock > 0, link: 'stock' },
  ];

  // --- ส่วนของ Mock Data กิจกรรมล่าสุด (รอทำใน Commit หน้า) ---
  const recentActivities = [
    { user: "Admin 01", action: "ปรับสต็อก ROG Phone 7", time: "5 นาทีที่แล้ว" },
    { user: "System", action: "ได้รับคำสั่งซื้อใหม่ #ORD-2566-005", time: "12 นาทีที่แล้ว" },
    { user: "Admin 02", action: "อนุมัติการชำระเงิน #ORD-2566-002", time: "1 ชั่วโมงที่แล้ว" },
    { user: "System", action: "แจ้งเตือน: Razer Kishi V2 ใกล้หมด", time: "2 ชั่วโมงที่แล้ว" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10">
      <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
        DASHBOARD
      </h2>
      
      {/* --- การ์ด 4 ใบ (ตอนนี้เชื่อมกับ State เรียบร้อยแล้ว) --- */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- กราฟยอดขาย --- */}
        <div className="lg:col-span-2 bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#F2F4F6] font-['Kanit'] flex items-center gap-2">
                    <TrendingUp className="text-[#FF0000]" /> ภาพรวมยอดขาย (Revenue)
                </h3>
                <select className="bg-black border border-[#990000]/30 text-[#F2F4F6] text-xs rounded px-2 py-1 outline-none font-['Kanit']">
                    <option>7 วันล่าสุด</option>
                    <option>เดือนนี้</option>
                </select>
            </div>
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
            <div className="flex justify-between mt-2 text-[#F2F4F6]/40 text-xs font-['Orbitron']">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
        </div>

        {/* --- กิจกรรมล่าสุด --- */}
        <div className="lg:col-span-1 bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-bold text-[#F2F4F6] font-['Kanit'] mb-4 flex items-center gap-2">
                <Activity className="text-[#FF0000]" /> กิจกรรมล่าสุด
            </h3>
            <div className="space-y-4">
                {recentActivities.map((act, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-[#990000]/10 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-[#2E0505] flex items-center justify-center text-[#FF0000] border border-[#990000]/50 shrink-0">
                            <UserIcon size={14} />
                        </div>
                        <div>
                            <p className="text-[#F2F4F6] text-sm font-['Kanit']"><span className="text-[#FF0000] font-bold">{act.user}</span> {act.action}</p>
                            <p className="text-[#F2F4F6]/40 text-xs font-['Kanit'] flex items-center gap-1 mt-1"><Clock size={10}/> {act.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs text-[#F2F4F6]/50 hover:text-[#FF0000] border border-dashed border-[#990000]/30 rounded-lg hover:border-[#FF0000] transition font-['Kanit']">
                ดูประวัติทั้งหมด
            </button>
        </div>
      </div>

      {/* --- แบนเนอร์แจ้งเตือนด่วน --- */}
      <div className="bg-gradient-to-r from-[#2E0505] to-transparent border border-[#990000]/50 rounded-2xl p-8 flex justify-between items-center shadow-[0_0_20px_rgba(153,0,0,0.2)]">
        <div>
            <h3 className="text-2xl font-bold text-[#F2F4F6] mb-2 font-['Kanit']">ยินดีต้อนรับกลับ, Admin!</h3>
            <p className="text-[#F2F4F6]/60 font-['Kanit']">วันนี้มีรายการสั่งซื้อใหม่เข้ามา 12 รายการที่รอการตรวจสอบ</p>
        </div>
        <button 
            onClick={() => setActiveTab('orders')}
            className="bg-[#990000] hover:bg-[#FF0000] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#990000]/40 transition hover:scale-105 font-['Kanit']"
        >
            จัดการคำสั่งซื้อทันที
        </button>
      </div>
    </div>
  );
}