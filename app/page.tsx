import { api } from '@/lib/api';
import ShowCard from '@/components/ShowCard';
import EpisodeCard from '@/components/EpisodeCard';
import { Sparkles, TrendingUp, Grid3x3 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let shows: Awaited<ReturnType<typeof api.getShows>> = [];
  let recentShrinks: Awaited<ReturnType<typeof api.getRecentShrinks>> = [];

  try {
    shows = await api.getShows();
  } catch (error) {
    console.error('Failed to fetch shows:', error);
  }

  try {
    recentShrinks = await api.getRecentShrinks();
  } catch (error) {
    console.error('Failed to fetch recent shrinks:', error);
  }

  const popularShows = shows.slice(0, 6);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to PodShrink</h1>
        <p className="text-gray-400">Transform lengthy podcasts into bite-sized summaries</p>
      </div>

      {/* Popular Shows */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="text-purple-400" size={28} />
            Popular Shows
          </h2>
          <Link href="/browse" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            Browse All →
          </Link>
        </div>
        {popularShows.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {popularShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-card rounded-lg p-8 text-center">
            <p className="text-gray-400">No shows yet. Add your first podcast!</p>
            <Link
              href="/add"
              className="inline-block mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Add Show
            </Link>
          </div>
        )}
      </section>

      {/* Recently Shrunk */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="text-purple-400" size={28} />
          Recently Shrunk
        </h2>
        {recentShrinks.length > 0 ? (
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
        ) : (
          <div className="bg-dark-card rounded-lg p-8 text-center">
            <p className="text-gray-400">No shrunk episodes yet. Start shrinking!</p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Grid3x3 className="text-purple-400" size={28} />
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Technology', 'Business', 'Science', 'Comedy', 'News', 'Education', 'Health', 'Arts'].map(
            (category) => (
              <Link
                key={category}
                href={`/browse?category=${category.toLowerCase()}`}
                className="bg-dark-card rounded-lg p-6 text-center hover:bg-dark-hover transition-colors group"
              >
                <p className="font-semibold group-hover:text-purple-400 transition-colors">{category}</p>
              </Link>
            )
          )}
        </div>
      </section>
    </div>
  );
}
