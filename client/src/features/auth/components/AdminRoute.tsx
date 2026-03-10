// src/features/auth/components/AdminRoute.tsx
// ใช้ครอบ Route ที่ต้องการ role admin เช่น /admin, /dashboard

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isLoggedIn, user, loading } = useAuth();

  // รอเช็ค token จาก localStorage ให้เสร็จก่อน
  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
