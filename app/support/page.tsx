'use client';

import { useState } from 'react';
import { ChevronDown, Mail, Send } from 'lucide-react';
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
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';
      const res = await fetch(`${apiUrl}/api/support/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, issueType, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send message');
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setIssueType('');
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Support" />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
        {/* FAQ */}
        <section className="mb-8">
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

        {/* Contact Us — collapsible */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setContactOpen(!contactOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#222] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-purple-400" />
                <div>
                  <span className="text-white text-sm font-medium">Send us a message</span>
                  <p className="text-gray-500 text-xs">We typically respond within 24 hours</p>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                  contactOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {contactOpen && (
              <div className="px-5 pb-5 pt-2">
                {submitted && (
                  <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mb-4">
                    <p className="text-green-400 text-sm">✓ Message sent! We'll get back to you soon.</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Issue Type</label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select an issue type</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Shrink Issue">Shrink Issue</option>
                      <option value="Account Help">Account Help</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {submitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
