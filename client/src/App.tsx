import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import Navbar from './features/navigation/components/Navbar';
import HomePage from './features/home/pages/HomePage';
import ProductListPage from './features/products/pages/ProductListPage';
import ProductDetail from './features/products/components/ProductDetail';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import AdminPage from './features/admin/pages/AdminPage';
import './App.css';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import LoginSuccess from './features/auth/pages/LoginSuccess';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/shop"          element={<ProductListPage />} />
        <Route path="/products/:id"  element={<ProductDetail />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/admin"         element={<AdminPage />} />
        <Route path="/profile"       element={<ProfilePage />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="*"              element={<Navigate to="/" replace />} />

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