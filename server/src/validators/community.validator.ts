import { z } from 'zod';

/**
 * Community Validators
 */
export const createCommunityPostSchema = z.object({
  content: z.string().min(1).max(5000),
  category: z.string().optional(),
});
