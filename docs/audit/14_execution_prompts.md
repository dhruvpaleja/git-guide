# AI Agent Execution Prompts — Soul Yatri Platform

> Each prompt below is a self-contained task specification for an AI coding agent.
> Copy-paste any prompt to an AI agent and it will implement the feature end-to-end.

---

## PROMPT 01: Fix Auth Bypass Security Vulnerability

```
OBJECTIVE: Disable authentication bypass in production so that all protected routes require real JWT authentication.

READ FIRST:
- src/config/runtime.flags.ts (lines defining authBypassEnabled and mockAuthEnabled)
- src/context/AuthContext.tsx (mock auth provider with hardcoded accounts)
- src/middleware/ProtectedRoute.tsx (bypass logic)
- server/src/routes/dev-login.ts (dev login endpoints)
- server/src/index.ts (where dev routes are registered)

FILES YOU MAY EDIT:
- src/config/runtime.flags.ts
- src/context/AuthContext.tsx
- src/middleware/ProtectedRoute.tsx
- server/src/routes/dev-login.ts
- server/src/index.ts

IMPLEMENTATION REQUIREMENTS:
1. In runtime.flags.ts: Change authBypassEnabled default from true to false
2. In runtime.flags.ts: Change mockAuthEnabled default from true to false
3. In ProtectedRoute.tsx: Remove or guard the early return that bypasses auth when flag is true
4. In AuthContext.tsx: Remove hardcoded test credentials (user@test.com, admin@test.com, etc.)
5. In dev-login.ts: Wrap ALL route handlers in: if (process.env.NODE_ENV === 'production') { return res.status(404).json({ error: 'Not found' }); }
6. In server/src/index.ts: Only register dev-login routes when NODE_ENV !== 'production'
7. Do NOT break the development workflow — auth bypass should still work when explicitly set via environment variable

SEQUENCE:
1. Fix runtime.flags.ts defaults
2. Guard ProtectedRoute.tsx
3. Clean AuthContext.tsx
4. Guard dev-login.ts
5. Guard route registration in index.ts

VALIDATION:
- With no env vars set: protected routes should redirect to /login
- With VITE_AUTH_BYPASS=true: protected routes should allow access (dev only)
- Dev login routes should 404 in production
- Login page should still work with real credentials

DONE WHEN:
- Default production behavior requires real authentication
- No hardcoded test credentials in source code
- Dev login returns 404 in production
- Development workflow preserved via explicit env vars

HANDOFF NOTE:
After this fix, you MUST test the login flow manually:
1. Start frontend + backend
2. Try accessing /dashboard without logging in → should redirect to /login
3. Login with real credentials → should work
4. Set VITE_AUTH_BYPASS=true → should bypass (dev only)
```

---

## PROMPT 02: Integrate Razorpay Payment Gateway

```
OBJECTIVE: Implement Razorpay payment processing so users can pay for therapy sessions, courses, and memberships.

READ FIRST:
- server/prisma/schema.prisma (Payment model — exists but orphaned)
- server/src/routes/payments.ts (27 stub endpoints returning 501)
- server/src/controllers/payments.controller.ts (if exists)
- src/config/index.ts (environment variable patterns)
- server/src/config/index.ts (server config patterns)

FILES YOU MAY EDIT:
- server/src/routes/payments.ts
- server/src/controllers/payments.controller.ts (create if needed)
- server/src/services/payment.service.ts (create)
- server/prisma/schema.prisma (update Payment model if needed)
- src/services/payment.service.ts (create frontend service)
- src/hooks/usePayment.ts (create)

IMPLEMENTATION REQUIREMENTS:
1. Install razorpay package: npm install razorpay
2. Create server/src/services/payment.service.ts with:
   - createOrder(amount, currency, receipt, notes)
   - verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)
   - refundPayment(payment_id, amount)
   - getPaymentDetails(payment_id)
3. Create 4 real endpoints (replace stubs):
   - POST /api/payments/create-order → creates Razorpay order, saves to DB
   - POST /api/payments/verify → verifies signature, updates payment status
   - POST /api/payments/webhook → Razorpay webhook handler (payment.captured, payment.failed, refund.processed)
   - GET /api/payments/:id → get payment details
4. Frontend payment.service.ts:
   - loadRazorpayScript() → dynamically loads Razorpay checkout.js
   - initiatePayment(orderId, amount, prefill) → opens Razorpay modal
5. usePayment hook:
   - createOrder mutation
   - verify mutation
   - payment status polling
6. Webhook must verify Razorpay signature using HMAC SHA256
7. Store RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables only
8. Add RAZORPAY_WEBHOOK_SECRET for webhook verification

SEQUENCE:
1. Install razorpay package
2. Create payment.service.ts (server)
3. Update payment routes with real handlers
4. Add Prisma migration if Payment model needs changes
5. Create frontend service + hook
6. Wire to a test page for verification

VALIDATION:
- POST /api/payments/create-order returns Razorpay order_id
- Frontend Razorpay modal opens with correct amount
- Successful test payment updates DB record to status: 'captured'
- Webhook endpoint returns 200 and updates payment status
- Invalid signature returns 400

DONE WHEN:
- Can create a Razorpay order via API
- Can complete a test payment in Razorpay test mode
- Payment record stored in PostgreSQL with correct status
- Webhook processes payment events
- Frontend hook available for any page to use

HANDOFF NOTE:
Use Razorpay TEST mode keys for development. Test cards: 4111111111111111 (success), 4000000000000002 (decline). Once verified, this payment service is used by therapy booking, course enrollment, and membership purchase prompts.
```

---

## PROMPT 03: Implement Therapy Booking Flow

```
OBJECTIVE: Build end-to-end therapy session booking: therapist listing → slot selection → payment → video session.

READ FIRST:
- server/prisma/schema.prisma (Session, TherapistProfile, TherapistAvailability models)
- server/src/routes/therapy.ts (20 stub endpoints)
- src/pages/dashboard/SessionsPage.tsx (mock sessions page)
- src/pages/practitioner/ManageAvailability.tsx (if exists)
- server/src/services/payment.service.ts (from PROMPT 02 — must be done first)

FILES YOU MAY EDIT:
- server/src/routes/therapy.ts
- server/src/controllers/therapy.controller.ts (create)
- server/src/services/therapy.service.ts (create)
- server/prisma/schema.prisma (add/update models)
- src/pages/dashboard/SessionsPage.tsx
- src/pages/dashboard/BookSessionPage.tsx (create)
- src/pages/dashboard/SessionRoomPage.tsx (create)
- src/services/therapy.service.ts (create frontend service)
- src/hooks/useTherapy.ts (create)

IMPLEMENTATION REQUIREMENTS:
1. Backend therapy.service.ts:
   - listTherapists(filters) → paginated list with specialties, ratings, price
   - getTherapistAvailability(therapistId, dateRange) → available time slots
   - bookSession(userId, therapistId, slotId, paymentId) → create Session record
   - cancelSession(sessionId, reason) → cancel + refund logic
   - completeSession(sessionId, notes) → mark completed
2. Real endpoints (replace stubs):
   - GET /api/therapy/therapists → list with filters (specialty, price, rating)
   - GET /api/therapy/therapists/:id → therapist profile + reviews
   - GET /api/therapy/therapists/:id/availability → available slots
   - POST /api/therapy/sessions/book → book session (requires payment)
   - PATCH /api/therapy/sessions/:id/cancel → cancel with refund
   - GET /api/therapy/sessions/my → user's booked sessions
3. Frontend pages:
   - BookSessionPage: therapist cards → slot picker → payment modal → confirmation
   - SessionRoomPage: Daily.co video embed (or placeholder with join link)
   - SessionsPage: real data from API (upcoming, past, cancelled)
4. Integrate with Razorpay (PROMPT 02) for payment at booking
5. Generate Daily.co room URL on booking confirmation (or use placeholder URL)

SEQUENCE:
1. Update Prisma schema if needed → migrate
2. Create therapy.service.ts (server)
3. Create therapy.controller.ts
4. Update therapy routes
5. Create frontend service + hook
6. Build BookSessionPage
7. Update SessionsPage with real data
8. Create SessionRoomPage (placeholder for video)

VALIDATION:
- GET /api/therapy/therapists returns real data from DB
- Booking flow: select therapist → pick slot → pay → session appears in "My Sessions"
- Cancel session triggers refund
- SessionsPage shows real booked sessions

DONE WHEN:
- User can browse therapists and see availability
- User can book a session with payment
- User can view their upcoming and past sessions
- User can cancel a session
- Practitioner can see their booked sessions

HANDOFF NOTE:
Depends on PROMPT 02 (payments). Video integration (Daily.co) is a separate prompt — for now, store a placeholder roomUrl. Practitioner availability management is also separate.
```

---

## PROMPT 04: Implement AI SoulBot Chat

```
OBJECTIVE: Build an AI-powered mental wellness chatbot using OpenAI GPT-4o-mini with crisis detection and safety guardrails.

READ FIRST:
- server/src/routes/ai.ts (11 stub endpoints)
- server/prisma/schema.prisma (no AI models — need to create)
- src/features/ (check for any existing chat UI components)
- server/src/services/ (existing service patterns)

FILES YOU MAY EDIT:
- server/prisma/schema.prisma (add AIConversation, AIMessage models)
- server/src/routes/ai.ts
- server/src/controllers/ai.controller.ts (create)
- server/src/services/ai.service.ts (create)
- server/src/services/crisis-detection.service.ts (create)
- src/features/soulbot/SoulBotChat.tsx (create)
- src/features/soulbot/SoulBotWidget.tsx (create)
- src/services/ai.service.ts (create frontend service)
- src/hooks/useSoulBot.ts (create)

IMPLEMENTATION REQUIREMENTS:
1. Install: npm install openai (server only)
2. Prisma models:
   - AIConversation: id, userId, title, createdAt, updatedAt, status
   - AIMessage: id, conversationId, role (user/assistant/system), content, createdAt, crisisFlag
3. System prompt for SoulBot:
   - "You are SoulBot, a compassionate mental wellness companion for Soul Yatri."
   - "You provide emotional support, mindfulness exercises, and wellness tips."
   - "You are NOT a replacement for professional therapy. If users express suicidal thoughts, self-harm, or severe crisis, immediately recommend professional help and provide crisis helpline numbers (India: iCall 9152987821, Vandrevala Foundation 1860-2662-345)."
   - "Never diagnose conditions. Never prescribe medication. Always be warm, non-judgmental, and empathetic."
4. Crisis detection:
   - Use OpenAI Moderation API as first filter
   - Pattern match: suicide, self-harm, kill, end my life, etc.
   - If crisis detected: flag message, respond with crisis resources, send notification to admin
5. Backend endpoints:
   - POST /api/ai/chat → send message, get streaming response
   - GET /api/ai/conversations → user's conversation history
   - GET /api/ai/conversations/:id → conversation with messages
   - DELETE /api/ai/conversations/:id → delete conversation
6. Frontend:
   - SoulBotWidget: floating chat bubble in bottom-right corner
   - SoulBotChat: full chat interface with message bubbles, typing indicator
   - Streaming response display (SSE or chunked transfer)
7. Rate limit: 50 messages/user/day
8. Token budget: max 500 tokens per response

SEQUENCE:
1. Add Prisma models → migrate
2. Create ai.service.ts with OpenAI integration
3. Create crisis-detection.service.ts
4. Update ai routes with real handlers
5. Create frontend SoulBotChat component
6. Create SoulBotWidget (floating bubble)
7. Wire to App.tsx as global widget

VALIDATION:
- POST /api/ai/chat returns streaming response
- Crisis message triggers flagging + crisis resources in response
- Conversation history persists across sessions
- Rate limiting works (51st message returns 429)
- Widget appears on all authenticated pages

DONE WHEN:
- User can chat with SoulBot and receive empathetic AI responses
- Crisis detection identifies risk keywords and responds with helpline numbers
- Conversation history is stored and retrievable
- Rate limiting prevents abuse
- Widget is globally accessible for logged-in users

HANDOFF NOTE:
Use OPENAI_API_KEY environment variable. Start with GPT-4o-mini for cost efficiency. Crisis detection is safety-critical — test thoroughly with edge cases. Consider having a mental health professional review the system prompt.
```

---

## PROMPT 05: Build Real Blog System with Sanity CMS

```
OBJECTIVE: Replace hardcoded blog posts with a real CMS-backed blog system for SEO content marketing.

READ FIRST:
- src/pages/BlogsPage.tsx (15+ hardcoded blog posts)
- src/pages/BlogDetailPage.tsx (hardcoded blog content)
- server/prisma/schema.prisma (no BlogPost model)
- server/src/routes/blog.ts (stub endpoints)

FILES YOU MAY EDIT:
- server/prisma/schema.prisma (add BlogPost, BlogCategory models)
- server/src/routes/blog.ts
- server/src/controllers/blog.controller.ts (create)
- server/src/services/blog.service.ts (create)
- src/pages/BlogsPage.tsx
- src/pages/BlogDetailPage.tsx
- src/services/blog.service.ts (create frontend)

IMPLEMENTATION REQUIREMENTS:
1. Add Prisma models:
   - BlogPost: id, title, slug (unique), content (markdown), excerpt, coverImage, author (relation to User), category, tags[], publishedAt, status (draft/published), readTime, viewCount
   - BlogCategory: id, name, slug, description
2. Backend endpoints:
   - GET /api/blog/posts → paginated, filterable by category/tag, searchable
   - GET /api/blog/posts/:slug → single post by slug
   - GET /api/blog/categories → all categories
   - POST /api/blog/posts → create (admin only)
   - PUT /api/blog/posts/:id → update (admin only)
   - DELETE /api/blog/posts/:id → soft delete (admin only)
3. Seed initial blog posts from the existing hardcoded data in BlogsPage.tsx
4. Frontend: Replace hardcoded data with API calls
5. Add SEO meta tags per blog post (react-helmet-async if installed)
6. Generate dynamic sitemap entries for blog posts

SEQUENCE:
1. Add Prisma models → migrate
2. Create blog service + controller + routes
3. Seed with existing hardcoded content
4. Update BlogsPage.tsx to fetch from API
5. Update BlogDetailPage.tsx to fetch from API
6. Add loading/error states

VALIDATION:
- GET /api/blog/posts returns paginated results
- Blog pages load with real API data
- Category filter works
- Search works
- SEO meta tags render correctly

DONE WHEN:
- Blog pages pull from database instead of hardcoded arrays
- Admin can create/edit/delete posts via API
- Category and search filtering work
- Existing content migrated to database

HANDOFF NOTE:
Future enhancement: integrate Sanity CMS for non-technical editors. For now, API-based CRUD with admin auth is sufficient.
```

---

## PROMPT 06: Wire Admin Dashboard to Real Data

```
OBJECTIVE: Replace all hardcoded data in the admin dashboard with real database queries.

READ FIRST:
- src/pages/dashboard/AdminDashboard.tsx (hardcoded "1,284 users", "₹450k revenue")
- server/src/routes/admin.ts (40+ stub endpoints)
- server/prisma/schema.prisma (User model + all available models)

FILES YOU MAY EDIT:
- server/src/routes/admin.ts
- server/src/controllers/admin.controller.ts (create)
- server/src/services/admin.service.ts (create)
- src/pages/dashboard/AdminDashboard.tsx
- src/services/admin.service.ts (create frontend)

IMPLEMENTATION REQUIREMENTS:
1. Backend admin.service.ts:
   - getDashboardStats() → {totalUsers, activeUsers, newUsersThisWeek, totalSessions, totalRevenue, activePractitioners}
   - getUsers(page, limit, filters) → paginated user list
   - getUserById(id) → user detail with activity
   - updateUserRole(userId, role) → change user role
   - getRecentActivity() → latest signups, bookings, payments
2. Real endpoints (replace top stubs):
   - GET /api/admin/dashboard → aggregate stats from Prisma
   - GET /api/admin/users → paginated user list
   - GET /api/admin/users/:id → user detail
   - PATCH /api/admin/users/:id/role → update role
   - GET /api/admin/activity → recent activity feed
3. All admin endpoints MUST check user.role === 'admin'
4. Frontend: Replace all hardcoded numbers with API data
5. Add loading skeletons for dashboard cards

SEQUENCE:
1. Create admin service with Prisma queries
2. Create admin controller
3. Update admin routes (top 5 most important)
4. Update AdminDashboard.tsx to fetch from API
5. Add loading/error states

VALIDATION:
- Dashboard shows real user count from database
- User list is paginated and searchable
- Role changes persist
- Non-admin users get 403

DONE WHEN:
- Admin dashboard shows real data from database
- User management CRUD works
- Activity feed shows real recent events
- Authorization enforced on all admin endpoints

HANDOFF NOTE:
Start with just the dashboard stats + user list. Don't try to implement all 40 admin endpoints at once. Prioritize the 5 most useful ones.
```

---

## PROMPT 07: Add Sentry Error Tracking + PostHog Analytics

```
OBJECTIVE: Add production-grade error tracking and product analytics in under 2 hours.

READ FIRST:
- src/main.tsx (React entry point)
- src/App.tsx (app root component)
- server/src/index.ts (Express entry point)
- src/components/error-boundary.tsx (existing error boundary)

FILES YOU MAY EDIT:
- src/main.tsx
- src/App.tsx
- src/components/error-boundary.tsx
- server/src/index.ts
- server/src/middleware/ (add error handler)

IMPLEMENTATION REQUIREMENTS:
1. Install: npm install @sentry/react (frontend), npm install @sentry/node (server)
2. Install: npm install posthog-js (frontend)
3. Frontend Sentry setup in main.tsx:
   - Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, environment, release })
   - Wrap App in Sentry.ErrorBoundary
4. Backend Sentry in server/src/index.ts:
   - Sentry.init({ dsn: process.env.SENTRY_DSN })
   - app.use(Sentry.Handlers.requestHandler())
   - app.use(Sentry.Handlers.errorHandler()) — BEFORE custom error handler
5. PostHog in main.tsx:
   - posthog.init(import.meta.env.VITE_POSTHOG_KEY, { api_host })
   - Track page views on route change
   - Identify user on login
6. Add env vars: VITE_SENTRY_DSN, SENTRY_DSN, VITE_POSTHOG_KEY

SEQUENCE:
1. Install packages (frontend + server)
2. Configure Sentry in frontend
3. Configure Sentry in backend
4. Configure PostHog in frontend
5. Test by triggering an intentional error

DONE WHEN:
- Errors appear in Sentry dashboard
- Page views tracked in PostHog
- User identified on login
- Source maps uploaded for readable stack traces
```

---

## PROMPT 08: Implement Real Email Service with Resend

```
OBJECTIVE: Replace console.log email stubs with real transactional emails via Resend.

READ FIRST:
- server/src/services/email.service.ts (console.log stub)
- server/src/controllers/auth.controller.ts (password reset calls email service)
- server/src/services/ (service patterns)

FILES YOU MAY EDIT:
- server/src/services/email.service.ts
- server/src/config/index.ts (add RESEND_API_KEY)

IMPLEMENTATION REQUIREMENTS:
1. Install: npm install resend
2. Replace email.service.ts internals:
   - Keep the same interface (sendEmail, sendPasswordReset, sendWelcome, sendBookingConfirmation)
   - Use Resend API client internally
   - Fallback to console.log when RESEND_API_KEY is not set (dev mode)
3. Email templates (plain HTML, not React Email yet):
   - Password reset with secure link
   - Welcome email after signup
   - Booking confirmation with session details
   - Session reminder (24hrs before)
4. From address: noreply@soulyatri.com (configure in Resend dashboard)

SEQUENCE:
1. Install resend
2. Update email.service.ts
3. Add RESEND_API_KEY to config
4. Test password reset flow end-to-end
5. Test welcome email on signup

DONE WHEN:
- Password reset sends real email
- Welcome email sent on signup
- Works without API key in dev (console.log fallback)
- Email delivery confirmed in Resend dashboard
```

---

## PROMPT 09: Delete Dead Code and Consolidate Duplicates

```
OBJECTIVE: Remove abandoned code, duplicate files, and dead modules to reduce codebase complexity.

READ FIRST:
- server/src/modules/ (18 directories — ALL abandoned stubs)
- server/src/controllers/ (12 files — ACTIVE, used by routes)
- server/seed-simple.ts (duplicate of prisma/seed-dev.ts)
- server/seed-all-dev-users.mjs (uses different passwords)
- server/scripts/create-test-accounts.ts (BROKEN — wrong field name)
- server/setup-dev.cjs (duplicate of setup-dev.mjs)
- server/src/routes/test-new.ts (duplicate of test.ts)
- src/pages/dashboard/PractitionerDashboard.tsx (duplicate of src/pages/practitioner/PractitionerDashboard.tsx)

FILES TO DELETE:
- server/src/modules/ (entire directory — 18 abandoned module stubs)
- server/seed-simple.ts (duplicate)
- server/scripts/create-test-accounts.ts (broken)
- server/setup-dev.cjs (duplicate — keep .mjs version)
- server/src/routes/test-new.ts (duplicate — keep test.ts)

FILES TO REVIEW BEFORE DELETING:
- src/pages/dashboard/PractitionerDashboard.tsx vs src/pages/practitioner/PractitionerDashboard.tsx
  → Keep the one referenced in route config; delete the other

IMPLEMENTATION REQUIREMENTS:
1. Verify no imports reference the files to be deleted: grep -r "modules/" server/src/
2. Verify route config doesn't reference test-new: grep -r "test-new" server/src/
3. Delete files in order (least risky first)
4. Run TypeScript type-check after each batch deletion
5. Update any imports that break

SEQUENCE:
1. Verify no active imports from server/src/modules/
2. Delete server/src/modules/
3. Delete duplicate seeds (seed-simple.ts, create-test-accounts.ts)
4. Delete duplicate setup script (setup-dev.cjs)
5. Delete test-new.ts
6. Resolve practitioner dashboard duplicate
7. Run type-check to verify nothing broke

DONE WHEN:
- No abandoned module stubs in codebase
- No duplicate seed scripts
- No duplicate route files
- TypeScript compiles cleanly
- All routes still work

HANDOFF NOTE:
This is a cleanup task. No new features. The goal is reducing the "WTF per minute" metric for any developer reading this codebase.
```

---

## PROMPT 10: Fix Dark Mode on All Pages

```
OBJECTIVE: Ensure all pages support dark mode using Tailwind's dark: prefix.

READ FIRST:
- src/index.css (dark mode CSS variables defined in .dark class)
- tailwind.config.js (darkMode setting)
- src/pages/AboutPage.tsx (bg-white hardcoded)
- src/pages/ContactPage.tsx (bg-[#f3f3f3] hardcoded)
- src/pages/CareerPage.tsx (bg-[#f3f3f3] hardcoded)
- src/pages/BusinessPage.tsx (bg-[#F8F9FA] hardcoded)

FILES YOU MAY EDIT:
- src/pages/AboutPage.tsx
- src/pages/ContactPage.tsx
- src/pages/CareerPage.tsx
- src/pages/BusinessPage.tsx
- Any other page with hardcoded light-only colors

IMPLEMENTATION REQUIREMENTS:
1. Replace bg-white with bg-background (CSS variable)
2. Replace bg-[#f3f3f3] with bg-muted or bg-background
3. Replace bg-[#F8F9FA] with bg-muted or bg-background
4. Replace any hardcoded text colors with text-foreground or text-muted-foreground
5. Check for hardcoded border colors and replace with border-border
6. Test both light and dark mode visually
7. Use semantic token names from the existing CSS variable system

SEQUENCE:
1. Audit all pages for hardcoded color classes
2. Replace with design token equivalents
3. Verify each page in both modes

DONE WHEN:
- All pages render correctly in both light and dark mode
- No hardcoded hex colors for backgrounds or text
- Design token system used consistently
```
