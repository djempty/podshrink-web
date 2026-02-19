'use client';

import Link from 'next/link';
import { Episode } from '@/lib/types';
import { Play, Clock, Sparkles } from 'lucide-react';
import { useAudioStore } from '@/lib/store';

interface EpisodeCardProps {
  episode: Episode;
  shrinkStatus?: 'pending' | 'complete' | null;
  shrinkAudioUrl?: string;
}

export default function EpisodeCard({ episode, shrinkStatus, shrinkAudioUrl }: EpisodeCardProps) {
  const play = useAudioStore((state) => state.play);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handlePlayShrink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (shrinkAudioUrl && episode.show) {
      play({
        title: `${episode.title} (Shrunk)`,
        show: episode.show.title,
        artwork: episode.show.artwork_url,
        audioUrl: shrinkAudioUrl,
        episodeId: episode.id,
      });
    }
  };

  return (
    <Link href={`/episodes/${episode.id}`}>
      <div className="bg-dark-card rounded-lg p-4 hover:bg-dark-hover transition-colors group">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                {episode.title}
              </h3>
              {shrinkStatus === 'complete' && shrinkAudioUrl && (
                <button
                  onClick={handlePlayShrink}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors"
                  title="Play shrunk episode"
                >
                  <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                </button>
              )}
            </div>
            
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{episode.description}</p>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDuration(episode.duration)}
              </span>
              <span>{formatDate(episode.pub_date)}</span>
              {shrinkStatus === 'complete' && (
                <span className="flex items-center gap-1 text-purple-400 font-medium">
                  <Sparkles size={14} />
                  Shrunk
                </span>
              )}
              {shrinkStatus === 'pending' && (
                <span className="flex items-center gap-1 text-yellow-400 font-medium">
                  <Sparkles size={14} />
                  Processing...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
