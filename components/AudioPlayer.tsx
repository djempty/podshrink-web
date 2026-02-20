'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { Play, Pause, RotateCcw, RotateCw, Volume2 } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  // Load new track
  useEffect(() => {
    if (!audioRef.current || !track) return;
    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [track?.audioUrl]);

  // Play/pause sync
  useEffect(() => {
    if (!audioRef.current || !track) return;
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

  // Seek from store (skip fwd/back)
  useEffect(() => {
    if (!audioRef.current || isDragging) return;
    if (Math.abs(audioRef.current.currentTime - currentTime) > 1) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

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
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = duration - currentTime;

  if (!track) return null;

  return (
    <div className="fixed top-0 left-[260px] right-0 bg-[#0e0e0e] border-b border-gray-800 z-40 h-[60px] flex items-center px-6 gap-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => pause()}
        preload="auto"
      />

      {/* Playback Speed */}
      <select
        value={playbackRate}
        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
        className="bg-transparent text-white text-xs px-1 py-0.5 rounded border border-gray-700 focus:outline-none cursor-pointer min-w-[42px]"
      >
        <option value="0.5">0.5x</option>
        <option value="0.75">0.75x</option>
        <option value="1">1x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2x</option>
      </select>

      {/* Skip Back */}
      <button onClick={() => skipBackward(15)} className="text-gray-300 hover:text-white transition-colors">
        <RotateCcw size={18} />
      </button>

      {/* Play/Pause */}
      <button
        onClick={() => (isPlaying ? pause() : play())}
        className="text-white hover:text-purple-400 transition-colors"
      >
        {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
      </button>

      {/* Skip Forward */}
      <button onClick={() => skipForward(15)} className="text-gray-300 hover:text-white transition-colors">
        <RotateCw size={18} />
      </button>

      {/* Current Time */}
      <span className="text-xs text-gray-400 min-w-[40px] text-right">{formatTime(currentTime)}</span>

      {/* Progress Bar + Track Info Container */}
      <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          style={{
            background: duration
              ? `linear-gradient(to right, #9333ea 0%, #9333ea ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
              : '#374151',
          }}
        />
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full">
          <img src={track.imageUrl || '/logo.png'} alt="" className="w-6 h-6 rounded object-cover" />
          <p className="text-xs text-gray-300 truncate">
            <span className="text-white font-medium">{track.title}</span>
            {track.showTitle && <span className="text-gray-500"> · {track.showTitle}</span>}
          </p>
        </div>
      </div>

      {/* Remaining Time */}
      <span className="text-xs text-gray-400 min-w-[40px]">-{formatTime(remaining)}</span>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <Volume2 size={16} className="text-gray-400" />
      </div>
    </div>
  );
}
