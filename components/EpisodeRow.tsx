'use client';

import { Episode } from '@/lib/types';
import { Play, MoreVertical, Bookmark } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';

interface EpisodeRowProps {
  episode: Episode;
  showId: number;
}

export default function EpisodeRow({ episode, showId }: EpisodeRowProps) {
  const { setTrack, play } = useAudioPlayer();

  const handlePlay = () => {
    setTrack({
      id: episode.id,
      title: episode.title,
      showTitle: episode.show_title || episode.show?.title || '',
      audioUrl: episode.audio_url,
      imageUrl: episode.image_url || episode.show?.artwork_url || '',
      duration: episode.duration || 0,
    });
    play();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  return (
    <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors relative">
      {/* Episode Number Badge */}
      <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-sm font-medium">
        {episode.episode_number || '•'}
      </div>

      {/* Thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={episode.image_url || '/placeholder.png'}
          alt={episode.title}
          className="w-20 h-20 rounded object-cover"
        />
      </div>

      {/* Episode Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 mr-4">
            <p className="text-xs text-gray-500 mb-1">{formatDate(episode.pub_date)}</p>
            <h3 className="text-white font-semibold text-base leading-tight mb-1 line-clamp-2">
              {episode.title}
            </h3>
            <p className="text-gray-500 text-xs mb-2">
              {episode.duration ? formatDuration(episode.duration) : ''}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {episode.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Play size={16} fill="white" />
            Play
          </button>
          <button
            className="px-4 py-2 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-sm font-medium transition-colors"
          >
            Shrink It!
          </button>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
