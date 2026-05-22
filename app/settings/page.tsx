'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { supabase } from '@/lib/supabase';
import { User, Mail, Bell, Shield, LogOut, Save, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Activity, Smartphone, Moon, Volume2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReport: true,
    milestoneAlerts: true,
    pushNotifications: false,
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    } else if (user) {
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveStatus('idle');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user) return null;

  const email = user.email || '';
  const displayFirst = firstName || email.split('@')[0];
  const initials = ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || email[0]?.toUpperCase() || 'U';
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-[#050d1a] bg-grid-pattern">
      <Sidebar activeSection="settings" />

      <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
          </div>

          {/* Profile card */}
          <div className="glass rounded-2xl border border-white/7 p-6 mb-5 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold glow-cyan">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#050d1a] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white capitalize">{displayFirst} {lastName}</h2>
                <p className="text-sm text-slate-400">{email}</p>
                <p className="text-xs text-slate-600 mt-0.5">Member since {joinDate}</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Profile Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-slate-400 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Email cannot be changed</p>
              </div>

              {saveStatus === 'success' && (
                <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs animate-slide-down">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Profile updated successfully
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="mt-3 flex items-center gap-1.5 text-red-400 text-xs animate-slide-down">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Failed to update profile
                </div>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all glow-cyan"
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl border border-white/7 p-6 mb-5 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-2 mb-5">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: 'dailyReminders', label: 'Daily exercise reminders', desc: 'Get reminded to complete your daily exercises', icon: Activity },
                { key: 'weeklyReport', label: 'Weekly progress report', desc: 'Receive a summary of your weekly progress', icon: Bell },
                { key: 'milestoneAlerts', label: 'Milestone achievements', desc: 'Be notified when you reach new milestones', icon: CheckCircle2 },
                { key: 'pushNotifications', label: 'Push notifications', desc: 'Enable browser push notifications', icon: Smartphone },
              ].map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 ${notifications[key as keyof typeof notifications] ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* App preferences */}
          <div className="glass rounded-2xl border border-white/7 p-6 mb-5 animate-fade-in-up stagger-3">
            <div className="flex items-center gap-2 mb-5">
              <Moon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Preferences</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-white">Dark Mode</p>
                    <p className="text-xs text-slate-500">Always enabled for MB Fitness</p>
                  </div>
                </div>
                <div className="w-11 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 relative">
                  <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-white">Sound Effects</p>
                    <p className="text-xs text-slate-500">Play sounds on exercise completion</p>
                  </div>
                </div>
                <div className="w-11 h-6 rounded-full bg-white/10 relative">
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="glass rounded-2xl border border-white/7 p-6 mb-5 animate-fade-in-up stagger-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                <div>
                  <p className="text-sm text-white">Authentication</p>
                  <p className="text-xs text-slate-500">Managed by Supabase Auth</p>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                <div>
                  <p className="text-sm text-white">Session</p>
                  <p className="text-xs text-slate-500">Currently signed in</p>
                </div>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">Active</span>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div className="glass rounded-2xl border border-red-500/10 p-6 animate-fade-in-up stagger-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Sign Out</h3>
                <p className="text-xs text-slate-500 mt-0.5">Sign out of your MB Fitness account</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
