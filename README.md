# Entrance Pathway - IT Entrance Exam Preparation Platform

A comprehensive EdTech platform for IT entrance exam preparation in Nepal.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)
- **GraphQL Client**: Apollo Client
- **UI Components**: Radix UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

### Live Classes
- Zoom SDK for live video sessions
- Supabase Storage for recorded videos

## Project Structure

```
edtech/
├── entrance-pathway-frontend/     # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   ├── components/            # React components
│   │   │   └── ui/                # Reusable UI components
│   │   ├── graphql/               # GraphQL queries, mutations
│   │   │   ├── queries/
│   │   │   ├── mutations/
│   │   │   └── generated/         # Auto-generated types
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Library configurations
│   │   │   ├── apollo/            # Apollo Client setup
│   │   │   ├── react-query/       # React Query setup
│   │   │   └── supabase/          # Supabase client
│   │   ├── types/                 # TypeScript type definitions
│   │   └── utils/                 # Utility functions & validation
│   └── ...config files
│
├── entrance-pathway-backend/      # Express + GraphQL backend
│   ├── src/
│   │   ├── config/                # Environment & Supabase config
│   │   ├── middleware/            # Express middleware (auth)
│   │   ├── models/                # Database types
│   │   ├── resolvers/             # GraphQL resolvers
│   │   ├── schema/                # GraphQL schema definitions
│   │   └── utils/                 # Helper functions
│   └── ...config files
│
└── README.md                      # This file
```

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account (for database and auth)
- Zoom SDK credentials (for live classes)

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd entrance-pathway-frontend
npm install

# Install backend dependencies
cd ../entrance-pathway-backend
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)

2. Create the following tables in your Supabase database:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  instructor_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapters
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  position INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration INT,
  position INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT FALSE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INT DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  watched_duration INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Subjects
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  subject_id UUID REFERENCES subjects(id),
  topic_id UUID REFERENCES topics(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  total_marks INT NOT NULL,
  passing_marks INT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Questions (junction table)
CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  marks INT NOT NULL,
  position INT NOT NULL
);

-- Exam Attempts
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id),
  user_id UUID REFERENCES users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INT
);

-- Exam Answers
CREATE TABLE exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL
);

-- Live Classes
CREATE TABLE live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL,
  zoom_meeting_id TEXT,
  zoom_join_url TEXT,
  recording_url TEXT,
  instructor_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_live_classes_updated_at BEFORE UPDATE ON live_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

3. Set up Row Level Security (RLS) policies as needed

4. Create a trigger to automatically create a user profile when a new auth user signs up:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 3. Environment Variables

#### Frontend (.env.local)
```bash
cd entrance-pathway-frontend
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

#### Backend (.env)
```bash
cd entrance-pathway-backend
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Run the Development Servers

```bash
# Terminal 1 - Backend
cd entrance-pathway-backend
npm run dev

# Terminal 2 - Frontend
cd entrance-pathway-frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`
The GraphQL API will be available at `http://localhost:4000/graphql`

## GraphQL Codegen

To generate TypeScript types from your GraphQL schema:

```bash
cd entrance-pathway-frontend
npm run codegen
```

## Features

- **User Authentication**: Sign up, login, password reset via Supabase Auth
- **Course Management**: Create, edit, publish courses with chapters and lessons
- **Video Lessons**: Upload and stream video content
- **Question Bank**: Create and manage practice questions
- **Practice Exams**: Timed exams with automatic scoring
- **Progress Tracking**: Track lesson completion and exam performance
- **Live Classes**: Zoom integration for live video sessions
- **Admin Dashboard**: Manage users, courses, and content

## API Documentation

Access the GraphQL Playground at `http://localhost:4000/graphql` to explore the API.

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import the `entrance-pathway-frontend` directory in Vercel
3. Add environment variables
4. Deploy

### Backend (Railway/Render)
1. Push your code to GitHub
2. Create a new project and select the `entrance-pathway-backend` directory
3. Add environment variables
4. Deploy

## License

Private - All rights reserved
