import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Shrinks | PodShrink',
  description: 'Access your saved podcast summaries. Listen, download, and manage your AI-generated shrinks library.',
  openGraph: {
    title: 'Saved Shrinks | PodShrink',
    description: 'Access your saved podcast summaries. Listen, download, and manage your AI-generated shrinks library.',
  },
  twitter: {
    title: 'Saved Shrinks | PodShrink',
    description: 'Access your saved podcast summaries. Listen, download, and manage your AI-generated shrinks library.',
  },
  alternates: {
    canonical: '/saved-shrinks',
  },
};

export default function SavedShrinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
