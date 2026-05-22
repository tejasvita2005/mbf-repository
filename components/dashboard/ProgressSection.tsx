'use client';

import { TrendingUp, Award, ChartBar as BarChart2 } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', pct: 90, label: '9/10' },
  { day: 'Tue', pct: 75, label: '6/8' },
  { day: 'Wed', pct: 100, label: '8/8' },
  { day: 'Thu', pct: 60, label: '5/8' },
  { day: 'Fri', pct: 85, label: '7/8' },
  { day: 'Sat', pct: 50, label: '4/8' },
  { day: 'Sun', pct: 0, label: '—' },
];

const milestones = [
  { label: 'First Week Complete', date: 'Apr 28', done: true },
  { label: '5-Day Streak', date: 'May 2', done: true },
  { label: '100 Exercises Done', date: 'May 7', done: true },
  { label: '10-Day Streak', date: 'May 8', done: true },
  { label: '50% Recovery Progress', date: 'May 10', done: true },
  { label: '30-Day Streak', date: 'Jun 5', done: false },
];

export function ProgressSection() {
  return (
    <div className="space-y-5">
      {/* Weekly chart */}
      <div className="glass rounded-2xl border border-white/7 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <BarChart2 className="w-[18px] h-[18px] text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Weekly Progress</h2>
            <p className="text-xs text-slate-500">Exercise completion this week</p>
          </div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-slate-500">{d.label}</span>
              <div className="w-full bg-white/5 rounded-lg overflow-hidden relative" style={{ height: '80px' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-lg transition-all duration-700 ${
                    d.pct === 100 ? 'bg-gradient-to-t from-cyan-500 to-teal-400' :
                    d.pct >= 75 ? 'bg-gradient-to-t from-teal-500 to-teal-400' :
                    d.pct >= 50 ? 'bg-gradient-to-t from-blue-500/80 to-blue-400' :
                    d.pct === 0 ? 'bg-white/5' :
                    'bg-gradient-to-t from-slate-600 to-slate-500'
                  }`}
                  style={{ height: `${d.pct}%`, animationDelay: `${i * 0.1}s` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="glass rounded-2xl border border-white/7 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Award className="w-[18px] h-[18px] text-yellow-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Milestones</h2>
            <p className="text-xs text-slate-500">Track your achievements</p>
          </div>
        </div>
        <div className="space-y-2">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                m.done
                  ? 'bg-teal-500/10 border-teal-500/20'
                  : 'bg-white/3 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  m.done ? 'bg-teal-500 text-white' : 'bg-white/10 text-slate-500'
                }`}>
                  {m.done ? '✓' : '○'}
                </div>
                <span className={`text-xs font-medium ${m.done ? 'text-teal-300' : 'text-slate-500'}`}>
                  {m.label}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
