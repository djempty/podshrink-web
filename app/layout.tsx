import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AudioPlayer from '@/components/AudioPlayer';
import AuthProvider from '@/components/AuthProvider';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PodShrink - AI Podcast Summaries',
  description: 'Get bite-sized podcast summaries powered by AI',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ScrollToTop />
          <div className="flex min-h-screen bg-[#121212]">
            <Sidebar />
            <AudioPlayer />
            <main className="flex-1 md:ml-[260px] md:pt-[56px] pt-[68px] overflow-x-hidden pb-20 md:pb-0">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
