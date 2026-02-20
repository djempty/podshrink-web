'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Show, Episode } from '@/lib/types';
import Link from 'next/link';
import EpisodeRow from '@/components/EpisodeRow';
import ShrinkPanel from '@/components/ShrinkPanel';

export default function ShowPage() {
  const params = useParams();
  const showId = parseInt(params.id as string, 10);

  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [shrinkEpisode, setShrinkEpisode] = useState<Episode | null>(null);
  const [shrinkStates, setShrinkStates] = useState<Record<number, { status: 'shrinking' | 'complete'; audioUrl?: string }>>({});

  useEffect(() => {
    Promise.all([api.getShow(showId), api.getEpisodes(showId)])
      .then(([s, e]) => { setShow(s); setEpisodes(e); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Episodes</h1>
        <Link
          href="/signup"
          className="px-4 md:px-6 py-2 border border-purple-500 text-purple-400 rounded-md hover:bg-purple-500 hover:text-white transition-colors text-sm font-medium"
        >
          Sign Up
        </Link>
      </header>

      {/* Episodes List */}
      <div className="px-2 md:px-4">
        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <EpisodeRow
              key={episode.id}
              episode={episode}
              showTitle={show?.title}
              showImage={show?.imageUrl}
              shrinkState={shrinkStates[episode.id]}
              onShrinkClick={() => setShrinkEpisode(episode)}
            />
          ))
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
