import { useEffect, useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

export interface AISummaryData {
  todaySales: number;
  todayOrders: number;
  yesterdaySales: number;
  topProduct: string;
  peakHour: string;
  trend: 'up' | 'down' | 'flat';
  trendPercent: number;
}

interface AISummaryBoxProps {
  data: AISummaryData | null;
}

function generateInsights(data: AISummaryData): string {
  const sales = Number(data.todaySales).toLocaleString('th-TH', { minimumFractionDigits: 2 });
  const lines: string[] = [];

  lines.push(`วันนี้มียอดขาย ฿${sales} จาก ${data.todayOrders} ออเดอร์`);

  if (data.trend === 'up') {
    lines.push(`📈 สูงกว่าเมื่อวาน ${data.trendPercent.toFixed(1)}% — แนวโน้มดีมาก`);
  } else if (data.trend === 'down') {
    lines.push(`📉 ต่ำกว่าเมื่อวาน ${data.trendPercent.toFixed(1)}% — ควรตรวจสอบ stock`);
  } else {
    lines.push(`➡️ ใกล้เคียงกับเมื่อวาน — ยอดขายคงที่`);
  }

  if (data.topProduct && data.topProduct !== 'N/A') {
    lines.push(`🏆 สินค้าขายดีที่สุด: ${data.topProduct}`);
  }

  if (data.trend === 'down') {
    lines.push(`💡 แนะนำ: ลองเพิ่ม promotion เพื่อกระตุ้นยอด`);
  } else if (data.todayOrders === 0) {
    lines.push(`💡 ยังไม่มีออเดอร์วันนี้ — ระบบรอการสั่งซื้อ`);
  } else {
    lines.push(`💡 แนะนำ: เพิ่ม stock สินค้าขายดีเพื่อรองรับดีมานด์`);
  }

  return lines.join('\n');
}

export default function AISummaryBox({ data }: AISummaryBoxProps) {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!data) return;

    // รีเซ็ตทุกครั้งที่ได้รับข้อมูล
    const fullText = generateInsights(data);
    setDisplayText('');
    setIsDone(false);

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayText(fullText.slice(0, i));
      if (i >= fullText.length) {
        setIsDone(true);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [data?.todaySales, data?.todayOrders, data?.trend, data?.topProduct]);

  const TrendIcon = data?.trend === 'up' ? TrendingUp : data?.trend === 'down' ? TrendingDown : Minus;

  return (
    <section className="relative bg-[#000000]/80 border border-[#990000]/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 left-0 w-40 h-40 bg-[#FF0000]/5 blur-[60px] rounded-full pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-32 bg-[#2E0505]/60 blur-[40px] rounded-full pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #FF0000 2px, #FF0000 3px)' }}
      />

      {/* Header */}
      <header className="flex items-center justify-between mb-5 border-b border-[#990000]/20 pb-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]" />
          <h3 className="text-lg font-['Orbitron'] font-bold text-[#F2F4F6] tracking-wider flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#FF0000]" aria-hidden="true" />
            AI ANALYSIS
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#990000]/30 rounded-lg px-3 py-1.5">
          <Zap className="w-3 h-3 text-[#FF0000]" aria-hidden="true" />
          <span className="text-[10px] font-['Orbitron'] text-[#FF0000] tracking-widest">LIVE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
        </div>
      </header>

      {/* Trend badge */}
      {data && (
        <div className={`inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full border text-xs font-['Kanit'] font-bold ${
          data.trend === 'up'   ? 'border-green-500/30 bg-green-500/10 text-green-400' :
          data.trend === 'down' ? 'border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000]' :
                                  'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
        }`}>
          <TrendIcon className="w-3 h-3" aria-hidden="true" />
          {data.trend === 'up'   ? `+${data.trendPercent.toFixed(1)}% จากเมื่อวาน` :
           data.trend === 'down' ? `-${data.trendPercent.toFixed(1)}% จากเมื่อวาน` :
                                   'คงที่จากเมื่อวาน'}
        </div>
      )}

      {/* Content */}
      <div className="min-h-[120px] font-['Kanit']">
        {!data ? (
          <div className="flex items-center gap-3 text-[#F2F4F6]/40">
            <div className="w-4 h-4 border-2 border-[#FF0000]/50 border-t-[#FF0000] rounded-full animate-spin" />
            <span className="text-sm">กำลังวิเคราะห์ข้อมูล...</span>
          </div>
        ) : (
          <p className="text-sm text-[#F2F4F6]/80 leading-7 whitespace-pre-line">
            {displayText}
            {!isDone && (
              <span className="inline-block w-0.5 h-4 bg-[#FF0000] ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        )}
      </div>

      {/* Footer */}
      {isDone && data && (
        <footer className="mt-5 pt-4 border-t border-[#990000]/20 flex items-center justify-between">
          <span className="text-[10px] text-[#F2F4F6]/30 font-['Orbitron'] tracking-widest">NEXUS AI ENGINE v1.0</span>
          <span className="text-[10px] text-[#F2F4F6]/30 font-['Kanit']">อัปเดตทุก 30 วินาที</span>
        </footer>
      )}
    </section>
  );
}
