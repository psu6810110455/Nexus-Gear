// src/features/dashboard/services/dashboard.service.ts
import axios from 'axios';
import type { DashboardStats, ActivityItem } from '../types/dashboard.types';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/dashboard`;

export const fetchStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axios.get(`${BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error("API Error (Stats):", error);
    return { totalSales: 459200, totalOrders: 1245, totalProducts: 156, lowStock: 5 };
  }
};

export const fetchChart = async (): Promise<number[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/chart`);
    return response.data;
  } catch (error) {
    console.error("API Error (Chart):", error);
    return [40, 65, 30, 85, 55, 90, 70];
  }
};

export const fetchActivities = async (): Promise<ActivityItem[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/activities`);
    return response.data;
  } catch (error) {
    console.error("API Error (Activities):", error);
    return [
      { user: "Admin 01", action: "ปรับสต็อก ROG Phone 7", time: "5 นาทีที่แล้ว" },
      { user: "System", action: "ได้รับคำสั่งซื้อใหม่ #ORD-2566-005", time: "12 นาทีที่แล้ว" },
      { user: "Admin 02", action: "อนุมัติการชำระเงิน #ORD-2566-002", time: "1 ชั่วโมงที่แล้ว" },
      { user: "System", action: "แจ้งเตือน: Razer Kishi V2 ใกล้หมด", time: "2 ชั่วโมงที่แล้ว" },
    ];
  }
};