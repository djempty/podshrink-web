'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Show } from '@/lib/types';
import ShowCard from '@/components/ShowCard';
import SearchBar from '@/components/SearchBar';

export default function BrowsePage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await api.getShows();
        setShows(data);
        setFilteredShows(data);
      } catch (error) {
        console.error('Failed to fetch shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFilteredShows(shows);
        return;
      }

      const lowerQuery = query.toLowerCase();
      const filtered = shows.filter(
        (show) =>
          show.title.toLowerCase().includes(lowerQuery) ||
          show.author.toLowerCase().includes(lowerQuery) ||
          show.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredShows(filtered);
    },
    [shows]
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-6">Browse Shows</h1>
        <SearchBar onSearch={handleSearch} placeholder="Search for podcasts..." />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-dark-card rounded-lg mb-2" />
              <div className="h-4 bg-dark-card rounded w-3/4 mb-2" />
              <div className="h-3 bg-dark-card rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredShows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredShows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      ) : (
        <div className="bg-dark-card rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg">No shows found matching your search.</p>
        </div>
      )}
    </div>
  );
}
