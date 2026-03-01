import { z } from 'zod';

/**
 * Blog Validators
 */
export const createBlogPostSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
});
