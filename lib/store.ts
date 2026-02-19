'use client';

import { create } from 'zustand';
import { AudioPlayerState } from './types';

interface AudioStore extends AudioPlayerState {
  audioElement: HTMLAudioElement | null;
  setAudioElement: (element: HTMLAudioElement) => void;
  play: (track: AudioPlayerState['currentTrack']) => void;
  pause: () => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  isPlaying: false,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  audioElement: null,

  setAudioElement: (element) => set({ audioElement: element }),

  play: (track) => {
    const { audioElement, currentTrack } = get();
    
    if (audioElement) {
      // If it's a different track, reset time
      if (currentTrack?.audioUrl !== track?.audioUrl) {
        audioElement.src = track?.audioUrl || '';
        audioElement.currentTime = 0;
      }
      
      audioElement.play().catch(console.error);
      set({ isPlaying: true, currentTrack: track });
    }
  },

  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
    }
  },

  togglePlayPause: () => {
    const { isPlaying, audioElement } = get();
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play().catch(console.error);
      }
      set({ isPlaying: !isPlaying });
    }
  },

  setCurrentTime: (time) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.currentTime = time;
      set({ currentTime: time });
    }
  },

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = volume;
      set({ volume });
    }
  },

  reset: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    set({
      isPlaying: false,
      currentTrack: null,
      currentTime: 0,
      duration: 0,
    });
  },
}));
