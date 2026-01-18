// Database row types (matching Supabase table structures)

export type UserRole = 'student' | 'mentor' | 'admin';

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CourseRow {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail_url?: string;
  price: number;
  is_published: boolean;
  instructor_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChapterRow {
  id: string;
  title: string;
  description?: string;
  position: number;
  is_published: boolean;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export interface LessonRow {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration?: number;
  position: number;
  is_published: boolean;
  is_free: boolean;
  chapter_id: string;
  created_at: string;
  updated_at: string;
}

export interface SubjectRow {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface TopicRow {
  id: string;
  name: string;
  description?: string;
  subject_id: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionRow {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: QuestionOptionRow[];
  correct_answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject_id: string;
  topic_id?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionOptionRow {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface ExamRow {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamQuestionRow {
  id: string;
  exam_id: string;
  question_id: string;
  marks: number;
  position: number;
}

export interface ExamAttemptRow {
  id: string;
  exam_id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  score?: number;
}

export interface ExamAnswerRow {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
}

export interface EnrollmentRow {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress: number;
}

export interface LessonProgressRow {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  watched_duration: number;
  completed_at?: string;
}

export interface LiveClassRow {
  id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_meeting_id?: string;
  zoom_join_url?: string;
  recording_url?: string;
  instructor_id: string;
  course_id?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}
