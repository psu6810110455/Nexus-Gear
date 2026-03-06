import { useState, useEffect } from 'react';
import { LogOut, Trash2 } from 'lucide-react';

// ✅ 1. นำเข้า useAuth จาก Context ของเรา
import { useAuth } from '../../auth/context/AuthContext';

// นำเข้า Components หลัก
import { ProfileSidebar } from '../components/ProfileSidebar';
import { ProfileInfoTab } from '../components/tabs/ProfileInfoTab';
import { ProfileAddressesTab } from '../components/tabs/ProfileAddressesTab';
import { ProfileOrdersTab } from '../components/tabs/ProfileOrdersTab';

// นำเข้า Modals
import { AddressModal } from '../components/modals/AddressModal';
import { OrderDetailModal } from '../components/modals/OrderDetailModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { PasswordModal } from '../components/modals/PasswordModal';
import { SuccessModal } from '../components/modals/SuccessModal';
import { StatusModal } from '../components/modals/StatusModal';

// นำเข้าข้อมูลและ Type
import type { Order } from '../types/profile.types';

// นำเข้า API Service
import * as profileApi from '../services/profile.service';

export const ProfilePage = () => {
  // ✅ 2. ดึงข้อมูล user จากระบบ
  const { user, logout } = useAuth(); 

  const [activeTab, setActiveTab] = useState('orders');
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', address: '' });
  const [addresses, setAddresses] = useState<any[]>([]); 
  const [orders, setOrders] = useState<Order[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // ✅ 3. อัปเดต useEffect ให้ดึงข้อมูลสดจาก Database ก่อน ถ้าไม่มีค่อยดึงจาก Google
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. วิ่งไปดึงข้อมูลโปรไฟล์ล่าสุดจาก Database
        const profile = await profileApi.fetchProfile();
        
        setUserData(prev => ({ 
          ...prev, 
          // ✅ สลับเอา user (Google) ขึ้นก่อน เพื่อไม่ให้ Mock Data มาทับ!
          name: user?.name || profile.name || '', 
          email: user?.email || profile.email || '', 
          phone: profile.phone || '' 
        }));

        // 2. โหลดข้อมูลที่อยู่
        const addrs = await profileApi.fetchAddresses();
        setAddresses(addrs);

        // 3. โหลดประวัติคำสั่งซื้อจริงจาก Database
        try {
          const realOrders = await profileApi.fetchMyOrders();
          setOrders(realOrders);
        } catch (orderErr) {
          console.error('ไม่สามารถโหลดประวัติคำสั่งซื้อได้:', orderErr);
        }
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลสดจาก DB ได้:', error);
        
        // แผนสำรอง: ถ้าดึง Database ไม่ได้จริงๆ ให้หยิบข้อมูลพื้นฐานจาก Google มาโชว์แก้ขัด
        if (user) {
          setUserData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
          }));
        }
      }
    };

    // จะโหลดข้อมูลก็ต่อเมื่อผู้ใช้ล็อกอิน (มีข้อมูล user) แล้วเท่านั้น
    if (user) {
      loadData();
    }
  }, [user]);

  // ─── State สำหรับควบคุมการเปิด/ปิด Modals ───
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAddrModal, setShowDeleteAddrModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [statusModal, setStatusModal] = useState<{ title: string; items: Order[] } | null>(null);

  // ─── State สำหรับข้อมูลชั่วคราวใน Modals ───
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({ label: '', address: '', isDefault: false });
  const [addrToDelete, setAddrToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState({ title: '', detail: '' });

  // ─── Logic Functions ───
  const triggerSuccess = (title: string, detail: string) => {
    setSuccessMessage({ title, detail });
    setShowSuccessModal(true);
  };

  const saveProfileInfo = async () => {
    try {
      await profileApi.updateProfile({ name: userData.name, phone: userData.phone });
      triggerSuccess('SAVED!', 'อัปเดตข้อมูลส่วนตัวลงฐานข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      console.error('อัปเดตข้อมูลล้มเหลว:', error);
    }
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({ label: '', address: '', isDefault: false });
    setShowAddressModal(true);
  };

  const openEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({ label: addr.label, address: addr.address, isDefault: addr.isDefault });
    setShowAddressModal(true);
  };

  const saveAddress = async () => {
    try {
      if (editingAddressId) {
        await profileApi.updateAddress(editingAddressId, addressForm);
      } else {
        await profileApi.createAddress(addressForm);
      }
      const addrs = await profileApi.fetchAddresses();
      setAddresses(addrs);
      setShowAddressModal(false);
      triggerSuccess('SAVED!', 'บันทึกที่อยู่เรียบร้อยแล้ว');
    } catch (error) {
      console.error('บันทึกที่อยู่ล้มเหลว:', error);
    }
  };

  const confirmDeleteAddress = (id: number) => {
    setAddrToDelete(id);
    setShowDeleteAddrModal(true);
  };

  const deleteAddress = async () => {
    if (!addrToDelete) return;
    try {
      await profileApi.deleteAddress(addrToDelete);
      setAddresses(addresses.filter(a => a.id !== addrToDelete));
      setShowDeleteAddrModal(false);
      triggerSuccess('DELETED!', 'ลบที่อยู่เรียบร้อยแล้ว');
    } catch (error) {
      console.error('ลบที่อยู่ล้มเหลว:', error);
    }
  };

  const handleUpdatePassword = () => {
    setShowPasswordModal(false);
    triggerSuccess('SUCCESS!', 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
  };

  // ✅ 4. ใช้ฟังก์ชัน logout จาก AuthContext
  const handleLogout = () => {
    setShowLogoutModal(false);
    logout(); 
  };

  const handleRating = (orderId: string, score: number) => {
    setRatings(prev => ({ ...prev, [orderId]: score }));
  };

  const openStatusModal = (label: string) => {
    let filteredOrders: Order[] = [];
    if (label === 'ที่ต้องชำระ') {
        filteredOrders = orders.filter(o => o.status === 'pending_payment');
    } else if (label === 'ที่ต้องจัดส่ง') {
        filteredOrders = orders.filter(o => o.status === 'processing');
    } else if (label === 'ที่ต้องได้รับ') {
        filteredOrders = orders.filter(o => o.status === 'shipping');
    } else if (label === 'ให้คะแนน') {
        filteredOrders = orders.filter(o => o.status === 'delivered');
    }
    setStatusModal({ title: label, items: filteredOrders });
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* ซ้าย: Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar 
                userData={userData} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                picture={user?.picture}
              />
            </div>

            {/* ขวา: Content area */}
            <div className="lg:col-span-3">
              {activeTab === 'info' && (
                <ProfileInfoTab 
                  userData={userData} 
                  setUserData={setUserData} 
                  onOpenPasswordModal={() => setShowPasswordModal(true)} 
                  onSave={saveProfileInfo}
                />
              )}
              {activeTab === 'addresses' && (
                <ProfileAddressesTab 
                  addresses={addresses} 
                  onOpenAdd={openAddAddress}
                  onOpenEdit={openEditAddress}
                  onOpenDelete={confirmDeleteAddress}
                />
              )}
              {activeTab === 'orders' && (
                <ProfileOrdersTab 
                  orders={orders} 
                  onOpenStatus={openStatusModal}
                  onOpenDetail={(order) => setSelectedOrder(order)}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ─── Render Modals ทั้งหมด ─── */}
      <AddressModal 
        isOpen={showAddressModal} 
        onClose={() => setShowAddressModal(false)} 
        onSave={saveAddress} 
        form={addressForm} 
        setForm={setAddressForm} 
        isEditing={!!editingAddressId} 
      />

      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
        onUpdate={handleUpdatePassword} 
      />

      <StatusModal 
        statusData={statusModal} 
        onClose={() => setStatusModal(null)} 
        ratings={ratings} 
        onRate={handleRating} 
        onOpenDetail={(order) => {
          setStatusModal(null);
          setSelectedOrder(order);
        }} 
      />

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        title={successMessage.title} 
        detail={successMessage.detail} 
      />

      <ConfirmModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
        title="LOGOUT?" 
        description="คุณต้องการออกจากระบบใช่หรือไม่?" 
        icon={<LogOut className="w-8 h-8 text-[#FF0000]" />} 
      />

      <ConfirmModal 
        isOpen={showDeleteAddrModal} 
        onClose={() => setShowDeleteAddrModal(false)} 
        onConfirm={deleteAddress} 
        title="DELETE ADDRESS?" 
        description="คุณต้องการลบที่อยู่นี้ใช่หรือไม่?" 
        icon={<Trash2 className="w-8 h-8 text-[#FF0000]" />} 
        confirmText="DELETE"
      />

    </div>
  );
};