// ---------------------------------------------------------------------------
// therapist-pricing.service.ts – Dynamic pricing computation for therapists
// ---------------------------------------------------------------------------

import { prisma } from '../lib/prisma.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE_RATE = 500;
const MIN_PRICE = 500;
const MAX_PRICE = 1000;

// ---------------------------------------------------------------------------
// computeTherapistPrice – compute dynamic price for a single therapist
// ---------------------------------------------------------------------------

export async function computeTherapistPrice(therapistId: string): Promise<number> {
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    select: { experience: true },
  });

  const metrics = await prisma.therapistMetrics.findUnique({
    where: { therapistId },
  });

  if (!profile || !metrics) return BASE_RATE;

  return calculatePrice(profile.experience, metrics);
}

// ---------------------------------------------------------------------------
// recomputeAllPrices – batch update all therapists (nightly cron)
// ---------------------------------------------------------------------------

export async function recomputeAllPrices(): Promise<{ updated: number }> {
  const therapists = await prisma.therapistProfile.findMany({
    where: { isVerified: true },
    select: {
      id: true,
      experience: true,
      metrics: true,
    },
  });

  let updated = 0;

  for (const t of therapists) {
    if (!t.metrics) continue;

    const price = calculatePrice(t.experience, t.metrics);

    await prisma.$transaction([
      prisma.therapistMetrics.update({
        where: { therapistId: t.id },
        data: { computedPrice: price, lastComputedAt: new Date() },
      }),
      prisma.therapistProfile.update({
        where: { id: t.id },
        data: { pricePerSession: price },
      }),
    ]);

    updated++;
  }

  return { updated };
}

// ---------------------------------------------------------------------------
// Internal pricing formula
// ---------------------------------------------------------------------------

interface MetricsInput {
  avgRating: number;
  clientReturnRate: number;
  bookingFillRate: number;
  avgSessionDuration: number;
  noShowRate: number;
}

function calculatePrice(experience: number, metrics: MetricsInput): number {
  const experienceModifier = Math.min(experience * 15, 300);
  const ratingModifier = Math.min(Math.max((metrics.avgRating - 3.0) * 100, 0), 200);
  const retentionModifier = Math.min(metrics.clientReturnRate * 200, 200);
  const demandModifier = Math.min(metrics.bookingFillRate * 150, 150);
  const qualityModifier = Math.min(
    (metrics.avgSessionDuration / 50) * 75 + (1 - metrics.noShowRate) * 75,
    150,
  );

  const total = BASE_RATE + experienceModifier + ratingModifier + retentionModifier + demandModifier + qualityModifier;

  return Math.round(Math.min(Math.max(total, MIN_PRICE), MAX_PRICE));
}
