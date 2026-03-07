# Soul Yatri — MVP Definition (Super In-Depth)

> Re-verification note (2026-03-07): this is a historical scope document from an MVP-first planning phase. It is useful for understanding the original sequencing logic, but it is not the current product strategy if the team is now building the full platform rather than optimizing for an MVP cut.

> **Document purpose**: This document defines a historical minimum-viable-product scope. It should not be treated as the single source of truth for the current build if the product strategy has moved to a full-platform roadmap.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [MVP vs Full Platform — Clear Line](#2-mvp-vs-full-platform--clear-line)
3. [MVP Phases (IN Scope)](#3-mvp-phases-in-scope)
4. [Post-MVP Phases (OUT of Scope)](#4-post-mvp-phases-out-of-scope)
5. [Per-Phase MVP Feature Subset](#5-per-phase-mvp-feature-subset)
6. [Complete MVP Screen Inventory](#6-complete-mvp-screen-inventory)
7. [MVP User Journeys](#7-mvp-user-journeys)
8. [MVP Acceptance Criteria](#8-mvp-acceptance-criteria)
9. [MVP Success Metrics & KPIs](#9-mvp-success-metrics--kpis)
10. [MVP Revenue Model](#10-mvp-revenue-model)
11. [MVP Launch Checklist](#11-mvp-launch-checklist)
12. [MVP Risk Register](#12-mvp-risk-register)
13. [Post-MVP Priority Roadmap](#13-post-mvp-priority-roadmap)
14. [MVP Timeline](#14-mvp-timeline)
15. [MVP Cost Budget](#15-mvp-cost-budget)

---

## 1. Executive Summary

**What is the Soul Yatri MVP?**

The MVP is the first launchable version of Soul Yatri — a mental health and wellness
platform that lets users:
- Sign up, complete onboarding, and get a personalized dashboard
- Book and attend therapy sessions via video call on the platform
- Interact with an AI wellness assistant 24/7 (with crisis detection)
- Get matched with astrologers for pre-session kundali insights
- Use health tools (mood tracker, meditation, breathing, journal)
- Pay securely via Razorpay (INR) or Stripe (international)

**What the MVP is NOT:**
- No blog system (Phase 9)
- No Soul Circle community (Phase 10)
- No courses platform (Phase 11)
- No e-commerce shop (Phase 12)
- No corporate/school system (Phase 15)
- No landing page 3D animations (Phase 18)
- No department dashboards (Phase 20)
- No SEO automation (Phase 21)
- No events system (Phase 22)
- No memberships (Phase 23)
- No NGO collaborations (Phase 24)
- No mobile app (Phases 26-31)

**MVP Target**: Launch within 8-10 weeks (Phases 1-8, 13-14, 16-17, 25)

**MVP Revenue Sources**: Therapy session fees (platform commission) + astrology consultation fees

---

## 2. MVP vs Full Platform — Clear Line

| Capability | MVP (Launch) | Full Platform (Post-MVP) |
|---|---|---|
| User auth (email + Google) | ✅ IN | ✅ |
| User onboarding (10 steps) | ✅ IN | ✅ |
| User dashboard | ✅ IN (core widgets only) | ✅ (all widgets) |
| Therapy booking | ✅ IN (basic matching) | ✅ (advanced matching + waitlist) |
| Video sessions | ✅ IN (Daily.co) | ✅ (+ recording consent, bandwidth detect) |
| Session transcription | ✅ IN (Whisper basic) | ✅ (+ fine-tuned model) |
| Post-session tasks | ✅ IN (therapist adds tasks) | ✅ (+ AI-suggested tasks) |
| AI voice assistant | ✅ IN (text chat + basic voice) | ✅ (+ advanced voice, memory) |
| Crisis/emergency detection | ✅ IN (keyword + pattern) | ✅ (+ ML behavior model) |
| Astrologer system | ✅ IN (kundali + predictions) | ✅ (+ brownie points, tiers) |
| Pre-session astro report | ✅ IN (basic) | ✅ (+ AI-analyzed + voting) |
| Therapist dashboard | ✅ IN (clients, appointments, notes) | ✅ (+ revenue, reviews, AI alerts) |
| Admin dashboard | ✅ IN (basic head office view) | ✅ (+ all 40+ sub-pages) |
| Health tools — mood tracker | ✅ IN | ✅ |
| Health tools — meditation | ✅ IN (timer + 3 guided) | ✅ (+ library, ambient sounds) |
| Health tools — breathing | ✅ IN (box breathing) | ✅ (+ 4 techniques) |
| Health tools — journal | ✅ IN (text only) | ✅ (+ rich text, prompts, AI analysis) |
| Notifications — in-app | ✅ IN | ✅ |
| Notifications — email | ✅ IN (transactional only) | ✅ (+ marketing, digest) |
| Notifications — push | ❌ OUT | ✅ |
| Payments — Razorpay (INR) | ✅ IN | ✅ |
| Payments — Stripe (intl) | ❌ OUT (MVP is India-first) | ✅ |
| Multi-currency | ❌ OUT | ✅ (8 currencies) |
| Blog system | ❌ OUT | ✅ |
| Soul Circle (community) | ❌ OUT | ✅ |
| Courses platform | ❌ OUT | ✅ |
| Soul Shop (e-commerce) | ❌ OUT | ✅ |
| Corporate system | ❌ OUT | ✅ |
| Landing 3D animations | ❌ OUT (clean CSS only) | ✅ (Three.js, WebGL) |
| About us / careers pages | ❌ OUT | ✅ |
| Department dashboards | ❌ OUT | ✅ |
| SEO automation | ❌ OUT | ✅ |
| Soul Events | ❌ OUT | ✅ |
| Memberships | ❌ OUT | ✅ |
| NGO collaborations | ❌ OUT | ✅ |
| Mobile app | ❌ OUT | ✅ |
| AI model fine-tuning | ❌ OUT | ✅ |
| In-session AI monitoring | ✅ IN (basic client mood) | ✅ (+ therapist fraud detect) |
| Personality report | ❌ OUT | ✅ |
| Dark mode | ❌ OUT | ✅ |
| Accessibility audit | ❌ OUT (use Radix defaults) | ✅ (full WCAG 2.1 AA) |

---

## 3. MVP Phases (IN Scope)

These phases MUST be fully completed before MVP launch:

| Phase | Name | Why MVP-Critical |
|---|---|---|
| **Phase 1** | Database & Auth Foundation | Can't do anything without auth |
| **Phase 2** | User Onboarding Flow | First-time user experience |
| **Phase 3** | User Dashboard | Central hub for all user actions |
| **Phase 4** | Therapy Booking & Sessions | **Core product** — this IS Soul Yatri |
| **Phase 5** | Video Calling & Recording | Therapy sessions happen on-platform |
| **Phase 6** | AI Voice Assistant | 24/7 support + crisis detection (safety) |
| **Phase 7** | Astrologer System | Key differentiator from competitors |
| **Phase 8** | Therapist Dashboard | Therapists need tools to serve clients |
| **Phase 13** | Payment Gateway | Must collect money to be a business |
| **Phase 14** | Admin Dashboard | Head office needs visibility (MVP subset) |
| **Phase 16** | Health Tools | Self-help features for engagement |
| **Phase 17** | Notifications | Users must know about appointments, alerts |
| **Phase 25** | In-Session AI Monitoring | Client safety during sessions (basic) |

**Total: 13 phases for MVP** (out of 31 total)

---

## 4. Post-MVP Phases (OUT of Scope)

These are explicitly NOT part of MVP. Do NOT start these until MVP launches:

| Phase | Name | Post-MVP Priority | Why Deferred |
|---|---|---|---|
| Phase 9 | Blog System | P1 (Week 1-2 post-launch) | SEO takes months to rank; launch first |
| Phase 10 | Soul Circle | P2 (Week 3-4) | Needs user base first |
| Phase 11 | Courses Platform | P3 (Month 2) | Content creation takes time |
| Phase 12 | Soul Shop | P4 (Month 2-3) | E-commerce is complex, not core |
| Phase 15 | Corporate System | P3 (Month 2) | B2B sales cycle is slow |
| Phase 18 | Landing Animations | P1 (Week 1-2) | Polish, not functionality |
| Phase 19 | About/Careers | P1 (Week 1) | Static pages, quick to add |
| Phase 20 | Dept Dashboards | P4 (Month 3) | Need employees first |
| Phase 21 | SEO Automation | P2 (Week 3-4) | Blog must exist first |
| Phase 22 | Soul Events | P3 (Month 2) | Need user base first |
| Phase 23 | Memberships | P2 (Week 3-4) | Revenue diversification |
| Phase 24 | NGO Collaborations | P5 (Month 4+) | Partnership dependent |
| Phase 26-31 | Mobile App | P3 (Month 2-4) | Web-first strategy |

---

## 5. Per-Phase MVP Feature Subset

Each MVP phase includes only essential features. Non-essential features within
a phase are deferred to "MVP+1" (first post-launch iteration).

---

### Phase 1: Database & Auth Foundation — MVP Subset

**MVP-IN:**
- User model (email, password, name, phone, role, avatar, isVerified, createdAt)
- RefreshToken model
- POST /api/v1/auth/register — email + password signup
- POST /api/v1/auth/login — email + password login
- POST /api/v1/auth/refresh — token refresh
- POST /api/v1/auth/logout — invalidate refresh token
- GET /api/v1/auth/me — get current user
- JWT access token (15min) + httpOnly refresh cookie (7 days)
- bcrypt password hashing (salt rounds: 12)
- Zod validation on all auth endpoints
- Rate limiting: 5 login attempts per 15 minutes per IP
- CORS configuration for soulyatri.com
- Error codes: AUTH_001 through AUTH_005

**MVP-OUT (defer to MVP+1):**
- Google OAuth login
- Phone OTP login
- Email verification flow (accept unverified for MVP)
- Password reset via email
- Account deletion workflow
- Multi-session management
- Login activity log

**Screens (4):**
1. Login page (email + password form)
2. Signup page (name, email, password, confirm password)
3. Loading/redirect after auth
4. Auth error page (invalid token, session expired)

**Tests required (MVP minimum):**
- Unit: password hashing, JWT generation, Zod schemas (5 tests)
- Integration: register → login → refresh → logout flow (3 tests)
- Edge: duplicate email, wrong password, expired token (3 tests)

---

### Phase 2: User Onboarding Flow — MVP Subset

**MVP-IN:**
- 10-step onboarding flow (all steps)
- Step 1: Welcome + name input
- Step 2: Date of birth (date picker)
- Step 3: Gender (select)
- Step 4: Location (city, state — text input, no map)
- Step 5: What brings you here (multi-select: anxiety, depression, stress, relationships, grief, trauma, self-growth, career, other)
- Step 6: How long struggling (select: recently, few months, 1+ years, always)
- Step 7: Previous therapy experience (yes/no + brief text)
- Step 8: Preferred therapist gender (any, male, female)
- Step 9: Preferred session time (morning, afternoon, evening, flexible)
- Step 10: Goals (multi-select: reduce anxiety, improve relationships, build confidence, heal trauma, find purpose, manage stress, other)
- Save progress to database after each step (resume if user leaves)
- POST /api/v1/users/onboarding — save onboarding data
- GET /api/v1/users/onboarding — get current progress
- Skip button on optional steps (steps 4, 7, 9)
- Progress bar showing step X of 10
- Framer Motion transitions between steps

**MVP-OUT (defer to MVP+1):**
- AI-analyzed struggle categories
- Personalized welcome video
- Birth chart generation during onboarding
- Language preference selection
- Timezone auto-detection
- Animated illustrations per step

**Screens (12):**
1. Step 1: Welcome + name
2. Step 2: Date of birth
3. Step 3: Gender
4. Step 4: Location
5. Step 5: Struggles selection
6. Step 6: Duration
7. Step 7: Previous therapy
8. Step 8: Therapist gender preference
9. Step 9: Session time preference
10. Step 10: Goals
11. Onboarding complete / success
12. Onboarding resume (returning user who didn't finish)

**Tests required (MVP minimum):**
- Unit: Zod validation per step, progress calculation (6 tests)
- Integration: save progress → resume flow (2 tests)
- E2E: complete onboarding 10-step flow (1 test)

---

### Phase 3: User Dashboard — MVP Subset

**MVP-IN:**
- Dashboard layout with sidebar navigation
- Welcome banner (personalized: "Good morning, {name}")
- Next appointment card (date, time, therapist name, "Join" button)
- Quick actions: Book Session, AI Assistant, Mood Check-in, Meditation
- Recent activity feed (last 5 items)
- Healing progress summary (sessions completed count, streak days)
- GET /api/v1/users/dashboard — aggregated dashboard data
- Responsive layout (desktop + mobile)
- Loading skeletons for each widget
- Empty states for new users ("No sessions yet — book your first!")

**MVP-OUT (defer to MVP+1):**
- Recommended courses widget
- Soul Circle activity widget
- Personality insights card
- Healing journey timeline
- Achievement badges
- Dark mode toggle
- Customizable widget layout

**Screens (6):**
1. Dashboard home (all widgets loaded)
2. Dashboard loading state (skeletons)
3. Dashboard empty state (new user)
4. Dashboard error state (API failure)
5. Dashboard mobile view
6. Profile dropdown (name, email, logout)

**Tests required (MVP minimum):**
- Unit: dashboard data aggregation, time-of-day greeting (3 tests)
- Integration: GET /dashboard returns correct shape (2 tests)

---

### Phase 4: Therapy Booking & Sessions — MVP Subset

**MVP-IN:**
- Therapist listing page (card grid: photo, name, specializations, rating, price)
- Therapist detail page (bio, qualifications, reviews summary, available slots)
- Booking flow: select therapist → choose date → choose time slot → confirm → pay
- Session model: id, userId, therapistId, astrologerId, scheduledAt, duration (50min), status, meetingLink, price, paymentId, notes, createdAt
- Therapist matching algorithm (basic): filter by specialization match to user's struggles + availability + rating sort
- Appointment statuses: scheduled → in-progress → completed → cancelled
- Cancel session (24hr before policy, refund to wallet)
- Reschedule session (1 reschedule allowed per session)
- Pre-session reminder: 24hr + 1hr before (via notification system)
- Astrologer auto-assignment: 3hrs before session, assign available astrologer
- GET /api/v1/therapy/therapists — list with filters
- GET /api/v1/therapy/therapists/:id — therapist detail
- GET /api/v1/therapy/therapists/:id/slots?date=YYYY-MM-DD — available slots
- POST /api/v1/therapy/sessions — book session
- PATCH /api/v1/therapy/sessions/:id — cancel/reschedule
- GET /api/v1/therapy/sessions — user's session list
- GET /api/v1/therapy/sessions/:id — session detail

**MVP-OUT (defer to MVP+1):**
- Waitlist when therapist is fully booked
- Therapist matching score explanation to user
- Session packages (buy 4, get 1 free)
- Recurring session booking
- Therapist favorites list
- Insurance integration
- Group therapy sessions

**Screens (14):**
1. Therapist listing (grid view)
2. Therapist listing (filters active)
3. Therapist listing loading skeleton
4. Therapist listing empty ("No therapists match your filters")
5. Therapist detail page
6. Therapist detail — reviews tab
7. Booking — select date
8. Booking — select time slot
9. Booking — confirm & pay
10. Booking success page
11. My sessions list (upcoming + past tabs)
12. Session detail page
13. Cancel session confirmation modal
14. Reschedule session (pick new slot)

**Tests required (MVP minimum):**
- Unit: matching algorithm, slot availability calculation, cancellation policy (6 tests)
- Integration: book → pay → confirm flow, cancel with refund (4 tests)
- E2E: complete booking flow (1 test)

---

### Phase 5: Video Calling & Session Recording — MVP Subset

**MVP-IN:**
- Daily.co video integration
- Pre-session lobby (camera/mic check, waiting room)
- Video call screen (2 participants: user + therapist)
- In-call controls: mute, camera on/off, end call
- Session timer (50 min countdown)
- Auto-end at 50 minutes with 5-min warning
- Session recording (with consent popup at start)
- Recording stored in S3/R2 (path: recordings/{sessionId}/{date}.webm)
- Post-session: Whisper transcription → key pointer extraction
- Transcription stored per session
- POST /api/v1/therapy/sessions/:id/join — get Daily.co room token
- POST /api/v1/therapy/sessions/:id/end — end session, trigger transcription
- GET /api/v1/therapy/sessions/:id/recording — get recording URL (signed, 24hr expiry)
- GET /api/v1/therapy/sessions/:id/transcription — get transcription

**MVP-OUT (defer to MVP+1):**
- Bandwidth detection & quality adjustment
- Screen sharing
- Chat within video call
- Session notes during call
- AI real-time emotion overlay
- Multi-participant calls (group therapy)
- Recording download by user
- Breakout rooms

**Screens (8):**
1. Pre-session lobby (camera/mic check)
2. Recording consent popup
3. Video call — active session
4. Video call — therapist camera off
5. Video call — connection lost/reconnecting
6. 5-minute warning popup
7. Session ended screen
8. Post-session summary (transcription key points)

**Tests required (MVP minimum):**
- Unit: timer logic, recording consent state machine (3 tests)
- Integration: join → record → end → transcription pipeline (2 tests)

---

### Phase 6: AI Voice Assistant — MVP Subset

**MVP-IN:**
- Chat interface (text input, message bubbles, typing indicator)
- GPT-4o integration for responses
- System prompt: empathetic wellness assistant, never diagnoses, always suggests professional help for serious issues
- Conversation memory: last 20 messages per session
- Crisis keyword detection: list of 50+ keywords/phrases — defined in `server/src/config/crisis-keywords.ts` (to be created in Phase 6). Examples: "suicide", "kill myself", "end my life", "self-harm", "want to die", "no reason to live", "overdose", "cut myself", "jump off", "hang myself", "not worth living", "better off dead", "can't go on", "give up on life", "hurt myself"
- Emergency flag: if crisis detected → immediate notification to admin + show crisis helpline numbers
- Conversation history stored permanently (per data retention policy)
- POST /api/v1/ai/chat — send message, get response (SSE streaming)
- GET /api/v1/ai/conversations — list user's conversations
- GET /api/v1/ai/conversations/:id — get full conversation
- POST /api/v1/ai/emergency-flag — manual flag by user ("I need help now")
- Rate limit: 100 messages per hour per user

**MVP-OUT (defer to MVP+1):**
- Voice input/output (Whisper + TTS)
- Advanced behavior pattern analysis
- Proactive check-ins ("Hey, you haven't logged mood in 3 days")
- Mood trend analysis from conversations
- Multi-language support
- Fine-tuned therapy-specific model
- Context from therapy session transcriptions

**Screens (6):**
1. AI chat — main interface
2. AI chat — typing/loading state
3. AI chat — crisis detected alert overlay
4. AI chat — emergency helpline numbers shown
5. AI chat — conversation history list
6. AI chat — empty state ("Start a conversation")

**Tests required (MVP minimum):**
- Unit: crisis keyword detection (100% recall required), rate limiting (5 tests)
- Integration: send message → get response → store conversation (3 tests)
- Critical: crisis detection must have 0 false negatives in test suite

---

### Phase 7: Astrologer System — MVP Subset

**MVP-IN:**
- Astrologer dashboard (assigned sessions, prediction form, client charts)
- Kundali chart display (basic — birth details → chart rendering)
- Pre-session prediction form: astrologer writes observations + predictions
- Prediction fields: area (career, relationships, health, mental state, spiritual), prediction text, severity (low/medium/high), estimated duration
- Predictions sent to therapist before session starts
- Post-session: therapist marks prediction as accurate/partially accurate/inaccurate
- GET /api/v1/astrology/sessions — astrologer's assigned sessions
- GET /api/v1/astrology/sessions/:id/kundali — client's kundali chart data
- POST /api/v1/astrology/sessions/:id/prediction — submit predictions
- GET /api/v1/therapy/sessions/:id/astro-report — therapist views predictions

**MVP-OUT (defer to MVP+1):**
- Parasara Light software integration (full dasha/subdasha)
- AI-analyzed kundali pointers
- Prediction voting system (multiple astrologers vote)
- Brownie point / tier system
- Direct client-astrologer booking
- Astrologer marketplace
- Detailed accuracy analytics

**Screens (8):**
1. Astrologer dashboard home
2. Assigned session detail
3. Kundali chart viewer
4. Prediction form
5. Prediction submitted success
6. Prediction history list
7. Accuracy feedback received notification
8. Astrologer loading state

**Tests required (MVP minimum):**
- Unit: kundali calculation from birth data (3 tests)
- Integration: submit prediction → therapist receives → marks accuracy (2 tests)

---

### Phase 8: Therapist Dashboard — MVP Subset

**MVP-IN:**
- Dashboard home: today's appointments, total clients, upcoming sessions
- Client list: name, next session, struggle areas, session count
- Client detail: onboarding data, session history, past transcription key points, astrologer predictions
- Appointment calendar (week view, using FullCalendar.js)
- Post-session: add tasks/homework for client (text list, due dates)
- Availability management: set weekly recurring availability slots
- GET /api/v1/therapy/therapist/dashboard — aggregated stats
- GET /api/v1/therapy/therapist/clients — client list
- GET /api/v1/therapy/therapist/clients/:id — client detail
- GET /api/v1/therapy/therapist/appointments — appointment list
- POST /api/v1/therapy/therapist/availability — set availability
- POST /api/v1/therapy/sessions/:id/tasks — add post-session tasks

**MVP-OUT (defer to MVP+1):**
- Revenue tracking & payout dashboard
- Client reviews & ratings display
- AI-powered "scope of improvement" suggestions
- Proactive client mood alerts
- Session notes rich text editor (Tiptap)
- Client personality report generation
- Performance analytics

**Screens (10):**
1. Therapist dashboard home
2. Client list
3. Client detail page
4. Client session history
5. Appointment calendar (week view)
6. Set availability page
7. Post-session task form
8. Astrologer prediction viewer (pre-session)
9. Therapist profile (own profile)
10. Dashboard loading state

**Tests required (MVP minimum):**
- Unit: availability slot generation, task validation (4 tests)
- Integration: set availability → client sees slots → book (2 tests)

---

### Phase 13: Payment Gateway — MVP Subset

**MVP-IN:**
- Razorpay integration (INR only for MVP)
- Payment flow: select service → review price → Razorpay checkout → webhook confirmation
- Transaction model: id, userId, amount, currency (INR), status, razorpayOrderId, razorpayPaymentId, type (therapy_session | astrology_session), refundId, createdAt
- Wallet/credits system for refunds (cancel session → credit to wallet)
- Payment history page for users
- POST /api/v1/payments/create-order — create Razorpay order
- POST /api/v1/payments/verify — verify payment signature (webhook)
- POST /api/v1/payments/refund — process refund to wallet
- GET /api/v1/payments/history — user payment history
- GET /api/v1/payments/wallet — wallet balance
- Razorpay webhook handler with signature verification
- Idempotent payment processing (no double charges)

**MVP-OUT (defer to MVP+1):**
- Stripe (international payments)
- Multi-currency (8 currencies)
- Subscription/membership payments
- Therapist/astrologer payout system
- Invoice PDF generation
- Payment analytics dashboard
- EMI / split payment options
- Coupon/promo codes

**Screens (6):**
1. Razorpay checkout overlay
2. Payment success page
3. Payment failed page
4. Payment history list
5. Wallet balance page
6. Refund confirmation modal

**Tests required (MVP minimum):**
- Unit: amount calculation, signature verification, idempotency (4 tests)
- Integration: create-order → verify → store transaction (3 tests)
- Critical: double-payment prevention (1 test)

---

### Phase 14: Admin Dashboard — MVP Subset

**MVP-IN:**
- Head office overview page: total users, total sessions, total revenue, active therapists, active astrologers, pending actions
- User management: list all users, view user detail, deactivate user
- Therapist management: list, approve/reject new therapists, view therapist detail
- Astrologer management: list, approve/reject, view detail
- Session overview: list all sessions (filters: date, status, therapist)
- Emergency alerts feed: crisis detections requiring human review
- Payment overview: total revenue, recent transactions
- Basic action log: who did what (admin actions logged)
- GET /api/v1/admin/dashboard — head office stats
- GET /api/v1/admin/users — paginated user list (search, filter)
- GET /api/v1/admin/users/:id — user detail (with sessions, payments)
- PATCH /api/v1/admin/users/:id — deactivate/reactivate user
- GET /api/v1/admin/therapists — therapist list
- PATCH /api/v1/admin/therapists/:id/approve — approve therapist
- GET /api/v1/admin/astrologers — astrologer list
- PATCH /api/v1/admin/astrologers/:id/approve — approve astrologer
- GET /api/v1/admin/sessions — session list
- GET /api/v1/admin/emergencies — crisis alerts
- GET /api/v1/admin/payments/overview — revenue summary
- GET /api/v1/admin/audit-log — action log

**MVP-OUT (defer to MVP+1):**
- Department dashboards
- Employee tracker
- Revenue breakdown by source
- Complaint management
- Blog moderation
- Community moderation
- Shop management
- Event management
- Membership management
- NGO management
- Platform health metrics
- Real-time WebSocket updates
- Export to CSV

**Screens (12):**
1. Head office overview (stats cards + charts)
2. User management list
3. User detail modal/page
4. Therapist management list
5. Therapist approval page
6. Astrologer management list
7. Astrologer approval page
8. Session overview list
9. Emergency alerts feed
10. Payment overview
11. Audit log
12. Admin loading state

**Tests required (MVP minimum):**
- Unit: stats aggregation, permission checks (3 tests)
- Integration: approve therapist → therapist can log in (2 tests)

---

### Phase 16: Health Tools — MVP Subset

**MVP-IN:**
- Mood tracker: daily mood check-in (1-10 scale + emoji + optional note)
- Mood history: calendar view showing daily mood entries
- Meditation: timer (5, 10, 15, 20 min) with bell sound at end
- 3 guided meditations (audio files, pre-loaded)
- Breathing exercise: box breathing (4-4-4-4 animated circle)
- Journal: text entry, date-stamped, list view of past entries
- POST /api/v1/health/mood — log mood
- GET /api/v1/health/mood?range=week|month — mood history
- GET /api/v1/health/meditation/tracks — guided meditation list
- POST /api/v1/health/meditation/log — log meditation session
- POST /api/v1/health/journal — create journal entry
- GET /api/v1/health/journal — list journal entries

**MVP-OUT (defer to MVP+1):**
- Mood trend analysis & charts
- AI mood insights ("You tend to feel low on Mondays")
- Meditation library (100+ tracks)
- Ambient sounds (rain, forest, ocean)
- Multiple breathing techniques (4-7-8, Wim Hof, Pranayama)
- Journal prompts (AI-generated)
- Journal sentiment analysis
- Sleep tracker
- Gratitude journal
- Habit tracker

**Screens (10):**
1. Health tools hub page
2. Mood check-in modal
3. Mood history calendar
4. Meditation timer page
5. Guided meditation player
6. Breathing exercise page (animated circle)
7. Journal entry form
8. Journal list (past entries)
9. Journal entry detail
10. Health tools loading state

**Tests required (MVP minimum):**
- Unit: mood scale validation, timer logic, breathing cycle timing (4 tests)
- Integration: log mood → fetch history → verify calendar (2 tests)

---

### Phase 17: Notifications & Real-time — MVP Subset

**MVP-IN:**
- In-app notification bell (unread count badge)
- Notification types: appointment_reminder (24hr, 1hr), session_completed, payment_received, crisis_alert (admin), therapist_approved, new_task_assigned
- Email notifications: transactional only (Resend.com — free tier)
  - Welcome email after signup
  - Appointment confirmation
  - Appointment reminder (24hr before)
  - Session completed + summary link
  - Payment receipt
  - Crisis alert to admin
- Notification preferences page (toggle on/off per type)
- GET /api/v1/notifications — paginated notification list
- PATCH /api/v1/notifications/:id/read — mark as read
- PATCH /api/v1/notifications/read-all — mark all as read
- GET /api/v1/notifications/preferences — get preferences
- PUT /api/v1/notifications/preferences — update preferences

**MVP-OUT (defer to MVP+1):**
- Push notifications (FCM)
- SMS notifications
- WebSocket real-time updates
- Notification digest (daily/weekly summary)
- Marketing emails
- Quiet hours setting
- Notification sound customization
- In-app toast notifications (real-time)

**Screens (4):**
1. Notification bell dropdown (recent 10)
2. All notifications page (paginated)
3. Notification preferences page
4. Email templates (6 templates — server-side)

**Tests required (MVP minimum):**
- Unit: notification creation, preference filtering (3 tests)
- Integration: book session → notification created → email sent (2 tests)

---

### Phase 25: In-Session AI Monitoring — MVP Subset (Basic)

**MVP-IN:**
- Basic client mood detection during video session (every 5 minutes via audio analysis)
- Mood score: 1-10 scale stored per session
- Crisis keyword detection in session audio (same keyword list as AI assistant)
- If crisis detected during session: alert therapist with in-call banner + flag for admin
- POST /api/v1/ai/session-monitor/start — start monitoring for session
- POST /api/v1/ai/session-monitor/audio-chunk — process audio chunk
- GET /api/v1/ai/session-monitor/:sessionId/report — get session mood report

**MVP-OUT (defer to MVP+1):**
- Video frame analysis (facial emotions)
- Therapist conduct monitoring
- Fraud detection
- Engagement scoring
- Speech pattern analysis
- Comprehensive post-session report
- Real-time emotion overlay on video

**Screens (2):**
1. Therapist in-call: mood indicator banner (low mood detected)
2. Post-session: basic mood timeline chart

**Tests required (MVP minimum):**
- Unit: crisis keyword detection in audio transcription (3 tests)
- Critical: 0 false negatives for crisis phrases (1 test)

---

## 6. Complete MVP Screen Inventory

Total MVP screens: **102 screens**

| Section | Screen Count | Screens |
|---|---|---|
| Auth | 4 | Login, Signup, Loading redirect, Auth error |
| Onboarding | 12 | Steps 1-10, Complete, Resume |
| User Dashboard | 6 | Home, Loading, Empty, Error, Mobile, Profile dropdown |
| Therapy Booking | 14 | Therapist list (3 states), Detail, Reviews, Booking (3 steps), Success, Sessions list, Session detail, Cancel, Reschedule |
| Video Call | 8 | Lobby, Consent, Active, Camera off, Reconnecting, Warning, Ended, Summary |
| AI Assistant | 6 | Chat, Loading, Crisis alert, Helplines, History list, Empty |
| Astrologer | 8 | Dashboard, Session detail, Kundali, Prediction form, Success, History, Accuracy notif, Loading |
| Therapist Dashboard | 10 | Home, Clients, Client detail, Session history, Calendar, Availability, Tasks, Astro predictions, Profile, Loading |
| Payments | 6 | Checkout, Success, Failed, History, Wallet, Refund modal |
| Admin | 12 | Overview, Users, User detail, Therapists, Therapist approval, Astrologers, Astrologer approval, Sessions, Emergencies, Payments, Audit log, Loading |
| Health Tools | 10 | Hub, Mood check-in, Mood calendar, Meditation timer, Guided player, Breathing, Journal form, Journal list, Journal detail, Loading |
| Notifications | 4 | Bell dropdown, All notifs page, Preferences, Email templates |
| AI Monitor | 2 | In-call mood banner, Post-session mood chart |
| **TOTAL** | **102** | |

---

## 7. MVP User Journeys

### Journey 1: New User → First Therapy Session (Critical Path)

```
1. User visits soulyatri.com → sees landing page
2. Clicks "Get Started" → Signup page
3. Enters name, email, password → creates account
4. Redirected to onboarding flow
5. Completes 10 onboarding steps (5-8 minutes)
6. Arrives at user dashboard (personalized greeting)
7. Clicks "Book Session" quick action
8. Sees therapist listing (filtered by their struggles from onboarding)
9. Clicks on a therapist → views detail page + reviews
10. Selects date → selects time slot → clicks "Confirm & Pay"
11. Razorpay checkout opens → pays ₹999 (example)
12. Payment success → appointment confirmed
13. Gets email confirmation + in-app notification
14. 24 hours before: reminder email + notification
15. 1 hour before: reminder notification
16. 3 hours before: astrologer receives assignment, writes predictions
17. Session time: clicks "Join Session" on dashboard
18. Pre-session lobby → camera/mic check → consent popup
19. Joins video call with therapist
20. AI monitors mood during session (background)
21. 45 minutes in: 5-minute warning popup
22. Session ends → transcription generated → key points extracted
23. Therapist adds post-session tasks/homework
24. User sees post-session summary with key points + tasks
25. User can view recording later from session history
```

**Estimated time**: 10 min (signup+onboard) + variable (booking) + 50 min (session)
**Touch points**: 7 screens minimum, 15 with sub-states

### Journey 2: User Needs Immediate Help (Crisis Path)

```
1. User opens AI Assistant from dashboard
2. Types distressed message containing crisis keywords
3. System immediately detects crisis → shows alert overlay
4. Alert shows: crisis helpline numbers (NIMHANS, Vandrevala, iCall)
5. System flags to admin dashboard → emergency alerts feed
6. AI responds with empathetic message + "Please reach out to these numbers"
7. Admin sees alert, reviews, takes action if needed
```

**Critical requirement**: Step 3 must happen in < 2 seconds. ZERO false negatives allowed.

### Journey 3: Therapist Daily Workflow

```
1. Therapist logs in → sees therapist dashboard
2. Views today's appointments (2 sessions scheduled)
3. Clicks first session → sees client detail
4. Views client's onboarding data, past session notes, astrologer predictions
5. Session time → joins video call
6. After session → adds post-session tasks for client
7. Reviews next client's astrologer predictions
8. Second session → same flow
9. End of day → sets availability for next week
```

### Journey 4: Astrologer Pre-Session Flow

```
1. Astrologer logs in → sees assigned sessions
2. System assigned a session 3 hours from now
3. Opens session → views client birth details + kundali chart
4. Analyzes chart → fills prediction form
5. Submits predictions (area, text, severity, duration)
6. Predictions delivered to therapist before session
7. After therapy session: therapist marks prediction accuracy
8. Astrologer sees accuracy feedback
```

### Journey 5: Admin Monitoring

```
1. Admin logs in → head office dashboard
2. Sees: 150 users, 23 sessions today, ₹45,000 revenue, 2 emergency alerts
3. Clicks emergency alerts → reviews crisis detections
4. Checks pending therapist applications → approves 1, rejects 1
5. Reviews session overview → all sessions normal
6. Checks payment overview → all transactions settled
7. Views audit log → confirms all admin actions logged
```

---

## 8. MVP Acceptance Criteria

The MVP is DONE when ALL of these pass:

### Functional Criteria

- [ ] User can sign up with email + password
- [ ] User can log in and receive JWT tokens
- [ ] User can complete 10-step onboarding
- [ ] User can resume onboarding if interrupted
- [ ] User sees personalized dashboard after onboarding
- [ ] User can browse therapist listing with filters
- [ ] User can view therapist detail page
- [ ] User can book a therapy session and pay via Razorpay
- [ ] User receives email + in-app confirmation after booking
- [ ] User receives reminders 24hr and 1hr before session
- [ ] Astrologer is auto-assigned 3hr before session
- [ ] Astrologer can view kundali and submit predictions
- [ ] Therapist receives astrologer predictions before session
- [ ] User and therapist can join video call via Daily.co
- [ ] Video session records with consent
- [ ] Session transcription is generated post-session
- [ ] Therapist can add post-session tasks for client
- [ ] User can view session recording and transcription
- [ ] AI assistant responds to text messages via GPT-4o
- [ ] Crisis keywords are detected in AI chat with 100% recall
- [ ] Emergency alerts appear on admin dashboard immediately
- [ ] User can log daily mood (1-10 scale)
- [ ] User can view mood history calendar
- [ ] User can use meditation timer (5/10/15/20 min)
- [ ] User can do box breathing exercise
- [ ] User can write journal entries
- [ ] User can cancel session 24hr before for wallet credit
- [ ] User can view payment history and wallet balance
- [ ] Admin can view head office dashboard with all stats
- [ ] Admin can list/view/deactivate users
- [ ] Admin can approve/reject therapist applications
- [ ] Admin can approve/reject astrologer applications
- [ ] Admin can view all sessions
- [ ] Admin can view emergency alerts
- [ ] Admin can view payment overview
- [ ] Admin can view audit log of all admin actions
- [ ] In-session AI monitors client mood from audio
- [ ] Notification preferences work (toggle on/off)

### Non-Functional Criteria

- [ ] Page load time < 3 seconds (Lighthouse performance > 80)
- [ ] Auth endpoints respond < 200ms (p95)
- [ ] Dashboard endpoint responds < 500ms (p95)
- [ ] AI chat first token streams < 2 seconds
- [ ] Video call connects < 5 seconds
- [ ] No 500 errors in 1 hour of testing
- [ ] All API endpoints have Zod input validation
- [ ] All API endpoints require authentication (except auth routes)
- [ ] No sensitive data in API responses (passwords, tokens)
- [ ] CORS configured for soulyatri.com only
- [ ] Rate limiting on auth endpoints (5/15min)
- [ ] Rate limiting on AI chat (100/hour)
- [ ] Payments are idempotent (no double charges)
- [ ] Razorpay webhook signature verified
- [ ] All admin actions logged with timestamp + actor

### Test Criteria (Definition of Done)

- [ ] 60+ automated tests passing (see per-phase test requirements)
- [ ] 0 TypeScript errors (tsc --noEmit passes)
- [ ] 0 ESLint errors (npm run lint:check passes)
- [ ] Frontend builds without errors (npm run build)
- [ ] Server builds without errors (cd server && npx tsc --noEmit)
- [ ] Crisis detection has 100% recall in test suite (0 false negatives)
- [ ] Payment flow tested with Razorpay test mode
- [ ] Video call tested with Daily.co test room

---

## 9. MVP Success Metrics & KPIs

### Launch Targets (First 30 Days)

| Metric | Target | How to Measure |
|---|---|---|
| Registered users | 100+ | Database count |
| Onboarding completion rate | > 70% | Step 10 completed / signups |
| First session booked | 30+ users | Booking count |
| Session completion rate | > 85% | Completed / booked sessions |
| AI assistant usage | 50+ conversations | Chat count |
| Mood tracker adoption | 40+ daily logs | Mood entries count |
| Revenue | ₹50,000+ | Razorpay dashboard |
| Crisis alerts handled | 100% within 30 min | Admin response time |
| App crash rate | < 0.1% | Error monitoring |
| User retention (day 7) | > 30% | Returning users / signups |

### Key Business Metrics

| Metric | Formula | Target |
|---|---|---|
| CAC (Customer Acquisition Cost) | Marketing spend / new users | < ₹500 |
| LTV (Lifetime Value) | Avg revenue per user × avg lifetime | > ₹5,000 |
| LTV:CAC ratio | LTV / CAC | > 3:1 |
| Session GMV | Total session payments | ₹1,00,000+ / month |
| Platform commission | 20% of session fee | ₹20,000+ / month |
| NPS (Net Promoter Score) | User survey | > 40 |

---

## 10. MVP Revenue Model

### Revenue Streams (MVP Only)

| Stream | Model | Price Range | Commission |
|---|---|---|---|
| Therapy sessions | Per-session fee | ₹500 - ₹2,500 | 20% platform fee |
| Astrology consultations | Per-session fee | ₹300 - ₹1,000 | 20% platform fee |
| AI assistant | Free (included) | ₹0 | Drives engagement |
| Health tools | Free (included) | ₹0 | Drives retention |

### Revenue Projection (First 3 Months)

```
Month 1 (soft launch):
  - 50 therapy sessions × ₹1,000 avg = ₹50,000 GMV
  - Platform commission (20%) = ₹10,000
  - 20 astrology sessions × ₹500 avg = ₹10,000 GMV
  - Platform commission (20%) = ₹2,000
  - Total revenue: ₹12,000

Month 2 (growth):
  - 150 therapy sessions × ₹1,000 avg = ₹1,50,000 GMV
  - Platform commission = ₹30,000
  - 60 astrology sessions × ₹500 avg = ₹30,000 GMV
  - Platform commission = ₹6,000
  - Total revenue: ₹36,000

Month 3 (traction):
  - 400 therapy sessions × ₹1,000 avg = ₹4,00,000 GMV
  - Platform commission = ₹80,000
  - 150 astrology sessions × ₹500 avg = ₹75,000 GMV
  - Platform commission = ₹15,000
  - Total revenue: ₹95,000
```

### Costs (MVP Monthly)

| Item | Cost | Notes |
|---|---|---|
| Hosting (Railway/Render) | ₹2,500/month | Server + DB |
| Daily.co (video) | ₹0 (free tier 10K min) | Paid after 10K min/month |
| OpenAI API (GPT-4o) | ₹5,000-15,000 | ~$60-180, depends on usage |
| Cloudflare R2 (storage) | ₹500 | Recordings + assets |
| Resend (email) | ₹0 | Free tier (3K emails/month) |
| Domain (soulyatri.com) | ₹100/month | Already owned |
| **Total** | **₹8,100 - ₹18,100** | |

**Break-even**: Month 1 at lower cost range (₹12K revenue vs ₹8K cost = ₹4K profit). At upper cost range (₹18K), Month 1 is a ₹6K loss — break-even shifts to Month 2 when revenue scales to ₹36K.

---

## 11. MVP Launch Checklist

### Pre-Launch (1 Week Before)

- [ ] All 102 MVP screens implemented and tested
- [ ] All 60+ automated tests passing
- [ ] Razorpay production credentials configured
- [ ] Daily.co production account set up
- [ ] OpenAI API key set with spending limit
- [ ] Database backups configured (daily)
- [ ] Error monitoring set up (Sentry free tier)
- [ ] Domain soulyatri.com pointed to hosting
- [ ] SSL certificate active (https)
- [ ] CORS set to soulyatri.com only
- [ ] Rate limiting configured for all public endpoints
- [ ] Admin account created with strong password
- [ ] 3+ therapists onboarded and approved
- [ ] 2+ astrologers onboarded and approved
- [ ] Crisis helpline numbers verified and up-to-date
- [ ] Privacy policy page live
- [ ] Terms of service page live
- [ ] Cookie consent banner working

### Launch Day

- [ ] Deploy to production
- [ ] Verify all 5 user journeys work end-to-end
- [ ] Test payment with real ₹1 transaction → refund
- [ ] Test video call between 2 devices
- [ ] Test crisis detection → admin alert
- [ ] Monitor error logs for first 2 hours
- [ ] Share launch link with first 10 beta users

### Post-Launch (Week 1)

- [ ] Monitor daily: errors, response times, user signups
- [ ] Respond to all user feedback within 24 hours
- [ ] Fix any critical bugs same-day
- [ ] Review admin dashboard daily for emergency alerts
- [ ] Collect NPS from first 20 users
- [ ] Start Phase 19 (About/Careers — quick static pages)
- [ ] Start Phase 9 (Blog — for SEO)

---

## 12. MVP Risk Register

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| **Crisis not detected** | CRITICAL | Low (tested thoroughly) | 50+ keyword list, test with 100% recall requirement, admin manual review |
| **Payment double-charge** | HIGH | Low | Idempotency keys, Razorpay webhook dedup |
| **Video call failure** | HIGH | Medium | Daily.co has 99.99% uptime; fallback: reschedule |
| **AI generates harmful content** | HIGH | Low | System prompt constraints, content filtering, crisis override |
| **No therapists available** | HIGH | Medium | Onboard 5+ therapists before launch, waitlist feature in MVP+1 |
| **Data breach** | CRITICAL | Low | JWT httpOnly cookies, bcrypt, CORS, rate limiting, input validation |
| **Razorpay integration fails** | HIGH | Low | Test mode first, fallback: bank transfer |
| **OpenAI API downtime** | MEDIUM | Low | Graceful degradation: "AI is temporarily unavailable" message |
| **User drops during onboarding** | MEDIUM | Medium | Save progress per step, resume later |
| **Low initial traffic** | MEDIUM | High | SEO blog (Phase 9 post-launch), social media, word of mouth |

---

## 13. Post-MVP Priority Roadmap

After MVP launches, add features in this order:

### Sprint 1 (Week 1-2 after launch): Quick Wins
- Phase 19: About Us + Careers pages (static, 2 days)
- Phase 18: Landing page polish + basic animations (3 days)
- Google OAuth login addition (1 day)
- Email verification flow (1 day)

### Sprint 2 (Week 3-4): SEO + Revenue
- Phase 9: Blog system (SEO starts ranking)
- Phase 23: Membership tiers (recurring revenue)
- Password reset flow
- Stripe integration (international payments)

### Sprint 3 (Month 2): Engagement
- Phase 10: Soul Circle community
- Phase 11: Courses platform
- Phase 15: Corporate wellness (B2B revenue)
- Advanced health tools (more meditations, breathing techniques)

### Sprint 4 (Month 2-3): Scale
- Phase 12: Soul Shop
- Phase 22: Soul Events
- Phase 20: Department dashboards
- Phase 21: SEO automation

### Sprint 5 (Month 3-4): Advanced
- Phase 24: NGO collaborations
- Phase 25 full: Complete AI monitoring (therapist fraud detection)
- Astrologer brownie points & tiers
- AI fine-tuning (Phase 30)

### Sprint 6 (Month 4-6): Mobile
- Phase 26-29: Mobile app design → development → launch

---

## 14. MVP Timeline

### Week-by-Week Schedule (8-10 Weeks)

```
WEEK 1-2: Foundation
  Phase 1: Database & Auth (5 days)
  Phase 13: Payment Gateway (3 days) — in parallel
  Phase 2: User Onboarding (4 days)

WEEK 3-4: Core Product
  Phase 3: User Dashboard (3 days)
  Phase 4: Therapy Booking (5 days)
  Phase 16: Health Tools (4 days) — parallel with Phase 4

WEEK 5-6: Video & AI
  Phase 5: Video Calling (5 days)
  Phase 6: AI Assistant (5 days)
  Phase 25: Basic AI Monitor (2 days) — after video

WEEK 7-8: Dashboards
  Phase 7: Astrologer System (4 days)
  Phase 8: Therapist Dashboard (4 days)
  Phase 17: Notifications (3 days)

WEEK 9: Admin + Integration
  Phase 14: Admin Dashboard MVP (4 days)
  Integration testing (all flows end-to-end)

WEEK 10: Launch Prep
  Bug fixes from integration testing
  Performance optimization
  Security audit
  Pre-launch checklist completion
  Soft launch to beta users
```

**Total estimated dev days**: ~52 days of work spread across 10 calendar weeks. Using AI agents reduces implementation time by ~30% (52 × 0.7 ≈ 36 days of actual coding effort), but calendar time remains 10 weeks due to testing, integration, and iteration between phases.

---

## 15. MVP Cost Budget

### One-Time Costs

| Item | Cost | Notes |
|---|---|---|
| Domain names (3) | Already owned | soulyatri.com, .in, .net |
| Razorpay activation | ₹0 | No setup fee |
| Daily.co account | ₹0 | Free tier |
| SSL certificate | ₹0 | Cloudflare/Let's Encrypt |
| **Total one-time** | **₹0** | |

### Monthly Recurring (MVP)

| Item | Cost (INR) | Notes |
|---|---|---|
| Hosting (Railway Pro) | ₹2,500 | Server + managed Postgres |
| Cloudflare R2 | ₹500 | Recording storage |
| OpenAI API | ₹5,000-15,000 | GPT-4o + Whisper usage |
| Resend email | ₹0 | Free tier (3K/month) |
| Sentry error tracking | ₹0 | Free tier |
| Daily.co video | ₹0 | Free tier (10K min/month) |
| **Total monthly** | **₹8,000-18,000** | |

### Budget Rule

```
RULE: Monthly costs must stay below 50% of monthly revenue.
If costs > 50% revenue → optimize (reduce OpenAI calls, compress recordings).
If costs > 100% revenue for 2 months → re-evaluate AI usage tier.
```

---

## Summary

```
MVP = 13 phases out of 31
MVP = 102 screens out of 510+
MVP = ~60 automated tests minimum
MVP = 8-10 weeks to build
MVP = ₹8-18K/month operating cost
MVP = Revenue from therapy + astrology session commissions (20%)
MVP = India-first (INR only via Razorpay)
MVP = Launch target: 100 users, 30 sessions, ₹50K GMV in first month
```

**RULE FOR ALL AI AGENTS**: If a task is not listed in the MVP-IN sections above,
do NOT build it. Check this document first. When in doubt, it's post-MVP.
