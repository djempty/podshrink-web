'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api, resolveAudioUrl } from '@/lib/api';
import { Episode, Shrink } from '@/lib/types';
import Link from 'next/link';
import { Play, Pause, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import ShrinkPanel from '@/components/ShrinkPanel';

export default function EpisodePage() {
  const params = useParams();
  const episodeId = parseInt(params.id as string);
  
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShrinkPanel, setShowShrinkPanel] = useState(false);
  const [shrinkState, setShrinkState] = useState<{ status: 'shrinking' | 'complete'; audioUrl?: string } | null>(null);

  const { track, isPlaying, setTrack, play, pause } = useAudioPlayer();

  // Check for existing shrinks on this episode
  const checkExistingShrinks = useCallback(async () => {
    try {
      const allShrinks = await api.getAllShrinks();
      const episodeShrink = allShrinks.find(
        (s: Shrink) => s.episodeId === episodeId && s.status === 'complete' && s.audioUrl
      );
      if (episodeShrink) {
        setShrinkState({ status: 'complete', audioUrl: episodeShrink.audioUrl });
      }
      // Check for in-progress shrinks (only if created recently — within last 10 min)
      const tenMinAgo = Date.now() - 10 * 60 * 1000;
      const activeShrink = allShrinks.find(
        (s: Shrink) => s.episodeId === episodeId && !['complete', 'error'].includes(s.status)
          && s.createdAt && new Date(s.createdAt).getTime() > tenMinAgo
      );
      if (activeShrink && !episodeShrink) {
        setShrinkState({ status: 'shrinking' });
        pollShrinkStatus(activeShrink.id);
      }
    } catch {}
  }, [episodeId]);

  const pollShrinkStatus = (shrinkId: number) => {
    const interval = setInterval(async () => {
      try {
        const s = await api.getShrinkStatus(episodeId, shrinkId);
        if (s.status === 'complete' && s.audioUrl) {
          setShrinkState({ status: 'complete', audioUrl: s.audioUrl });
          clearInterval(interval);
        } else if (s.status === 'error') {
          setShrinkState(null);
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 3000);
  };

  useEffect(() => {
    api.getEpisode(episodeId)
      .then(setEpisode)
      .catch(console.error)
      .finally(() => setLoading(false));
    checkExistingShrinks();
  }, [episodeId, checkExistingShrinks]);

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

  const isShrinkTrack = track?.id === (episode?.id ?? 0) + 100000;

  const handlePlayShrink = () => {
    if (!episode || !shrinkState?.audioUrl) return;
    if (isShrinkTrack && isPlaying) { pause(); return; }
    if (isShrinkTrack) { play(); return; }
    setTrack({
      id: episode.id + 100000,
      title: `${episode.title} (PodShrink)`,
      showTitle: episode.show?.title || '',
      audioUrl: resolveAudioUrl(shrinkState.audioUrl),
      imageUrl: episode.imageUrl || episode.show?.imageUrl || '',
      duration: 0,
    });
    play();
  };

  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => 
      urlRegex.test(part) 
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">{part}</a>
        : part
    );
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

  // Determine the primary action button
  const renderActionButton = () => {
    if (shrinkState?.status === 'shrinking') {
      return (
        <button disabled className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-purple-600/40 text-purple-300 rounded-md text-sm font-medium cursor-not-allowed">
          <Loader2 size={16} className="animate-spin" /> Shrinking...
        </button>
      );
    }
    if (shrinkState?.status === 'complete') {
      return (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={handlePlayShrink}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2EA84A] hover:bg-[#259A3F] text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            {isShrinkTrack && isPlaying ? (
              <><Pause size={16} fill="currentColor" /> Pause</>
            ) : isShrinkTrack ? (
              <><Play size={16} fill="currentColor" /> Resume</>
            ) : (
              <><Play size={16} fill="white" /> Play Shrink</>
            )}
          </button>
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            {isCurrentTrack && isPlaying ? (
              <><Pause size={16} fill="currentColor" /> Pause</>
            ) : (
              <><Play size={16} fill="white" /> Original</>
            )}
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 px-6 py-2.5 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-sm font-medium transition-colors"
        >
          {isCurrentTrack && isPlaying ? (
            <><Pause size={16} fill="currentColor" /> Pause</>
          ) : isCurrentTrack ? (
            <><Play size={16} fill="currentColor" /> Resume</>
          ) : (
            <><Play size={16} fill="currentColor" /> Play</>
          )}
        </button>
        <button
          onClick={() => setShowShrinkPanel(true)}
          className="px-6 py-2.5 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-md text-sm font-medium transition-colors"
        >
          Shrink It!
        </button>
      </div>
    );
  };

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
      <div className="flex gap-4 md:gap-6 mb-8">
        {/* Large thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={episode.imageUrl || episode.show?.imageUrl || '/logo.png'}
            alt={episode.title}
            className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-lg object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 pt-1">
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

          {renderActionButton()}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mb-8" />

      {/* Full description */}
      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-w-3xl">
        {episode.description ? linkifyText(episode.description) : 'No description available.'}
      </div>

      {/* Shrink Panel */}
      {showShrinkPanel && (
        <ShrinkPanel
          episode={episode}
          showImage={episode.show?.imageUrl}
          onClose={() => setShowShrinkPanel(false)}
          onShrinkStarted={(shrinkId) => {
            setShrinkState({ status: 'shrinking' });
          }}
          onShrinkComplete={(_id, audioUrl) => {
            setShrinkState({ status: 'complete', audioUrl });
            setShowShrinkPanel(false);
          }}
        />
      )}
    </div>
  );
}
