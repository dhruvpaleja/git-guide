import { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { AppError, ErrorCode } from '../lib/errors.js';
import { sendSuccess } from '../lib/response.js';
import * as dailyService from '../services/daily.service.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Start video session
 * POST /api/v1/daily/start
 */
export const startSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId, role } = req.auth!;
  const { sessionId, enableRecording, enableChat } = req.body;

  // Verify user has access to session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  const isUser = session.userId === userId;
  const isTherapist = session.therapist.userId === userId;

  if (!isUser && !isTherapist) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // Check if room already exists
  const existingRoom = await dailyService.getRoom(sessionId);
  if (existingRoom) {
    return sendSuccess(res, existingRoom, 'Room retrieved successfully');
  }

  // Create new room
  const room = await dailyService.createRoom({
    sessionId,
    enableRecording,
    enableChat,
    enableScreenShare: true,
  });

  // Update session status to IN_PROGRESS
  await prisma.session.update({
    where: { id: sessionId },
    data: { status: 'IN_PROGRESS' },
  });

  sendSuccess(res, room, 'Video room created successfully', 201);
});

/**
 * End video session
 * POST /api/v1/daily/end
 */
export const endSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const { sessionId } = req.body;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session || (session.userId !== userId && session.therapist.userId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // End room
  await dailyService.endRoom(sessionId);

  // Update session status to COMPLETED (only therapist can complete)
  if (session.therapist.userId === userId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });
  }

  sendSuccess(res, { ended: true }, 'Session ended successfully');
});

/**
 * Get room info
 * GET /api/v1/daily/room/:sessionId
 */
export const getRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const { userId } = req.auth!;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session || (session.userId !== userId && session.therapist.userId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  const room = await dailyService.getRoom(sessionId);

  if (!room) {
    throw new AppError({
      message: 'Room not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  sendSuccess(res, room, 'Room retrieved successfully');
});

/**
 * Toggle recording
 * POST /api/v1/daily/recording
 */
export const toggleRecording = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, action } = req.body;

  if (action === 'start') {
    const recordingId = await dailyService.startRecording(sessionId);
    if (!recordingId) {
      throw new AppError({
        message: 'Failed to start recording',
        statusCode: 500,
        code: ErrorCode.INTERNAL_ERROR,
      });
    }
    sendSuccess(res, { recordingId, action: 'started' }, 'Recording started');
  } else {
    await dailyService.stopRecording(sessionId);
    sendSuccess(res, { action: 'stopped' }, 'Recording stopped');
  }
});

/**
 * Get recording URL
 * GET /api/v1/daily/recording/:recordingId
 */
export const getRecordingUrl = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { recordingId } = req.params;
  
  const url = await dailyService.getRecordingUrl(recordingId);
  
  if (!url) {
    throw new AppError({
      message: 'Recording not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  sendSuccess(res, { url }, 'Recording URL retrieved');
});

/**
 * Generate access token for room
 * POST /api/v1/daily/token
 */
export const getToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.body;
  const { userId, name } = req.auth!;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapist: { select: { userId: true } } },
  });

  if (!session || (session.userId !== userId && session.therapist.userId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  const room = await dailyService.getRoom(sessionId);

  if (!room) {
    throw new AppError({
      message: 'Room not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  // Generate token
  const token = await dailyService.generateToken(room.roomName, userId, name || 'User');

  sendSuccess(res, { token, roomName: room.roomName }, 'Token generated');
});
