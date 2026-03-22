import React, { useState } from 'react';
import { X, Lock, Key } from 'lucide-react';
// นำเข้า API Service
import * as profileApi from '../../services/profile.service';
import { toast } from 'sonner';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // ฟังก์ชันนี้จะทำงานเมื่อเปลี่ยนรหัสผ่านสำเร็จ (โชว์ Success Modal)
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onUpdate }) => {
  // สร้าง State สำหรับเก็บค่ารหัสผ่าน
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ฟังก์ชันสำหรับส่งข้อมูลไปบันทึก
  const handleUpdate = async () => {
    // ตรวจสอบเบื้องต้น
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('กรุณากรอกข้อมูลให้ครบทุกช่องครับ');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกันครับ');
    }

    if (newPassword.length < 8) {
      return toast.error('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษรครับ');
    }

    setLoading(true);
    try {
      // ยิง API ไปที่ Backend
      await profileApi.changePassword({ currentPassword, newPassword });
      
      // ถ้าสำเร็จ: ล้างค่าใน Form, ปิด Modal และเรียก onUpdate เพื่อโชว์ Success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onUpdate(); 
    } catch (error: any) {
      // ถ้าล้มเหลว (เช่น รหัสผ่านเก่าผิด): โชว์ Error จาก Backend
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in zoom-in-95">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#0a0a0a] border border-[#FF0000]/50 w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(153,0,0,0.5)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black font-['Orbitron'] text-[#F2F4F6]">CHANGE PASSWORD</h3>
          <button onClick={onClose} disabled={loading}>
            <X className="text-[#F2F4F6] hover:text-[#FF0000]" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30"/>
              <input 
                type="password" 
                placeholder="••••••" 
                className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">New Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30"/>
              <input 
                type="password" 
                placeholder="New password" 
                className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-['Orbitron'] text-[#FF0000] mb-2 uppercase">Confirm Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F2F4F6]/30"/>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-10 text-[#F2F4F6] focus:border-[#FF0000] outline-none" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleUpdate} 
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-600' : 'bg-[#FF0000] hover:bg-[#990000]'} text-white py-3 rounded-xl font-['Orbitron'] font-bold tracking-widest mt-4 shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all`}
          >
            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </div>
      </div>
    </div>
  );
};
