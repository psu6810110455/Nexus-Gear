// features/orders/components/OrderCard.tsx

import {
  Package,
  Star,
  ChevronRight,
  XCircle,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  Ban,
  RotateCcw,
} from "lucide-react";

const STATUS_DISPLAY: Record<
  string,
  {
    text: string;
    badge: string;
    bar: string;
    glow: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    text: "รอตรวจสอบ",
    badge: "text-amber-400 border-amber-400/40 bg-amber-400/10",
    bar: "bg-amber-400",
    glow: "hover:shadow-[0_0_24px_-6px_rgba(251,191,36,0.2)]",
    icon: <Clock size={11} />,
  },
  paid: {
    text: "เตรียมสินค้า",
    badge: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10",
    bar: "bg-cyan-400",
    glow: "hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.2)]",
    icon: <CheckCircle2 size={11} />,
  },
  to_ship: {
    text: "รอจัดส่ง",
    badge: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    bar: "bg-orange-400",
    glow: "hover:shadow-[0_0_24px_-6px_rgba(251,146,60,0.2)]",
    icon: <PackageCheck size={11} />,
  },
  shipped: {
    text: "ระหว่างขนส่ง",
    badge: "text-purple-400 border-purple-400/40 bg-purple-400/10",
    bar: "bg-purple-400",
    glow: "hover:shadow-[0_0_24px_-6px_rgba(192,132,252,0.2)]",
    icon: <Truck size={11} />,
  },
  completed: {
    text: "ได้รับสินค้าแล้ว",
    badge: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
    bar: "bg-emerald-400",
    glow: "hover:shadow-[0_0_24px_-6px_rgba(52,211,153,0.2)]",
    icon: <Star size={11} />,
  },
  cancelled: {
    text: "ยกเลิกแล้ว",
    badge: "text-zinc-500 border-zinc-600/40 bg-zinc-700/20",
    bar: "bg-zinc-600",
    glow: "",
    icon: <Ban size={11} />,
  },
  returned: {
    text: "คืนสินค้า",
    badge: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    bar: "bg-orange-400",
    glow: "hover:shadow-[0_0_24px_-6px_rgba(251,146,60,0.2)]",
    icon: <RotateCcw size={11} />,
  },
};

// ตรวจว่าเป็น "คืนสินค้า" หรือ "ยกเลิก"
const isReturnOrder = (order: { cancel_reason?: string | null }) =>
  order.cancel_reason?.startsWith("ขอคืนสินค้า:") ?? false;

const formatThaiDate = (dateString: string) => {
  const d = new Date(dateString);
  const m = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear() + 543}`;
};

interface OrderItem {
  quantity: number;
  product: { name: string; image_url: string };
}
interface Order {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  is_rated?: boolean;
  completed_at?: string | null;
  refund_status?: string;
  cancel_reason?: string | null;
}
interface OrderCardProps {
  order: Order;
  onSelect: (order: Order) => void;
  onCancel?: () => void;
  onReturn?: () => void;
}

const OrderCard = ({ order, onSelect, onCancel, onReturn }: OrderCardProps) => {
  const displayKey =
    order.status === "cancelled" && isReturnOrder(order)
      ? "returned"
      : order.status;
  const s = STATUS_DISPLAY[displayKey] ?? {
    text: order.status,
    badge: "text-zinc-400 border-zinc-700 bg-zinc-800",
    bar: "bg-zinc-600",
    glow: "",
    icon: null,
  };
  const first = order.items[0];
  const ratable = order.status === "completed" && !order.is_rated;

  // คำนวณว่าสามารถคืนสินค้าได้หรือไม่ (ภายใน 3 วัน)
  const canReturn = (() => {
    if (order.status !== "completed") return false;
    const ref = order.completed_at || order.created_at;
    const daysSince =
      (Date.now() - new Date(ref).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 3;
  })();

  // สถานะการคืนเงินสำหรับ cancelled
  const refundLabel =
    order.status === "cancelled"
      ? order.refund_status === "refunded"
        ? {
            text: "คืนเงินสำเร็จ",
            cls: "text-green-400 border-green-400/40 bg-green-400/10",
          }
        : order.refund_status === "rejected"
          ? {
              text: "ปฏิเสธการคืนเงิน",
              cls: "text-red-400 border-red-400/40 bg-red-400/10",
            }
          : order.cancel_reason === "สลิปปลอม / หลักฐานไม่ถูกต้อง"
            ? {
                text: "ปฏิเสธการคืนเงิน",
                cls: "text-red-400 border-red-400/40 bg-red-400/10",
              }
            : {
                text: "แจ้งการคืนเงิน",
                cls: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
              }
      : null;

  return (
    <article
      className={`group relative flex overflow-hidden bg-[#111111] border border-zinc-800/60 rounded-2xl hover:border-zinc-700/80 hover:bg-[#151515] transition-all duration-200 ${s.glow}`}
    >
      {/* ── Left accent bar — สีตาม status ── */}
      <div className={`w-[3px] shrink-0 ${s.bar} opacity-80`} />

      {/* ── Main row ── */}
      <div className="flex items-center w-full px-4 py-4 gap-3">
        {/* Col 1: Order ID */}
        <div className="hidden md:flex flex-col justify-center w-[92px] shrink-0 border-r border-zinc-800/50 pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[var(--clr-primary)] text-[8px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
              ID
            </span>
            <span className="text-white font-black text-base leading-none">
              #{String(order.id).padStart(3, "0")}
            </span>
          </div>
          <p className="text-zinc-600 text-[10px]">
            {formatThaiDate(order.created_at)}
          </p>
        </div>

        {/* Col 2: Product */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
            {first?.product.image_url ? (
              <img
                src={first.product.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={18} className="text-zinc-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="md:hidden text-[9px] text-zinc-600 mb-0.5">
              #{String(order.id).padStart(3, "0")} ·{" "}
              {formatThaiDate(order.created_at)}
            </p>
            <p className="text-zinc-100 text-sm font-bold truncate">
              {first?.product.name || "สินค้า"}
            </p>
            <p className="text-zinc-600 text-[11px] mt-0.5">
              {order.items.length > 1
                ? `จำนวน: ${first?.quantity} ชิ้น  +${order.items.length - 1} รายการ`
                : `จำนวน: ${first?.quantity} ชิ้น`}
            </p>
          </div>
        </div>

        {/* Col 3: Total */}
        <div className="hidden sm:flex flex-col items-end shrink-0 w-[116px] border-l border-zinc-800/50 pl-4">
          <p className="text-zinc-600 text-[9px] uppercase tracking-widest font-bold mb-0.5">
            ยอดรวม
          </p>
          <p className="text-white font-black text-base leading-none">
            <span className="text-[var(--clr-primary)] text-xs mr-0.5">฿</span>
            {Number(order.total_price).toLocaleString()}
          </p>
        </div>

        {/* Col 4: Status badge */}
        <div className="hidden md:flex flex-col items-center justify-center gap-1 shrink-0 w-[160px] border-l border-zinc-800/50 pl-4">
          <span
            className={`inline-flex items-center gap-1.5 w-full justify-center px-3 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${s.badge}`}
          >
            {s.icon} {s.text}
          </span>
          {refundLabel && (
            <span
              className={`inline-flex items-center gap-1 w-full justify-center px-2 py-0.5 rounded-full border text-[9px] font-bold whitespace-nowrap ${refundLabel.cls}`}
            >
              {refundLabel.text}
            </span>
          )}
        </div>

        {/* Col 5: Actions */}
        <div className="flex flex-col gap-1.5 shrink-0 border-l border-zinc-800/50 pl-4 w-[136px]">
          {/* mobile: status pill */}
          <div className="md:hidden flex flex-col items-end gap-0.5 mb-0.5 w-full">
            <span
              className={`inline-flex items-center gap-1 w-full justify-center px-2 py-0.5 rounded-full border text-[9px] font-bold ${s.badge}`}
            >
              {s.icon} {s.text}
            </span>
            {refundLabel && (
              <span
                className={`inline-flex items-center gap-1 w-full justify-center px-2 py-0.5 rounded-full border text-[8px] font-bold ${refundLabel.cls}`}
              >
                {refundLabel.text}
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(order)}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
              ratable
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_2px_14px_rgba(245,158,11,0.35)] hover:opacity-90"
                : "bg-[var(--clr-primary)] text-white hover:opacity-90 shadow-[0_2px_14px_rgba(220,38,38,0.25)]"
            }`}
          >
            {ratable ? (
              <>
                <Star size={12} className="fill-white shrink-0" />
                ให้คะแนน
              </>
            ) : (
              <>
                รายละเอียด
                <ChevronRight size={12} className="shrink-0" />
              </>
            )}
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-500/70 hover:text-red-300"
            >
              <XCircle size={12} className="shrink-0" /> ยกเลิก
            </button>
          )}
          {canReturn && onReturn && (
            <button
              onClick={onReturn}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 bg-orange-500/10 border border-orange-500/40 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/70 hover:text-orange-300"
            >
              <RotateCcw size={12} className="shrink-0" /> คืนสินค้า
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default OrderCard;
