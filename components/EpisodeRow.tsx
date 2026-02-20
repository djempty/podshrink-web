'use client';

import { useRouter } from 'next/navigation';
import { Episode } from '@/lib/types';
import { Play, Pause, MoreVertical, Bookmark } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { resolveAudioUrl } from '@/lib/api';

interface EpisodeRowProps {
  episode: Episode;
  showTitle?: string;
  showImage?: string;
  shrinkState?: { status: 'shrinking' | 'complete'; audioUrl?: string };
  onShrinkClick?: () => void;
}

export default function EpisodeRow({ episode, showTitle, showImage, shrinkState, onShrinkClick }: EpisodeRowProps) {
  const router = useRouter();
  const { track, isPlaying, currentTime, setTrack, play, pause } = useAudioPlayer();

  const isCurrentTrack = track?.id === episode.id;

  const handlePlay = () => {
    if (isCurrentTrack && isPlaying) { pause(); return; }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return `${d.getMonth() + 1}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    return `${Math.floor(seconds / 60)} mins`;
  };

  // Determine play button state
  const renderPlayButton = () => {
    if (shrinkState?.status === 'shrinking') {
      return (
        <button disabled className="flex items-center gap-2 px-5 py-2 bg-yellow-600/80 text-white rounded-md text-sm font-medium cursor-not-allowed">
          Shrinking...
        </button>
      );
    }
    if (shrinkState?.status === 'complete') {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); handlePlayShrink(); }}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Play size={14} fill="white" />
          Play PodShrink
        </button>
      );
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); handlePlay(); }}
        className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
      >
        {isCurrentTrack && isPlaying ? (
          <><Pause size={14} fill="white" />Pause</>
        ) : isCurrentTrack && currentTime > 0 ? (
          <><Play size={14} fill="white" />Resume</>
        ) : (
          <><Play size={14} fill="white" />Play</>
        )}
      </button>
    );
  };

  return (
    <div
      onClick={() => router.push(`/episodes/${episode.id}`)}
      className="group flex items-start gap-3 md:gap-4 py-5 md:py-6 px-3 md:px-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors relative cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="hidden md:block flex-shrink-0">
        <img
          src={episode.imageUrl || showImage || '/logo.png'}
          alt={episode.title}
          className="w-[100px] h-[100px] rounded-lg object-cover"
        />
      </div>

      {/* Episode Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{formatDate(episode.pubDate)}</p>
        <h3 className="text-white font-semibold text-base leading-tight mb-1">{episode.title}</h3>
        <p className="text-gray-500 text-xs mb-2">{formatDuration(episode.duration)}</p>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{episode.description || ''}</p>

        <div className="flex items-center gap-3 mt-4">
          {renderPlayButton()}
          <button
            onClick={(e) => { e.stopPropagation(); onShrinkClick?.(); }}
            className="px-5 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-sm font-medium transition-colors"
          >
            Shrink It!
          </button>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-6 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-800 rounded-full">
          <MoreVertical size={18} className="text-gray-400" />
        </button>
        <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-800 rounded-full">
          <Bookmark size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
