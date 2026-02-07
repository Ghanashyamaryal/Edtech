// Client-side exports only
// Server components should import from '@/lib/supabase/server' directly
// Middleware should import from '@/lib/supabase/middleware' directly
export { createClient, supabase, AUTH_CONFIG } from './client';
