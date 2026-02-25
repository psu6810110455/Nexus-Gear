import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import NexusGearAdminDashboard from './pages/NexusGearAdminDashboard'; 
import './App.css'

function AppContent() {
  const location = useLocation();
  // เช็คว่าถ้าเป็นหน้า /admin หรือ /dashboard ให้ซ่อน Navbar
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

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

        {/* เรียกหน้า NexusGearAdminDashboard ของเรา */}
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