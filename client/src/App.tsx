import { useEffect, useState } from 'react'
import axios from 'axios'
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

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ ฟังก์ชันดึงข้อมูลตะกร้า (Get Cart)
  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:3000/cart')
      setCartItems(res.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching cart:", error)
      setLoading(false)
    }
  }

  // เรียกใช้ตอนเปิดเว็บครั้งแรก
  useEffect(() => {
    fetchCart()
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
      fetchCart() // ดึงข้อมูลใหม่มาโชว์ทันที
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
      fetchCart() // ดึงข้อมูลใหม่หลังลบเสร็จ
    } catch (error) {
      console.error(error)
      alert("ลบไม่ได้")
    }
  }

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>🛒 ตะกร้าสินค้าของฉัน (React + NestJS)</h1>
      
      {/* ปุ่มจำลองการเพิ่มสินค้า */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleAddToCart} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
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
                  <div>
                    <h3>{item.name}</h3>
                    <p>ราคาต่อชิ้น: {item.price} บาท</p>
                    <p>จำนวน: <b>{item.quantity}</b> ชิ้น</p>
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                      รวม: {parseFloat(item.total_price).toLocaleString()} บาท
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.cart_item_id)} 
                    style={{ background: 'red', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
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