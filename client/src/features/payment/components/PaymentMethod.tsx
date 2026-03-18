import { Check, Loader, RefreshCw, Clock } from 'lucide-react'; 
import { useEffect, useRef, useState } from 'react'; 
import { useLanguage } from '../../../shared/context/LanguageContext';
import api from '../../../shared/services/api';        
import QRCode from 'qrcode';                               

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaymentMethodProps {
  payMethod:           string | null;
  onSelectMethod:      (method: string) => void;
  grandTotal:          number;
  onQrPaymentSuccess?: (paymentIntentId: string) => void; 
}

// ✨ เพิ่มสถานะ 'expired' สำหรับตอนหมดเวลา
type QrStatus = 'idle' | 'loading' | 'waiting' | 'processing' | 'succeeded' | 'failed' | 'expired'; 

const fmt     = (n: number) => n.toLocaleString('th-TH');
const POLL_MS = 3000; 
const QR_EXPIRY_SECONDS = 300; // ✨ 300 วินาที = 5 นาที

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaymentMethod({ payMethod, onSelectMethod, grandTotal, onQrPaymentSuccess }: PaymentMethodProps) {
  const { t } = useLanguage();
  const [qrStatus,         setQrStatus]         = useState<QrStatus>('idle');
  const [qrDataUrl,        setQrDataUrl]        = useState<string | null>(null);
  const [timeLeft,         setTimeLeft]         = useState<number>(QR_EXPIRY_SECONDS); // ✨ State นับเวลา
  
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const methods = [
    { id: 'qr',       title: t('qrOptionTitle'),    sub: t('qrOptionSub'), emoji: '📱' },
    { id: 'transfer', title: t('transferOptionTitle'), sub: t('transferOptionSub'),  emoji: '🏦' },
  ];

  // ─── ควบคุมการเปิด/ปิด QR ───
  useEffect(() => {
    if (payMethod === 'qr') {
      initStripeQR();
    } else {
      stopPolling();
      setQrStatus('idle');
      setQrDataUrl(null);
    }
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payMethod]);

  // ─── ✨ ระบบนับถอยหลัง 5 นาที ───
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    // นับเวลาเฉพาะตอนที่กำลังรอสแกน หรือ กำลังประมวลผล
    if (payMethod === 'qr' && (qrStatus === 'waiting' || qrStatus === 'processing')) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQrStatus('expired'); // พอเหลือ 0 เปลี่ยนสถานะเป็นหมดอายุ
            stopPolling();          // หยุดถามเซิร์ฟเวอร์
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [payMethod, qrStatus]);

  // ─── สร้าง QR Code ───
  const initStripeQR = async () => {
    setQrStatus('loading');
    setTimeLeft(QR_EXPIRY_SECONDS); // ✨ รีเซ็ตเวลาใหม่ทุกครั้งที่สร้าง QR

    try {
      const stripeAmount = Math.round(grandTotal * 100);

      const { data } = await api.post('/payments/create-intent', {
        amount: stripeAmount,
        orderId: 'PENDING',
      });

      if (data.qrData) {
        const url = await QRCode.toDataURL(data.qrData, {
          width: 220, margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setQrDataUrl(url);
      } else if (data.qrImageUrl) {
        setQrDataUrl(data.qrImageUrl);
      }

      setQrStatus('waiting');
      startPolling(data.paymentIntentId);
    } catch (error) {
      console.error("Stripe QR Error:", error);
      setQrStatus('failed');
    }
  };

  const startPolling = (intentId: string) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/payments/status/${intentId}`);
        if (data.status === 'succeeded') {
          setQrStatus('succeeded');
          stopPolling();
          onQrPaymentSuccess?.(intentId); 
        } else if (data.status === 'processing') {
          setQrStatus('processing');
        } else if (data.status === 'canceled') {
          setQrStatus('failed');
          stopPolling();
        }
      } catch { /* รอ poll รอบต่อไป */ }
    }, POLL_MS);
  };

  const stopPolling = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
  };

  // ✨ ฟังก์ชันแปลงวินาทีเป็น นาที:วินาที (05:00)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const statusMap: Record<QrStatus, { text: string; color: string } | null> = {
    idle:       null,
    loading:    null,
    waiting:    { text: t('statusWaitingScan'),  color: 'text-yellow-400' },
    processing: { text: t('statusProcessing'),        color: 'text-blue-400'   },
    succeeded:  { text: t('statusSucceeded'),      color: 'text-green-400'  },
    failed:     { text: t('statusFailed'),      color: 'text-red-400'    },
    expired:    { text: t('statusExpired'),     color: 'text-red-500'    }, // ✨ สถานะหมดอายุ
  };
  const statusLabel = statusMap[qrStatus];

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

      {payMethod === 'qr' && (
        <article className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-8 flex flex-col items-center animate-in zoom-in-95">

          {qrStatus === 'loading' && (
            <div role="status" className="flex flex-col items-center gap-3 py-8">
              <Loader aria-hidden="true" className="w-10 h-10 text-[#FF0000] animate-spin" />
              <p className="text-[#F2F4F6]/50 text-sm">{t('creatingQr')}</p>
            </div>
          )}

          {qrStatus !== 'loading' && (
            <>
              {/* ✨ แสดงเวลานับถอยหลัง */}
              {(qrStatus === 'waiting' || qrStatus === 'processing' || qrStatus === 'expired') && (
                <div className={`flex items-center gap-2 mb-4 font-['Orbitron'] text-lg font-bold transition-colors ${timeLeft <= 60 && qrStatus !== 'expired' ? 'text-[#FF0000] animate-pulse drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-[#F2F4F6]'}`}>
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}

              <figure className="w-56 h-56 bg-white rounded-xl flex items-center justify-center border-4 border-[#990000]/30 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] m-0">
                {qrDataUrl ? (
                  <>
                    <img
                      src={qrDataUrl}
                      alt="PromptPay QR Code สำหรับชำระเงิน"
                      // ✨ ถ้าหมดอายุ ให้เบลอรูป QR Code
                      className={`w-full h-full object-contain p-2 transition-all duration-500 ${qrStatus === 'expired' ? 'blur-md opacity-30 grayscale' : ''}`}
                    />
                    
                    {/* ✨ Overlay ปุ่มกดสร้าง QR ใหม่ เมื่อหมดเวลา */}
                    {qrStatus === 'expired' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 animate-in fade-in zoom-in duration-300">
                        <button
                          onClick={(e) => { e.stopPropagation(); initStripeQR(); }}
                          className="bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,0,0,0.6)] group"
                        >
                          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> 
                          สร้าง QR Code ใหม่
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#FF0000] shadow-[0_0_10px_#FF0000] animate-[scan_2s_ease-in-out_infinite]"></div>
                    <p className="text-[#000000] font-['Orbitron'] text-sm font-bold mb-2">SCAN TO PAY</p>
                    <div className="grid grid-cols-8 gap-1 mt-2 mx-auto opacity-80" style={{ width: 100 }}>
                      {Array.from({ length: 64 }, (_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-[1px] ${Math.random() > 0.4 ? 'bg-[#000000]' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                )}
              </figure>

              <p className="text-[#F2F4F6]/50 text-sm mt-6 font-light">{t('openBankApp')}</p>
              <p className="text-[#FF0000] font-['Orbitron'] font-bold text-2xl mt-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">฿{fmt(grandTotal)}</p>

              {statusLabel && (
                <p role="status" className={`flex items-center gap-2 mt-3 text-sm font-medium ${statusLabel.color}`}>
                  {(qrStatus === 'waiting' || qrStatus === 'processing') && (
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
                  {statusLabel.text}
                </p>
              )}
            </>
          )}
        </article>
      )}

      {/* โอนผ่านธนาคาร (ซ่อนไว้เพื่อประหยัดพื้นที่โค้ด แต่ยังอยู่เหมือนเดิม) */}
      {payMethod === 'transfer' && (
        <article className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-6 space-y-4 animate-in slide-in-from-top-2">
          <header>
            <p className="text-sm text-[#F2F4F6]/60 font-['Kanit'] tracking-wide">{t('bankAccountsTitle')}</p>
          </header>
          {[
            { bank: 'KBANK (กสิกรไทย)', acct: '123-4-56789-0', name: 'Nexus Gear Co., Ltd.', color: 'text-green-500'  },
            { bank: 'SCB (ไทยพาณิชย์)',  acct: '987-6-54321-0', name: 'Nexus Gear Co., Ltd.', color: 'text-purple-500' },
          ].map((b, i) => (
            <div key={i} className="border border-[#990000]/15 rounded-lg p-4 flex items-center justify-between hover:bg-[#2E0505]/20 transition">
              <div>
                <p className={`text-xs font-['Kanit'] font-bold ${b.color} mb-1`}>{b.bank}</p>
                <p className="text-[#F2F4F6] font-bold tracking-widest text-lg font-['Orbitron']">{b.acct}</p>
                <p className="text-[#F2F4F6]/40 text-xs">{b.name}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(b.acct)}
                  className="text-[#F2F4F6]/40 hover:text-[#FF0000] text-xs border border-[#F2F4F6]/20 hover:border-[#FF0000] px-3 py-1 rounded transition"
                >
                  {t('copy')}
                </button>
            </div>
          ))}
          <footer className="bg-[#2E0505] rounded-lg p-4 text-center mt-4 border border-[#FF0000]/20">
            <p className="text-[#F2F4F6]/60 text-xs mb-1">{t('totalToPay')}</p>
            <p className="text-[#FF0000] font-bold text-2xl font-['Orbitron']">฿{fmt(grandTotal)}</p>
          </footer>
        </article>
      )}

    </section>
  );
}