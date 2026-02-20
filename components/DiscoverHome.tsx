'use client';

import { useRouter } from 'next/navigation';
import PodcastCarousel from './PodcastCarousel';
import type { DiscoverSection, DiscoverPodcast } from '@/lib/api';

interface DiscoverHomeProps {
  sections: DiscoverSection[];
}

export default function DiscoverHome({ sections }: DiscoverHomeProps) {
  const router = useRouter();

  const handlePodcastClick = async (podcast: DiscoverPodcast) => {
    // Add the show to the backend first, then navigate to its episodes page
    if (podcast.feedUrl) {
      try {
        const { api } = await import('@/lib/api');
        const show = await api.addShow(podcast.feedUrl);
        router.push(`/shows/${show.id}`);
      } catch (error) {
        console.error('Failed to add show:', error);
        // Fallback to add page
        router.push(`/add?url=${encodeURIComponent(podcast.feedUrl)}&title=${encodeURIComponent(podcast.title)}`);
      }
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
