import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Podcast Categories — PodShrink | Browse by Topic',
  description: 'Browse podcasts by category: Technology, News, Comedy, True Crime, Business, Health, and more. Get AI summaries of any episode.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
