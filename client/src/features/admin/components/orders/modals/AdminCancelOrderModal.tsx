// features/admin/components/AdminCancelOrderModal.tsx

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Order } from "../../../../../shared/types";

import CancelOrderSummary from "./CancelOrderSummary";
import { RefundForm, RejectSection } from "./CancelRefundSection";

// ── Types ─────────────────────────────────────────────────────
interface CancelPayload {
  reason: string;
  refundAmount: string;
  refundChannel: string;
  refundEvidence: string;
  restock: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (orderId: number, payload: CancelPayload) => Promise<void>;
  mode?: "cancel" | "quick_cancel";
}

// ── Component ─────────────────────────────────────────────────
const AdminCancelOrderModal = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  mode = "cancel",
}: Props) => {
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundChannel, setRefundChannel] = useState("");
  const [refundEvidence, setRefundEvidence] = useState("");
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [restock, setRestock] = useState<boolean | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const isQuickCancel = mode === "quick_cancel";
  const canSubmit = isQuickCancel
    ? rejectReason.trim().length > 0
    : reason.trim() && refundChannel && restock !== null;

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEvidencePreview(result);
      setRefundEvidence(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    await onConfirm(order.id, {
      reason: isQuickCancel ? rejectReason : reason,
      refundAmount: isQuickCancel ? "0" : refundAmount,
      refundChannel: isQuickCancel ? "ปฏิเสธ" : refundChannel,
      refundEvidence: isQuickCancel ? "" : refundEvidence,
      restock: isQuickCancel ? true : restock!,
    });
    setLoading(false);
    setReason("");
    setRefundAmount("");
    setRefundChannel("");
    setRefundEvidence("");
    setEvidencePreview(null);
    setRestock(null);
    setRejectReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <article className="bg-[#0f0f0f] border border-[#FF0000]/30 rounded-2xl w-full max-w-2xl shadow-[0_0_40px_-5px_rgba(220,38,38,0.3)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center shrink-0 bg-gradient-to-r from-red-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Orbitron'] tracking-wide">
                {isQuickCancel ? "ปฏิเสธการคืนเงิน" : "ยกเลิกคำสั่งซื้อ"}
              </h2>
              <p className="text-zinc-500 text-xs font-['Kanit']">
                ORD-{new Date().getFullYear() + 543}-
                {String(order.id).padStart(3, "0")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </header>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 scrollbar-hide font-['Kanit']">
          {/* Buyer + Items + Slip */}
          <CancelOrderSummary order={order} />

          {/* เหตุผลยกเลิก (cancel mode เท่านั้น) */}
          {!isQuickCancel && (
            <div>
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-widest block mb-2">
                เหตุผลการยกเลิก *
              </label>
              <textarea
                rows={3}
                placeholder="ระบุเหตุผลในการยกเลิกคำสั่งซื้อ..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF0000]/50 text-zinc-200 text-sm rounded-xl px-4 py-3 resize-none outline-none placeholder-zinc-600 transition-colors"
              />
            </div>
          )}

          {/* Restock (cancel mode เท่านั้น) */}
          {!isQuickCancel && (
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <p className="text-zinc-300 text-sm font-bold mb-3">
                คืนสต็อกสินค้า (Restock items): *
              </p>
              <div className="flex gap-4">
                {[
                  {
                    val: true,
                    label: "✅ ใช่ — คืนสต็อก",
                    active:
                      "border-green-500/60 bg-green-500/10 text-green-400",
                  },
                  {
                    val: false,
                    label: "❌ ไม่ใช่ — ไม่คืนสต็อก",
                    active: "border-red-500/60 bg-red-500/10 text-red-400",
                  },
                ].map(({ val, label, active }) => (
                  <label
                    key={String(val)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-bold ${
                      restock === val
                        ? active
                        : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="restock"
                      checked={restock === val}
                      onChange={() => setRestock(val)}
                      className={val ? "accent-green-500" : "accent-red-500"}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Refund form หรือ Reject section */}
          {isQuickCancel ? (
            <RejectSection
              rejectReason={rejectReason}
              onRejectReasonChange={setRejectReason}
            />
          ) : (
            <RefundForm
              totalPrice={order.total_price}
              refundAmount={refundAmount}
              refundChannel={refundChannel}
              evidencePreview={evidencePreview}
              onAmountChange={setRefundAmount}
              onChannelChange={setRefundChannel}
              onEvidenceUpload={handleEvidenceUpload}
              onEvidenceClear={() => {
                setEvidencePreview(null);
                setRefundEvidence("");
              }}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-white/10 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-['Kanit']"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex-[2] py-3 rounded-xl font-bold text-sm bg-[#FF0000] hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all font-['Kanit'] flex items-center justify-center gap-2"
          >
            {loading
              ? "กำลังดำเนินการ..."
              : isQuickCancel
                ? "🚫 ยืนยันปฏิเสธการคืนเงิน"
                : "⚠️ ยืนยันยกเลิกคำสั่งซื้อ"}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default AdminCancelOrderModal;
