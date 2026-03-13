import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, DollarSign, Users, Activity, ArrowLeft } from 'lucide-react';

// นำเข้า Components
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import RecentActivity from '../components/RecentActivity';
import AISummaryBox from '../components/AISummaryBox';
import type { AISummaryData } from '../components/AISummaryBox';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardProps) {
  // ─── 1. STATE ───
  const [dashboardData, setDashboardData] = useState<{
    totalSales: number;
    totalOrders: number;
    recentOrders: never[];
    salesChart: never[];
    aiSummary: AISummaryData | null;
  }>({
    totalSales: 0,
    totalOrders: 0,
    recentOrders: [],
    salesChart: [],
    aiSummary: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // ─── 2. Fetch ข้อมูล (รวม polling ทุก 30 วินาที) ───
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard/summary');
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("❌ ดึงข้อมูล Dashboard ไม่สำเร็จ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Polling ทุก 30 วินาที ให้ AI Summary อัปเดตอัตโนมัติ
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white pb-20">
      
      {/* เอฟเฟกต์พื้นหลัง */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-[#990000]/30 pb-6">
          <div>
            <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-4 group">
              <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> กลับไปหน้าร้านค้า
            </button>
            <h1 className="text-3xl md:text-4xl font-['Orbitron'] font-bold flex items-center gap-4">
              <div aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
              ADMIN DASHBOARD
            </h1>
          </div>
          <div className="text-sm text-[#F2F4F6]/50 bg-[#0a0a0a] px-4 py-2 rounded-lg border border-[#990000]/20">
            สถานะระบบ: {isLoading ? (
              <span className="text-yellow-500 font-bold ml-1">กำลังโหลด...</span>
            ) : (
              <span className="text-green-500 font-bold ml-1 flex items-center gap-2 inline-flex">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> ออนไลน์
              </span>
            )}
          </div>
        </header>

        <main className="space-y-8">
          
          {/* แถวที่ 1: Stat Cards */}
          <section aria-label="สถิติภาพรวม" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="ยอดขายรวมทั้งหมด" 
              value={`฿${Number(dashboardData.totalSales).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
              trend={0} 
              icon={DollarSign} 
            />
            <StatCard 
              title="คำสั่งซื้อทั้งหมด" 
              value={dashboardData.totalOrders.toLocaleString()} 
              trend={0} 
              icon={Package} 
            />
            <StatCard title="ลูกค้าสมัครใหม่" value="1,204" trend={-2.4} icon={Users} />
            <StatCard title="อัตราการเข้าชม" value="45.2K" trend={15.0} icon={Activity} />
          </section>

          {/* แถวที่ 2: กราฟ + Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SalesChart data={dashboardData.salesChart} />
            <RecentActivity orders={dashboardData.recentOrders} />
          </div>

          {/* ✨ แถวที่ 3: AI Summary Box */}
          <AISummaryBox data={dashboardData.aiSummary} />

        </main>
      </div>
    </div>
  );
}
