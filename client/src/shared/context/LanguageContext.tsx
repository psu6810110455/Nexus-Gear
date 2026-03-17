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
  returnPolicy: { TH: 'นโยบายการคืนสินค้า', EN: 'Return Policy' },
  faq: { TH: 'คำถามที่พบบ่อย', EN: 'FAQ' },
  allRightsReserved: { TH: 'สงวนลิขสิทธิ์', EN: 'ALL RIGHTS RESERVED' },

  // Admin Sidebar
  dashboard: { TH: 'แดชบอร์ด', EN: 'Dashboard' },
  manageOrders: { TH: 'จัดการคำสั่งซื้อ', EN: 'Manage Orders' },
  inventory: { TH: 'คลังสินค้า', EN: 'Inventory' },
  manageStock: { TH: 'จัดการสต็อก', EN: 'Manage Stock' },
  customerChat: { TH: 'แชทกับลูกค้า', EN: 'Customer Chat' },
  adminHome: { TH: 'หน้าหลักระบบหลังบ้าน', EN: 'Admin Dashboard' },
  backToHomeShort: { TH: 'กลับหน้าแรก', EN: 'Back to Home' },
  administrator: { TH: 'ผู้ดูแลระบบ', EN: 'Administrator' },

  // Common Buttons
  buyNow: { TH: 'ซื้อเลย', EN: 'Buy Now' },
  learnMore: { TH: 'รายละเอียดเพิ่มเติม', EN: 'Learn More' },
  viewAll: { TH: 'ดูทั้งหมด', EN: 'View All' },
  save: { TH: 'บันทึก', EN: 'Save' },
  cancel: { TH: 'ยกเลิก', EN: 'Cancel' },
  confirm: { TH: 'ยืนยัน', EN: 'Confirm' },
  loading: { TH: 'กำลังโหลด...', EN: 'Loading...' },
  notFound: { TH: 'ไม่พบข้อมูล', EN: 'Data not found' },

  // Product Detail
  specialPrice: { TH: 'ราคาพิเศษ', EN: 'Special Price' },
  quantity: { TH: 'จำนวน', EN: 'Quantity' },
  inStock: { TH: 'มีสินค้า', EN: 'In Stock' },
  piece: { TH: 'ชิ้น', EN: 'pcs' },
  sold: { TH: 'ขายแล้ว', EN: 'Sold' },
  productDetail: { TH: 'รายละเอียดสินค้า', EN: 'Product Details' },
  outOfStock: { TH: 'สินค้าหมด', EN: 'Out of Stock' },
  adding: { TH: 'กำลังเพิ่ม...', EN: 'Adding...' },
  addToCart: { TH: 'ใส่ตะกร้า', EN: 'Add to Cart' },
  relatedProducts: { TH: 'สินค้าที่คุณอาจจะชอบ', EN: 'Related Products' },
  backToProducts: { TH: 'กลับหน้ารายการสินค้า', EN: 'Back to Products' },
  newArrival: { TH: 'สินค้าใหม่', EN: 'New Arrival' },
  viewDetails: { TH: 'ดูรายละเอียด', EN: 'View Details' },
  priceLabel: { TH: 'ราคา', EN: 'Price' },

  // Shop
  categories: { TH: 'หมวดหมู่สินค้า', EN: 'Categories' },
  sortBy: { TH: 'เรียงตาม', EN: 'Sort By' },
  priceLowHigh: { TH: 'ราคาต่ำ - สูง', EN: 'Price: Low to High' },
  priceHighLow: { TH: 'ราคาสูง - ต่ำ', EN: 'Price: High to Low' },
  newest: { TH: 'ใหม่ที่สุด', EN: 'Newest' },
  allCategories: { TH: 'ทุกหมวดหมู่', EN: 'All Categories' },
  
  // Category Names
  keyboards: { TH: 'คีย์บอร์ด', EN: 'Keyboards' },
  mice: { TH: 'เมาส์', EN: 'Mice' },
  headsets: { TH: 'หูฟัง', EN: 'Headsets' },
  chairs: { TH: 'เก้าอี้เกมมิ่ง', EN: 'Gaming Chairs' },
  monitors: { TH: 'จอภาพ', EN: 'Monitors' },
  mousepads: { TH: 'แผ่นรองเมาส์', EN: 'Mousepads' },
  accessories: { TH: 'อุปกรณ์เสริม', EN: 'Accessories' },
  gamingGear: { TH: 'เกมมิ่งเกียร์', EN: 'Gaming Gear' },

  // Cart
  orderSummary: { TH: 'สรุปการสั่งซื้อ', EN: 'Order Summary' },
  subtotal: { TH: 'ราคาสินค้า', EN: 'Subtotal' },
  shippingFee: { TH: 'ค่าจัดส่ง', EN: 'Shipping Fee' },
  discount: { TH: 'ส่วนลด', EN: 'Discount' },
  total: { TH: 'ยอดรวมสุทธิ', EN: 'Total' },
  checkout: { TH: 'สั่งซื้อสินค้า', EN: 'Checkout' },
  emptyCart: { TH: 'ตะกร้าสินค้าว่างเปล่า', EN: 'Your cart is empty' },
  free: { TH: 'ฟรี', EN: 'Free' },

  // Profile
  shippingAddress: { TH: 'ที่อยู่จัดส่ง', EN: 'Shipping Address' },
  orderHistory: { TH: 'ประวัติการสั่งซื้อ', EN: 'Order History' },
  editProfile: { TH: 'แก้ไขข้อมูลส่วนตัว', EN: 'Edit Profile' },
  fullName: { TH: 'ชื่อ-นามสกุล', EN: 'Full Name' },
  phone: { TH: 'เบอร์โทรศัพท์', EN: 'Phone Number' },

  // Trust Badges
  securePayment: { TH: 'ชำระเงินปลอดภัย', EN: 'Secure Payment' },
  fastShipping: { TH: 'จัดส่งไว', EN: 'Fast Shipping' },
  warranty: { TH: 'รับประกันศูนย์', EN: 'Factory Warranty' },

  // Coupon
  enterCoupon: { TH: 'กรอกโค้ดส่วนลด...', EN: 'Enter coupon code...' },
  apply: { TH: 'ตกลง', EN: 'Apply' },
  discountCode: { TH: 'โค้ดส่วนลด', EN: 'Discount Code' },

  // Filter & Grid
  priceRange: { TH: 'ช่วงราคา', EN: 'Price Range' },
  minPrice: { TH: 'ราคาต่ำสุด', EN: 'Min Price' },
  maxPrice: { TH: 'ราคาสูงสุด', EN: 'Max Price' },
  searchByPrice: { TH: 'ค้นหาตามราคา', EN: 'Search by Price' },
  clearFilters: { TH: 'ล้างตัวกรองทั้งหมด', EN: 'Clear all filters' },
  filter: { TH: 'ตัวกรอง', EN: 'Filter' },
  noProducts: { TH: 'ไม่พบสินค้าในหมวดหมู่นี้', EN: 'No products found in this category' },
  clearAndViewAll: { TH: 'ล้างตัวกรองและดูสินค้าทั้งหมด', EN: 'Clear filters and view all' },
  previous: { TH: 'ก่อนหน้า', EN: 'Previous' },
  next: { TH: 'ถัดไป', EN: 'Next' },
  page: { TH: 'หน้า', EN: 'Page' },

  // Auth
  login: { TH: 'เข้าสู่ระบบ', EN: 'Log In' },
  register: { TH: 'สมัครสมาชิก', EN: 'Sign Up' },
  email: { TH: 'อีเมล', EN: 'Email Address' },
  password: { TH: 'รหัสผ่าน', EN: 'Password' },
  forgotPassword: { TH: 'ลืมรหัสผ่าน?', EN: 'Forgot Password?' },
  noAccount: { TH: 'ยังไม่มีบัญชี?', EN: "Don't have an account?" },
  haveAccount: { TH: 'มีบัญชีแล้ว?', EN: 'Already have an account?' },
  confirmPassword: { TH: 'ยืนยันรหัสผ่าน', EN: 'Confirm Password' },
  googleLogin: { TH: 'เข้าสู่ระบบด้วย Google', EN: 'Login with Google' },
  pwdHint: { TH: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลข', EN: 'Password must be at least 8 characters long, including letters and numbers' },
  showPwd: { TH: 'แสดงรหัสผ่าน', EN: 'Show Password' },
  hidePwd: { TH: 'ซ่อนรหัสผ่าน', EN: 'Hide Password' },
  or: { TH: 'หรือ', EN: 'Or' },
  googleRegister: { TH: 'สมัครใช้งานด้วย Google', EN: 'Sign up with Google' },

  // Profile Fields
  personalInfo: { TH: 'ข้อมูลส่วนตัว', EN: 'Personal Information' },
  updateProfile: { TH: 'อัปเดตข้อมูล', EN: 'Update Profile' },
  address: { TH: 'ที่อยู่', EN: 'Address' },
  subDistrict: { TH: 'แขวง/ตำบล', EN: 'Sub-district' },
  district: { TH: 'เขต/อำเภอ', EN: 'District' },
  province: { TH: 'จังหวัด', EN: 'Province' },
  postalCode: { TH: 'รหัสไปรษณีย์', EN: 'Postal Code' },
  orders: { TH: 'รายการสั่งซื้อ', EN: 'Orders' },
  addresses: { TH: 'ที่อยู่จัดส่ง', EN: 'Shipping Addresses' },
  logout: { TH: 'ออกจากระบบ', EN: 'Log Out' },

  // Admin Center / Inventory
  inventoryDesc: { TH: 'ศูนย์รวบรวมและบริหารจัดการสินค้าทั้งหมด', EN: 'Comprehensive management center for all products' },
  addProduct: { TH: 'เพิ่มสินค้าใหม่', EN: 'Add New Product' },
  manageCategories: { TH: 'จัดการหมวดหมู่', EN: 'Manage Categories' },
  searchProducts: { TH: 'ค้นหาสินค้า (ชื่อ, รหัส)...', EN: 'Search products (Name, ID)...' },
  productName: { TH: 'ชื่อสินค้า', EN: 'Product Name' },
  category: { TH: 'หมวดหมู่', EN: 'Category' },
  price: { TH: 'ราคา', EN: 'Price' },
  stock: { TH: 'สต็อก', EN: 'Stock' },
  actions: { TH: 'จัดการ', EN: 'Actions' },
  show: { TH: 'แสดงสินค้า', EN: 'Show Product' },
  hide: { TH: 'ซ่อนสินค้า', EN: 'Hide Product' },
  isHidden: { TH: 'ซ่อนอยู่', EN: 'Hidden' },
  edit: { TH: 'แก้ไข', EN: 'Edit' },
  delete: { TH: 'ลบ', EN: 'Delete' },
  confirmDelete: { TH: 'ยืนยันการลบ?', EN: 'Confirm Delete?' },
  noUndo: { TH: 'การกระทำนี้ไม่สามารถย้อนกลับได้', EN: 'This action cannot be undone' },
  deleteNow: { TH: 'ลบเลย', EN: 'Delete Now' },
  editProduct: { TH: 'แก้ไขสินค้า', EN: 'Edit Product' },
  addImages: { TH: 'รูปภาพสินค้า', EN: 'Product Images' },
  mainImage: { TH: 'ตั้งเป็นรูปหลัก', EN: 'Set as Main' },
  imageSupport: { TH: 'รองรับ JPG, PNG, WebP (ไม่เกิน 5MB ต่อรูป)', EN: 'Supports JPG, PNG, WebP (Max 5MB/image)' },
  productNameLabel: { TH: 'ชื่อสินค้า *', EN: 'Product Name *' },
  productNamePlaceholder: { TH: 'เช่น ROG Phone 8', EN: 'e.g., ROG Phone 8' },
  selectCategory: { TH: '-- เลือก --', EN: '-- Select --' },
  priceThb: { TH: 'ราคา (฿) *', EN: 'Price (฿) *' },
  stockCount: { TH: 'จำนวนสต็อก', EN: 'Stock Count' },
  description: { TH: 'คำอธิบาย', EN: 'Description' },
  descriptionPlaceholder: { TH: 'รายละเอียดสินค้า...', EN: 'Product description...' },
  saveProduct: { TH: 'บันทึกข้อมูล', EN: 'Save Product' },
  saving: { TH: 'กำลังบันทึก...', EN: 'Saving...' },
  toastLoadError: { TH: 'โหลดสินค้าไม่สำเร็จ', EN: 'Failed to load products' },
  toastSaveSuccess: { TH: 'บันทึกสำเร็จ', EN: 'Save successful' },
  toastDeleteSuccess: { TH: 'ลบสำเร็จ', EN: 'Delete successful' },
  toastUploadSuccess: { TH: 'อัปโหลดรูปสำเร็จ', EN: 'Images uploaded' },
  newLabel: { TH: 'ใหม่', EN: 'New' },
  create: { TH: 'สร้างใหม่', EN: 'Create' },
  editLabel: { TH: 'แก้ไข', EN: 'Edit' },
  noCategories: { TH: 'ยังไม่มีหมวดหมู่', EN: 'No categories yet' },
  enterCategoryName: { TH: 'ชื่อหมวดหมู่', EN: 'Category Name' },
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
