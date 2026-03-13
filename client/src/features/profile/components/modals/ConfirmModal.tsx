import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  confirmText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, description, icon, confirmText = 'CONFIRM' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in zoom-in-95">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-[#FF0000] w-full max-w-sm rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(255,0,0,0.6)]">
        <div className="w-16 h-16 bg-[#2E0505] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF0000]/30">
          {icon}
        </div>
        <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6] mb-2">{title}</h3>
        <p className="text-sm text-[#F2F4F6]/60 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-transparent border border-[#990000]/50 text-[#F2F4F6] py-3 rounded-xl font-bold hover:border-[#FF0000] transition">CANCEL</button>
          <button onClick={onConfirm} className="flex-1 bg-[#FF0000] text-white py-3 rounded-xl font-bold hover:bg-[#990000] transition shadow-[0_0_15px_rgba(255,0,0,0.4)]">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
