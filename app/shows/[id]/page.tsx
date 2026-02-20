import { api } from '@/lib/api';
import Link from 'next/link';
import EpisodeRow from '@/components/EpisodeRow';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ShowPageProps {
  params: { id: string };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const showId = parseInt(params.id, 10);
  
  if (isNaN(showId)) {
    notFound();
  }

  let show;
  let episodes;

  try {
    show = await api.getShow(showId);
    episodes = await api.getEpisodes(showId);
  } catch (error) {
    console.error('Failed to fetch show or episodes:', error);
    notFound();
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
        {episodes && episodes.length > 0 ? (
          episodes.map((episode) => (
            <EpisodeRow
              key={episode.id}
              episode={episode}
              showTitle={show.title}
              showImage={show.imageUrl}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            No episodes found for this show.
          </div>
        )}
      </div>
    </div>
  );
}
