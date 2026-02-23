import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Pricing — PodShrink | AI Podcast Summaries',
  description: 'Choose your PodShrink plan. Free, Standard ($9.99/mo), or Pro ($19.99/mo). Get AI-powered podcast summaries with premium voices and flexible durations.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
