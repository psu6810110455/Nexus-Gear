import { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { getOrders, updateOrderStatus, type Order } from '../services/api';
import OrderDetailModal from '../components/OrderDetailModal';

const OrderManagement = () => {
  // State Management
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Initial Fetch
  useEffect(() => {
    setTimeout(() => {
      fetchOrders();
    }, 500);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true); // เริ่มโหลด
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error); // เหลือไว้แค่ Error Log พอ
    } finally {
      setLoading(false); // โหลดเสร็จแล้ว
    }
  };

  // Handlers
  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      
      // Update local state to reflect changes immediately
      setOrders(prevOrders => 
        prevOrders.map(o => o.id === id ? { ...o, status: newStatus as any } : o)
      );

      // Update modal state if open
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Update status failed:', error);
      alert('ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Constants & Helpers
  const tabs = [
    { label: 'ทั้งหมด', value: 'All' },
    { label: 'รอชำระเงิน', value: 'pending' },
    { label: 'ชำระเงินแล้ว', value: 'paid' },
    { label: 'เตรียมจัดส่ง', value: 'to_ship' },
    { label: 'จัดส่งแล้ว', value: 'shipped' },
    { label: 'สำเร็จ', value: 'completed' },
    { label: 'ยกเลิก', value: 'cancelled' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      paid: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      to_ship: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const searchLower = searchTerm.toLowerCase();
    const orderIdString = String(order.id);
    const username = order.user?.username?.toLowerCase() || '';
    
    return matchesStatus && (orderIdString.includes(searchLower) || username.includes(searchLower));
  });

  // Skeleton UI Component
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse border-b border-zinc-800/50">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                <div className="h-3 w-24 bg-zinc-800/50 rounded"></div>
              </div>
            </div>
          </td>
          <td className="p-4"><div className="h-6 w-20 bg-zinc-800 rounded"></div></td>
          <td className="p-4"><div className="h-6 w-24 bg-zinc-800 rounded-full"></div></td>
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-zinc-800 rounded"></div>
              <div className="h-3 w-20 bg-zinc-800/50 rounded"></div>
            </div>
          </td>
          <td className="p-4 text-right"><div className="h-8 w-8 bg-zinc-800 rounded ml-auto"></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6 relative animate-fade-in"> 
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">ORDER MANAGEMENT</h1>
          <p className="text-zinc-400 text-sm mt-1">จัดการและตรวจสอบสถานะคำสั่งซื้อทั้งหมด</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหา Order ID หรือ ชื่อลูกค้า..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:border-red-500 transition-all placeholder:text-zinc-600 shadow-sm focus:shadow-red-900/20"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-hide">
        {tabs.map((tab) => (
          <button 
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
              selectedStatus === tab.value 
                ? 'text-red-500 border-b-2 border-red-500 bg-gradient-to-t from-red-500/10 to-transparent' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${selectedStatus === tab.value ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-500'}`}>
              {tab.value === 'All' ? orders.length : orders.filter(o => o.status === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                <th className="p-4 font-medium">Order Details</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Shipping</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <TableSkeleton />
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-2">
                      <Search size={32} className="opacity-40" />
                    </div>
                    <span className="text-lg font-medium text-zinc-400">ไม่พบรายการคำสั่งซื้อ</span>
                    <span className="text-sm opacity-60">ลองเปลี่ยนคำค้นหาหรือสถานะตัวกรอง</span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-300 font-bold shadow-inner border border-white/5">
                          {order.user?.username ? order.user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            ORD-{new Date().getFullYear() + 543}-{String(order.id).padStart(3, '0')}
                          </div>
                          <div className="text-zinc-500 text-xs mt-0.5">{order.user?.username || 'Guest'}</div>
                          <div className="text-zinc-600 text-[10px] mt-0.5">{new Date(order.created_at).toLocaleString('th-TH')}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-white font-bold text-lg tracking-tight">฿{Number(order.total_price).toLocaleString()}</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} uppercase tracking-wider shadow-sm`}>
                        {order.status === 'pending' ? 'รอชำระเงิน' :
                          order.status === 'paid' ? 'ชำระเงินแล้ว' :
                          order.status === 'to_ship' ? 'เตรียมจัดส่ง' :
                          order.status === 'shipped' ? 'จัดส่งแล้ว' :
                          order.status === 'completed' ? 'สำเร็จ' :
                          order.status === 'cancelled' ? 'ยกเลิก' : order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-zinc-300 text-sm font-medium">Kerry Express</div>
                      <div className="text-zinc-500 text-xs">Standard Delivery</div>
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(order)}
                        className="p-2 bg-zinc-800/80 hover:bg-red-600 text-zinc-400 hover:text-white rounded-lg transition-all shadow-lg hover:shadow-red-900/50 border border-transparent hover:border-red-400/30 group-hover:bg-zinc-800"
                        title="ดูรายละเอียด"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderManagement;