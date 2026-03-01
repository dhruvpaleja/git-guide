import { z } from 'zod';

/**
 * AI Validators
 * Zod schemas for AI operations
 */

export const aiMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().optional(),
  context: z.object({}).optional(),
});

export type AIMessagePayload = z.infer<typeof aiMessageSchema>;
