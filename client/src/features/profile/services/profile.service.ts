// เส้นทาง: client/src/features/profile/services/profile.service.ts

// 💡 ตั้งค่า URL ของ Backend
const API_URL = 'http://localhost:3000/profile';

// ✅ เพิ่ม Helper Function สำหรับหยิบ Token จากกระเป๋ามาสร้างเป็น Header ตั๋วผ่านทาง
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // ถ้ามี Token ให้แนบไปด้วย
  };
};

// 1. ดึงข้อมูลโปรไฟล์
export const fetchProfile = async () => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeaders(), // ✅ แนบ Token
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

// 2. อัปเดตโปรไฟล์
export const updateProfile = async (data: { name?: string; phone?: string }) => {
  const res = await fetch(API_URL, {
    method: 'PATCH',
    headers: getAuthHeaders(), // ✅ แนบ Token
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

// 3. ดึงข้อมูลที่อยู่ทั้งหมด
export const fetchAddresses = async () => {
  const res = await fetch(`${API_URL}/addresses`, {
    method: 'GET',
    headers: getAuthHeaders(), // ✅ แนบ Token
  });
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
};

// 4. เพิ่มที่อยู่ใหม่
export const createAddress = async (data: { label: string; address: string; isDefault?: boolean }) => {
  const res = await fetch(`${API_URL}/addresses`, {
    method: 'POST',
    headers: getAuthHeaders(), // ✅ แนบ Token
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create address');
  return res.json();
};

// 5. ลบที่อยู่
export const deleteAddress = async (id: number) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(), // ✅ แนบ Token
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
};

// 6. อัปเดตที่อยู่
export const updateAddress = async (id: number, data: { label?: string; address?: string; isDefault?: boolean }) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(), // ✅ แนบ Token
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
};

// ✅ 7. เพิ่มฟังก์ชันสำหรับเปลี่ยนรหัสผ่าน (Step 2)
export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const res = await fetch(`${API_URL}/change-password`, {
    method: 'PATCH',
    headers: getAuthHeaders(), // แนบ Token ไปยืนยันตัวตนด้วย
    body: JSON.stringify(data),
  });

  // ถ้า Backend ส่ง Error กลับมา (เช่น รหัสผ่านผิด, สั้นไป) ให้ดึงข้อความออกมาโชว์
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join('\n') // ถ้ามีหลาย Error ให้ขึ้นบรรทัดใหม่
      : errorData.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้';
    throw new Error(errorMessage);
  }

  return res.json(); // ถ้าผ่านฉลุย ส่งข้อความ "อัปเดตรหัสผ่านสำเร็จเรียบร้อย" กลับไป
};