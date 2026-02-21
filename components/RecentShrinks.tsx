'use client';

import { Sparkles, Play, Pause, Download, Clock } from 'lucide-react';
import { Episode } from '@/lib/types';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { resolveAudioUrl } from '@/lib/api';

interface RecentShrinksProps {
  shrinks: {
    id: number;
    episode: Episode;
    audioUrl: string;
    targetDurationMinutes?: number;
    createdAt?: string;
  }[];
}

export default function RecentShrinks({ shrinks }: RecentShrinksProps) {
  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();

  if (shrinks.length === 0) return null;

  const isShrinkPlaying = (shrink: RecentShrinksProps['shrinks'][0]) =>
    track?.id === shrink.id + 200000 && isPlaying;

  const handlePlay = (shrink: RecentShrinksProps['shrinks'][0]) => {
    const shrinkTrackId = shrink.id + 200000;
    if (track?.id === shrinkTrackId && isPlaying) { pause(); return; }
    if (track?.id === shrinkTrackId) { play(); return; }
    setTrack({
      id: shrinkTrackId,
      title: `${shrink.episode.title} (PodShrink)`,
      showTitle: shrink.episode.show?.title || '',
      audioUrl: resolveAudioUrl(shrink.audioUrl),
      imageUrl: shrink.episode.imageUrl || shrink.episode.show?.imageUrl || '',
      duration: 0,
    });
    play();
  };

  const handleDownload = (shrink: RecentShrinksProps['shrinks'][0]) => {
    const showTitle = shrink.episode.show?.title || '';
    const episodeTitle = shrink.episode.title || `Episode`;
    const safeName = `${showTitle ? showTitle + ' - ' : ''}${episodeTitle} (PodShrink)`.replace(/[^a-zA-Z0-9\s\-()]/g, '').trim();
    const a = document.createElement('a');
    a.href = resolveAudioUrl(shrink.audioUrl);
    a.download = `${safeName}.mp3`;
    a.click();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <Sparkles className="text-purple-400" size={28} />
        Recently Shrunk
      </h2>
      <div className="space-y-1">
        {shrinks.map((shrink) => (
          <div key={shrink.id} className="flex items-center gap-4 py-4 px-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors rounded">
            {/* Thumbnail */}
            <img
              src={shrink.episode.imageUrl || shrink.episode.show?.imageUrl || '/logo.png'}
              alt=""
              className="w-14 h-14 rounded object-cover flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {shrink.episode.title}
              </p>
              <p className="text-gray-500 text-xs truncate">{shrink.episode.show?.title || ''}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                {shrink.targetDurationMinutes && (
                  <>
                    <span className="flex items-center gap-1 whitespace-nowrap"><Clock size={11} />{shrink.targetDurationMinutes}m</span>
                    <span className="text-gray-700">·</span>
                  </>
                )}
                {shrink.createdAt && (
                  <>
                    <span className="flex items-center gap-1 whitespace-nowrap">{formatDate(shrink.createdAt)}</span>
                    <span className="text-gray-700">·</span>
                  </>
                )}
                <span className="font-medium whitespace-nowrap text-green-500">complete</span>
              </div>
            </div>

            {/* Actions */}
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
          </div>
        ))}
      </div>
    </section>
  );
}
