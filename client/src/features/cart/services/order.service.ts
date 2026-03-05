import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const checkout = async (shippingAddress: string, paymentMethod: string) => {
  try {
    // ยิงไปที่ /orders/checkout ตามที่เราตั้งไว้ในหลังบ้าน (NestJS)
    const response = await axios.post(`${API_URL}/orders/checkout`, {
      userId: 1, // ตอนนี้จำลองเป็น User ID 1 ไปก่อนครับ
      shippingAddress,
      paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error('❌ สั่งซื้อไม่สำเร็จ:', error);
    throw error;
  }
};