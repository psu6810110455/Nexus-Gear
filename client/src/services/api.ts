import axios from 'axios';

// 1. ตั้งค่า Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. ประกาศ Type
export interface OrderItem {
  id: number;
  product: {
    name: string;
    price: string;
  };
  quantity: number;
  price_at_purchase: string;
}

export interface Order {
  id: number;
  user: {
    username: string;
    email: string;
  };
  total_price: string;
  status: 'pending' | 'paid' | 'to_ship' | 'shipped' | 'completed' | 'cancelled';
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

// 3. ฟังก์ชันเรียก API
export const getOrders = async () => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

export const getUserOrders = async (userId: number) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};


export const submitOrderRating = async (orderId: number, ratings: Record<number, number>) => {
  const response = await api.post(`/orders/${orderId}/rate`, { ratings });
  return response.data;
};

export default api;