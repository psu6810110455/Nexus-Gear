import { useEffect, useState } from 'react';
import { Wallet, Package, Truck, Star, CheckCircle, ChevronRight, ClipboardList } from 'lucide-react';
import { getUserOrders, submitOrderRating } from '../services/api';
import CustomerOrderModal from '../components/CustomerOrderModal';

interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: string;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: number;
  total_price: string;
  status: 'pending' | 'paid' | 'to_ship' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
  shipping_address: string;
  items: OrderItem[];
  is_rated?: boolean;
}

const NexusGearOrderStatus = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUserId = 1;

  useEffect(() => {
    setTimeout(() => {
      fetchMyOrders();
    }, 800);
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders(currentUserId);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching my orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (orderId: number, ratings: Record<number, number>) => {
    try {
      await submitOrderRating(orderId, ratings);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_rated: true } : o));
      
      setSelectedOrder(null); 
      setActiveTab('all'); 
      
      setToastMessage('ขอบคุณสำหรับการรีวิว! คะแนนของคุณถูกบันทึกเรียบร้อยแล้ว ⭐️');
      setTimeout(() => setToastMessage(null), 4000);

    } catch (error) {
      console.error('Failed to submit rating:', error);
      setSelectedOrder(null);
      setToastMessage('เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองใหม่อีกครั้ง ❌');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'รอชำระเงิน', className: 'text-amber-400 border-amber-400/30 bg-amber-400/10' };
      case 'paid': return { text: 'เตรียมสินค้า', className: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10' };
      case 'to_ship': return { text: 'รอจัดส่ง', className: 'text-orange-400 border-orange-400/30 bg-orange-400/10' };
      case 'shipped': return { text: 'ระหว่างขนส่ง', className: 'text-purple-400 border-purple-500/50 bg-purple-500/10' };
      case 'completed': return { text: 'ได้รับสินค้าแล้ว', className: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' };
      case 'cancelled': return { text: 'ยกเลิก', className: 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10' };
      default: return { text: status, className: 'text-zinc-400 border-zinc-800 bg-zinc-900' };
    }
  };

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const tabs = [
    { id: 'all', label: 'ทั้งหมด', icon: ClipboardList, badge: 0 }, 
    { id: 'pending', label: 'ที่ต้องชำระ', icon: Wallet, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'paid', label: 'กำลังเตรียม', icon: Package, badge: orders.filter(o => o.status === 'paid' || o.status === 'to_ship').length },
    { id: 'shipped', label: 'ที่ต้องได้รับ', icon: Truck, badge: orders.filter(o => o.status === 'shipped').length },
    { id: 'completed', label: 'สำเร็จ', icon: Star, badge: orders.filter(o => o.status === 'completed').length },
  ];

  const OrderTableSkeleton = () => (
    <div className="bg-[#121212] rounded-2xl p-6 border border-zinc-800/80 animate-pulse flex flex-col md:grid md:grid-cols-12 gap-6 items-center">
      <div className="md:col-span-2 w-full space-y-2"><div className="h-5 w-24 bg-zinc-800 rounded-md"></div><div className="h-4 w-16 bg-zinc-800/50 rounded-md"></div></div>
      <div className="md:col-span-4 w-full flex gap-3"><div className="h-12 w-12 bg-zinc-800 rounded-xl"></div><div className="space-y-2 flex-1"><div className="h-5 w-3/4 bg-zinc-800 rounded-md"></div><div className="h-4 w-1/2 bg-zinc-800/50 rounded-md"></div></div></div>
      <div className="md:col-span-2 w-full flex md:justify-center"><div className="h-6 w-24 bg-zinc-800 rounded-md"></div></div>
      <div className="md:col-span-2 w-full flex md:justify-center"><div className="h-8 w-24 bg-zinc-800 rounded-full"></div></div>
      <div className="md:col-span-2 w-full flex md:justify-center"><div className="h-10 w-full md:w-28 bg-zinc-800 rounded-lg"></div></div>
    </div>
  );

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : activeTab === 'paid' 
      ? orders.filter(order => order.status === 'paid' || order.status === 'to_ship')
      : orders.filter(order => order.status === activeTab);

  return (
    <section className="w-full min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans relative animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="border-l-4 border-red-600 pl-4">
            <h1 className="text-2xl font-black tracking-wide">ประวัติการสั่งซื้อ</h1>
            <p className="text-zinc-500 text-sm mt-1">จัดการและติดตามสถานะคำสั่งซื้อของคุณ</p>
          </div>
          
          {toastMessage && (
            <div className={`px-5 py-3 rounded-xl flex items-center gap-3 animate-bounce-in border shadow-2xl ${
              toastMessage.includes('❌') 
                ? 'bg-[#121212] border-red-500/50 text-red-400 shadow-[0_5px_20px_-5px_rgba(220,38,38,0.3)]' 
                : 'bg-[#121212] border-green-500/50 text-green-400 shadow-[0_5px_20px_-5px_rgba(34,197,94,0.3)]'
            }`}>
              <CheckCircle size={22} className={toastMessage.includes('❌') ? 'text-red-500' : 'text-green-500'} />
              <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
            </div>
          )}
        </header>

        <nav className="bg-[#121212] rounded-2xl border border-zinc-800/80 p-2 mb-8 shadow-lg">
          <ul className="flex justify-between items-center text-sm md:text-base overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="flex-1 min-w-[100px] text-center">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center gap-2 py-4 transition-all duration-300 relative rounded-xl ${
                      isActive ? 'text-red-500 bg-red-500/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {Icon && (
                      <div className="relative">
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                        {tab.badge > 0 && (
                          <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center shadow-sm shadow-red-900 ring-2 ring-[#121212]">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                    )}
                    <span className={`whitespace-nowrap ${isActive ? 'font-black' : 'font-medium'}`}>
                      {tab.label}
                    </span>
                    {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-red-600 rounded-t-full shadow-[0_-2px_8px_rgba(220,38,38,0.6)]"></div>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {!loading && filteredOrders.length > 0 && (
          <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 mb-4 text-sm font-bold text-zinc-300 uppercase tracking-widest bg-[#121212] rounded-2xl border border-zinc-800/80 shadow-md">
            <div className="col-span-2 text-center">หมายเลขคำสั่งซื้อ</div>
            <div className="col-span-4 text-center">รายการสินค้า</div>
            <div className="col-span-2 text-center">ยอดรวมสุทธิ</div>
            <div className="col-span-2 text-center">สถานะ</div>
            <div className="col-span-2 text-center">การจัดการ</div>
          </div>
        )}

        <div className="flex flex-col gap-4">
            {loading ? (
                [1, 2, 3, 4].map((n) => <OrderTableSkeleton key={n} />)
            ) : filteredOrders.length === 0 ? (
                <div className="w-full py-24 text-center bg-[#121212] rounded-3xl border border-zinc-800/80 flex flex-col items-center shadow-lg">
                  <div className="bg-[#050505] p-5 rounded-full mb-4 border border-zinc-800">
                    <Package size={40} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 text-lg font-bold">ยังไม่มีคำสั่งซื้อในสถานะนี้</p>
                </div>
            ) : (
                filteredOrders.map((order) => {
                  const statusDisplay = getStatusDisplay(order.status);
                  const firstItem = order.items[0];

                  return (
                    <div 
                      key={order.id} 
                      className="group bg-[#121212] border border-zinc-800/80 rounded-2xl hover:bg-[#161616] hover:border-zinc-700 transition-all duration-300 shadow-md hover:shadow-xl p-5 md:px-8 md:py-6 flex flex-col md:grid md:grid-cols-12 gap-5 md:gap-6 md:items-center"
                    >
                      {/* คอลัมน์ 1: Order ID */}
                      <div className="md:col-span-2 flex flex-col md:items-center border-b border-zinc-800/80 md:border-b-0 md:border-r pb-4 md:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-red-500 font-black text-[10px] uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">ID</span>
                          <h3 className="text-white font-black text-lg tracking-wider">
                            #{String(order.id).padStart(3, '0')}
                          </h3>
                        </div>
                        <p className="text-zinc-500 text-xs font-bold">{formatThaiDate(order.created_at)}</p>
                      </div>

                      {/* คอลัมน์ 2: ข้อมูลสินค้า */}
                      <div className="md:col-span-4 flex items-center md:justify-center gap-4 md:pl-2">
                        <div className="w-14 h-14 rounded-xl bg-[#050505] border border-zinc-800 flex items-center justify-center shrink-0">
                          {firstItem?.product.image_url ? (
                            <img src={firstItem.product.image_url} alt="product" className="w-full h-full object-cover rounded-xl opacity-80" />
                          ) : (
                            <Package size={24} className="text-zinc-600" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 md:items-start text-left">
                          <p className="text-zinc-200 text-sm font-bold truncate">
                            {firstItem?.product.name || 'สินค้าไม่ระบุชื่อ'}
                          </p>
                          <p className="text-zinc-500 text-xs mt-1">
                            {order.items.length > 1 
                              ? `และสินค้าอื่นอีก ${order.items.length - 1} รายการ` 
                              : `จำนวน: ${firstItem?.quantity} ชิ้น`}
                          </p>
                        </div>
                      </div>

                      {/* คอลัมน์ 3: ยอดรวมสุทธิ */}
                      <div className="md:col-span-2 flex justify-between md:justify-center items-center border-t border-zinc-800/80 md:border-0 pt-4 md:pt-0">
                        <span className="md:hidden text-zinc-500 text-xs font-bold uppercase tracking-widest">ยอดสุทธิ</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-red-600 font-black text-sm">฿</span>
                          <span className="text-xl font-black text-white tracking-tighter">
                            {Number(order.total_price).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* คอลัมน์ 4: สถานะ */}
                      <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden text-zinc-500 text-xs font-bold uppercase tracking-widest">สถานะ</span>
                        <span className={`px-3 py-1.5 text-xs font-black rounded-full border shadow-sm ${statusDisplay.className}`}>
                          {statusDisplay.text}
                        </span>
                      </div>

                      {/* คอลัมน์ 5: ปุ่ม Action */}
                      <div className="md:col-span-2 flex justify-end md:justify-center mt-2 md:mt-0">
                        <button 
                            onClick={() => setSelectedOrder(order)} 
                            className={`w-full md:w-[130px] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 ${
                                order.status === 'completed' && !order.is_rated
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] border-none'
                                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_4px_15px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_20px_rgba(220,38,38,0.4)] border-none'
                            }`}
                        >
                            {order.status === 'completed' && !order.is_rated ? (
                                <>
                                    <Star size={14} className="fill-white" />
                                    ให้คะแนน
                                </>
                            ) : (
                                <>
                                  รายละเอียด
                                  <ChevronRight size={14} className="text-white" />
                                </>
                            )}
                        </button>
                      </div>
                      
                    </div>
                  );
                })
            )}
        </div>
      </div>

      <CustomerOrderModal 
        isOpen={selectedOrder !== null} 
        onClose={() => setSelectedOrder(null)} 
        order={selectedOrder} 
        onSubmitRating={handleRatingSubmit}
      />
    </section>
  );
};

export default NexusGearOrderStatus;