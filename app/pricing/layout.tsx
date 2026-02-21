import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans | PodShrink',
  description: 'Choose the perfect plan for your podcast listening. Free, Plus, and Pro options with flexible AI summary credits.',
  openGraph: {
    title: 'Pricing Plans | PodShrink',
    description: 'Choose the perfect plan for your podcast listening. Free, Plus, and Pro options with flexible AI summary credits.',
  },
  twitter: {
    title: 'Pricing Plans | PodShrink',
    description: 'Choose the perfect plan for your podcast listening. Free, Plus, and Pro options with flexible AI summary credits.',
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
