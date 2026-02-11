/**
 * Form Validation Schemas
 * Using Zod for type-safe validation
 */

import { z } from 'zod';

// Password validation
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Email validation
const emailSchema = z.string().email('Invalid email address');

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Profile schemas
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

// Blog post schema
export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(200),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  featured: z.boolean().optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
});

// Mood log schema
export const moodLogSchema = z.object({
  mood: z.enum(['excellent', 'good', 'okay', 'poor', 'terrible']),
  intensity: z.number().min(1).max(10),
  triggers: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  activities: z.array(z.string()).optional(),
});

// Journal entry schema
export const journalEntrySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  mood: z.enum(['excellent', 'good', 'okay', 'poor', 'terrible']).optional(),
  tags: z.array(z.string()).optional(),
});

// Therapy session request schema
export const therapySessionRequestSchema = z.object({
  issue: z.string().min(10, 'Please describe your concern in at least 10 characters').max(500),
  preferredTherapist: z.string().optional(),
  availabilityTimeSlots: z
    .array(
      z.object({
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .min(1, 'At least one availability slot is required'),
  urgent: z.boolean().optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
});

// Course enrollment schema
export const courseEnrollmentSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer']),
});

// Export all schemas as a type
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type BlogPostData = z.infer<typeof blogPostSchema>;
export type MoodLogData = z.infer<typeof moodLogSchema>;
export type JournalEntryData = z.infer<typeof journalEntrySchema>;
export type TherapySessionRequestData = z.infer<typeof therapySessionRequestSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CourseEnrollmentData = z.infer<typeof courseEnrollmentSchema>;
