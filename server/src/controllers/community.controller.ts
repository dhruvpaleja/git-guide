import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';

/**
 * Community Controllers
 * Handles community features and social interactions
 */

export const listCommunityPosts = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement community post listing
  sendSuccess(res, { posts: [], total: 0 });
});

export const createCommunityPost = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement community post creation
  throw AppError.notImplemented('Create community post');
});
