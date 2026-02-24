'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Headphones, LogOut, Shield, Megaphone, Network } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [key, setKey] = useState('');
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem('adminKey');
    if (stored) {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'X-Admin-Key': key },
      });
      if (res.status === 403) {
        setError('Invalid admin key');
        return;
      }
      if (!res.ok) {
        setError('Connection failed');
        return;
      }
      sessionStorage.setItem('adminKey', key);
      setAuthed(true);
    } catch {
      setError('Connection failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    setAuthed(false);
    setKey('');
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">PodShrink Control Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter admin key"
              className="w-full px-4 py-3 bg-[#141414] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  const nav = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/shrinks', label: 'Shrinks', icon: Headphones },
    { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
    { href: '/admin/architecture', label: 'Architecture', icon: Network },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0f0f0f] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-purple-400" />
            <span className="text-white font-bold text-sm">PodShrink Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-purple-600/20 text-purple-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-red-400 text-sm transition-colors w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
