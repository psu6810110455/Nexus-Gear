import { useEffect, useState } from 'react'
import axios from 'axios'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// ลบ Recharts ตัวเก่าออก เพราะเราย้ายไปทำในหน้าใหม่แล้ว

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
// 1. นำเข้าหน้า Dashboard ตัวใหม่ที่เราเพิ่งสร้าง
import NexusGearAdminDashboard from './pages/NexusGearAdminDashboard'; 
import './App.css'

interface CartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  total_price: string;
}

interface SalesData {
  name: string;
  sales: number;
}

function AppContent() {
  const location = useLocation();
  // เช็คว่าถ้าเป็นหน้า /admin หรือ /dashboard ให้ซ่อน Navbar (จะได้แสดงหน้า Dashboard เราเต็มๆ)
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const resCart = await axios.get('http://localhost:3000/cart')
      setCartItems(resCart.data)
      const resSales = await axios.get('http://localhost:3000/sales-data')
      setSalesData(resSales.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:3000/cart/add', { productId: 5, quantity: 1 })
      alert("เพิ่มสินค้าเรียบร้อย!")
      fetchData()
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาด")
    }
  }

  const handleRemove = async (id: number) => {
    if (!confirm("ต้องการลบสินค้านี้ใช่ไหม?")) return;
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`)
      fetchData()
    } catch (error) {
      console.error(error)
      alert("ลบไม่ได้")
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* ซ่อน Navbar เมื่ออยู่หน้า Admin หรือ Dashboard */}
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* 2. เปลี่ยน Route /dashboard ให้เรียกหน้า NexusGearAdminDashboard ของเราแทน! */}
        <Route 
            path="/dashboard" 
            element={
                <NexusGearAdminDashboard 
                    setActiveTab={(tab) => console.log('เปลี่ยนไปหน้า:', tab)} 
                />
            } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;