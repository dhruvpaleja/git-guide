// ---------------------------------------------------------------------------
// Error Middleware - Production-grade error handling with structured logging
// ---------------------------------------------------------------------------

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import {
  AppError,
  ErrorCode,
  defaultErrorCodeForStatus,
  resolveCanonicalErrorCode,
} from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { sendError } from '../lib/response.js';
import { getRequestId } from './request-context.js';

/**
 * Global error handler.
 * Catches all errors, normalizes them, logs them, and returns a standardized response.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = getRequestId(req);

  // Normalize error into AppError.
  const appError = normalizeError(err);

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
    logger.error('unhandled_error', {
      ...logPayload,
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else if (appError.statusCode >= 400) {
    logger.warn('client_error', logPayload);
  }

  // Never leak internals in production.
  const isProduction = process.env.NODE_ENV === 'production';
  const message = appError.isOperational || !isProduction
    ? appError.message
    : 'Internal server error';

  const details = !isProduction ? appError.details : undefined;
  sendError(res, appError.statusCode, appError.code, message, details);
}

/**
 * 404 handler for unmatched routes
 */
export function notFound(req: Request, res: Response): void {
  sendError(
    res,
    404,
    ErrorCode.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found`,
  );
}

// ---------------------------------------------------------------------------
// Error Normalization - Convert any error type to AppError
// ---------------------------------------------------------------------------

function normalizeError(err: unknown): AppError {
  // Already an AppError.
  if (err instanceof AppError) {
    return err;
  }

  // Zod validation errors.
  if (err instanceof ZodError) {
    const details: Record<string, unknown> = {
      fields: err.errors.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    };

    return new AppError({
      message: 'Validation failed',
      statusCode: 400,
      code: ErrorCode.VALIDATION_FAILED,
      details,
    });
  }

  // Prisma known request errors (unique constraint, not found, etc.).
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err);
  }

  // Prisma validation errors.
  if (err instanceof Prisma.PrismaClientValidationError) {
    return new AppError({
      message: 'Invalid database query',
      statusCode: 400,
      code: ErrorCode.VALIDATION_FAILED,
      isOperational: true,
    });
  }

  // JWT errors.
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    return new AppError({
      message: 'Invalid token',
      statusCode: 401,
      code: ErrorCode.TOKEN_INVALID,
    });
  }

  if (err instanceof Error && err.name === 'TokenExpiredError') {
    return new AppError({
      message: 'Token expired',
      statusCode: 401,
      code: ErrorCode.TOKEN_EXPIRED,
    });
  }

  // SyntaxError (malformed JSON body).
  if (err instanceof SyntaxError && hasKey(err, 'body')) {
    return new AppError({
      message: 'Malformed JSON in request body',
      statusCode: 400,
      code: ErrorCode.INVALID_INPUT,
    });
  }

  // PayloadTooLargeError.
  if (
    err instanceof Error
    && (err.name === 'PayloadTooLargeError' || (hasKey(err, 'type') && err.type === 'entity.too.large'))
  ) {
    return new AppError({
      message: 'Request body too large',
      statusCode: 413,
      code: ErrorCode.PAYLOAD_TOO_LARGE,
    });
  }

  // Generic express-style status/code error object.
  if (hasStatus(err)) {
    const statusCode = err.status;
    const message = typeof err.message === 'string' && err.message.trim()
      ? err.message
      : defaultMessageForStatus(statusCode);
    const details = asDetails(err.details);
    const code = resolveCanonicalErrorCode(err.code, defaultErrorCodeForStatus(statusCode));

    return new AppError({
      message,
      statusCode,
      code,
      details,
      isOperational: statusCode < 500,
      cause: err.originalError,
    });
  }

  // Unknown error - treat as canonical internal server error.
  const fallbackMessage = err instanceof Error && err.message
    ? err.message
    : 'Internal server error';

  return new AppError({
    message: fallbackMessage,
    statusCode: 500,
    code: ErrorCode.INTERNAL,
    isOperational: false,
    cause: err instanceof Error ? err : undefined,
  });
}

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') || 'field';
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

function defaultMessageForStatus(statusCode: number): string {
  if (statusCode === 400) {
    return 'Bad request';
  }
  if (statusCode === 401) {
    return 'Unauthorized';
  }
  if (statusCode === 403) {
    return 'Forbidden';
  }
  if (statusCode === 404) {
    return 'Not found';
  }
  if (statusCode === 409) {
    return 'Conflict';
  }
  if (statusCode === 413) {
    return 'Payload too large';
  }
  if (statusCode === 429) {
    return 'Too many requests';
  }
  if (statusCode === 503) {
    return 'Service unavailable';
  }
  return 'Internal server error';
}

type StatusLikeError = {
  status: number;
  message?: string;
  code?: string;
  details?: unknown;
  originalError?: Error;
};

function hasKey(value: unknown, key: string): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && key in value;
}

function asDetails(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function hasStatus(value: unknown): value is StatusLikeError {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const rawStatus = typeof candidate.statusCode === 'number'
    ? candidate.statusCode
    : candidate.status;

  if (typeof rawStatus !== 'number' || Number.isNaN(rawStatus)) {
    return false;
  }

  candidate.status = rawStatus;
  return rawStatus >= 400 && rawStatus < 600;
}
