import { useState } from "react";
import {
  X,
  MapPin,
  FileText,
  Package,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  Star,
  Ban,
  Upload,
  DollarSign,
  ZoomIn,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { type Order } from "../../../shared/types";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (id: number, status: string) => void;
  onRefund?: (orderId: number, formData: FormData) => Promise<void>;
  onQuickCancel?: (orderId: number) => Promise<void>;
  onRejectRefund?: (orderId: number) => Promise<void>;
}

// ── Delivery Timeline ──────────────────────────────────────────
const DELIVERY_STEPS = [
  { key: "pending", label: "แจ้งชำระเงิน", icon: Clock },
  { key: "paid", label: "เตรียมพัสดุ", icon: Package },
  { key: "to_ship", label: "เตรียมจัดส่ง", icon: PackageCheck },
  { key: "shipped", label: "กำลังจัดส่ง", icon: Truck },
  { key: "completed", label: "สำเร็จ", icon: Star },
];

const STATUS_ORDER = ["pending", "paid", "to_ship", "shipped", "completed"];

const DeliveryTimeline = ({
  status,
  cancelReason,
}: {
  status: string;
  cancelReason?: string | null;
}) => {
  const isCancelled = status === "cancelled";
  const isReturn = isCancelled && !!cancelReason?.startsWith("ขอคืนสินค้า:");
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-2 text-red-500 mb-4 font-bold text-sm uppercase">
        <Truck size={16} /> สถานะการจัดส่ง
      </div>

      {isCancelled ? (
        isReturn ? (
          <div className="flex items-center gap-3 px-3 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <RotateCcw size={18} className="text-orange-400 shrink-0" />
            <div>
              <p className="text-orange-400 font-bold text-sm">คืนสินค้า</p>
              <p className="text-zinc-500 text-xs mt-0.5">ลูกค้าขอคืนสินค้า</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <Ban size={18} className="text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 font-bold text-sm">ยกเลิกคำสั่งซื้อ</p>
              <p className="text-zinc-500 text-xs mt-0.5">
                คำสั่งซื้อนี้ถูกยกเลิกแล้ว
              </p>
            </div>
          </div>
        )
      ) : (
        <ol className="relative ml-3">
          {DELIVERY_STEPS.map(({ key, label, icon: Icon }, idx) => {
            const isDone = currentIdx >= idx;
            const isCurrent = currentIdx === idx;

            return (
              <li
                key={key}
                className="flex items-start gap-3 pb-5 last:pb-0 relative"
              >
                {/* vertical line */}
                {idx < DELIVERY_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-6 w-0.5 h-full -translate-x-1/2 ${
                      currentIdx > idx ? "bg-green-500/60" : "bg-zinc-700"
                    }`}
                  />
                )}
                {/* dot */}
                <div
                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCurrent
                      ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                      : isDone
                        ? "bg-green-500/30 border-green-500/60"
                        : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <Icon
                    size={12}
                    className={isDone ? "text-green-300" : "text-zinc-600"}
                  />
                </div>
                {/* label */}
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-bold ${isCurrent ? "text-green-400" : isDone ? "text-zinc-300" : "text-zinc-600"}`}
                  >
                    {label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                      สถานะปัจจุบัน
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

// ── Image Lightbox ─────────────────────────────────────────────
const ImageLightbox = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
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
      alt={alt}
      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

const REFUND_CHANNELS = ["โอนผ่านธนาคาร", "คืนเงินผ่าน QR"];

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onRefund,
  onQuickCancel,
  onRejectRefund,
}: OrderDetailModalProps) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundChannel, setRefundChannel] = useState("");
  const [refundFile, setRefundFile] = useState<File | null>(null);
  const [refundPreview, setRefundPreview] = useState<string | null>(null);
  const [refundLoading, setRefundLoading] = useState(false);
  const [quickCancelLoading, setQuickCancelLoading] = useState(false);

  if (!isOpen || !order) return null;

  const isReturnOrder =
    order.status === "cancelled" &&
    !!order.cancel_reason?.startsWith("ขอคืนสินค้า:");

  const getThaiStatus = (status: string) => {
    if (status === "cancelled" && isReturnOrder) return "คืนสินค้า";
    const thStatus: Record<string, string> = {
      pending: "รอตรวจสอบ",
      paid: "ชำระเงินแล้ว",
      to_ship: "เตรียมจัดส่ง",
      shipped: "จัดส่งแล้ว",
      completed: "สำเร็จ",
      cancelled: "ยกเลิก",
    };
    return thStatus[status] || status;
  };

  // ฟังก์ชันคำนวณสถานะเพื่อแสดงปุ่ม Action ที่เหมาะสม
  const renderActionButtons = () => {
    switch (order.status) {
      case "pending":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "paid")}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-orange-900/50 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            ยืนยันการโอนเงิน
          </button>
        );
      case "paid":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "to_ship")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-900/50"
          >
            เตรียมจัดส่ง
          </button>
        );
      case "to_ship":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "shipped")}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-indigo-900/50"
          >
            ยืนยันการส่งของ
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "completed")}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-900/50"
          >
            สำเร็จ
          </button>
        );
      default:
        return null;
    }
  };

  const handleRefundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRefundFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setRefundPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRefundSubmit = async () => {
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

  const slipUrl = order.slip_image
    ? `http://localhost:3000/uploads/slips/${order.slip_image}`
    : null;
  const refundSlipUrl = order.refund_slip
    ? `http://localhost:3000/uploads/slips/${order.refund_slip}`
    : null;
  const isCancelled = order.status === "cancelled";
  const isRefunded = order.refund_status === "refunded";
  const isRejected = order.refund_status === "rejected";
  // ยกเลิกด้วยเหตุผลสลิปปลอม → ปฏิเสธการคืนเงินทันที ไม่แสดง refund form
  const isFakeSlip = isCancelled && !!order.cancel_reason?.includes("สลิปปลอม");

  return (
    <>
      {/* Image Lightbox */}
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt="ดูรูปภาพ"
          onClose={() => setLightboxSrc(null)}
        />
      )}
      {/* Backdrop */}
      <div className="fixed inset-0 md:left-64 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        {/* Modal Card */}
        <div className="bg-[#0f0f0f] border border-red-500/30 w-full max-w-4xl rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.2)] overflow-hidden animate-fade-in relative max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-wider">
                  รายละเอียดคำสั่งซื้อ
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
                    isReturnOrder
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/20"
                      : order.status === "cancelled"
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
          </div>

          {/* Content Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1">
            {/* Left Column: Timeline, Address & Items */}
            <div className="space-y-6">
              {/* ── Delivery Timeline ── */}
              <DeliveryTimeline
                status={order.status}
                cancelReason={order.cancel_reason}
              />

              {/* ── Refund Timeline (เฉพาะ cancelled) ── */}
              {isCancelled && (
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-yellow-500 mb-4 font-bold text-sm uppercase">
                    <RefreshCw size={16} /> สถานะการคืนเงิน
                  </div>
                  <div className="flex items-center gap-0">
                    {/* Step 1: แจ้งการคืนเงิน */}
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          isCancelled
                            ? "bg-yellow-500 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                            : "bg-zinc-800 border-zinc-700"
                        }`}
                      >
                        <AlertTriangle
                          size={14}
                          className={
                            isCancelled ? "text-yellow-900" : "text-zinc-600"
                          }
                        />
                      </div>
                      <p
                        className={`text-[10px] font-bold mt-1.5 text-center ${isCancelled ? "text-yellow-400" : "text-zinc-600"}`}
                      >
                        แจ้งการคืนเงิน
                      </p>
                      {!isRefunded && !isRejected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse mt-1" />
                      )}
                    </div>
                    {/* Line */}
                    <div
                      className={`flex-1 h-0.5 -mt-4 ${isRefunded ? "bg-green-500/60" : isRejected ? "bg-red-500/60" : "bg-zinc-700"}`}
                    />
                    {/* Step 2: คืนเงินสำเร็จ / ปฏิเสธ */}
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
                      {(isRefunded || isRejected) && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1 ${isRejected ? "bg-red-500" : "bg-green-500"}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Address Box */}
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

              {/* Items List */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-sm uppercase">
                  <Package size={16} /> รายการสินค้า
                </div>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
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
                          <div className="text-white text-sm font-medium">
                            {item.product.name}
                          </div>
                          <div className="text-zinc-500 text-xs">
                            x{item.quantity} ชิ้น
                          </div>
                        </div>
                      </div>
                      <div className="text-red-400 font-bold">
                        ฿{Number(item.price_at_purchase).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Slip & Summary */}
            <div className="space-y-6 flex flex-col h-full">
              {/* Slip / Payment Proof */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase">
                    <FileText size={16} /> หลักฐานการโอนเงิน
                  </div>
                  {order.payment_method && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium">
                      {order.payment_method === "qr"
                        ? "📱 QR Code"
                        : "🏦 โอนเงิน"}
                    </span>
                  )}
                </div>

                {order.slip_image ? (
                  <div className="flex-1 flex flex-col gap-3">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => slipUrl && setLightboxSrc(slipUrl)}
                    >
                      <img
                        src={`http://localhost:3000/uploads/slips/${order.slip_image}`}
                        alt="สลิปการชำระเงิน"
                        className="w-full max-h-52 object-contain rounded-lg border border-zinc-700 bg-black/40 transition-opacity group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 rounded-full p-3">
                          <ZoomIn size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500 space-y-1 px-1">
                      <p>
                        ช่องทาง:{" "}
                        <span className="text-zinc-300">
                          {order.payment_method === "qr"
                            ? "สแกน QR Code"
                            : "โอนเงินผ่านธนาคาร"}
                        </span>
                      </p>
                      <p>
                        วันที่:{" "}
                        <span className="text-zinc-300">
                          {new Date(order.created_at).toLocaleString("th-TH")}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-black/40 rounded-lg border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 p-8 min-h-[200px]">
                    <CreditCard size={40} className="mb-2 opacity-50" />
                    <span className="text-sm">ยังไม่มีหลักฐานการชำระเงิน</span>
                    <span className="text-xs text-zinc-700 mt-1">
                      (ลูกค้ายังไม่ได้แนบสลิป)
                    </span>
                  </div>
                )}
              </div>

              {/* Total & Action */}
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <span className="text-zinc-400 text-sm">วิธีชำระเงิน</span>
                  <span className="text-zinc-200 text-sm font-medium">
                    {order.payment_method === "qr"
                      ? "📱 QR Code"
                      : order.payment_method
                        ? "🏦 โอนเงินธนาคาร"
                        : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-zinc-400 text-sm">ยอดรวมทั้งสิ้น</span>
                  <span className="text-3xl font-bold text-red-500">
                    ฿{Number(order.total_price).toLocaleString()}
                  </span>
                </div>

                {/* Action Button Area */}
                <div className="pt-2 space-y-2">
                  {renderActionButtons()}
                  {/* Quick Cancel - สำหรับสลิปปลอม */}
                  {onQuickCancel && order.status === "pending" && (
                    <button
                      onClick={async () => {
                        setQuickCancelLoading(true);
                        await onQuickCancel(order.id);
                        setQuickCancelLoading(false);
                      }}
                      disabled={quickCancelLoading}
                      className="w-full py-2.5 bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 text-red-400 font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {quickCancelLoading ? (
                        "กำลังยกเลิก..."
                      ) : (
                        <>
                          <Ban size={16} /> ยกเลิกด่วน (สลิปปลอม)
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>

              {/* ── Cancel Details (เมื่อถูกยกเลิก) ── */}
              {isCancelled && order.cancel_reason && (
                <div
                  className={`p-4 rounded-xl space-y-3 ${
                    isReturnOrder
                      ? "bg-orange-500/5 border border-orange-500/20"
                      : "bg-red-500/5 border border-red-500/20"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 font-bold text-sm uppercase ${
                      isReturnOrder ? "text-orange-400" : "text-red-500"
                    }`}
                  >
                    {isReturnOrder ? (
                      <RotateCcw size={16} />
                    ) : (
                      <Ban size={16} />
                    )}
                    {isReturnOrder
                      ? "รายละเอียดการคืนสินค้า"
                      : "รายละเอียดการยกเลิก"}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-zinc-500 text-xs">
                        {isReturnOrder
                          ? "เหตุผลที่คืนสินค้า"
                          : "เหตุผลที่ยกเลิก"}
                      </p>
                      <p className="text-zinc-200 text-sm mt-0.5">
                        {order.cancel_reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Customer Bank Info (ข้อมูลบัญชีลูกค้า) ── */}
              {isCancelled &&
                (order.refund_bank_name ||
                  order.refund_bank_account ||
                  order.user?.bank_name ||
                  order.user?.bank_account) && (
                  <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase">
                      <CreditCard size={16} /> ข้อมูลบัญชีลูกค้า (สำหรับคืนเงิน)
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-zinc-500 text-xs">ธนาคาร</p>
                        <p className="text-zinc-200 font-bold">
                          {order.refund_bank_name ||
                            order.user?.bank_name ||
                            "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs">เลขบัญชี</p>
                        <p className="text-zinc-200 font-bold">
                          {order.refund_bank_account ||
                            order.user?.bank_account ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* ── Refund Status (ถ้าคืนเงินแล้ว) ── */}
              {isCancelled && isRefunded && (
                <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-green-500 font-bold text-sm uppercase">
                    <CheckCircle size={16} /> คืนเงินแล้ว
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-zinc-500 text-xs">ยอดเงินที่คืน</p>
                      <p className="text-green-400 font-bold">
                        ฿{Number(order.refund_amount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs">ช่องทาง</p>
                      <p className="text-zinc-200">{order.refund_channel}</p>
                    </div>
                    {order.refunded_at && (
                      <div className="col-span-2">
                        <p className="text-zinc-500 text-xs">วันที่คืนเงิน</p>
                        <p className="text-zinc-200">
                          {new Date(order.refunded_at).toLocaleString("th-TH")}
                        </p>
                      </div>
                    )}
                  </div>
                  {refundSlipUrl && (
                    <div>
                      <p className="text-zinc-500 text-xs mb-2">
                        สลิปการคืนเงิน
                      </p>
                      <div
                        className="relative group cursor-pointer inline-block"
                        onClick={() => setLightboxSrc(refundSlipUrl)}
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

              {/* ── Rejected Status (ปฏิเสธการคืนเงิน) ── */}
              {isCancelled && (isRejected || isFakeSlip) && (
                <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase">
                    <Ban size={16} /> ปฏิเสธการคืนเงิน
                  </div>
                  <p className="text-zinc-300 text-sm">
                    แอดมินตรวจสอบแล้วพบว่าหลักฐานไม่ถูกต้อง
                    จึงปฏิเสธการคืนเงินสำหรับคำสั่งซื้อนี้
                  </p>
                </div>
              )}

              {/* ── Refund Form (ยกเลิกแล้วแต่ยังไม่คืนเงิน) ── */}
              {isCancelled &&
                !isRefunded &&
                !isRejected &&
                !isFakeSlip &&
                onRefund && (
                  <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20 space-y-4">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm uppercase">
                      <DollarSign size={16} /> คืนเงินลูกค้า
                    </div>
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
                          className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-500/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none placeholder-zinc-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-500 text-xs mb-1 block">
                          ช่องทางคืนเงิน *
                        </label>
                        <select
                          value={refundChannel}
                          onChange={(e) => setRefundChannel(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-500/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
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

                    {/* อัปโหลดสลิปคืนเงิน */}
                    <div>
                      <label className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
                        <Upload size={11} /> สลิปการคืนเงิน (รูปภาพ)
                      </label>
                      {refundPreview ? (
                        <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-700 rounded-xl p-3">
                          <img
                            src={refundPreview}
                            alt="refund-slip"
                            className="w-14 h-16 object-cover rounded-lg border border-zinc-700 cursor-pointer"
                            onClick={() => setLightboxSrc(refundPreview)}
                          />
                          <div className="flex-1">
                            <p className="text-green-400 text-xs font-bold">
                              อัปโหลดสำเร็จ ✓
                            </p>
                            <button
                              onClick={() => {
                                setRefundFile(null);
                                setRefundPreview(null);
                              }}
                              className="text-zinc-500 hover:text-red-400 text-xs mt-1 transition-colors"
                            >
                              ลบ / เปลี่ยนรูป
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
                            คลิกเพื่ออัปโหลดสลิปคืนเงิน
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleRefundFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleRefundSubmit}
                        disabled={!refundChannel || refundLoading}
                        className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {refundLoading
                          ? "กำลังดำเนินการ..."
                          : "💰 ยืนยันการคืนเงิน"}
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
                          <Ban size={16} /> ปฏิเสธการคืนเงิน
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;
