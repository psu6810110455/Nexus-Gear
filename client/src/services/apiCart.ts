// src/services/apiCart.ts

// ==========================================
// 1. กำหนดโครงสร้างข้อมูล (Interfaces)
// ==========================================
export interface CartItem {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  maxQty: number;
}

export interface CouponData {
  type: 'percent' | 'fixed';
  value: number;
  label: string;
}

// ==========================================
// 2. ข้อมูลจำลอง (Mock Data) 
// (รอเชื่อมกับ Database ของจริงที่คุณทำ Backend ไว้)
// ==========================================
const mockCartItems: CartItem[] = [
  { id: 1, name: 'ROG Phone 7 Ultimate', category: 'Mobile Gaming', image: '/rog-phone.png', price: 45990, originalPrice: 49990, quantity: 1, maxQty: 5 },
  { id: 2, name: 'HyperX Cloud Alpha', category: 'Headset', image: '/headset.png', price: 3990, originalPrice: 3990, quantity: 2, maxQty: 10 },
  { id: 3, name: 'Razer Kishi V2', category: 'Controller', image: '/controller.png', price: 3490, originalPrice: 4200, quantity: 1, maxQty: 3 },
];

const couponsDB: Record<string, CouponData> = {
  NEXUS10: { type: 'percent', value: 10, label: 'ลด 10%' },
  GAMING200: { type: 'fixed', value: 200, label: 'ลด 200 บาท' },
  NEWUSER: { type: 'percent', value: 15, label: 'ลด 15% (ลูกค้าใหม่)' },
};

// ==========================================
// 3. ฟังก์ชันสำหรับเรียกใช้งาน (API Calls)
// ==========================================

/** ดึงข้อมูลสินค้าในตะกร้าทั้งหมด */
export const fetchCartItems = async (): Promise<CartItem[]> => {
  // จำลองความหน่วงของ Network (Delay 0.5 วิ)
  return new Promise((resolve) => setTimeout(() => resolve([...mockCartItems]), 500));
};

/** ตรวจสอบรหัสคูปองส่วนลด */
export const validateCoupon = async (code: string): Promise<CouponData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const validCode = code.trim().toUpperCase();
      resolve(couponsDB[validCode] || null);
    }, 300); // จำลองการเช็ค Database
  });
};