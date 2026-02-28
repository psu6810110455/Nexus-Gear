// ============================================================
// src/components/ProductCard.tsx
// Card สินค้าใช้ร่วมกันใน HomePage และ ProductList
// ============================================================

import { type Product } from '../../../shared/types/index';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  variant?: 'home' | 'shop'; // home = สีขาว, shop = สีดำ
}

function ProductCard({ product, onClick, variant = 'home' }: ProductCardProps) {
  const imageUrl =
    (product.imageUrl || product.image_url || 'https://placehold.co/150x150?text=No+Image');

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name ?? 'General'
      : product.category ?? 'General';

  if (variant === 'shop') {
    return (
      <div
        onClick={onClick}
        className="bg-[#18181b] rounded-xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-red-900/10 flex flex-col h-full"
      >
        <div className="h-[220px] bg-white p-6 relative flex items-center justify-center overflow-hidden">
          <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            HOT
          </div>
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/png?text=Nexus'; }}
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <p className="text-gray-500 text-xs mb-1">{categoryName}</p>
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-500 transition">
            {product.name}
          </h3>
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <div>
              <p className="text-xs text-gray-500">ราคา</p>
              <p className="text-xl font-bold text-red-500">฿{Number(product.price).toLocaleString()}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-lg shadow-red-900/20 active:scale-95"
            >
              ดูรายละเอียด
            </button>
          </div>
        </div>
      </div>
    );
  }

  // variant === 'home'
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="w-full aspect-square flex items-center justify-center mb-3">
        <img
          src={imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150?text=No+Image'; }}
        />
      </div>
      <div className="text-center">
        <p className="text-gray-800 font-bold text-sm mb-1 group-hover:text-red-600 transition truncate w-32">
          {product.name}
        </p>
        <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">
          ฿{Number(product.price).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default ProductCard;