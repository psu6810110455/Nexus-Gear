import React from 'react';
import { X, Star } from 'lucide-react';
import type { Order } from '../../types/profile.types';

interface StatusModalProps {
  statusData: { title: string; items: Order[] } | null;
  onClose: () => void;
  ratings: Record<string, number>;
  onRate: (orderId: string, score: number) => void;
  onOpenDetail: (order: Order) => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ statusData, onClose, ratings, onRate, onOpenDetail }) => {
  if (!statusData) return null;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { delivered: 'bg-green-900/20 text-green-400 border-green-900', shipping: 'bg-blue-900/20 text-blue-400 border-blue-900', processing: 'bg-yellow-900/20 text-yellow-400 border-yellow-900' };
    const labels: Record<string, string> = { delivered: 'สำเร็จ', shipping: 'ที่ต้องได้รับ', processing: 'ที่ต้องจัดส่ง' };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-['Orbitron'] tracking-wider border ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(153,0,0,0.5)]">
        <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
          <div>
            <h4 className="text-xl font-black text-[#F2F4F6] font-['Orbitron'] uppercase">{statusData.title}</h4>
            <p className="text-xs text-[#FF0000] font-['Kanit'] mt-1">รายการสินค้าที่อยู่ในสถานะ "{statusData.title}"</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#990000] rounded-full transition-colors text-[#F2F4F6]/50 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-4">
           {statusData.items.length > 0 ? (
             statusData.items.map((order) => (
                <div key={order.id} className="bg-[#000000] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000] transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <div><p className="font-['Orbitron'] font-bold text-[#F2F4F6]">#{order.id}</p><p className="text-xs text-[#F2F4F6]/40">{order.date}</p></div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#990000]/20 pt-4 mt-2">
                      <p className="text-[#F2F4F6]/60 text-sm font-['Kanit']">{order.itemsDetail.length} รายการ</p>
                      <p className="text-xl font-['Orbitron'] font-bold text-[#FF0000]">฿{order.total}</p>
                    </div>
                    
                    {/* ⭐ ส่วนให้คะแนนดาว */}
                    {statusData.title === 'ให้คะแนน' && (
                        <div className="flex items-center gap-1 mt-3 justify-end">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star} 
                                    onClick={() => onRate(order.id, star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        className={`w-5 h-5 transition-colors ${
                                            (ratings[order.id] || 0) >= star 
                                            ? 'text-yellow-500 fill-yellow-500' 
                                            : 'text-[#F2F4F6]/20'
                                        }`} 
                                    />
                                </button>
                            ))}
                            <span className="text-xs text-[#F2F4F6]/50 ml-2 font-['Kanit']">
                                {ratings[order.id] ? `คุณให้ ${ratings[order.id]} ดาว` : 'กดเพื่อรีวิวสินค้า'}
                            </span>
                        </div>
                    )}

                    <button onClick={() => onOpenDetail(order)} className="w-full mt-4 bg-[#2E0505] hover:bg-[#FF0000] text-[#FF0000] hover:text-white py-2 rounded-lg transition-all text-sm font-bold border border-[#990000]/30">ดูรายละเอียด</button>
                </div>
             ))
           ) : (
             <div className="text-center py-10 text-[#F2F4F6]/40 font-['Kanit']">
                <p>ไม่มีรายการคำสั่งซื้อในสถานะนี้</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}; //แสดงรายการสินค้าตามสถานะ และระบบให้คะแนนดาว