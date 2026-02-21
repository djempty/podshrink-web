'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Show, Episode } from '@/lib/types';
import EpisodeRow from '@/components/EpisodeRow';
import ShrinkPanel from '@/components/ShrinkPanel';
import PageHeader from '@/components/PageHeader';

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
      .then(([s, e]) => {
        setShow(s);
        // Sort episodes by release date, newest first
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Episodes" />

      {/* Episodes List */}
      <div className="px-2 md:px-4">
        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <EpisodeRow
              key={episode.id}
              episode={episode}
              showTitle={show?.title}
              showImage={show?.imageUrl}
              showId={show?.id}
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
