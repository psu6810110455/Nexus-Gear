// features/orders/pages/NexusGearOrderStatus.tsx

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, AlertTriangle } from "lucide-react";
import {
  getMyOrders,
  submitOrderRating,
  cancelOrder,
  requestReturn,
} from "../../../shared/services/api";
import type { Order } from "../../../shared/types";
import { getSocket } from "../../../shared/services/socket";

import OrderTabs from "../components/OrderTabs";
import OrderCard from "../components/OrderCard";
import { OrderSkeleton, OrderEmpty } from "../components/OrderSkeleton";
import CustomerOrderModal from "../components/CustomerOrderModal";
import CancelOrderModal from "../components/CancelOrdermodal";

const RETURN_REASONS = [
  "สินค้าชำรุด / เสียหาย",
  "สินค้าไม่ตรงตามรายละเอียด",
  "ได้รับสินค้าผิดรายการ",
  "สินค้าไม่ครบตามจำนวน",
  "เปลี่ยนใจไม่ต้องการสินค้าแล้ว",
  "อื่นๆ",
];

// ── helpers ───────────────────────────────────────────────────
const filterByTab = (orders: Order[], tab: string) => {
  if (tab === "all") return orders;
  if (tab === "paid")
    return orders.filter((o) => o.status === "paid" || o.status === "to_ship");
  if (tab === "cancelled")
    return orders.filter((o) => o.status === "cancelled");
  return orders.filter((o) => o.status === tab);
};

// ── Page ──────────────────────────────────────────────────────
const NexusGearOrderStatus = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [returnTarget, setReturnTarget] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnCustomReason, setReturnCustomReason] = useState("");
  const [returnBankName, setReturnBankName] = useState("");
  const [returnBankAccount, setReturnBankAccount] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const replaceOrder = useCallback((updated: Order) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === updated.id
          ? { ...updated, items: updated.items ?? o.items }
          : o,
      ),
    );
    setSelectedOrder((prev) =>
      prev && prev.id === updated.id
        ? { ...updated, items: updated.items ?? prev.items }
        : prev,
    );
  }, []);

  useEffect(() => {
    setTimeout(fetchMyOrders, 800);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("orderUpdated", replaceOrder);
    socket.on("orderCancelled", replaceOrder);
    socket.on("refundProcessed", replaceOrder);
    return () => {
      socket.off("orderUpdated", replaceOrder);
      socket.off("orderCancelled", replaceOrder);
      socket.off("refundProcessed", replaceOrder);
    };
  }, [replaceOrder]);

  // Lock body scroll when return modal is open
  useEffect(() => {
    if (returnTarget) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [returnTarget]);

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

  const handleCancelOrder = async (
    orderId: number,
    reason: string,
    bankName?: string,
    bankAccount?: string,
  ) => {
    try {
      await cancelOrder(orderId, reason, undefined, bankName, bankAccount);
      // อัปเดต status ใน state ทันที — backend คืนสต็อกให้แล้ว
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "cancelled",
                cancel_reason: reason,
                refund_bank_name: bankName || null,
                refund_bank_account: bankAccount || null,
                refund_status:
                  bankName && bankAccount ? "pending" : o.refund_status,
              }
            : o,
        ),
      );
      setCancelTarget(null);
      showToast("ยกเลิกคำสั่งซื้อสำเร็จ สินค้าถูกคืนสต็อกแล้ว", true);
    } catch {
      showToast("เกิดข้อผิดพลาด ไม่สามารถยกเลิกได้", false);
    }
  };

  const handleReturnRequest = async () => {
    const finalReason =
      returnReason === "อื่นๆ" ? returnCustomReason.trim() : returnReason;
    if (!returnTarget || !finalReason) return;
    setReturnLoading(true);
    try {
      await requestReturn(
        returnTarget.id,
        finalReason,
        returnBankName.trim() || undefined,
        returnBankAccount.trim() || undefined,
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === returnTarget.id
            ? {
                ...o,
                status: "cancelled",
                cancel_reason: `ขอคืนสินค้า: ${finalReason}`,
                refund_status: "pending",
              }
            : o,
        ),
      );
      setReturnTarget(null);
      setReturnReason("");
      setReturnCustomReason("");
      setReturnBankName("");
      setReturnBankAccount("");
      showToast("ส่งคำขอคืนสินค้าสำเร็จ กรุณารอการติดต่อจากแอดมิน", true);
    } catch {
      showToast("ไม่สามารถคืนสินค้าได้ อาจเกินระยะเวลา 3 วัน", false);
    } finally {
      setReturnLoading(false);
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
                  order.status === "pending"
                    ? () => setCancelTarget(order)
                    : undefined
                }
                onReturn={
                  order.status === "completed"
                    ? () => setReturnTarget(order)
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

      {/* ── Return Request Modal ── */}
      {returnTarget &&
        createPortal(
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-2xl w-full max-w-md shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-zinc-800 shrink-0">
                <h2 className="text-lg font-bold text-white">ขอคืนสินค้า</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  คำสั่งซื้อ #{String(returnTarget.id).padStart(3, "0")} —
                  สามารถคืนสินค้าได้ภายใน 3 วันหลังสำเร็จ
                </p>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-dark">
                <div>
                  <p className="text-zinc-400 text-xs font-bold mb-2 uppercase tracking-widest">
                    เหตุผลที่ขอคืน *
                  </p>
                  <div className="space-y-2">
                    {RETURN_REASONS.map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          returnReason === r
                            ? "border-orange-500/50 bg-orange-500/5 text-white"
                            : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="returnReason"
                          value={r}
                          checked={returnReason === r}
                          onChange={() => setReturnReason(r)}
                          className="accent-orange-500"
                        />
                        <span className="text-sm">{r}</span>
                      </label>
                    ))}
                  </div>
                  {returnReason === "อื่นๆ" && (
                    <textarea
                      rows={3}
                      placeholder="ระบุเหตุผล..."
                      value={returnCustomReason}
                      onChange={(e) => setReturnCustomReason(e.target.value)}
                      className="mt-2 w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500/50 text-zinc-200 text-sm rounded-xl px-4 py-3 resize-none outline-none placeholder-zinc-600 transition-colors"
                    />
                  )}
                </div>

                {/* ── ข้อมูลบัญชีคืนเงิน ── */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <p className="text-orange-400 text-xs font-bold flex items-center gap-1.5">
                    💳 ข้อมูลสำหรับคืนเงิน (ไม่บังคับ)
                  </p>
                  <div>
                    <label className="text-zinc-500 text-xs mb-1 block">
                      ชื่อธนาคาร
                    </label>
                    <select
                      value={returnBankName}
                      onChange={(e) => setReturnBankName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500/50 text-zinc-200 text-sm rounded-lg px-3 py-2.5 outline-none transition-colors"
                    >
                      <option value="">-- เลือกธนาคาร --</option>
                      <option value="กสิกรไทย (KBANK)">กสิกรไทย (KBANK)</option>
                      <option value="กรุงเทพ (BBL)">กรุงเทพ (BBL)</option>
                      <option value="กรุงไทย (KTB)">กรุงไทย (KTB)</option>
                      <option value="ไทยพาณิชย์ (SCB)">ไทยพาณิชย์ (SCB)</option>
                      <option value="กรุงศรี (BAY)">กรุงศรี (BAY)</option>
                      <option value="ทหารไทยธนชาต (TTB)">
                        ทหารไทยธนชาต (TTB)
                      </option>
                      <option value="ออมสิน (GSB)">ออมสิน (GSB)</option>
                      <option value="เกียรตินาคินภัทร (KKP)">
                        เกียรตินาคินภัทร (KKP)
                      </option>
                      <option value="ซีไอเอ็มบี (CIMB)">
                        ซีไอเอ็มบี (CIMB)
                      </option>
                      <option value="ยูโอบี (UOB)">ยูโอบี (UOB)</option>
                      <option value="แลนด์แอนด์เฮ้าส์ (LHBANK)">
                        แลนด์แอนด์เฮ้าส์ (LHBANK)
                      </option>
                      <option value="พร้อมเพย์ (PromptPay)">
                        พร้อมเพย์ (PromptPay)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs mb-1 block">
                      เลขบัญชี
                    </label>
                    <input
                      value={returnBankAccount}
                      onChange={(e) => setReturnBankAccount(e.target.value)}
                      placeholder="เลขบัญชีธนาคาร"
                      className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500/50 text-zinc-200 text-sm rounded-lg px-3 py-2.5 outline-none placeholder-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setReturnTarget(null);
                      setReturnReason("");
                      setReturnCustomReason("");
                      setReturnBankName("");
                      setReturnBankAccount("");
                    }}
                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors font-bold text-sm"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleReturnRequest}
                    disabled={
                      !returnReason ||
                      (returnReason === "อื่นๆ" &&
                        !returnCustomReason.trim()) ||
                      returnLoading
                    }
                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all font-bold text-sm"
                  >
                    {returnLoading ? "กำลังดำเนินการ..." : "ยืนยันคืนสินค้า"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default NexusGearOrderStatus;
