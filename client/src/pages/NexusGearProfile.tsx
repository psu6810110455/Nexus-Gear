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

  // ─── Commit 2: Profile Info + Change Password ───
  const handleUpdatePassword = (): void => {
    setShowPasswordModal(false);
    triggerSuccess('SUCCESS!', 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
  };

  // ─── Commit 3: Address Management Logic ───
  const openAddAddress = (): void => {
    setEditingAddressId(null);
    setAddressForm({ label: '', address: '', isDefault: false });
    setShowAddressModal(true);
  };

  const openEditAddress = (addr: Address): void => {
    setEditingAddressId(addr.id);
    setAddressForm({ label: addr.label, address: addr.address, isDefault: addr.isDefault });
    setShowAddressModal(true);
  };

  const confirmDeleteAddress = (id: number): void => {
    setAddrToDelete(id);
    setShowDeleteAddrModal(true);
  };

  const deleteAddress = (): void => {
    setAddresses(addresses.filter((a) => a.id !== addrToDelete));
    setShowDeleteAddrModal(false);
    triggerSuccess('DELETED!', 'ลบที่อยู่เรียบร้อยแล้ว');
  };

  const saveAddress = (): void => {
    if (editingAddressId) {
      setAddresses(addresses.map((a) =>
        a.id === editingAddressId ? { ...a, ...addressForm } : (addressForm.isDefault ? { ...a, isDefault: false } : a)
      ));
    } else {
      const newAddr: Address = { id: Date.now(), ...addressForm };
      if (addressForm.isDefault) {
        setAddresses(addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
      } else {
        setAddresses([...addresses, newAddr]);
      }
    }
    setShowAddressModal(false);
    triggerSuccess('SAVED!', 'บันทึกที่อยู่เรียบร้อยแล้ว');
  };

  // ─── Commit 4: Orders Logic ───
  const openStatusModal = (label: string): void => {
    let filteredOrders: Order[] = [];
    if (label === 'ที่ต้องชำระ') filteredOrders = orders.filter((o) => o.status === 'pending_payment');
    else if (label === 'ที่ต้องจัดส่ง') filteredOrders = orders.filter((o) => o.status === 'processing');
    else if (label === 'ที่ต้องได้รับ') filteredOrders = orders.filter((o) => o.status === 'shipping');
    else if (label === 'ให้คะแนน') filteredOrders = orders.filter((o) => o.status === 'delivered');
    setStatusModal({ title: label, items: filteredOrders });
  };

  const handleRating = (orderId: string, score: number): void => {
    setRatings((prev) => ({ ...prev, [orderId]: score }));
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

              {/* ─── Tab Info ─── */}
              {activeTab === 'info' && (
                <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold flex items-center gap-3 font-['Orbitron']">
                      <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> PROFILE INFO
                    </h3>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="flex gap-2 bg-[#2E0505] border border-[#990000] text-[#FF0000] px-4 py-2 rounded-lg hover:bg-[#990000] hover:text-white transition">
                        <Edit2 className="w-4 h-4" /> แก้ไข
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="bg-[#FF0000] text-white px-4 py-2 rounded-lg hover:bg-[#990000] transition"><Save className="w-4 h-4" /> บันทึก</button>
                        <button onClick={() => setIsEditing(false)} className="bg-[#2E0505] border border-[#990000] text-[#F2F4F6] px-4 py-2 rounded-lg hover:bg-[#000000] transition"><X className="w-4 h-4" /> ยกเลิก</button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    {(
                      [
                        { l: 'ชื่อ-นามสกุล', v: userData.name, k: 'name' as keyof UserData, icon: User },
                        { l: 'อีเมล', v: userData.email, k: 'email' as keyof UserData, icon: Mail },
                        { l: 'เบอร์โทร', v: userData.phone, k: 'phone' as keyof UserData, icon: Phone }
                      ] as { l: string; v: string; k: keyof UserData; icon: React.ElementType }[]
                    ).map(f => (
                      <div key={f.k}>
                        <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2">{f.l}</label>
                        <div className="relative">
                          <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2F4F6]/30" />
                          <input
                            disabled={!isEditing}
                            value={f.v}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, [f.k]: e.target.value })}
                            className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-12 text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] disabled:opacity-50"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-6 border-t border-[#990000]/20">
                      <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2">SECURITY</label>
                      <button onClick={() => setShowPasswordModal(true)} className="flex items-center gap-2 text-sm text-[#F2F4F6]/70 hover:text-[#FF0000] transition-colors border border-[#F2F4F6]/10 px-4 py-3 rounded-xl w-full hover:border-[#FF0000]/50">
                        <Lock className="w-4 h-4" /> เปลี่ยนรหัสผ่าน (Change Password)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Tab Addresses ─── */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold flex items-center gap-3 font-['Orbitron'] tracking-wide">
                        <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> ADDRESSES
                      </h3>
                      <button onClick={openAddAddress} className="bg-[#990000] hover:bg-[#FF0000] text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(153,0,0,0.4)] text-sm font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> เพิ่มที่อยู่
                      </button>
                    </div>
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="bg-[#000000] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000]/50 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#990000] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex items-start justify-between pl-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-lg text-[#F2F4F6] group-hover:text-[#FF0000] transition-colors">{addr.label}</span>
                                {addr.isDefault && <span className="bg-[#FF0000]/20 text-[#FF0000] text-[10px] px-2 py-0.5 rounded border border-[#FF0000]/30 font-['Orbitron'] tracking-wider">DEFAULT</span>}
                              </div>
                              <p className="text-[#F2F4F6]/60 text-sm">{addr.address}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditAddress(addr)} className="text-[#F2F4F6]/30 hover:text-[#FF0000] hover:bg-[#2E0505] rounded-full p-2 transition-all"><Edit2 className="w-5 h-5" /></button>
                              <button onClick={() => confirmDeleteAddress(addr.id)} className="text-[#F2F4F6]/30 hover:text-[#FF0000] hover:bg-[#2E0505] rounded-full p-2 transition-all"><Trash2 className="w-5 h-5" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Tab Orders ─── */}
              {activeTab === 'orders' && (
                <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-['Orbitron'] tracking-wide">
                    <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> ORDER HISTORY
                  </h3>

                  {/* แถบสถานะ */}
                  <div className="grid grid-cols-4 gap-4 mb-8 pb-6 border-b border-[#990000]/20">
                    {[
                      { icon: Wallet, label: 'ที่ต้องชำระ', count: 0 },
                      { icon: Package, label: 'ที่ต้องจัดส่ง', count: 1 },
                      { icon: Truck, label: 'ที่ต้องได้รับ', count: 2 },
                      { icon: Star, label: 'ให้คะแนน', count: 0 }
                    ].map((status, idx) => (
                      <div key={idx} onClick={() => openStatusModal(status.label)} className="flex flex-col items-center gap-2 cursor-pointer group">
                        <div className="relative p-3 rounded-xl bg-[#0a0a0a] border border-[#990000]/20 group-hover:border-[#FF0000] group-hover:bg-[#2E0505] transition-all">
                          {status.count > 0 && <span className="absolute -top-2 -right-2 bg-[#FF0000] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-[0_0_5px_#FF0000] z-10">{status.count}</span>}
                          <status.icon className="w-6 h-6 text-[#F2F4F6]/60 group-hover:text-[#FF0000] transition-colors" />
                        </div>
                        <span className="text-xs text-[#F2F4F6]/60 group-hover:text-[#F2F4F6] font-['Kanit'] transition-colors">{status.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* รายการ Order */}
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#000000] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000] transition-all group">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-['Orbitron'] font-bold text-[#F2F4F6]">#{order.id}</p>
                            <p className="text-xs text-[#F2F4F6]/40">{order.date}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center justify-between border-t border-[#990000]/20 pt-4 mt-2">
                          <p className="text-[#F2F4F6]/60 text-sm font-['Kanit']">{order.itemsDetail.length} รายการ</p>
                          <p className="text-xl font-['Orbitron'] font-bold text-[#FF0000]">฿{order.total}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(order)} className="w-full mt-4 bg-[#2E0505] hover:bg-[#FF0000] text-[#FF0000] hover:text-white py-2 rounded-lg transition-all text-sm font-bold border border-[#990000]/30">ดูรายละเอียด</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ─── Modal: Change Password ─── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
          <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(153,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6]">CHANGE PASSWORD</h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="text-[#F2F4F6] hover:text-[#FF0000]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30" />
                  <input type="password" placeholder="••••••" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">New Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30" />
                  <input type="password" placeholder="New password" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Confirm Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30" />
                  <input type="password" placeholder="Confirm new password" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" />
                </div>
              </div>
              <button onClick={handleUpdatePassword} className="w-full bg-[#FF0000] hover:bg-[#990000] text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest mt-4 shadow-[0_0_15px_rgba(255,0,0,0.3)]">UPDATE PASSWORD</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Add/Edit Address ─── */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddressModal(false)}></div>
          <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_50px_rgba(153,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6]">{editingAddressId ? 'EDIT ADDRESS' : 'NEW ADDRESS'}</h3>
              <button onClick={() => setShowAddressModal(false)}><X className="text-[#F2F4F6] hover:text-[#FF0000]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Label (ชื่อเรียก)</label>
                <input
                  value={addressForm.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder="เช่น บ้าน, ที่ทำงาน"
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 text-[#F2F4F6] focus:border-[#FF0000] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Full Address (ที่อยู่จัดส่ง)</label>
                <textarea
                  value={addressForm.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddressForm({ ...addressForm, address: e.target.value })}
                  placeholder="รายละเอียดที่อยู่..." rows={3}
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 text-[#F2F4F6] focus:border-[#FF0000] outline-none transition-all resize-none"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${addressForm.isDefault ? 'bg-[#FF0000] border-[#FF0000]' : 'border-[#F2F4F6]/30 group-hover:border-[#FF0000]'}`}>
                  {addressForm.isDefault && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="hidden"
                />
                <span className="text-sm text-[#F2F4F6]/80 group-hover:text-white transition-colors">ตั้งเป็นที่อยู่เริ่มต้น (Set as Default)</span>
              </label>
              <button onClick={saveAddress} className="w-full bg-[#FF0000] hover:bg-[#990000] text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest transition-all mt-4 shadow-[0_0_15px_rgba(255,0,0,0.3)]">SAVE ADDRESS</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Delete Address ─── */}
      {showDeleteAddrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteAddrModal(false)}></div>
          <div className="relative bg-[#0a0a0a] border border-[#FF0000] w-full max-w-sm rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.6)]">
            <div className="w-16 h-16 bg-[#2E0505] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF0000]/30">
              <Trash2 className="w-8 h-8 text-[#FF0000]" />
            </div>
            <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6] mb-2">DELETE ADDRESS?</h3>
            <p className="text-sm text-[#F2F4F6]/60 mb-6">คุณต้องการลบที่อยู่นี้ใช่หรือไม่?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteAddrModal(false)} className="flex-1 bg-transparent border border-[#990000]/50 text-[#F2F4F6] py-3 rounded-xl font-bold hover:border-[#FF0000] transition">CANCEL</button>
              <button onClick={deleteAddress} className="flex-1 bg-[#FF0000] text-white py-3 rounded-xl font-bold hover:bg-[#990000] transition shadow-[0_0_15px_rgba(255,0,0,0.4)]">DELETE</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Order Details ─── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(153,0,0,0.5)]">
            <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#F2F4F6] font-['Orbitron']">ORDER DETAILS</h4>
                <p className="text-xs text-[#FF0000] font-['Orbitron'] mt-1">#{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-[#990000] rounded-full transition-colors text-[#F2F4F6]/50 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#000000]/60 p-4 rounded-xl border border-[#990000]/10">
                  <p className="text-[10px] text-[#F2F4F6]/30 font-['Orbitron'] uppercase mb-1">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="bg-[#000000]/60 p-4 rounded-xl border border-[#990000]/10">
                  <p className="text-[10px] text-[#F2F4F6]/30 font-['Orbitron'] uppercase mb-1">Tracking</p>
                  <p className="text-[#F2F4F6] font-['Orbitron'] flex items-center gap-2"><Truck className="w-4 h-4 text-[#FF0000]" /> {selectedOrder.tracking}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#990000] font-['Orbitron'] uppercase mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> ITEMS</p>
                {selectedOrder.itemsDetail?.map((i, x) => (
                  <div key={x} className="flex gap-4 items-center bg-[#1a1a1a]/50 p-3 rounded-xl border border-[#990000]/10 mb-2">
                    <div className="w-12 h-12 bg-black rounded border border-[#990000]/20 flex items-center justify-center overflow-hidden">
                      <img src={i.image} alt={i.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#F2F4F6]">{i.name}</p>
                      <p className="text-xs text-[#F2F4F6]/40 font-['Orbitron']">x{i.qty}</p>
                    </div>
                    <p className="font-bold text-[#FF0000] font-['Orbitron']">฿{i.price}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#2E0505]/10 p-4 rounded-xl border border-[#990000]/10">
                <p className="text-xs text-[#990000] font-['Orbitron'] uppercase mb-2 flex items-center gap-2"><MapPin className="w-3 h-3" /> Shipping Address</p>
                <p className="text-sm text-[#F2F4F6]/70">{selectedOrder.address}</p>
              </div>
            </div>
            <div className="p-5 bg-[#2E0505]/20 border-t border-[#990000]/20">
              <button onClick={() => setSelectedOrder(null)} className="w-full bg-[#FF0000] text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest hover:bg-[#990000] transition-all">CLOSE DETAILS</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Status Modal ─── */}
      {statusModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setStatusModal(null)}></div>
          <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(153,0,0,0.5)]">
            <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black text-[#F2F4F6] font-['Orbitron'] uppercase">{statusModal.title}</h4>
                <p className="text-xs text-[#FF0000] font-['Kanit'] mt-1">รายการสินค้าที่อยู่ในสถานะ "{statusModal.title}"</p>
              </div>
              <button onClick={() => setStatusModal(null)} className="p-2 hover:bg-[#990000] rounded-full transition-colors text-[#F2F4F6]/50 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {statusModal.items.length > 0 ? (
                statusModal.items.map((order) => (
                  <div key={order.id} className="bg-[#000000] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000] transition-all group">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-['Orbitron'] font-bold text-[#F2F4F6]">#{order.id}</p>
                        <p className="text-xs text-[#F2F4F6]/40">{order.date}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#990000]/20 pt-4 mt-2">
                      <p className="text-[#F2F4F6]/60 text-sm font-['Kanit']">{order.itemsDetail.length} รายการ</p>
                      <p className="text-xl font-['Orbitron'] font-bold text-[#FF0000]">฿{order.total}</p>
                    </div>

                    {/* Star Rating */}
                    {statusModal.title === 'ให้คะแนน' && (
                      <div className="flex items-center gap-1 mt-3 justify-end">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => handleRating(order.id, star)} className="transition-transform hover:scale-110 focus:outline-none">
                            <Star className={`w-5 h-5 transition-colors ${(ratings[order.id] || 0) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-[#F2F4F6]/20'}`} />
                          </button>
                        ))}
                        <span className="text-xs text-[#F2F4F6]/50 ml-2 font-['Kanit']">
                          {ratings[order.id] ? `คุณให้ ${ratings[order.id]} ดาว` : 'กดเพื่อรีวิวสินค้า'}
                        </span>
                      </div>
                    )}

                    <button onClick={() => setSelectedOrder(order)} className="w-full mt-4 bg-[#2E0505] hover:bg-[#FF0000] text-[#FF0000] hover:text-white py-2 rounded-lg transition-all text-sm font-bold border border-[#990000]/30">ดูรายละเอียด</button>
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
      )}

      {/* TODO: Remaining Modals (Success Modal, Logout Modal) */}
    </div>
  );
}