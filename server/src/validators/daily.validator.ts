import { z } from 'zod';
import { validateRequest } from './utils.js';

// Start session schema
export const startSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  enableRecording: z.boolean().optional().default(true),
  enableChat: z.boolean().optional().default(true),
});

// End session schema
export const endSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
});

// Toggle recording schema
export const toggleRecordingSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  action: z.enum(['start', 'stop']),
});

// Get room schema (params)
export const getRoomSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
});

// Validators
export const validateStartSession = validateRequest(startSessionSchema);
export const validateEndSession = validateRequest(endSessionSchema);
export const validateToggleRecording = validateRequest(toggleRecordingSchema);
export const validateGetRoom = validateRequest(getRoomSchema);
