// features/orders/pages/NexusGearOrderStatus.tsx

import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import {
  getMyOrders,
  submitOrderRating,
  cancelOrder,
} from "../../../shared/services/api";
import type { Order } from "../../../shared/types";

import OrderTabs from "../components/OrderTabs";
import OrderCard from "../components/OrderCard";
import { OrderSkeleton, OrderEmpty } from "../components/OrderSkeleton";
import CustomerOrderModal from "../components/CustomerOrderModal";
import CancelOrderModal from "../components/CancelOrdermodal";

// ── helpers ───────────────────────────────────────────────────
const filterByTab = (orders: Order[], tab: string) => {
  if (tab === "all") return orders;
  if (tab === "paid")
    return orders.filter((o) => o.status === "paid" || o.status === "to_ship");
  return orders.filter((o) => o.status === tab);
};

// ── Page ──────────────────────────────────────────────────────
const NexusGearOrderStatus = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    setTimeout(fetchMyOrders, 800);
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getMyOrders());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRatingSubmit = async (
    orderId: number,
    ratings: Record<number, number>,
    reviews: Record<number, string>,
  ) => {
    try {
      await submitOrderRating(orderId, ratings, reviews);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, is_rated: true } : o)),
      );
      setSelectedOrder(null);
      setActiveTab("all");
      showToast(
        "ขอบคุณสำหรับการรีวิว! คะแนนของคุณถูกบันทึกเรียบร้อยแล้ว ⭐️",
        true,
      );
    } catch {
      setSelectedOrder(null);
      showToast("เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองใหม่อีกครั้ง", false);
    } finally {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  const handleCancelOrder = async (orderId: number, reason: string) => {
    try {
      await cancelOrder(orderId, reason);
      // อัปเดต status ใน state ทันที — backend คืนสต็อกให้แล้ว
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
      );
      setCancelTarget(null);
      showToast("ยกเลิกคำสั่งซื้อสำเร็จ สินค้าถูกคืนสต็อกแล้ว", true);
    } catch {
      showToast("เกิดข้อผิดพลาด ไม่สามารถยกเลิกได้", false);
    }
  };

  const filtered = filterByTab(orders, activeTab);

  return (
    <section className="w-full min-h-screen bg-[var(--clr-bg-base)] text-white p-4 md:p-10 font-sans relative animate-fade-in">
      {/* ── Toast (fixed top-right) ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right duration-300 ${
            toast.ok
              ? "bg-[var(--clr-bg-card)] border-green-500/60 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.25)]"
              : "bg-[var(--clr-bg-card)] border-red-500/60 text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.25)]"
          }`}
        >
          {toast.ok ? (
            <CheckCircle size={18} className="shrink-0" />
          ) : (
            <AlertTriangle size={18} className="shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-8 border-l-4 border-[var(--clr-primary)] pl-4">
          <h1 className="text-2xl font-black tracking-wide">
            ประวัติการสั่งซื้อ
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            จัดการและติดตามสถานะคำสั่งซื้อของคุณ
          </p>
        </header>

        {/* ── Tabs ── */}
        <OrderTabs
          orders={orders}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ── Column headers (desktop) ── */}
        {!loading && filtered.length > 0 && (
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 mb-3 text-[11px] font-bold text-zinc-500 uppercase tracking-widest bg-[var(--clr-bg-card)] rounded-xl border border-zinc-800/60">
            <div className="col-span-2 text-center">หมายเลขออเดอร์</div>
            <div className="col-span-4 text-center">รายการสินค้า</div>
            <div className="col-span-2 text-center">ยอดรวมสุทธิ</div>
            <div className="col-span-2 text-center">สถานะ</div>
            <div className="col-span-2 text-center">การจัดการ</div>
          </div>
        )}

        {/* ── Order list ── */}
        <div className="flex flex-col gap-3">
          {loading ? (
            [1, 2, 3, 4].map((n) => <OrderSkeleton key={n} />)
          ) : filtered.length === 0 ? (
            <OrderEmpty />
          ) : (
            filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onSelect={() => setSelectedOrder(order)}
                onCancel={
                  order.status === "pending" || order.status === "paid"
                    ? () => setCancelTarget(order)
                    : undefined
                }
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <CustomerOrderModal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onSubmitRating={handleRatingSubmit}
      />

      <CancelOrderModal
        isOpen={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        order={cancelTarget}
        onConfirm={handleCancelOrder}
      />
    </section>
  );
};

export default NexusGearOrderStatus;
