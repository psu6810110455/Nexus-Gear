// features/admin/components/CancelOrderSummary.tsx

import { MapPin, Package, CreditCard } from "lucide-react";
import { getServerUrl } from "../../../../../shared/services/api";
import type { Order } from "../../../../../shared/types";

interface Props {
  order: Order;
}

const CancelOrderSummary = ({ order }: Props) => {
  const slipUrl = order.slip_image
    ? getServerUrl(`/uploads/slips/${order.slip_image}`)
    : null;

  return (
    <div className="space-y-4">
      {/* Buyer + Address / Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ผู้ซื้อ */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 space-y-3">
          <p className="text-[#FF0000] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <MapPin size={12} /> ผู้ซื้อ & ที่อยู่
          </p>
          <div>
            <p className="text-white font-bold">
              {order.user?.name || "ไม่ระบุ"}
            </p>
            <p className="text-zinc-500 text-xs">{order.user?.email || "-"}</p>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              {order.shipping_address}
            </p>
          </div>
        </div>

        {/* รายการสินค้า */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <p className="text-[#FF0000] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
            <Package size={12} /> รายการสินค้า
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={12} className="text-zinc-600" />
                  )}
                </div>
                <p className="text-zinc-300 text-xs flex-1 truncate">
                  {item.product.name}
                </p>
                <div className="text-right shrink-0">
                  <p className="text-zinc-500 text-[10px]">x{item.quantity}</p>
                  <p className="text-red-400 text-xs font-bold">
                    ฿{Number(item.price_at_purchase).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between">
            <span className="text-zinc-500 text-xs">ยอดรวมทั้งสิ้น</span>
            <span className="text-red-400 font-bold text-sm">
              ฿{Number(order.total_price).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Slip */}
      {slipUrl && (
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <p className="text-[#FF0000] text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
            <CreditCard size={12} /> หลักฐานการชำระเงินของลูกค้า
          </p>
          <div className="flex items-center gap-4">
            <img
              src={slipUrl}
              alt="slip"
              className="w-24 h-28 object-cover rounded-lg border border-zinc-700"
            />
            <div className="text-xs text-zinc-400 space-y-1">
              <p>
                ช่องทาง:{" "}
                <span className="text-zinc-200">
                  {order.payment_method === "qr" ? "QR Code" : "โอนเงินธนาคาร"}
                </span>
              </p>
              <p>
                วันที่สั่งซื้อ:{" "}
                <span className="text-zinc-200">
                  {new Date(order.created_at).toLocaleString("th-TH")}
                </span>
              </p>
              <p>
                ยอดชำระ:{" "}
                <span className="text-red-400 font-bold">
                  ฿{Number(order.total_price).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bank info */}
      {(order.user?.bank_name ||
        order.user?.bank_account ||
        order.refund_bank_name ||
        order.refund_bank_account) && (
        <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-800/40">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
            <CreditCard size={12} /> ข้อมูลธนาคารลูกค้า
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">ชื่อธนาคาร</p>
              <p className="text-zinc-200 text-sm font-bold">
                {order.refund_bank_name || order.user?.bank_name || "—"}
              </p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] mb-0.5">เลขบัญชี</p>
              <p className="text-zinc-200 text-sm font-bold">
                {order.refund_bank_account || order.user?.bank_account || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelOrderSummary;
