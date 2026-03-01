// src/pages/NexusGearAdminDashboard.tsx
import { useState, useEffect } from 'react';
import { BarChart3, ShoppingBag, Package, AlertTriangle, ArrowRight, TrendingUp, Activity, User as UserIcon, Clock } from 'lucide-react';

import { fetchStats, fetchChart, fetchActivities } from '../services/dashboard.service';
import type { DashboardStats, ActivityItem } from '../services/dashboard.service';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function NexusGearAdminDashboard({ setActiveTab }: AdminDashboardProps) { 
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statsData, setStatsData] = useState<DashboardStats>({ totalSales: 0, totalOrders: 0, totalProducts: 0, lowStock: 0 });
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const [statsResult, chartResult, activitiesResult] = await Promise.all([
      fetchStats(),
      fetchChart(),
      fetchActivities()
    ]);

    setStatsData(statsResult);
    setChartData(chartResult);
    setActivities(activitiesResult);
    
    setIsLoading(false);
  };

  const stats = [
    { title: "ยอดขายรวม", value: `฿${statsData.totalSales.toLocaleString()}`, change: "+12.5%", icon: <BarChart3 aria-hidden="true" />, link: null },
    { title: "คำสั่งซื้อทั้งหมด", value: statsData.totalOrders.toLocaleString(), change: "+8.2%", icon: <ShoppingBag aria-hidden="true" />, link: 'orders' },
    { title: "สินค้าในคลัง", value: statsData.totalProducts.toLocaleString(), change: "-2.4%", icon: <Package aria-hidden="true" />, link: 'products' },
    { title: "สินค้าใกล้หมดสต็อก", value: statsData.lowStock.toString(), change: "แจ้งเตือน", icon: <AlertTriangle aria-hidden="true" />, alert: statsData.lowStock > 0, link: 'stock' },
  ];

  if (isLoading) {
    return (
        <main className="flex justify-center items-center h-64 text-[#FF0000] font-['Orbitron'] animate-pulse text-2xl tracking-widest">
            กำลังโหลดระบบ NEXUS...
        </main>
    );
  }

  return (
    <main className="space-y-6 animate-in fade-in zoom-in duration-500 pb-10 px-4 sm:px-0 selection:bg-[#990000] selection:text-white">
      
      <header>
        {/* ⭐ แก้ไขกลับเป็น DASHBOARD ตามเดิม */}
        <h2 className="text-2xl sm:text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
          DASHBOARD
        </h2>
      </header>
      
      <section aria-label="สถิติภาพรวม" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <article 
            key={index} 
            onClick={() => stat.link && setActiveTab(stat.link)} 
            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                stat.alert ? 'bg-[#2E0505]/80 border-[#FF0000] shadow-[0_0_15px_#FF0000]' : 'bg-[#000000]/60 border-[#990000]/30 hover:border-[#FF0000]'
            } relative overflow-hidden group cursor-pointer backdrop-blur-md`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[#F2F4F6]/60 text-xs sm:text-sm font-['Kanit'] tracking-wide">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F2F4F6] mt-1 font-['Orbitron']">{stat.value}</h3>
              </div>
              <figure className={`p-2 sm:p-3 rounded-lg m-0 ${stat.alert ? 'bg-[#FF0000] text-white' : 'bg-[#2E0505] text-[#990000] border border-[#990000]/50'}`}>
                {stat.icon}
              </figure>
            </div>
            <footer className="flex justify-between items-end mt-4">
                <span className={`text-[10px] sm:text-xs block font-['Kanit'] ${stat.alert ? 'text-[#FF0000]' : 'text-green-500'}`}>
                    {stat.change} เทียบกับเดือนที่แล้ว
                </span>
                {stat.link && <ArrowRight aria-hidden="true" size={16} className="text-[#F2F4F6]/30 group-hover:text-[#FF0000] transition-colors" />}
            </footer>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <figure className="lg:col-span-2 bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md overflow-hidden m-0">
            <figcaption className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#F2F4F6] font-['Kanit'] flex items-center gap-2 tracking-wide">
                    <TrendingUp aria-hidden="true" className="text-[#FF0000]" /> ภาพรวมยอดขาย
                </h3>
                <select className="bg-black border border-[#990000]/30 text-[#F2F4F6] text-xs rounded px-3 py-2 outline-none font-['Kanit'] w-full sm:w-auto hover:border-[#FF0000] transition-colors cursor-pointer">
                    <option>7 วันล่าสุด</option>
                    <option>เดือนนี้</option>
                    <option>ปีนี้</option>
                </select>
            </figcaption>
            
            <div className="flex items-end justify-between h-40 sm:h-48 gap-1 sm:gap-2 px-1 sm:px-2">
                {chartData.map((h, i) => (
                    <div key={i} className="w-full bg-[#2E0505] rounded-t-lg relative group overflow-hidden">
                        <div 
                            style={{ height: `${h}%` }} 
                            className="absolute bottom-0 w-full bg-gradient-to-t from-[#990000] to-[#FF0000] opacity-80 group-hover:opacity-100 transition-all duration-500 shadow-[0_-5px_15px_rgba(255,0,0,0.3)]"
                        ></div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-between mt-2 text-[#F2F4F6]/40 text-[10px] sm:text-xs font-['Orbitron']">
                <span>จันทร์</span><span>อังคาร</span><span>พุธ</span><span>พฤหัสฯ</span><span>ศุกร์</span><span>เสาร์</span><span>อาทิตย์</span>
            </div>
        </figure>

        <aside className="lg:col-span-1 bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <h3 className="text-lg sm:text-xl font-bold text-[#F2F4F6] font-['Kanit'] mb-4 flex items-center gap-2 tracking-wide">
                <Activity aria-hidden="true" className="text-[#FF0000]" /> กิจกรรมล่าสุด
            </h3>
            
            <ul className="space-y-4">
                {activities.map((act, i) => (
                    <li key={i} className="flex gap-3 pb-3 border-b border-[#990000]/10 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-[#2E0505] flex items-center justify-center text-[#FF0000] border border-[#990000]/50 shrink-0 shadow-[0_0_10px_rgba(153,0,0,0.3)]">
                            <UserIcon aria-hidden="true" size={14} />
                        </div>
                        <div>
                            <p className="text-[#F2F4F6] text-xs sm:text-sm font-['Kanit']">
                                <span className="text-[#FF0000] font-bold">{act.user}</span> {act.action}
                            </p>
                            <p className="text-[#F2F4F6]/40 text-[10px] sm:text-xs font-['Kanit'] flex items-center gap-1 mt-1">
                                <Clock aria-hidden="true" size={10}/> {act.time}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
            
            <button className="w-full mt-4 py-2 text-xs text-[#F2F4F6]/50 hover:text-[#FF0000] border border-dashed border-[#990000]/30 rounded-lg hover:border-[#FF0000] transition font-['Kanit'] tracking-wide">
                ดูประวัติทั้งหมด
            </button>
        </aside>
      </section>

      <section aria-label="แจ้งเตือนด่วน" className="bg-gradient-to-r from-[#2E0505] to-transparent border border-[#990000]/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 shadow-[0_0_20px_rgba(153,0,0,0.2)] text-center md:text-left relative overflow-hidden">
        <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-[#FF0000]/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
            {/* ⭐ แก้ไขกลับเป็น Admin! ตามเดิม */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#F2F4F6] mb-2 font-['Kanit'] tracking-wide">ยินดีต้อนรับกลับ, Admin!</h3>
            <p className="text-[#F2F4F6]/60 font-['Kanit'] text-sm sm:text-base">วันนี้มีรายการสั่งซื้อใหม่เข้ามา 12 รายการที่รอการตรวจสอบและจัดส่ง</p>
        </div>
        <button 
            onClick={() => setActiveTab('orders')}
            className="relative z-10 w-full md:w-auto bg-[#990000] hover:bg-[#FF0000] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#990000]/40 transition hover:scale-105 font-['Kanit'] tracking-wide"
        >
            จัดการคำสั่งซื้อทันที
        </button>
      </section>
    </main>
  );
}