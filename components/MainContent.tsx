'use client';

import { useAudioPlayer } from '@/lib/audioPlayerStore';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { track } = useAudioPlayer();

  return (
    <main
      id="main-content"
      className="flex-1 md:ml-[260px] md:pt-[56px] pt-[68px] overflow-x-hidden overflow-y-auto h-screen"
    >
      {children}
      {/* Spacer so content can scroll above the fixed mobile player */}
      {track && <div className="md:hidden h-[84px] shrink-0" />}
    </main>
  );
}
