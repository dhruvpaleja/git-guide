# Master Execution Roadmap — Soul Yatri

**Purpose**: Step-by-step, dependency-aware guide to take Soul Yatri from 28/100 → 85/100.  
**How to use**: Follow phases in order. Within each phase, follow tasks top-to-bottom. Each task references the exact files to read first and the exact prompt to execute.  
**Companion**: For granular checkbox-based per-step instructions with verification commands, also see [`MASTER_TODO_LIST.md`](MASTER_TODO_LIST.md) (51 action items, P0/P1/P2/P3 priority buckets).

---

## Before You Start: Orientation (Read These First)

Read these files in this exact order to understand the full picture before touching any code:

| Step | File to Read | Why |
|------|-------------|-----|
| 1 | [`docs/ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md`](../ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md) | Full audit — understand current state, scores, architecture |
| 2 | [`docs/audit/06_gap_register.md`](06_gap_register.md) | All 23 gaps — what's broken and why |
| 3 | [`docs/audit/05_feature_matrix.csv`](05_feature_matrix.csv) | Per-feature status — which features are real, mock, or stub |
| 4 | [`docs/audit/03_backend_route_matrix.csv`](03_backend_route_matrix.csv) | Every API endpoint — what works (3 controllers) vs 501 stubs |
| 5 | [`docs/audit/02_frontend_route_matrix.csv`](02_frontend_route_matrix.csv) | Every route — which pages are live, mock, or static |
| 6 | [`docs/audit/11_cost_model.md`](11_cost_model.md) | What it will cost at each growth stage |
| 7 | [`docs/audit/14_execution_prompts.md`](14_execution_prompts.md) | All 15 implementation prompts (reference during execution) |

---

## Dependency Graph

```
PROMPT 001 (Auth Fix) ─────────────────────────────────────┐
  ↓                                                         │
PROMPT 010 (Delete Dead Code) ──── No dependencies          │
  ↓                                                         │
PROMPT 004 (Email / Resend) ────────────────────┐           │ Everything
  ↓                                              │           │ depends on
PROMPT 002 (Razorpay Payments) ─────────┐        │           │ auth being
  ↓                                      │        │           │ fixed first
PROMPT 003 (100ms Video) ───────┐        │        │           │
  ↓                              │        │        │           │
PROMPT 012 (Therapist Dashboard)─┤ Needs  │ Needs  │ Needs     │
  ↓                              │ Video  │ Payment│ Email     │
PROMPT 006 (Contact Form) ──────┤        │        │           │
  ↓                              │        │        │           │
PROMPT 007 (Footer Signup) ─────┘        │        │           │
  ↓                                      │        │           │
PROMPT 005 (AI Chat) ─── Independent     │        │           │
  ↓                                      │        │           │
PROMPT 008 (Google OAuth) ─ Independent  │        │           │
  ↓                                      │        │           │
PROMPT 013 (Notifications) ──────────────┘        │           │
  ↓                                               │           │
PROMPT 009 (SEO) ─── Independent                  │           │
  ↓                                               │           │
PROMPT 011 (Blog CMS) ─── Independent             │           │
  ↓                                               │           │
PROMPT 014 (Course Enrollment) ───────────────────┘           │
  ↓                                                           │
PROMPT 015 (Career Application) ──────────────────────────────┘
```

---

## PHASE 0: Orientation & Setup (Day 0)

**Goal**: Understand the codebase and prepare environment.

### Task 0.1: Clone & Set Up Local Dev
```bash
git clone <repo>
cd soul-yatri-website
npm install
cd server && npm install && cd ..
```

### Task 0.2: Set Up Environment Files
Create these files (they DON'T exist yet):

**`.env.local`** (frontend):
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_AUTH_BYPASS=false
VITE_ENABLE_MOCK_AUTH=false
```

**`server/.env`** (backend):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/soulyatri
JWT_SECRET=<generate-random-64-char>
JWT_REFRESH_SECRET=<generate-random-64-char>
NODE_ENV=development
PORT=3000
```

### Task 0.3: Database Setup
```bash
cd server
docker-compose up -d  # Starts PostgreSQL 16
npx prisma migrate dev
npx prisma db seed    # Seed data
```

### Task 0.4: Verify Everything Builds
```bash
# Frontend
npm run type-check    # Should pass (0 errors)
npm run build         # Should pass (~42s)

# Backend
cd server
npm run build         # Should pass
npx prisma validate   # Should pass
```

**Reference files for Task 0**:
- [`docs/audit/00_repo_inventory.md`](00_repo_inventory.md) — project structure
- [`docs/audit/01_file_manifest.csv`](01_file_manifest.csv) — key files overview

---

## PHASE 1: Security & Cleanup (Week 1)

> ⚠️ **DO THIS FIRST. Nothing else matters if auth is broken.**

### Task 1.1: Fix Auth Security Defaults
- **Execute**: PROMPT 001 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Priority**: P0 CRITICAL
- **Read first**:
  - `src/config/runtime.flags.ts` — see how bypass is currently defaulted to `true`
  - `src/context/AuthContext.tsx` — see hardcoded MOCK_USERS and btoa() tokens
  - `server/src/lib/dev-login.ts` — see unguarded dev-login
  - [`06_gap_register.md`](06_gap_register.md) → GAP-001, GAP-002, GAP-003, GAP-004
- **What to change**:
  1. `runtime.flags.ts` → defaults to `false`, only `true` when `import.meta.env.DEV && env === 'true'`
  2. `AuthContext.tsx` → move MOCK_USERS behind `import.meta.env.DEV` so it tree-shakes from prod
  3. `dev-login.ts` → add `if (process.env.NODE_ENV === 'production') throw` at top
- **Verify**:
  - `npm run build` → succeeds
  - Search `dist/` for "test.com" → must NOT appear
  - Start prod build → protected routes require real login
- **Blocks**: Everything else. All other prompts assume auth works correctly.

### Task 1.2: Delete Dead Code
- **Execute**: PROMPT 010 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Priority**: P3 (but do now to clean the workspace before writing real code)
- **Read first**:
  - `server/src/modules/` — open any file, see it's empty TODO
  - [`06_gap_register.md`](06_gap_register.md) → "Duplicate Architecture" section
- **What to change**:
  1. Delete entire `server/src/modules/` directory (71 empty files)
  2. Remove any imports referencing `modules/`
  3. Move `src/utils/testing.utils.ts` → `tests/utils/`
- **Verify**:
  - `npm run build` both frontend and server
  - `npm run type-check`
  - `npx eslint ./src/` and `npx eslint ./server/src/`
- **Blocks**: Nothing. But do it now — cleaner workspace = fewer mistakes.

### Task 1.3: Add CSP Headers to nginx
- **No prompt needed** — small change.
- **Read first**: `nginx.conf`
- **Add to `server` block**:
  ```nginx
  add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.razorpay.com wss:;" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  ```
- **Also add gzip**:
  ```nginx
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml;
  gzip_min_length 256;
  ```
- **Verify**: `docker build .` succeeds; response headers visible in browser devtools.

---

## PHASE 2: Email Foundation (Week 2)

> Email is a foundation. Payments need receipts. Contact form needs email. Session booking needs confirmations. **Set up email before features that need it.**

### Task 2.1: Implement Transactional Email
- **Execute**: PROMPT 004 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Priority**: P1 HIGH
- **Sign up first**: https://resend.com → get API key → verify domain
- **Read first**:
  - `server/src/services/email.service.ts` — existing template structure (TODO stub)
  - [`10_integration_options_matrix.csv`](10_integration_options_matrix.csv) → Resend row for pricing
- **What to change**:
  1. `npm install resend` in server/
  2. Update `email.service.ts` with Resend client + templates
  3. Wire auth register → welcome email
  4. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to server `.env`
- **Verify**:
  - Register new user → check email arrives
  - Check Resend dashboard for delivery logs
- **Blocks**: PROMPT 006 (contact form), PROMPT 007 (footer signup), PROMPT 013 (notification emails), PROMPT 014 (enrollment confirmation), PROMPT 015 (career application receipt)

---

## PHASE 3: Core Revenue (Weeks 3-5)

> These three features together enable the core business loop: **user books session → pays → joins video call → therapist gets paid**.

### Task 3.1: Implement Razorpay Payments
- **Execute**: PROMPT 002 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Priority**: P0 HIGH
- **Sign up first**: https://razorpay.com → get test mode keys
- **Read first**:
  - `server/src/controllers/payments.controller.ts` — current 501 stubs
  - `server/prisma/schema.prisma` → Payment model (already exists)
  - [`10_integration_options_matrix.csv`](10_integration_options_matrix.csv) → Razorpay row
  - [`11_cost_model.md`](11_cost_model.md) → per-transaction cost math
- **What to change**:
  1. `npm install razorpay` in server/
  2. Create `server/src/services/payment.service.ts`
  3. Rewrite `payments.controller.ts` → real endpoints
  4. Create `src/hooks/useRazorpay.ts` on frontend
  5. Wire webhook endpoint for async payment confirmations
  6. Add payment receipt email (uses PROMPT 004's email service)
- **Verify**:
  - Use Razorpay test mode → complete checkout → Payment row in DB
  - Webhook fires → status updates to COMPLETED
  - Receipt email sent
- **Depends on**: PROMPT 001 (auth), PROMPT 004 (email for receipts)
- **Blocks**: PROMPT 014 (course enrollment needs payments)

### Task 3.2: Implement 100ms Video Sessions
- **Execute**: PROMPT 003 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Priority**: P0 HIGH
- **Sign up first**: https://100ms.live → get access key + secret
- **Read first**:
  - `server/src/controllers/therapy.controller.ts` — current 501 stubs
  - `server/prisma/schema.prisma` → Session model (has `videoRoomUrl`, `videoProvider`)
  - `src/pages/dashboard/SessionsPage.tsx` — current hardcoded data
  - [`10_integration_options_matrix.csv`](10_integration_options_matrix.csv) → 100ms row (free 10K min/mo)
- **What to change**:
  1. `npm install @100mslive/server-sdk` in server/
  2. `npm install @100mslive/react-sdk` in frontend
  3. Create `server/src/services/video.service.ts`
  4. Update `therapy.controller.ts` — create session → create 100ms room
  5. Create `src/features/video/VideoRoom.tsx` + `VideoControls.tsx`
  6. Create `src/pages/dashboard/VideoSessionPage.tsx`
  7. Add route: `/dashboard/sessions/:id/video`
- **Verify**:
  - Book session → session appears in DB with video room
  - Both parties can join video call
  - Video/audio/screenshare work
- **Depends on**: PROMPT 001 (auth)
- **Blocks**: PROMPT 012 (therapist dashboard needs sessions to exist)

### Task 3.3: Implement Therapist Dashboard Backend
- **Execute**: PROMPT 012 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Priority**: P1 HIGH
- **Read first**:
  - `src/pages/dashboard/TodaysSessionsPage.tsx` — see hardcoded heroSession data
  - `src/pages/dashboard/MyClientsPage.tsx` — see hardcoded client list
  - `src/pages/dashboard/ManageAvailabilityPage.tsx` — see hardcoded slots
  - `server/prisma/schema.prisma` → TherapistProfile, TherapistAvailability, Session models
  - [`09_cta_button_audit.csv`](09_cta_button_audit.csv) → practitioner page CTAs
- **What to change**:
  1. Create `server/src/services/therapist.service.ts`
  2. Update `therapy.controller.ts` with therapist-specific endpoints
  3. Replace hardcoded data in all 3 practitioner pages with API calls
  4. Add loading/empty/error states
  5. Test with seeded therapist account
- **Verify**:
  - Login as therapist → see real (possibly empty) dashboard
  - Create availability slots → appear in booking UI
  - Book session as user → appears in therapist's today view
- **Depends on**: PROMPT 003 (video — sessions reference video rooms), PROMPT 002 (payments — sessions need payment)

---

## PHASE 4: Quick Wins (Week 6)

> These are small tasks that unblock real user interaction and fix obvious broken buttons.

### Task 4.1: Wire Contact Form
- **Execute**: PROMPT 006 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `src/pages/ContactPage.tsx` — form exists but submit does nothing
  - [`09_cta_button_audit.csv`](09_cta_button_audit.csv) → Contact form CTA marked as "unwired"
- **Depends on**: PROMPT 004 (email — sends admin notification)
- **Verify**: Fill form → admin gets email → success toast shows

### Task 4.2: Wire Footer Email Signup
- **Execute**: PROMPT 007 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `src/components/layout/Footer.tsx` — input field exists, no submit handler
  - [`09_cta_button_audit.csv`](09_cta_button_audit.csv) → Footer subscribe marked as "unwired"
- **Depends on**: PROMPT 004 (email — optional welcome email to subscriber)
- **Verify**: Enter email in footer → success message → row in NewsletterSubscriber table

### Task 4.3: Add per-page SEO
- **Execute**: PROMPT 009 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `index.html` — currently just "Vite + React + TS"
  - [`docs/audit/08_ui_ux_visual_matrix.csv`](08_ui_ux_visual_matrix.csv) → SEO column (all "unknown")
- **Depends on**: Nothing
- **Verify**: View page source → unique `<title>` and `<meta description>` per page; robots.txt accessible

---

## PHASE 5: Engagement Features (Weeks 7-9)

### Task 5.1: Implement AI Wellness Chat
- **Execute**: PROMPT 005 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Sign up first**: https://platform.openai.com → get API key
- **Read first**:
  - `server/src/controllers/ai.controller.ts` — current 501 stub
  - [`10_integration_options_matrix.csv`](10_integration_options_matrix.csv) → OpenAI row
  - [`11_cost_model.md`](11_cost_model.md) → AI cost per scenario
- **Depends on**: PROMPT 001 (auth — need user context)
- **Verify**: Open chat → send message → streaming response appears; crisis keywords trigger helpline info

### Task 5.2: Implement Google OAuth
- **Execute**: PROMPT 008 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Set up first**: Google Cloud Console → Create OAuth 2.0 credentials
- **Read first**:
  - `src/pages/auth/LoginPage.tsx` — Google button exists but is placeholder
  - `src/pages/auth/SignupPage.tsx` — same placeholder
  - [`09_cta_button_audit.csv`](09_cta_button_audit.csv) → OAuth buttons marked "placeholder"
- **Depends on**: PROMPT 001 (auth)
- **Verify**: Click "Sign in with Google" → popup → logged in → JWT token issued

### Task 5.3: Implement Notification System
- **Execute**: PROMPT 013 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `server/src/controllers/notifications.controller.ts` — 501 stub
  - `src/pages/dashboard/NotificationsPage.tsx` — expects API data
  - `server/src/services/websocket.service.ts` — partial WebSocket implementation
  - `server/prisma/schema.prisma` → Notification model (exists)
- **Depends on**: PROMPT 002 (payment notifications), PROMPT 003 (session notifications)
- **Verify**: Book session → therapist gets notification (in-app + WebSocket push)

---

## PHASE 6: Content & Enrollment (Weeks 10-12)

### Task 6.1: Replace Hardcoded Blog with CMS
- **Execute**: PROMPT 011 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `src/pages/BlogsPage.tsx` — hardcoded blog array
  - `src/pages/BlogPostPage.tsx` — hardcoded single post
  - `server/src/controllers/blog.controller.ts` — 501 stub
- **Depends on**: PROMPT 001 (auth for admin endpoints)
- **Verify**: Admin creates post → appears on /blogs → individual post page works

### Task 6.2: Course Enrollment System
- **Execute**: PROMPT 014 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `src/pages/CoursesPage.tsx` — static course list
  - `src/pages/CourseDetailsPage.tsx` — "Enroll Now" button is placeholder
  - [`09_cta_button_audit.csv`](09_cta_button_audit.csv) → Course enroll CTA marked "placeholder"
- **Depends on**: PROMPT 002 (Razorpay for paid courses)
- **Verify**: Enroll in free course → appears in "My Courses"; enroll in paid course → Razorpay checkout → enrollment confirmed

### Task 6.3: Career Application Form
- **Execute**: PROMPT 015 from [`14_execution_prompts.md`](14_execution_prompts.md)
- **Read first**:
  - `src/pages/CareerPage.tsx` — "Apply Now" button is placeholder
  - [`09_cta_button_audit.csv`](09_cta_button_audit.csv) → Career apply CTA marked "placeholder"
- **Depends on**: PROMPT 004 (email for confirmation)
- **Verify**: Click Apply → fill form → upload resume → admin email received → applicant gets confirmation

---

## PHASE 7: Testing & Polish (Weeks 13-14)

### Task 7.1: Add Unit Tests
- **No prompt** — write tests for all new services.
- **Read first**: [`docs/audit/05_feature_matrix.csv`](05_feature_matrix.csv) → testing column (all 0-20)
- **What to do**:
  1. Install vitest + @testing-library/react
  2. Write tests for: payment.service, video.service, email.service, ai.service, therapist.service
  3. Write component tests for: VideoRoom, RazorpayCheckout, AIChatPanel
  4. Target: 60% coverage on new code

### Task 7.2: Add Integration Tests
- **What to do**:
  1. Install supertest
  2. Write API tests for all new endpoints (payments, therapy, AI, notifications)
  3. Use Prisma test database

### Task 7.3: Expand E2E Tests
- **What to do**:
  1. Update `tests/example.spec.ts` and add new test files
  2. Test flows: signup → onboard → track mood → book session → join video → pay
  3. Use Playwright's existing 5-browser config

### Task 7.4: Performance Optimization
- **Read first**: Section 8 of [`ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md`](../ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md) → Performance Analysis
- **What to do**:
  1. Lazy-load Three.js (only ConstellationPage) — saves ~57KB gzip
  2. Lazy-load GSAP (only LandingPage) — saves ~68KB gzip
  3. Add `loading="lazy"` to images
  4. Add `prefers-reduced-motion` media query
  5. Add nginx gzip (if not done in Phase 1)

### Task 7.5: Design System Fixes
- **Read first**: [`12_design_system_audit.md`](12_design_system_audit.md) — color violations, typography issues
- **What to do**:
  1. Replace 20+ hardcoded hex colors with CSS variable tokens
  2. Replace arbitrary pixel values (`text-[40px]`) with Tailwind scale
  3. Add dark mode to 7 missing pages
  4. Add `prefers-reduced-motion` handling for animations

---

## Post-Phase Checklist: Before Going Live

| Check | How to Verify | File Reference |
|-------|---------------|----------------|
| Auth bypass = false in production | `npm run build` → search dist for "authBypass" | `src/config/runtime.flags.ts` |
| No test credentials in bundle | Search dist for "test.com" | `src/context/AuthContext.tsx` |
| All env vars set | Check Vercel/Render dashboard | `server/.env.example` |
| Razorpay in live mode | Switch from test to live keys | Razorpay dashboard |
| Domain DNS configured | `nslookup yourdomain.com` | Vercel/DNS provider |
| SSL certificate active | `curl -I https://yourdomain.com` | Vercel auto-provisions |
| Database migrated | `npx prisma migrate deploy` | server/prisma/migrations/ |
| Error monitoring active | Check Sentry dashboard | `server/src/middleware/` |
| SEO basics done | Google Search Console | `public/robots.txt`, `public/sitemap.xml` |
| CSP headers set | Browser DevTools → Network → Response Headers | `nginx.conf` |
| No 501 on user-facing routes | Manual test all pages | [`03_backend_route_matrix.csv`](03_backend_route_matrix.csv) |
| All CTAs wired | Click every button | [`09_cta_button_audit.csv`](09_cta_button_audit.csv) |

---

## Score Progression

| After Phase | Expected Score | Key Improvements |
|------------|----------------|------------------|
| Phase 0 (Setup) | 28/100 | No change — just prep |
| Phase 1 (Security) | 38/100 | Security 20→60, Code Quality↑ |
| Phase 2 (Email) | 42/100 | Email foundation, feature completeness↑ |
| Phase 3 (Revenue) | 55/100 | Payments, video, therapist dashboard all real |
| Phase 4 (Quick Wins) | 60/100 | SEO 5→40, CTAs wired, forms working |
| Phase 5 (Engagement) | 70/100 | AI chat, OAuth, notifications all real |
| Phase 6 (Content) | 75/100 | Blog, courses, careers all functional |
| Phase 7 (Polish) | 85/100 | Tests, perf, design system, accessibility |

---

## Quick Reference: All Prompts by Dependency Order

| Order | Prompt | Phase | Depends On | Blocks |
|-------|--------|-------|-----------|--------|
| 1 | PROMPT 001: Auth Fix | Phase 1 | Nothing | Everything |
| 2 | PROMPT 010: Delete Dead Code | Phase 1 | Nothing | Nothing |
| 3 | PROMPT 004: Email (Resend) | Phase 2 | PROMPT 001 | 006, 007, 013, 014, 015 |
| 4 | PROMPT 002: Payments (Razorpay) | Phase 3 | 001, 004 | 014 |
| 5 | PROMPT 003: Video (100ms) | Phase 3 | 001 | 012 |
| 6 | PROMPT 012: Therapist Dashboard | Phase 3 | 002, 003 | Nothing |
| 7 | PROMPT 006: Contact Form | Phase 4 | 004 | Nothing |
| 8 | PROMPT 007: Footer Signup | Phase 4 | 004 | Nothing |
| 9 | PROMPT 009: SEO | Phase 4 | Nothing | Nothing |
| 10 | PROMPT 005: AI Chat | Phase 5 | 001 | Nothing |
| 11 | PROMPT 008: Google OAuth | Phase 5 | 001 | Nothing |
| 12 | PROMPT 013: Notifications | Phase 5 | 002, 003 | Nothing |
| 13 | PROMPT 011: Blog CMS | Phase 6 | 001 | Nothing |
| 14 | PROMPT 014: Course Enrollment | Phase 6 | 002 | Nothing |
| 15 | PROMPT 015: Career Application | Phase 6 | 004 | Nothing |

---

## External Accounts Needed (Set Up Before Starting)

| Service | When Needed | Sign Up URL | Free Tier? |
|---------|------------|-------------|------------|
| Resend | Phase 2 (Task 2.1) | https://resend.com | Yes — 3K emails/mo |
| Razorpay | Phase 3 (Task 3.1) | https://razorpay.com | Yes — test mode free |
| 100ms | Phase 3 (Task 3.2) | https://100ms.live | Yes — 10K min/mo |
| OpenAI | Phase 5 (Task 5.1) | https://platform.openai.com | No — pay-per-token |
| Google Cloud | Phase 5 (Task 5.2) | https://console.cloud.google.com | Yes — OAuth is free |
| Sentry | Phase 1 (optional) | https://sentry.io | Yes — 5K errors/mo |
| Neon | When you deploy DB | https://neon.tech | Yes — 0.5GB |
| Vercel | When you deploy FE | https://vercel.com | Yes — Hobby free |
| Render | When you deploy BE | https://render.com | Yes — 512MB free |

---

_Last updated: March 6, 2026. Generated from [`ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md`](../ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md) and [`14_execution_prompts.md`](14_execution_prompts.md)._
