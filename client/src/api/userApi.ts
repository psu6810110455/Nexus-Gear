import axios from 'axios';

// ใส่ URL ของ Backend ที่เพื่อนคุณรันไว้ (ตัวอย่างเช่น http://localhost:3000/api)
const API_URL = 'http://localhost:3000/api'; 

// ฟังก์ชันสำหรับดึงข้อมูลโปรไฟล์มาแสดงตอนเปิดหน้าเว็บ
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับบันทึกข้อมูลเวลาแก้ไขเสร็จ
export const updateUserProfile = async (userData: any) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};