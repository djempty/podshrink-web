'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Episode } from '@/lib/types';
import Link from 'next/link';
import { Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';

export default function EpisodePage() {
  const params = useParams();
  const episodeId = parseInt(params.id as string);
  
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();

  useEffect(() => {
    api.getEpisode(episodeId)
      .then(setEpisode)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [episodeId]);

  const isCurrentTrack = track?.id === episode?.id;

  const handlePlay = () => {
    if (!episode) return;
    if (isCurrentTrack && isPlaying) { pause(); return; }
    setTrack({
      id: episode.id,
      title: episode.title,
      showTitle: episode.show?.title || '',
      audioUrl: episode.audioUrl,
      imageUrl: episode.imageUrl || episode.show?.imageUrl || '',
      duration: episode.duration || 0,
    });
    play();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return `${d.getMonth() + 1}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '';
    return `${Math.floor(seconds / 60)} mins`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="p-8 text-center text-gray-400">
        Episode not found. <Link href="/" className="text-purple-400 hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] px-4 md:px-8 py-6">
      {/* Back link */}
      <Link
        href={`/shows/${episode.showId}`}
        className="text-blue-500 hover:text-blue-400 text-sm mb-6 inline-block"
      >
        &lt;&lt; Episodes
      </Link>

      {/* Episode header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Large thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={episode.imageUrl || episode.show?.imageUrl || '/logo.png'}
            alt={episode.title}
            className="w-[200px] h-[200px] rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">{formatDate(episode.pubDate)}</p>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{episode.title}</h1>
          {episode.show && (
            <Link href={`/shows/${episode.showId}`} className="text-blue-500 hover:text-blue-400 text-lg font-semibold block mb-1">
              {episode.show.title}
            </Link>
          )}
          <p className="text-gray-400 text-sm mb-1">{formatDuration(episode.duration)}</p>
          {episode.show?.author && (
            <p className="text-gray-400 text-sm">{episode.show.author}</p>
          )}

          {/* Play/Resume button */}
          <button
            onClick={handlePlay}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            {isCurrentTrack && isPlaying ? (
              <><Pause size={16} fill="white" /> Pause</>
            ) : isCurrentTrack ? (
              <><Play size={16} fill="white" /> Resume</>
            ) : (
              <><Play size={16} fill="white" /> Play</>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mb-8" />

      {/* Full description */}
      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-w-3xl">
        {episode.description || 'No description available.'}
      </div>
    </div>
  );
}
