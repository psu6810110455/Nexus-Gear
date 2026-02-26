import { useEffect, useState } from 'react'
import axios from 'axios'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import AdminLayout from './components/AdminLayout';
import NexusGearAdminOrders from './pages/NexusGearAdminOrders';
import NexusGearOrderStatus from './pages/NexusGearOrderStatus';
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
  const isAdminPage = location.pathname.startsWith('/admin');

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
      {/* ซ่อน Navbar เมื่ออยู่หน้า Admin */}
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<NexusGearOrderStatus />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<NexusGearAdminOrders />} />
        </Route>

        {/* Dashboard Route */}
        <Route path="/dashboard" element={
          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🚀 Nexus Gear Dashboard</h1>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
              <h2>📊 สรุปยอดขายรายเดือน</h2>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="ยอดขาย (บาท)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <hr style={{ margin: '30px 0' }} />
            <h2 style={{ textAlign: 'left' }}>🛒 ตะกร้าสินค้าของฉัน</h2>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <button onClick={handleAddToCart} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                + ลองกดเพิ่มสินค้า (Test Add)
              </button>
            </div>
            {loading ? <p>กำลังโหลด...</p> : (
              <div>
                {cartItems.length === 0 ? <p>ไม่มีสินค้าในตะกร้า</p> : (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {cartItems.map((item) => (
                      <div key={item.cart_item_id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9f9f9' }}>
                        <div style={{ textAlign: 'left' }}>
                          <h3>{item.name}</h3>
                          <p>ราคาต่อชิ้น: {item.price} บาท</p>
                          <p>จำนวน: <b>{item.quantity}</b> ชิ้น</p>
                          <p style={{ color: 'green', fontWeight: 'bold' }}>รวม: {parseFloat(item.total_price).toLocaleString()} บาท</p>
                        </div>
                        <button onClick={() => handleRemove(item.cart_item_id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                          ลบสินค้า 🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        } />

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