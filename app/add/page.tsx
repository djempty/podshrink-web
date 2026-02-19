'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Plus, Loader2 } from 'lucide-react';

export default function AddShowPage() {
  const router = useRouter();
  const [rssUrl, setRssUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rssUrl.trim()) {
      setError('Please enter an RSS URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const show = await api.addShow(rssUrl.trim());
      router.push(`/shows/${show.id}`);
    } catch (err) {
      console.error('Failed to add show:', err);
      setError(err instanceof Error ? err.message : 'Failed to add show');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Plus className="text-purple-400" size={36} />
          Add New Show
        </h1>
        <p className="text-gray-400">
          Enter the RSS feed URL of the podcast you want to add
        </p>
      </div>

      <div className="bg-dark-card rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rss-url" className="block text-sm font-medium text-gray-300 mb-2">
              RSS Feed URL
            </label>
            <input
              type="url"
              id="rss-url"
              value={rssUrl}
              onChange={(e) => setRssUrl(e.target.value)}
              placeholder="https://example.com/feed.rss"
              className="w-full bg-dark-hover border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              You can usually find the RSS feed URL on the podcast's website or in your podcast app
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !rssUrl.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Adding Show...
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Show
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="font-semibold mb-3">Popular Podcasts to Try:</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• The Daily (NYT): https://feeds.simplecast.com/54nAGcIl</p>
            <p>• Lex Fridman Podcast: https://lexfridman.com/feed/podcast/</p>
            <p>• Huberman Lab: https://feeds.megaphone.fm/hubermanlab</p>
          </div>
        </div>
      </div>
    </div>
  );
}
