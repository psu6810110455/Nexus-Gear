// src/features/dashboard/services/dashboard.service.ts
import api from '../../../shared/services/api';
import type { DashboardStats, ActivityItem } from '../types/dashboard.types';

export const fetchStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/dashboard/summary');
    const d = response.data.data;
    return {
      totalSales: d.totalSales,
      totalOrders: d.totalOrders,
      totalProducts: 0,
      lowStock: 0,
    };
  } catch (error) {
    console.error("API Error (Stats):", error);
    return { totalSales: 0, totalOrders: 0, totalProducts: 0, lowStock: 0 };
  }
};

export const fetchChart = async (): Promise<number[]> => {
  try {
    const response = await api.get('/dashboard/summary');
    const chart = response.data.data.salesChart;
    return chart.map((item: any) => Number(item.amount) || 0);
  } catch (error) {
    console.error("API Error (Chart):", error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};

export const fetchActivities = async (): Promise<ActivityItem[]> => {
  try {
    const response = await api.get('/dashboard/summary');
    const orders = response.data.data.recentOrders;
    return orders.map((o: any) => ({
      user: "System",
      action: `คำสั่งซื้อ ${o.order_number} - ${o.status}`,
      time: `฿${Number(o.total_price).toLocaleString()}`,
    }));
  } catch (error) {
    console.error("API Error (Activities):", error);
    return [];
  }
};
