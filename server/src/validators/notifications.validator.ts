import { z } from 'zod';

/**
 * Notifications Validators
 * Zod schemas for notification operations
 */

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
  sessionReminders: z.boolean().default(true),
  promotionalEmails: z.boolean().default(false),
});

export type NotificationPreferencesPayload = z.infer<typeof notificationPreferencesSchema>;
