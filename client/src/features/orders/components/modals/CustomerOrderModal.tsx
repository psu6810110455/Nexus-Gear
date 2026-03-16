// features/orders/components/CustomerOrderModal.tsx

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Truck, CreditCard, QrCode, ZoomIn } from "lucide-react";
import { getServerUrl } from "../../../shared/services/api";

import DeliveryTimeline, { getCarrier } from "../shared/DeliveryTimeline";
import OrderItemList from "../shared/OrderItemList";
import RefundStatusSection from "../shared/RefundStatusSection";

// ── Types ─────────────────────────────────────────────────────
interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: { name: string; image_url: string };
  rating?: number;
  review?: string;
}

interface Order {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
  shipping_address: string;
  items: OrderItem[];
  is_rated?: boolean;
  slip_image?: string | null;
  payment_method?: string | null;
  cancel_reason?: string | null;
  refund_amount?: number | null;
  refund_channel?: string | null;
  refund_slip?: string | null;
  refund_status?: string;
  refunded_at?: string | null;
  refund_bank_name?: string | null;
  refund_bank_account?: string | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmitRating: (
    orderId: number,
    ratings: Record<number, number>,
    reviews: Record<number, string>,
  ) => void;
}

// ── Component ─────────────────────────────────────────────────
const CustomerOrderModal = ({
  isOpen,
  onClose,
  order,
  onSubmitRating,
}: ModalProps) => {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [reviews, setReviews] = useState<Record<number, string>>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (order) {
      setRatings({});
      setReviews({});
      setLightboxSrc(null);
      setTimeout(() => contentRef.current?.scrollTo({ top: 0 }), 50);
    }
  }, [order]);

  // lock body scroll
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;left:0;right:0`;
      return () => {
        document.body.style.cssText = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const isCompletedAndNotRated =
    order.status === "completed" && !order.is_rated;
  const isCancelled = order.status === "cancelled";
  const carrier = getCarrier(order.status);
  const slip = order.slip_image
    ? getServerUrl(`/uploads/slips/${order.slip_image}`)
    : null;
  const method = order.payment_method;

  const handleStarClick = (itemId: number, star: number) => {
    if (order.is_rated) return;
    setRatings((prev) => ({ ...prev, [itemId]: star }));
  };

  const handleSubmit = () => {
    if (isCompletedAndNotRated) onSubmitRating(order.id, ratings, reviews);
    else onClose();
  };

  return createPortal(
    <>
      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxSrc}
            alt="ดูรูปภาพ"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
        <article className="bg-[#0a0a0a] border border-red-900/50 rounded-2xl w-full max-w-2xl shadow-[0_0_30px_-5px_rgba(220,38,38,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <header className="p-6 border-b border-zinc-900/50 flex justify-between items-start shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                รายละเอียดคำสั่งซื้อ
              </h2>
              <p className="text-red-600 font-bold mt-1 text-sm">
                #ORD{String(order.id).padStart(3, "0")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 p-2 rounded-full hover:bg-red-900/30"
            >
              <X size={20} />
            </button>
          </header>

          {/* Body */}
          <div
            ref={contentRef}
            className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-dark"
          >
            {/* Delivery Timeline */}
            <section className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <Truck size={12} /> สถานะการจัดส่ง
              </p>
              <DeliveryTimeline
                status={order.status}
                cancelReason={order.cancel_reason}
              />
              {carrier && (
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <span className="text-zinc-600 text-xs">บริษัทขนส่ง</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${carrier.cls}`}
                  >
                    <Truck size={11} /> {carrier.name}
                  </span>
                </div>
              )}
            </section>

            {/* Payment */}
            <section className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <CreditCard size={12} /> การชำระเงิน
              </p>
              <div className="flex items-start gap-4">
                {slip ? (
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setLightboxSrc(slip)}
                  >
                    <img
                      src={slip}
                      alt="สลิป"
                      className="w-20 h-24 object-cover rounded-lg border border-zinc-700 shrink-0 transition-opacity group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/60 rounded-full p-1.5">
                        <ZoomIn size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-zinc-900/60 border border-zinc-700/50 rounded-lg flex flex-col items-center justify-center shrink-0 gap-1">
                    <QrCode size={24} className="text-zinc-600" />
                    <p className="text-zinc-600 text-[9px]">ไม่มีสลิป</p>
                  </div>
                )}
                <div className="space-y-2 text-sm flex-1">
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-wider">
                      วิธีชำระ
                    </p>
                    <p className="text-zinc-200 font-bold">
                      {method === "qr"
                        ? "📱 QR Code"
                        : method
                          ? "🏦 โอนเงินธนาคาร"
                          : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-wider">
                      ยอดชำระ
                    </p>
                    <p className="text-red-400 font-black">
                      ฿{Number(order.total_price).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-wider">
                      วันที่สั่ง
                    </p>
                    <p className="text-zinc-400 text-xs">
                      {new Date(order.created_at).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Order Items */}
            <OrderItemList
              items={order.items}
              status={order.status}
              isRated={order.is_rated}
              defaultExpanded={order.status === "completed" || isCancelled}
              ratings={ratings}
              reviews={reviews}
              onStarClick={handleStarClick}
              onReviewChange={(id, text) =>
                setReviews((prev) => ({ ...prev, [id]: text }))
              }
            />

            {/* Shipping Address */}
            <section className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-red-500">
                <MapPin size={16} />
                <h3 className="font-bold text-sm">ที่อยู่สำหรับจัดส่ง</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed pl-6">
                {order.shipping_address || "ไม่ระบุที่อยู่"}
              </p>
            </section>

            {/* Total */}
            <div className="flex items-center justify-between px-1">
              <span className="text-zinc-500 text-sm">ยอดรวมทั้งสิ้น</span>
              <span className="text-white font-black text-xl">
                <span className="text-red-500 mr-0.5 text-base">฿</span>
                {Number(order.total_price).toLocaleString()}
              </span>
            </div>

            {/* Refund Status (cancelled only) */}
            {isCancelled && (
              <RefundStatusSection order={order} onLightbox={setLightboxSrc} />
            )}
          </div>

          {/* Footer */}
          <footer className="p-6 border-t border-zinc-900/50 shrink-0">
            <button
              onClick={handleSubmit}
              className={`w-full py-3.5 rounded-xl font-black tracking-wide transition-all active:scale-[0.98] ${
                isCompletedAndNotRated
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_16px_rgba(245,158,11,0.25)] hover:opacity-90"
                  : "bg-red-600 hover:bg-red-500 text-white"
              }`}
            >
              {isCompletedAndNotRated
                ? "⭐ ยืนยันการให้คะแนน"
                : "ปิดรายละเอียด"}
            </button>
          </footer>
        </article>
      </div>
    </>,
    document.body,
  );
};

export default CustomerOrderModal;
