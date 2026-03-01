import { z } from 'zod';

/**
 * Health Tools Validators
 * Zod schemas for health tracking and wellness features
 */

export const moodEntrySchema = z.object({
  mood: z.number().int().min(1).max(10),
  notes: z.string().max(500).optional(),
  activities: z.array(z.string()).optional(),
  timestamp: z.string().datetime().optional(),
});

export const journalEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  mood: z.number().int().min(1).max(10).optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().default(true),
});

export const meditationLogSchema = z.object({
  duration: z.number().int().min(1).max(120),
  type: z.enum(['GUIDED', 'UNGUIDED', 'BREATHWORK']),
  quality: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export type MoodEntryPayload = z.infer<typeof moodEntrySchema>;
export type JournalEntryPayload = z.infer<typeof journalEntrySchema>;
export type MeditationLogPayload = z.infer<typeof meditationLogSchema>;
