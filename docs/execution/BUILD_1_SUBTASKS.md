# BUILD 1: SUBTASK BREAKDOWN — 100+ Self-Contained Prompts

> **Master Spec:** `docs/execution/BUILD_1_THERAPY_BOOKING_SPEC.md`
> **Rule:** Each subtask is self-contained. Any AI agent can pick up any subtask without context of previous subtasks. Each prompt includes: what file to edit, what it should contain, what to import, and how to verify it works.

---

## PHASE A: DATABASE SCHEMA (Subtasks 1-8)

---

### SUBTASK A1: Add TherapyJourney model to Prisma schema

**File:** `server/prisma/schema.prisma`
**Action:** ADD new model after the existing `Session` model block
**Depends on:** Nothing
**Verify:** `npx prisma validate` passes

**What to add:**
```prisma
model TherapyJourney {
  id                    String    @id @default(uuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  completedSessionCount Int       @default(0)
  activeTherapistCount  Int       @default(0)
  firstSessionAt        DateTime?
  lastSessionAt         DateTime?
  totalSpent            Int       @default(0)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

**Also add** to the `User` model's relations block:
```prisma
therapyJourney    TherapyJourney?
```

---

### SUBTASK A2: Add TherapistOnlineStatus model to Prisma schema

**File:** `server/prisma/schema.prisma`
**Action:** ADD new model after `TherapyJourney`
**Depends on:** A1 (for ordering, but can be done independently)
**Verify:** `npx prisma validate` passes

**What to add:**
```prisma
model TherapistOnlineStatus {
  id              String           @id @default(uuid())
  therapistId     String           @unique
  therapist       TherapistProfile @relation(fields: [therapistId], references: [id], onDelete: Cascade)
  isOnline        Boolean          @default(false)
  lastSeenAt      DateTime         @default(now())
  isAcceptingNow  Boolean          @default(false)
  currentSessionId String?
  updatedAt       DateTime         @updatedAt
}
```

**Also add** to `TherapistProfile` model's relations:
```prisma
onlineStatus      TherapistOnlineStatus?
```

---

### SUBTASK A3: Add UserNudge model to Prisma schema

**File:** `server/prisma/schema.prisma`
**Action:** ADD new model
**Depends on:** Nothing
**Verify:** `npx prisma validate` passes

**What to add:**
```prisma
model UserNudge {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  nudgeType       String
  nudgeData       Json?
  status          String    @default("pending")
  shownAt         DateTime?
  dismissedAt     DateTime?
  actedAt         DateTime?
  expiresAt       DateTime?
  cooldownUntil   DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId, status])
  @@index([nudgeType])
}
```

**Also add** to the `User` model's relations:
```prisma
nudges            UserNudge[]
```

---

### SUBTASK A4: Add TherapistMetrics model to Prisma schema

**File:** `server/prisma/schema.prisma`
**Action:** ADD new model
**Depends on:** Nothing
**Verify:** `npx prisma validate` passes

**What to add:**
```prisma
model TherapistMetrics {
  id                       String           @id @default(uuid())
  therapistId              String           @unique
  therapist                TherapistProfile @relation(fields: [therapistId], references: [id], onDelete: Cascade)
  specializationStats      Json             @default("{}")
  avgRating                Float            @default(0)
  totalCompletedSessions   Int              @default(0)
  totalCancelledSessions   Int              @default(0)
  noShowRate               Float            @default(0)
  clientReturnRate         Float            @default(0)
  avgSessionDuration       Float            @default(0)
  bookingFillRate          Float            @default(0)
  responseTime             Float            @default(0)
  computedPrice            Int              @default(500)
  lastComputedAt           DateTime         @default(now())
  createdAt                DateTime         @default(now())
  updatedAt                DateTime         @updatedAt
}
```

**Also add** to `TherapistProfile` model's relations:
```prisma
metrics           TherapistMetrics?
```

---

### SUBTASK A5: Add new fields to Session model

**File:** `server/prisma/schema.prisma`
**Action:** MODIFY existing `Session` model — add new fields
**Depends on:** Nothing
**Verify:** `npx prisma validate` passes

**Fields to add inside Session model** (add after `roomName` and before `paymentId`):
```prisma
  // Session type and pricing
  sessionType         String    @default("standard")  // "discovery", "pay_as_you_like", "standard"
  priceAtBooking      Int       @default(0)
  userPaidAmount      Int?

  // Matching context
  matchScore          Float?
  matchReason         String?
  bookingSource       String    @default("search")

  // Astrologer input stub
  astrologerNotes     String?

  // Therapist private notes
  therapistPrivateNotes String?
```

---

### SUBTASK A6: Run Prisma migration

**Command:** Run from `server/` directory
```bash
npx prisma migrate dev --name add-therapy-booking-models
```
**Depends on:** A1-A5 all completed
**Verify:** Migration succeeds, `npx prisma generate` succeeds, no TS errors in `prisma.ts`

---

### SUBTASK A7: Verify Prisma Client types

**Action:** After migration, verify in any TS file that you can access:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// These should all autocomplete:
prisma.therapyJourney
prisma.therapistOnlineStatus
prisma.userNudge
prisma.therapistMetrics
```
**Depends on:** A6
**Verify:** `npx tsc --noEmit` passes in server directory

---

### SUBTASK A8: Create seed script for 12 therapists

**File:** `server/src/seeds/seed-therapists.ts`
**Action:** CREATE new file
**Depends on:** A6 (migration must have run)
**Verify:** Run the seed script and check DB has 12 therapist users + profiles + availability + metrics

**Also:** Add to `server/package.json` scripts:
```json
"seed:therapists": "tsx src/seeds/seed-therapists.ts"
```

**Full implementation:**

```typescript
import { PrismaClient, Role, TherapistApproach, Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const THERAPISTS = [
  {
    name: 'Dr. Aisha Mehta',
    email: 'aisha.mehta@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['anxiety', 'corporate stress', 'burnout'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi'],
    qualifications: ['M.Phil Clinical Psychology', 'RCI Licensed', 'CBT Certified'],
    experience: 12,
    bio: 'I specialize in helping professionals navigate anxiety and burnout. With 12 years of experience and a CBT-focused approach, I create structured pathways to clarity. My practice centers on practical, evidence-based techniques that fit into your busy life.',
    rating: 4.9,
    totalReviews: 204,
    totalSessions: 312,
    pricePerSession: 850,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '15:00' },
    ],
    metrics: { avgRating: 4.9, totalCompletedSessions: 312, clientReturnRate: 0.78, bookingFillRate: 0.85, computedPrice: 850 },
  },
  {
    name: 'Dr. Rohan Sharma',
    email: 'rohan.sharma@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['depression', 'self-esteem', 'trauma'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi', 'marathi'],
    qualifications: ['Ph.D. Psychology', 'EMDR Certified'],
    experience: 8,
    bio: 'I blend modern therapy with mindfulness-based approaches. Having worked with hundreds of individuals struggling with self-worth and past trauma, I believe healing comes through understanding your story — not just your symptoms.',
    rating: 4.7,
    totalReviews: 156,
    totalSessions: 234,
    pricePerSession: 700,
    availability: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '14:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
    ],
    metrics: { avgRating: 4.7, totalCompletedSessions: 234, clientReturnRate: 0.65, bookingFillRate: 0.72, computedPrice: 700 },
  },
  {
    name: 'Dr. Priya Nair',
    email: 'priya.nair@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['relationships', 'couples', 'family'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'malayalam'],
    qualifications: ['M.A. Marriage & Family Therapy', 'Gottman Certified'],
    experience: 10,
    bio: 'Relationships are the mirror of our inner world. Through a holistic approach that honors cultural values and modern dynamics, I help couples and families rebuild trust, communication, and genuine connection.',
    rating: 4.8,
    totalReviews: 178,
    totalSessions: 267,
    pricePerSession: 800,
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 2, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '11:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' },
    ],
    metrics: { avgRating: 4.8, totalCompletedSessions: 267, clientReturnRate: 0.72, bookingFillRate: 0.80, computedPrice: 800 },
  },
  {
    name: 'Dr. Karan Patel',
    email: 'karan.patel@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['stress', 'anger', 'addiction'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi', 'gujarati'],
    qualifications: ['M.Phil Clinical Psychology', 'De-addiction Specialist'],
    experience: 6,
    bio: 'I work with individuals caught in cycles of stress, anger, and addictive behaviors. My approach is direct, structured, and results-oriented — because understanding the pattern is the first step to breaking it.',
    rating: 4.5,
    totalReviews: 89,
    totalSessions: 145,
    pricePerSession: 600,
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '20:00' },
    ],
    metrics: { avgRating: 4.5, totalCompletedSessions: 145, clientReturnRate: 0.55, bookingFillRate: 0.60, computedPrice: 600 },
  },
  {
    name: 'Dr. Ananya Singh',
    email: 'ananya.singh@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['grief', 'trauma', 'depression'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi'],
    qualifications: ['Ph.D. Clinical Psychology', 'EMDR Level II', 'RCI Licensed'],
    experience: 15,
    bio: 'With 15 years of deep trauma work, I create a space where grief and pain are honored, not rushed. My practice integrates EMDR, somatic experiencing, and traditional talk therapy for layered healing.',
    rating: 4.9,
    totalReviews: 289,
    totalSessions: 420,
    pricePerSession: 950,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
    ],
    metrics: { avgRating: 4.9, totalCompletedSessions: 420, clientReturnRate: 0.82, bookingFillRate: 0.90, computedPrice: 950 },
  },
  {
    name: 'Dr. Vikram Desai',
    email: 'vikram.desai@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['career', 'confidence', 'self-discovery'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi', 'marathi'],
    qualifications: ['M.A. Counseling Psychology', 'Career Coaching Certified'],
    experience: 7,
    bio: 'Stuck in the wrong career? Unsure who you are beyond your job title? I help ambitious professionals find clarity, rebuild confidence, and design a life that feels genuinely theirs.',
    rating: 4.6,
    totalReviews: 112,
    totalSessions: 178,
    pricePerSession: 650,
    availability: [
      { dayOfWeek: 0, startTime: '11:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '11:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '11:00', endTime: '17:00' },
    ],
    metrics: { avgRating: 4.6, totalCompletedSessions: 178, clientReturnRate: 0.60, bookingFillRate: 0.65, computedPrice: 650 },
  },
  {
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['anxiety', 'depression', 'spiritual-growth'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'tamil', 'kannada'],
    qualifications: ['M.Phil Psychology', 'Yoga Therapy Certified', 'Mindfulness-Based Stress Reduction'],
    experience: 9,
    bio: 'I bridge ancient Indian wisdom with modern psychology. Whether it is anxiety that keeps you up at night or a search for deeper meaning, my practice uses meditation, breathwork, and therapeutic dialogue to find your center.',
    rating: 4.7,
    totalReviews: 134,
    totalSessions: 210,
    pricePerSession: 750,
    availability: [
      { dayOfWeek: 1, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '12:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' },
    ],
    metrics: { avgRating: 4.7, totalCompletedSessions: 210, clientReturnRate: 0.68, bookingFillRate: 0.75, computedPrice: 750 },
  },
  {
    name: 'Dr. Arjun Kapoor',
    email: 'arjun.kapoor@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['relationships', 'self-esteem', 'anger'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi'],
    qualifications: ['M.A. Clinical Psychology', 'Anger Management Specialist'],
    experience: 5,
    bio: 'I help people break out of toxic relationship patterns and rebuild self-worth. My approach is warm but honest — we look at what is really going on, not just the surface-level symptoms.',
    rating: 4.4,
    totalReviews: 67,
    totalSessions: 98,
    pricePerSession: 550,
    availability: [
      { dayOfWeek: 2, startTime: '16:00', endTime: '21:00' },
      { dayOfWeek: 4, startTime: '16:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
    ],
    metrics: { avgRating: 4.4, totalCompletedSessions: 98, clientReturnRate: 0.50, bookingFillRate: 0.55, computedPrice: 550 },
  },
  {
    name: 'Dr. Simran Kaur',
    email: 'simran.kaur@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['anxiety', 'stress', 'better-sleep'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi'],
    qualifications: ['M.Phil Psychology', 'Sleep Disorder Specialist', 'Breathwork Practitioner'],
    experience: 8,
    bio: 'Cannot sleep? Mind racing at 3 AM? I specialize in the anxiety-sleep connection. My holistic approach combines sleep hygiene science, breathwork, and root-cause therapy to help you rest — truly rest.',
    rating: 4.6,
    totalReviews: 123,
    totalSessions: 189,
    pricePerSession: 700,
    availability: [
      { dayOfWeek: 0, startTime: '09:00', endTime: '13:00' },
      { dayOfWeek: 1, startTime: '09:00', endTime: '15:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '15:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
    ],
    metrics: { avgRating: 4.6, totalCompletedSessions: 189, clientReturnRate: 0.63, bookingFillRate: 0.70, computedPrice: 700 },
  },
  {
    name: 'Dr. Nisha Reddy',
    email: 'nisha.reddy@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['trauma', 'grief', 'depression'],
    approach: TherapistApproach.CBT,
    languages: ['english', 'hindi', 'telugu'],
    qualifications: ['Ph.D. Clinical Psychology', 'Trauma-Focused CBT', 'RCI Licensed'],
    experience: 11,
    bio: 'I have spent a decade helping people process trauma and loss using structured, evidence-based interventions. Healing is not linear, but with the right approach, it is always possible.',
    rating: 4.8,
    totalReviews: 198,
    totalSessions: 305,
    pricePerSession: 850,
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '14:00' },
    ],
    metrics: { avgRating: 4.8, totalCompletedSessions: 305, clientReturnRate: 0.75, bookingFillRate: 0.82, computedPrice: 850 },
  },
  {
    name: 'Dr. Amit Joshi',
    email: 'amit.joshi@soulyatri.com',
    gender: Gender.MALE,
    specializations: ['addiction', 'anger', 'stress'],
    approach: TherapistApproach.MIXED,
    languages: ['english', 'hindi', 'bengali'],
    qualifications: ['M.Phil Clinical Psychology', 'NIMHANS Trained', 'Substance Abuse Specialist'],
    experience: 13,
    bio: 'After 13 years in de-addiction and anger management — including work at NIMHANS — I bring deep clinical experience to a warm, non-judgmental space. Recovery is not about willpower. It is about rewiring.',
    rating: 4.7,
    totalReviews: 167,
    totalSessions: 278,
    pricePerSession: 800,
    availability: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '13:00' },
    ],
    metrics: { avgRating: 4.7, totalCompletedSessions: 278, clientReturnRate: 0.70, bookingFillRate: 0.78, computedPrice: 800 },
  },
  {
    name: 'Dr. Tara Menon',
    email: 'tara.menon@soulyatri.com',
    gender: Gender.FEMALE,
    specializations: ['self-discovery', 'spiritual-growth', 'relationships'],
    approach: TherapistApproach.HOLISTIC,
    languages: ['english', 'hindi', 'malayalam'],
    qualifications: ['M.A. Transpersonal Psychology', 'Art Therapy Certified', 'Vedic Counselor'],
    experience: 7,
    bio: 'I blend art therapy, transpersonal psychology, and Vedic wisdom. If you are at a crossroads — questioning your path, your relationships, your purpose — I help you listen to the answers you already carry.',
    rating: 4.5,
    totalReviews: 94,
    totalSessions: 142,
    pricePerSession: 650,
    availability: [
      { dayOfWeek: 0, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 2, startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '16:00' },
    ],
    metrics: { avgRating: 4.5, totalCompletedSessions: 142, clientReturnRate: 0.58, bookingFillRate: 0.62, computedPrice: 650 },
  },
];

async function seedTherapists() {
  console.log('🌱 Seeding 12 therapists...');

  for (const t of THERAPISTS) {
    const passwordHash = await bcrypt.hash('SoulYatri2026!', 12);

    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        passwordHash,
        name: t.name,
        role: Role.THERAPIST,
        isVerified: true,
      },
    });

    const profile = await prisma.therapistProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specializations: t.specializations,
        approach: t.approach,
        languages: t.languages,
        qualifications: t.qualifications,
        experience: t.experience,
        bio: t.bio,
        pricePerSession: t.pricePerSession,
        rating: t.rating,
        totalReviews: t.totalReviews,
        totalSessions: t.totalSessions,
        isVerified: true,
        isAvailable: true,
        verifiedAt: new Date(),
      },
    });

    // Seed availability
    for (const slot of t.availability) {
      await prisma.therapistAvailability.create({
        data: {
          therapistId: profile.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          slotDuration: 50,
          breakAfterSlot: 10,
          isActive: true,
        },
      });
    }

    // Seed online status
    await prisma.therapistOnlineStatus.upsert({
      where: { therapistId: profile.id },
      update: {},
      create: {
        therapistId: profile.id,
        isOnline: Math.random() > 0.5,
        isAcceptingNow: Math.random() > 0.6,
        lastSeenAt: new Date(),
      },
    });

    // Seed metrics
    await prisma.therapistMetrics.upsert({
      where: { therapistId: profile.id },
      update: {},
      create: {
        therapistId: profile.id,
        avgRating: t.metrics.avgRating,
        totalCompletedSessions: t.metrics.totalCompletedSessions,
        clientReturnRate: t.metrics.clientReturnRate,
        bookingFillRate: t.metrics.bookingFillRate,
        computedPrice: t.metrics.computedPrice,
        specializationStats: Object.fromEntries(
          t.specializations.map((s) => [
            s,
            {
              avgRating: t.metrics.avgRating - Math.random() * 0.3,
              completedSessions: Math.floor(t.metrics.totalCompletedSessions / t.specializations.length),
              returnRate: t.metrics.clientReturnRate,
            },
          ]),
        ),
      },
    });

    console.log(`  ✅ ${t.name} (${t.specializations.join(', ')})`);
  }

  console.log('🎉 Done! 12 therapists seeded.');
}

seedTherapists()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## PHASE B: BACKEND SERVICES — Core Business Logic (Subtasks 9-25)

---

### SUBTASK B1: Create availability.service.ts

**File:** `server/src/services/availability.service.ts`
**Action:** CREATE new file
**Depends on:** A6 (schema migrated)
**Verify:** Import in a test file and call `getAvailableSlots` — should return time slots

**Purpose:** Takes a therapist's recurring weekly availability and computes concrete bookable time slots for the next N days, excluding already-booked sessions.

```typescript
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
  const conflicting = await prisma.session.findFirst({
    where: {
      therapistId,
      status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      scheduledAt: { lt: requestedEnd },
      // We need to check overlap: existing session end > requested start
    },
  });

  if (conflicting) {
    const conflictEnd = new Date(conflicting.scheduledAt);
    conflictEnd.setMinutes(conflictEnd.getMinutes() + conflicting.duration);
    if (conflictEnd > requestedTime) return false;
  }

  // Check it falls within therapist's weekly availability
  const dayOfWeek = requestedTime.getDay();
  const timeStr = `${String(requestedTime.getHours()).padStart(2, '0')}:${String(requestedTime.getMinutes()).padStart(2, '0')}`;

  const availability = await prisma.therapistAvailability.findFirst({
    where: {
      therapistId,
      dayOfWeek,
      isActive: true,
      startTime: { lte: timeStr },
      endTime: { gte: timeStr },
    },
  });

  return !!availability;
}
```

---

### SUBTASK B2: Create matching.service.ts

**File:** `server/src/services/matching.service.ts`
**Action:** CREATE new file
**Depends on:** A6, B1
**Verify:** Import and call `getMatchedTherapists(userId)` — returns sorted array with scores

**Purpose:** The core matching algorithm. Takes a user's profile (struggles, goals, preferences, mood history) and scores every available therapist.

```typescript
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
      user: { select: { id: true, name: true }, include: { profile: { select: { gender: true } } } },
      onlineStatus: true,
      metrics: true,
    },
  });

  // 3. Score each therapist
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
    const nextSlot = await getNextAvailableSlot(t.id);
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
```

---

### SUBTASK B3: Create therapy.service.ts

**File:** `server/src/services/therapy.service.ts`
**Action:** CREATE new file
**Depends on:** A6, B1, B2

**Purpose:** Core session CRUD: booking, listing, cancelling, completing, rating. Uses availability and matching services.

**Key functions:**
- `bookSession(userId, therapistId, scheduledAt, bookingSource)` — creates session with correct type/pricing
- `bookInstantSession(userId)` — finds available-now therapist, books immediately
- `listUserSessions(userId, status?, page, pageSize)` — paginated session list
- `listTherapistSessions(therapistId, status?, page, pageSize)` — therapist's sessions
- `getSessionDetail(sessionId, requesterId)` — full session detail with access control
- `cancelSession(sessionId, cancelledBy, reason)` — cancel with business rules
- `rescheduleSession(sessionId, newTime, requesterId)` — reschedule
- `startSession(sessionId, therapistId)` — mark IN_PROGRESS
- `completeSession(sessionId, therapistId, notes)` — mark COMPLETED
- `markNoShow(sessionId, therapistId)` — mark NO_SHOW
- `rateSession(sessionId, userId, rating, feedback)` — post-session rating
- `getTherapistDashboard(therapistId)` — today's sessions, stats, earnings
- `getTherapistClients(therapistId)` — client list with history
- `getUserPricingStage(userId)` — returns "discovery" | "pay_as_you_like" | "standard"

**Business rules:**
- `bookSession`: Check user hasn't exceeded 3 active therapists. Verify slot available. Auto-detect session type from TherapyJourney.completedSessionCount. Discovery = 15 min, others = 45 min. Create TherapyJourney if it doesn't exist.
- `cancelSession`: Must be >2 hours before scheduledAt. Update journey.activeTherapistCount if this was user's last session with that therapist.
- `completeSession`: Increment journey.completedSessionCount. Update lastSessionAt. Trigger "rate session" nudge.
- `rateSession`: Update therapist's rolling average rating. Feed into metrics recalculation.
- `bookInstantSession`: Find first available-now therapist from matching results. Book for NOW + 5 minutes. Notify therapist via WebSocket.

**TherapyJourney auto-creation:** The TherapyJourney record should be created lazily on first `bookSession` call OR proactively when onboarding completes. Add a hook in the onboarding completion flow (e.g., when step 10 saves) that creates an empty TherapyJourney if one doesn't exist. This way the journey is always ready.

**Error codes (standardized):**
| Code | Meaning |
|------|---------|
| `THERAPY_001` | Therapist not found or unavailable |
| `THERAPY_002` | Slot not available (already booked) |
| `THERAPY_003` | Max 3 active therapists reached |
| `THERAPY_004` | Cannot cancel — less than 2 hours before session |
| `THERAPY_005` | Session not found or access denied |
| `THERAPY_006` | Invalid session status transition (e.g., completing a cancelled session) |
| `THERAPY_007` | Already rated this session |
| `THERAPY_008` | No therapists available for instant booking |
| `THERAPY_009` | Nudge not found or not owned by user |

**This file should be ~300-400 lines. Full implementation with proper error handling, transaction safety, and audit logging.**

---

### SUBTASK B4: Create nudge.service.ts

**File:** `server/src/services/nudge.service.ts`
**Action:** CREATE new file
**Depends on:** A6

**Purpose:** Generates, evaluates, and manages behavioral nudges.

**Key functions:**
- `evaluateNudges(userId)` — Check all trigger conditions for a user, create new nudges
- `getActiveNudges(userId)` — Return pending/shown nudges not in cooldown
- `dismissNudge(nudgeId, userId)` — Set dismissed + cooldown
- `markNudgeActed(nudgeId, userId)` — Mark as converted
- `generateNudgesForUser(userId)` — Run through all trigger rules

**Trigger rules:**
1. `first_session_free` — completedSessionCount === 0 AND onboardingComplete === true → "Your first call is free"
2. `low_mood_streak` — last 3 MoodEntry.score ≤ 3 → "We noticed you've been going through a rough patch"
3. `constellation_pattern` — (stub for now, will be wired to constellation) → "Your guide specializes in this pattern"
4. `session_reminder` — lastSessionAt > 14 days ago → "It's been a while. Quick check-in?"
5. `post_session_rate` — session completed within last 30 min, not rated → "How was your call?"
6. `astrology_interest` — user.interests includes "astrology" AND no astrology nudge in 7 days → "Your birth chart reveals…"
7. `pay_as_you_like_return` — completedSessionCount === 1 AND lastSessionAt > 7 days → "Your next call is pay-what-you-feel"

**Cooldowns:**
- Soft nudges (mood, patterns): 3 days after dismiss
- Booking nudges (first_session_free, session_reminder): 7 days after dismiss
- Post-session (rate): no repeat once acted or dismissed
- Crisis: non-dismissible, separate flow

---

### SUBTASK B5: Create therapist-pricing.service.ts

**File:** `server/src/services/therapist-pricing.service.ts`
**Action:** CREATE new file
**Depends on:** A6

**Purpose:** Computes dynamic pricing for therapists. Called by a nightly cron job.

**Algorithm:**
```
BASE_RATE = 500

experience_modifier   = min(years * 15, 300)
rating_modifier       = max((rating - 3.0) * 100, 0), capped at 200
retention_modifier    = min(clientReturnRate * 200, 200)
demand_modifier       = min(bookingFillRate * 150, 150)
quality_modifier      = min((avgSessionDuration / 50) * 75 + (1 - noShowRate) * 75, 150)

TOTAL = clamp(BASE_RATE + all_modifiers, 500, 1000)
```

**Functions:**
- `computeTherapistPrice(therapistId)` — compute and return price
- `recomputeAllPrices()` — loop all therapists, compute, update TherapistMetrics.computedPrice and TherapistProfile.pricePerSession

---

### SUBTASK B6: Create therapy.validator.ts

**File:** `server/src/validators/therapy.validator.ts`
**Action:** REWRITE existing file
**Depends on:** Nothing

**Validators needed (using Zod or express-validator):**

- `validateBookSession` — body: { therapistId: uuid, scheduledAt: ISO datetime (future), bookingSource?: string }
- `validateInstantSession` — body: {} (empty, just needs auth)
- `validateCancelSession` — body: { reason?: string }
- `validateRescheduleSession` — body: { newScheduledAt: ISO datetime (future) }
- `validateRateSession` — body: { rating: 1-5, feedback?: string(max 2000) }
- `validateCompleteSession` — body: { notes?: string(max 5000) }
- `validateUpdateAvailability` — body: { slots: [{ dayOfWeek: 0-6, startTime: HH:MM, endTime: HH:MM, slotDuration?: 15-120, breakAfterSlot?: 0-30, isActive: boolean }] }
- `validateUpdateTherapistProfile` — body: { bio?: string(max 2000), specializations?: string[], languages?: string[], ... }
- `validateOnlineStatusToggle` — body: { isOnline?: boolean, isAcceptingNow?: boolean }
- `validateListSessions` — query: { status?: SessionStatus, page?: number, pageSize?: 1-50 }
- `validateListTherapists` — query: { specialization?: string, approach?: CBT|HOLISTIC|MIXED, language?: string, minRating?: 0-5, sort?: string, page?, pageSize? }
- `validateGetSlots` — query: { fromDate?: ISO date, days?: 1-90 }

---

## PHASE C: BACKEND ROUTES & CONTROLLERS (Subtasks 26-42)

---

### SUBTASK C1: Rewrite therapy.ts routes — User endpoints

**File:** `server/src/routes/therapy.ts`
**Action:** REWRITE entire file
**Depends on:** B3, B6

Replace ALL the `501 Not Implemented` stubs with real route handlers using `requireAuth`, `requireRole`, validators, and controller functions.

**Route structure:**
```typescript
import { Router } from 'express';
import { requireAuth, requireRole, requireAnyRole } from '../middleware/auth.middleware.js';
import * as therapyController from '../controllers/therapy.controller.js';
import * as validators from '../validators/therapy.validator.js';

const router = Router();

// --- User-facing endpoints (require USER role) ---
router.get('/therapists', requireAuth, validators.validateListTherapists, therapyController.listTherapists);
router.get('/therapists/recommended', requireAuth, therapyController.getRecommendedTherapists);
router.get('/therapists/available-now', requireAuth, therapyController.getAvailableNowTherapists);
router.get('/therapists/:id', requireAuth, therapyController.getTherapistDetail);
router.get('/therapists/:id/slots', requireAuth, validators.validateGetSlots, therapyController.getTherapistSlots);

router.post('/sessions', requireAuth, validators.validateBookSession, therapyController.bookSession);
router.post('/sessions/instant', requireAuth, therapyController.bookInstantSession);
router.get('/sessions', requireAuth, validators.validateListSessions, therapyController.listSessions);
router.get('/sessions/:id', requireAuth, therapyController.getSessionDetail);
router.patch('/sessions/:id/cancel', requireAuth, validators.validateCancelSession, therapyController.cancelSession);
router.patch('/sessions/:id/reschedule', requireAuth, validators.validateRescheduleSession, therapyController.rescheduleSession);
router.post('/sessions/:id/rate', requireAuth, validators.validateRateSession, therapyController.rateSession);

// --- Nudge endpoints ---
router.get('/nudges', requireAuth, therapyController.getNudges);
router.patch('/nudges/:id/dismiss', requireAuth, therapyController.dismissNudge);
router.patch('/nudges/:id/acted', requireAuth, therapyController.markNudgeActed);

// --- Therapist-facing endpoints (require THERAPIST role) ---
router.get('/therapist/dashboard', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistDashboard);
router.get('/therapist/sessions', requireAuth, requireRole('THERAPIST'), validators.validateListSessions, therapyController.listTherapistSessions);
router.get('/therapist/clients', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistClients);
router.get('/therapist/clients/:id', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistClientDetail);
router.get('/therapist/availability', requireAuth, requireRole('THERAPIST'), therapyController.getTherapistAvailability);
router.put('/therapist/availability', requireAuth, requireRole('THERAPIST'), validators.validateUpdateAvailability, therapyController.updateTherapistAvailability);
router.patch('/therapist/online-status', requireAuth, requireRole('THERAPIST'), validators.validateOnlineStatusToggle, therapyController.updateOnlineStatus);
router.get('/therapist/profile', requireAuth, requireRole('THERAPIST'), therapyController.getOwnProfile);
router.put('/therapist/profile', requireAuth, requireRole('THERAPIST'), validators.validateUpdateTherapistProfile, therapyController.updateOwnProfile);
router.get('/therapist/metrics', requireAuth, requireRole('THERAPIST'), therapyController.getOwnMetrics);
router.post('/sessions/:id/start', requireAuth, requireRole('THERAPIST'), therapyController.startSession);
router.post('/sessions/:id/complete', requireAuth, requireRole('THERAPIST'), validators.validateCompleteSession, therapyController.completeSession);
router.post('/sessions/:id/no-show', requireAuth, requireRole('THERAPIST'), therapyController.markNoShow);

export default router;
```

---

### SUBTASK C2: Rewrite therapy.controller.ts — User session endpoints

**File:** `server/src/controllers/therapy.controller.ts`
**Action:** REWRITE entire file
**Depends on:** B1, B2, B3, B4, B6

Each controller function is a thin wrapper: validate → call service → format response.

**Functions to implement (complete list):**

1. `listTherapists` — calls prisma query with filters from query params
2. `getRecommendedTherapists` — calls `matching.service.getMatchedTherapists(userId, 5)`
3. `getAvailableNowTherapists` — calls `matching.service.getAvailableNowTherapists(userId)`
4. `getTherapistDetail` — single therapist by ID with availability preview
5. `getTherapistSlots` — calls `availability.service.getAvailableSlots`
6. `bookSession` — calls `therapy.service.bookSession`
7. `bookInstantSession` — calls `therapy.service.bookInstantSession`
8. `listSessions` — calls `therapy.service.listUserSessions`
9. `getSessionDetail` — calls `therapy.service.getSessionDetail`
10. `cancelSession` — calls `therapy.service.cancelSession`
11. `rescheduleSession` — calls `therapy.service.rescheduleSession`
12. `rateSession` — calls `therapy.service.rateSession`
13. `getNudges` — calls `nudge.service.getActiveNudges`
14. `dismissNudge` — calls `nudge.service.dismissNudge`
15. `markNudgeActed` — calls `nudge.service.markNudgeActed`
16. `getTherapistDashboard` — calls `therapy.service.getTherapistDashboard`
17. `listTherapistSessions` — calls `therapy.service.listTherapistSessions`
18. `getTherapistClients` — calls `therapy.service.getTherapistClients`
19. `getTherapistClientDetail` — calls `therapy.service.getTherapistClientDetail`
20. `getTherapistAvailability` — returns therapist's availability records
21. `updateTherapistAvailability` — replaces availability slots atomically
22. `updateOnlineStatus` — toggles online/accepting status
23. `getOwnProfile` — returns therapist's own profile
24. `updateOwnProfile` — updates bio, specializations, etc.
25. `getOwnMetrics` — returns performance metrics
26. `startSession` — calls `therapy.service.startSession`
27. `completeSession` — calls `therapy.service.completeSession`
28. `markNoShow` — calls `therapy.service.markNoShow`

**Each function pattern:**
```typescript
export const bookSession = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.auth!;
  const { therapistId, scheduledAt, bookingSource } = req.body;
  const session = await therapyService.bookSession(userId, therapistId, new Date(scheduledAt), bookingSource);
  sendSuccess(res, session, 201);
});
```

---

## PHASE D: FRONTEND API SERVICE (Subtasks 43-48)

---

### SUBTASK D1: Create therapy.api.ts frontend service

**File:** `src/services/therapy.api.ts`
**Action:** CREATE new file
**Depends on:** Phase C (backend routes working)

**Purpose:** TypeScript API client for all therapy endpoints. Uses the existing `apiService` from `src/services/api.service.ts`.

**Functions:**
```typescript
import { apiService } from './api.service';

// Types (import from src/types/therapy.types.ts or define inline)
export interface TherapistCard { ... }
export interface SessionDetail { ... }
export interface TimeSlot { ... }
export interface NudgeItem { ... }

export const therapyApi = {
  // Discovery
  getRecommendedTherapists: () => apiService.get('/therapy/therapists/recommended'),
  getAvailableNowTherapists: () => apiService.get('/therapy/therapists/available-now'),
  listTherapists: (params: { specialization?: string; language?: string; sort?: string; page?: number }) =>
    apiService.get('/therapy/therapists', { params }),
  getTherapist: (id: string) => apiService.get(`/therapy/therapists/${id}`),
  getTherapistSlots: (id: string, fromDate?: string, days?: number) =>
    apiService.get(`/therapy/therapists/${id}/slots`, { params: { fromDate, days } }),

  // Sessions
  bookSession: (data: { therapistId: string; scheduledAt: string; bookingSource?: string }) =>
    apiService.post('/therapy/sessions', data),
  bookInstantSession: () =>
    apiService.post('/therapy/sessions/instant', {}),
  listSessions: (params: { status?: string; page?: number; pageSize?: number }) =>
    apiService.get('/therapy/sessions', { params }),
  getSession: (id: string) => apiService.get(`/therapy/sessions/${id}`),
  cancelSession: (id: string, reason?: string) =>
    apiService.patch(`/therapy/sessions/${id}/cancel`, { reason }),
  rescheduleSession: (id: string, newScheduledAt: string) =>
    apiService.patch(`/therapy/sessions/${id}/reschedule`, { newScheduledAt }),
  rateSession: (id: string, data: { rating: number; feedback?: string }) =>
    apiService.post(`/therapy/sessions/${id}/rate`, data),

  // Nudges
  getNudges: () => apiService.get('/therapy/nudges'),
  dismissNudge: (id: string) => apiService.patch(`/therapy/nudges/${id}/dismiss`, {}),
  markNudgeActed: (id: string) => apiService.patch(`/therapy/nudges/${id}/acted`, {}),

  // Therapist dashboard
  getTherapistDashboard: () => apiService.get('/therapy/therapist/dashboard'),
  getTherapistSessions: (params?: { status?: string; page?: number }) =>
    apiService.get('/therapy/therapist/sessions', { params }),
  getTherapistClients: () => apiService.get('/therapy/therapist/clients'),
  getTherapistClientDetail: (id: string) => apiService.get(`/therapy/therapist/clients/${id}`),
  getTherapistAvailability: () => apiService.get('/therapy/therapist/availability'),
  updateTherapistAvailability: (slots: unknown[]) =>
    apiService.put('/therapy/therapist/availability', { slots }),
  updateOnlineStatus: (data: { isOnline?: boolean; isAcceptingNow?: boolean }) =>
    apiService.patch('/therapy/therapist/online-status', data),
  getTherapistProfile: () => apiService.get('/therapy/therapist/profile'),
  updateTherapistProfile: (data: Record<string, unknown>) =>
    apiService.put('/therapy/therapist/profile', data),
  getTherapistMetrics: () => apiService.get('/therapy/therapist/metrics'),
};
```

---

## PHASE E: FRONTEND WIRING — Replace Mock Data (Subtasks 49-65)

---

### SUBTASK E1: Wire HumanMatchCard.tsx to real API

**File:** `src/features/dashboard/components/widgets/HumanMatchCard.tsx`
**Action:** MODIFY — replace hardcoded "Dr. Aisha M." data with real API call
**Depends on:** D1

**What to change:**
1. Import `therapyApi` from `src/services/therapy.api`
2. Add `useEffect` to fetch `therapyApi.getRecommendedTherapists()` on mount
3. Display the top match result instead of hardcoded data
4. Show match score, specialization, match reasons
5. "Connect" button → navigate to booking flow with this therapist pre-selected
6. Show loading skeleton while fetching
7. Show empty state if no matches (e.g., "Complete your profile for personalized matches")

**User-facing language:** "Soul Guide" not "Therapist". Match card says "94% match with your emotional pattern" not "94% therapy match".

**Persuasion UX (hack buying psychology):**
- Show "Helped {totalSessions}+ people like you" beneath specializations
- Show "{clientReturnRate * 100}% of people return" as trust badge
- If next slot within 24h: "Available today" in green
- If online now: pulsing green dot + "Available Now"
- Micro-copy: "15 min free call — no commitment" to lower barrier

---

### SUBTASK E2: Wire PatternAlerts.tsx to real nudges API

**File:** `src/features/dashboard/components/widgets/PatternAlerts.tsx`
**Action:** MODIFY — replace hardcoded alerts with real nudge data
**Depends on:** D1

**What to change:**
1. Import `therapyApi`
2. Fetch `therapyApi.getNudges()` on mount
3. Map nudge types to alert styles:
   - `low_mood_streak` → warning style with red icon
   - `first_session_free` → CTA style with green "Book Free Call" button
   - `constellation_pattern` → insight style with purple icon
   - `session_reminder` → reminder style with blue icon
   - `astrology_interest` → mystic/cosmic style with purple/gold gradient, "Your birth chart reveals patterns your guide should see" + CTA "Talk to a Vedic Guide" (links to astrologer booking when available, for now links to general booking)
   - `pay_as_you_like_return` → warm encouragement style: "Your next call is pay-what-you-feel. No pressure."
4. Dismiss button calls `therapyApi.dismissNudge(id)`
5. CTA button calls `therapyApi.markNudgeActed(id)` then navigates to booking

---

### SUBTASK E3: Wire SessionsPage.tsx to real API

**File:** `src/pages/dashboard/SessionsPage.tsx`
**Action:** MAJOR REWRITE — replace all mock data
**Depends on:** D1

**What to change:**
1. Remove all hardcoded `MOCK_THERAPISTS` and `MOCK_SESSIONS` arrays
2. Therapist discovery section:
   - Fetch `therapyApi.getRecommendedTherapists()` for "Recommended for You" section
   - Fetch `therapyApi.listTherapists(filters)` for search/filter results
   - Fetch `therapyApi.getAvailableNowTherapists()` for "Available Now" section
3. Upcoming sessions:
   - Fetch `therapyApi.listSessions({ status: 'SCHEDULED' })`
   - Show real countdown timers
4. Session history:
   - Fetch `therapyApi.listSessions({ status: 'COMPLETED' })`
5. Booking flow:
   - Click therapist → fetch `therapyApi.getTherapistSlots(id)` → show slot picker
   - Select slot → call `therapyApi.bookSession(...)` → show confirmation
6. "Talk Now" button → `therapyApi.bookInstantSession()` → show loading → redirect to session

**Language updates:** Replace "Book a Therapy Session" with "Connect with a Soul Guide". Replace "Therapist" with "Wellness Guide" in all user-facing text.

**Therapist card persuasion elements (every card must include):**
- Match score badge: "94% match" in prominent position
- Social proof: "Helped {totalSessions}+ people" / "{returnRate}% return rate"
- Urgency: "Available today at {time}" or "Next slot in {X} hours"
- Scarcity: "Only {N} slots left this week" (compute from available slots)
- Trust signals: years of experience, qualifications snippet, star rating
- For discovery-eligible users: green "Free 15 min call" badge on every card

**Session type display standards:**
- Discovery: "Free • 15 min" (green badge)
- Pay-As-You-Like: "Pay what you feel • 45 min" (blue badge)
- Standard: "₹{price} • 45 min" (neutral badge)

**Discovery call special treatment:**
- If user.completedSessionCount === 0: Show prominent banner at top of page
  "Your first call is free — 15 minutes to see if it clicks. No commitment."
- After discovery call completes: Show conversion CTA inline
  "Want to go deeper? Your next call is pay-what-you-feel. You choose the price."

---

### SUBTASK E4: Wire ScheduledSessionsWidget.tsx to real API

**File:** `src/features/dashboard/components/widgets/ScheduledSessionsWidget.tsx`
**Action:** MODIFY — replace mock sessions with real data
**Depends on:** D1

**What to change:**
1. Fetch today's sessions from `therapyApi.listSessions({ status: 'SCHEDULED' })` filtered to today
2. Replace hardcoded names like "Karan Patel" with actual therapist names
3. "Start Call" button will be wired in BUILD 4 (Daily.co) — for now show disabled with "Coming Soon" tooltip
4. Show session type badge: "Discovery (Free)" / "Pay As You Like" / "Standard"

---

### SUBTASK E5: Build session booking modal/flow

**File:** `src/features/dashboard/components/BookingFlow.tsx` (NEW)
**Action:** CREATE new component
**Depends on:** D1, E3

**Purpose:** Step-by-step booking flow:
1. **Step 1: Select time** — Calendar view with available slots from API. Time picker showing next 7 days.
2. **Step 2: Confirm** — Show therapist info, time, session type (auto-detected from journey stage), price (₹0 for discovery, "You choose" for PAYL, ₹X for standard)
3. **Step 3: Booked!** — Confirmation screen with "Add to Calendar" link

**Triggered from:**
- HumanMatchCard "Connect" button (pre-selects therapist)
- SessionsPage therapist card click
- "Talk Now" (skips time selection, instant)

---

### SUBTASK E6: Wire Practitioner Dashboard to real API

**Files:**
- `src/features/dashboard/components/PractitionerHeader.tsx` — wire earnings, rating, sessions from API
- `src/features/dashboard/components/ScheduledSessionsWidget.tsx` — wire therapist's sessions
- `src/features/dashboard/components/ClientIntakeWidget.tsx` — wire to real client list
- `src/features/dashboard/components/SessionsRecordsWidgets.tsx` — wire to real session records

**Depends on:** D1

**What to change:**
1. PractitionerHeader: call `therapyApi.getTherapistDashboard()` → display real earnings, rating, total sessions
2. ScheduledSessionsWidget (practitioner view): call `therapyApi.getTherapistSessions({ status: 'SCHEDULED' })`
3. ClientIntakeWidget: call `therapyApi.getTherapistClients()`
4. Session records: call `therapyApi.getTherapistSessions({ status: 'COMPLETED' })`

---

### SUBTASK E7: Build availability management UI for therapists

**File:** `src/features/dashboard/pages/AvailabilityPage.tsx` (NEW or modify existing)
**Depends on:** D1

**What to build:**
- Weekly schedule grid showing Mon-Sun
- Each day has time range inputs (start time, end time)
- Toggle active/inactive per day
- "Save Availability" button → calls `therapyApi.updateTherapistAvailability(slots)`
- Online status toggle ("Available for instant calls") → calls `therapyApi.updateOnlineStatus(...)`

---

### SUBTASK E8: Build Session Detail Page

**File:** `src/pages/dashboard/SessionDetailPage.tsx` (NEW)
**Action:** CREATE new page component
**Depends on:** D1, E5

**Purpose:** Full session detail view at route `/dashboard/sessions/:id`. Notification links (`actionUrl`) point here.

**What to build:**
1. Fetch `therapyApi.getSession(id)` on mount
2. Display:
   - Therapist info card (name, photo, specializations, rating)
   - Session status badge (SCHEDULED / IN_PROGRESS / COMPLETED / CANCELLED / NO_SHOW)
   - Session type badge: "Discovery (Free • 15 min)" / "Pay As You Like • 45 min" / "₹{price} • 45 min"
   - Date/time with relative countdown ("in 3 hours", "2 days ago")
   - Match score and match reasons ("Why we matched you")
   - Booking source ("AI recommendation", "Talk Now", etc.)
3. Actions (based on status):
   - SCHEDULED: "Cancel" button, "Reschedule" button, "Add to Calendar" link
   - COMPLETED + not rated: Rating form (inline, not modal — see E9)
   - COMPLETED + rated: Show submitted rating with feedback
   - CANCELLED: Show cancellation reason + "Book Again" CTA
4. **Therapist-only view** (if logged-in user is the therapist):
   - Show client profile summary (struggles, goals, session history count)
   - Astrologer notes field (read-only for now, populated later)
   - Private notes text area → saved via separate API call (not in spec yet — add to therapy.service.ts)
   - "Start Session" / "Complete Session" / "No Show" action buttons

**Route registration:** Add to router config: `{ path: '/dashboard/sessions/:id', element: <SessionDetailPage /> }`

---

### SUBTASK E9: Build Post-Session Rating Component

**File:** `src/features/dashboard/components/SessionRating.tsx` (NEW)
**Action:** CREATE new component
**Depends on:** D1

**Purpose:** Reusable rating component used in Session Detail Page (E8) and triggered from nudge clicks.

**What to build:**
1. Star rating (1-5) — interactive, large tap targets for mobile
2. Optional text feedback field (textarea, max 2000 chars)
3. "Submit" button → calls `therapyApi.rateSession(sessionId, { rating, feedback })`
4. Pre-submission: Show prompt "How was your call with {guideName}?"
5. Post-submission: Show thank-you message + personalized follow-up:
   - Rating 4-5: "Glad it went well! Book your next call with {guideName}"
   - Rating 1-3: "We hear you. We'll use this to improve your matches."
6. Works as both:
   - Inline component (embedded in SessionDetailPage)
   - Modal (triggered from nudge card click or notification)

---

### SUBTASK E10: Build "Talk Now" Waiting UX

**File:** `src/features/dashboard/components/TalkNowFlow.tsx` (NEW)
**Action:** CREATE new component
**Depends on:** D1, F5

**Purpose:** When user clicks "Talk Now", show real-time connection flow.

**UX flow:**
1. **Searching state** (0-10 sec): "Finding you the perfect guide..." with animated dots/spinner
2. **Found state** (therapist accepted): Show matched therapist card with match score, "Connecting in 5 min..."
3. **Countdown state**: 5-min countdown timer. "Your guide is preparing for your call"
4. **Ready state**: "Start Call" button (disabled until BUILD 4 — show "Coming Soon" for now)
5. **Timeout state** (>60 sec, no match): "No guides available right now. Schedule a call instead?" with CTA to booking flow
6. **Error state**: "Something went wrong. Try again?" with retry button

**Triggered by:** "Talk Now" button in SessionsPage (E3) and HumanMatchCard (E1)
**API call:** `therapyApi.bookInstantSession()` → on success, show found state → listen for WebSocket updates

---

### SUBTASK E11: Build Therapist Instant Session Accept UI

**File:** `src/features/dashboard/components/InstantSessionAlert.tsx` (NEW)
**Action:** CREATE new component
**Depends on:** D1, F5

**Purpose:** Therapist-side UI when they receive an instant session request via WebSocket.

**What to build:**
1. Full-screen overlay/modal with audio chime
2. Show client info: name, struggles, match score
3. 60-second countdown: "Accept within 60 seconds"
4. "Accept" button → confirms session → navigates to session detail
5. "Decline" button → declines, system tries next available therapist
6. Auto-decline after timeout → same as decline

**Listens to:** WebSocket event `INSTANT_SESSION_REQUEST`
**Mount location:** Always mounted in practitioner dashboard layout (listens passively)

---

### SUBTASK E12: Register new frontend routes

**File:** `src/router/` — wherever routes are configured
**Action:** MODIFY — add routes for new pages
**Depends on:** E7, E8

**Routes to add:**
- `/dashboard/sessions/:id` → `<SessionDetailPage />`
- `/practitioner/availability` → `<AvailabilityPage />` (from E7)
- Verify existing routes for `/dashboard/sessions` still work

---

## PHASE F: NOTIFICATION INTEGRATION (Subtasks 66-70)

---

### SUBTASK F1: Send booking confirmation notification

**Where:** In `therapy.service.ts` → `bookSession()`
**After creating the session**, create a notification:
```typescript
await prisma.notification.create({
  data: {
    userId,
    type: 'SESSION_CONFIRMED',
    title: 'Session Booked!',
    message: `Your call with ${therapistName} is confirmed for ${formatDate(scheduledAt)}`,
    actionUrl: `/dashboard/sessions/${session.id}`,
    metadata: { sessionId: session.id, therapistName },
  },
});
// Also notify therapist
await prisma.notification.create({
  data: {
    userId: therapistUserId,
    type: 'SESSION_CONFIRMED',
    title: 'New Booking',
    message: `${userName} has booked a ${sessionType} call on ${formatDate(scheduledAt)}`,
    actionUrl: `/practitioner/sessions`,
    metadata: { sessionId: session.id, clientName: userName },
  },
});
```

---

### SUBTASK F2: Send cancellation notification

**Where:** In `therapy.service.ts` → `cancelSession()`
**Notify the other party** (if user cancels → notify therapist, if therapist cancels → notify user).

---

### SUBTASK F3: Send session reminder nudge (24h before)

**Where:** Create a function in `nudge.service.ts` called `generateSessionReminders()`
**Logic:** Find all sessions with `scheduleAt` between now+23h and now+25h. For each, check if a `session_reminder_24h` nudge already exists. If not, create one.
**Trigger:** Called by a cron job or on each nudge evaluation.

---

### SUBTASK F4: Send "rate your session" nudge (30 min after)

**Where:** In `therapy.service.ts` → `completeSession()`
**Logic:** After marking session COMPLETED, schedule a nudge:
```typescript
await prisma.userNudge.create({
  data: {
    userId: session.userId,
    nudgeType: 'post_session_rate',
    nudgeData: { sessionId: session.id, therapistName: therapist.user.name },
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
  },
});
```

---

### SUBTASK F5: WebSocket notification for "Talk Now" requests

**Where:** In `therapy.service.ts` → `bookInstantSession()`
**Logic:** After creating the instant session, push a WebSocket message to the matched therapist:
```typescript
websocketService.sendToUser(therapistUserId, {
  type: 'INSTANT_SESSION_REQUEST',
  data: { sessionId, clientName, clientStruggles, matchScore },
});
```

---

## PHASE G: TESTING & VERIFICATION (Subtasks 71-80)

---

### SUBTASK G1: Test seed script
Run `npx tsx server/src/seeds/seed-therapists.ts` and verify 12 therapists in DB.

### SUBTASK G2: Test availability service
Write manual test: create a therapist with known availability, book a session, verify slot is excluded.

### SUBTASK G3: Test matching algorithm
Seed a user with specific struggles/preferences. Call matching API. Verify ordering makes sense.

### SUBTASK G4: Test booking flow
Book a discovery session → verify session type is "discovery", duration is 15 min, price is 0.

### SUBTASK G5: Test session lifecycle
Book → Start → Complete → Rate. Verify all status transitions work. Verify TherapyJourney increments.

### SUBTASK G6: Test pricing stage progression
User gets free discovery. Complete it. Next booking should be "pay_as_you_like". Complete it. Next should be "standard".

### SUBTASK G7: Test cancellation rules
Try cancelling <2h before. Should fail. Cancel >2h before. Should succeed.

### SUBTASK G8: Test 3-therapist limit
Book with 3 therapists. Try booking a 4th. Should be rejected.

### SUBTASK G9: Test nudge generation and dismissal
Create a user who completed onboarding but hasn't booked. Evaluate nudges. Should get `first_session_free`. Dismiss it. Re-evaluate. Should not appear for 7 days.

### SUBTASK G10: Test full frontend flow
Navigate to dashboard. See real recommended therapist. Click "Connect". See real time slots. Book. See confirmation. Check upcoming sessions widget.

---

## PHASE H: CLEANUP & POLISH (Subtasks 81-90)

---

### SUBTASK H1: Remove mock data from SessionsPage
Delete the `MOCK_THERAPISTS` and `MOCK_SESSIONS` constants entirely.

### SUBTASK H2: Remove mock data from HumanMatchCard
Delete hardcoded "Dr. Aisha M." data.

### SUBTASK H3: Remove mock data from ScheduledSessionsWidget
Delete hardcoded "Karan Patel" data.

### SUBTASK H4: Update user-facing text
Search entire `src/` for:
- "therapist" (user-facing) → "wellness guide" / "soul guide"
- "therapy session" → "wellness call" / "soul session"
- "book a session" → "connect with a guide"
Do NOT change backend code variable names. Only UI-facing text.

### SUBTASK H5: Add loading states
Every component that fetches data should show a skeleton/spinner while loading.

### SUBTASK H6: Add error states
Every component that fetches data should show a friendly error message if the API fails.

### SUBTASK H7: Add empty states
- No recommended therapists → "Complete your profile for personalized matches"
- No upcoming sessions → "Your journey begins with a free 15-minute call"
- No nudges → Show nothing (don't show empty nudge card)

### SUBTASK H8: Verify build passes
Run `npm run build` for both frontend and backend. Fix any TypeScript errors.

### SUBTASK H9: Run full lint
Fix any lint warnings introduced.

### SUBTASK H10: Verify no regressions
Test that auth, onboarding, health tools, and constellation still work.

---

## EXECUTION ORDER

```
A1-A5 → CAN BE DONE IN PARALLEL (all schema additions)
A6    → DEPENDS ON A1-A5 (migration)
A7    → DEPENDS ON A6 (verify types)
A8    → DEPENDS ON A6 (needs models)

B1    → DEPENDS ON A6 (availability service)
B2    → DEPENDS ON A6, B1 (matching service)
B3    → DEPENDS ON B1, B2 (therapy service)
B4    → DEPENDS ON A6 (nudge service)
B5    → DEPENDS ON A6 (pricing service)
B6    → NO DEPENDENCIES (validators)

C1    → DEPENDS ON B3, B6 (routes)
C2    → DEPENDS ON B1-B5, B6 (controller)

D1    → DEPENDS ON C1, C2 (frontend API)

E1-E7 → DEPENDS ON D1, CAN BE PARALLELIZED
E8    → DEPENDS ON D1, E5 (session detail page)
E9    → DEPENDS ON D1 (rating component, standalone)
E10   → DEPENDS ON D1, F5 (talk now waiting UX)
E11   → DEPENDS ON D1, F5 (therapist accept instant session UI)
E12   → DEPENDS ON E7, E8 (route registration for new pages)

F1-F5 → DEPENDS ON B3 (notification integration)

G1-G10 → DEPENDS ON ALL ABOVE (testing)

H1-H10 → DEPENDS ON E1-E12 (cleanup)
```

**Critical Path:** A1-A6 → B1 → B2 → B3 → C1 → C2 → D1 → E1-E12 → H1-H10
