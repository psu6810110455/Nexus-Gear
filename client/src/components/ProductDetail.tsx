import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number; // รองรับทั้ง string และ number
  stock: number;
  imageUrl?: string;
  image_url?: string;
  category?: { name: string };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ดึง ID จาก URL
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลสินค้า 1 ชิ้น ตาม ID
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-white text-center p-10">กำลังโหลดข้อมูลสินค้า...</div>;
  if (!product) return <div className="text-white text-center p-10">ไม่พบสินค้า</div>;

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans p-6 flex justify-center items-center">
      <div className="max-w-5xl w-full bg-[#18181b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* ส่วนรูปภาพ */}
        <div className="w-full md:w-1/2 bg-white p-10 flex items-center justify-center relative">
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 text-gray-500 hover:text-black font-bold flex items-center gap-2"
          >
            ← กลับหน้าร้านค้า
          </button>
          <img 
            src={product.imageUrl || product.image_url || 'https://placehold.co/600x400?text=No+Image'} 
            alt={product.name} 
            className="max-w-full max-h-[400px] object-contain drop-shadow-xl"
            onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400/png?text=Nexus+Gear'; 
            }}
          />
        </div>

        {/* ส่วนข้อมูล */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-2">
            <span className="bg-red-600/10 text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category?.name || 'GAMING GEAR'}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{product.name}</h1>
          
          <p className="text-gray-400 mb-8 leading-relaxed text-sm">
            {product.description || 'ไม่มีคำอธิบายสินค้า...'}
          </p>

          <div className="flex items-end justify-between border-t border-white/10 pt-6 mt-auto">
            <div>
              <p className="text-gray-500 text-xs mb-1">ราคา</p>
              <p className="text-4xl font-bold text-red-500">฿{Number(product.price).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs mb-2">
                สถานะ: {product.stock > 0 ? <span className="text-green-400">มีสินค้า ({product.stock})</span> : <span className="text-red-500">สินค้าหมด</span>}
              </p>
              <button 
                className={`px-8 py-3 rounded-xl font-bold transition shadow-lg ${
                  product.stock > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'ใส่ตะกร้าเลย 🛒' : 'สินค้าหมด'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;