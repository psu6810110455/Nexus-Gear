// src/services/apiDashboard.ts
import axios from 'axios';

// ----------------------------------------
// 1. กำหนดโครงสร้างข้อมูล (Interfaces)
// ----------------------------------------
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStock: number;
}

export interface ActivityItem {
  user: string;
  action: string;
  time: string;
}

// ตั้งค่า URL หลักของ API (ถ้าเปลี่ยน Server จะได้แก้ที่เดียว)
const BASE_URL = 'http://localhost:3000/api/admin/dashboard';

// ----------------------------------------
// 2. ฟังก์ชันสำหรับดึงข้อมูล (API Calls)
// ----------------------------------------

/** ดึงข้อมูลกล่องสถิติ 4 กล่อง */
export const fetchStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axios.get(`${BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error("API Error (Stats):", error);
    // Mock Data สำรองกันเว็บพัง
    return { totalSales: 459200, totalOrders: 1245, totalProducts: 156, lowStock: 5 };
  }
};

/** ดึงข้อมูลกราฟยอดขาย */
export const fetchChart = async (): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/chart`);
    return response.data;
  } catch (error) {
    console.error("API Error (Chart):", error);
    // Mock Data สำรอง
    return [40, 65, 30, 85, 55, 90, 70];
  }
};

/** ดึงข้อมูลกิจกรรมล่าสุด */
export const fetchActivities = async (): Promise<ActivityItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/activities`);
    return response.data;
  } catch (error) {
    console.error("API Error (Activities):", error);
    // Mock Data สำรอง
    return [
      { user: "Admin 01", action: "ปรับสต็อก ROG Phone 7", time: "5 นาทีที่แล้ว" },
      { user: "System", action: "ได้รับคำสั่งซื้อใหม่ #ORD-2566-005", time: "12 นาทีที่แล้ว" },
      { user: "Admin 02", action: "อนุมัติการชำระเงิน #ORD-2566-002", time: "1 ชั่วโมงที่แล้ว" },
      { user: "System", action: "แจ้งเตือน: Razer Kishi V2 ใกล้หมด", time: "2 ชั่วโมงที่แล้ว" },
    ];
  }
};