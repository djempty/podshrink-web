import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AudioPlayer from '@/components/AudioPlayer';
import AuthProvider from '@/components/AuthProvider';
import ScrollToTop from '@/components/ScrollToTop';
import MainContent from '@/components/MainContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PodShrink - AI Podcast Summaries',
  description: 'Get bite-sized podcast summaries powered by AI. Transform hours of podcasts into minutes of narrated audio summaries with flexible duration and premium AI voices.',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL('https://podshrink.com'),
  openGraph: {
    title: 'PodShrink - AI Podcast Summaries',
    description: 'Get bite-sized podcast summaries powered by AI. Transform hours of podcasts into minutes of narrated audio summaries with flexible duration and premium AI voices.',
    type: 'website',
    siteName: 'PodShrink',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'PodShrink - AI Podcast Summaries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PodShrink - AI Podcast Summaries',
    description: 'Get bite-sized podcast summaries powered by AI. Transform hours of podcasts into minutes of narrated audio summaries.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PodShrink — AI Podcast Summaries' }],
  },
  alternates: {
    canonical: '/',
  },
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
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-K0Q8WMZZJB"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-K0Q8WMZZJB');` }} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ScrollToTop />
          <div className="flex min-h-screen bg-[#121212]">
            <Sidebar />
            <AudioPlayer />
            <MainContent>
              {children}
            </MainContent>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
