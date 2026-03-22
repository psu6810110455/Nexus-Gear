import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../../shared/context/LanguageContext';
import {
  ArrowLeft, ArrowRight, Check, MapPin,
  CreditCard, Upload, Loader, ChevronDown, ChevronUp
} from 'lucide-react';
import api from '../../../shared/services/api';
import { toast } from 'sonner';

import { fetchAddresses } from '../services/payment.service';
import type { Address, OrderSummaryData } from '../types/payment.types';
import StepBar      from '../components/StepBar';
import AddressSelect from '../components/AddressSelect';
import PaymentMethod from '../components/PaymentMethod';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PaymentProps {
  onNavigate?: (page: string) => void;
}
interface UploadedSlip {
  name:    string;
  preview: string | ArrayBuffer | null;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

// ─── Component ───────────────────────────────────────────────────────────────
export default function PaymentPage({ onNavigate }: PaymentProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [isApiLoading,    setIsApiLoading]    = useState(true);
  const [savedAddresses,  setSavedAddresses]  = useState<Address[]>([]);
  const [orderSummary,    setOrderSummary]    = useState<OrderSummaryData | null>(null);

  const [step,            setStep]            = useState(1);
  const [selectedAddr,    setSelectedAddr]    = useState<number | null>(null);
  const [payMethod,       setPayMethod]       = useState<string | null>(null);
  const [uploadedSlip,    setUploadedSlip]    = useState<UploadedSlip | null>(null);
  const [slipFile,        setSlipFile]        = useState<File | null>(null);
  const [confirmed,       setConfirmed]       = useState(false);
  const [loadingAction,   setLoadingAction]   = useState(false);
  const [showSummary,     setShowSummary]     = useState(false);
  const [finalOrderNum,   setFinalOrderNum]   = useState('');

  // ✨ State ใหม่ — QR Stripe
  const [isQrPaid,        setIsQrPaid]        = useState(false);
  const [qrPaidIntentId,  setQrPaidIntentId]  = useState<string | null>(null);

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setIsApiLoading(true);

      const addrs = await fetchAddresses();
      setSavedAddresses(addrs);

      const sessionData = localStorage.getItem('checkoutSession');
      if (sessionData) {
        setOrderSummary(JSON.parse(sessionData));
      } else {
        toast.error('ไม่พบข้อมูลคำสั่งซื้อ กรุณาเลือกสินค้าในตะกร้าใหม่ครับ');
        if (onNavigate) onNavigate('cart');
        return;
      }

      const def = addrs.find(a => a.isDefault);
      if (def) setSelectedAddr(def.id);
      setIsApiLoading(false);
    };
    loadData();
  }, [onNavigate]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(3, s + 1));
  };
  const goBack = () => setStep(s => Math.max(1, s - 1));

  // ── Upload slip ────────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('❌ ระบบรองรับเฉพาะไฟล์รูปภาพ (JPG, PNG) เท่านั้นครับ');
      e.target.value = ''; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ ขนาดไฟล์ใหญ่เกินไป! กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB ครับ');
      e.target.value = ''; return;
    }

    setSlipFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadedSlip({ name: file.name, preview: reader.result });
    reader.readAsDataURL(file);
  };

  // ✨ Callback รับจาก PaymentMethod เมื่อ Stripe QR จ่ายสำเร็จ
  const handleQrPaymentSuccess = (intentId: string) => {
    setIsQrPaid(true);
    setQrPaidIntentId(intentId);
    toast.success('ตรวจสอบการชำระเงินสำเร็จ! 🎉');
    // ข้ามไป Step 3 อัตโนมัติ
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(3);
    }, 800);
  };

  // ── Confirm order ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setLoadingAction(true);
    try {
      const addressDetail = savedAddresses.find(a => a.id === selectedAddr)?.detail || 'ไม่ระบุที่อยู่';
      const formData = new FormData();
      formData.append('shippingAddress', addressDetail);
      formData.append('paymentMethod',   payMethod || '');

      // ✨ แนบข้อมูลคูปองส่วนลดไปกับ FormData
      if (orderSummary?.coupon && orderSummary.coupon !== 'ไม่มี') {
        formData.append('couponCode', orderSummary.coupon);
        formData.append('discountAmount', String(orderSummary.discount));
      }

      // ✨ ถ้า QR จ่ายผ่าน Stripe แล้ว → ส่ง intentId แทนสลิป
      if (isQrPaid && qrPaidIntentId) {
        formData.append('stripePaymentIntentId', qrPaidIntentId);
      } else if (payMethod === 'transfer' && slipFile) {
        formData.append('slipImage', slipFile);
      }

      const response = await api.post('/orders/checkout', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setFinalOrderNum(response.data.orderNumber);
        localStorage.removeItem('checkoutSession');
        setConfirmed(true);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '❌ เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      // ✨ ย้าย setLoadingAction(false) มาไว้ตรงนี้ ทำงานเสมอไม่ว่าจะ Error หรือ Success
      setLoadingAction(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isApiLoading || !orderSummary) {
    return (
      <main className="min-h-screen bg-[#000000] flex justify-center items-center">
        <p role="status" className="text-[#FF0000] font-['Orbitron'] animate-pulse text-2xl tracking-widest">
          {t('loadingPayment')}
        </p>
      </main>
    );
  }

  const grandTotal         = orderSummary.subtotal - orderSummary.discount + orderSummary.shipping;
  const selectedAddressData = savedAddresses.find(a => a.id === selectedAddr);

  // ── เงื่อนไขปุ่ม Confirm ──────────────────────────────────────────────────
  // QR + จ่ายแล้ว   → กดได้เลย ✅
  // Transfer         → ต้องแนบสลิปก่อน
  // QR + ยังไม่จ่าย  → ยังกดไม่ได้ (ไม่ควรถึง Step 3 ได้อยู่แล้ว)
  const isConfirmDisabled =
    loadingAction ||
    (payMethod === 'transfer' && !uploadedSlip) ||
    (payMethod === 'qr' && !isQrPaid);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white pb-20">

      <style>{`
        .custom-scrollbar::-webkit-scrollbar       { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(46,5,5,0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #990000; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF0000; }
      `}</style>

      {/* Background glow */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60" />
      </div>

      <div className="relative z-10">

        {/* ═══════════════════════════════════════
            หน้าสั่งซื้อสำเร็จ
            ═══════════════════════════════════════ */}
        {confirmed ? (
          <main className="min-h-[80vh] flex items-center justify-center animate-in zoom-in-95 duration-500">
            <section
              aria-labelledby="success-title"
              className="max-w-2xl w-full mx-4 px-4 py-16 flex flex-col items-center text-center bg-[#000000]/40 backdrop-blur-xl border border-[#990000]/30 rounded-3xl"
            >
              <figure className="relative w-32 h-32 mb-8 m-0 z-10">
                <div className="w-32 h-32 rounded-full bg-[#0a0a0a] border-2 border-[#FF0000] flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)]">
                  <Check aria-hidden="true" className="w-16 h-16 text-[#FF0000]" />
                </div>
              </figure>

              <h1 id="success-title" className="text-4xl font-['Orbitron'] font-black text-[#FF0000] mb-3 tracking-wide">
                {t('orderSuccessTitle')}
              </h1>
              <p className="text-[#F2F4F6]/50 mb-2">{t('orderIdLabel')}</p>

              <div className="bg-[#2E0505]/50 px-6 py-2 rounded-lg border border-[#FF0000]/20 mb-8">
                <p className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6] tracking-widest">{finalOrderNum}</p>
              </div>

              <p className="text-[#F2F4F6]/60 text-sm max-w-sm leading-relaxed mb-8">
                {t('orderSuccessDesc')}
              </p>

              <nav className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-[#990000] hover:bg-[#FF0000] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(153,0,0,0.4)]"
                >
                  {t('viewOrderDetails')}
                </button>
                <button
                  onClick={() => { if (onNavigate) onNavigate('home'); else navigate('/'); }}
                  className="border border-[#990000]/50 text-[#F2F4F6]/60 hover:text-[#FF0000] hover:border-[#FF0000] px-8 py-3 rounded-xl font-bold transition-all"
                >
                  {t('backToHomeShort')}
                </button>
              </nav>
            </section>
          </main>

        ) : (

          /* ═══════════════════════════════════════
              หน้า Checkout
              ═══════════════════════════════════════ */
          <main className="max-w-5xl mx-auto px-4 py-8">

            <header className="mb-8">
              <nav aria-label="breadcrumb">
                <button
                  onClick={() => onNavigate?.('cart')}
                  className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('backToCart')}
                </button>
              </nav>
              <h1 className="text-3xl md:text-4xl font-['Orbitron'] font-bold flex items-center gap-4">
                <span aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]" />
                CHECKOUT
              </h1>
            </header>

            <StepBar current={step} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

              {/* ── Main content ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* STEP 1: ที่อยู่จัดส่ง */}
                {step === 1 && (
                  <section aria-labelledby="step1-title" className="animate-in slide-in-from-left-4 duration-500">
                    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
                      <header className="flex items-center gap-3 mb-6 border-b border-[#990000]/20 pb-4">
                        <div aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]" />
                        <h2 id="step1-title" className="text-xl font-bold">{t('selectShippingAddress')}</h2>
                      </header>
                      <AddressSelect
                        addresses={savedAddresses}
                        selectedAddr={selectedAddr}
                        onSelect={setSelectedAddr}
                      />
                    </div>

                    <nav className="mt-6">
                      <button
                        onClick={goNext}
                        disabled={!selectedAddr}
                        className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] text-white py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-3 group transition-all shadow-[0_0_20px_rgba(153,0,0,0.4)]"
                      >
                        {t('proceedToPayment')}
                        <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </nav>
                  </section>
                )}

                {/* STEP 2: วิธีชำระเงิน */}
                {step === 2 && (
                  <section aria-labelledby="step2-title" className="animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
                      <header className="flex items-center gap-3 mb-6 border-b border-[#990000]/20 pb-4">
                        <div aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]" />
                        <h2 id="step2-title" className="text-xl font-bold">{t('selectPaymentMethod')}</h2>
                      </header>

                      {/* ✨ ส่ง onQrPaymentSuccess เพื่อรับแจ้งเมื่อ QR จ่ายสำเร็จ */}
                      <PaymentMethod
                        payMethod={payMethod}
                        onSelectMethod={setPayMethod}
                        grandTotal={grandTotal}
                        onQrPaymentSuccess={handleQrPaymentSuccess}
                      />
                    </div>

                    <nav className="flex gap-4 pt-6">
                      <button
                        onClick={goBack}
                        className="flex-1 border border-[#990000]/50 text-[#F2F4F6]/60 hover:text-[#FF0000] hover:border-[#FF0000] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <ArrowLeft aria-hidden="true" className="w-4 h-4" /> {t('backBtn')}
                      </button>

                      {/* ✨ QR: disabled จนกว่าจะจ่ายสำเร็จ | Transfer: กดต่อได้ทันที */}
                      <button
                        onClick={goNext}
                        disabled={!payMethod || (payMethod === 'qr' && !isQrPaid)}
                        className="flex-[2] bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] text-white py-4 rounded-xl font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 group transition-all shadow-[0_0_18px_rgba(153,0,0,0.5)]"
                      >
                        {payMethod === 'qr' && !isQrPaid
                          ? <><Loader aria-hidden="true" className="w-4 h-4 animate-spin" /> {t('waitingForPayment')}</>
                          : <>{t('nextStep')} <ArrowRight aria-hidden="true" className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        }
                      </button>
                    </nav>
                  </section>
                )}

                {/* STEP 3: ยืนยันคำสั่งซื้อ */}
                {step === 3 && (
                  <section aria-labelledby="step3-title" className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">

                      <header className="mb-8">
                        <h2 id="step3-title" className="text-xl font-bold flex items-center gap-3 mb-2">
                          <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]" />
                          {t('confirmOrderTitle')}
                        </h2>
                        <p className="text-[#F2F4F6]/40 text-sm pl-5">{t('checkDetailsAccurate')}</p>
                      </header>

                      {/* สรุปที่อยู่ + วิธีชำระ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                        <article className="bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000]/50 transition">
                          <header className="flex items-center justify-between mb-3 border-b border-[#990000]/20 pb-2">
                            <h3 className="text-xs text-[#990000] flex items-center gap-2">
                              <MapPin aria-hidden="true" className="w-3 h-3" /> {t('shipTo')}
                            </h3>
                            <button onClick={() => setStep(1)} disabled={loadingAction} className="text-[#F2F4F6]/40 text-[10px] hover:text-[#FF0000] transition-colors">
                              {t('edit')}
                            </button>
                          </header>
                          <address className="not-italic">
                            <p className="text-sm font-bold mb-1">{selectedAddressData?.name}</p>
                            <p className="text-xs text-[#F2F4F6]/60 leading-relaxed">{selectedAddressData?.detail}</p>
                          </address>
                        </article>

                        <article className="bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000]/50 transition">
                          <header className="flex items-center justify-between mb-3 border-b border-[#990000]/20 pb-2">
                            <h3 className="text-xs text-[#990000] flex items-center gap-2">
                              <CreditCard aria-hidden="true" className="w-3 h-3" /> {t('paymentMethod')}
                            </h3>
                            <button onClick={() => setStep(2)} disabled={loadingAction} className="text-[#F2F4F6]/40 text-[10px] hover:text-[#FF0000] transition-colors">
                              {t('edit')}
                            </button>
                          </header>
                          <p className="text-lg font-bold">
                            {payMethod === 'qr' ? t('scanQr') : t('bankTransfer')}
                          </p>
                          <p className="text-xs text-[#F2F4F6]/40 mt-1">{t('totalInclusive')} ฿{fmt(grandTotal)}</p>

                          {/* ✨ Badge QR จ่ายแล้ว */}
                          {isQrPaid && (
                            <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full border border-green-800/40">
                              <Check aria-hidden="true" className="w-3 h-3" /> {t('paymentSuccess')}
                            </span>
                          )}
                        </article>
                      </div>

                      {/* อัปโหลดสลิป (เฉพาะ transfer) */}
                      {payMethod === 'transfer' && (
                        <fieldset className="bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-6 relative animate-in fade-in zoom-in-95 duration-300">
                          <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-[#FF0000]" />
                          <legend className="text-sm text-[#F2F4F6] mb-4 flex items-center gap-2 w-full">
                            <Upload aria-hidden="true" className="w-4 h-4 text-[#FF0000]" /> {t('uploadSlipTitle')}
                          </legend>

                          {!uploadedSlip ? (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#990000]/30 hover:border-[#FF0000] hover:bg-[#FF0000]/5 rounded-xl p-10 cursor-pointer transition-all group">
                              <div className="w-12 h-12 rounded-full bg-[#2E0505] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Upload aria-hidden="true" className="w-6 h-6 text-[#FF0000]" />
                              </div>
                              <span className="text-sm font-bold">{t('clickToUploadSlip')}</span>
                              <span className="text-xs text-[#F2F4F6]/30 mt-1">{t('supportFiles')}</span>
                              <input
                                type="file"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <figure className="flex items-start gap-4 bg-[#2E0505]/40 border border-[#990000]/30 rounded-xl p-4 m-0">
                              <img
                                src={uploadedSlip.preview as string}
                                alt="สลิปที่อัปโหลด"
                                className="w-20 h-24 object-cover rounded-lg border border-[#990000]/30"
                              />
                              <figcaption className="flex-1 py-1">
                                <p className="text-sm font-bold truncate mb-1">{uploadedSlip.name}</p>
                                <p className="text-xs text-green-400 flex items-center gap-1 mb-3">
                                  <Check aria-hidden="true" className="w-3 h-3" /> {t('uploadSuccess')}
                                </p>
                                <button
                                  onClick={() => { setUploadedSlip(null); setSlipFile(null); }}
                                  className="text-xs border border-[#F2F4F6]/10 px-3 py-1.5 rounded hover:border-[#FF0000] hover:text-[#FF0000] transition-colors"
                                >
                                  {t('changeImage')}
                                </button>
                              </figcaption>
                            </figure>
                          )}
                        </fieldset>
                      )}

                      {/* ✨ Banner QR จ่ายแล้ว (แทนการแนบสลิป) */}
                      {payMethod === 'qr' && isQrPaid && (
                        <aside
                          role="status"
                          className="bg-green-900/20 border border-green-800/40 rounded-xl p-5 flex items-center gap-4 animate-in fade-in"
                        >
                          <div aria-hidden="true" className="w-10 h-10 rounded-full bg-green-800/40 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-green-400 font-bold">{t('qrSuccessDescTitle')}</p>
                            <p className="text-[#F2F4F6]/40 text-xs mt-1">{t('qrSuccessDesc')}</p>
                          </div>
                        </aside>
                      )}

                    </div>

                    <nav className="flex gap-4 pt-6">
                      <button
                        onClick={goBack}
                        disabled={loadingAction}
                        className="flex-1 border border-[#990000]/50 text-[#F2F4F6]/60 hover:text-[#FF0000] hover:border-[#FF0000] py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-30 transition-all"
                      >
                        <ArrowLeft aria-hidden="true" className="w-4 h-4" /> {t('backBtn')}
                      </button>

                      <button
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className="flex-[2] bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_18px_rgba(153,0,0,0.5)]"
                      >
                        {loadingAction
                          ? <><Loader aria-hidden="true" className="w-5 h-5 animate-spin" /> {t('processing')}</>
                          : <>{t('confirmOrderBtn')} <Check aria-hidden="true" className="w-5 h-5" /></>
                        }
                      </button>
                    </nav>
                  </section>
                )}

              </div>

              {/* ── Sidebar: สรุปยอด ── */}
              <aside aria-label="สรุปคำสั่งซื้อ" className="lg:col-span-1">
                <section className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-28">

                  <header>
                    <button
                      onClick={() => setShowSummary(!showSummary)}
                      aria-expanded={showSummary}
                      className="w-full flex items-center justify-between lg:pointer-events-none mb-2"
                    >
                      <h2 className="text-lg font-bold flex items-center gap-3">
                        <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]" />
                        {t('orderSummary')}
                      </h2>
                      <span aria-hidden="true" className="lg:hidden text-[#F2F4F6]/40">
                        {showSummary ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    </button>
                  </header>

                  <div className={`mt-5 space-y-4 ${showSummary ? 'block' : 'hidden'} lg:block`}>

                    {/* รายการสินค้า */}
                    <ul className="space-y-3 max-h-60 overflow-y-auto pr-6 custom-scrollbar m-0 p-0 list-none">
                      {orderSummary.items.map((item: any, i) => (
                        <li key={i} className="flex items-start justify-between group">
                          <div className="flex items-start gap-3">
                            <figure className="w-8 h-8 rounded bg-[#1a1a1a] border border-[#990000]/20 flex items-center justify-center m-0 overflow-hidden shrink-0">
                              {(item.imageUrl || item.image_url)
                                ? <img src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : 'http://localhost:3000' + item.imageUrl) : item.image_url || 'https://dummyimage.com/100x100/000/fff'} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                : <span className="text-[10px] text-[#F2F4F6]/30">IMG</span>
                              }
                            </figure>
                            <div>
                              <p className="text-sm font-bold w-32 truncate group-hover:text-[#FF0000] transition-colors">{item.name}</p>
                              <p className="text-xs text-[#F2F4F6]/40">{t('quantity')}: {item.qty}</p>
                            </div>
                          </div>
                          <span className="text-sm font-['Orbitron']">฿{fmt(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* ยอดสรุป */}
                    <dl className="border-t border-[#990000]/25 pt-4 space-y-2 m-0">
                      <div className="flex justify-between text-sm">
                        <dt className="text-[#F2F4F6]/50">{t('summaryProductsPrice')}</dt>
                        <dd className="font-['Orbitron'] m-0">฿{fmt(orderSummary.subtotal)}</dd>
                      </div>

                      {/* ✨ แสดงส่วนลดคูปองเฉพาะตอนที่มีส่วนลดมากกว่า 0 เท่านั้น */}
                      {orderSummary.discount > 0 && (
                        <div className="flex justify-between text-sm text-[#FF0000]">
                          <dt>{t('summaryCouponDiscount')} ({orderSummary.coupon})</dt>
                          <dd className="font-['Orbitron'] m-0">-฿{fmt(orderSummary.discount)}</dd>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <dt className="text-[#F2F4F6]/50">{t('summaryShippingFee')}</dt>
                        <dd className="text-green-400 font-bold m-0">{t('free')}</dd>
                      </div>
                    </dl>

                    <dl className="border-t border-[#990000]/30 pt-4 flex justify-between items-end bg-[#2E0505]/30 p-4 rounded-xl m-0">
                      <dt className="text-xs text-[#F2F4F6]/50">{t('summaryNetTotal')}</dt>
                      <dd className="font-['Orbitron'] text-2xl font-black text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.5)] m-0">
                        ฿{fmt(grandTotal)}
                      </dd>
                    </dl>

                  </div>
                </section>
              </aside>

            </div>
          </main>
        )}
      </div>
    </div>
  );
}