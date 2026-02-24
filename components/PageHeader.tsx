'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchInput from './SearchInput';

interface PageHeaderProps {
  title: string;
  showSearch?: boolean;
}

export default function PageHeader({ title, showSearch = false }: PageHeaderProps) {
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
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      
      <div className="flex items-center gap-3">
        {/* Expandable Search — only on Shows */}
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
