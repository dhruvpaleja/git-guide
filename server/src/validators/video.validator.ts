import { z } from 'zod';

/**
 * Video session validators
 */

export const validateStartSession = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  enableRecording: z.boolean().optional().default(true),
  enableChat: z.boolean().optional().default(true),
});

export const validateEndSession = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
});

export const validateGetRoom = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
});

export const validateToggleRecording = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  action: z.enum(['start', 'stop']),
});

export const validateRecordingUrl = z.object({
  recordingId: z.string(),
});
