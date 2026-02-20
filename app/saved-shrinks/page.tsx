'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Shrink } from '@/lib/types';
import { Play, Download, Clock, Calendar } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import Link from 'next/link';

export default function SavedShrinksPage() {
  const [shrinks, setShrinks] = useState<Shrink[]>([]);
  const [loading, setLoading] = useState(true);
  const { setTrack, play } = useAudioPlayer();

  useEffect(() => {
    api.getAllShrinks()
      .then(setShrinks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePlay = (shrink: Shrink) => {
    if (!shrink.audioUrl) return;
    setTrack({
      id: shrink.id + 200000,
      title: `${shrink.episode?.title || 'Episode'} (PodShrink)`,
      showTitle: (shrink as any).show?.title || '',
      audioUrl: shrink.audioUrl,
      imageUrl: shrink.episode?.imageUrl || (shrink as any).show?.imageUrl || '',
      duration: ((shrink as any).targetDurationMinutes || shrink.targetDuration || 0) * 60,
    });
    play();
  };

  const handleDownload = (shrink: Shrink) => {
    if (!shrink.audioUrl) return;
    const a = document.createElement('a');
    a.href = shrink.audioUrl;
    a.download = `podshrink-${shrink.episode?.title || shrink.id}.mp3`;
    a.click();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Saved Shrinks</h1>
        <Link href="/signup" className="px-4 md:px-6 py-2 border border-purple-500 text-purple-400 rounded-md hover:bg-purple-500 hover:text-white transition-colors text-sm font-medium">
          Sign Up
        </Link>
      </header>

      <div className="px-4 md:px-8">
        {shrinks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No shrinks yet</p>
            <p className="text-sm">Go to a show and click &quot;Shrink It!&quot; to create your first PodShrink.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {shrinks.map((shrink) => (
              <div key={shrink.id} className="flex items-center gap-4 py-4 px-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors rounded">
                {/* Thumbnail */}
                <img
                  src={shrink.episode?.imageUrl || (shrink as any).show?.imageUrl || '/logo.png'}
                  alt=""
                  className="w-14 h-14 rounded object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {shrink.episode?.title || `Episode #${shrink.episodeId}`}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{(shrink as any).show?.title || ''}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} />{(shrink as any).targetDurationMinutes || shrink.targetDuration} min</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(shrink.createdAt)}</span>
                    <span className={`font-medium ${shrink.status === 'complete' ? 'text-green-500' : shrink.status === 'error' ? 'text-red-400' : 'text-yellow-500'}`}>
                      {shrink.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {shrink.status === 'complete' && shrink.audioUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlay(shrink)}
                      className="p-2 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
                    >
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </button>
                    <button
                      onClick={() => handleDownload(shrink)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <Download size={16} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
