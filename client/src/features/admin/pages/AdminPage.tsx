// ============================================================
// src/features/admin/pages/AdminPage.tsx
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../shared/services/api";
import type { Category, Product } from "../../../shared/types";

// ── Types ─────────────────────────────────────────────────────
interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
};

const menuItems = [
  { label: "แดชบอร์ด", icon: "▣", path: "/dashboard" },
  { label: "จัดการคำสั่งซื้อ", icon: "🧾", path: "/admin/orders" },
  { label: "จัดการสินค้า", icon: "📦", path: "/admin" },
  { label: "จัดการหมวดหมู่", icon: "🏷️", path: "/admin/categories" },
  { label: "จัดการสต็อก", icon: "📊", path: "/admin/stock" },
];

// ── Sub-components ────────────────────────────────────────────

/** Modal จัดการหมวดหมู่ */
interface CategoryManagerModalProps {
  categories: Category[];
  categoryNameInput: string;
  editingCategoryId: number | null;
  onInputChange: (val: string) => void;
  onSave: () => void;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}
const CategoryManagerModal = ({
  categories,
  categoryNameInput,
  editingCategoryId,
  onInputChange,
  onSave,
  onEdit,
  onDelete,
  onClose,
}: CategoryManagerModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="bg-[#0f0000] border border-red-600/50 rounded-2xl w-full max-w-lg shadow-2xl shadow-red-900/30 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/30">
        <h2 className="text-base font-bold text-white">จัดการหมวดหมู่</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-white transition text-lg"
        >
          ✕
        </button>
      </div>
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={categoryNameInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="ชื่อหมวดหมู่"
            className="flex-1 bg-black/50 border border-red-900/30 rounded px-3 py-2 text-sm text-white"
          />
          <button
            onClick={onSave}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            {editingCategoryId ? "บันทึกการแก้ไข" : "สร้างใหม่"}
          </button>
        </div>
        <div className="divide-y divide-red-900/10">
          {categories.length === 0 ? (
            <div className="text-gray-500 text-sm">ยังไม่มีหมวดหมู่</div>
          ) : (
            categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between py-3"
              >
                <div className="text-sm">{c.name}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(c)}
                    className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

/** Modal ยืนยันการลบสินค้า */
interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}
const DeleteConfirmModal = ({
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="bg-[#110000] border border-red-900/50 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl shadow-red-900/20">
      <div className="text-4xl mb-4">🗑️</div>
      <h3 className="text-lg font-bold mb-2">ยืนยันการลบ?</h3>
      <p className="text-gray-500 text-sm mb-6">
        การกระทำนี้ไม่สามารถย้อนกลับได้
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition text-sm font-semibold"
        >
          ยกเลิก
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm font-semibold"
        >
          ลบเลย
        </button>
      </div>
    </div>
  </div>
);

/** Modal เพิ่ม/แก้ไขสินค้า */
interface ProductFormModalProps {
  form: FormData;
  categories: Category[];
  isEditing: boolean;
  submitting: boolean;
  onFormChange: (form: FormData) => void;
  onSubmit: () => void;
  onClose: () => void;
}
const ProductFormModal = ({
  form,
  categories,
  isEditing,
  submitting,
  onFormChange,
  onSubmit,
  onClose,
}: ProductFormModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="bg-[#0f0000] border border-red-600/50 rounded-2xl w-full max-w-md shadow-2xl shadow-red-900/30 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/30">
        <h2 className="text-base font-bold text-white">
          {isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-white transition text-lg"
        >
          ✕
        </button>
      </div>

      <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
        {/* Image Preview */}
        <div className="flex justify-center mb-2">
          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt="preview"
              className="w-20 h-20 object-contain rounded-lg border border-red-900/30 bg-white p-1"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-20 h-20 border-2 border-dashed border-red-900/40 rounded-lg flex flex-col items-center justify-center text-gray-600 text-xs gap-1">
              <span className="text-2xl">↑</span>
              <span>รูปภาพ</span>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
            ชื่อสินค้า *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="เช่น ROG Phone 8"
            className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
              หมวดหมู่
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                onFormChange({ ...form, categoryId: e.target.value })
              }
              className="w-full bg-black/50 border border-red-900/30 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:border-red-600 focus:outline-none transition"
            >
              <option value="">-- เลือก --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
              ราคา (฿) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => onFormChange({ ...form, price: e.target.value })}
              placeholder="0"
              className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
            จำนวนสต็อก
          </label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => onFormChange({ ...form, stock: e.target.value })}
            placeholder="0"
            className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
            URL รูปภาพ
          </label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) =>
              onFormChange({ ...form, imageUrl: e.target.value })
            }
            placeholder="https://..."
            className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
            คำอธิบาย
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              onFormChange({ ...form, description: e.target.value })
            }
            placeholder="รายละเอียดสินค้า..."
            rows={2}
            className="w-full bg-black/50 border border-red-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:border-red-600 focus:outline-none transition resize-none"
          />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-red-900/20">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition text-sm active:scale-95"
        >
          💾 {submitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────
function AdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState("All Categories");
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      setProducts(await getProducts());
    } catch {
      showToast("โหลดสินค้าไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategories(await getCategories());
    } catch {
      /* optional */
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryNameInput.trim())
      return showToast("กรุณากรอกชื่อหมวดหมู่", "error");
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryNameInput);
        showToast("แก้ไขหมวดหมู่สำเร็จ", "success");
      } else {
        await createCategory(categoryNameInput);
        showToast("สร้างหมวดหมู่สำเร็จ", "success");
      }
      setCategoryNameInput("");
      setEditingCategoryId(null);
      fetchCategories();
    } catch {
      showToast("ไม่สามารถบันทึกหมวดหมู่ได้", "error");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      showToast("ลบหมวดหมู่สำเร็จ", "success");
      fetchCategories();
    } catch {
      showToast("ลบหมวดหมู่ไม่สำเร็จ", "error");
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock ?? ""),
      imageUrl: product.imageUrl || "",
      categoryId:
        product.category && typeof product.category === "object"
          ? String((product.category as Category).id)
          : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price)
      return showToast("กรุณากรอกชื่อและราคา", "error");
    setSubmitting(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId ? Number(form.categoryId) : undefined,
    };
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast("แก้ไขสินค้าสำเร็จ", "success");
      } else {
        await createProduct(payload);
        showToast("เพิ่มสินค้าสำเร็จ", "success");
      }
      setShowForm(false);
      fetchProducts();
    } catch {
      showToast("เกิดข้อผิดพลาด", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      showToast("ลบสินค้าสำเร็จ", "success");
      fetchProducts();
    } catch {
      showToast("ลบสินค้าไม่สำเร็จ", "error");
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const catName =
      typeof p.category === "object"
        ? (p.category as Category)?.name
        : p.category;
    const matchCat =
      selectedCategoryFilter === "All Categories" ||
      catName === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex min-h-screen bg-[#0d0000] text-white font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-lg text-sm font-semibold shadow-xl ${toast.type === "success" ? "bg-green-700" : "bg-red-700"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {showCategoryManager && (
        <CategoryManagerModal
          categories={categories}
          categoryNameInput={categoryNameInput}
          editingCategoryId={editingCategoryId}
          onInputChange={setCategoryNameInput}
          onSave={handleSaveCategory}
          onEdit={(cat) => {
            setEditingCategoryId(cat.id);
            setCategoryNameInput(cat.name);
          }}
          onDelete={handleDeleteCategory}
          onClose={() => {
            setShowCategoryManager(false);
            setEditingCategoryId(null);
            setCategoryNameInput("");
          }}
        />
      )}

      {deleteConfirm !== null && (
        <DeleteConfirmModal
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {showForm && (
        <ProductFormModal
          form={form}
          categories={categories}
          isEditing={!!editingProduct}
          submitting={submitting}
          onFormChange={setForm}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className="w-48 min-h-screen bg-[#0a0000] border-r border-red-900/30 flex flex-col justify-between py-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 px-5 mb-8">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-xs font-black">
              N
            </div>
            <span className="text-white font-black text-base tracking-widest">
              ADMIN
            </span>
          </div>
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = item.path === "/admin";
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    // ถ้ากดเมนูหมวดหมู่ ให้เปิด Modal แทน
                    if (item.path === "/admin/categories") {
                      setShowCategoryManager(true);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition text-left ${
                    isActive
                      ? "bg-red-600/20 text-red-500 border-l-2 border-red-500 font-semibold"
                      : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-white transition text-sm"
        >
          <span>←</span> ย้อนกลับ
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-3 border-b border-red-900/20 bg-[#0a0000]">
          <div className="flex items-center gap-4">
            {/* เอาปุ่มย้อนกลับตรงนี้ออก เพื่อไม่ให้ซ้ำกับ Sidebar */}
            <div className="text-xs text-gray-600">
              ระบบจัดการร้านค้า /{" "}
              <span className="text-red-500 ml-1">จัดการสินค้า</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <span className="text-xs text-gray-400">ผู้ดูแลระบบ</span>
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black tracking-widest text-white uppercase">
              Products
            </h1>
            <button
              onClick={openAddForm}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded transition active:scale-95 shadow-lg shadow-red-900/30"
            >
              ＋ เพิ่มสินค้าใหม่
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="ค้นหาสินค้า (ชื่อ, รหัส)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-[#150000] border border-red-900/30 rounded px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-red-600 focus:outline-none transition"
            />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-[#150000] border border-red-900/30 rounded px-4 py-2 text-sm text-gray-400 focus:border-red-600 focus:outline-none transition"
            >
              <option>All Categories</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCategoryManager(true)}
              className="bg-white/5 hover:bg-white/10 text-xs text-gray-300 px-3 py-2 rounded ml-2"
            >
              จัดการหมวดหมู่
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-red-900/20">
            <div className="grid grid-cols-[2fr_1.2fr_1fr_0.8fr_1fr] px-6 py-3 bg-[#0f0000] border-b border-red-900/20">
              {["PRODUCT", "CATEGORY", "PRICE", "STOCK", "ACTIONS"].map((h) => (
                <span
                  key={h}
                  className="text-xs text-red-600 font-black tracking-widest"
                >
                  {h}
                </span>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-600 text-sm bg-[#0a0000]">
                กำลังโหลด...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-600 text-sm bg-[#0a0000]">
                ไม่พบสินค้า
              </div>
            ) : (
              <div className="divide-y divide-red-900/10 bg-[#0a0000]">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[2fr_1.2fr_1fr_0.8fr_1fr] px-6 py-4 items-center hover:bg-red-900/5 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={
                            product.imageUrl ||
                            "https://placehold.co/40x40?text=N"
                          }
                          alt={product.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/40x40?text=N";
                          }}
                        />
                      </div>
                      <span className="text-sm text-white font-medium line-clamp-1">
                        {product.name}
                      </span>
                    </div>

                    <span className="text-sm text-gray-400">
                      {typeof product.category === "object" ? (
                        (product.category as Category)?.name
                      ) : (
                        <span className="text-gray-700 italic">—</span>
                      )}
                    </span>

                    <span className="text-sm text-red-500 font-bold">
                      {Number(product.price).toLocaleString()}
                    </span>

                    <div>
                      {(product.stock ?? 0) === 0 ? (
                        <span className="text-xs bg-red-900/40 text-red-400 border border-red-700/40 px-2 py-0.5 rounded font-semibold">
                          Out of Stock
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${(product.stock ?? 0) > 10 ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}
                        >
                          {product.stock}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="p-1.5 rounded border border-blue-700/40 text-blue-400 hover:bg-blue-700/20 transition text-sm"
                        title="แก้ไข"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1.5 rounded border border-red-700/40 text-red-400 hover:bg-red-700/20 transition text-sm"
                        title="ลบ"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminPage;