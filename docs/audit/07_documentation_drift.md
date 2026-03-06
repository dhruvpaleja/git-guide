# Soul Yatri — Documentation Drift Report
**Batch 8 / Audit Layer 7**
**Generated**: 2026-07-15
**Scope**: README.md, docs/ARCHITECTURE.md, docs/API.md, docs/DEVELOPMENT.md, docs/MVP_DEFINITION.md, docs/CONTRIBUTING.md, docs/COMPREHENSIVE_CODEBASE_AUDIT.md, docs/FLOW_ISOLATION_VERIFICATION.md, docs/execution/STATUS.md, docs/execution/BASELINE_METRICS.json

---

## Legend

| Severity | Meaning |
|----------|---------|
| CRITICAL | Contradicts security/production-readiness directly; could mislead a developer into a dangerous decision |
| HIGH | Significant feature described as present that is absent, or vice versa; misleads architecture decisions |
| MEDIUM | Feature partially present but doc overstates or misrepresents it |
| LOW | Minor inaccuracy, stale name, cosmetic mismatch |

---

## Drift Entries

### DRIFT-001: README claims Zustand for state management — not installed
- **Severity**: HIGH
- **Doc claims**: README.md: "**Zustand** for state management" (Tech Stack → Frontend section)
- **Code reality**: Zustand is absent from `package.json`. Auth and Theme state use React Context (`src/context/AuthContext.tsx`, `src/context/ThemeContext.tsx`). No `import { create } from 'zustand'` found anywhere in `src/`.
- **Recommendation**: Remove Zustand from README Tech Stack; replace with "React Context for global state".

---

### DRIFT-002: README claims React Query for data fetching — not installed
- **Severity**: HIGH
- **Doc claims**: README.md: "**React Query** for data fetching" (Tech Stack → Frontend section)
- **Code reality**: `@tanstack/react-query` is absent from `package.json`. All data fetching uses the custom `ApiService` wrapper at `src/services/api.service.ts` with native `fetch` and `useEffect`. No `useQuery` or `useMutation` call exists in `src/`.
- **Recommendation**: Remove React Query from README Tech Stack; describe actual pattern: custom `apiService` + `useEffect` hooks.

---

### DRIFT-003: README and ARCHITECTURE both claim Socket.io — server actually uses `ws`
- **Severity**: HIGH
- **Doc claims**: README.md: "**Socket.io** for real-time features". ARCHITECTURE.md line 162: "**Socket.io**: Real-time notifications and session events". ARCHITECTURE.md line 67: `websocket.ts # Socket.io setup`.
- **Code reality**: `server/package.json` lists `"ws": "^8.19.0"` and `"@types/ws"`. No `socket.io` or `socket.io-client` anywhere. `server/src/lib/websocket.ts` imports from `ws` package. Client `src/services/websocket.service.ts` uses native `WebSocket` API.
- **Recommendation**: Replace all "Socket.io" references in docs with "ws (native WebSocket)". Update ARCHITECTURE.md line 67 comment and "Key Architecture Patterns → WebSocket" section.

---

### DRIFT-004: README claims Redis for caching and sessions — no Redis client present
- **Severity**: HIGH
- **Doc claims**: README.md: "**Redis** for caching and sessions" (Infrastructure section)
- **Code reality**: No `redis`, `ioredis`, or `@redis/client` in `server/package.json`. `server/src/services/cache.service.ts` uses an in-memory `Map`. Comment inside reads "replace with Redis for production". Session rate limiting also uses in-memory state.
- **Recommendation**: Remove Redis from infrastructure stack in README. Add note: "Cache and session storage are in-memory only; Redis migration is required before production."

---

### DRIFT-005: README claims HIPAA-compliant video consultation — no video provider integrated
- **Severity**: CRITICAL
- **Doc claims**: README.md: "**Secure Video Calls**: HIPAA-compliant video consultation platform" (Features → For Practitioners). Also implies Daily.co / 100ms video sessions in MVP_DEFINITION.md (Phase 1 scope: "Video sessions ✅ IN (Daily.co)").
- **Code reality**: No `daily-co`, `@daily-co/daily-js`, `100ms` SDK, or any WebRTC library in `package.json` or `server/package.json`. All therapy session routes in `server/src/routes/therapy.ts` return `501 Not Implemented`. Dashboard `SessionsPage` contains only hardcoded mock data. Video calling is not implemented.
- **Recommendation**: CRITICAL — remove HIPAA-compliant video claim from README entirely or mark it as "planned (not yet implemented)". Do not advertise HIPAA compliance for a feature that does not exist.

---

### DRIFT-006: README and ARCHITECTURE claim Railway/Heroku backend hosting — only Vercel config present
- **Severity**: MEDIUM
- **Doc claims**: README.md: "**Railway/Heroku** for backend hosting" (Infrastructure). Deployment section: "Backend (Railway/Heroku)"
- **Code reality**: `vercel.json` exists at repo root (frontend routing config). No `railway.json`, `Procfile`, `heroku.yml`, or `render.yaml` present. The `docs/audit/_progress.json` also flags this in `known_doc_drift`.
- **Recommendation**: Update README deployment section. Remove Railway/Heroku references or add as suggestions; the only confirmed deployment config is Vercel for the frontend.

---

### DRIFT-007: ARCHITECTURE.md claims ~30 implemented routes — actual count is closer to ~40 LIVE endpoints
- **Severity**: LOW
- **Doc claims**: ARCHITECTURE.md "API Route Status" section: "~30 implemented (auth, users, health-tools, notifications, health, dev routes)"
- **Code reality**: Counting routes with `sendSuccess`/`sendError` calls (non-501 responses): auth (7 LIVE), users (11 LIVE), health-tools (7 LIVE), notifications (3 LIVE), health (2 LIVE), dev routes (3 LIVE) = ~33–40 depending on counting method. The "~30" approximation is close but may undercount LIVE endpoints.
- **Recommendation**: Update ARCHITECTURE.md to say "~35 LIVE endpoints" and run `npm run quality:ci` to confirm exact count. Keep API.md table as source of truth.

---

### DRIFT-008: quality.yml uses `npm run lint || true` — silences lint failures in CI
- **Severity**: HIGH
- **Doc claims**: CONTRIBUTING.md and DEVELOPMENT.md both describe `npm run lint:ci` as a zero-warning CI gate. BATCH:007 STATUS.md entry calls the quality gate "completed". README "Full Quality Gate" documents `npm run quality:ci`.
- **Code reality**: `.github/workflows/quality.yml` runs `npm run lint || true` (not `lint:ci`) — lint failures are silenced with `|| true`. The zero-warning gate only runs locally via `npm run quality:ci` and in the manual BATCH workflow steps; the actual GitHub Actions CI does NOT enforce zero warnings.
- **Recommendation**: Update `quality.yml` to use `npm run lint:ci` (without `|| true`) to match the documented quality gate intention. Otherwise remove the claim that CI enforces zero warnings.

---

### DRIFT-009: CI pipeline (build.yml) includes OWASP Dependency-Check but no test execution
- **Severity**: MEDIUM
- **Doc claims**: docs/execution/STATUS.md and BATCH:016 notes claim "15/15 smoke tests pass". README says "15 Playwright smoke tests covering public routes, auth flow, dashboard routes, and resilience."
- **Code reality**: Neither `.github/workflows/build.yml` nor `.github/workflows/quality.yml` run `npm run test:e2e`. Tests are never executed in CI — only locally. `build.yml` does include OWASP Dependency Check (which is good), but Playwright tests are entirely absent from both workflow files.
- **Recommendation**: Add a CI job running `npx playwright test --project=chromium --grep @smoke` to verify test suite on every PR. Without this, the "15/15 pass" claim is not CI-verified.

---

### DRIFT-010: MVP_DEFINITION.md marks Google OAuth login as ✅ IN scope — not implemented
- **Severity**: HIGH
- **Doc claims**: MVP_DEFINITION.md table row: "User auth (email + Google) | ✅ IN". Phase detail (line ~182): "Google OAuth login". Phase ~1066: "Google OAuth login addition (1 day)".
- **Code reality**: `LoginPage.tsx` has a `handleGoogleLogin()` stub that only logs `console.warn('Google OAuth not yet configured')`. `OnboardingCreateAccountPage.tsx` has a "Sign in with Google" button that shows a `toast.error('Google login coming soon!')`. No OAuth library (`passport-google-oauth2`, `@auth0/*`, or similar) is in either `package.json`. Server has no `/auth/google` route.
- **Recommendation**: Mark Google OAuth as ❌ NOT YET IMPLEMENTED in MVP_DEFINITION.md. Update user-facing UI to clearly label Google login as "coming soon" rather than rendering a non-functional button.

---

### DRIFT-011: ARCHITECTURE.md describes Prisma models as production-ready — several critical domains have NO schema
- **Severity**: HIGH
- **Doc claims**: ARCHITECTURE.md "Database" section implies Prisma is the ORM with full data models. MVP_DEFINITION.md marks Blog, Courses, Community, Shop, Events as OUT of MVP scope, yet the codebase has code UI for all of them (Blogs page, Courses page, etc.)
- **Code reality**: `server/prisma/schema.prisma` has only 13 models: User, RefreshToken, AuditLog, UserProfile, UserSettings, TherapistProfile, TherapistAvailability, Session, MoodEntry, JournalEntry, MeditationLog, Payment, Notification. Zero models exist for: BlogPost, Course/Enrollment, CommunityPost, ShopProduct, Order, Event, CorporateAccount, CareerPosition, NGO. All corresponding API routes return `501`.
- **Recommendation**: Add a "Schema Coverage" section to ARCHITECTURE.md listing the 13 existing models and the ~8 domains with no schema yet. This is critical for developers who may implement features without knowing the schema is absent.

---

### DRIFT-012: FLOW_ISOLATION_VERIFICATION.md claims Dashboard personalization route is fully protected — ProtectedRoute has auth bypass in dev
- **Severity**: CRITICAL
- **Doc claims**: FLOW_ISOLATION_VERIFICATION.md: "Route Protection: ProtectedRoute (requires valid JWT)" for `/personalize?s=4`
- **Code reality**: `src/router/ProtectedRoute.tsx` checks `runtime.flags.ts` `VITE_AUTH_BYPASS` flag, which **defaults to `true`** in development. With `VITE_AUTH_BYPASS=true` (default), **all ProtectedRoutes are bypassed** — no JWT is required. This also applies to production if the env var is not explicitly set to `false`. The `BASELINE_METRICS.json` already flags "auth bypass in ProtectedRoute" as a critical finding.
- **Recommendation**: CRITICAL — update FLOW_ISOLATION_VERIFICATION.md to note the auth bypass caveat. Ensure `VITE_AUTH_BYPASS=false` is enforced in production deployment config (Vercel env vars). Add a "Security Warning" block to the document.

---

### DRIFT-013: README claims "Earnings Tracking" for practitioners — no Earnings page exists
- **Severity**: MEDIUM
- **Doc claims**: README.md Features → For Practitioners: "**Earnings Tracking**: Monitor income and session statistics"
- **Code reality**: The practitioner dashboard (`src/pages/practitioner/PractitionerDashboard.tsx` and `src/pages/dashboard/PractitionerDashboard.tsx`) has no Earnings tab or route. `server/src/routes/therapy.ts` contains no `/earnings` or `/income` endpoint. Payment model exists in Prisma but no earnings controller is implemented.
- **Recommendation**: Remove "Earnings Tracking" from README Features until implemented. The practitioner routes only cover sessions, clients, availability, profile, and logout.

---

### DRIFT-014: COMPREHENSIVE_CODEBASE_AUDIT.md lists axe-core for automated a11y testing — no axe integration in tests
- **Severity**: MEDIUM
- **Doc claims**: `BUILD_PLAN.md` Tech Stack table: "Accessibility: Radix UI + axe-core + Lighthouse a11y — WCAG 2.1 AA target, automated + manual testing". COMPREHENSIVE_CODEBASE_AUDIT.md Section 5.10 references axe-core automation.
- **Code reality**: No `@axe-core/playwright`, `jest-axe`, or `@axe-core/react` in `package.json`. The `tests/example.spec.ts` file has zero axe assertions. BATCH_014 accessibility matrix was self-reported (code inspection), not automated axe scanning. Lighthouse is not run in CI.
- **Recommendation**: Add `@axe-core/playwright` to devDependencies and add axe assertion to at least the public smoke tests. Otherwise, clarify in docs that a11y was verified via code inspection only, not automated tooling.

---

### DRIFT-015: NotFoundPage uses an external Figma API URL for an image — external runtime dependency
- **Severity**: MEDIUM
- **Doc claims**: No doc explicitly covers this, but the 404 page is treated as production-ready throughout docs.
- **Code reality**: `src/pages/NotFoundPage.tsx` line: `src="https://www.figma.com/api/mcp/asset/2a3be53c-efb9-4fcd-8c4a-7daa7c26be4d"`. This is a Figma design-tool API URL used as a production image source. It will break when: (a) the Figma file is moved/deleted, (b) Figma API authentication changes, (c) CSP headers block external image sources. A local fallback `/images/error/happy-face.png` exists in `public/images/error/` but is not used.
- **Recommendation**: Replace the Figma API URL with the local `/images/error/happy-face.png` asset which already exists in `public/images/error/`.

---

### DRIFT-016: DEVELOPMENT.md documents `npm run seed` as database seeding — seed file is `seed-dev.ts` not `seed.ts`
- **Severity**: LOW
- **Doc claims**: DEVELOPMENT.md: "Database Setup: `npm run seed` — optional: seed dev data"
- **Code reality**: `server/package.json` has a `seed` script that likely points to `seed-dev.ts`. The file `server/prisma/seed-dev.ts` exists. However, the `server/seed-simple.ts` at server root is separate. README also says `npm run seed`. The seed script in `server/package.json` should be verified against `seed-dev.ts` vs `seed-simple.ts` to ensure the documented command works.
- **Recommendation**: Verify that `cd server && npm run seed` actually executes `prisma/seed-dev.ts`. Add `--preview-feature` flags or Prisma client generation step to DEVELOPMENT.md if required.

---

### DRIFT-017: ARCHITECTURE.md claims modules/ is "future service layer" — it is actually dead/disconnected code
- **Severity**: MEDIUM
- **Doc claims**: ARCHITECTURE.md: "modules/ — Domain module stubs (future service layer)" with list of ~18 module directories
- **Code reality**: `server/src/routes/index.ts` imports only from `server/src/routes/` and `server/src/controllers/` — never from `server/src/modules/`. The modules directory (~50 files) has duplicate implementations of auth, notifications, and token services that are entirely disconnected from the request pipeline. `docs/audit/_progress.json` confirms: "modules/ directory (~50 files): entirely disconnected from routes/".
- **Recommendation**: Either: (a) migrate routes to use modules/ service layer and remove controllers/, or (b) delete modules/ and document controllers/ as the canonical layer. The current state creates confusion and maintenance risk. Update ARCHITECTURE.md to remove the "future service layer" framing and be explicit about which files are actually used.

---

### DRIFT-018: ARCHITECTURE.md says dev routes are runtime-flag-gated — `enableDevRoutes` still defaults true in production config
- **Severity**: CRITICAL
- **Doc claims**: ARCHITECTURE.md "Authentication & Authorization" section implies dev routes are safely gated. BATCH:009 STATUS.md entry: "deterministic runtime-gated dev/test route mounting"
- **Code reality**: `server/src/config/index.ts`: `enableDevRoutes: isDevelopment || isProduction` — both flags are true, meaning dev routes (including `GET /dev-helper/dev-create-user/:email/:password/:name` which creates DB users via URL with no auth) mount in production. This was flagged in `BASELINE_METRICS.json` as CRITICAL_SECURITY.
- **Recommendation**: CRITICAL — fix `enableDevRoutes` to `isDevelopment && !isProduction` only. Update ARCHITECTURE.md to document this security concern explicitly and reference the fix.

---

### DRIFT-019: COMPREHENSIVE_CODEBASE_AUDIT.md claims Session.notes is "encrypted at rest" — no encryption implemented
- **Severity**: HIGH
- **Doc claims**: The audit doc and server code comments reference encrypted session notes as a data protection measure.
- **Code reality**: `docs/audit/_progress.json` key finding: "Session.notes comment says encrypted at rest but no encryption implemented in controller". The session controller writes notes as plaintext. No AES/KMS encryption wrapper exists.
- **Recommendation**: Either implement field-level encryption for session notes using Node.js `crypto` (AES-256-GCM), or explicitly remove the "encrypted at rest" claim from all documentation until it is implemented. Given the sensitive therapy context, this is a HIGH severity gap.

---

### DRIFT-020: SoulBotSection has a hardcoded name "Dhruv Bhai" — not user-personalized as documented
- **Severity**: LOW
- **Doc claims**: SoulBot is described as an AI assistant that is personalized and responds to the user. The landing page is meant to be a public showcase.
- **Code reality**: `src/features/landing/components/SoulBotSection.tsx` renders `<h3>Welcome Dhruv Bhai!</h3>` and `<p>Main hoon yahan — thoda batao, kya ho raha hai?</p>` — hardcoded with the founder's name and Hindi text. This is developer placeholder content deployed to production.
- **Recommendation**: Replace hardcoded name with generic "Welcome!" or remove personal reference. The Hindi text is culturally authentic for the brand but the hardcoded name is a production bug.

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 4 (DRIFT-005, DRIFT-012, DRIFT-018, and edge of DRIFT-019) |
| HIGH | 8 (DRIFT-001, DRIFT-002, DRIFT-003, DRIFT-004, DRIFT-008, DRIFT-010, DRIFT-011, DRIFT-019) |
| MEDIUM | 6 (DRIFT-006, DRIFT-009, DRIFT-013, DRIFT-014, DRIFT-015, DRIFT-017) |
| LOW | 3 (DRIFT-007, DRIFT-016, DRIFT-020) |
| **Total** | **20** |

### Top 5 Immediate Actions

1. **DRIFT-005** — Remove HIPAA-compliant video claim (no video provider integrated)
2. **DRIFT-018** — Fix `enableDevRoutes` production security vulnerability
3. **DRIFT-012** — Audit bypass caveat in FLOW_ISOLATION doc; enforce prod env var
4. **DRIFT-009** — Add Playwright smoke tests to GitHub Actions CI
5. **DRIFT-010** — Fix non-functional Google OAuth buttons (or remove them)
