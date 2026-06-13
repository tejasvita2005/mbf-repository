'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ExerciseSection } from '@/components/dashboard/ExerciseSection';
import { VideoSection } from '@/components/dashboard/VideoSection';
import { CalendarSection } from '@/components/dashboard/CalendarSection';
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import { FeedbackForm } from '@/components/dashboard/FeedbackForm';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { Activity, Bell, Search } from 'lucide-react';

function getGreeting(): string {
  const h = new Date().getHours();

  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';

  return 'Good evening';
}

function getInitials(first: string, last: string, email: string) {
  if (first) {
    return (first[0] + (last?.[0] || '')).toUpperCase();
  }

  return email?.[0]?.toUpperCase() || 'U';
}

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();

  const router = useRouter();

  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center animate-pulse">
            <Activity className="w-6 h-6 text-white" />
          </div>

          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName =
    profile?.first_name || user.user_metadata?.first_name || '';

  const lastName =
    profile?.last_name || user.user_metadata?.last_name || '';

  const email = user.email || '';

  const initials = getInitials(firstName, lastName, email);

  const displayName = firstName || email.split('@')[0];

  const renderSection = () => {
    switch (activeSection) {
      case 'exercises':
        return (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-white mb-6">
              Exercise Program
            </h1>

            <ExerciseSection />
          </div>
        );

      case 'videos':
        return (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold text-white mb-6">
              Exercise Library
            </h1>

            <VideoSection />
          </div>
        );

      case 'calendar':
        return (
          <div className="animate-fade-in-up max-w-lg">
            <h1 className="text-2xl font-bold text-white mb-6">
              Workout Calendar
            </h1>

            <CalendarSection />
          </div>
        );

      case 'progress':
        return (
          <div className="animate-fade-in-up max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-6">
              My Progress
            </h1>

            <ProgressSection />
          </div>
        );

      case 'feedback':
        return (
          <div className="animate-fade-in-up max-w-xl">
            <h1 className="text-2xl font-bold text-white mb-6">
              Wellness Feedback
            </h1>

            <FeedbackForm />
          </div>
        );

      default:
        return (
          <OverviewSection
            firstName={displayName}
            initials={initials}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050d1a] bg-grid-pattern">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5 glass">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8" />
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />

              <input
                type="text"
                placeholder="Search exercises..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Bell className="w-4 h-4" />

              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </button>

            <button
              onClick={() => setActiveSection('settings')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold glow-cyan hover:scale-105 transition-transform"
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

function OverviewSection({
  firstName,
}: {
  firstName: string;
  initials: string;
}) {
  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-slate-400 text-sm mb-1">
              {getGreeting()}
            </p>

            <h1 className="text-3xl lg:text-4xl font-bold">
              <span className="text-white">Welcome back, </span>

              <span className="text-gradient-cyan capitalize">
                {firstName}
              </span>

              <span className="text-white"> 👋</span>
            </h1>

            <p className="text-slate-400 mt-2 text-sm">
              Here&apos;s your rehabilitation overview for today.
            </p>
          </div>

          <div className="glass rounded-2xl border border-cyan-500/20 px-5 py-3 glow-cyan text-center">
            <p className="text-3xl font-bold text-gradient-cyan">
              Day 12
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              Current Streak
            </p>

            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < 5
                      ? 'bg-cyan-400'
                      : i === 5
                      ? 'bg-cyan-400/50'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 animate-fade-in-up stagger-2">
          <ExerciseSection />
        </div>

        <div className="animate-fade-in-up stagger-3">
          <CalendarSection />
        </div>
      </div>

      {/* Videos */}
      <div className="glass rounded-2xl border border-white/7 p-6 animate-fade-in-up stagger-4">
        <VideoSection />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in-up stagger-5">
          <FeedbackForm />
        </div>

        <div className="space-y-5 animate-fade-in-up stagger-6">
          <MoodTracker />

          <RecoverySummaryCard />
        </div>
      </div>
    </div>
  );
}

function RecoverySummaryCard() {
  const metrics = [
    {
      label: 'Pain Level',
      value: '2/10',
      color: 'text-emerald-400',
      bar: 20,
      barColor: 'bg-emerald-500',
    },
    {
      label: 'Mobility',
      value: '76%',
      color: 'text-cyan-400',
      bar: 76,
      barColor: 'bg-cyan-500',
    },
    {
      label: 'Strength',
      value: '68%',
      color: 'text-teal-400',
      bar: 68,
      barColor: 'bg-teal-500',
    },
    {
      label: 'Endurance',
      value: '55%',
      color: 'text-blue-400',
      bar: 55,
      barColor: 'bg-blue-500',
    },
    {
      label: 'Flexibility',
      value: '82%',
      color: 'text-yellow-400',
      bar: 82,
      barColor: 'bg-yellow-500',
    },
    {
      label: 'Balance',
      value: '71%',
      color: 'text-orange-400',
      bar: 71,
      barColor: 'bg-orange-500',
    },
  ];

  return (
    <div className="glass rounded-2xl border border-white/7 p-5 h-fit">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Activity className="w-[18px] h-[18px] text-cyan-400" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">
            Recovery Metrics
          </h2>

          <p className="text-xs text-slate-500">
            Current rehabilitation scores
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">
                {m.label}
              </span>

              <span className={`text-xs font-bold ${m.color}`}>
                {m.value}
              </span>
            </div>

            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${m.barColor} rounded-full progress-bar`}
                style={{ width: `${m.bar}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <p className="text-xs text-cyan-300 font-medium">
          Overall Recovery
        </p>

        <p className="text-2xl font-bold text-gradient-cyan mt-0.5">
          73%
        </p>

        <p className="text-[10px] text-slate-500 mt-1">
          On track for full recovery by July 2026
        </p>
      </div>
    </div>
  );
}