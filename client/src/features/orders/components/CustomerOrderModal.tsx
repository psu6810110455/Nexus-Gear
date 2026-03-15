import {
  X,
  MapPin,
  Package,
  Truck,
  Star,
  Clock,
  CheckCircle2,
  PackageCheck,
  Ban,
  RotateCcw,
  CreditCard,
  QrCode,
  ZoomIn,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Banknote,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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

// ── Delivery Timeline ─────────────────────────────────────────
const STEPS = [
  { key: "pending", label: "แจ้งชำระเงิน", icon: Clock },
  { key: "paid", label: "เตรียมพัสดุ", icon: PackageCheck },
  { key: "shipped", label: "กำลังจัดส่ง", icon: Truck },
  { key: "completed", label: "สำเร็จ", icon: CheckCircle2 },
];
const toStepKey = (s: string) => (s === "to_ship" ? "paid" : s);

const DeliveryTimeline = ({
  status,
  cancelReason,
}: {
  status: string;
  cancelReason?: string | null;
}) => {
  if (status === "cancelled") {
    const isReturn = cancelReason?.startsWith("ขอคืนสินค้า:") ?? false;
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${
          isReturn
            ? "bg-orange-500/10 border-orange-500/20"
            : "bg-red-500/10 border-red-500/20"
        }`}
      >
        {isReturn ? (
          <RotateCcw size={14} className="text-orange-400 shrink-0" />
        ) : (
          <Ban size={14} className="text-red-400 shrink-0" />
        )}
        <p
          className={`text-sm font-bold ${isReturn ? "text-orange-400" : "text-red-400"}`}
        >
          {isReturn ? "คืนสินค้า" : "คำสั่งซื้อถูกยกเลิกแล้ว"}
        </p>
      </div>
    );
  }
  const cur = STEPS.findIndex((s) => s.key === toStepKey(status));
  return (
    <div className="flex items-start justify-between px-1">
      {STEPS.map(({ key, label, icon: Icon }, idx) => {
        const done = cur >= idx,
          current = cur === idx;
        return (
          <div
            key={key}
            className="flex-1 flex flex-col items-center gap-1.5 relative"
          >
            {idx < STEPS.length - 1 && (
              <div
                className={`absolute top-3.5 left-1/2 w-full h-px z-0 ${done && cur > idx ? "bg-green-500/50" : "bg-zinc-700/50"}`}
              />
            )}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${
                current
                  ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  : done
                    ? "bg-green-500/20 border-green-500/50"
                    : "bg-zinc-800 border-zinc-700"
              }`}
            >
              <Icon
                size={12}
                className={done ? "text-green-300" : "text-zinc-600"}
              />
            </div>
            <p
              className={`text-[10px] font-bold text-center leading-tight ${current ? "text-green-400" : done ? "text-zinc-400" : "text-zinc-600"}`}
            >
              {label}
              {current && (
                <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mx-auto mt-0.5" />
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const getCarrier = (status: string) => {
  if (status === "shipped" || status === "completed")
    return {
      name: "Kerry Express",
      cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    };
  if (status === "to_ship")
    return {
      name: "กำลังจัดเตรียม",
      cls: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    };
  return null;
};

const CustomerOrderModal = ({
  isOpen,
  onClose,
  order,
  onSubmitRating,
}: ModalProps) => {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [reviews, setReviews] = useState<Record<number, string>>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (order) {
      setRatings({});
      setReviews({});
      setLightboxSrc(null);
      // auto-expand products for completed (rating) or cancelled
      setProductsExpanded(
        order.status === "completed" || order.status === "cancelled",
      );
      // scroll content to top when order changes
      setTimeout(() => contentRef.current?.scrollTo({ top: 0 }), 50);
    }
  }, [order]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const isCompletedAndNotRated =
    order.status === "completed" && !order.is_rated;
  const carrier = getCarrier(order.status);
  const slip = order.slip_image
    ? `http://localhost:3000/uploads/slips/${order.slip_image}`
    : null;
  const method = order.payment_method;
  const isCancelled = order.status === "cancelled";
  const isRefunded = order.refund_status === "refunded";
  const isRejected = order.refund_status === "rejected";
  const refundSlipUrl = order.refund_slip
    ? `http://localhost:3000/uploads/slips/${order.refund_slip}`
    : null;

  // ฟังก์ชันเวลากดดาว
  const handleStarClick = (itemId: number, star: number) => {
    if (order.is_rated) return; // ถ้าเคยให้แล้ว กดไม่ได้
    setRatings((prev) => ({ ...prev, [itemId]: star }));
  };

  const handleSubmit = () => {
    if (isCompletedAndNotRated) {
      onSubmitRating(order.id, ratings, reviews);
    } else {
      onClose();
    }
  };

  return createPortal(
    <>
      {/* Image Lightbox */}
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
        <article className="bg-[#0a0a0a] border border-red-900/50 rounded-2xl w-full max-w-2xl shadow-[0_0_30px_-5px_rgba(220,38,38,0.2)] overflow-hidden relative flex flex-col max-h-[90vh]">
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

          <div
            ref={contentRef}
            className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-dark"
          >
            {/* ── Delivery Timeline + Carrier ── */}
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

            {/* ── Payment info ── แสดงเสมอ slip/method ถ้ามี หรือ placeholder ถ้าไม่มี */}
            <section className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <CreditCard size={12} /> การชำระเงิน
              </p>
              <div className="flex items-start gap-4">
                {/* slip image หรือ QR placeholder */}
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
                {/* ข้อมูลชำระ */}
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

            {/* ── รายการสินค้า (collapsible) ── */}
            <section>
              <button
                type="button"
                onClick={() => setProductsExpanded((v) => !v)}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2 text-red-500">
                  <Package size={16} />
                  <h3 className="font-bold text-sm">
                    รายการสินค้า ({order.items?.length || 0})
                  </h3>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-zinc-500 transition-transform ${productsExpanded ? "rotate-180" : ""}`}
                />
              </button>
              {productsExpanded && (
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#121212] border border-zinc-800/80 p-4 rounded-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 shrink-0">
                          {item.product?.image_url ? (
                            <img
                              src={item.product.image_url}
                              alt={item.product?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={18} className="text-zinc-700" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm line-clamp-2">
                            {item.product?.name || "สินค้า"}
                          </p>
                          <p className="text-zinc-500 text-xs mt-1">
                            จำนวน {item.quantity} ชิ้น
                          </p>
                          {order.status === "completed" && (
                            <div className="mt-3 space-y-2">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const currentRating = order.is_rated
                                    ? item.rating || 5
                                    : ratings[item.id] || 0;
                                  return (
                                    <Star
                                      key={star}
                                      size={18}
                                      className={`transition-transform ${!order.is_rated ? "cursor-pointer hover:scale-110" : ""} ${star <= currentRating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"}`}
                                      onClick={() =>
                                        handleStarClick(item.id, star)
                                      }
                                    />
                                  );
                                })}
                              </div>
                              {!order.is_rated && (
                                <textarea
                                  rows={2}
                                  placeholder="เขียนรีวิวสินค้า (ไม่บังคับ)..."
                                  value={reviews[item.id] || ""}
                                  onChange={(e) =>
                                    setReviews((prev) => ({
                                      ...prev,
                                      [item.id]: e.target.value,
                                    }))
                                  }
                                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-500 text-zinc-200 text-xs rounded-lg px-3 py-2 resize-none outline-none placeholder-zinc-600 transition-colors"
                                />
                              )}
                              {order.is_rated && item.review && (
                                <p className="text-xs text-zinc-500 italic">
                                  "{item.review}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-red-500 font-bold text-base whitespace-nowrap ml-4">
                        ฿{Number(item.price_at_purchase).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── ที่อยู่จัดส่ง ── */}
            <section className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-red-500">
                <MapPin size={16} />
                <h3 className="font-bold text-sm">ที่อยู่สำหรับจัดส่ง</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed pl-6">
                {order.shipping_address || "ไม่ระบุที่อยู่"}
              </p>
            </section>

            {/* ── ยอดรวม ── */}
            <div className="flex items-center justify-between px-1">
              <span className="text-zinc-500 text-sm">ยอดรวมทั้งสิ้น</span>
              <span className="text-white font-black text-xl">
                <span className="text-red-500 mr-0.5 text-base">฿</span>
                {Number(order.total_price).toLocaleString()}
              </span>
            </div>

            {/* ── Cancel Details + Refund Timeline (เฉพาะ cancelled) ── */}
            {isCancelled && (
              <section className="space-y-3">
                {/* Refund Timeline */}
                <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
                  <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <RefreshCw size={12} /> สถานะการคืนเงิน
                  </p>
                  <div className="flex items-center gap-0">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${"bg-yellow-500 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"}`}
                      >
                        <AlertTriangle size={14} className="text-yellow-900" />
                      </div>
                      <p className="text-[10px] font-bold mt-1.5 text-center text-yellow-400">
                        แจ้งการคืนเงิน
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
                            className={
                              isRefunded ? "text-green-900" : "text-zinc-600"
                            }
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
                    <p className="text-zinc-300 text-sm">
                      {order.cancel_reason}
                    </p>
                  </div>
                )}

                {/* Rejected Refund Notice */}
                {isRejected && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <Ban size={12} /> ปฏิเสธการคืนเงิน
                    </p>
                    <p className="text-zinc-300 text-sm">
                      แอดมินตรวจสอบแล้วพบว่าหลักฐานไม่ถูกต้อง
                      จึงปฏิเสธการคืนเงินสำหรับคำสั่งซื้อนี้
                    </p>
                  </div>
                )}

                {/* Refund Details (if refunded) */}
                {isRefunded && (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 space-y-2">
                    <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <CheckCircle2 size={12} /> ข้อมูลการคืนเงิน
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-zinc-600 text-[10px]">
                          ยอดเงินที่คืน
                        </p>
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
                          <p className="text-zinc-600 text-[10px]">
                            วันที่คืนเงิน
                          </p>
                          <p className="text-zinc-300 text-xs">
                            {new Date(order.refunded_at).toLocaleString(
                              "th-TH",
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                    {refundSlipUrl && (
                      <div
                        className="relative group cursor-pointer inline-block mt-2"
                        onClick={() => setLightboxSrc(refundSlipUrl)}
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

                {/* ── Customer Bank Info (read-only) ── */}
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
            )}
          </div>

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
