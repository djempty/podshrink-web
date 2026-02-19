'use client';

import { useEffect, useState } from 'react';
import { Shrink } from '@/lib/types';
import { api } from '@/lib/api';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ShrinkProgressProps {
  shrinkId: number;
  onComplete?: (shrink: Shrink) => void;
}

export default function ShrinkProgress({ shrinkId, onComplete }: ShrinkProgressProps) {
  const [shrink, setShrink] = useState<Shrink | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchShrink = async () => {
      try {
        const data = await api.getShrink(shrinkId);
        setShrink(data);

        if (data.status === 'complete' || data.status === 'error') {
          clearInterval(interval);
          if (data.status === 'complete' && onComplete) {
            onComplete(data);
          }
          if (data.status === 'error') {
            setError(data.error_message || 'Unknown error occurred');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch shrink status');
        clearInterval(interval);
      }
    };

    fetchShrink();
    interval = setInterval(fetchShrink, 3000);

    return () => clearInterval(interval);
  }, [shrinkId, onComplete]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-400">
          <XCircle size={24} />
          <div>
            <h3 className="font-semibold">Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!shrink) {
    return (
      <div className="bg-dark-card rounded-lg p-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-400" size={32} />
      </div>
    );
  }

  const steps = [
    { key: 'transcribing', label: 'Transcribing Audio' },
    { key: 'generating_script', label: 'Generating Script' },
    { key: 'creating_audio', label: 'Creating Audio' },
    { key: 'complete', label: 'Complete' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === shrink.status);

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isComplete = index < currentStepIndex || shrink.status === 'complete';
          const isPending = index > currentStepIndex;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="text-green-400" size={24} />
                ) : isActive ? (
                  <Loader2 className="animate-spin text-purple-400" size={24} />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isActive ? 'text-white' : isComplete ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {shrink.status === 'complete' && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-green-400 font-medium">
            ✓ Your shrunk episode is ready!
          </p>
        </div>
      )}
    </div>
  );
}
