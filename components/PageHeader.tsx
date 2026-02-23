'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Search } from 'lucide-react';
import SearchInput from './SearchInput';

interface PageHeaderProps {
  title: string;
  showSignUp?: boolean;
  showSearch?: boolean;
}

export default function PageHeader({ title, showSignUp = true, showSearch = false }: PageHeaderProps) {
  const { data: session, status } = useSession();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchExpanded(false);
      }
    };

    if (searchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchExpanded]);

  return (
    <header className="sticky top-0 md:top-[55px] z-30 bg-[#121212] flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      
      <div className="flex items-center gap-3">
        {/* Sign Up Button - shown to left of search */}
        {showSignUp && status !== 'loading' && !session && (
          <Link
            href="/signup"
            className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-sm font-medium"
          >
            Sign Up
          </Link>
        )}
        
        {/* Expandable Search */}
        {showSearch && (
          <div ref={searchRef} className="relative">
            {!searchExpanded ? (
              <button
                onClick={() => setSearchExpanded(true)}
                className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            ) : (
              <div className="w-[180px] md:w-[240px]">
                <SearchInput 
                  onSelect={() => setSearchExpanded(false)}
                  className="[&_input]:py-2 [&_input]:text-sm"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
