import React, { useState } from 'react';
import { User, Mail, Phone, Edit2, Save, X, Lock } from 'lucide-react';
import type { UserData } from '../../types/profile.types';

interface ProfileInfoTabProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onOpenPasswordModal: () => void;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({ userData, setUserData, onOpenPasswordModal }) => {
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    { label: 'ชื่อ-นามสกุล', value: userData.name, key: 'name', icon: User },
    { label: 'อีเมล', value: userData.email, key: 'email', icon: Mail },
    { label: 'เบอร์โทร', value: userData.phone, key: 'phone', icon: Phone }
  ];

  return (
    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold flex items-center gap-3 font-['Orbitron']">
          <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span> PROFILE INFO
        </h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex gap-2 bg-[#2E0505] border border-[#990000] text-[#FF0000] px-4 py-2 rounded-lg hover:bg-[#990000] hover:text-white transition">
            <Edit2 className="w-4 h-4" /> แก้ไข
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="bg-[#FF0000] text-white px-4 py-2 rounded-lg hover:bg-[#990000] transition"><Save className="w-4 h-4" /> บันทึก</button>
            <button onClick={() => setIsEditing(false)} className="bg-[#2E0505] border border-[#990000] text-[#F2F4F6] px-4 py-2 rounded-lg hover:bg-[#000000] transition"><X className="w-4 h-4" /> ยกเลิก</button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2">{f.label}</label>
            <div className="relative">
              <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2F4F6]/30" />
              <input 
                disabled={!isEditing} 
                value={f.value} 
                onChange={e => setUserData({ ...userData, [f.key]: e.target.value })} 
                className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-12 text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] disabled:opacity-50" 
              />
            </div>
          </div>
        ))}
        
        <div className="pt-6 border-t border-[#990000]/20">
          <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2">SECURITY</label>
          <button onClick={onOpenPasswordModal} className="flex items-center gap-2 text-sm text-[#F2F4F6]/70 hover:text-[#FF0000] transition-colors border border-[#F2F4F6]/10 px-4 py-3 rounded-xl w-full hover:border-[#FF0000]/50">
            <Lock className="w-4 h-4" /> เปลี่ยนรหัสผ่าน (Change Password)
          </button>
        </div>
      </div>
    </div>
  );
};