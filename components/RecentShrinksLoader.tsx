'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';
import RecentShrinks from './RecentShrinks';

export default function RecentShrinksLoader() {
  const { data: session } = useSession();
  const [shrinks, setShrinks] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.user?.id) {
      setShrinks([]);
      return;
    }
    
    const userId = session.user.email || session.user.id;
    api.getRecentShrinks(userId)
      .then((data) => {
        setShrinks(
          data
            .filter((s) => s.status === 'complete' && s.episode)
            .slice(0, 15)
            .map((s) => ({
              id: s.id,
              episode: s.episode!,
              audioUrl: api.getShrinkAudioUrl(s.id),
              targetDurationMinutes: (s as any).targetDurationMinutes || (s as any).targetDuration,
              createdAt: s.createdAt,
            }))
        );
      })
      .catch(() => setShrinks([]));
  }, [session]);

  if (!session?.user?.id || shrinks.length === 0) return null;

  return <RecentShrinks shrinks={shrinks} />;
}
