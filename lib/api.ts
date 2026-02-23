import { Show, Episode, Voice, Shrink } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/** Resolve audio URLs — relative paths get prefixed with API_URL */
export function resolveAudioUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
}

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
      body: JSON.stringify({ rssUrl }),
    }),
  
  searchShows: (query: string) => 
    fetchAPI<Show[]>(`/api/shows?search=${encodeURIComponent(query)}`),

  // Episodes
  getEpisodes: (showId: number) => 
    fetchAPI<Episode[]>(`/api/shows/${showId}/episodes`),
  
  getEpisode: (id: number) => 
    fetchAPI<Episode>(`/api/episodes/${id}`),

  // Shrinks
  createShrink: (episodeId: number, targetDuration: number, voiceId: string, userId?: string) =>
    fetchAPI<Shrink>(`/api/episodes/${episodeId}/shrink`, {
      method: 'POST',
      body: JSON.stringify({ targetDuration, voiceId, userId }),
    }),
  
  getShrinkStatus: (episodeId: number, shrinkId: number) =>
    fetchAPI<Shrink>(`/api/episodes/${episodeId}/shrink/${shrinkId}`),
  
  getShrink: (id: number) => 
    fetchAPI<Shrink>(`/api/shrinks/${id}`),
  
  getShrinkAudioUrl: (id: number) => 
    `${API_URL}/api/shrinks/${id}/audio`,
  
  getAllShrinks: (userId?: string) =>
    fetchAPI<Shrink[]>(`/api/shrinks${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`),
  
  getPublicShrinks: () =>
    fetchAPI<Shrink[]>('/api/shrinks?public=true'),
  
  getRecentShrinks: (userId?: string) => 
    fetchAPI<Shrink[]>(`/api/shrinks?limit=10${userId ? `&userId=${encodeURIComponent(userId)}` : ''}`),

  deleteShrink: (id: number, userId?: string) =>
    fetchAPI<{ success: boolean }>(`/api/shrinks/${id}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`, { method: 'DELETE' }),

  getShrinkTranscript: (id: number) =>
    fetchAPI<{ transcript: string | null; summary: string | null }>(`/api/shrinks/${id}/transcript`),

  // Voices
  getVoices: () => 
    fetchAPI<Voice[]>('/api/voices'),

  // Discover
  getDiscover: () =>
    fetchAPI<DiscoverSection[]>('/api/discover'),
  
  getDiscoverCategory: (category: string, limit?: number) =>
    fetchAPI<DiscoverSection>(`/api/discover/${category}${limit ? `?limit=${limit}` : ''}`),
  
  searchPodcasts: (term: string) =>
    fetchAPI<DiscoverSection>(`/api/discover/search/${encodeURIComponent(term)}`),
};

export interface DiscoverPodcast {
  id: string;
  title: string;
  artist: string;
  image: string;
  category: string;
  feedUrl?: string;
}

export interface DiscoverSection {
  key: string;
  label: string;
  podcasts: DiscoverPodcast[];
}
