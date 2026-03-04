import { useState, useCallback, useRef } from 'react';
import type { ProductFilterParams } from '../types/product.types';
import { useProducts } from '../hooks/useProducts';
import ProductFilter from '../components/ProductFilter';
import ProductGrid from '../components/ProductGrid';
import { Search, AlertTriangle } from 'lucide-react';
import { productListStyles }   from '../../../styles/productList.styles';

const DEFAULT_FILTERS: ProductFilterParams = { search: '', category: 'All' };

const ProductListPage = () => {
  const [filters, setFilters] = useState<ProductFilterParams>(DEFAULT_FILTERS);
  const { products, loading, error, categories, categoryCounts, refetch } = useProducts();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFilterChange = useCallback((newFilters: ProductFilterParams) => {
    setFilters(newFilters);
    if (newFilters.search !== filters.search) {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => { refetch(newFilters); }, 400);
    } else {
      refetch(newFilters);
    }
  }, [refetch, filters.search]);

  const handleReset = useCallback(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setFilters(DEFAULT_FILTERS);
    refetch(DEFAULT_FILTERS);
  }, [refetch]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }} role="status">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(220,38,38,0.2)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--color-primary)' }}>LOADING GEAR...</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }} role="alert">
      <div style={{ width: 72, height: 72, borderRadius: '16px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
        <AlertTriangle size={36} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}>SYSTEM ERROR</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{error}</p>
      </div>
      <button type="button" onClick={() => refetch(filters)}
        style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '12px 36px', borderRadius: '6px', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.15em', cursor: 'pointer' }}>
        RETRY CONNECTION
      </button>
    </div>
  );

  return (
    <main style={{ width: '100%', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: "'Kanit', sans-serif", paddingBottom: '5rem' }}>
      {/* ── Inject styles from productList.styles.ts ── */}
      <style>{productListStyles}</style>

      <div className="pl-hero">
        <h1 className="pl-hero-title">NEXUS GEAR</h1>
        <p className="pl-hero-sub">Explore Our Premium Arsenal</p>
        <div className="pl-search-wrap" role="search">
          <div className="pl-search-icon"><Search size={20} /></div>
          <label htmlFor="product-search" className="sr-only">ค้นหาสินค้า</label>
          <input id="product-search" type="text" className="pl-search-input"
            placeholder="ค้นหาอุปกรณ์เทพของคุณ..."
            value={filters.search ?? ''}
            onChange={e => handleFilterChange({ ...filters, search: e.target.value })} />
        </div>
      </div>

      <div className="pl-body">
        <ProductFilter categories={categories} categoryCounts={categoryCounts} filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        <ProductGrid products={products} selectedCategory={filters.category ?? 'All'} onReset={handleReset} />
      </div>
    </main>
  );
};

export default ProductListPage;