'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Mic, Zap, Headphones, ArrowRight, Sparkles, Timer, Brain, Coffee } from 'lucide-react';
import SearchInput from '@/components/SearchInput';
import { api, DiscoverPodcast } from '@/lib/api';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

export default function LandingPage() {
  const router = useRouter();
  const [popularShows, setPopularShows] = useState<DiscoverPodcast[]>([]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PodShrink',
    description: 'AI-powered podcast summaries. Transform hours of podcasts into minutes of narrated audio summaries.',
    url: 'https://podshrink.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://podshrink.com/shows?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  useEffect(() => {
    api.getDiscoverCategory('popular', 8)
      .then(data => setPopularShows(data.podcasts.slice(0, 8)))
      .catch(() => {});
  }, []);

  const handleShowClick = async (podcast: DiscoverPodcast) => {
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

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <section className="relative px-6 pt-8 md:pt-16 pb-10 md:pb-20 text-center z-30">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <ParticleBackground />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">AI-Powered Podcast Summaries</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Hours of podcasts.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Minutes to listen.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            PodShrink uses AI to transform full-length podcast episodes into
            concise, narrated audio summaries. Pick your duration. Pick your voice. Hit play.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => router.push('/shows')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Browse Shows <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push('/categories')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 border border-blue-500 text-blue-400 hover:border-blue-400 hover:text-blue-300 rounded-lg font-semibold text-lg transition-colors"
            >
              Explore Categories
            </button>
          </div>

          {/* Search — larger */}
          <div className="max-w-xl mx-auto relative z-20">
            <SearchInput className="[&_input]:py-3.5 [&_input]:text-base [&_input]:pl-11" />
          </div>
        </div>
      </section>

      {/* Time Is Everything Section */}
      <section className="relative z-10 border-y border-gray-800 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Time is your most valuable asset.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The average podcast episode is 45 minutes. You subscribe to 10 shows.
              That&apos;s over 7 hours a week just to stay current. PodShrink gives you
              the key insights in a fraction of the time — so you can stay informed
              without sacrificing your day.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Timer,
                stat: '90%',
                label: 'Less time listening',
                desc: 'A 1-hour episode becomes a 5-minute summary. Get the insights without the filler.',
              },
              {
                icon: Coffee,
                stat: '7+ hrs',
                label: 'Saved per week',
                desc: 'For the average podcast listener, that\'s an extra workday back — every single week.',
              },
              {
                icon: Brain,
                stat: '100%',
                label: 'Key takeaways retained',
                desc: 'Our AI doesn\'t just cut — it distills. Every important point, argument, and insight preserved.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={24} className="text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{item.stat}</div>
                <div className="text-purple-400 text-sm font-medium mb-2">{item.label}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-10 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">How It Works</h2>
        <p className="text-gray-500 text-center mb-8 md:mb-14 text-lg">Three steps. Under a minute.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Mic,
              title: 'Pick an Episode',
              desc: 'Search any podcast or browse by category. We pull in episodes from millions of shows.',
              color: 'from-purple-500 to-indigo-600',
            },
            {
              icon: Clock,
              title: 'Choose Your Duration',
              desc: 'Want a 1-minute briefing or a 10-minute deep dive? You decide how much time you have.',
              color: 'from-blue-500 to-cyan-600',
            },
            {
              icon: Headphones,
              title: 'Listen to Your Shrink',
              desc: 'AI generates a narrated summary with your chosen voice. Play it instantly or save it for later.',
              color: 'from-green-500 to-emerald-600',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="relative bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <step.icon size={24} className="text-white" />
              </div>
              <div className="text-gray-600 text-sm font-medium mb-2">Step {i + 1}</div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-800 bg-[#0f0f0f]">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-14">Why PodShrink?</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Shrinks are generated in under 2 minutes, even for 3-hour episodes.' },
              { icon: Mic, title: '12 Premium Voices', desc: 'Choose from curated AI voices — each with their own personality and style.' },
              { icon: Clock, title: 'Flexible Duration', desc: '1 minute, 5 minutes, or 10 minutes. Get exactly the depth you need.' },
              { icon: Headphones, title: 'Listen Anywhere', desc: 'Stream instantly in the browser or save shrinks to your library.' },
            ].map((feat, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
                <feat.icon size={24} className="text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Shows */}
      <section className="max-w-5xl mx-auto px-6 py-10 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Popular Shows</h2>
          <button
            onClick={() => router.push('/shows')}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {popularShows.map((show, i) => (
            <div
              key={show.id || i}
              onClick={() => handleShowClick(show)}
              className="cursor-pointer group"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-[#1a1a1a]">
                {show.image ? (
                  <img
                    src={show.image}
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Mic size={32} />
                  </div>
                )}
              </div>
              <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors line-clamp-2">
                {show.title}
              </p>
              <p className="text-gray-600 text-xs mt-0.5 line-clamp-1">{show.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-10 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop skipping episodes.
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Catch up on everything in a fraction of the time.
          </p>
          <button
            onClick={() => router.push('/shows')}
            className="inline-flex items-center gap-2 px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            <Play size={20} fill="white" /> Start Shrinking
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
