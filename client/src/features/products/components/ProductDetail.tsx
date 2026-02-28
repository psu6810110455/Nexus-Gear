// ============================================================
// src/components/ProductDetail.tsx
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../../../shared/services/api';
import type { Product } from '../../../shared/types';
import RelatedProducts from './RelatedProducts';
import ReviewList from './ReviewList';

function renderStars(rating: number = 5) {
  return [...Array(5)].map((_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
  ));
}

function ProductDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct]                 = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [quantity, setQuantity]               = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const current = await getProductById(Number(id));
        setProduct(current);

        const all     = await getProducts();
        const catName = typeof current.category === 'object'
          ? current.category?.name
          : current.category;

        const related = all
          .filter((p) => {
            const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
            return pCat === catName && p.id !== current.id;
          })
          .slice(0, 4);

        setRelatedProducts(related);
        setQuantity(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'decrease' && quantity > 1) setQuantity((q) => q - 1);
    if (type === 'increase' && product && quantity < (product.stock ?? Infinity))
      setQuantity((q) => q + 1);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">
      กำลังโหลด...
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">
      ไม่พบสินค้า
    </div>
  );

  const imageUrl     = product.imageUrl || product.image_url || 'https://placehold.co/600x400?text=No+Image';
  const categoryName = typeof product.category === 'object'
    ? product.category?.name ?? 'GAMING GEAR'
    : product.category ?? 'GAMING GEAR';

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans pb-20">
      <div className="container mx-auto px-4 mt-6 max-w-6xl">

        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold transition group"
          >
            <span className="group-hover:-translate-x-1 transition">←</span>
            กลับหน้ารายการสินค้า
          </button>
        </div>

        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-12 mb-16">

          {/* Image */}
          <div className="w-full md:w-3/5 bg-white rounded-xl overflow-hidden p-8 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)] min-h-100">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-87.5 w-auto object-contain hover:scale-105 transition duration-500"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/png?text=Nexus+Gear'; }}
            />
            <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">
              New Arrival
            </span>
          </div>

          {/* Info */}
          <div className="w-full md:w-2/5 flex flex-col">

            <div className="mb-2">
              <span className="text-red-500 text-xs font-bold tracking-widest uppercase border border-red-500/30 px-2 py-1 rounded">
                {categoryName}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 text-sm mb-6 pb-6 border-b border-white/10">
              <div className="flex text-yellow-500 text-lg">{renderStars(4)}</div>
              <span className="text-gray-400">(4.0 Reviews)</span>
              <span className="text-gray-600">|</span>
              <span className="text-green-400">ขายแล้ว 1.2k ชิ้น</span>
            </div>

            <div className="mb-8">
              <p className="text-gray-400 text-sm mb-1">ราคาพิเศษ</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold text-red-500">฿{Number(product.price).toLocaleString()}</p>
                <p className="text-gray-500 line-through mb-1 text-lg">
                  ฿{Math.round(Number(product.price) * 1.2).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mb-8 bg-[#18181b] p-4 rounded-xl border border-white/5">
              <p className="text-sm text-gray-400 mb-3 flex justify-between">
                <span>จำนวน</span>
                <span className="text-xs text-gray-500">มีสินค้า {product.stock} ชิ้น</span>
              </p>
              <div className="flex items-center bg-black border border-white/20 rounded-lg w-fit">
                <button onClick={() => handleQuantityChange('decrease')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xl rounded-l-lg">−</button>
                <input type="text" value={quantity} readOnly className="w-12 text-center bg-transparent text-white font-bold outline-none" />
                <button onClick={() => handleQuantityChange('increase')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xl rounded-r-lg">+</button>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button className="flex-1 bg-[#18181b] border border-white/20 hover:bg-white hover:text-black text-white py-3.5 rounded-lg font-bold transition flex items-center justify-center gap-2 group">
                <span className="group-hover:scale-110 transition">🛒</span> ใส่ตะกร้า
              </button>
              <button className="flex-1 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-900/40 transition active:scale-95">
                ซื้อเลย
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase font-bold mb-3">อุปกรณ์ภายในกล่อง 📦</p>
              <div className="flex gap-3 opacity-60">
                {[{ icon: '📄', label: 'Manual' }, { icon: '🔌', label: 'Cable' }, { icon: '🛡️', label: 'Warranty' }].map((item) => (
                  <div key={item.label} className="w-12 h-12 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center text-[8px] gap-1">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-red-600 rounded-full block" />
            รายละเอียดสินค้า
          </h3>
          <div className="bg-[#18181b] p-8 rounded-2xl border border-white/5 text-gray-300 leading-relaxed shadow-lg">
            <p className="text-xl font-semibold text-white mb-6">{product.name}</p>
            <p className="mb-6 text-gray-400">
              {product.description || 'สัมผัสประสบการณ์การเล่นเกมที่เหนือกว่าด้วยอุปกรณ์ Gaming Gear ระดับโปร...'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                <h4 className="text-white font-bold mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                  <li>การเชื่อมต่อความเร็วสูง (Low Latency)</li>
                  <li>วัสดุพรีเมียม ทนทานพิเศษ</li>
                  <li>RGB Lighting ปรับแต่งได้ 16.8 ล้านสี</li>
                </ul>
              </div>
              <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                <h4 className="text-white font-bold mb-2">Technical Specs</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {[['Warranty', '2 Years'], ['Weight', '350g'], ['Color', 'Black / Red']].map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span>{k}:</span><span className="text-white">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ReviewList />
        <RelatedProducts products={relatedProducts} />

      </div>
    </div>
  );
}

export default ProductDetail;