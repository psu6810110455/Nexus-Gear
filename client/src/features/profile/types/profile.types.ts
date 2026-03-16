export interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bank_name: string;
  bank_account: string;
}

export interface Address {
  id: number;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: string;
  image: string;
}

export type OrderStatus = 'pending_payment' | 'processing' | 'shipping' | 'delivered';

export interface Order {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  items: number;
  tracking: string;
  address: string;
  itemsDetail: OrderItem[];
}