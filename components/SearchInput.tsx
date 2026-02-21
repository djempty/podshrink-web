'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { api, DiscoverPodcast } from '@/lib/api';

export default function SearchInput({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DiscoverPodcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.searchPodcasts(query.trim());
        setResults(data.podcasts.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = async (podcast: DiscoverPodcast) => {
    setOpen(false);
    setQuery('');
    if (podcast.feedUrl) {
      try {
        const show = await api.addShow(podcast.feedUrl);
        router.push(`/shows/${show.id}`);
      } catch {
        // Show might already exist
        const shows = await api.getShows();
        const match = shows.find(s => s.title === podcast.title || s.rssUrl === podcast.feedUrl);
        if (match) router.push(`/shows/${match.id}`);
      }
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="w-full bg-[#1a1a1a] text-white text-sm rounded-md pl-9 pr-8 py-2 border border-gray-800 focus:outline-none focus:border-purple-500"
      />
      {query && (
        <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
          <X size={14} />
        </button>
      )}

      {/* Results dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-[100] max-h-[500px] overflow-y-auto">
          {loading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
          )}
          {results.map((podcast) => (
            <button
              key={podcast.id}
              onClick={() => handleSelect(podcast)}
              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-[#252525] transition-colors text-left"
            >
              <img
                src={podcast.image || '/logo.png'}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{podcast.title}</p>
                <p className="text-gray-500 text-xs truncate">{podcast.artist}</p>
              </div>
              <span className="text-gray-600 text-xs flex-shrink-0">{podcast.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
