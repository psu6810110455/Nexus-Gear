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

  // ─── โครงสร้างชั่วคราว (รอประกอบร่างใน Commit ถัดไป) ───
  return (
    <main className="min-h-screen bg-[#000000] text-[#F2F4F6] flex items-center justify-center">
      <p className="text-2xl font-['Orbitron'] text-[#FF0000] animate-pulse">
        ✅ โหลดข้อมูลสำเร็จ ตะกร้ามีสินค้า {cartItems.length} ชิ้น (รอเติมโค้ดแสดงผลใน Commit ถัดไป)
      </p>
    </main>
  );
}