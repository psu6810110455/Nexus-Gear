import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';   
import ProductDetail from './components/ProductDetail'; 
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}> 
      <Routes>
        {/* 1. หน้าแรก (ใช้ HomePage ที่ทำไว้สวยๆ แทน h1 ธรรมดา) */}
        <Route path="/" element={<HomePage />} />
        
        {/* 2. โซนสินค้า */}
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* 3. โซนสมาชิก (Auth) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 4. กันหลง: ถ้าพิมพ์ URL มั่ว ให้เด้งกลับหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;