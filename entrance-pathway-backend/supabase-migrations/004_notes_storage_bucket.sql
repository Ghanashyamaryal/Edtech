-- Storage bucket setup for notes
-- Run this in Supabase SQL Editor AFTER the notes table migration

-- Create storage bucket for notes (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notes',
  'notes',
  true,
  52428800, -- 50MB max file size
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp'];

-- Storage policies for notes bucket

-- Allow public read access to all files
CREATE POLICY "Public can view notes files"
ON storage.objects FOR SELECT
USING (bucket_id = 'notes');

-- Allow authenticated admins and mentors to upload files
CREATE POLICY "Admins and mentors can upload notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notes'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'mentor')
  )
);

-- Allow admins and mentors to update their own files
CREATE POLICY "Admins and mentors can update notes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'notes'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'mentor')
  )
);

-- Allow admins to delete any file
CREATE POLICY "Admins can delete notes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'notes'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- IMPORTANT: File path structure
-- notes/{subject_id}/{note_type}/{filename}
-- Example: notes/abc-123/question_paper/2024-model-set-1.pdf
