// features/orders/components/DeliveryTimeline.tsx

import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  Ban,
  RotateCcw,
} from "lucide-react";

const STEPS = [
  { key: "pending", label: "แจ้งชำระเงิน", icon: Clock },
  { key: "paid", label: "เตรียมพัสดุ", icon: PackageCheck },
  { key: "shipped", label: "กำลังจัดส่ง", icon: Truck },
  { key: "completed", label: "สำเร็จ", icon: CheckCircle2 },
];

const toStepKey = (s: string) => (s === "to_ship" ? "paid" : s);

export const getCarrier = (status: string) => {
  if (status === "shipped" || status === "completed")
    return {
      name: "Kerry Express",
      cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    };
  if (status === "to_ship")
    return {
      name: "กำลังจัดเตรียม",
      cls: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    };
  return null;
};

interface Props {
  status: string;
  cancelReason?: string | null;
}

const DeliveryTimeline = ({ status, cancelReason }: Props) => {
  if (status === "cancelled") {
    const isReturn = cancelReason?.startsWith("ขอคืนสินค้า:") ?? false;
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${
          isReturn
            ? "bg-orange-500/10 border-orange-500/20"
            : "bg-red-500/10 border-red-500/20"
        }`}
      >
        {isReturn ? (
          <RotateCcw size={14} className="text-orange-400 shrink-0" />
        ) : (
          <Ban size={14} className="text-red-400 shrink-0" />
        )}
        <p
          className={`text-sm font-bold ${isReturn ? "text-orange-400" : "text-red-400"}`}
        >
          {isReturn ? "คืนสินค้า" : "คำสั่งซื้อถูกยกเลิกแล้ว"}
        </p>
      </div>
    );
  }

  const cur = STEPS.findIndex((s) => s.key === toStepKey(status));

  return (
    <div className="flex items-start justify-between px-1">
      {STEPS.map(({ key, label, icon: Icon }, idx) => {
        const done = cur >= idx,
          current = cur === idx;
        return (
          <div
            key={key}
            className="flex-1 flex flex-col items-center gap-1.5 relative"
          >
            {idx < STEPS.length - 1 && (
              <div
                className={`absolute top-3.5 left-1/2 w-full h-px z-0 ${done && cur > idx ? "bg-green-500/50" : "bg-zinc-700/50"}`}
              />
            )}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${
                current
                  ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  : done
                    ? "bg-green-500/20 border-green-500/50"
                    : "bg-zinc-800 border-zinc-700"
              }`}
            >
              <Icon
                size={12}
                className={done ? "text-green-300" : "text-zinc-600"}
              />
            </div>
            <p
              className={`text-[10px] font-bold text-center leading-tight ${
                current
                  ? "text-green-400"
                  : done
                    ? "text-zinc-400"
                    : "text-zinc-600"
              }`}
            >
              {label}
              {current && (
                <span className="block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mx-auto mt-0.5" />
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DeliveryTimeline;
