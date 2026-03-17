// ============================================================
// src/features/products/components/ProductCard.tsx
// Card สินค้าใช้ร่วมกันใน HomePage และ ProductList
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../../shared/types/index';
import { getCategoryName } from '../services/product.service';
import { getServerUrl } from '../../../shared/services/api';
import { useLanguage } from '../../../shared/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  variant?: 'home' | 'shop'; // home = สีขาว, shop = สีดำ
}

function ProductCard({ product, onClick, variant = 'shop' }: ProductCardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categoryName = getCategoryName(product);
  const getCategoryLabel = (cat: string) => {
    const keyMap: Record<string, any> = {
      'Keyboard': 'keyboards',
      'Mouse': 'mice',
      'Headset': 'headsets',
      'Chair': 'chairs',
      'Monitor': 'monitors',
      'Mousepad': 'mousepads',
      'Accessories': 'accessories',
      'Gaming Gear': 'gamingGear'
    };
    const key = keyMap[cat];
    return key ? t(key) : cat;
  };

  const imagesList = product.images && product.images.length > 0 
    ? product.images.map(img => getServerUrl(img.imageUrl))
    : [product.imageUrl ?? product.image_url ?? 'https://dummyimage.com/400x400/000/fff'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && imagesList.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
      }, 2500); 
    }
    return () => clearInterval(interval);
  }, [isHovered, imagesList.length]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const goToDetail = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  // ─── variant: shop ───────────────────────────────────────
  if (variant === 'shop') {
    return (
      <article
        onClick={goToDetail}
        aria-label={`สินค้า ${product.name}`}
        className="bg-[#18181b] rounded-xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-red-900/10 flex flex-col h-full"
      >
        <figure 
          className="h-[220px] bg-white p-6 relative flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
        >
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-20">
            HOT
          </span>
          <img
            src={imagesList[currentImageIndex]}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
            onError={(e) => {
              e.currentTarget.src = 'https://dummyimage.com/400x400/000/fff?text=Nexus';
            }}
          />
          <div
            className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
            aria-hidden="true"
          />

          {imagesList.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 hover:scale-110"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 hover:scale-110"
              >
                <ChevronRight size={16} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition">
                {imagesList.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-red-600 scale-125' : 'bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </figure>

        <div className="p-5 flex flex-col flex-grow">
          <p className="text-gray-500 text-xs mb-1">{getCategoryLabel(categoryName)}</p>

          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-500 transition">
            {product.name}
          </h3>

          <footer className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
            <div>
              <p className="text-xs text-gray-500">{t('priceLabel')}</p>
              <p className="text-xl font-bold text-red-500">
                ฿{Number(product.price).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToDetail();
              }}
              aria-label={`${t('viewDetails')} ${product.name}`}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-lg shadow-red-900/20 active:scale-95"
            >
              {t('viewDetails')}
            </button>
          </footer>
        </div>
      </article>
    );
  }

  // ─── variant: home ───────────────────────────────────────
  return (
    <div
      onClick={goToDetail}
      className="group cursor-pointer flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
    >
      <div 
        className="w-full aspect-square flex items-center justify-center mb-3 relative overflow-hidden rounded-xl bg-white p-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
      >
        <img
          src={imagesList[currentImageIndex]}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
          onError={(e) => {
            e.currentTarget.src = 'https://dummyimage.com/150x150/000/fff?text=No+Image';
          }}
        />
        {imagesList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition">
            {imagesList.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-1 h-1 rounded-full ${idx === currentImageIndex ? 'bg-red-600' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        )}
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
