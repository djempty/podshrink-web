import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EpisodeDetailClient from './EpisodeDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';

async function fetchEpisode(episodeId: string) {
  try {
    const res = await fetch(`${API_URL}/api/episodes/${episodeId}`, { 
      next: { revalidate: 3600 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string; episodeId: string } }): Promise<Metadata> {
  const episode = await fetchEpisode(params.episodeId);
  
  if (!episode) {
    return {
      title: 'Episode Not Found | PodShrink',
    };
  }

  const title = `${episode.title} — ${episode.show?.title || 'PodShrink'}`;
  const description = episode.description 
    ? episode.description.substring(0, 160) 
    : `Listen to ${episode.title} on PodShrink`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: episode.imageUrl || episode.show?.imageUrl ? [episode.imageUrl || episode.show.imageUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: episode.imageUrl || episode.show?.imageUrl ? [episode.imageUrl || episode.show.imageUrl] : [],
    },
  };
}

export default async function EpisodeDetailPage({ params }: { params: { slug: string; episodeId: string } }) {
  const episode = await fetchEpisode(params.episodeId);

  if (!episode) {
    notFound();
  }

  // JSON-LD structured data for PodcastEpisode
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title,
    description: episode.description || '',
    datePublished: episode.pubDate,
    url: `https://podshrink.com/shows/${params.slug}/episodes/${params.episodeId}`,
    image: episode.imageUrl || episode.show?.imageUrl || '',
    audio: episode.audioUrl ? {
      '@type': 'AudioObject',
      contentUrl: episode.audioUrl,
      duration: episode.duration ? `PT${episode.duration}S` : undefined,
    } : undefined,
    partOfSeries: episode.show ? {
      '@type': 'PodcastSeries',
      name: episode.show.title,
      url: `https://podshrink.com/shows/${episode.show.slug || episode.show.id}`,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EpisodeDetailClient episode={episode} showId={params.slug} />
    </>
  );
}
