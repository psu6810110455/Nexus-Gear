// ============================================================
// src/features/admin/pages/AdminPage.tsx
// ============================================================

import { useState, useEffect } from 'react';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getCategories, createCategory, updateCategory, deleteCategory,
} from '../../../shared/services/api';
import type { Product, Category, ProductFormData } from '../../../shared/types';

// ── DeleteConfirmModal (รวมไว้ที่นี่) ────────────────────────
function DeleteConfirmModal({ isOpen, onCancel, onConfirm }: { isOpen: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#110000] border border-red-900/50 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl shadow-red-900/20">
        <div className="text-4xl mb-4">🗑️</div>
        <h3 className="text-lg font-bold mb-2">ยืนยันการลบ?</h3>
        <p className="text-gray-500 text-sm mb-6">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition text-sm font-semibold">ยกเลิก</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm font-semibold">ลบเลย</button>
        </div>
      </div>
    </div>
  );
}

// ── ProductFormModal (รวมไว้ที่นี่) ──────────────────────────
interface ProductFormModalProps {
  isOpen: boolean; isEditing: boolean; form: ProductFormData;
  categories: Category[]; submitting: boolean;
  onClose: () => void; onFormChange: (f: ProductFormData) => void; onSubmit: () => void;
}

function ProductFormModal({ isOpen, isEditing, form, categories, submitting, onClose, onFormChange, onSubmit }: ProductFormModalProps) {
  if (!isOpen) return null;
  const set = (key: keyof ProductFormData, val: string) => onFormChange({ ...form, [key]: val });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f0000] border border-red-600/50 rounded-2xl w-full max-w-md shadow-2xl shadow-red-900/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/30">
          <h2 className="text-base font-bold text-white">{isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition text-lg">✕</button>
        </div>
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="flex justify-center mb-2">
            {form.imageUrl
              ? <img src={form.imageUrl} alt="preview" className="w-20 h-20 object-contain rounded-lg border border-red-900/30 bg-white p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              : <div className="w-20 h-20 border-2 border-dashed border-red-900/40 rounded-lg flex flex-col items-center justify-center text-gray-600 text-xs gap-1"><span className="text-2xl">↑</span><span>รูปภาพ</span></div>
            }
          </div>
          {([['ชื่อสินค้า *', 'name', 'เช่น ROG Phone 8'], ['URL รูปภาพ', 'imageUrl', 'https://...']] as const).map(([label, key, placeholder]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">{label}</label>
              <input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">หมวดหมู่</label>
              <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="w-full bg-black/50 border border-red-900/30 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:border-red-600 focus:outline-none transition">
                <option value="">-- เลือก --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">ราคา (฿) *</label>
              <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0" className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">จำนวนสต็อก</label>
            <input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="0" className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">คำอธิบาย</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="รายละเอียดสินค้า..." rows={2} className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-red-900/20">
          <button onClick={onSubmit} disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition text-sm active:scale-95">
            💾 {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CategoryManager (รวมไว้ที่นี่) ───────────────────────────
interface CategoryManagerProps {
  isOpen: boolean; categories: Category[]; nameInput: string; editingId: number | null;
  onClose: () => void; onNameChange: (v: string) => void; onSave: () => void;
  onEdit: (cat: Category) => void; onDelete: (id: number) => void;
}

function CategoryManager({ isOpen, categories, nameInput, editingId, onClose, onNameChange, onSave, onEdit, onDelete }: CategoryManagerProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f0000] border border-red-900/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/30">
          <h2 className="font-bold text-white">🏷️ จัดการหมวดหมู่</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            <input type="text" placeholder="ชื่อหมวดหมู่..." value={nameInput} onChange={(e) => onNameChange(e.target.value)} className="flex-1 bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none" />
            <button onClick={onSave} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition">{editingId ? 'อัปเดต' : 'เพิ่ม'}</button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-4 py-2.5 bg-black/30 border border-white/5 rounded-lg">
                <span className="text-sm text-gray-300">{cat.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(cat)} className="text-blue-400 hover:text-blue-300 text-xs transition">แก้ไข</button>
                  <button onClick={() => onDelete(cat.id)} className="text-red-500 hover:text-red-400 text-xs transition">ลบ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
const EMPTY_FORM: ProductFormData = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

function AdminPage() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [categories, setCategories]       = useState<Category[]>([]);
  const [loading, setLoading]             = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm]                   = useState<ProductFormData>(EMPTY_FORM);
  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try { setProducts(await getProducts()); }
    catch { showToast('โหลดสินค้าไม่สำเร็จ', 'error'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try { setCategories(await getCategories()); } catch { /* optional */ }
  };

  const handleSaveCategory = async () => {
    if (!categoryNameInput.trim()) return showToast('กรุณากรอกชื่อหมวดหมู่', 'error');
    try {
      if (editingCategoryId) { await updateCategory(editingCategoryId, categoryNameInput); showToast('แก้ไขหมวดหมู่สำเร็จ', 'success'); }
      else { await createCategory(categoryNameInput); showToast('สร้างหมวดหมู่สำเร็จ', 'success'); }
      setCategoryNameInput(''); setEditingCategoryId(null); fetchCategories();
    } catch { showToast('ไม่สามารถบันทึกหมวดหมู่ได้', 'error'); }
  };

  const handleDeleteCategory = async (id: number) => {
    try { await deleteCategory(id); showToast('ลบหมวดหมู่สำเร็จ', 'success'); fetchCategories(); }
    catch { showToast('ลบหมวดหมู่ไม่สำเร็จ', 'error'); }
  };

  const openAddForm = () => { setEditingProduct(null); setForm(EMPTY_FORM); setShowForm(true); };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, description: product.description || '',
      price: String(product.price), stock: String(product.stock ?? ''),
      imageUrl: product.imageUrl || '',
      categoryId: product.category && typeof product.category === 'object' ? String(product.category.id) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return showToast('กรุณากรอกชื่อและราคา', 'error');
    setSubmitting(true);
    const payload = { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl, categoryId: form.categoryId ? Number(form.categoryId) : undefined };
    try {
      if (editingProduct) { await updateProduct(editingProduct.id, payload); showToast('แก้ไขสินค้าสำเร็จ', 'success'); }
      else { await createProduct(payload as any); showToast('เพิ่มสินค้าสำเร็จ', 'success'); }
      setShowForm(false); fetchProducts();
    } catch { showToast('เกิดข้อผิดพลาด', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteProduct(id); setDeleteConfirm(null); showToast('ลบสินค้าสำเร็จ', 'success'); fetchProducts(); }
    catch { showToast('ลบสินค้าไม่สำเร็จ', 'error'); }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const catName = typeof p.category === 'object' ? p.category?.name : p.category;
    return matchSearch && (selectedCategoryFilter === 'All Categories' || catName === selectedCategoryFilter);
  });

  return (
    <div className="flex min-h-screen bg-[#0d0000] text-white font-sans">
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-lg text-sm font-semibold shadow-xl ${toast.type === 'success' ? 'bg-green-700' : 'bg-red-700'}`}>
          {toast.message}
        </div>
      )}
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-wide uppercase">จัดการสินค้า</h1>
            <p className="text-gray-500 text-sm mt-1">เพิ่ม แก้ไข หรือลบสินค้าในระบบ</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCategoryManager(true)} className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition text-sm">🏷️ จัดการหมวดหมู่</button>
            <button onClick={openAddForm} className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition text-sm">+ เพิ่มสินค้า</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="text" placeholder="ค้นหาสินค้า..." className="flex-1 bg-[#1a0000] border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select className="bg-[#1a0000] border border-red-900/30 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:border-red-600 focus:outline-none" value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)}>
            <option>All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="bg-[#110000] border border-red-900/20 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-[#1a0000] text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-red-900/20">
            <span>สินค้า</span><span>หมวดหมู่</span><span>ราคา</span><span>สต็อก</span><span>จัดการ</span>
          </div>
          {loading ? (
            <div className="p-10 text-center text-gray-600">กำลังโหลด...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-600">ไม่พบสินค้า</div>
          ) : (
            filtered.map((product) => (
              <div key={product.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-red-900/10 hover:bg-[#1a0000]/50 transition items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                    {(product.imageUrl || product.image_url)
                      ? <img src={product.imageUrl || product.image_url} alt={product.name} className="w-full h-full object-contain p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">📦</div>
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{product.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{product.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{typeof product.category === 'object' ? product.category?.name : product.category || '—'}</span>
                <span className="text-sm text-red-500 font-bold">{Number(product.price).toLocaleString()}</span>
                <div>
                  {(product.stock ?? 0) === 0
                    ? <span className="text-xs bg-red-900/40 text-red-400 border border-red-700/40 px-2 py-0.5 rounded font-semibold">Out of Stock</span>
                    : <span className={`text-xs font-bold px-2 py-0.5 rounded ${(product.stock ?? 0) > 10 ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{product.stock}</span>
                  }
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditForm(product)} className="p-1.5 rounded border border-blue-700/40 text-blue-400 hover:bg-blue-700/20 transition text-sm">✏️</button>
                  <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 rounded border border-red-700/40 text-red-400 hover:bg-red-700/20 transition text-sm">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <DeleteConfirmModal isOpen={deleteConfirm !== null} onCancel={() => setDeleteConfirm(null)} onConfirm={() => deleteConfirm !== null && handleDelete(deleteConfirm)} />
      <ProductFormModal isOpen={showForm} isEditing={!!editingProduct} form={form} categories={categories} submitting={submitting} onClose={() => setShowForm(false)} onFormChange={setForm} onSubmit={handleSubmit} />
      <CategoryManager isOpen={showCategoryManager} categories={categories} nameInput={categoryNameInput} editingId={editingCategoryId} onClose={() => { setShowCategoryManager(false); setCategoryNameInput(''); setEditingCategoryId(null); }} onNameChange={setCategoryNameInput} onSave={handleSaveCategory} onEdit={(cat) => { setEditingCategoryId(cat.id); setCategoryNameInput(cat.name); }} onDelete={handleDeleteCategory} />
    </div>
  );
}

export default AdminPage;