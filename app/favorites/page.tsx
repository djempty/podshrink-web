'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Show } from '@/lib/types';
import ShowCard from '@/components/ShowCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        // TODO: Implement favorites functionality in backend
        // For now, just show all shows
        const data = await api.getShows();
        setShows(data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Heart className="text-red-500" size={36} />
          Favorites
        </h1>
        <p className="text-gray-400">Your saved shows</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-dark-card rounded-lg mb-2" />
              <div className="h-4 bg-dark-card rounded w-3/4 mb-2" />
              <div className="h-3 bg-dark-card rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : shows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      ) : (
        <div className="bg-dark-card rounded-lg p-12 text-center">
          <Heart size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg mb-2">No favorites yet</p>
          <p className="text-gray-500 text-sm">
            Start adding shows to your favorites to see them here
          </p>
        </div>
      )}
    </div>
  );
}
