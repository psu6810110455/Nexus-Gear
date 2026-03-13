import React from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  detail: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, detail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
      <div className="relative bg-[#0a0a0a] border-2 border-[#00FF00] w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,255,0,0.3)] animate-in zoom-in-95">
        <div className="w-20 h-20 bg-[#003300] rounded-full flex items-center justify-center mb-6 border border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.4)]">
          <Check className="w-10 h-10 text-[#00FF00]" />
        </div>
        <h3 className="text-2xl font-black font-['Orbitron'] text-white mb-2 tracking-wider">{title}</h3>
        <p className="text-[#F2F4F6]/60 font-['Kanit'] mb-8">{detail}</p>
        <button onClick={onClose} className="w-full bg-[#00FF00] hover:bg-[#00CC00] text-black font-['Orbitron'] font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,0,0.4)]">
          OK
        </button>
      </div>
    </div>
  );
}; // pop-up แสดงความสำเร็จหลังจากแก้ไขข้อมูลสำเร็จ เช่น เปลี่ยนรหัสผ่าน หรือเพิ่มที่อยู่ใหม่`
