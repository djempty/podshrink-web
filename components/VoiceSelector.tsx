'use client';

import { useEffect, useState } from 'react';
import { Voice } from '@/lib/types';
import { api } from '@/lib/api';
import { Volume2, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface VoiceSelectorProps {
  value: string;
  onChange: (voiceId: string) => void;
}

export default function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<(Voice & { free?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  
  const userPlan = (session?.user as any)?.plan || 'free';
  const hasPremiumVoices = userPlan === 'standard' || userPlan === 'pro';

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const data = await api.getVoices();
        setVoices(data);
        if (data.length > 0 && !value) {
          onChange(data[0].voice_id);
        }
      } catch (err) {
        console.error('Failed to fetch voices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [value, onChange]);

  const selectedVoice = voices.find((v) => v.voice_id === value);

  const handlePreview = () => {
    if (selectedVoice?.preview_url) {
      const audio = new Audio(selectedVoice.preview_url);
      audio.play();
    }
  };

  const isVoiceLocked = (voice: Voice & { free?: boolean }) => {
    return !hasPremiumVoices && voice.free === false;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-dark-hover rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Voice
        {!hasPremiumVoices && (
          <span className="text-gray-500 text-xs ml-2">3 free voices · <a href="/pricing" className="text-purple-400 hover:text-purple-300">Upgrade for all 12</a></span>
        )}
      </label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => {
            const voice = voices.find(v => v.voice_id === e.target.value);
            if (voice && !isVoiceLocked(voice)) {
              onChange(e.target.value);
            }
          }}
          className="flex-1 bg-dark-hover border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {voices.map((voice) => {
            const locked = isVoiceLocked(voice);
            return (
              <option
                key={voice.voice_id}
                value={voice.voice_id}
                disabled={locked}
              >
                {voice.name}{locked ? ' 🔒' : ''}
              </option>
            );
          })}
        </select>
        {selectedVoice?.preview_url && (
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 bg-dark-hover border border-gray-700 rounded-lg hover:bg-dark-card transition-colors text-gray-300 hover:text-white"
            title="Preview voice"
          >
            <Volume2 size={20} />
          </button>
        )}
      </div>
      {selectedVoice?.description && (
        <p className="text-xs text-gray-500">{selectedVoice.description}</p>
      )}
    </div>
  );
}
