'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, Mic, Zap, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import SearchInput from '@/components/SearchInput';

const DEMO_SHOWS = [
  { name: 'Joe Rogan Experience', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/0b/4e/ea/0b4eea35-48e0-5517-839c-15f9c0112423/mza_10446690937468498498.jpg/200x200bb.png' },
  { name: 'The Daily', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/c4/c6/c0/c4c6c028-bd0d-ef20-1eb5-4d24a498f2ff/mza_15498941692482680498.jpg/200x200bb.png' },
  { name: 'Huberman Lab', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/52/4c/4a/524c4ae3-8a46-85d8-0e53-a74040304245/mza_10313153037793771498.jpg/200x200bb.png' },
  { name: 'Mel Robbins', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/2b/9b/fe/2b9bfe3e-43cf-5543-4fa4-a85b3e0b4c3f/mza_10349476953399498498.jpg/200x200bb.png' },
];

export default function LandingPage() {
  const router = useRouter();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => router.push('/shows')}
              className="flex items-center gap-2 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Browse Shows <ArrowRight size={20} />
            </button>
            <button
              onClick={() => router.push('/categories')}
              className="flex items-center gap-2 px-8 py-3.5 border border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Explore Categories
            </button>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <SearchInput className="text-base" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">How It Works</h2>
        <p className="text-gray-500 text-center mb-14 text-lg">Three steps. Under a minute.</p>

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
              className="relative bg-[#141414] border border-gray-800 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 group"
              onMouseEnter={() => setHoveredStep(i)}
              onMouseLeave={() => setHoveredStep(null)}
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
      <section className="bg-[#0f0f0f] border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">Why PodShrink?</h2>

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

      {/* Popular Shows Teaser */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Popular Shows</h2>
          <button
            onClick={() => router.push('/shows')}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {DEMO_SHOWS.map((show, i) => (
            <div
              key={i}
              onClick={() => router.push('/shows')}
              className="cursor-pointer group"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-[#1a1a1a]">
                <img
                  src={show.img}
                  alt={show.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-white text-sm font-medium group-hover:text-purple-400 transition-colors line-clamp-2">
                {show.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
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
    </div>
  );
}
