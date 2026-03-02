import type { Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Therapy Controllers
 * Handles therapy session management, booking, and related operations
 */

export const listTherapySessions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId: _userId } = req.auth as NonNullable<typeof req.auth>;

    // TODO: Implement therapy session listing
    // - Fetch sessions from database
    // - Filter by userId and status
    // - Apply pagination

    sendSuccess(res, {
      sessions: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
  },
);

export const createTherapySession = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response) => {
    const { userId: _userId } = req.auth as NonNullable<typeof req.auth>;
    const _payload = req.body;

    // TODO: Implement therapy session creation
    // - Validate therapist availability
    // - Create session record
    // - Send notifications

    throw AppError.notImplemented('Therapy session creation');
  },
);

export const getTherapySession = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response) => {
    const { sessionId: _sessionId } = req.params;

    // TODO: Implement session retrieval
    throw AppError.notImplemented('Get therapy session');
  },
);

export const updateTherapySession = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response) => {
    const { sessionId: _sessionId } = req.params;

    // TODO: Implement session update
    throw AppError.notImplemented('Update therapy session');
  },
);
