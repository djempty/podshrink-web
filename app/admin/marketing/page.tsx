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

function Quote({ text, caption }: { text: string; caption?: string }) {
  return (
    <div className="my-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
      {caption && <p className="text-purple-400 text-xs font-medium mb-2">{caption}</p>}
      <pre className="text-gray-400 text-xs whitespace-pre-wrap font-sans leading-relaxed">{text}</pre>
    </div>
  );
}

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
          <p className="text-gray-600 text-xs mt-1">Last updated: Feb 25, 2026</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-6">
        <p className="text-purple-300 text-sm font-medium">📢 Current Status — Feb 25, 2026</p>
        <p className="text-gray-400 text-xs mt-1">Social accounts created (X, Instagram, TikTok, YouTube, Reddit). No posts yet — need posting solution (browser control crashed OpenClaw, exploring alternatives: Buffer API, scheduling tools, or manual draft→post workflow). SEO: Dynamic sitemap expansion in progress (89 → 50K+ pages). Google Search Console sitemap fetch failing — investigating. 7 users, 1 paying (colin@teasdale.ca).</p>
      </div>

      {/* ── SEO Strategy ── */}
      <Section title="🔍 SEO Strategy & Technical Status" defaultOpen>
        <div className="mb-4 p-3 bg-green-600/10 rounded-lg border border-green-500/20">
          <p className="text-green-300 text-xs font-medium mb-1">🚀 In Progress: Dynamic Sitemap Expansion</p>
          <p className="text-gray-400 text-xs">Expanding sitemap from 89 URLs to 50,000+ by including all episode pages across 41 shows. Each episode page is a long-tail keyword entry point (e.g. &ldquo;Joe Rogan episode 2045 summary&rdquo;).</p>
        </div>

        <p className="text-white text-xs font-medium mb-2">SEO Impact Projection</p>
        <MiniTable
          headers={['Metric', 'Before', 'After (Projected)', 'Timeline']}
          rows={[
            ['Indexed pages', '89', '50,000+', 'Indexing over 2-4 weeks'],
            ['Long-tail keyword targets', '~10', '50,000+', 'Ongoing as episodes are added'],
            ['Organic search traffic', '~0/week', '500-2,000/week (month 2-3)', 'Gradual ramp'],
            ['Episode-specific queries', 'Not ranking', 'Low-competition rankings', '4-8 weeks'],
            ['Transcript page traffic', 'Minimal', '1,000+/week (month 3-6)', 'As Google indexes'],
          ]}
        />

        <p className="text-white text-xs font-medium mt-4 mb-2">Technical SEO Checklist</p>
        <CheckItem id="seo1" label="Google Search Console — verified ✓" sub="Verified via Cloudflare DNS. Sitemap submitted but showing 'Couldn't fetch' for 2+ days." />
        <CheckItem id="seo2" label="Dynamic sitemap with all episodes" sub="IN PROGRESS — building sitemap index with sub-sitemaps for shows, episodes, and transcripts." />
        <CheckItem id="seo3" label="robots.txt — sitemap reference present ✓" sub="Cloudflare injects managed robots.txt. Our sitemap directive is included." />
        <CheckItem id="seo4" label="OG social image — updated ✓" sub="1200×630 branded image with logo + device mockups." />
        <CheckItem id="seo5" label="Unique meta descriptions per page" sub="TODO — show pages, episode pages, category pages need unique descriptions." />
        <CheckItem id="seo6" label="Structured data (JSON-LD) on episode/transcript pages" sub="TODO — PodcastEpisode + Article schema for rich results." />
        <CheckItem id="seo7" label="Alt text on podcast artwork" sub="TODO — all show/episode artwork images need descriptive alt text." />
        <CheckItem id="seo8" label="Google Analytics 4" sub="TODO — need Measurement ID from Mike." />
        <CheckItem id="seo9" label="Launch /blog with SEO-optimized posts" sub="TODO — planned 20 posts targeting transactional + informational keywords." />
        <CheckItem id="seo10" label="Internal linking: transcripts → shows → categories" sub="TODO — strengthen page authority flow." />

        <p className="text-white text-xs font-medium mt-4 mb-2">Keyword Targets</p>
        <MiniTable
          headers={['Priority', 'Keyword', 'Est. Monthly Volume', 'Difficulty', 'Strategy']}
          rows={[
            ['P1', 'podcast summary', '14,800', 'Medium', 'Homepage + blog'],
            ['P1', 'AI podcast summary', '5,400', 'Low-Med', 'Homepage + features'],
            ['P1', 'podcast summarizer', '3,600', 'Medium', 'Homepage SEO'],
            ['P2', 'shorten podcasts', '1,200', 'Low', 'Blog + landing'],
            ['P2', 'best podcast summary app', '1,900', 'Medium', 'Comparison blog post'],
            ['P3', '[show name] summary', '50,000+', 'Low', 'Episode pages (sitemap)'],
            ['P3', '[episode] recap', '10,000+', 'Very Low', 'Episode + transcript pages'],
          ]}
        />

        <div className="mt-4 p-3 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-purple-400 text-xs font-medium mb-2">💡 The SEO Gold Mine</p>
          <p className="text-gray-400 text-xs">Every episode page is a unique, keyword-rich landing page. With 50K+ episodes across 41 shows, we&rsquo;re targeting the massive long-tail of &ldquo;[show name] [episode title] summary&rdquo; queries. Competitors like Snipd don&rsquo;t publish public episode pages at this scale. This is PodShrink&rsquo;s competitive moat for organic search.</p>
        </div>
      </Section>

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
      <Section title="📱 Platform Strategies (Detailed)">
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">Instagram</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">25-40, design-conscious, podcast enthusiasts</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">4-5x/week (2 Reels, 1-2 Carousels, 1 Static)</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Tue-Fri 11am-1pm, 7-9pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Reels (60-90s), Carousels, Stories (polls), Static</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags (10-15):</strong> #podcasts #podcastlife #podcastaddict #aitool #productivity #podcasting #podcastrecommendations #techstartup #saas #podcastsummary #podshrink</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Reel hooks in first 1s, carousel saves, comment on podcast creator posts, collaborate with micro podcast reviewers</p>
        </div>
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">Twitter/X</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">Tech-savvy 20-45, startup community, early adopters</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">1-2x/day (mix of original + engagement)</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Mon-Fri 8-10am, 12-1pm, 5-6pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Text posts, quote tweets, threads, short video, polls</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags:</strong> Minimal — #podcasts #AI only when relevant</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Reply to podcast hosts, engage in #buildinpublic, quote tweet podcast discourse, share real metrics</p>
        </div>
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">LinkedIn</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">28-55 professionals, managers, entrepreneurs</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">3-4x/week</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Tue-Thu 7-8am, 12pm, 5-6pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Text posts (storytelling), carousels (PDF), short video, articles</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags:</strong> #productivity #podcasts #AI #saas #startup (3-5 max)</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Personal story angle (founder journey), productivity tips, engage in comments, connect with podcast hosts</p>
        </div>
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">Facebook</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">30-55, casual podcast listeners, community-driven</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">3-4x/week on page, daily in relevant groups</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Mon-Fri 1-4pm, Sat 12-1pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Video (Reels + native), link posts, image posts, groups</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Groups to join:</strong> Podcast Listeners, Podcast Recommendations, Productivity Hacks, AI Tools</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Share in groups (value-first, not spammy), Facebook Reels for reach, create PodShrink community group eventually</p>
        </div>
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">TikTok</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">18-35, casual/new podcast listeners, students</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">4-5x/week (consistency over polish)</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Tue-Thu 10am-12pm, 7-9pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Short video (15-60s), trending sounds, screen recordings</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags:</strong> #podcast #podcasttok #productivityhack #aitool #techstartup #podshrink</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Hook in first 1-2 seconds, trending audio, duet/stitch podcast clips</p>
        </div>
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
        <div className="mt-4 p-3 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white text-xs font-medium mb-2">Week-Ahead Workflow</p>
          <p className="text-gray-400 text-xs">Every Friday, Isaac sends Mike the following week&rsquo;s post plan: day-by-day breakdown, draft copy for each post, format/visual notes. Mike approves, requests changes, or adds ideas. Posts go live per schedule.</p>
        </div>
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
      <Section title="📈 Metrics, KPIs &amp; Financial Targets">
        <p className="text-white text-xs font-medium mb-2">Monthly Growth Goals (First 3 Months)</p>
        <MiniTable
          headers={['Month', 'Combined Followers', 'Weekly Posts', 'Signups from Social', 'Target Revenue']}
          rows={[
            ['1', '500', '20-25', '50', '$50-100 (5-10 paid)'],
            ['2', '1,500', '20-25', '150', '$300-500 (30-50 paid)'],
            ['3', '4,000', '25-30', '400', '$1,000+ (100+ paid)'],
          ]}
        />
        <p className="text-white text-xs font-medium mt-4 mb-2">Scaling Roadmap to 100K</p>
        <MiniTable
          headers={['Milestone', 'Users', 'MRR Target', 'Key Lever']}
          rows={[
            ['Month 1-3', '50-400', '$100-1,000', 'Organic social, SEO foundations, community'],
            ['Month 4-6', '400-2,000', '$1,000-5,000', 'Paid ads ($200-500/mo), influencer collabs, email'],
            ['Month 7-12', '2,000-10,000', '$5,000-20,000', 'Content flywheel, referral program, partnerships'],
            ['Year 2', '10,000-100,000', '$20K-200K', 'Viral loops, API/integrations, enterprise tier'],
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
