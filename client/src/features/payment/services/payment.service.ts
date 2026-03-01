// src/services/apiPayment.ts

export interface Address {
  id: number;
  label: string;
  name: string;
  detail: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface OrderSummaryData {
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  coupon: string;
}

// ─── ข้อมูลจำลอง (Mock Data) ───
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

// ─── ฟังก์ชันจำลองการดึงข้อมูล (API Simulation) ───
export const fetchAddresses = async (): Promise<Address[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAddresses), 600); // จำลองโหลด 0.6 วินาที
  });
};

export const fetchOrderSummary = async (): Promise<OrderSummaryData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOrderSummary), 800); // จำลองโหลด 0.8 วินาที
  });
};