'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_MODE } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { useMyWorkouts } from '@/hooks/useMyWorkouts';
import { useFeedbackHistory } from '@/hooks/useFeedbackHistory';
import { Brain, Activity, Clock, RefreshCw, CircleAlert as AlertCircle, Sparkles, Loader2 } from 'lucide-react';

type Exercise = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  reps: string;
  sets: string;
  body_part: string;
  injury_type: string;
  duration: string;
};

const INJURY_TYPES = ['ACL', 'Shoulder', 'Back Pain', 'Knee Pain', 'Achilles', 'Meniscus'];
const FITNESS_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const RECOVERY_STAGES = ['Early', 'Mid', 'Late'];

const difficultyColors: Record<string, string> = {
  'Easy': 'text-emerald-400',
  'Medium': 'text-yellow-400',
  'Hard': 'text-red-400',
};

export default function AIRecommendationPage() {
  const { user, loading } = useAuth();
  const { addWorkout } = useMyWorkouts(user?.id);
  const { getAveragePainLevel, getRecommendedDifficulty, feedbackHistory } = useFeedbackHistory();
  const router = useRouter();
  const [injuryType, setInjuryType] = useState('');
  const [age, setAge] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [recoveryStage, setRecoveryStage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<Exercise[]>([]);
  const [recommendedWorkout, setRecommendedWorkout] = useState('');
  const [feedbackBased, setFeedbackBased] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Update pain level based on feedback history
  useEffect(() => {
    if (feedbackHistory.length > 0) {
      const avgPain = getAveragePainLevel(7); // Last 7 days
      setPainLevel(avgPain);
      setFeedbackBased(true);
    }
  }, [feedbackHistory, getAveragePainLevel]);

  const handleGenerateRecommendation = async () => {
    if (!injuryType || !age || !fitnessLevel || !recoveryStage) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const token = DEMO_MODE ? 'demo-token' : (await (await import('@/lib/supabase')).supabase.auth.getSession()).data.session?.access_token;

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://127.0.0.1:8000/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          injury_type: injuryType,
          age: parseInt(age),
          fitness_level: fitnessLevel,
          pain_level: painLevel,
          recovery_stage: recoveryStage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      const workoutName = data.recommended_workout || 'AI Rehabilitation Plan';
      const exercises = data.exercises || [];

      setRecommendedWorkout(workoutName);
      setRecommendations(exercises);
      saveGeneratedWorkout(workoutName, exercises);
    } catch (err: any) {
      setError('Unable to fetch remote recommendations. Showing local suggestions instead.');
      const workoutName = 'Custom Rehabilitation Plan';
      const exercises = getMockExercises(injuryType);

      setRecommendedWorkout(workoutName);
      setRecommendations(exercises);
      saveGeneratedWorkout(workoutName, exercises);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGeneratedWorkout = (workoutName: string, exercises: Exercise[]) => {
    const duration = exercises.reduce((sum, exercise) => {
      const parsed = parseInt(exercise.duration, 10);
      return sum + (Number.isNaN(parsed) ? 0 : parsed);
    }, 0) || 20;

    addWorkout({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: workoutName,
      description: `AI generated plan for ${injuryType} rehabilitation`,
      exercises: exercises.map(exercise => exercise.name),
      difficulty: fitnessLevel || 'Beginner',
      duration,
    });
  };

  const getMockExercises = (injury: string): Exercise[] => {
    // Adjust difficulty based on feedback history
    const recommendedDifficulty = getRecommendedDifficulty();
    
    const mockExercises: Exercise[] = [
      {
        id: 'ex1',
        name: 'Gentle Stretching',
        description: 'Light stretching to improve flexibility and reduce tension',
        difficulty: recommendedDifficulty === 'Easy' ? 'Easy' : 'Easy',
        reps: '3x30s hold',
        sets: '3',
        body_part: 'Full Body',
        injury_type: injury,
        duration: '5 min',
      },
      {
        id: 'ex2',
        name: 'Range of Motion',
        description: 'Controlled movements to maintain joint mobility',
        difficulty: recommendedDifficulty === 'Easy' ? 'Easy' : 'Easy',
        reps: '2x15 each',
        sets: '2',
        body_part: 'Affected Area',
        injury_type: injury,
        duration: '7 min',
      },
      {
        id: 'ex3',
        name: 'Strengthening',
        description: 'Light resistance exercises for muscle maintenance',
        difficulty: recommendedDifficulty,
        reps: recommendedDifficulty === 'Hard' ? '3x15' : '3x12',
        sets: '3',
        body_part: 'Target Muscle',
        injury_type: injury,
        duration: recommendedDifficulty === 'Hard' ? '12 min' : '10 min',
      },
      {
        id: 'ex4',
        name: 'Balance Training',
        description: 'Proprioception exercises to improve stability',
        difficulty: recommendedDifficulty,
        reps: '3x30s',
        sets: recommendedDifficulty === 'Hard' ? '4' : '3',
        body_part: 'Core/Legs',
        injury_type: injury,
        duration: recommendedDifficulty === 'Hard' ? '10 min' : '8 min',
      },
      {
        id: 'ex5',
        name: 'Cool Down',
        description: 'Gentle movements to aid recovery',
        difficulty: 'Easy',
        reps: 'As needed',
        sets: '1',
        body_part: 'Full Body',
        injury_type: injury,
        duration: '5 min',
      },
    ];
    return mockExercises;
  };

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-[#050d1a] bg-grid-pattern">
      <Sidebar activeSection="ai-recommendation" />

      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center glow-cyan">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Workout Recommendations</h1>
                <p className="text-slate-400 text-sm mt-1">Get personalized rehabilitation exercises based on your condition</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-1 animate-fade-in-up stagger-1">
              <div className="glass rounded-2xl border border-white/7 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Your Profile
                </h2>

                <div className="space-y-5">
                  {/* Injury Type */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Injury Type</label>
                    <select
                      value={injuryType}
                      onChange={e => setInjuryType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all cursor-pointer"
                    >
                      <option value="">Select injury type</option>
                      {INJURY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                    />
                  </div>

                  {/* Fitness Level */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Fitness Level</label>
                    <select
                      value={fitnessLevel}
                      onChange={e => setFitnessLevel(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all cursor-pointer"
                    >
                      <option value="">Select fitness level</option>
                      {FITNESS_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pain Level */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Pain Level: <span className="text-cyan-400 font-semibold">{painLevel}/10</span>
                      {feedbackBased && <span className="text-xs text-emerald-400 ml-2">(from feedback)</span>}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={painLevel}
                      onChange={e => setPainLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>1 (Mild)</span>
                      <span>10 (Severe)</span>
                    </div>
                  </div>

                  {/* Recovery Stage */}
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Recovery Stage</label>
                    <select
                      value={recoveryStage}
                      onChange={e => setRecoveryStage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all cursor-pointer"
                    >
                      <option value="">Select recovery stage</option>
                      {RECOVERY_STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm animate-slide-down">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleGenerateRecommendation}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 glow-cyan flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Recommendations
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2 animate-fade-in-up stagger-2">
              <div className="glass rounded-2xl border border-white/7 p-6 h-full">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recommended Exercises
                </h2>

                {recommendations.length === 0 && !isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Brain className="w-16 h-16 text-slate-600 mb-4" />
                    <p className="text-slate-400 text-sm">Fill in your profile details and click generate to get personalized exercise recommendations</p>
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
                    <p className="text-slate-400 text-sm">Analyzing your profile and generating recommendations...</p>
                  </div>
                ) : (
                  <>
                    {recommendedWorkout && (
                      <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-xs text-cyan-300 font-medium">Recommended Workout Plan</p>
                        <p className="text-lg font-bold text-gradient-cyan mt-1">{recommendedWorkout}</p>
                      </div>
                    )}

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {recommendations.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          className="p-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                              <span className="text-cyan-400 font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                  {exercise.name}
                                </h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyColors[exercise.difficulty] || 'text-slate-400'}`}>
                                  {exercise.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mb-2">{exercise.description}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {exercise.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" /> {exercise.reps}
                                </span>
                                <span>{exercise.sets} sets</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                                  {exercise.body_part}
                                </span>
                                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                                  {exercise.injury_type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
