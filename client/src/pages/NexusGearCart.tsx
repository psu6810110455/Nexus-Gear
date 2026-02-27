// src/pages/NexusGearCart.tsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Tag, ChevronDown, ChevronUp, User, Square, CheckSquare, Store, X, AlertTriangle } from 'lucide-react';

// นำเข้า API และ Types จากไฟล์ apiCart.ts ที่เราสร้างไว้
import { fetchCartItems, validateCoupon } from '../services/apiCart';
import type { CartItem, CouponData } from '../services/apiCart';

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
  // ─── 2. STATE MANAGEMENT (จัดการข้อมูลสถานะ) ───
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); 
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<(CouponData & { code: string }) | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');
  const [showCouponInput, setShowCouponInput] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ show: false, type: null, id: null });

  // ─── 3. LIFECYCLE (ดึงข้อมูลตอนโหลด) ───
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const items = await fetchCartItems();
      setCartItems(items);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // ─── ฟังก์ชันที่ 1: เลือกสินค้าทีละรายการ ───
  const toggleSelect = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ─── ฟังก์ชันที่ 2: เลือกสินค้าทั้งหมด ───
  const toggleSelectAll = () => {
    setSelectedItems(selectedItems.length === cartItems.length && cartItems.length > 0 ? [] : cartItems.map(i => i.id));
  };

  // ─── ⭐ เพิ่มใหม่ใน Commit 5: ฟังก์ชันเพิ่ม/ลดจำนวนสินค้า ───
  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.maxQty, item.quantity + delta)) } : item
    ));
  };

  // ─── 4. RENDER: สถานะกำลังโหลด ───
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#000000] flex justify-center items-center">
        <p className="text-[#FF0000] font-['Orbitron'] animate-pulse text-2xl">LOADING CART...</p>
      </main>
    );
  }

  // ─── 5. RENDER: สถานะตะกร้าว่างเปล่า (Semantic HTML) ───
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] flex flex-col items-center justify-center relative overflow-hidden">
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        </div>
        
        <section aria-label="Empty Cart" className="relative z-10 flex flex-col items-center">
          <figure className="relative mb-6 m-0">
            <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-xl rounded-full"></div>
            <ShoppingCart aria-hidden="true" className="w-24 h-24 text-[#990000] relative z-10" />
          </figure>
          <header className="text-center">
            <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-2 tracking-widest">YOUR CART IS EMPTY</h2>
            <p className="text-[#F2F4F6]/40 mb-8 font-light">ยังไม่มีสินค้าในตะกร้าเทพของคุณ</p>
          </header>
          <button onClick={() => onNavigate?.('home')} className="bg-[#990000] hover:bg-[#FF0000] text-white px-8 py-3 rounded-xl font-['Orbitron'] font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(153,0,0,0.4)]">
            GO SHOPPING
          </button>
        </section>
      </main>
    );
  }

  // ─── 6. RENDER: โครงสร้างหลัก (Header & Title) ───
  return (
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white">

      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="relative z-10">
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div onClick={() => onNavigate?.('home')} className="flex items-center gap-4 group cursor-pointer" role="button" tabIndex={0} aria-label="Go to Home">
              <figure className="relative m-0">
                <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 object-contain relative z-10" />
              </figure>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                NEXUS GEAR
              </h1>
            </div>
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate?.('home')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider">HOME</button>
              <button className="text-[#FF0000] font-['Orbitron'] text-sm tracking-wider border-b-2 border-[#FF0000] pb-1 shadow-[0_5px_10px_rgba(255,0,0,0.2)]" aria-current="page">CART</button>
              <button onClick={() => onNavigate?.('profile')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider flex items-center gap-2">
                <User aria-hidden="true" className="w-4 h-4" /> PROFILE
              </button>
            </nav>
          </div>
        </header>

        <section aria-labelledby="cart-heading" className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <button onClick={() => onNavigate?.('products')} className="flex items-center gap-2 text-[#F2F4F6]/40 hover:text-[#FF0000] transition text-sm mb-6 group" aria-label="Go back to shop">
            <ArrowLeft aria-hidden="true" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO SHOP
          </button>
          <header className="flex items-center gap-4 mb-2">
            <div aria-hidden="true" className="w-1.5 h-10 bg-[#FF0000] rounded-full shadow-[0_0_15px_#FF0000]"></div>
            <h2 id="cart-heading" className="text-3xl md:text-4xl font-['Orbitron'] font-bold tracking-wide text-[#F2F4F6]">
              YOUR CART
            </h2>
            <span className="text-lg font-normal text-[#F2F4F6]/40 font-['Kanit'] mt-2">
              ({cartItems.reduce((s, i) => s + i.quantity, 0)} รายการ)
            </span>
          </header>
        </section>

        <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          
          <section aria-label="Cart Items" className="lg:col-span-2 space-y-4">
            
            <header className="bg-[#000000]/40 border border-[#990000]/20 rounded-t-xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm">
                <button 
                  onClick={toggleSelectAll} 
                  className="text-[#FF0000] hover:scale-110 transition-transform"
                  aria-label={selectedItems.length === cartItems.length ? "Deselect all items" : "Select all items"}
                >
                   {selectedItems.length === cartItems.length && cartItems.length > 0 ? <CheckSquare aria-hidden="true" className="w-6 h-6" /> : <Square aria-hidden="true" className="w-6 h-6" />}
                </button>
                <div aria-hidden="true" className="h-6 w-[1px] bg-[#990000]/40"></div>
                <div className="flex items-center gap-2">
                   <Store aria-hidden="true" className="w-5 h-5 text-[#F2F4F6]" />
                   <span className="text-[#F2F4F6] font-['Orbitron'] font-bold tracking-wider">NEXUS OFFICIAL STORE</span>
                </div>
                <div className="flex-1 text-right">
                    <button className="text-[#990000] hover:text-[#FF0000] text-xs font-['Orbitron'] tracking-wider transition flex items-center gap-2 group justify-end ml-auto">
                        <Trash2 aria-hidden="true" className="w-3 h-3 group-hover:rotate-12 transition-transform" /> CLEAR ALL
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {cartItems.map((item) => (
                <article key={item.id} className={`bg-[#000000]/60 border ${selectedItems.includes(item.id) ? 'border-[#FF0000]/60 bg-[#2E0505]/20' : 'border-[#990000]/20'} backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 relative overflow-hidden`}>
                    <div className="flex items-start gap-4">
                        <div className="pt-4">
                             <button onClick={() => toggleSelect(item.id)} className="text-[#FF0000] hover:scale-110 transition-transform" aria-label={`Select ${item.name}`}>
                                {selectedItems.includes(item.id) ? <CheckSquare aria-hidden="true" className="w-6 h-6" /> : <Square aria-hidden="true" className="w-6 h-6 text-[#F2F4F6]/20" />}
                             </button>
                        </div>
                        <div className="flex-1 flex gap-5">
                             <figure className="m-0">
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl border border-[#990000]/30 bg-[#1a1a1a]" />
                             </figure>
                             
                             {/* ⭐ จุดที่อัปเดตใน Commit 5: เพิ่มปุ่มปรับจำนวนสินค้า */}
                             <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                                <div className="flex items-start justify-between gap-2">
                                    <header>
                                        <p className="text-[10px] font-['Orbitron'] text-[#990000] tracking-widest uppercase mb-1">{item.category}</p>
                                        <h3 className="font-bold text-lg text-[#F2F4F6] line-clamp-1">{item.name}</h3>
                                    </header>
                                </div>
                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex flex-col">
                                        {item.originalPrice !== item.price && (<span className="text-xs text-[#F2F4F6]/30 line-through font-['Kanit']">฿{item.originalPrice.toLocaleString('th-TH')}</span>)}
                                        <span className="text-xl font-['Orbitron'] font-bold text-[#FF0000] drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">฿{item.price.toLocaleString('th-TH')}</span>
                                    </div>
                                    
                                    {/* ชุดปุ่มควบคุมจำนวนสินค้า */}
                                    <div className="flex items-center bg-[#000000] border border-[#990000]/30 rounded-lg overflow-hidden">
                                        <button 
                                          onClick={() => updateQty(item.id, -1)} 
                                          disabled={item.quantity <= 1} 
                                          className="w-8 h-8 flex items-center justify-center text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] disabled:opacity-30 transition border-r border-[#990000]/20"
                                          aria-label="Decrease quantity"
                                        >
                                          <Minus aria-hidden="true" className="w-3 h-3" />
                                        </button>
                                        <div className="w-10 h-8 flex items-center justify-center font-['Orbitron'] font-bold text-[#F2F4F6] text-sm" aria-live="polite">
                                          {item.quantity}
                                        </div>
                                        <button 
                                          onClick={() => updateQty(item.id, 1)} 
                                          disabled={item.quantity >= item.maxQty} 
                                          className="w-8 h-8 flex items-center justify-center text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] disabled:opacity-30 transition border-l border-[#990000]/20"
                                          aria-label="Increase quantity"
                                        >
                                          <Plus aria-hidden="true" className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </article>
                ))}
            </div>
          </section>

          <aside className="lg:col-span-1">
             <div className="bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 h-[200px] flex items-center justify-center">
                <p className="text-[#FF0000] font-['Orbitron'] animate-pulse text-center leading-relaxed">
                  WAITING FOR SUMMARY...<br/>
                  <span className="text-xs text-[#F2F4F6]/50">(รอประกอบร่างใน Commit ถัดไป)</span>
                </p>
             </div>
          </aside>

        </main>
      </div>
    </div>
  );
}