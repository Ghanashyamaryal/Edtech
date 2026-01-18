import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'mentor'], {
    required_error: 'Please select a role',
  }),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  avatarUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const phoneOtpSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),
});

export const verifyOtpSchema = z.object({
  phone: z.string(),
  token: z.string().length(6, 'OTP must be 6 digits'),
});

// Course Schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price cannot be negative'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
});

export const createChapterSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
});

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  videoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isFree: z.boolean().default(false),
});

// Question Schemas
export const createQuestionSchema = z.object({
  questionText: z.string().min(10, 'Question must be at least 10 characters'),
  questionType: z.enum(['multiple_choice', 'true_false', 'short_answer']),
  options: z.array(z.object({
    text: z.string().min(1, 'Option text is required'),
    isCorrect: z.boolean(),
  })).min(2, 'At least 2 options are required'),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  subjectId: z.string().min(1, 'Subject is required'),
  topicId: z.string().optional(),
});

// Exam Schemas
export const createExamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  durationMinutes: z.number().min(5, 'Duration must be at least 5 minutes'),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  passingMarks: z.number().min(1, 'Passing marks must be at least 1'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type PhoneOtpFormData = z.infer<typeof phoneOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type CreateChapterFormData = z.infer<typeof createChapterSchema>;
export type CreateLessonFormData = z.infer<typeof createLessonSchema>;
export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;
export type CreateExamFormData = z.infer<typeof createExamSchema>;
