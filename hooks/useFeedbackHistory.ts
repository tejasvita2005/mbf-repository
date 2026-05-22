import { useState, useEffect } from 'react';

export type Feedback = {
  id: string;
  painLevel: number;
  recoveryRating: number;
  difficulty: string;
  comments: string;
  timestamp: number;
};

const FEEDBACK_STORAGE_KEY = 'mbf_feedback_history';

export function useFeedbackHistory() {
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = () => {
      try {
        const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        if (stored) {
          setFeedbackHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading feedback history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, []);

  // Get average pain level from recent feedback
  const getAveragePainLevel = (days: number = 7): number => {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    
    const recentFeedback = feedbackHistory.filter(f => f.timestamp >= cutoff);
    if (recentFeedback.length === 0) return 5; // default middle value
    
    const sum = recentFeedback.reduce((acc, f) => acc + f.painLevel, 0);
    return Math.round(sum / recentFeedback.length);
  };

  // Get average recovery rating from recent feedback
  const getAverageRecoveryRating = (days: number = 7): number => {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    
    const recentFeedback = feedbackHistory.filter(f => f.timestamp >= cutoff);
    if (recentFeedback.length === 0) return 5; // default middle value
    
    const sum = recentFeedback.reduce((acc, f) => acc + f.recoveryRating, 0);
    return Math.round(sum / recentFeedback.length);
  };

  // Get the most recent feedback
  const getLatestFeedback = (): Feedback | null => {
    return feedbackHistory.length > 0 ? feedbackHistory[0] : null;
  };

  // Get recommended difficulty based on feedback
  const getRecommendedDifficulty = (): string => {
    const avgPain = getAveragePainLevel();
    const avgRecovery = getAverageRecoveryRating();

    // High pain = easier exercises
    if (avgPain >= 7) {
      return 'Easy';
    }

    // Better recovery = moderate difficulty increase
    if (avgRecovery >= 7 && avgPain <= 3) {
      return 'Hard';
    }

    // Default to medium
    return 'Medium';
  };

  return {
    feedbackHistory,
    isLoading,
    getAveragePainLevel,
    getAverageRecoveryRating,
    getLatestFeedback,
    getRecommendedDifficulty,
  };
}
