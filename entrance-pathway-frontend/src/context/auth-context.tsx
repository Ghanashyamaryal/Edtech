'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

    // Get initial session using getUser() for server-side validation
    const initializeAuth = async () => {
      try {
        const { data: { user: validatedUser }, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !validatedUser) {
          // No valid session - clear any stale state
          setSession(null);
          setSupabaseUser(null);
          setUser(null);
          return;
        }

        // User is validated, now get the session for token access
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!isMounted) return;

        setSession(currentSession);
        setSupabaseUser(validatedUser);
        const profile = await fetchUserProfile(validatedUser.id);
        if (isMounted) {
          setUser(profile);
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

        // Handle sign out first
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
          setSession(null);
          return;
        }

        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          let profile = await fetchUserProfile(currentSession.user.id);

          // Create profile if it doesn't exist (e.g., after email confirmation)
          // Only auto-create on SIGNED_IN — not TOKEN_REFRESHED, which fires
          // after updateUser() calls and can race with profile fetches
          if (!profile && event === 'SIGNED_IN') {
            const meta = currentSession.user.user_metadata;
            // Only allow 'student' or 'mentor' roles during auto-creation
            // Never trust metadata for admin role assignment
            const requestedRole = meta?.role;
            const safeRole = (requestedRole === 'student' || requestedRole === 'mentor')
              ? requestedRole
              : 'student';
            const { error } = await supabase.from('users').insert({
              id: currentSession.user.id,
              email: currentSession.user.email,
              full_name: meta?.full_name || meta?.name || 'User',
              avatar_url: meta?.avatar_url || meta?.picture,
              role: safeRole,
              is_verified: false,
            });
            if (!error) {
              profile = await fetchUserProfile(currentSession.user.id);
            }
          }

          if (isMounted) {
            setUser(profile);
          }
        } else {
          setUser(null);
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

      // Only include fields that were actually provided to avoid nullifying existing values
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (data.full_name !== undefined) updateData.full_name = data.full_name;
      if (data.phone !== undefined) updateData.phone = data.phone || null;
      if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
      if (data.date_of_birth !== undefined) updateData.date_of_birth = data.date_of_birth || null;

      const { error, status, statusText } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', supabaseUser.id);

      if (error) {
        console.error('Profile update failed:', { error, status, statusText, updateData });
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
      const filePath = fileName;

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
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error || !newSession) {
        // Refresh token is invalid/expired - clear stale state
        setSession(null);
        setSupabaseUser(null);
        setUser(null);
        return;
      }
      setSession(newSession);
      setSupabaseUser(newSession.user);
    } catch (error) {
      console.error('Error refreshing session:', error);
      // Clear stale state on any error
      setSession(null);
      setSupabaseUser(null);
      setUser(null);
    }
  }, []);

  // Get access token (validates user server-side first)
  const getAccessToken = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
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

// Require auth hook - redirects if not authenticated
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
}

// Require role hook
export function useRequireRole(allowedRoles: UserRole[], redirectTo?: string) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated at all — redirect
    if (!isAuthenticated && redirectTo) {
      router.push(redirectTo);
      return;
    }

    // Authenticated but no profile found (missing from DB) — redirect
    if (isAuthenticated && !user && redirectTo) {
      router.push(redirectTo);
      return;
    }

    // Authenticated, profile loaded, but role doesn't match — redirect
    if (isAuthenticated && user && !allowedRoles.includes(user.role) && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo, router]);

  return {
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    isLoading,
  };
}
