import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  imageUrl?: string;
  image_url?: string;
  category?: { id: number; name: string } | string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase' && product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const renderStars = (rating: number = 5) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>★</span>
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const productRes = await axios.get(`http://localhost:3000/products/${id}`, { headers });
        const currentProduct = productRes.data;
        setProduct(currentProduct);

        const allProductsRes = await axios.get('http://localhost:3000/products', { headers });
        const related = allProductsRes.data.filter((p: Product) => {
           const catName1 = typeof p.category === 'object' ? p.category?.name : p.category;
           const catName2 = typeof currentProduct.category === 'object' ? currentProduct.category?.name : currentProduct.category;
           return catName1 === catName2 && p.id !== currentProduct.id;
        }).slice(0, 4);

        setRelatedProducts(related);
        setLoading(false);
        setQuantity(1);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // ✨ แยกฟังก์ชันยิง API ออกมา เพื่อให้ใช้ร่วมกันได้โดยที่ Alert ไม่ตีกัน
  const addToCartAPI = async () => {
    await axios.post('http://localhost:3000/api/cart/add', {
      userId: 1, 
      productId: product!.id,
      quantity: quantity
    });
  };

  // 🛒 ฟังก์ชันสำหรับกดปุ่ม "ใส่ตะกร้า" (มี Alert แจ้งเตือน)
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCartAPI();
      alert('✅ เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!');
    } catch (error) {
      console.error("❌ ไม่สามารถเพิ่มสินค้าลงตะกร้าได้:", error);
      alert('เกิดข้อผิดพลาด ไม่สามารถเพิ่มสินค้าลงตะกร้าได้ครับ');
    }
  };

  // ⚡ ฟังก์ชันสำหรับกดปุ่ม "ซื้อเลย" (ไม่มี Alert เด้งไปตะกร้าเลยแบบสมูทๆ)
  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCartAPI(); 
      navigate('/cart'); // วาร์ปไปหน้าตะกร้าทันที
    } catch (error) {
      console.error("❌ ไม่สามารถดำเนินการได้:", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">กำลังโหลด...</div>;
  if (!product) return <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-white">ไม่พบสินค้า</div>;

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans pb-20">
      <div className="container mx-auto px-4 mt-6 max-w-6xl">
        <div className="mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold transition group"
            >
                <span className="group-hover:-translate-x-1 transition">←</span> กลับหน้ารายการสินค้า
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mb-16">
            <div className="w-full md:w-3/5 bg-white rounded-xl overflow-hidden p-8 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)] min-h-[400px]">
                <img 
                    src={product.imageUrl || product.image_url || 'https://dummyimage.com/600x400/000/fff?text=No+Image'} 
                    alt={product.name} 
                    className="max-h-[350px] w-auto object-contain hover:scale-105 transition duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/600x400/000/fff?text=Nexus+Gear'; }}
                />
                 <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg">New Arrival</span>
            </div>

            <div className="w-full md:w-2/5 flex flex-col">
                <div className="mb-2">
                    <span className="text-red-500 text-xs font-bold tracking-widest uppercase border border-red-500/30 px-2 py-1 rounded">
                        {typeof product.category === 'object' ? product.category?.name : product.category || 'GAMING GEAR'}
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
                        <p className="text-gray-500 line-through mb-1 text-lg">฿{Number(Number(product.price) * 1.2).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mb-8 bg-[#18181b] p-4 rounded-xl border border-white/5">
                     <p className="text-sm text-gray-400 mb-3 flex justify-between">
                        <span>จำนวน</span>
                        <span className="text-xs text-gray-500">มีสินค้า {product.stock} ชิ้น</span>
                     </p>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center bg-black border border-white/20 rounded-lg">
                            <button onClick={() => handleQuantityChange('decrease')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xl rounded-l-lg">−</button>
                            <input type="text" value={quantity} readOnly className="w-12 text-center bg-transparent text-white font-bold outline-none" />
                            <button onClick={() => handleQuantityChange('increase')} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition text-xl rounded-r-lg">+</button>
                        </div>
                     </div>
                </div>

                <div className="flex gap-4 mt-auto">
                    <button onClick={handleAddToCart} className="flex-1 bg-[#18181b] border border-white/20 hover:bg-white hover:text-black text-white py-3.5 rounded-lg font-bold transition flex items-center justify-center gap-2 group">
                        <span className="group-hover:scale-110 transition">🛒</span> ใส่ตะกร้า
                    </button>
                    <button onClick={handleBuyNow} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-900/40 transition transform active:scale-95">
                        ซื้อเลย
                    </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-3 flex items-center gap-2">อุปกรณ์ภายในกล่อง 📦</p>
                    <div className="flex gap-3 opacity-60">
                         <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center text-[8px] gap-1">
                            <span>📄</span><span>Manual</span>
                         </div>
                         <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center text-[8px] gap-1">
                            <span>🔌</span><span>Cable</span>
                         </div>
                         <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center text-[8px] gap-1">
                            <span>🛡️</span><span>Warranty</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-red-600 rounded-full block"></span> รายละเอียดสินค้า
            </h3>
            <div className="bg-[#18181b] p-8 rounded-2xl border border-white/5 text-gray-300 leading-relaxed shadow-lg">
                <p className="text-xl font-semibold text-white mb-6">{product.name}</p>
                <p className="mb-6 text-gray-400">{product.description || "สัมผัสประสบการณ์การเล่นเกมที่เหนือกว่าด้วยอุปกรณ์ Gaming Gear ระดับโปร..."}</p>
                
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
                            <li className="flex justify-between"><span>Warranty:</span> <span className="text-white">2 Years</span></li>
                            <li className="flex justify-between"><span>Weight:</span> <span className="text-white">350g</span></li>
                            <li className="flex justify-between"><span>Color:</span> <span className="text-white">Black / Red</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
