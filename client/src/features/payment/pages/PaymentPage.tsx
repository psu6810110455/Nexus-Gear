// src/pages/NexusGearPayment.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, MapPin, CreditCard, FileText, ShoppingCart, Upload, Loader, ChevronDown, ChevronUp } from 'lucide-react';

import { fetchAddresses, fetchOrderSummary } from '../services/payment.service';
import type { Address, OrderSummaryData } from '../types/payment.types';

interface PaymentProps {
  onNavigate?: (page: string) => void;
}

interface UploadedSlip {
  name: string;
  preview: string | ArrayBuffer | null;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

function StepBar({ current }: { current: number }) {
  const steps = [
    { id: 1, label: 'ที่อยู่จัดส่ง', icon: MapPin },
    { id: 2, label: 'วิธีชำระเงิน', icon: CreditCard },
    { id: 3, label: 'ยืนยันคำสั่งซื้อ', icon: FileText },
  ];
  return (
    <nav aria-label="สถานะการสั่งซื้อ" className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-10">
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
              <span className={`text-[10px] font-['Kanit'] mt-3 tracking-wider absolute translate-y-12 transition-colors duration-300 w-24 text-center ${active ? 'text-[#FF0000] font-bold' : done ? 'text-[#F2F4F6]/60' : 'text-[#F2F4F6]/20'}`}>
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

export default function NexusGearPayment({ onNavigate }: PaymentProps) {
  const [isApiLoading, setIsApiLoading] = useState<boolean>(true);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummaryData | null>(null);

  const [step, setStep] = useState<number>(1);
  const [selectedAddr, setSelectedAddr] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState<string | null>(null);
  const [uploadedSlip, setUploadedSlip] = useState<UploadedSlip | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setIsApiLoading(true);
      const [addrs, summary] = await Promise.all([
        fetchAddresses(),
        fetchOrderSummary()
      ]);
      setSavedAddresses(addrs);
      setOrderSummary(summary);
      
      const defaultAddr = addrs.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddr(defaultAddr.id);
      
      setIsApiLoading(false);
    };
    loadData();
  }, []);

  const goNext = () => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setStep((s) => Math.min(3, s + 1)); 
  };
  
  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedSlip({ name: file.name, preview: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    setLoadingAction(true);
    setTimeout(() => { 
      setLoadingAction(false); 
      setConfirmed(true); 
      window.scrollTo(0,0); 
    }, 2000);
  };

  if (isApiLoading || !orderSummary) {
    return (
      <main className="min-h-screen bg-[#000000] flex justify-center items-center">
        <p className="text-[#FF0000] font-['Orbitron'] animate-pulse text-2xl tracking-widest">กำลังโหลดระบบชำระเงิน...</p>
      </main>
    );
  }

  const grandTotal = orderSummary.subtotal - orderSummary.discount + orderSummary.shipping;

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white pb-20">
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(46, 5, 5, 0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #990000; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF0000; }
      `}</style>

      {/* เอฟเฟกต์พื้นหลัง */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        
        {/* แถบนำทางด้านบน */}
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div onClick={() => onNavigate?.('home')} className="flex items-center gap-4 group cursor-pointer" role="button" tabIndex={0} aria-label="กลับไปหน้าหลัก">
              <figure className="relative m-0">
                <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="โลโก้ Nexus Gear" className="w-10 h-10 object-contain relative z-10" />
              </figure>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">NEXUS GEAR</h1>
            </div>
            <nav aria-label="เมนูหลัก" className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate?.('home')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Kanit'] text-sm tracking-wide">หน้าหลัก</button>
              <button onClick={() => onNavigate?.('cart')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Kanit'] text-sm tracking-wide flex items-center gap-2"><ShoppingCart aria-hidden="true" className="w-3 h-3" /> ตะกร้าสินค้า</button>
              <button className="text-[#FF0000] font-['Kanit'] text-sm tracking-wide flex items-center gap-2 border-b-2 border-[#FF0000] pb-1" aria-current="page"><CreditCard aria-hidden="true" className="w-4 h-4" /> ชำระเงิน</button>
            </nav>
          </div>
        </header>

        {/* หน้าจอแสดงผลสำเร็จ */}
        {confirmed ? (
          <main className="min-h-[80vh] flex items-center justify-center animate-in zoom-in-95 duration-500">
            <article className="max-w-2xl w-full mx-4 px-4 py-16 flex flex-col items-center text-center bg-[#000000]/40 backdrop-blur-xl border border-[#990000]/30 rounded-3xl relative overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FF0000]/10 via-transparent to-transparent opacity-50"></div>
                <figure className="relative w-32 h-32 mb-8 m-0">
                  <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-2xl rounded-full animate-pulse"></div>
                  <div className="relative z-10 w-32 h-32 rounded-full bg-[#0a0a0a] border-2 border-[#FF0000] flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)]">
                      <Check aria-hidden="true" className="w-16 h-16 text-[#FF0000] drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                  </div>
                </figure>
                <header>
                    <h2 className="text-4xl font-['Orbitron'] font-black text-[#FF0000] mb-3 tracking-wide drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">สั่งซื้อสำเร็จ!</h2>
                    <p className="text-[#F2F4F6]/50 mb-2 font-['Kanit']">หมายเลขคำสั่งซื้อ (ORDER ID)</p>
                </header>
                <div className="bg-[#2E0505]/50 px-6 py-2 rounded-lg border border-[#FF0000]/20 mb-8">
                    <p className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6] tracking-widest">#ORD-20260203-4821</p>
                </div>
                <p className="text-[#F2F4F6]/60 text-sm max-w-sm leading-relaxed mb-8">
                    ระบบได้รับคำสั่งซื้อของคุณแล้ว<br/>เราจะส่งรายละเอียดการจัดส่งไปยังอีเมล<br/><span className="text-[#FF0000]">max.gamer@email.com</span>
                </p>
                <footer className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button className="bg-[#990000] hover:bg-[#FF0000] text-white px-8 py-3 rounded-xl font-['Kanit'] font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(153,0,0,0.4)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)]">ดูรายละเอียดคำสั่งซื้อ</button>
                    <button onClick={() => onNavigate?.('home')} className="bg-transparent border border-[#990000]/50 text-[#F2F4F6]/60 hover:text-[#FF0000] hover:border-[#FF0000] px-8 py-3 rounded-xl font-['Kanit'] font-bold tracking-wide transition-all">กลับสู่หน้าหลัก</button>
                </footer>
            </article>
          </main>
        ) : (
          <main className="max-w-5xl mx-auto px-4 py-8">
            
            {/* ส่วนหัวของหน้า Checkout */}
            <section aria-labelledby="checkout-heading" className="flex items-center justify-between mb-8">
              <header>
                  <button onClick={() => onNavigate?.('cart')} className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-4 group" aria-label="กลับไปหน้าตะกร้าสินค้า">
                    <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> กลับไปตะกร้าสินค้า
                  </button>
                  <h2 id="checkout-heading" className="text-3xl md:text-4xl font-['Orbitron'] font-bold flex items-center gap-4">
                    <div aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
                    CHECKOUT
                  </h2>
              </header>
            </section>

            <StepBar current={step} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              
              {/* พื้นที่หลักฝั่งซ้าย */}
              <section className="lg:col-span-2 space-y-6">
                
                {/* ─── STEP 1: Address ─── */}
                {step === 1 && (
                  <article className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                      <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 blur-[50px] rounded-full pointer-events-none"></div>
                      <header className="flex items-center gap-3 mb-6 border-b border-[#990000]/20 pb-4">
                        <div aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></div> 
                        <h3 className="text-xl font-['Kanit'] font-bold">เลือกที่อยู่จัดส่ง</h3>
                      </header>

                      <div className="space-y-4">
                        {savedAddresses.map((addr) => {
                          const active = selectedAddr === addr.id;
                          return (
                            <button key={addr.id} onClick={() => setSelectedAddr(addr.id)} className={`w-full text-left bg-[#0a0a0a] border rounded-xl p-5 transition-all group relative overflow-hidden ${active ? 'border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.15)] bg-[#2E0505]/20' : 'border-[#990000]/20 hover:border-[#990000]/50 hover:bg-[#2E0505]/10'}`}>
                              {active && <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000] shadow-[0_0_10px_#FF0000]"></div>}
                              <div className="flex items-start justify-between pl-3">
                                <div>
                                  <div className="flex items-center gap-3 mb-2"><span className={`font-bold text-lg ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]'}`}>{addr.label}</span>{addr.isDefault && <span className="bg-[#FF0000]/15 text-[#FF0000] text-[9px] px-2 py-0.5 rounded border border-[#FF0000]/30 font-['Kanit'] tracking-wider">ค่าเริ่มต้น</span>}</div>
                                  <p className="text-sm text-[#F2F4F6]/80 mb-1 font-bold">{addr.name}</p>
                                  <p className="text-sm text-[#F2F4F6]/60 leading-relaxed">{addr.detail}</p>
                                  <p className="text-xs text-[#F2F4F6]/40 mt-2 flex items-center gap-1"><span className="text-[#990000]">เบอร์โทร:</span> {addr.phone}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#FF0000] bg-[#990000]' : 'border-[#990000]/30'}`}>{active && <Check aria-hidden="true" className="w-3 h-3 text-white" />}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button onClick={goNext} disabled={!selectedAddr} className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-['Kanit'] font-bold tracking-wide text-sm transition-all shadow-[0_0_20px_rgba(153,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] flex items-center justify-center gap-3 active:scale-95 group">
                      ดำเนินการชำระเงิน <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </article>
                )}

                {/* ─── STEP 2: Payment Method ─── */}
                {step === 2 && (
                  <article className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                      <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 blur-[50px] rounded-full pointer-events-none"></div>
                      <header className="flex items-center gap-3 mb-6 border-b border-[#990000]/20 pb-4">
                        <div aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></div>
                        <h3 className="text-xl font-['Kanit'] font-bold">เลือกวิธีชำระเงิน</h3>
                      </header>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[{ id: 'qr', title: 'สแกนคิวอาร์โค้ด', sub: 'รองรับทุกแอปธนาคาร', emoji: '📱' }, { id: 'transfer', title: 'โอนเงินผ่านธนาคาร', sub: 'แนบสลิปเพื่อยืนยัน', emoji: '🏦' }].map((m) => {
                          const active = payMethod === m.id;
                          return (
                            <button key={m.id} onClick={() => setPayMethod(m.id)} className={`relative text-left bg-[#0a0a0a] border rounded-2xl p-5 transition-all overflow-hidden group ${active ? 'border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.2)] bg-[#2E0505]/20' : 'border-[#990000]/20 hover:border-[#990000]/50 hover:bg-[#2E0505]/10'}`}>
                              {active && <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000] shadow-[0_0_10px_#FF0000]"></div>}
                              <div className="flex items-start gap-4 pl-2">
                                <span className="text-3xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                                <div className="flex-1"><p className={`font-bold font-['Kanit'] tracking-wide ${active ? 'text-[#FF0000]' : 'text-[#F2F4F6]'}`}>{m.title}</p><p className="text-xs text-[#F2F4F6]/40 mt-1 font-light">{m.sub}</p></div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#FF0000] bg-[#990000]' : 'border-[#990000]/30'}`}>{active && <Check aria-hidden="true" className="w-3 h-3 text-white" />}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {payMethod === 'qr' && (
                        <div className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-8 flex flex-col items-center animate-in zoom-in-95">
                          <figure className="w-56 h-56 bg-white rounded-xl flex items-center justify-center border-4 border-[#990000]/30 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] m-0">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#FF0000] shadow-[0_0_10px_#FF0000] animate-[scan_2s_ease-in-out_infinite]"></div>
                            <div className="text-center"><p className="text-[#000000] font-['Orbitron'] text-sm font-bold mb-2">SCAN TO PAY</p><div className="grid grid-cols-8 gap-1 mt-2 mx-auto opacity-80" style={{ width: 100 }}>{Array.from({ length: 64 }, (_, i) => (<div key={i} className={`w-2.5 h-2.5 rounded-[1px] ${Math.random() > 0.4 ? 'bg-[#000000]' : 'bg-transparent'}`} />))}</div></div>
                          </figure>
                          <p className="text-[#F2F4F6]/50 text-sm mt-6 font-light">เปิดแอปพลิเคชันธนาคารเพื่อสแกน QR Code</p>
                          <p className="text-[#FF0000] font-['Orbitron'] font-bold text-2xl mt-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">฿{fmt(grandTotal)}</p>
                        </div>
                      )}

                      {payMethod === 'transfer' && (
                        <div className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-6 space-y-4 animate-in slide-in-from-top-2">
                          <p className="text-sm text-[#F2F4F6]/60 font-['Kanit'] tracking-wide">บัญชีธนาคารสำหรับโอนเงิน</p>
                          {[{ bank: 'KBANK (กสิกรไทย)', acct: '123-4-56789-0', name: 'Nexus Gear Co., Ltd.', color: 'text-green-500' }, { bank: 'SCB (ไทยพาณิชย์)', acct: '987-6-54321-0', name: 'Nexus Gear Co., Ltd.', color: 'text-purple-500' }].map((b, i) => (
                            <div key={i} className="border border-[#990000]/15 rounded-lg p-4 flex items-center justify-between hover:bg-[#2E0505]/20 transition">
                              <div><p className={`text-xs font-['Kanit'] font-bold ${b.color} mb-1`}>{b.bank}</p><p className="text-[#F2F4F6] font-bold tracking-widest text-lg font-['Orbitron']">{b.acct}</p><p className="text-[#F2F4F6]/40 text-xs">{b.name}</p></div>
                              <button className="text-[#F2F4F6]/40 hover:text-[#FF0000] text-xs border border-[#F2F4F6]/20 hover:border-[#FF0000] px-3 py-1 rounded transition">คัดลอก</button>
                            </div>
                          ))}
                          <div className="bg-[#2E0505] rounded-lg p-4 text-center mt-4 border border-[#FF0000]/20"><p className="text-[#F2F4F6]/60 text-xs mb-1">ยอดชำระทั้งหมด</p><p className="text-[#FF0000] font-bold text-2xl font-['Orbitron']">฿{fmt(grandTotal)}</p></div>
                        </div>
                      )}
                    </div>

                    <footer className="flex gap-4 pt-4">
                      <button onClick={goBack} className="flex-1 border border-[#990000]/50 text-[#F2F4F6]/60 hover:text-[#FF0000] hover:border-[#FF0000] py-4 rounded-xl font-['Kanit'] text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 group"><ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับ</button>
                      <button onClick={goNext} disabled={!payMethod} className="flex-[2] bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-xl font-['Kanit'] font-bold tracking-wide text-sm transition-all shadow-[0_0_18px_rgba(153,0,0,0.5)] flex items-center justify-center gap-3 active:scale-95 group">ขั้นตอนต่อไป <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
                    </footer>
                  </article>
                )}

                {/* ─── STEP 3: Confirm ─── */}
                {step === 3 && (
                  <article className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                      <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 blur-[50px] rounded-full pointer-events-none"></div>
                      <header>
                        <h3 className="text-xl font-['Kanit'] font-bold flex items-center gap-3 mb-2"><span className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> ยืนยันคำสั่งซื้อ</h3>
                        <p className="text-[#F2F4F6]/40 text-sm mb-8 pl-5 font-light">โปรดตรวจสอบรายละเอียดให้ถูกต้องก่อนกดยืนยัน</p>
                      </header>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000]/50 transition duration-300">
                            <div className="flex items-center justify-between mb-3 border-b border-[#990000]/20 pb-2">
                                <span className="text-xs font-['Kanit'] text-[#990000] tracking-wide flex items-center gap-2"><MapPin aria-hidden="true" className="w-3 h-3" /> จัดส่งไปที่</span>
                                <button onClick={() => setStep(1)} className="text-[#F2F4F6]/40 text-[10px] font-['Kanit'] hover:text-[#FF0000] transition">แก้ไข</button>
                            </div>
                            <p className="text-sm text-[#F2F4F6] font-bold mb-1">{savedAddresses.find(a => a.id === selectedAddr)?.name}</p>
                            <p className="text-xs text-[#F2F4F6]/60 leading-relaxed">{savedAddresses.find(a => a.id === selectedAddr)?.detail}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000]/50 transition duration-300">
                            <div className="flex items-center justify-between mb-3 border-b border-[#990000]/20 pb-2">
                                <span className="text-xs font-['Kanit'] text-[#990000] tracking-wide flex items-center gap-2"><CreditCard aria-hidden="true" className="w-3 h-3" /> วิธีชำระเงิน</span>
                                <button onClick={() => setStep(2)} className="text-[#F2F4F6]/40 text-[10px] font-['Kanit'] hover:text-[#FF0000] transition">แก้ไข</button>
                            </div>
                            <p className="text-lg text-[#F2F4F6] font-bold flex items-center gap-2">{payMethod === 'qr' ? '📱 สแกน QR Code' : '🏦 โอนเงินผ่านธนาคาร'}</p>
                            <p className="text-xs text-[#F2F4F6]/40 mt-1">ยอดรวม: ฿{fmt(grandTotal)}</p>
                        </div>
                      </div>

                      {payMethod === 'transfer' && (
                        <div className="bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-6 relative overflow-hidden">
                          <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000]"></div>
                          <h4 className="text-sm font-['Kanit'] text-[#F2F4F6] tracking-wide mb-4 flex items-center gap-2"><Upload aria-hidden="true" className="w-4 h-4 text-[#FF0000]" /> อัปโหลดสลิปโอนเงิน</h4>
                          
                          {!uploadedSlip ? (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#990000]/30 hover:border-[#FF0000] hover:bg-[#FF0000]/5 rounded-xl p-10 cursor-pointer transition-all group">
                              <div className="w-12 h-12 rounded-full bg-[#2E0505] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(153,0,0,0.3)]">
                                <Upload aria-hidden="true" className="w-6 h-6 text-[#FF0000]" />
                              </div>
                              <p className="text-sm text-[#F2F4F6]/70 font-bold">คลิกเพื่ออัปโหลดสลิป</p>
                              <p className="text-xs text-[#F2F4F6]/30 mt-1">รองรับไฟล์: JPG, PNG (ขนาดไม่เกิน 5MB)</p>
                              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                          ) : (
                            <div className="flex items-start gap-4 bg-[#2E0505]/40 border border-[#990000]/30 rounded-xl p-4 animate-in fade-in">
                              <figure className="m-0">
                                <img src={uploadedSlip.preview as string} alt="รูปภาพสลิปที่อัปโหลด" className="w-20 h-24 object-cover rounded-lg border border-[#990000]/30 bg-black" />
                              </figure>
                              <div className="flex-1 min-w-0 py-1">
                                <p className="text-sm text-[#F2F4F6] font-bold truncate mb-1">{uploadedSlip.name}</p>
                                <p className="text-xs text-green-400 flex items-center gap-1 mb-3"><Check aria-hidden="true" className="w-3 h-3" /> อัปโหลดสำเร็จ</p>
                                <button onClick={() => setUploadedSlip(null)} className="text-[#F2F4F6]/40 hover:text-[#FF0000] text-xs border border-[#F2F4F6]/10 hover:border-[#FF0000] px-3 py-1.5 rounded transition">ลบ / เปลี่ยนรูปใหม่</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <footer className="flex gap-4 pt-4">
                      <button onClick={goBack} className="flex-1 border border-[#990000]/50 text-[#F2F4F6]/60 hover:text-[#FF0000] hover:border-[#FF0000] py-4 rounded-xl font-['Kanit'] text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 group">
                        <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับ
                      </button>
                      <button 
                        onClick={handleConfirm} 
                        disabled={(payMethod === 'transfer' && !uploadedSlip) || loadingAction} 
                        className="flex-[2] bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-xl font-['Kanit'] font-bold tracking-wide text-sm transition-all shadow-[0_0_18px_rgba(153,0,0,0.5)] flex items-center justify-center gap-3 active:scale-95 group relative overflow-hidden"
                      >
                        {loadingAction ? (
                          <><Loader aria-hidden="true" className="w-5 h-5 animate-spin" /> กำลังดำเนินการ...</>
                        ) : (
                          <>
                            <span className="relative z-10">ยืนยันการสั่งซื้อ</span> 
                            <Check aria-hidden="true" className="w-5 h-5 relative z-10" />
                            <div aria-hidden="true" className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[30deg] group-hover:animate-[shimmer_1s_infinite]"></div>
                          </>
                        )}
                      </button>
                    </footer>
                  </article>
                )}

              </section>

              {/* แถบสรุปยอดด้านขวา */}
              <aside className="lg:col-span-1">
                <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-28 transition-all duration-300">
                  <header>
                      <button onClick={() => setShowSummary(!showSummary)} className="w-full flex items-center justify-between lg:pointer-events-none mb-2" aria-expanded={showSummary}>
                        <h3 className="text-lg font-['Kanit'] font-bold flex items-center gap-3">
                          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> สรุปคำสั่งซื้อ
                        </h3>
                        <span className="lg:hidden text-[#F2F4F6]/40">
                          {showSummary ? <ChevronUp aria-hidden="true" className="w-5 h-5" /> : <ChevronDown aria-hidden="true" className="w-5 h-5" />}
                        </span>
                      </button>
                  </header>

                  <div className={`mt-5 space-y-4 ${showSummary ? 'block' : 'hidden'} lg:block animate-in slide-in-from-top-2`}>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-6 custom-scrollbar">
                        {orderSummary.items.map((item, i) => (
                        <article key={i} className="flex items-start justify-between group">
                            <div className="flex items-start gap-3">
                                <figure className="w-8 h-8 rounded bg-[#1a1a1a] border border-[#990000]/20 flex items-center justify-center text-[10px] text-[#F2F4F6]/30 m-0">
                                  IMG
                                </figure>
                                <div>
                                  <p className="text-sm text-[#F2F4F6]/90 truncate font-bold w-32 group-hover:text-[#FF0000] transition-colors">{item.name}</p>
                                  <p className="text-xs text-[#F2F4F6]/40">จำนวน: {item.qty}</p>
                                </div>
                            </div>
                            <span className="text-sm text-[#F2F4F6] font-['Orbitron']">฿{fmt(item.price * item.qty)}</span>
                        </article>
                        ))}
                    </div>

                    <footer className="border-t border-[#990000]/25 pt-4 mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#F2F4F6]/50">ราคาสินค้า</span>
                        <span className="text-[#F2F4F6] font-['Orbitron']">฿{fmt(orderSummary.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#FF0000]">ส่วนลดคูปอง ({orderSummary.coupon})</span>
                        <span className="text-[#FF0000] font-['Orbitron']">-฿{fmt(orderSummary.discount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#F2F4F6]/50">ค่าจัดส่ง</span>
                        <span className="text-green-400 font-bold font-['Kanit'] tracking-wide">ส่งฟรี</span>
                      </div>
                    </footer>

                    <div className="border-t border-[#990000]/30 pt-4 mt-2 flex justify-between items-end bg-[#2E0505]/30 p-4 rounded-xl border border-[#990000]/10">
                      <span className="font-['Kanit'] text-xs text-[#F2F4F6]/50 tracking-wide">ยอดรวมสุทธิ</span>
                      <span className="font-['Orbitron'] text-2xl font-black text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">฿{fmt(grandTotal)}</span>
                    </div>

                    <div className="flex justify-center gap-4 pt-2 opacity-50">
                        {['ปลอดภัย', 'รวดเร็ว', 'รับประกัน'].map(t => (
                          <span key={t} className="text-[9px] font-['Kanit'] border border-[#F2F4F6]/20 px-2 py-0.5 rounded text-[#F2F4F6]/60">{t}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          </main>
        )}
      </div>
    </div>
  );
}