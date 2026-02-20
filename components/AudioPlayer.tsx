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

  useEffect(() => {
    if (!audioRef.current || !track) return;
    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [track?.audioUrl]);

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
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = duration - currentTime;

  // DESKTOP: Top bar (always visible, even with no track)
  // MOBILE: Bottom bar (only when track loaded)
  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => pause()}
        preload="auto"
      />

      {/* DESKTOP PLAYER - always visible at top */}
      <div className="hidden md:flex fixed top-0 left-[260px] right-0 bg-[#0e0e0e] border-b border-gray-800 z-40 h-[56px] items-center px-4 gap-3">
        {/* Playback Speed */}
        <select
          value={playbackRate}
          onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          className="bg-transparent text-white text-xs px-1 py-0.5 rounded border border-gray-700 focus:outline-none cursor-pointer min-w-[38px]"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>

        {/* Skip Back */}
        <button onClick={() => skipBackward(15)} className="text-gray-400 hover:text-white transition-colors">
          <RotateCcw size={16} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => track && (isPlaying ? pause() : play())}
          className={`transition-colors ${track ? 'text-white hover:text-purple-400' : 'text-gray-600'}`}
          disabled={!track}
        >
          {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill={track ? 'white' : '#4B5563'} />}
        </button>

        {/* Skip Forward */}
        <button onClick={() => skipForward(15)} className="text-gray-400 hover:text-white transition-colors">
          <RotateCw size={16} />
        </button>

        {/* Current Time */}
        <span className="text-[11px] text-gray-500 min-w-[32px] text-right">{track ? formatTime(currentTime) : '0:00'}</span>

        {/* Center: Thumbnail + Progress + Info */}
        <div className="flex-1 flex items-center gap-3">
          {track ? (
            <>
              <img src={track.imageUrl || '/logo.png'} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-center min-w-0">
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
                      ? `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                      : '#374151',
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Remaining Time */}
        <span className="text-[11px] text-gray-500 min-w-[36px]">{track ? `-${formatTime(remaining)}` : '0:00'}</span>

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
        </div>
      </div>

      {/* MOBILE PLAYER - bottom bar, only when track is loaded */}
      {track && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={track.imageUrl || '/logo.png'} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{track.title}</p>
              <p className="text-gray-500 text-xs truncate">{track.showTitle}</p>
              <span className="text-gray-500 text-xs">-{formatTime(remaining)}</span>
            </div>
            {/* Pause/Play */}
            <button
              onClick={() => (isPlaying ? pause() : play())}
              className="text-white p-2"
            >
              {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </button>
            {/* Skip Forward */}
            <button onClick={() => skipForward(10)} className="text-gray-400">
              <RotateCw size={22} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
