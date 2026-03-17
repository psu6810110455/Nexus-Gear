import { BarChart3 } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

// ✨ 1. สร้าง Interface เพื่อรับข้อมูลยอดขายเป็นรายวัน
export interface DailySales {
  label: string; // ชื่อวัน (เช่น DAY 1 หรือ 01/03)
  amount: number; // ยอดขาย
}

interface SalesChartProps {
  data?: DailySales[]; // รับข้อมูลกราฟมาจากหน้า Dashboard หลัก
}

export default function SalesChart({ data }: SalesChartProps) {
  const { t } = useLanguage();
  // ─── ข้อมูลจำลอง (Fallback) ในกรณีที่ยังไม่มีข้อมูลจริงส่งมา ───
  const defaultData: DailySales[] = [
    { label: 'DAY 1', amount: 40000 },
    { label: 'DAY 2', amount: 70000 },
    { label: 'DAY 3', amount: 45000 },
    { label: 'DAY 4', amount: 90000 },
    { label: 'DAY 5', amount: 65000 },
    { label: 'DAY 6', amount: 100000 },
    { label: 'DAY 7', amount: 85000 },
  ];

  // ถ้ามีข้อมูลส่งมาให้ใช้ข้อมูลจริง ถ้าไม่มีให้ใช้ defaultData
  const chartData = data && data.length > 0 ? data : defaultData;

  // ✨ 2. หาค่ายอดขายที่ "สูงที่สุด" ในรอบ 7 วัน เพื่อเอามาคำนวณเปอร์เซ็นต์ความสูง (100%)
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1); // กันหาร 0

  return (
    <section className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden lg:col-span-2">
      <header className="flex items-center justify-between mb-6 border-b border-[#990000]/20 pb-4">
        <h3 className="text-lg font-['Orbitron'] font-bold flex items-center gap-3 text-[#F2F4F6]">
          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> {t('salesOverview7Days')}
        </h3>
        <button className="text-xs text-[#F2F4F6]/40 hover:text-[#FF0000] font-['Kanit'] transition flex items-center gap-1">
          <BarChart3 aria-hidden="true" className="w-4 h-4" /> {t('viewFullReport')}
        </button>
      </header>
      
      <figure className="h-64 w-full flex items-end justify-between gap-2 pt-4 px-2" aria-label="กราฟแท่งแสดงยอดขาย">
        {chartData.map((item, i) => {
          // ✨ 3. เทียบบัญญัติไตรยางศ์เพื่อหาความสูงของกราฟ (เปอร์เซ็นต์)
          const heightPercent = (item.amount / maxAmount) * 100;

          return (
            <div key={i} className="w-full flex flex-col justify-end items-center group h-full">
              <div 
                className="w-full max-w-[40px] bg-gradient-to-t from-[#2E0505] to-[#990000] rounded-t-sm border-t border-[#FF0000]/50 group-hover:to-[#FF0000] transition-colors relative"
                style={{ height: `${heightPercent}%`, minHeight: '5%' }} // ให้มีความสูงขั้นต่ำนิดนึง
              >
                {/* ✨ 4. Tooltip แสดงยอดเงินจริงตอนเอาเมาส์ชี้ */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#FF0000] text-white text-[10px] font-['Kanit'] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                  ฿{Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </div>
              </div>
              <span className="text-[#F2F4F6]/40 text-[10px] font-['Orbitron'] mt-2 truncate max-w-full px-1">{item.label}</span>
            </div>
          );
        })}
      </figure>
    </section>
  );
}
