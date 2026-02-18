import { useEffect, useState } from 'react'
import axios from 'axios'
// ✅ [NEW] เพิ่ม Import เครื่องมือวาดกราฟ Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css'

// 1. สร้าง Type ให้ตรงกับข้อมูลที่ส่งมาจาก Backend
interface CartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  total_price: string;
}

// ✅ [NEW] สร้าง Type สำหรับข้อมูลกราฟยอดขาย
interface SalesData {
  name: string;
  sales: number;
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([]) // ✅ [NEW] State เก็บข้อมูลกราฟ
  const [loading, setLoading] = useState(true)

  // ✅ [UPDATE] เปลี่ยนชื่อฟังก์ชันเป็น fetchData เพื่อดึงข้อมูลทั้ง 2 ส่วนพร้อมกัน
  const fetchData = async () => {
    try {
      // 1. ดึงข้อมูลตะกร้า (ของเดิม)
      const resCart = await axios.get('http://localhost:3000/cart')
      setCartItems(resCart.data)

      // ✅ [NEW] 2. ดึงข้อมูลกราฟยอดขาย (เพิ่มใหม่)
      const resSales = await axios.get('http://localhost:3000/sales-data')
      setSalesData(resSales.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  // เรียกใช้ตอนเปิดเว็บครั้งแรก
  useEffect(() => {
    fetchData()
  }, [])

  // ✅ ฟังก์ชันเพิ่มสินค้าจำลอง (Add to Cart Simulation)
  const handleAddToCart = async () => {
    try {
      // ลองเพิ่มสินค้า ID 5 จำนวน 1 ชิ้น
      await axios.post('http://localhost:3000/cart/add', {
        productId: 5, 
        quantity: 1
      })
      alert("เพิ่มสินค้าเรียบร้อย!")
      fetchData() // ดึงข้อมูลใหม่มาโชว์ทันที
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาด")
    }
  }

  // ✅ ฟังก์ชันลบสินค้า (Delete)
  const handleRemove = async (id: number) => {
    if(!confirm("ต้องการลบสินค้านี้ใช่ไหม?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`)
      fetchData() // ดึงข้อมูลใหม่หลังลบเสร็จ
    } catch (error) {
      console.error(error)
      alert("ลบไม่ได้")
    }
  }

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🚀 Nexus Gear Dashboard (React + NestJS)</h1>

      {/* ✅ [NEW] ส่วนแสดงกราฟยอดขาย */}
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        marginBottom: '30px' 
      }}>
        <h2>📊 สรุปยอดขายรายเดือน</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="ยอดขาย (บาท)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <hr style={{ margin: '30px 0' }} />
      
      {/* ส่วนตะกร้าสินค้าเดิม */}
      <h2 style={{ textAlign: 'left' }}>🛒 ตะกร้าสินค้าของฉัน</h2>

      {/* ปุ่มจำลองการเพิ่มสินค้า */}
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <button onClick={handleAddToCart} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          + ลองกดเพิ่มสินค้า (Test Add)
        </button>
      </div>

      {loading ? <p>กำลังโหลด...</p> : (
        <div>
          {cartItems.length === 0 ? <p>ไม่มีสินค้าในตะกร้า</p> : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {cartItems.map((item) => (
                <div key={item.cart_item_id} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  padding: '15px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9f9f9'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <h3>{item.name}</h3>
                    <p>ราคาต่อชิ้น: {item.price} บาท</p>
                    <p>จำนวน: <b>{item.quantity}</b> ชิ้น</p>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                      รวม: {parseFloat(item.total_price).toLocaleString()} บาท
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.cart_item_id)} 
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    ลบสินค้า 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App