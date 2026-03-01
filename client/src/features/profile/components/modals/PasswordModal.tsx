import React from 'react';
import { X, Lock, Key } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in zoom-in-95">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(153,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6]">CHANGE PASSWORD</h3>
          <button onClick={onClose}><X className="text-[#F2F4F6] hover:text-[#FF0000]" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Current Password</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30"/><input type="password" placeholder="••••••" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" /></div></div>
          <div><label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">New Password</label><div className="relative"><Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30"/><input type="password" placeholder="New password" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" /></div></div>
          <div><label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Confirm Password</label><div className="relative"><Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30"/><input type="password" placeholder="Confirm new password" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" /></div></div>
          <button onClick={onUpdate} className="w-full bg-[#FF0000] hover:bg-[#990000] text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest mt-4 shadow-[0_0_15px_rgba(255,0,0,0.3)]">UPDATE PASSWORD</button>
        </div>
      </div>
    </div>
  );
};