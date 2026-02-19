import { Show, Episode, Voice, Shrink } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Shows
  getShows: () => fetchAPI<Show[]>('/api/shows'),
  
  getShow: (id: number) => fetchAPI<Show>(`/api/shows/${id}`),
  
  addShow: (rssUrl: string) => 
    fetchAPI<Show>('/api/shows', {
      method: 'POST',
      body: JSON.stringify({ rss_url: rssUrl }),
    }),
  
  searchShows: (query: string) => 
    fetchAPI<Show[]>(`/api/shows?search=${encodeURIComponent(query)}`),

  // Episodes
  getEpisodes: (showId: number) => 
    fetchAPI<Episode[]>(`/api/shows/${showId}/episodes`),
  
  getEpisode: (id: number) => 
    fetchAPI<Episode>(`/api/episodes/${id}`),

  // Shrinks
  createShrink: (episodeId: number, targetDuration: number, voiceId: string) =>
    fetchAPI<Shrink>(`/api/episodes/${episodeId}/shrink`, {
      method: 'POST',
      body: JSON.stringify({ target_duration: targetDuration, voice_id: voiceId }),
    }),
  
  getShrink: (id: number) => 
    fetchAPI<Shrink>(`/api/shrinks/${id}`),
  
  getShrinkAudioUrl: (id: number) => 
    `${API_URL}/api/shrinks/${id}/audio`,
  
  getRecentShrinks: () => 
    fetchAPI<Shrink[]>('/api/shrinks?limit=10'),

  // Voices
  getVoices: () => 
    fetchAPI<Voice[]>('/api/voices'),
};
