// features/orders/pages/NexusGearOrderStatus.tsx

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { getUserOrders, submitOrderRating } from "../../../shared/services/api";
import type { Order } from "../../../shared/types";

import OrderTabs from "../components/OrderTabs";
import OrderCard from "../components/OrderCard";
import { OrderSkeleton, OrderEmpty } from "../components/OrderSkeleton";
import CustomerOrderModal from "../components/CustomerOrderModal";

// ── helpers ───────────────────────────────────────────────────
const CURRENT_USER_ID = 1;

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
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    setTimeout(fetchMyOrders, 800);
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getUserOrders(CURRENT_USER_ID));
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
  ) => {
    try {
      await submitOrderRating(orderId, ratings);
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
      showToast(
        "เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองใหม่อีกครั้ง ❌",
        false,
      );
    } finally {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  const filtered = filterByTab(orders, activeTab);

  return (
    <section className="w-full min-h-screen bg-[var(--clr-bg-base)] text-white p-4 md:p-10 font-sans relative animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="border-l-4 border-[var(--clr-primary)] pl-4">
            <h1 className="text-2xl font-black tracking-wide">
              ประวัติการสั่งซื้อ
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              จัดการและติดตามสถานะคำสั่งซื้อของคุณ
            </p>
          </div>
          {toast && (
            <div
              className={`px-5 py-3 rounded-xl flex items-center gap-3 animate-bounce-in border shadow-2xl ${
                toast.ok
                  ? "bg-[var(--clr-bg-card)] border-green-500/50 text-green-400 shadow-[0_5px_20px_-5px_rgba(34,197,94,0.3)]"
                  : "bg-[var(--clr-bg-card)] border-red-500/50 text-red-400 shadow-[0_5px_20px_-5px_rgba(220,38,38,0.3)]"
              }`}
            >
              <CheckCircle
                size={22}
                className={toast.ok ? "text-green-500" : "text-red-500"}
              />
              <span className="font-bold text-sm tracking-wide">
                {toast.msg}
              </span>
            </div>
          )}
        </header>

        {/* ── Tabs ── */}
        <OrderTabs
          orders={orders}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ── Table column header (desktop) ── */}
        {!loading && filtered.length > 0 && (
          <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 mb-4 text-sm font-bold text-zinc-300 uppercase tracking-widest bg-[var(--clr-bg-card)] rounded-2xl border border-zinc-800/80 shadow-md">
            <div className="col-span-2 text-center">หมายเลขคำสั่งซื้อ</div>
            <div className="col-span-4 text-center">รายการสินค้า</div>
            <div className="col-span-2 text-center">ยอดรวมสุทธิ</div>
            <div className="col-span-2 text-center">สถานะ</div>
            <div className="col-span-2 text-center">การจัดการ</div>
          </div>
        )}

        {/* ── Order list ── */}
        <div className="flex flex-col gap-4">
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
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <CustomerOrderModal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onSubmitRating={handleRatingSubmit}
      />
    </section>
  );
};

export default NexusGearOrderStatus;
