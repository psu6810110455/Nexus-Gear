// ============================================================
// src/features/admin/pages/AdminPage.tsx
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getCategories, createCategory, updateCategory, deleteCategory,
  uploadProductImages, deleteProductImage,
} from '../../../shared/services/api';
import type { Category, Product } from '../../../shared/types';
import { Plus, Edit, Trash2, X, Save, CheckCircle, AlertTriangle, EyeOff, Eye, ImagePlus, Star } from 'lucide-react';
import AdminLayout from '../../navigation/components/AdminLayout';

// ── Types ─────────────────────────────────────────────────────
interface FormData {
  name: string; description: string; price: string;
  stock: string; imageUrl: string; categoryId: string;
}
const EMPTY_FORM: FormData = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

interface ExistingImage { id: number; imageUrl: string; sortOrder: number; }
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ── Sub-components ────────────────────────────────────────────

interface CategoryManagerModalProps {
  categories: Category[]; categoryNameInput: string; editingCategoryId: number | null;
  onInputChange: (v: string) => void; onSave: () => void;
  onEdit: (c: Category) => void; onDelete: (id: number) => void; onClose: () => void;
}
const CategoryManagerModal = ({
  categories, categoryNameInput, editingCategoryId,
  onInputChange, onSave, onEdit, onDelete, onClose,
}: CategoryManagerModalProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(153,0,0,0.5)] overflow-hidden">
      <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
        <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6]">MANAGE CATEGORIES</h3>
        <button onClick={onClose} className="p-2 hover:bg-[#990000] rounded-full transition text-[#F2F4F6]/50 hover:text-white"><X size={20} /></button>
      </div>
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="flex gap-3">
          <input type="text" value={categoryNameInput} onChange={(e) => onInputChange(e.target.value)} placeholder="ชื่อหมวดหมู่"
            className="flex-1 bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2 text-[#F2F4F6] focus:border-[#FF0000] outline-none font-['Kanit']" />
          <button onClick={onSave} className="bg-[#990000] hover:bg-[#FF0000] text-white px-4 py-2 rounded-lg font-['Kanit'] font-bold transition">
            {editingCategoryId ? 'บันทึก' : 'สร้างใหม่'}
          </button>
        </div>
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-[#F2F4F6]/30 text-sm font-['Kanit'] text-center py-4">ยังไม่มีหมวดหมู่</p>
          ) : categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-[#000000] p-3 rounded-xl border border-[#990000]/20 hover:border-[#FF0000] transition group">
              <span className="text-[#F2F4F6] font-['Kanit']">{c.name}</span>
              <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition">
                <button onClick={() => onEdit(c)} className="text-xs px-3 py-1 bg-[#2E0505] border border-[#990000]/50 hover:border-[#FF0000] text-[#F2F4F6] rounded transition font-['Kanit']">แก้ไข</button>
                <button onClick={() => onDelete(c.id)} className="text-xs px-3 py-1 bg-[#990000] hover:bg-[#FF0000] text-white rounded transition font-['Kanit']">ลบ</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface DeleteConfirmModalProps { onConfirm: () => void; onCancel: () => void; }
const DeleteConfirmModal = ({ onConfirm, onCancel }: DeleteConfirmModalProps) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
    <div className="bg-[#0a0a0a] border border-[#FF0000] w-full max-w-sm rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.6)]">
      <div className="w-16 h-16 bg-[#2E0505] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF0000]/30">
        <Trash2 className="w-8 h-8 text-[#FF0000]" />
      </div>
      <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-2">ยืนยันการลบ?</h3>
      <p className="text-sm text-[#F2F4F6]/60 mb-6 font-['Kanit']">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-[#990000]/50 text-[#F2F4F6] hover:border-[#FF0000] transition font-bold font-['Kanit']">ยกเลิก</button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-[#FF0000] text-white hover:bg-[#990000] transition font-bold font-['Kanit']">ลบเลย</button>
      </div>
    </div>
  </div>
);

interface ProductFormModalProps {
  form: FormData; categories: Category[]; isEditing: boolean; submitting: boolean;
  pendingFiles: File[]; existingImages: ExistingImage[];
  onFormChange: (f: FormData) => void; onSubmit: () => void; onClose: () => void;
  onAddFiles: (files: File[]) => void; onRemovePendingFile: (idx: number) => void;
  onDeleteExistingImage: (img: ExistingImage) => void;
  onSetMainImage: (imageUrl: string) => void;
}
const ProductFormModal = ({ form, categories, isEditing, submitting, pendingFiles, existingImages, onFormChange, onSubmit, onClose, onAddFiles, onRemovePendingFile, onDeleteExistingImage, onSetMainImage }: ProductFormModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalImages = existingImages.length + pendingFiles.length;
  const canAdd = totalImages < MAX_IMAGES;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => {
      if (!ALLOWED_TYPES.includes(f.type)) return false;
      if (f.size > MAX_FILE_SIZE) return false;
      return true;
    });
    const remaining = MAX_IMAGES - totalImages;
    onAddFiles(valid.slice(0, remaining));
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(153,0,0,0.5)] overflow-hidden">
        <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
          <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6]">{isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#990000] rounded-full transition text-[#F2F4F6]/50 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-['Kanit']">

          {/* ── Image Upload Section ── */}
          <div>
            <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">
              รูปภาพสินค้า ({totalImages}/{MAX_IMAGES})
            </label>
            <div className="grid grid-cols-4 gap-3">
              {/* Existing images */}
              {existingImages.map((img) => {
                const isMain = form.imageUrl === img.imageUrl;
                return (
                  <div key={`ex-${img.id}`} className={`relative w-full aspect-square bg-black border ${isMain ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-[#990000]/30'} rounded-xl overflow-hidden group`}>
                    <img src={`http://localhost:3000${img.imageUrl}`} alt="" className="w-full h-full object-contain p-1" />
                    
                    {/* Delete button */}
                    <button type="button" onClick={() => onDeleteExistingImage(img)} className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg z-10">
                      <X size={12} className="text-white" />
                    </button>
                    
                    {/* Set Main button */}
                    <button type="button" onClick={() => onSetMainImage(img.imageUrl)} title="ตั้งเป็นรูปหลัก" className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center transition shadow-lg z-10 ${isMain ? 'bg-yellow-500 opacity-100' : 'bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-yellow-500/50'}`}>
                      <Star size={10} className={`${isMain ? 'text-black fill-black' : 'text-white'}`} />
                    </button>
                    
                    {isMain && <span className="absolute bottom-1 right-1 bg-yellow-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded shadow">MAIN</span>}
                  </div>
                );
              })}
              {/* Pending files preview */}
              {pendingFiles.map((f, idx) => (
                <div key={`pf-${idx}`} className="relative w-full aspect-square bg-black border border-green-500/30 rounded-xl overflow-hidden group">
                  <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-contain p-1" />
                  <button type="button" onClick={() => onRemovePendingFile(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <X size={12} className="text-white" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-green-600 text-white text-[8px] px-1 rounded">ใหม่</span>
                </div>
              ))}
              {/* Add button */}
              {canAdd && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square bg-black border-2 border-dashed border-[#990000]/50 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#FF0000] transition cursor-pointer">
                  <ImagePlus className="text-[#F2F4F6]/30" size={24} />
                  <span className="text-[9px] text-[#F2F4F6]/30">เพิ่มรูป</span>
                </button>
              )}
            </div>
            <p className="text-[9px] text-[#F2F4F6]/30 mt-2">รองรับ JPG, PNG, WebP (ไม่เกิน 5MB ต่อรูป)</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect} className="hidden" />
          </div>

          {/* ── Name ── */}
          <div>
            <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">ชื่อสินค้า *</label>
            <input type="text" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="เช่น ROG Phone 8"
              className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">หมวดหมู่</label>
              <select value={form.categoryId} onChange={(e) => onFormChange({ ...form, categoryId: e.target.value })}
                className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-3 py-2.5 text-sm text-[#F2F4F6] focus:border-[#FF0000] outline-none transition">
                <option value="">-- เลือก --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">ราคา (฿) *</label>
              <input type="number" value={form.price} onChange={(e) => onFormChange({ ...form, price: e.target.value })} placeholder="0"
                className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
            </div>
          </div>
          <div>
            <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">จำนวนสต็อก</label>
            <input type="number" value={form.stock} onChange={(e) => onFormChange({ ...form, stock: e.target.value })} placeholder="0"
              className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
          </div>
          <div>
            <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">คำอธิบาย</label>
            <textarea value={form.description} onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              placeholder="รายละเอียดสินค้า..." rows={2}
              className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition resize-none" />
          </div>
        </div>
        <div className="p-5 bg-[#2E0505]/20 border-t border-[#990000]/20">
          <button onClick={onSubmit} disabled={submitting}
            className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:opacity-50 text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95">
            <Save size={20} /> {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
function AdminPage() {
  const [products, setProducts]                             = useState<Product[]>([]);
  const [categories, setCategories]                         = useState<Category[]>([]);
  const [loading, setLoading]                               = useState(true);
  const [showForm, setShowForm]                             = useState(false);
  const [editingProduct, setEditingProduct]                 = useState<Product | null>(null);
  const [form, setForm]                                     = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting]                         = useState(false);
  const [toast, setToast]                                   = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm]                   = useState<number | null>(null);
  const [searchTerm, setSearchTerm]                         = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [showCategoryManager, setShowCategoryManager]       = useState(false);
  const [categoryNameInput, setCategoryNameInput]           = useState('');
  const [editingCategoryId, setEditingCategoryId]           = useState<number | null>(null);
  const [pendingFiles, setPendingFiles]                     = useState<File[]>([]);
  const [existingImages, setExistingImages]                 = useState<ExistingImage[]>([]);

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

  const openAddForm = () => { setEditingProduct(null); setForm(EMPTY_FORM); setPendingFiles([]); setExistingImages([]); setShowForm(true); };
  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, description: p.description || '', price: String(p.price), stock: String(p.stock ?? ''),
      imageUrl: p.imageUrl || '', categoryId: p.category && typeof p.category === 'object' ? String((p.category as Category).id) : '' });
    setPendingFiles([]);
    setExistingImages((p as any).images || []);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) { showToast('กรุณากรอกชื่อและราคา', 'error'); return; }
    setSubmitting(true);
    const payload = { name: form.name, description: form.description, price: Number(form.price),
      stock: Number(form.stock), imageUrl: form.imageUrl, categoryId: form.categoryId ? Number(form.categoryId) : undefined };
    try {
      let productId: number;
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        productId = editingProduct.id;
        showToast('แก้ไขสินค้าสำเร็จ', 'success');
      } else {
        const created = await createProduct(payload);
        productId = created.id;
        showToast('เพิ่มสินค้าสำเร็จ', 'success');
      }
      // อัปโหลดรูปใหม่ (ถ้ามี)
      if (pendingFiles.length > 0) {
        await uploadProductImages(productId, pendingFiles);
        showToast(`อัปโหลดรูปสำเร็จ ${pendingFiles.length} รูป`, 'success');
      }
      setShowForm(false); setPendingFiles([]); setExistingImages([]); fetchProducts();
    } catch { showToast('เกิดข้อผิดพลาด', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteExistingImage = async (img: ExistingImage) => {
    if (!editingProduct) return;
    try {
      await deleteProductImage(editingProduct.id, img.id);
      setExistingImages(prev => prev.filter(i => i.id !== img.id));
      showToast('ลบรูปสำเร็จ', 'success');
    } catch { showToast('ลบรูปไม่สำเร็จ', 'error'); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteProduct(id); setDeleteConfirm(null); showToast('ลบสินค้าสำเร็จ', 'success'); fetchProducts(); }
    catch { showToast('ลบสินค้าไม่สำเร็จ', 'error'); }
  };

  const handleToggleHide = async (p: Product) => {
    try {
      await updateProduct(p.id, { isHidden: !p.isHidden });
      showToast(p.isHidden ? 'แสดงสินค้าสำเร็จ' : 'ซ่อนสินค้าสำเร็จ', 'success');
      fetchProducts();
    } catch {
      showToast('เกิดข้อผิดพลาดในการซ่อน/แสดงสินค้า', 'error');
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const catName = typeof p.category === 'object' ? (p.category as Category)?.name : p.category;
    const matchCat = selectedCategoryFilter === 'All Categories' || catName === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <AdminLayout breadcrumb="ศูนย์บริหารสินค้า" onCategoryClick={() => setShowCategoryManager(true)}>

      {/* ── Toast ── */}
      {toast && (
        <div onClick={() => setToast(null)} className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right duration-300 font-['Kanit'] cursor-pointer hover:opacity-80 transition-opacity ${
          toast.type === 'success'
            ? 'bg-black border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            : 'bg-black border-[#FF0000] text-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.4)]'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.message}
          <X size={16} className="ml-2 opacity-50 hover:opacity-100" />
        </div>
      )}

      {/* Modals */}
      {showCategoryManager && (
        <CategoryManagerModal categories={categories} categoryNameInput={categoryNameInput}
          editingCategoryId={editingCategoryId} onInputChange={setCategoryNameInput}
          onSave={handleSaveCategory} onEdit={(cat) => { setEditingCategoryId(cat.id); setCategoryNameInput(cat.name); }}
          onDelete={handleDeleteCategory}
          onClose={() => { setShowCategoryManager(false); setEditingCategoryId(null); setCategoryNameInput(''); }} />
      )}
      {deleteConfirm !== null && (
        <DeleteConfirmModal onConfirm={() => handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />
      )}
      {showForm && (
        <ProductFormModal form={form} categories={categories} isEditing={!!editingProduct}
          submitting={submitting} pendingFiles={pendingFiles} existingImages={existingImages}
          onFormChange={setForm} onSubmit={handleSubmit} onClose={() => { setShowForm(false); setPendingFiles([]); setExistingImages([]); }}
          onAddFiles={(files) => setPendingFiles(prev => [...prev, ...files])}
          onRemovePendingFile={(idx) => setPendingFiles(prev => prev.filter((_, i) => i !== idx))}
          onDeleteExistingImage={handleDeleteExistingImage}
          onSetMainImage={(url) => setForm({ ...form, imageUrl: url })} />
      )}

      {/* ── Page Header ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6] tracking-widest uppercase">INVENTORY</h1>
          <p className="text-[#F2F4F6]/40 text-sm mt-1 font-['Kanit']">ศูนย์รวบรวมและบริหารจัดการสินค้าทั้งหมด</p>
        </div>
        <button onClick={openAddForm}
          className="bg-[#990000] hover:bg-[#FF0000] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-['Kanit'] font-bold shadow-[0_0_15px_rgba(153,0,0,0.5)] transition hover:scale-105 active:scale-95">
          <Plus size={18} /> เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* ── Search & Filter ── */}
      <div className="bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-[#FF0000]/10 blur-lg rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <input type="text" placeholder="ค้นหาสินค้า (ชื่อ, รหัส)..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#000000] border border-[#990000]/50 rounded-lg pl-4 pr-4 py-2 text-[#F2F4F6] focus:border-[#FF0000] outline-none font-['Kanit'] relative z-10" />
          </div>
          <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-[#000000] border border-[#990000]/50 rounded-lg px-4 py-2 text-[#F2F4F6] outline-none font-['Kanit']">
            <option>All Categories</option>
            {categories.map((c) => <option key={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => setShowCategoryManager(true)}
            className="bg-[#2E0505] hover:bg-[#990000] border border-[#990000]/50 hover:border-[#FF0000] text-[#F2F4F6]/70 hover:text-white text-xs px-4 py-2 rounded-lg transition font-['Kanit']">
            จัดการหมวดหมู่
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left text-[#F2F4F6]/70">
          <thead>
            <tr className="border-b border-[#990000]/30 text-xs uppercase bg-[#2E0505]/50 font-['Orbitron']">
              <th className="py-3 pl-4 rounded-tl-lg text-[#FF0000]">Product</th>
              <th className="text-[#FF0000]">Category</th>
              <th className="text-[#FF0000]">Price</th>
              <th className="text-[#FF0000]">Stock</th>
              <th className="text-right pr-4 rounded-tr-lg text-[#FF0000]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-16 text-[#F2F4F6]/30 font-['Kanit']">กำลังโหลด...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-[#F2F4F6]/30 font-['Kanit']">ไม่พบสินค้า</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-[#990000]/20 hover:bg-[#2E0505]/30 transition group">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded border border-[#990000]/50 flex items-center justify-center overflow-hidden">
                        <img src={p.imageUrl || 'https://dummyimage.com/50x50/000/fff'} alt="" className="w-full h-full object-contain p-1"
                          onError={(e) => { e.currentTarget.src = 'https://dummyimage.com/50x50/000/fff'; }} />
                      </div>
                      <span className="font-bold text-[#F2F4F6] font-['Kanit']">{p.name} {p.isHidden && <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full ml-2">ซ่อนอยู่</span>}</span>
                    </div>
                  </td>
                  <td><span className="bg-[#000000] px-2 py-1 rounded text-xs border border-[#990000]/30 font-['Kanit']">
                    {typeof p.category === 'object' ? (p.category as Category)?.name || '—' : p.category || '—'}
                  </span></td>
                  <td className="font-['Orbitron'] text-[#FF0000] font-bold">฿{Number(p.price).toLocaleString()}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-bold font-['Kanit'] ${
                      (p.stock ?? 0) === 0 ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                      : (p.stock ?? 0) < 10 ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                      : 'text-green-400 bg-green-500/10 border border-green-500/20'
                    }`}>
                      {(p.stock ?? 0) === 0 ? 'Out of Stock' : p.stock}
                    </span>
                  </td>
                  <td className="text-right pr-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleToggleHide(p)} className="p-2 bg-[#252525] hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition border border-yellow-500/20" title={p.isHidden ? "แสดงสินค้า" : "ซ่อนสินค้า"}>
                        {p.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => openEditForm(p)} className="p-2 bg-[#252525] hover:bg-blue-500/20 text-blue-400 rounded-lg transition border border-blue-500/20" title="แก้ไข"><Edit size={16} /></button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-2 bg-[#252525] hover:bg-red-500/20 text-[#FF0000] rounded-lg transition border border-red-500/20" title="ลบ"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminPage;
