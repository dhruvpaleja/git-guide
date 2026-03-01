// ---------------------------------------------------------------------------
// Error Middleware — Production-grade error handling with structured logging
// ---------------------------------------------------------------------------

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError, ErrorCode } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

/**
 * Global error handler.
 * Catches all errors, normalizes them, logs them, and returns a standardized response.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = (req as unknown as Record<string, unknown>).requestId as string | undefined;

  // Normalize error into AppError
  const appError = normalizeError(err);

  // Log with appropriate severity
  const logPayload = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: appError.statusCode,
    errorCode: appError.code,
    message: appError.message,
    ...(appError.details && { details: appError.details }),
  };

  if (appError.statusCode >= 500) {
    logger.error('unhandled_error', { ...logPayload, stack: err.stack });
  } else if (appError.statusCode >= 400) {
    logger.warn('client_error', logPayload);
  }

  // Never leak internals in production
  const isProduction = process.env.NODE_ENV === 'production';
  const message = appError.isOperational || !isProduction
    ? appError.message
    : 'Internal server error';

  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message,
      ...(appError.details && !isProduction && { details: appError.details }),
    },
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
  });
}

/**
 * 404 handler for unmatched routes
 */
export function notFound(req: Request, res: Response): void {
  const requestId = (req as unknown as Record<string, unknown>).requestId as string | undefined;

  res.status(404).json({
    success: false,
    error: {
      code: ErrorCode.NOT_FOUND,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
  });
}

// ---------------------------------------------------------------------------
// Error Normalization — Convert any error type to AppError
// ---------------------------------------------------------------------------

function normalizeError(err: Error): AppError {
  // Already an AppError
  if (err instanceof AppError) {
    return err;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, unknown> = {
      fields: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    };
    return new AppError({
      message: 'Validation failed',
      statusCode: 400,
      code: ErrorCode.VALIDATION_FAILED,
      details,
    });
  }

  // Prisma known request errors (unique constraint, not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err);
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return new AppError({
      message: 'Invalid database query',
      statusCode: 400,
      code: ErrorCode.VALIDATION_FAILED,
      isOperational: true,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return new AppError({
      message: 'Invalid token',
      statusCode: 401,
      code: ErrorCode.TOKEN_INVALID,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return new AppError({
      message: 'Token expired',
      statusCode: 401,
      code: ErrorCode.TOKEN_EXPIRED,
    });
  }

  // SyntaxError (malformed JSON body)
  if (err instanceof SyntaxError && 'body' in err) {
    return new AppError({
      message: 'Malformed JSON in request body',
      statusCode: 400,
      code: ErrorCode.INVALID_INPUT,
    });
  }

  // PayloadTooLargeError
  if (err.name === 'PayloadTooLargeError' || ('type' in err && (err as unknown as Record<string, unknown>).type === 'entity.too.large')) {
    return new AppError({
      message: 'Request body too large',
      statusCode: 413,
      code: ErrorCode.PAYLOAD_TOO_LARGE,
    });
  }

  // Generic Express status error
  const status = (err as unknown as Record<string, unknown>).status as number | undefined;
  if (status && status >= 400 && status < 600) {
    return new AppError({
      message: err.message,
      statusCode: status,
      code: status === 429 ? ErrorCode.RATE_LIMITED : ErrorCode.INTERNAL,
    });
  }

  // Unknown error — treat as 500
  return new AppError({
    message: err.message || 'Internal server error',
    statusCode: 500,
    code: ErrorCode.INTERNAL,
    isOperational: false,
    cause: err,
  });
}

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return new AppError({
        message: `A record with this ${target} already exists`,
        statusCode: 409,
        code: ErrorCode.ALREADY_EXISTS,
        details: { target },
      });
    }
    case 'P2025':
      return new AppError({
        message: 'Record not found',
        statusCode: 404,
        code: ErrorCode.NOT_FOUND,
      });
    case 'P2003':
      return new AppError({
        message: 'Related record not found',
        statusCode: 400,
        code: ErrorCode.VALIDATION_FAILED,
      });
    case 'P2014':
      return new AppError({
        message: 'Operation would violate data integrity',
        statusCode: 400,
        code: ErrorCode.CONFLICT,
      });
    default:
      return new AppError({
        message: 'Database operation failed',
        statusCode: 500,
        code: ErrorCode.DATABASE_ERROR,
        isOperational: false,
      });
  }
}
