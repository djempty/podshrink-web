'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Trash2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminShrinksPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchShrinks = useCallback(() => {
    setLoading(true);
    adminApi.getShrinks(page, statusFilter)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetchShrinks(); }, [fetchShrinks]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this shrink? Audio will be removed from storage.')) return;
    try {
      await adminApi.deleteShrink(id);
      fetchShrinks();
    } catch { alert('Failed to delete'); }
  };

  const statusColors: Record<string, string> = {
    complete: 'bg-green-600/20 text-green-400',
    error: 'bg-red-600/20 text-red-400',
    queued: 'bg-gray-600/20 text-gray-400',
    transcribing: 'bg-blue-600/20 text-blue-400',
    scripting: 'bg-purple-600/20 text-purple-400',
    generating_audio: 'bg-amber-600/20 text-amber-400',
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Shrinks</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-[#141414] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
        >
          <option value="">All statuses</option>
          <option value="complete">Complete</option>
          <option value="error">Error</option>
          <option value="queued">Queued</option>
          <option value="transcribing">Transcribing</option>
          <option value="scripting">Scripting</option>
          <option value="generating_audio">Generating Audio</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">ID</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Episode</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Show</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Dur</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Voice</th>
              <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide">Date</th>
              <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium uppercase tracking-wide"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : data?.shrinks?.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">No shrinks found</td></tr>
            ) : (
              data?.shrinks?.map((s: any) => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs">#{s.id}</td>
                  <td className="px-4 py-3 text-white text-sm max-w-[180px] truncate">{s.episodeTitle}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm max-w-[120px] truncate">{s.showTitle}</td>
                  <td className="px-4 py-3">
                    {s.userEmail ? (
                      <Link href={`/admin/users/${s.userId}`} className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1">
                        <User size={11} /> {s.userEmail}
                      </Link>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || ''}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.targetDurationMinutes}m</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.voiceLabel}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
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
          <span className="text-gray-500 text-sm">{data.pagination.total} shrinks</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 text-gray-400 hover:text-white disabled:text-gray-700">
              <ChevronLeft size={16} />
            </button>
            <span className="text-gray-400 text-sm">Page {page} of {data.pagination.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))} disabled={page === data.pagination.totalPages} className="p-2 text-gray-400 hover:text-white disabled:text-gray-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Error details */}
      {data?.shrinks?.some((s: any) => s.status === 'error' && s.errorMessage) && statusFilter === 'error' && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-red-400 mb-3">Error Details</h3>
          {data.shrinks.filter((s: any) => s.errorMessage).map((s: any) => (
            <div key={s.id} className="bg-red-900/10 border border-red-800/30 rounded-lg p-3 mb-2">
              <div className="text-xs text-red-400 font-medium">#{s.id} — {s.episodeTitle}</div>
              <div className="text-xs text-red-300/70 mt-1">{s.errorMessage}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
