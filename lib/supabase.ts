import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  updated_at: string;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
  note: string;
  created_at: string;
};

export type FeedbackEntry = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type ExerciseCompletion = {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_at: string;
};
