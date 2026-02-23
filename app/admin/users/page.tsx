'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import { Search, ChevronLeft, ChevronRight, Trash2, Edit3, ExternalLink } from 'lucide-react';

export default function AdminUsersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editPlan, setEditPlan] = useState('');
  const [editShrinkCount, setEditShrinkCount] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminApi.getUsers(page, search, planFilter)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, planFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (user: any) => {
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(user.id);
      fetchUsers();
    } catch { alert('Failed to delete user'); }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditPlan(user.plan);
    setEditShrinkCount(String(user.shrinkCount));
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await adminApi.updateUser(editingUser.id, {
        plan: editPlan,
        shrinkCount: parseInt(editShrinkCount),
      });
      setEditingUser(null);
      fetchUsers();
    } catch { alert('Failed to update user'); }
  };

  const planBadge = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-700/50 text-gray-400',
      standard: 'bg-blue-600/20 text-blue-400',
      pro: 'bg-amber-600/20 text-amber-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[plan] || colors.free}`}>
        {plan}
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Users</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email..."
            className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <select
          value={planFilter}
          onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-[#141414] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="standard">Standard</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Plan</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Shrinks</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Stripe</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Joined</th>
              <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : data?.users?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No users found</td></tr>
            ) : (
              data?.users?.map((user: any) => (
                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${user.id}`} className="text-white text-sm hover:text-purple-400 transition-colors">
                      {user.email}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{planBadge(user.plan)}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{user.shrinkCount}</td>
                  <td className="px-4 py-3">
                    {user.stripeCustomerId ? (
                      <a
                        href={`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`}
                        target="_blank"
                        rel="noopener"
                        className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1"
                      >
                        <ExternalLink size={12} /> Stripe
                      </a>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-1.5 text-gray-500 hover:text-purple-400 transition-colors" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(user)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-500 text-sm">{data.pagination.total} users</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-gray-400 text-sm">Page {page} of {data.pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setEditingUser(null)}>
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-4">Edit User: {editingUser.email}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1">Plan</label>
                <select
                  value={editPlan}
                  onChange={e => setEditPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="free">Free</option>
                  <option value="standard">Standard</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1">Shrink Count</label>
                <input
                  type="number"
                  value={editShrinkCount}
                  onChange={e => setEditShrinkCount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2 bg-[#0f0f0f] border border-gray-700 text-gray-400 rounded-lg text-sm hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
