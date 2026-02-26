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
        
        {/* Background Effects (ใช้ aria-hidden="true" เพราะเป็นแค่ของตกแต่ง ไม่เกี่ยวกับเนื้อหา) */}
        <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
        </div>
        
        {/* ใช้ <section> จัดกลุ่มเนื้อหาส่วนที่ตะกร้าว่าง */}
        <section aria-label="Empty Cart" className="relative z-10 flex flex-col items-center">
          
          {/* ใช้ <figure> สำหรับครอบไอคอน/รูปภาพ */}
          <figure className="relative mb-6 m-0">
            <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-xl rounded-full"></div>
            <ShoppingCart aria-hidden="true" className="w-24 h-24 text-[#990000] relative z-10" />
          </figure>

          {/* ใช้ <header> สำหรับหัวข้อข้อความ */}
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
    // หน้าหลักทั้งหมด (Wrapper)
    <div className="min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] relative overflow-x-hidden selection:bg-[#990000] selection:text-white">

      {/* Background Effects (ใส่ aria-hidden="true" เพื่อบอกระบบว่านี่แค่พื้นหลัง) */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* เนื้อหาหลักที่อยู่เหนือ Background */}
      <div className="relative z-10">

        {/* ─── แถบเมนูด้านบน (Header Navigation) ใช้แท็ก <header> ─── */}
        <header className="bg-[#000000]/80 border-b border-[#990000]/30 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* โลโก้และชื่อร้าน */}
            <div onClick={() => onNavigate?.('home')} className="flex items-center gap-4 group cursor-pointer" role="button" tabIndex={0} aria-label="Go to Home">
              <figure className="relative m-0">
                <div aria-hidden="true" className="absolute inset-0 bg-[#FF0000]/20 blur-md rounded-full group-hover:bg-[#FF0000]/40 transition duration-300"></div>
                <img src="/nexus-logo.png" alt="Nexus Logo" className="w-10 h-10 object-contain relative z-10" />
              </figure>
              <h1 className="text-2xl font-['Orbitron'] font-black text-[#F2F4F6] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                NEXUS GEAR
              </h1>
            </div>

            {/* เมนูนำทาง ใช้แท็ก <nav> เพื่อระบุว่าเป็น Navigation */}
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate?.('home')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider">
                HOME
              </button>
              {/* ปุ่ม CART ใส่ aria-current="page" เพื่อบอกว่าตอนนี้เราอยู่หน้านี้ */}
              <button className="text-[#FF0000] font-['Orbitron'] text-sm tracking-wider border-b-2 border-[#FF0000] pb-1 shadow-[0_5px_10px_rgba(255,0,0,0.2)]" aria-current="page">
                CART
              </button>
              <button onClick={() => onNavigate?.('profile')} className="text-[#F2F4F6]/60 hover:text-[#FF0000] transition font-['Orbitron'] text-sm tracking-wider flex items-center gap-2">
                <User aria-hidden="true" className="w-4 h-4" /> PROFILE
              </button>
            </nav>
          </div>
        </header>

        {/* ─── ส่วนหัวของหน้า (Page Title) ─── */}
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

        {/* ─── โครงสร้างชั่วคราว (รอทำรายการสินค้าใน Commit 3) ─── */}
        <main className="max-w-7xl mx-auto px-4 py-6 text-center pb-20">
            <p className="text-2xl font-['Orbitron'] text-[#FF0000] animate-pulse py-20 border border-dashed border-[#990000]/50 rounded-2xl bg-[#2E0505]/20">
              ✅ Header และ Title มาแล้ว! (รอเติมรายการสินค้าฝั่งซ้ายใน Commit 3)
            </p>
        </main>

      </div>
    </div>
  );
}