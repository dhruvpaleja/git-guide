/**
 * Matching Service — The Heart of Soul Yatri
 *
 * Computes a 0-100 match score between a user and each therapist.
 *
 * ALGORITHM:
 *
 * Base Score (0-100, weighted sum):
 *   struggle_match     * 0.30  — overlap of user.struggles ↔ therapist.specializations
 *   approach_match     * 0.15  — exact match = 1.0, MIXED always 0.7
 *   language_match     * 0.15  — any intersection = 1.0, weighted by count
 *   gender_match       * 0.10  — exact match or "no-preference" = 1.0
 *   goals_match        * 0.10  — overlap of user.goals ↔ therapist specializations (mapped)
 *   success_rate       * 0.10  — therapist's avg rating for user's struggles
 *   availability       * 0.05  — has slot within 24h = 1.0, within 48h = 0.5
 *   experience         * 0.05  — normalized (years / 20, capped at 1.0)
 *
 * Bonus Modifiers (added to base score):
 *   online_now         → +3
 *   10+ sessions with same struggle combo → +5
 *   return rate > 50%  → +2 per 10% above 50%
 *
 * Output: Array of { therapistId, therapistProfile, matchScore, matchReasons[] }
 *         sorted by matchScore DESC, limit to top N
 *
 * IMPORTANT MAPPINGS:
 *   Goals → Specializations:
 *     "reduce-anxiety" → "anxiety"
 *     "better-sleep" → "anxiety", "stress"
 *     "relationships" → "relationships", "couples", "family"
 *     "self-discovery" → "self-discovery", "self-esteem"
 *     "career" → "career", "corporate stress"
 *     "spiritual-growth" → "spiritual-growth"
 *     "trauma-healing" → "trauma", "grief"
 *     "confidence" → "self-esteem", "confidence"
 */

import { prisma } from '../lib/prisma.js';
import { getNextAvailableSlot } from './availability.service.js';

// Goal to specialization mapping
const GOAL_TO_SPECIALIZATION: Record<string, string[]> = {
  'reduce-anxiety': ['anxiety'],
  'better-sleep': ['anxiety', 'stress'],
  'relationships': ['relationships', 'couples', 'family'],
  'self-discovery': ['self-discovery', 'self-esteem'],
  'career': ['career', 'corporate stress'],
  'spiritual-growth': ['spiritual-growth'],
  'trauma-healing': ['trauma', 'grief'],
  'confidence': ['self-esteem', 'confidence'],
};

export interface MatchResult {
  therapistId: string;
  userId: string; // therapist's user ID
  name: string;
  bio: string;
  photoUrl: string | null;
  specializations: string[];
  approach: string;
  languages: string[];
  qualifications: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  pricePerSession: number;
  isOnline: boolean;
  isAcceptingNow: boolean;
  nextAvailableSlot: string | null; // ISO datetime
  matchScore: number;
  matchReasons: string[];
}

export async function getMatchedTherapists(
  userId: string,
  limit: number = 10,
): Promise<MatchResult[]> {
  // 1. Get user profile
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!userProfile) return [];

  // 2. Get all verified, available therapists with their data
  const therapists = await prisma.therapistProfile.findMany({
    where: { isVerified: true, isAvailable: true },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile: { select: { gender: true } },
        },
      },
      onlineStatus: true,
      metrics: true,
    },
  });

  // 3. Pre-fetch next available slot for all therapists in parallel
  const slotMap = new Map<string, Awaited<ReturnType<typeof getNextAvailableSlot>>>();
  const slotResults = await Promise.all(
    therapists.map((t) => getNextAvailableSlot(t.id).then((slot) => ({ id: t.id, slot }))),
  );
  for (const { id, slot } of slotResults) {
    slotMap.set(id, slot);
  }

  // 4. Score each therapist
  const scored: MatchResult[] = [];

  for (const t of therapists) {
    let score = 0;
    const reasons: string[] = [];

    // --- Struggle Match (30%) ---
    const userStruggles = userProfile.struggles || [];
    const overlap = userStruggles.filter((s) => t.specializations.includes(s));
    const struggleScore = userStruggles.length > 0 ? overlap.length / userStruggles.length : 0;
    score += struggleScore * 30;
    if (overlap.length > 0) reasons.push(`Specializes in ${overlap.join(', ')}`);

    // --- Approach Match (15%) ---
    const userApproach = userProfile.therapistApproach;
    let approachScore = 0.5; // default
    if (!userApproach || t.approach === userApproach) approachScore = 1.0;
    else if (t.approach === 'MIXED') approachScore = 0.7;
    score += approachScore * 15;

    // --- Language Match (15%) ---
    const userLangs = userProfile.therapistLanguages || [];
    if (userLangs.length === 0) {
      score += 15; // No preference = full score
    } else {
      const langOverlap = userLangs.filter((l) => t.languages.includes(l));
      const langScore = langOverlap.length / userLangs.length;
      score += langScore * 15;
      if (langOverlap.length > 0) reasons.push(`Speaks ${langOverlap.join(', ')}`);
    }

    // --- Gender Match (10%) ---
    // NOTE: Gender is on UserProfile, NOT User. The therapist query must include
    // user -> profile -> gender. Access via t.user.profile?.gender
    const genderPref = userProfile.therapistGenderPref;
    if (!genderPref || genderPref === 'no-preference') {
      score += 10;
    } else {
      const therapistGender = t.user.profile?.gender?.toLowerCase();
      score += (therapistGender === genderPref.toLowerCase()) ? 10 : 0;
    }

    // --- Goals Match (10%) ---
    const userGoals = userProfile.goals || [];
    const goalSpecs = userGoals.flatMap((g) => GOAL_TO_SPECIALIZATION[g] || []);
    const goalOverlap = goalSpecs.filter((s) => t.specializations.includes(s));
    const goalsScore = goalSpecs.length > 0 ? Math.min(goalOverlap.length / goalSpecs.length, 1.0) : 0;
    score += goalsScore * 10;

    // --- Success Rate (10%) ---
    const metrics = t.metrics;
    if (metrics) {
      const specStats = (metrics.specializationStats as Record<string, { avgRating?: number }>) || {};
      const relevantRatings = userStruggles
        .map((s) => specStats[s]?.avgRating)
        .filter((r): r is number => r !== undefined);
      if (relevantRatings.length > 0) {
        const avgRelevant = relevantRatings.reduce((a, b) => a + b, 0) / relevantRatings.length;
        score += (avgRelevant / 5.0) * 10;
        reasons.push(`${Math.round(avgRelevant * 10) / 10}★ rating for your concerns`);
      } else {
        score += (t.rating / 5.0) * 10;
      }
    }

    // --- Availability Proximity (5%) ---
    const nextSlot = slotMap.get(t.id) ?? null;
    if (nextSlot) {
      const hoursUntil = (nextSlot.startDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil <= 24) {
        score += 5;
        reasons.push('Available within 24 hours');
      } else if (hoursUntil <= 48) {
        score += 2.5;
      }
    }

    // --- Experience (5%) ---
    score += Math.min(t.experience / 20, 1.0) * 5;

    // --- Bonus Modifiers ---
    const isOnline = t.onlineStatus?.isOnline ?? false;
    const isAcceptingNow = t.onlineStatus?.isAcceptingNow ?? false;
    if (isOnline) score += 3;

    if (metrics && metrics.totalCompletedSessions >= 10) {
      const hasHandledCombo = userStruggles.every((s) => {
        const stat = (metrics.specializationStats as Record<string, { completedSessions?: number }>)[s];
        return stat && (stat.completedSessions ?? 0) >= 10;
      });
      if (hasHandledCombo) {
        score += 5;
        reasons.push(`Handled ${metrics.totalCompletedSessions}+ similar cases`);
      }
    }

    if (metrics && metrics.clientReturnRate > 0.5) {
      const bonusPoints = Math.floor((metrics.clientReturnRate - 0.5) * 10) * 2;
      score += Math.min(bonusPoints, 10);
    }

    score = Math.min(Math.round(score * 10) / 10, 100);

    scored.push({
      therapistId: t.id,
      userId: t.user.id,
      name: t.user.name,
      bio: t.bio,
      photoUrl: t.photoUrl,
      specializations: t.specializations,
      approach: t.approach,
      languages: t.languages,
      qualifications: t.qualifications,
      experience: t.experience,
      rating: t.rating,
      totalReviews: t.totalReviews,
      totalSessions: t.totalSessions,
      pricePerSession: t.pricePerSession,
      isOnline,
      isAcceptingNow,
      nextAvailableSlot: nextSlot?.startDateTime.toISOString() ?? null,
      matchScore: score,
      matchReasons: reasons,
    });
  }

  // Sort by score DESC
  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored.slice(0, limit);
}

export async function getAvailableNowTherapists(
  userId: string,
  limit: number = 5,
): Promise<MatchResult[]> {
  const all = await getMatchedTherapists(userId, 50);
  return all.filter((t) => t.isOnline && t.isAcceptingNow).slice(0, limit);
}
