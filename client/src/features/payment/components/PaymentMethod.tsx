import { Check, Loader } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'; 
import api from '../../../shared/services/api';        
import QRCode from 'qrcode';                             

// ─── Types ────────────────────────────────────────────────────────────────────
interface PaymentMethodProps {
  payMethod:           string | null;
  onSelectMethod:      (method: string) => void;
  grandTotal:          number;
  onQrPaymentSuccess?: (paymentIntentId: string) => void; 
}

type QrStatus = 'idle' | 'loading' | 'waiting' | 'processing' | 'succeeded' | 'failed'; 

const fmt     = (n: number) => n.toLocaleString('th-TH');
const POLL_MS = 3000; 

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaymentMethod({ payMethod, onSelectMethod, grandTotal, onQrPaymentSuccess }: PaymentMethodProps) {

  const [qrStatus,         setQrStatus]         = useState<QrStatus>('idle');
  const [qrDataUrl,        setQrDataUrl]        = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isSimulating,    setIsSimulating]    = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const methods = [
    { id: 'qr',       title: 'สแกนคิวอาร์โค้ด',    sub: 'รองรับทุกแอปธนาคาร', emoji: '📱' },
    { id: 'transfer', title: 'โอนเงินผ่านธนาคาร', sub: 'แนบสลิปเพื่อยืนยัน',  emoji: '🏦' },
  ];

  useEffect(() => {
    if (payMethod === 'qr') {
      initStripeQR();
    } else {
      stopPolling();
      setQrStatus('idle');
      setQrDataUrl(null);
      setPaymentIntentId(null);
    }
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payMethod]);

  const initStripeQR = async () => {
    setQrStatus('loading');
    try {
      // ✨ สำคัญมาก: Stripe ต้องการหน่วยเป็น "สตางค์" เลยต้องเอา grandTotal ไปคูณ 100 และปัดเศษทิ้ง
      const stripeAmount = Math.round(grandTotal * 100);

      const { data } = await api.post('/api/payments/create-intent', {
        amount: stripeAmount,
        orderId: 'PENDING',
      });
      setPaymentIntentId(data.paymentIntentId);

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
      // ถ้า Error ก็ยังแสดง QR ปลอมให้ไปต่อได้
      setQrStatus('waiting');
    }
  };

  const startPolling = (intentId: string) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/api/payments/status/${intentId}`);
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

  const handleSimulate = async () => {
    if (!paymentIntentId) return;
    setIsSimulating(true);
    try { await api.post(`/api/payments/simulate-success/${paymentIntentId}`); }
    finally { setIsSimulating(false); }
  };

  const statusMap: Record<QrStatus, { text: string; color: string } | null> = {
    idle:       null,
    loading:    null,
    waiting:    { text: 'รอการสแกน QR Code...',  color: 'text-yellow-400' },
    processing: { text: 'กำลังประมวลผล...',        color: 'text-blue-400'   },
    succeeded:  { text: '✅ ชำระเงินสำเร็จ!',      color: 'text-green-400'  },
    failed:     { text: '❌ ถูกยกเลิก / หมดอายุ', color: 'text-red-400'    },
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
              <p className="text-[#F2F4F6]/50 text-sm">กำลังสร้าง QR Code...</p>
            </div>
          )}

          {qrStatus !== 'loading' && (
            <>
              <figure className="w-56 h-56 bg-white rounded-xl flex items-center justify-center border-4 border-[#990000]/30 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] m-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="PromptPay QR Code สำหรับชำระเงิน"
                    className="w-full h-full object-contain p-2"
                  />
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

              <p className="text-[#F2F4F6]/50 text-sm mt-6 font-light">เปิดแอปพลิเคชันธนาคารเพื่อสแกน QR Code</p>
              <p className="text-[#FF0000] font-['Orbitron'] font-bold text-2xl mt-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">฿{fmt(grandTotal)}</p>

              {statusLabel && (
                <p role="status" className={`flex items-center gap-2 mt-3 text-sm font-medium ${statusLabel.color}`}>
                  {(qrStatus === 'waiting' || qrStatus === 'processing') && (
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
                  {statusLabel.text}
                </p>
              )}

              {(qrStatus === 'waiting' || qrStatus === 'processing') && paymentIntentId && (
                <aside className="mt-4 pt-4 border-t border-[#990000]/20 w-full text-center">
                  <p className="text-xs text-[#F2F4F6]/30 mb-2">🧪 Demo Mode — กดปุ่มด้านล่างเพื่อจำลองการชำระเงิน</p>
                  <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="px-6 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 rounded-lg text-sm font-['Kanit'] font-bold transition-colors text-white"
                  >
                    {isSimulating ? 'กำลังประมวลผล...' : '✅ จำลองการชำระเงินสำเร็จ'}
                  </button>
                </aside>
              )}
            </>
          )}
        </article>
      )}

      {payMethod === 'transfer' && (
        <article className="mt-6 bg-[#0a0a0a] border border-[#990000]/20 rounded-xl p-6 space-y-4 animate-in slide-in-from-top-2">
          <header>
            <p className="text-sm text-[#F2F4F6]/60 font-['Kanit'] tracking-wide">บัญชีธนาคารสำหรับโอนเงิน</p>
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
                คัดลอก
              </button>
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