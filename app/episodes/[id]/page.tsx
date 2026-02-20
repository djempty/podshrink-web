'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Episode, Shrink } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Play, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';

export default function EpisodePage() {
  const params = useParams();
  const episodeId = parseInt(params.id as string);
  
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setTrack, play } = useAudioPlayer();

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const data = await api.getEpisode(episodeId);
        setEpisode(data);
      } catch (err) {
        console.error('Failed to fetch episode:', err);
        setError('Failed to load episode');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  const handlePlayOriginal = () => {
    if (episode) {
      setTrack({
        id: episode.id,
        title: episode.title,
        showTitle: episode.show?.title || '',
        audioUrl: episode.audioUrl,
        imageUrl: episode.imageUrl || episode.show?.imageUrl || '',
        duration: episode.duration || 0,
      });
      play();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 text-center">
          <p className="text-red-400">{error || 'Episode not found'}</p>
          <Link href="/" className="inline-block mt-4 text-purple-400 hover:text-purple-300">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <Link
        href={`/shows/${episode.showId}`}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Show
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
          <img
            src={episode.imageUrl || episode.show?.imageUrl || '/logo.png'}
            alt={episode.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          {episode.show && (
            <p className="text-purple-400 font-medium mb-2">{episode.show.title}</p>
          )}
          <h1 className="text-3xl font-bold mb-4">{episode.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(episode.pubDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {formatDuration(episode.duration)}
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed line-clamp-6">{episode.description}</p>

          <button
            onClick={handlePlayOriginal}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Play size={20} fill="currentColor" />
            Play Original Episode
          </button>
        </div>
      </div>
    </div>
  );
}
