// เส้นทาง: client/src/features/profile/services/profile.service.ts

// 💡 ตั้งค่า URL ของ Backend (ถ้าพอร์ตไม่ใช่ 3000 ให้เปลี่ยนด้วยนะครับ)
const API_URL = 'http://localhost:3000/profile';

// 1. ดึงข้อมูลโปรไฟล์
export const fetchProfile = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

// 2. อัปเดตโปรไฟล์
export const updateProfile = async (data: { name?: string; phone?: string }) => {
  const res = await fetch(API_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

// 3. ดึงข้อมูลที่อยู่ทั้งหมด
export const fetchAddresses = async () => {
  const res = await fetch(`${API_URL}/addresses`);
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
};

// 4. เพิ่มที่อยู่ใหม่
export const createAddress = async (data: { label: string; address: string; isDefault?: boolean }) => {
  const res = await fetch(`${API_URL}/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create address');
  return res.json();
};

// 5. ลบที่อยู่
export const deleteAddress = async (id: number) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
};

// 6. อัปเดตที่อยู่
export const updateAddress = async (id: number, data: { label?: string; address?: string; isDefault?: boolean }) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
};