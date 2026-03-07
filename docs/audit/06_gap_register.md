# Soul Yatri — Gap Register

**Audit Date**: 2026-07-15
**Batch**: 05 (Gap Register)
**Scope**: Full-stack forensic audit — frontend, backend, database, infrastructure, security, UX, docs

---

## Severity Legend

| Severity | Definition |
|----------|-----------|
| CRITICAL | Exploitable now; data breach, auth bypass, or production sabotage risk |
| HIGH | Must fix before first paying user; functional failure or severe trust damage |
| MEDIUM | Should fix within 30 days of launch; UX degradation or tech debt accumulation |
| LOW | Nice-to-have; polish or minor consistency issues |

---

## CRITICAL BLOCKERS (must fix before any production use)

### GAP-C-001: VITE_AUTH_BYPASS defaults to `true` — All protected routes are publicly accessible

- **Category**: Security
- **Severity**: CRITICAL
- **Affected**: `src/config/runtime.flags.ts`, `src/router/ProtectedRoute.tsx`, ALL routes under `/dashboard/*`, `/personalize`, `/logout`
- **Description**: `runtime.flags.ts` line `const authBypassEnabled = parseBooleanEnv(import.meta.env.VITE_AUTH_BYPASS, true)` — the fallback is `true`. `ProtectedRoute.tsx` then executes `if (runtimeFlags.authBypassEnabled) { return <Outlet />; }` unconditionally. This means that in any environment where `VITE_AUTH_BYPASS` is not explicitly set to `false` in the build, every protected route returns `<Outlet/>` with no authentication check. The flag prints only a `console.warn` in production — it does not block the bypass. Any anonymous user can navigate directly to `/dashboard`, `/dashboard/journal`, `/dashboard/mood`, etc.
- **Risk if unaddressed**: Complete authentication bypass in production. Any user who knows the URL can access any dashboard page, view/create/delete mood entries, journal entries, and meditation logs of any user whose JWT is in localStorage. Also bypasses the therapy booking and confessional pages.
- **Fix**: (1) Change `runtime.flags.ts` fallback from `true` to `false`: `parseBooleanEnv(import.meta.env.VITE_AUTH_BYPASS, false)`. (2) Remove `VITE_AUTH_BYPASS` from `.env.local` or set it to `false`. (3) Set `VITE_AUTH_BYPASS=false` in Vercel production environment variables. (4) Add a CI check that fails if `VITE_AUTH_BYPASS=true` in a non-test build.
- **Effort**: 1 hour (code fix 15 min; env propagation 45 min)

---

### GAP-C-002: `enableDevRoutes` defaults to `true` in production — unauthenticated user creation endpoint exposed

- **Category**: Security
- **Severity**: CRITICAL
- **Affected**: `server/src/config/index.ts`, `server/src/routes/dev-helper.ts`, `server/src/routes/dev-login.ts`, `server/src/index.ts`
- **Description**: `server/src/config/index.ts` sets `enableDevRoutes: envBool('ENABLE_DEV_ROUTES', isDevelopment || isProduction)` — since `isProduction` is `true` in production, the default is `true`. This mounts: (a) `GET /api/v1/dev-helper/dev-create-user/:email/:password/:name` — creates a new DB user with no authentication; credentials passed in the URL (visible in logs, proxy caches, browser history); (b) `GET /api/v1/dev-helper/dev-login/:email` — returns valid JWT access and refresh tokens for any email with no password; (c) `GET /api/v1/dev-helper/dev-create-all` — creates all 4 test users with known passwords. These routes are completely unauthenticated and have no rate limiting beyond the global 100 req/15min limit.
- **Risk if unaddressed**: Any attacker can call `GET /api/v1/dev-helper/dev-create-user/attacker@evil.com/password123/Attacker` to create an admin-equivalent user, then call `GET /api/v1/dev-helper/dev-login/attacker@evil.com` to receive a valid JWT, and gain full access to the platform including all user data in the database.
- **Fix**: (1) Change config default to `enableDevRoutes: envBool('ENABLE_DEV_ROUTES', isDevelopment && !isProduction)`. (2) Set `ENABLE_DEV_ROUTES=false` in all production environment configs. (3) Add IP allowlist middleware to dev routes even in development. (4) Move dev route credentials out of URL params into request body with a shared secret header.
- **Effort**: 2 hours

---

### GAP-C-003: Entire `/admin` router (~80 routes) has no authentication middleware

- **Category**: Security
- **Severity**: CRITICAL
- **Affected**: `server/src/routes/admin.ts` (all ~80 route handlers), `server/src/routes/index.ts` (line `router.use('/admin', adminRoutes)`)
- **Description**: `server/src/routes/admin.ts` mounts ~80 endpoints (head-office, dashboard, platform-health, analytics, users, therapists, astrologers, sessions, payments, audit-logs, content, reports, system, etc.) with zero authentication middleware. No `requireAuth` or `requireRole(['ADMIN'])` call exists anywhere in `admin.ts`. All 80 endpoints return `501 Not Implemented` currently, but any future implementation will be publicly accessible by default. The admin routes are mounted directly: `router.use('/admin', adminRoutes)` with no auth guard at the router level.
- **Risk if unaddressed**: As soon as any admin endpoint is implemented (analytics, user management, audit logs, payment data), it will be publicly accessible with no authentication required. An attacker who enumerates the API will discover the admin namespace and gain access to all platform data.
- **Fix**: (1) Add `requireAuth` and `requireRole(['ADMIN'])` middleware at the router level in `admin.ts`: `router.use(requireAuth, requireRole(['ADMIN']))` as the first line before any route definitions. (2) Verify `rbac.middleware.ts` correctly rejects non-ADMIN roles. (3) Add integration test confirming 401/403 on all admin routes without credentials.
- **Effort**: 3 hours

---

### GAP-C-004: `.env.local` and `.env.production` committed to repository

- **Category**: Security
- **Severity**: CRITICAL
- **Affected**: `.env.local`, `.env.production`, `.gitignore` (has `.env.local` listed but file exists in tree)
- **Description**: `.env.local` is present in the repository (`/home/runner/work/soul-yatri-website/soul-yatri-website/.env.local`). `.env.production` is also present and contains `JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long-with-special-chars-!@#$%`. While `.env.local` contains only `VITE_API_URL=http://localhost:3000/api/v1` and `VITE_ENABLE_ANALYTICS=false` (relatively benign), `.env.production` exposes the JWT secret placeholder which may have been replaced with a real secret in some forks/deployments. Both files are in `.gitignore` but were committed before the gitignore rule was added, or were force-added.
- **Risk if unaddressed**: If `.env.production` was ever used with a real JWT secret, that secret is now in git history permanently. Any developer with repo access can read it, forge JWTs, and impersonate any user including admins. Even with placeholder values, the committed files establish a dangerous pattern.
- **Fix**: (1) `git rm --cached .env.local .env.production` to stop tracking. (2) Run `git filter-repo --invert-paths --path .env.local --path .env.production` to purge from git history. (3) Rotate the JWT secret immediately — treat it as compromised. (4) Use Vercel/CI environment variable injection exclusively for production secrets. (5) Add a `git-secrets` or `detect-secrets` pre-commit hook.
- **Effort**: 4 hours (secret rotation + history purge)

---

### GAP-C-005: Double-mounted routes — all endpoints accessible at both `/api/v1/...` AND `/api/...`

- **Category**: Security / Architecture
- **Severity**: CRITICAL
- **Affected**: `server/src/index.ts` lines 106, 109: `app.use(config.api.prefix, routes)` AND `app.use('/api', routes)` — both mounted simultaneously
- **Description**: The server mounts the same router at two prefixes. `config.api.prefix` is `/api/v1`, so all routes are accessible at both `/api/v1/auth/login` and `/api/auth/login`. This means: (a) rate limiting on `/api/v1` can be bypassed by calling `/api`; (b) CORS and security middleware applied to `/api/v1` may not apply uniformly; (c) audit logs will show inconsistent path patterns; (d) test routes are also double-mounted when `enableTestRoutes` is true.
- **Risk if unaddressed**: Rate limiting bypass: an attacker can exhaust the 5 auth attempts on `/api/v1/auth/login` then switch to `/api/auth/login` for 5 more. CORS policy evasion if per-path rules are ever added. Inconsistent audit trails. Cache invalidation bugs if routes are ever cached.
- **Fix**: Remove `app.use('/api', routes)` (line 109 of `index.ts`). Keep only `app.use(config.api.prefix, routes)`. Update all frontend API service calls to use `VITE_API_URL` with `/api/v1` prefix. Add a redirect or 410 response at `/api/*` with a message to use `/api/v1`.
- **Effort**: 2 hours

---

## HIGH PRIORITY GAPS (must fix before launch)

### GAP-H-001: Google OAuth / Apple OAuth buttons are non-functional in production

- **Category**: UX / Security
- **Severity**: HIGH
- **Affected**: `src/pages/auth/LoginPage.tsx` (`handleGoogleLogin` shows `console.warn`), `src/features/auth/components/SignupForm.tsx` (Google button shows `toast.error('Google login coming soon!')`), `src/pages/auth/SignupPage.tsx` (Apple OAuth stub)
- **Description**: Login and Signup pages render fully-styled Google and Apple OAuth buttons that are completely non-functional. `handleGoogleLogin` only fires `console.warn('Google OAuth not yet configured')`. The signup flow renders a "Sign in with Google" button on the primary account creation step that shows a dismissable toast. No OAuth library (`passport-google-oauth2`, `@auth0/*`, `next-auth`, or similar) is in `package.json` or `server/package.json`. No `/auth/google` route exists on the server.
- **Risk if unaddressed**: Users attempting to sign up with Google (a common expectation for a modern web app) will receive an error toast and lose trust. Non-functional primary CTAs on the signup page directly reduce conversion. Apple OAuth is required for iOS App Store compliance if a native app is ever built.
- **Fix**: Either (a) implement OAuth via a provider like Auth0 or Supabase Auth, or (b) remove OAuth buttons entirely and replace with "Coming Soon — sign up with email above". Option (b) can be done in 1 hour; option (a) requires 2–3 days.
- **Effort**: 1 hour (remove) or 16 hours (implement)

---

### GAP-H-002: Sessions page entirely hardcoded — misrepresents live functionality to users

- **Category**: Architecture / UX
- **Severity**: HIGH
- **Affected**: `src/pages/dashboard/SessionsPage.tsx` (lines 69, 106, 169 — `upcomingSessions`, `therapists`, `pastSessions` all hardcoded arrays), `server/src/routes/therapy.ts` (all endpoints return 501), `server/src/controllers/therapy.controller.ts` (stub)
- **Description**: The Sessions page renders three hardcoded TypeScript arrays as if they represent real user data. `upcomingSessions` hardcodes 2 fake upcoming therapy sessions with specific dates, therapist names (Dr. Priya Sharma, Dr. Ananya Mehta), and session IDs. `therapists` hardcodes 5 fake therapist profiles with fake specializations and pricing. `pastSessions` hardcodes 3 fake past sessions with fake notes. The "Book a Session" CTA on the main dashboard routes to this page. Users who book a therapy session (via any future payment flow) will see this hardcoded data, not their actual sessions.
- **Risk if unaddressed**: User confusion and trust destruction when real booking is implemented and data doesn't match. Risk of presenting fake therapist names to real paying users.
- **Fix**: (1) Implement therapy CRUD backend (see GAP stub domain section). (2) Replace hardcoded arrays with API calls: `GET /api/v1/therapy/sessions` (upcoming), `GET /api/v1/therapy/therapists` (browse). (3) Add proper empty states: "No upcoming sessions — book your first session". (4) Add loading states.
- **Effort**: 32 hours (backend therapy API + frontend wiring)

---

### GAP-H-003: Connections page entirely hardcoded — MOCK_MATCHES array masquerades as live data

- **Category**: Architecture / UX
- **Severity**: HIGH
- **Affected**: `src/pages/dashboard/ConnectionsPage.tsx` (line 46: `const MOCK_MATCHES: ConnectionMatch[]`), no corresponding backend endpoint
- **Description**: The Connections page renders a hardcoded `MOCK_MATCHES` array of 4 fake user matches (soul-match, constellation-peer, healer-match, meditation-buddy). No API call exists. No matching algorithm exists on the backend. The page is linked from the dashboard and presents fake people as real connections.
- **Risk if unaddressed**: Users who attempt to connect with "matches" will experience no response. Trust destruction if users believe they are seeing real peer matches.
- **Fix**: Either remove the Connections feature from the dashboard nav until implemented, or replace with an explicit "Coming Soon" state. Do not ship hardcoded fake user matches.
- **Effort**: 4 hours (remove + coming soon state) or 80+ hours (implement matching)

---

### GAP-H-004: Admin Dashboard hardcodes business metrics — no real data

- **Category**: Architecture / UX
- **Severity**: HIGH
- **Affected**: `src/pages/dashboard/AdminDashboard.tsx` (hardcoded metric arrays), `server/src/routes/admin.ts` (all 501)
- **Description**: AdminDashboard.tsx contains hardcoded metrics (user counts, revenue figures, session statistics) displayed as if they are live platform data. The admin panel is reachable by any user because: (a) the admin route requires ADMIN role in the frontend router, but (b) `VITE_AUTH_BYPASS=true` bypasses all route guards. Admin routes on the backend all return 501.
- **Risk if unaddressed**: Admin users see fabricated metrics and make business decisions on fake data. Security risk due to GAP-C-001 allowing any user to access the admin panel.
- **Fix**: Wire admin dashboard to real aggregated queries from the backend (after implementing GAP-C-003 auth on admin routes). Replace hardcoded metrics with API data. Add loading/error states.
- **Effort**: 24 hours

---

### GAP-H-005: Constellation feature uses dev mock fallback unconditionally

- **Category**: Architecture
- **Severity**: HIGH
- **Affected**: `src/features/constellation/services/constellation.service.ts`, `src/features/constellation/hooks/useConstellation.ts`
- **Description**: `constellation.service.ts` defines `MOCK_NODES`, `MOCK_CONNECTIONS`, and `MOCK_INSIGHTS` arrays at the top of the file. The service's `getConstellation()` function falls back to mock data when the API call fails — which it always does because the constellation backend endpoint returns 501. The `useConstellation` hook then renders this mock data as if it represents the user's real emotional constellation. Users interact with a fake visualization that appears personalized but contains no real data.
- **Risk if unaddressed**: Users believe they are seeing a real reflection of their emotional state. The "node-self" mock node has hardcoded `userId: 'dev-user'`, which could appear in rendered UI.
- **Fix**: (1) Remove the API call fallback to mock data. (2) Show an explicit "Coming Soon" or skeleton empty state when the API returns 501. (3) If keeping the feature, implement a real constellation backend with proper user-scoped data.
- **Effort**: 4 hours (empty state) or 40 hours (implement)

---

### GAP-H-006: twoFactor field stored and returned in settings but never enforced

- **Category**: Security
- **Severity**: HIGH
- **Affected**: `server/src/validators/users.validator.ts` (line 79: `twoFactor: z.boolean().optional()`), `server/src/controllers/users.controller.ts` (lines 162, 185: returns `twoFactor` in settings), `server/prisma/schema.prisma` (UserSettings model)
- **Description**: The `twoFactor` boolean field exists in `UserSettings`, is returned in the settings API response, and can be toggled via `PUT /api/v1/users/settings`. The `SettingsPage.tsx` likely renders a toggle for it. However, at no point in the authentication flow does the server check `settings.twoFactor` and require a TOTP code. `auth.controller.ts` login endpoint never fetches user settings or enforces 2FA. Users who enable "Two-Factor Authentication" via the settings UI will believe they have additional security but will receive none.
- **Risk if unaddressed**: Users who enable 2FA believing their accounts are protected against unauthorized access are not actually protected. This is a false security guarantee that could lead to account takeover with no additional friction for attackers.
- **Fix**: Either (a) implement TOTP 2FA (authenticator app) using `speakeasy` or similar library — 16+ hours, or (b) hide the twoFactor toggle with a "Coming Soon" label and remove `twoFactor` from the settings response until implemented.
- **Effort**: 1 hour (hide UI) or 16 hours (implement)

---

### GAP-H-007: CI pipeline silences lint failures with `|| true`

- **Category**: DevOps / Code Quality
- **Severity**: HIGH
- **Affected**: `.github/workflows/quality.yml` (lint step: `npm run lint || true`)
- **Description**: The GitHub Actions quality workflow runs `npm run lint || true` — the `|| true` means the CI job succeeds even if the linter reports errors or warnings. This means type errors, unused variables, and code quality regressions are never caught by CI. CONTRIBUTING.md and DEVELOPMENT.md both document a zero-warning lint gate (`npm run lint:ci`), but the actual CI runs a silenced version. All 15 smoke tests are also never executed in CI (see DRIFT-009).
- **Risk if unaddressed**: Lint regressions accumulate silently. TypeScript type errors that would catch bugs at compile time go unnoticed. The documented "quality gate" provides false assurance to contributors.
- **Fix**: Replace `npm run lint || true` with `npm run lint:ci` in `quality.yml`. Add a separate `test:e2e` job that runs `npx playwright test --project=chromium --grep @smoke`.
- **Effort**: 1 hour

---

### GAP-H-008: Session notes claimed "encrypted at rest" — no encryption code exists

- **Category**: Security / Data
- **Severity**: HIGH
- **Affected**: `server/prisma/schema.prisma` (Session model, notes field), `server/src/routes/therapy.ts` (stub), documentation
- **Description**: Documentation (COMPREHENSIVE_CODEBASE_AUDIT.md and code comments) claims Session.notes is "encrypted at rest." Examination of all controllers and the therapy routes confirms there is no AES, KMS, or any other encryption wrapper for the notes field. Session notes are stored as plaintext in the PostgreSQL `notes` column. Given that this is a mental health / therapy platform handling highly sensitive clinical data, unencrypted session notes are a serious data protection gap under India's DPDP Act 2023 and any future HIPAA obligations.
- **Risk if unaddressed**: If the database is compromised, all therapy session notes are readable in plaintext. Violates reasonable patient privacy expectations and may constitute a regulatory compliance failure.
- **Fix**: Implement field-level encryption using Node.js `crypto` (AES-256-GCM) with a KMS-managed key, or use Prisma Middleware to transparently encrypt/decrypt the `notes` field. Remove the "encrypted at rest" claim from all documentation until implemented.
- **Effort**: 8 hours

---

### GAP-H-009: NotFoundPage loads image from Figma API — external runtime dependency

- **Category**: Infrastructure / UX
- **Severity**: HIGH
- **Affected**: `src/pages/NotFoundPage.tsx` (Figma API URL as `<img src=...>`), `public/images/error/happy-face.png` (exists but unused)
- **Description**: The 404 page loads its illustration from `https://www.figma.com/api/mcp/asset/2a3be53c-efb9-4fcd-8c4a-7daa7c26be4d` — a Figma design-tool internal asset URL. This URL: (a) will break if the Figma file is deleted or access permissions change, (b) may violate Figma ToS for production use, (c) is blocked by strict CSP policies, (d) adds Figma as a runtime external dependency for a user-facing error page. A local fallback (`public/images/error/happy-face.png`) already exists but is not used.
- **Risk if unaddressed**: 404 page shows a broken image to all users. CSP headers added in the future will block the external request. Figma asset URLs are not guaranteed stable.
- **Fix**: Replace the Figma URL with `/images/error/happy-face.png` in `NotFoundPage.tsx`. One-line change.
- **Effort**: 15 minutes

---

### GAP-H-010: Missing error states on ~60% of dashboard pages

- **Category**: UX
- **Severity**: HIGH
- **Affected**: `src/pages/dashboard/MeditationPage.tsx`, `src/pages/dashboard/NotificationsPage.tsx`, `src/pages/dashboard/ProfilePage.tsx`, `src/pages/dashboard/SettingsPage.tsx`, `src/pages/dashboard/AstrologyDashboard.tsx`, and ~8 other dashboard pages
- **Description**: When API calls fail (network error, 500, 401 token expiry), most dashboard pages either show nothing, show a stale loading state, or show an unhandled exception. Only `MoodPage.tsx` and `JournalPage.tsx` implement visible error states (inline error message + retry button). The remaining ~60% of dashboard pages lack error state UI, meaning a user experiencing API downtime sees a blank page with no explanation or recovery path.
- **Risk if unaddressed**: Users experiencing errors perceive the app as broken. Support load increases. Users abandon sessions, potentially mid-entry for journal/mood, losing their data.
- **Fix**: Add a reusable `<ErrorState message={...} onRetry={...} />` component. Apply it to all API `catch` handlers in dashboard pages. Ensure 401 errors trigger the auth refresh flow.
- **Effort**: 16 hours

---

### GAP-H-011: Missing loading states on ~40% of dashboard pages

- **Category**: UX
- **Severity**: HIGH
- **Affected**: `src/pages/dashboard/SettingsPage.tsx`, `src/pages/dashboard/ProfilePage.tsx`, `src/pages/dashboard/NotificationsPage.tsx`, and ~5 others
- **Description**: Pages that make API calls on mount do not show loading indicators while data is in flight. Users see flash-of-empty-content (FOEC) — the page renders with no data, then data appears. This is particularly jarring on `ProfilePage.tsx` where the form fields are blank until the profile API responds.
- **Risk if unaddressed**: Poor perceived performance. Users may submit forms before data loads, overwriting their own data with empty values.
- **Fix**: Add `isLoading` state to all pages with API calls. Show `<Skeleton />` components (already in UI library at `src/components/ui/skeleton.tsx`) during loading. Show spinner on form submit buttons.
- **Effort**: 12 hours

---

### GAP-H-012: SoulBotSection shows hardcoded "Welcome Dhruv Bhai!" — personal placeholder in production

- **Category**: Content / UX
- **Severity**: HIGH
- **Affected**: `src/features/landing/components/SoulBotSection.tsx`
- **Description**: The SoulBot section on the landing page renders `<h3>Welcome Dhruv Bhai!</h3>` — the founder's name hardcoded as a greeting. This is a developer placeholder that was shipped to production. It presents the AI chatbot demo as personally addressing a specific individual, which is confusing to all other visitors.
- **Risk if unaddressed**: All users see a greeting addressed to someone else. Erodes trust and professionalism of the landing page.
- **Fix**: Replace with `<h3>Welcome!</h3>` or `<h3>Hi there 👋</h3>`. One-line change.
- **Effort**: 15 minutes

---

## MEDIUM PRIORITY GAPS (should fix in first month)

### GAP-M-001: Email service is console-only stub — no transactional emails sent

- **Category**: Infrastructure
- **Severity**: MEDIUM
- **Affected**: `server/src/services/email.service.ts`, `server/src/config/index.ts` (`email.provider: 'console'`)
- **Description**: The email service has full template infrastructure (WELCOME, PASSWORD_RESET, SESSION_CONFIRMATION, CRISIS_ALERT, etc.) but the provider defaults to `'console'`, which only logs to stdout. No Resend, SendGrid, SES, or SMTP integration is wired. New user registrations receive no welcome email. Password reset (which is also a 501 stub on the backend) has no email delivery path. Crisis alert emails (sensitive safety feature for mental health users) are silently dropped.
- **Risk if unaddressed**: Users receive no onboarding communication. Password reset is impossible. Crisis safety escalation emails never deliver.
- **Fix**: Integrate Resend (cheapest for Indian startups, free tier 3000/month). Set `EMAIL_PROVIDER=resend`, `EMAIL_API_KEY`, and `EMAIL_FROM` in environment. Wire `email.service.ts` provider selection. Implement password reset flow end-to-end.
- **Effort**: 8 hours

---

### GAP-M-002: File storage is in-memory only — avatars lost on server restart

- **Category**: Infrastructure
- **Severity**: MEDIUM
- **Affected**: `server/src/services/storage.service.ts`, `server/src/controllers/users.controller.ts` (avatar upload uses `multer` + local disk), `server/src/config/index.ts` (`storage.provider: 'memory'`)
- **Description**: The storage service defaults to in-memory storage. Avatar uploads in `users.controller.ts` use `multer` with local disk storage at `/uploads/avatars/`. On server restart or deployment, all uploaded avatars are lost. On multi-instance deployment (horizontal scaling), avatars uploaded to instance A are not visible from instance B. Config has S3/R2 provider support but keys are empty strings.
- **Risk if unaddressed**: User avatars are lost on every deployment. Cannot scale horizontally.
- **Fix**: Configure S3 (AWS) or Cloudflare R2 (cheaper, Indian data residency options). Set `STORAGE_PROVIDER=s3`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` in environment. Update `storage.service.ts` S3 provider branch.
- **Effort**: 6 hours

---

### GAP-M-003: Cache service is in-memory Map — rate limit state not shared across instances

- **Category**: Infrastructure
- **Severity**: MEDIUM
- **Affected**: `server/src/services/cache.service.ts`, `server/src/middleware/user-rate-limit.middleware.ts`, `server/src/config/index.ts` (`cache.provider: 'memory'`)
- **Description**: The cache service uses an in-memory `Map` with TTL. The user-rate-limit middleware uses this cache to track per-user request counts. On multi-instance deployment, each instance has its own memory cache — a user can make 100 requests to instance A and 100 to instance B, bypassing the 100 req/15min rate limit. Auth lockout state (5 failed login attempts) also likely uses in-memory state and would be bypassed across instances.
- **Risk if unaddressed**: Rate limiting and brute-force protection are ineffective in any scaled deployment.
- **Fix**: Deploy Redis (Upstash free tier for Indian region). Set `CACHE_PROVIDER=redis`, `REDIS_URL`. Update `cache.service.ts` Redis provider branch (already stubbed in the service).
- **Effort**: 4 hours

---

### GAP-M-004: Background job queue is synchronous-only — no async job processing

- **Category**: Infrastructure
- **Severity**: MEDIUM
- **Affected**: `server/src/services/queue.service.ts`, `server/src/config/index.ts` (`queue.provider: 'sync'`)
- **Description**: The queue service defaults to `'sync'` mode, which executes all jobs inline in the request handler. Heavy operations (email delivery, PDF generation, data export, AI processing) block the HTTP response thread. BullMQ is supported in the config but not wired. This is acceptable for MVP but will become a scaling bottleneck as data export requests, session summary generation, and AI calls increase.
- **Risk if unaddressed**: Long-running jobs cause HTTP timeouts. Data export (`GET /api/v1/users/export-my-data`) may time out for users with large datasets.
- **Fix**: Add `QUEUE_PROVIDER=bullmq` and `QUEUE_REDIS_URL` to production config. Wire BullMQ workers for email, export, and AI jobs.
- **Effort**: 12 hours

---

### GAP-M-005: 6 dead CTA buttons are `<div>` elements with no `onClick` — non-interactive and inaccessible

- **Category**: UX / Accessibility
- **Severity**: MEDIUM
- **Affected**: `src/features/landing/components/ServicesSection.tsx` (3x "Book Now" / "Start Now" divs), `src/features/landing/components/HowItWorksSection.tsx` (3x "Get Now"/"Book Now"/"Start Now" divs)
- **Description**: Six landing page CTA buttons are `<div>` elements with `cursor-pointer` CSS but no `onClick` handler and no routing. They appear interactive to sighted users but fire no action on click, keyboard press, or touch. Screen readers cannot interact with them (no role="button", no tabindex, no aria-label). Per `docs/audit/09_cta_button_audit.csv`: "DEAD - div element with no onClick or routing" for all 6.
- **Risk if unaddressed**: Users click "Book Now" and nothing happens — zero conversion to signup. Screen reader users cannot discover these CTAs at all. WCAG 2.1 AA failure (non-text content, keyboard accessibility).
- **Fix**: Convert each to `<Link to="/signup">` or `<button onClick={() => navigate('/signup')}>`. Add `role="button"` and `aria-label` if keeping as div (not recommended).
- **Effort**: 2 hours

---

### GAP-M-006: SoulBot quick-action prompts are visual-only divs — mislead users into thinking AI is interactive

- **Category**: UX
- **Severity**: MEDIUM
- **Affected**: `src/features/landing/components/SoulBotSection.tsx` (3 quick-action prompt divs, 1 mic icon)
- **Description**: The SoulBot chat panel on the landing page renders 3 quick-action prompt buttons ("Help me breathe", "I am Feeling Anxious", "I am Feeling Sad") as div elements with `cursor-pointer` but no onClick handlers. The mic icon for voice input is purely decorative. The entire chat interface is a visual mockup — no AI backend exists (`server/src/routes/ai.ts` returns 501). Users who click the emotionally-charged prompts ("I am Feeling Sad") receive no response.
- **Risk if unaddressed**: A user in distress who clicks "I am Feeling Sad" expecting a response receives silence. This is a significant UX failure for a mental wellness platform and may be actively harmful to vulnerable users.
- **Fix**: (a) Remove quick-action buttons until AI is implemented, or (b) wire each to `/signup?intent=...` to capture intent before signup, or (c) add a clear "Coming Soon" overlay. Do not show interactive-looking mental health prompts that do nothing.
- **Effort**: 2 hours (remove/redirect) or 40+ hours (implement AI)

---

### GAP-M-007: Duplicate route files both mounted — `test.ts` and `test-new.ts`

- **Category**: Architecture
- **Severity**: MEDIUM
- **Affected**: `server/src/routes/test.ts`, `server/src/routes/test-new.ts`, `server/src/index.ts`
- **Description**: Two near-identical test route files exist. `server/src/index.ts` imports only `testRoutes from './routes/test.js'` (not `test-new.ts`). The `test-new.ts` file appears to be a refactored version that was never fully switched to. Both files exist in the repository, creating confusion about which is the canonical test route implementation.
- **Risk if unaddressed**: Developers may accidentally update the wrong test route file. Confusion during onboarding. `test-new.ts` is dead code that adds noise to the codebase.
- **Fix**: Compare `test.ts` and `test-new.ts`. Migrate any additions from `test-new.ts` to `test.ts`. Delete `test-new.ts`. Update comments in `index.ts` to reference `test.ts` explicitly.
- **Effort**: 1 hour

---

### GAP-M-008: Forgot-password / reset-password endpoints are 501 stubs — no password recovery path

- **Category**: UX / Architecture
- **Severity**: MEDIUM
- **Affected**: `server/src/routes/auth.ts` (`POST /forgot-password` → 501, `POST /reset-password` → 501), `src/pages/auth/LoginPage.tsx` (no "Forgot Password" link rendered)
- **Description**: The backend has route stubs for password reset at `POST /api/v1/auth/forgot-password` and `POST /api/v1/auth/reset-password` that return 501. No frontend forgot-password page exists. No email token generation or delivery exists. Users who forget their password have no recovery path.
- **Risk if unaddressed**: Users who forget their password are permanently locked out. Support load for manual password resets. GDPR/DPDP requires a reasonable account recovery mechanism.
- **Fix**: Implement forgot-password: (1) generate a signed JWT reset token, (2) send via email service, (3) validate token on `/reset-password`. Add a `ForgotPasswordPage.tsx` route. Requires email service (GAP-M-001) to be functional first.
- **Effort**: 8 hours (after email integration)

---

### GAP-M-009: Avatar storage is local disk — not S3 / CDN backed; no image optimization in production

- **Category**: Performance / Infrastructure
- **Severity**: MEDIUM
- **Affected**: `server/src/controllers/users.controller.ts` (multer + sharp to `/uploads/avatars/`), `server/src/lib/upload.ts`
- **Description**: Avatar uploads are processed with `sharp` (resize to 256x256 WebP, which is good) and stored in `/uploads/avatars/` on the server's local disk. Avatars are served via `app.use('/uploads', express.static(uploadsPath))`. There is no CDN, no browser caching headers, and no persistence across deployments. Every container restart or redeployment loses all avatars.
- **Risk if unaddressed**: All user avatars lost on every deployment. Cannot serve avatars at scale without CDN.
- **Fix**: Integrate with S3/R2 (GAP-M-002). Update the avatar upload controller to use `storageService.upload()`. Serve avatars from CDN URLs rather than local paths.
- **Effort**: 4 hours (after storage service integration)

---

### GAP-M-010: No SEO meta tags, OG tags, or structured data on any page

- **Category**: SEO
- **Severity**: MEDIUM
- **Affected**: `index.html` (minimal meta tags), all page components (no `<Helmet>` or `<title>` beyond `useDocumentTitle` hook), `src/hooks/useDocumentTitle.ts`
- **Description**: The app uses `useDocumentTitle` to set `document.title` on each page (correct), but there are no Open Graph tags, Twitter Card meta, canonical URLs, structured data (JSON-LD), or per-page meta descriptions anywhere in the codebase. `index.html` has a single generic `<title>Soul Yatri</title>` and no OG tags. For a mental wellness platform competing in the Indian market, SEO and social share previews are critical for organic growth.
- **Risk if unaddressed**: Social shares (WhatsApp, Instagram) show no preview card. Google indexes all pages with the same title and no description. Zero organic search visibility.
- **Fix**: Install `react-helmet-async`. Add per-page SEO components with title, description, OG image, canonical URL. Add JSON-LD structured data for the organization and key services.
- **Effort**: 12 hours

---

### GAP-M-011: PractitionerDashboard exists in two locations — one is completely orphaned from the router

- **Category**: Architecture
- **Severity**: MEDIUM
- **Affected**: `src/pages/practitioner/PractitionerDashboard.tsx` (orphaned — not in any router), `src/pages/dashboard/PractitionerDashboard.tsx` (mounted in router)
- **Description**: There are two files named `PractitionerDashboard.tsx` in different directories. The one in `src/pages/practitioner/` is not imported anywhere in `src/router/index.tsx` or any other file. It is dead code. The active version is in `src/pages/dashboard/PractitionerDashboard.tsx`. The orphaned version may contain newer features or different implementations that could confuse developers.
- **Fix**: Delete `src/pages/practitioner/PractitionerDashboard.tsx`. If it contains unique features not in the dashboard version, migrate them first.
- **Effort**: 1 hour

---

### GAP-M-012: `modules/` directory in server (~71 files) is entirely disconnected from the request pipeline

- **Category**: Architecture
- **Severity**: MEDIUM
- **Affected**: All files in `server/src/modules/` (~71 files across 17 domain subdirectories)
- **Description**: `server/src/routes/index.ts` imports exclusively from `server/src/routes/` and `server/src/controllers/`. No import from `server/src/modules/` exists anywhere in the route pipeline. The modules directory contains complete parallel implementations of auth, health-tools, notifications, users, therapy, AI, astrology, admin, blog, careers, community, corporate, courses, events, NGO, payments, and shop. These are entirely dead code from the request pipeline's perspective. ARCHITECTURE.md describes modules/ as "future service layer" but it has never been wired.
- **Risk if unaddressed**: Developers may accidentally update the modules/ version of a controller instead of the active controllers/ version, leading to "fixes" that have no effect. Dead code inflates the codebase by ~71 files.
- **Fix**: Make an architectural decision: (a) migrate to modules/ pattern (delete controllers/, update route imports) or (b) delete modules/ entirely. Option (b) is faster. Document the decision in ARCHITECTURE.md.
- **Effort**: 8 hours (audit + delete) or 24 hours (migrate to modules pattern)

---

### GAP-M-013: Duplicate controller files — `controllers/auth.controller.ts` vs `modules/auth/auth.controller.ts`

- **Category**: Architecture
- **Severity**: MEDIUM
- **Affected**: `server/src/controllers/auth.controller.ts` (active), `server/src/modules/auth/auth.controller.ts` (orphaned)
- **Description**: Two auth controller implementations exist. The active one in `controllers/` is wired to the route pipeline. The one in `modules/auth/` is dead code. Similarly, `controllers/notifications.controller.ts` is orphaned (notifications are handled inline in `routes/notifications.ts`), creating a three-way divergence for the notifications feature.
- **Fix**: Delete orphaned files as part of modules/ cleanup (GAP-M-012).
- **Effort**: Included in GAP-M-012

---

### GAP-M-014: Astrology data collected at signup with no backend processing

- **Category**: UX / Architecture
- **Severity**: MEDIUM
- **Affected**: `server/src/controllers/users.controller.ts` (`POST /users/astrology-profile` — saves to UserProfile), `server/src/routes/astrology.ts` (all return 501), `src/pages/dashboard/AstrologyDashboard.tsx` (empty/stub UI)
- **Description**: The signup flow collects birth date, birth time, birth place, and face image for astrology profile generation. This data is stored in `UserProfile`. However, the astrology module is entirely 501 — no chart generation, no predictions, no birth chart display. Users go through a multi-step signup process that explicitly collects sensitive personal data (birth location, face image) for a feature that does not exist. This may have data minimization implications under DPDP Act 2023.
- **Risk if unaddressed**: Collecting personal data (including biometric data via face image) without providing the promised feature violates the principle of data minimization. Users may feel deceived.
- **Fix**: Either implement astrology chart generation (heavy lift — requires Vedic astrology library or third-party API) or remove astrology data collection from the signup flow until the feature is ready. Add "Coming Soon" placeholder to AstrologyDashboard.
- **Effort**: 4 hours (remove from signup) or 80+ hours (implement)

---

## LOW PRIORITY GAPS (nice to have)

### GAP-L-001: SplashScreen has no skip mechanism or auto-redirect timeout

- **Category**: UX
- **Severity**: LOW
- **Affected**: `src/pages/SplashScreen.tsx`
- **Description**: The animated splash screen plays through a greeting cycle but has no skip button, no keyboard escape, and no guaranteed auto-redirect after the animation completes. Users on slow connections or who navigate directly to `/` may be stuck.
- **Fix**: Add `setTimeout(() => navigate('/home'), 4000)` as a fallback. Add a "Skip" button that appears after 1 second.
- **Effort**: 1 hour

---

### GAP-L-002: Landing page CTAs route to `/contact` instead of `/signup`

- **Category**: Conversion
- **Severity**: LOW
- **Affected**: `src/features/landing/components/HeroSection.tsx` ("Start Your Journey" → `/contact`), `src/features/landing/components/CTASection.tsx` ("Explore Now" → `/contact`)
- **Description**: Two primary landing page CTAs route to the contact page instead of the signup flow. Per `docs/audit/09_cta_button_audit.csv`: "functional - links to /contact... conversion mismatch."
- **Fix**: Route both CTAs to `/signup`. Change "Explore Now" label to something more specific.
- **Effort**: 30 minutes

---

### GAP-L-003: About page has no CTA — zero conversion path

- **Category**: Conversion
- **Severity**: LOW
- **Affected**: `src/pages/AboutPage.tsx`
- **Description**: The About page has no CTA at the bottom. High-intent visitors who read the full About page have no path to convert to a user or practitioner.
- **Fix**: Add "Join Soul Yatri Today" CTA → `/signup` and "Apply as Practitioner" CTA → `/contact?type=practitioner`.
- **Effort**: 2 hours

---

### GAP-L-004: DEVELOPMENT.md documents `npm run seed` but seed file path is ambiguous

- **Category**: Documentation
- **Severity**: LOW
- **Affected**: `docs/DEVELOPMENT.md`, `server/prisma/seed-dev.ts`, `server/seed-simple.ts`
- **Description**: Two seed files exist at different paths. DEVELOPMENT.md says `npm run seed`. Verify `server/package.json` seed script points to the correct file.
- **Fix**: Verify seed script target, add clarification to DEVELOPMENT.md.
- **Effort**: 30 minutes

---

### GAP-L-005: Analytics service is a stub — no real analytics provider connected

- **Category**: Analytics
- **Severity**: LOW
- **Affected**: `src/services/analytics.service.ts`, `server/src/config/index.ts`
- **Description**: No analytics provider (Mixpanel, PostHog, GA4, Plausible) is integrated. User behavior, conversion funnels, feature adoption, and error rates are not tracked. The `analytics.service.ts` is a stub.
- **Fix**: Integrate PostHog (GDPR-friendly, has Indian data residency options, free tier 1M events/month). Add conversion tracking events for signup, session booking, mood entry.
- **Effort**: 8 hours

---

### GAP-L-006: No Playwright tests in CI — smoke suite runs only locally

- **Category**: Testing / DevOps
- **Severity**: LOW (exacerbated by GAP-H-007)
- **Affected**: `.github/workflows/build.yml`, `.github/workflows/quality.yml`, `tests/example.spec.ts`
- **Description**: 15 Playwright smoke tests exist and reportedly pass locally but are never run in any CI workflow. PRs can break authentication, dashboard navigation, or health tool CRUD without detection.
- **Fix**: Add Playwright test job to CI. See GAP-H-007.
- **Effort**: Included in GAP-H-007

---

## DEAD CODE INVENTORY

| File / Module | Type | Reason Dead | Recommended Action |
|---|---|---|---|
| `server/src/modules/` (entire directory, ~71 files) | Dead module layer | Never imported by routes/controllers pipeline | Delete or migrate (GAP-M-012) |
| `server/src/modules/auth/auth.controller.ts` | Duplicate controller | `controllers/auth.controller.ts` is the active one | Delete |
| `server/src/modules/auth/auth.routes.ts` | Orphaned routes | Not mounted in `routes/index.ts` | Delete |
| `server/src/modules/auth/auth-audit.service.ts` | Orphaned service | Duplicate of audit logic in active controller | Delete |
| `server/src/modules/auth/tokens.service.ts` | Duplicate service | `services/tokens.service.ts` is active | Delete |
| `server/src/modules/notifications/notifications.controller.ts` | Dead duplicate | Notifications handled inline in `routes/notifications.ts` | Delete |
| `server/src/modules/notifications/notifications.service.ts` | Dead duplicate | Same as above | Delete |
| `server/src/modules/health-tools/health-tools.controller.ts` | Dead duplicate | Active version in `controllers/health-tools.controller.ts` | Delete |
| `server/src/modules/users/users.controller.ts` | Dead duplicate | Active version in `controllers/users.controller.ts` | Delete |
| `server/src/modules/admin/admin.controller.ts` | Dead duplicate | `controllers/admin.controller.ts` is active (also 501) | Delete |
| `server/src/controllers/notifications.controller.ts` | Orphaned controller | Notifications handled inline in `routes/notifications.ts` | Delete |
| `server/src/routes/test-new.ts` | Orphaned route file | Only `routes/test.ts` is mounted in `index.ts` | Delete after diff |
| `src/pages/practitioner/PractitionerDashboard.tsx` | Orphaned page | Not in router; `pages/dashboard/PractitionerDashboard.tsx` is active | Delete |
| `src/validators/` (entire directory in server, ~12 files) | Duplicate validators | `modules/*/validator.ts` files are also dead; `validators/` dir duplicates Zod schemas from controllers | Audit and consolidate |
| All `server/src/modules/*/types.ts` files | Dead types | Not imported by active code | Delete with modules/ |
| All `server/src/modules/*/validator.ts` files | Dead validators | Not used by active routes | Delete with modules/ |

---

## DOCUMENTATION DRIFT SUMMARY

The following 20 documentation drift entries were identified in `docs/audit/07_documentation_drift.md`:

| ID | Summary | Severity |
|---|---|---|
| DRIFT-001 | README claims Zustand for state management — not installed; React Context used instead | HIGH |
| DRIFT-002 | README claims React Query for data fetching — not installed; custom ApiService + useEffect used | HIGH |
| DRIFT-003 | README and ARCHITECTURE claim Socket.io — server uses `ws` (native WebSocket), not Socket.io | HIGH |
| DRIFT-004 | README claims Redis for caching/sessions — no Redis client; in-memory Map only | HIGH |
| DRIFT-005 | README claims HIPAA-compliant video consultation — no video provider integrated; all therapy routes are 501 | CRITICAL |
| DRIFT-006 | README/ARCHITECTURE claim Railway/Heroku backend hosting — only Vercel config present | MEDIUM |
| DRIFT-007 | ARCHITECTURE says ~30 implemented routes — actual LIVE count is ~35-40 | LOW |
| DRIFT-008 | quality.yml uses `npm run lint \|\| true` — silences lint failures in CI despite documented zero-warning gate | HIGH |
| DRIFT-009 | CI pipeline never runs Playwright tests — smoke suite pass claims are locally-only | MEDIUM |
| DRIFT-010 | MVP_DEFINITION.md marks Google OAuth as ✅ IN scope — `handleGoogleLogin` is console.warn only | HIGH |
| DRIFT-011 | ARCHITECTURE implies full Prisma coverage — 9 major domains (Blog, Courses, Community, Shop, Events, Corporate, Careers, NGO, Astrology) have zero DB models | HIGH |
| DRIFT-012 | FLOW_ISOLATION_VERIFICATION claims routes are JWT-protected — VITE_AUTH_BYPASS defaults true bypasses all guards | CRITICAL |
| DRIFT-013 | README claims Earnings Tracking for practitioners — no earnings page or endpoint exists | MEDIUM |
| DRIFT-014 | BUILD_PLAN claims axe-core automated a11y testing — no axe-core in package.json or tests | MEDIUM |
| DRIFT-015 | NotFoundPage uses Figma API URL as production image source — external runtime dependency | MEDIUM |
| DRIFT-016 | DEVELOPMENT.md documents `npm run seed` — seed file path is ambiguous (seed-dev.ts vs seed-simple.ts) | LOW |
| DRIFT-017 | ARCHITECTURE says modules/ is "future service layer" — 71 files entirely disconnected from routes | MEDIUM |
| DRIFT-018 | ARCHITECTURE implies dev routes are safely gated — `enableDevRoutes` defaults true in production | CRITICAL |
| DRIFT-019 | COMPREHENSIVE_CODEBASE_AUDIT claims Session.notes "encrypted at rest" — no encryption code exists | HIGH |
| DRIFT-020 | SoulBotSection hardcodes "Welcome Dhruv Bhai!" — founder's name visible to all visitors | LOW |

---

## DEPENDENCY MAPPING

### Features blocked by other gaps:

```
Video Therapy Sessions
  └─ blocked by: Daily.co API integration (not started), Session model completion (partial),
                 WebRTC signaling server (not started), Payment flow (not started, GAP stub)

Password Reset
  └─ blocked by: Email service (GAP-M-001 — console-only), Frontend ForgotPasswordPage (missing)

Therapy Booking (real data)
  └─ blocked by: Therapy backend implementation (GAP stub domain),
                 Sessions page de-hardcoding (GAP-H-002), Payment integration (GAP stub)

Admin Dashboard (real data)
  └─ blocked by: Admin route auth (GAP-C-003), Admin backend implementation (all 501)

Astrology Feature
  └─ blocked by: Vedic astrology library or API integration (not started),
                 AstrologyProfile model completion, no chart generation logic

Community Feature
  └─ blocked by: BlogPost/CommunityPost DB models (not created), community backend (all 501)

Real-time Notifications (WebSocket)
  └─ blocked by: WebSocket service business logic (lib/websocket.ts is skeleton),
                 In-memory cache being replaced with Redis (GAP-M-003)

Practitioner Earnings
  └─ blocked by: Payment integration, Session model completion, Earnings endpoint (not started)

GDPR / DPDP Data Export (full)
  └─ currently partially working, blocked by: completing all domain DB models
     (currently exports only User+Profile+MoodEntry+JournalEntry+MeditationLog+Session+Payment+Notification)

Crisis Safety Escalation (AI detection → alert email)
  └─ blocked by: AI integration (GAP stub), Email service (GAP-M-001)

Security hardening (complete)
  └─ blocked by: Fix GAP-C-001 through GAP-C-005 first, then add 2FA (GAP-H-006),
                 then add session encryption (GAP-H-008)
```

---

## STUB DOMAINS (all return 501)

All 13 domains below return `HTTP 501 Not Implemented` for every route. Estimated effort is to MVP level (basic CRUD, no advanced features).

| # | Domain | Route File | Backend Status | DB Models Needed | Frontend Status | Estimated Effort (MVP) |
|---|---|---|---|---|---|---|
| 1 | Therapy Booking | `server/src/routes/therapy.ts` | All 501 | Session (partial, needs completion), TherapistProfile (exists) | SessionsPage hardcoded | 40 hours |
| 2 | AI / SoulBot | `server/src/routes/ai.ts` | All 501 | None (OpenAI API, no DB model needed) | SoulBotSection visual-only | 24 hours |
| 3 | Astrology | `server/src/routes/astrology.ts` | All 501 | AstrologyChart (new model needed) | AstrologyDashboard stub | 60 hours |
| 4 | Admin Platform | `server/src/routes/admin.ts` | All 501 (~80 routes) | Aggregates from existing models | AdminDashboard hardcoded | 80 hours |
| 5 | Payments | `server/src/routes/payments.ts` | All 501 | Payment (exists, partial) | No payment UI exists | 40 hours |
| 6 | Blog | `server/src/routes/blog.ts` | All 501 | BlogPost (missing) | BlogsPage+BlogPostPage static | 16 hours |
| 7 | Courses | `server/src/routes/courses.ts` | All 501 | Course, Enrollment (both missing) | CoursesPage+CourseDetailsPage static | 24 hours |
| 8 | Community | `server/src/routes/community.ts` | All 501 | CommunityPost, Comment, Reaction (all missing) | No community UI | 32 hours |
| 9 | Shop | `server/src/routes/shop.ts` | All 501 | Product, CartItem, Order (all missing) | No shop UI | 48 hours |
| 10 | Events | `server/src/routes/events.ts` | All 501 | Event, EventBooking (both missing) | No events UI | 24 hours |
| 11 | Corporate / B2B | `server/src/routes/corporate.ts` | All 501 | CorporateAccount (missing) | CorporatePage static HTML | 20 hours |
| 12 | Careers | `server/src/routes/careers.ts` | All 501 | JobPosting, Application (both missing) | CareerPage static HTML | 12 hours |
| 13 | NGO / CSR | `server/src/routes/ngo.ts` | All 501 | NGOPartner (missing) | No NGO UI | 16 hours |

**Total estimated effort to bring all stub domains to MVP**: ~436 developer-hours (~11 weeks solo or ~3 weeks with a team of 4)

---

## MISSING DATABASE MODELS

The following 9+ domains have frontend/backend code but zero Prisma schema representation:

| Domain | Missing Models | Impact |
|---|---|---|
| Blog | BlogPost, BlogTag, BlogAuthor | Blog page is static; no CMS possible |
| Courses | Course, Module, Lesson, Enrollment, CourseProgress | Course pages static; no enrollment |
| Community | CommunityPost, Comment, Reaction, Follow | Community feature entirely absent |
| Shop | Product, ProductVariant, CartItem, Order, OrderItem | Shop feature entirely absent |
| Events | Event, EventBooking, EventAttendee | Events feature entirely absent |
| Corporate | CorporateAccount, CorporateEmployee, CorporateContract | B2B onboarding impossible |
| Careers | JobPosting, JobApplication | Careers form submits to nothing |
| NGO | NGOPartner, CSRProgram, NGOBeneficiary | NGO feature entirely absent |
| Astrology | AstrologyChart, PlanetPosition, Prediction | Collected birth data has no chart output |

---

*End of Gap Register — Soul Yatri Platform Forensic Audit*
*Total gaps identified: 5 CRITICAL + 12 HIGH + 14 MEDIUM + 6 LOW = 37 gaps*
*Total dead code files: ~75+ (primarily modules/ directory)*
*Total stub domain endpoints: ~241 routes returning 501*
*Estimated total remediation effort (all gaps): ~550–600 developer-hours*
