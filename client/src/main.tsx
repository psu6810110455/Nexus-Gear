import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // <--- ชี้ไปที่ App.tsx
import './index.css'        // <--- สำคัญมาก

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)