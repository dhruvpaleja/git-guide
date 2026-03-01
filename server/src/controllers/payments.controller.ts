import type { Response } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

/**
 * Payments Controllers
 * Handles payment processing, subscriptions, and billing
 */

export const processPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const payload = req.body;

    // TODO: Implement Razorpay payment processing
    throw AppError.notImplemented('Process payment');
  },
);

export const verifyPayment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;
    const { paymentId } = req.body;

    // TODO: Implement payment verification
    throw AppError.notImplemented('Verify payment');
  },
);

export const getSubscriptionStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    // TODO: Fetch user subscription status
    sendSuccess(res, {
      plan: 'FREE',
      status: 'ACTIVE',
      validUntil: null,
    });
  },
);

export const getPaymentHistory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.auth!;

    // TODO: Fetch payment history
    sendSuccess(res, { payments: [], total: 0 });
  },
);
