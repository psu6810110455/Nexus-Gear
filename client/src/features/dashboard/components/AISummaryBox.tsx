import { useEffect, useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
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

// ─── Helper: สร้างประโยค AI จากข้อมูลจริง ────────────────────────────────────
function generateInsights(data: AISummaryData): string[] {
  const lines: string[] = [];
  const sales = Number(data.todaySales).toLocaleString('th-TH', { minimumFractionDigits: 2 });

  // ประโยคที่ 1: สรุปยอดวันนี้
  lines.push(`วันนี้มียอดขาย ฿${sales} จาก ${data.todayOrders} ออเดอร์`);

  // ประโยคที่ 2: เทียบกับเมื่อวาน
  if (data.trend === 'up') {
    lines.push(`📈 สูงกว่าเมื่อวาน ${data.trendPercent.toFixed(1)}% — แนวโน้มดีมาก`);
  } else if (data.trend === 'down') {
    lines.push(`📉 ต่ำกว่าเมื่อวาน ${data.trendPercent.toFixed(1)}% — ควรตรวจสอบ stock`);
  } else {
    lines.push(`➡️ ใกล้เคียงกับเมื่อวาน — ยอดขายคงที่`);
  }

  // ประโยคที่ 3: สินค้าขายดี
  if (data.topProduct) {
    lines.push(`🏆 สินค้าขายดีที่สุด: ${data.topProduct}`);
  }

  // ประโยคที่ 4: คำแนะนำ
  if (data.trend === 'down') {
    lines.push(`💡 แนะนำ: ลองเพิ่ม promotion เพื่อกระตุ้นยอด`);
  } else if (data.todayOrders === 0) {
    lines.push(`💡 ยังไม่มีออเดอร์วันนี้ — ระบบรอการสั่งซื้อ`);
  } else {
    lines.push(`💡 แนะนำ: เพิ่ม stock ${data.topProduct} เพื่อรองรับดีมานด์`);
  }

  return lines;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AISummaryBox({ data }: AISummaryBoxProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [typingLine, setTypingLine] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const insights = data ? generateInsights(data) : [];

  // รีเซ็ตและเริ่ม animation ใหม่เวลาข้อมูลเปลี่ยน
  useEffect(() => {
    if (!data) return;
    setDisplayedLines([]);
    setTypingLine('');
    setLineIndex(0);
    setCharIndex(0);
    setIsTyping(true);
    setIsVisible(true);
  }, [data]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || lineIndex >= insights.length) {
      setIsTyping(false);
      return;
    }

    const currentLine = insights[lineIndex];

    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setTypingLine(prev => prev + currentLine[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 22);
      return () => clearTimeout(timeout);
    } else {
      // บรรทัดนี้พิมพ์เสร็จแล้ว ไปบรรทัดถัดไป
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, currentLine]);
        setTypingLine('');
        setLineIndex(prev => prev + 1);
        setCharIndex(0);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, lineIndex, charIndex, insights]);

  const TrendIcon = data?.trend === 'up' ? TrendingUp : data?.trend === 'down' ? TrendingDown : Minus;

  return (
    <section
      className={`relative bg-[#000000]/80 border border-[#990000]/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* พื้นหลัง glow */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-40 h-40 bg-[#FF0000]/5 blur-[60px] rounded-full pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-32 bg-[#2E0505]/60 blur-[40px] rounded-full pointer-events-none" />

      {/* เส้น scan line เบาๆ */}
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

        {/* Status badge */}
        <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#990000]/30 rounded-lg px-3 py-1.5">
          <Zap className="w-3 h-3 text-[#FF0000]" aria-hidden="true" />
          <span className="text-[10px] font-['Orbitron'] text-[#FF0000] tracking-widest">LIVE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
        </div>
      </header>

      {/* Trend badge */}
      {data && (
        <div className={`inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full border text-xs font-['Kanit'] font-bold ${
          data.trend === 'up' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
          data.trend === 'down' ? 'border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000]' :
          'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
        }`}>
          <TrendIcon className="w-3 h-3" aria-hidden="true" />
          {data.trend === 'up' ? `+${data.trendPercent.toFixed(1)}% จากเมื่อวาน` :
           data.trend === 'down' ? `-${data.trendPercent.toFixed(1)}% จากเมื่อวาน` :
           'คงที่จากเมื่อวาน'}
        </div>
      )}

      {/* Typewriter content */}
      <div className="space-y-2 min-h-[120px] font-['Kanit']">
        {!data ? (
          <div className="flex items-center gap-3 text-[#F2F4F6]/40">
            <div className="w-4 h-4 border-2 border-[#FF0000]/50 border-t-[#FF0000] rounded-full animate-spin" />
            <span className="text-sm">กำลังวิเคราะห์ข้อมูล...</span>
          </div>
        ) : (
          <>
            {/* บรรทัดที่พิมพ์เสร็จแล้ว */}
            {displayedLines.map((line, i) => (
              <p key={i} className="text-sm text-[#F2F4F6]/80 leading-relaxed flex items-start gap-2">
                <span className="text-[#FF0000]/60 font-['Orbitron'] text-[10px] mt-0.5 shrink-0">{`0${i + 1}`}</span>
                <span>{line}</span>
              </p>
            ))}

            {/* บรรทัดที่กำลังพิมพ์ */}
            {typingLine && (
              <p className="text-sm text-[#F2F4F6] leading-relaxed flex items-start gap-2">
                <span className="text-[#FF0000] font-['Orbitron'] text-[10px] mt-0.5 shrink-0">{`0${displayedLines.length + 1}`}</span>
                <span>
                  {typingLine}
                  <span className="inline-block w-0.5 h-3.5 bg-[#FF0000] ml-0.5 animate-pulse align-middle" />
                </span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {data && !isTyping && displayedLines.length === insights.length && (
        <footer className="mt-5 pt-4 border-t border-[#990000]/20 flex items-center justify-between">
          <span className="text-[10px] text-[#F2F4F6]/30 font-['Orbitron'] tracking-widest">NEXUS AI ENGINE v1.0</span>
          <span className="text-[10px] text-[#F2F4F6]/30 font-['Kanit']">อัปเดตทุก 30 วินาที</span>
        </footer>
      )}
    </section>
  );
}