'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Bell, BellOff } from 'lucide-react';
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
  free?: boolean;
}

interface ShrinkPanelProps {
  episode: Episode;
  showImage?: string;
  onClose: () => void;
  onShrinkStarted: (shrinkId: number) => void;
  onShrinkComplete: (shrinkId: number, audioUrl: string, audioDurationSeconds?: number) => void;
  onShrinkError?: () => void;
}

export default function ShrinkPanel({ episode, showImage, onClose, onShrinkStarted, onShrinkComplete, onShrinkError }: ShrinkPanelProps) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const userPlan = (session?.user as any)?.plan || 'free';
  const [duration, setDuration] = useState(0);
  const [voiceId, setVoiceId] = useState('');
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [notifyWhenReady, setNotifyWhenReady] = useState(false);
  const chimeRef = useRef<HTMLAudioElement | null>(null);
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
  const [funMessageIndex, setFunMessageIndex] = useState(0);

  const FUN_MESSAGES_EARLY = [
    "Our AI is listening to the whole episode so you don't have to",
    "Condensing hours of brilliance into minutes...",
    "Almost like speed-reading, but for your ears",
    "Fun fact: you're saving serious time right now",
    "The AI is taking notes furiously...",
    "Your personalized summary is being crafted...",
    "Picking out the best parts for you...",
    "Separating signal from noise...",
    "Skipping the ads, keeping the gold...",
    "Doing the heavy listening so you don't have to",
    "Distilling the good stuff...",
    "Turning a marathon into a sprint...",
    "Finding the highlights...",
    "Your future self will thank you for this",
    "Compressing knowledge at light speed...",
    "Every second counts — we're keeping only the best",
  ];

  const FUN_MESSAGES_FINISHING = [
    "Almost there, just a bit more...",
    "Putting the finishing touches on...",
    "Just about done...",
    "Wrapping it up for you...",
    "Final polish in progress...",
  ];

  // Load voices
  useEffect(() => {
    api.getVoices()
      .then((data: any) => {
        const voiceList = Array.isArray(data) ? data : data.voices || [];
        // Sort Brian to the top
        voiceList.sort((a: VoiceOption, b: VoiceOption) => {
          if (a.name.toLowerCase() === 'brian') return -1;
          if (b.name.toLowerCase() === 'brian') return 1;
          return 0;
        });
        setVoices(voiceList);
        if (false) {
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

  const funMessages = progress >= 80 ? FUN_MESSAGES_FINISHING : FUN_MESSAGES_EARLY;

  // Rotate fun messages during processing
  useEffect(() => {
    if (status === 'processing') {
      setFunMessageIndex(0);
      const interval = setInterval(() => {
        setFunMessageIndex(prev => (prev + 1) % funMessages.length);
      }, 8000);
      return () => clearInterval(interval);
    } else {
      setFunMessageIndex(0);
    }
  }, [status, funMessages.length, progress >= 80]);

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
    if (!duration || !voiceId) return;
    setStatus('processing');
    setProgress(0);
    setProgressLabel('Starting shrink...');

    try {
      const shrink = await api.createShrink(episode.id, duration, voiceId, session?.user?.id);
      setShrinkId(shrink.id);
      onShrinkStarted(shrink.id);
      
      // If backend returned an already-complete shrink (cache hit), skip polling
      if (shrink.status === 'complete' && shrink.audioUrl) {
        setProgress(100);
        setProgressLabel('Complete!');
        setStatus('complete');
        onShrinkComplete(shrink.id, shrink.audioUrl, shrink.audioDurationSeconds);
      } else {
        pollStatus(shrink.id);
      }
      
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
      onShrinkError?.();
    }
  };

  const pollStatus = (id: number) => {
    const interval = setInterval(async () => {
      try {
        const shrink = await api.getShrinkStatus(episode.id, id);

        switch (shrink.status) {
          case 'queued':
            setProgress(prev => Math.round(Math.min(prev + 1, 18)));
            setProgressLabel('Queued...');
            break;
          case 'transcribing':
            setProgress(prev => Math.round(prev < 20 ? 20 : Math.min(prev + 1.5, 48)));
            setProgressLabel('Transcribing audio...');
            break;
          case 'scripting':
            setProgress(prev => Math.round(prev < 50 ? 50 : Math.min(prev + 1.5, 73)));
            setProgressLabel('Building shrink outline...');
            break;
          case 'generating_audio':
            setProgress(prev => Math.round(prev < 75 ? 75 : Math.min(prev + 0.8, 95)));
            setProgressLabel('Creating audio...');
            break;
          case 'complete':
            setProgress(100);
            setProgressLabel('Complete!');
            setStatus('complete');
            if (shrink.audioUrl) {
              onShrinkComplete(id, shrink.audioUrl, shrink.audioDurationSeconds);
            }
            // Notify user with chime sound
            if (notifyWhenReady) {
              try {
                if (!chimeRef.current) {
                  chimeRef.current = new Audio('/chime.wav');
                  chimeRef.current.volume = 0.5;
                }
                chimeRef.current.currentTime = 0;
                chimeRef.current.play().catch(() => {});
              } catch {}
            }
            clearInterval(interval);
            return;
          case 'error':
            setStatus('error');
            setErrorMsg(shrink.errorMessage || 'Processing failed');
            onShrinkError?.();
            clearInterval(interval);
            return;
        }
      } catch {
        setStatus('error');
        setErrorMsg('Lost connection to server');
        onShrinkError?.();
        clearInterval(interval);
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[320px] bg-[#1a1a1a] border-l border-gray-800 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="PodShrink" className="w-8 h-8" />
          <h2 className="text-white font-semibold text-lg">Shrink Settings</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Episode info */}
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">Shrinking:</p>
          <div className="flex items-center gap-3">
            <img
              src={episode.imageUrl || showImage || '/logo.png'}
              alt=""
              className="w-12 h-12 rounded object-cover"
            />
            <p className="text-white text-sm font-medium line-clamp-2">{episode.title}</p>
          </div>
        </div>

        {/* Duration & Voice — visible to all, Generate button gated */}
            {/* Duration */}
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Choose a duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={status === 'processing'}
                className="w-full bg-[#252525] text-white text-sm rounded-md px-3 py-2.5 border border-gray-700 focus:outline-none focus:border-purple-500 shrink-select"
              >
                <option value={0} disabled>Choose duration</option>
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
              </select>
              {duration >= 10 && (
                <p className="text-gray-500 text-xs mt-1">Longer shrinks can take up to 2–3 minutes to generate</p>
              )}
            </div>

            {/* Voice */}
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Choose a voice</label>
              <select
                value={voiceId}
                onChange={(e) => {
                  const v = voices.find(x => x.voiceId === e.target.value);
                  if (v && userPlan === 'free' && !(v as any).free) return;
                  setVoiceId(e.target.value);
                }}
                disabled={status === 'processing'}
                className="w-full bg-[#252525] text-white text-sm rounded-md px-3 py-2.5 border border-gray-700 focus:outline-none focus:border-purple-500 shrink-select"
              >
                <option value="" disabled>Choose voice</option>
                {voices.map((v) => {
                  const locked = userPlan === 'free' && !(v as any).free;
                  return (
                    <option key={v.voiceId} value={v.voiceId} disabled={locked}>
                      {locked ? `🔒 ${v.name}` : v.name}
                    </option>
                  );
                })}
                {userPlan === 'free' && (
                  <option disabled value="__upgrade__">— Upgrade to unlock all voices —</option>
                )}
              </select>
            </div>

            {/* Preview + Notify toggle */}
            <div className="flex items-center justify-between">
              {selectedVoice && status !== 'processing' ? (
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
              ) : <div />}
              <button
                onClick={() => setNotifyWhenReady(!notifyWhenReady)}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  notifyWhenReady ? 'text-purple-400 hover:text-purple-300' : 'text-gray-500 hover:text-gray-400'
                }`}
                title={notifyWhenReady ? 'Notifications on' : 'Notifications off'}
              >
                {notifyWhenReady ? <Bell size={14} /> : <BellOff size={14} />}
                {notifyWhenReady ? 'Notify me' : 'Notify off'}
              </button>
            </div>

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

            {/* Logged in and under limit (or usageInfo not loaded yet) */}
            {session && (!usageInfo || usageInfo.shrinkLimit === null || usageInfo.shrinkLimit === undefined || usageInfo.shrinkCount < usageInfo.shrinkLimit) && (
              <div>
                <button
                  onClick={handleGenerate}
                  disabled={!voiceId || !duration}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold text-base transition-colors disabled:opacity-50"
                >
                  Generate Shrink
                </button>
                {usageInfo && usageInfo.shrinkLimit !== null && usageInfo.shrinkLimit !== undefined && (
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
            <p className="text-xs text-gray-500 mt-2 text-center">{Math.round(progress)}%</p>
            <p className="text-xs text-gray-400 text-center">{progressLabel}</p>
            <p className="text-xs text-purple-400/80 text-center mt-3 italic">{funMessages[funMessageIndex % funMessages.length]}</p>
          </div>
        )}

        {status === 'complete' && (
          <div>
            <button disabled className="w-full py-3 bg-[#2EA84A] text-white rounded-md font-medium">
              Completed!
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Your shrink is ready! Close this panel and click "Play Shrink" to listen.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p className="text-red-400 text-sm text-center mb-3">
              Something went wrong while processing your shrink. Please try again — if the issue persists, try a shorter duration or a different episode.
            </p>
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
