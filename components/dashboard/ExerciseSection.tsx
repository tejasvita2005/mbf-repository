'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { CircleCheck as CheckCircle2, Circle, Clock, Flame, ChevronRight, RefreshCw } from 'lucide-react';

type Exercise = {
  id: string;
  name: string;
  category: string;
  duration: string;
  reps?: string;
  sets?: string;
  injuryType?: string;

  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  bodyPart: string;
};


 

const exercises: Exercise[] = [
  { id: 'ex1', name: 'Hip Flexor Stretch', category: 'Stretching', duration: '5 min', reps: '3x30s hold', sets: '3', difficulty: 'Easy', description: 'Gentle hip flexor stretch to improve mobility', bodyPart: 'Hip', injuryType: 'ACL' },
  { id: 'ex2', name: 'Ankle Circles', category: 'Mobility', duration: '4 min', reps: '2x20 each', sets: '2', difficulty: 'Easy', description: 'Circular ankle rotations for joint mobility', bodyPart: 'Ankle', injuryType: 'ACL' },
  { id: 'ex3', name: 'Clamshell Exercise', category: 'Core Strength', duration: '8 min', reps: '3x15 each', sets: '3', difficulty: 'Medium', description: 'Hip abductor strengthening movement', bodyPart: 'Hip/Glute', injuryType: 'ACL' },
  { id: 'ex4', name: 'Single Leg Balance', category: 'Balance', duration: '6 min', reps: '3x30s each', sets: '3', difficulty: 'Medium', description: 'Proprioception and balance training', bodyPart: 'Leg', injuryType: 'ACL' },
  { id: 'ex5', name: 'Seated Leg Raises', category: 'Strength', duration: '7 min', reps: '3x12', sets: '3', difficulty: 'Easy', description: 'Quadriceps strengthening while seated', bodyPart: 'Quad', injuryType: 'ACL' },
  { id: 'ex6', name: 'Shoulder Pendulum', category: 'Recovery', duration: '5 min', reps: '2x2min', sets: '2', difficulty: 'Easy', description: 'Gentle shoulder mobility and decompression', bodyPart: 'Shoulder', injuryType: 'Shoulder' },
  { id: 'ex7', name: 'Glute Bridge', category: 'Core Strength', duration: '10 min', reps: '3x15', sets: '3', difficulty: 'Medium', description: 'Posterior chain activation and strengthening', bodyPart: 'Glute', injuryType: 'Back Pain' },
  { id: 'ex8', name: 'Thoracic Rotation', category: 'Mobility', duration: '6 min', reps: '2x10 each', sets: '2', difficulty: 'Easy', description: 'Upper back mobility improvement', bodyPart: 'Back', injuryType: 'Back Pain' },

];

const categoryColors: Record<string, string> = {
  'Stretching': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  'Mobility': 'bg-teal-500/20 text-teal-400 border-teal-500/20',
  'Core Strength': 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  'Balance': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  'Strength': 'bg-red-500/20 text-red-400 border-red-500/20',
  'Recovery': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
};

const difficultyColors: Record<string, string> = {
  'Easy': 'text-emerald-400',
  'Medium': 'text-yellow-400',
  'Hard': 'text-red-400',
};

export function ExerciseSection() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Stretching', 'Mobility', 'Core Strength', 'Balance', 'Recovery'];

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    supabase
      .from('exercise_completions')
      .select('exercise_id')
      .eq('user_id', user.id)
      .gte('completed_at', `${today}T00:00:00`)
      .lte('completed_at', `${today}T23:59:59`)
      .then(({ data }) => {
        if (data) setCompleted(new Set(data.map(d => d.exercise_id)));
        setLoading(false);
      });
  }, [user]);

  const toggleExercise = async (exerciseId: string) => {
    if (!user) return;
    const newCompleted = new Set(completed);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
      await supabase
        .from('exercise_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId);
    } else {
      newCompleted.add(exerciseId);
      await supabase
        .from('exercise_completions')
        .insert({ user_id: user.id, exercise_id: exerciseId });
    }
    setCompleted(newCompleted);
  };

  const filtered = filter === 'All' ? exercises : exercises.filter(e => e.category === filter);
  const completedCount = exercises.filter(e => completed.has(e.id)).length;
  const totalCount = exercises.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="glass rounded-2xl border border-white/7 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Today&apos;s Exercises</h2>
            <p className="text-sm text-slate-500 mt-0.5">{completedCount} of {totalCount} completed</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-gradient-cyan">{progressPct}%</p>
              <p className="text-[10px] text-slate-500">daily progress</p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {/* Category filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/15 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
        {filtered.map((exercise) => {
          const isDone = completed.has(exercise.id);
          return (
            <div
              key={exercise.id}
              className={`flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-white/3 cursor-pointer ${isDone ? 'opacity-60' : ''}`}
              onClick={() => toggleExercise(exercise.id)}
            >
              <button className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isDone ? 'text-teal-400' : 'text-slate-600 hover:text-cyan-400'}`}>
                {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-medium transition-all ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                    {exercise.name}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryColors[exercise.category] || 'bg-slate-500/20 text-slate-400'}`}>
                    {exercise.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{exercise.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" /> {exercise.duration}
                  </span>
                  {exercise.reps && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <RefreshCw className="w-3 h-3" /> {exercise.reps}
                    </span>
                  )}


                  {exercise.sets && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      {exercise.sets} sets
                    </span>
                  )}

                  <span className={`text-[10px] font-medium ${difficultyColors[exercise.difficulty]}`}>
                    {exercise.difficulty}
                  </span>
                </div>


                {exercise.injuryType && (
                  <div className="mt-1">
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      {exercise.injuryType}
                    </span>
                  </div>
                )}

              </div>

              <div className="shrink-0 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                {exercise.bodyPart}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
