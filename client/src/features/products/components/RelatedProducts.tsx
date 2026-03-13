// ============================================================
// src/components/RelatedProducts.tsx
// ============================================================

import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../shared/types';

interface RelatedProductsProps {
  products: Product[];
}

function RelatedProducts({ products }: RelatedProductsProps) {
  const navigate = useNavigate();

  return (
    <div className="border-t border-white/10 pt-10">
      <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
        สินค้าที่คุณอาจจะชอบ{' '}
        <span
          onClick={() => navigate('/shop')}
          className="text-red-600 text-sm font-normal cursor-pointer hover:underline"
        >
          ดูทั้งหมด →
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              className="cursor-pointer group bg-[#18181b] border border-white/5 rounded-xl overflow-hidden hover:border-red-600/50 transition-all shadow-lg hover:shadow-red-900/10"
            >
              <div className="h-48 bg-white p-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -15%
                </div>
                <img
                  src={p.imageUrl || p.image_url || 'https://dummyimage.com/400x400/000/fff'}
                  alt={p.name}
                  className="max-h-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
                  onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/400x400/000/fff?text=NEXUS'; }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition">
                  {p.name}
                </h4>
                <p className="text-gray-500 text-xs mt-1 mb-2">
                  {typeof p.category === 'object' ? p.category?.name : p.category}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-red-500 font-bold">฿{Number(p.price).toLocaleString()}</p>
                  <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 text-white transition">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-4 text-center py-10">ไม่มีสินค้าแนะนำในหมวดนี้</p>
        )}
      </div>
    </div>
  );
}

export default RelatedProducts;
