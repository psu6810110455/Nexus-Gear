import { BarChart3 } from 'lucide-react';

export default function SalesChart() {
  // ข้อมูลจำลอง (Mock Data) สำหรับกราฟ
  const chartData = [40, 70, 45, 90, 65, 100, 85];

  return (
    <section className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden lg:col-span-2">
      <header className="flex items-center justify-between mb-6 border-b border-[#990000]/20 pb-4">
        <h3 className="text-lg font-['Orbitron'] font-bold flex items-center gap-3 text-[#F2F4F6]">
          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> ภาพรวมยอดขาย (7 วันล่าสุด)
        </h3>
        <button className="text-xs text-[#F2F4F6]/40 hover:text-[#FF0000] font-['Kanit'] transition flex items-center gap-1">
          <BarChart3 aria-hidden="true" className="w-4 h-4" /> ดูรายงานเต็ม
        </button>
      </header>
      
      <figure className="h-64 w-full flex items-end justify-between gap-2 pt-4 px-2" aria-label="กราฟแท่งแสดงยอดขาย">
        {chartData.map((height, i) => (
          <div key={i} className="w-full flex flex-col justify-end items-center group h-full">
            <div 
              className="w-full max-w-[40px] bg-gradient-to-t from-[#2E0505] to-[#990000] rounded-t-sm border-t border-[#FF0000]/50 group-hover:to-[#FF0000] transition-colors relative"
              style={{ height: `${height}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FF0000] text-white text-[10px] font-['Orbitron'] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {height}k
              </div>
            </div>
            <span className="text-[#F2F4F6]/40 text-[10px] font-['Orbitron'] mt-2">DAY {i+1}</span>
          </div>
        ))}
      </figure>
    </section>
  );
}