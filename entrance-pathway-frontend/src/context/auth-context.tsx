'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User as SupabaseUser, Session, AuthChangeEvent, Provider } from '@supabase/supabase-js';
import { supabase, AUTH_CONFIG } from '@/lib/supabase';
import type { User, UserRole } from '@/types';

interface AuthContextValue {
  // State
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  signInWithProvider: (provider: Provider) => Promise<{ error: Error | null }>;

  // Password recovery
  resetPasswordRequest: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;

  // Phone OTP (optional)
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;

  // Email verification
  resendVerificationEmail: () => Promise<{ error: Error | null }>;

  // Profile management
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: Error | null }>;

  // Utilities
  refreshSession: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as User;
  }, []);

  // Handle auth state changes
  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setSupabaseUser(initialSession.user);
          const profile = await fetchUserProfile(initialSession.user.id);
          if (isMounted) {
            setUser(profile);
          }
        }
      } catch (error) {
        // Ignore abort errors - these happen during navigation/unmount
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!isMounted) return;

        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const profile = await fetchUserProfile(currentSession.user.id);
          if (isMounted) {
            setUser(profile);
          }
        } else {
          setUser(null);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Sign up with email/password
  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}${AUTH_CONFIG.redirectUrls.callback}`,
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Sign in with social provider (Google, Facebook)
  const signInWithProvider = useCallback(async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${AUTH_CONFIG.redirectUrls.callback}`,
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Request password reset
  const resetPasswordRequest = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${AUTH_CONFIG.redirectUrls.resetPassword}`,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Update password (after reset)
  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Sign in with phone OTP
  const signInWithOtp = useCallback(async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Verify phone OTP
  const verifyOtp = useCallback(async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    try {
      if (!supabaseUser?.email) {
        return { error: new Error('No email found') };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: supabaseUser.email,
        options: {
          emailRedirectTo: `${window.location.origin}${AUTH_CONFIG.redirectUrls.callback}`,
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [supabaseUser?.email]);

  // Update user profile in database
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      if (!supabaseUser?.id) {
        return { error: new Error('Not authenticated') };
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', supabaseUser.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      // Update local state
      setUser((prev) => (prev ? { ...prev, ...data } : null));

      // Also update Supabase auth metadata
      await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          avatar_url: data.avatar_url,
        },
      });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [supabaseUser?.id]);

  // Upload avatar to Supabase Storage
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      if (!supabaseUser?.id) {
        return { url: null, error: new Error('Not authenticated') };
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${supabaseUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { url: null, error: new Error(uploadError.message) };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error as Error };
    }
  }, [supabaseUser?.id]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      if (newSession) {
        setSession(newSession);
        setSupabaseUser(newSession.user);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, []);

  // Get access token
  const getAccessToken = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    return currentSession?.access_token ?? null;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      supabaseUser,
      session,
      isLoading,
      // User is authenticated if they have a valid Supabase session
      // The user profile may still be loading or missing, but they're still logged in
      isAuthenticated: !!session,
      signIn,
      signUp,
      signOut,
      signInWithProvider,
      resetPasswordRequest,
      updatePassword,
      signInWithOtp,
      verifyOtp,
      resendVerificationEmail,
      updateProfile,
      uploadAvatar,
      refreshSession,
      getAccessToken,
    }),
    [
      user,
      supabaseUser,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      signInWithProvider,
      resetPasswordRequest,
      updatePassword,
      signInWithOtp,
      verifyOtp,
      resendVerificationEmail,
      updateProfile,
      uploadAvatar,
      refreshSession,
      getAccessToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Role-based hook
export function useRole() {
  const { user, isAuthenticated } = useAuth();

  return {
    role: user?.role ?? null,
    isStudent: user?.role === 'student',
    isMentor: user?.role === 'mentor',
    isAdmin: user?.role === 'admin',
    isAuthenticated,
  };
}

// Require auth hook - throws if not authenticated
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Require role hook
export function useRequireRole(allowedRoles: UserRole[], redirectTo?: string) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role) && redirectTo) {
        window.location.href = redirectTo;
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo]);

  return {
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    isLoading,
  };
}
