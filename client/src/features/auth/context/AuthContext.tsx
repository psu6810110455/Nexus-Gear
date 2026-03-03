import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// ✅ 1. เพิ่ม Type สำหรับเก็บข้อมูล User
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ✅ 2. อัปเดต Type ของ Context ให้มี user พ่วงไปด้วย
interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ 3. ฟังก์ชันลับสำหรับเอา Token ไปแลกข้อมูล User จาก Backend
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` } // แนบ Token ไปเป็นบัตรผ่านประตู
      });
      setUser(response.data); // เก็บข้อมูล User (ชื่อ, อีเมล) ไว้ในระบบ
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Token หมดอายุหรือไม่ถูกต้อง', error);
      // ถ้า Token พัง ให้เตะออกจากระบบ (เคลียร์ข้อมูลทิ้ง)
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // ถ้าเปิดเว็บมาแล้วมี Token ค้างอยู่ ให้ไปดึงข้อมูล User ทันที
      fetchUserProfile(token);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    fetchUserProfile(token); // ✅ พอได้ Token มาปุ๊บ (ล็อกอินสำเร็จ) ให้ดึงข้อมูล User ทันที
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null); // เคลียร์ข้อมูล User ทิ้ง
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};