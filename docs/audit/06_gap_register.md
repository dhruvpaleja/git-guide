# Gap Register — Soul Yatri Codebase Audit

## CRITICAL GAPS (Blocking MVP/Revenue)

### GAP-001: Payment System Not Implemented
- **Impact**: Revenue completely blocked
- **Evidence**: 27 endpoints in `server/src/routes/payments.ts` all return 501
- **Schema**: Payment model exists but is orphaned (no code writes to it)
- **Integration**: Razorpay mentioned in docs but no SDK integration
- **Missing**: Order creation, payment verification, webhook handler, refund flow, subscription management
- **Blocker for**: Therapy booking, courses, shop, memberships

### GAP-002: Therapy Booking System Not Implemented
- **Impact**: Core product feature non-functional
- **Evidence**: 20 endpoints in `server/src/routes/therapy.ts` all return 501
- **Schema**: Session model orphaned; TherapistAvailability orphaned
- **Missing**: Therapist listing, slot availability, booking flow, session management, video integration
- **Frontend**: SessionsPage.tsx shows hardcoded mock data
- **Blocker for**: Revenue, practitioner workflow, user engagement

### GAP-003: Auth Bypass Enabled by Default in Production
- **Impact**: CRITICAL SECURITY — all protected routes accessible without authentication
- **Evidence**: `src/config/runtime.flags.ts` — `authBypassEnabled` defaults to `true`
- **Risk**: Anyone can access admin, practitioner, astrology dashboards
- **Production behavior**: Only prints console.warn, does NOT block access
- **Fix required**: Default to `false`; env override for dev only

### GAP-004: Mock Auth with Hardcoded Credentials Enabled by Default
- **Impact**: Test accounts work in production with known passwords
- **Evidence**: `src/context/AuthContext.tsx` — 4 test accounts with simple passwords
- **Accounts**: user@test.com (user123), admin@test.com (admin123), etc.
- **Risk**: Unauthorized access to any role
- **Fix required**: Disable mock auth in production; remove hardcoded credentials

### GAP-005: Dev Login Routes Enabled in Production
- **Impact**: Direct login bypass without password
- **Evidence**: `server/src/routes/dev-login.ts` — GET endpoints that auto-login
- **Fix required**: Gate behind `NODE_ENV !== 'production'`

---

## HIGH GAPS (Blocking Launch Readiness)

### GAP-006: Admin Dashboard Entirely Fake
- **Evidence**: `src/pages/dashboard/AdminDashboard.tsx` — hardcoded "1,284 users", "₹450k revenue"
- **Backend**: 40+ admin endpoints all return 501
- **Impact**: No real platform management ability

### GAP-007: AI Assistant Not Implemented
- **Evidence**: `server/src/routes/ai.ts` — 11 endpoints all 501
- **Missing**: OpenAI integration, chat API, crisis detection, conversation storage
- **Schema gap**: No AIConversation/AIMessage models in Prisma schema
- **Frontend**: SoulBot section on landing is static mockup

### GAP-008: Blog System Schema Missing
- **Evidence**: No BlogPost/BlogCategory/BlogComment models in `server/prisma/schema.prisma`
- **Frontend**: `src/pages/BlogsPage.tsx` uses 15+ hardcoded blog posts
- **Impact**: SEO content strategy blocked

### GAP-009: Course System Schema Missing
- **Evidence**: No Course/CourseModule/Enrollment models in schema
- **Frontend**: `src/pages/CoursesPage.tsx` uses 50+ hardcoded courses from `courses.data.ts`
- **Impact**: Course enrollment revenue blocked

### GAP-010: Contact Form Non-Functional
- **Evidence**: `src/pages/ContactPage.tsx` — form fields exist but submit does nothing
- **Impact**: Lead capture completely broken
- **Fix**: Wire to email service or CRM

### GAP-011: Video/Telehealth Integration Missing
- **Evidence**: No Daily.co/Agora/Twilio integration anywhere in codebase
- **Schema**: Session model has `roomUrl` field but never populated
- **Impact**: Therapy sessions cannot happen remotely

### GAP-012: Email Service is Console-Only Stub
- **Evidence**: `server/src/services/email.service.ts` — logs to console
- **Impact**: No password reset, no session reminders, no welcome emails
- **Config ready**: Resend/SendGrid/SES patterns documented but not wired

### GAP-013: Cache Service is In-Memory Only
- **Evidence**: `server/src/services/cache.service.ts` — Map-based, single-process
- **Impact**: Cache lost on restart; no multi-instance support
- **Config ready**: Redis-ready comments

### GAP-014: Storage Service is In-Memory Only
- **Evidence**: `server/src/services/storage.service.ts` — in-memory
- **Impact**: File uploads lost on restart
- **Config ready**: S3/R2-ready comments

---

## MEDIUM GAPS (Quality/Polish)

### GAP-015: No SEO Implementation
- **Evidence**: `index.html` missing meta description, og:image
- **Impact**: No search engine discoverability
- **Missing**: Per-page meta tags, sitemap.xml, robots.txt, schema.org markup, canonical URLs

### GAP-016: OAuth (Google/Apple) Not Implemented
- **Evidence**: `src/pages/auth/LoginPage.tsx` — buttons exist, marked "not yet configured"
- **Impact**: User friction at signup

### GAP-017: Practitioner Onboarding Incomplete
- **Evidence**: PractitionerOnboardingPage.tsx exists but:
  - No backend endpoint to create TherapistProfile via API
  - No admin approval workflow
  - No credential verification
- **Impact**: Cannot onboard new therapists

### GAP-018: Constellation Feature Has Mock Fallback
- **Evidence**: `src/features/constellation/services/constellation.service.ts` includes MOCK_NODES
- **Backend gap**: No `/constellation` endpoints in backend routes
- **Impact**: Feature works only with mock data

### GAP-019: Connections/Matching is Completely Mock
- **Evidence**: `src/pages/dashboard/ConnectionsPage.tsx` — MOCK_MATCHES hardcoded
- **Backend gap**: No matching algorithm or endpoints
- **Impact**: Connection feature is visual demo only

### GAP-020: Docker Compose Has Hardcoded Secrets
- **Evidence**: `docker-compose.yml` — `JWT_SECRET=change-me-in-production`, `POSTGRES_PASSWORD=kimi_secret`
- **Fix**: Move to `.env.docker` file with `.gitignore` entry

### GAP-021: Client-Side security.ts Uses btoa() for "Hashing"
- **Evidence**: `src/utils/security.ts` — `hashPassword()` uses base64 encoding
- **Impact**: Not a security function; misleading name
- **Fix**: Remove client-side password hashing entirely (backend handles it)

---

## DEAD CODE & DUPLICATION

### DUP-001: Duplicate Controller Architecture
- **Location 1**: `server/src/controllers/*.ts` (12 files — ACTIVE, used by routes)
- **Location 2**: `server/src/modules/*/controller.ts` (18 dirs — ABANDONED, all stubs/empty)
- **Recommendation**: Delete `server/src/modules/` entirely OR migrate to it exclusively

### DUP-002: Duplicate Practitioner Dashboard
- `src/pages/dashboard/PractitionerDashboard.tsx`
- `src/pages/practitioner/PractitionerDashboard.tsx`
- Both render practitioner views with different implementations

### DUP-003: 4 Redundant Seed Scripts
- `server/prisma/seed-dev.ts` (passwords: user123)
- `server/seed-simple.ts` (identical to seed-dev.ts)
- `server/seed-all-dev-users.mjs` (passwords: User123!@#)
- `server/scripts/create-test-accounts.ts` (BROKEN: wrong field name)
- **Recommendation**: Keep one; delete others

### DUP-004: Duplicate Setup Scripts
- `server/setup-dev.cjs`
- `server/setup-dev.mjs`
- Same logic in different module formats

### DUP-005: Test Route Duplication
- `server/src/routes/test.ts`
- `server/src/routes/test-new.ts`

---

## DOCUMENTATION DRIFT (Critical Mismatches)

### DRIFT-001: React Query Claimed but Not Installed
- **Doc**: BUILD_PLAN.md → "React Query: Server state and data fetching cache"
- **Reality**: Not in package.json; not imported anywhere

### DRIFT-002: Zustand Claimed but Not Installed
- **Doc**: BUILD_PLAN.md → "Zustand: Feature-specific stores"
- **Reality**: Not in package.json; React Context used instead

### DRIFT-003: Socket.io Claimed but ws Used
- **Doc**: BUILD_PLAN.md → "Socket.IO: Real-time notifications"
- **Reality**: Backend uses `ws` package; frontend WebSocket service uses native WebSocket

### DRIFT-004: AES-256 Encryption Claimed but Not Implemented
- **Doc**: BUILD_PLAN.md → "All therapy session data: AES-256 encryption at rest"
- **Reality**: No encryption library installed; data stored unencrypted

### DRIFT-005: HIPAA Audit Logging Claimed but Not Functional
- **Doc**: BUILD_PLAN.md → "HIPAA-style audit logs"
- **Reality**: AuditLog model exists but nothing writes to it

### DRIFT-006: Sentry/PostHog Monitoring Claimed but Not Integrated
- **Doc**: ARCHITECTURE.md → "Monitoring: Sentry + PostHog"
- **Reality**: Neither installed nor configured

### DRIFT-007: Multi-Currency Support Overclaimed
- **Doc**: BUILD_PLAN.md → "8 currencies: INR, USD, EUR, GBP, AUD, CAD, SGD, AED"
- **Reality**: Only INR in Payment model; no Stripe integration

### DRIFT-008: Health Tools Endpoints Misrepresented in Some Docs
- **Some docs** claim health tools are "not implemented"
- **Reality**: Health tools (mood, journal, meditation) ARE fully implemented with real CRUD endpoints

---

## DEPENDENCIES & BLOCKERS

| Feature | Blocks | Blocked By |
|---------|--------|------------|
| Payments | Therapy booking, courses, shop, memberships | Razorpay SDK integration |
| Therapy booking | Practitioner revenue, session management | Payments, video integration, therapist availability |
| Video calls | Remote therapy sessions | Daily.co/Agora integration |
| Email service | Password reset, reminders, welcome emails | Resend/SendGrid integration |
| Blog system | SEO content, organic traffic | BlogPost schema + CMS |
| Course enrollment | Course revenue | Course schema + payments |
| Admin dashboard | Platform management | Real admin API endpoints |
| OAuth | Reduced signup friction | Google/Apple developer setup |
| Practitioner onboarding | New therapist supply | Admin approval workflow |
