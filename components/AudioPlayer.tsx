'use client';

import { useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '@/lib/store';
import Image from 'next/image';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    setAudioElement,
    togglePlayPause,
    setCurrentTime,
    setDuration,
    setVolume,
  } = useAudioStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => useAudioStore.getState().pause();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setCurrentTime, setDuration]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!currentTrack) return null;

  return (
    <>
      <audio ref={audioRef} />
      
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-dark-card border-t border-gray-800 z-50">
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center gap-4">
          {/* Artwork & Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={currentTrack.artwork || '/placeholder.png'}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
              <p className="text-sm text-gray-400 truncate">{currentTrack.show}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-black" fill="currentColor" />
                ) : (
                  <Play size={20} className="text-black ml-0.5" fill="currentColor" />
                )}
              </button>

              <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
              
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              
              <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-gray-400 hover:text-white">
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
        </div>
      </div>
    </>
  );
}
