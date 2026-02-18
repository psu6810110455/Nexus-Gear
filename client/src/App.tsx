import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/ProductList';   
import ProductDetail from './components/ProductDetail'; 
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}> 
      <Navbar /> 

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;