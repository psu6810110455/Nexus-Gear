import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'TH' | 'EN';

interface Translations {
  [key: string]: {
    TH: string;
    EN: string;
  };
}

export const translations: Translations = {
  // Navbar
  home: { TH: 'หน้าแรก', EN: 'Home' },
  shop: { TH: 'สินค้าทั้งหมด', EN: 'All Products' },
  adminCenter: { TH: 'ศูนย์บริหารสินค้า', EN: 'Admin Center' },
  login: { TH: 'เข้าสู่ระบบ', EN: 'Login' },
  register: { TH: 'สมัครสมาชิก', EN: 'Register' },
  logout: { TH: 'ออกจากระบบ', EN: 'Logout' },
  profile: { TH: 'โปรไฟล์', EN: 'Profile' },
  cart: { TH: 'ตะกร้าสินค้า', EN: 'Cart' },
  hello: { TH: 'สวัสดี', EN: 'Hello' },
  user: { TH: 'ผู้ใช้งาน', EN: 'User' },
  promoShipping: { TH: 'ส่งฟรีเมื่อซื้อครบ ฿999', EN: 'FREE SHIPPING OVER ฿999' },
  selectLanguage: { TH: 'กรุณาเลือกภาษา', EN: 'SELECT LANGUAGE' },
  
  // Footer
  footerDesc: { TH: 'อุปกรณ์เกมมิ่งพรีเมียมสำหรับนักรบดิจิตอล ยกระดับทุกสมรภูมิด้วยเกียร์ระดับ Pro', EN: 'Premium gaming gear for digital warriors. Level up every battlefield with Pro-level gear.' },
  quickLinks: { TH: 'ลิงก์ด่วน', EN: 'Quick Links' },
  support: { TH: 'ช่วยเหลือ', EN: 'Support' },
  contact: { TH: 'ติดต่อเรา', EN: 'Contact' },
  forgotPassword: { TH: 'ลืมรหัสผ่าน', EN: 'Forgot Password' },
  returnPolicy: { TH: 'นโยบายการคืนสินค้า', EN: 'Return Policy' },
  faq: { TH: 'คำถามที่พบบ่อย', EN: 'FAQ' },
  allRightsReserved: { TH: 'สงวนลิขสิทธิ์', EN: 'ALL RIGHTS RESERVED' },

  // Admin Sidebar
  dashboard: { TH: 'แดชบอร์ด', EN: 'Dashboard' },
  manageOrders: { TH: 'จัดการคำสั่งซื้อ', EN: 'Manage Orders' },
  inventory: { TH: 'คลังสินค้า', EN: 'Inventory' },
  manageStock: { TH: 'จัดการสต็อก', EN: 'Manage Stock' },
  customerChat: { TH: 'แชทกับลูกค้า', EN: 'Customer Chat' },
  backToHome: { TH: 'กลับหน้าหลัก', EN: 'Back to Site' },
  adminHome: { TH: 'หน้าหลักระบบหลังบ้าน', EN: 'Admin Dashboard Home' },

  // Common Buttons
  buyNow: { TH: 'ซื้อเลย', EN: 'Buy Now' },
  learnMore: { TH: 'รายละเอียดเพิ่มเติม', EN: 'Learn More' },
  viewAll: { TH: 'ดูทั้งหมด', EN: 'View All' },
  save: { TH: 'บันทึก', EN: 'Save' },
  cancel: { TH: 'ยกเลิก', EN: 'Cancel' },
  confirm: { TH: 'ยืนยัน', EN: 'Confirm' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nexus_lang') as Language) || 'TH';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus_lang', lang);
  };

  const t = (key: keyof typeof translations): string => {
    const value = translations[key];
    if (!value) return String(key);
    return value[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
