'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { FileText, Clock, Search } from 'lucide-react';

const PER_PAGE = 100;

export default function TranscriptsPage() {
  const [shrinks, setShrinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.getAllShrinks()
      .then(all => {
        const completed = all.filter((s: any) => s.status === 'complete');
        setShrinks(completed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return shrinks;
    const q = search.toLowerCase();
    return shrinks.filter((s: any) =>
      (s.episode?.title || '').toLowerCase().includes(q) ||
      (s.episode?.show?.title || '').toLowerCase().includes(q)
    );
  }, [shrinks, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <PageHeader title="Transcripts" showSignUp={true} />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 flex-1 w-full">
        <p className="text-gray-400 text-sm mb-6">
          Browse AI-generated podcast summaries. Each transcript is a concise summary of a full podcast episode.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by episode or show name..."
            className="w-full bg-[#1a1a1a] text-white text-base md:text-sm rounded-lg pl-10 pr-4 py-3 border border-gray-800 focus:outline-none focus:border-purple-500 placeholder-gray-500"
          />
        </div>

        {/* Results count */}
        {search.trim() && (
          <p className="text-gray-500 text-xs mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</p>
        )}

        {paginated.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">{search ? 'No transcripts match your search.' : 'No transcripts available yet.'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map((shrink: any) => (
              <Link
                key={shrink.id}
                href={`/shrinks/${shrink.id}${search ? `?from=search&q=${encodeURIComponent(search)}` : ''}`}
                className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <img
                  src={shrink.episode?.imageUrl || shrink.episode?.show?.imageUrl || '/logo.png'}
                  alt=""
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{shrink.episode?.title || 'Episode'}</p>
                  <p className="text-gray-500 text-xs truncate">{shrink.episode?.show?.title || ''}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs flex-shrink-0">
                  <Clock size={12} />
                  {shrink.targetDurationMinutes || shrink.targetDuration}m
                </div>
                <FileText size={16} className="text-purple-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#252525]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
