'use client';

import { useState, useEffect } from 'react';
import { api, resolveAudioUrl } from '@/lib/api';
import { Shrink } from '@/lib/types';
import { Play, Pause, Download, Clock, Calendar } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import PageHeader from '@/components/PageHeader';

export default function SavedShrinksPage() {
  const [shrinks, setShrinks] = useState<Shrink[]>([]);
  const [loading, setLoading] = useState(true);
  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();

  useEffect(() => {
    api.getAllShrinks()
      .then(setShrinks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePlay = (shrink: Shrink) => {
    if (!shrink.audioUrl) return;
    const trackId = shrink.id + 200000;
    if (track?.id === trackId && isPlaying) { pause(); return; }
    if (track?.id === trackId) { play(); return; }
    setTrack({
      id: trackId,
      title: `${shrink.episode?.title || 'Episode'} (PodShrink)`,
      showTitle: (shrink as any).show?.title || '',
      audioUrl: resolveAudioUrl(shrink.audioUrl),
      imageUrl: shrink.episode?.imageUrl || (shrink as any).show?.imageUrl || '',
      duration: ((shrink as any).targetDurationMinutes || shrink.targetDuration || 0) * 60,
    });
    play();
  };

  const isShrinkPlaying = (shrink: Shrink) => track?.id === shrink.id + 200000 && isPlaying;

  const handleDownload = (shrink: Shrink) => {
    if (!shrink.audioUrl) return;
    const showTitle = (shrink as any).show?.title || '';
    const episodeTitle = shrink.episode?.title || `Episode-${shrink.episodeId}`;
    const safeName = `${showTitle ? showTitle + ' - ' : ''}${episodeTitle} (PodShrink)`.replace(/[^a-zA-Z0-9\s\-()]/g, '').trim();
    const a = document.createElement('a');
    a.href = resolveAudioUrl(shrink.audioUrl);
    a.download = `${safeName}.mp3`;
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
      <PageHeader title="Saved Shrinks" />

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
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 whitespace-nowrap"><Clock size={11} />{(shrink as any).targetDurationMinutes || shrink.targetDuration}m</span>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">{formatDate(shrink.createdAt)}</span>
                    <span className="text-gray-700">·</span>
                    <span className={`font-medium whitespace-nowrap ${shrink.status === 'complete' ? 'text-green-500' : shrink.status === 'error' ? 'text-red-400' : 'text-yellow-500'}`}>
                      {shrink.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {shrink.status === 'complete' && shrink.audioUrl && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlay(shrink)}
                      className="p-2 bg-[#2EA84A] hover:bg-[#259A3F] rounded-full transition-colors"
                    >
                      {isShrinkPlaying(shrink) ? (
                        <Pause size={16} fill="white" className="text-white" />
                      ) : (
                        <Play size={16} fill="white" className="text-white ml-0.5" />
                      )}
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
