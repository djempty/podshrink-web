'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { Play, Pause, RotateCcw, RotateCw, Volume2 } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    play,
    pause,
    setCurrentTime,
    setDuration,
    setVolume,
    setPlaybackRate,
    skipForward,
    skipBackward,
  } = useAudioPlayer();

  const [isDragging, setIsDragging] = useState(false);

  // Sync audio element with store
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!audioRef.current || isDragging) return;
    audioRef.current.currentTime = currentTime;
  }, [currentTime, isDragging]);

  const handleTimeUpdate = () => {
    if (!audioRef.current || isDragging) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => pause()}
      />

      {/* Progress Bar */}
      <div className="px-8 pt-2 pb-1">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-8 pb-4">
        {/* Left: Thumbnail + Controls */}
        <div className="flex items-center gap-4 flex-1">
          <img
            src={track.imageUrl || '/placeholder.png'}
            alt={track.title}
            className="w-12 h-12 rounded object-cover"
          />

          <div className="flex items-center gap-3">
            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-[#2a2a2a] text-white text-sm px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-purple-500"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            {/* Skip Back */}
            <button
              onClick={() => skipBackward(15)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <RotateCcw size={20} className="text-white" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => (isPlaying ? pause() : play())}
              className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause size={24} className="text-white" fill="white" />
              ) : (
                <Play size={24} className="text-white" fill="white" />
              )}
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skipForward(15)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <RotateCw size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Center: Track Info */}
        <div className="flex-1 text-center px-8">
          <p className="text-white font-medium text-sm line-clamp-1">{track.title}</p>
          <p className="text-gray-400 text-xs line-clamp-1">{track.showTitle}</p>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Volume2 size={20} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
