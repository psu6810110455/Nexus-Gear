// features/orders/components/CancelOrderModal.tsx

import { useState } from "react";
import { X, AlertTriangle, Package } from "lucide-react";

interface Order {
  id: number;
  status: string;
  total_price: string;
  items: { product: { name: string; image_url: string }; quantity: number }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: (orderId: number, reason: string) => void;
}

const CANCEL_REASONS = [
  "เปลี่ยนใจไม่ต้องการสินค้าแล้ว",
  "สั่งซื้อผิดรายการ",
  "พบสินค้าราคาถูกกว่าจากที่อื่น",
  "ไม่สะดวกชำระเงิน",
  "อื่นๆ",
];

const CancelOrderModal = ({ isOpen, onClose, order, onConfirm }: Props) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const finalReason = reason === "อื่นๆ" ? customReason.trim() : reason;
  const canSubmit = finalReason.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    await onConfirm(order.id, finalReason);
    setLoading(false);
    setReason("");
    setCustom("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <article className="bg-[#0a0a0a] border border-red-900/50 rounded-2xl w-full max-w-md shadow-[0_0_30px_-5px_rgba(220,38,38,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="p-5 border-b border-zinc-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                ยกเลิกคำสั่งซื้อ
              </h2>
              <p className="text-zinc-500 text-xs">
                #{String(order.id).padStart(3, "0")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-hide">
          {/* รายการสินค้า */}
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-400 text-xs font-bold mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Package size={12} /> รายการที่จะยกเลิก
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={14} className="text-zinc-600" />
                    )}
                  </div>
                  <p className="text-zinc-300 text-sm truncate flex-1">
                    {item.product.name}
                  </p>
                  <span className="text-zinc-500 text-xs">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between">
              <span className="text-zinc-500 text-xs">ยอดรวม</span>
              <span className="text-red-400 font-bold text-sm">
                ฿{Number(order.total_price).toLocaleString()}
              </span>
            </div>
          </div>

          {/* เหตุผลยกเลิก */}
          <div>
            <p className="text-zinc-400 text-xs font-bold mb-2 uppercase tracking-widest">
              เหตุผลที่ยกเลิก *
            </p>
            <div className="space-y-2">
              {CANCEL_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    reason === r
                      ? "border-red-500/50 bg-red-500/5 text-white"
                      : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-red-500"
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
            {reason === "อื่นๆ" && (
              <textarea
                rows={3}
                placeholder="ระบุเหตุผล..."
                value={customReason}
                onChange={(e) => setCustom(e.target.value)}
                className="mt-2 w-full bg-zinc-900 border border-zinc-700 focus:border-red-500/50 text-zinc-200 text-sm rounded-xl px-4 py-3 resize-none outline-none placeholder-zinc-600 transition-colors"
              />
            )}
          </div>

          <p className="text-zinc-600 text-xs bg-zinc-900/50 border border-zinc-800 rounded-xl p-3">
            ⚠️ สามารถยกเลิกได้เฉพาะคำสั่งซื้อที่ยังไม่ได้รับการจัดส่ง (สถานะ:
            รอชำระเงิน / ชำระเงินแล้ว)
          </p>
        </div>

        {/* Footer */}
        <footer className="p-5 border-t border-zinc-900 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            ไม่ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all"
          >
            {loading ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default CancelOrderModal;
