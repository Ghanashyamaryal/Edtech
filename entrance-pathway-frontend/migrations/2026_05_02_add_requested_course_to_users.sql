-- Adds the course a user requested at signup so admins can see what to enroll them in
-- Run this in the Supabase SQL editor (or via supabase db push)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS requested_course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_reference text;

CREATE INDEX IF NOT EXISTS idx_users_requested_course_id ON public.users(requested_course_id);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON public.users(is_verified);
