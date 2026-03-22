// src/features/auth/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string | "admin" | "customer";
  picture?: string | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ฟังก์ชันลับสำหรับเอา Token ไปแลกข้อมูล User จาก Backend
  const fetchUserProfile = async (token: string) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }, // แนบ Token ไปเป็นบัตรผ่านประตู
      });
      setUser(response.data); // เก็บข้อมูล User (ชื่อ, อีเมล) ไว้ในระบบ
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Token หมดอายุหรือไม่ถูกต้อง", error);
      // ถ้า Token พัง ให้เตะออกจากระบบ (เคลียร์ข้อมูลทิ้ง)
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // โหลดข้อมูลจาก localStorage เมื่อ refresh หน้า
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token) {
      if (savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
        setLoading(false);
        // refresh profile from backend just in case
        fetchUserProfile(token);
      } else {
        fetchUserProfile(token).finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userData?: AuthUser) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
    } else {
      fetchUserProfile(token); //  พอได้ Token มาปุ๊บ (ล็อกอินสำเร็จ) ให้ดึงข้อมูล User ทันที
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
