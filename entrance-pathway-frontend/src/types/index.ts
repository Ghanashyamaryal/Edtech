// User Types
export interface User {
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

export type UserRole = 'student' | 'mentor' | 'admin';

// Auth Types
export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    role?: UserRole;
  };
  created_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SocialProvider {
  provider: 'google' | 'facebook';
  options?: {
    redirectTo?: string;
    scopes?: string;
  };
}

export interface PasswordResetData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

export interface PhoneOTPData {
  phone: string;
}

export interface VerifyOTPData {
  phone: string;
  token: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail_url?: string;
  price: number;
  is_published: boolean;
  instructor_id: string;
  instructor?: User;
  chapters?: Chapter[];
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  position: number;
  is_published: boolean;
  course_id: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration?: number;
  position: number;
  is_published: boolean;
  is_free: boolean;
  chapter_id: string;
}

// Question Bank Types
export interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[];
  correct_answer: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  subject_id: string;
  topic_id?: string;
  created_at: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

// Subject and Topic Types
export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  subject_id: string;
}

// Exam Types
export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  is_published: boolean;
  questions?: ExamQuestion[];
  created_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  question?: Question;
  marks: number;
  position: number;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  score?: number;
  answers?: ExamAnswer[];
}

export interface ExamAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
}

// Live Class Types
export interface LiveClass {
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
}

// Enrollment Types
export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress: number;
}

// Progress Types
export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  watched_duration: number;
  completed_at?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
