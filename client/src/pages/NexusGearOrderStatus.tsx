import { useEffect, useState } from 'react';
import { Wallet, Package, Truck, Star } from 'lucide-react';
import { getUserOrders } from '../services/api';
import CustomerOrderModal from '../components/CustomerOrderModal';

// 1. กำหนด Type ให้ชัดเจน (ไม่ต้องใช้ any แล้ว)
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
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
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

  const currentUserId = 1;

  useEffect(() => {
    fetchMyOrders();
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

  const handleRatingSubmit = (orderId: number, ratings: Record<number, number>) => {
  // TODO: อนาคตเราจะเรียก axios ยิง API ไปบันทึกใน Database ตรงนี้
  console.log('บันทึกคะแนน:', { orderId, ratings });

  // จำลองการอัปเดตสถานะหน้าเว็บว่า "ให้คะแนนแล้ว"
  setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_rated: true } : o));
  setSelectedOrder(null);
  alert('ขอบคุณสำหรับการให้คะแนนสินค้า! ⭐️');
  };

  // 2. ฟังก์ชันช่วยตกแต่ง Status ให้สวยงาม
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'ที่ต้องชำระ', className: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' };
      case 'paid': return { text: 'กำลังจัดเตรียม', className: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
      case 'to_ship': return { text: 'ที่ต้องจัดส่ง', className: 'text-orange-500 border-orange-500/30 bg-orange-500/10' };
      case 'shipped': return { text: 'กำลังจัดส่ง', className: 'text-purple-400 border-purple-500/30 bg-purple-500/10' };
      case 'completed': return { text: 'สำเร็จ', className: 'text-green-500 border-green-500/30 bg-green-500/10' };
      case 'cancelled': return { text: 'ยกเลิกแล้ว', className: 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10' };
      default: return { text: status, className: 'text-zinc-400 border-zinc-800 bg-zinc-900' };
    }
  };

  // 3. ฟังก์ชันแปลงวันที่ให้เป็นแบบไทย (เช่น 15 ม.ค. 2569)
  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  // 4. Logic ตัวกรอง: ให้แท็บตรงกับ Status ใน Database
  const tabs = [
    { id: 'all', label: 'ทั้งหมด', icon: undefined, badge: 0 },
    { id: 'pending', label: 'ที่ต้องชำระ', icon: Wallet, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'paid', label: 'ที่ต้องจัดส่ง', icon: Package, badge: orders.filter(o => o.status === 'paid').length },
    { id: 'shipped', label: 'ที่ต้องได้รับ', icon: Truck, badge: orders.filter(o => o.status === 'shipped').length },
    { id: 'completed', label: 'ให้คะแนน', icon: Star, badge: 0 },
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <section className="w-full min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 border-l-4 border-red-600 pl-4">
          <h1 className="text-2xl font-bold tracking-wide">ประวัติการสั่งซื้อ</h1>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-[#121212] rounded-xl border border-zinc-800 p-2 mb-8 shadow-lg">
          <ul className="flex justify-between items-center text-sm md:text-base overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <li key={tab.id} className="flex-1 min-w-[100px] text-center">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center gap-2 py-3 transition-all duration-300 relative rounded-lg ${
                      isActive ? 'text-red-500 bg-red-500/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {Icon && (
                      <div className="relative">
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                        {tab.badge > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm shadow-red-900">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                    )}
                    <span className={`whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>
                      {tab.label}
                    </span>
                    
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-red-600 rounded-t-full shadow-[0_-2px_8px_rgba(220,38,38,0.6)]"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 5. Order Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-zinc-500 py-20 animate-pulse">กำลังโหลดข้อมูลการสั่งซื้อ...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center bg-[#121212] border border-zinc-800 rounded-xl py-20 text-zinc-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p>ยังไม่มีคำสั่งซื้อในสถานะนี้</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              // คำนวณจำนวนชิ้นรวมในออเดอร์นี้
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

              return (
                <div key={order.id} className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors shadow-lg">
                  <div className="p-5">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-white font-bold text-lg tracking-wider">
                          #ORD{String(order.id).padStart(3, '0')}
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1">{formatThaiDate(order.created_at)}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusDisplay.className}`}>
                        {statusDisplay.text}
                      </span>
                    </div>

                    {/* Card Body (Summary) */}
                    <div className="flex justify-between items-end mb-6">
                      <div className="text-zinc-400 text-sm">
                        {totalItems} รายการ
                      </div>
                      <div className="text-2xl font-bold text-red-500 tracking-tight">
                        ฿{Number(order.total_price).toLocaleString()}
                      </div>
                    </div>

                    {/* Card Action */}
                    <button 
                        onClick={() => setSelectedOrder(order)} 
                        className={`w-full py-3 border rounded-lg font-bold transition-all duration-300 ${
                            order.status === 'completed' && !order.is_rated
                            ? 'bg-[#1a150f] hover:bg-yellow-600 border-yellow-900/50 hover:border-yellow-500 text-yellow-500 hover:text-white'
                            : 'bg-[#1a0f0f] hover:bg-red-600 border-red-900/50 hover:border-red-500 text-red-500 hover:text-white'
                        }`}
                        >
                        {order.status === 'completed' && !order.is_rated ? 'ให้คะแนนสินค้า' : 'ดูรายละเอียด'}
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