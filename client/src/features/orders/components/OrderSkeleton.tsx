// features/orders/components/OrderSkeleton.tsx

export const OrderSkeleton = () => (
  <div className="bg-[#121212] rounded-2xl p-6 border border-zinc-800/80 animate-pulse flex flex-col md:grid md:grid-cols-12 gap-6 items-center">
    <div className="md:col-span-2 space-y-2">
      <div className="h-5 w-24 bg-zinc-800 rounded-md" />
      <div className="h-4 w-16 bg-zinc-800/50 rounded-md" />
    </div>
    <div className="md:col-span-4 flex gap-3">
      <div className="h-12 w-12 bg-zinc-800 rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-5 w-3/4 bg-zinc-800 rounded-md" />
        <div className="h-4 w-1/2 bg-zinc-800/50 rounded-md" />
      </div>
    </div>
    <div className="md:col-span-2">
      <div className="h-6 w-24 bg-zinc-800 rounded-md" />
    </div>
    <div className="md:col-span-2">
      <div className="h-8 w-24 bg-zinc-800 rounded-full" />
    </div>
    <div className="md:col-span-2">
      <div className="h-10 w-full md:w-28 bg-zinc-800 rounded-lg" />
    </div>
  </div>
);

// ── Empty state ────────────────────────────────────────────────
import { Package } from "lucide-react";

export const OrderEmpty = () => (
  <div className="w-full py-24 text-center bg-[#121212] rounded-3xl border border-zinc-800/80 flex flex-col items-center shadow-lg">
    <div className="bg-[#050505] p-5 rounded-full mb-4 border border-zinc-800">
      <Package size={40} className="text-zinc-600" />
    </div>
    <p className="text-zinc-400 text-lg font-bold">
      ยังไม่มีคำสั่งซื้อในสถานะนี้
    </p>
  </div>
);
