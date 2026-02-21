'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, Heart, Radio, Grid3x3, DollarSign, Menu, X, LogIn, User, Sparkles, LogOut, UserPlus, Settings } from 'lucide-react';
import SearchInput from './SearchInput';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shows', label: 'Shows', icon: Radio },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/categories', label: 'Categories', icon: Grid3x3 },
  { href: '/saved-shrinks', label: 'Saved Shrinks', icon: Sparkles },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 w-full bg-[#0a0a0a] z-50 flex items-center justify-between px-4 py-4 border-b border-gray-800 safe-area-inset">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="PodShrink" className="w-10 h-10" />
          <span className="text-2xl font-bold text-white">PodShrink</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-blue-500 p-2">
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0a0a0a] z-40 pt-20 px-6 flex flex-col">
          {/* Search */}
          <div className="my-4">
            <SearchInput className="py-1 [&_input]:text-base" onSelect={() => setMobileOpen(false)} />
          </div>

          {/* Nav */}
          <nav className="mt-4 flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-md text-lg transition-colors ${
                        isActive ? 'text-white font-semibold' : 'text-gray-300'
                      }`}
                    >
                      <Icon size={20} className="text-blue-500" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="pb-8 border-t border-gray-800 pt-4">
            {!loading && !session && (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </div>
            )}

            {!loading && session && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {session.user?.name || session.user?.email}
                    </p>
                    <p className="text-gray-500 text-xs">Free Plan</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    <Settings size={18} />
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-[260px] bg-[#0a0a0a] h-screen fixed left-0 top-0 flex-col border-r border-gray-800 z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 p-6 pb-8">
          <img src="/logo.png" alt="PodShrink" className="w-11 h-11" />
          <span className="text-2xl font-bold text-white">PodShrink</span>
        </Link>

        {/* Search */}
        <div className="px-4 mb-6 mt-2">
          <SearchInput />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-blue-500'} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Auth Section */}
        <div className="px-4 pb-6 border-t border-gray-800 pt-4">
          {!loading && !session && (
            <div className="space-y-2">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <UserPlus size={16} />
                Sign Up
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg font-medium transition-colors text-sm"
              >
                <LogIn size={16} />
                Login
              </Link>
            </div>
          )}

          {!loading && session && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {session.user?.name || session.user?.email}
                  </p>
                  <p className="text-gray-500 text-xs">Free Plan</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  href="/account"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <Settings size={16} />
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
