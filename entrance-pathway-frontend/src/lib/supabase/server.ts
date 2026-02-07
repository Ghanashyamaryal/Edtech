import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

// Server client for App Router - uses cookies for auth
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

// Admin client - uses service role key for admin operations
// IMPORTANT: Only use in server actions, never expose to client
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Get current user from session
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

// Check if current user is admin
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  if (user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }

  return user;
}

// Check if current user is mentor or admin
export async function requireMentorOrAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  if (user.role !== 'mentor' && user.role !== 'admin') {
    throw new Error('Forbidden: Mentor or admin access required');
  }

  return user;
}

// Check if current user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized: Not authenticated');
  }

  return user;
}
