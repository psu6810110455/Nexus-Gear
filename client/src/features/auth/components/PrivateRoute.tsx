// src/features/auth/components/PrivateRoute.tsx
// ใช้ครอบ Route ที่ต้องการ login เช่น /cart, /my-orders, /payment

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // รอเช็ค token จาก localStorage ให้เสร็จก่อน
  if (loading) return null;

  if (!isLoggedIn) {
    // เก็บ path ที่พยายามจะเข้าไว้ เพื่อ redirect กลับหลัง login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
