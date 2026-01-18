import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const supabase = createClient();

// Auth configuration constants
export const AUTH_CONFIG = {
  // Redirect URLs for OAuth
  redirectUrls: {
    login: '/auth/login',
    callback: '/auth/callback',
    dashboard: '/dashboard',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
  },
  // Social providers
  socialProviders: ['google', 'facebook'] as const,
  // Session settings
  session: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
} as const;
