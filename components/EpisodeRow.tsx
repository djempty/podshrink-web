'use client';

import { useRouter } from 'next/navigation';
import { Episode } from '@/lib/types';
import { Play, Pause, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { resolveAudioUrl } from '@/lib/api';

interface EpisodeRowProps {
  episode: Episode;
  showTitle?: string;
  showImage?: string;
  showId?: number;
  shrinkState?: { status: 'shrinking' | 'complete'; audioUrl?: string };
  onShrinkClick?: () => void;
}

export default function EpisodeRow({ episode, showTitle, showImage, showId, shrinkState, onShrinkClick }: EpisodeRowProps) {
  const router = useRouter();
  const { track, isPlaying, currentTime, setTrack, play, pause } = useAudioPlayer();

  const isCurrentTrack = track?.id === episode.id;
  const isShrinkTrack = track?.id === episode.id + 100000;

  const handlePlay = () => {
    if (isCurrentTrack && isPlaying) { pause(); return; }
    if (isCurrentTrack) { play(); return; }
    setTrack({
      id: episode.id,
      title: episode.title,
      showTitle: showTitle || episode.show?.title || '',
      audioUrl: episode.audioUrl,
      imageUrl: episode.imageUrl || showImage || '',
      duration: episode.duration || 0,
    });
    play();
  };

  const handlePlayShrink = () => {
    if (isShrinkTrack && isPlaying) { pause(); return; }
    if (isShrinkTrack) { play(); return; }
    if (shrinkState?.audioUrl) {
      setTrack({
        id: episode.id + 100000,
        title: `${episode.title} (PodShrink)`,
        showTitle: showTitle || episode.show?.title || '',
        audioUrl: resolveAudioUrl(shrinkState.audioUrl),
        imageUrl: episode.imageUrl || showImage || '',
        duration: 0,
      });
      play();
    }
  };

  const formatRelativeDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const renderPlayButton = () => {
    if (shrinkState?.status === 'shrinking') {
      return (
        <button disabled className="flex items-center gap-2 px-4 py-1.5 bg-purple-600/40 text-purple-300 rounded-md text-xs font-medium cursor-not-allowed">
          <Loader2 size={12} className="animate-spin" />
          Shrinking...
        </button>
      );
    }
    if (shrinkState?.status === 'complete') {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); handlePlayShrink(); }}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2EA84A] hover:bg-[#259A3F] text-white rounded-md text-xs font-medium transition-colors"
        >
          {isShrinkTrack && isPlaying ? (
            <><Pause size={12} fill="white" />Pause</>
          ) : (
            <><Play size={12} fill="white" />PodShrink</>
          )}
        </button>
      );
    }
    return null;
  };

  return (
    <div
      onClick={() => router.push(`/episodes/${episode.id}`)}
      className="group flex items-start gap-3 md:gap-4 py-4 px-3 md:px-4 border-b border-gray-800/60 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={episode.imageUrl || showImage || '/logo.png'}
          alt={episode.title}
          className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-lg object-cover"
        />
      </div>

      {/* Episode Info — capped at 75% width */}
      <div className="flex-1 min-w-0 max-w-[75%]">
        <p className="text-xs text-gray-500 mb-0.5">{formatRelativeDate(episode.pubDate)}</p>
        <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-1">{episode.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{episode.description || ''}</p>

        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); handlePlay(); }}
            className="flex items-center gap-1.5 px-4 py-1.5 border border-purple-500/60 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-xs font-medium transition-colors"
          >
            {isCurrentTrack && isPlaying ? (
              <><Pause size={12} fill="currentColor" />Pause</>
            ) : (
              <><Play size={12} fill="currentColor" />Play</>
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onShrinkClick?.(); }}
            className="px-4 py-1.5 border border-purple-500/60 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-xs font-medium transition-colors"
          >
            Shrink It!
          </button>
          {renderPlayButton()}
        </div>
      </div>

      {/* Duration — right side */}
      {episode.duration > 0 && (
        <div className="flex-shrink-0 text-right self-center">
          <span className="text-gray-500 text-sm">{formatDuration(episode.duration)}</span>
        </div>
      )}
    </div>
  );
}
