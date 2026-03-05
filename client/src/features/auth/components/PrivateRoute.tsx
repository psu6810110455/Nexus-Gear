// src/features/auth/components/PrivateRoute.tsx
// ใช้ครอบ Route ที่ต้องการ login เช่น /cart, /my-orders, /payment

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // เก็บ path ที่พยายามจะเข้าไว้ เพื่อ redirect กลับหลัง login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}