'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Show, Episode } from '@/lib/types';
import { Heart, Play, Pause } from 'lucide-react';
import EpisodeRow from '@/components/EpisodeRow';
import ShrinkPanel from '@/components/ShrinkPanel';
import { useFavorites } from '@/lib/favoritesStore';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { useSession } from 'next-auth/react';

export default function ShowPage() {
  const params = useParams();
  const showId = parseInt(params.id as string, 10);

  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [shrinkEpisode, setShrinkEpisode] = useState<Episode | null>(null);
  const [shrinkStates, setShrinkStates] = useState<Record<number, { status: 'shrinking' | 'complete'; audioUrl?: string }>>({});
  const { isFavorite, toggle } = useFavorites();
  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();
  const { data: session } = useSession();

  useEffect(() => {
    const userId = session?.user?.email || session?.user?.id;
    Promise.all([api.getShow(showId), api.getEpisodes(showId), api.getAllShrinks(userId || undefined)])
      .then(([s, e, allShrinks]) => {
        setShow(s);
        const sorted = [...e].sort((a, b) => {
          const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
          const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
          return dateB - dateA;
        });
        setEpisodes(sorted);

        // Populate shrinkStates from existing completed shrinks
        const states: Record<number, { status: 'complete'; audioUrl?: string }> = {};
        for (const shrink of allShrinks) {
          if (shrink.status === 'complete' && shrink.audioUrl) {
            const audioUrl = shrink.audioUrl.startsWith('/api/') 
              ? shrink.audioUrl 
              : api.getShrinkAudioUrl(shrink.id);
            states[shrink.episodeId] = { status: 'complete', audioUrl };
          }
        }
        setShrinkStates(states);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showId]);

  const latestEpisode = episodes.length > 0 ? episodes[0] : null;
  const isLatestPlaying = latestEpisode && track?.id === latestEpisode.id && isPlaying;
  const isLatestLoaded = latestEpisode && track?.id === latestEpisode.id;

  const handlePlayLatest = () => {
    if (!latestEpisode) return;
    if (isLatestPlaying) { pause(); return; }
    if (isLatestLoaded) { play(); return; }
    setTrack({
      id: latestEpisode.id,
      title: latestEpisode.title,
      showTitle: show?.title || '',
      audioUrl: latestEpisode.audioUrl,
      imageUrl: latestEpisode.imageUrl || show?.imageUrl || '',
      duration: latestEpisode.duration || 0,
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
        {/* Top row: image + text side by side */}
        <div className="flex gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <img
              src={show?.imageUrl || '/logo.png'}
              alt={show?.title || ''}
              className="w-[100px] h-[100px] md:w-[220px] md:h-[220px] rounded-xl object-cover shadow-xl"
            />
          </div>
          <div className="flex-1 flex flex-col justify-start pt-[6px] min-w-0">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 hidden md:block">Podcast</p>
            <h1 className="text-xl md:text-4xl font-bold text-white mb-1 md:mb-2 line-clamp-2">{show?.title}</h1>
            <p className="text-gray-300 text-sm md:text-base mb-1 md:mb-3">{show?.author}</p>
            {show?.description && (
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 max-w-2xl hidden md:block">
                {show.description}
              </p>
            )}
          </div>
        </div>

        {/* Description on mobile (below image row) */}
        {show?.description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-3 md:hidden">
            {show.description}
          </p>
        )}

        {/* Actions row — below image on all screens */}
        <div className="flex items-center gap-3 mt-4">
          {latestEpisode && (
            <button
              onClick={handlePlayLatest}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-semibold transition-colors"
            >
              {isLatestPlaying ? (
                <><Pause size={16} fill="white" />Pause</>
              ) : isLatestLoaded ? (
                <><Play size={16} fill="white" />Resume</>
              ) : (
                <><Play size={16} fill="white" />Latest Episode</>
              )}
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
          onShrinkError={() => {
            setShrinkStates(prev => {
              const next = { ...prev };
              delete next[shrinkEpisode.id];
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
