import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Courses Controllers
 * Handles course management, enrollment, and progress tracking
 */

export const listCourses = asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implement course listing with filtering and pagination
  sendSuccess(res, { courses: [], total: 0 });
});

export const getCourse = asyncHandler(async (_req: Request, _res: Response) => {
  // TODO: Implement individual course retrieval
  throw AppError.notImplemented('Get course');
});

export const enrollCourse = asyncHandler(async (req: AuthenticatedRequest, _res: Response) => {
  const { userId: _userId } = req.auth as NonNullable<typeof req.auth>;
  // TODO: Implement course enrollment
  throw AppError.notImplemented('Enroll in course');
});

export const getCourseProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId: _userId } = req.auth as NonNullable<typeof req.auth>;
  // TODO: Fetch course progress for user
  sendSuccess(res, { progress: 0, completed: false });
});
