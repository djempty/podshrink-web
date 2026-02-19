'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Episode, Shrink } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import DurationSelector from '@/components/DurationSelector';
import VoiceSelector from '@/components/VoiceSelector';
import ShrinkProgress from '@/components/ShrinkProgress';
import { useAudioStore } from '@/lib/store';

export default function EpisodePage() {
  const params = useParams();
  const episodeId = parseInt(params.id as string);
  
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetDuration, setTargetDuration] = useState(5);
  const [voiceId, setVoiceId] = useState('');
  const [shrinking, setShrinking] = useState(false);
  const [currentShrink, setCurrentShrink] = useState<Shrink | null>(null);
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useAudioStore((state) => state.play);

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

  const handleShrink = async () => {
    if (!voiceId) {
      alert('Please select a voice');
      return;
    }

    setShrinking(true);
    setError(null);

    try {
      const shrink = await api.createShrink(episodeId, targetDuration, voiceId);
      setCurrentShrink(shrink);
    } catch (err) {
      console.error('Failed to create shrink:', err);
      setError(err instanceof Error ? err.message : 'Failed to create shrink');
      setShrinking(false);
    }
  };

  const handleShrinkComplete = (shrink: Shrink) => {
    setCurrentShrink(shrink);
    setShrinking(false);
  };

  const handlePlayOriginal = () => {
    if (episode && episode.show) {
      play({
        title: episode.title,
        show: episode.show.title,
        artwork: episode.show.artwork_url,
        audioUrl: episode.audio_url,
        episodeId: episode.id,
      });
    }
  };

  const handlePlayShrunk = () => {
    if (currentShrink && episode && episode.show) {
      play({
        title: `${episode.title} (Shrunk)`,
        show: episode.show.title,
        artwork: episode.show.artwork_url,
        audioUrl: api.getShrinkAudioUrl(currentShrink.id),
        episodeId: episode.id,
        shrinkId: currentShrink.id,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error || !episode || !episode.show) {
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
      {/* Back Button */}
      <Link
        href={`/shows/${episode.show_id}`}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Show
      </Link>

      {/* Episode Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
          <Image
            src={episode.show.artwork_url || '/placeholder.png'}
            alt={episode.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="text-purple-400 font-medium mb-2">{episode.show.title}</p>
          <h1 className="text-3xl font-bold mb-4">{episode.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(episode.pub_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {formatDuration(episode.duration)}
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed">{episode.description}</p>

          <button
            onClick={handlePlayOriginal}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-medium transition-colors"
          >
            <Play size={20} fill="currentColor" />
            Play Original Episode
          </button>
        </div>
      </div>

      {/* Shrink Controls */}
      {!currentShrink && !shrinking && (
        <div className="bg-dark-card rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold">Shrink This Episode</h2>
          
          <DurationSelector value={targetDuration} onChange={setTargetDuration} />
          <VoiceSelector value={voiceId} onChange={setVoiceId} />

          <button
            onClick={handleShrink}
            disabled={!voiceId}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            ✨ Shrink It!
          </button>
        </div>
      )}

      {/* Shrink Progress */}
      {shrinking && currentShrink && currentShrink.status !== 'complete' && (
        <ShrinkProgress shrinkId={currentShrink.id} onComplete={handleShrinkComplete} />
      )}

      {/* Completed Shrink */}
      {currentShrink && currentShrink.status === 'complete' && (
        <div className="space-y-6">
          <div className="bg-dark-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Shrunk Episode</h2>
            <p className="text-gray-400 mb-6">
              Successfully shrunk to ~{currentShrink.target_duration} minutes!
            </p>
            
            <button
              onClick={handlePlayShrunk}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              <Play size={20} fill="currentColor" />
              Play Shrunk Episode
            </button>
          </div>

          {/* Script */}
          {currentShrink.script_text && (
            <div className="bg-dark-card rounded-lg p-6">
              <button
                onClick={() => setScriptExpanded(!scriptExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-xl font-bold">Generated Script</h3>
                {scriptExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {scriptExpanded && (
                <div className="mt-4 p-4 bg-dark-hover rounded-lg">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {currentShrink.script_text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
