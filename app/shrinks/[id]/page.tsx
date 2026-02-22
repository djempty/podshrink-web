'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Clock, ArrowRight, Headphones } from 'lucide-react';
import Footer from '@/components/Footer';

interface ShrinkData {
  transcript: string | null;
  summary: string | null;
}

export default function PublicTranscriptPage() {
  const params = useParams();
  const shrinkId = parseInt(params.id as string, 10);

  const [data, setData] = useState<ShrinkData | null>(null);
  const [shrinkInfo, setShrinkInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getShrinkTranscript(shrinkId),
      api.getAllShrinks().then(all => all.find((s: any) => s.id === shrinkId)),
    ])
      .then(([transcriptData, shrink]) => {
        if (!transcriptData.summary && !transcriptData.transcript) {
          setError(true);
        } else {
          setData(transcriptData);
          setShrinkInfo(shrink || null);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [shrinkId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Transcript Not Available</h1>
            <p className="text-gray-400 mb-6">This shrink doesn't have a transcript yet, or doesn't exist.</p>
            <Link href="/shows" className="text-purple-400 hover:text-purple-300">Browse Shows →</Link>
          </div>
        </div>
      </div>
    );
  }

  const episodeTitle = shrinkInfo?.episode?.title || 'Episode Summary';
  const showTitle = shrinkInfo?.episode?.show?.title || '';
  const showImage = shrinkInfo?.episode?.imageUrl || shrinkInfo?.episode?.show?.imageUrl || '/logo.png';
  const duration = shrinkInfo?.targetDurationMinutes || shrinkInfo?.targetDuration;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${episodeTitle} — PodShrink Summary`,
            description: data.summary?.slice(0, 200) || '',
            publisher: {
              '@type': 'Organization',
              name: 'PodShrink',
              url: 'https://podshrink.com',
            },
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 flex-1">
        {/* Header */}
        <div className="flex gap-4 mb-8">
          <img
            src={showImage}
            alt={episodeTitle}
            className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-lg object-cover flex-shrink-0"
          />
          <div className="pt-1">
            <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">PodShrink Summary</p>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">{episodeTitle}</h1>
            {showTitle && <p className="text-gray-400 text-sm mb-2">{showTitle}</p>}
            {duration && (
              <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                <Clock size={12} />{duration} min summary
              </span>
            )}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <Headphones size={24} className="text-purple-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Want to listen to this summary?</p>
              <p className="text-gray-400 text-xs">Sign up for PodShrink and get AI-narrated podcast summaries.</p>
            </div>
            <Link
              href="/signup"
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Sign Up <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{data.summary}</p>
            </div>
          </section>
        )}

        {/* Full Transcript */}
        {data.transcript && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Original Episode Transcript</h2>
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">{data.transcript}</p>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="text-center py-8 border-t border-gray-800">
          <h3 className="text-white font-semibold mb-2">Get more PodShrink summaries</h3>
          <p className="text-gray-500 text-sm mb-4">AI-powered podcast summaries. Hours of podcasts, minutes to listen.</p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              Start Free
            </Link>
            <Link href="/shows" className="px-6 py-2.5 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-lg font-medium transition-colors">
              Browse Shows
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
