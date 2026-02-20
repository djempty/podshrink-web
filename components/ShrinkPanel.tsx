'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '@/lib/api';
import { Episode } from '@/lib/types';

const VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam' },
];

interface ShrinkPanelProps {
  episode: Episode;
  showImage?: string;
  onClose: () => void;
  onShrinkStarted: (shrinkId: number) => void;
  onShrinkComplete: (shrinkId: number, audioUrl: string) => void;
}

export default function ShrinkPanel({ episode, showImage, onClose, onShrinkStarted, onShrinkComplete }: ShrinkPanelProps) {
  const [duration, setDuration] = useState(1);
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [shrinkId, setShrinkId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async () => {
    setStatus('processing');
    setProgress(0);
    setProgressLabel('Starting shrink...');

    try {
      const shrink = await api.createShrink(episode.id, duration, voiceId);
      setShrinkId(shrink.id);
      onShrinkStarted(shrink.id);
      pollStatus(shrink.id);
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
            setProgressLabel('Generating audio...');
            break;
          case 'complete':
            setProgress(100);
            setProgressLabel('');
            setStatus('complete');
            if (shrink.audioUrl) onShrinkComplete(id, shrink.audioUrl);
            clearInterval(interval);
            break;
          case 'error':
            setStatus('error');
            setErrorMsg(shrink.errorMessage || 'Shrink failed');
            clearInterval(interval);
            break;
        }
      } catch {
        // Keep polling
      }
    }, 3000);
  };

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-[#1a1a1a] border-l border-gray-800 z-50 flex flex-col shadow-2xl animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-7 h-7" />
          <span className="text-lg font-bold text-white">PodShrink</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        <h2 className="text-lg font-bold text-white mb-4">Shrink Settings</h2>

        {/* Episode info */}
        <p className="text-gray-500 text-xs mb-2">Shrinking:</p>
        <div className="flex items-start gap-3 mb-6">
          <img src={episode.imageUrl || showImage || '/logo.png'} alt="" className="w-14 h-14 rounded object-cover flex-shrink-0" />
          <p className="text-white text-sm font-medium leading-tight line-clamp-3">{episode.title}</p>
        </div>

        {/* Duration */}
        <label className="block mb-4">
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            disabled={status === 'processing'}
            className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-3 border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            <option value="" disabled>Duration</option>
            <option value={1}>1 min (testing)</option>
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
          </select>
        </label>

        {/* Voice */}
        <label className="block mb-6">
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            disabled={status === 'processing'}
            className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-3 border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            <option value="" disabled>Choose a voice</option>
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </label>

        {/* Generate / Status */}
        {status === 'idle' && (
          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
          >
            Generate Shrink
          </button>
        )}

        {status === 'processing' && (
          <div>
            <button disabled className="w-full py-3 bg-gray-700 text-gray-400 rounded-md font-medium cursor-not-allowed">
              Processing...
            </button>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">{progress}%</p>
              <p className="text-xs text-gray-500 mt-1 text-center">{progressLabel}</p>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div>
            <button disabled className="w-full py-3 bg-green-600 text-white rounded-md font-medium">
              Completed!
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Your PodShrink is ready! Close this panel and click &quot;Play PodShrink&quot; to listen.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <button
              onClick={() => { setStatus('idle'); setErrorMsg(''); }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
            >
              Error — Try Again
            </button>
            <p className="text-xs text-red-400 mt-2 text-center">{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
