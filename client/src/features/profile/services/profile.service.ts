


const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/profile`;


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchProfile = async () => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateProfile = async (data: { name?: string; phone?: string; bank_name?: string; bank_account?: string }) => {
  const res = await fetch(API_URL, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const fetchAddresses = async () => {
  const res = await fetch(`${API_URL}/addresses`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
};

export const createAddress = async (data: { label: string; address: string; isDefault?: boolean }) => {
  const res = await fetch(`${API_URL}/addresses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create address');
  return res.json();
};

export const deleteAddress = async (id: number) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete address');
  return res.json();
};

export const updateAddress = async (id: number, data: { label?: string; address?: string; isDefault?: boolean }) => {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update address');
  return res.json();
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const res = await fetch(`${API_URL}/change-password`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });


  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join('\n')
      : errorData.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้';
    throw new Error(errorMessage);
  }

  return res.json();
};

export const fetchMyOrders = async () => {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  const rawOrders = await res.json();

  // Map backend status to frontend status
  const statusMap: Record<string, string> = {
    pending: 'pending_payment',
    paid: 'processing',
    to_ship: 'processing',
    shipped: 'shipping',
    completed: 'delivered',
    cancelled: 'delivered',
  };

  return rawOrders.map((order: any) => ({
    id: order.order_number || `ORD-${order.id}`,
    date: new Date(order.created_at).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    total: Number(order.total_price).toLocaleString(),
    status: statusMap[order.status] || 'pending_payment',
    items: order.items?.length || 0,
    tracking: order.status === 'shipped' ? 'กำลังจัดส่ง' : order.status === 'completed' ? 'จัดส่งแล้ว' : 'กำลังจัดเตรียม',
    address: order.shipping_address || 'ไม่ระบุที่อยู่',
    itemsDetail: (order.items || []).map((item: any) => ({
      name: item.product?.name || 'สินค้า',
      qty: item.quantity,
      price: Number(item.price_at_purchase).toLocaleString(),
      image: item.product?.imageUrl || item.product?.image_url || '/placeholder.png',
    })),
  }));
};