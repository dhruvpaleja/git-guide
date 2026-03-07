# Soul Yatri — World-Class Recommendations

**Audit Date:** 2026-03-06  
**Auditor:** Forensic Audit Agent  
**Benchmark:** Calm + BetterHelp + Co–Star + Woebot + iCall + YourDOST  
**Current Overall Maturity:** 34/100  
**Target:** 95/100 (world-class, production, ₹499-1999/month worthy)

---

## What "World-Class" Means for Soul Yatri

Soul Yatri sits at the intersection of **mental wellness + Vedic astrology + therapy**. World-class here means:

1. **Trust first** — a user crying at 2 AM must feel safe, not confused
2. **Data richness** — every interaction is a training signal; we know each user better than they know themselves
3. **Practitioner excellence** — therapists and astrologers have better tools here than anywhere else in India
4. **Retention engine** — habit loops, streaks, reminders, personalized nudges that create daily stickiness
5. **Revenue efficiency** — every page is a conversion funnel; every feature is a monetization lever
6. **Zero-bug trust** — a mental health app with broken buttons is a liability, not a product

---

## Gap From Current State to World-Class

| Dimension | Current | Target | Gap |
|---|---|---|---|
| Security | 12/100 | 95/100 | CRITICAL — 4 exploits live right now |
| Backend completeness | 18/100 | 90/100 | 13 domains return 501 |
| Frontend data wiring | 30/100 | 90/100 | ~70% of pages show hardcoded data |
| UX quality | 52/100 | 90/100 | 6 dead CTAs, missing states everywhere |
| Design polish | 48/100 | 88/100 | Brand identity conflict, no premium feel |
| Data tracking / analytics | 5/100 | 95/100 | Zero analytics, zero event tracking |
| AI capabilities | 8/100 | 90/100 | API key not wired; no real AI in prod |
| Testing coverage | 15/100 | 85/100 | No server tests; CI silences failures |
| Infrastructure | 20/100 | 90/100 | In-memory everything; no Redis, no S3 |
| Monetization | 10/100 | 85/100 | Razorpay not wired; zero revenue flows |

---

## PRIORITY 1 — SECURITY (fix BEFORE any real user touches the app)

### REC-S-001: Remove Auth Bypass Default
- **Current:** `VITE_AUTH_BYPASS=true` in `.env.local`; `ProtectedRoute` returns `<Outlet/>` unconditionally when flag is true; ALL protected routes are public in any env where this env var isn't explicitly set to `false`
- **World-class:** ProtectedRoute must default to SECURE; bypass only works in local dev with explicit opt-in
- **Exact fix:**
  1. In `src/lib/runtime.flags.ts`: change default from `true` to `false`
  2. In `.env.local`: add comment `# Set to true ONLY for local dev, NEVER commit as true`
  3. In `src/router/index.tsx` ProtectedRoute: add `console.warn` if bypass active in non-dev
- **Files:** `src/lib/runtime.flags.ts`, `.env.local`
- **Effort:** 30 minutes
- **Impact:** Closes the biggest security hole in the codebase

### REC-S-002: Disable Dev Routes in Production
- **Current:** `enableDevRoutes` in `server/src/config/index.ts` resolves to `isDevelopment || isProduction` — literally always true; `GET /dev-helper/dev-create-user/:email/:password/:name` creates users via URL params with zero auth
- **World-class:** Dev routes only in `NODE_ENV=development`, completely removed from production build
- **Exact fix:**
  1. Fix condition: `enableDevRoutes: process.env.NODE_ENV === 'development'`
  2. Add integration test: assert `/dev-helper/dev-create-user` returns 404 in production config
- **Files:** `server/src/config/index.ts`
- **Effort:** 15 minutes
- **Impact:** Eliminates account-creation backdoor in production

### REC-S-003: Add Auth Middleware to Admin Router
- **Current:** `server/src/routes/admin.ts` mounts ~80 routes with zero auth middleware; any anonymous request can hit admin endpoints
- **World-class:** All admin routes require `requireAuth` + `requireRole('ADMIN')` middlewares
- **Exact fix:**
  1. In `server/src/routes/admin.ts`: add `router.use(requireAuth, requireRole('ADMIN'))` at the top
  2. Add superadmin sub-router: `router.use('/super', requireRole('SUPER_ADMIN'), superAdminRouter)`
- **Files:** `server/src/routes/admin.ts`, `server/src/middleware/auth.middleware.ts`
- **Effort:** 1 hour
- **Impact:** Prevents data breach when admin endpoints are implemented

### REC-S-004: Remove .env.local from Git
- **Current:** `.env.local` committed to repo; contains `JWT_SECRET`, database credentials, API keys
- **World-class:** All secrets in `.gitignore`; rotate all committed secrets immediately; use GitHub Secrets for CI
- **Exact fix:**
  1. `git rm --cached .env.local`
  2. Add `.env.local` to `.gitignore`
  3. Rotate `JWT_SECRET` and all API keys that were in the file
  4. Update `DEPLOYMENT.md` with environment setup instructions
- **Files:** `.gitignore`, `.env.local` (delete from git), rotate secrets
- **Effort:** 2 hours (including secret rotation)
- **Impact:** Closes credential exposure

### REC-S-005: Fix Rate Limiting Double-Mount
- **Current:** `routes/index.ts` mounts ALL routes under both `/api/v1` AND `/api`; rate limiters apply per-path, so a user can get 200 auth attempts per window by alternating paths
- **World-class:** Single canonical path; rate limiting on user ID not just IP
- **Exact fix:** Remove the duplicate `/api` mount; keep only `/api/v1`
- **Files:** `server/src/routes/index.ts`
- **Effort:** 30 minutes

### REC-S-006: Enforce Two-Factor Auth
- **Current:** `twoFactor` field stored in `UserSettings`; never read or enforced anywhere in auth flow
- **World-class:** If `twoFactor=true`, after password auth, require TOTP or SMS OTP before issuing access token
- **Exact fix:** Add `checkTwoFactor` step in `auth.controller.ts` login handler; implement TOTP via `otplib`
- **Files:** `server/src/controllers/auth.controller.ts`, `server/src/services/totp.service.ts` (new)
- **Effort:** 8 hours

---

## PRIORITY 2 — CORE BACKEND (blocking MVP revenue)

### REC-B-001: Wire Therapy Booking (0 → functional)
- **Current:** All therapy routes return 501
- **Required Prisma models:** `TherapistProfile`, `TherapistAvailability` (schema exists, no code), `Session` (partial)
- **Implementation:**
  1. Complete `TherapistAvailability` CRUD: POST slots, GET available slots by therapist+date, DELETE slot
  2. `POST /api/v1/therapy/sessions/book`: creates Session record, blocks slot, triggers email confirmation, creates Notification
  3. `GET /api/v1/therapy/sessions`: paginated list for user (upcoming/past)
  4. `PATCH /api/v1/therapy/sessions/:id/cancel`: with 24h cancellation policy enforcement
  5. `GET /api/v1/therapy/therapists`: list with filters (specialty, language, gender, price)
  6. `GET /api/v1/therapy/therapists/:id`: profile, availability, reviews
- **Effort:** 40 hours
- **Revenue unlock:** Direct — therapy sessions at ₹800-2500/session

### REC-B-002: Wire Razorpay Payments
- **Current:** `RAZORPAY_KEY_ID` commented in `.env.example`; payment routes return 501; `Payment` model exists in schema
- **Implementation:**
  1. `POST /api/v1/payments/create-order`: creates Razorpay order, stores pending Payment record
  2. `POST /api/v1/payments/verify`: verifies Razorpay signature, updates Payment to COMPLETED, triggers session booking confirmation
  3. `GET /api/v1/payments/history`: paginated payment history
  4. Add webhook handler for `payment.captured` / `payment.failed` events
  5. Frontend: add `razorpay-checkout.js` loader, payment success/failure screens
- **Effort:** 20 hours
- **Revenue unlock:** Core — zero revenue without this

### REC-B-003: Wire OpenAI SoulBot
- **Current:** `OPENAI_API_KEY` commented out; AI routes return 501; `AIConversation` model may need creation
- **Implementation:**
  1. Add `AIConversation` + `AIMessage` Prisma models
  2. `POST /api/v1/ai/chat`: streams GPT-4o-mini response; stores every message in DB (training data gold mine)
  3. System prompt engineering: include user's mood history, journal entries, astrological profile for hyper-personalization
  4. Crisis detection: scan every message for crisis keywords; if confidence > 0.85, add `CRISIS_ALERT` flag, notify admin, show crisis resources
  5. `GET /api/v1/ai/conversations`: history
  6. Frontend: real-time streaming with Server-Sent Events or WebSocket
- **Effort:** 24 hours
- **Data value:** Every conversation is a labeled training example for fine-tuning

### REC-B-004: Wire Email (Resend)
- **Current:** Console-only; no emails sent in production
- **Implementation:**
  1. `npm install resend` in server
  2. Create `server/src/services/email.service.ts` wrapping Resend SDK
  3. Trigger emails: registration welcome, email verification, password reset, session booking confirmation, session reminder (24h before), payment receipt, weekly mood report
  4. HTML templates using `@react-email/components` or simple inline HTML
- **Effort:** 12 hours
- **Impact:** Required for DPDPA compliance; massively improves session attendance rate

### REC-B-005: Migrate Storage to Cloudflare R2
- **Current:** Avatars stored on local disk at `/uploads/avatars/`; in-memory Map for other assets; loses all files on server restart
- **Implementation:**
  1. `npm install @aws-sdk/client-s3` (R2 is S3-compatible)
  2. Create `server/src/services/storage.service.ts` with `uploadFile`, `deleteFile`, `getSignedUrl`
  3. Update `users.controller.ts` avatar upload to use R2
  4. Add `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_R2_ACCOUNT_ID`, `CLOUDFLARE_R2_KEY`, `CLOUDFLARE_R2_SECRET` to env
- **Effort:** 8 hours

### REC-B-006: Migrate Queue to BullMQ + Upstash Redis
- **Current:** Synchronous in-memory job processor
- **Implementation:**
  1. `npm install bullmq ioredis` in server
  2. Create `server/src/queue/index.ts` with queue factory
  3. Migrate all jobs to BullMQ workers
  4. Use Upstash Redis free tier (`UPSTASH_REDIS_URL`)
- **Effort:** 16 hours

### REC-B-007: Add Astrology Engine
- **Current:** Constellation page uses dev mock fallback; astrology routes return 501
- **Implementation:**
  1. Integrate Prokerala Astrology API or AstroAPI.com for Kundli generation
  2. `POST /api/v1/astrology/kundli`: generates full birth chart from DOB+time+place
  3. `GET /api/v1/astrology/daily-panchang`: daily auspicious timings
  4. `POST /api/v1/astrology/compatibility`: birth chart compatibility between two users
  5. Store all charts in DB (`AstrologyChart` model) — never recompute, always serve from cache
  6. Astrologer prediction system with brownie points (`browniePoints` field already in schema)
- **Effort:** 32 hours

---

## PRIORITY 3 — DATA TRACKING (our biggest competitive moat)

> "Data is our money" — every user interaction is a training signal

### REC-D-001: Implement Comprehensive Event Tracking
Create `server/src/services/analytics.service.ts` — every user action logged to `AnalyticsEvent` model:

```
model AnalyticsEvent {
  id          String   @id @default(uuid())
  userId      String?
  sessionId   String   // browser session ID
  event       String   // e.g. "mood_logged", "session_booked", "ai_chat_started"
  properties  Json     // all context: page, component, value, duration
  deviceType  String   // mobile/desktop/tablet
  platform    String   // web/ios/android
  ipHash      String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

**Events to track (minimum 80):**
- `page_view` + `page_exit` + `time_on_page` for every route
- `mood_logged`, `mood_value`, `mood_note_added`
- `journal_created`, `journal_word_count`, `journal_tags_used`
- `meditation_started`, `meditation_completed`, `meditation_duration`, `meditation_type`
- `session_browsed`, `session_booked`, `session_cancelled`, `session_attended`, `session_rated`
- `therapist_profile_viewed`, `therapist_filter_applied`
- `ai_chat_started`, `ai_message_sent`, `ai_crisis_detected`, `ai_session_duration`
- `payment_initiated`, `payment_completed`, `payment_failed`, `payment_amount`
- `onboarding_step_completed`, `onboarding_abandoned_at_step`
- `notification_received`, `notification_clicked`, `notification_dismissed`
- `search_performed`, `search_result_clicked`
- `blog_read`, `blog_read_depth_percent`, `blog_time_spent`
- `cta_clicked`, `cta_location`, `cta_label`
- `error_encountered`, `error_type`, `error_page`
- `feature_discovered_first_time`
- `streak_milestone_reached`, `streak_broken`

**Effort:** 24 hours  
**Data value:** Foundation for all AI fine-tuning, churn prediction, A/B testing

### REC-D-002: User Behavioral Profile (ML Features)
Add to `UserProfile` model and compute nightly:

```
behavioralFeatures Json // {
  // Engagement
  avgSessionsPerWeek, avgMoodLogsPerWeek, avgJournalWordsPerEntry,
  preferredMeditationType, peakUsageHour, daysSinceLastLogin,
  // Mental health signals
  moodTrendSlope7d, moodTrendSlope30d, moodVariability,
  negativeJournalKeywordFrequency, crisisKeywordFrequency,
  // Therapy engagement
  therapySessionsCompleted, avgTherapistRating, cancellationRate,
  // Astrology engagement
  kundliViewedCount, dailyPanchangCheckedStreak,
  // Churn signals
  featureUsageDiversity, lastAIConversationDaysAgo, engagementTrend
}
```

**Effort:** 16 hours  
**Use cases:** Churn prediction, personalization engine, AI fine-tuning labeling

### REC-D-003: Session Transcript & AI Analysis
Every therapy/astrology session should be:
1. Transcribed by Whisper large-v3
2. Sentiment analyzed per speaker turn
3. Key themes extracted (anxiety, relationship, career, family, spiritual)
4. Progress indicators computed (vs previous sessions)
5. Stored in `SessionTranscript` model (encrypted at column level using `pgcrypto`)
6. Available to therapist for session notes; never to user by default

**Effort:** 20 hours  
**Data value:** Highest-quality labeled mental health data in India

---

## PRIORITY 4 — USER DASHBOARD (algorithms for retention)

### REC-U-001: Personalized Daily Brief
Every morning at 7 AM IST, generate per user:
- Today's mood prediction (based on 30-day trend + day of week + lunar calendar)
- Today's Panchang (auspicious timings, nakshatra, tithi)
- Personalized affirmation (generated by GPT-4o-mini based on user's struggles field)
- Recommended meditation (type + duration based on yesterday's mood)
- Upcoming session reminder if applicable
- One micro-challenge for the day

Algorithm: `DailyBrief` = `f(moodHistory30d, lunarPhase, upcomingSession, userProfile.struggles, userProfile.goals)`

### REC-U-002: Mood Intelligence Engine
Move beyond simple emoji logging:
1. **Sentiment analysis of journal entries** → secondary mood score (0-100) to cross-validate emoji selection
2. **Mood triggers identification**: correlate mood dips with day of week, time of month, session attendance, meditation frequency
3. **Personalized mood insights**: "Your mood is 23% lower on Mondays — here's what helps"
4. **Predictive alerts**: if mood trend is declining for 5+ days, auto-create notification to book therapy session
5. **Mood heatmap**: 365-day calendar view (GitHub contribution graph style)

### REC-U-003: Streak & Habit Engine
```
model UserStreak {
  userId        String
  habitType     String // mood_logging, meditation, journaling, therapy_attendance
  currentStreak Int
  longestStreak Int
  lastActivityDate DateTime
  milestones    Json // [{day: 7, achievedAt: date}, {day: 30, achievedAt: date}]
}
```

Milestone notifications: 3 days, 7 days, 14 days, 21 days, 30 days, 60 days, 100 days  
Visual: animated flame icon with streak count on dashboard  
Streak freeze: once per month, a user can freeze a streak (premium feature)

### REC-U-004: Progress Score (Soul Health Index)
A single number (0-100) computed from:
- Therapy session attendance rate (30%)
- Mood trend slope 30d (20%)
- Journal consistency (15%)
- Meditation frequency (15%)
- Onboarding completeness (10%)
- Community engagement (10%)

Display on dashboard as a radial progress gauge.  
Historical trend: shows improvement over time → most powerful retention signal.

### REC-U-005: Personalized Recommendations Engine
```
POST /api/v1/users/recommendations
```
Returns 6 cards personalized based on behavioral features:
- "Book with Dr. Priya — matches your anxiety focus and schedule"
- "Try 10-min breathwork — your mood spikes after it"
- "Read: Understanding Rahu-Ketu axis — based on your Kundli"
- "Join the stress management group — 4 people with similar struggles"

Algorithm: content-based filtering on `userProfile.struggles + moodHistory + sessionHistory`

---

## PRIORITY 5 — ASTROLOGER EXCELLENCE

### REC-A-001: Live Kundli Generation
- Full D1-D60 divisional charts
- Planetary positions with degrees + retrograde status
- Vimshottari dasha timeline (current + upcoming 5 years)
- Transit overlays (current planet positions on natal chart)
- Yogas identification (Raj Yoga, Gaj Kesari, Neech Bhang, etc.)
- Manglik status computation

### REC-A-002: Astrologer Performance Dashboard
```
model AstrologerMetrics {
  astrologerId          String
  date                  DateTime
  predictionsRecorded   Int
  predictionsVerified   Int
  accuracyRate          Float
  avgRating             Float
  sessionsCompleted     Int
  totalEarnings         Int // paise
  browniePoints         Int
  tier                  String // bronze/silver/gold/platinum/diamond
  responseTimeAvgMins   Int
  clientRetentionRate   Float
}
```

Real-time dashboard showing: earnings graph, accuracy trend, upcoming sessions, pending predictions to verify, tier progress bar.

### REC-A-003: Prediction Verification System
- When astrologer records prediction: topic + target date + predicted outcome + confidence (1-5)
- System auto-checks on target date + sends reminder to user to mark outcome
- User marks: accurate / partially accurate / inaccurate
- System updates `browniePoints`, `predictionAccuracyRate`, tier
- Leaderboard: top 10 astrologers by accuracy this month

### REC-A-004: Match & Compatibility Engine
- Kundli matching for marriage/partnership (36 gunas + Manglik compatibility)
- Detailed compatibility report: strengths, areas of friction, remedies
- Stored and shareable as PDF
- Monetizable: ₹199-499 per detailed report

---

## PRIORITY 6 — ADMIN EXCELLENCE (analytics + operations)

### REC-AD-001: Real Admin Dashboard
Wire all metrics to real aggregation queries:

```typescript
// server/src/controllers/admin.controller.ts
export const getDashboardMetrics = async () => ({
  users: {
    total: await prisma.user.count(),
    newToday: await prisma.user.count({ where: { createdAt: { gte: today() } } }),
    active30d: await prisma.user.count({ where: { lastLoginAt: { gte: thirtyDaysAgo() } } }),
    churnRisk: await prisma.user.count({ where: { lastLoginAt: { lt: sevenDaysAgo() }, createdAt: { gt: thirtyDaysAgo() } } })
  },
  revenue: {
    today: await prisma.payment.aggregate({ where: { createdAt: { gte: today() }, status: 'COMPLETED' }, _sum: { amount: true } }),
    mtd: ...,
    arr: ...
  },
  sessions: { completedToday, completedMtd, cancellationRate, avgRating },
  health: { moodEntriesLast24h, journalEntriesLast24h, meditationMinutesLast24h },
  crisisAlerts: { open, resolvedToday },
  topTherapists: [...],
  topAstrologers: [...]
})
```

### REC-AD-002: Content Moderation Queue
- AI-flag journal entries, confessionals, community posts for: crisis keywords, profanity, PII oversharing
- Admin queue: review flagged content, mark safe/escalate/remove
- Audit trail: every moderation action logged

### REC-AD-003: Financial Operations
- Practitioner payout management: monthly settlement, UPI/bank transfer
- Revenue split: platform takes 20-30%, practitioner gets 70-80%
- Tax deduction: 10% TDS on practitioner earnings > ₹30,000/year
- GST invoice generation: 18% GST on platform fees

---

## PRIORITY 7 — UX FIXES (quick wins for retention)

### REC-UX-001: Fix 6 Dead CTAs
- `src/pages/LandingPage.tsx`: 4× "Book Now" service cards → `<Button onClick={() => navigate('/therapists')}>Book Therapy Session</Button>`
- `src/pages/CareersPage.tsx`: "Apply" → `<Button onClick={() => window.open(applyLink, '_blank')}>Apply for {role.title}</Button>`
- `src/pages/CorporatePage.tsx`: "Request A Demo" → `<Button onClick={() => navigate('/contact?type=corporate-demo')}>Request a Demo</Button>`
- `src/pages/ContactPage.tsx`: form submit → add `onSubmit` handler

### REC-UX-002: Add Loading + Empty + Error States
Every API-backed page needs all three states:
- **Loading:** `<Skeleton>` component from `src/components/ui/skeleton.tsx`
- **Empty:** `<Empty>` component with illustration + CTA ("No journal entries yet. Write your first one →")
- **Error:** `<Alert variant="destructive">` with retry button

Pages missing states: Sessions, Connections, Constellation, AdminDashboard, MeditationPage, Notifications

### REC-UX-003: Improve Onboarding Funnel
- Add progress text ("Step 2 of 3 — almost there!") not just a progress bar
- Add motivational copy per step ("Tell us about yourself so we can match you with the right therapist")
- Save progress at each step (currently saves on submit only)
- Add "Skip for now" with reminder nudge from dashboard
- Target: increase onboarding completion rate from estimated 45% to 80%+

### REC-UX-004: Meditation Timer (Make It Work)
- Current: shows static timer UI; countdown doesn't function
- Fix: implement `useCountdown` hook with Web Audio API for gentle bell sounds at start/end
- Add ambient background audio selection (rain, forest, silence, tibetan bowls)
- After completion: auto-log meditation with actual duration to health-tools API

### REC-UX-005: Crisis Support Always Visible
- Add floating crisis button (bottom-right, subtle) on all authenticated pages
- On click: shows iCall (9152987821) and Vandrevala (1860-2662-345) immediately
- If AI detects crisis in chat: auto-surface modal with immediate call option
- Never hidden, never intrusive

---

## PRIORITY 8 — DESIGN POLISH (premium feel)

### REC-DS-001: Fix Brand Identity Conflict
- Current: code is black/teal; docs say purple/indigo gradient
- Decision needed: pick one and apply consistently
- Recommended: keep dark-first (works for late-night emotional browsing) but switch from pure black `#000` to `hsl(225, 25%, 7%)` (deep navy-indigo) — premium vs stark
- Update CSS custom property `--background` in `src/index.css`

### REC-DS-002: Add Trust Signals
- Therapist credential badges (RCI licensed, NIMHANS trained, etc.)
- "Your data is private" callout on health-tools pages
- "Licensed & Verified" badge on therapist cards
- Crisis resources in footer
- Privacy policy link prominently in auth flows

### REC-DS-003: Micro-Animations for Key Moments
- Mood logged: confetti burst (5 particles, 800ms, tasteful)
- Streak milestone: badge pop animation
- Session booked: calendar confirmation card slides up
- Payment success: checkmark drawing animation
- All using Framer Motion `AnimatePresence`

### REC-DS-004: Fix NotFoundPage
- Current: loads image from external Figma CDN URL (broken)
- Fix: download/create local SVG, place in `public/`, reference as `/404-illustration.svg`

---

## PRIORITY 9 — SEO & DISCOVERABILITY

### REC-SEO-001: Per-Page Meta Tags
```tsx
// src/hooks/useDocumentMeta.ts
export function useDocumentMeta({ title, description, keywords, ogImage }: MetaProps) {
  // Set <title>, <meta description>, <meta og:*>
}
```

All pages use `useDocumentTitle` already — extend to full Open Graph + Twitter Card meta.

### REC-SEO-002: Structured Data
- `Organization` schema on homepage
- `MedicalOrganization` schema (for mental health services)
- `FAQPage` schema on FAQ section
- `Service` schema for each therapy/astrology service
- `Person` schema for each therapist/astrologer profile

### REC-SEO-003: Sitemap + Robots
- Auto-generated `sitemap.xml` from route list
- `robots.txt` allowing all except `/dashboard`, `/admin`, `/api`
- Submit to Google Search Console

---

## PRIORITY 10 — TESTING TO 85% COVERAGE

### REC-T-001: Fix CI Lint Silencing
- `quality.yml` uses `npm run lint || true` — lint failures are silently ignored
- Fix: remove `|| true`; CI should fail on lint errors

### REC-T-002: Server Unit Tests
For each live controller, add unit tests:
- `auth.controller.test.ts`: register, login, refresh, logout, lockout after 5 fails
- `users.controller.test.ts`: profile CRUD, dashboard aggregation, onboarding steps
- `health-tools.controller.test.ts`: mood/journal/meditation CRUD
- `notifications.controller.test.ts`: list, mark-read, unread count

### REC-T-003: Integration Tests (API contract)
- Use `supertest` against Express app
- Cover all live endpoints: request shape → response shape → DB state
- Cover error cases: 400 (validation), 401 (unauth), 403 (wrong role), 404, 429 (rate limit)
- Target: 150+ integration tests

### REC-T-004: Playwright E2E Tests
- Extend existing suite to cover:
  - Full therapy booking flow (browse → select → book → pay → confirm)
  - AI chat (send message → receive response → see in history)
  - Onboarding all 10 steps
  - Mood/journal/meditation full CRUD
  - Admin: view dashboard metrics, manage users

---

## QUICK WINS (under 2 hours each, do these first)

| # | Win | File | Time |
|---|---|---|---|
| 1 | Fix `VITE_AUTH_BYPASS` default to `false` | `src/lib/runtime.flags.ts` | 10 min |
| 2 | Fix `enableDevRoutes` to dev-only | `server/src/config/index.ts` | 10 min |
| 3 | Add `requireAuth` to admin router | `server/src/routes/admin.ts` | 20 min |
| 4 | Remove `.env.local` from git | `.gitignore`, `git rm --cached` | 15 min |
| 5 | Fix 4 dead "Book Now" CTAs on LandingPage | `src/pages/LandingPage.tsx` | 30 min |
| 6 | Fix contact form submit button | `src/pages/ContactPage.tsx` | 20 min |
| 7 | Fix NotFoundPage broken Figma image | `src/pages/NotFoundPage.tsx` | 20 min |
| 8 | Remove duplicate `/api` mount | `server/src/routes/index.ts` | 10 min |
| 9 | Remove `|| true` from CI lint | `.github/workflows/quality.yml` | 5 min |
| 10 | Add crisis helpline to footer | `src/components/layout/Footer.tsx` | 30 min |
| 11 | Add loading skeleton to DashboardPage | `src/pages/DashboardPage.tsx` | 45 min |
| 12 | Make meditation timer functional | `src/pages/dashboard/MeditationPage.tsx` | 90 min |
| 13 | Add `POST /api/v1/ai/chat` (stub with real streaming) | `server/src/controllers/ai.controller.ts` | 2 hrs |
| 14 | Wire `onboardingComplete` nudge visibility correctly | `src/pages/DashboardPage.tsx` | 30 min |
| 15 | Add soul health index score to dashboard | `src/pages/DashboardPage.tsx` + `users.controller.ts` | 90 min |
| 16 | Fix `docker-compose.yml` DB credentials from `kimi/kimi` | `docker-compose.yml` | 5 min |
| 17 | Add `SUPER_ADMIN` guard to at least 1 super-admin endpoint | `server/src/routes/admin.ts` | 30 min |
| 18 | Delete `routes/test-new.ts` (duplicate of test.ts) | `server/src/routes/test-new.ts` | 5 min |
| 19 | Add `<title>` tags to all public pages | All `src/pages/*.tsx` public pages | 45 min |
| 20 | Add Sentry DSN to env (just init, no code change) | `server/src/index.ts`, `src/main.tsx` | 1 hr |

---

## 12-WEEK ROADMAP TO PRODUCTION-READY

| Week | Focus | Outcome |
|---|---|---|
| 1 | Security fixes (REC-S-001 to 006) | App is safe to show to anyone |
| 2 | Backend: therapy booking + payments | First INR revenue possible |
| 3 | Backend: email + storage migration | Professional operations |
| 4 | Frontend: wire therapy booking UI end-to-end | Users can book and pay |
| 5 | Backend: AI SoulBot + data tracking | AI live; every click tracked |
| 6 | Frontend: dashboard algorithms (mood intel, streak, progress score) | Retention engine live |
| 7 | Astrology engine + astrologer dashboard | Second revenue stream active |
| 8 | Admin dashboard (real metrics) + moderation | Operations manageable |
| 9 | UX polish: all loading/empty/error states, design fixes | Premium feel achieved |
| 10 | Testing: server unit + integration tests to 150+ | Production confidence |
| 11 | SEO, PWA, performance optimization | Organic traffic begins |
| 12 | Beta launch: 100 real users, monitoring live | Revenue, retention, data |

---

## Expected Outcomes After Full Implementation

| Metric | Current | After 12 weeks |
|---|---|---|
| Security score | 12/100 | 90/100 |
| Feature completeness | 18/100 | 75/100 (MVP complete) |
| Data richness | 5/100 | 85/100 |
| User retention (D30) | N/A | Estimated 45-60% |
| Therapist retention | N/A | Estimated 80%+ |
| Revenue readiness | 0% | 100% |
| AI training data | 0 records | 10,000+ labeled events/month |
| NPS (estimated) | N/A | 45-65 (world-class is 70+) |
