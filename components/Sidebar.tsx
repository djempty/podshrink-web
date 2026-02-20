'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Radio, Grid, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/browse', label: 'Browse', icon: Radio },
    { href: '/add', label: 'Add Show', icon: Plus },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-card text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-dark-card border-r border-gray-800 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <img src="/logo.png" alt="PodShrink" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-white">PodShrink</h1>
                <p className="text-xs text-gray-400">AI Podcast Summaries</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${active 
                      ? 'bg-dark-accent text-white font-medium' 
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
            <p>© 2024 PodShrink</p>
            <p className="mt-1">Powered by ElevenLabs & OpenAI</p>
          </div>
        </div>
      </aside>
    </>
  );
}
