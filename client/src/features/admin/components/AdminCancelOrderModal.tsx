// features/admin/components/AdminCancelOrderModal.tsx

import { useState } from "react";
import {
  X,
  Package,
  MapPin,
  Upload,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import type { Order } from "../../../shared/types";

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
}

const REFUND_CHANNELS = ["โอนผ่านธนาคาร", "คืนเงินผ่าน QR"];

const AdminCancelOrderModal = ({
  isOpen,
  onClose,
  order,
  onConfirm,
}: Props) => {
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundChannel, setRefundChannel] = useState("");
  const [refundEvidence, setRefundEvidence] = useState("");
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [restock, setRestock] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const canSubmit = reason.trim() && refundChannel && restock !== null;

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
      reason,
      refundAmount,
      refundChannel,
      refundEvidence,
      restock: restock!,
    });
    setLoading(false);
    // reset
    setReason("");
    setRefundAmount("");
    setRefundChannel("");
    setRefundEvidence("");
    setEvidencePreview(null);
    setRestock(null);
  };

  const slipUrl = order.slip_image
    ? `http://localhost:3000/uploads/slips/${order.slip_image}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <article className="bg-[#0f0f0f] border border-[#FF0000]/30 rounded-2xl w-full max-w-2xl shadow-[0_0_40px_-5px_rgba(220,38,38,0.3)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* ── Header ── */}
        <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center shrink-0 bg-gradient-to-r from-red-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Orbitron'] tracking-wide">
                ยกเลิกคำสั่งซื้อ
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

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 scrollbar-hide font-['Kanit']">
          {/* ── ข้อมูลผู้ซื้อ + รายการสินค้า ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ผู้ซื้อ + ที่อยู่ */}
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 space-y-3">
              <p className="text-[#FF0000] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> ผู้ซื้อ & ที่อยู่
              </p>
              <div>
                <p className="text-white font-bold">
                  {order.user?.name || "ไม่ระบุ"}
                </p>
                <p className="text-zinc-500 text-xs">
                  {order.user?.email || "-"}
                </p>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  {order.shipping_address}
                </p>
              </div>
            </div>

            {/* รายการสินค้า */}
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <p className="text-[#FF0000] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
                <Package size={12} /> รายการสินค้า
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={12} className="text-zinc-600" />
                      )}
                    </div>
                    <p className="text-zinc-300 text-xs flex-1 truncate">
                      {item.product.name}
                    </p>
                    <div className="text-right shrink-0">
                      <p className="text-zinc-500 text-[10px]">
                        x{item.quantity}
                      </p>
                      <p className="text-red-400 text-xs font-bold">
                        ฿{Number(item.price_at_purchase).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between">
                <span className="text-zinc-500 text-xs">ยอดรวมทั้งสิ้น</span>
                <span className="text-red-400 font-bold text-sm">
                  ฿{Number(order.total_price).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── สลิปการชำระเงินจาก Payment ── */}
          {slipUrl && (
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
              <p className="text-[#FF0000] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
                <CreditCard size={12} /> หลักฐานการชำระเงินของลูกค้า
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={slipUrl}
                  alt="slip"
                  className="w-24 h-28 object-cover rounded-lg border border-zinc-700"
                />
                <div className="text-xs text-zinc-400 space-y-1">
                  <p>
                    ช่องทาง:{" "}
                    <span className="text-zinc-200">
                      {order.payment_method === "qr"
                        ? "QR Code"
                        : "โอนเงินธนาคาร"}
                    </span>
                  </p>
                  <p>
                    วันที่สั่งซื้อ:{" "}
                    <span className="text-zinc-200">
                      {new Date(order.created_at).toLocaleString("th-TH")}
                    </span>
                  </p>
                  <p>
                    ยอดชำระ:{" "}
                    <span className="text-red-400 font-bold">
                      ฿{Number(order.total_price).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── เหตุผลยกเลิก ── */}
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

          {/* ── คืนสต็อกสินค้า ── */}
          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-300 text-sm font-bold mb-3">
              คืนสต็อกสินค้า (Restock items): *
            </p>
            <div className="flex gap-4">
              <label
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-bold ${
                  restock === true
                    ? "border-green-500/60 bg-green-500/10 text-green-400"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                }`}
              >
                <input
                  type="radio"
                  name="restock"
                  checked={restock === true}
                  onChange={() => setRestock(true)}
                  className="accent-green-500"
                />
                ✅ ใช่ — คืนสต็อก
              </label>
              <label
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-bold ${
                  restock === false
                    ? "border-red-500/60 bg-red-500/10 text-red-400"
                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                }`}
              >
                <input
                  type="radio"
                  name="restock"
                  checked={restock === false}
                  onChange={() => setRestock(false)}
                  className="accent-red-500"
                />
                ❌ ไม่ใช่ — ไม่คืนสต็อก
              </label>
            </div>
          </div>

          {/* ── ข้อมูลการคืนเงิน ── */}
          <div className="space-y-3">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              ข้อมูลการคืนเงิน
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 text-xs mb-1 block">
                  ยอดเงินที่คืน (฿)
                </label>
                <input
                  type="number"
                  placeholder={order.total_price}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF0000]/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none placeholder-zinc-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-xs mb-1 block">
                  ช่องทางการคืนเงิน *
                </label>
                <select
                  value={refundChannel}
                  onChange={(e) => setRefundChannel(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF0000]/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
                >
                  <option value="">-- เลือก --</option>
                  {REFUND_CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* อัปโหลดหลักฐานคืนเงิน */}
            <div>
              <label className="text-zinc-500 text-xs mb-1 block flex items-center gap-1">
                <Upload size={11} /> หลักฐานการคืนเงิน (รูปภาพ)
              </label>
              {evidencePreview ? (
                <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-700 rounded-xl p-3">
                  <img
                    src={evidencePreview}
                    alt="evidence"
                    className="w-14 h-16 object-cover rounded-lg border border-zinc-700"
                  />
                  <div className="flex-1">
                    <p className="text-green-400 text-xs font-bold">
                      อัปโหลดสำเร็จ ✓
                    </p>
                    <button
                      onClick={() => {
                        setEvidencePreview(null);
                        setRefundEvidence("");
                      }}
                      className="text-zinc-500 hover:text-red-400 text-xs mt-1 transition-colors"
                    >
                      ลบ / เปลี่ยนรูป
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-zinc-700 hover:border-[#FF0000]/50 rounded-xl cursor-pointer transition-colors group">
                  <Upload
                    size={16}
                    className="text-zinc-600 group-hover:text-red-400 transition-colors"
                  />
                  <span className="text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors">
                    คลิกเพื่ออัปโหลดหลักฐาน
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEvidenceUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
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
            {loading ? "กำลังดำเนินการ..." : "⚠️ ยืนยันยกเลิกคำสั่งซื้อ"}
          </button>
        </footer>
      </article>
    </div>
  );
};

export default AdminCancelOrderModal;
