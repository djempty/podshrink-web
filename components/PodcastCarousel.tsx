'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiscoverPodcast } from '@/lib/api';

interface PodcastCarouselProps {
  label: string;
  podcasts: DiscoverPodcast[];
  onPodcastClick?: (podcast: DiscoverPodcast) => void;
}

export default function PodcastCarousel({ label, podcasts, onPodcastClick }: PodcastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative group">
      <h2 className="text-2xl font-bold mb-4">{label}</h2>
      
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 mt-4 z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 mt-4 z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            onClick={() => onPodcastClick?.(podcast)}
            className="flex-shrink-0 w-[160px] cursor-pointer group/card"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-dark-card">
              {podcast.image ? (
                <img
                  src={podcast.image}
                  alt={podcast.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <span className="text-4xl">🎙️</span>
                </div>
              )}
            </div>
            <p className="font-medium text-sm leading-tight line-clamp-2 group-hover/card:text-purple-400 transition-colors">
              {podcast.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{podcast.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
