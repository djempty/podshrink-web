'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Radio, Grid3x3, DollarSign, Search, Menu, X, LogIn, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/shows', label: 'Shows', icon: Radio },
  { href: '/categories', label: 'Categories', icon: Grid3x3 },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a0a0a] z-50 flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="PodShrink" className="w-8 h-8" />
          <span className="text-xl font-bold text-white">PodShrink</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0a0a0a] z-40 pt-16 px-6">
          {/* Login */}
          <Link
            href="/login"
            className="flex items-center gap-3 py-3 text-white text-lg"
            onClick={() => setMobileOpen(false)}
          >
            <LogIn size={20} className="text-blue-500" />
            Login
          </Link>

          {/* Search */}
          <div className="my-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#1a1a1a] text-white text-sm rounded-md pl-9 pr-3 py-3 border border-gray-700 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-4">
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

          {/* User section at bottom */}
          <div className="absolute bottom-8 left-6 right-6 flex items-center gap-3 py-4 border-t border-gray-800">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">User Name</p>
              <p className="text-gray-500 text-xs">Plan</p>
            </div>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1a1a1a] text-white text-sm rounded-md pl-9 pr-3 py-2 border border-gray-800 focus:outline-none focus:border-purple-500"
            />
          </div>
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
      </aside>
    </>
  );
}
