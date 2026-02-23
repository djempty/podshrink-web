import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Browse Podcasts — PodShrink | Discover & Summarize Shows',
  description: 'Discover popular podcasts and get AI-powered audio summaries. Browse by category, search any show, and shrink episodes into 1, 5, or 10-minute summaries.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
