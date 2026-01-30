-- =====================================================
-- SUPABASE MIGRATION: Course-Exam Linking
-- Run this SQL in your Supabase SQL Editor
-- This creates the relationship between courses and exams
-- =====================================================

-- Add exam_type to exams table for categorization
ALTER TABLE exams
ADD COLUMN IF NOT EXISTS exam_type TEXT DEFAULT 'full_model';

-- exam_type values:
-- 'full_model'    - Complete model test for the course
-- 'subject'       - Subject-specific test
-- 'chapter'       - Chapter-based test
-- 'practice'      - Practice/quick quiz
-- 'previous_year' - Previous year questions

-- Add set_number for multiple sets of same exam type
ALTER TABLE exams
ADD COLUMN IF NOT EXISTS set_number INTEGER DEFAULT 1;

-- Create course_exams junction table (many-to-many)
-- This allows one exam to be used in multiple courses and vice versa
CREATE TABLE IF NOT EXISTS course_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, exam_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_course_exams_course_id ON course_exams(course_id);
CREATE INDEX IF NOT EXISTS idx_course_exams_exam_id ON course_exams(exam_id);
CREATE INDEX IF NOT EXISTS idx_exams_exam_type ON exams(exam_type);

-- =====================================================
-- ALTERNATIVE: Direct Foreign Key (if you want 1-to-many)
-- Uncomment below if you want each exam to belong to ONE course
-- =====================================================
-- ALTER TABLE exams
-- ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE SET NULL;
-- CREATE INDEX IF NOT EXISTS idx_exams_course_id ON exams(course_id);

-- =====================================================
-- VIEW: Course with exam counts by type
-- =====================================================
CREATE OR REPLACE VIEW course_exam_stats AS
SELECT
    c.id as course_id,
    c.title as course_title,
    COUNT(DISTINCT ce.exam_id) as total_exams,
    COUNT(DISTINCT CASE WHEN e.exam_type = 'full_model' THEN e.id END) as model_tests_count,
    COUNT(DISTINCT CASE WHEN e.exam_type = 'subject' THEN e.id END) as subject_tests_count,
    COUNT(DISTINCT CASE WHEN e.exam_type = 'chapter' THEN e.id END) as chapter_tests_count,
    COUNT(DISTINCT CASE WHEN e.exam_type = 'practice' THEN e.id END) as practice_tests_count
FROM courses c
LEFT JOIN course_exams ce ON c.id = ce.course_id
LEFT JOIN exams e ON ce.exam_id = e.id
GROUP BY c.id, c.title;

-- =====================================================
-- SAMPLE DATA: Link sample exams to courses
-- =====================================================
DO $$
DECLARE
    csit_course_id UUID;
    bit_course_id UUID;
    sample_exam_id UUID;
BEGIN
    -- Get course IDs
    SELECT id INTO csit_course_id FROM courses WHERE slug = 'bsc-csit' LIMIT 1;
    SELECT id INTO bit_course_id FROM courses WHERE slug = 'bit' LIMIT 1;

    IF csit_course_id IS NULL THEN
        RAISE NOTICE 'No courses found. Please create courses first.';
        RETURN;
    END IF;

    -- Create sample exams for BSc CSIT

    -- Full Model Test Set 1
    INSERT INTO exams (title, description, duration_minutes, total_marks, passing_marks, is_published, exam_type, set_number)
    VALUES (
        'BSc CSIT Full Model Test - Set 1',
        'Complete model test covering all subjects for BSc CSIT entrance',
        120,
        100,
        40,
        true,
        'full_model',
        1
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO sample_exam_id;

    IF sample_exam_id IS NOT NULL AND csit_course_id IS NOT NULL THEN
        INSERT INTO course_exams (course_id, exam_id, display_order, is_required)
        VALUES (csit_course_id, sample_exam_id, 1, true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Full Model Test Set 2
    INSERT INTO exams (title, description, duration_minutes, total_marks, passing_marks, is_published, exam_type, set_number)
    VALUES (
        'BSc CSIT Full Model Test - Set 2',
        'Second set of model test for BSc CSIT entrance',
        120,
        100,
        40,
        true,
        'full_model',
        2
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO sample_exam_id;

    IF sample_exam_id IS NOT NULL AND csit_course_id IS NOT NULL THEN
        INSERT INTO course_exams (course_id, exam_id, display_order, is_required)
        VALUES (csit_course_id, sample_exam_id, 2, false)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Mathematics Subject Test
    INSERT INTO exams (title, description, duration_minutes, total_marks, passing_marks, is_published, exam_type, set_number)
    VALUES (
        'Mathematics Subject Test',
        'Focused test on Mathematics topics for CSIT entrance',
        60,
        50,
        20,
        true,
        'subject',
        1
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO sample_exam_id;

    IF sample_exam_id IS NOT NULL AND csit_course_id IS NOT NULL THEN
        INSERT INTO course_exams (course_id, exam_id, display_order, is_required)
        VALUES (csit_course_id, sample_exam_id, 3, false)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Quick Practice Quiz
    INSERT INTO exams (title, description, duration_minutes, total_marks, passing_marks, is_published, exam_type, set_number)
    VALUES (
        'Quick Logical Reasoning Quiz',
        'Quick 15-minute quiz on logical reasoning',
        15,
        20,
        8,
        true,
        'practice',
        1
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO sample_exam_id;

    IF sample_exam_id IS NOT NULL AND csit_course_id IS NOT NULL THEN
        INSERT INTO course_exams (course_id, exam_id, display_order, is_required)
        VALUES (csit_course_id, sample_exam_id, 4, false)
        ON CONFLICT DO NOTHING;
    END IF;

    RAISE NOTICE 'Sample exams created and linked successfully!';
END $$;

-- =====================================================
-- VERIFY: Check the course_exams table
-- =====================================================
-- SELECT
--     c.title as course,
--     e.title as exam,
--     e.exam_type,
--     e.set_number,
--     ce.display_order
-- FROM course_exams ce
-- JOIN courses c ON ce.course_id = c.id
-- JOIN exams e ON ce.exam_id = e.id
-- ORDER BY c.title, ce.display_order;
