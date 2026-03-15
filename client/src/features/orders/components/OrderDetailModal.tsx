// features/orders/components/OrderDetailModal.tsx

import { useState } from "react";
import { X, MapPin, Package, ZoomIn } from "lucide-react";
import { type Order } from "../../../shared/types";

import AdminDeliveryTimeline from "../../admin/components/orders/AdminDeliveryTimeline";
import AdminSlipViewer from "../../admin/components/orders/AdminSlipViewer";
import AdminCancelDetails from "../../admin/components/orders/AdminCancelDetails";

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

// ── Image Lightbox ─────────────────────────────────────────────
const ImageLightbox = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 md:left-64 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
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

  const getThaiStatus = (status: string) => {
    if (status === "cancelled" && isReturnOrder) return "คืนสินค้า";
    return (
      {
        pending: "รอตรวจสอบ",
        paid: "ชำระเงินแล้ว",
        to_ship: "เตรียมจัดส่ง",
        shipped: "จัดส่งแล้ว",
        completed: "สำเร็จ",
        cancelled: "ยกเลิก",
      }[status] || status
    );
  };

  return (
    <>
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      <div className="fixed inset-0 md:left-64 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-[#0f0f0f] border border-red-500/30 w-full max-w-4xl rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.2)] overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
          {/* Header */}
          <header className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-wider">
                  รายละเอียดคำสั่งซื้อ
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
                    isReturnOrder
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/20"
                      : isCancelled
                        ? "bg-red-500/20 text-red-400 border-red-500/20"
                        : "bg-green-500/20 text-green-500 border-green-500/20"
                  }`}
                >
                  {getThaiStatus(order.status)}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">
                รหัสคำสั่งซื้อ: ORD-{new Date().getFullYear() + 543}-
                {String(order.id).padStart(3, "0")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </header>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1">
            {/* Left: Timeline + Address + Items */}
            <div className="space-y-6">
              <AdminDeliveryTimeline
                status={order.status}
                cancelReason={order.cancel_reason}
              />

              {/* Address */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-sm uppercase">
                  <MapPin size={16} /> ที่อยู่ในการจัดส่ง
                </div>
                <p className="text-white font-medium">
                  {order.user?.name || "ไม่ระบุชื่อ"}
                </p>
                <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                  {order.shipping_address}
                </p>
              </div>

              {/* Items */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-sm uppercase">
                  <Package size={16} /> รายการสินค้า
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 shrink-0 flex items-center justify-center">
                          {item.product.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={16} className="text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-zinc-500 text-xs">
                            x{item.quantity} ชิ้น
                          </p>
                        </div>
                      </div>
                      <p className="text-red-400 font-bold">
                        ฿{Number(item.price_at_purchase).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel details (left col, cancelled only) */}
              {isCancelled && (
                <AdminCancelDetails
                  order={order}
                  onLightbox={setLightboxSrc}
                  onRefund={onRefund}
                  onRejectRefund={onRejectRefund}
                />
              )}
            </div>

            {/* Right: Slip + Total + Actions */}
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
      </div>
    </>
  );
};

export default OrderDetailModal;
