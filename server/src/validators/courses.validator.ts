import { z } from 'zod';

/**
 * Courses Validators
 * Zod schemas for course operations
 */

export const enrollCourseSchema = z.object({
  courseId: z.string().uuid(),
});

export const updateProgressSchema = z.object({
  progress: z.number().min(0).max(100),
  completedLessons: z.array(z.string()).optional(),
});

export type EnrollCoursePayload = z.infer<typeof enrollCourseSchema>;
export type UpdateProgressPayload = z.infer<typeof updateProgressSchema>;
