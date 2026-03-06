// เพิ่มแก้ไขที่อยู่
import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  form: { label: string; address: string; isDefault: boolean };
  setForm: React.Dispatch<React.SetStateAction<{ label: string; address: string; isDefault: boolean }>>;
  isEditing: boolean;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, form, setForm, isEditing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_50px_rgba(153,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6]">{isEditing ? 'EDIT ADDRESS' : 'NEW ADDRESS'}</h3>
          <button onClick={onClose}><X className="text-[#F2F4F6] hover:text-[#FF0000]" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Label (ชื่อเรียก)</label><input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="เช่น บ้าน, ที่ทำงาน" className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 text-[#F2F4F6] focus:border-[#FF0000] outline-none transition-all" /></div>
          <div><label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Full Address (ที่อยู่จัดส่ง)</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="รายละเอียดที่อยู่..." rows={3} className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 text-[#F2F4F6] focus:border-[#FF0000] outline-none transition-all resize-none" /></div>
          <div>
            <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Phone (เบอร์โทรศัพท์)</label>
            <input 
              value={(form as any).phone || ''} 
              onChange={e => {
                const val = e.target.value.replace(/\D/g, ''); // Allow only numbers
                setForm({...form, phone: val} as any);
              }} 
              placeholder="เช่น 0812345678" 
              className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 text-[#F2F4F6] focus:border-[#FF0000] outline-none transition-all" 
              maxLength={10} 
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${form.isDefault ? 'bg-[#FF0000] border-[#FF0000]' : 'border-[#F2F4F6]/30 group-hover:border-[#FF0000]'}`}>{form.isDefault && <CheckCircle className="w-3.5 h-3.5 text-white" />}</div>
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} className="hidden" />
            <span className="text-sm text-[#F2F4F6]/80 group-hover:text-white transition-colors">ตั้งเป็นที่อยู่เริ่มต้น (Set as Default)</span>
          </label>
          <button onClick={onSave} className="w-full bg-[#FF0000] hover:bg-[#990000] text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest transition-all mt-4 shadow-[0_0_15px_rgba(255,0,0,0.3)]">SAVE ADDRESS</button>
        </div>
      </div>
    </div>
  );
};