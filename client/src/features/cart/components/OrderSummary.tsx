import { ArrowLeft, Tag, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { CouponData } from '../types/cart.types'; // ดึง Type มาใช้ถ้ามี

interface OrderSummaryProps {
  selectedCount: number;
  subtotal: number;
  totalSaved: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  appliedCoupon: (CouponData & { code: string }) | null;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  removeCoupon: () => void;
  couponError: string;
  couponSuccess: string;
  showCouponInput: boolean;
  setShowCouponInput: (show: boolean) => void;
  onCheckout: () => void;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

export default function OrderSummary({
  selectedCount, subtotal, totalSaved, discountAmount, shippingFee, grandTotal,
  appliedCoupon, couponCode, setCouponCode, applyCoupon, removeCoupon,
  couponError, couponSuccess, showCouponInput, setShowCouponInput, onCheckout
}: OrderSummaryProps) {
  
  return (
    <aside className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-28 space-y-6 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 blur-[40px] rounded-full pointer-events-none"></div>
      
      <header className="border-b border-[#990000]/20 pb-4">
        <h3 className="text-xl font-['Orbitron'] font-bold flex items-center gap-3">
          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> สรุปยอดคำสั่งซื้อ
        </h3>
      </header>

      {/* ส่วนจัดการคูปอง */}
      <section className="space-y-2 border-b border-[#990000]/20 pb-4">
        <button 
          onClick={() => setShowCouponInput(!showCouponInput)} 
          className="w-full flex items-center justify-between text-[#F2F4F6]/70 hover:text-[#FF0000] transition group"
          aria-expanded={showCouponInput}
        >
          <span className="flex items-center gap-2 font-['Orbitron'] text-xs tracking-wider group-hover:translate-x-1 transition-transform">
            <Tag aria-hidden="true" className="w-4 h-4" /> โค้ดส่วนลด
          </span>
          {showCouponInput ? <ChevronUp aria-hidden="true" className="w-4 h-4" /> : <ChevronDown aria-hidden="true" className="w-4 h-4" />}
        </button>
        
        {showCouponInput && (
          <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
            {appliedCoupon ? (
              <div className="bg-[#2E0505]/50 border border-[#FF0000]/30 rounded-lg p-3 flex items-center justify-between relative overflow-hidden">
                <div aria-hidden="true" className="absolute left-0 top-0 w-1 h-full bg-[#FF0000]"></div>
                <div>
                  <p className="text-[#FF0000] font-['Orbitron'] text-xs font-bold tracking-wider">{appliedCoupon.code}</p>
                  <p className="text-[#F2F4F6]/50 text-[10px]">{appliedCoupon.label}</p>
                </div>
                <button onClick={removeCoupon} className="text-[#F2F4F6]/40 hover:text-[#FF0000] transition p-1 hover:bg-[#000000]/20 rounded-full" aria-label="ลบคูปองส่วนลด">
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="กรอกโค้ดส่วนลด..." 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} 
                    className="flex-1 bg-[#000000] border border-[#990000]/30 rounded-lg px-3 py-2 text-sm text-[#F2F4F6] placeholder-[#F2F4F6]/20 focus:outline-none focus:border-[#FF0000] transition font-['Orbitron'] uppercase tracking-wider" 
                    aria-label="ช่องกรอกรหัสส่วนลด"
                  />
                  <button onClick={applyCoupon} className="bg-[#2E0505] border border-[#990000] text-[#FF0000] hover:bg-[#990000] hover:text-white px-4 rounded-lg text-xs font-['Orbitron'] font-bold transition">ตกลง</button>
                </div>
                {couponError && <p className="text-red-500 text-[10px] pl-1 animate-pulse" role="alert">⚠ {couponError}</p>}
                {couponSuccess && <p className="text-green-500 text-[10px] pl-1" role="status">✓ {couponSuccess}</p>}
              </div>
            )}
          </div>
        )}
      </section>

      {/* บิลราคา */}
      <section className="space-y-3 pt-2">
        <div className="flex justify-between text-sm font-['Kanit']">
          <span className="text-[#F2F4F6]/50">ราคาสินค้า ({selectedCount} ชิ้น)</span>
          <span className="text-[#F2F4F6] font-['Orbitron']">฿{fmt(subtotal)}</span>
        </div>
        {totalSaved > 0 && selectedCount > 0 && (
          <div className="flex justify-between text-sm font-['Kanit']">
            <span className="text-green-500/80">ส่วนลดโปรโมชั่น</span>
            <span className="text-green-500 font-['Orbitron']">-฿{fmt(totalSaved)}</span>
          </div>
        )}
        {appliedCoupon && subtotal > 0 && (
          <div className="flex justify-between text-sm font-['Kanit']">
            <span className="text-[#FF0000]">คูปอง ({appliedCoupon.code})</span>
            <span className="text-[#FF0000] font-['Orbitron']">-฿{fmt(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-['Kanit']">
          <span className="text-[#F2F4F6]/50">ค่าจัดส่ง</span>
          <span className={shippingFee === 0 ? 'text-green-500 font-bold' : 'text-[#F2F4F6] font-["Orbitron"]'}>
            {shippingFee === 0 ? (subtotal > 0 ? 'ส่งฟรี' : '฿0') : `฿${fmt(shippingFee)}`}
          </span>
        </div>
      </section>

      <div aria-hidden="true" className="border-t border-[#990000]/30 border-dashed"></div>
      
      <div className="flex justify-between items-end">
        <span className="font-['Orbitron'] text-sm text-[#F2F4F6]/60 tracking-wider">ยอดรวมสุทธิ</span>
        <span className="font-['Orbitron'] text-3xl font-black text-[#FF0000] drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">฿{fmt(grandTotal)}</span>
      </div>

      <button 
        disabled={selectedCount === 0} 
        onClick={onCheckout} 
        className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:from-[#333] disabled:to-[#444] disabled:text-gray-500 text-white py-4 rounded-xl font-['Orbitron'] font-bold tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(153,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] active:scale-95 group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          ชำระเงิน ({selectedCount}) <ArrowLeft aria-hidden="true" className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
        </span>
        {selectedCount > 0 && <div aria-hidden="true" className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[30deg] group-hover:animate-[shimmer_1s_infinite]"></div>}
      </button>

      <footer className="grid grid-cols-3 gap-2 pt-2 border-t border-[#990000]/10">
        {['ชำระเงินปลอดภัย', 'จัดส่งไว', 'รับประกันศูนย์'].map((b) => (
          <div key={b} className="text-[#F2F4F6]/20 text-[9px] text-center font-['Kanit'] flex flex-col items-center gap-1">
            <div aria-hidden="true" className="w-1 h-1 bg-[#990000] rounded-full"></div>{b}
          </div>
        ))}
      </footer>
    </aside>
  );
}
