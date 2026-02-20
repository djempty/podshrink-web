'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Radio, Grid3x3, DollarSign, Search } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/shows', label: 'Shows', icon: Radio },
  { href: '/categories', label: 'Categories', icon: Grid3x3 },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-[#0a0a0a] h-screen fixed left-0 top-0 flex flex-col border-r border-gray-800 z-50">
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
  );
}
