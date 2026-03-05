import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Package, ShoppingBag, Layers, BarChart3,
  LogOut, Search, Plus, Edit, Trash2, X, Upload, Save,
  CheckCircle, AlertTriangle
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: { id: number; name: string };
}

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
}

const EMPTY_FORM: FormData = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

const menuItems = [
  { label: 'แดชบอร์ด',          icon: LayoutDashboard, path: '/dashboard' },
  { label: 'จัดการคำสั่งซื้อ',  icon: ShoppingBag,     path: '/admin/orders' },
  { label: 'จัดการสินค้า',      icon: Package,          path: '/admin' },
  { label: 'จัดการหมวดหมู่',    icon: Layers,           path: '/admin/categories' },
  { label: 'จัดการสต็อก',       icon: BarChart3,        path: '/admin/stock' },
];

function AdminPage() {
  const navigate = useNavigate();

  const [products, setProducts]             = useState<Product[]>([]);
  const [categories, setCategories]         = useState<Category[]>([]);
  const [loading, setLoading]               = useState(true);
  const [showForm, setShowForm]             = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm]                     = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting]         = useState(false);
  const [toast, setToast]                   = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm]   = useState<number | null>(null);
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [showCategoryManager, setShowCategoryManager]       = useState(false);
  const [categoryNameInput, setCategoryNameInput]           = useState('');
  const [editingCategoryId, setEditingCategoryId]           = useState<number | null>(null);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/products?t=${Date.now()}`);
      setProducts(res.data);
    } catch { showToast('โหลดสินค้าไม่สำเร็จ', 'error'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try { const res = await axios.get('http://localhost:3000/categories'); setCategories(res.data); } catch {}
  };

  const createOrUpdateCategory = async () => {
    try {
      if (!categoryNameInput.trim()) return showToast('กรุณากรอกชื่อหมวดหมู่', 'error');
      if (editingCategoryId) {
        await axios.patch(`http://localhost:3000/categories/${editingCategoryId}`, { name: categoryNameInput });
        showToast('แก้ไขหมวดหมู่สำเร็จ', 'success');
      } else {
        await axios.post('http://localhost:3000/categories', { name: categoryNameInput });
        showToast('สร้างหมวดหมู่สำเร็จ', 'success');
      }
      setCategoryNameInput(''); setEditingCategoryId(null); fetchCategories();
    } catch { showToast('ไม่สามารถบันทึกหมวดหมู่ได้', 'error'); }
  };

  const openAddForm = () => { setEditingProduct(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, description: p.description || '', price: String(p.price), stock: String(p.stock), imageUrl: p.imageUrl || '', categoryId: p.category ? String(p.category.id) : '' });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) { showToast('กรุณากรอกชื่อและราคา', 'error'); return; }
    setSubmitting(true);
    const payload = { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl, categoryId: form.categoryId ? Number(form.categoryId) : undefined };
    try {
      if (editingProduct) {
        await axios.patch(`http://localhost:3000/products/${editingProduct.id}`, payload);
        showToast('แก้ไขสินค้าสำเร็จ', 'success');
      } else {
        await axios.post('http://localhost:3000/products', payload);
        showToast('เพิ่มสินค้าสำเร็จ', 'success');
      }
      setShowForm(false); fetchProducts();
    } catch { showToast('เกิดข้อผิดพลาด', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setDeleteConfirm(null); showToast('ลบสินค้าสำเร็จ', 'success'); fetchProducts();
    } catch { showToast('ลบสินค้าไม่สำเร็จ', 'error'); }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategoryFilter === 'All Categories' || p.category?.name === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#F2F4F6] font-['Kanit'] selection:bg-[#990000] selection:text-white relative overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');`}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2E0505] blur-[150px] rounded-full opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23990000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold shadow-2xl border animate-in slide-in-from-right duration-300 font-['Kanit'] ${
          toast.type === 'success'
            ? 'bg-black border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            : 'bg-black border-[#FF0000] text-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.4)]'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#000000]/95 border-r border-[#990000]/50 flex flex-col fixed h-full z-50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3 border-b border-[#990000]/30 cursor-pointer group relative overflow-hidden" onClick={() => navigate('/')}>
          <div className="absolute inset-0 bg-[#FF0000]/10 blur-xl opacity-0 group-hover:opacity-50 transition duration-500"></div>
          <img src="/nexus-logo.png" alt="Logo" className="w-8 h-8 object-contain relative z-10"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/50x50/000000/red?text=NX'; }} />
          <span className="font-['Orbitron'] font-black text-[#F2F4F6] text-lg tracking-wider relative z-10 drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">
            ADMIN
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.path === '/admin';
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group font-['Kanit'] ${
                  isActive
                    ? 'bg-gradient-to-r from-[#990000]/40 to-transparent border-l-4 border-[#FF0000] text-white pl-5 shadow-[0_0_15px_rgba(153,0,0,0.3)]'
                    : 'text-[#F2F4F6]/60 hover:bg-[#2E0505] hover:text-[#FF0000] hover:pl-5'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#FF0000]' : 'text-[#F2F4F6]/50 group-hover:text-[#FF0000]'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#990000]/30">
          <button onClick={() => navigate(-1)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#990000]/20 hover:text-[#FF0000] transition text-[#F2F4F6]/50 border border-transparent hover:border-[#990000]/50">
            <LogOut size={20} />
            <span className="font-['Orbitron'] tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-64 p-8 relative z-10">
        {/* Topbar breadcrumb */}
        <div className="flex justify-between items-center mb-8 bg-[#000000]/40 p-4 rounded-xl border border-[#990000]/20 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-[#F2F4F6]/40 hover:text-[#FF0000] bg-white/5 hover:bg-[#2E0505] border border-white/10 hover:border-[#990000]/50 px-3 py-1.5 rounded-lg transition font-['Kanit']">
              ← ย้อนกลับ
            </button>
            <p className="text-[#F2F4F6]/50 text-sm font-['Kanit']">
              ระบบจัดการร้านค้า / <span className="text-[#FF0000] font-bold">จัดการสินค้า</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#2E0505] flex items-center justify-center text-xs font-bold text-[#FF0000] border border-[#990000]">AD</div>
            <span className="text-sm font-bold text-[#F2F4F6]">ผู้ดูแลระบบ</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
          {/* Header + Add button */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-['Orbitron'] font-bold text-[#F2F4F6]">PRODUCTS</h2>
            <button
              onClick={openAddForm}
              className="bg-[#990000] hover:bg-[#FF0000] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-['Kanit'] shadow-[0_0_15px_rgba(153,0,0,0.5)] transition hover:scale-105"
            >
              <Plus size={18} /> เพิ่มสินค้าใหม่
            </button>
          </div>

          {/* Search + Filter */}
          <div className="bg-[#000000]/60 border border-[#990000]/30 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-[#FF0000]/10 blur-lg rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F4F6]/50 z-10" size={20} />
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า (ชื่อ, รหัส)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#000000] border border-[#990000]/50 rounded-lg pl-10 pr-4 py-2 text-[#F2F4F6] focus:border-[#FF0000] outline-none font-['Kanit'] relative z-10"
                />
              </div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#000000] border border-[#990000]/50 rounded-lg px-4 py-2 text-[#F2F4F6] outline-none font-['Kanit']"
              >
                <option>All Categories</option>
                {categories.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
              <button
                onClick={() => setShowCategoryManager(true)}
                className="bg-[#2E0505] hover:bg-[#990000] border border-[#990000]/50 hover:border-[#FF0000] text-[#F2F4F6]/70 hover:text-white text-xs px-4 py-2 rounded-lg transition font-['Kanit']"
              >
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
                            <img src={p.imageUrl || 'https://placehold.co/50'} alt="" className="w-full h-full object-contain p-1"
                              onError={(e) => { e.currentTarget.src = 'https://placehold.co/50'; }} />
                          </div>
                          <span className="font-bold text-[#F2F4F6] font-['Kanit']">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="bg-[#000000] px-2 py-1 rounded text-xs border border-[#990000]/30 font-['Kanit']">{p.category?.name || '—'}</span></td>
                      <td className="font-['Orbitron'] text-[#FF0000] font-bold">฿{Number(p.price).toLocaleString()}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-bold font-['Kanit'] ${
                          p.stock === 0 ? 'text-[#FF0000] bg-red-500/10 border border-red-500/20'
                          : p.stock < 10 ? 'text-yellow-500 bg-yellow-500/10 border border-yellow-500/20'
                          : 'text-green-500 bg-green-500/10 border border-green-500/20'
                        }`}>
                          {p.stock === 0 ? 'Out of Stock' : p.stock}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditForm(p)} className="p-2 bg-[#252525] hover:bg-blue-500/20 text-blue-500 rounded-lg transition border border-blue-500/20"><Edit size={16} /></button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-2 bg-[#252525] hover:bg-red-500/20 text-[#FF0000] rounded-lg transition border border-red-500/20"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── MODAL: Category Manager ── */}
      {showCategoryManager && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(153,0,0,0.5)] overflow-hidden">
            <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
              <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6]">MANAGE CATEGORIES</h3>
              <button onClick={() => { setShowCategoryManager(false); setEditingCategoryId(null); setCategoryNameInput(''); }} className="p-2 hover:bg-[#990000] rounded-full transition text-[#F2F4F6]/50 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  placeholder="ชื่อหมวดหมู่"
                  className="flex-1 bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2 text-[#F2F4F6] focus:border-[#FF0000] outline-none font-['Kanit']"
                />
                <button onClick={createOrUpdateCategory} className="bg-[#990000] hover:bg-[#FF0000] text-white px-4 py-2 rounded-lg font-['Kanit'] font-bold transition">
                  {editingCategoryId ? 'บันทึก' : 'สร้างใหม่'}
                </button>
              </div>
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-[#F2F4F6]/30 text-sm font-['Kanit'] text-center py-4">ยังไม่มีหมวดหมู่</p>
                ) : (
                  categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-[#000000] p-3 rounded-xl border border-[#990000]/20 hover:border-[#FF0000] transition group">
                      <span className="text-[#F2F4F6] font-['Kanit']">{c.name}</span>
                      <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition">
                        <button onClick={() => { setEditingCategoryId(c.id); setCategoryNameInput(c.name); }} className="text-xs px-3 py-1 bg-[#2E0505] border border-[#990000]/50 hover:border-[#FF0000] text-[#F2F4F6] rounded transition font-['Kanit']">แก้ไข</button>
                        <button onClick={() => axios.delete(`http://localhost:3000/categories/${c.id}`).then(() => { showToast('ลบสำเร็จ', 'success'); fetchCategories(); }).catch(() => showToast('ลบไม่สำเร็จ', 'error'))} className="text-xs px-3 py-1 bg-[#990000] hover:bg-[#FF0000] text-white rounded transition font-['Kanit']">ลบ</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Confirm ── */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in-95">
          <div className="bg-[#0a0a0a] border border-[#FF0000] w-full max-w-sm rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.6)]">
            <div className="w-16 h-16 bg-[#2E0505] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF0000]/30">
              <Trash2 className="w-8 h-8 text-[#FF0000]" />
            </div>
            <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6] mb-2">ยืนยันการลบ?</h3>
            <p className="text-sm text-[#F2F4F6]/60 mb-6 font-['Kanit']">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-[#990000]/50 text-[#F2F4F6] hover:border-[#FF0000] transition font-bold font-['Kanit']">ยกเลิก</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-[#FF0000] text-white hover:bg-[#990000] transition font-bold font-['Kanit'] shadow-[0_0_15px_rgba(255,0,0,0.4)]">ลบเลย</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add / Edit Product ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(153,0,0,0.5)] overflow-hidden">
            <div className="bg-[#2E0505]/40 p-6 border-b border-[#990000]/20 flex justify-between items-center">
              <h3 className="text-xl font-['Orbitron'] font-bold text-[#F2F4F6]">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[#990000] rounded-full transition text-[#F2F4F6]/50 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto font-['Kanit']">
              {/* Image preview */}
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 bg-black border-2 border-dashed border-[#990000]/50 rounded-xl flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#FF0000] transition">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-contain p-1"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <Upload className="text-[#F2F4F6]/30" size={28} />
                  )}
                </div>
              </div>

              {/* URL รูปภาพ */}
              <div>
                <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">URL รูปภาพ</label>
                <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..."
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
              </div>

              {/* ชื่อสินค้า */}
              <div>
                <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">ชื่อสินค้า *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="เช่น ROG Phone 8"
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
              </div>

              {/* หมวดหมู่ + ราคา */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">หมวดหมู่</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-3 py-2.5 text-sm text-[#F2F4F6] focus:border-[#FF0000] outline-none transition">
                    <option value="">-- เลือก --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">ราคา (฿) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0"
                    className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
                </div>
              </div>

              {/* สต็อก */}
              <div>
                <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">จำนวนสต็อก</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0"
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition" />
              </div>

              {/* คำอธิบาย */}
              <div>
                <label className="text-xs font-['Orbitron'] text-[#FF0000] mb-2 block uppercase tracking-wider">คำอธิบาย</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="รายละเอียดสินค้า..." rows={2}
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-lg px-4 py-2.5 text-[#F2F4F6] text-sm focus:border-[#FF0000] outline-none transition resize-none" />
              </div>
            </div>

            <div className="p-5 bg-[#2E0505]/20 border-t border-[#990000]/20">
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full bg-gradient-to-r from-[#990000] to-[#FF0000] hover:from-[#FF0000] hover:to-[#990000] disabled:opacity-50 text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(153,0,0,0.4)] flex items-center justify-center gap-2 active:scale-95">
                <Save size={20} /> {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;