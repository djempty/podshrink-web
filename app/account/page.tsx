'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, CreditCard, Shield, Trash2, Crown, ArrowLeft } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (session?.user?.id) {
      fetch(`${API_URL}/api/auth/me?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => { setUserInfo(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session, status, router]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          currentPassword: passwordForm.current,
          newPassword: passwordForm.newPass,
        }),
      });
      if (res.ok) {
        setPasswordMsg('Password updated successfully');
        setPasswordForm({ current: '', newPass: '', confirm: '' });
      } else {
        const data = await res.json();
        setPasswordMsg(data.error || 'Failed to update password');
      }
    } catch {
      setPasswordMsg('An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/stripe/portal?userId=${session.user.id}`);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Failed to open billing portal');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        alert('Failed to delete account');
      }
    } catch {
      alert('An error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!session) return null;

  const planLabel = userInfo?.plan === 'pro' ? 'Pro' : userInfo?.plan === 'standard' ? 'Standard' : 'Free';

  return (
    <div className="min-h-screen bg-[#121212] px-4 md:px-8 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Account Settings</h1>

        {/* Profile Section */}
        <section className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide">Email</label>
              <p className="text-white text-sm">{session.user?.email}</p>
            </div>
            {session.user?.name && (
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wide">Name</label>
                <p className="text-white text-sm">{session.user.name}</p>
              </div>
            )}
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Subscription</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{planLabel} Plan</p>
              {userInfo?.shrinkLimit !== null && (
                <p className="text-gray-500 text-sm">
                  {userInfo?.shrinkCount || 0} / {userInfo?.shrinkLimit} shrinks used this month
                </p>
              )}
              {userInfo?.shrinkLimit === null && (
                <p className="text-gray-500 text-sm">Unlimited shrinks</p>
              )}
            </div>
            <div className="flex gap-2">
              {userInfo?.plan && userInfo.plan !== 'free' ? (
                <button
                  onClick={handleManageSubscription}
                  className="px-4 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Manage
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Change Password Section */}
        <section className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.current}
              onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPass}
              onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirm}
              onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
              required
            />
            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                {passwordMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-[#1a1a1a] border border-red-900/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={20} className="text-red-400" />
            <h2 className="text-lg font-semibold text-white">Danger Zone</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2.5 border border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2.5 bg-[#252525] hover:bg-[#333] text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
