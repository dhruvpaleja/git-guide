import { z } from 'zod';

/**
 * Payments Validators
 * Zod schemas for payment and subscription operations
 */

export const processPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  planId: z.string().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'CARD', 'UPI']),
});

export const verifyPaymentSchema = z.object({
  paymentId: z.string(),
  signature: z.string(),
  orderId: z.string(),
});

export type ProcessPaymentPayload = z.infer<typeof processPaymentSchema>;
export type VerifyPaymentPayload = z.infer<typeof verifyPaymentSchema>;
