'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Simulated scheduled workout days and completed days
const workoutDays = new Set([1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29]);
const completedDays = new Set([1, 3, 5, 8, 10, 12]);

const upcomingSessions = [
  { day: 'Today', label: 'Hip Mobility + Core', time: '9:00 AM', color: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' },
  { day: 'Tomorrow', label: 'Upper Body Stretch', time: '9:30 AM', color: 'bg-teal-500/20 border-teal-500/30 text-teal-300' },
  { day: 'Wednesday', label: 'Balance Training', time: '10:00 AM', color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
  { day: 'Thursday', label: 'Active Recovery', time: '9:00 AM', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
];

export function CalendarSection() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="glass rounded-2xl border border-white/7 overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Workout Calendar</h2>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-semibold text-white">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-[10px] font-semibold text-slate-500 text-center py-1">{d}</div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const isWorkout = workoutDays.has(day);
            const isDone = completedDays.has(day);
            const todayFlag = isToday(day);
            return (
              <button
                key={i}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 relative
                  ${todayFlag ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white glow-cyan scale-105' :
                    isDone ? 'bg-teal-500/20 text-teal-300 border border-teal-500/20' :
                    isWorkout ? 'bg-white/5 text-white border border-cyan-500/20 hover:bg-cyan-500/10' :
                    'text-slate-600 hover:text-slate-400 hover:bg-white/5'
                  }`}
              >
                {day}
                {isWorkout && !todayFlag && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${isDone ? 'bg-teal-400' : 'bg-cyan-500'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500" /> Today
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50" /> Completed
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/50" /> Scheduled
          </div>
        </div>
      </div>

      {/* Upcoming sessions */}
      <div className="p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Upcoming Sessions</p>
        <div className="space-y-2">
          {upcomingSessions.map((session, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${session.color} transition-all hover:scale-[1.01]`}
            >
              <div>
                <p className="text-xs font-semibold">{session.day}</p>
                <p className="text-xs opacity-80 mt-0.5">{session.label}</p>
              </div>
              <span className="text-[10px] font-medium opacity-70">{session.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
