// src/pages/NexusGearPayment.tsx
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, MapPin, CreditCard, FileText, ShoppingCart } from 'lucide-react';

// ─── 1. INTERFACES (กำหนด Type สำหรับ TSX) ───
interface PaymentProps {
  onNavigate?: (page: string) => void;
}

interface Address {
  id: number;
  label: string;
  name: string;
  detail: string;
  phone: string;
  isDefault: boolean;
}

// ─── 2. MOCK DATA (ข้อมูลจำลอง) ───
const savedAddresses: Address[] = [
  { id: 1, label: 'บ้าน', name: 'แม็กซ์ เกมเมอร์', detail: '123 ถนนเกมมิ่ง แขวงไฮเทค เขตดิจิตอล กรุงเทพฯ 10110', phone: '081-234-5678', isDefault: true },
  { id: 2, label: 'ที่ทำงาน', name: 'แม็กซ์ เกมเมอร์', detail: '456 อาคารออฟฟิศ ถนนสีลม บางรัก กรุงเทพฯ 10500', phone: '081-234-5678', isDefault: false },
];

// ─── 3. COMPONENT: STEP INDICATOR ───
function StepBar({ current }: { current: number }) {
  const steps = [
    { id: 1, label: 'ที่อยู่จัดส่ง', icon: MapPin },
    { id: 2, label: 'วิธีชำระเงิน', icon: CreditCard },
    { id: 3, label: 'ยืนยันการจอง', icon: FileText },
  ];
  return (
    <nav aria-label="Progress" className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-10">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 
                ${done ? 'bg-[#990000] border-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.5)]' : active ? 'bg-[#2E0505] border-[#FF0000] shadow-[0_0_14px_rgba(255,0,0,0.4)] scale-110' : 'bg-[#0a0a0a] border-[#990000]/30'}`}>
                {done ? <Check aria-hidden="true" className="w-5 h-5 text-white" /> : <Icon aria-hidden="true" className={`w-5 h-5 ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]/30'}`} />}
              </div>
              <span className={`text-[10px] font-['Orbitron'] mt-3 tracking-wider absolute translate-y-12 transition-colors duration-300 w-24 text-center ${active ? 'text-[#FF0000] font-bold' : done ? 'text-[#F2F4F6]/60' : 'text-[#F2F4F6]/20'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative min-w-[60px] max-w-[100px]" aria-hidden="true">
                  <div className="absolute inset-0 bg-[#990000]/20 rounded"></div>
                  <div className={`absolute inset-0 bg-[#FF0000] rounded transition-all duration-700 ease-out ${current > step.id ? 'w-full' : 'w-0'}`}></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ─── 4. MAIN COMPONENT ───
export default function NexusGearPayment({ onNavigate }: PaymentProps) {
  // ─── STATE MANAGEMENT ───
  const [step, setStep] = useState<number>(1);
  const [selectedAddr, setSelectedAddr] = useState<number>(1);

  // ─── LOGIC FUNCTIONS ───
  const goNext = () => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setStep((s) => Math.min(3, s + 1)); 
  };
  
  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white pb-20">
      
      {/* Background Effects */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        {/* ── Header ── */}
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div onClick={() => onNavigate?.('home')} className="flex items-center gap-4 group cursor-pointer" role="button" tabIndex={0}>
              <figure className="relative m-0">
                <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 object-contain relative z-10" />
              </figure>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">NEXUS GEAR</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate?.('home')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider">HOME</button>
              <button onClick={() => onNavigate?.('cart')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider flex items-center gap-2"><ShoppingCart aria-hidden="true" className="w-3 h-3" /> CART</button>
              <button className="text-[#FF0000] font-['Orbitron'] text-sm tracking-wider flex items-center gap-2 border-b-2 border-[#FF0000] pb-1" aria-current="page"><CreditCard aria-hidden="true" className="w-4 h-4" /> CHECKOUT</button>
            </nav>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="max-w-5xl mx-auto px-4 py-8">
          
          {/* Title & Back Button */}
          <section aria-labelledby="checkout-heading" className="flex items-center justify-between mb-8">
            <div>
                <button onClick={() => onNavigate?.('cart')} className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-4 group">
                  <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO CART
                </button>
                <h2 id="checkout-heading" className="text-3xl md:text-4xl font-['Orbitron'] font-bold flex items-center gap-4">
                  <div aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
                  CHECKOUT
                </h2>
            </div>
          </section>

          {/* Progress Bar */}
          <StepBar current={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            
            {/* ═══════ LEFT CONTENT ═══════ */}
            <section className="lg:col-span-2 space-y-6">
              
              {/* ─── STEP 1: Address Selection ─── */}
              {step === 1 && (
                <article className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                  <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 blur-[50px] rounded-full pointer-events-none"></div>
                    
                    <header className="flex items-center gap-3 mb-6 border-b border-[#990000]/20 pb-4">
                      <div aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></div> 
                      <h3 className="text-xl font-['Orbitron'] font-bold">SHIPPING ADDRESS</h3>
                    </header>

                    <div className="space-y-4">
                      {savedAddresses.map((addr) => {
                        const active = selectedAddr === addr.id;
                        return (
                          <button 
                            key={addr.id} 
                            onClick={() => setSelectedAddr(addr.id)}
                            className={`w-full text-left bg-[#0a0a0a] border rounded-xl p-5 transition-all group relative overflow-hidden
                              ${active ? 'border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.15)] bg-[#2E0505]/20' : 'border-[#990000]/20 hover:border-[#990000]/50 hover:bg-[#2E0505]/10'}`}
                          >
                            {active && <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000] shadow-[0_0_10px_#FF0000]"></div>}
                            <div className="flex items-start justify-between pl-3">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`font-bold text-lg ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]'}`}>{addr.label}</span>
                                  {addr.isDefault && <span className="bg-[#FF0000]/15 text-[#FF0000] text-[9px] px-2 py-0.5 rounded border border-[#FF0000]/30 font-['Orbitron'] tracking-wider">DEFAULT</span>}
                                </div>
                                <p className="text-sm text-[#F2F4F6]/80 mb-1 font-bold">{addr.name}</p>
                                <p className="text-sm text-[#F2F4F6]/60 leading-relaxed">{addr.detail}</p>
                                <p className="text-xs text-[#F2F4F6]/40 mt-2 flex items-center gap-1"><span className="text-[#990000]">TEL:</span> {addr.phone}</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#FF0000] bg-[#990000]' : 'border-[#990000]/30'}`}>
                                {active && <Check aria-hidden="true" className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    onClick={goNext} 
                    disabled={!selectedAddr} 
                    className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-['Orbitron'] font-bold tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(153,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] flex items-center justify-center gap-3 active:scale-95 group"
                  >
                    CONTINUE TO PAYMENT <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </article>
              )}

            </section>

            {/* ═══════ RIGHT SIDEBAR (โครงสร้างชั่วคราว) ═══════ */}
            <aside className="lg:col-span-1">
               <div className="bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 h-[200px] flex items-center justify-center sticky top-28">
                  <p className="text-[#FF0000] font-['Orbitron'] animate-pulse text-center leading-relaxed">
                    WAITING FOR ORDER SUMMARY...<br/>
                    <span className="text-xs text-[#F2F4F6]/50">(รอประกอบร่างใน Commit ท้ายๆ)</span>
                  </p>
               </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}