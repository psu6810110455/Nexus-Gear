import { useEffect, useState } from 'react';
import { Search, Eye, CheckCircle, PackageOpen } from 'lucide-react';
import { getOrders, updateOrderStatus, type Order } from '../services/api';
import OrderDetailModal from '../components/OrderDetailModal';

const OrderManagement = () => {
  // State Management
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Fetch
  useEffect(() => {
    setTimeout(() => {
      fetchOrders();
    }, 500);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true); 
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error); 
    } finally {
      setLoading(false); 
    }
  };

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: 'pending' | 'paid' | 'to_ship' | 'shipped' | 'completed' | 'cancelled' | string
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      );

      setSelectedOrder(null);

      const getThaiStatus = (status: string) => {
        const thStatus: Record<string, string> = {
          pending: 'รอชำระเงิน', paid: 'ชำระเงินแล้ว', to_ship: 'เตรียมจัดส่ง',
          shipped: 'จัดส่งแล้ว', completed: 'สำเร็จ', cancelled: 'ยกเลิก'
        };
        return thStatus[status] || status;
      };

      const thaiStatus = getThaiStatus(newStatus);
      setToastMessage(`อัปเดตสถานะเป็น "${thaiStatus}" สำเร็จเรียบร้อย! ✅`);
      
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Error updating order status:', error);
      setToastMessage('เกิดข้อผิดพลาดในการอัปเดตสถานะ ❌');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Handlers
  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
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
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const searchLower = searchTerm.toLowerCase();
    const orderIdStr = `ORD-${String(order.id).padStart(3, '0')}`.toLowerCase();
    const customerName = (order.user?.username || 'ไม่ระบุชื่อ').toLowerCase();
    const matchesSearch = orderIdStr.includes(searchLower) || customerName.includes(searchLower);

    return matchesTab && matchesSearch;
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
      
      {/* 1. Header Section (แก้โครงสร้าง <div> ตรงนี้ให้สมบูรณ์) */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        
        {/* ข้อความและ Popup แจ้งเตือน */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">ORDER MANAGEMENT</h1>
            <p className="text-zinc-400 text-sm mt-1">จัดการและตรวจสอบสถานะคำสั่งซื้อทั้งหมด</p>
          </div>
          
          {toastMessage && (
            <div className="bg-[#121212] border border-green-500/50 text-green-400 px-4 py-2.5 rounded-xl shadow-[0_5px_20px_-5px_rgba(34,197,94,0.3)] flex items-center gap-2 animate-fade-in shrink-0">
              <CheckCircle size={20} className="text-green-500" />
              <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
            </div>
          )}
        </div>

        {/* ช่องค้นหา */}
        <div className="relative w-full md:w-96 group shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500 group-focus-within:text-red-500 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="ค้นหารหัสคำสั่งซื้อ หรือ ชื่อลูกค้า..."
            className="w-full bg-[#121212] border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 
                      focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 
                      transition-all duration-300 placeholder-zinc-600 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Tabs Section */}
      <div className="flex items-center gap-2 border-b border-zinc-800/50 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const count = tab.value === 'All' 
            ? orders.length 
            : orders.filter(o => o.status === tab.value).length;

          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`relative px-4 py-3 text-sm font-bold transition-all duration-300 flex items-center gap-2 group whitespace-nowrap ${
                isActive ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700 group-hover:text-zinc-300'
              }`}>
                {count}
              </span>

              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] rounded-t-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Table Section */}
      <div className="bg-[#0c0c0c] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-zinc-900/50 to-transparent text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800/80">
                <th className="p-5 font-medium">Order Details</th>
                <th className="p-5 font-medium">Total Amount</th>
                <th className="p-5 font-medium">Status</th>
                <th className="p-5 font-medium">Shipping</th>
                <th className="p-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <TableSkeleton />
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3 animate-fade-in">
                      <div className="w-20 h-20 bg-zinc-800/30 rounded-full flex items-center justify-center mb-2 border border-zinc-800/50">
                        <PackageOpen size={36} className="text-zinc-600" />
                      </div>
                      <span className="text-lg font-bold text-zinc-400">ไม่พบรายการคำสั่งซื้อ</span>
                      <span className="text-sm opacity-60">ลองเปลี่ยนคำค้นหาหรือสถานะตัวกรองใหม่อีกครั้ง</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#141414] transition-all duration-300 group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 font-bold shadow-inner border border-zinc-700/50 group-hover:border-red-500/50 group-hover:text-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300">
                          {order.user?.username ? order.user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="text-white font-bold flex items-center gap-2 group-hover:text-red-50 transition-colors duration-300">
                            ORD-{new Date().getFullYear() + 543}-{String(order.id).padStart(3, '0')}
                          </div>
                          <div className="text-zinc-500 text-xs mt-1 font-medium">{order.user?.username || 'Guest'}</div>
                          <div className="text-zinc-600 text-[10px] mt-0.5">{new Date(order.created_at).toLocaleString('th-TH')}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className="text-white font-bold text-lg tracking-tight group-hover:text-red-100 transition-colors">
                        ฿{Number(order.total_price).toLocaleString()}
                      </span>
                    </td>

                    <td className="p-5">
                      <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border ${getStatusColor(order.status)} uppercase tracking-wider shadow-sm transition-all`}>
                        {order.status === 'pending' ? 'รอชำระเงิน' :
                          order.status === 'paid' ? 'ชำระเงินแล้ว' :
                          order.status === 'to_ship' ? 'เตรียมจัดส่ง' :
                          order.status === 'shipped' ? 'จัดส่งแล้ว' :
                          order.status === 'completed' ? 'สำเร็จ' :
                          order.status === 'cancelled' ? 'ยกเลิก' : order.status}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">Kerry Express</div>
                      <div className="text-zinc-500 text-xs mt-0.5">Standard Delivery</div>
                    </td>

                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleOpenModal(order)}
                        className="p-2.5 bg-zinc-800/40 border border-zinc-700/50 text-zinc-400 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
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

      {/* 4. Modal สำหรับดูรายละเอียด */}
      <OrderDetailModal 
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

    </div>
  );
};

export default OrderManagement;