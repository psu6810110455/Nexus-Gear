// ============================================================
// src/features/admin/pages/NexusGearAdminOrders.tsx
// ============================================================

import { useEffect, useState } from "react";
import { Search, CheckCircle, AlertTriangle } from "lucide-react";
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from "../../../shared/services/api";
import type { Order } from "../../../shared/types";

import AdminLayout from "../../navigation/components/AdminLayout";
import AdminOrdersTabs from "../components/AdminOrdersTabs";
import AdminOrdersTable from "../components/AdminOrdersTable";
import OrderDetailModal from "../../orders/components/OrderDetailModal";
import AdminCancelOrderModal from "../components/AdminCancelOrderModal";

const THAI_STATUS: Record<string, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระเงินแล้ว",
  to_ship: "เตรียมจัดส่ง",
  shipped: "จัดส่งแล้ว",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
};

const NexusGearAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

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

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
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
      showToast(
        `อัปเดตสถานะเป็น "${THAI_STATUS[newStatus] || newStatus}" สำเร็จ!`,
        true,
      );
    } catch {
      showToast("เกิดข้อผิดพลาดในการอัปเดตสถานะ", false);
    }
  };

  const handleAdminCancel = async (
    orderId: number,
    payload: {
      reason: string;
      refundAmount: string;
      refundChannel: string;
      refundEvidence: string;
      restock: boolean;
    },
  ) => {
    try {
      // ส่ง reason + restock ไปยัง PATCH /orders/:id/cancel
      await cancelOrder(orderId, payload.reason, payload.restock);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" as any } : o,
        ),
      );
      setCancelTarget(null);
      showToast(
        `ยกเลิกคำสั่งซื้อ #${String(orderId).padStart(3, "0")} สำเร็จ${payload.restock ? " (คืนสต็อกแล้ว)" : ""}`,
        true,
      );
    } catch {
      showToast("เกิดข้อผิดพลาดในการยกเลิก", false);
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
    <AdminLayout breadcrumb="จัดการคำสั่งซื้อ">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right duration-300 font-['Kanit'] ${
            toast.ok
              ? "bg-black border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              : "bg-black border-[#FF0000] text-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          }`}
        >
          {toast.ok ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] tracking-widest uppercase">
            ORDERS
          </h1>
          <p className="text-[#F2F4F6]/40 text-sm mt-1 font-['Kanit']">
            จัดการและตรวจสอบสถานะคำสั่งซื้อทั้งหมด
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full xl:w-96 group shrink-0">
          <div className="absolute inset-0 bg-[#FF0000]/10 blur-lg rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F2F4F6]/30 group-focus-within:text-[#FF0000] transition-colors duration-300 z-10"
          />
          <input
            type="text"
            placeholder="ค้นหารหัสคำสั่งซื้อ หรือ ชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#150000] border border-[#990000]/30 text-[#F2F4F6] text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FF0000]/50 focus:ring-1 focus:ring-[#FF0000]/30 transition-all placeholder-[#F2F4F6]/20 font-['Kanit'] relative z-10"
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-[#000000]/60 border border-[#990000]/30 rounded-2xl px-4 pt-2 backdrop-blur-md mb-6">
        <AdminOrdersTabs
          orders={orders}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-[#000000]/60 border border-[#990000]/20 rounded-2xl overflow-hidden backdrop-blur-md">
        <AdminOrdersTable
          orders={filtered}
          loading={loading}
          onViewOrder={(order) => setSelectedOrder(order)}
          onCancelOrder={(order) => setCancelTarget(order)}
        />
      </div>

      {/* ── Modals ── */}
      <OrderDetailModal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      <AdminCancelOrderModal
        isOpen={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        order={cancelTarget}
        onConfirm={handleAdminCancel}
      />
    </AdminLayout>
  );
};

export default NexusGearAdminOrders;
