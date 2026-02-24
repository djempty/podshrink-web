'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, DiscoverPodcast } from '@/lib/api';
import { ChevronRight, Flame, Monitor, Newspaper, Users, Laugh, Briefcase, Search, Dumbbell, FlaskConical, Trophy, GraduationCap, LucideIcon } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const CATEGORIES: { key: string; label: string; color: string; icon: LucideIcon }[] = [
  { key: 'popular', label: 'Popular', color: 'from-purple-600 to-indigo-700', icon: Flame },
  { key: 'technology', label: 'Technology', color: 'from-blue-600 to-cyan-700', icon: Monitor },
  { key: 'news', label: 'News', color: 'from-red-600 to-orange-700', icon: Newspaper },
  { key: 'society-culture', label: 'Society & Culture', color: 'from-pink-600 to-rose-700', icon: Users },
  { key: 'comedy', label: 'Comedy', color: 'from-yellow-600 to-amber-700', icon: Laugh },
  { key: 'business', label: 'Business', color: 'from-green-600 to-emerald-700', icon: Briefcase },
  { key: 'true-crime', label: 'True Crime', color: 'from-gray-700 to-gray-900', icon: Search },
  { key: 'health', label: 'Health & Fitness', color: 'from-teal-600 to-green-700', icon: Dumbbell },
  { key: 'science', label: 'Science', color: 'from-violet-600 to-purple-800', icon: FlaskConical },
  { key: 'sports', label: 'Sports', color: 'from-orange-600 to-red-700', icon: Trophy },
  { key: 'education', label: 'Education', color: 'from-sky-600 to-blue-800', icon: GraduationCap },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [podcasts, setPodcasts] = useState<DiscoverPodcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState('');

  const handleCategoryClick = async (key: string, label: string) => {
    setSelectedCategory(key);
    setCategoryLabel(label);
    setLoading(true);
    try {
      const data = await api.getDiscoverCategory(key, 50);
      setPodcasts(data.podcasts);
    } catch {
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePodcastClick = async (podcast: DiscoverPodcast) => {
    if (podcast.feedUrl) {
      try {
        const show = await api.addShow(podcast.feedUrl);
        router.push(`/shows/${show.id}`);
      } catch {
        const shows = await api.getShows();
        const match = shows.find(s => s.title === podcast.title);
        if (match) router.push(`/shows/${match.id}`);
      }
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setPodcasts([]);
  };

  // Category detail view
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-[#121212] px-4 md:px-8 py-6">
        <button onClick={handleBack} className="text-blue-500 hover:text-blue-400 text-sm mb-6 inline-block">
          &lt;&lt; All Categories
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">{categoryLabel}</h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {podcasts.map((podcast) => (
              <div
                key={podcast.id}
                onClick={() => handlePodcastClick(podcast)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#1a1a1a]">
                  <img
                    src={podcast.image || '/logo.png'}
                    alt={podcast.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <p className="font-medium text-sm leading-tight line-clamp-2 text-white group-hover:text-purple-400 transition-colors">
                  {podcast.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{podcast.artist}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Category grid
  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Categories" />
      <div className="px-4 md:px-8 py-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key, cat.label)}
            className={`relative overflow-hidden rounded-xl p-6 text-left bg-gradient-to-br ${cat.color} hover:opacity-90 transition-opacity group`}
          >
            <cat.icon size={32} className="text-white/80 mb-2" />
            <h2 className="text-white text-xl font-bold">{cat.label}</h2>
            <ChevronRight size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
