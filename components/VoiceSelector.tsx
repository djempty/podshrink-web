'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Volume2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface VoiceData {
  id: string;
  voiceId: string;
  name: string;
  gender: string;
  description?: string;
  previewUrl: string;
  free: boolean;
}

interface VoiceSelectorProps {
  value: string;
  onChange: (voiceId: string) => void;
}

export default function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<VoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  
  const userPlan = (session?.user as any)?.plan || 'free';
  const hasPremiumVoices = userPlan === 'standard' || userPlan === 'pro';

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const data = await api.getVoices();
        setVoices(data as any);
        // Set initial value to first free voice if nothing selected
        if (data.length > 0 && !value) {
          onChange((data[0] as any).voiceId || (data[0] as any).id);
        }
      } catch (err) {
        console.error('Failed to fetch voices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVoices();
  }, [value, onChange]);

  const getVoiceId = (v: VoiceData) => v.voiceId || v.id;
  const selectedVoice = voices.find((v) => getVoiceId(v) === value);
  const isVoiceLocked = (voice: VoiceData) => !hasPremiumVoices && !voice.free;

  const handlePreview = () => {
    if (selectedVoice?.previewUrl) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const url = selectedVoice.previewUrl.startsWith('http') ? selectedVoice.previewUrl : `${API_URL}${selectedVoice.previewUrl}`;
      const audio = new Audio(url);
      audio.play();
    }
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
            const voice = voices.find(v => getVoiceId(v) === e.target.value);
            if (voice && !isVoiceLocked(voice)) {
              onChange(e.target.value);
            }
          }}
          className="flex-1 bg-dark-hover border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {voices.map((voice) => {
            const locked = isVoiceLocked(voice);
            const vid = getVoiceId(voice);
            return (
              <option
                key={vid}
                value={vid}
                disabled={locked}
              >
                {voice.name}{locked ? ' 🔒' : ''}
              </option>
            );
          })}
        </select>
        {selectedVoice?.previewUrl && (
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
