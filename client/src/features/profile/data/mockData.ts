import type { Order, UserData, Address } from '../types/profile.types';

export const initialUserData: UserData = {
  name: 'แม็กซ์ เกมเมอร์',
  email: 'max.gamer@email.com',
  phone: '081-234-5678',
  address: '123 ถนนเกมมิ่ง แขวงไฮเทค เขตดิจิตอล กรุงเทพฯ 10110'
};

export const initialAddresses: Address[] = [
  { id: 1, label: 'บ้าน', address: '123 ถนนเกมมิ่ง แขวงไฮเทค เขตดิจิตอล กรุงเทพฯ 10110', isDefault: true },
  { id: 2, label: 'ที่ทำงาน', address: '456 อาคารออฟฟิศ ถนนสีลม บางรัก กรุงเทพฯ 10500', isDefault: false }
];

export const mockOrders: Order[] = [
  { 
    id: 'ORD001', date: '15 ม.ค. 2569', total: '3,490', status: 'delivered', items: 3, tracking: 'TH-EXPRESS-8812',
    address: '123 ถนนเกมมิ่ง แขวงไฮเทค...',
    itemsDetail: [{ name: 'Razer Kishi V2', qty: 1, price: '3,490', image: '/controller.png' }]
  },
  { 
    id: 'ORD002', date: '10 ม.ค. 2569', total: '1,890', status: 'shipping', items: 1, tracking: 'KERRY-998877',
    address: '456 อาคารออฟฟิศ ถนนสีลม...',
    itemsDetail: [{ name: 'HyperX Cloud Alpha', qty: 1, price: '1,890', image: '/headset.png' }]
  },
  { 
    id: 'ORD003', date: '05 ม.ค. 2569', total: '5,990', status: 'processing', items: 2, tracking: 'กำลังจัดเตรียม',
    address: '123 ถนนเกมมิ่ง แขวงไฮเทค...',
    itemsDetail: [{ name: 'ROG Phone Case', qty: 1, price: '1,990', image: '/rog-phone.png' }, { name: 'Cooling Fan', qty: 1, price: '4,000', image: '/fan.png' }]
  }
];