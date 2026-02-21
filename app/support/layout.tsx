import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & FAQ | PodShrink',
  description: 'Get help with PodShrink. Find answers to common questions about AI podcast summaries, billing, and features.',
  openGraph: {
    title: 'Support & FAQ | PodShrink',
    description: 'Get help with PodShrink. Find answers to common questions about AI podcast summaries, billing, and features.',
  },
  twitter: {
    title: 'Support & FAQ | PodShrink',
    description: 'Get help with PodShrink. Find answers to common questions about AI podcast summaries, billing, and features.',
  },
  alternates: {
    canonical: '/support',
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
