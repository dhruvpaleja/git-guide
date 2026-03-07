import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Generic request body validator middleware.
 * Takes a Zod schema and returns Express middleware that validates req.body.
 */
export function validateRequest(schema: z.ZodTypeAny) {
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
