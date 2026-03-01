import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import NexusGearAdminDashboard from './features/dashboard/pages/DashboardPage'; 
import NexusGearCart from './features/cart/pages/CartPage'; 
import NexusGearPayment from './features/payment/pages/PaymentPage'; 
import './App.css'

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/dashboard') || 
                     location.pathname.startsWith('/cart') ||
                     location.pathname.startsWith('/payment');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
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
                    setActiveTab={(tab: string) => console.log('เปลี่ยนไปหน้า:', tab)} 
                />
            } 
        />

        <Route 
            path="/cart" 
            element={
                <NexusGearCart 
                    onNavigate={(page: string) => {
                        if (page === 'home') navigate('/');
                        else if (page === 'products') navigate('/shop');
                        else if (page === 'profile') navigate('/login');
                        else if (page === 'payment') navigate('/payment');
                    }}
                />
            } 
        />

        <Route 
            path="/payment" 
            element={
                <NexusGearPayment 
                    onNavigate={(page: string) => {
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