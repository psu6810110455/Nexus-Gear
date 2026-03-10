// features/orders/components/OrderCard.tsx

import { Package, Star, ChevronRight } from "lucide-react";

const STATUS_DISPLAY: Record<string, { text: string; className: string }> = {
  pending: {
    text: "รอชำระเงิน",
    className: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  },
  paid: {
    text: "เตรียมสินค้า",
    className: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  },
  to_ship: {
    text: "รอจัดส่ง",
    className: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  },
  shipped: {
    text: "ระหว่างขนส่ง",
    className: "text-purple-400 border-purple-500/50 bg-purple-500/10",
  },
  completed: {
    text: "ได้รับสินค้าแล้ว",
    className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  },
  cancelled: {
    text: "ยกเลิก",
    className: "text-zinc-500 border-zinc-500/30 bg-zinc-500/10",
  },
};

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
}

interface OrderCardProps {
  order: Order;
  onSelect: (order: Order) => void;
  onCancel?: () => void;
}

const OrderCard = ({ order, onSelect, onCancel }: OrderCardProps) => {
  const status = STATUS_DISPLAY[order.status] ?? {
    text: order.status,
    className: "text-zinc-400 border-zinc-800 bg-zinc-900",
  };
  const first = order.items[0];
  const ratable = order.status === "completed" && !order.is_rated;

  return (
    <article className="group bg-[#121212] border border-zinc-800/80 rounded-2xl hover:bg-[#161616] hover:border-zinc-700 transition-all duration-300 shadow-md hover:shadow-xl p-5 md:px-8 md:py-6 flex flex-col md:grid md:grid-cols-12 gap-5 md:gap-6 md:items-center">
      {/* Order ID + Date */}
      <div className="md:col-span-2 flex flex-col md:items-center border-b border-zinc-800/80 md:border-b-0 md:border-r pb-4 md:pb-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[var(--clr-primary)] font-black text-[10px] uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
            ID
          </span>
          <h3 className="text-white font-black text-lg tracking-wider">
            #{String(order.id).padStart(3, "0")}
          </h3>
        </div>
        <p className="text-zinc-500 text-xs font-bold">
          {formatThaiDate(order.created_at)}
        </p>
      </div>

      {/* Product Info */}
      <div className="md:col-span-4 flex items-center md:justify-center gap-4 md:pl-2">
        <div className="w-14 h-14 rounded-xl bg-[#050505] border border-zinc-800 flex items-center justify-center shrink-0">
          {first?.product.image_url ? (
            <img
              src={first.product.image_url}
              alt="product"
              className="w-full h-full object-cover rounded-xl opacity-80"
            />
          ) : (
            <Package size={24} className="text-zinc-600" />
          )}
        </div>
        <div className="flex flex-col min-w-0 text-left">
          <p className="text-zinc-200 text-sm font-bold truncate">
            {first?.product.name || "สินค้าไม่ระบุชื่อ"}
          </p>
          <p className="text-zinc-500 text-xs mt-1">
            {order.items.length > 1
              ? `และสินค้าอื่นอีก ${order.items.length - 1} รายการ`
              : `จำนวน: ${first?.quantity} ชิ้น`}
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="md:col-span-2 flex justify-between md:justify-center items-center border-t border-zinc-800/80 md:border-0 pt-4 md:pt-0">
        <span className="md:hidden text-zinc-500 text-xs font-bold uppercase tracking-widest">
          ยอดสุทธิ
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-[var(--clr-primary)] font-black text-sm">
            ฿
          </span>
          <span className="text-xl font-black text-white tracking-tighter">
            {Number(order.total_price).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="md:col-span-2 flex justify-between md:justify-center items-center">
        <span className="md:hidden text-zinc-500 text-xs font-bold uppercase tracking-widest">
          สถานะ
        </span>
        <span
          className={`px-3 py-1.5 text-xs font-black rounded-full border shadow-sm ${status.className}`}
        >
          {status.text}
        </span>
      </div>

      {/* Action Button */}
      <div className="md:col-span-2 flex flex-col justify-end md:justify-center gap-2 mt-2 md:mt-0">
        <button
          onClick={() => onSelect(order)}
          className={`w-full md:w-[130px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 ${
            ratable
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)]"
              : "bg-[var(--clr-primary)] hover:bg-[var(--clr-primary-hover)] text-white shadow-[0_4px_15px_rgba(220,38,38,0.2)]"
          }`}
        >
          {ratable ? (
            <>
              <Star size={14} className="fill-white" /> ให้คะแนน
            </>
          ) : (
            <>
              รายละเอียด <ChevronRight size={14} />
            </>
          )}
        </button>

        {/* ปุ่มยกเลิก — แสดงเฉพาะ pending / paid */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full md:w-[130px] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1 active:scale-95 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </article>
  );
};

export default OrderCard;
