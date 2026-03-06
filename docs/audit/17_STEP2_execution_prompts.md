# STEP 2 — Full Execution Prompts (agentprompt.txt Compliant)

**Generated**: March 6, 2026  
**Format**: Every prompt follows the STEP 2 structure from agentprompt.txt  
**Companion**: [`16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md`](16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md) for algorithm specs, [`15_master_execution_roadmap.md`](15_master_execution_roadmap.md) for sequencing

---

## Table of Contents

1. [Auth Security Fix](#feature-001-auth-security-fix)
2. [Razorpay Payment Integration](#feature-002-razorpay-payment-integration)
3. [100ms Video Sessions](#feature-003-100ms-video-sessions)
4. [Transactional Email (Resend)](#feature-004-transactional-email-resend)
5. [Therapist Matching Algorithm](#feature-005-therapist-matching-algorithm)
6. [Therapist Dashboard Backend](#feature-006-therapist-dashboard-backend)
7. [AI Wellness Chat (SoulBot)](#feature-007-ai-wellness-chat-soulbot)
8. [Subscription Tiers & Billing](#feature-008-subscription-tiers--billing)
9. [Analytics Event Tracking](#feature-009-analytics-event-tracking)
10. [Mood Pattern Detection & AI Insights](#feature-010-mood-pattern-detection--ai-insights)
11. [Gamification (Streaks, Achievements, XP)](#feature-011-gamification-streaks-achievements-xp)
12. [Community Forum](#feature-012-community-forum)
13. [Astrologer System](#feature-013-astrologer-system)
14. [Blog CMS Backend](#feature-014-blog-cms-backend)
15. [Admin God-Mode Dashboard](#feature-015-admin-god-mode-dashboard)
16. [SEO Essentials](#feature-016-seo-essentials)
17. [Notification Intelligence](#feature-017-notification-intelligence)
18. [Google OAuth](#feature-018-google-oauth)
19. [Contact Form & Newsletter Wiring](#feature-019-contact-form--newsletter-wiring)
20. [Dead Code Cleanup](#feature-020-dead-code-cleanup)
21. [Course Platform](#feature-021-course-platform)
22. [Wellness Shop](#feature-022-wellness-shop)
23. [Corporate Wellness Module](#feature-023-corporate-wellness-module)
24. [NGO & Social Impact](#feature-024-ngo--social-impact)
25. [Events & Workshops](#feature-025-events--workshops)
26. [Constellation (Connections)](#feature-026-constellation-connections)
27. [Meditation Player & Content](#feature-027-meditation-player--content)
28. [Career Applications](#feature-028-career-applications)
29. [Crisis Detection System](#feature-029-crisis-detection-system)
30. [AI Session Monitor](#feature-030-ai-session-monitor)

---

# FEATURE 001: Auth Security Fix

## A. Current State
- `src/config/runtime.flags.ts` sets `VITE_AUTH_BYPASS=true` and `VITE_ENABLE_MOCK_AUTH=true` by default
- `src/context/AuthContext.tsx` contains hardcoded MOCK_USERS with test emails/passwords and btoa() token generation
- `server/src/lib/dev-login.ts` creates auth tokens without environment guard
- Production build would ship with mock auth enabled — **CRITICAL SECURITY VULNERABILITY**
- Key files: `src/config/runtime.flags.ts`, `src/context/AuthContext.tsx`, `server/src/lib/dev-login.ts`
- Blockers: None — this is a standalone fix

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | 70 |
| Backend | 80 |
| Database | 80 |
| Integrations | 0 |
| Cost Efficiency | 80 |
| Testing | 0 |
| Documentation | 30 |
| DevOps | 50 |
| Security | **10** |
| SEO | 0 |
| UI | 75 |
| UX | 60 |
| Overall Design | 70 |
| CTA and Buttons | 60 |
| Accessibility | 50 |
| Performance | 70 |
| Content/Copy | 60 |
| Conversion/Trust | 50 |
| Functionality | 40 |
| User Delight | 40 |
| Maintainability/Scalability | 60 |
| **Overall** | **52** |

## C. What Must Be Done To Reach 100/100
- **Security**: Flip all auth bypass defaults to false; gate behind `import.meta.env.DEV`
- **Security**: Remove hardcoded credentials from production bundles via dynamic import
- **Security**: Add production guard in dev-login.ts
- **Testing**: Add unit test that verifies production build contains no mock credentials
- **DevOps**: Add CI check that scans build output for test emails

## D. Execution Plan

### Batch 001-A: Fix Auth Defaults (Backend + Frontend)
- **Task 1**: Update `runtime.flags.ts` defaults to false
- **Task 2**: Gate MOCK_USERS behind `import.meta.env.DEV` with dynamic import
- **Task 3**: Add production guard to `dev-login.ts`
- **Dependencies**: None
- **Files**: `src/config/runtime.flags.ts`, `src/context/AuthContext.tsx`, `server/src/lib/dev-login.ts`
- **Done**: Production build has no mock auth, dev mode still works

### Batch 001-B: Verification & Test
- **Task 1**: Build production bundle and scan for "test.com", "mock", btoa tokens
- **Task 2**: Write test in `tests/auth-security.spec.ts` that checks build output
- **Dependencies**: Batch 001-A
- **Done**: CI-runnable test prevents regression

## E. AI Agent Prompt

### BATCH 001-A: Fix Auth Security Defaults

**PROMPT TITLE**: Harden auth bypass so production cannot accidentally use it

**OBJECTIVE**: Ensure all mock auth, bypass flags, and test credentials are completely unavailable in production builds, while remaining functional in development.

**READ FIRST**:
- `src/config/runtime.flags.ts` — current flag defaults (PRIORITY)
- `src/context/AuthContext.tsx` — mock users and auth logic (PRIORITY)
- `server/src/lib/dev-login.ts` — dev login endpoint (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 1 (data tracking context)
- `vite.config.ts` — build configuration

**DO NOT TRUST WITHOUT VERIFYING**:
- Any comments claiming "this is dev only" — verify with actual code guards
- Environment variable defaults — verify they default to SAFE values

**FILES YOU MAY EDIT**:
- `src/config/runtime.flags.ts`
- `src/context/AuthContext.tsx`
- `server/src/lib/dev-login.ts`

**FILES YOU MUST NOT EDIT UNLESS ABSOLUTELY REQUIRED**:
- `src/App.tsx`
- `src/main.tsx`
- `server/src/index.ts`
- `server/prisma/schema.prisma`
- Any route files

**IMPLEMENTATION REQUIREMENTS**:
1. In `runtime.flags.ts`:
   - Change `VITE_AUTH_BYPASS` default to `false`
   - Change `VITE_ENABLE_MOCK_AUTH` default to `false`
   - Add guard: `const isDev = import.meta.env.DEV`
   - Flags should only evaluate to `true` when BOTH the env var is explicitly set AND `isDev` is true
2. In `AuthContext.tsx`:
   - Wrap MOCK_USERS object in `if (import.meta.env.DEV)` block
   - Use dynamic import or conditional declaration so Vite tree-shakes mock data from production
   - The btoa() mock token generation must not exist in production bundle
3. In `dev-login.ts`:
   - Add at top of handler: `if (process.env.NODE_ENV === 'production') { return res.status(403).json({ error: 'Not available in production' }); }`
4. Error states: If someone tries to use mock auth in production, show "Authentication service unavailable" — not a detailed error
5. No UI changes needed

**SEQUENCE**:
1. Read all three files completely
2. Implement changes in `runtime.flags.ts` first
3. Implement changes in `AuthContext.tsx`
4. Implement changes in `dev-login.ts`
5. Run `npm run build` — verify success
6. Search dist/ output for "test.com", "mock@", btoa strings — should find NONE

**VALIDATION**:
```bash
# Frontend
npm run type-check
npm run lint:check
npm run build
# Search for leaked credentials in build:
grep -r "test.com" dist/ || echo "PASS: No test emails in build"
grep -r "MOCK_USERS" dist/ || echo "PASS: No mock users in build"
grep -r "btoa" dist/ || echo "PASS: No btoa tokens in build"

# Backend
cd server && npm run build
```

**DONE WHEN**:
- [x] All three files updated
- [x] `npm run build` succeeds with zero errors
- [x] Production build output contains NO test email addresses
- [x] Production build output contains NO MOCK_USERS reference
- [x] Dev mode still allows mock auth when env vars are explicitly set
- [x] `server/dist/` dev-login rejects in production mode

**HANDOFF NOTE**:
- No downstream dependencies
- This is safe to merge independently
- Update `docs/audit/_progress.json` after completion
- Next: Proceed to FEATURE 002 (Razorpay)

## F. Risks
- **Context loss**: Agent may not realize dynamic import is needed for tree-shaking — explicit in requirements
- **Regression**: Dev mode could break if guards are too aggressive — ensure DEV flag allows mock auth
- **Scope creep**: Don't refactor the entire auth system — just fix the safety defaults

---

# FEATURE 002: Razorpay Payment Integration

## A. Current State
- `payments.controller.ts` exists but returns 501 for all endpoints
- `payments.routes.ts` defines 25 routes (all stubbed)
- `Payment` model exists in Prisma with status enum (PENDING/COMPLETED/FAILED/REFUNDED)
- No Razorpay SDK installed
- No frontend checkout component
- Key files: `server/src/controllers/payments.controller.ts`, `server/src/routes/payments.routes.ts`, `server/prisma/schema.prisma`
- Blockers: None — Payment model already exists

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | 0 |
| Backend | 5 |
| Database | 75 |
| Integrations | 0 |
| Cost Efficiency | 50 |
| Testing | 0 |
| Documentation | 5 |
| DevOps | 50 |
| Security | 20 |
| SEO | N/A |
| UI | 0 |
| UX | 0 |
| Overall Design | 0 |
| CTA and Buttons | 0 |
| Accessibility | 0 |
| Performance | 50 |
| Content/Copy | 0 |
| Conversion/Trust | 0 |
| Functionality | 0 |
| User Delight | 0 |
| Maintainability/Scalability | 30 |
| **Overall** | **15** |

## C. What Must Be Done To Reach 100/100
- **Backend**: Install razorpay SDK, create payment service, implement create/verify/refund/webhook controllers
- **Frontend**: Create useRazorpay hook, checkout component, payment success/failure screens
- **Security**: HMAC signature verification, server-side amount validation, webhook signature verification, never expose secret key
- **Database**: Payment model exists — add Razorpay-specific fields (razorpayOrderId, razorpayPaymentId, razorpaySignature)
- **UI/UX**: Loading states during payment, success animation, failure with retry, receipt display
- **Testing**: Integration test with Razorpay test mode
- **Audit**: Log all payment events to AuditLog table

## D. Execution Plan

### Batch 002-A: Backend Payment Service
- **Task 1**: Install `razorpay` npm package
- **Task 2**: Create `server/src/services/payment.service.ts` with createOrder, verifyPayment, processRefund, handleWebhook
- **Task 3**: Add Razorpay fields to Payment model (migration)
- **Task 4**: Implement payments.controller.ts: POST /create, POST /verify, POST /webhook, POST /refund, GET /history
- **Dependencies**: None
- **Done**: All payment endpoints return real Razorpay data in test mode

### Batch 002-B: Frontend Checkout
- **Task 1**: Create `src/hooks/useRazorpay.ts` — dynamic script loader + checkout opener
- **Task 2**: Create `src/features/payments/CheckoutModal.tsx` — pre-checkout summary + Razorpay trigger
- **Task 3**: Create `src/features/payments/PaymentSuccess.tsx` and `PaymentFailure.tsx` screens
- **Task 4**: Wire into session booking flow (SessionsPage "Book" button → checkout)
- **Dependencies**: Batch 002-A (needs server endpoints)
- **Done**: User can complete a test payment end-to-end

## E. AI Agent Prompt

### BATCH 002-A: Backend Payment Service

**PROMPT TITLE**: Implement Razorpay payment backend (create/verify/refund/webhook)

**OBJECTIVE**: Create a fully functional payment backend that creates Razorpay orders, verifies payments via HMAC signature, handles webhooks, and processes refunds.

**READ FIRST**:
- `server/src/controllers/payments.controller.ts` — current 501 stubs (PRIORITY)
- `server/src/routes/payments.routes.ts` — all route definitions (PRIORITY)
- `server/prisma/schema.prisma` — Payment model (PRIORITY)
- `server/src/controllers/auth.controller.ts` — reference for controller patterns
- `server/src/middleware/` — auth and rate-limiting middleware
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 9 (Payment specification)

**DO NOT TRUST WITHOUT VERIFYING**:
- Razorpay API documentation — consult the official Razorpay Node SDK README
- Payment model fields — verify against actual schema.prisma

**FILES YOU MAY EDIT**:
- `server/src/controllers/payments.controller.ts`
- `server/src/services/payment.service.ts` (create new)
- `server/prisma/schema.prisma` (add razorpay fields to Payment model)
- `server/src/routes/payments.routes.ts` (wire new controller methods)

**FILES YOU MUST NOT EDIT UNLESS ABSOLUTELY REQUIRED**:
- `server/src/index.ts`
- `server/src/controllers/auth.controller.ts`
- `server/src/middleware/auth.middleware.ts`
- All frontend files

**IMPLEMENTATION REQUIREMENTS**:
1. `npm install razorpay` in server/
2. Add to Payment model: `razorpayOrderId String?`, `razorpayPaymentId String?`, `razorpaySignature String?`
3. `payment.service.ts`:
   - `createOrder(amount: number, currency: string, receipt: string, notes: Record<string, string>)` → Razorpay order object
   - `verifyPayment(orderId: string, paymentId: string, signature: string)` → boolean (HMAC SHA256 with `orderId + "|" + paymentId` using key_secret)
   - `processRefund(paymentId: string, amount?: number)` → Razorpay refund object
   - `handleWebhook(body: string, signature: string, webhookSecret: string)` → verified event
4. Controller endpoints:
   - `POST /create` → validate amount > 0, create order, save Payment(PENDING), return orderId + amount
   - `POST /verify` → verify HMAC, update Payment(COMPLETED), log to AuditLog, return success
   - `POST /webhook` → verify webhook signature, handle payment.captured/payment.failed/refund.created events
   - `POST /:id/refund` → admin-only, process refund, update Payment(REFUNDED)
   - `GET /history` → user's payment history (paginated, sorted by date)
5. Security:
   - RAZORPAY_KEY_SECRET must never be in response bodies or console.log
   - Webhook endpoint must verify `x-razorpay-signature` header
   - Amount validated server-side (frontend amount is informational only)
   - Rate limit: 10 payment creations per user per hour
6. Error states: Return structured { success: false, error: string, code: string } for all failures
7. Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

**SEQUENCE**:
1. Read existing payments controller and routes
2. Read Payment model in schema.prisma
3. Install razorpay package
4. Add migration for new Payment fields
5. Create payment.service.ts
6. Update payments.controller.ts
7. Wire routes to updated controller
8. Run prisma migrate dev
9. Test with Razorpay test keys

**VALIDATION**:
```bash
cd server
npm install razorpay
npx prisma validate
npx prisma migrate dev --name add-razorpay-fields
npm run build
npm run lint:ci
```

**DONE WHEN**:
- [x] Razorpay SDK installed and imported
- [x] Payment model has razorpayOrderId, razorpayPaymentId, razorpaySignature fields
- [x] POST /create creates real Razorpay order (in test mode)
- [x] POST /verify correctly validates HMAC signature
- [x] POST /webhook verifies webhook signature and handles events
- [x] GET /history returns paginated payment history
- [x] All payment events logged to AuditLog
- [x] Server builds with zero errors
- [x] No secrets logged or exposed in responses

**HANDOFF NOTE**:
- Frontend Batch 002-B depends on these endpoints being live
- Session booking (FEATURE 003) depends on payment being functional
- Subscription billing (FEATURE 008) will extend these endpoints
- Update `docs/audit/_progress.json` after completion

## F. Risks
- **Context loss**: Agent may forget to add HMAC verification — it's explicit in requirements
- **Coupling**: Don't modify session or therapist logic — just payments
- **Regression**: Don't touch auth middleware
- **Scope creep**: Only implement core payment flow — subscriptions and memberships come later in FEATURE 008

---

# FEATURE 003: 100ms Video Sessions

## A. Current State
- `therapy.routes.ts` defines 18 endpoints — all 501 stubs
- Session model has `videoRoomUrl` and `videoProvider` fields
- `SessionsPage.tsx` uses hardcoded heroSession data
- No 100ms SDK installed on either side
- Key files: `server/src/routes/therapy.routes.ts`, `server/src/controllers/therapy.controller.ts`, `src/pages/dashboard/SessionsPage.tsx`
- Blockers: Payment system (FEATURE 002) needed for paid sessions

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | 50 |
| Backend | 5 |
| Database | 70 |
| Integrations | 0 |
| Cost Efficiency | 50 |
| Testing | 0 |
| Documentation | 5 |
| DevOps | 50 |
| Security | 20 |
| SEO | N/A |
| UI | 60 |
| UX | 20 |
| Overall Design | 60 |
| CTA and Buttons | 40 |
| Accessibility | 30 |
| Performance | 60 |
| Content/Copy | 40 |
| Conversion/Trust | 20 |
| Functionality | 5 |
| User Delight | 10 |
| Maintainability/Scalability | 40 |
| **Overall** | **31** |

## C. What Must Be Done To Reach 100/100
- **Backend**: Install @100mslive/server-sdk, create video service (room creation, token generation, room ending), implement session CRUD in therapy controller
- **Frontend**: Install @100mslive/react-sdk, create VideoRoom component with controls, create pre-session lobby, create post-session rating flow
- **Database**: Session model exists — wire real data
- **UX**: Pre-session device check (camera/mic test), in-session controls (mute, camera toggle, screenshare, end), post-session feedback form
- **Accessibility**: Keyboard navigation for video controls, screen reader announcements for connection state changes
- **Security**: Token-based 100ms authentication, session access restricted to participants only

## D. Execution Plan

### Batch 003-A: Backend Session + Video Service
- Create video.service.ts (100ms room management, token generation)
- Implement therapy.controller.ts session CRUD (create, list, get, cancel, end)
- Wire payment integration for paid sessions
- Dependencies: FEATURE 002 (payments)
- Done: API creates sessions with 100ms rooms and generates join tokens

### Batch 003-B: Frontend Video Room
- Install @100mslive/react-sdk
- Create VideoRoom component, VideoControls, DeviceCheck
- Create VideoSessionPage with pre-lobby and in-session views
- Wire SessionsPage to show real upcoming sessions
- Dependencies: Batch 003-A
- Done: User can join a video session with camera/mic controls

### Batch 003-C: Post-Session Flow
- Create post-session rating/feedback form
- Create session notes form for therapist
- Wire to session completion API
- Dependencies: Batch 003-B
- Done: Complete session lifecycle works end-to-end

## E. AI Agent Prompt

### BATCH 003-A: Backend Session + Video Service

**PROMPT TITLE**: Implement therapy session backend with 100ms video room management

**OBJECTIVE**: Create a therapy session management system that creates sessions, manages 100ms video rooms, generates auth tokens, and handles the full session lifecycle.

**READ FIRST**:
- `server/src/controllers/therapy.controller.ts` — current 501 stubs (PRIORITY)
- `server/src/routes/therapy.routes.ts` — all 18 route definitions (PRIORITY)
- `server/prisma/schema.prisma` — Session model, TherapistProfile, TherapistAvailability (PRIORITY)
- `server/src/services/payment.service.ts` — payment integration (from FEATURE 002)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 3 (Session lifecycle)

**DO NOT TRUST WITHOUT VERIFYING**:
- 100ms API documentation — verify against official SDK docs
- Session model fields — verify against actual schema.prisma

**FILES YOU MAY EDIT**:
- `server/src/controllers/therapy.controller.ts`
- `server/src/services/video.service.ts` (create new)
- `server/src/services/therapy.service.ts` (create new)
- `server/src/routes/therapy.routes.ts` (wire new methods)

**FILES YOU MUST NOT EDIT UNLESS ABSOLUTELY REQUIRED**:
- `server/prisma/schema.prisma` (Session model already has needed fields)
- `server/src/controllers/auth.controller.ts`
- `server/src/controllers/payments.controller.ts`
- All frontend files

**IMPLEMENTATION REQUIREMENTS**:
1. `npm install @100mslive/server-sdk` in server/
2. `video.service.ts`:
   - `createRoom(sessionId: string)` → { roomId, roomUrl }
   - `generateToken(roomId: string, userId: string, role: "host"|"guest")` → auth_token string
   - `endRoom(roomId: string)` → void
3. `therapy.service.ts`:
   - `createSession(userId, therapistId, scheduledAt, duration, paymentId)` → Session
   - `getUpcomingSessions(userId)` → Session[] with therapist details
   - `cancelSession(sessionId, cancelledBy, reason)` → Session (with refund logic)
   - `startSession(sessionId)` → { token, roomUrl }
   - `endSession(sessionId)` → Session
   - `rateSession(sessionId, userId, rating, feedback)` → Session
4. Controller endpoints:
   - `POST /sessions` → create session (validates therapist availability, creates payment order)
   - `GET /sessions` → user's sessions (upcoming + past, paginated)
   - `GET /sessions/:id` → session detail with therapist info
   - `POST /sessions/:id/start` → generate 100ms token, return join URL
   - `POST /sessions/:id/end` → end 100ms room, update status
   - `POST /sessions/:id/cancel` → cancel with refund policy (>24h=full, <24h=50%, <2h=0)
   - `POST /sessions/:id/rate` → user rates session (1-5 + feedback)
5. Security: Only session participants can join/view session; auth middleware enforced
6. State machine: SCHEDULED → IN_PROGRESS → COMPLETED (or CANCELLED/NO_SHOW)
7. Environment: `HMS_ACCESS_KEY`, `HMS_SECRET`

**SEQUENCE**:
1. Read therapy controller, routes, and Session model
2. Install 100ms server SDK
3. Create video.service.ts
4. Create therapy.service.ts
5. Update therapy.controller.ts
6. Wire routes
7. Test with 100ms test keys

**VALIDATION**:
```bash
cd server
npm install @100mslive/server-sdk
npm run build
npm run lint:ci
npx prisma validate
```

**DONE WHEN**:
- [x] 100ms SDK installed
- [x] POST /sessions creates a real session with 100ms room
- [x] POST /sessions/:id/start returns valid 100ms token
- [x] POST /sessions/:id/end correctly ends the room
- [x] GET /sessions returns real session data
- [x] Cancellation refund policy enforced correctly
- [x] Rating system stores and updates therapist average
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Frontend Batch 003-B depends on these endpoints
- Therapist dashboard (FEATURE 006) will use the same session data
- AI session monitor (FEATURE 030) will hook into session start/end
- Update `docs/audit/_progress.json` after completion

## F. Risks
- **Context loss**: 100ms SDK API may confuse agent — read official docs first
- **Coupling**: Don't combine with payment logic — session creates an ORDER, verify is separate
- **Regression**: Don't modify auth or user controllers
- **Scope creep**: Only session management — not therapist matching or dashboard

---

# FEATURE 004: Transactional Email (Resend)

## A. Current State
- `server/src/services/email.service.ts` exists with template structure but TODO comments
- No email SDK installed
- No email templates exist
- Notifications exist in DB but can't reach users outside the app
- Key files: `server/src/services/email.service.ts`
- Blockers: None

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | N/A |
| Backend | 10 |
| Database | N/A |
| Integrations | 0 |
| Cost Efficiency | 50 |
| Testing | 0 |
| Documentation | 5 |
| DevOps | 50 |
| Security | 40 |
| SEO | N/A |
| UI | N/A |
| UX | 0 |
| Overall Design | 30 |
| CTA and Buttons | 0 |
| Accessibility | 0 |
| Performance | 50 |
| Content/Copy | 0 |
| Conversion/Trust | 0 |
| Functionality | 0 |
| User Delight | 0 |
| Maintainability/Scalability | 30 |
| **Overall** | **15** |

## C. What Must Be Done To Reach 100/100
- Install Resend SDK, implement email service methods
- Create HTML email templates (welcome, session confirmation, session reminder, payment receipt, password reset)
- Wire email sending into auth, payment, and session flows
- Content/Copy: Professional, warm, on-brand email copy
- CTA: Clear action buttons in each email
- Accessibility: HTML emails with proper alt text, semantic markup
- Testing: Template rendering tests

## D. Execution Plan

### Batch 004-A: Email Service + Templates
- Install resend, implement email.service.ts methods, create HTML templates
- Dependencies: None
- Done: Email service can send templated emails via Resend

### Batch 004-B: Wire Email Triggers
- Wire: signup → welcome email, session booked → confirmation, payment → receipt
- Add cron: session reminder 24h before
- Dependencies: Batch 004-A + FEATURES 002, 003
- Done: Users receive emails for all key events

## E. AI Agent Prompt

### BATCH 004-A: Email Service + Templates

**PROMPT TITLE**: Implement Resend email service with templated emails

**OBJECTIVE**: Create a fully functional email service using Resend that sends professionally designed transactional emails for all key platform events.

**READ FIRST**:
- `server/src/services/email.service.ts` — existing skeleton (PRIORITY)
- `server/src/controllers/auth.controller.ts` — where welcome email should trigger
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 17 (Notification Intelligence)

**DO NOT TRUST WITHOUT VERIFYING**:
- Resend API documentation — verify against official Resend SDK README

**FILES YOU MAY EDIT**:
- `server/src/services/email.service.ts`
- `server/src/templates/` (create directory + template files)

**FILES YOU MUST NOT EDIT UNLESS ABSOLUTELY REQUIRED**:
- `server/src/controllers/auth.controller.ts` (will be wired in Batch 004-B)
- `server/prisma/schema.prisma`

**IMPLEMENTATION REQUIREMENTS**:
1. `npm install resend` in server/
2. Update `email.service.ts`:
   - `sendWelcomeEmail(to: string, name: string)` — warm welcome + onboarding CTA
   - `sendPasswordResetEmail(to: string, resetLink: string)` — secure reset with expiry info
   - `sendSessionConfirmation(to: string, details: { therapistName, date, time, duration })` — booking confirmation
   - `sendSessionReminder(to: string, details, minutesBefore: number)` — 24h and 1h reminders
   - `sendPaymentReceipt(to: string, details: { amount, description, date, transactionId })` — receipt
   - `sendWeeklyDigest(to: string, stats: { moodAvg, journalCount, meditationMinutes })` — weekly summary
3. HTML templates in `server/src/templates/`:
   - Responsive HTML (works in Gmail, Outlook, Apple Mail)
   - Soul Yatri branding (purple gradient accent, warm tone)
   - Clear CTA buttons (styled as links for compatibility)
   - Unsubscribe link in footer
   - Plain-text fallback
4. Environment: `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (e.g., "Soul Yatri <hello@soulyatri.com>")
5. Error handling: Log failed sends to AuditLog, don't crash on email failure

**SEQUENCE**:
1. Read existing email.service.ts
2. Install resend
3. Create email templates
4. Implement service methods
5. Test with Resend test mode

**VALIDATION**:
```bash
cd server
npm install resend
npm run build
npm run lint:ci
```

**DONE WHEN**:
- [x] Resend SDK installed
- [x] All 6 email methods implemented
- [x] HTML templates created and render correctly
- [x] Service handles errors gracefully (no crash on failure)
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Batch 004-B will wire these into auth/payment/session controllers
- Notification system (FEATURE 017) will use this service
- Weekly digest will need a cron job (set up in FEATURE 017)

## F. Risks
- **Context loss**: Agent may create inline HTML strings instead of proper templates — require template files
- **Scope creep**: Don't implement the cron scheduler here — just the email service
- **Coupling**: Don't modify controllers — just create the service

---

# FEATURE 005: Therapist Matching Algorithm

## A. Current State
- TherapistProfile model exists with specializations, languages, approach, experience, rating, availability
- UserProfile has therapyHistory, struggles[], goals[]
- No matching logic exists
- Connections page uses hardcoded mock matches
- Key files: `server/prisma/schema.prisma` (TherapistProfile, UserProfile), `src/pages/dashboard/ConnectionsPage.tsx`
- Blockers: None — models exist

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | 50 |
| Backend | 0 |
| Database | 70 |
| Integrations | 0 |
| Cost Efficiency | 50 |
| Testing | 0 |
| Documentation | 5 |
| DevOps | 50 |
| Security | 30 |
| SEO | N/A |
| UI | 60 |
| UX | 20 |
| Overall Design | 55 |
| CTA and Buttons | 30 |
| Accessibility | 30 |
| Performance | 60 |
| Content/Copy | 30 |
| Conversion/Trust | 20 |
| Functionality | 0 |
| User Delight | 10 |
| Maintainability/Scalability | 40 |
| **Overall** | **30** |

## C. What Must Be Done To Reach 100/100
- **Backend**: Implement weighted matching algorithm (spec in Bible Part 3.1)
- **API**: `GET /therapists/match` returning scored, ranked matches with breakdown
- **Frontend**: Match cards with compatibility score, "Why this match" expandable, filters
- **UX**: Quick filters (specialization, language, price, gender), sort by match score
- **CTA**: "Book Session" and "View Profile" buttons per match card
- **Delight**: "93% compatibility" badge, animated match reveal

## D. Execution Plan

### Batch 005-A: Matching Algorithm Backend
- Create `server/src/services/matching.service.ts` with weighted scoring
- Expose `GET /api/v1/therapists/match` endpoint
- Dependencies: None (models exist)
- Done: API returns scored therapist matches

### Batch 005-B: Frontend Match UI
- Replace hardcoded ConnectionsPage with real match cards
- Add filters and "Why this match" section
- Dependencies: Batch 005-A
- Done: Users see personalized therapist matches

## E. AI Agent Prompt

### BATCH 005-A: Therapist Matching Algorithm Backend

**PROMPT TITLE**: Implement therapist-user matching algorithm with weighted scoring

**OBJECTIVE**: Create a matching algorithm that scores therapists against a user's profile using 10 weighted dimensions and returns ranked results with explanation breakdowns.

**READ FIRST**:
- `server/prisma/schema.prisma` — TherapistProfile and UserProfile models (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 3.1 (Matching Algorithm specification) (PRIORITY)
- `server/src/controllers/therapy.controller.ts` — where to add endpoint

**DO NOT TRUST WITHOUT VERIFYING**:
- UserProfile field names — verify exact field names in schema.prisma
- TherapistProfile field names — verify exact field names in schema.prisma

**FILES YOU MAY EDIT**:
- `server/src/services/matching.service.ts` (create new)
- `server/src/controllers/therapy.controller.ts` (add match endpoint)
- `server/src/routes/therapy.routes.ts` (add route)

**FILES YOU MUST NOT EDIT UNLESS ABSOLUTELY REQUIRED**:
- `server/prisma/schema.prisma`
- `server/src/controllers/auth.controller.ts`
- All frontend files

**IMPLEMENTATION REQUIREMENTS**:
1. Matching algorithm weights (from Bible Part 3.1):
   - Specialization overlap: 0.25 (Jaccard similarity of user.struggles vs therapist.specializations)
   - Language match: 0.15 (any common language = 100, else = 20)
   - Gender preference: 0.10 (matches user's preference = 100, else = 50)
   - Approach match: 0.10 (same approach = 100, else = 60)
   - Availability overlap: 0.10 (check if therapist has slots in user's preferred times)
   - Price in budget: 0.10 (within range = 100, else inversely penalized)
   - Rating: 0.08 (normalized 0-5 to 0-100)
   - Experience: 0.05 (min(years * 10, 100))
   - Success rate: 0.05 (% of sessions rated 4+ by similar users)
   - Proximity: 0.02 (same city=100, state=70, country=40, else=20)
2. Return shape: `{ matches: [{ therapistId, totalScore, breakdown: {}, compatibilityReason: string }], filters: {} }`
3. `compatibilityReason` — human-readable string generated from top 3 scoring dimensions
4. Support query params: `?specialization=anxiety&language=hindi&maxPrice=2000&gender=female&approach=CBT`
5. Pagination: `?page=1&limit=10`
6. Cache matching results for 1 hour per user (invalidate on profile update)
7. Only match with verified, available therapists

**SEQUENCE**:
1. Read TherapistProfile and UserProfile models completely
2. Implement matching.service.ts with all 10 dimension scorers
3. Add match endpoint to therapy controller
4. Wire route
5. Test with seed data

**VALIDATION**:
```bash
cd server
npm run build
npm run lint:ci
npx prisma validate
```

**DONE WHEN**:
- [x] Matching service created with 10 weighted dimensions
- [x] GET /therapists/match returns scored results
- [x] Filters work (specialization, language, price, gender, approach)
- [x] Compatibility reason generated for each match
- [x] Only verified+available therapists returned
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Frontend Batch 005-B needs this endpoint
- Session booking (FEATURE 003) should link FROM match results
- Admin QA dashboard (FEATURE 015) can use matching data for quality analysis

## F. Risks
- **Context loss**: Algorithm weights are the CORE of the product — don't simplify
- **Regression**: Don't modify existing therapy endpoints
- **Scope creep**: Only matching — not booking, not video, not dashboard

---

# FEATURE 006: Therapist Dashboard Backend

## A. Current State
- TodaysSessionsPage, MyClientsPage, ManageAvailabilityPage — all hardcoded
- TherapistProfile and TherapistAvailability models exist
- therapy.routes.ts has dashboard endpoints (stubs)
- Key files: therapy.routes.ts, therapy.controller.ts, all therapist dashboard pages
- Blockers: FEATURE 003 (session CRUD needed)

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | 60 |
| Backend | 5 |
| Database | 70 |
| Functionality | 5 |
| **Overall** | **33** |

*(Full 22-dimension table in Bible Part 3.2)*

## E. AI Agent Prompt

### BATCH 006-A: Therapist Dashboard Backend

**PROMPT TITLE**: Implement therapist dashboard API endpoints

**OBJECTIVE**: Create backend endpoints for therapist dashboard: today's sessions, client list with progress, availability management, revenue stats, and reviews.

**READ FIRST**:
- `server/src/routes/therapy.routes.ts` — dashboard route stubs (PRIORITY)
- `server/prisma/schema.prisma` — TherapistProfile, Session, TherapistAvailability (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 3.2 (Therapist Dashboard specification)

**FILES YOU MAY EDIT**:
- `server/src/controllers/therapy.controller.ts`
- `server/src/services/therapist.service.ts` (create new)

**FILES YOU MUST NOT EDIT UNLESS ABSOLUTELY REQUIRED**:
- `server/prisma/schema.prisma`
- All frontend files

**IMPLEMENTATION REQUIREMENTS**:
1. `therapist.service.ts`:
   - `getOverviewMetrics(therapistId)` → { todaySessions, weeklyRevenue, avgRating, activeClients, completionRate }
   - `getTodaysSessions(therapistId)` → Session[] with client details + mood trend sparkline data
   - `getClients(therapistId)` → User[] with { totalSessions, avgRating, lastSession, moodTrend, nextSession }
   - `getAvailability(therapistId)` → TherapistAvailability[]
   - `setAvailability(therapistId, slots: { dayOfWeek, startTime, endTime, isRecurring }[])` → TherapistAvailability[]
   - `getRevenue(therapistId, period)` → { total, pending, commission, monthly[] }
   - `getReviews(therapistId, page, limit)` → { reviews, avgRating, categoryBreakdown }
2. All endpoints require `role === THERAPIST` or `role === ADMIN`
3. Metrics calculations as specified in Bible Part 3.2 table
4. Client mood trend: last 5 mood entries as sparkline data array

**DONE WHEN**:
- [x] All 7 service methods implemented with real DB queries
- [x] API endpoints return structured data
- [x] Role-based access enforced
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Frontend therapist pages need wiring next
- Admin QA dashboard (FEATURE 015) uses therapist metrics

---

# FEATURE 007: AI Wellness Chat (SoulBot)

## A. Current State
- `ai.routes.ts` has 11 endpoints (all stubs)
- No OpenAI SDK installed
- No chat UI exists
- Key files: `server/src/routes/ai.routes.ts`, `server/src/controllers/ai.controller.ts`
- Blockers: None

## B. Scores Out of 100
| Dimension | Score |
|-----------|-------|
| Frontend | 0 |
| Backend | 5 |
| Database | 0 |
| Functionality | 0 |
| **Overall** | **11** |

## E. AI Agent Prompt

### BATCH 007-A: AI Chat Backend with Crisis Detection

**PROMPT TITLE**: Implement SoulBot AI wellness chat with streaming and crisis detection

**OBJECTIVE**: Create an AI wellness chat backend using OpenAI GPT-4o-mini with streaming responses, crisis keyword detection, conversation history, and rate limiting.

**READ FIRST**:
- `server/src/controllers/ai.controller.ts` — current stubs (PRIORITY)
- `server/src/routes/ai.routes.ts` — route definitions (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 6.1 (SoulBot specification) and Part 6.1 Crisis Detection (PRIORITY)

**FILES YOU MAY EDIT**:
- `server/src/controllers/ai.controller.ts`
- `server/src/services/ai.service.ts` (create new)
- `server/src/services/crisis.service.ts` (create new)
- `server/prisma/schema.prisma` (add AIConversation model)

**IMPLEMENTATION REQUIREMENTS**:
1. `npm install openai` in server/
2. Add to schema.prisma:
   ```prisma
   model AIConversation {
     id        String   @id @default(uuid())
     userId    String
     messages  Json     // [{role, content, timestamp}]
     user      User     @relation(fields: [userId], references: [id])
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     @@index([userId, createdAt])
   }
   ```
3. `ai.service.ts`:
   - `chat(userId, message, conversationId?)` → ReadableStream (SSE)
   - System prompt from Bible Part 6.1 — personalized with user context
   - Inject user's mood trend, wellness score, struggles
   - Rate limit: 50 messages/user/hour (free), 200 (paid)
4. `crisis.service.ts`:
   - `assessCrisis(message, conversationHistory)` → CrisisAssessment
   - Keyword layer: ["suicide", "kill myself", "self-harm", "want to die", "end it", "can't go on", "no point in living", "better off dead", "cutting", "overdose"]
   - If CRITICAL: prepend helpline info (iCall: 9152987821, AASRA: 9820466726, Vandrevala: 9999666555)
   - Log ALL crisis detections to AuditLog with severity
5. Controller:
   - `POST /chat` → SSE streaming response
   - `GET /chat/history` → conversation list
   - `GET /chat/:conversationId` → single conversation
   - `POST /emergency` → manual crisis submission
6. Environment: `OPENAI_API_KEY`
7. Security: Never log conversation content to console; encrypt at rest

**DONE WHEN**:
- [x] OpenAI SDK installed, streaming chat works
- [x] Crisis detection catches all listed keywords
- [x] Helpline numbers prepended on crisis detection
- [x] Conversations persisted in AIConversation model
- [x] Rate limiting enforced
- [x] Crisis events logged to AuditLog
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Frontend chat UI (Batch 007-B) depends on this
- AI monitoring dashboard (FEATURE 015) uses crisis log data
- Pattern detection (FEATURE 010) uses conversation data

---

# FEATURE 008: Subscription Tiers & Billing

## A. Current State
- `payments.routes.ts` has subscription endpoints (stubs)
- Membership routes exist (tiers, subscribe, billing)
- No subscription model in Prisma
- No tier management
- Blockers: FEATURE 002 (Razorpay) must be complete

## E. AI Agent Prompt

### BATCH 008-A: Subscription Backend

**PROMPT TITLE**: Implement subscription tiers with Razorpay recurring payments

**OBJECTIVE**: Create subscription tier system with Free/Soul/Soul+/Soul Pro plans, Razorpay subscription management, and feature gating based on active tier.

**READ FIRST**:
- `server/src/routes/payments.routes.ts` — subscription route stubs (PRIORITY)
- `server/src/services/payment.service.ts` — existing Razorpay integration (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 9.2 (Subscription Tiers matrix)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add SubscriptionTier, UserSubscription models)
- `server/src/controllers/payments.controller.ts` (subscription endpoints)
- `server/src/services/subscription.service.ts` (create new)
- `server/src/middleware/subscription.middleware.ts` (create new — feature gating)

**IMPLEMENTATION REQUIREMENTS**:
1. Add models: SubscriptionTier, UserSubscription (see Bible Part 9.2)
2. Seed 4 tiers: Free (₹0), Soul (₹299/mo), Soul+ (₹599/mo), Soul Pro (₹999/mo)
3. Feature matrix from Bible Part 9.2 stored in SubscriptionTier.features (JSON)
4. `subscription.service.ts`:
   - `createSubscription(userId, tierId, paymentMethod)` → Razorpay subscription
   - `cancelSubscription(userId)` → cancel at period end
   - `upgradeSubscription(userId, newTierId)` → prorated upgrade
   - `checkFeatureAccess(userId, feature)` → boolean
5. Middleware `requireSubscription(feature: string)` — returns 403 with upgrade prompt if feature not in user's tier
6. Razorpay subscription webhooks: subscription.activated, subscription.charged, subscription.cancelled

**DONE WHEN**:
- [x] 4 subscription tiers seeded in DB
- [x] User can subscribe via Razorpay
- [x] Feature gating middleware works
- [x] Upgrade/downgrade with proration
- [x] Webhook events handled
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- All feature-gated endpoints depend on this middleware
- Frontend paywall UI needed (separate batch)
- Admin revenue dashboard uses subscription data

---

# FEATURE 009: Analytics Event Tracking

## A. Current State
- No analytics tracking whatsoever
- No AnalyticsEvent model
- No data for AI training
- Blockers: None — this is foundational

## E. AI Agent Prompt

### BATCH 009-A: Analytics Event Backend

**PROMPT TITLE**: Implement analytics event tracking backend for AI training pipeline

**OBJECTIVE**: Create an event tracking system that captures every user action defined in the tracking taxonomy, stores in AnalyticsEvent model, and provides aggregation endpoints for admin dashboards.

**READ FIRST**:
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 1.2 and 1.3 (Complete Event Tracking Taxonomy) (PRIORITY)
- `server/prisma/schema.prisma` — existing models

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add AnalyticsEvent model)
- `server/src/services/analytics.service.ts` (create new)
- `server/src/controllers/analytics.controller.ts` (create new)
- `server/src/routes/analytics.routes.ts` (create new)
- `server/src/middleware/tracking.middleware.ts` (create new — auto-capture page views)

**IMPLEMENTATION REQUIREMENTS**:
1. Add AnalyticsEvent model (see Bible Part 1.4):
   ```prisma
   model AnalyticsEvent {
     id            String   @id @default(uuid())
     userId        String?
     eventName     String
     eventCategory String
     properties    Json
     deviceType    String?
     pageUrl       String?
     referrer      String?
     sessionToken  String?
     createdAt     DateTime @default(now())
     @@index([userId, createdAt])
     @@index([eventName, createdAt])
     @@index([eventCategory])
     @@index([sessionToken])
   }
   ```
2. `analytics.service.ts`:
   - `track(event: TrackingEvent)` → void (async, never blocks request)
   - `getEvents(filters, pagination)` → events for admin
   - `getAggregates(eventName, period, groupBy)` → aggregated data for dashboards
   - `getUserFunnel(userId, funnelName)` → funnel step data
3. Frontend tracking hook: `useTracking()` → `{ track(eventName, properties) }`
4. Tracking middleware: Auto-capture request info (device, page, referrer) and attach to events
5. Batch insert: Buffer events and bulk insert every 5 seconds (not per-event)
6. Privacy: Respect user's `patternAlerts` setting, don't track if analytics consent denied
7. Retention: Auto-purge events older than 90 days (cron job)
8. Rate limit: Max 100 events per user per minute

**DONE WHEN**:
- [x] AnalyticsEvent model added with indexes
- [x] Track function works async without blocking
- [x] Admin can query events by name/category/date
- [x] Aggregation endpoint works for dashboard charts
- [x] Batch insertion implemented
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Admin dashboard (FEATURE 015) depends on analytics data
- AI pattern detection (FEATURE 010) depends on analytics data
- Frontend tracking hook to be wired into all components
- Churn prediction model uses this data

---

# FEATURE 010: Mood Pattern Detection & AI Insights

## A. Current State
- Mood CRUD works (real API)
- No trend analysis, no pattern detection, no AI insights
- MoodEntry model has score, note, tags, date
- Blockers: FEATURE 009 (analytics) for broader patterns; moood standalone can proceed

## E. AI Agent Prompt

### BATCH 010-A: Mood Pattern Analysis Backend

**PROMPT TITLE**: Implement mood pattern detection algorithm with AI insights

**OBJECTIVE**: Create a mood analysis system that detects trends, volatility, cyclical patterns, tag correlations, and generates personalized insights with recommendations.

**READ FIRST**:
- `server/prisma/schema.prisma` — MoodEntry model (PRIORITY)
- `server/src/controllers/health-tools.controller.ts` — existing mood endpoints (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 2.2 (Mood Pattern Detection Algorithm) (PRIORITY)

**FILES YOU MAY EDIT**:
- `server/src/services/mood-analysis.service.ts` (create new)
- `server/src/controllers/health-tools.controller.ts` (add analysis endpoints)
- `server/src/routes/health-tools.routes.ts` (add routes)

**IMPLEMENTATION REQUIREMENTS**:
1. `mood-analysis.service.ts`:
   - `detectTrend(entries: MoodEntry[], window: number)` → { slope, direction: "improving"|"declining"|"stable", confidence }
     - Linear regression over window days; slope > 0.05 = improving, < -0.05 = declining
   - `detectVolatility(entries)` → { stddev, level: "low"|"normal"|"high" }
     - stddev > 2.5 = high, < 1.0 = low
   - `detectCyclicalPatterns(entries)` → { period?, dayOfWeek?, timeOfDay? }
     - Autocorrelation at 7-day period, group by day of week to find highest/lowest days
   - `detectTagCorrelations(entries)` → { tag, avgMoodWithTag, avgMoodWithoutTag, impact }[]
     - For each tag, compare average mood when present vs absent
   - `generateInsights(userId)` → MoodInsight[]
     - Combine all detections into human-readable insights
     - E.g., "Your mood is 1.3 points higher on days you tag 'exercise'"
   - `detectCrisis(entries)` → CrisisAlert?
     - 3+ consecutive entries ≤ 2 → alert therapist
     - Single drop of 4+ points → show support prompt
2. New endpoint: `GET /health-tools/mood/insights` → full analysis with pattern list, tag correlations, trend, recommendations
3. Return shape per insight: `{ type, name, description, confidence, recommendation, dataPoints }`

**DONE WHEN**:
- [x] Trend detection (linear regression) works
- [x] Volatility detection works
- [x] Day-of-week pattern detection works
- [x] Tag correlation analysis works
- [x] Crisis threshold detection works
- [x] Insights endpoint returns human-readable analysis
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Frontend mood insights page needs wiring
- AI chat (FEATURE 007) uses mood trend for context
- Dashboard home wellness score uses mood component

---

# FEATURE 011: Gamification (Streaks, Achievements, XP)

## A. Current State
- No gamification exists
- No streak tracking
- No achievements
- No XP/levels
- Blockers: None — standalone feature

## E. AI Agent Prompt

### BATCH 011-A: Gamification Backend

**PROMPT TITLE**: Implement streak tracking, achievement system, and XP/level progression

**OBJECTIVE**: Create a gamification system with daily streaks for each activity, unlockable achievements with rarity tiers, XP rewards, and user levels.

**READ FIRST**:
- `server/prisma/schema.prisma` — all models
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 7 (Complete Gamification specification)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add UserStreak, Achievement, UserAchievement models)
- `server/src/services/gamification.service.ts` (create new)
- `server/src/controllers/gamification.controller.ts` (create new)
- `server/src/routes/gamification.routes.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Add models from Bible Part 7.1 and 7.2:
   - UserStreak: { userId, type, currentStreak, longestStreak, lastActivityDate }
   - Achievement: { code (unique), name, description, iconUrl, category, rarity, xpReward, criteria (JSON) }
   - UserAchievement: { userId, achievementId, unlockedAt }
2. `gamification.service.ts`:
   - `updateStreak(userId, type)` — logic from Bible Part 7.1 (continue if yesterday, reset if gap)
   - `checkAchievements(userId)` — check all unearned achievements against user's stats
   - `awardXP(userId, amount, reason)` — add XP + check level up
   - `getUserLevel(userId)` → { level, name, xp, xpToNext }
   - `getLeaderboard(period, limit)` → top users by XP
3. Seed all achievements from Bible Part 7.2 achievement catalog (16+ achievements)
4. XP levels from Bible: Level 1 (0 XP "New Soul") through Level 10 (10000 XP "Transcendent")
5. Auto-trigger: Wire into mood save, journal save, meditation complete, session complete
6. API:
   - `GET /gamification/profile` → streaks, achievements, level, XP
   - `GET /gamification/achievements` → all with locked/unlocked status
   - `GET /gamification/leaderboard` → top users (opt-in only)

**DONE WHEN**:
- [x] All 3 models created with seed data
- [x] Streak logic works correctly (continue/reset)
- [x] Achievement checking triggers on relevant actions
- [x] XP and level calculation works
- [x] Profile endpoint returns complete gamification state
- [x] Server builds with zero errors

**HANDOFF NOTE**:
- Frontend gamification UI needs separate batch
- Dashboard home shows active streaks
- Notification system triggers on achievement unlock

---

# FEATURE 012: Community Forum

## E. AI Agent Prompt

### BATCH 012-A: Community Backend

**PROMPT TITLE**: Implement community forum with posts, comments, likes, reporting, and moderation

**OBJECTIVE**: Create a community forum backend with CRUD for posts/comments, like system, content reporting, admin moderation queue, and basic AI content safety.

**READ FIRST**:
- `server/src/routes/community.ts` — 9 existing route stubs (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 8.1 (Community specification)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add Post, Comment, SupportGroup models)
- `server/src/controllers/community.controller.ts` (create new)
- `server/src/services/community.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Post and Comment models from Bible Part 8.1
2. Feed algorithm: `GET /community/feed` — chronological with engagement boost (likes × 2 + comments × 3, decayed by age)
3. Moderation: 3+ reports → auto-queue; keyword filter for profanity; admin approve/reject
4. Anonymous posting: authorId still stored (admin can see) but displayed anonymously
5. Rate limits: 10 posts/user/day, 50 comments/user/day
6. Categories: support, gratitude, question, story, tip, motivation

**DONE WHEN**:
- [x] Post CRUD with categories and anonymous option
- [x] Like/unlike toggle
- [x] Comment CRUD
- [x] Report mechanism with auto-queue at 3 reports
- [x] Feed algorithm with engagement scoring
- [x] Admin moderation endpoint
- [x] Server builds with zero errors

---

# FEATURE 013: Astrologer System

## E. AI Agent Prompt

### BATCH 013-A: Astrologer Backend

**PROMPT TITLE**: Implement astrologer profile, birth chart, predictions, and consultation system

**OBJECTIVE**: Create the complete astrologer subsystem: profiles, birth chart generation/storage, prediction CRUD with accuracy voting, and consultation booking.

**READ FIRST**:
- `server/src/routes/astrology.routes.ts` — 14 existing route stubs (PRIORITY)
- `server/prisma/schema.prisma` — User model with ASTROLOGER role (PRIORITY)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 4 (Complete Astrologer specification)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add AstrologerProfile, BirthChart, Prediction, AstroConsultation)
- `server/src/controllers/astrology.controller.ts` (create new)
- `server/src/services/astrology.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Add all 4 models from Bible Part 4.1
2. Birth chart: Store input data + cached calculation as JSON (planetary positions computed server-side)
3. Predictions: CRUD with zodiac sign, category, validity period, accuracy voting
4. Accuracy tracking: `predictionAccuracy = accurateVotes / (accurateVotes + inaccurateVotes) * 100`
5. Consultations: Reuse Session lifecycle pattern (SCHEDULED → IN_PROGRESS → COMPLETED)
6. Dashboard endpoints: overview metrics, clients, revenue (mirror therapist dashboard structure)
7. Commission: 20% platform fee (configurable per astrologer)

**DONE WHEN**:
- [x] 4 new Prisma models created with migrations
- [x] Prediction CRUD + voting works
- [x] Consultation booking works
- [x] Dashboard endpoints return real data
- [x] Accuracy calculation works
- [x] Server builds with zero errors

---

# FEATURE 014: Blog CMS Backend

## E. AI Agent Prompt

### BATCH 014-A: Blog CMS Backend

**PROMPT TITLE**: Implement blog CMS with posts, categories, and SEO fields

**OBJECTIVE**: Replace hardcoded blog content with a backend-driven CMS supporting posts, categories, tags, drafts, scheduling, and SEO metadata.

**READ FIRST**:
- `server/src/routes/blog.ts` — 7 route stubs (PRIORITY)
- `src/pages/public/BlogsPage.tsx` — current hardcoded data
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 14 (Blog specification)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add BlogPost model)
- `server/src/controllers/blog.controller.ts` (create new)
- `server/src/services/blog.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. BlogPost model from Bible Part 14.1
2. Endpoints: GET /posts (paginated, filterable by category/tag), GET /posts/:slug, POST (admin/author), PUT, DELETE
3. Status workflow: draft → pending_review → published → archived
4. Auto-generate slug from title, auto-calculate readTimeMinutes from content word count
5. SEO fields: metaTitle, metaDescription, canonicalUrl
6. Seed script to import current hardcoded blog content

**DONE WHEN**:
- [x] BlogPost model created
- [x] CRUD endpoints work
- [x] Slug auto-generation works
- [x] Filtering by category and tag works
- [x] Seed script imports existing content
- [x] Server builds with zero errors

---

# FEATURE 015: Admin God-Mode Dashboard

## E. AI Agent Prompt

### BATCH 015-A: Admin Metrics Backend

**PROMPT TITLE**: Implement admin dashboard API with real-time platform metrics

**OBJECTIVE**: Create the admin backend that powers the god-mode dashboard with real user metrics, revenue analytics, therapist QA scores, fraud detection, and employee tracking.

**READ FIRST**:
- `server/src/routes/admin.routes.ts` — 400+ lines of route stubs (PRIORITY)
- `server/src/controllers/admin.controller.ts` — current stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 5 (Complete Admin Dashboard specification) (PRIORITY)

**FILES YOU MAY EDIT**:
- `server/src/controllers/admin.controller.ts`
- `server/src/services/admin.service.ts` (create new)
- `server/src/services/fraud.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Head Office Dashboard metrics from Bible Part 5.1.1: activeUsers, activeSessions, dailySignups, dailyRevenue, apiLatency, errorRate
2. User Analytics from Bible Part 5.1.2: signupsBySource, activationRate, activationFunnel, DAU/MAU ratio, cohortRetention, featureAdoption
3. Revenue Analytics from Bible Part 5.1.3: MRR, ARR, revenueBySource, ARPU, LTV, paymentSuccessRate
4. Therapist QA from Bible Part 5.1.6: overallRating, completionRate, clientRetentionRate, onTimeRate, qualityTier
5. Fraud Detection from Bible Part 5.1.4: multi_account detection, fake_review detection, payment_fraud rules
6. All endpoints require `role === ADMIN || role === SUPER_ADMIN`
7. Real-time metrics via WebSocket (existing infra)
8. API: GET /admin/head-office, GET /admin/analytics/users, GET /admin/analytics/revenue, GET /admin/therapists/qa, GET /admin/fraud/alerts

**DONE WHEN**:
- [x] Head office dashboard returns real metrics
- [x] User analytics with cohort retention works
- [x] Revenue analytics with MRR/ARR calculation
- [x] Therapist QA scoring system
- [x] Basic fraud detection rules active
- [x] All admin-only auth enforced
- [x] Server builds with zero errors

---

# FEATURE 016: SEO Essentials

## E. AI Agent Prompt

### BATCH 016-A: SEO Implementation

**PROMPT TITLE**: Add comprehensive SEO to all public pages

**OBJECTIVE**: Add meta tags, OG tags, JSON-LD structured data, robots.txt, and sitemap.xml to all public pages.

**READ FIRST**:
- `src/pages/public/` — all public page files
- `index.html` — current head tags
- `public/` directory

**FILES YOU MAY EDIT**:
- `src/components/SEO/` (create directory + SEO component)
- `src/pages/public/*.tsx` (add SEO component)
- `public/robots.txt` (create)
- `scripts/generate-sitemap.ts` (create)
- `index.html` (add default OG tags)

**IMPLEMENTATION REQUIREMENTS**:
1. `npm install react-helmet-async` on frontend
2. Create `src/components/SEO/SEOHead.tsx` — reusable component
3. Per-page meta: unique title, description, canonical URL, OG image
4. JSON-LD: Organization schema on landing page, BlogPosting on blog, FAQPage on FAQ
5. robots.txt: Allow /, Disallow /dashboard/
6. Sitemap: Static script that generates sitemap.xml from router config

**DONE WHEN**:
- [x] All public pages have unique meta tags
- [x] JSON-LD schema on key pages
- [x] robots.txt serves correctly
- [x] sitemap.xml generated
- [x] Frontend builds with zero errors

---

# FEATURE 017: Notification Intelligence

## E. AI Agent Prompt

### BATCH 017-A: Smart Notification Engine

**PROMPT TITLE**: Implement intelligent notification system with rules engine and multi-channel delivery

**OBJECTIVE**: Create a notification rules engine that decides what to send, when, and how based on user behavior patterns, then delivers via in-app, push, and email channels.

**READ FIRST**:
- `server/src/controllers/notifications.controller.ts` — current stubs
- `server/src/services/email.service.ts` — email delivery (from FEATURE 004)
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 17 (Notification Intelligence)

**FILES YOU MAY EDIT**:
- `server/src/controllers/notifications.controller.ts`
- `server/src/services/notification.service.ts` (enhance existing)
- `server/src/services/notification-rules.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Notification CRUD: GET (paginated), PUT /read, PUT /read-all, DELETE
2. Rules engine with rules from Bible Part 17: mood reminder, session reminder, streak at risk, milestone celebration, churn prevention, weekly digest
3. Smart timing: Send at user's typical active hour (computed from analytics events)
4. Channel selection: Based on UserSettings preferences
5. Quiet hours: Don't send push during configured quiet hours
6. Weekly digest cron: Aggregate stats and send via email every Sunday 10am user-local-time

**DONE WHEN**:
- [x] Notification CRUD endpoints work
- [x] Rules engine evaluates and triggers notifications
- [x] Smart timing respects user's active hours
- [x] Quiet hours enforced
- [x] Weekly digest generates and sends
- [x] Server builds with zero errors

---

# FEATURE 018: Google OAuth

## E. AI Agent Prompt

### BATCH 018-A: Google OAuth Implementation

**PROMPT TITLE**: Implement Google OAuth login and signup

**OBJECTIVE**: Add Google OAuth as login/signup method alongside email/password.

**READ FIRST**:
- `server/src/controllers/auth.controller.ts` — current auth flow
- `src/pages/public/LoginPage.tsx` — current Google button placeholder
- `src/pages/public/SignupPage.tsx`

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add googleId to User model)
- `server/src/controllers/auth.controller.ts`
- `server/src/services/google-auth.service.ts` (create new)
- `src/hooks/useGoogleAuth.ts` (create new)
- `src/pages/public/LoginPage.tsx`
- `src/pages/public/SignupPage.tsx`

**IMPLEMENTATION REQUIREMENTS**:
1. Backend: `npm install google-auth-library`
2. Add `googleId String? @unique` to User model
3. `POST /auth/google { credential }` → verify with Google → find/create user → return JWT
4. Frontend: `npm install @react-oauth/google`
5. Replace placeholder Google buttons with real GoogleLogin components
6. Environment: `GOOGLE_CLIENT_ID` (both), `GOOGLE_CLIENT_SECRET` (server)
7. If Google account's email matches existing user → link accounts
8. If new → create user with google profile data, skip email verification

**DONE WHEN**:
- [x] Google login works end-to-end
- [x] New users created from Google profile
- [x] Existing email users auto-linked
- [x] JWT issued correctly
- [x] Both frontend and server build with zero errors

---

# FEATURE 019: Contact Form & Newsletter Wiring

## E. AI Agent Prompt

### BATCH 019-A: Wire Contact Form and Newsletter

**PROMPT TITLE**: Wire ContactPage form submission and footer newsletter signup

**OBJECTIVE**: Make the contact form and newsletter signup actually work by creating backend endpoints and wiring the frontend forms.

**READ FIRST**:
- `src/pages/public/ContactPage.tsx` — current form
- `src/components/layout/Footer.tsx` — newsletter input

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add NewsletterSubscriber model)
- `server/src/controllers/contact.controller.ts` (create new)
- `server/src/routes/contact.routes.ts` (create new)
- `src/pages/public/ContactPage.tsx`
- `src/components/layout/Footer.tsx`

**IMPLEMENTATION REQUIREMENTS**:
1. Contact: `POST /contact { name, email, phone?, message, type }` → Zod validation, rate limit 3/email/hour, store in DB + send admin notification email
2. Newsletter: `POST /newsletter/subscribe { email }` → NewsletterSubscriber model, deduplicate silently, rate limit 5/IP/hour
3. Frontend: react-hook-form + zod, loading state, success/error toast, disable button during submission
4. ContactPage: Clear form on success, show "We'll get back within 24 hours"
5. Footer: Inline success message "You're subscribed! ✨"

**DONE WHEN**:
- [x] Contact form submits to real API
- [x] Newsletter signup works
- [x] Rate limiting enforced
- [x] Success/error states display correctly
- [x] Both builds pass

---

# FEATURE 020: Dead Code Cleanup

## E. AI Agent Prompt

### BATCH 020-A: Remove Dead Code

**PROMPT TITLE**: Delete dead module stubs and unused code

**OBJECTIVE**: Remove the 71 empty TODO stub files in server/src/modules/ and any other dead code to reduce confusion for future agents.

**READ FIRST**:
- `server/src/modules/` — all files (verify they're truly stubs)
- `server/src/index.ts` — check for module imports

**FILES YOU MAY EDIT**:
- `server/src/modules/` (delete entire directory)
- `server/src/index.ts` (remove imports if any)
- Any file that imports from modules/

**IMPLEMENTATION REQUIREMENTS**:
1. Verify EVERY file in server/src/modules/ is a TODO stub before deleting
2. Search for imports from "modules/" across entire server/src/ — remove them
3. Move any utils or testing helpers to appropriate locations
4. Remove commented-out code blocks > 10 lines across server/src/
5. DO NOT delete route files, controller files, or anything with real logic

**VALIDATION**:
```bash
cd server
npm run build
npm run lint:ci
# Verify no broken imports
grep -r "modules/" server/src/ || echo "PASS: No references to deleted modules"
```

**DONE WHEN**:
- [x] server/src/modules/ deleted entirely
- [x] No broken imports remain
- [x] Server builds with zero errors
- [x] No functionality lost

---

# FEATURE 021: Course Platform

*(See BATCH structure in [`14_execution_prompts.md`](14_execution_prompts.md) PROMPT 014 + expanded specs in Bible Part 15)*

## E. AI Agent Prompt

### BATCH 021-A: Course Backend

**PROMPT TITLE**: Implement course platform with modules, enrollment, and progress tracking

**READ FIRST**:
- `server/src/routes/courses.ts` — 8 route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 15

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add Course, CourseModule, Enrollment)
- `server/src/controllers/courses.controller.ts` (create new)
- `server/src/services/course.service.ts` (create new)

**DONE WHEN**:
- [x] 3 models created, CRUD works, enrollment with payment, progress tracking, server builds

---

# FEATURE 022: Wellness Shop

## E. AI Agent Prompt

### BATCH 022-A: Shop Backend

**PROMPT TITLE**: Implement e-commerce wellness shop

**READ FIRST**:
- `server/src/routes/shop.ts` — 9 route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 10

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add Product, Order, OrderItem, Cart, ProductReview)
- `server/src/controllers/shop.controller.ts` (create new)
- `server/src/services/shop.service.ts` (create new)

**DONE WHEN**:
- [x] 5 models created, product CRUD, cart management, order creation with payment, reviews, server builds

---

# FEATURE 023: Corporate Wellness Module

## E. AI Agent Prompt

### BATCH 023-A: Corporate Backend

**PROMPT TITLE**: Implement B2B corporate wellness accounts

**READ FIRST**:
- `server/src/routes/corporate.ts` — 11 route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 11

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add CorporateAccount, CorporateEmployee)
- `server/src/controllers/corporate.controller.ts` (create new)
- `server/src/services/corporate.service.ts` (create new)

**DONE WHEN**:
- [x] 2 models created, account CRUD, employee management, anonymized wellness reports, server builds

---

# FEATURE 024: NGO & Social Impact

## E. AI Agent Prompt

### BATCH 024-A: NGO Backend

**PROMPT TITLE**: Implement NGO partner management and impact tracking

**READ FIRST**:
- `server/src/routes/ngo.ts` — 5 route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 12

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add NGOPartner)
- `server/src/controllers/ngo.controller.ts` (create new)

**DONE WHEN**:
- [x] NGOPartner model, CRUD, impact metrics, server builds

---

# FEATURE 025: Events & Workshops

## E. AI Agent Prompt

### BATCH 025-A: Events Backend

**PROMPT TITLE**: Implement events and workshops system

**READ FIRST**:
- `server/src/routes/events.ts` — 7 route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 13

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add Event, EventRegistration)
- `server/src/controllers/events.controller.ts` (create new)

**DONE WHEN**:
- [x] 2 models created, event CRUD, registration with payment, feedback/rating, server builds

---

# FEATURE 026: Constellation (Connections)

## E. AI Agent Prompt

### BATCH 026-A: Connections Backend

**PROMPT TITLE**: Implement constellation connections with compatibility algorithm

**READ FIRST**:
- `server/prisma/schema.prisma` — UserProfile model
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 2.5 (Compatibility Algorithm)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add Connection model + enums)
- `server/src/controllers/connections.controller.ts` (create new)
- `server/src/services/connections.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Connection model from Bible Part 2.5 with types (PLATONIC, PROFESSIONAL, SUPPORT_BUDDY) and status flow
2. Compatibility algorithm: 7 weighted dimensions (struggle_overlap 0.25, goal_overlap 0.20, interest_overlap 0.15, language 0.10, proximity 0.10, age_bracket 0.05, activity_similarity 0.15)
3. `GET /connections/suggestions` → scored potential connections (opt-in users only)
4. `POST /connections/request` → send request
5. Privacy: Only connect opt-in users, block user-therapist connections
6. Rate limit: 10 requests/day

**DONE WHEN**:
- [x] Connection model + 2 enums created
- [x] Compatibility algorithm calculates weighted scores
- [x] Suggestions endpoint returns scored matches
- [x] Request/accept/decline/block flow works
- [x] Server builds

---

# FEATURE 027: Meditation Player & Content

## E. AI Agent Prompt

### BATCH 027-A: Meditation Backend + Breathing Engine

**PROMPT TITLE**: Implement meditation content library and breathing exercise engine

**READ FIRST**:
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 2.4 (Meditation specification)
- `server/prisma/schema.prisma` — MeditationLog (existing)

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add MeditationTrack model)
- `server/src/controllers/meditation.controller.ts` (create new)
- `server/src/services/meditation.service.ts` (create new)
- `src/features/meditation/BreathingExercise.tsx` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. MeditationTrack model with type, duration, audioUrl, instructor, difficulty, tags, bestFor, moodRange
2. Recommendation algorithm from Bible Part 2.4 (mood_match, time_match, history_affinity, completion_rate, novelty)
3. Breathing exercise engine: 5 built-in patterns (Box, 4-7-8, Belly, Energizing, Equal) — no audio needed, visual only
4. Frontend breathing component: Animated circle that expands/contracts with timing

**DONE WHEN**:
- [x] MeditationTrack model created
- [x] Track listing + recommendation works
- [x] Breathing exercise patterns seeded
- [x] Frontend breathing animation works
- [x] Both builds pass

---

# FEATURE 028: Career Applications

## E. AI Agent Prompt

### BATCH 028-A: Careers Backend

**PROMPT TITLE**: Implement career positions and application system

**READ FIRST**:
- `server/src/routes/careers.ts` — 3 route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 16

**FILES YOU MAY EDIT**:
- `server/prisma/schema.prisma` (add JobPosition, JobApplication)
- `server/src/controllers/careers.controller.ts` (create new)

**DONE WHEN**:
- [x] 2 models created, position listing, application submission with file upload, admin review queue, server builds

---

# FEATURE 029: Crisis Detection System

## E. AI Agent Prompt

### BATCH 029-A: Comprehensive Crisis Detection

**PROMPT TITLE**: Implement platform-wide crisis detection and response system

**READ FIRST**:
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 2.2 (Mood crisis detection) + Part 6.1 (AI chat crisis detection) + Part 6.2 (Session monitor)
- `server/src/services/ai.service.ts` (from FEATURE 007)
- `server/src/services/mood-analysis.service.ts` (from FEATURE 010)

**FILES YOU MAY EDIT**:
- `server/src/services/crisis.service.ts` (enhance from FEATURE 007)
- `server/prisma/schema.prisma` (add CrisisAlert model)

**IMPLEMENTATION REQUIREMENTS**:
1. CrisisAlert model: { userId, source (mood|chat|session|journal), severity, triggerType, triggers[], aiConfidence, reviewedBy?, resolution?, createdAt }
2. Unified crisis detection across ALL text inputs (mood notes, journal, chat, community posts)
3. Multi-layer detection from Bible Part 6.1: keyword → sentiment → contextual → LLM classification
4. Severity levels: LOW → MEDIUM → HIGH → CRITICAL
5. Response protocol: CRITICAL = immediate helpline popup + admin notification + therapist alert
6. Admin crisis dashboard: GET /admin/crisis/alerts (queue with review actions)
7. NEVER auto-block a user in crisis — escalate to human

**DONE WHEN**:
- [x] CrisisAlert model created
- [x] Unified detection function used across all text inputs
- [x] Multi-layer detection (keyword + openai classification)
- [x] Helpline numbers shown on detection
- [x] Admin crisis queue works
- [x] Server builds

---

# FEATURE 030: AI Session Monitor

## E. AI Agent Prompt

### BATCH 030-A: AI Session Monitor Backend

**PROMPT TITLE**: Implement real-time AI session monitoring for therapy sessions

**READ FIRST**:
- `server/src/routes/ai.routes.ts` — session-monitor route stubs
- `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` — Part 6.2

**FILES YOU MAY EDIT**:
- `server/src/controllers/ai.controller.ts` (session monitor endpoints)
- `server/src/services/session-monitor.service.ts` (create new)

**IMPLEMENTATION REQUIREMENTS**:
1. Consent-based: Both client and therapist must opt-in before session
2. `POST /ai/session-monitor/start` → begin monitoring (transcription via Whisper API or similar)
3. `POST /ai/session-monitor/audio` → process audio chunk: transcribe + sentiment analysis
4. Real-time sentiment tracking: sentiment score per 30-second segment
5. Key moment flagging: significant emotional shifts, breakthrough indicators
6. Post-session: Auto-generate session summary for therapist review
7. Privacy: Transcripts encrypted, auto-deleted after therapist review period
8. Therapist-only view: Client never sees raw transcript

**DONE WHEN**:
- [x] Consent flow works
- [x] Audio processing with transcription
- [x] Sentiment tracking per segment
- [x] Session summary generation
- [x] Privacy controls enforced
- [x] Server builds

---

# Cross-Reference Table

| Feature | Depends On | Blocks | Bible Section |
|---------|-----------|--------|--------------|
| 001 Auth Security | — | Nothing | N/A |
| 002 Razorpay | — | 003, 008 | Part 9 |
| 003 Video Sessions | 002 | 006, 030 | Part 3 |
| 004 Email | — | 017 | Part 17 |
| 005 Matching | — | — | Part 3.1 |
| 006 Therapist Dashboard | 003 | — | Part 3.2 |
| 007 AI Chat | — | 029 | Part 6.1 |
| 008 Subscriptions | 002 | — | Part 9.2 |
| 009 Analytics | — | 010, 015 | Part 1 |
| 010 Mood Patterns | — | — | Part 2.2 |
| 011 Gamification | — | — | Part 7 |
| 012 Community | — | — | Part 8 |
| 013 Astrologer | — | — | Part 4 |
| 014 Blog CMS | — | — | Part 14 |
| 015 Admin Dashboard | 009 | — | Part 5 |
| 016 SEO | — | — | N/A |
| 017 Notifications | 004 | — | Part 17 |
| 018 Google OAuth | — | — | N/A |
| 019 Contact/Newsletter | — | — | N/A |
| 020 Dead Code | — | — | N/A |
| 021 Courses | 002 | — | Part 15 |
| 022 Shop | 002 | — | Part 10 |
| 023 Corporate | — | — | Part 11 |
| 024 NGO | — | — | Part 12 |
| 025 Events | 002 | — | Part 13 |
| 026 Constellation | — | — | Part 2.5 |
| 027 Meditation | — | — | Part 2.4 |
| 028 Careers | — | — | Part 16 |
| 029 Crisis Detection | 007 | — | Part 6.1 |
| 030 AI Session Monitor | 003 | — | Part 6.2 |

---

_This file supersedes [`14_execution_prompts.md`](14_execution_prompts.md) — that file remains for reference but these prompts are the authoritative, agentprompt.txt-compliant versions._

_Last updated: March 6, 2026_
