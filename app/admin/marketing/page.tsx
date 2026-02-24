'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, ExternalLink } from 'lucide-react';

// ── Accordion ──────────────────────────────────────────────
function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 bg-[#141414] hover:bg-[#1a1a1a] transition-colors text-left">
        <span className="text-white font-semibold text-sm">{title}</span>
        {open ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
      </button>
      {open && <div className="px-5 py-4 bg-[#0f0f0f] text-sm text-gray-300 leading-relaxed">{children}</div>}
    </div>
  );
}

// ── Checklist item with localStorage persistence ──────────
function CheckItem({ id, label, sub }: { id: string; label: string; sub?: string }) {
  const [checked, setChecked] = useState(false);
  useEffect(() => { setChecked(localStorage.getItem(`mkt_${id}`) === '1'); }, [id]);
  const toggle = () => {
    const next = !checked;
    setChecked(next);
    localStorage.setItem(`mkt_${id}`, next ? '1' : '0');
  };
  return (
    <button onClick={toggle} className="flex items-start gap-3 w-full text-left py-2 group">
      {checked
        ? <CheckSquare size={16} className="text-purple-400 mt-0.5 shrink-0" />
        : <Square size={16} className="text-gray-600 group-hover:text-gray-400 mt-0.5 shrink-0" />}
      <div>
        <span className={checked ? 'text-gray-500 line-through' : 'text-gray-200'}>{label}</span>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

// ── Pill badge ────────────────────────────────────────────
function Pill({ children, color = 'purple' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-600/20 text-purple-400',
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    amber: 'bg-amber-600/20 text-amber-400',
    red: 'bg-red-600/20 text-red-400',
    gray: 'bg-gray-600/20 text-gray-400',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>{children}</span>;
}

// ── Table helper ──────────────────────────────────────────
function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mt-3 mb-2">
      <table className="w-full text-xs">
        <thead><tr>{headers.map((h, i) => <th key={i} className="text-left text-gray-500 font-medium py-1.5 px-2 border-b border-gray-800">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j} className="py-1.5 px-2 border-b border-gray-800/50 text-gray-400">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export default function MarketingPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing Plan</h1>
          <p className="text-gray-500 text-sm mt-1">Social media strategy &amp; launch sequence</p>
        </div>
        <div className="text-right">
          <Pill color="green">Phase: Launch (Days 1-14)</Pill>
          <p className="text-gray-600 text-xs mt-1">Last updated: Feb 24, 2026</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-6">
        <p className="text-purple-300 text-sm font-medium">📢 Current Status</p>
        <p className="text-gray-400 text-xs mt-1">Strategy doc complete. Waiting for Mike to set up social media accounts (Twitter/X, Instagram, TikTok, LinkedIn, Facebook). Colin@teasdale.ca is first paying subscriber. 7 users total.</p>
      </div>

      {/* ── Brand Voice ── */}
      <Section title="🎙️ Brand Voice" defaultOpen>
        <p className="mb-3"><strong className="text-white">Personality:</strong> Smart, confident, slightly witty. &ldquo;Your friend who&rsquo;s really into podcasts and also happens to be a tech nerd.&rdquo;</p>
        <MiniTable
          headers={['Platform', 'Tone']}
          rows={[
            ['Instagram', 'Visual, punchy, emoji-friendly but not cringe'],
            ['Twitter/X', 'Sharp, conversational, meme-literate, hot takes welcome'],
            ['LinkedIn', 'Professional but not boring, productivity-focused'],
            ['Facebook', 'Warm, community-oriented, conversational'],
            ['TikTok', 'Casual, fast-paced, hook-first, personality-forward'],
          ]}
        />
        <p className="mt-3 text-red-400 text-xs"><strong>Never:</strong> Corporate jargon, &ldquo;we&rsquo;re excited to announce,&rdquo; forced hashtag stuffing, begging for follows</p>
      </Section>

      {/* ── Visual Style ── */}
      <Section title="🎨 Visual Style Guide">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#121212] border border-gray-700" title="#121212" />
          <div className="w-10 h-10 rounded-lg bg-purple-500" title="#a855f7" />
          <div className="w-10 h-10 rounded-lg bg-blue-500" title="#3b82f6" />
          <div className="w-10 h-10 rounded-lg bg-white" title="#ffffff" />
        </div>
        <p>Dark/moody tech aesthetic, clean typography, soundwave motifs. Clean geometric sans-serif (Montserrat, Inter). Bold statements as images, screen recordings.</p>
        <p className="mt-2 text-red-400 text-xs"><strong>Don&rsquo;t:</strong> Bright/busy backgrounds, stock photos of people with headphones, cluttered designs.</p>
      </Section>

      {/* ── Content Pillars ── */}
      <Section title="📊 Content Pillars">
        <MiniTable
          headers={['Pillar', 'Description', 'Example']}
          rows={[
            ['⏱️ Time Savings', 'Core value prop — hours → minutes', '"That 3hr Joe Rogan in 5 min"'],
            ['🎙️ Feature Spotlight', 'Showcase features', 'Voice selection demo, duration slider'],
            ['🎧 Podcast Culture', 'Podcast listener identity', 'Relatable podcast struggles'],
            ['🔧 Behind the Scenes', 'Building in public', 'Tech decisions, real numbers'],
            ['💡 Tips & Use Cases', 'How people use PodShrink', 'Commute routine, study hack'],
            ['📊 Industry/Trends', 'Stats & AI trends', 'Market growth, listening habits'],
          ]}
        />
      </Section>

      {/* ── Platform Strategies ── */}
      <Section title="📱 Platform Strategies">
        {[
          { name: 'Instagram', audience: '25-40, design-conscious, podcast enthusiasts', freq: '4-5x/week', times: 'Tue-Fri 11am-1pm, 7-9pm EST', formats: 'Reels (60-90s), Carousels, Stories, Static posts' },
          { name: 'Twitter/X', audience: 'Tech-savvy 20-45, startup community, early adopters', freq: '1-2x/day', times: 'Mon-Fri 8-10am, 12-1pm, 5-6pm EST', formats: 'Text, quote tweets, threads, short video, polls' },
          { name: 'LinkedIn', audience: '28-55 professionals, entrepreneurs, lifelong learners', freq: '3-4x/week', times: 'Tue-Thu 7-8am, 12pm, 5-6pm EST', formats: 'Text posts, carousels (PDF), short video, articles' },
          { name: 'Facebook', audience: '30-55, casual listeners, community-driven', freq: '3-4x/week + daily in groups', times: 'Mon-Fri 1-4pm, Sat 12-1pm EST', formats: 'Video, link posts, image posts, group discussions' },
          { name: 'TikTok', audience: '18-35, students, content-hungry', freq: '4-5x/week', times: 'Tue-Thu 10am-12pm, 7-9pm EST', formats: 'Short video (15-60s), trending sounds, screen recordings' },
        ].map(p => (
          <div key={p.name} className="mb-4 p-3 bg-[#141414] rounded-lg border border-gray-800">
            <p className="text-white font-medium text-sm mb-2">{p.name}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">{p.audience}</span></div>
              <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">{p.freq}</span></div>
              <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">{p.times}</span></div>
              <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">{p.formats}</span></div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── Launch Sequence ── */}
      <Section title="🚀 Launch Sequence — Days 1-14" defaultOpen>
        <p className="text-gray-500 text-xs mb-4">Check off completed items. Progress saved locally.</p>
        <CheckItem id="d1" label="Day 1 — 'We're Here'" sub="Introduction post across all platforms. 30s screen recording demo reel. Twitter text launch. LinkedIn founder story." />
        <CheckItem id="d2" label="Day 2 — 'The Problem'" sub="Instagram carousel (The Podcast Problem). Twitter guilt hook. TikTok POV overwhelming queue." />
        <CheckItem id="d3" label="Day 3 — 'How It Works'" sub="Step-by-step video/carousel. LinkedIn productivity walkthrough." />
        <CheckItem id="d4" label="Day 4 — 'Voice Selection' (Feature Spotlight)" sub="Reel: same episode 3 different voices. Twitter poll on preferred AI voice. TikTok character select." />
        <CheckItem id="d5" label="Day 5 — 'The Commute' (Use Case)" sub="Story + static commute angle. LinkedIn commute routine. Facebook commute graphic." />
        <CheckItem id="d6" label="Day 6 — 'Behind the Scenes'" sub="Twitter thread: first week real metrics. Instagram BTS stories. TikTok day-in-life." />
        <CheckItem id="d7" label="Day 7 — 'Weekend Catch-Up'" sub="Sunday catch-up post. Carousel: 5 podcasts summarized." />
        <CheckItem id="d8" label="Day 8 — Social Proof" sub="User testimonial / early adopter quote." />
        <CheckItem id="d9" label="Day 9 — 'Did You Know?'" sub="Podcast industry stats + PodShrink positioning." />
        <CheckItem id="d10" label="Day 10 — AI Audio Deep Dive" sub="Educational thought leadership on AI audio tech." />
        <CheckItem id="d11" label="Day 11 — Engagement Push" sub="'What podcast should we summarize?' crowd-source." />
        <CheckItem id="d12" label="Day 12 — Deliver the Summary" sub="Post the summary of most-requested episode." />
        <CheckItem id="d13" label="Day 13 — Pricing Reveal" sub="'Free tier = 3 summaries/month. That's 3 fewer podcast guilt trips.'" />
        <CheckItem id="d14" label="Day 14 — Week 2 Recap" sub="What's coming next, CTA to sign up." />
      </Section>

      {/* ── Weekly Cadence ── */}
      <Section title="📅 Ongoing Weekly Cadence (Week 3+)">
        <MiniTable
          headers={['Day', 'Content Type', 'Platforms', 'Pillar']}
          rows={[
            ['Monday', 'Productivity tip / "Start your week"', 'LinkedIn, Twitter', '⏱️ Time Savings'],
            ['Tuesday', 'Feature spotlight / How-to', 'Instagram (Reel), TikTok', '🎙️ Feature Spotlight'],
            ['Wednesday', 'Podcast culture / Relatable', 'Twitter, Instagram, TikTok', '🎧 Podcast Culture'],
            ['Thursday', 'Behind the scenes / Metrics', 'Twitter, LinkedIn', '🔧 Behind the Scenes'],
            ['Friday', 'Use case / Tip', 'Instagram (Carousel), Facebook', '💡 Tips & Use Cases'],
            ['Saturday', 'Industry trend / Stat', 'LinkedIn, Twitter', '📊 Industry/Trends'],
            ['Sunday', '"Weekend catch-up" — light/fun', 'Instagram (Story), TikTok', '🎧 Podcast Culture'],
          ]}
        />
      </Section>

      {/* ── Post Templates ── */}
      <Section title="✍️ Post Templates">
        {[
          { platform: 'Instagram Reel — Feature Demo', content: '🎬 Screen recording: search "Huberman Lab" → select episode → choose voice "Iniga" → 3-min summary → play audio.\n\nCaption: "3 hours of neuroscience in 3 minutes. Pick your voice, get the highlights. Link in bio 🧠🎙️"' },
          { platform: 'Instagram Carousel — Relatable', content: 'Slide 1: "Signs you have a podcast problem"\nSlide 2: "Your queue has 200+ hours"\nSlide 3: "You start episodes and never finish them"\nSlide 4: "You subscribe to new ones before finishing old ones"\nSlide 5: "You feel genuine guilt about unplayed episodes"\nSlide 6: "The cure exists. It\'s called PodShrink."' },
          { platform: 'Twitter — Engagement', content: '"Hot take: you don\'t need to listen to every minute of a podcast to get the value from it.\n\nSome episodes have 20 minutes of gold buried in 3 hours of conversation.\n\nThat\'s why we built PodShrink."' },
          { platform: 'Twitter — Building in Public', content: '"PodShrink week 3 numbers:\n- 47 new signups\n- 312 summaries generated\n- Most popular voice: Iniga\n- Longest episode summarized: 4h 12m → 8 min summary\n\nSmall numbers, but the retention is wild."' },
          { platform: 'LinkedIn — Storytelling', content: '"I used to feel guilty about my podcast queue. 47 subscriptions. Maybe 5 I actually listened to regularly.\n\nSo I started building PodShrink — an AI tool that turns full podcast episodes into short audio summaries.\n\nNot transcripts. Actual narrated summaries in 3-5 minutes, in the AI voice of your choice."' },
          { platform: 'TikTok — Hook-First', content: '[Text on screen: "This app summarizes 3-hour podcasts in 5 minutes"]\n[Screen recording of PodShrink]\n[Playing the audio summary]\n\nCaption: "No more podcast guilt 🎙️ #podcast #podcasttok #aitool"' },
        ].map((t, i) => (
          <div key={i} className="mb-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
            <p className="text-purple-400 text-xs font-medium mb-2">{t.platform}</p>
            <pre className="text-gray-400 text-xs whitespace-pre-wrap font-sans">{t.content}</pre>
          </div>
        ))}
      </Section>

      {/* ── Engagement Strategy ── */}
      <Section title="🤝 Engagement Strategy (First 90 Days)">
        <div className="space-y-3">
          <div>
            <p className="text-white text-xs font-medium mb-2">Organic Growth Tactics</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li>Comment on podcast creators&rsquo; posts — genuine, insightful (not &ldquo;check out our tool!&rdquo;)</li>
              <li>Engage in podcast subreddits/groups — be helpful first</li>
              <li>Quote tweet/stitch podcast discourse — add value</li>
              <li>&ldquo;Summarize this&rdquo; challenges — audience submits episodes</li>
              <li>Collaborate with micro-influencers (1K-50K) — offer free Pro accounts</li>
              <li>Cross-post Reels to IG, TikTok, FB, YouTube Shorts</li>
              <li>Engage with every comment in first 30 days</li>
            </ul>
          </div>
          <MiniTable
            headers={['Phase', 'Timeline', 'Focus']}
            rows={[
              ['Foundation', 'Weeks 1-4', 'Follow/engage 20-30 accounts daily, respond to every comment within 2hrs, join 5-10 FB groups'],
              ['Acceleration', 'Weeks 5-8', 'Reach out to 5 podcast micro-influencers, launch #ShrinkIt/#PodShrunk, first paid boost ($50-100)'],
              ['Optimization', 'Weeks 9-12', 'Analyze top content types, A/B test timing, build email list from social, plan UGC campaign'],
            ]}
          />
        </div>
      </Section>

      {/* ── KPIs ── */}
      <Section title="📈 Metrics & KPIs">
        <p className="text-white text-xs font-medium mb-2">Monthly Goals (First 3 Months)</p>
        <MiniTable
          headers={['Month', 'Combined Followers', 'Weekly Posts', 'Signups from Social']}
          rows={[
            ['1', '500', '20-25', '50'],
            ['2', '1,500', '20-25', '150'],
            ['3', '4,000', '25-30', '400'],
          ]}
        />
        <p className="text-white text-xs font-medium mt-4 mb-2">Weekly Review Checklist</p>
        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
          <li>Review analytics for each platform</li>
          <li>Identify top 3 performing posts — why did they work?</li>
          <li>Identify bottom 3 — what to avoid?</li>
          <li>Plan next week&rsquo;s content calendar</li>
          <li>Check competitor social accounts for trends</li>
          <li>Respond to any unanswered comments/DMs</li>
        </ul>
      </Section>

      {/* ── Marketing Team ── */}
      <Section title="🤖 Marketing Sub-Agent Team">
        <p className="text-gray-500 text-xs mb-3">Planned automation team (activation pending platform setup):</p>
        {[
          { emoji: '🎨', name: 'Luna', role: 'Content & Creative Director', desc: 'Generates social posts, blog drafts, episode highlight cards from shrink data' },
          { emoji: '📹', name: 'Reel', role: 'Video Producer', desc: 'Short-form video content — waveform animations + captions + branded intro/outro' },
          { emoji: '📡', name: 'Echo', role: 'Social Media Manager', desc: 'Schedules, posts, and engages across all platforms' },
          { emoji: '🔍', name: 'Radar', role: 'SEO & Analytics', desc: 'Rankings, traffic, site health, competitor movements, weekly KPI reports' },
          { emoji: '💬', name: 'Scout', role: 'Community & Outreach', desc: 'Reddit/forum monitoring, partnership outreach to podcast hosts' },
          { emoji: '📧', name: 'Pulse', role: 'Email & Retention', desc: 'Newsletters, win-back campaigns, upgrade nudges' },
        ].map(a => (
          <div key={a.name} className="flex items-start gap-3 mb-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
            <span className="text-lg">{a.emoji}</span>
            <div>
              <p className="text-white text-sm font-medium">{a.name} — <span className="text-gray-400 font-normal">{a.role}</span></p>
              <p className="text-gray-500 text-xs mt-0.5">{a.desc}</p>
            </div>
          </div>
        ))}
        <p className="text-gray-600 text-xs mt-2">Activation order: Luna → Radar → Reel → Echo → Scout → Pulse</p>
      </Section>
    </div>
  );
}
