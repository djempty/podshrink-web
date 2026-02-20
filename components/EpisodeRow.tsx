'use client';

import { Episode } from '@/lib/types';
import { Play, Pause, MoreVertical, Bookmark } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';

interface EpisodeRowProps {
  episode: Episode;
  showTitle?: string;
  showImage?: string;
}

export default function EpisodeRow({ episode, showTitle, showImage }: EpisodeRowProps) {
  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();

  const isCurrentTrack = track?.id === episode.id;

  const handlePlay = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
      return;
    }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  return (
    <div className="group flex items-start gap-3 md:gap-4 py-5 md:py-6 px-3 md:px-4 border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors relative">
      {/* Thumbnail - hidden on mobile */}
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
        <h3 className="text-white font-semibold text-base leading-tight mb-1">
          {episode.title}
        </h3>
        <p className="text-gray-500 text-xs mb-2">
          {formatDuration(episode.duration)}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {episode.description || 'No description available.'}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            {isCurrentTrack && isPlaying ? (
              <>
                <Pause size={14} fill="white" />
                Resume
              </>
            ) : (
              <>
                <Play size={14} fill="white" />
                Play
              </>
            )}
          </button>
          <button
            className="px-5 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-sm font-medium transition-colors"
          >
            Shrink It!
          </button>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-6 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <MoreVertical size={18} className="text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <Bookmark size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
