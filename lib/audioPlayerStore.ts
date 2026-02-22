import { create } from 'zustand';

interface Track {
  id: number;
  title: string;
  showTitle: string;
  audioUrl: string;
  imageUrl: string;
  duration: number;
}

interface AudioPlayerState {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  
  setTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
}

export const useAudioPlayer = create<AudioPlayerState>((set, get) => ({
  track: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,

  setTrack: (track) => set({ track, currentTime: 0, duration: track.duration || 0 }),
  
  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  seek: (time) => set({ currentTime: time }),
  
  setVolume: (volume) => set({ volume }),
  
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  setDuration: (duration) => set({ duration }),
  
  skipForward: (seconds) => {
    const { currentTime, duration } = get();
    const newTime = Math.min(currentTime + seconds, duration);
    set({ currentTime: newTime });
  },
  
  skipBackward: (seconds) => {
    const { currentTime } = get();
    const newTime = Math.max(currentTime - seconds, 0);
    set({ currentTime: newTime });
  },
}));
