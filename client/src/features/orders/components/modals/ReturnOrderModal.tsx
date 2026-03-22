// features/orders/components/ReturnOrderModal.tsx

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, RotateCcw } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface OrderItem {
  quantity: number;
  product: { name: string; image_url: string };
}
interface Order {
  id: number;
  total_price: string;
  items: OrderItem[];
}

interface Props {
  isOpen: boolean;
  order: Order | null;
  defaultBankName?: string;
  defaultBankAccount?: string;
  onClose: () => void;
  onConfirm: (
    orderId: number,
    reason: string,
    bankName?: string,
    bankAccount?: string,
    evidenceFile?: File,
  ) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────────
const RETURN_REASONS = [
  "สินค้าชำรุด / เสียหาย",
  "สินค้าไม่ตรงตามรายละเอียด",
  "ได้รับสินค้าผิดรายการ",
  "สินค้าไม่ครบตามจำนวน",
  "เปลี่ยนใจไม่ต้องการสินค้าแล้ว",
  "อื่นๆ",
];

const BANKS = [
  "กสิกรไทย (KBANK)",
  "กรุงเทพ (BBL)",
  "กรุงไทย (KTB)",
  "ไทยพาณิชย์ (SCB)",
  "กรุงศรี (BAY)",
  "ทหารไทยธนชาต (TTB)",
  "ออมสิน (GSB)",
  "เกียรตินาคินภัทร (KKP)",
  "ซีไอเอ็มบี (CIMB)",
  "ยูโอบี (UOB)",
  "แลนด์แอนด์เฮ้าส์ (LHBANK)",
  "พร้อมเพย์ (PromptPay)",
];

// ── Component ─────────────────────────────────────────────────
const ReturnOrderModal = ({
  isOpen,
  order,
  defaultBankName,
  defaultBankAccount,
  onClose,
  onConfirm,
}: Props) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // pre-fill bank + lock scroll
  useEffect(() => {
    if (isOpen) {
      setBankName(defaultBankName || "");
      setBankAccount(defaultBankAccount || "");
      const scrollY = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;left:0;right:0`;
      return () => {
        document.body.style.cssText = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, defaultBankName, defaultBankAccount]);

  if (!isOpen || !order) return null;

  const finalReason = reason === "อื่นๆ" ? customReason.trim() : reason;
  const canSubmit =
    !!finalReason &&
    !!bankName.trim() &&
    !!bankAccount.trim() &&
    !!evidenceFile;

  const handleClose = () => {
    setReason("");
    setCustomReason("");
    setBankName("");
    setBankAccount("");
    setEvidenceFile(null);
    setEvidencePreview(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await onConfirm(
        order.id,
        finalReason,
        bankName.trim(),
        bankAccount.trim(),
        evidenceFile ?? undefined,
      );
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEvidenceFile(file);
    setEvidencePreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : "video",
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
      <article className="bg-[#0a0a0a] border border-orange-500/30 rounded-2xl w-full max-w-md shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <header className="p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <RotateCcw size={18} className="text-orange-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ขอคืนสินค้า</h2>
              <p className="text-zinc-500 text-xs">
                #{String(order.id).padStart(3, "0")} — คืนได้ภายใน 7
                วันหลังสำเร็จ
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        <div className="p-5 space-y-4 overflow-y-auto flex-1 scrollbar-dark">
          {/* เงื่อนไข */}
          <aside className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest">
               เงื่อนไขการคืนสินค้า
            </p>
            <ul className="space-y-1.5 text-zinc-300 text-xs leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">•</span>คืนได้ภายใน{" "}
                <strong className="text-white">7 วัน</strong> หลังได้รับสินค้า
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">•</span>
                สินค้าต้องอยู่ในสภาพเดิม ไม่ผ่านการใช้งาน บรรจุภัณฑ์ครบถ้วน
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">•</span>
                สินค้าชำรุดจากการใช้งานของลูกค้า ไม่อยู่ในเงื่อนไขการคืน
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">•</span>
                โปรโมชันและสินค้าลดราคาพิเศษไม่สามารถคืนได้
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold shrink-0">•</span>
                <span>
                  ต้องมี
                  <span className="text-red-300 font-bold">
                    วีดีโอแกะกล่องแบบไม่ตัดต่อ
                  </span>{" "}
                  หากไม่มีจะไม่สามารถคืนสินค้าได้
                </span>
              </li>
            </ul>
            <p className="text-red-400 text-xs font-bold pt-2 border-t border-amber-500/20">
              ⛔ หากไม่ตรงเงื่อนไข
              แอดมินจะปฏิเสธการคืนสินค้าและไม่สามารถคืนเงินได้
            </p>
          </aside>

          {/* เหตุผล */}
          <div>
            <p className="text-zinc-400 text-xs font-bold mb-2 uppercase tracking-widest">
              เหตุผลที่ขอคืน *
            </p>
            <div className="space-y-2">
              {RETURN_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    reason === r
                      ? "border-orange-500/50 bg-orange-500/5 text-white"
                      : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="returnReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-orange-500"
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
            {reason === "อื่นๆ" && (
              <textarea
                rows={3}
                placeholder="ระบุเหตุผล..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="mt-2 w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500/50 text-zinc-200 text-sm rounded-xl px-4 py-3 resize-none outline-none placeholder-zinc-600 transition-colors"
              />
            )}
          </div>

          {/* บัญชีคืนเงิน */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
            <p className="text-orange-400 text-xs font-bold">
              � ข้อมูลสำหรับคืนเงิน
            </p>
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">
                ชื่อธนาคาร *
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500/50 text-zinc-200 text-sm rounded-lg px-3 py-2.5 outline-none transition-colors"
              >
                <option value="">-- เลือกธนาคาร --</option>
                {BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">
                เลขบัญชี *
              </label>
              <input
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="เลขบัญชีธนาคาร"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500/50 text-zinc-200 text-sm rounded-lg px-3 py-2.5 outline-none placeholder-zinc-600 transition-colors"
              />
            </div>
          </div>

          {/* หลักฐาน */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
            <p className="text-red-400 text-xs font-bold">
               หลักฐานการคืนสินค้า *
            </p>
            <p className="text-zinc-500 text-xs">
              แนบวีดีโอแกะกล่องแบบไม่ตัดต่อ หรือรูปภาพสินค้า (JPG, PNG, MP4 —
              สูงสุด 50MB)
            </p>
            {evidencePreview ? (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl p-3">
                {evidenceFile?.type.startsWith("video/") ? (
                  <div className="w-14 h-14 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-2xl"></span>
                  </div>
                ) : (
                  <img
                    src={evidencePreview}
                    alt="evidence"
                    className="w-14 h-14 object-cover rounded-lg border border-zinc-700 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-green-400 text-xs font-bold">
                    ✓ อัปโหลดสำเร็จ
                  </p>
                  <p className="text-zinc-500 text-[10px] truncate">
                    {evidenceFile?.name}
                  </p>
                  <button
                    onClick={() => {
                      setEvidenceFile(null);
                      setEvidencePreview(null);
                    }}
                    className="text-zinc-500 hover:text-red-400 text-xs mt-1 transition-colors"
                  >
                    ลบ / เปลี่ยนไฟล์
                  </button>
                </div>
              </div>
            ) : (
              <label
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center gap-2 px-4 py-5 border-2 border-dashed border-zinc-700 hover:border-orange-500/50 rounded-xl cursor-pointer transition-colors group"
              >
                <span className="text-2xl">�</span>
                <span className="text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors text-center">
                  คลิกเพื่อแนบวีดีโอหรือรูปภาพหลักฐาน
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-5 border-t border-zinc-800 shrink-0 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-colors font-bold text-sm"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all font-bold text-sm"
          >
            {loading ? "กำลังดำเนินการ..." : "ยืนยันคืนสินค้า"}
          </button>
        </footer>
      </article>
    </div>,
    document.body,
  );
};

export default ReturnOrderModal;
