// src/features/cart/services/cart.service.ts
import axios from 'axios';
import type { CartItem, CouponData } from '../types/cart.types';

// 📍 ตั้งค่า Base URL ให้ชี้ไปที่ NestJS Backend ของคุณ
// (ปรับแก้ http://localhost:3000 ให้ตรงกับพอร์ตจริงของ Backend นะครับ)
const API_URL = 'http://localhost:3000/api';

/**
 * ฟังก์ชันดึงข้อมูลตะกร้าสินค้าจาก Database
 */
export const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    // ยิง GET Request ไปที่ Backend เพื่อขอข้อมูลตะกร้า
    const response = await axios.get(`${API_URL}/cart`);
    return response.data;
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:', error);
    return []; // ถ้าพัง หรือ Backend ยังไม่เปิด ให้ส่งตะกร้าว่างกลับไปก่อนเว็บจะได้ไม่ค้าง
  }
};

/**
 * ฟังก์ชันตรวจสอบโค้ดส่วนลดจาก Database
 */
export const validateCoupon = async (code: string): Promise<CouponData | null> => {
  try {
    const validCode = code.trim().toUpperCase();
    
    // ยิง POST Request เพื่อเช็คคูปอง
    const response = await axios.post(`${API_URL}/coupons/validate`, { code: validCode });
    return response.data;
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการตรวจสอบคูปอง "${code}":`, error);
    return null; // ถ้าโค้ดผิด หมดอายุ หรือ API พัง ให้ตอบกลับเป็น null
  }
};

// ฟังก์ชันเสริม (เผื่อต้องใช้): อัปเดตจำนวนสินค้า หรือลบสินค้า
export const updateCartItem = async (id: number, quantity: number) => {
  try {
    await axios.patch(`${API_URL}/cart/${id}`, { quantity });
  } catch (error) {
    console.error('❌ อัปเดตจำนวนสินค้าไม่สำเร็จ:', error);
  }
};

export const deleteCartItem = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/cart/${id}`);
  } catch (error) {
    console.error('❌ ลบสินค้าไม่สำเร็จ:', error);
  }
};