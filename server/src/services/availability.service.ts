/**
 * Availability Service
 *
 * Converts recurring weekly TherapistAvailability records into concrete
 * bookable time slots. Excludes already-booked sessions.
 *
 * INPUTS:
 *   - therapistId: string
 *   - fromDate: Date (defaults to now)
 *   - days: number (defaults to 30)
 *
 * OUTPUTS:
 *   - Array of { date: string (ISO), startTime: string, endTime: string, isBooked: boolean }
 *
 * ALGORITHM:
 *   1. Fetch TherapistAvailability for the therapist
 *   2. For each day in the range [fromDate, fromDate + days]:
 *      a. Get the dayOfWeek (0-6)
 *      b. Find all active availability records matching that dayOfWeek
 *      c. For each availability record, generate slots:
 *         - Start at startTime, create slots of slotDuration minutes
 *         - Add breakAfterSlot minutes gap between slots
 *         - Stop when next slot would exceed endTime
 *   3. Fetch all Session records for this therapist in the date range
 *      where status IN (SCHEDULED, IN_PROGRESS)
 *   4. Mark slots as booked if a session overlaps
 *   5. Filter out past slots (before now)
 *   6. Return the available (unbooked) slots
 *
 * EDGE CASES:
 *   - Therapist has no availability records → return empty array
 *   - All slots booked → return empty array
 *   - Slot partially in past → exclude it
 */

import { prisma } from '../lib/prisma.js';

export interface TimeSlot {
  date: string;         // "2026-03-08"
  startTime: string;    // "09:00"
  endTime: string;      // "09:50"
  startDateTime: Date;  // Full ISO datetime
  endDateTime: Date;
  isBooked: boolean;
}

export async function getAvailableSlots(
  therapistId: string,
  fromDate: Date = new Date(),
  days: number = 30,
): Promise<TimeSlot[]> {
  // 1. Fetch availability
  const availabilities = await prisma.therapistAvailability.findMany({
    where: { therapistId, isActive: true },
  });

  if (availabilities.length === 0) return [];

  // 2. Fetch booked sessions in range
  const toDate = new Date(fromDate);
  toDate.setDate(toDate.getDate() + days);

  const bookedSessions = await prisma.session.findMany({
    where: {
      therapistId,
      scheduledAt: { gte: fromDate, lte: toDate },
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
    },
    select: { scheduledAt: true, duration: true },
  });

  // 3. Generate slots
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let d = 0; d < days; d++) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + d);
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

    const dayAvailabilities = availabilities.filter((a) => a.dayOfWeek === dayOfWeek);

    for (const avail of dayAvailabilities) {
      const [startH, startM] = avail.startTime.split(':').map(Number);
      const [endH, endM] = avail.endTime.split(':').map(Number);

      let slotStart = new Date(date);
      slotStart.setHours(startH, startM, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(endH, endM, 0, 0);

      while (true) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + avail.slotDuration);

        if (slotEnd > dayEnd) break;
        if (slotStart <= now) {
          slotStart = new Date(slotEnd);
          slotStart.setMinutes(slotStart.getMinutes() + avail.breakAfterSlot);
          continue;
        }

        // Check if booked
        const isBooked = bookedSessions.some((session) => {
          const sessionEnd = new Date(session.scheduledAt);
          sessionEnd.setMinutes(sessionEnd.getMinutes() + session.duration);
          return slotStart < sessionEnd && slotEnd > session.scheduledAt;
        });

        slots.push({
          date: date.toISOString().split('T')[0],
          startTime: `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}`,
          endTime: `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`,
          startDateTime: new Date(slotStart),
          endDateTime: new Date(slotEnd),
          isBooked,
        });

        // Move to next slot
        slotStart = new Date(slotEnd);
        slotStart.setMinutes(slotStart.getMinutes() + avail.breakAfterSlot);
      }
    }
  }

  return slots.filter((s) => !s.isBooked);
}

export async function getNextAvailableSlot(therapistId: string): Promise<TimeSlot | null> {
  const slots = await getAvailableSlots(therapistId, new Date(), 14);
  return slots[0] || null;
}

export async function isSlotAvailable(
  therapistId: string,
  requestedTime: Date,
  duration: number = 50,
): Promise<boolean> {
  const requestedEnd = new Date(requestedTime);
  requestedEnd.setMinutes(requestedEnd.getMinutes() + duration);

  // Check for overlapping sessions
  // NOTE: Using findMany (not findFirst) to avoid false availability —
  // findFirst could return a non-overlapping session while another session
  // truly overlaps. Check ALL sessions that start before requestedEnd.
  const candidates = await prisma.session.findMany({
    where: {
      therapistId,
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      scheduledAt: { lt: requestedEnd },
    },
  });

  for (const conflicting of candidates) {
    const conflictEnd = new Date(conflicting.scheduledAt);
    conflictEnd.setMinutes(conflictEnd.getMinutes() + conflicting.duration);
    if (conflictEnd > requestedTime) return false;
  }

  // Check it falls within therapist's weekly availability
  const dayOfWeek = requestedTime.getDay();
  const timeStr = `${String(requestedTime.getHours()).padStart(2, '0')}:${String(requestedTime.getMinutes()).padStart(2, '0')}`;

  // Also compute the session END time string to verify the entire session
  // fits within the availability window (not just the start time)
  const endTimeStr = `${String(requestedEnd.getHours()).padStart(2, '0')}:${String(requestedEnd.getMinutes()).padStart(2, '0')}`;

  const availability = await prisma.therapistAvailability.findFirst({
    where: {
      therapistId,
      dayOfWeek,
      isActive: true,
      startTime: { lte: timeStr },
      endTime: { gte: endTimeStr }, // Must fit ENTIRE session, not just start
    },
  });

  return !!availability;
}
