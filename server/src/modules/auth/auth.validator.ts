import { z } from 'zod';
import zxcvbn from 'zxcvbn';
import type { Request, Response, NextFunction } from 'express';

const passwordStrengthSchema = z.string().superRefine((val, ctx) => {
  if (val.length < 8) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Password must be at least 8 characters' });
    return;
  }

  const result = zxcvbn(val);
  if (result.score < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Password is too weak. ${result.feedback.warning || 'Please use a stronger password.'}`,
    });
  }
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: passwordStrengthSchema,
    name: z.string().min(2, 'Name is required'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const requestBodyValidator = (schema: z.AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: error.errors,
          },
        });
      }
      return next(error);
    }
  };
};
