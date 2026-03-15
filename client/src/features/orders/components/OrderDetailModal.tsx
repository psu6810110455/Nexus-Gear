// features/admin/components/orders/modals/OrderDetailModal.tsx

import { useState } from "react";
import { X, MapPin, Package } from "lucide-react";
import { type Order } from "../../../shared/types";

import AdminDeliveryTimeline from "../../admin/components/orders/AdminDeliveryTimeline";
import AdminSlipViewer from "../../admin/components/orders/AdminSlipViewer";
import {
  CancelDetailsLeft,
  CancelDetailsRight,
} from "../../admin/components/orders/AdminCancelDetails";

// ── Types ─────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (id: number, status: string) => void;
  onRefund?: (orderId: number, formData: FormData) => Promise<void>;
  onQuickCancel?: (orderId: number) => Promise<void>;
  onRejectRefund?: (orderId: number) => Promise<void>;
}

// ── Lightbox ──────────────────────────────────────────────────
const ImageLightbox = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 md:left-64 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
    >
      <X size={24} />
    </button>
    <img
      src={src}
      alt="ดูรูปภาพ"
      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

// ── Status badge ──────────────────────────────────────────────
const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  paid: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  to_ship: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  returned: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const THAI_STATUS: Record<string, string> = {
  pending: "รอตรวจสอบ",
  paid: "ชำระเงินแล้ว",
  to_ship: "เตรียมจัดส่ง",
  shipped: "จัดส่งแล้ว",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
  returned: "คืนสินค้า",
};

// ── Section Header ─────────────────────────────────────────────
const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.15em]">
    {label}
  </p>
);

// ── Component ─────────────────────────────────────────────────
const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onRefund,
  onQuickCancel,
  onRejectRefund,
}: Props) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [quickCancelLoading, setQuickCancelLoading] = useState(false);

  if (!isOpen || !order) return null;

  const isCancelled = order.status === "cancelled";
  const isReturnOrder =
    isCancelled && !!order.cancel_reason?.startsWith("ขอคืนสินค้า:");
  const thaiStatus = isReturnOrder
    ? "คืนสินค้า"
    : THAI_STATUS[order.status] || order.status;
  const badgeCls = isReturnOrder
    ? STATUS_BADGE.returned
    : (STATUS_BADGE[order.status] ??
      "bg-zinc-800 text-zinc-400 border-zinc-700");

  return (
    <>
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      <div className="fixed inset-0 md:left-64 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-[#0f0f0f] border border-red-500/20 w-full max-w-3xl rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.15)] overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
          {/* ── Header ── */}
          <header className="px-6 py-4 border-b border-white/8 flex justify-between items-center bg-gradient-to-r from-red-900/15 to-transparent shrink-0">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white">
                รายละเอียดคำสั่งซื้อ
              </h2>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeCls}`}
              >
                {thaiStatus}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-zinc-500 text-xs hidden sm:block">
                ORD-{new Date().getFullYear() + 543}-
                {String(order.id).padStart(3, "0")}
                {order.user?.name && (
                  <span className="ml-2 text-zinc-600">
                    · {order.user.name}
                  </span>
                )}
              </p>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/8 rounded-full transition-colors text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </header>

          {/* ── Body ── */}
          <div className="overflow-y-auto flex-1">
            {/* ═══ ส่วนบน ═══ */}
            <div className="p-6 space-y-4">
              <SectionLabel label="ข้อมูลคำสั่งซื้อ" />

              {/* 2 col: ซ้าย = Timeline + ที่อยู่ + สินค้า / ขวา = Slip + ปุ่ม */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* ── ซ้าย ── */}
                <div className="space-y-4">
                  <AdminDeliveryTimeline
                    status={order.status}
                    cancelReason={order.cancel_reason}
                  />

                  {/* ที่อยู่ */}
                  <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="flex items-center gap-2 text-red-500 px-4 py-3 border-b border-zinc-800/50 font-bold text-xs uppercase tracking-widest">
                      <MapPin size={13} /> ที่อยู่ในการจัดส่ง
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-white text-sm font-semibold">
                        {order.user?.name || "ไม่ระบุชื่อ"}
                      </p>
                      <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                        {order.shipping_address}
                      </p>
                    </div>
                  </div>

                  {/* รายการสินค้า */}
                  <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="flex items-center gap-2 text-red-500 px-4 py-3 border-b border-zinc-800/50 font-bold text-xs uppercase tracking-widest">
                      <Package size={13} /> รายการสินค้า
                      <span className="ml-auto text-zinc-600 font-normal normal-case">
                        {order.items.length} รายการ
                      </span>
                    </div>
                    <div className="divide-y divide-zinc-800/40">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 shrink-0 flex items-center justify-center">
                              {item.product.image_url ? (
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={14} className="text-zinc-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {item.product.name}
                              </p>
                              <p className="text-zinc-500 text-xs mt-0.5">
                                x{item.quantity} ชิ้น
                              </p>
                            </div>
                          </div>
                          <p className="text-red-400 font-bold text-sm shrink-0 ml-3">
                            ฿{Number(item.price_at_purchase).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30">
                      <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        ยอดรวมทั้งสิ้น
                      </span>
                      <span className="text-red-500 font-black text-lg">
                        ฿{Number(order.total_price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── ขวา: Slip + ยอด + ปุ่ม ── */}
                <AdminSlipViewer
                  order={order}
                  onLightbox={setLightboxSrc}
                  onUpdateStatus={onUpdateStatus}
                  onQuickCancel={onQuickCancel}
                  onClose={onClose}
                  quickCancelLoading={quickCancelLoading}
                  setQuickCancelLoading={setQuickCancelLoading}
                />
              </div>
            </div>

            {/* ═══ เส้นแบ่ง (cancelled only) ═══ */}
            {isCancelled && (
              <>
                <div className="h-px bg-zinc-800/80 mx-6" />

                {/* ═══ ส่วนล่าง ═══ */}
                <div className="p-6 space-y-4">
                  <SectionLabel label="รายละเอียดการยกเลิก / คืนเงิน" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* ซ้าย: Cancel Reason */}
                    <CancelDetailsLeft order={order} />

                    {/* ขวา: BankInfo + RefundDone/Form */}
                    <CancelDetailsRight
                      order={order}
                      onLightbox={setLightboxSrc}
                      onRefund={onRefund}
                      onRejectRefund={onRejectRefund}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;
