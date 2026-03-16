// features/admin/components/orders/AdminSlipViewer.tsx

import { FileText, CreditCard, Ban, ZoomIn, CheckCircle } from "lucide-react";
import type { Order } from "../../../../shared/types";

interface Props {
  order: Order;
  onLightbox: (src: string) => void;
  onUpdateStatus: (id: number, status: string) => void;
  onQuickCancel?: (orderId: number) => Promise<void>;
  onClose: () => void;
  quickCancelLoading: boolean;
  setQuickCancelLoading: (v: boolean) => void;
}

const ACTION_BUTTONS: Record<
  string,
  { label: string; next: string; cls: string }
> = {
  pending: {
    label: "ยืนยันการโอนเงิน",
    next: "paid",
    cls: "bg-orange-600 hover:bg-orange-500",
  },
  paid: {
    label: "เตรียมจัดส่ง",
    next: "to_ship",
    cls: "bg-blue-600 hover:bg-blue-500",
  },
  to_ship: {
    label: "ยืนยันการส่งของ",
    next: "shipped",
    cls: "bg-indigo-600 hover:bg-indigo-500",
  },
  shipped: {
    label: "สำเร็จ",
    next: "completed",
    cls: "bg-green-600 hover:bg-green-500",
  },
};

const AdminSlipViewer = ({
  order,
  onLightbox,
  onUpdateStatus,
  onQuickCancel,
  onClose,
  quickCancelLoading,
  setQuickCancelLoading,
}: Props) => {
  const slipUrl = order.slip_image
    ? `http://localhost:3000/uploads/slips/${order.slip_image}`
    : null;
  const action = ACTION_BUTTONS[order.status];

  return (
    <div className="space-y-4">
      {/* ── หลักฐานการโอนเงิน ── */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
            <FileText size={13} /> หลักฐานการโอนเงิน
          </div>
          {order.payment_method && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium">
              {order.payment_method === "qr" ? "📱 QR Code" : "🏦 โอนเงิน"}
            </span>
          )}
        </div>

        {/* slip image */}
        {slipUrl ? (
          <div className="p-3 space-y-2">
            <div
              className="relative group cursor-pointer rounded-lg overflow-hidden border border-zinc-700 bg-black/40"
              onClick={() => onLightbox(slipUrl)}
            >
              <img
                src={slipUrl}
                alt="สลิปการชำระเงิน"
                className="w-full h-52 object-contain transition-opacity group-hover:opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="bg-black/70 rounded-full p-2.5">
                  <ZoomIn size={20} className="text-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs px-0.5">
              <span className="text-zinc-500">
                {order.payment_method === "qr"
                  ? "สแกน QR Code"
                  : "โอนเงินผ่านธนาคาร"}
              </span>
              <span className="text-zinc-500">
                {new Date(order.created_at).toLocaleDateString("th-TH")}
              </span>
            </div>
          </div>
        ) : (
          <div className="m-3 bg-black/40 rounded-lg border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 py-10">
            <CreditCard size={32} className="mb-2 opacity-40" />
            <span className="text-sm">ยังไม่มีหลักฐานการชำระเงิน</span>
            <span className="text-xs text-zinc-700 mt-0.5">
              (ลูกค้ายังไม่ได้แนบสลิป)
            </span>
          </div>
        )}
      </div>

      {/* ── ยอดรวม + วิธีชำระ ── */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-xs">วิธีชำระเงิน</p>
          <p className="text-zinc-200 text-sm font-semibold mt-0.5">
            {order.payment_method === "qr"
              ? "📱 QR Code"
              : order.payment_method
                ? "🏦 โอนเงินธนาคาร"
                : "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-zinc-500 text-xs">ยอดรวมทั้งสิ้น</p>
          <p className="text-2xl font-black text-red-500 mt-0.5">
            ฿{Number(order.total_price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="space-y-2">
        {action && (
          <button
            onClick={() => onUpdateStatus(order.id, action.next)}
            className={`w-full py-3 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${action.cls}`}
          >
            <CheckCircle size={18} /> {action.label}
          </button>
        )}
        {onQuickCancel && order.status === "pending" && (
          <button
            onClick={async () => {
              setQuickCancelLoading(true);
              await onQuickCancel(order.id);
              setQuickCancelLoading(false);
            }}
            disabled={quickCancelLoading}
            className="w-full py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {quickCancelLoading ? (
              "กำลังยกเลิก..."
            ) : (
              <>
                <Ban size={15} /> ยกเลิกด่วน (สลิปปลอม)
              </>
            )}
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors text-sm font-medium"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

export default AdminSlipViewer;
