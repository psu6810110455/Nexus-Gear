import React from 'react';
import { X, Truck, Package, MapPin } from 'lucide-react';
import type { Order } from '../../types/profile.types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { delivered: 'bg-green-900/20 text-green-400 border-green-900', shipping: 'bg-blue-900/20 text-blue-400 border-blue-900', processing: 'bg-yellow-900/20 text-yellow-400 border-yellow-900' };
    const labels: Record<string, string> = { delivered: 'สำเร็จ', shipping: 'ที่ต้องได้รับ', processing: 'ที่ต้องจัดส่ง' };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-['Orbitron'] tracking-wider border ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(153,0,0,0.5)]">
        <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
          <div><h4 className="text-xl font-black text-[#F2F4F6] font-['Orbitron']">ORDER DETAILS</h4><p className="text-xs text-[#FF0000] font-['Orbitron'] mt-1">#{order.id}</p></div>
          <button onClick={onClose} className="p-2 hover:bg-[#990000] rounded-full transition-colors text-[#F2F4F6]/50 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#000000]/60 p-4 rounded-xl border border-[#990000]/10"><p className="text-[10px] text-[#F2F4F6]/30 font-['Orbitron'] uppercase mb-1">Status</p>{getStatusBadge(order.status)}</div>
            <div className="bg-[#000000]/60 p-4 rounded-xl border border-[#990000]/10"><p className="text-[10px] text-[#F2F4F6]/30 font-['Orbitron'] uppercase mb-1">Tracking</p><p className="text-[#F2F4F6] font-['Orbitron'] flex items-center gap-2"><Truck className="w-4 h-4 text-[#FF0000]" /> {order.tracking}</p></div>
          </div>
          <div>
            <p className="text-xs text-[#990000] font-['Orbitron'] uppercase mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> ITEMS</p>
            {order.itemsDetail?.map((i,x)=> (
              <div key={x} className="flex gap-4 items-center bg-[#1a1a1a]/50 p-3 rounded-xl border border-[#990000]/10 mb-2">
                <div className="w-12 h-12 bg-black rounded border border-[#990000]/20 flex items-center justify-center overflow-hidden"><img src={i.image} alt={i.name} className="w-full h-full object-contain p-1" /></div>
                <div className="flex-1"><p className="text-sm font-bold text-[#F2F4F6]">{i.name}</p><p className="text-xs text-[#F2F4F6]/40 font-['Orbitron']">x{i.qty}</p></div>
                <p className="font-bold text-[#FF0000] font-['Orbitron']">฿{i.price}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#2E0505]/10 p-4 rounded-xl border border-[#990000]/10"><p className="text-xs text-[#990000] font-['Orbitron'] uppercase mb-2 flex items-center gap-2"><MapPin className="w-3 h-3" /> Shipping Address</p><p className="text-sm text-[#F2F4F6]/70">{order.address}</p></div>
        </div>
        <div className="p-5 bg-[#2E0505]/20 border-t border-[#990000]/20"><button onClick={onClose} className="w-full bg-[#FF0000] text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest hover:bg-[#990000] transition-all">CLOSE DETAILS</button></div>
      </div>
    </div>
  );
};
