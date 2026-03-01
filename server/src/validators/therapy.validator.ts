import { z } from 'zod';

/**
 * Therapy Validators
 * Zod schemas for therapy-related request validation
 */

export const createTherapySessionSchema = z.object({
  therapistId: z.string().uuid('Invalid therapist ID'),
  startTime: z.string().datetime('Invalid start time'),
  endTime: z.string().datetime('Invalid end time'),
  type: z.enum(['SCHEDULED', 'EMERGENCY', 'FOLLOW_UP']),
  notes: z.string().optional(),
});

export const updateTherapySessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
});

export const listTherapySessionsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

export type CreateTherapySessionPayload = z.infer<typeof createTherapySessionSchema>;
export type UpdateTherapySessionPayload = z.infer<typeof updateTherapySessionSchema>;
export type ListTherapySessionsQuery = z.infer<typeof listTherapySessionsSchema>;
