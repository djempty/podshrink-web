'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import { ArrowLeft, Trash2, Edit3, Headphones, Heart, Calendar, Mail } from 'lucide-react';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editPlan, setEditPlan] = useState('');
  const [editCount, setEditCount] = useState('');

  useEffect(() => {
    adminApi.getUser(userId)
      .then(d => {
        setData(d);
        setEditPlan(d.user.plan);
        setEditCount(String(d.user.shrinkCount));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    await adminApi.updateUser(userId, { plan: editPlan, shrinkCount: parseInt(editCount) });
    const d = await adminApi.getUser(userId);
    setData(d);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${data.user.email}? This cannot be undone.`)) return;
    await adminApi.deleteUser(userId);
    router.push('/admin/users');
  };

  const handleDeleteShrink = async (shrinkId: number) => {
    if (!confirm('Delete this shrink?')) return;
    await adminApi.deleteShrink(shrinkId);
    const d = await adminApi.getUser(userId);
    setData(d);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">User not found</div>;

  const { user, shrinks, favoritesCount } = data;

  const planColors: Record<string, string> = {
    free: 'bg-gray-700/50 text-gray-400',
    standard: 'bg-blue-600/20 text-blue-400',
    pro: 'bg-amber-600/20 text-amber-400',
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
      <Link href="/admin/users" className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Users
      </Link>

      {/* User Info Card */}
      <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">{user.email}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${planColors[user.plan]}`}>
                {user.plan}
              </span>
            </div>
            <p className="text-gray-500 text-sm">User #{user.id}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(!editing)} className="px-3 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg text-sm transition-colors flex items-center gap-1.5">
              <Edit3 size={13} /> Edit
            </button>
            <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600/10 text-red-400 hover:bg-red-600/20 rounded-lg text-sm transition-colors flex items-center gap-1.5">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>

        {editing && (
          <div className="bg-[#0f0f0f] rounded-lg p-4 mb-4 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-gray-400 text-xs mb-1">Plan</label>
              <select value={editPlan} onChange={e => setEditPlan(e.target.value)} className="w-full px-3 py-2 bg-[#141414] border border-gray-700 rounded-lg text-white text-sm">
                <option value="free">Free</option>
                <option value="standard">Standard</option>
                <option value="pro">Pro</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 text-xs mb-1">Shrink Count</label>
              <input type="number" value={editCount} onChange={e => setEditCount(e.target.value)} className="w-full px-3 py-2 bg-[#141414] border border-gray-700 rounded-lg text-white text-sm" />
            </div>
            <button onClick={handleSave} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
              Save
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-600" />
            <span className="text-gray-400">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Headphones size={14} className="text-gray-600" />
            <span className="text-gray-400">{user.shrinkCount} shrinks used</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Heart size={14} className="text-gray-600" />
            <span className="text-gray-400">{favoritesCount} favorites</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {user.stripeCustomerId && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <a
              href={`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`}
              target="_blank"
              rel="noopener"
              className="text-blue-400 text-xs hover:text-blue-300"
            >
              View in Stripe Dashboard →
            </a>
          </div>
        )}
      </div>

      {/* User's Shrinks */}
      <h2 className="text-lg font-semibold text-white mb-4">Shrinks ({shrinks.length})</h2>
      {shrinks.length === 0 ? (
        <div className="text-gray-500 text-sm">No shrinks</div>
      ) : (
        <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase">Episode</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase">Show</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase">Duration</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase">Voice</th>
                <th className="text-left px-4 py-3 text-gray-500 text-xs font-medium uppercase">Date</th>
                <th className="text-right px-4 py-3 text-gray-500 text-xs font-medium uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {shrinks.map((s: any) => (
                <tr key={s.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a]">
                  <td className="px-4 py-3 text-white text-sm max-w-[200px] truncate">{s.episodeTitle}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm max-w-[150px] truncate">{s.showTitle}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || 'text-gray-400'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{s.targetDurationMinutes}min</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{s.voiceLabel}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeleteShrink(s.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
