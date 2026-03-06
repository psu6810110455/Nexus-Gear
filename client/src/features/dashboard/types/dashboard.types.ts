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