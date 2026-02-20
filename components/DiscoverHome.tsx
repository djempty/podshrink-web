'use client';

import { useRouter } from 'next/navigation';
import PodcastCarousel from './PodcastCarousel';
import type { DiscoverSection, DiscoverPodcast } from '@/lib/api';

interface DiscoverHomeProps {
  sections: DiscoverSection[];
}

export default function DiscoverHome({ sections }: DiscoverHomeProps) {
  const router = useRouter();

  const handlePodcastClick = (podcast: DiscoverPodcast) => {
    // Navigate to add page with the feed URL pre-filled
    if (podcast.feedUrl) {
      router.push(`/add?url=${encodeURIComponent(podcast.feedUrl)}&title=${encodeURIComponent(podcast.title)}`);
    }
  };

  if (sections.length === 0) {
    return (
      <div className="bg-dark-card rounded-lg p-8 text-center">
        <p className="text-gray-400">Loading podcast directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <PodcastCarousel
          key={section.key}
          label={section.label}
          podcasts={section.podcasts}
          onPodcastClick={handlePodcastClick}
        />
      ))}
    </div>
  );
}
