// features/admin/components/orders/AdminCancelDetails.tsx

import { useState } from "react";
import {
  Ban,
  RotateCcw,
  CreditCard,
  CheckCircle,
  DollarSign,
  Upload,
  ZoomIn,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { getServerUrl } from "../../../../shared/services/api";
import type { Order } from "../../../../shared/types";
import { useLanguage } from "../../../../shared/context/LanguageContext";

const REFUND_CHANNELS = ["โอนผ่านธนาคาร", "คืนเงินผ่าน QR"];

interface Props {
  order: Order;
  onLightbox: (src: string) => void;
  onRefund?: (orderId: number, formData: FormData) => Promise<void>;
  onRejectRefund?: (orderId: number) => Promise<void>;
}

// ── shared state hook ─────────────────────────────────────────
// ใช้ร่วมระหว่าง Left และ Right ผ่าน props
export interface CancelDetailsState {
  refundAmount: string;
  refundChannel: string;
  refundFile: File | null;
  refundPreview: string | null;
  refundLoading: boolean;
  setRefundAmount: (v: string) => void;
  setRefundChannel: (v: string) => void;
  setRefundFile: (v: File | null) => void;
  setRefundPreview: (v: string | null) => void;
  setRefundLoading: (v: boolean) => void;
  handleRefundFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRefundSubmit: () => Promise<void>;
}


export const CancelDetailsLeft = ({ order }: { order: Order }) => {
  const { t } = useLanguage();
  const isReturnOrder = !!order.cancel_reason?.startsWith("ขอคืนสินค้า:");
  const isRefunded = order.refund_status === "refunded";
  const isFakeSlip = !!order.cancel_reason?.includes("สลิปปลอม");
  // fallback: order ที่ถูก quick cancel อาจยังไม่มี refund_status = "rejected" ใน DB
  const isRejected = order.refund_status === "rejected" || isFakeSlip;

  return (
    <div className="space-y-4">
      {/* Refund Timeline */}
      <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2 text-yellow-500 mb-4 font-bold text-sm uppercase">
          <RefreshCw size={16} /> {t('refundStatus')}
        </div>
        <div className="flex items-center">
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-yellow-500 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              <AlertTriangle size={14} className="text-yellow-900" />
            </div>
            <p className="text-[10px] font-bold mt-1.5 text-center text-yellow-400">
              {t('refundRequested')}
            </p>
            {!isRefunded && !isRejected && (
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse mt-1" />
            )}
          </div>
          <div
            className={`flex-1 h-0.5 -mt-4 ${isRefunded ? "bg-green-500/60" : isRejected ? "bg-red-500/60" : "bg-zinc-700"}`}
          />
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
              className={`text-[10px] font-bold mt-1.5 text-center ${isRefunded ? "text-green-400" : isRejected ? "text-red-400" : "text-zinc-600"}`}
            >
              {isRejected ? t('rejectRefund') : t('refundSuccess')}
            </p>
            {(isRefunded || isRejected) && (
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 ${isRejected ? "bg-red-500" : "bg-green-500"}`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Cancel Reason */}
      {order.cancel_reason && (
        <div
          className={`p-4 rounded-xl space-y-3 ${isReturnOrder ? "bg-orange-500/5 border border-orange-500/20" : "bg-red-500/5 border border-red-500/20"}`}
        >
          <div
            className={`flex items-center gap-2 font-bold text-sm uppercase ${isReturnOrder ? "text-orange-400" : "text-red-500"}`}
          >
            {isReturnOrder ? <RotateCcw size={16} /> : <Ban size={16} />}
            {isReturnOrder ? t('returnRequested') : t('cancelOrder')}
          </div>
          <div>
            <p className="text-zinc-500 text-xs">
              {isReturnOrder ? t('returnReason') : t('cancelReasonLabel')}
            </p>
            <p className="text-zinc-200 text-sm mt-0.5">
              {order.cancel_reason}
            </p>
          </div>

          {isReturnOrder && (
            <div className="pt-3 border-t border-orange-500/20 space-y-1.5">
              <p className="text-amber-400 text-xs font-black uppercase tracking-widest">
                {t('returnConditions')}
              </p>
              <ul className="space-y-1 text-zinc-400 text-xs leading-relaxed">
                {[
                  t('returnCondition1'),
                  t('returnCondition2'),
                  t('returnCondition3'),
                  t('returnCondition4'),
                ].map((text) => (
                  <li key={text} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0">•</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(isRejected || isFakeSlip) && (
            <div className="pt-3 border-t border-red-500/20 space-y-1">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                <Ban size={13} /> {t('rejectRefund')}
              </div>
              <p className="text-zinc-400 text-sm">
                {isFakeSlip
                  ? t('rejectRefundMessage')
                  : t('rejectRefundMessage')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Right: Bank Info + Refund Done + Refund Form ──────────────
export const CancelDetailsRight = ({
  order,
  onLightbox,
  onRefund,
  onRejectRefund,
}: Props) => {
  const { t } = useLanguage();
  const [refundAmount, setRefundAmount] = useState("");
  const [refundChannel, setRefundChannel] = useState("");
  const [refundFile, setRefundFile] = useState<File | null>(null);
  const [refundPreview, setRefundPreview] = useState<string | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);

  const isRefunded = order.refund_status === "refunded";
  const isFakeSlip = !!order.cancel_reason?.includes("สลิปปลอม");
  // fallback: order ที่ถูก quick cancel อาจยังไม่มี refund_status = "rejected" ใน DB
  const isRejected = order.refund_status === "rejected" || isFakeSlip;
  const refundSlipUrl = order.refund_slip
    ? getServerUrl(`/uploads/slips/${order.refund_slip}`)
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRefundFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setRefundPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!onRefund || !refundChannel) return;
    setRefundLoading(true);
    const fd = new FormData();
    fd.append("refundAmount", refundAmount || order.total_price);
    fd.append("refundChannel", refundChannel);
    if (refundFile) fd.append("refundSlip", refundFile);
    await onRefund(order.id, fd);
    setRefundLoading(false);
    setRefundAmount("");
    setRefundChannel("");
    setRefundFile(null);
    setRefundPreview(null);
  };

  const hasBankInfo =
    order.refund_bank_name ||
    order.refund_bank_account ||
    order.user?.bank_name ||
    order.user?.bank_account;

  return (
    <div className="space-y-4">
      {/* Bank Info */}
      {hasBankInfo && (
        <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase">
            <CreditCard size={16} /> {t('customerBankInfoRefund')}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-zinc-500 text-xs">{t('bankName')}</p>
              <p className="text-zinc-200 font-bold">
                {order.refund_bank_name || order.user?.bank_name || "—"}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">{t('accountNumber')}</p>
              <p className="text-zinc-200 font-bold">
                {order.refund_bank_account || order.user?.bank_account || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Done */}
      {isRefunded && (
        <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20 space-y-3">
          <div className="flex items-center gap-2 text-green-500 font-bold text-sm uppercase">
            <CheckCircle size={16} /> {t('refundedStatus')}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-zinc-500 text-xs">{t('refundAmountLabel')}</p>
              <p className="text-green-400 font-bold">
                ฿{Number(order.refund_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">{t('channel')}</p>
              <p className="text-zinc-200">{order.refund_channel}</p>
            </div>
            {order.refunded_at && (
              <div className="col-span-2">
                <p className="text-zinc-500 text-xs">{t('refundDate')}</p>
                <p className="text-zinc-200">
                  {new Date(order.refunded_at).toLocaleString("th-TH")}
                </p>
              </div>
            )}
          </div>
          {refundSlipUrl && (
            <div>
              <p className="text-zinc-500 text-xs mb-2">{t('refundSlip')}</p>
              <div
                className="relative group cursor-pointer inline-block"
                onClick={() => onLightbox(refundSlipUrl)}
              >
                <img
                  src={refundSlipUrl}
                  alt="สลิปคืนเงิน"
                  className="w-24 h-28 object-cover rounded-lg border border-zinc-700 transition-opacity group-hover:opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/60 rounded-full p-2">
                    <ZoomIn size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refund Form */}
      {!isRefunded && !isRejected && !isFakeSlip && onRefund && (
        <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20 space-y-4">
          <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm uppercase">
            <DollarSign size={16} /> {t('refundCustomer')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">
                {t('refundAmountLabel')}
              </label>
              <input
                type="number"
                placeholder={order.total_price}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-500/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none placeholder-zinc-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">
                {t('refundChannelLabel')}
              </label>
              <select
                value={refundChannel}
                onChange={(e) => setRefundChannel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-500/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
              >
                <option value="">-- {t('selectCategory')} --</option>
                {REFUND_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
              <Upload size={11} /> {t('refundSlipLabel')}
            </label>
            {refundPreview ? (
              <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-700 rounded-xl p-3">
                <img
                  src={refundPreview}
                  alt="refund-slip"
                  className="w-14 h-16 object-cover rounded-lg border border-zinc-700 cursor-pointer"
                  onClick={() => onLightbox(refundPreview)}
                />
                <div className="flex-1">
                  <p className="text-green-400 text-xs font-bold">
                    {t('uploadSuccess')}
                  </p>
                  <button
                    onClick={() => {
                      setRefundFile(null);
                      setRefundPreview(null);
                    }}
                    className="text-zinc-500 hover:text-red-400 text-xs mt-1 transition-colors"
                  >
                    {t('removeChangeImage')}
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-zinc-700 hover:border-yellow-500/50 rounded-xl cursor-pointer transition-colors group">
                <Upload
                  size={16}
                  className="text-zinc-600 group-hover:text-yellow-400 transition-colors"
                />
                <span className="text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors">
                  {t('clickToUploadRefundSlip')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!refundChannel || refundLoading}
              className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {refundLoading ? t('processing') : t('confirmRefund')}
            </button>
            {onRejectRefund && (
              <button
                onClick={async () => {
                  setRefundLoading(true);
                  await onRejectRefund(order.id);
                  setRefundLoading(false);
                }}
                disabled={refundLoading}
                className="flex-1 py-3 bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-red-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Ban size={16} /> {t('rejectRefund')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Default export: combined (backward compat) ────────────────
const AdminCancelDetails = (props: Props) => (
  <div className="space-y-4">
    <CancelDetailsLeft order={props.order} />
    <CancelDetailsRight {...props} />
  </div>
);

export default AdminCancelDetails;
