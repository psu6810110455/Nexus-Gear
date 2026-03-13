import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import PrivateRoute from './features/auth/components/PrivateRoute';
import AdminRoute from './features/auth/components/AdminRoute';

import Navbar from './features/navigation/components/Navbar';
import Footer from './features/navigation/components/Footer';
import HomePage from './features/home/pages/HomePage';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AdminPage from './features/admin/pages/AdminPage';
import NexusGearAdminOrders from './features/admin/pages/NexusGearAdminOrders';
import AdminStockPage from './features/admin/pages/AdminStockPage';
import NexusGearOrderStatus from './features/orders/pages/NexusGearOrderStatus';
import ProductList from './features/products/pages/ProductListPage';
import ProductDetailPage from './features/products/pages/ProductDetailPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import CartPage from './features/cart/pages/CartPage';
import PaymentPage from './features/payment/pages/PaymentPage';

import './App.css';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import LoginSuccess from './features/auth/pages/LoginSuccess';
import ForgotPassword from './features/profile/pages/ForgotPassword';
import ResetPassword from './features/profile/pages/ResetPassword';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--clr-bg-dark, #0a0a0a)' }}>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Login required ── */}
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
        <Route path="/my-orders" element={
          <PrivateRoute><NexusGearOrderStatus /></PrivateRoute>
        } />
        <Route path="/cart" element={
          <PrivateRoute>
            <CartPage onNavigate={(page) => {
              if (page === 'home') navigate('/');
              else if (page === 'products') navigate('/shop');
              else if (page === 'profile') navigate('/profile');
              else if (page === 'payment') navigate('/payment');
            }} />
          </PrivateRoute>
        } />
        <Route path="/payment" element={
          <PrivateRoute>
            <PaymentPage onNavigate={(page) => {
              if (page === 'cart') navigate('/cart');
              else if (page === 'home') navigate('/');
            }} />
          </PrivateRoute>
        } />

        {/* ── Admin only ── */}
        <Route path="/admin" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><NexusGearAdminOrders /></AdminRoute>
        } />
        <Route path="/admin/stock" element={
          <AdminRoute><AdminStockPage /></AdminRoute>
        } />
        <Route path="/dashboard" element={
          <AdminRoute>
            <DashboardPage onNavigate={(page) => {
              if (page === 'home') navigate('/admin');
            }} />
          </AdminRoute>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideNavbar && <Footer />}
    </div>
  );
}

import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" toastOptions={{ duration: 2000 }} visibleToasts={1} />
      <AppContent />
    </AuthProvider>
  );
}

export default App;//Test1
