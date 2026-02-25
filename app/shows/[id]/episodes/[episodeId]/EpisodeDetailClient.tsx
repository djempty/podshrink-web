'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Episode } from '@/lib/types';
import { Play, Pause, ArrowLeft, Sparkles } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import ShrinkPanel from '@/components/ShrinkPanel';

interface EpisodeDetailClientProps {
  episode: Episode & { show?: { id: number; title: string; imageUrl: string } };
  showId: string;
}

export default function EpisodeDetailClient({ episode, showId }: EpisodeDetailClientProps) {
  const router = useRouter();
  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();
  const [showShrinkPanel, setShowShrinkPanel] = useState(false);

  const isEpisodePlaying = track?.id === episode.id && isPlaying;
  const isEpisodeLoaded = track?.id === episode.id;

  const handlePlayPause = () => {
    if (isEpisodePlaying) {
      pause();
      return;
    }
    if (isEpisodeLoaded) {
      play();
      return;
    }
    setTrack({
      id: episode.id,
      title: episode.title,
      showTitle: episode.show?.title || '',
      audioUrl: episode.audioUrl,
      imageUrl: episode.imageUrl || episode.show?.imageUrl || '',
      duration: episode.duration || 0,
    });
    play();
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <div className="px-4 md:px-8 pt-6 pb-6">
        {/* Back button */}
        <button
          onClick={() => router.push(`/shows/${showId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to {episode.show?.title || 'Show'}</span>
        </button>

        {/* Episode Header */}
        <div className="flex gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <img
              src={episode.imageUrl || episode.show?.imageUrl || '/logo.png'}
              alt={episode.title}
              className="w-[120px] h-[120px] md:w-[240px] md:h-[240px] rounded-xl object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1 flex flex-col justify-start pt-[6px] min-w-0">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Episode</p>
            <h1 className="text-xl md:text-4xl font-bold text-white mb-2 line-clamp-3">
              {episode.title}
            </h1>
            {episode.show && (
              <p className="text-gray-300 text-sm md:text-base mb-2">{episode.show.title}</p>
            )}
            <div className="flex items-center gap-3 text-gray-400 text-xs md:text-sm mb-3">
              {episode.pubDate && <span>{formatDate(episode.pubDate)}</span>}
              {episode.duration && <span>•</span>}
              {episode.duration && <span>{formatDuration(episode.duration)}</span>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-semibold transition-colors"
          >
            {isEpisodePlaying ? (
              <><Pause size={18} fill="white" />Pause</>
            ) : isEpisodeLoaded ? (
              <><Play size={18} fill="white" />Resume</>
            ) : (
              <><Play size={18} fill="white" />Play Episode</>
            )}
          </button>
          <button
            onClick={() => setShowShrinkPanel(true)}
            className="flex items-center gap-2 px-5 py-3 border border-gray-600 hover:border-purple-500 text-white rounded-full text-sm font-medium transition-colors"
          >
            <Sparkles size={18} />
            Shrink It
          </button>
        </div>

        {/* Description */}
        {episode.description && (
          <div className="mt-6 max-w-3xl">
            <h2 className="text-lg font-bold text-white mb-2">About this episode</h2>
            <div 
              className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: episode.description }}
            />
          </div>
        )}
      </div>

      {/* Shrink Panel */}
      {showShrinkPanel && (
        <ShrinkPanel
          episode={episode}
          showImage={episode.show?.imageUrl}
          onClose={() => setShowShrinkPanel(false)}
          onShrinkStarted={() => {}}
          onShrinkComplete={() => {}}
          onShrinkError={() => {}}
        />
      )}
    </div>
  );
}
