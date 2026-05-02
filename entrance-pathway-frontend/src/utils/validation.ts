import { z } from 'zod';

// Reusable field rules — keep validation consistent across signup, login, reset, profile.
const emailRule = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .email('Please enter a valid email address');

const strongPasswordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character')
  .refine((v) => !/\s/.test(v), 'Password cannot contain spaces');

const fullNameRule = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(
    /^[\p{L}][\p{L}\s.'-]*$/u,
    "Name can only contain letters, spaces, hyphens, dots, and apostrophes"
  );

const phoneRule = z
  .string()
  .trim()
  .min(10, 'Phone number must be at least 10 digits')
  .max(16, 'Phone number is too long')
  .regex(
    /^\+?[1-9]\d{9,14}$/,
    'Enter a valid phone number (e.g. +9779812345678 or 9812345678)'
  );

const otpRule = z
  .string()
  .trim()
  .length(6, 'Please enter the 6-digit code')
  .regex(/^\d{6}$/, 'Code must be 6 digits');

// Auth Schemas
export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  fullName: fullNameRule,
  email: emailRule,
  password: strongPasswordRule,
  confirmPassword: z.string(),
  role: z.enum(['student', 'mentor'], {
    required_error: 'Please select a role',
  }),
  phone: phoneRule.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Multi-step signup schemas
export const signupDetailsSchema = z.object({
  fullName: fullNameRule,
  email: emailRule,
  password: strongPasswordRule,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  phone: phoneRule,
  courseId: z.string().uuid('Please select a course').or(z.string().min(1, 'Please select a course')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const signupPaymentSchema = z.object({
  paymentReference: z
    .string()
    .trim()
    .max(100, 'Payment reference is too long')
    .regex(
      /^[a-zA-Z0-9\s\-/_.]*$/,
      'Use letters, numbers, spaces, hyphens, dots, or underscores only'
    )
    .optional()
    .or(z.literal('')),
});

export const signupOtpSchema = z.object({
  otp: otpRule,
});

export type SignupDetailsFormData = z.infer<typeof signupDetailsSchema>;
export type SignupPaymentFormData = z.infer<typeof signupPaymentSchema>;
export type SignupOtpFormData = z.infer<typeof signupOtpSchema>;

export const forgotPasswordSchema = z.object({
  email: emailRule,
});

export const resetPasswordSchema = z.object({
  password: strongPasswordRule,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  fullName: fullNameRule,
  phone: phoneRule.optional().or(z.literal('')),
  avatarUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const phoneOtpSchema = z.object({
  phone: phoneRule,
});

export const verifyOtpSchema = z.object({
  phone: phoneRule,
  token: otpRule,
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
