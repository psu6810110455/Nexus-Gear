import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Lock,
  Landmark,
  CreditCard,
} from "lucide-react";
import type { UserData } from "../../types/profile.types";
import { useLanguage } from "../../../../shared/context/LanguageContext";

interface ProfileInfoTabProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onOpenPasswordModal: () => void;
  onSave: () => void; // ✅ เพิ่มบรรทัดนี้ เพื่อรับคำสั่ง Save จากตัวแม่
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  userData,
  setUserData,
  onOpenPasswordModal,
  onSave,
}) => {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const BANK_OPTIONS = [
    "",
    language === 'TH' ? "กสิกรไทย (KBANK)" : "Kasikorn Bank (KBANK)",
    language === 'TH' ? "กรุงเทพ (BBL)" : "Bangkok Bank (BBL)",
    language === 'TH' ? "กรุงไทย (KTB)" : "Krungthai Bank (KTB)",
    language === 'TH' ? "ไทยพาณิชย์ (SCB)" : "Siam Commercial Bank (SCB)",
    language === 'TH' ? "กรุงศรี (BAY)" : "Krungsri Bank (BAY)",
    language === 'TH' ? "ทหารไทยธนชาต (TTB)" : "TMBThanachart (TTB)",
    language === 'TH' ? "ออมสิน (GSB)" : "Government Savings Bank (GSB)",
    language === 'TH' ? "เกียรตินาคินภัทร (KKP)" : "Kiatnakin Phatra (KKP)",
    language === 'TH' ? "ซีไอเอ็มบี (CIMB)" : "CIMB Thai (CIMB)",
    language === 'TH' ? "ยูโอบี (UOB)" : "UOB Bank (UOB)",
    language === 'TH' ? "แลนด์แอนด์เฮ้าส์ (LHBANK)" : "Land and Houses Bank (LHBANK)",
    language === 'TH' ? "พร้อมเพย์ (PromptPay)" : "PromptPay",
  ];

  const fields = [
    { label: t('fullName'), value: userData.name, key: "name", icon: User },
    { label: t('email'), value: userData.email, key: "email", icon: Mail },
    { label: t('phone'), value: userData.phone, key: "phone", icon: Phone },
  ];

  // ✅ ฟังก์ชันตอนกดปุ่มบันทึก
  const handleSaveClick = () => {
    onSave(); // สั่งให้ตัวแม่ยิง API
    setIsEditing(false); // ปิดโหมดแก้ไข
  };

  return (
    <div className="bg-[#000000]/60 border border-[#990000]/30 backdrop-blur-xl rounded-2xl p-4 sm:p-8 shadow-2xl animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold flex items-center gap-3 font-['Orbitron']">
          <span className="w-1.5 h-8 bg-[#FF0000] rounded-full shadow-[0_0_10px_#FF0000]"></span>{" "}
          {language === 'TH' ? 'ข้อมูลโปรไฟล์' : 'PROFILE INFO'}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex gap-1.5 sm:gap-2 bg-[#2E0505] border border-[#990000] text-[#FF0000] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#990000] hover:text-white transition text-[11px] sm:text-sm"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {language === 'TH' ? 'แก้ไข' : 'EDIT'}
          </button>
        ) : (
          <div className="flex gap-2">
            {/* ✅ เปลี่ยน onClick มาเรียกใช้ handleSaveClick */}
            <button
              onClick={handleSaveClick}
              className="bg-[#FF0000] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#990000] transition text-[11px] sm:text-sm flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t('save')}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-[#2E0505] border border-[#990000] text-[#F2F4F6] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-[#000000] transition text-[11px] sm:text-sm flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {t('cancel')}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6 text-left">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-left text-xs font-['Orbitron'] text-[#FF0000] mb-2">
              {f.label}
            </label>
            <div className="relative">
              <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2F4F6]/30" />
              <input
                disabled={!isEditing || f.key === "email"} // ล็อกไม่ให้แก้อีเมล
                value={f.value}
                onChange={(e) =>
                  setUserData({ ...userData, [f.key]: e.target.value })
                }
                className={`w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-12 text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] disabled:opacity-50 text-left ${f.key === "email" ? "cursor-not-allowed" : ""}`}
              />
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-[#990000]/20">
          <label className="block text-left text-xs font-['Orbitron'] text-[#FF0000] mb-4">
            {language === 'TH' ? 'ข้อมูลธนาคาร' : 'BANK INFO'}
          </label>
          <p className="text-zinc-500 text-xs mb-4">
            {language === 'TH' ? 'ข้อมูลธนาคารสำหรับการคืนเงิน (กรณียกเลิก/คืนสินค้า)' : 'Bank information for refunds (in case of cancellation/returns)'}
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">
                {language === 'TH' ? 'ชื่อธนาคาร' : 'Bank Name'}
              </label>
              <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2F4F6]/30" />
                {isEditing ? (
                  <select
                    value={userData.bank_name}
                    onChange={(e) =>
                      setUserData({ ...userData, bank_name: e.target.value })
                    }
                    className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-12 text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] text-left"
                  >
                    <option value="">-- {language === 'TH' ? 'เลือกธนาคาร' : 'Select Bank'} --</option>
                    {BANK_OPTIONS.filter(Boolean).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    disabled
                    value={userData.bank_name || ""}
                    placeholder={language === 'TH' ? "ยังไม่ได้ระบุ" : "Not specified"}
                    className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-12 text-[#F2F4F6] disabled:opacity-50 text-left"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">
                {language === 'TH' ? 'เลขบัญชี' : 'Account Number'}
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F2F4F6]/30" />
                <input
                  disabled={!isEditing}
                  value={userData.bank_account}
                  onChange={(e) =>
                    setUserData({ ...userData, bank_account: e.target.value })
                  }
                  placeholder={language === 'TH' ? "เลขบัญชีธนาคาร" : "Bank Account Number"}
                  className="w-full bg-[#000000] border border-[#990000]/30 rounded-xl px-4 py-3 pl-12 text-[#F2F4F6] focus:outline-none focus:border-[#FF0000] disabled:opacity-50 text-left"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#990000]/20">
          <label className="block text-left text-xs font-['Orbitron'] text-[#FF0000] mb-2">
            {language === 'TH' ? 'ความปลอดภัย' : 'SECURITY'}
          </label>
          <button
            onClick={onOpenPasswordModal}
            className="flex items-center justify-start gap-2 text-sm text-[#F2F4F6]/70 hover:text-[#FF0000] transition-colors border border-[#F2F4F6]/10 px-4 py-3 rounded-xl w-full hover:border-[#FF0000]/50 text-left"
          >
            <Lock className="w-4 h-4" /> {language === 'TH' ? 'เปลี่ยนรหัสผ่าน' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};
