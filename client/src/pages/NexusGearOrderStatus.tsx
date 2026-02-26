import { useEffect, useState } from 'react';
import { Wallet, Package, Truck, Star } from 'lucide-react';
import { getUserOrders } from '../services/api'; // ดึงฟังก์ชันมาจากไฟล์ที่เรารวมไว้

const NexusGearOrderStatus = () => {
  const [orders, setOrders] = useState<any[]>([]); // ตอนนี้ใช้ any ไปก่อน เดี๋ยว Commit หน้าเรามาจัด Type
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // จำลองว่า User ID 1 ล็อกอินอยู่ (รอเพื่อนคนที่ 1 ทำระบบ Login เสร็จค่อยมาเปลี่ยนเป็น Context/State)
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

  // ข้อมูลสำหรับสร้าง Tabs เมนูด้านบน
  const tabs = [
    { id: 'all', label: 'ทั้งหมด', icon: null },
    { id: 'pending', label: 'ที่ต้องชำระ', icon: Wallet, badge: orders.filter(o => o.status === 'pending').length },
    { id: 'to_ship', label: 'ที่ต้องจัดส่ง', icon: Package, badge: orders.filter(o => o.status === 'paid').length },
    { id: 'shipped', label: 'ที่ต้องรับ', icon: Truck, badge: orders.filter(o => o.status === 'shipped').length },
    { id: 'completed', label: 'ให้คะแนน', icon: Star, badge: 0 },
  ];

  return (
    // ใส่ w-full เพื่อให้เพื่อนเอาไปเสียบในหน้า Profile ของเขาได้พอดีเป๊ะ
    <section className="w-full min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 font-sans animate-fade-in">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 border-l-4 border-red-600 pl-4">
          <h1 className="text-2xl font-bold tracking-wide">ประวัติการสั่งซื้อ</h1>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-[#121212] rounded-xl border border-zinc-800/50 p-4 mb-8">
          <ul className="flex justify-between items-center text-sm md:text-base overflow-x-auto scrollbar-hide gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <li key={tab.id} className="flex-1 min-w-[100px]">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center gap-2 py-2 transition-all duration-300 relative ${
                      isActive ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {Icon && (
                      <div className="relative">
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                        {/* ตัวเลขแจ้งเตือน (Badge) สีแดง */}
                        {tab.badge > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                    )}
                    <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {tab.label}
                    </span>
                    
                    {/* เส้นขีดด้านล่างตอน Active */}
                    {isActive && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-600 rounded-t-full shadow-[0_-2px_10px_rgba(220,38,38,0.5)]"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* พื้นที่สำหรับแสดง Card ออเดอร์ (เดี๋ยวเรามาทำใน Commit ถัดไป) */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-zinc-500 py-10">กำลังโหลดข้อมูล...</p>
          ) : (
            <p className="text-center text-zinc-500 py-10">
              พบข้อมูลคำสั่งซื้อจำนวน {orders.length} รายการ (เดี๋ยวเรามาทำ Card โชว์กัน!)
            </p>
          )}
        </div>

      </div>
    </section>
  );
};

export default NexusGearOrderStatus;