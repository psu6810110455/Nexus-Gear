// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

// กำหนดหน้าตาของข้อมูลใน Context
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// สร้าง Context ขึ้นมา
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// สร้าง Provider เพื่อนําไปครอบ App ของเรา
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ตรวจสอบ Token ใน localStorage เมื่อเริ่มแอพ
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // ถ้ามี token ให้ isLoggedIn เป็น true
  }, []);

  // ฟังก์ชันสำหรับล็อกอิน
  const login = (token: string) => {
    localStorage.setItem('token', token); // เก็บ token
    setIsLoggedIn(true); // เปลี่ยนสถานะ
  };

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = () => {
    localStorage.removeItem('token'); // ลบ token
    setIsLoggedIn(false); // เปลี่ยนสถานะ
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// สร้าง Hook เพื่อให้ Component อื่นเรียกใช้ง่ายๆ
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};