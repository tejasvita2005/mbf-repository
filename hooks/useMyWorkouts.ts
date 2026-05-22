'use client';

import { useEffect, useState } from 'react';

export type Workout = {
  id: string;
  name: string;
  description: string;
  exercises: string[];
  difficulty: string;
  duration: number;
};

const STORAGE_BASE_KEY = 'mbf-workouts';

function getStorageKey() {
  return STORAGE_BASE_KEY;
}

export function useMyWorkouts(userId?: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const storageKey = getStorageKey();

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const raw = localStorage.getItem(storageKey);
      setWorkouts(raw ? JSON.parse(raw) : []);
    } catch (error) {
      console.error('Failed to load workouts from localStorage', error);
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  const persistWorkouts = (items: Workout[]) => {
    setWorkouts(items);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to persist workouts to localStorage', error);
    }
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => {
      const next = [...prev, workout];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (error) {
          console.error('Failed to persist workouts to localStorage', error);
        }
      }
      return next;
    });
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(prev => {
      const next = prev.map(w => (w.id === workout.id ? workout : w));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (error) {
          console.error('Failed to persist workouts to localStorage', error);
        }
      }
      return next;
    });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => {
      const next = prev.filter(w => w.id !== id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (error) {
          console.error('Failed to persist workouts to localStorage', error);
        }
      }
      return next;
    });
  };

  return {
    workouts,
    isLoading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    persistWorkouts,
  };
}
