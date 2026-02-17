import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 1. อย่าลืมบรรทัดนี้!
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. ต้องมี BrowserRouter ครอบ App ไว้แบบนี้ครับ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)