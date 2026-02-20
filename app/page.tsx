import { api, DiscoverSection } from '@/lib/api';
import DiscoverHome from '@/components/DiscoverHome';
import { Sparkles } from 'lucide-react';
import EpisodeCard from '@/components/EpisodeCard';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-900">
        <h1 className="text-3xl font-bold text-white">Shows</h1>
        <Link
          href="/signup"
          className="px-6 py-2 border border-purple-500 text-purple-400 rounded-md hover:bg-purple-500 hover:text-white transition-colors text-sm font-medium"
        >
          Sign Up
        </Link>
      </header>

      {/* Content */}
      <div className="px-8 py-8 space-y-12">
        {/* Discover Sections (Popular, Technology, News) */}
        <DiscoverHome sections={sections} />

        {/* Recently Shrunk */}
        {recentShrinks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
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
    </div>
  );
}
