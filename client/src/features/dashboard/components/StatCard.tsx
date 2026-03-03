import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
}

export default function StatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  const isUp = trend && trend > 0;
  
  return (
    <article className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#FF0000]/60 transition-colors">
      <div aria-hidden="true" className="absolute top-0 right-0 w-24 h-24 bg-[#FF0000]/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-[#FF0000]/10 transition-colors"></div>
      
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-[#F2F4F6]/60 font-['Kanit'] text-sm tracking-wide">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-[#2E0505] border border-[#990000]/30 flex items-center justify-center text-[#FF0000]">
          <Icon aria-hidden="true" className="w-5 h-5" />
        </div>
      </header>
      
      <div>
        <p className="text-3xl font-black font-['Orbitron'] text-[#F2F4F6] drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]">{value}</p>
      </div>
      
      {trend !== undefined && (
        <footer className="mt-4 flex items-center gap-2 text-xs font-['Kanit']">
          <span className={`flex items-center gap-1 font-bold ${isUp ? 'text-green-500' : 'text-[#FF0000]'}`}>
            {isUp ? <TrendingUp aria-hidden="true" className="w-3 h-3" /> : <TrendingDown aria-hidden="true" className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-[#F2F4F6]/40">เทียบกับเดือนที่แล้ว</span>
        </footer>
      )}
    </article>
  );
}