// features/orders/components/AdminSlipViewer.tsx

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
    cls: "bg-orange-600 hover:bg-orange-500 shadow-orange-900/50",
  },
  paid: {
    label: "เตรียมจัดส่ง",
    next: "to_ship",
    cls: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/50",
  },
  to_ship: {
    label: "ยืนยันการส่งของ",
    next: "shipped",
    cls: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50",
  },
  shipped: {
    label: "สำเร็จ",
    next: "completed",
    cls: "bg-green-600 hover:bg-green-500 shadow-green-900/50",
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
    <div className="space-y-6 flex flex-col h-full">
      {/* Slip */}
      <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase">
            <FileText size={16} /> หลักฐานการโอนเงิน
          </div>
          {order.payment_method && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium">
              {order.payment_method === "qr" ? "📱 QR Code" : "🏦 โอนเงิน"}
            </span>
          )}
        </div>

        {slipUrl ? (
          <div className="flex-1 flex flex-col gap-3">
            <div
              className="relative group cursor-pointer"
              onClick={() => onLightbox(slipUrl)}
            >
              <img
                src={slipUrl}
                alt="สลิปการชำระเงิน"
                className="w-full max-h-52 object-contain rounded-lg border border-zinc-700 bg-black/40 transition-opacity group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 rounded-full p-3">
                  <ZoomIn size={24} className="text-white" />
                </div>
              </div>
            </div>
            <div className="text-xs text-zinc-500 space-y-1 px-1">
              <p>
                ช่องทาง:{" "}
                <span className="text-zinc-300">
                  {order.payment_method === "qr"
                    ? "สแกน QR Code"
                    : "โอนเงินผ่านธนาคาร"}
                </span>
              </p>
              <p>
                วันที่:{" "}
                <span className="text-zinc-300">
                  {new Date(order.created_at).toLocaleString("th-TH")}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-black/40 rounded-lg border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 p-8 min-h-[200px]">
            <CreditCard size={40} className="mb-2 opacity-50" />
            <span className="text-sm">ยังไม่มีหลักฐานการชำระเงิน</span>
            <span className="text-xs text-zinc-700 mt-1">
              (ลูกค้ายังไม่ได้แนบสลิป)
            </span>
          </div>
        )}
      </div>

      {/* Total & Actions */}
      <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-zinc-400 text-sm">วิธีชำระเงิน</span>
          <span className="text-zinc-200 text-sm font-medium">
            {order.payment_method === "qr"
              ? "📱 QR Code"
              : order.payment_method
                ? "🏦 โอนเงินธนาคาร"
                : "—"}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-zinc-400 text-sm">ยอดรวมทั้งสิ้น</span>
          <span className="text-3xl font-bold text-red-500">
            ฿{Number(order.total_price).toLocaleString()}
          </span>
        </div>

        <div className="pt-2 space-y-2">
          {action && (
            <button
              onClick={() => onUpdateStatus(order.id, action.next)}
              className={`w-full py-3 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 ${action.cls}`}
            >
              <CheckCircle size={20} /> {action.label}
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
              className="w-full py-2.5 bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 text-red-400 font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {quickCancelLoading ? (
                "กำลังยกเลิก..."
              ) : (
                <>
                  <Ban size={16} /> ยกเลิกด่วน (สลิปปลอม)
                </>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSlipViewer;
