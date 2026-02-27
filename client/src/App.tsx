import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import NexusGearAdminDashboard from './pages/NexusGearAdminDashboard'; 
// ⭐ 1. นำเข้าหน้า Cart ที่เราเพิ่งสร้าง
import NexusGearCart from './pages/NexusGearCart'; 
import './App.css'

function AppContent() {
  const location = useLocation();
  // ⭐ เพิ่ม useNavigate เพื่อให้ปุ่มต่างๆ ในหน้า Cart ลิงก์ไปหน้าอื่นได้จริง
  const navigate = useNavigate();

  // ⭐ 2. เพิ่มเงื่อนไขให้ซ่อน Navbar เดิม ถ้าอยู่หน้า /cart (เพราะหน้า Cart มี Header ของตัวเองแล้ว)
  const hideNavbar = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/cart');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* ซ่อน Navbar เมื่ออยู่หน้า Admin, Dashboard หรือ Cart */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* เรียกหน้า NexusGearAdminDashboard */}
        <Route 
            path="/dashboard" 
            element={
                <NexusGearAdminDashboard 
                    setActiveTab={(tab) => console.log('เปลี่ยนไปหน้า:', tab)} 
                />
            } 
        />

        {/* ⭐ 3. สร้างประตูทางเข้าหน้า Cart ของเรา */}
        <Route 
            path="/cart" 
            element={
                <NexusGearCart 
                    onNavigate={(page) => {
                        // เช็คว่าถ้าหน้า Cart ส่งคำสั่งมา ให้เด้งไปหน้าไหน
                        if (page === 'home') navigate('/');
                        else if (page === 'products') navigate('/shop');
                        else if (page === 'profile') navigate('/login');
                        else if (page === 'payment') navigate('/payment'); // เผื่อทำหน้า Payment ในอนาคต
                    }}
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