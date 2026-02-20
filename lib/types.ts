export interface Show {
  id: number;
  title: string;
  author: string;
  description: string;
  artwork_url: string;
  rss_url: string;
  created_at: string;
}

export interface Episode {
  id: number;
  show_id: number;
  title: string;
  description: string;
  audio_url: string;
  pub_date: string;
  published_at: string;
  duration: number;
  guid: string;
  episode_number?: number;
  image_url?: string;
  created_at: string;
  show?: Show;
  show_title?: string;
}

export interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  description?: string;
}

export interface Shrink {
  id: number;
  episode_id: number;
  target_duration: number;
  voice_id: string;
  status: 'pending' | 'transcribing' | 'generating_script' | 'creating_audio' | 'complete' | 'error';
  script_text?: string;
  audio_url?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  episode?: Episode;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: {
    title: string;
    show: string;
    artwork: string;
    audioUrl: string;
    episodeId?: number;
    shrinkId?: number;
  } | null;
  currentTime: number;
  duration: number;
  volume: number;
}
