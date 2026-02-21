import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Podcast Shows | PodShrink',
  description: 'Browse and discover thousands of podcast shows. Create AI-powered summaries from any episode in minutes.',
  openGraph: {
    title: 'Browse Podcast Shows | PodShrink',
    description: 'Browse and discover thousands of podcast shows. Create AI-powered summaries from any episode in minutes.',
  },
  twitter: {
    title: 'Browse Podcast Shows | PodShrink',
    description: 'Browse and discover thousands of podcast shows. Create AI-powered summaries from any episode in minutes.',
  },
  alternates: {
    canonical: '/shows',
  },
};

export default function ShowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
