// src/features/payment/services/payment.service.ts
import type { Address, OrderSummaryData } from '../types/payment.types';

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