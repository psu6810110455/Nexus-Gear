import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Square, CheckSquare, Store, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// นำเข้า API และ Types
import { fetchCartItems, validateCoupon, updateCartQuantity, removeFromCart } from '../services/cart.service';
import type { CartItem as CartItemType, CouponData } from '../types/cart.types';
import { useLanguage } from '../../../shared/context/LanguageContext';

// นำเข้า Components
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import DeleteModal from '../components/DeleteModal';

interface CartProps {
  onNavigate?: (page: string) => void;
}

interface DeleteModalState {
  show: boolean;
  type: 'single' | 'all' | null;
  id: number | null;
}

export default function CartPage({ onNavigate }: CartProps) {
  const { language, t } = useLanguage();
  // ─── 1. STATE MANAGEMENT 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); 
  
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<(CouponData & { code: string }) | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');
  const [showCouponInput, setShowCouponInput] = useState<boolean>(false);
  
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ show: false, type: null, id: null });

  // ─── 2. LIFECYCLE ───
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const items = await fetchCartItems();
      setCartItems(items);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // ─── 3. LOGIC FUNCTIONS ───
  const toggleSelect = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedItems(selectedItems.length === cartItems.length && cartItems.length > 0 ? [] : cartItems.map(i => i.id));
  };

  const updateQty = async (id: number, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, Math.min(item.maxQty || 99, item.quantity + delta));
    
    // Optimistic Update: อัปเดตหน้าจอก่อนเพื่อให้ผู้ใช้รู้สึกว่าเว็บเร็ว
    setCartItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: newQty } : i)));
    
    // ยิง API ไปอัปเดตหลังบ้าน
    try {
      await updateCartQuantity(id, newQty);
    } catch (error) {
      console.error("อัปเดต Database ไม่สำเร็จ", error);
      const freshItems = await fetchCartItems();
      setCartItems(freshItems);
    }
  };

  const openDeleteModal = (type: 'single' | 'all', id: number | null = null) => {
    setDeleteModal({ show: true, type, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.type === 'single' && deleteModal.id) {
      try {
        await removeFromCart(deleteModal.id);
        setCartItems(prev => prev.filter(item => item.id !== deleteModal.id));
        setSelectedItems(prev => prev.filter(i => i !== deleteModal.id));
      } catch (error) {
         console.error("ลบข้อมูลใน Database ไม่สำเร็จ", error);
      }
    } else if (deleteModal.type === 'all') {
      setCartItems([]);
      setSelectedItems([]);
    }
    setDeleteModal({ show: false, type: null, id: null });
  };

  const applyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const validCoupon = await validateCoupon(code);
    if (validCoupon) {
      setAppliedCoupon({ code, ...validCoupon });
      setCouponSuccess(language === 'TH' ? `คูปอง "${code}" ใช้งานได้! (${validCoupon.label})` : `Coupon "${code}" is valid! (${validCoupon.label})`);
      setCouponCode('');
    } else {
      setCouponError(language === 'TH' ? 'รหัสคูปองไม่ถูกต้องหรือหมดอายุ' : 'Invalid or expired coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
  };

  // ─── 4. CALCULATIONS ───
  const selectedCartItems = cartItems.filter(i => selectedItems.includes(i.id));
  const subtotal = selectedCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalSaved = selectedCartItems.reduce((sum, i) => sum + ((Number(i.originalPrice) || i.price) - i.price) * i.quantity, 0);
  const shippingFee = selectedCartItems.length > 0 ? (subtotal >= 999 ? 0 : 150) : 0;
  
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    discountAmount = appliedCoupon.type === 'percent' 
      ? Math.floor((subtotal * appliedCoupon.value) / 100) 
      : appliedCoupon.value;
  }
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // ✨ จัดการเมื่อกดปุ่มชำระเงิน (แพ็คข้อมูลใส่ localStorage แล้วพาไปหน้า Payment)
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error(language === 'TH' ? "กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นเพื่อดำเนินการต่อ" : "Please select at least 1 item to proceed");
      return;
    }

    // สร้างแพ็กเกจข้อมูลที่ลูกค้าเลือกไว้ (ใส่ : any เพื่อแก้ปัญหา TypeScript แดง)
    const checkoutData = {
      items: selectedCartItems.map((item: any) => ({
        name: item.name,
        price: item.price,
        qty: item.quantity,
        imageUrl: item.imageUrl || item.image_url
      })),
      subtotal: subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      coupon: appliedCoupon ? appliedCoupon.code : (language === 'TH' ? 'ไม่มี' : 'None')
    };

    // ยัดใส่กระเป๋า (localStorage)
    localStorage.setItem('checkoutSession', JSON.stringify(checkoutData));

    // เปลี่ยนหน้าไปที่ Payment
    onNavigate?.('payment'); 
  };

  // ─── 5. RENDER STATES ───
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#000000] flex justify-center items-center">
        <p className="text-[#FF0000] font-['Orbitron'] animate-pulse text-2xl tracking-widest">{t('loading')}</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        </div>
        
        <section aria-label="ตะกร้าว่างเปล่า" className="relative z-10 flex flex-col items-center">
          <figure className="relative mb-6 m-0">
            <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-xl rounded-full"></div>
            <ShoppingCart aria-hidden="true" className="w-24 h-24 text-[#990000] relative z-10" />
          </figure>
          <header className="text-center">
            <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-2 tracking-widest">{t('emptyCart')}</h2>
            <p className="text-[#F2F4F6]/40 mb-8 font-light">{language === 'TH' ? 'ยังไม่มีไอเทมเทพๆ ในตะกร้าของคุณเลย' : 'Your cart is looking empty. Let’s find some gear!'}</p>
          </header>
          <button onClick={() => onNavigate?.('home')} className="bg-[#990000] hover:bg-[#FF0000] text-white px-8 py-3 rounded-xl font-['Orbitron'] font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(153,0,0,0.4)]">
            {language === 'TH' ? 'ไปเลือกซื้อไอเทม' : 'Go Shopping'}
          </button>
        </section>
      </main>
    );
  }

  // ─── 6. MAIN RENDER ───
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white">
      {/* Background Effects */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        {/* Page Header */}
        <section aria-labelledby="cart-heading" className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <button onClick={() => onNavigate?.('products')} className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-6 group" aria-label="กลับไปหน้าสินค้า">
            <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('backToProducts')}
          </button>
          <header className="flex items-center gap-4 mb-2">
            <div aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
            <h2 id="cart-heading" className="text-3xl md:text-4xl font-['Orbitron'] font-bold tracking-wide text-[#F2F4F6]">
              {t('cart')}
            </h2>
            <span className="text-lg font-normal text-[#F2F4F6]/40 font-['Kanit'] mt-2">
              ({cartItems.reduce((s, i) => s + i.quantity, 0)} {t('piece')})
            </span>
          </header>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          
          {/* ฝั่งซ้าย: รายการสินค้า */}
          <section aria-label="รายการสินค้าในตะกร้า" className="lg:col-span-2 space-y-4">
            <header className="bg-[#000000]/40 border border-[#990000]/20 rounded-t-xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm">
                <button onClick={toggleSelectAll} className="text-[#FF0000] hover:scale-110 transition-transform">
                   {selectedItems.length === cartItems.length && cartItems.length > 0 ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                </button>
                <div aria-hidden="true" className="h-6 w-[1px] bg-[#990000]/40"></div>
                <div className="flex items-center gap-2">
                   <Store className="w-5 h-5 text-[#F2F4F6]" />
                   <span className="text-[#F2F4F6] font-['Orbitron'] font-bold tracking-wider">NEXUS OFFICIAL STORE</span>
                </div>
                <div className="flex-1 text-right">
                    <button onClick={() => openDeleteModal('all')} className="text-[#990000] hover:text-[#FF0000] text-xs font-['Orbitron'] tracking-wider transition flex items-center gap-2 group justify-end ml-auto">
                        <Trash2 className="w-3 h-3 group-hover:rotate-12 transition-transform" /> {language === 'TH' ? 'ลบทั้งหมด' : 'DELETE ALL'}
                    </button>
                </div>
            </header>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={toggleSelect}
                  onUpdateQty={updateQty}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          </section>

          {/* ฝั่งขวา: เรียกใช้ Component OrderSummary */}
          <OrderSummary 
            selectedCount={selectedItems.length}
            subtotal={subtotal}
            totalSaved={totalSaved}
            discountAmount={discountAmount}
            shippingFee={shippingFee}
            grandTotal={grandTotal}
            appliedCoupon={appliedCoupon}
            couponCode={couponCode}
            setCouponCode={(code) => { setCouponCode(code); setCouponError(''); setCouponSuccess(''); }}
            applyCoupon={applyCoupon}
            removeCoupon={removeCoupon}
            couponError={couponError}
            couponSuccess={couponSuccess}
            showCouponInput={showCouponInput}
            setShowCouponInput={setShowCouponInput}
            onCheckout={handleCheckout} 
          />
        </main>
      </div>

      {/* เรียกใช้ Component หน้าต่างแจ้งเตือน (Modal) */}
      <DeleteModal 
        show={deleteModal.show}
        type={deleteModal.type}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ ...deleteModal, show: false })}
      />

    </div>
  );
}
