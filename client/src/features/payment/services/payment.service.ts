// src/features/payment/services/payment.service.ts

import api from '../../../shared/services/api'; // ✅ ใช้ instance ที่ attach token อัตโนมัติ
import type { Address, OrderSummaryData } from '../types/payment.types';

// ─── Mock Data เดิม (คงไว้เพื่อกัน Error ในหน้า UI) ─────────────────────────
const mockAddresses: Address[] = [
  { id: 1, label: 'บ้าน', name: 'แม็กซ์ เกมเมอร์', detail: '123 ถนนเกมมิ่ง แขวงไฮเทค เขตดิจิตอล กรุงเทพฯ 10110', phone: '081-234-5678', isDefault: true },
  { id: 2, label: 'ที่ทำงาน', name: 'แม็กซ์ เกมเมอร์', detail: '456 อาคารออฟฟิศ ถนนสีลม บางรัก กรุงเทพฯ 10500', phone: '081-234-5678', isDefault: false },
];

const mockOrderSummary: OrderSummaryData = {
  items: [
    { name: 'ROG Phone 7 Ultimate', qty: 1, price: 45990 },
    { name: 'HyperX Cloud Alpha', qty: 2, price: 3990 },
    { name: 'Razer Kishi V2', qty: 1, price: 3490 },
    { name: 'Gaming Finger Sleeves', qty: 1, price: 290 },
  ],
  subtotal: 53760,
  discount: 5376,
  shipping: 0,
  coupon: 'NEXUS10',
};

// ─── Functions เดิม (คงไว้เพื่อกัน Error) ──────────────────────────────────
export const fetchAddresses = async (): Promise<Address[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAddresses), 600);
  });
};

export const fetchOrderSummary = async (): Promise<OrderSummaryData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrderSummary), 800);
  });
};

// ─── Function ใหม่ (เพิ่มเข้ามาสำหรับยิง API จริง) ──────────────────────────
export const checkout = async (
  shippingAddress: string,
  paymentMethod: string,
  slipFile?: File | null,
) => {
  try {
    // ✅ ใช้ FormData เพราะต้องแนบไฟล์สลิป
    const formData = new FormData();
    formData.append('shippingAddress', shippingAddress);
    formData.append('paymentMethod', paymentMethod);
    if (slipFile) {
      formData.append('slipImage', slipFile);
    }

    // ✅ ไม่ต้องส่ง userId อีกต่อไป — backend ดึงจาก JWT token แทน
    const response = await api.post('/api/orders/checkout', formData);
    return response.data;
  } catch (error) {
    console.error('❌ สั่งซื้อไม่สำเร็จ:', error);
    throw error;
  }
};