import {
  X,
  MapPin,
  FileText,
  Package,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { type Order } from "../../../shared/types"; // Import Type Order

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (id: number, status: string) => void;
}

const OrderDetailModal = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
}: OrderDetailModalProps) => {
  if (!isOpen || !order) return null;

  const getThaiStatus = (status: string) => {
    const thStatus: Record<string, string> = {
      pending: "รอชำระเงิน",
      paid: "ชำระเงินแล้ว",
      to_ship: "เตรียมจัดส่ง",
      shipped: "จัดส่งแล้ว",
      completed: "สำเร็จ",
      cancelled: "ยกเลิก",
    };
    return thStatus[status] || status;
  };

  // ฟังก์ชันคำนวณสถานะเพื่อแสดงปุ่ม Action ที่เหมาะสม
  const renderActionButtons = () => {
    switch (order.status) {
      case "pending":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "paid")}
            className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-orange-900/50 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            ยืนยันการโอนเงิน
          </button>
        );
      case "paid":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "to_ship")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-900/50"
          >
            เตรียมจัดส่ง
          </button>
        );
      case "to_ship":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "shipped")}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-indigo-900/50"
          >
            ยืนยันการส่งของ
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => onUpdateStatus(order.id, "completed")}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-900/50"
          >
            สำเร็จ
          </button>
        );
      default:
        return null;
    }
  };

  return (
    // Backdrop (พื้นหลังมัวๆ)
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-[#0f0f0f] border border-red-500/30 w-full max-w-4xl rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.2)] overflow-hidden animate-fade-in relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-red-900/20 to-transparent">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-wider">
                รายละเอียดคำสั่งซื้อ
              </h2>
              <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full border border-green-500/20 uppercase">
                {getThaiStatus(order.status)}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              รหัสคำสั่งซื้อ: ORD-{new Date().getFullYear() + 543}-
              {String(order.id).padStart(3, "0")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Address & Items */}
          <div className="space-y-6">
            {/* Address Box */}
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-sm uppercase">
                <MapPin size={16} /> ที่อยู่ในการจัดส่ง
              </div>
              <p className="text-white font-medium">
                {order.user?.username || "ไม่ระบุชื่อ"}
              </p>
              <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                {order.shipping_address}
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                เบอร์โทร: 081-XXX-XXXX (Mock)
              </p>
            </div>

            {/* Items List */}
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-sm uppercase">
                <Package size={16} /> รายการสินค้า
              </div>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500">
                        Img
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {item.product.name}
                        </div>
                        <div className="text-zinc-500 text-xs">
                          x{item.quantity} ชิ้น
                        </div>
                      </div>
                    </div>
                    <div className="text-red-400 font-bold">
                      ฿{Number(item.price_at_purchase).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Slip & Summary */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Slip / Payment Proof */}
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-sm uppercase">
                <FileText size={16} /> หลักฐานการโอนเงิน
              </div>
              <div className="flex-1 bg-black/40 rounded-lg border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 p-8 min-h-[200px]">
                <CreditCard size={40} className="mb-2 opacity-50" />
                <span className="text-sm">ยังไม่มีหลักฐานการชำระเงิน</span>
                <span className="text-xs text-zinc-700">(ยังไม่มีข้อมูล)</span>
              </div>
            </div>

            {/* Total & Action */}
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-zinc-400">สถานะการจัดส่ง</span>
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  แจ้งชำระเงินแล้ว
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-zinc-400 text-sm">ยอดรวมทั้งสิ้น</span>
                <span className="text-3xl font-bold text-red-500">
                  ฿{Number(order.total_price).toLocaleString()}
                </span>
              </div>

              {/* Action Button Area */}
              <div className="pt-2">
                {renderActionButtons()}
                <button
                  onClick={onClose}
                  className="w-full mt-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
