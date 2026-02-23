'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Users, Headphones, Radio, Podcast, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-red-400">Failed to load stats</div>;

  const cards = [
    { label: 'Total Users', value: stats.users.total, icon: Users, color: 'purple' },
    { label: 'Free', value: stats.users.byPlan.free, icon: Users, color: 'gray' },
    { label: 'Standard', value: stats.users.byPlan.standard, icon: Users, color: 'blue' },
    { label: 'Pro', value: stats.users.byPlan.pro, icon: Users, color: 'amber' },
    { label: 'Signups (7d)', value: stats.users.recentSignups, icon: TrendingUp, color: 'green' },
    { label: 'Total Shrinks', value: stats.shrinks.total, icon: Headphones, color: 'purple' },
    { label: 'Completed', value: stats.shrinks.completed, icon: Headphones, color: 'green' },
    { label: 'Errors', value: stats.shrinks.errors, icon: AlertCircle, color: 'red' },
    { label: 'Shrinks (7d)', value: stats.shrinks.recentWeek, icon: TrendingUp, color: 'blue' },
    { label: 'Today', value: stats.shrinks.today, icon: TrendingUp, color: 'purple' },
    { label: 'Shows', value: stats.content.shows, icon: Radio, color: 'purple' },
    { label: 'Episodes', value: stats.content.episodes, icon: Podcast, color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    purple: 'bg-purple-600/20 text-purple-400',
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    amber: 'bg-amber-600/20 text-amber-400',
    red: 'bg-red-600/20 text-red-400',
    gray: 'bg-gray-600/20 text-gray-400',
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#141414] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-xs font-medium uppercase tracking-wide">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[card.color]}`}>
                <card.icon size={14} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
