// src/features/cart/services/cart.service.ts
import api from '../../../shared/services/api'; // ✅ ใช้ instance ที่ attach token อัตโนมัติ
import type { CartItem, CouponData } from '../types/cart.types';

export const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await api.get('/api/cart');
    return response.data;
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:', error);
    return [];
  }
};

export const validateCoupon = async (code: string): Promise<CouponData | null> => {
  try {
    const response = await api.post('/api/coupons/validate', { code: code.trim().toUpperCase() });
    return response.data;
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการตรวจสอบคูปอง "${code}":`, error);
    return null;
  }
};

export const updateCartQuantity = async (id: number, quantity: number) => {
  try {
    await api.patch(`/api/cart/${id}`, { quantity });
  } catch (error) {
    console.error('❌ อัปเดตจำนวนสินค้าไม่สำเร็จ:', error);
    throw error;
  }
};

export const removeFromCart = async (id: number) => {
  try {
    await api.delete(`/api/cart/${id}`);
  } catch (error) {
    console.error('❌ ลบสินค้าไม่สำเร็จ:', error);
    throw error;
  }
};