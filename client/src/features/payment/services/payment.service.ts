// src/features/payment/services/payment.service.ts

import api from '../../../shared/services/api';
import type { Address } from '../types/payment.types';

// ─── Functions: ดึงข้อมูลที่อยู่จริงจาก Backend ──────────────────────────────
export const fetchAddresses = async (): Promise<Address[]> => {
  try {
    const res = await api.get('/profile/addresses');
    const rawAddresses = res.data;

    // แปลงข้อมูลจาก Profile API ให้ตรงกับ Payment Address type
    return rawAddresses.map((addr: any) => ({
      id: addr.id,
      label: addr.label || 'ที่อยู่',
      name: addr.name || '',
      detail: addr.address || addr.detail || '',
      phone: addr.phone || '',
      isDefault: addr.isDefault || false,
    }));
  } catch (error) {
    console.error('ไม่สามารถโหลดที่อยู่ได้:', error);
    return []; // คืนค่าว่างแทน mock
  }
};

// ─── Function ใหม่ (เพิ่มเข้ามาสำหรับยิง API จริง) ──────────────────────────
export const checkout = async (
  shippingAddress: string,
  paymentMethod: string,
  slipFile?: File | null,
) => {
  try {
    //  ใช้ FormData เพราะต้องแนบไฟล์สลิป
    const formData = new FormData();
    formData.append('shippingAddress', shippingAddress);
    formData.append('paymentMethod', paymentMethod);
    if (slipFile) {
      formData.append('slipImage', slipFile);
    }

    //  ไม่ต้องส่ง userId อีกต่อไป — backend ดึงจาก JWT token แทน
    const response = await api.post('/orders/checkout', formData);
    return response.data;
  } catch (error) {
    console.error('❌ สั่งซื้อไม่สำเร็จ:', error);
    throw error;
  }
};