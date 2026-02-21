'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Show, Episode } from '@/lib/types';
import { Heart, Play } from 'lucide-react';
import EpisodeRow from '@/components/EpisodeRow';
import ShrinkPanel from '@/components/ShrinkPanel';
import { useFavorites } from '@/lib/favoritesStore';
import { useAudioPlayer } from '@/lib/audioPlayerStore';

export default function ShowPage() {
  const params = useParams();
  const showId = parseInt(params.id as string, 10);

  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [shrinkEpisode, setShrinkEpisode] = useState<Episode | null>(null);
  const [shrinkStates, setShrinkStates] = useState<Record<number, { status: 'shrinking' | 'complete'; audioUrl?: string }>>({});
  const { isFavorite, toggle } = useFavorites();
  const { setTrack, play } = useAudioPlayer();

  useEffect(() => {
    Promise.all([api.getShow(showId), api.getEpisodes(showId)])
      .then(([s, e]) => {
        setShow(s);
        const sorted = [...e].sort((a, b) => {
          const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return dateB - dateA;
        });
        setEpisodes(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showId]);

  const handlePlayLatest = () => {
    if (episodes.length === 0) return;
    const latest = episodes[0];
    setTrack({
      id: latest.id,
      title: latest.title,
      showTitle: show?.title || '',
      audioUrl: latest.audioUrl,
      imageUrl: latest.imageUrl || show?.imageUrl || '',
      duration: latest.duration || 0,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Show Header — Spotify-style */}
      <div className="px-4 md:px-8 pt-6 pb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Show artwork */}
          <div className="flex-shrink-0">
            <img
              src={show?.imageUrl || '/logo.png'}
              alt={show?.title || ''}
              className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-xl object-cover shadow-xl"
            />
          </div>

          {/* Show info */}
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Podcast</p>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{show?.title}</h1>
            <p className="text-gray-300 text-base mb-3">{show?.author}</p>
            {show?.description && (
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 max-w-2xl mb-4">
                {show.description}
              </p>
            )}

            {/* Actions row */}
            <div className="flex items-center gap-4">
              {episodes.length > 0 && (
                <button
                  onClick={handlePlayLatest}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-semibold transition-colors"
                >
                  <Play size={16} fill="white" />
                  Latest Episode
                </button>
              )}
              <button
                onClick={() => toggle(showId)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                  isFavorite(showId)
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
                }`}
              >
                <Heart
                  size={16}
                  className={isFavorite(showId) ? 'fill-blue-500 text-blue-500' : ''}
                />
                {isFavorite(showId) ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="px-4 md:px-8">
        <h2 className="text-xl font-bold text-white mb-4">Episodes</h2>

        {episodes.length > 0 ? (
          <div className="space-y-0">
            {episodes.map((episode) => (
              <EpisodeRow
                key={episode.id}
                episode={episode}
                showTitle={show?.title}
                showImage={show?.imageUrl}
                showId={show?.id}
                shrinkState={shrinkStates[episode.id]}
                onShrinkClick={() => setShrinkEpisode(episode)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">No episodes found.</div>
        )}
      </div>

      {/* Shrink Panel */}
      {shrinkEpisode && (
        <ShrinkPanel
          episode={shrinkEpisode}
          showImage={show?.imageUrl}
          onClose={() => setShrinkEpisode(null)}
          onShrinkStarted={() => {
            setShrinkStates(prev => ({ ...prev, [shrinkEpisode.id]: { status: 'shrinking' } }));
          }}
          onShrinkComplete={(_id, audioUrl) => {
            setShrinkStates(prev => ({ ...prev, [shrinkEpisode.id]: { status: 'complete', audioUrl } }));
          }}
        />
      )}
    </div>
  );
}
