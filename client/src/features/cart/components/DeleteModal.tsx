import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../shared/context/LanguageContext';

// กำหนดว่า Component นี้ต้องรับค่าอะไรบ้าง
interface DeleteModalProps {
  show: boolean;
  type: 'single' | 'all' | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ show, type, onConfirm, onCancel }: DeleteModalProps) {
  const { t } = useLanguage();
  // ถ้า show เป็น false ไม่ต้องแสดงอะไรเลย
  if (!show) return null;

  return (
    <dialog open className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-transparent m-auto w-full h-full">
      {/* พื้นหลังสีดำเบลอๆ (คลิกเพื่อปิดได้) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onCancel} 
        aria-hidden="true"
      ></div>
      
      {/* กล่องข้อความแจ้งเตือน */}
      <article className="relative bg-[#0a0a0a] border border-[#FF0000] w-full max-w-sm rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.6)] animate-in zoom-in-95">
        <figure className="w-16 h-16 bg-[#2E0505] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF0000]/30 m-0">
          <AlertTriangle aria-hidden="true" className="w-8 h-8 text-[#FF0000]" />
        </figure>
        
        <header>
          <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6] mb-2">
            {type === 'all' ? t('clearCartTitle') : t('deleteItemTitle')}
          </h3>
          <p className="text-sm text-[#F2F4F6]/60 mb-6 font-['Kanit']">
            {type === 'all' 
              ? t('deleteAllConfirm') 
              : t('deleteSingleConfirm')}
          </p>
        </header>

        <footer className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-transparent border border-[#990000]/50 text-[#F2F4F6] py-3 rounded-xl font-bold hover:border-[#FF0000] transition font-['Orbitron'] tracking-wider">
            {t('cancelBtn')}
          </button>
          <button onClick={onConfirm} className="flex-1 bg-[#FF0000] text-white py-3 rounded-xl font-bold hover:bg-[#990000] transition shadow-[0_0_15px_rgba(255,0,0,0.4)] font-['Orbitron'] tracking-wider">
            {t('confirmBtn')}
          </button>
        </footer>
      </article>
    </dialog>
  );
}
