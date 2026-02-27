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
import NexusGearCart from './pages/NexusGearCart'; 
// ⭐ 1. นำเข้าหน้า Payment 
import NexusGearPayment from './pages/NexusGearPayment'; 
import './App.css'

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ 2. เพิ่ม /payment เข้าไปในเงื่อนไขซ่อน Navbar เดิม
  const hideNavbar = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/cart') ||
                     location.pathname.startsWith('/payment');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* ซ่อน Navbar เมื่ออยู่หน้า Admin, Dashboard, Cart หรือ Payment */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route 
            path="/dashboard" 
            element={
                <NexusGearAdminDashboard 
                    setActiveTab={(tab) => console.log('เปลี่ยนไปหน้า:', tab)} 
                />
            } 
        />

        {/* หน้า Cart */}
        <Route 
            path="/cart" 
            element={
                <NexusGearCart 
                    onNavigate={(page) => {
                        if (page === 'home') navigate('/');
                        else if (page === 'products') navigate('/shop');
                        else if (page === 'profile') navigate('/login');
                        else if (page === 'payment') navigate('/payment');
                    }}
                />
            } 
        />

        {/* ⭐ 3. สร้างประตูทางเข้าหน้า Payment */}
        <Route 
            path="/payment" 
            element={
                <NexusGearPayment 
                    onNavigate={(page) => {
                        if (page === 'cart') navigate('/cart');
                        else if (page === 'home') navigate('/');
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