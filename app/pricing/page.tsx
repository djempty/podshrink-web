'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, Zap, Crown, Sparkles, Tag, ChevronDown } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://podshrink-production.up.railway.app';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: '',
    description: 'Try PodShrink with no commitment',
    icon: Sparkles,
    color: 'border-gray-700',
    buttonStyle: 'border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-white',
    buttonText: 'Get Started',
    features: [
      '3 shrinks per month',
      'All podcast shows',
      '1 minute summaries',
      '3 voice options',
      'Stream in browser',
    ],
    limits: [
      'No 5 or 10 min summaries',
      'No saved library',
      'No priority processing',
    ],
  },
  {
    name: 'Standard',
    price: 9.99,
    period: '/month',
    description: 'For regular podcast listeners',
    icon: Zap,
    color: 'border-purple-500',
    buttonStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
    buttonText: 'Subscribe',
    popular: true,
    features: [
      '30 shrinks per month',
      'All podcast shows',
      '1, 5, or 10 minute summaries',
      'All 12 premium voices',
      'Saved Shrinks library',
      'Priority processing',
      'Download MP3s',
    ],
  },
  {
    name: 'Pro',
    price: 19.99,
    period: '/month',
    description: 'For power users & professionals',
    icon: Crown,
    color: 'border-amber-500',
    buttonStyle: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white',
    buttonText: 'Go Pro',
    features: [
      'Unlimited shrinks',
      'All podcast shows',
      '1, 5, or 10 minute summaries',
      'All 12 premium voices',
      'Saved Shrinks library',
      'Priority processing',
      'Download MP3s',
      'Early access to new features',
      'Early access to new voices',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return 0;
    if (billingCycle === 'annual') return Math.round(basePrice * 0.8 * 100) / 100;
    return basePrice;
  };

  const handleSubscribe = async (planName: string) => {
    if (!session?.user?.id) {
      // Not logged in - redirect to signup with plan
      router.push(`/signup?plan=${planName.toLowerCase()}`);
      return;
    }

    // Logged in - create Stripe checkout session
    setLoading(planName);
    try {
      const response = await fetch(`${API_URL}/api/stripe/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planName.toLowerCase(),
          userId: session.user.email || session.user.id,
          ...(promoCode.trim() && { promoCode: promoCode.trim() })
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.user?.id) return;

    setLoading('portal');
    try {
      const response = await fetch(`${API_URL}/api/stripe/portal?userId=${session.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] px-4 md:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Annual
              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>

          {/* Promo Code */}
          <div className="mt-4">
            {!showPromo ? (
              <button
                onClick={() => setShowPromo(true)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1 mx-auto"
              >
                <Tag size={14} />
                Have a promo code?
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="bg-transparent text-white text-sm px-3 py-1.5 focus:outline-none placeholder-gray-500 w-36"
                />
                {promoCode && (
                  <span className="text-green-400 text-xs font-medium pr-2">✓ Applied at checkout</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-[#1a1a1a] rounded-2xl border-2 ${plan.color} p-7 flex flex-col transition-all hover:scale-[1.02] duration-200`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <plan.icon size={20} className={plan.popular ? 'text-purple-400' : plan.name === 'Pro' ? 'text-amber-400' : 'text-gray-400'} />
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price === 0 ? 'Free' : `$${getPrice(plan.price)}`}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm">
                      {billingCycle === 'annual' && plan.price > 0 ? '/month' : plan.period}
                    </span>
                  )}
                </div>
                {billingCycle === 'annual' && plan.price > 0 && (
                  <p className="text-gray-600 text-xs mt-1">
                    Billed ${Math.round(getPrice(plan.price) * 12 * 100) / 100}/year
                  </p>
                )}
              </div>

              <button
                onClick={() => plan.price === 0 ? router.push('/signup') : handleSubscribe(plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 disabled:opacity-50 ${plan.buttonStyle}`}
              >
                {loading === plan.name ? 'Loading...' : plan.buttonText}
              </button>

              <div className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-[#2EA84A] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feat}</span>
                    </li>
                  ))}
                  {plan.limits?.map((limit, i) => (
                    <li key={`limit-${i}`} className="flex items-start gap-3 text-sm">
                      <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center text-gray-600">—</span>
                      <span className="text-gray-600">{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Manage Subscription (for paid users) */}
        {session?.user?.plan && session.user.plan !== 'free' && (
          <div className="text-center mb-16">
            <button
              onClick={handleManageSubscription}
              disabled={loading === 'portal'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading === 'portal' ? 'Loading...' : 'Manage Subscription'}
            </button>
            <p className="text-gray-500 text-sm mt-2">Update payment method, view invoices, or cancel</p>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Questions?</h2>
          <div className="space-y-6">
            {[
              {
                q: 'What counts as a "shrink"?',
                a: 'Each time you generate an AI summary of a podcast episode, that counts as one shrink — regardless of duration.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your account settings at any time. You keep access until the end of your billing period.',
              },
              {
                q: 'What happens when I hit my limit?',
                a: 'You can still browse and listen to previously saved shrinks. To generate new ones, either wait for your monthly reset or upgrade.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'The Free plan is your trial — try 3 shrinks per month with no credit card required. Upgrade when you\'re ready.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-800 pb-5">
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
