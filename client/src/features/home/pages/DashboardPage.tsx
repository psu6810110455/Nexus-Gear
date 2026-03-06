// ============================================================
// src/pages/DashboardPage.tsx
// แยก Dashboard UI ออกจาก App.tsx
// ============================================================

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getCart, addToCart, removeFromCart, getSalesData } from '../../../shared/services/api';
import type { CartItem, SalesData } from '../../../shared/types';

import { toast } from 'sonner';

function DashboardPage() {
  const [cartItems, setCartItems]  = useState<CartItem[]>([]);
  const [salesData, setSalesData]  = useState<SalesData[]>([]);
  const [loading, setLoading]      = useState(true);

  const fetchData = async () => {
    try {
      const [cart, sales] = await Promise.all([getCart(), getSalesData()]);
      setCartItems(cart);
      setSalesData(sales);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddToCart = async () => {
    try {
      await addToCart(5, 1);
      toast.success('เพิ่มสินค้าเรียบร้อย!');
      fetchData();
    } catch {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const handleRemove = async (id: number) => {
    if (!confirm('ต้องการลบสินค้านี้ใช่ไหม?')) return;
    try {
      await removeFromCart(id);
      fetchData();
    } catch {
      toast.error('ลบไม่ได้');
    }
  };

  return (
    <div className="dashboard-page">
      <h1>🚀 Nexus Gear Dashboard</h1>

      {/* Sales Chart */}
      <section className="dashboard-chart-card">
        <h2>📊 สรุปยอดขายรายเดือน</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="var(--color-primary)" name="ยอดขาย (บาท)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <hr className="dashboard-divider" />

      {/* Cart Section */}
      <h2>🛒 ตะกร้าสินค้าของฉัน</h2>
      <div className="dashboard-add-btn-wrap">
        <button onClick={handleAddToCart} className="btn-add-cart">
          + ลองกดเพิ่มสินค้า (Test Add)
        </button>
      </div>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : cartItems.length === 0 ? (
        <p>ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className="cart-item-card">
              <div>
                <h3>{item.name}</h3>
                <p>ราคาต่อชิ้น: {item.price} บาท</p>
                <p>จำนวน: <b>{item.quantity}</b> ชิ้น</p>
                <p className="cart-item-total">
                  รวม: {parseFloat(item.total_price).toLocaleString()} บาท
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.cart_item_id)}
                className="btn-remove-cart"
              >
                ลบสินค้า 🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;