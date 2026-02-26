import { Metadata } from 'next';
import { Episode, Shrink } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getEpisode(id: string): Promise<Episode | null> {
  try {
    const res = await fetch(`${API_URL}/api/episodes/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function hasCompletedShrink(episodeId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/shrinks`, {
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const shrinks: Shrink[] = await res.json();
    return shrinks.some(
      (s) => s.episodeId === episodeId && s.status === 'complete' && s.audioUrl
    );
  } catch {
    return false;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const episode = await getEpisode(params.id);
  const hasShrink = episode ? await hasCompletedShrink(episode.id) : false;

  if (!episode) {
    return {
      title: 'Episode Not Found | PodShrink',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `${episode.title} | PodShrink`;
  const description = episode.description
    ? episode.description.slice(0, 160)
    : 'Listen to this podcast episode on PodShrink';

  // Add noindex if there's no completed shrink
  const robots = hasShrink
    ? { index: true, follow: true }
    : { index: false, follow: true };

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      type: 'website',
      images: episode.imageUrl || episode.show?.imageUrl
        ? [{ url: episode.imageUrl || episode.show?.imageUrl || '' }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: episode.imageUrl || episode.show?.imageUrl
        ? [episode.imageUrl || episode.show?.imageUrl || '']
        : undefined,
    },
  };
}

export default function EpisodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
