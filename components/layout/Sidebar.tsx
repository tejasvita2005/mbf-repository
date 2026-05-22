'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Activity, LayoutDashboard, Dumbbell, SquarePlay as PlaySquare, Calendar, TrendingUp, MessageSquare, Settings, LogOut, Menu, X, ChevronRight, Brain } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', section: 'overview' },
  { icon: Dumbbell, label: 'Exercises', href: '/dashboard?tab=exercises', section: 'exercises' },
  { icon: PlaySquare, label: 'Videos', href: '/dashboard?tab=videos', section: 'videos' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard?tab=calendar', section: 'calendar' },
  { icon: TrendingUp, label: 'Progress', href: '/dashboard?tab=progress', section: 'progress' },
  { icon: MessageSquare, label: 'Feedback', href: '/dashboard?tab=feedback', section: 'feedback' },
  { icon: Brain, label: 'AI Recommendations', href: '/ai-recommendation', section: 'ai-recommendation' },
  { icon: Dumbbell, label: 'My Workouts', href: '/workouts', section: 'workouts' },
];

function getInitials(firstName: string, lastName: string, email: string): string {
  if (firstName) return (firstName[0] + (lastName?.[0] || '')).toUpperCase();
  return email ? email[0].toUpperCase() : 'U';
}

type SidebarProps = {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
};

export function Sidebar({ activeSection = 'overview', onSectionChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const displayName = profile?.first_name || user?.user_metadata?.first_name || '';
  const lastName = profile?.last_name || user?.user_metadata?.last_name || '';
  const email = user?.email || '';
  const initials = getInitials(displayName, lastName, email);

  const handleNav = (section: string, href: string) => {
    onSectionChange?.(section);
    setMobileOpen(false);
    if (href) router.push(href);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-md" />
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <span className="text-base font-bold text-gradient-cyan">MB Fitness</span>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">Rehabilitation Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map(({ icon: Icon, label, href, section }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => handleNav(section, href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
              <span className="text-sm font-medium">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-cyan-500" />}
            </button>
          );
        })}

        <div className="my-3 border-t border-white/5" />
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Account</p>

        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            pathname === '/settings'
              ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-500/20 text-cyan-300'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-[18px] h-[18px] shrink-0 group-hover:text-cyan-400 transition-colors" />
          <span className="text-sm font-medium">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 group"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all cursor-pointer" onClick={() => router.push('/settings')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{displayName || 'User'} {lastName}</p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 glass border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full glass border-r border-white/5 animate-fade-in-left">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
