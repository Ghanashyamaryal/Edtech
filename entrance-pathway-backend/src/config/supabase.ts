import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Admin client with service role key (for server-side operations)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Regular client with anon key (for client-authenticated operations)
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Create a client with user's JWT token
export function createUserClient(accessToken: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
