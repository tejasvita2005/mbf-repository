'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { useMyWorkouts, type Workout } from '@/hooks/useMyWorkouts';
import { Dumbbell, Plus, Edit2, Trash2, Clock, CircleAlert as AlertCircle, Loader2, Save } from 'lucide-react';

export default function WorkoutsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { workouts, isLoading, addWorkout, updateWorkout, deleteWorkout } = useMyWorkouts(user?.id);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: '',
    difficulty: 'Beginner',
    duration: 30,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);


  const handleCreateWorkout = () => {
    if (!formData.name || !formData.description || !formData.exercises) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        exercises: formData.exercises.split(',').map(e => e.trim()),
        difficulty: formData.difficulty,
        duration: formData.duration,
      };

      addWorkout(newWorkout);
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Unable to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateWorkout = () => {
    if (!editingWorkout) return;

    setIsSaving(true);
    setError('');

    try {
      const updatedWorkout: Workout = {
        ...editingWorkout,
        name: formData.name,
        description: formData.description,
        exercises: formData.exercises.split(',').map(e => e.trim()),
        difficulty: formData.difficulty,
        duration: formData.duration,
      };

      updateWorkout(updatedWorkout);
      setShowModal(false);
      setEditingWorkout(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Unable to update workout. Please try again.');
      setShowModal(false);
      setEditingWorkout(null);
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWorkout = (id: string) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    setError('');

    try {
      deleteWorkout(id);
    } catch (err: any) {
      setError(err.message || 'Unable to delete workout. Please try again.');
    }
  };

  const openCreateModal = () => {
    setEditingWorkout(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (workout: Workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      description: workout.description,
      exercises: workout.exercises.join(', '),
      difficulty: workout.difficulty,
      duration: workout.duration,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      exercises: '',
      difficulty: 'Beginner',
      duration: 30,
    });
  };

  const difficultyColors: Record<string, string> = {
    'Beginner': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500/20',
  };

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-[#050d1a] bg-grid-pattern">
      <Sidebar activeSection="workouts" />

      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center glow-cyan">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Workouts</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your personalized workout plans</p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all glow-cyan"
            >
              <Plus className="w-4 h-4" />
              Create Workout
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm animate-slide-down">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Loading workouts...</p>
            </div>
          ) : workouts.length === 0 ? (
            <div className="glass rounded-2xl border border-white/7 p-12 text-center animate-fade-in-up">
              <Dumbbell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No workouts yet</h3>
              <p className="text-slate-400 text-sm mb-6">Create your first workout plan to get started</p>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all glow-cyan mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Workout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
              {workouts.map((workout, index) => (
                <div
                  key={workout.id}
                  className="glass rounded-2xl border border-white/7 p-6 card-hover stagger-${index + 1}"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{workout.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{workout.description}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColors[workout.difficulty]}`}>
                      {workout.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Clock className="w-3 h-3" />
                    <span>{workout.duration} minutes</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Exercises:</p>
                    <div className="flex flex-wrap gap-1">
                      {workout.exercises.slice(0, 3).map((exercise, i) => (
                        <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-300">
                          {exercise}
                        </span>
                      ))}
                      {workout.exercises.length > 3 && (
                        <span className="text-[10px] text-slate-500">+{workout.exercises.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => openEditModal(workout)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-lg transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-scale-in">
          <div className="relative w-full max-w-lg glass rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-semibold text-white">
                {editingWorkout ? 'Edit Workout' : 'Create Workout'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Workout Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Recovery"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your workout plan"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Exercises (comma-separated)</label>
                <input
                  type="text"
                  value={formData.exercises}
                  onChange={e => setFormData({ ...formData, exercises: e.target.value })}
                  placeholder="e.g., Squat, Push-up, Plank"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="5"
                    max="180"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingWorkout(null);
                  resetForm();
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingWorkout ? handleUpdateWorkout : handleCreateWorkout}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingWorkout ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
