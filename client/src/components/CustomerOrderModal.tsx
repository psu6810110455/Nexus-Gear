import { X, MapPin, Package, Truck, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: { name: string; image_url: string };
  rating?: number; // รองรับคะแนนเดิมถ้าเคยให้แล้ว
}

interface Order {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
  shipping_address: string;
  items: OrderItem[];
  is_rated?: boolean; // เช็คว่าออเดอร์นี้ให้คะแนนไปหรือยัง
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmitRating: (orderId: number, ratings: Record<number, number>) => void;
}

const CustomerOrderModal = ({ isOpen, onClose, order, onSubmitRating }: ModalProps) => {
  // เก็บค่าดาวที่ลูกค้ากด (แยกตาม id ของสินค้า)
  const [ratings, setRatings] = useState<Record<number, number>>({});

  // ล้างค่าดาวทุกครั้งที่เปิด Modal ใหม่
  useEffect(() => {
    if (order) setRatings({});
  }, [order]);

  if (!isOpen || !order) return null;

  const getTrackingInfo = (status: string) => {
    if (status === 'shipped' || status === 'completed') {
      return { text: 'KERRY-998877', icon: Truck, className: 'text-zinc-300' };
    }
    return { text: 'กำลังจัดเตรียม', icon: Truck, className: 'text-zinc-500' };
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'ที่ต้องชำระ', className: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' };
      case 'paid': return { text: 'กำลังจัดเตรียม', className: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
      case 'to_ship': return { text: 'ที่ต้องจัดส่ง', className: 'text-orange-500 border-orange-500/30 bg-orange-500/10' };
      case 'shipped': return { text: 'กำลังจัดส่ง', className: 'text-purple-400 border-purple-500/30 bg-purple-500/10' };
      case 'completed': return { text: 'สำเร็จ', className: 'text-green-500 border-green-500/30 bg-green-500/10' };
      case 'cancelled': return { text: 'ยกเลิกแล้ว', className: 'text-red-500 border-red-500/30 bg-red-500/10' };
      default: return { text: status, className: 'text-zinc-400 border-zinc-800 bg-zinc-900' };
    }
  };

  const tracking = getTrackingInfo(order.status);
  const statusDisplay = getStatusDisplay(order.status);
  const isCompletedAndNotRated = order.status === 'completed' && !order.is_rated;

  // ฟังก์ชันเวลากดดาว
  const handleStarClick = (itemId: number, star: number) => {
    if (order.is_rated) return; // ถ้าเคยให้แล้ว กดไม่ได้
    setRatings(prev => ({ ...prev, [itemId]: star }));
  };

  const handleSubmit = () => {
    if (isCompletedAndNotRated) {
      onSubmitRating(order.id, ratings);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <article className="bg-[#0a0a0a] border border-red-900/50 rounded-2xl w-full max-w-2xl shadow-[0_0_30px_-5px_rgba(220,38,38,0.2)] overflow-hidden relative flex flex-col max-h-[90vh]">
        
        <header className="p-6 border-b border-zinc-900/50 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">รายละเอียดคำสั่งซื้อ</h2>
            <p className="text-red-600 font-bold mt-1 text-sm">#ORD{String(order.id).padStart(3, '0')}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 p-2 rounded-full hover:bg-red-900/30">
            <X size={20} />
          </button>
        </header>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-hide">
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4">
              <p className="text-zinc-600 text-xs mb-2">สถานะ:</p>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border inline-block ${statusDisplay.className}`}>
                {statusDisplay.text}
              </span>
            </div>
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-center">
              <p className="text-zinc-600 text-xs mb-2">การติดตามสินค้า:</p>
              <div className={`flex items-center gap-2 font-medium ${tracking.className}`}>
                <tracking.icon size={16} />
                <span className="text-sm">{tracking.text}</span>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-red-500">
              <Package size={18} />
              <h3 className="font-bold text-sm">รายการสินค้า</h3>
            </div>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-[#121212] border border-zinc-800/80 p-4 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 shrink-0">
                      {item.product?.image_url ? (
                         <img src={item.product.image_url} alt={item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                         <Package size={20} className="text-zinc-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm line-clamp-2">{item.product?.name || 'สินค้า'}</p>
                      <p className="text-zinc-500 text-xs mt-1">x{item.quantity}</p>
                      
                      {/* ⭐️ โชว์ดาวเฉพาะออเดอร์ที่สถานะ "สำเร็จ" */}
                      {order.status === 'completed' && (
                        <div className="flex gap-1 mt-3">
                          {[1, 2, 3, 4, 5].map(star => {
                            const currentRating = order.is_rated ? (item.rating || 5) : (ratings[item.id] || 0);
                            return (
                              <Star 
                                key={star} 
                                size={18} 
                                className={`transition-transform ${!order.is_rated ? 'cursor-pointer hover:scale-110' : ''} ${
                                  star <= currentRating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'
                                }`}
                                onClick={() => handleStarClick(item.id, star)}
                              />
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-red-500 font-bold text-lg whitespace-nowrap ml-4">
                    ฿{Number(item.price_at_purchase).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#121212] border border-zinc-800/80 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-red-500">
              <MapPin size={18} />
              <h3 className="font-bold text-sm">ที่อยู่สำหรับจัดส่ง</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed pl-6">
              {order.shipping_address || '123 ถนนเกมมิ่ง แขวงไฮเทค...'}
            </p>
          </section>
        </div>

        <footer className="p-6 border-t border-zinc-900/50 shrink-0">
          <button 
            onClick={handleSubmit}
            className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg ${
              isCompletedAndNotRated
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
            }`}
          >
            {isCompletedAndNotRated ? 'ยืนยันการให้คะแนน' : 'ปิดรายละเอียด'}
          </button>
        </footer>

      </article>
    </div>
  );
};

export default CustomerOrderModal;