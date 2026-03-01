// src/pages/NexusGearCart.tsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Tag, ChevronDown, ChevronUp, User, Square, CheckSquare, Store, X, AlertTriangle } from 'lucide-react';

// นำเข้า API และ Types จากไฟล์ apiCart.ts ที่เราสร้างไว้
import { fetchCartItems, validateCoupon } from '../services/cart.service';
import type { CartItem, CouponData } from '../services/cart.service';

// 1. กำหนด Interface
interface CartProps {
  onNavigate?: (page: string) => void;
}

interface DeleteModalState {
  show: boolean;
  type: 'single' | 'all' | null;
  id: number | null;
}

export default function NexusGearCart({ onNavigate }: CartProps) {
  // ─── 2. STATE MANAGEMENT ───
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); 
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<(CouponData & { code: string }) | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');
  const [showCouponInput, setShowCouponInput] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ show: false, type: null, id: null });

  // ─── 3. LIFECYCLE ───
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const items = await fetchCartItems();
      setCartItems(items);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // ─── LOGIC FUNCTIONS ───
  const toggleSelect = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedItems(selectedItems.length === cartItems.length && cartItems.length > 0 ? [] : cartItems.map(i => i.id));
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.maxQty, item.quantity + delta)) } : item
    ));
  };

  const openDeleteModal = (type: 'single' | 'all', id: number | null = null) => {
    setDeleteModal({ show: true, type, id });
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'single') {
      setCartItems(prev => prev.filter(item => item.id !== deleteModal.id));
      setSelectedItems(prev => prev.filter(i => i !== deleteModal.id));
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
      setCouponSuccess(`คูปอง "${code}" ใช้งานได้! (${validCoupon.label})`);
      setCouponCode('');
    } else {
      setCouponError('รหัสคูปองไม่ถูกต้องหรือหมดอายุ');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
  };

  // ─── CALCULATIONS ───
  const selectedCartItems = cartItems.filter(i => selectedItems.includes(i.id));
  const subtotal = selectedCartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalSaved = selectedCartItems.reduce((sum, i) => sum + (i.originalPrice - i.price) * i.quantity, 0);
  const shippingFee = selectedCartItems.length > 0 ? (subtotal >= 1500 ? 0 : 150) : 0;
  
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    discountAmount = appliedCoupon.type === 'percent' 
      ? Math.floor((subtotal * appliedCoupon.value) / 100) 
      : appliedCoupon.value;
  }
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const fmt = (n: number) => n.toLocaleString('th-TH');

  // ─── 4. RENDER: สถานะกำลังโหลด ───
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#000000] flex justify-center items-center">
        <p className="text-[#FF0000] font-['Orbitron'] animate-pulse text-2xl tracking-widest">กำลังโหลดตะกร้าสินค้า...</p>
      </main>
    );
  }

  // ─── 5. RENDER: สถานะตะกร้าว่างเปล่า ───
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] flex flex-col items-center justify-center relative overflow-hidden">
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        </div>
        
        <section aria-label="ตะกร้าว่างเปล่า" className="relative z-10 flex flex-col items-center">
          <figure className="relative mb-6 m-0">
            <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-xl rounded-full"></div>
            <ShoppingCart aria-hidden="true" className="w-24 h-24 text-[#990000] relative z-10" />
          </figure>
          <header className="text-center">
            <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-2 tracking-widest">ตะกร้าสินค้าว่างเปล่า</h2>
            <p className="text-[#F2F4F6]/40 mb-8 font-light">ยังไม่มีไอเทมเทพๆ ในตะกร้าของคุณเลย</p>
          </header>
          <button onClick={() => onNavigate?.('home')} className="bg-[#990000] hover:bg-[#FF0000] text-white px-8 py-3 rounded-xl font-['Orbitron'] font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(153,0,0,0.4)]">
            ไปเลือกซื้อไอเทม
          </button>
        </section>
      </main>
    );
  }

  // ─── 6. RENDER: โครงสร้างหลัก ───
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white">

      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        
        {/* แถบนำทาง */}
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div onClick={() => onNavigate?.('home')} className="flex items-center gap-4 group cursor-pointer" role="button" tabIndex={0} aria-label="กลับไปหน้าหลัก">
              <figure className="relative m-0">
                <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="โลโก้ Nexus Gear" className="w-10 h-10 object-contain relative z-10" />
              </figure>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                NEXUS GEAR
              </h1>
            </div>
            <nav aria-label="เมนูหลัก" className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate?.('home')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider">หน้าหลัก</button>
              <button className="text-[#FF0000] font-['Orbitron'] text-sm tracking-wider border-b-2 border-[#FF0000] pb-1 shadow-[0_5px_10px_rgba(255,0,0,0.2)]" aria-current="page">ตะกร้าสินค้า</button>
              <button onClick={() => onNavigate?.('profile')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider flex items-center gap-2">
                <User aria-hidden="true" className="w-4 h-4" /> โปรไฟล์
              </button>
            </nav>
          </div>
        </header>

        {/* ส่วนหัวหน้าเว็บ */}
        <section aria-labelledby="cart-heading" className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <button onClick={() => onNavigate?.('products')} className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-6 group" aria-label="กลับไปหน้าสินค้า">
            <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> กลับไปคลังสินค้า
          </button>
          <header className="flex items-center gap-4 mb-2">
            <div aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
            <h2 id="cart-heading" className="text-3xl md:text-4xl font-['Orbitron'] font-bold tracking-wide text-[#F2F4F6]">
              ตะกร้าสินค้าของคุณ
            </h2>
            <span className="text-lg font-normal text-[#F2F4F6]/40 font-['Kanit'] mt-2">
              ({cartItems.reduce((s, i) => s + i.quantity, 0)} รายการ)
            </span>
          </header>
        </section>

        {/* เนื้อหาหลัก */}
        <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          
          {/* ซ้าย: รายการสินค้า */}
          <section aria-label="รายการสินค้าในตะกร้า" className="lg:col-span-2 space-y-4">
            
            <header className="bg-[#000000]/40 border border-[#990000]/20 rounded-t-xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm">
                <button 
                  onClick={toggleSelectAll} 
                  className="text-[#FF0000] hover:scale-110 transition-transform"
                  aria-label={selectedItems.length === cartItems.length ? "ยกเลิกการเลือกทั้งหมด" : "เลือกสินค้าทั้งหมด"}
                >
                   {selectedItems.length === cartItems.length && cartItems.length > 0 ? <CheckSquare aria-hidden="true" className="w-6 h-6" /> : <Square aria-hidden="true" className="w-6 h-6" />}
                </button>
                <div aria-hidden="true" className="h-6 w-[1px] bg-[#990000]/40"></div>
                <div className="flex items-center gap-2">
                   <Store aria-hidden="true" className="w-5 h-5 text-[#F2F4F6]" />
                   <span className="text-[#F2F4F6] font-['Orbitron'] font-bold tracking-wider">NEXUS OFFICIAL STORE</span>
                </div>
                <div className="flex-1 text-right">
                    <button 
                      onClick={() => openDeleteModal('all')} 
                      className="text-[#990000] hover:text-[#FF0000] text-xs font-['Orbitron'] tracking-wider transition flex items-center gap-2 group justify-end ml-auto"
                      aria-label="ลบสินค้าทั้งหมด"
                    >
                        <Trash2 aria-hidden="true" className="w-3 h-3 group-hover:rotate-12 transition-transform" /> ลบทั้งหมด
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {cartItems.map((item) => (
                <article key={item.id} className={`bg-[#000000]/60 border ${selectedItems.includes(item.id) ? 'border-[#FF0000]/60 bg-[#2E0505]/20' : 'border-[#990000]/20'} backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 relative overflow-hidden flex items-start gap-4`}>
                    
                    <div className="pt-4">
                         <button onClick={() => toggleSelect(item.id)} className="text-[#FF0000] hover:scale-110 transition-transform" aria-label={`เลือก ${item.name}`}>
                            {selectedItems.includes(item.id) ? <CheckSquare aria-hidden="true" className="w-6 h-6" /> : <Square aria-hidden="true" className="w-6 h-6 text-[#F2F4F6]/20" />}
                         </button>
                    </div>
                    
                    <div className="flex-1 flex gap-5">
                         <figure className="m-0">
                            <img src={item.image} alt={`รูปภาพของ ${item.name}`} className="w-24 h-24 object-cover rounded-xl border border-[#990000]/30 bg-[#1a1a1a]" />
                         </figure>
                         
                         <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                            <header className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-[10px] font-['Orbitron'] text-[#990000] tracking-widest uppercase mb-1">{item.category}</p>
                                    <h3 className="font-bold text-lg text-[#F2F4F6] line-clamp-1">{item.name}</h3>
                                </div>
                                <button 
                                  onClick={() => openDeleteModal('single', item.id)} 
                                  className="text-[#F2F4F6]/20 hover:text-[#FF0000] transition p-1 hover:bg-[#2E0505] rounded"
                                  aria-label={`ลบ ${item.name} ออกจากตะกร้า`}
                                >
                                  <Trash2 aria-hidden="true" className="w-5 h-5" />
                                </button>
                            </header>

                            <footer className="flex items-end justify-between mt-auto">
                                <div className="flex flex-col">
                                    {item.originalPrice !== item.price && (<span className="text-xs text-[#F2F4F6]/30 line-through font-['Kanit']">฿{item.originalPrice.toLocaleString('th-TH')}</span>)}
                                    <span className="text-xl font-['Orbitron'] font-bold text-[#FF0000] drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">฿{item.price.toLocaleString('th-TH')}</span>
                                </div>
                                
                                <div className="flex items-center bg-[#000000] border border-[#990000]/30 rounded-lg overflow-hidden">
                                    <button onClick={() => updateQty(item.id, -1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] disabled:opacity-30 transition border-r border-[#990000]/20" aria-label="ลดจำนวนสินค้า">
                                      <Minus aria-hidden="true" className="w-3 h-3" />
                                    </button>
                                    <div className="w-10 h-8 flex items-center justify-center font-['Orbitron'] font-bold text-[#F2F4F6] text-sm" aria-live="polite">
                                      {item.quantity}
                                    </div>
                                    <button onClick={() => updateQty(item.id, 1)} disabled={item.quantity >= item.maxQty} className="w-8 h-8 flex items-center justify-center text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] disabled:opacity-30 transition border-l border-[#990000]/20" aria-label="เพิ่มจำนวนสินค้า">
                                      <Plus aria-hidden="true" className="w-3 h-3" />
                                    </button>
                                </div>
                            </footer>
                        </div>
                    </div>
                </article>
                ))}
            </div>
          </section>

          {/* ขวา: สรุปยอดสั่งซื้อ */}
          <aside className="lg:col-span-1">
            <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl sticky top-28 space-y-6 relative overflow-hidden">
              <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/5 blur-[40px] rounded-full pointer-events-none"></div>
              
              <h3 className="text-xl font-['Orbitron'] font-bold flex items-center gap-3 border-b border-[#990000]/20 pb-4">
                <span aria-hidden="true" className="w-1.5 h-6 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> สรุปยอดคำสั่งซื้อ
              </h3>

              {/* ส่วนใส่คูปอง */}
              <div className="space-y-2 border-b border-[#990000]/20 pb-4">
                 <button 
                   onClick={() => setShowCouponInput(!showCouponInput)} 
                   className="w-full flex items-center justify-between text-[#F2F4F6]/70 hover:text-[#FF0000] transition group"
                   aria-expanded={showCouponInput}
                 >
                  <span className="flex items-center gap-2 font-['Orbitron'] text-xs tracking-wider group-hover:translate-x-1 transition-transform">
                    <Tag aria-hidden="true" className="w-4 h-4" /> โค้ดส่วนลด
                  </span>
                  {showCouponInput ? <ChevronUp aria-hidden="true" className="w-4 h-4" /> : <ChevronDown aria-hidden="true" className="w-4 h-4" />}
                </button>
                {showCouponInput && (
                    <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
                    {appliedCoupon ? (
                        <div className="bg-[#2E0505]/50 border border-[#FF0000]/30 rounded-lg p-3 flex items-center justify-between relative overflow-hidden">
                            <div aria-hidden="true" className="absolute left-0 top-0 w-1 h-full bg-[#FF0000]"></div>
                            <div>
                              <p className="text-[#FF0000] font-['Orbitron'] text-xs font-bold tracking-wider">{appliedCoupon.code}</p>
                              <p className="text-[#F2F4F6]/50 text-[10px]">{appliedCoupon.label}</p>
                            </div>
                            <button onClick={removeCoupon} className="text-[#F2F4F6]/40 hover:text-[#FF0000] transition p-1 hover:bg-[#000000]/20 rounded-full" aria-label="ลบคูปองส่วนลด">
                              <X aria-hidden="true" className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="กรอกโค้ดส่วนลด..." 
                                  value={couponCode} 
                                  onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); setCouponSuccess(''); }} 
                                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} 
                                  className="flex-1 bg-[#000000] border border-[#990000]/30 rounded-lg px-3 py-2 text-sm text-[#F2F4F6] placeholder-[#F2F4F6]/20 focus:outline-none focus:border-[#FF0000] transition font-['Orbitron'] uppercase tracking-wider" 
                                  aria-label="ช่องกรอกรหัสส่วนลด"
                                />
                                <button onClick={applyCoupon} className="bg-[#2E0505] border border-[#990000] text-[#FF0000] hover:bg-[#990000] hover:text-white px-4 rounded-lg text-xs font-['Orbitron'] font-bold transition">ตกลง</button>
                            </div>
                            {couponError && <p className="text-red-500 text-[10px] pl-1 animate-pulse" role="alert">⚠ {couponError}</p>}
                            {couponSuccess && <p className="text-green-500 text-[10px] pl-1" role="status">✓ {couponSuccess}</p>}
                        </div>
                    )}
                    </div>
                )}
              </div>

              {/* บิลราคา */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm font-['Kanit']">
                  <span className="text-[#F2F4F6]/50">ราคาสินค้า ({selectedItems.length} ชิ้น)</span>
                  <span className="text-[#F2F4F6] font-['Orbitron']">฿{fmt(subtotal)}</span>
                </div>
                {totalSaved > 0 && selectedItems.length > 0 && (
                  <div className="flex justify-between text-sm font-['Kanit']">
                    <span className="text-green-500/80">ส่วนลดโปรโมชั่น</span>
                    <span className="text-green-500 font-['Orbitron']">-฿{fmt(totalSaved)}</span>
                  </div>
                )}
                {appliedCoupon && subtotal > 0 && (
                  <div className="flex justify-between text-sm font-['Kanit']">
                    <span className="text-[#FF0000]">คูปอง ({appliedCoupon.code})</span>
                    <span className="text-[#FF0000] font-['Orbitron']">-฿{fmt(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-['Kanit']">
                  <span className="text-[#F2F4F6]/50">ค่าจัดส่ง</span>
                  <span className={shippingFee === 0 ? 'text-green-500 font-bold' : 'text-[#F2F4F6] font-["Orbitron"]'}>
                    {shippingFee === 0 ? (subtotal > 0 ? 'ส่งฟรี' : '฿0') : `฿${fmt(shippingFee)}`}
                  </span>
                </div>
              </div>

              <div aria-hidden="true" className="border-t border-[#990000]/30 border-dashed"></div>
              
              <div className="flex justify-between items-end">
                <span className="font-['Orbitron'] text-sm text-[#F2F4F6]/60 tracking-wider">ยอดรวมสุทธิ</span>
                <span className="font-['Orbitron'] text-3xl font-black text-[#FF0000] drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">฿{fmt(grandTotal)}</span>
              </div>

              <button 
                disabled={selectedItems.length === 0} 
                onClick={() => onNavigate?.('payment')} 
                className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:from-[#333] disabled:to-[#444] disabled:text-gray-500 text-white py-4 rounded-xl font-['Orbitron'] font-bold tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(153,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] active:scale-95 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">ชำระเงิน ({selectedItems.length}) <ArrowLeft aria-hidden="true" className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" /></span>
                {selectedItems.length > 0 && <div aria-hidden="true" className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[30deg] group-hover:animate-[shimmer_1s_infinite]"></div>}
              </button>

              <footer className="grid grid-cols-3 gap-2 pt-2 border-t border-[#990000]/10">
                {['ชำระเงินปลอดภัย', 'จัดส่งไว', 'รับประกันศูนย์'].map((b) => (
                  <div key={b} className="text-[#F2F4F6]/20 text-[9px] text-center font-['Kanit'] flex flex-col items-center gap-1">
                    <div aria-hidden="true" className="w-1 h-1 bg-[#990000] rounded-full"></div>{b}
                  </div>
                ))}
              </footer>
            </div>
          </aside>

        </main>
      </div>

      {/* ─── MODAL แจ้งเตือน ─── */}
      {deleteModal.show && (
        <dialog open className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-transparent m-auto w-full h-full">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModal({ ...deleteModal, show: false })} aria-hidden="true"></div>
          <article className="relative bg-[#0a0a0a] border border-[#FF0000] w-full max-w-sm rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.6)] animate-in zoom-in-95">
            <figure className="w-16 h-16 bg-[#2E0505] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF0000]/30 m-0">
              <AlertTriangle aria-hidden="true" className="w-8 h-8 text-[#FF0000]" />
            </figure>
            <header>
              <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6] mb-2">
                  {deleteModal.type === 'all' ? 'ล้างตะกร้าสินค้า?' : 'ลบไอเทมนี้?'}
              </h3>
              <p className="text-sm text-[#F2F4F6]/60 mb-6 font-['Kanit']">
                  {deleteModal.type === 'all' 
                   ? 'คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าทั้งหมดออกจากตะกร้า?' 
                   : 'คุณแน่ใจหรือไม่ว่าต้องการลบไอเทมนี้ออกจากตะกร้า?'}
              </p>
            </header>
            <footer className="flex gap-3">
              <button onClick={() => setDeleteModal({ ...deleteModal, show: false })} className="flex-1 bg-transparent border border-[#990000]/50 text-[#F2F4F6] py-3 rounded-xl font-bold hover:border-[#FF0000] transition font-['Orbitron'] tracking-wider">ยกเลิก</button>
              <button onClick={confirmDelete} className="flex-1 bg-[#FF0000] text-white py-3 rounded-xl font-bold hover:bg-[#990000] transition shadow-[0_0_15px_rgba(255,0,0,0.4)] font-['Orbitron'] tracking-wider">ยืนยันการลบ</button>
            </footer>
          </article>
        </dialog>
      )}

    </div>
  );
}