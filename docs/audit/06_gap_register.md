# Gap Register — Soul Yatri Codebase Audit

## CRITICAL Gaps

### GAP-001: Auth Bypass Enabled by Default
- **Severity**: CRITICAL
- **Area**: Security
- **Evidence**: `src/config/runtime.flags.ts` sets `VITE_AUTH_BYPASS=true` and `VITE_ENABLE_MOCK_AUTH=true` by default
- **Impact**: All protected routes accessible without authentication in development; risk of deploying with bypass active
- **Blocker**: Production deployment safety
- **Fix**: Set defaults to `false`; require explicit `VITE_AUTH_BYPASS=true` only in `.env.local`

### GAP-002: Mock Auth Credentials in Production Bundle
- **Severity**: CRITICAL
- **Area**: Security
- **Evidence**: `src/context/AuthContext.tsx` contains hardcoded test emails, passwords, and mock token generation
- **Impact**: Test credentials visible in minified JS; potential admin access via `admin@test.com`
- **Fix**: Move mock auth behind build-time feature flag or dynamic import that tree-shakes in production

### GAP-003: Base64 Tokens Not Cryptographically Signed
- **Severity**: CRITICAL
- **Area**: Security
- **Evidence**: `src/context/AuthContext.tsx` line ~76 uses `btoa(JSON.stringify({...}))` for mock tokens
- **Impact**: Tokens client-side forgeable; attacker can create admin tokens
- **Fix**: When mock auth is disabled, only real JWT from backend should be accepted; remove btoa token path

### GAP-004: Dev-Login Endpoint Without Environment Guard
- **Severity**: HIGH
- **Area**: Security
- **Evidence**: `server/src/lib/dev-login.ts` generates tokens without password verification
- **Impact**: If deployed to production, anyone can GET an admin token via URL
- **Fix**: Gate behind strict `isDevelopment || isTest` environment check; exclude from production builds

### GAP-005: ~140 Backend Endpoints Return 501
- **Severity**: HIGH
- **Area**: Backend completeness
- **Evidence**: `server/src/routes/*.routes.ts` — therapy, payments, AI, courses, blog, community, shop, events, admin, corporate, careers, ngo, astrology, notifications
- **Impact**: Frontend pages for sessions, connections, admin, practitioner management, courses, blogs are non-functional
- **Dependency**: Each domain needs full controller implementation + database queries

### GAP-006: No Payment Integration
- **Severity**: HIGH
- **Area**: Integrations
- **Evidence**: `server/src/controllers/payments.controller.ts` returns 501; Payment model exists in Prisma but unused
- **Impact**: Platform cannot monetize; therapy sessions cannot be paid for
- **Dependency**: Razorpay/Stripe SDK integration; webhook handling; refund flows

### GAP-007: No Video/RTC Integration
- **Severity**: HIGH
- **Area**: Integrations
- **Evidence**: Session model has `videoRoomUrl` and `videoProvider` fields but no Daily.co/100ms/Agora code
- **Impact**: Therapy sessions cannot be conducted virtually
- **Dependency**: Video SDK choice; room creation API; frontend video component

## HIGH Gaps

### GAP-008: No AI/LLM Integration
- **Severity**: HIGH
- **Area**: Integrations
- **Evidence**: `server/src/controllers/ai.controller.ts` returns 501; no OpenAI SDK in package.json
- **Impact**: AI chat, analysis, insights features non-functional
- **Dependency**: OpenAI API key; prompt engineering; streaming response handling

### GAP-009: Frontend SessionsPage Fully Mocked
- **Severity**: HIGH
- **Area**: Frontend-backend mismatch
- **Evidence**: `src/pages/dashboard/SessionsPage.tsx` uses hardcoded therapist data with `i.pravatar.cc` avatars
- **Impact**: Users cannot book real therapy sessions
- **Dependency**: GAP-005 (therapy endpoints)

### GAP-010: Admin Dashboard Simulated
- **Severity**: HIGH
- **Area**: Frontend-backend mismatch
- **Evidence**: `src/pages/dashboard/AdminDashboard.tsx` shows hardcoded 1,284 users, 156 sessions, ₹4.2L revenue
- **Impact**: Admin cannot manage platform; all metrics fake
- **Dependency**: GAP-005 (admin endpoints) + real aggregation queries

### GAP-011: Practitioner Dashboard Data Simulated
- **Severity**: HIGH
- **Area**: Frontend-backend mismatch
- **Evidence**: `TodaysSessionsPage.tsx`, `MyClientsPage.tsx`, `ManageAvailabilityPage.tsx` all use hardcoded data
- **Impact**: Practitioners cannot manage real schedules, clients, or availability
- **Dependency**: GAP-005 (therapy/session endpoints) + TherapistProfile backend

### GAP-012: No Email Service Integration
- **Severity**: HIGH
- **Area**: Integrations
- **Evidence**: `server/src/services/email.service.ts` has template structure but TODO: Resend integration
- **Impact**: No transactional emails (welcome, password reset, booking confirmations, notifications)
- **Dependency**: Email provider SDK (Resend/SendGrid/SES)

### GAP-013: Notification API Routes Stubbed
- **Severity**: HIGH
- **Area**: Backend
- **Evidence**: Notification routes return 501 but frontend calls them; WebSocket partially works
- **Impact**: NotificationsPage may show errors when trying to fetch/mark-read
- **Dependency**: Implement notification controller CRUD

## MEDIUM Gaps

### GAP-014: Contact Form Non-Functional
- **Severity**: MEDIUM
- **Area**: Public pages
- **Evidence**: `src/pages/ContactPage.tsx` — form state tracked but "Send Request" does nothing
- **Impact**: Visitors cannot contact the team; lead capture broken
- **Fix**: Wire to backend endpoint or email service

### GAP-015: Blog System Hardcoded
- **Severity**: MEDIUM
- **Area**: Content system
- **Evidence**: `src/pages/BlogsPage.tsx` has 9+ posts with inline HTML content
- **Impact**: Cannot add/edit/remove blog posts without code deployment
- **Fix**: Backend blog CRUD + CMS or admin blog editor

### GAP-016: Course Enrollment Non-Functional
- **Severity**: MEDIUM
- **Area**: Feature completeness
- **Evidence**: `src/pages/CourseDetailsPage.tsx` — "Enroll Now" button is placeholder
- **Impact**: Course monetization impossible
- **Dependency**: Course backend + payment integration

### GAP-017: Career Application Non-Functional
- **Severity**: MEDIUM
- **Area**: Feature completeness
- **Evidence**: `src/pages/CareerPage.tsx` — 15+ positions but no apply flow
- **Impact**: Cannot recruit through platform
- **Fix**: Application form + backend storage or email forwarding

### GAP-018: No SEO Meta/OG Tags
- **Severity**: MEDIUM
- **Area**: SEO
- **Evidence**: `index.html` missing description, OG tags, Twitter cards, canonical URL, structured data
- **Impact**: Poor search engine visibility; no social sharing previews
- **Fix**: React Helmet or equivalent for per-page meta; Open Graph images

### GAP-019: No Sitemap/Robots.txt
- **Severity**: MEDIUM
- **Area**: SEO
- **Evidence**: No sitemap.xml or robots.txt in public/
- **Impact**: Search engines may not crawl efficiently
- **Fix**: Generate sitemap from routes; add robots.txt

### GAP-020: Footer Email Signup Not Wired
- **Severity**: MEDIUM
- **Area**: Lead capture
- **Evidence**: `src/components/layout/Footer.tsx` tracks email input but no submission
- **Impact**: Cannot capture email leads
- **Fix**: Wire to email list service or backend

### GAP-021: OAuth Login Not Implemented
- **Severity**: MEDIUM
- **Area**: Auth
- **Evidence**: `src/pages/auth/LoginPage.tsx` shows Google/Apple buttons but they're placeholders
- **Impact**: Users cannot use social login
- **Fix**: Google OAuth + Apple Sign-In integration

### GAP-022: No Nginx Compression
- **Severity**: MEDIUM
- **Area**: Performance
- **Evidence**: `nginx.conf` missing gzip/brotli configuration
- **Impact**: Larger transfer sizes for all users
- **Fix**: Add gzip on; gzip_types for text/css/js/json

### GAP-023: No CSP Header
- **Severity**: MEDIUM
- **Area**: Security
- **Evidence**: `nginx.conf` missing Content-Security-Policy header
- **Impact**: XSS protection layer missing in production
- **Fix**: Add CSP header with appropriate directives

## Architectural Issues

### ARCH-001: Duplicate Architecture — controllers/ vs modules/
- **What**: `server/src/controllers/` has real implementations; `server/src/modules/` has 18 domains × 4 files each — ALL empty stubs with `// TODO: Implement`
- **Impact**: 71 dead files; confusing for developers; import path ambiguity
- **Recommendation**: Delete `server/src/modules/` entirely; expand `controllers/` pattern

### ARCH-002: Modules Validators Have Schemas for Unimplemented Features
- **What**: Validator files in modules/ define Zod schemas for therapy, payments, AI, etc. but no controller uses them
- **Impact**: Wasted code; may diverge from actual requirements when implemented
- **Recommendation**: Move useful validator schemas to `server/src/validators/` or delete

### ARCH-003: Analytics Service Stub
- **What**: `src/services/analytics.service.ts` logs to console only
- **Impact**: No user behavior data collected
- **Recommendation**: Integrate PostHog or Plausible for privacy-friendly analytics

### ARCH-004: In-Memory Cache/Queue in Production
- **What**: `server/src/services/cache.service.ts` and `queue.service.ts` use in-memory implementations
- **Impact**: Data lost on server restart; not scalable
- **Recommendation**: Swap to Redis for cache; BullMQ/Redis for queue

## Dead Code / Duplicates

| File/Area | Issue | Recommendation |
|-----------|-------|----------------|
| server/src/modules/* (71 files) | All empty stubs | Delete entirely |
| src/pages/practitioner/PractitionerDashboard.tsx | Duplicate of dashboard version | Remove alias |
| src/utils/security.ts hashPassword() | Uses btoa (not real hash) | Remove or replace with proper client-side hashing if ever needed |
| Footer copyright year | Hardcoded "2025" | Use new Date().getFullYear() |
| src/utils/testing.utils.ts | Test utilities in production source | Move to tests/ directory |
| SplashScreen | May be orphaned from main router | Verify routing or remove |

## Documentation vs Code Mismatches
See `07_documentation_drift.md` for comprehensive list.
