import { Clock, ShoppingBag } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    { id: 1, text: 'คำสั่งซื้อใหม่ #ORD-8821', time: '5 นาทีที่แล้ว', status: 'pending' },
    { id: 2, text: 'ชำระเงินสำเร็จ #ORD-8820', time: '15 นาทีที่แล้ว', status: 'success' },
    { id: 3, text: 'คำสั่งซื้อใหม่ #ORD-8819', time: '1 ชั่วโมงที่แล้ว', status: 'pending' },
    { id: 4, text: 'ระบบ: อัปเดตสต็อกสินค้า', time: '2 ชั่วโมงที่แล้ว', status: 'info' },
  ];

  return (
    <section className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <header className="flex items-center justify-between mb-6 border-b border-[#990000]/20 pb-4">
        <h3 className="text-lg font-['Kanit'] font-bold flex items-center gap-3 text-[#F2F4F6]">
          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> กิจกรรมล่าสุด
        </h3>
      </header>
      
      <div className="space-y-6">
        {activities.map((act, i) => (
          <article key={act.id} className="flex gap-4 relative">
            {/* เส้นเชื่อม Timeline */}
            {i !== activities.length - 1 && <div aria-hidden="true" className="absolute left-4 top-8 w-[1px] h-full bg-[#990000]/20"></div>}
            
            <div className="relative z-10 w-8 h-8 rounded-full bg-[#2E0505] border border-[#990000]/40 flex items-center justify-center shrink-0">
              {act.status === 'success' ? (
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
              ) : act.status === 'pending' ? (
                <ShoppingBag aria-hidden="true" className="w-3 h-3 text-[#FF0000]" />
              ) : (
                <Clock aria-hidden="true" className="w-3 h-3 text-[#F2F4F6]/60" />
              )}
            </div>
            
            <div className="flex-1 pt-1">
              <p className="text-sm font-['Kanit'] text-[#F2F4F6]">{act.text}</p>
              <p className="text-[10px] text-[#F2F4F6]/40 font-['Kanit'] mt-1">{act.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}