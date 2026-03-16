// features/orders/components/RefundStatusSection.tsx

import {
  Ban,
  RefreshCw,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  ZoomIn,
} from "lucide-react";

import { getServerUrl } from "../../../../shared/services/api";

interface Order {
  cancel_reason?: string | null;
  refund_status?: string;
  refund_amount?: number | null;
  refund_channel?: string | null;
  refund_slip?: string | null;
  refunded_at?: string | null;
  refund_bank_name?: string | null;
  refund_bank_account?: string | null;
}

interface Props {
  order: Order;
  onLightbox: (src: string) => void;
}

const QUICK_CANCEL_REASON = "สลิปปลอม / หลักฐานไม่ถูกต้อง";

const RefundStatusSection = ({ order, onLightbox }: Props) => {
  const isRefunded = order.refund_status === "refunded";
  const isFakeSlip = order.cancel_reason === QUICK_CANCEL_REASON;
  // fallback: รองรับ order เก่าที่ยังไม่มี refund_status = "rejected" ใน DB
  const isRejected = order.refund_status === "rejected" || isFakeSlip;
  const refundSlipUrl = order.refund_slip
    ? getServerUrl(`/uploads/slips/${order.refund_slip}`)
    : null;

  return (
    <section className="space-y-3">
      {/* Refund Timeline */}
      <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
        <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
          <RefreshCw size={12} /> สถานะการคืนเงิน
        </p>
        <div className="flex items-center gap-0">
          {/* Step 1: แจ้งการคืนเงิน */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-yellow-500 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              <AlertTriangle size={14} className="text-yellow-900" />
            </div>
            <p className="text-[10px] font-bold mt-1.5 text-center text-yellow-400">
              แจ้งการคืนเงิน
            </p>
            {!isRefunded && !isRejected && (
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse mt-1" />
            )}
          </div>

          {/* connector */}
          <div
            className={`flex-1 h-0.5 -mt-4 ${isRefunded ? "bg-green-500/60" : isRejected ? "bg-red-500/60" : "bg-zinc-700"}`}
          />

          {/* Step 2: ผล */}
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                isRefunded
                  ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  : isRejected
                    ? "bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "bg-zinc-800 border-zinc-700"
              }`}
            >
              {isRejected ? (
                <Ban size={14} className="text-red-900" />
              ) : (
                <CheckCircle
                  size={14}
                  className={isRefunded ? "text-green-900" : "text-zinc-600"}
                />
              )}
            </div>
            <p
              className={`text-[10px] font-bold mt-1.5 text-center ${
                isRefunded
                  ? "text-green-400"
                  : isRejected
                    ? "text-red-400"
                    : "text-zinc-600"
              }`}
            >
              {isRejected ? "ปฏิเสธการคืนเงิน" : "คืนเงินสำเร็จ"}
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Reason */}
      {order.cancel_reason && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <Ban size={12} /> เหตุผลที่ยกเลิก
          </p>
          <p className="text-zinc-300 text-sm">{order.cancel_reason}</p>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Ban size={16} className="text-red-400" />
            </div>
            <p className="text-red-400 text-sm font-bold">ปฏิเสธการคืนเงิน</p>
          </div>
          <p className="text-red-300/90 text-sm leading-relaxed">
            {isFakeSlip
              ? "แอดมินตรวจสอบแล้วพบว่าสลิปการชำระเงินเป็นสลิปปลอม หรือหลักฐานไม่ถูกต้อง จึงปฏิเสธการคืนเงินสำหรับคำสั่งซื้อนี้"
              : "แอดมินได้ตรวจสอบหลักฐานและพบว่าไม่ตรงตามเงื่อนไข จึงปฏิเสธการคืนเงินสำหรับคำสั่งซื้อนี้"}
          </p>
          <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/30">
            <p className="text-red-300 text-xs">
              ⚠️ หากคุณเห็นว่าการปฏิเสธไม่ถูกต้อง โปรดติดต่อแอดมินเพื่อสอบถาม
            </p>
          </div>
        </div>
      )}

      {/* Refund Details - only show if refunded */}
      {isRefunded && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 space-y-2">
          <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={12} /> ข้อมูลการคืนเงิน
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-zinc-600 text-[10px]">ยอดเงินที่คืน</p>
              <p className="text-green-400 font-bold">
                ฿{Number(order.refund_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-zinc-600 text-[10px]">ช่องทาง</p>
              <p className="text-zinc-300">{order.refund_channel}</p>
            </div>
            {order.refunded_at && (
              <div className="col-span-2">
                <p className="text-zinc-600 text-[10px]">วันที่คืนเงิน</p>
                <p className="text-zinc-300 text-xs">
                  {new Date(order.refunded_at).toLocaleString("th-TH")}
                </p>
              </div>
            )}
          </div>
          {refundSlipUrl && (
            <div
              className="relative group cursor-pointer inline-block mt-2"
              onClick={() => onLightbox(refundSlipUrl)}
            >
              <img
                src={refundSlipUrl}
                alt="สลิปคืนเงิน"
                className="w-16 h-20 object-cover rounded-lg border border-zinc-700 transition-opacity group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 rounded-full p-1">
                  <ZoomIn size={12} className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bank Info */}
      {(order.refund_bank_name || order.refund_bank_account) && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 space-y-2">
          <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Banknote size={12} /> ข้อมูลบัญชีสำหรับคืนเงิน
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500 text-xs">ธนาคาร</span>
              <span className="text-zinc-300 font-bold">
                {order.refund_bank_name || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 text-xs">เลขบัญชี</span>
              <span className="text-zinc-300 font-bold">
                {order.refund_bank_account || "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RefundStatusSection;
