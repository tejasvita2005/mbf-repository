'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { CircleCheck as CheckCircle2, SmilePlus } from 'lucide-react';

type MoodOption = {
  value: 'great' | 'good' | 'okay' | 'low' | 'bad';
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
};

const moods: MoodOption[] = [
  { value: 'great', label: 'Amazing', emoji: '😄', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  { value: 'good', label: 'Good', emoji: '😊', color: 'text-teal-400', bg: 'bg-teal-500/20', border: 'border-teal-500/30' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  { value: 'low', label: 'Low', emoji: '😔', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  { value: 'bad', label: 'Rough', emoji: '😞', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
];

export function MoodTracker() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todaysMood, setTodaysMood] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    supabase
      .from('mood_entries')
      .select('mood')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTodaysMood(data.mood);
          setSelectedMood(data.mood);
          setSaved(true);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user || !selectedMood) return;
    setSaving(true);
    try {
      await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood: selectedMood,
        note,
      });
      setTodaysMood(selectedMood);
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setSaved(false);
    setTodaysMood(null);
  };

  const selected = moods.find(m => m.value === selectedMood);

  return (
    <div className="glass rounded-2xl border border-white/7 p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center">
          <SmilePlus className="w-4.5 h-4.5 w-[18px] h-[18px] text-teal-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Daily Mood</h2>
          <p className="text-xs text-slate-500">How are you feeling today?</p>
        </div>
      </div>

      {saved && todaysMood ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-3 animate-float">{moods.find(m => m.value === todaysMood)?.emoji}</div>
          <p className="text-white font-semibold">{moods.find(m => m.value === todaysMood)?.label}</p>
          <p className="text-xs text-slate-500 mt-1">Today&apos;s mood logged</p>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-teal-400 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved successfully</span>
          </div>
          <button
            onClick={handleEdit}
            className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
          >
            Update mood
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {moods.map(mood => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 ${
                  selectedMood === mood.value
                    ? `${mood.bg} ${mood.border} scale-105`
                    : 'bg-white/3 border-white/5 hover:bg-white/8'
                }`}
              >
                <span className="text-2xl leading-none">{mood.emoji}</span>
                <span className={`text-[9px] font-medium ${selectedMood === mood.value ? mood.color : 'text-slate-500'}`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="animate-slide-down">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note about how you're feeling... (optional)"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500/30 transition-all resize-none mb-3"
              />
              <button
                onClick={handleSave}
                disabled={saving || !selectedMood}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  selected ? `${selected.bg} ${selected.color} border ${selected.border} hover:scale-[1.01]` : 'bg-white/10 text-slate-400'
                } disabled:opacity-50`}
              >
                {saving ? (
                  <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                {saving ? 'Saving...' : `Log ${selected?.label} Mood`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
