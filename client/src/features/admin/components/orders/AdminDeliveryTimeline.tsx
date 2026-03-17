// features/admin/components/orders/AdminDeliveryTimeline.tsx

import {
  Clock,
  Package,
  PackageCheck,
  Truck,
  Star,
  Ban,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "../../../../shared/context/LanguageContext";

const DELIVERY_STEPS = (t: any) => [
  { key: "pending", label: t('paymentNotified'), icon: Clock },
  { key: "paid", label: t('packaging'), icon: Package },
  { key: "to_ship", label: t('readyToShip'), icon: PackageCheck },
  { key: "shipped", label: t('shippedLabel'), icon: Truck },
  { key: "completed", label: t('completedStatus'), icon: Star },
];
const STATUS_ORDER = ["pending", "paid", "to_ship", "shipped", "completed"];

interface Props {
  status: string;
  cancelReason?: string | null;
}

const AdminDeliveryTimeline = ({ status, cancelReason }: Props) => {
  const { t } = useLanguage();
  const isCancelled = status === "cancelled";
  const isReturn = isCancelled && !!cancelReason?.startsWith("ขอคืนสินค้า:");
  const currentIdx = STATUS_ORDER.indexOf(status);
  const steps = DELIVERY_STEPS(t);

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
      {/* ── ส่วนบน: สถานะการจัดส่ง ── */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-red-500 mb-4 font-bold text-xs uppercase tracking-widest">
          <Truck size={13} /> {t('deliveryStatus')}
        </div>

        {isCancelled ? (
          isReturn ? (
            <div className="flex items-center gap-3 px-3 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <RotateCcw size={16} className="text-orange-400 shrink-0" />
              <div>
                <p className="text-orange-400 font-bold text-sm">
                  {t('returnRequested')}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {t('customerReturnReq')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <Ban size={16} className="text-red-400 shrink-0" />
              <div>
                <p className="text-red-400 font-bold text-sm">
                  {t('orderCancelled')}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {t('orderCancelledMsg')}
                </p>
              </div>
            </div>
          )
        ) : (
          <ol className="relative ml-3">
            {steps.map(({ key, label, icon: Icon }, idx) => {
              const isDone = currentIdx >= idx;
              const isCurrent = currentIdx === idx;
              return (
                <li
                  key={key}
                  className="flex items-start gap-3 pb-5 last:pb-0 relative"
                >
                  {idx < DELIVERY_STEPS.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-6 w-0.5 h-full -translate-x-1/2 ${currentIdx > idx ? "bg-green-500/60" : "bg-zinc-700"}`}
                    />
                  )}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isCurrent
                        ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                        : isDone
                          ? "bg-green-500/30 border-green-500/60"
                          : "bg-zinc-800 border-zinc-700"
                    }`}
                  >
                    <Icon
                      size={12}
                      className={isDone ? "text-green-300" : "text-zinc-600"}
                    />
                  </div>
                  <div className="pt-0.5">
                    <p
                      className={`text-sm font-bold ${isCurrent ? "text-green-400" : isDone ? "text-zinc-300" : "text-zinc-600"}`}
                    >
                      {label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                        {t('currentStatus')}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};

export default AdminDeliveryTimeline;
