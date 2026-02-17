import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register'; // <-- เช็คว่า import ถูก path

function App() {
  return (
    // ใส่สีตัวอักษรสีขาว (text-white) หรือ style เพื่อให้มองเห็นบนพื้นดำ
    <div style={{ color: 'white', padding: '20px' }}>
      <Routes>
        <Route path="/" element={<h1>หน้าแรก (Home Page)</h1>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App