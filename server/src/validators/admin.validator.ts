import { z } from 'zod';

/**
 * Admin Validators
 * Zod schemas for admin operations
 */

export const updateUserStatusSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  reason: z.string().optional(),
});

export type UpdateUserStatusPayload = z.infer<typeof updateUserStatusSchema>;
