import { useState } from 'react';
import type { Product } from '../types/product.types';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onReset: () => void;
  onNavigate: (id: number) => void;
}

const PRODUCTS_PER_PAGE = 9;

const ProductGrid = ({ products, selectedCategory, onReset }: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allCategories');
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

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));

  // ถ้าเปลี่ยน category แล้วหน้าปัจจุบันเกินจำนวนหน้า ให้กลับไปหน้า 1
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  // ตัดสินค้ามาแสดงเฉพาะหน้าปัจจุบัน
  const startIdx = (safePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // สร้างปุ่มเลขหน้า
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section aria-label="รายการสินค้า" className="w-full md:w-3/4">

      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-red-600 block" aria-hidden="true" />
          {getCategoryLabel(selectedCategory)}
          <span className="text-gray-500 text-base font-normal ml-2">
            ({products.length} {t('piece')})
          </span>
        </h2>
      </header>

      {paginatedProducts.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
            {paginatedProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="การนำทางหน้า" className="flex items-center justify-center gap-2 mt-10 pb-4">
              <style>{`
                .pg-btn {
                  min-width:40px; height:40px; border-radius:8px; border:1px solid rgba(127,29,29,0.4);
                  background:rgba(0,0,0,0.6); color:rgba(255,255,255,0.5); font-family:'Orbitron',sans-serif;
                  font-size:0.75rem; font-weight:700; cursor:pointer; display:flex; align-items:center;
                  justify-content:center; transition:all 0.2s; letter-spacing:0.05em;
                }
                .pg-btn:hover:not(:disabled):not(.pg-active) {
                  border-color:#dc2626; color:#fff; background:rgba(220,38,38,0.12);
                }
                .pg-btn:disabled { opacity:0.3; cursor:not-allowed; }
                .pg-active {
                  background: linear-gradient(135deg,#dc2626,#991b1b) !important;
                  border-color:#dc2626 !important; color:#fff !important;
                  box-shadow:0 0 16px rgba(220,38,38,0.4);
                }
                .pg-dots { color:rgba(255,255,255,0.3); font-family:'Orbitron',sans-serif; font-size:0.75rem; padding:0 4px; }
              `}</style>

              <button
                className="pg-btn" disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)} aria-label={t('previous')}
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`dots-${idx}`} className="pg-dots">...</span>
                ) : (
                  <button
                    key={page}
                    className={`pg-btn ${page === safePage ? 'pg-active' : ''}`}
                    onClick={() => goToPage(page as number)}
                    aria-current={page === safePage ? 'page' : undefined}
                    aria-label={`${t('page')} ${page}`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="pg-btn" disabled={safePage === totalPages}
                onClick={() => goToPage(safePage + 1)} aria-label={t('next')}
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500" role="status">
          <p className="text-xl">{t('noProducts')}</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-4 text-red-500 underline hover:text-red-400"
          >
            {t('clearAndViewAll')}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
