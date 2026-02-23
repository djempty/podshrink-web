import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Podcast Transcripts & Summaries — PodShrink',
  description: 'Browse AI-generated podcast episode summaries and transcripts. Search by show or episode title. Free to read, updated daily.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
