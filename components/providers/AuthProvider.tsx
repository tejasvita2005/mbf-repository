'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '@/lib/supabase';

export const DEMO_MODE = true; // Set to false to restore normal Supabase authentication.
const DEMO_USER_ID = 'demo-user-0001';
const DEMO_USER = {
  id: DEMO_USER_ID,
  app_metadata: {},
  user_metadata: { first_name: 'Alex', last_name: 'Taylor' },
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@mbfitness.com',
  phone: null,
  confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  identities: [],
  factor_totp_enabled: false,
  email_confirmed_at: new Date().toISOString(),
  phone_confirmed_at: null,
  raw_user_meta_data: {},
  updated_at: new Date().toISOString(),
  instance_id: '',
} as unknown as User;

const DEMO_SESSION = {
  access_token: 'demo-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'demo-refresh-token',
  provider_token: null,
  provider_refresh_token: null,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: DEMO_USER,
} as Session;

const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  first_name: 'Alex',
  last_name: 'Taylor',
  avatar_url: '',
  updated_at: new Date().toISOString(),
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  };

  const refreshProfile = async () => {
    if (user && !DEMO_MODE) await fetchProfile(user.id);
  };

  const signOut = async () => {
    if (!DEMO_MODE) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    if (DEMO_MODE) {
      setSession(DEMO_SESSION);
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => { await fetchProfile(session.user.id); })();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
