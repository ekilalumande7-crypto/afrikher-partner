import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Profile } from '@/src/types/partner';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  role: 'partner' | 'pending_partner' | 'rejected_partner' | null;
  isValidated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'partner' | 'pending_partner' | 'rejected_partner' | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    // Real Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Extract role and set it
      const userRole = data?.role as 'partner' | 'pending_partner' | 'rejected_partner' | null;
      setRole(userRole);

      // Determine if validated
      if (userRole === 'partner') {
        setIsValidated(true);
      } else if (userRole === 'pending_partner') {
        setIsValidated(false);
      } else if (userRole === 'rejected_partner') {
        setIsValidated(false);
      }

      // Also try to get partner-specific data
      try {
        const { data: partnerData } = await supabase
          .from('partners')
          .select('*')
          .eq('id', userId)
          .single();
        if (partnerData) {
          setProfile({ ...data, ...partnerData } as Profile);
        } else {
          setProfile(data);
        }
      } catch {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setIsValidated(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, role, isValidated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
