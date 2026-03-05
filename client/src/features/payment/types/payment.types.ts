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