// features/admin/pages/NexusGearAdminOrders.tsx

import { useEffect, useState } from "react";
import { Search, CheckCircle } from "lucide-react";
import { getOrders, updateOrderStatus } from "../../../shared/services/api";
import type { Order } from "../../../shared/types";

import AdminOrdersTabs from "../components/AdminOrdersTabs";
import AdminOrdersTable from "../components/AdminOrdersTable";
import OrderDetailModal from "../../orders/components/OrderDetailModal";

// ── helpers ───────────────────────────────────────────────────
const THAI_STATUS: Record<string, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระเงินแล้ว",
  to_ship: "เตรียมจัดส่ง",
  shipped: "จัดส่งแล้ว",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
};

// ── Page ──────────────────────────────────────────────────────
const NexusGearAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(fetchOrders, 500);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getOrders());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as any } : o,
        ),
      );
      setSelectedOrder(null);
      setToast(
        `อัปเดตสถานะเป็น "${THAI_STATUS[newStatus] || newStatus}" สำเร็จ! ✅`,
      );
    } catch {
      setToast("เกิดข้อผิดพลาดในการอัปเดตสถานะ ❌");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = orders.filter((order) => {
    const matchTab = activeTab === "All" || order.status === activeTab;
    const search = searchTerm.toLowerCase();
    const matchSearch =
      `ORD-${String(order.id).padStart(3, "0")}`
        .toLowerCase()
        .includes(search) ||
      (order.user?.username || "").toLowerCase().includes(search);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide uppercase">
              จัดการคำสั่งซื้อ
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              จัดการและตรวจสอบสถานะคำสั่งซื้อทั้งหมด
            </p>
          </div>
          {toast && (
            <div className="bg-[var(--clr-bg-card)] border border-green-500/50 text-green-400 px-4 py-2.5 rounded-xl shadow-[0_5px_20px_-5px_rgba(34,197,94,0.3)] flex items-center gap-2 animate-fade-in shrink-0">
              <CheckCircle size={20} className="text-green-500" />
              <span className="font-bold text-sm tracking-wide">{toast}</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96 group shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-zinc-500 group-focus-within:text-[var(--clr-primary)] transition-colors duration-300"
            />
          </div>
          <input
            type="text"
            placeholder="ค้นหารหัสคำสั่งซื้อ หรือ ชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--clr-bg-card)] border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[var(--clr-primary)]/50 focus:ring-1 focus:ring-[var(--clr-primary)]/50 transition-all placeholder-zinc-600 shadow-inner"
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <AdminOrdersTabs
        orders={orders}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ── Table ── */}
      <AdminOrdersTable
        orders={filtered}
        loading={loading}
        onViewOrder={(order) => setSelectedOrder(order)}
      />

      {/* ── Modal ── */}
      <OrderDetailModal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default NexusGearAdminOrders;
