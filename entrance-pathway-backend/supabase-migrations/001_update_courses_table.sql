-- =====================================================
-- SUPABASE MIGRATION: Update Courses Table
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Add new columns to the courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS discounted_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS duration_hours INTEGER,
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;

-- Create index for faster queries on published courses
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- =====================================================
-- SAMPLE DATA: Insert sample courses for testing
-- You can modify or remove this section
-- =====================================================

-- First, let's check if we need to create a sample instructor
-- You should replace this with your actual admin/instructor user ID
DO $$
DECLARE
    instructor_id UUID;
BEGIN
    -- Get an existing admin/mentor user or use a placeholder
    SELECT id INTO instructor_id FROM users WHERE role IN ('admin', 'mentor') LIMIT 1;

    -- If no instructor exists, we'll skip inserting sample courses
    IF instructor_id IS NULL THEN
        RAISE NOTICE 'No instructor found. Please create an admin or mentor user first.';
        RETURN;
    END IF;

    -- Insert BSc CSIT course if it doesn't exist
    INSERT INTO courses (
        title, full_name, description, slug, price, discounted_price,
        duration_hours, student_count, rating, reviews_count, features,
        is_bestseller, is_published, instructor_id
    )
    SELECT
        'BSc CSIT',
        'Bachelor in Computer Science & Information Technology',
        'Complete preparation for TU BSc CSIT entrance examination with comprehensive coverage of all subjects.',
        'bsc-csit',
        15000,
        9999,
        180,
        4500,
        4.9,
        1245,
        '["Mathematics (Calculus, Algebra, Statistics)", "Computer Science Fundamentals", "English & Communication", "Logical Reasoning"]'::jsonb,
        true,
        true,
        instructor_id
    WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'bsc-csit');

    -- Insert BIT course if it doesn't exist
    INSERT INTO courses (
        title, full_name, description, slug, price, discounted_price,
        duration_hours, student_count, rating, reviews_count, features,
        is_bestseller, is_published, instructor_id
    )
    SELECT
        'BIT',
        'Bachelor in Information Technology',
        'Comprehensive BIT entrance preparation covering PU and other university patterns.',
        'bit',
        12000,
        7999,
        160,
        2800,
        4.8,
        876,
        '["Mathematics", "Computer Science", "English", "General Knowledge"]'::jsonb,
        false,
        true,
        instructor_id
    WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'bit');

    -- Insert BCA course if it doesn't exist
    INSERT INTO courses (
        title, full_name, description, slug, price, discounted_price,
        duration_hours, student_count, rating, reviews_count, features,
        is_bestseller, is_published, instructor_id
    )
    SELECT
        'BCA',
        'Bachelor in Computer Application',
        'Expert-curated BCA entrance preparation with focus on practical problem-solving.',
        'bca',
        10000,
        6999,
        120,
        2100,
        4.8,
        654,
        '["Mathematics", "English", "Computer Awareness", "Reasoning & Aptitude"]'::jsonb,
        false,
        true,
        instructor_id
    WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'bca');

    -- Insert BIM course if it doesn't exist
    INSERT INTO courses (
        title, full_name, description, slug, price, discounted_price,
        duration_hours, student_count, rating, reviews_count, features,
        is_bestseller, is_published, instructor_id
    )
    SELECT
        'BIM',
        'Bachelor in Information Management',
        'Targeted BIM entrance preparation with management and IT fundamentals.',
        'bim',
        10000,
        6999,
        120,
        1200,
        4.7,
        432,
        '["Mathematics", "English", "General Knowledge", "Computer & Management"]'::jsonb,
        false,
        true,
        instructor_id
    WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'bim');

    RAISE NOTICE 'Sample courses inserted successfully!';
END $$;

-- =====================================================
-- VERIFY: Check the courses table structure
-- =====================================================
-- Run this to verify the table was updated correctly:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses';
