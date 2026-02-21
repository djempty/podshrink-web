'use client';

import { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const FAQ = [
  {
    q: 'What is PodShrink?',
    a: 'PodShrink is an AI-powered podcast summary service. We transform full-length podcast episodes into concise, narrated audio summaries so you can stay informed in a fraction of the time.',
  },
  {
    q: 'How do shrinks work?',
    a: 'Pick any podcast episode, choose your preferred duration (1, 5, or 10 minutes) and voice, then hit generate. Our AI transcribes the episode, distills the key points, and creates a narrated audio summary.',
  },
  {
    q: 'What counts as a "shrink"?',
    a: 'Each time you generate an AI summary of a podcast episode, that counts as one shrink — regardless of the duration you choose.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime from your Account settings. You\'ll keep access until the end of your current billing period.',
  },
  {
    q: 'How do I download my shrinks?',
    a: 'Go to Saved Shrinks in the sidebar. Each completed shrink has a download button that saves it as an MP3 file.',
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: 'You can still browse podcasts and listen to previously saved shrinks. To generate new ones, wait for your monthly reset or upgrade your plan.',
  },
  {
    q: 'What if my shrink times out or never finishes?',
    a: 'Only fully completed shrinks count toward your monthly total. If a shrink times out or fails, it won\'t use up one of your shrinks. Just refresh the page and try again — if the issue persists, try a shorter duration or contact support.',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Support" showSignUp={false} />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
        {/* Contact */}
        <section className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Mail size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Contact Us</h2>
              <p className="text-gray-500 text-sm">We typically respond within 24 hours</p>
            </div>
          </div>
          <a
            href="mailto:support@podshrink.com"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Mail size={16} />
            support@podshrink.com
          </a>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#222] transition-colors"
                >
                  <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
