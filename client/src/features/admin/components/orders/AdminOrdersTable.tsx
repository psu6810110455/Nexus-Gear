// features/admin/components/AdminOrdersTable.tsx

import {
  Eye,
  XCircle,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Star,
  Ban,
  RotateCcw,
  PackageOpen,
  ArrowRight,
  CreditCard,
  ImageIcon,
} from "lucide-react";
import type { Order } from "../../../../shared/types";
import { useLanguage } from '../../../../shared/context/LanguageContext';

// ── Status config ──────────────────────────────────────────────
const STATUS: Record<
  string,
  { label: string; cls: string; icon: React.ReactNode }
> = {
  pending: {
    label: "รอตรวจสอบ",
    cls: "text-amber-400  border-amber-400/40  bg-amber-400/10",
    icon: <Clock size={11} />,
  },
  paid: {
    label: "ชำระเงินแล้ว",
    cls: "text-cyan-400   border-cyan-400/40   bg-cyan-400/10",
    icon: <CheckCircle2 size={11} />,
  },
  to_ship: {
    label: "เตรียมจัดส่ง",
    cls: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    icon: <Package size={11} />,
  },
  shipped: {
    label: "ระหว่างขนส่ง",
    cls: "text-purple-400 border-purple-400/40 bg-purple-400/10",
    icon: <Truck size={11} />,
  },
  completed: {
    label: "สำเร็จ",
    cls: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
    icon: <Star size={11} />,
  },
  cancelled: {
    label: "ยกเลิก",
    cls: "text-zinc-500   border-zinc-600/40   bg-zinc-700/20",
    icon: <Ban size={11} />,
  },
  returned: {
    label: "คืนสินค้า",
    cls: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    icon: <RotateCcw size={11} />,
  },
};

// ตรวจว่าเป็น "คืนสินค้า" หรือ "ยกเลิก"
const isReturnOrder = (order: Order) =>
  order.cancel_reason?.startsWith("ขอคืนสินค้า:") ?? false;

interface AdminOrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
  onUpdateStatus?: (orderId: number, newStatus: string) => void;
}

// ── Skeleton ───────────────────────────────────────────────────
const SkeletonRows = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr
        key={i}
        className={`animate-pulse border-b border-zinc-800/40 ${i % 2 === 1 ? "bg-zinc-900/20" : ""}`}
      >
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 bg-zinc-800 rounded" />
              <div className="h-3 w-20 bg-zinc-800/50 rounded" />
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="h-5 w-24 bg-zinc-800 rounded ml-auto" />
        </td>
        <td className="px-5 py-4">
          <div className="h-6 w-24 bg-zinc-800 rounded-full mx-auto" />
        </td>
        <td className="px-5 py-4">
          <div className="h-4 w-28 bg-zinc-800 rounded" />
        </td>
        <td className="px-5 py-4">
          <div className="flex gap-2 justify-center">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
            <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
          </div>
        </td>
      </tr>
    ))}
  </>
);

// ── Empty ──────────────────────────────────────────────────────
const EmptyRows = () => {
  const { t } = useLanguage();
  return (
    <tr>
      <td colSpan={6} className="py-20 text-center">
        <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0a]/50 border border-dashed border-[#990000]/20 rounded-2xl">
          <Package className="w-16 h-16 text-[#F2F4F6]/10 mb-4" />
          <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6]/40 mb-2">{t('noOrdersFound')}</h3>
          <p className="text-[#F2F4F6]/20 font-['Kanit']">{t('tryNewFilter')}</p>
        </div>
      </td>
    </tr>
  );
};

// ── Main ───────────────────────────────────────────────────────
const AdminOrdersTable = ({
  orders,
  loading,
  onViewOrder,
  onCancelOrder,
  onUpdateStatus,
}: AdminOrdersTableProps) => {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-zinc-800/70 overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] bg-[#0e0e0e]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* ── Header ── */}
          <thead>
            <tr className="border-b-2 border-zinc-800/80 bg-zinc-900/60">
              <th className="px-6 py-4 text-left text-xs font-bold text-[#F2F4F6]/40 uppercase tracking-widest font-['Orbitron']">{t('orderCustomer')}</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#F2F4F6]/40 uppercase tracking-widest font-['Orbitron']">{t('total')}</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#F2F4F6]/40 uppercase tracking-widest font-['Orbitron']">{t('status')}</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#F2F4F6]/40 uppercase tracking-widest font-['Orbitron']">{t('paymentMethod')}</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-[#F2F4F6]/40 uppercase tracking-widest font-['Orbitron']">{t('shippingStatus')}</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-[#F2F4F6]/40 uppercase tracking-widest font-['Orbitron']">{t('manage')}</th>
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : orders.length === 0 ? (
              <EmptyRows />
            ) : (
              orders.map((order, idx) => {
                const displayKey =
                  order.status === "cancelled" && isReturnOrder(order)
                    ? "returned"
                    : order.status;
                const s = STATUS[displayKey];
                const canCancel =
                  order.status !== "cancelled" && order.status !== "completed";
                const isEven = idx % 2 === 0;
                const orderId = `ORD-${new Date().getFullYear() + 543}-${String(order.id).padStart(3, "0")}`;
                const initial = order.user?.name?.charAt(0).toUpperCase() ?? "?";

                return (
                  <tr
                    key={order.id}
                    className={`group border-b border-zinc-800/30 transition-colors duration-150 hover:bg-[var(--clr-primary)]/5 ${isEven ? "bg-transparent" : "bg-zinc-900/25"}`}
                  >
                    {/* Col 1: Order + customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-300 text-sm font-black shrink-0 group-hover:border-red-500/30 group-hover:text-red-400 transition-all">
                          {initial}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm leading-tight group-hover:text-red-50 transition-colors">
                            {orderId}
                          </p>
                          <p className="text-zinc-500 text-xs mt-0.5">
                            {order.user?.name || "ลูกค้าทั่วไป"}
                          </p>
                          <p className="text-zinc-700 text-[10px] mt-0.5">
                            {new Date(order.created_at).toLocaleString("th-TH")}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Total */}
                    <td className="px-5 py-4 text-right">
                      <p className="text-zinc-600 text-[9px] uppercase tracking-widest mb-0.5">
                        {t('total')}
                      </p>
                      <p className="text-white font-black text-base leading-none">
                        <span className="text-red-500 text-sm">฿</span>
                        {Number(order.total_price).toLocaleString()}
                      </p>
                    </td>

                    {/* Col 3: Status */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        {s && (
                          <span
                            className={`inline-flex items-center justify-center gap-1.5 min-w-[120px] px-3 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${s.cls}`}
                          >
                            {s.icon} {s.label}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Col 4: Payment */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${
                            order.payment_method === "qr"
                              ? "text-violet-400 border-violet-400/30 bg-violet-400/10"
                              : "text-cyan-400 border-cyan-400/30 bg-cyan-400/10"
                          }`}
                        >
                          <CreditCard size={10} />
                          {order.payment_method === "qr" ? "QR Code" : t('transferPayment')}
                        </span>
                        {order.slip_image && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-green-400">
                            <ImageIcon size={9} /> {t('hasSlip')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Col 5: Carrier */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
                          <Truck size={13} className="text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-zinc-200 text-sm font-semibold leading-tight">
                            Kerry Express
                          </p>
                          <p className="text-zinc-600 text-[10px]">
                            {t('shippingStatus')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Col 6: Actions */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onViewOrder(order)}
                            title={t('viewDetails')}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 hover:bg-[var(--clr-primary)] hover:border-[var(--clr-primary)] hover:text-white transition-all active:scale-95"
                          >
                            <Eye size={15} />
                          </button>
                          {canCancel && (
                            <button
                              onClick={() => onCancelOrder(order)}
                              title={t('cancel')}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all active:scale-95"
                            >
                              <XCircle size={15} />
                            </button>
                          )}
                        </div>
                        {order.status === "paid" && onUpdateStatus && (
                          <button
                            onClick={() => onUpdateStatus(order.id, "to_ship")}
                            className="h-7 px-2.5 flex items-center justify-center gap-1 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all active:scale-95 text-[10px] font-bold whitespace-nowrap"
                          >
                            <PackageOpen size={12} /> {t('toShip')} <ArrowRight size={10} />
                          </button>
                        )}
                        {order.status === "to_ship" && onUpdateStatus && (
                          <button
                            onClick={() => onUpdateStatus(order.id, "shipped")}
                            className="h-7 px-2.5 flex items-center justify-center gap-1 rounded-lg bg-indigo-500/15 border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all active:scale-95 text-[10px] font-bold whitespace-nowrap"
                          >
                            <Truck size={12} /> {t('shippingStatus')} <ArrowRight size={10} />
                          </button>
                        )}
                        {order.status === "shipped" && onUpdateStatus && (
                          <button
                            onClick={() => onUpdateStatus(order.id, "completed")}
                            className="h-7 px-2.5 flex items-center justify-center gap-1 rounded-lg bg-green-500/15 border border-green-500/40 text-green-400 hover:bg-green-500 hover:border-green-500 hover:text-white transition-all active:scale-95 text-[10px] font-bold whitespace-nowrap"
                          >
                            <Star size={12} /> {t('completedStatus')} <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && orders.length > 0 && (
        <div className="px-5 py-3 border-t border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
          <p className="text-zinc-600 text-xs">{t('viewDetails')} {orders.length} {t('itemsLabel')}</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersTable;
