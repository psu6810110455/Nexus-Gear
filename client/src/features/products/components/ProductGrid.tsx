import type { Product } from '../types/product.types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onReset: () => void;
  onNavigate: (id: number) => void; 
}

const ProductGrid = ({ products, selectedCategory, onReset }: ProductGridProps) => {
  return (
    <section aria-label="รายการสินค้า" className="w-full md:w-3/4">

      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-red-600 block" aria-hidden="true" />
          {selectedCategory === 'All' ? 'สินค้าทั้งหมด' : selectedCategory}
          <span className="text-gray-500 text-base font-normal ml-2">
            ({products.length} รายการ)
          </span>
        </h2>
      </header>

      {products.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-20 text-gray-500" role="status">
          <p className="text-xl">ไม่พบสินค้าในหมวดหมู่นี้</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-4 text-red-500 underline hover:text-red-400"
          >
            ล้างตัวกรองและดูสินค้าทั้งหมด
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;