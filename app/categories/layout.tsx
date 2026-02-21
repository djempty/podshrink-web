import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcast Categories | PodShrink',
  description: 'Explore podcasts by category: Technology, News, Comedy, Business, True Crime, Health, and more. Find your next favorite show.',
  openGraph: {
    title: 'Podcast Categories | PodShrink',
    description: 'Explore podcasts by category: Technology, News, Comedy, Business, True Crime, Health, and more. Find your next favorite show.',
  },
  twitter: {
    title: 'Podcast Categories | PodShrink',
    description: 'Explore podcasts by category: Technology, News, Comedy, Business, True Crime, Health, and more. Find your next favorite show.',
  },
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
