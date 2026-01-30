-- Migration: Add notes table and course-subject linking
-- Run this in Supabase SQL Editor

-- Create note_type enum
DO $$ BEGIN
  CREATE TYPE note_type AS ENUM ('notes', 'question_paper', 'solution', 'syllabus', 'formula_sheet');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  file_type VARCHAR(50) NOT NULL DEFAULT 'application/pdf',
  note_type note_type NOT NULL DEFAULT 'notes',
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  year INTEGER, -- For question papers (e.g., 2023, 2024)
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  download_count INTEGER NOT NULL DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create course_subjects junction table (link courses to subjects for curriculum)
CREATE TABLE IF NOT EXISTS course_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, subject_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_topic_id ON notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_note_type ON notes(note_type);
CREATE INDEX IF NOT EXISTS idx_notes_is_published ON notes(is_published);
CREATE INDEX IF NOT EXISTS idx_notes_is_premium ON notes(is_premium);
CREATE INDEX IF NOT EXISTS idx_notes_uploaded_by ON notes(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_course_subjects_course_id ON course_subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_course_subjects_subject_id ON course_subjects(subject_id);

-- Add updated_at trigger for notes
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notes_updated_at ON notes;
CREATE TRIGGER trigger_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_notes_updated_at();

-- RLS Policies for notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Anyone can view published notes
CREATE POLICY "Public can view published notes"
  ON notes FOR SELECT
  USING (is_published = true);

-- Admins and mentors can view all notes
CREATE POLICY "Admins can view all notes"
  ON notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'mentor')
    )
  );

-- Admins and mentors can insert notes
CREATE POLICY "Admins can insert notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'mentor')
    )
  );

-- Admins can update any note, mentors can update their own
CREATE POLICY "Admins can update notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
    OR uploaded_by = auth.uid()
  );

-- Only admins can delete notes
CREATE POLICY "Only admins can delete notes"
  ON notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for course_subjects
ALTER TABLE course_subjects ENABLE ROW LEVEL SECURITY;

-- Anyone can view course subjects
CREATE POLICY "Public can view course subjects"
  ON course_subjects FOR SELECT
  USING (true);

-- Only admins can manage course subjects
CREATE POLICY "Admins can manage course subjects"
  ON course_subjects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create storage bucket for notes (run separately in Supabase Dashboard > Storage)
-- Or use the API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

COMMENT ON TABLE notes IS 'Stores study materials like notes, question papers, solutions organized by subject';
COMMENT ON TABLE course_subjects IS 'Links courses to their relevant subjects for curriculum mapping';
