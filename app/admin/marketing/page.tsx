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

export default function BusinessPlanPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Plan</h1>
          <p className="text-gray-500 text-sm mt-1">Strategic roadmap, financial projections, and operational plan for PodShrink</p>
        </div>
        <div className="text-right">
          <Pill color="green">Live: 6 Days</Pill>
          <p className="text-gray-600 text-xs mt-1">Last updated: Feb 25, 2026</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-6">
        <p className="text-purple-300 text-sm font-medium">📊 Current Status — Feb 25, 2026</p>
        <p className="text-gray-400 text-xs mt-1">
          <strong>Users:</strong> 7 total (1 paying: colin@teasdale.ca) · <strong>MRR:</strong> $9.99 · <strong>Launch:</strong> Feb 19, 2026 · 
          <strong> Social:</strong> Accounts created (X, Instagram, TikTok, YouTube, Reddit). No posts yet — need posting solution (browser control crashed OpenClaw, exploring alternatives: Buffer API, scheduling tools, or manual draft→post workflow). 
          <strong> SEO:</strong> Dynamic sitemap expansion in progress (89 → 50K+ pages). Google Search Console sitemap fetch failing — investigating.
        </p>
      </div>

      {/* ── 1. Executive Summary ── */}
      <Section title="📋 1. Executive Summary" defaultOpen>
        <div className="space-y-4">
          <div>
            <p className="text-white text-sm font-medium mb-2">What is PodShrink?</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              PodShrink is an AI-powered platform that transforms full-length podcast episodes into concise, narrated audio summaries. 
              Users select any episode, choose a duration (3-15 minutes), pick an AI voice, and receive a high-quality summary they can listen to on the go. 
              Unlike transcript-based tools, PodShrink delivers <em>actual audio summaries</em> — professionally narrated, preserving the podcast listening experience.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">The Opportunity</p>
            <p className="text-gray-300 text-xs leading-relaxed mb-2">
              464 million podcast listeners globally (2024). Average listener subscribes to 7+ shows but completes &lt;40% of episodes. 
              The podcast discovery/consumption gap is massive. Most tools focus on transcripts (reading) or search — PodShrink preserves the audio experience while solving the time constraint problem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-purple-400 text-lg font-bold">464M</p>
                <p className="text-gray-500 text-xs">Global podcast listeners</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-blue-400 text-lg font-bold">&lt;40%</p>
                <p className="text-gray-500 text-xs">Episode completion rate</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-green-400 text-lg font-bold">5M+</p>
                <p className="text-gray-500 text-xs">Active podcasts (TAM)</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Current State (Feb 25, 2026)</p>
            <MiniTable
              headers={['Metric', 'Value', 'Notes']}
              rows={[
                ['Total Users', '7', 'Live since Feb 19, 2026 (6 days)'],
                ['Paying Users', '1', 'colin@teasdale.ca — Standard plan'],
                ['MRR', '$9.99', 'One Standard subscription'],
                ['Shows Indexed', '41', 'Joe Rogan, Huberman Lab, All-In, etc.'],
                ['Episodes Available', '~50,000', 'Full back catalogs'],
                ['Summaries Generated', '~150', 'Avg 8-12 min duration'],
              ]}
            />
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Vision</p>
            <div className="p-4 bg-purple-600/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-200 text-sm font-medium mb-2">
                "The go-to platform for podcast consumption and creator tools"
              </p>
              <p className="text-gray-300 text-xs leading-relaxed">
                <strong>Consumer side:</strong> The default way people catch up on podcasts — integrated into podcast apps, browsers, and workflows.
                <br />
                <strong>Creator side:</strong> The easiest way for podcast hosts to repurpose episodes into shareable audio summaries in their own cloned voice, 
                driving listener acquisition and episode reach.
              </p>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Strategic Priorities (Next 90 Days)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="text-white text-xs font-medium">Launch PodShrink for Creators</p>
                  <p className="text-gray-500 text-xs">B2B tier with voice cloning — $49-99/mo</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 text-lg">⚡</span>
                <div>
                  <p className="text-white text-xs font-medium">SEO Expansion</p>
                  <p className="text-gray-500 text-xs">50K+ episode pages indexed for long-tail search</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 text-lg">📱</span>
                <div>
                  <p className="text-white text-xs font-medium">Social Media Launch</p>
                  <p className="text-gray-500 text-xs">14-day launch sequence across 5 platforms</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 text-lg">🤖</span>
                <div>
                  <p className="text-white text-xs font-medium">Agent Automation Team</p>
                  <p className="text-gray-500 text-xs">6-agent marketing team (Luna, Reel, Echo, etc.)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 2. Product Roadmap & Features ── */}
      <Section title="🛠️ 2. Product Roadmap & Features">
        <div className="space-y-4">
          <div>
            <p className="text-white text-sm font-medium mb-2">Current Features (Live)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { emoji: '🎙️', name: 'AI Summarization', desc: 'Full episode → concise audio summary' },
                { emoji: '🎧', name: 'Voice Selection', desc: '12+ AI voices (male/female, accents)' },
                { emoji: '⏱️', name: 'Duration Control', desc: 'User picks 3, 5, 8, 10, or 15 minutes' },
                { emoji: '🌍', name: 'Multi-Language Output ✅', desc: '9 languages live: EN, ES, PT, FR, DE, JA, KO, HI, ZH. Tier-gated.' },
                { emoji: '📚', name: 'Show Library', desc: '41 top shows, 50K+ episodes' },
                { emoji: '💾', name: 'Save & Download', desc: 'Export MP3 for offline listening' },
              ].map(f => (
                <div key={f.name} className="flex items-start gap-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
                  <span className="text-xl">{f.emoji}</span>
                  <div>
                    <p className="text-white text-xs font-medium">{f.name}</p>
                    <p className="text-gray-500 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Roadmap — Prioritized Features</p>
            <MiniTable
              headers={['Feature', 'Target', 'Impact', 'Effort', 'Notes']}
              rows={[
                ['🎤 PodShrink for Creators', 'Q1 2026', 'High (New Revenue)', 'Medium', 'Voice cloning, B2B tier, $49-99/mo'],
                ['📝 Blog/Content Section', 'Q1 2026', 'High (SEO)', 'Low', '20+ SEO-optimized posts'],
                ['🔌 Chrome Extension', 'Q2 2026', 'High (Distribution)', 'Medium', 'Summarize from any podcast page'],
                ['📱 Mobile App (iOS/Android)', 'Q2 2026', 'High (Engagement)', 'High', 'Native listening experience'],
                ['🔗 Public API for Developers', 'Q2 2026', 'Medium (Partnerships)', 'Medium', 'Podcast apps can integrate'],
                ['💰 Referral Program', 'Q1 2026', 'Medium (Growth)', 'Low', 'Give 1 month free, get 1 month free'],
                ['📧 Email Newsletters', 'Q2 2026', 'Medium (Retention)', 'Low', 'Weekly episode highlights'],
                ['🏢 Enterprise Tier', 'Q3 2026', 'High (Revenue)', 'Medium', 'Teams, white-label, analytics'],
              ]}
            />
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Feature Deep-Dive: Upcoming Q1 Launches</p>
            
            <div className="mb-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-purple-400 text-xs font-medium mb-2">🎤 PodShrink for Creators (Detailed in Section 3)</p>
              <p className="text-gray-400 text-xs">The B2B play. Creators clone their voice via ElevenLabs, generate summaries of their own episodes, download MP3s, and share on social/show notes. Cross-promotion potential: free/discounted accounts in exchange for &ldquo;Powered by PodShrink&rdquo; mentions.</p>
            </div>

            <div className="mb-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-blue-400 text-xs font-medium mb-2">📝 Blog/Content Section</p>
              <p className="text-gray-400 text-xs mb-2">
                Planned 20+ SEO-optimized blog posts targeting transactional and informational keywords. Examples:
              </p>
              <ul className="text-gray-500 text-xs space-y-1 list-disc pl-4">
                <li>&ldquo;Best Podcast Summary Apps in 2026&rdquo;</li>
                <li>&ldquo;How to Listen to More Podcasts Without More Time&rdquo;</li>
                <li>&ldquo;AI Voice Cloning for Podcast Creators: A Guide&rdquo;</li>
                <li>&ldquo;Joe Rogan Episode Summaries: Top 10 Must-Listen Episodes&rdquo;</li>
              </ul>
            </div>

            <div className="mb-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-green-400 text-xs font-medium mb-2">🔌 Chrome Extension</p>
              <p className="text-gray-400 text-xs">
                One-click summarization from any podcast page (Spotify, Apple Podcasts, podcast websites). User highlights episode URL → clicks PodShrink extension → summary generated. 
                Massive distribution lever — extension users become organic evangelists.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. PodShrink for Creators ── */}
      <Section title="🎤 3. PodShrink for Creators (B2B Product)" defaultOpen>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
            <p className="text-white text-sm font-bold mb-2">💎 The Premium Tier: Voice Cloning for Podcast Hosts</p>
            <p className="text-gray-200 text-xs leading-relaxed">
              PodShrink for Creators is a B2B SaaS product that allows podcast hosts to generate AI summaries of their own episodes 
              <strong className="text-purple-300"> in their own cloned voice</strong>. They download the audio file and use it for promotion, 
              show notes, social media, or listener acquisition. This is a fundamentally different value prop than the consumer product — 
              and commands a <strong className="text-green-300">much higher price point ($49-99/mo)</strong>.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">How It Works</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
                <span className="text-purple-400 font-bold text-sm">1.</span>
                <div>
                  <p className="text-white text-xs font-medium">Voice Cloning Setup</p>
                  <p className="text-gray-400 text-xs">Creator uploads 1-2 minutes of clean audio to ElevenLabs Professional Voice Cloning (consent verification required). PodShrink stores the voice ID.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
                <span className="text-blue-400 font-bold text-sm">2.</span>
                <div>
                  <p className="text-white text-xs font-medium">Episode Summarization</p>
                  <p className="text-gray-400 text-xs">Creator pastes episode RSS feed or uploads MP3. PodShrink generates 3-5 minute summary script using GPT-4.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
                <span className="text-green-400 font-bold text-sm">3.</span>
                <div>
                  <p className="text-white text-xs font-medium">Cloned Voice Narration</p>
                  <p className="text-gray-400 text-xs">Summary is narrated using creator&rsquo;s cloned voice via ElevenLabs. Output is high-quality MP3.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#141414] rounded-lg border border-gray-800">
                <span className="text-amber-400 font-bold text-sm">4.</span>
                <div>
                  <p className="text-white text-xs font-medium">Download & Distribute</p>
                  <p className="text-gray-400 text-xs">Creator downloads MP3, uploads to podcast host as a &ldquo;bonus episode&rdquo; or shares on social media, email, show notes. Can add &ldquo;Powered by PodShrink&rdquo; mention.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Why Creators Will Pay</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-purple-400 text-xs font-medium mb-1">🎯 Listener Acquisition</p>
                <p className="text-gray-500 text-xs">3-minute summaries are perfect for social media. Shorter = higher completion rate = more people discover the full episode.</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-blue-400 text-xs font-medium mb-1">♻️ Content Repurposing</p>
                <p className="text-gray-500 text-xs">One 90-min episode → 5-min summary → Twitter Spaces preview → Instagram Reel audio → Newsletter teaser. Maximum content leverage.</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-green-400 text-xs font-medium mb-1">🎙️ Authenticity</p>
                <p className="text-gray-500 text-xs">Cloned voice = sounds like the host, not a generic AI. Maintains brand consistency and listener trust.</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-amber-400 text-xs font-medium mb-1">⏱️ Time Savings</p>
                <p className="text-gray-500 text-xs">Manual summarization takes hours. PodShrink does it in 2 minutes. For creators publishing 2-4 episodes/week, this is massive time ROI.</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Target Market</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-white text-xs font-medium mb-2">Sweet Spot: Mid-Tier Podcasters (10K-100K listeners/episode)</p>
              <p className="text-gray-400 text-xs mb-2">These creators are:</p>
              <ul className="text-gray-500 text-xs space-y-1 list-disc pl-4">
                <li><strong>Too small</strong> for a full-time producer/editor to manually create summaries</li>
                <li><strong>Too big</strong> to ignore content repurposing opportunities (sponsors expect cross-platform distribution)</li>
                <li><strong>Revenue-generating</strong> via ads/sponsors/Patreon — can justify $49-99/mo tool expense</li>
                <li><strong>Growth-focused</strong> — actively trying to expand audience reach</li>
              </ul>
              <p className="text-gray-400 text-xs mt-2">
                <strong>TAM:</strong> ~50,000 podcasts globally in this range. If 1% convert = 500 Creator accounts × $70/mo avg = <strong className="text-green-400">$35K MRR</strong> from this tier alone.
              </p>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Pricing Model</p>
            <MiniTable
              headers={['Tier', 'Price/Mo', 'Voice Cloning', 'Monthly Summaries', 'Target User']}
              rows={[
                ['Creator Starter', '$49', '1 voice', '20 summaries', 'Solo podcaster, 1 show'],
                ['Creator Pro', '$79', '3 voices', '50 summaries', 'Multi-show host or co-hosted show'],
                ['Creator Studio', '$149', 'Unlimited voices', 'Unlimited summaries', 'Podcast network, agency, or high-volume creator'],
              ]}
            />
            <p className="text-gray-500 text-xs mt-2">
              <strong>Annual discount:</strong> 20% off (2 months free). <strong>Setup fee:</strong> None — voice cloning is part of onboarding.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">The B2B2C Flywheel</p>
            <div className="p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">1</div>
                <p className="text-gray-300 text-xs">Creator uses PodShrink to generate summary in their cloned voice</p>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">2</div>
                <p className="text-gray-300 text-xs">They share it on social media / show notes with &ldquo;Powered by PodShrink&rdquo;</p>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">3</div>
                <p className="text-gray-300 text-xs">Listeners hear PodShrink mention → visit site → become consumer users</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">4</div>
                <p className="text-gray-300 text-xs">Consumer users who ARE creators see the tool → sign up for Creator tier</p>
              </div>
            </div>
            <p className="text-purple-300 text-xs mt-3 font-medium">
              💡 This creates compounding network effects. Every Creator account = free marketing to their entire listener base.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Cross-Promotion Strategy</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800 mb-2">
              <p className="text-blue-400 text-xs font-medium mb-1">Offer: Free Creator Pro (6 months) in Exchange for Promotion</p>
              <p className="text-gray-400 text-xs">
                Reach out to 50-100 mid-tier creators: &ldquo;We&rsquo;ll give you 6 months free Creator Pro ($474 value) if you mention 
                &lsquo;Powered by PodShrink&rsquo; in 3 episodes and share one summary on social.&rdquo; Low cost (our API expenses), high return (brand awareness to thousands of listeners per creator).
              </p>
            </div>
            <MiniTable
              headers={['Scenario', 'Creators', 'Avg Listeners', 'Reach', 'Est. Conversions (0.5%)', 'Value']}
              rows={[
                ['Phase 1', '10 creators', '25,000/ep', '250K', '1,250 signups', '125 paid @ $10 = $1,250 MRR'],
                ['Phase 2', '50 creators', '25,000/ep', '1.25M', '6,250 signups', '625 paid = $6,250 MRR'],
                ['Phase 3', '100 creators', '25,000/ep', '2.5M', '12,500 signups', '1,250 paid = $12,500 MRR'],
              ]}
            />
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Technical Requirements</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li><strong>ElevenLabs Professional Voice Cloning API:</strong> Requires consent verification (creator records consent phrase). Higher API cost (~$0.30/1000 chars vs $0.18 for standard voices).</li>
              <li><strong>Voice library storage:</strong> Each cloned voice = ~50MB model. Store voice IDs in user profile, fetch via ElevenLabs API on-demand.</li>
              <li><strong>Dedicated Creator dashboard:</strong> Separate UI from consumer product. Bulk upload, voice management, analytics (downloads, shares).</li>
              <li><strong>White-label option (Enterprise tier):</strong> Creators can remove PodShrink branding for an additional fee.</li>
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Revenue Projections — Creator Tier Only</p>
            <MiniTable
              headers={['Month', 'Creator Accounts', 'Avg Price', 'MRR', 'Churn', 'Notes']}
              rows={[
                ['Month 1-2', '5', '$70', '$350', '0%', 'Beta testers, hand-selected'],
                ['Month 3-4', '20', '$70', '$1,400', '10%', 'Outbound outreach + cross-promo deals'],
                ['Month 5-6', '50', '$70', '$3,500', '15%', 'Referrals + Product Hunt launch'],
                ['Month 7-12', '150', '$75', '$11,250', '20%', 'Organic + paid ads + partnerships'],
                ['Month 13-18', '400', '$80', '$32,000', '18%', 'Network effects kicking in'],
              ]}
            />
            <p className="text-green-300 text-xs mt-2 font-medium">
              🎯 18-month target: $32K MRR from Creator tier alone. This is <em>in addition to</em> consumer revenue.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 4. SEO Strategy ── */}
      <Section title="🔍 4. SEO Strategy & Technical Status">
        <div className="mb-4 p-3 bg-green-600/10 rounded-lg border border-green-500/20">
          <p className="text-green-300 text-xs font-medium mb-1">✅ Shipped: Dynamic Sitemap Expansion (20,183 URLs)</p>
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
        <CheckItem id="seo2" label="Dynamic sitemap with all episodes ✅" sub="DONE — 20,183 URLs across 6 sub-sitemaps. Google Search Console: Success." />
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

      {/* ── 5. Marketing & Social Media ── */}
      <Section title="📱 5. Marketing & Social Media Strategy">
        <div className="mb-4 p-3 bg-amber-600/10 rounded-lg border border-amber-500/20">
          <p className="text-amber-300 text-xs font-medium mb-1">⚠️ Blocker: Social Media Posting Solution</p>
          <p className="text-gray-400 text-xs">
            Browser automation (OpenClaw browser control) crashed when attempting automated posting. Exploring alternatives:
            <strong> Buffer API</strong> (paid, supports IG/X/LinkedIn/FB), <strong>scheduling tools</strong> (Hootsuite, Later), 
            or <strong>manual draft→post workflow</strong> (Isaac drafts, Mike posts). Need to decide approach before launch sequence begins.
          </p>
        </div>

        {/* Brand Voice */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-2">🎙️ Brand Voice</p>
          <p className="text-gray-300 text-xs mb-3"><strong>Personality:</strong> Smart, confident, slightly witty. &ldquo;Your friend who&rsquo;s really into podcasts and also happens to be a tech nerd.&rdquo;</p>
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
        </div>

        {/* Visual Style */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-2">🎨 Visual Style Guide</p>
          <div className="flex gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#121212] border border-gray-700" title="#121212" />
            <div className="w-10 h-10 rounded-lg bg-purple-500" title="#a855f7" />
            <div className="w-10 h-10 rounded-lg bg-blue-500" title="#3b82f6" />
            <div className="w-10 h-10 rounded-lg bg-white" title="#ffffff" />
          </div>
          <p className="text-gray-300 text-xs">Dark/moody tech aesthetic, clean typography, soundwave motifs. Clean geometric sans-serif (Montserrat, Inter). Bold statements as images, screen recordings.</p>
          <p className="mt-2 text-red-400 text-xs"><strong>Don&rsquo;t:</strong> Bright/busy backgrounds, stock photos of people with headphones, cluttered designs.</p>
        </div>

        {/* Content Pillars */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-2">📊 Content Pillars</p>
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
        </div>

        {/* Platform Strategies */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-3">📱 Platform Strategies (Detailed)</p>
          <div className="space-y-3">
            <div className="p-4 bg-[#141414] rounded-lg border border-gray-800">
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
            <div className="p-4 bg-[#141414] rounded-lg border border-gray-800">
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
            <div className="p-4 bg-[#141414] rounded-lg border border-gray-800">
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
            <div className="p-4 bg-[#141414] rounded-lg border border-gray-800">
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
            <div className="p-4 bg-[#141414] rounded-lg border border-gray-800">
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
          </div>
        </div>

        {/* Launch Sequence */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-2">🚀 Launch Sequence — Days 1-14</p>
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
        </div>

        {/* Weekly Cadence */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-2">📅 Ongoing Weekly Cadence (Week 3+)</p>
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
        </div>

        {/* Post Templates */}
        <div className="mb-4">
          <p className="text-white text-sm font-medium mb-2">✍️ Post Templates</p>
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
        </div>

        {/* Engagement Strategy */}
        <div>
          <p className="text-white text-sm font-medium mb-2">🤝 Engagement Strategy (First 90 Days)</p>
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
        </div>
      </Section>

      {/* ── 6. Growth Hacking & Partnerships ── */}
      <Section title="🚀 6. Growth Hacking & Partnerships">
        <div className="space-y-4">
          <div>
            <p className="text-white text-sm font-medium mb-2">Product Hunt Launch</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-gray-300 text-xs mb-2"><strong>Target:</strong> #1 Product of the Day (aiming for top 5 minimum)</p>
              <p className="text-gray-400 text-xs mb-2"><strong>Timeline:</strong> Month 2-3 (after social accounts have momentum and initial user base established)</p>
              <p className="text-white text-xs font-medium mt-3 mb-2">Pre-Launch Checklist</p>
              <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4">
                <li>Build email list of 200+ interested users (friends, early adopters, social followers)</li>
                <li>Prepare demo video (90s, showing key features + emotional hook)</li>
                <li>Write compelling tagline: &ldquo;Turn 3-hour podcasts into 5-minute audio summaries&rdquo;</li>
                <li>Schedule launch for Tuesday-Thursday (highest traffic days)</li>
                <li>Coordinate with Mike to be online all day for comments/engagement</li>
                <li>Offer limited-time PH-exclusive deal (e.g., 50% off Pro for 6 months)</li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Referral Program</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800 mb-2">
              <p className="text-purple-400 text-xs font-medium mb-1">Mechanics: Give 1 Month Free, Get 1 Month Free</p>
              <p className="text-gray-400 text-xs">
                Every user gets a unique referral link. When a friend signs up for Standard/Pro via that link, both get 1 month free. 
                Caps at 12 months free per year (prevent abuse). Track via referral codes in database.
              </p>
            </div>
            <MiniTable
              headers={['Scenario', 'Referrer Gets', 'Referee Gets', 'PodShrink Net']}
              rows={[
                ['1 referral', '1 month free ($10 value)', '1 month free', '1 new paid user after free month'],
                ['5 referrals', '5 months free ($50)', '5 new users x 1 month', '5 new users in pipeline'],
                ['Viral user (12 refs)', '12 months free ($120)', '12 new users', '12 new paid users (high LTV)'],
              ]}
            />
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Podcast Host Partnerships (Ties to Creator Tier)</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-blue-400 text-xs font-medium mb-1">Strategy: Co-Marketing Deals</p>
              <p className="text-gray-400 text-xs mb-2">
                Approach mid-tier podcast hosts (10K-100K listeners). Offer:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4 mb-2">
                <li><strong>Free Creator Pro account (6 months)</strong> — $474 value</li>
                <li><strong>In exchange:</strong> 2-3 mentions on their podcast (&ldquo;This summary brought to you by PodShrink&rdquo;) + 1 social media post</li>
                <li><strong>Bonus:</strong> Revenue share — 20% of any referrals from their unique link</li>
              </ul>
              <p className="text-green-300 text-xs font-medium">🎯 Target 50 partnerships in first 6 months. Each reaches 15K-30K listeners = 750K-1.5M impressions.</p>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">AppSumo Lifetime Deal</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-amber-400 text-xs font-medium mb-1">One-Time Cash Injection + User Acquisition</p>
              <p className="text-gray-400 text-xs mb-2">
                AppSumo specializes in lifetime deals for SaaS products. Typical structure:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4 mb-2">
                <li><strong>Deal:</strong> Lifetime Standard plan for $79 one-time (vs $120/year subscription)</li>
                <li><strong>Revenue split:</strong> AppSumo takes 30% ($23.70), PodShrink gets $55.30 per sale</li>
                <li><strong>Volume:</strong> Typical deal gets 500-2,000 sales in 2-week window</li>
                <li><strong>Upside:</strong> Cash infusion ($27K-110K), massive user base growth, testimonials, social proof</li>
                <li><strong>Downside:</strong> Lifetime users = no recurring revenue from that cohort</li>
              </ul>
              <p className="text-purple-300 text-xs font-medium">💡 Launch this in Month 4-6 once product is stable and we can handle support volume.</p>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Chrome Extension Distribution</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-gray-300 text-xs mb-2">
                A Chrome extension that adds a &ldquo;Summarize with PodShrink&rdquo; button to Spotify, Apple Podcasts, and podcast websites. 
                User clicks → redirected to PodShrink with episode pre-loaded → instant summary.
              </p>
              <p className="text-white text-xs font-medium mb-1">Growth Lever:</p>
              <p className="text-gray-400 text-xs">Chrome Web Store discovery is organic — users searching &ldquo;podcast summary&rdquo; find the extension. 
                Once installed, it&rsquo;s persistent across all podcast listening sessions. High retention.</p>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Hacker News "Show HN"</p>
            <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
              <p className="text-gray-300 text-xs mb-2">
                Hacker News &ldquo;Show HN&rdquo; posts can drive 5K-50K visitors if they hit front page. Perfect for tech-forward products.
              </p>
              <p className="text-white text-xs font-medium mb-1">Approach:</p>
              <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4">
                <li><strong>Title:</strong> &ldquo;Show HN: PodShrink — Turn 3-hour podcasts into 5-minute AI audio summaries&rdquo;</li>
                <li><strong>Post content:</strong> Honest, technical, transparent. Mention challenges (voice cloning costs, summarization quality). HN loves authenticity.</li>
                <li><strong>Timing:</strong> Post on weekday mornings (8-10am EST) for maximum visibility</li>
                <li><strong>Engagement:</strong> Mike + Isaac actively respond to every comment for first 4-6 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 7. Financial Model ── */}
      <Section title="💰 7. Financial Model & Projections" defaultOpen>
        <div className="space-y-4">
          <div>
            <p className="text-white text-sm font-medium mb-2">Current State (Feb 25, 2026)</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs">Total Users</p>
                <p className="text-white text-2xl font-bold">7</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs">Paying Users</p>
                <p className="text-green-400 text-2xl font-bold">1</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs">MRR</p>
                <p className="text-purple-400 text-2xl font-bold">$10</p>
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-gray-500 text-xs">Days Live</p>
                <p className="text-blue-400 text-2xl font-bold">6</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Pricing Tiers</p>
            <MiniTable
              headers={['Tier', 'Price/Mo', 'Target User', 'Features', 'Positioning']}
              rows={[
                ['Free', '$0', 'Casual listener', '3 summaries/month, standard voices', 'Trial & acquisition'],
                ['Standard', '$9.99', 'Regular podcast listener', '30 summaries/month, all voices, download', 'Core consumer product'],
                ['Pro', '$19.99', 'Power user', 'Unlimited summaries, priority queue, multi-language', 'Heavy users'],
                ['Creator Starter', '$49', 'Solo podcaster', 'Voice cloning (1), 20 summaries/mo', 'B2B entry tier'],
                ['Creator Pro', '$79', 'Multi-show host', 'Voice cloning (3), 50 summaries/mo', 'B2B standard'],
                ['Creator Studio', '$149', 'Podcast network', 'Unlimited voices, unlimited summaries', 'B2B premium'],
              ]}
            />
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">18-Month Revenue Projection (Conservative)</p>
            <div className="overflow-x-auto">
              <MiniTable
                headers={['Month', 'Total Users', 'Free', 'Standard ($10)', 'Pro ($20)', 'Creator ($70 avg)', 'MRR', 'Cumulative Revenue']}
                rows={[
                  ['1', '50', '40', '8', '2', '0', '$120', '$120'],
                  ['2', '150', '120', '22', '6', '2', '$400', '$520'],
                  ['3', '400', '320', '60', '15', '5', '$1,250', '$1,770'],
                  ['4', '800', '640', '120', '30', '10', '$2,500', '$4,270'],
                  ['5', '1,500', '1,200', '225', '55', '20', '$4,850', '$9,120'],
                  ['6', '2,500', '2,000', '375', '100', '25', '$7,500', '$16,620'],
                  ['9', '5,000', '4,000', '750', '200', '50', '$15,500', '$63,120'],
                  ['12', '10,000', '8,000', '1,500', '400', '100', '$30,000', '$153,120'],
                  ['18', '25,000', '20,000', '3,750', '1,000', '250', '$75,000', '$543,120'],
                ]}
              />
            </div>
            <p className="text-green-300 text-xs font-medium mt-3">
              🎯 18-month target: $75K MRR (~$900K ARR run rate) with 25,000 total users and 5,000 paying users (20% conversion).
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Unit Economics</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-purple-400 text-xs font-medium mb-2">Customer Acquisition Cost (CAC)</p>
                <MiniTable
                  headers={['Channel', 'CAC', 'Notes']}
                  rows={[
                    ['Organic (SEO, social)', '$0-5', 'Content marketing, no direct ad spend'],
                    ['Paid ads (Month 4+)', '$15-30', 'Meta, Google, TikTok ads'],
                    ['Referral program', '$10', 'Cost = 1 month free ($10)'],
                    ['Blended average (Month 6)', '$12', 'Mix of organic + paid'],
                  ]}
                />
              </div>
              <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
                <p className="text-blue-400 text-xs font-medium mb-2">Lifetime Value (LTV)</p>
                <MiniTable
                  headers={['Tier', 'Avg LTV (12mo)', 'LTV:CAC Ratio']}
                  rows={[
                    ['Standard', '$80', '6.7x (healthy)'],
                    ['Pro', '$160', '13.3x (excellent)'],
                    ['Creator', '$560', '46.7x (outstanding)'],
                  ]}
                />
                <p className="text-gray-400 text-xs mt-2">Assumes 20% annual churn (consumer), 15% churn (B2B Creator tier).</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Operating Costs (Monthly Estimates)</p>
            <MiniTable
              headers={['Category', 'Month 1-3', 'Month 4-6', 'Month 7-12', 'Notes']}
              rows={[
                ['Hosting (Vercel, Supabase)', '$50', '$100', '$300', 'Scales with traffic'],
                ['AI APIs (OpenAI, ElevenLabs)', '$200', '$800', '$3,000', 'Largest variable cost'],
                ['Marketing/Ads', '$0', '$500', '$2,000', 'Paid ads start Month 4'],
                ['Tools (analytics, email)', '$50', '$100', '$200', 'PostHog, Resend, Buffer'],
                ['Miscellaneous', '$50', '$100', '$200', 'Domain, contingency'],
                ['<strong>Total Monthly Costs</strong>', '<strong>$350</strong>', '<strong>$1,600</strong>', '<strong>$5,700</strong>', ''],
              ]}
            />
            <p className="text-amber-300 text-xs mt-2 font-medium">
              ⚠️ Breakeven point: ~$1,600 MRR (Month 4-5 projection). Profitable by Month 6.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">Revenue Mix Projection (Month 12)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-lg border border-purple-500/20">
                <p className="text-purple-400 text-xs font-medium mb-1">Consumer (Standard + Pro)</p>
                <p className="text-white text-2xl font-bold mb-1">$23K</p>
                <p className="text-gray-500 text-xs">76% of MRR</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-lg border border-blue-500/20">
                <p className="text-blue-400 text-xs font-medium mb-1">Creator Tier (B2B)</p>
                <p className="text-white text-2xl font-bold mb-1">$7K</p>
                <p className="text-gray-500 text-xs">24% of MRR</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-lg border border-green-500/20">
                <p className="text-green-400 text-xs font-medium mb-1">Total MRR (Month 12)</p>
                <p className="text-white text-2xl font-bold mb-1">$30K</p>
                <p className="text-gray-500 text-xs">$360K ARR run rate</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-3">
              By Month 18, Creator tier projected to grow to 35% of MRR as B2B2C flywheel compounds.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 8. Agent Automation ── */}
      <Section title="🤖 8. Agent Automation (Isaac's Army)">
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

        <div className="mt-4 p-3 bg-[#141414] rounded-lg border border-gray-800">
          <p className="text-white text-xs font-medium mb-2">Daily/Weekly Automation Schedule (Once Active)</p>
          <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4">
            <li><strong>Daily (Luna):</strong> Draft 1-2 social posts based on trending podcast topics + PodShrink data</li>
            <li><strong>Daily (Echo):</strong> Schedule posts, engage with comments within 2 hours, monitor brand mentions</li>
            <li><strong>Weekly (Radar):</strong> SEO health check, traffic report, keyword ranking updates, competitor analysis</li>
            <li><strong>Weekly (Scout):</strong> Scan Reddit/HN/forums for podcast discussions, identify 3-5 partnership targets</li>
            <li><strong>Bi-weekly (Pulse):</strong> Email newsletter to all users with top episodes, new features, tips</li>
            <li><strong>Monthly (Reel):</strong> Produce 4-6 branded video assets for Instagram Reels, TikTok, YouTube Shorts</li>
          </ul>
        </div>
      </Section>

      {/* ── 9. KPIs & Metrics ── */}
      <Section title="📈 9. KPIs & Metrics">
        <p className="text-white text-xs font-medium mb-2">Monthly Growth Goals (First 3 Months)</p>
        <MiniTable
          headers={['Month', 'Combined Followers', 'Weekly Posts', 'Signups from Social', 'Target Revenue']}
          rows={[
            ['1', '500', '20-25', '50', '$50-100 (5-10 paid)'],
            ['2', '1,500', '20-25', '150', '$300-500 (30-50 paid)'],
            ['3', '4,000', '25-30', '400', '$1,000+ (100+ paid)'],
          ]}
        />

        <p className="text-white text-xs font-medium mt-4 mb-2">Scaling Roadmap to 100K Users</p>
        <MiniTable
          headers={['Milestone', 'Users', 'MRR Target', 'Key Lever']}
          rows={[
            ['Month 1-3', '50-400', '$100-1,000', 'Organic social, SEO foundations, community'],
            ['Month 4-6', '400-2,000', '$1,000-5,000', 'Paid ads ($200-500/mo), influencer collabs, email'],
            ['Month 7-12', '2,000-10,000', '$5,000-20,000', 'Content flywheel, referral program, partnerships'],
            ['Year 2', '10,000-100,000', '$20K-200K', 'Viral loops, API/integrations, enterprise tier'],
          ]}
        />

        <p className="text-white text-xs font-medium mt-4 mb-2">Weekly Tracking Dashboard (To Be Built)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
            <p className="text-purple-400 text-xs font-medium mb-2">Product Metrics</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• New signups (total, by channel)</li>
              <li>• Free → Paid conversion rate</li>
              <li>• Churn rate (monthly)</li>
              <li>• Summaries generated per user</li>
              <li>• Most popular shows/episodes</li>
            </ul>
          </div>
          <div className="p-3 bg-[#141414] rounded-lg border border-gray-800">
            <p className="text-blue-400 text-xs font-medium mb-2">Marketing Metrics</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Social media follower growth</li>
              <li>• Post engagement rate (likes, comments, shares)</li>
              <li>• Website traffic (organic vs paid vs social)</li>
              <li>• Email open/click rates</li>
              <li>• Referral program usage</li>
            </ul>
          </div>
        </div>

        <p className="text-white text-xs font-medium mt-4 mb-2">Weekly Review Checklist</p>
        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
          <li>Review analytics for each platform</li>
          <li>Identify top 3 performing posts — why did they work?</li>
          <li>Identify bottom 3 — what to avoid?</li>
          <li>Plan next week&rsquo;s content calendar</li>
          <li>Check competitor social accounts for trends</li>
          <li>Respond to any unanswered comments/DMs</li>
          <li>Update this Business Plan doc with key learnings</li>
        </ul>
      </Section>

      {/* ── 10. Immediate Action Items ── */}
      <Section title="✅ 10. Immediate Action Items" defaultOpen>
        <div className="space-y-4">
          <div>
            <p className="text-white text-sm font-medium mb-2">🔥 This Week (Feb 25 - Mar 3)</p>
            <div className="space-y-2">
              <CheckItem id="act1" label="[Isaac] Resolve social media posting solution" sub="Decision: Buffer API vs manual workflow vs alternative tool" />
              <CheckItem id="act2" label="[Mike] Fix Google Search Console sitemap fetch issue" sub="Debug why GSC can't fetch sitemap. Verify sitemap.xml is publicly accessible." />
              <CheckItem id="act3" label="[Isaac] Draft Day 1-7 social posts (14-day launch sequence)" sub="Copy, visual notes, platform-specific formatting" />
              <CheckItem id="act4" label="[Mike] Design PodShrink for Creators landing page wireframe" sub="Key sections: How it works, pricing, voice cloning demo, testimonials" />
              <CheckItem id="act5" label="[Isaac] Build email list of 50 potential early users" sub="Friends, social followers, podcast communities" />
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">📅 Next 2 Weeks (Mar 4-17)</p>
            <div className="space-y-2">
              <CheckItem id="act6" label="[Isaac] Execute Day 1-14 social launch sequence" sub="Daily posts across all platforms, engagement, monitoring" />
              <CheckItem id="act7" label="[Mike] Implement Creator tier backend (voice cloning integration)" sub="ElevenLabs Professional Voice Cloning API, voice library storage" />
              <CheckItem id="act8" label="[Isaac] Reach out to 10 mid-tier podcasters for Creator beta" sub="Personalized emails offering free 6-month Creator Pro" />
              <CheckItem id="act9" label="[Mike] Launch /blog section with first 3 SEO posts" sub="Topics: Best podcast summary apps, How to listen to more podcasts, AI audio guide" />
              <CheckItem id="act10" label="[Isaac] Set up Google Analytics 4 + weekly reporting automation" sub="Track signups by channel, conversion funnels, traffic sources" />
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">🎯 Next 30 Days (Mar 18 - Apr 18)</p>
            <div className="space-y-2">
              <CheckItem id="act11" label="[Mike] Ship PodShrink for Creators MVP (public launch)" sub="Landing page, onboarding flow, payment integration" />
              <CheckItem id="act12" label="[Isaac] Activate Luna (Content Director) sub-agent" sub="Daily social post drafts, blog topic ideas, episode highlight cards" />
              <CheckItem id="act13" label="[Mike] Chrome extension v1 (MVP)" sub="'Summarize with PodShrink' button on Spotify/Apple Podcasts pages" />
              <CheckItem id="act14" label="[Isaac] Referral program launch" sub="Build referral link system, email templates, tracking dashboard" />
              <CheckItem id="act15" label="[Mike] Hit 100 total users milestone" sub="Track conversion rate, churn, most popular features" />
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-2">💡 Backlog (Next 90 Days)</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li>Product Hunt launch (Month 2-3)</li>
              <li>AppSumo lifetime deal negotiation (Month 4-6)</li>
              <li>Hacker News "Show HN" post (Month 2-3)</li>
              <li>Activate remaining sub-agents (Reel, Echo, Radar, Scout, Pulse)</li>
              <li>First paid ad campaign ($500 budget, Meta + Google)</li>
              <li>Mobile app design + development planning</li>
              <li>Partnership outreach to 50 podcast hosts</li>
              <li>Email newsletter system + first 5 newsletters</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-600/10 rounded-lg border border-purple-500/20">
            <p className="text-purple-300 text-sm font-medium mb-2">🎯 North Star Metric</p>
            <p className="text-gray-300 text-xs">
              <strong>Weekly Active Summarizers (WAS):</strong> Number of users who generate at least 1 summary per week. 
              This metric ties directly to engagement, retention, and revenue. Goal: 100 WAS by Month 3, 1,000 WAS by Month 12.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
