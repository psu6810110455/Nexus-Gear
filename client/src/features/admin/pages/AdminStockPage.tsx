// ============================================================
// src/features/admin/pages/AdminStockPage.tsx
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { Search, AlertTriangle, CheckCircle, Package, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { getProducts, updateProduct } from '../../../shared/services/api';
import type { Product, Category } from '../../../shared/types';
import AdminLayout from '../../navigation/components/AdminLayout';

type StockStatus = 'all' | 'out' | 'low' | 'ok';

const AdminStockPage = () => {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState<StockStatus>('all');
  const [editing, setEditing]     = useState<Record<number, string>>({});
  const [saving, setSaving]       = useState<number | null>(null);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await getProducts());
    } catch {
      showToast('โหลดข้อมูลไม่สำเร็จ', false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSaveStock = async (product: Product) => {
    const newStock = Number(editing[product.id]);
    if (isNaN(newStock) || newStock < 0) return showToast('กรุณากรอกจำนวนที่ถูกต้อง', false);
    setSaving(product.id);
    try {
      await updateProduct(product.id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => p.id === product.id ? { ...p, stock: newStock } : p),
      );
      setEditing((prev) => { const n = { ...prev }; delete n[product.id]; return n; });
      showToast(`อัปเดตสต็อก "${product.name}" สำเร็จ`, true);
    } catch {
      showToast('บันทึกไม่สำเร็จ', false);
    } finally {
      setSaving(null);
    }
  };

  const getCategoryName = (p: Product) =>
    typeof p.category === 'object' ? (p.category as Category)?.name ?? '—' : p.category ?? '—';

  const getStockStatus = (stock: number) => {
    if (stock === 0)  return 'out';
    if (stock < 10)   return 'low';
    return 'ok';
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const st = getStockStatus(p.stock ?? 0);
    const matchFilter = filter === 'all' || st === filter;
    return matchSearch && matchFilter;
  });

  const totalOut  = products.filter((p) => (p.stock ?? 0) === 0).length;
  const totalLow  = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10).length;
  const totalOk   = products.filter((p) => (p.stock ?? 0) >= 10).length;

  const FILTER_TABS: { value: StockStatus; label: string; count: number; color: string }[] = [
    { value: 'all', label: 'ทั้งหมด',     count: products.length, color: 'text-[#F2F4F6]/60' },
    { value: 'out', label: 'หมดสต็อก',    count: totalOut,        color: 'text-red-400' },
    { value: 'low', label: 'สต็อกต่ำ',    count: totalLow,        color: 'text-yellow-400' },
    { value: 'ok',  label: 'ปกติ',        count: totalOk,         color: 'text-green-400' },
  ];

  return (
    <AdminLayout breadcrumb="จัดการสต็อก">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right duration-300 font-['Kanit'] ${
          toast.ok
            ? 'bg-black border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            : 'bg-black border-[#FF0000] text-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.4)]'
        }`}>
          {toast.ok ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] tracking-widest uppercase">
            STOCK
          </h1>
          <p className="text-[#F2F4F6]/40 text-sm mt-1 font-['Kanit']">
            ตรวจสอบและอัปเดตจำนวนสต็อกสินค้า
          </p>
        </div>
        <div className="relative w-full xl:w-96 group shrink-0">
          <div className="absolute inset-0 bg-[#FF0000]/10 blur-lg rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F2F4F6]/30 group-focus-within:text-[#FF0000] transition-colors z-10" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#150000] border border-[#990000]/30 text-[#F2F4F6] text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FF0000]/50 focus:ring-1 focus:ring-[#FF0000]/30 transition-all placeholder-[#F2F4F6]/20 font-['Kanit'] relative z-10"
          />
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#000000]/60 border border-red-900/30 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
            <Package size={24} className="text-red-400" />
          </div>
          <div>
            <p className="text-[#F2F4F6]/40 text-xs font-['Kanit'] uppercase tracking-wider">หมดสต็อก</p>
            <p className="text-3xl font-['Orbitron'] font-bold text-red-400">{totalOut}</p>
          </div>
        </div>
        <div className="bg-[#000000]/60 border border-yellow-900/30 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
          <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center">
            <TrendingDown size={24} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-[#F2F4F6]/40 text-xs font-['Kanit'] uppercase tracking-wider">สต็อกต่ำ (&lt;10)</p>
            <p className="text-3xl font-['Orbitron'] font-bold text-yellow-400">{totalLow}</p>
          </div>
        </div>
        <div className="bg-[#000000]/60 border border-green-900/30 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md">
          <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} className="text-green-400" />
          </div>
          <div>
            <p className="text-[#F2F4F6]/40 text-xs font-['Kanit'] uppercase tracking-wider">สต็อกปกติ</p>
            <p className="text-3xl font-['Orbitron'] font-bold text-green-400">{totalOk}</p>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="bg-[#000000]/60 border border-[#990000]/30 rounded-2xl px-4 pt-1 backdrop-blur-md mb-6">
        <div className="flex items-center overflow-x-auto scrollbar-hide border-b border-[#990000]/20">
          {FILTER_TABS.map(({ value, label, count, color }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`relative px-5 py-3.5 text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap font-['Kanit'] ${
                  isActive ? 'text-[#FF0000]' : `${color} hover:text-[#F2F4F6]`
                }`}
              >
                {label}
                <span className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                  isActive ? 'bg-red-500/20 text-[#FF0000]' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  {count}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF0000] shadow-[0_0_8px_rgba(255,0,0,0.8)] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#000000]/60 border border-[#990000]/20 rounded-2xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#990000]/30 bg-[#2E0505]/50 font-['Orbitron'] text-xs uppercase">
              <th className="py-4 pl-6 text-[#FF0000] rounded-tl-2xl">สินค้า</th>
              <th className="py-4 px-4 text-[#FF0000]">หมวดหมู่</th>
              <th className="py-4 px-4 text-[#FF0000] text-center">สถานะ</th>
              <th className="py-4 px-4 text-[#FF0000] text-center">สต็อกปัจจุบัน</th>
              <th className="py-4 pr-6 text-[#FF0000] text-right rounded-tr-2xl">อัปเดตสต็อก</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-[#990000]/10 animate-pulse">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2E0505]/50 rounded-lg" />
                      <div className="h-4 w-40 bg-[#2E0505]/50 rounded" />
                    </div>
                  </td>
                  <td className="py-4 px-4"><div className="h-4 w-24 bg-[#2E0505]/50 rounded" /></td>
                  <td className="py-4 px-4 text-center"><div className="h-6 w-20 bg-[#2E0505]/50 rounded-full mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><div className="h-6 w-12 bg-[#2E0505]/50 rounded mx-auto" /></td>
                  <td className="py-4 pr-6 text-right"><div className="h-8 w-32 bg-[#2E0505]/50 rounded ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-[#2E0505]/30 rounded-full flex items-center justify-center border border-[#990000]/20">
                      <BarChart3 size={28} className="text-[#F2F4F6]/20" />
                    </div>
                    <span className="text-[#F2F4F6]/30 font-['Kanit']">ไม่พบสินค้า</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const stock   = p.stock ?? 0;
                const st      = getStockStatus(stock);
                const isEdit  = editing[p.id] !== undefined;

                const stockBadge =
                  st === 'out' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                  st === 'low' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                                 'text-green-400 bg-green-500/10 border-green-500/20';

                const stockLabel =
                  st === 'out' ? 'หมดสต็อก' :
                  st === 'low' ? 'สต็อกต่ำ' : 'ปกติ';

                return (
                  <tr key={p.id} className="border-b border-[#990000]/10 hover:bg-[#2E0505]/20 transition group">
                    {/* Product */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-[#990000]/30 shrink-0">
                          <img
                            src={p.imageUrl || 'https://dummyimage.com/40x40/000/fff?text=N'}
                            alt={p.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/40x40/000/fff?text=N'; }}
                          />
                        </div>
                        <span className="text-sm text-[#F2F4F6] font-bold font-['Kanit'] line-clamp-1 group-hover:text-white transition">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="text-xs bg-[#000000] px-2 py-1 rounded border border-[#990000]/30 font-['Kanit'] text-[#F2F4F6]/60">
                        {getCategoryName(p)}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border font-['Kanit'] ${stockBadge}`}>
                        {stockLabel}
                      </span>
                    </td>
                    {/* Current stock */}
                    <td className="py-4 px-4 text-center">
                      <span className={`text-xl font-['Orbitron'] font-bold ${
                        st === 'out' ? 'text-red-400' : st === 'low' ? 'text-yellow-400' : 'text-[#F2F4F6]'
                      }`}>
                        {stock}
                      </span>
                    </td>
                    {/* Edit */}
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min={0}
                          placeholder={String(stock)}
                          value={editing[p.id] ?? ''}
                          onChange={(e) => setEditing((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          className="w-20 bg-[#000000] border border-[#990000]/30 rounded-lg px-3 py-1.5 text-[#F2F4F6] text-sm text-center focus:border-[#FF0000] outline-none font-['Orbitron'] transition"
                        />
                        <button
                          onClick={async () => {
                            try {
                              await updateProduct(p.id, { isHidden: !p.isHidden });
                              setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, isHidden: !p.isHidden } : prod));
                              showToast(p.isHidden ? 'แสดงสินค้าสำเร็จ' : 'ซ่อนสินค้าสำเร็จ', true);
                            } catch {
                              showToast('เกิดข้อผิดพลาดในการซ่อน/แสดงสินค้า', false);
                            }
                          }}
                          className={`px-3 py-1.5 border rounded-lg transition font-['Kanit'] text-xs font-bold flex items-center gap-1 ${p.isHidden ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20' : 'bg-[#252525] border-[#990000]/30 text-[#F2F4F6]/50 hover:bg-yellow-500/20 hover:text-yellow-400'}`}
                        >
                          {p.isHidden ? 'ซ่อนอยู่' : 'แสดงอยู่'}
                        </button>
                        <button
                          onClick={() => handleSaveStock(p)}
                          disabled={!isEdit || saving === p.id}
                          className="px-3 py-1.5 bg-[#990000] hover:bg-[#FF0000] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition font-['Kanit'] active:scale-95"
                        >
                          {saving === p.id ? '...' : 'บันทึก'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminStockPage;
