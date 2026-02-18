import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';  
import ProductDetail from './components/ProductDetail'; 

function App() {
  return (
    <Routes>
      {/* 1. หน้าแรก (Home) */}
      <Route path="/" element={<HomePage />} />
      
      {/* 2. หน้ารวมสินค้า (กดปุ่ม "ดูสินค้า" จาก Home มาที่นี่) */}
      <Route path="/shop" element={<ProductList />} />
      
      {/* 3. หน้ารายละเอียดสินค้า (กดที่รูปสินค้า มาที่นี่) */}
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* กันหลง: ถ้าพิมพ์ URL มั่ว ให้กลับมาหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;