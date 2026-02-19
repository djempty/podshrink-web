'use client';

interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
}

const durations = [1, 3, 5, 10, 15];

export default function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Target Duration</label>
      <div className="flex gap-2">
        {durations.map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={() => onChange(duration)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              value === duration
                ? 'bg-purple-600 text-white'
                : 'bg-dark-hover text-gray-300 hover:bg-dark-card border border-gray-700'
            }`}
          >
            {duration} min
          </button>
        ))}
      </div>
    </div>
  );
}
