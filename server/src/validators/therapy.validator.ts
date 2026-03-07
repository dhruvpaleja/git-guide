import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: result.error.errors },
      });
    }
    req.body = result.data;
    next();
  };
}

function validateQuery(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: result.error.errors },
      });
    }
    req.query = result.data;
    next();
  };
}

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const bookSessionSchema = z.object({
  therapistId: z.string().uuid('Invalid therapist ID'),
  scheduledAt: z
    .string()
    .datetime({ message: 'scheduledAt must be a valid ISO datetime' })
    .refine((val) => new Date(val) > new Date(), {
      message: 'scheduledAt must be in the future',
    }),
  sessionType: z.enum(['discovery', 'pay_as_you_like', 'standard']).default('standard'),
  bookingSource: z.string().max(50).optional(),
});

const cancelSessionSchema = z.object({
  reason: z.string().max(2000).optional(),
});

const rescheduleSessionSchema = z.object({
  newScheduledAt: z
    .string()
    .datetime({ message: 'newScheduledAt must be a valid ISO datetime' })
    .refine((val) => new Date(val) > new Date(), {
      message: 'newScheduledAt must be in the future',
    }),
});

const rateSessionSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(2000).optional(),
});

const completeSessionSchema = z.object({
  notes: z.string().max(5000).optional(),
});

const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timeRegex, 'startTime must be HH:MM format'),
  endTime: z.string().regex(timeRegex, 'endTime must be HH:MM format'),
  slotDuration: z.number().int().min(15).max(120).optional(),
  breakAfterSlot: z.number().int().min(0).max(30).optional(),
  isActive: z.boolean(),
});

const updateAvailabilitySchema = z.object({
  slots: z
    .array(availabilitySlotSchema)
    .min(1, 'At least one slot is required')
    .refine(
      (slots) =>
        slots.every((s) => s.startTime < s.endTime),
      { message: 'startTime must be before endTime for every slot' },
    ),
});

const updateTherapistProfileSchema = z.object({
  bio: z.string().max(2000).optional(),
  specializations: z.array(z.string().max(100)).max(20).optional(),
  languages: z.array(z.string().max(50)).max(10).optional(),
  qualifications: z.array(z.string().max(200)).max(20).optional(),
  experience: z.number().int().min(0).max(60).optional(),
  approach: z.enum(['CBT', 'HOLISTIC', 'MIXED']).optional(),
  photoUrl: z.string().url().optional().nullable(),
});

const onlineStatusToggleSchema = z
  .object({
    isOnline: z.boolean().optional(),
    isAcceptingNow: z.boolean().optional(),
  })
  .refine((data) => data.isOnline !== undefined || data.isAcceptingNow !== undefined, {
    message: 'At least one of isOnline or isAcceptingNow must be provided',
  });

const sessionStatusEnum = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);

const listSessionsSchema = z.object({
  status: z.union([
    sessionStatusEnum,
    z.string().transform((val) => val.split(',')).pipe(z.array(sessionStatusEnum)),
  ]).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

const listTherapistsSchema = z.object({
  specialization: z.string().max(100).optional(),
  approach: z.enum(['CBT', 'HOLISTIC', 'MIXED']).optional(),
  language: z.string().max(50).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['rating', 'experience', 'price']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

const getSlotsSchema = z.object({
  fromDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'fromDate must be YYYY-MM-DD')
    .optional(),
  days: z.coerce.number().int().min(1).max(90).default(30),
});

// ---------------------------------------------------------------------------
// Exported middleware
// ---------------------------------------------------------------------------

export const validateBookSession = validateBody(bookSessionSchema);
const instantSessionSchema = z.object({
  therapistId: z.string().uuid('Invalid therapist ID').optional(),
});

export const validateInstantSession = validateBody(instantSessionSchema);
export const validateCancelSession = validateBody(cancelSessionSchema);
export const validateRescheduleSession = validateBody(rescheduleSessionSchema);
export const validateRateSession = validateBody(rateSessionSchema);
export const validateCompleteSession = validateBody(completeSessionSchema);
export const validateUpdateAvailability = validateBody(updateAvailabilitySchema);
export const validateUpdateTherapistProfile = validateBody(updateTherapistProfileSchema);
export const validateOnlineStatusToggle = validateBody(onlineStatusToggleSchema);
export const validateListSessions = validateQuery(listSessionsSchema);
export const validateListTherapists = validateQuery(listTherapistsSchema);
export const validateGetSlots = validateQuery(getSlotsSchema);
