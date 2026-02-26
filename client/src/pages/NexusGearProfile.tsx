import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, LogOut, Package, Truck, Plus, CheckCircle, Lock, Key, Check, Wallet, Star, Trash2 } from 'lucide-react';

// ─── Types ───
interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Address {
  id: number;
  label: string;
  address: string;
  isDefault: boolean;
}

interface AddressForm {
  label: string;
  address: string;
  isDefault: boolean;
}

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: string;
  status: 'delivered' | 'shipping' | 'processing' | 'pending_payment';
  items: number;
  tracking: string;
  address: string;
  itemsDetail: OrderItem[];
}

interface SuccessMessage {
  title: string;
  detail: string;
}

interface StatusModal {
  title: string;
  items: Order[];
}

export default function NexusGearProfile() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('orders');

  // ─── State สำหรับ Modal ต่างๆ ───
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showDeleteAddrModal, setShowDeleteAddrModal] = useState<boolean>(false);
  const [addrToDelete, setAddrToDelete] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage>({ title: '', detail: '' });
  const [statusModal, setStatusModal] = useState<StatusModal | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const [userData, setUserData] = useState<UserData>({
    name: 'แม็กซ์ เกมเมอร์',
    email: 'max.gamer@email.com',
    phone: '081-234-5678',
    address: '123 ถนนเกมมิ่ง แขวงไฮเทค เขตดิจิตอล กรุงเทพฯ 10110'
  });

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, label: 'บ้าน', address: '123 ถนนเกมมิ่ง แขวงไฮเทค เขตดิจิตอล กรุงเทพฯ 10110', isDefault: true },
    { id: 2, label: 'ที่ทำงาน', address: '456 อาคารออฟฟิศ ถนนสีลม บางรัก กรุงเทพฯ 10500', isDefault: false }
  ]);

  const [addressForm, setAddressForm] = useState<AddressForm>({ label: '', address: '', isDefault: false });

  const orders: Order[] = [
    {
      id: 'ORD001', date: '15 ม.ค. 2569', total: '3,490', status: 'delivered', items: 3, tracking: 'TH-EXPRESS-8812',
      address: '123 ถนนเกมมิ่ง แขวงไฮเทค...',
      itemsDetail: [{ name: 'Razer Kishi V2', qty: 1, price: '3,490', image: '/controller.png' }]
    },
    {
      id: 'ORD002', date: '10 ม.ค. 2569', total: '1,890', status: 'shipping', items: 1, tracking: 'KERRY-998877',
      address: '456 อาคารออฟฟิศ ถนนสีลม...',
      itemsDetail: [{ name: 'HyperX Cloud Alpha', qty: 1, price: '1,890', image: '/headset.png' }]
    },
    {
      id: 'ORD003', date: '05 ม.ค. 2569', total: '5,990', status: 'processing', items: 2, tracking: 'กำลังจัดเตรียม',
      address: '123 ถนนเกมมิ่ง แขวงไฮเทค...',
      itemsDetail: [
        { name: 'ROG Phone Case', qty: 1, price: '1,990', image: '/rog-phone.png' },
        { name: 'Cooling Fan', qty: 1, price: '4,000', image: '/fan.png' }
      ]
    }
  ];

  // ─── Shared Logic ───
  const triggerSuccess = (title: string, detail: string): void => {
    setSuccessMessage({ title, detail });
    setShowSuccessModal(true);
  };

  const getStatusBadge = (status: Order['status']): React.ReactElement => {
    const styles: Record<string, string> = {
      delivered: 'bg-green-900/20 text-green-400 border-green-900',
      shipping: 'bg-blue-900/20 text-blue-400 border-blue-900',
      processing: 'bg-yellow-900/20 text-yellow-400 border-yellow-900'
    };
    const labels: Record<string, string> = {
      delivered: 'สำเร็จ',
      shipping: 'ที่ต้องได้รับ',
      processing: 'ที่ต้องจัดส่ง'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-['Orbitron'] tracking-wider border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white pb-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');`}</style>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 object-contain relative z-10" />
              </div>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest">NEXUS GEAR</h1>
            </div>
            <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2 text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider">
              <LogOut className="w-4 h-4" /> <span className="hidden md:inline">LOGOUT</span>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-28">
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#2E0505] to-[#000000] border-2 border-[#990000] rounded-full flex items-center justify-center text-4xl mb-4 relative z-10">👤</div>
                  <h2 className="text-xl font-bold text-[#F2F4F6]">{userData.name}</h2>
                  <p className="text-sm text-[#F2F4F6]/50 font-['Orbitron']">{userData.email}</p>
                </div>
                <nav className="space-y-2">
                  {[
                    { id: 'info', icon: User, label: 'ข้อมูลส่วนตัว' },
                    { id: 'addresses', icon: MapPin, label: 'ที่อยู่จัดส่ง' },
                    { id: 'orders', icon: Package, label: 'ประวัติการสั่งซื้อ' }
                  ].map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-[#990000] to-[#2E0505] text-white border border-[#FF0000]/30' : 'text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000]'}`}>
                      <item.icon className="w-5 h-5" /> <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* TODO: Tab Info — Commit 2 */}
              {/* TODO: Tab Addresses — Commit 3 */}
              {/* TODO: Tab Orders — Commit 4 */}
            </div>

          </div>
        </div>
      </div>

      {/* TODO: Modals — Commit 2, 3, 4, 5 */}
    </div>
  );
}