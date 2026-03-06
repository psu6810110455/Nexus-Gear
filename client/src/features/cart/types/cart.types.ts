export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  maxQty: number;
  image: string;
  category: string;
}

export interface CouponData {
  type: 'percent' | 'fixed';
  value: number;
  label: string;
}