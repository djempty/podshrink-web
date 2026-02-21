import { api, DiscoverSection } from '@/lib/api';
import DiscoverHome from '@/components/DiscoverHome';
import { Sparkles } from 'lucide-react';
import EpisodeCard from '@/components/EpisodeCard';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let sections: DiscoverSection[] = [];
  let recentShrinks: Awaited<ReturnType<typeof api.getRecentShrinks>> = [];

  // Fetch all categories
  const categories = ['popular', 'technology', 'news', 'society-culture', 'comedy', 'business', 'true-crime', 'health'];
  
  try {
    const results = await Promise.all(
      categories.map(cat => api.getDiscoverCategory(cat).catch(() => null))
    );
    sections = results.filter((s): s is DiscoverSection => s !== null);
  } catch (error) {
    console.error('Failed to fetch discover data:', error);
  }

  try {
    recentShrinks = await api.getRecentShrinks();
  } catch (error) {
    console.error('Failed to fetch recent shrinks:', error);
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Shows" />

      {/* Scrollable Content */}
      <div className="px-4 md:px-8 py-4 md:py-8">
        {/* Discover Sections */}
        <DiscoverHome sections={sections} />

        {/* Recently Shrunk */}
        {recentShrinks.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Sparkles className="text-purple-400" size={28} />
              Recently Shrunk
            </h2>
            <div className="space-y-1">
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
    </div>
  );
}
