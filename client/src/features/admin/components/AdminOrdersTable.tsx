// features/admin/components/AdminOrdersTable.tsx

import {
  Eye,
  PackageOpen,
  XCircle,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Star,
  Ban,
} from "lucide-react";
import type { Order } from "../../../shared/types";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  paid: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  to_ship: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  completed: "bg-green-500/10 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระเงินแล้ว",
  to_ship: "เตรียมจัดส่ง",
  shipped: "ระหว่างขนส่ง",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock size={11} />,
  paid: <CheckCircle2 size={11} />,
  to_ship: <Package size={11} />,
  shipped: <Truck size={11} />,
  completed: <Star size={11} />,
  cancelled: <Ban size={11} />,
};

interface AdminOrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
}

// ── Skeleton rows ──────────────────────────────────────────────
const SkeletonRows = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-zinc-800/50">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-zinc-800 rounded" />
              <div className="h-3 w-24 bg-zinc-800/50 rounded" />
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="h-6 w-20 bg-zinc-800 rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-24 bg-zinc-800 rounded-full" />
        </td>
        <td className="p-4">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-zinc-800 rounded" />
            <div className="h-3 w-20 bg-zinc-800/50 rounded" />
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="h-8 w-8 bg-zinc-800 rounded ml-auto" />
        </td>
      </tr>
    ))}
  </>
);

// ── Empty state ────────────────────────────────────────────────
const EmptyRows = () => (
  <tr>
    <td colSpan={5} className="p-16 text-center">
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-20 h-20 bg-zinc-800/30 rounded-full flex items-center justify-center border border-zinc-800/50">
          <PackageOpen size={36} className="text-zinc-600" />
        </div>
        <span className="text-lg font-bold text-zinc-400">
          ไม่พบรายการคำสั่งซื้อ
        </span>
        <span className="text-sm text-zinc-600">
          ลองเปลี่ยนคำค้นหาหรือสถานะตัวกรองใหม่อีกครั้ง
        </span>
      </div>
    </td>
  </tr>
);

// ── Main component ─────────────────────────────────────────────
const AdminOrdersTable = ({
  orders,
  loading,
  onViewOrder,
  onCancelOrder,
}: AdminOrdersTableProps) => (
  <div className="bg-[var(--clr-bg-card)] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-900/80 text-zinc-300 text-xs uppercase tracking-widest border-b border-zinc-800/80">
            <th className="p-5 font-bold">ข้อมูลคำสั่งซื้อ</th>
            <th className="p-5 font-bold text-right">ยอดรวมสุทธิ</th>
            <th className="p-5 font-bold text-center">สถานะ</th>
            <th className="p-5 font-bold">การจัดส่ง</th>
            <th className="p-5 font-bold text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {loading ? (
            <SkeletonRows />
          ) : orders.length === 0 ? (
            <EmptyRows />
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#141414] transition-all duration-300 group"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold border border-zinc-700/50 group-hover:border-[var(--clr-primary)]/50 group-hover:text-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300">
                      {order.user?.username?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <div className="text-white font-bold group-hover:text-red-50 transition-colors duration-300">
                        ORD-{new Date().getFullYear() + 543}-
                        {String(order.id).padStart(3, "0")}
                      </div>
                      <div className="text-zinc-400 text-xs mt-1">
                        {order.user?.username || "ลูกค้าทั่วไป"}
                      </div>
                      <div className="text-zinc-600 text-[10px] mt-0.5">
                        {new Date(order.created_at).toLocaleString("th-TH")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-right">
                  <span className="text-white font-bold text-lg group-hover:text-red-100 transition-colors">
                    ฿{Number(order.total_price).toLocaleString()}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider shadow-sm ${STATUS_COLOR[order.status] ?? "bg-gray-500/10 text-gray-500"}`}
                  >
                    {STATUS_ICON[order.status]}
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="p-5">
                  <div className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">
                    Kerry Express
                  </div>
                  <div className="text-zinc-500 text-xs mt-0.5">
                    จัดส่งแบบมาตรฐาน
                  </div>
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-[var(--clr-primary)] hover:border-[var(--clr-primary)] hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md"
                      title="ดูรายละเอียด"
                    >
                      <Eye size={18} />
                    </button>
                    {order.status !== "cancelled" &&
                      order.status !== "completed" && (
                        <button
                          onClick={() => onCancelOrder(order)}
                          className="p-2.5 bg-red-600/20 border border-red-500/60 text-red-400 hover:bg-red-600 hover:border-red-600 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md shadow-red-900/20"
                          title="ยกเลิกคำสั่งซื้อ"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminOrdersTable;
