import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Address } from '../../types/profile.types';

interface ProfileAddressesTabProps {
  addresses: Address[];
  onOpenAdd: () => void;
  onOpenEdit: (addr: Address) => void;
  onOpenDelete: (id: number) => void;
}

export const ProfileAddressesTab: React.FC<ProfileAddressesTabProps> = ({ addresses, onOpenAdd, onOpenEdit, onOpenDelete }) => {
  return (
    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-4 sm:p-8 shadow-2xl animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold flex items-center gap-3 font-['Orbitron'] tracking-wide">
          <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> ADDRESSES
        </h3>
        <button onClick={onOpenAdd} className="bg-[#990000] hover:bg-[#FF0000] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(153,0,0,0.4)] text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> เพิ่มที่อยู่
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-[#000000] border border-[#990000]/20 rounded-xl p-5 hover:border-[#FF0000]/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#990000] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between pl-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-[#F2F4F6] group-hover:text-[#FF0000] transition-colors">{addr.label}</span>
                  {addr.isDefault && <span className="bg-[#FF0000]/20 text-[#FF0000] text-[10px] px-2 py-0.5 rounded border border-[#FF0000]/30 font-['Orbitron'] tracking-wider">DEFAULT</span>}
                </div>
                <p className="text-[#F2F4F6]/60 text-sm">{addr.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onOpenEdit(addr)} className="text-[#F2F4F6]/30 hover:text-[#FF0000] hover:bg-[#2E0505] rounded-full p-2 transition-all"><Edit2 className="w-5 h-5" /></button>
                <button onClick={() => onOpenDelete(addr.id)} className="text-[#F2F4F6]/30 hover:text-[#FF0000] hover:bg-[#2E0505] rounded-full p-2 transition-all"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};