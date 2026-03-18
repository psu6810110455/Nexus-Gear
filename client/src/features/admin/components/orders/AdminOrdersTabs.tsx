// features/admin/components/AdminOrdersTabs.tsx

interface Order {
  status: string;
}

interface AdminOrdersTabsProps {
  orders: Order[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { label: "ทั้งหมด", value: "all" },
  { label: "รอตรวจสอบ", value: "pending" },
  { label: "ชำระเงินแล้ว", value: "paid" },
  { label: "เตรียมจัดส่ง", value: "to_ship" },
  { label: "ระหว่างขนส่ง", value: "shipped" },
  { label: "สำเร็จ", value: "completed" },
  { label: "ยกเลิก/คืนสินค้า", value: "cancelled" },
];

const AdminOrdersTabs = ({
  orders,
  activeTab,
  onTabChange,
}: AdminOrdersTabsProps) => (
  <div className="flex items-center gap-2 border-b border-zinc-800/50 mb-6 overflow-x-auto scrollbar-hide">
    {TABS.map(({ label, value }) => {
      const count =
        value === "all"
          ? orders.length
          : orders.filter((o) => o.status === value).length;
      const isActive = activeTab === value;
      return (
        <button
          key={value}
          onClick={() => onTabChange(value)}
          className={`relative px-4 py-3 text-sm font-bold transition-all duration-300 flex items-center gap-2 group whitespace-nowrap ${
            isActive
              ? "text-[var(--clr-primary)]"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {label}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
              isActive
                ? "bg-red-500/20 text-[var(--clr-primary)]"
                : "bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300"
            }`}
          >
            {count}
          </span>
          {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--clr-primary)] shadow-[0_0_8px_rgba(239,68,68,0.8)] rounded-t-full animate-fade-in" />
          )}
        </button>
      );
    })}
  </div>
);

export default AdminOrdersTabs;
