'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Show } from '@/lib/types';
import { useFavorites } from '@/lib/favoritesStore';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const { favoriteShowIds, toggle } = useFavorites();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getShows()
      .then((allShows) => {
        const favs = allShows.filter(s => favoriteShowIds.has(s.id));
        setShows(favs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [favoriteShowIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] px-4 md:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Favorites</h1>

      {shows.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Heart size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-lg mb-2">No favorites yet</p>
          <p className="text-sm">Click the heart icon on any show to add it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {shows.map((show) => (
            <div
              key={show.id}
              className="relative cursor-pointer group"
              onClick={() => router.push(`/shows/${show.id}`)}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#1a1a1a]">
                <img
                  src={show.imageUrl || '/logo.png'}
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="font-medium text-sm leading-tight line-clamp-2 text-white group-hover:text-purple-400 transition-colors">
                {show.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{show.author}</p>
              <button
                onClick={(e) => { e.stopPropagation(); toggle(show.id); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full"
              >
                <Heart size={16} className="text-blue-500 fill-blue-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
