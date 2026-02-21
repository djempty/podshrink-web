'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Episode } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface VoiceOption {
  voiceId: string;
  name: string;
  gender: string;
  description: string;
  previewUrl: string;
}

interface ShrinkPanelProps {
  episode: Episode;
  showImage?: string;
  onClose: () => void;
  onShrinkStarted: (shrinkId: number) => void;
  onShrinkComplete: (shrinkId: number, audioUrl: string) => void;
}

export default function ShrinkPanel({ episode, showImage, onClose, onShrinkStarted, onShrinkComplete }: ShrinkPanelProps) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [duration, setDuration] = useState(1);
  const [voiceId, setVoiceId] = useState('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [shrinkId, setShrinkId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [usageInfo, setUsageInfo] = useState<{
    plan: string;
    shrinkCount: number;
    shrinkLimit: number | null;
    shrinkCountResetAt: string | null;
  } | null>(null);

  // Load voices
  useEffect(() => {
    api.getVoices()
      .then((data: any) => {
        const voiceList = Array.isArray(data) ? data : data.voices || [];
        setVoices(voiceList);
        if (voiceList.length > 0 && !voiceId) {
          setVoiceId(voiceList[0].voiceId);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch usage info if logged in
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`${API_URL}/api/auth/me?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setUsageInfo({
            plan: data.plan || 'free',
            shrinkCount: data.shrinkCount || 0,
            shrinkLimit: data.shrinkLimit,
            shrinkCountResetAt: data.shrinkCountResetAt || null
          });
        })
        .catch(() => {});
    }
  }, [session]);

  // Stop preview when voice changes
  useEffect(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setPreviewPlaying(false);
    }
  }, [voiceId]);

  const selectedVoice = voices.find(v => v.voiceId === voiceId);

  const handlePreview = () => {
    if (!selectedVoice) return;

    if (previewPlaying && previewAudioRef.current) {
      previewAudioRef.current.pause();
      setPreviewPlaying(false);
      return;
    }

    const audio = new Audio(`${API_URL}${selectedVoice.previewUrl}`);
    audio.onended = () => setPreviewPlaying(false);
    audio.onerror = () => setPreviewPlaying(false);
    audio.play();
    previewAudioRef.current = audio;
    setPreviewPlaying(true);
  };

  const handleGenerate = async () => {
    setStatus('processing');
    setProgress(0);
    setProgressLabel('Starting shrink...');

    try {
      const shrink = await api.createShrink(episode.id, duration, voiceId, session?.user?.id);
      setShrinkId(shrink.id);
      onShrinkStarted(shrink.id);
      pollStatus(shrink.id);
      
      // Refresh usage info after starting shrink
      if (session?.user?.id) {
        const res = await fetch(`${API_URL}/api/auth/me?userId=${session.user.id}`);
        const data = await res.json();
        setUsageInfo({
          plan: data.plan || 'free',
          shrinkCount: data.shrinkCount || 0,
          shrinkLimit: data.shrinkLimit,
          shrinkCountResetAt: data.shrinkCountResetAt || null
        });
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to start shrink');
    }
  };

  const pollStatus = (id: number) => {
    const interval = setInterval(async () => {
      try {
        const shrink = await api.getShrinkStatus(episode.id, id);

        switch (shrink.status) {
          case 'queued':
            setProgress(5);
            setProgressLabel('Queued...');
            break;
          case 'transcribing':
            setProgress(20);
            setProgressLabel('Transcribing audio...');
            break;
          case 'scripting':
            setProgress(50);
            setProgressLabel('Building shrink outline...');
            break;
          case 'generating_audio':
            setProgress(75);
            setProgressLabel('Creating audio...');
            break;
          case 'complete':
            setProgress(100);
            setProgressLabel('Complete!');
            setStatus('complete');
            if (shrink.audioUrl) {
              onShrinkComplete(id, shrink.audioUrl);
            }
            clearInterval(interval);
            return;
          case 'error':
            setStatus('error');
            setErrorMsg(shrink.errorMessage || 'Processing failed');
            clearInterval(interval);
            return;
        }
      } catch {
        setStatus('error');
        setErrorMsg('Lost connection to server');
        clearInterval(interval);
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[320px] bg-[#1a1a1a] border-l border-gray-800 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="PodShrink" className="w-6 h-6" />
          <h2 className="text-white font-semibold">Shrink Settings</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Episode info */}
        <div>
          <p className="text-gray-500 text-xs mb-2">Shrinking:</p>
          <div className="flex items-center gap-3">
            <img
              src={episode.imageUrl || showImage || '/logo.png'}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
            <p className="text-white text-sm font-medium line-clamp-2">{episode.title}</p>
          </div>
        </div>

        {/* Duration */}
        <div>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={status === 'processing'}
            className="w-full bg-[#252525] text-white text-sm rounded-md px-3 py-2.5 border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            <option value={1}>1 min (testing)</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
          </select>
        </div>

        {/* Voice */}
        <div>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            disabled={status === 'processing'}
            className="w-full bg-[#252525] text-white text-sm rounded-md px-3 py-2.5 border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            {voices.map((v) => (
              <option key={v.voiceId} value={v.voiceId}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preview button */}
        {selectedVoice && status !== 'processing' && (
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {previewPlaying ? (
              <><Pause size={14} fill="currentColor" /> Pause Preview</>
            ) : (
              <><Play size={14} fill="currentColor" /> Preview: {selectedVoice.name}</>
            )}
          </button>
        )}

        {/* Action button */}
        {status === 'idle' && (
          <>
            {/* Not logged in */}
            {sessionStatus !== 'loading' && !session && (
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 text-center">
                <p className="text-purple-300 text-sm mb-3">Sign up to start shrinking podcasts</p>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Logged in but at limit */}
            {session && usageInfo && usageInfo.shrinkLimit !== null && usageInfo.shrinkCount >= usageInfo.shrinkLimit && (
              <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4 text-center">
                <p className="text-amber-300 text-sm mb-1 font-medium">
                  You've used all {usageInfo.shrinkLimit} {usageInfo.plan} shrinks this month
                </p>
                <p className="text-amber-400/70 text-xs mb-3">
                  Resets {usageInfo.shrinkCountResetAt ? new Date(usageInfo.shrinkCountResetAt).toLocaleDateString() : 'soon'}
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            {/* Logged in and under limit */}
            {session && usageInfo && (usageInfo.shrinkLimit === null || usageInfo.shrinkCount < usageInfo.shrinkLimit) && (
              <div>
                <button
                  onClick={handleGenerate}
                  disabled={!voiceId}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                >
                  Generate Shrink
                </button>
                {usageInfo.shrinkLimit !== null && (
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    {usageInfo.shrinkLimit - usageInfo.shrinkCount} of {usageInfo.shrinkLimit} shrinks remaining
                  </p>
                )}
              </div>
            )}

            {/* Loading state */}
            {sessionStatus === 'loading' && (
              <button
                disabled
                className="w-full py-3 bg-purple-600/40 text-purple-300 rounded-md font-medium cursor-not-allowed"
              >
                Loading...
              </button>
            )}
          </>
        )}

        {status === 'processing' && (
          <div>
            <button disabled className="w-full py-3 bg-purple-600/40 text-purple-300 rounded-md font-medium cursor-not-allowed">
              Processing...
            </button>
            <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden relative">
              {/* Base fill */}
              <div
                className="absolute inset-y-0 left-0 bg-purple-600 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
              {/* Animated shimmer overlay */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-[200%] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{progress}%</p>
            <p className="text-xs text-gray-400 text-center">{progressLabel}</p>
          </div>
        )}

        {status === 'complete' && (
          <div>
            <button disabled className="w-full py-3 bg-[#2EA84A] text-white rounded-md font-medium">
              Completed!
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Your PodShrink is ready! Close this panel and click "Play PodShrink" to listen.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p className="text-red-400 text-sm text-center mb-3">{errorMsg}</p>
            <button
              onClick={() => { setStatus('idle'); setErrorMsg(''); }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
