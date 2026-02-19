import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AudioPlayer from '@/components/AudioPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PodShrink - AI Podcast Summaries',
  description: 'Get bite-sized podcast summaries powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 pb-24">
            {children}
          </main>
        </div>
        <AudioPlayer />
      </body>
    </html>
  );
}
