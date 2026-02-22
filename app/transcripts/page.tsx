'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Footer from '@/components/Footer';
import { FileText, Clock } from 'lucide-react';

export default function TranscriptsPage() {
  const [shrinks, setShrinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllShrinks()
      .then(all => {
        const completed = all.filter((s: any) => s.status === 'complete');
        setShrinks(completed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

        {shrinks.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No transcripts available yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shrinks.map((shrink) => (
              <Link
                key={shrink.id}
                href={`/shrinks/${shrink.id}`}
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
      </div>

      <Footer />
    </div>
  );
}
