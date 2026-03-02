import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const stepSchemas = {
  1: z.object({ dateOfBirth: z.string().optional() }),
  2: z.object({ gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']) }),
  3: z.object({ city: z.string().min(1), state: z.string().optional(), country: z.string().optional() }),
  4: z.object({ struggles: z.array(z.string()).min(1).max(10) }),
  5: z.object({ therapyHistory: z.enum(['NEVER', 'CURRENTLY', 'PAST', 'CONSIDERING']) }),
  6: z.object({ goals: z.array(z.string()).min(1).max(8) }),
  7: z.object({
    therapistGenderPref: z.string().optional(),
    therapistLanguages: z.array(z.string()).optional(),
    therapistApproach: z.enum(['CBT', 'HOLISTIC', 'MIXED']).optional(),
  }),
  8: z.object({ interests: z.array(z.string()).min(1).max(6) }),
  9: z.object({
    emergencyName: z.string().min(1),
    emergencyPhone: z.string().min(10).max(15),
    emergencyRelation: z.string().min(1),
  }),
  10: z.object({}),
} as const;

export const onboardingStepSchema = z
  .object({
    step: z.number().int().min(1).max(10),
    data: z.record(z.unknown()),
  })
  .refine(
    (val) => {
      const schema = stepSchemas[val.step as keyof typeof stepSchemas];
      if (!schema) {
        return false;
      }

      return schema.safeParse(val.data).success;
    },
    { message: 'Invalid data for this onboarding step' },
  );

export const astrologyProfileSchema = z.object({
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthTimeAmPm: z.enum(['AM', 'PM', 'N/A']).optional(),
  birthCity: z.string().optional(),
  unknownBirthTime: z.boolean().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).optional(),
  wantMatchmaking: z.boolean().optional(),
  partners: z
    .array(
      z.object({
        name: z.string().optional(),
        birthDate: z.string().optional(),
        birthTime: z.string().optional(),
        birthTimeAmPm: z.enum(['AM', 'PM']).optional(),
        birthCity: z.string().optional(),
      }),
    )
    .optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const updateSettingsSchema = z.object({
  darkMode: z.boolean().optional(),
  animations: z.boolean().optional(),
  compactMode: z.boolean().optional(),
  pushNotifs: z.boolean().optional(),
  soundEffects: z.boolean().optional(),
  patternAlerts: z.boolean().optional(),
  profileVisible: z.boolean().optional(),
  constellationPublic: z.boolean().optional(),
  twoFactor: z.boolean().optional(),
});

export function requestBodyValidator(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
}
