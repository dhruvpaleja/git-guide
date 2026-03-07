# BUILD 1: Therapy Booking & Sessions — COMPLETE SPEC

> **Status:** APPROVED — Ready for implementation
> **Last Updated:** 2026-03-07
> **Depends On:** Existing auth, onboarding, health-tools (all working)
> **Does NOT Include:** Daily.co video (BUILD 4), Payments (BUILD 5), Practitioner verification (BUILD 6)

---

## PRODUCT PHILOSOPHY

Soul Yatri does NOT sell therapy. Therapy is a taboo. Users resist it.

Instead, Soul Yatri sells:
- **"A conversation with someone who gets you"**
- **"Your wellness guide matched to your emotional DNA"**
- **"A 15-minute free discovery call to see if it clicks"**

Throughout the entire system, we avoid clinical language. No "therapy sessions", no "therapist", no "patient". Instead:
- **Therapist** → user-facing: **"Wellness Guide"** or **"Soul Guide"**
- **Therapy session** → **"Wellness Call"** / **"Soul Session"**
- **Book a session** → **"Connect with your guide"**
- **Patient** → **"Member"** / just their name

Backend code uses `therapist`/`session` internally. Only the frontend/APIs that face users use the rebranded terms.

---

## CORE DECISIONS (LOCKED)

### Pricing: 3-Stage Progressive Model (Per User Globally)
| Stage | Call # | Duration | Price | Purpose |
|-------|--------|----------|-------|---------|
| Discovery | 1st call ever | 15 min | FREE | Guide convinces user. Build trust. Safe space. |
| Pay-As-You-Like | 2nd call | 45 min | Min ₹99 | User sets price. Shows goodwill. Low barrier. |
| Standard | 3rd+ calls | 45 min | ₹500-1000 | Dynamic per-therapist pricing (algorithm-set) |

- Tracked **per user globally** (not per therapist pair).
- `user.completedSessionCount` determines which pricing stage.
- 0 completed = free discovery. 1 completed = pay-as-you-like. 2+ = standard.
- The ₹99 minimum for pay-as-you-like is low enough that nobody is blocked, but signals the service has value.
- During BUILD 1, **everything is free** (payments not wired). The session stage tracking is still built so it's ready.

### Dynamic Therapist Pricing Algorithm
Each therapist's `pricePerSession` is NOT manually set. It's computed:

```
BASE_RATE = ₹500

Modifiers (additive, each ₹0-₹500):
  + experience_modifier    → years * 15 (capped at ₹300)
  + rating_modifier        → (rating - 3.0) * 100 (capped at ₹200)
  + retention_modifier     → return_client_rate * 200 (capped at ₹200)
  + demand_modifier        → booking_fill_rate * 150 (capped at ₹150)
  + session_quality_score  → from session feedback/ratings (capped at ₹150)

TOTAL = clamp(BASE_RATE + all_modifiers, 500, 1000)
```

This is computed nightly via a cron job and stored on `TherapistProfile.pricePerSession`. Not computed on every request.

### Matching Priority — 3 Tiers
1. **AI-Matched Recommendation** — Top 3-5 ranked by matching algorithm. Shown with match score (e.g., "94% match"). Top 1 gets a spotlight card. Rest in a ranked list below.
2. **Available Now** — Therapists currently online and free. "Talk within 5 minutes" feature. System nudges the therapist with a notification. Works like a call + message request.
3. **Schedule Custom Time** — User picks date/time. System auto-matches the best available therapist for that slot. No manual assignment.

### Matching Algorithm (Weighted Score 0-100)
```
DIMENSION                   WEIGHT   SOURCE
─────────────────────────────────────────────
Struggle ↔ Specialization   30%      UserProfile.struggles ↔ TherapistProfile.specializations
Approach Compatibility       15%      UserProfile.therapistApproach ↔ TherapistProfile.approach
Language Match               15%      UserProfile.therapistLanguages ↔ TherapistProfile.languages
Gender Preference            10%      UserProfile.therapistGenderPref ↔ TherapistProfile user gender
Goals ↔ Expertise            10%      UserProfile.goals ↔ TherapistProfile.specializations
Success Rate (same issues)   10%      Completed sessions with same struggles + high ratings
Availability Proximity       5%       Next available slot within 24h gets bonus
Experience Tier              5%       Higher experience = slight bonus for complex cases
```

**Bonus modifiers** (applied after base score):
- Therapist is online right now: +3
- Therapist has handled 10+ sessions with this exact struggle combo: +5
- Therapist's return client rate (loyalty indicator): +2 per 10% above 50%

### Multiple Therapists
Users can work with **up to 3 therapists simultaneously**. Why:
- Different guides for different needs (one for anxiety, one for career, one for relationships)
- Reduces single-point-of-failure churn
- Increases session booking frequency
- Cross-sell: "Your anxiety guide recommends adding a career-focused guide"

### Nudge System (Behavioral Triggers)
| Trigger | Nudge Message | Timing |
|---------|--------------|--------|
| Onboarding complete, no booking | "Your first call is free — 15 minutes with a guide matched to you" | 2 hours after onboarding |
| Mood score ≤ 3 for 3+ consecutive days | "We noticed you've been going through a rough patch. [Name] specializes in exactly this" | Next app open |
| Constellation shows recurring friction node | "[Guide Name] has helped 200+ people with patterns like yours" | Dashboard nudge card |
| 14+ days since last session | "It's been a while. Quick 15-min check-in with [Guide Name]?" | Push notification + dashboard |
| Journal entry with crisis keywords | Immediate: "You're not alone. Talk to someone now" + crisis helpline | Real-time, non-dismissible for crisis |
| After completing a session | "How was your call? Rate [Guide Name]" | 30 min after session ends |
| User browses astrology content | "Your birth chart reveals interesting patterns. Talk to a Vedic guide?" | Dashboard nudge |
| Pay-as-you-like user hasn't returned | "Your next call is pay-what-you-feel. No pressure." | 7 days after 2nd session |

- Nudges are **dismissible** (except crisis). Dismissed nudges return after a cooldown (3 days for soft nudges, 7 days for booking nudges).
- Each nudge has a `nudgeId`, `dismissedAt`, `cooldownDays` tracked per user.

### Astrologer Input
- Stubbed as `astrologerNotes` field on Session model.
- Goes to therapist ONLY (pre-session prep material).
- Every user gets an astrologer notes placeholder (even if they skipped astrology in onboarding — we want the data eventually).
- Populated later when astrology system is built.

### Success Measurement for "Handled These Cases"
```
success_score = (
  avg_rating_for_specialization * 0.4 +
  completion_rate_for_specialization * 0.3 +
  client_return_rate * 0.3
)
```
- Builds over time from real sessions.
- For launch: seeded therapists get pre-set stats.

---

## DATABASE CHANGES (Prisma Schema Additions)

### New Models

```prisma
// Track user's therapy journey stage (free → pay-as-you-like → standard)
// Also serves as the nudge tracking system
model TherapyJourney {
  id                    String    @id @default(uuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  completedSessionCount Int       @default(0)   // Global counter for pricing stage
  activeTherapistCount  Int       @default(0)   // Current active therapists (max 3)
  firstSessionAt        DateTime?               // When user had their first session
  lastSessionAt         DateTime?               // Most recent session
  totalSpent            Int       @default(0)   // Total INR spent (for analytics)

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

// Therapist real-time online status and instant booking support
model TherapistOnlineStatus {
  id                String           @id @default(uuid())
  therapistId       String           @unique
  therapist         TherapistProfile @relation(fields: [therapistId], references: [id], onDelete: Cascade)

  isOnline          Boolean          @default(false)
  lastSeenAt        DateTime         @default(now())
  isAcceptingNow    Boolean          @default(false) // Available for "talk now"
  currentSessionId  String?                          // If in a session right now

  updatedAt         DateTime         @updatedAt
}

// Nudge tracking — what nudges have been shown, dismissed, acted on
model UserNudge {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  nudgeType       String    // "first_session_free", "low_mood", "constellation_pattern", "session_reminder", "astrology_upsell", etc.
  nudgeData       Json?     // Contextual data (therapist name, match score, trigger details)

  status          String    @default("pending")  // "pending", "shown", "dismissed", "acted", "expired"
  shownAt         DateTime?
  dismissedAt     DateTime?
  actedAt         DateTime?
  expiresAt       DateTime?

  cooldownUntil   DateTime? // Don't show again until this date

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId, status])
  @@index([nudgeType])
}

// Therapist performance metrics (computed nightly)
model TherapistMetrics {
  id                       String           @id @default(uuid())
  therapistId              String           @unique
  therapist                TherapistProfile @relation(fields: [therapistId], references: [id], onDelete: Cascade)

  // Per-specialization success tracking
  specializationStats      Json             @default("{}") // { "anxiety": { avgRating: 4.5, completedSessions: 45, returnRate: 0.7 }, ... }

  // Overall metrics
  avgRating                Float            @default(0)
  totalCompletedSessions   Int              @default(0)
  totalCancelledSessions   Int              @default(0)
  noShowRate               Float            @default(0)
  clientReturnRate         Float            @default(0)   // % of clients who book again
  avgSessionDuration       Float            @default(0)   // actual avg minutes
  bookingFillRate          Float            @default(0)   // % of available slots booked
  responseTime             Float            @default(0)   // avg seconds to accept "talk now" requests

  // Computed price (algorithm output)
  computedPrice            Int              @default(500)

  lastComputedAt           DateTime         @default(now())
  createdAt                DateTime         @default(now())
  updatedAt                DateTime         @updatedAt
}
```

### Modified Models

```prisma
// Session — add fields
model Session {
  // ... existing fields ...

  // NEW: Session type (discovery, pay-as-you-like, standard)
  sessionType       String    @default("standard")  // "discovery", "pay_as_you_like", "standard"
  priceAtBooking    Int       @default(0)            // Price locked at booking time
  userPaidAmount    Int?                              // For pay-as-you-like, what user chose to pay

  // NEW: Matching context
  matchScore        Float?                            // 0-100 match score at time of booking
  matchReason       String?                           // "AI-matched", "available-now", "custom-scheduled"
  bookingSource     String    @default("search")     // "ai_recommendation", "available_now", "search", "nudge", "reschedule"

  // NEW: Astrologer input (stub for now)
  astrologerNotes   String?                           // Pre-session notes from astrologer (populated later)

  // NEW: Post-session
  therapistPrivateNotes String?                       // Therapist-only notes (not visible to user)
}

// TherapistProfile — add relations
model TherapistProfile {
  // ... existing fields ...
  onlineStatus      TherapistOnlineStatus?
  metrics           TherapistMetrics?
}

// User — add relations
model User {
  // ... existing fields ...
  therapyJourney    TherapyJourney?
  nudges            UserNudge[]
}
```

---

## API ENDPOINTS (Complete List)

### Therapist Discovery & Matching
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/therapy/therapists` | USER | List therapists with match scores, filtering, sorting |
| GET | `/therapy/therapists/:id` | USER | Get single therapist profile with availability |
| GET | `/therapy/therapists/recommended` | USER | Top 5 AI-matched therapists for current user |
| GET | `/therapy/therapists/available-now` | USER | Therapists online and accepting instant calls |

### Session Booking & Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/therapy/sessions` | USER | Book a session (discovery/scheduled) |
| GET | `/therapy/sessions` | USER | List user's sessions (upcoming + past) |
| GET | `/therapy/sessions/:id` | USER/THERAPIST | Get session details |
| PATCH | `/therapy/sessions/:id/cancel` | USER/THERAPIST | Cancel a session |
| PATCH | `/therapy/sessions/:id/reschedule` | USER/THERAPIST | Reschedule to new time |
| POST | `/therapy/sessions/:id/start` | THERAPIST | Mark session as IN_PROGRESS |
| POST | `/therapy/sessions/:id/complete` | THERAPIST | Mark session as COMPLETED |
| POST | `/therapy/sessions/:id/no-show` | THERAPIST | Mark user as NO_SHOW |
| POST | `/therapy/sessions/:id/rate` | USER | Rate completed session (1-5 + feedback) |

### Instant "Talk Now"
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/therapy/sessions/instant` | USER | Request instant session with available therapist |

### Therapist Dashboard (THERAPIST role)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/therapy/therapist/dashboard` | THERAPIST | Dashboard stats (today's sessions, earnings, rating) |
| GET | `/therapy/therapist/sessions` | THERAPIST | Therapist's session list |
| GET | `/therapy/therapist/clients` | THERAPIST | Client list with session history |
| GET | `/therapy/therapist/clients/:id` | THERAPIST | Single client detail (profile, history, constellation stub) |
| GET | `/therapy/therapist/availability` | THERAPIST | Get own availability schedule |
| PUT | `/therapy/therapist/availability` | THERAPIST | Update availability schedule |
| PATCH | `/therapy/therapist/online-status` | THERAPIST | Toggle online/accepting-now status |
| GET | `/therapy/therapist/profile` | THERAPIST | Get own profile |
| PUT | `/therapy/therapist/profile` | THERAPIST | Update own profile |
| GET | `/therapy/therapist/metrics` | THERAPIST | View own performance metrics |

### Nudge System (USER)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/therapy/nudges` | USER | Get active nudges for dashboard |
| PATCH | `/therapy/nudges/:id/dismiss` | USER | Dismiss a nudge |
| PATCH | `/therapy/nudges/:id/acted` | USER | Mark nudge as acted on |

### Availability Slots
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/therapy/therapists/:id/slots` | USER | Get available time slots for a therapist (next 30 days) |

**Total: 26 endpoints**

---

## SEEDED DATA (For Launch)

Since real practitioners aren't onboarded yet, we seed 12 fake therapists:

| Name | Specializations | Approach | Languages | Experience | Rating |
|------|----------------|----------|-----------|------------|--------|
| Dr. Aisha Mehta | anxiety, corporate stress, burnout | CBT | english, hindi | 12yr | 4.9 |
| Dr. Rohan Sharma | depression, self-esteem, trauma | MIXED | english, hindi, marathi | 8yr | 4.7 |
| Dr. Priya Nair | relationships, couples, family | HOLISTIC | english, hindi, malayalam | 10yr | 4.8 |
| Dr. Karan Patel | stress, anger, addiction | CBT | english, hindi, gujarati | 6yr | 4.5 |
| Dr. Ananya Singh | grief, trauma, PTSD | MIXED | english, hindi | 15yr | 4.9 |
| Dr. Vikram Desai | career, confidence, self-discovery | CBT | english, hindi, marathi | 7yr | 4.6 |
| Dr. Meera Iyer | anxiety, depression, spiritual growth | HOLISTIC | english, hindi, tamil, kannada | 9yr | 4.7 |
| Dr. Arjun Kapoor | relationships, self-esteem, anger | MIXED | english, hindi | 5yr | 4.4 |
| Dr. Simran Kaur | anxiety, stress, better-sleep | HOLISTIC | english, hindi, punjabi | 8yr | 4.6 |
| Dr. Nisha Reddy | trauma, grief, depression | CBT | english, hindi, telugu | 11yr | 4.8 |
| Dr. Amit Joshi | addiction, anger, stress | MIXED | english, hindi, bengali | 13yr | 4.7 |
| Dr. Tara Menon | self-discovery, spiritual growth, relationships | HOLISTIC | english, hindi, malayalam | 7yr | 4.5 |

Each seeded with:
- 3-5 availability slots across the week
- Pre-set metrics (rating, sessions completed per specialization)
- Profile photo URLs (from Unsplash or placeholder)
- Bio text explaining their approach
- Online status randomized

---

## FILE STRUCTURE (What Gets Created/Modified)

```
server/
├── prisma/
│   └── schema.prisma                    ← MODIFY: Add new models + fields
│
├── src/
│   ├── routes/
│   │   └── therapy.ts                   ← REWRITE: All 26 endpoints
│   │
│   ├── controllers/
│   │   └── therapy.controller.ts        ← REWRITE: All handler functions
│   │
│   ├── services/
│   │   ├── therapy.service.ts           ← NEW: Core business logic
│   │   ├── matching.service.ts          ← NEW: Matching algorithm
│   │   ├── nudge.service.ts             ← NEW: Nudge generation + tracking
│   │   ├── availability.service.ts      ← NEW: Slot computation
│   │   └── therapist-pricing.service.ts ← NEW: Dynamic pricing algorithm
│   │
│   ├── validators/
│   │   └── therapy.validator.ts         ← REWRITE: All request validators
│   │
│   └── seeds/
│       └── seed-therapists.ts           ← NEW: 12 seeded therapists
│
src/
├── services/
│   └── therapy.api.ts                   ← NEW: Frontend API service
│
├── features/
│   └── dashboard/
│       └── components/
│           └── widgets/
│               ├── HumanMatchCard.tsx    ← MODIFY: Wire to real API
│               ├── PatternAlerts.tsx     ← MODIFY: Wire to real nudges
│               └── ScheduledSessionsWidget.tsx ← MODIFY: Wire to real sessions
│
├── pages/
│   └── dashboard/
│       └── SessionsPage.tsx             ← MODIFY: Wire to real API
```

---

## SUBTASK BREAKDOWN

See: `docs/execution/BUILD_1_SUBTASKS.md` for the complete 100+ subtask breakdown with self-contained prompts for each.
