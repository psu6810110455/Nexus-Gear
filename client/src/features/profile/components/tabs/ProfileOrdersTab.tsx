import React from 'react';
import { Package, Wallet, Truck, Star } from 'lucide-react';
import type { Order } from '../../types/profile.types';

interface ProfileOrdersTabProps {
  orders: Order[];
  onOpenStatus: (label: string) => void;
  onOpenDetail: (order: Order) => void;
}

export const ProfileOrdersTab: React.FC<ProfileOrdersTabProps> = ({ orders, onOpenStatus, onOpenDetail }) => {
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { delivered: 'bg-green-900/20 text-green-400 border-green-900', shipping: 'bg-blue-900/20 text-blue-400 border-blue-900', processing: 'bg-yellow-900/20 text-yellow-400 border-yellow-900', pending_payment: 'bg-orange-900/20 text-orange-400 border-orange-900' };
    const labels: Record<string, string> = { delivered: 'สำเร็จ', shipping: 'ที่ต้องได้รับ', processing: 'ที่ต้องจัดส่ง', pending_payment: 'รอชำระ' };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-['Orbitron'] tracking-wider border ${styles[status] || 'bg-gray-900/20 text-gray-400 border-gray-900'}`}>{labels[status] || status}</span>;
  };

  const statusIcons = [
    { icon: Wallet, label: 'ที่ต้องชำระ', count: orders.filter(o => o.status === 'pending_payment').length },
    { icon: Package, label: 'ที่ต้องจัดส่ง', count: orders.filter(o => o.status === 'processing').length },
    { icon: Truck, label: 'ที่ต้องได้รับ', count: orders.filter(o => o.status === 'shipping').length },
    { icon: Star, label: 'ให้คะแนน', count: orders.filter(o => o.status === 'delivered').length }
  ];

  return (
    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl animate-in fade-in">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-['Orbitron'] tracking-wide">
        <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> ORDER HISTORY
      </h3>
      
      <div className="grid grid-cols-4 gap-4 mb-8 pb-6 border-b border-[#990000]/20">
        {statusIcons.map((status, idx) => (
          <div key={idx} onClick={() => onOpenStatus(status.label)} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="relative p-3 rounded-xl bg-[#0a0a0a] border border-[#990000]/20 group-hover:border-[#FF0000] group-hover:bg-[#2E0505] transition-all">
              {status.count > 0 && <span className="absolute -top-2 -right-2 bg-[#FF0000] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-[0_0_5px_#FF0000] z-10">{status.count}</span>}
              <status.icon className="w-6 h-6 text-[#F2F4F6]/60 group-hover:text-[#FF0000] transition-colors" />
            </div>
            <span className="text-xs text-[#F2F4F6]/60 group-hover:text-[#F2F4F6] font-['Kanit'] transition-colors">{status.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-[#000000] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000] transition-all group">
            <div className="flex justify-between items-center mb-4">
              <div><p className="font-['Orbitron'] font-bold text-[#F2F4F6]">#{order.id}</p><p className="text-xs text-[#F2F4F6]/40">{order.date}</p></div>
              {getStatusBadge(order.status)}
            </div>
            <div className="flex items-center justify-between border-t border-[#990000]/20 pt-4 mt-2">
              <p className="text-[#F2F4F6]/60 text-sm font-['Kanit']">{order.itemsDetail.length} รายการ</p>
              <p className="text-xl font-['Orbitron'] font-bold text-[#FF0000]">฿{order.total}</p>
            </div>
            <button onClick={() => onOpenDetail(order)} className="w-full mt-4 bg-[#2E0505] hover:bg-[#FF0000] text-[#FF0000] hover:text-white py-2 rounded-lg transition-all text-sm font-bold border border-[#990000]/30">
              ดูรายละเอียด
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
