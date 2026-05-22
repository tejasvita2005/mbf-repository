'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Flame, Zap, Target, Heart, Award } from 'lucide-react';

type Stat = {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  progress: number;
  trend: string;
};

const stats: Stat[] = [
  {
    label: 'Recovery Progress',
    value: '73%',
    subtext: 'Overall recovery score',
    icon: TrendingUp,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    progress: 73,
    trend: '+5% this week',
  },
  {
    label: 'Weekly Completion',
    value: '6/7',
    subtext: 'Days completed this week',
    icon: Target,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    progress: 86,
    trend: '86% completion rate',
  },
  {
    label: 'Current Streak',
    value: '12',
    subtext: 'Days in a row',
    icon: Flame,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    progress: 60,
    trend: 'Personal best!',
  },
  {
    label: 'Active Exercises',
    value: '18',
    subtext: 'In your program',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    progress: 72,
    trend: '13 completed today',
  },
  {
    label: 'Recovery Score',
    value: '8.4',
    subtext: 'Out of 10',
    icon: Heart,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    progress: 84,
    trend: '+0.3 from yesterday',
  },
  {
    label: 'Milestones',
    value: '9',
    subtext: 'Achievements earned',
    icon: Award,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    progress: 45,
    trend: '2 remaining this month',
  },
];

export function StatsGrid() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`glass rounded-2xl p-4 border ${stat.borderColor} card-hover animate-fade-in-up stagger-${i + 1}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-4.5 h-4.5 w-[18px] h-[18px] ${stat.color}`} />
            </div>
          </div>
          <div className="mb-3">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-medium text-white/80 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stat.subtext}</p>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                stat.color === 'text-cyan-400' ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                stat.color === 'text-teal-400' ? 'bg-gradient-to-r from-teal-500 to-teal-400' :
                stat.color === 'text-orange-400' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                stat.color === 'text-yellow-400' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                stat.color === 'text-pink-400' ? 'bg-gradient-to-r from-pink-500 to-pink-400' :
                'bg-gradient-to-r from-emerald-500 to-emerald-400'
              }`}
              style={{ width: animated ? `${stat.progress}%` : '0%' }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">{stat.trend}</p>
        </div>
      ))}
    </div>
  );
}
