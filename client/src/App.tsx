import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail'; // Import เข้ามา

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรก: แสดงรายการสินค้า */}
        <Route path="/" element={<ProductList />} />
        
        {/* หน้าดูรายละเอียด: รับ id มาโชว์ */}
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;