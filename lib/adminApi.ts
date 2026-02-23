const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';

function getAdminKey(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem('adminKey') || '';
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': getAdminKey(),
      ...options?.headers,
    },
  });
  if (res.status === 403) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const adminApi = {
  getStats: () => adminFetch<any>('/api/admin/stats'),
  
  getUsers: (page = 1, search = '', plan = '') =>
    adminFetch<any>(`/api/admin/users?page=${page}&limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}${plan ? `&plan=${plan}` : ''}`),
  
  getUser: (id: number) => adminFetch<any>(`/api/admin/users/${id}`),
  
  updateUser: (id: number, data: { plan?: string; shrinkCount?: number }) =>
    adminFetch<any>(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  deleteUser: (id: number) =>
    adminFetch<any>(`/api/admin/users/${id}`, { method: 'DELETE' }),
  
  getShrinks: (page = 1, status = '') =>
    adminFetch<any>(`/api/admin/shrinks?page=${page}&limit=50${status ? `&status=${status}` : ''}`),
  
  deleteShrink: (id: number) =>
    adminFetch<any>(`/api/admin/shrinks/${id}`, { method: 'DELETE' }),
};
