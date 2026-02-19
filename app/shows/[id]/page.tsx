import { api } from '@/lib/api';
import Image from 'next/image';
import EpisodeCard from '@/components/EpisodeCard';
import { Calendar, Rss } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function ShowPage({ params }: PageProps) {
  const showId = parseInt(params.id);

  if (isNaN(showId)) {
    notFound();
  }

  let show, episodes;

  try {
    [show, episodes] = await Promise.all([
      api.getShow(showId),
      api.getEpisodes(showId),
    ]);
  } catch (error) {
    console.error('Failed to fetch show:', error);
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-dark-card to-transparent">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 mx-auto md:mx-0">
              <Image
                src={show.artwork_url || '/placeholder.png'}
                alt={show.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{show.title}</h1>
              <p className="text-xl text-gray-400 mb-6">{show.author}</p>
              <p className="text-gray-300 leading-relaxed mb-6">{show.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Added {new Date(show.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Rss size={16} />
                  {episodes.length} episodes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-6">Episodes</h2>
        {episodes.length > 0 ? (
          <div className="space-y-3">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={{ ...episode, show }} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-card rounded-lg p-12 text-center">
            <p className="text-gray-400">No episodes available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
