'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, AlertCircle, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

const FEEDBACK_STORAGE_KEY = 'mbf_feedback_history';
const MAX_CHARS = 1000;

export type Feedback = {
  id: string;
  painLevel: number;
  recoveryRating: number;
  difficulty: string;
  comments: string;
  timestamp: number;
};

const prompts = [
  "How did today's exercises feel?",
  "Any areas of pain or discomfort?",
  "Progress you've noticed this week?",
  "Goals for your next session?",
];

export function FeedbackForm() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [recoveryRating, setRecoveryRating] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Load feedback from localStorage and Supabase on mount
  useEffect(() => {
    const loadFeedback = async () => {
      let storedHistory: Feedback[] = [];

      try {
        const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        if (stored) {
          storedHistory = JSON.parse(stored);
          setFeedbackHistory(storedHistory);
        }
      } catch (error) {
        console.error('Error loading feedback history:', error);
      }

      if (!user) return;

      console.log('FeedbackForm loadFeedback user:', {
        id: user.id,
        email: user.email,
        role: user.role,
      });

      try {
        const { data, error, status, statusText } = await supabase
          .from('feedback_entries')
          .select('id, content, pain_level, recovery_rating, difficulty, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('FeedbackForm load response:', {
          status,
          statusText,
          data,
          error,
        });

        if (error) {
          console.error('Error fetching saved feedback:', error);
          return;
        }

        if (!data) return;

        const savedFeedback = data.map((entry) => ({
          id: entry.id,
          painLevel: entry.pain_level ?? 5,
          recoveryRating: entry.recovery_rating ?? 5,
          difficulty: entry.difficulty ?? 'Medium',
          comments: entry.content ?? '',
          timestamp: entry.created_at ? new Date(entry.created_at).getTime() : Date.now(),
        }));

        const mergedFeedback = [...savedFeedback, ...storedHistory].reduce<Feedback[]>((result, item) => {
          if (!result.some((existing) => existing.id === item.id)) {
            result.push(item);
          }
          return result;
        }, []);

        if (mergedFeedback.length > 0) {
          setFeedbackHistory(mergedFeedback);
          localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(mergedFeedback));
        }
      } catch (error) {
        console.error('Error syncing feedback from Supabase:', error);
      }
    };

    loadFeedback();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!user) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (!content.trim()) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('saving');
    try {
      // Create new feedback entry
      const newFeedback: Feedback = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        painLevel,
        recoveryRating,
        difficulty,
        comments: content.trim(),
        timestamp: Date.now(),
      };

      const payload = {
        user_id: user.id,
        content: content.trim(),
        pain_level: painLevel,
        recovery_rating: recoveryRating,
        difficulty: difficulty,
      };

      console.log('FeedbackForm submit:', {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        payload,
      });

      // Save to Supabase
      const { data: insertData, error, status, statusText } = await supabase
        .from('feedback_entries')
        .insert(payload)
        .select();

      console.log('FeedbackForm insert response:', {
        status,
        statusText,
        data: insertData,
        error,
      });

      if (error) throw error;

      // Save to localStorage
      const updatedHistory = [newFeedback, ...feedbackHistory];
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedHistory));
      setFeedbackHistory(updatedHistory);

      setStatus('success');
      setContent('');
      setPainLevel(5);
      setRecoveryRating(5);
      setDifficulty('Medium');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('FeedbackForm save exception:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const deleteFeedback = (id: string) => {
    const updatedHistory = feedbackHistory.filter(f => f.id !== id);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedHistory));
    setFeedbackHistory(updatedHistory);
  };

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;

  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-emerald-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRecoveryColor = (level: number) => {
    if (level <= 3) return 'text-red-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'text-emerald-400';
    if (diff === 'Medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Feedback Form */}
      <div className="glass rounded-2xl border border-white/7 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <MessageSquare className="w-4.5 h-4.5 w-[18px] h-[18px] text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Wellness Feedback</h2>
            <p className="text-xs text-slate-500">Share your daily wellness notes</p>
          </div>
        </div>

        {/* Prompt suggestions */}
        <div className="mb-4">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Quick prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {prompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => setContent(prev => prev ? prev + ' ' + prompt : prompt)}
                className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-slate-400 hover:text-white rounded-lg transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sliders Section */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Pain Level */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">
                Pain Level: <span className={`font-bold ${getPainColor(painLevel)}`}>{painLevel}/10</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Recovery Rating */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">
                Recovery: <span className={`font-bold ${getRecoveryColor(recoveryRating)}`}>{recoveryRating}/10</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={recoveryRating}
                onChange={(e) => setRecoveryRating(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">Target Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500/30 transition-all"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Comments */}
          <div className="relative mb-3">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="How are you feeling today? Share your recovery progress, any pain levels, or notes for your therapist..."
              rows={4}
              maxLength={MAX_CHARS + 20}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/30 focus:bg-cyan-500/3 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {status === 'success' && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs animate-slide-down">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Feedback saved!
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs animate-slide-down">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {!content.trim() ? 'Please add comments' : 'Failed to save'}
                </div>
              )}
            </div>
            <span className={`text-xs ${isOverLimit ? 'text-red-400' : remaining < 50 ? 'text-yellow-400' : 'text-slate-500'}`}>
              {remaining} chars left
            </span>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isOverLimit || status === 'saving'}
            className="w-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 border border-cyan-500/20 hover:border-cyan-500/40 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-300 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            {status === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>

      {/* Feedback History Section */}
      {feedbackHistory.length > 0 && (
        <div className="glass rounded-2xl border border-white/7 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="w-4.5 h-4.5 w-[18px] h-[18px] text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Feedback History</h3>
                <p className="text-xs text-slate-500">{feedbackHistory.length} entries</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {feedbackHistory.map((feedback) => (
                <div key={feedback.id} className="bg-white/3 border border-white/5 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-wrap gap-2">
                      <div className="text-[10px] bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/30">
                        <span className="font-bold">Pain:</span> {feedback.painLevel}/10
                      </div>
                      <div className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                        <span className="font-bold">Recovery:</span> {feedback.recoveryRating}/10
                      </div>
                      <div className={`text-[10px] px-2 py-1 rounded border ${
                        feedback.difficulty === 'Easy' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : feedback.difficulty === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        <span className="font-bold">Difficulty:</span> {feedback.difficulty}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFeedback(feedback.id)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete feedback"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{feedback.comments}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(feedback.timestamp).toLocaleDateString()} at {new Date(feedback.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
