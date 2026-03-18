// ============================================================
// src/features/admin/pages/NexusGearAdminOrders.tsx
// ============================================================

import { useEffect, useState } from "react";
import { Search, CheckCircle, AlertTriangle } from "lucide-react";
import {
  getOrders,
  updateOrderStatus,
  cancelOrder,
  processRefund,
  rejectRefund,
} from "../../../shared/services/api";
import { getSocket } from "../../../shared/services/socket";
import type { Order } from "../../../shared/types";

import AdminLayout from "../../navigation/components/AdminLayout";
import AdminOrdersTabs from "../components/orders/AdminOrdersTabs";
import AdminOrdersTable from "../components/orders/AdminOrdersTable";
import OrderDetailModal from "../../orders/components/OrderDetailModal";
import AdminCancelOrderModal from "../components/orders/modals/AdminCancelOrderModal";
import { useLanguage } from '../../../shared/context/LanguageContext';

const NexusGearAdminOrders = () => {
  const { t, language } = useLanguage();

  // Localized Status Mapping
  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    'pending': {
      label: language === 'TH' ? 'รอตรวจสอบ' : 'Wait Verify',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    'paid': {
      label: language === 'TH' ? 'ชำระเงินแล้ว' : 'Paid',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    'processing': {
      label: language === 'TH' ? 'เตรียมจัดส่ง' : 'To Ship',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    'shipped': {
      label: language === 'TH' ? 'ระหว่างขนส่ง' : 'Shipping',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    'completed': {
      label: language === 'TH' ? 'สำเร็จ' : 'Completed',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    'cancelled': {
      label: language === 'TH' ? 'ยกเลิก' : 'Cancelled',
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
    'returned': {
      label: language === 'TH' ? 'คืนสินค้า' : 'Returned',
      color: 'text-gray-400',
      bg: 'bg-gray-400/10'
    }
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    setTimeout(fetchOrders, 500);
  }, []);

  // ── Socket.io real-time updates ──
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = (updated: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)),
      );
      setSelectedOrder((prev) =>
        prev && prev.id === updated.id ? { ...prev, ...updated } : prev,
      );
    };
    socket.on("orderUpdated", handleUpdate);
    socket.on("orderCancelled", handleUpdate);
    socket.on("refundProcessed", handleUpdate);
    socket.on("refundRejected", handleUpdate);
    return () => {
      socket.off("orderUpdated", handleUpdate);
      socket.off("orderCancelled", handleUpdate);
      socket.off("refundProcessed", handleUpdate);
      socket.off("refundRejected", handleUpdate);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(); console.log("First order:", data[0]); setOrders(data);
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
        `อัปเดตสถานะเป็น "${STATUS_CONFIG[newStatus]?.label || newStatus}" สำเร็จ!`,
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
      await cancelOrder(orderId, payload.reason, payload.restock);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "cancelled" as any,
                cancel_reason: payload.reason,
              }
            : o,
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

  const handleRefund = async (orderId: number, formData: FormData) => {
    try {
      const updated = await processRefund(orderId, formData);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                refund_amount: updated.refund_amount,
                refund_channel: updated.refund_channel,
                refund_slip: updated.refund_slip,
                refund_status: updated.refund_status,
                refunded_at: updated.refunded_at,
              }
            : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              refund_amount: updated.refund_amount,
              refund_channel: updated.refund_channel,
              refund_slip: updated.refund_slip,
              refund_status: updated.refund_status,
              refunded_at: updated.refunded_at,
            }
          : prev,
      );
      showToast("คืนเงินสำเร็จ!", true);
    } catch {
      showToast("เกิดข้อผิดพลาดในการคืนเงิน", false);
    }
  };

  const handleQuickCancel = async (orderId: number) => {
    try {
      await cancelOrder(orderId, "สลิปปลอม / หลักฐานไม่ถูกต้อง", true);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "cancelled",
                cancel_reason: "สลิปปลอม / หลักฐานไม่ถูกต้อง",
              }
            : o,
        ),
      );
      setSelectedOrder(null);
      showToast("ยกเลิกด่วนสำเร็จ! (สลิปปลอม)", true);
    } catch {
      showToast("เกิดข้อผิดพลาดในการยกเลิก", false);
    }
  };

  const handleRejectRefund = async (orderId: number) => {
    try {
      const updated = await rejectRefund(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, refund_status: updated.refund_status } : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? { ...prev, refund_status: updated.refund_status }
          : prev,
      );
      showToast("ปฏิเสธการคืนเงินสำเร็จ!", true);
    } catch {
      showToast("เกิดข้อผิดพลาดในการปฏิเสธ", false);
    }
  };

  const filtered = orders.filter((order) => {
    const matchTab = activeTab === "all" || order.status === activeTab;
    const search = searchTerm.toLowerCase();
    const matchSearch =
      (order.order_number || "").toLowerCase().includes(search) ||
      String(order.id).includes(search) ||
      (order.user?.name || "").toLowerCase().includes(search);
    return matchTab && matchSearch;
  });

  // ── Sort: เรียงตาม workflow ───────────────────────────────────
  // pending → paid → to_ship → shipped → completed
  // → cancelled (ยกเลิก): pending → refunded → rejected
  // → cancelled (คืนสินค้า): pending → refunded → rejected
  const STATUS_RANK: Record<string, number> = {
    pending: 0,
    paid: 1,
    processing: 2, // Changed from to_ship to processing
    shipped: 3,
    completed: 4,
  };
  const QUICK_CANCEL = "สลิปปลอม / หลักฐานไม่ถูกต้อง";
  const isReturnOrd = (o: Order) =>
    o.status === "cancelled" && !!o.cancel_reason?.startsWith("ขอคืนสินค้า:");
  const refundPriority = (o: Order): number => {
    if (o.refund_status === "rejected" || o.cancel_reason === QUICK_CANCEL)
      return 2;
    if (o.refund_status === "refunded") return 1;
    return 0;
  };

  const sortedFiltered = [...filtered].sort((a, b) => {
    const aReturn = isReturnOrd(a);
    const bReturn = isReturnOrd(b);
    const aCancel = a.status === "cancelled";
    const bCancel = b.status === "cancelled";
    const aRank = STATUS_RANK[a.status] ?? 99;
    const bRank = STATUS_RANK[b.status] ?? 99;

    // active orders เรียงตาม workflow ก่อน
    if (!aCancel && !bCancel)
      return aRank !== bRank ? aRank - bRank : b.id - a.id;
    // cancelled ลงท้าย active
    if (!aCancel && bCancel) return -1;
    if (aCancel && !bCancel) return 1;
    // ภายใน cancelled: ยกเลิก (ไม่ใช่คืนสินค้า) ก่อน คืนสินค้า
    if (!aReturn && bReturn) return -1;
    if (aReturn && !bReturn) return 1;
    // ภายใน group เดียวกัน: pending → refunded → rejected
    const refundDiff = refundPriority(a) - refundPriority(b);
    if (refundDiff !== 0) return refundDiff;
    return b.id - a.id;
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
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] flex items-center gap-3">
              <div aria-hidden="true" className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
              {t('manageOrders')}
            </h1>
            <p className="text-[#F2F4F6]/40 font-['Kanit'] text-sm">
              {language === 'TH' ? 'ตรวจสอบยอดชำระและจัดการสถานะการจัดส่ง' : 'Verify payments and manage shipping status'}
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
          orders={sortedFiltered}
          loading={loading}
          onViewOrder={(order) => setSelectedOrder(order)}
          onCancelOrder={(order) => setCancelTarget(order)}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {/* ── Modals ── */}
      <OrderDetailModal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onRefund={handleRefund}
        onQuickCancel={handleQuickCancel}
        onRejectRefund={handleRejectRefund}
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
