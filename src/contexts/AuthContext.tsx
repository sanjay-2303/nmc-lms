
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Define types based on our DB schema
export type AppRole = 'admin' | 'instructor' | 'student';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  // Add other profile fields if any
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  isRole: (role: AppRole) => boolean;
  isAnyRole: (roles: AppRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth event:", _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setProfile(null);
        } else {
          setProfile(profileData as Profile);
        }

        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          setRoles([]);
        } else {
          setRoles(rolesData.map((r: any) => r.role as AppRole));
        }
      } else {
        setProfile(null);
        setRoles([]);
      }
    };

    fetchUserData();
  }, [user]);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      throw error;
    }
    // Auth state change listener will handle setting user, session, profile, roles
    console.log("Sign in successful", data);
    setLoading(false);
    return data;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName, // This goes into raw_user_meta_data for the trigger
        },
      },
    });
    if (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      throw error;
    }
    // User will need to confirm email if enabled.
    // Auth state change listener and triggers will handle profile and role creation.
    console.log("Sign up successful, waiting for email confirmation if enabled.", data);
    setLoading(false);
    return data;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setRoles([]);
    setLoading(false);
    navigate('/'); // Navigate to home page after sign out
  };

  const isRole = (role: AppRole): boolean => {
    return roles.includes(role);
  }

  const isAnyRole = (checkRoles: AppRole[]): boolean => {
    return checkRoles.some(role => roles.includes(role));
  }

  const value = {
    session,
    user,
    profile,
    roles,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isRole,
    isAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
