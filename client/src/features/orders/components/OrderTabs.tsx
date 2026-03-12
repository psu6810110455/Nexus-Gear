// features/orders/components/OrderTabs.tsx

import { Wallet, Package, Truck, Star, ClipboardList } from "lucide-react";

interface Order {
  status: string;
}

interface OrderTabsProps {
  orders: Order[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const TABS = [
  {
    id: "all",
    label: "ทั้งหมด",
    icon: ClipboardList,
    count: (o: Order[]) => 0,
  },
  {
    id: "pending",
    label: "รอตรวจสอบ",
    icon: Wallet,
    count: (o: Order[]) => o.filter((x) => x.status === "pending").length,
  },
  {
    id: "paid",
    label: "กำลังเตรียม",
    icon: Package,
    count: (o: Order[]) =>
      o.filter((x) => x.status === "paid" || x.status === "to_ship").length,
  },
  {
    id: "shipped",
    label: "ที่ต้องได้รับ",
    icon: Truck,
    count: (o: Order[]) => o.filter((x) => x.status === "shipped").length,
  },
  {
    id: "completed",
    label: "สำเร็จ",
    icon: Star,
    count: (o: Order[]) => o.filter((x) => x.status === "completed").length,
  },
];

const OrderTabs = ({ orders, activeTab, onTabChange }: OrderTabsProps) => (
  <nav className="bg-[#121212] rounded-2xl border border-zinc-800/80 p-2 mb-8 shadow-lg">
    <ul className="flex justify-between items-center overflow-x-auto scrollbar-hide">
      {TABS.map(({ id, label, icon: Icon, count }) => {
        const isActive = activeTab === id;
        const badge = count(orders);
        return (
          <li key={id} className="flex-1 min-w-[100px] text-center">
            <button
              onClick={() => onTabChange(id)}
              className={`w-full flex flex-col items-center gap-2 py-4 transition-all duration-300 relative rounded-xl ${
                isActive
                  ? "text-[var(--clr-primary)] bg-red-500/5"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[var(--clr-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#121212]">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className={`whitespace-nowrap text-sm md:text-base ${isActive ? "font-black" : "font-medium"}`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[var(--clr-primary)] rounded-t-full shadow-[0_-2px_8px_rgba(220,38,38,0.6)]" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default OrderTabs;
