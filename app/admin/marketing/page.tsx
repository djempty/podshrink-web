'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react';

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

// ── Checklist ─────────────────────────────────────────────
function CheckItem({ id, label, sub }: { id: string; label: string; sub?: string }) {
  const [checked, setChecked] = useState(false);
  useEffect(() => { setChecked(localStorage.getItem(`mkt_${id}`) === '1'); }, [id]);
  const toggle = () => { const next = !checked; setChecked(next); localStorage.setItem(`mkt_${id}`, next ? '1' : '0'); };
  return (
    <button onClick={toggle} className="flex items-start gap-3 w-full text-left py-2 group">
      {checked ? <CheckSquare size={16} className="text-purple-400 mt-0.5 shrink-0" /> : <Square size={16} className="text-gray-600 group-hover:text-gray-400 mt-0.5 shrink-0" />}
      <div>
        <span className={checked ? 'text-gray-500 line-through' : 'text-gray-200'}>{label}</span>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

function Pill({ children, color = 'purple' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { purple: 'bg-purple-600/20 text-purple-400', blue: 'bg-blue-600/20 text-blue-400', green: 'bg-green-600/20 text-green-400', amber: 'bg-amber-600/20 text-amber-400', red: 'bg-red-600/20 text-red-400', gray: 'bg-gray-600/20 text-gray-400' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[color]}`}>{children}</span>;
}

function T({ headers, rows }: { headers: string[]; rows: string[][] }) {
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

// ══════════════════════════════════════════════════════════
export default function MarketingPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing Plan</h1>
          <p className="text-gray-500 text-sm mt-1">Social media strategy, launch sequence &amp; growth roadmap</p>
        </div>
        <div className="sm:text-right">
          <Pill color="green">Phase: Launch (Days 1-14)</Pill>
          <p className="text-gray-600 text-xs mt-1">Last updated: Feb 24, 2026</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-6">
        <p className="text-purple-300 text-sm font-medium">📢 Current Status</p>
        <p className="text-gray-400 text-xs mt-1">Strategy doc complete. Waiting for Mike to set up social media accounts (Twitter/X, Instagram, TikTok, LinkedIn, Facebook). Colin@teasdale.ca is first paying subscriber. 7 users total, 2 with Stripe.</p>
      </div>

      {/* ── Brand Voice ── */}
      <Section title="🎙️ Brand Voice" defaultOpen>
        <p className="mb-3"><strong className="text-white">Personality:</strong> Smart, confident, slightly witty. &ldquo;Your friend who&rsquo;s really into podcasts and also happens to be a tech nerd.&rdquo;</p>
        <T
          headers={['Platform', 'Tone']}
          rows={[
            ['Instagram', 'Visual, punchy, emoji-friendly but not cringe'],
            ['Twitter/X', 'Sharp, conversational, meme-literate, hot takes welcome'],
            ['LinkedIn', 'Professional but not boring, productivity-focused, data-driven'],
            ['Facebook', 'Warm, community-oriented, conversational'],
            ['TikTok', 'Casual, fast-paced, hook-first, personality-forward'],
          ]}
        />
        <p className="mt-3 text-red-400 text-xs"><strong>Never:</strong> Corporate jargon, &ldquo;we&rsquo;re excited to announce,&rdquo; forced hashtag stuffing, begging for follows</p>
      </Section>

      {/* ── Visual Style ── */}
      <Section title="🎨 Visual Style Guide">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#121212] border border-gray-700" title="#121212 Dark" />
          <div className="w-10 h-10 rounded-lg bg-purple-500" title="#a855f7 Purple" />
          <div className="w-10 h-10 rounded-lg bg-blue-500" title="#3b82f6 Blue" />
          <div className="w-10 h-10 rounded-lg bg-white" title="#ffffff White" />
        </div>
        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4 mb-3">
          <li><strong className="text-gray-300">Image style:</strong> Dark/moody tech aesthetic, clean typography, soundwave motifs</li>
          <li><strong className="text-gray-300">Fonts:</strong> Clean geometric sans-serif (Montserrat, Inter, or similar)</li>
          <li><strong className="text-gray-300">Do:</strong> Use contrast, whitespace, bold statements as images, screen recordings</li>
        </ul>
        <p className="text-red-400 text-xs"><strong>Don&rsquo;t:</strong> Bright/busy backgrounds, stock photos of people with headphones, cluttered designs</p>
      </Section>

      {/* ── Content Pillars ── */}
      <Section title="📊 Content Pillars">
        <T
          headers={['Pillar', 'Description', 'Example Angle']}
          rows={[
            ['⏱️ Time Savings', 'The core value prop — hours → minutes', '"That 3hr Joe Rogan episode in 5 minutes"'],
            ['🎙️ Feature Spotlight', 'Showcase specific features', 'Voice selection demo, duration slider, etc.'],
            ['🎧 Podcast Culture', 'Tap into podcast listener identity', 'Relatable podcast struggles, recommendations'],
            ['🔧 Behind the Scenes', 'Building in public, indie SaaS journey', 'Tech decisions, growth milestones, real numbers'],
            ['💡 Tips & Use Cases', 'How people use PodShrink', 'Commute routine, study hack, meeting prep'],
            ['📊 Industry/Trends', 'Podcast industry stats, AI trends', 'Market growth, listening habits, AI audio tech'],
          ]}
        />
      </Section>

      {/* ── Platform Strategies ── */}
      <Section title="📱 Platform Strategies (Detailed)">
        {/* Instagram */}
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">📸 Instagram</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">25-40, design-conscious, podcast enthusiasts, discovery-oriented</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">4-5x/week (2 Reels, 1-2 Carousels, 1 Static)</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Tue-Fri 11am-1pm, 7-9pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Reels (60-90s), Carousels, Stories (polls), Static</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags (10-15):</strong> #podcasts #podcastlife #podcastaddict #aitool #productivity #podcasting #podcastrecommendations #techstartup #saas #podcastsummary #podshrink</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Reel hooks in first 1s, carousel saves, comment on podcast creator posts, collaborate with micro podcast reviewers</p>
        </div>

        {/* Twitter/X */}
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">🐦 Twitter/X</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">Tech-savvy 20-45, startup community, podcast industry, early adopters</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">1-2x/day (mix of original + engagement)</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Mon-Fri 8-10am, 12-1pm, 5-6pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Text posts, quote tweets, threads, short video, polls</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags:</strong> Minimal — #podcasts #AI only when relevant, don&rsquo;t force</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Reply to podcast hosts, engage in #buildinpublic, quote tweet podcast discourse, share real metrics</p>
        </div>

        {/* LinkedIn */}
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">💼 LinkedIn</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">28-55 professionals, managers, entrepreneurs, lifelong learners</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">3-4x/week</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Tue-Thu 7-8am, 12pm, 5-6pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Text posts (storytelling), carousels (PDF), short video, articles</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags:</strong> #productivity #podcasts #AI #saas #startup (3-5 max)</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Personal story angle (founder journey), productivity tips, engage in comments, connect with podcast hosts and L&amp;D professionals</p>
        </div>

        {/* Facebook */}
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">👥 Facebook</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">30-55, casual podcast listeners, less tech-savvy, community-driven</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">3-4x/week on page, daily in relevant groups</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Mon-Fri 1-4pm, Sat 12-1pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Video (Reels + native), link posts, image posts, group discussions</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Groups to join:</strong> Podcast Listeners, Podcast Recommendations, Productivity Hacks, AI Tools</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Share in groups (value-first, not spammy), Facebook Reels for reach, create a PodShrink community group eventually</p>
        </div>

        {/* TikTok */}
        <div className="mb-5 p-4 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white font-medium text-sm mb-2">🎵 TikTok</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
            <div><span className="text-gray-500">Audience:</span> <span className="text-gray-300">18-35, casual/new podcast listeners, students, content-hungry</span></div>
            <div><span className="text-gray-500">Frequency:</span> <span className="text-gray-300">4-5x/week (consistency &gt; polish)</span></div>
            <div><span className="text-gray-500">Best times:</span> <span className="text-gray-300">Tue-Thu 10am-12pm, 7-9pm EST</span></div>
            <div><span className="text-gray-500">Formats:</span> <span className="text-gray-300">Short video (15-60s), trending sounds, screen recordings, talking head</span></div>
          </div>
          <p className="text-gray-500 text-xs mb-1"><strong className="text-gray-400">Hashtags:</strong> #podcast #podcasttok #productivityhack #aitool #techstartup #podshrink</p>
          <p className="text-gray-500 text-xs"><strong className="text-gray-400">Growth:</strong> Hook in first 1-2 seconds, trending audio, &ldquo;watch me summarize a 3-hour podcast in 10 seconds&rdquo; format, duet/stitch podcast clips</p>
        </div>
      </Section>

      {/* ── Launch Sequence ── */}
      <Section title="🚀 Launch Sequence — Days 1-14" defaultOpen>
        <p className="text-gray-500 text-xs mb-4">Check off completed items. Progress saved locally.</p>
        <CheckItem id="d1" label="Day 1 — 'We're Here'" sub='All platforms: intro post. Instagram Reel: 30s screen recording demo. Twitter: "We built a thing. Paste any podcast, pick an AI voice, get a summary in minutes." LinkedIn: "I listen to 15+ podcasts but only have time for 3. So I built PodShrink..."' />
        <CheckItem id="d2" label="Day 2 — 'The Problem'" sub='Instagram carousel: "The Podcast Problem" (subscribe to 20, listen to 3, other 17 haunt your queue). Twitter: guilt hook. TikTok: POV overwhelming queue → PodShrink solution.' />
        <CheckItem id="d3" label="Day 3 — 'How It Works'" sub="All: step-by-step video/carousel (Search/paste → pick length → choose voice → listen). LinkedIn: 3 steps to never miss a podcast, productivity angle." />
        <CheckItem id="d4" label="Day 4 — 'Voice Selection' (Feature Spotlight)" sub='Instagram Reel: same episode 3 different voices side-by-side. Twitter poll: "What voice would you want? Deep & authoritative / Warm & conversational / British / Robot (chaotic)". TikTok: choosing narrator like a video game character.' />
        <CheckItem id="d5" label="Day 5 — 'The Commute' (Use Case)" sub='Instagram Story + Static: "Your 20-min commute. 4 podcast summaries. Most interesting person in your morning meeting." LinkedIn: commute routine transformation. Facebook: commute masterclass graphic.' />
        <CheckItem id="d6" label="Day 6 — 'Behind the Scenes'" sub='Twitter thread: "Building PodShrink in public. Here\'s what our first week looked like: [real metrics, real challenges]". Instagram: BTS stories. TikTok: "Day 6 of launching an AI startup" casual authentic.' />
        <CheckItem id="d7" label="Day 7 — 'Weekend Catch-Up'" sub='All: "It\'s Sunday. 12 hours queued. Or 45 minutes of PodShrink summaries. Your call. ☕" Instagram carousel: "5 podcasts you should be listening to (summarized)" with actual summaries.' />
        <CheckItem id="d8" label="Day 8 — Social Proof" sub="User testimonial / early adopter quote (even if just friends testing)." />
        <CheckItem id="d9" label="Day 9 — 'Did You Know?'" sub="Podcast industry stats + how PodShrink fits the gap." />
        <CheckItem id="d10" label="Day 10 — AI Audio Deep Dive" sub="Educational content on AI audio technology. Positions as thought leader." />
        <CheckItem id="d11" label="Day 11 — Engagement Push" sub='"What podcast episode should we summarize?" Crowd-source on all platforms.' />
        <CheckItem id="d12" label="Day 12 — Deliver" sub="Post the summary of the most-requested episode." />
        <CheckItem id="d13" label="Day 13 — Pricing Reveal" sub='"Free tier = 3 summaries/month. That\'s 3 fewer podcast guilt trips." Soft pricing reveal.' />
        <CheckItem id="d14" label="Day 14 — Week 2 Recap" sub="What's coming next, CTA to sign up. Recap the journey so far." />
      </Section>

      {/* ── Weekly Cadence ── */}
      <Section title="📅 Ongoing Weekly Cadence (Week 3+)">
        <T
          headers={['Day', 'Content Type', 'Primary Platforms', 'Pillar']}
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
          <p className="text-white text-xs font-medium mb-2">📋 Week-Ahead Workflow</p>
          <p className="text-gray-400 text-xs">Every Friday, Isaac sends Mike the following week&rsquo;s post plan: day-by-day breakdown, draft copy for each post, format/visual notes. Mike approves, requests changes, or adds ideas. Posts go live per schedule.</p>
        </div>
      </Section>

      {/* ── Post Templates ── */}
      <Section title="✍️ Post Templates (Full Library)">
        <p className="text-gray-500 text-xs mb-3">Ready-to-use templates by platform:</p>

        <p className="text-white text-xs font-medium mt-4 mb-2">📸 Instagram</p>
        <Quote caption="Reel — Feature Demo" text={'🎬 [Screen recording: searching "Huberman Lab" → selecting episode → choosing voice "Iniga" → 3-min summary → playing audio]\n\nCaption: "3 hours of neuroscience in 3 minutes. Pick your voice, get the highlights. Link in bio 🧠🎙️\n.\n.\n#podcasts #podcastsummary #aitool #productivity #hubermanlab #podshrink #podcastlife #podcastaddict #learnontiktok #biohacking"'} />
        <Quote caption="Carousel — Relatable" text={'Slide 1: "Signs you have a podcast problem"\nSlide 2: "Your queue has 200+ hours"\nSlide 3: "You start episodes and never finish them"\nSlide 4: "You subscribe to new ones before finishing old ones"\nSlide 5: "You feel genuine guilt about unplayed episodes"\nSlide 6: "The cure exists. It\'s called PodShrink."\nSlide 7: "Hours → Minutes. Try it free. podshrink.com"'} />
        <Quote caption="Static — Bold Statement" text={'[Dark background, large white text, purple accent]\n"You don\'t have a podcast problem. You have a time problem."\n\nCaption: "PodShrink turns hours of podcasts into minutes of audio summaries. 12 AI voices. Your pace. Link in bio ⚡"'} />

        <p className="text-white text-xs font-medium mt-4 mb-2">🐦 Twitter/X</p>
        <Quote caption="Engagement" text={'Hot take: you don\'t need to listen to every minute of a podcast to get the value from it.\n\nSome episodes have 20 minutes of gold buried in 3 hours of conversation.\n\nThat\'s why we built PodShrink. AI extracts the signal, narrates it in the voice you pick.'} />
        <Quote caption="Building in Public" text={'PodShrink week 3 numbers:\n- 47 new signups\n- 312 summaries generated\n- Most popular voice: Iniga (she\'s everyone\'s favorite narrator apparently)\n- Longest episode summarized: 4h 12m → 8 min summary\n\nSmall numbers, but the retention is wild. People who try it, keep using it.'} />
        <Quote caption="Quick Hit" text={'3-hour podcast. 5-minute summary. 12 AI voices.\n\nThat\'s it. That\'s the product.\n\npodshrink.com'} />

        <p className="text-white text-xs font-medium mt-4 mb-2">💼 LinkedIn</p>
        <Quote caption="Storytelling" text={'I used to feel guilty about my podcast queue.\n\n47 subscriptions. Maybe 5 I actually listened to regularly. The rest just... sat there. Accumulating.\n\nSo I started building PodShrink — an AI tool that turns full podcast episodes into short audio summaries.\n\nNot transcripts. Not show notes. Actual narrated summaries you can listen to in 3-5 minutes, in the AI voice of your choice.\n\nHere\'s what surprised me: it didn\'t replace listening to podcasts. It helped me find which episodes were worth the full listen.\n\nNow I use summaries as a filter. If the summary hooks me, I go back and listen to the whole thing.\n\nIf you\'re drowning in podcast backlog, try it: podshrink.com\n\n#podcasts #productivity #AI'} />
        <Quote caption="Thought Leadership" text={'The podcast industry has a consumption problem.\n\n- Average episode length: 41 minutes (trending longer)\n- Average listener subscribes to 7 shows\n- 80% of episodes go unfinished\n\nThe content is great. The format doesn\'t respect people\'s time.\n\nThat\'s the gap we\'re filling with PodShrink. AI-narrated summaries that give you the key insights without the 3-hour commitment.\n\nAudio-first. Not transcripts. Actual listenable summaries.\n\nThe future of podcast consumption isn\'t listening to everything. It\'s listening smarter.'} />

        <p className="text-white text-xs font-medium mt-4 mb-2">👥 Facebook</p>
        <Quote caption="Community" text={'🎙️ Question for podcast lovers: What\'s sitting in your queue right now that you KNOW is good but you just haven\'t had time for?\n\nDrop the podcast name below 👇 We might just summarize the top picks this week.\n\n(PodShrink turns full episodes into short AI audio summaries — try it free at podshrink.com)'} />

        <p className="text-white text-xs font-medium mt-4 mb-2">🎵 TikTok</p>
        <Quote caption="Hook-First" text={'[Text on screen: "This app summarizes 3-hour podcasts in 5 minutes"]\n[Screen recording of using PodShrink]\n[Playing the audio summary output]\n\nCaption: "No more podcast guilt 🎙️ #podcast #podcasttok #aitool #productivity #podshrink"'} />
        <Quote caption="Trend-Jack" text={'[Trending sound + "Things that just make sense"]\n[Show: pasting a long podcast → getting a short summary]\n\nCaption: "Why did no one make this sooner #podcast #productivity"'} />
        <Quote caption="Relatable" text={'[POV: you open your podcast app]\n[Show overwhelming queue — 200+ hours]\n[Cut to PodShrink — same episodes, 5 min summaries]\n[Chef\'s kiss]'} />
      </Section>

      {/* ── Engagement Strategy ── */}
      <Section title="🤝 Engagement Strategy (First 90 Days)">
        <p className="text-white text-xs font-medium mb-2">Organic Growth Tactics</p>
        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4 mb-4">
          <li>Comment on podcast creators&rsquo; posts — genuine, insightful comments (not &ldquo;check out our tool!&rdquo;)</li>
          <li>Engage in podcast subreddits/groups — be helpful first, mention PodShrink only when relevant</li>
          <li>Quote tweet/stitch podcast discourse — add value to existing conversations</li>
          <li>&ldquo;Summarize this&rdquo; challenges — ask audience to submit episodes, post the summaries</li>
          <li>Collaborate with micro-influencers (1K-50K followers) in podcast/productivity space — offer free Pro accounts</li>
          <li>Cross-post Reels to Instagram, TikTok, Facebook, and YouTube Shorts simultaneously</li>
          <li>Engage with every comment in the first 30 days — build community, boost algorithm</li>
        </ul>

        <T
          headers={['Phase', 'Timeline', 'Focus']}
          rows={[
            ['Foundation', 'Weeks 1-4', 'Follow/engage with 20-30 relevant accounts daily per platform. Respond to every comment within 2 hours. Join 5-10 relevant Facebook groups, contribute genuinely. Post consistently per cadence.'],
            ['Acceleration', 'Weeks 5-8', 'Reach out to 5 podcast micro-influencers for collaborations. Start "Podcast of the Week" summary series. Launch branded hashtag: #ShrinkIt or #PodShrunk. First small paid boost ($50-100) on best-performing organic posts.'],
            ['Optimization', 'Weeks 9-12', 'Analyze what\'s working — double down on top content types. A/B test post times and formats. Build email list from social traffic. Plan first user-generated content campaign.'],
          ]}
        />
      </Section>

      {/* ── KPIs & Financial Targets ── */}
      <Section title="📈 Metrics, KPIs & Growth Targets">
        <p className="text-white text-xs font-medium mb-2">Monthly Growth Goals (First 3 Months)</p>
        <T
          headers={['Month', 'Combined Followers', 'Weekly Posts', 'Signups from Social', 'Target Revenue']}
          rows={[
            ['1', '500', '20-25', '50', '$50-100 (5-10 paid)'],
            ['2', '1,500', '20-25', '150', '$300-500 (30-50 paid)'],
            ['3', '4,000', '25-30', '400', '$1,000+ (100+ paid)'],
          ]}
        />

        <p className="text-white text-xs font-medium mt-4 mb-2">Weekly Tracking</p>
        <T
          headers={['Metric', 'Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'TikTok']}
          rows={[
            ['Followers', '✅', '✅', '✅', '✅', '✅'],
            ['Post reach', '✅', '✅', '✅', '✅', '✅'],
            ['Engagement rate', '✅', '✅', '✅', '✅', '✅'],
            ['Link clicks', '✅', '✅', '✅', '✅', '✅ (bio)'],
            ['Best post', '✅', '✅', '✅', '✅', '✅'],
            ['New signups from social', '—', '—', '—', '—', '—'],
          ]}
        />

        <p className="text-white text-xs font-medium mt-4 mb-2">Weekly Review Checklist</p>
        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
          <li>Review analytics for each platform</li>
          <li>Identify top 3 performing posts — why did they work?</li>
          <li>Identify bottom 3 — what to avoid?</li>
          <li>Plan next week&rsquo;s content calendar</li>
          <li>Send week-ahead plan to Mike for approval</li>
          <li>Check competitor social accounts for trends</li>
          <li>Respond to any unanswered comments/DMs</li>
        </ul>

        <p className="text-white text-xs font-medium mt-4 mb-2">Scaling Roadmap to 100K</p>
        <T
          headers={['Milestone', 'Users', 'MRR Target', 'Key Lever']}
          rows={[
            ['Month 1-3', '50-400', '$100-1,000', 'Organic social, SEO foundations, community engagement'],
            ['Month 4-6', '400-2,000', '$1,000-5,000', 'Paid ads ($200-500/mo), influencer collabs, email nurture'],
            ['Month 7-12', '2,000-10,000', '$5,000-20,000', 'Content marketing flywheel, referral program, podcast partnerships'],
            ['Year 2', '10,000-100,000', '$20,000-200,000', 'Viral loops, API/integrations, enterprise tier, podcast app integrations'],
          ]}
        />
      </Section>

      {/* ── Marketing Team ── */}
      <Section title="🤖 Marketing Sub-Agent Team">
        <p className="text-gray-500 text-xs mb-3">Planned automation team (activation pending platform setup):</p>
        {[
          { emoji: '🎨', name: 'Luna', role: 'Content & Creative Director', desc: 'Generates all visual and written content from shrink data. Daily: scans completed shrinks → generates social posts, blog drafts, episode highlight cards. Voice: bold, punchy, trend-aware.' },
          { emoji: '📹', name: 'Reel', role: 'Video Producer', desc: 'Creates short-form video content for TikTok, Reels, Shorts. Daily: takes shrink audio → waveform animation + captions + branded intro/outro. Output: 1-2 videos/day.' },
          { emoji: '📡', name: 'Echo', role: 'Social Media Manager', desc: 'Schedules, posts, and engages across all platforms (IG, TikTok, X, YouTube, LinkedIn). Daily: posts content from Luna and Reel on schedule, monitors engagement, drafts replies.' },
          { emoji: '🔍', name: 'Radar', role: 'SEO & Analytics Specialist', desc: 'Monitors rankings, traffic, site health, competitor movements. Weekly: Google Search Console audit, ranking report, traffic analysis, competitor check. Output: weekly KPI report.' },
          { emoji: '💬', name: 'Scout', role: 'Community & Outreach', desc: 'Monitors Reddit (r/podcasts, r/productivity, r/ADHD), forums, podcaster communities. Daily: scans for relevant threads, drafts helpful replies. Weekly: identifies podcast hosts for partnership outreach.' },
          { emoji: '📧', name: 'Pulse', role: 'Email & Retention', desc: 'Monthly newsletters ("This Month in Podcasts" from top shrinks), win-back campaigns for inactive users, upgrade nudges at usage limits.' },
        ].map(a => (
          <div key={a.name} className="flex items-start gap-3 mb-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
            <span className="text-lg">{a.emoji}</span>
            <div>
              <p className="text-white text-sm font-medium">{a.name} — <span className="text-gray-400 font-normal">{a.role}</span></p>
              <p className="text-gray-500 text-xs mt-0.5">{a.desc}</p>
            </div>
          </div>
        ))}
        <p className="text-gray-600 text-xs mt-2"><strong className="text-gray-500">Activation order:</strong> Luna (content-generator) → Radar (seo-monitor) → Reel (video-creator, once ffmpeg pipeline tested) → Echo (social-poster, once platform API keys ready) → Scout + Pulse (Phase 2)</p>
      </Section>
    </div>
  );
}
