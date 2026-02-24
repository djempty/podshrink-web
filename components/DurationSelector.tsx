'use client';

import { useSession } from 'next-auth/react';

interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
}

const durations = [1, 3, 5, 10, 15];

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan || 'free';
  const hasPaidPlan = userPlan === 'standard' || userPlan === 'pro';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Target Duration
        {!hasPaidPlan && (
          <span className="text-gray-500 text-xs ml-2">1 min free · <a href="/pricing" className="text-purple-400 hover:text-purple-300">Upgrade for more</a></span>
        )}
      </label>
      <div className="flex gap-2">
        {durations.map((duration) => {
          const locked = !hasPaidPlan && duration > 1;
          return (
            <button
              key={duration}
              type="button"
              onClick={() => !locked && onChange(duration)}
              disabled={locked}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                locked
                  ? 'bg-dark-hover text-gray-600 border border-gray-800 cursor-not-allowed'
                  : value === duration
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-card border border-gray-700'
              }`}
            >
              {duration} min{locked ? ' 🔒' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
