import { Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { AppError, ErrorCode } from '../lib/errors.js';
import { sendSuccess } from '../lib/response.js';
import * as videoService from '../services/video.service.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Start video session
 * POST /api/v1/video/start
 */
export const startSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const auth = req.auth;
  if (!auth) throw new AppError({ message: 'Unauthorized', statusCode: 401, code: ErrorCode.UNAUTHORIZED });

  const userId = auth.userId;
  const sessionId = Array.isArray(req.body.sessionId) ? req.body.sessionId[0] : req.body.sessionId;
  const enableRecording = req.body.enableRecording === 'true' || req.body.enableRecording === true;
  const enableChat = req.body.enableChat === 'true' || req.body.enableChat === true;

  // Verify user has access to session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapistId: true },
  });

  if (!session) {
    throw new AppError({
      message: 'Session not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  const isUser = session.userId === userId;
  const isTherapist = session.therapistId === userId;

  if (!isUser && !isTherapist) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // Check if room already exists
  const existingRoom = await videoService.getRoom(sessionId);
  if (existingRoom) {
    return sendSuccess(res, existingRoom, 'Room retrieved successfully');
  }

  // Create new room
  const room = await videoService.createRoom({
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
 * POST /api/v1/video/end
 */
export const endSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const auth = req.auth;
  if (!auth) throw new AppError({ message: 'Unauthorized', statusCode: 401, code: ErrorCode.UNAUTHORIZED });

  const userId = auth.userId;
  const sessionId = Array.isArray(req.body.sessionId) ? req.body.sessionId[0] : req.body.sessionId;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapistId: true },
  });

  if (!session || (session.userId !== userId && session.therapistId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  // End room
  await videoService.endRoom(sessionId);

  // Update session status to COMPLETED (only therapist can complete)
  if (session.therapistId === userId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });
  }

  sendSuccess(res, { ended: true }, 'Session ended successfully');
});

/**
 * Get room info
 * GET /api/v1/video/room/:sessionId
 */
export const getRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const auth = req.auth;
  if (!auth) throw new AppError({ message: 'Unauthorized', statusCode: 401, code: ErrorCode.UNAUTHORIZED });

  const userId = auth.userId;
  const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapistId: true },
  });

  if (!session || (session.userId !== userId && session.therapistId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  const room = await videoService.getRoom(sessionId);

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
 * POST /api/v1/video/recording
 */
export const toggleRecording = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const sessionId = Array.isArray(req.body.sessionId) ? req.body.sessionId[0] : req.body.sessionId;
  const action = Array.isArray(req.body.action) ? req.body.action[0] : req.body.action;

  if (action === 'start') {
    const recordingId = await videoService.startRecording(sessionId);
    if (!recordingId) {
      throw new AppError({
        message: 'Failed to start recording',
        statusCode: 500,
        code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      });
    }
    sendSuccess(res, { recordingId, action: 'started' }, 'Recording started');
  } else {
    await videoService.stopRecording(sessionId);
    sendSuccess(res, { action: 'stopped' }, 'Recording stopped');
  }
});

/**
 * Get recording URL
 * GET /api/v1/video/recording/:recordingId
 */
export const getRecordingUrl = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const recordingId = Array.isArray(req.params.recordingId) ? req.params.recordingId[0] : req.params.recordingId;

  const url = await videoService.getRecordingUrl(recordingId);

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
 * POST /api/v1/video/token
 */
export const getToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const auth = req.auth;
  if (!auth) throw new AppError({ message: 'Unauthorized', statusCode: 401, code: ErrorCode.UNAUTHORIZED });

  const { sessionId } = req.body;
  const userId = auth.userId;

  // Verify access
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { userId, therapistId: true },
  });

  if (!session || (session.userId !== userId && session.therapistId !== userId)) {
    throw new AppError({
      message: 'Access denied',
      statusCode: 403,
      code: ErrorCode.FORBIDDEN,
    });
  }

  const room = await videoService.getRoom(sessionId);

  if (!room) {
    throw new AppError({
      message: 'Room not found',
      statusCode: 404,
      code: ErrorCode.NOT_FOUND,
    });
  }

  // Generate token
  const token = await videoService.generateToken(room.roomName, userId, auth.userId);

  sendSuccess(res, { token, roomName: room.roomName }, 'Token generated');
});
