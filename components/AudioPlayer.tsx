'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/lib/audioPlayerStore';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
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
    if (isPlaying) audioRef.current.play().catch(console.error);
  }, [track?.audioUrl]);

  useEffect(() => {
    if (!audioRef.current || !track) return;
    if (isPlaying) audioRef.current.play().catch(console.error);
    else audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackRate; }, [playbackRate]);

  useEffect(() => {
    if (!audioRef.current || isDragging) return;
    if (Math.abs(audioRef.current.currentTime - currentTime) > 1) audioRef.current.currentTime = currentTime;
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (!audioRef.current || isDragging) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const browserDuration = audioRef.current.duration;
    // Use track.duration (from backend) as source of truth if available
    const storedDuration = track?.duration || 0;
    if (storedDuration > 0) {
      // Backend knows the real duration — use it, ignore browser metadata
      setDuration(storedDuration);
    } else if (isFinite(browserDuration) && browserDuration > 0) {
      // No stored duration — fall back to browser metadata
      setDuration(browserDuration);
    }
  };

  const seekFromEvent = (e: React.MouseEvent | MouseEvent) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    seekFromEvent(e);
    const onMove = (ev: MouseEvent) => seekFromEvent(ev);
    const onUp = () => { setIsDragging(false); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pct = duration ? Math.min((currentTime / duration) * 100, 100) : 0;
  const remaining = Math.max(0, duration - currentTime);

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={() => pause()} preload="auto" />

      {/* DESKTOP PLAYER */}
      <div className="hidden md:block fixed top-0 left-[260px] right-0 z-40">
        {/* Main bar */}
        <div className="bg-[#2a2a2a] h-[52px] flex items-center px-4 gap-3">
          {/* Left controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => skipBackward(15)} className="text-gray-400 hover:text-white transition-colors" disabled={!track}>
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => track && (isPlaying ? pause() : play())}
              className={`transition-colors ${track ? 'text-white hover:text-gray-300' : 'text-gray-600'}`}
              disabled={!track}
            >
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill={track ? 'white' : '#4B5563'} />}
            </button>
            <button onClick={() => skipForward(15)} className="text-gray-400 hover:text-white transition-colors" disabled={!track}>
              <RotateCw size={16} />
            </button>
          </div>

          {/* Thumbnail */}
          {track ? (
            <img src={track.imageUrl || '/logo.png'} alt={track.title || "Now playing"} className="w-10 h-10 rounded object-cover flex-shrink-0 self-center" />
          ) : (
            <div className="w-10 h-10 flex-shrink-0" />
          )}

          {/* Time / Info area */}
          {track && isPlaying ? (
            /* PLAYING STATE: show title + source + times */
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-xs text-gray-400 min-w-[36px]">{formatTime(currentTime)}</span>
              <div className="flex-1 min-w-0 text-center">
                <p className="text-white text-sm font-medium truncate">{track.title}</p>
                <p className="text-gray-500 text-xs truncate">{track.showTitle}</p>
              </div>
              <span className="text-xs text-gray-400 min-w-[40px] text-right">-{formatTime(remaining)}</span>
            </div>
          ) : track ? (
            /* PAUSED WITH TRACK: show time + logo center + remaining */
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-xs text-gray-400 min-w-[36px]">{formatTime(currentTime)}</span>
              <div className="flex-1 flex justify-center -ml-8">
                <img src="/logo.png" alt="PodShrink" className="h-7 opacity-60" />
              </div>
              <span className="text-xs text-gray-400 min-w-[40px] text-right">-{formatTime(remaining)}</span>
            </div>
          ) : (
            /* NO TRACK: show logo center + 0:00 */
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-xs text-gray-500 min-w-[36px]">0:00</span>
              <div className="flex-1 flex justify-center -ml-8">
                <img src="/logo.png" alt="PodShrink" className="h-7 opacity-40" />
              </div>
              <span className="text-xs text-gray-500 min-w-[40px] text-right">0:00</span>
            </div>
          )}

          {/* Volume */}
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Progress bar underneath */}
        <div
          ref={progressRef}
          className="h-[3px] bg-[#1a1a1a] cursor-pointer relative group"
          onMouseDown={handleProgressMouseDown}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => { if (!isDragging) setIsHoveringProgress(false); }}
        >
          {/* Filled */}
          <div className="absolute top-0 left-0 h-full bg-blue-500 transition-none" style={{ width: `${pct}%` }} />
          {/* Hover/drag handle */}
          {(isHoveringProgress || isDragging) && track && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg transition-none"
              style={{ left: `calc(${pct}% - 6px)` }}
            />
          )}
        </div>
      </div>

      {/* MOBILE SPACER — prevents content from hiding behind the fixed player */}
      {track && (
        <div className="md:hidden h-[76px]" />
      )}

      {/* MOBILE PLAYER */}
      {track && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={track.imageUrl || '/logo.png'} alt={track.title || "Now playing"} className="w-12 h-12 rounded object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{track.title}</p>
              <p className="text-gray-500 text-xs truncate">{track.showTitle}</p>
              <span className="text-gray-500 text-xs">-{formatTime(remaining)}</span>
            </div>
            <button onClick={() => (isPlaying ? pause() : play())} className="text-white p-2">
              {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </button>
            <button onClick={() => skipForward(10)} className="text-gray-400">
              <RotateCw size={22} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
