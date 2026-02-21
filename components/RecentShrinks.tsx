'use client';

import { Sparkles } from 'lucide-react';
import { Episode } from '@/lib/types';
import EpisodeRow from './EpisodeRow';

interface RecentShrinksProps {
  shrinks: {
    id: number;
    episode: Episode;
    audioUrl: string;
  }[];
}

export default function RecentShrinks({ shrinks }: RecentShrinksProps) {
  if (shrinks.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <Sparkles className="text-purple-400" size={28} />
        Recently Shrunk
      </h2>
      <div>
        {shrinks.map((shrink) => (
          <EpisodeRow
            key={shrink.id}
            episode={shrink.episode}
            showTitle={shrink.episode.show?.title}
            showImage={shrink.episode.show?.imageUrl || shrink.episode.imageUrl}
            showId={shrink.episode.showId}
            shrinkState={{ status: 'complete', audioUrl: shrink.audioUrl }}
          />
        ))}
      </div>
    </section>
  );
}
