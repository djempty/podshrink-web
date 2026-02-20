export interface Show {
  id: number;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  rssUrl: string;
  language?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Episode {
  id: number;
  showId: number;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl?: string;
  pubDate: string;
  duration: number;
  guid: string;
  link?: string;
  episodeNumber?: number;
  createdAt: string;
  show?: Show;
}

export interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  description?: string;
}

export interface Shrink {
  id: number;
  episodeId: number;
  targetDuration: number;
  voiceId: string;
  status: 'pending' | 'transcribing' | 'generating_script' | 'creating_audio' | 'complete' | 'error';
  scriptText?: string;
  audioUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  episode?: Episode;
}
