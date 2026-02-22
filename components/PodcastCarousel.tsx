'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiscoverPodcast } from '@/lib/api';

interface PodcastCarouselProps {
  label: string;
  podcasts: DiscoverPodcast[];
  onPodcastClick?: (podcast: DiscoverPodcast) => void;
}

export default function PodcastCarousel({ label, podcasts, onPodcastClick }: PodcastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, podcasts]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative group mb-12 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-white">{label}</h2>
      
      {/* Left arrow — hidden on mobile, hidden when at start */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:block absolute left-0 top-[50%] z-10 bg-black/80 hover:bg-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      )}

      {/* Right arrow — hidden on mobile, hidden when at end */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:block absolute right-0 top-[50%] z-10 bg-black/80 hover:bg-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      )}

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            onClick={() => onPodcastClick?.(podcast)}
            className="flex-shrink-0 w-[160px] cursor-pointer group/card"
          >
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#1a1a1a]">
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
            <p className="font-medium text-sm leading-tight line-clamp-2 text-white group-hover/card:text-purple-400 transition-colors">
              {podcast.title}
            </p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{podcast.category}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
