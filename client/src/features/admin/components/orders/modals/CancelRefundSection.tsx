// features/admin/components/CancelRefundSection.tsx

import { AlertTriangle, Upload } from "lucide-react";
import { useLanguage } from "../../../../../shared/context/LanguageContext";

const REFUND_CHANNELS = ["โอนผ่านธนาคาร", "คืนเงินผ่าน QR"];

interface RefundProps {
  totalPrice: string;
  refundAmount: string;
  refundChannel: string;
  evidencePreview: string | null;
  onAmountChange: (v: string) => void;
  onChannelChange: (v: string) => void;
  onEvidenceUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEvidenceClear: () => void;
}

interface RejectProps {
  rejectReason: string;
  onRejectReasonChange: (v: string) => void;
}

// ── Refund Form (cancel ปกติ) ──────────────────────────────────
export const RefundForm = ({
  totalPrice,
  refundAmount,
  refundChannel,
  evidencePreview,
  onAmountChange,
  onChannelChange,
  onEvidenceUpload,
  onEvidenceClear,
}: RefundProps) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
        {t('refundInfo')}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-zinc-500 text-xs mb-1 block">
            {t('refundAmountLabel')}
          </label>
          <input
            type="number"
            placeholder={totalPrice}
            value={refundAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF0000]/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none placeholder-zinc-600 transition-colors"
          />
        </div>
        <div>
          <label className="text-zinc-500 text-xs mb-1 block">
            {t('refundChannelLabel')}
          </label>
          <select
            value={refundChannel}
            onChange={(e) => onChannelChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#FF0000]/50 text-zinc-200 text-sm rounded-xl px-4 py-2.5 outline-none transition-colors"
          >
            <option value="">-- {t('selectCategory')} --</option>
            {REFUND_CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c === "โอนผ่านธนาคาร" ? t('transferPayment') : "QR Refund"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-zinc-500 text-xs mb-1 flex items-center gap-1">
          <Upload size={11} /> {t('evidenceLabel')}
        </label>
        {evidencePreview ? (
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-700 rounded-xl p-3">
            <img
              src={evidencePreview}
              alt="evidence"
              className="w-14 h-16 object-cover rounded-lg border border-zinc-700"
            />
            <div className="flex-1">
              <p className="text-green-400 text-xs font-bold">{t('uploadSuccess')}</p>
              <button
                onClick={onEvidenceClear}
                className="text-zinc-500 hover:text-red-400 text-xs mt-1 transition-colors"
              >
                {t('removeChangeImage')}
              </button>
            </div>
          </div>
        ) : (
          <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-zinc-700 hover:border-[#FF0000]/50 rounded-xl cursor-pointer transition-colors group">
            <Upload
              size={16}
              className="text-zinc-600 group-hover:text-red-400 transition-colors"
            />
            <span className="text-zinc-500 text-sm group-hover:text-zinc-300 transition-colors">
              {t('clickToUploadEvidence')}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onEvidenceUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

// ── Reject Section (quick_cancel) ─────────────────────────────
export const RejectSection = ({
  rejectReason,
  onRejectReasonChange,
}: RejectProps) => {
  const { t } = useLanguage();
  return (
    <div className="bg-red-950/30 rounded-xl p-4 border border-red-800/40 space-y-3">
      <p className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
        <AlertTriangle size={12} /> {t('rejectRefund')}
      </p>
      <p className="text-zinc-400 text-xs leading-relaxed">
        {t('rejectRefundMessage')}
      </p>
      <div>
        <label className="text-zinc-500 text-xs mb-1.5 block">
          {t('rejectReasonLabel')}
        </label>
        <textarea
          rows={3}
          placeholder={t('rejectReasonPlaceholder')}
          value={rejectReason}
          onChange={(e) => onRejectReasonChange(e.target.value)}
          className="w-full bg-zinc-900 border border-red-800/40 focus:border-red-500/60 text-zinc-200 text-sm rounded-xl px-4 py-3 resize-none outline-none placeholder-zinc-600 transition-colors"
        />
      </div>
    </div>
  );
};
