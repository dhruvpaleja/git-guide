import type { Request, Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';

/**
 * Blog Controllers
 * Handles blog content management and publishing
 */

export const listBlogPosts = asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implement blog post listing
  sendSuccess(res, { posts: [], total: 0 });
});

export const getBlogPost = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement individual blog post retrieval
  throw AppError.notImplemented('Get blog post');
});
