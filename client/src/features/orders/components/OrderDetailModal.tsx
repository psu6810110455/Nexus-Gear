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
} from "lucide-react";
import { type Order } from "../../../shared/types"; // Import Type Order

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (id: number, status: string) => void;
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

const DeliveryTimeline = ({ status }: { status: string }) => {
  const isCancelled = status === "cancelled";
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-2 text-red-500 mb-4 font-bold text-sm uppercase">
        <Truck size={16} /> สถานะการจัดส่ง
      </div>

      {isCancelled ? (
        <div className="flex items-center gap-3 px-3 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <Ban size={18} className="text-red-400 shrink-0" />
          <div>
            <p className="text-red-400 font-bold text-sm">ยกเลิกคำสั่งซื้อ</p>
            <p className="text-zinc-500 text-xs mt-0.5">
              คำสั่งซื้อนี้ถูกยกเลิกแล้ว
            </p>
          </div>
        </div>
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

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}: OrderDetailModalProps) => {
  if (!isOpen || !order) return null;

  const getThaiStatus = (status: string) => {
    const thStatus: Record<string, string> = {
      pending: "รอชำระเงิน",
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

  return (
    // Backdrop (พื้นหลังมัวๆ)
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-[#0f0f0f] border border-red-500/30 w-full max-w-4xl rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.2)] overflow-hidden animate-fade-in relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-wider">
                รายละเอียดคำสั่งซื้อ
              </h2>
              <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full border border-green-500/20 uppercase">
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
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Timeline, Address & Items */}
          <div className="space-y-6">
            {/* ── Delivery Timeline ── */}
            <DeliveryTimeline status={order.status} />

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
                  <img
                    src={`http://localhost:3000/uploads/slips/${order.slip_image}`}
                    alt="สลิปการชำระเงิน"
                    className="w-full max-h-64 object-contain rounded-lg border border-zinc-700 bg-black/40"
                  />
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
              <div className="pt-2">
                {renderActionButtons()}
                <button
                  onClick={onClose}
                  className="w-full mt-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
