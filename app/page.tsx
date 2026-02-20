import { api, DiscoverSection } from '@/lib/api';
import DiscoverHome from '@/components/DiscoverHome';
import { Sparkles } from 'lucide-react';
import EpisodeCard from '@/components/EpisodeCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let sections: DiscoverSection[] = [];
  let recentShrinks: Awaited<ReturnType<typeof api.getRecentShrinks>> = [];

  try {
    sections = await api.getDiscover();
  } catch (error) {
    console.error('Failed to fetch discover data:', error);
  }

  try {
    recentShrinks = await api.getRecentShrinks();
  } catch (error) {
    console.error('Failed to fetch recent shrinks:', error);
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Shows</h1>
      </div>

      {/* Discover Sections (Popular, Technology, News) */}
      <DiscoverHome sections={sections} />

      {/* Recently Shrunk */}
      {recentShrinks.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-400" size={28} />
            Recently Shrunk
          </h2>
          <div className="space-y-3">
            {recentShrinks
              .filter((shrink) => shrink.status === 'complete' && shrink.episode)
              .slice(0, 5)
              .map((shrink) => (
                <EpisodeCard
                  key={shrink.id}
                  episode={shrink.episode!}
                  shrinkStatus="complete"
                  shrinkAudioUrl={api.getShrinkAudioUrl(shrink.id)}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
