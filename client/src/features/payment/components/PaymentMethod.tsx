import { Check } from 'lucide-react';

interface PaymentMethodProps {
  payMethod: string | null;
  onSelectMethod: (method: string) => void;
  grandTotal: number;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

export default function PaymentMethod({ payMethod, onSelectMethod, grandTotal }: PaymentMethodProps) {
  const methods = [
    { id: 'qr', title: 'สแกนคิวอาร์โค้ด', sub: 'รองรับทุกแอปธนาคาร', emoji: '📱' },
    { id: 'transfer', title: 'โอนเงินผ่านธนาคาร', sub: 'แนบสลิปเพื่อยืนยัน', emoji: '🏦' }
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m) => {
          const active = payMethod === m.id;
          return (
            <article 
              key={m.id} 
              onClick={() => onSelectMethod(m.id)} 
              className={`relative text-left bg-[#0a0a0a] border rounded-2xl p-5 transition-all overflow-hidden group cursor-pointer ${active ? 'border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.2)] bg-[#2E0505]/20' : 'border-[#990000]/20 hover:border-[#990000]/50 hover:bg-[#2E0505]/10'}`}
            >
              {active && <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000] shadow-[0_0_10px_#FF0000]"></div>}
              <div className="flex items-start gap-4 pl-2">
                <span className="text-3xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                <div className="flex-1">
                  <p className={`font-bold font-['Kanit'] tracking-wide ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]'}`}>{m.title}</p>
                  <p className="text-xs text-[#F2F4F6]/40 mt-1 font-light">{m.sub}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#FF0000] bg-[#990000]' : 'border-[#990000]/30'}`}>
                  {active && <Check aria-hidden="true" className="w-3 h-3 text-white" />}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* กล่องแสดงรายละเอียดตามวิธีที่เลือก */}
      {payMethod === 'qr' && (
        <article className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-8 flex flex-col items-center animate-in zoom-in-95">
          <figure className="w-56 h-56 bg-white rounded-xl flex items-center justify-center border-4 border-[#990000]/30 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] m-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FF0000] shadow-[0_0_10px_#FF0000] animate-[scan_2s_ease-in-out_infinite]"></div>
            <div className="text-center">
              <p className="text-[#000000] font-['Orbitron'] text-sm font-bold mb-2">SCAN TO PAY</p>
              {/* จุดจำลอง QR Code */}
              <div className="grid grid-cols-8 gap-1 mt-2 mx-auto opacity-80" style={{ width: 100 }}>
                {Array.from({ length: 64 }, (_, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-[1px] ${Math.random() > 0.4 ? 'bg-[#000000]' : 'bg-transparent'}`} />))}
              </div>
            </div>
          </figure>
          <p className="text-[#F2F4F6]/50 text-sm mt-6 font-light">เปิดแอปพลิเคชันธนาคารเพื่อสแกน QR Code</p>
          <p className="text-[#FF0000] font-['Orbitron'] font-bold text-2xl mt-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">฿{fmt(grandTotal)}</p>
        </article>
      )}

      {payMethod === 'transfer' && (
        <article className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-6 space-y-4 animate-in slide-in-from-top-2">
          <header>
            <p className="text-sm text-[#F2F4F6]/60 font-['Kanit'] tracking-wide">บัญชีธนาคารสำหรับโอนเงิน</p>
          </header>
          {[{ bank: 'KBANK (กสิกรไทย)', acct: '123-4-56789-0', name: 'Nexus Gear Co., Ltd.', color: 'text-green-500' }, 
            { bank: 'SCB (ไทยพาณิชย์)', acct: '987-6-54321-0', name: 'Nexus Gear Co., Ltd.', color: 'text-purple-500' }].map((b, i) => (
            <div key={i} className="border border-[#990000]/15 rounded-lg p-4 flex items-center justify-between hover:bg-[#2E0505]/20 transition">
              <div>
                <p className={`text-xs font-['Kanit'] font-bold ${b.color} mb-1`}>{b.bank}</p>
                <p className="text-[#F2F4F6] font-bold tracking-widest text-lg font-['Orbitron']">{b.acct}</p>
                <p className="text-[#F2F4F6]/40 text-xs">{b.name}</p>
              </div>
              <button className="text-[#F2F4F6]/40 hover:text-[#FF0000] text-xs border border-[#F2F4F6]/20 hover:border-[#FF0000] px-3 py-1 rounded transition">คัดลอก</button>
            </div>
          ))}
          <footer className="bg-[#2E0505] rounded-lg p-4 text-center mt-4 border border-[#FF0000]/20">
            <p className="text-[#F2F4F6]/60 text-xs mb-1">ยอดชำระทั้งหมด</p>
            <p className="text-[#FF0000] font-bold text-2xl font-['Orbitron']">฿{fmt(grandTotal)}</p>
          </footer>
        </article>
      )}
    </section>
  );
}