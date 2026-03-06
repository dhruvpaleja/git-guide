# MASTER TODO LIST — Soul Yatri Implementation Roadmap

**Generated:** March 6, 2026  
**Source:** Complete Codebase Audit  
**Total Action Items:** 51  
**Estimated Total Time:** 8-12 weeks

---

## HOW TO USE THIS DOCUMENT

1. **Start at P0** — Do NOT skip to P1 until P0 is complete
2. **Each item has:**
   - Exact files to edit
   - Exact changes to make
   - Verification commands
   - Dependencies (what must be done first)
3. **After each batch:** Update `_progress.json` and check off items here
4. **AI Agents:** Copy the prompt from `14_execution_prompts.md` for each task
5. **Strategic overview:** For the full dependency graph, phase-by-phase roadmap, "read first" orientation, and score progression, see [`15_master_execution_roadmap.md`](15_master_execution_roadmap.md)

---

## P0 — CRITICAL (Do TODAY — 4-6 hours total)

### P0.1: Remove Auth Bypass Flag
**Time:** 30 minutes  
**Files:** `src/config/runtime.flags.ts`, `src/router/ProtectedRoute.tsx`, `.env.production`  
**Dependencies:** None  
**Prompt:** `14_execution_prompts.md` → PROMPT 001

**Steps:**
1. [ ] Open `src/config/runtime.flags.ts`
2. [ ] Remove `authBypassEnabled` export entirely
3. [ ] Open `src/router/ProtectedRoute.tsx`
4. [ ] Delete the entire `if (runtimeFlags.authBypassEnabled)` block
5. [ ] Create `.env.production` with `VITE_AUTH_BYPASS=false`
6. [ ] Update `.env.example` to show `VITE_AUTH_BYPASS=false` as default
7. [ ] Run `npm run type-check` — must pass
8. [ ] Run `npm run build` — must succeed
9. [ ] Test: Try accessing `/dashboard` without login — MUST redirect to `/login`

**Verification:**
```bash
npm run type-check
npm run build
# Manually test in browser
```

**Done When:**
- [ ] Auth bypass code removed
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Manual test confirms auth enforced

---

### P0.2: Disable Mock Auth in Production
**Time:** 1 hour  
**Files:** `src/context/AuthContext.tsx`, `src/config/runtime.flags.ts`, `.env.production`  
**Dependencies:** P0.1 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 001 (part 2)

**Steps:**
1. [ ] Open `src/context/AuthContext.tsx`
2. [ ] Add environment check: mock auth ONLY when `import.meta.env.DEV === true`
3. [ ] Add runtime flag check: `VITE_ENABLE_MOCK_AUTH` must be explicitly `'true'`
4. [ ] Add console.warning when mock auth is enabled
5. [ ] Set `VITE_ENABLE_MOCK_AUTH=false` in `.env.production`
6. [ ] Update `.env.example` to show `VITE_ENABLE_MOCK_AUTH=false` as default
7. [ ] Run `npm run type-check` — must pass
8. [ ] Run `npm run build` — must succeed
9. [ ] Test: Try logging in with `user@test.com` in production build — MUST fail

**Verification:**
```bash
npm run type-check
npm run build
# Search built output for "test.com" — should NOT appear
grep -r "test.com" dist/  # Should return nothing
```

**Done When:**
- [ ] Mock auth disabled by default in production
- [ ] Mock auth only works in dev with explicit flag
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Manual test confirms mock auth disabled

---

### P0.3: Remove All Fake Data from Dashboards
**Time:** 2-3 hours  
**Files:** 10+ dashboard page files  
**Dependencies:** P0.1, P0.2 complete  
**Prompt:** Custom (see below)

**Files to Edit:**
- [ ] `src/pages/dashboard/SessionsPage.tsx`
- [ ] `src/pages/dashboard/ConnectionsPage.tsx`
- [ ] `src/pages/dashboard/AdminDashboard.tsx`
- [ ] `src/pages/dashboard/AstrologyDashboard.tsx`
- [ ] `src/pages/dashboard/TodaysSessionsPage.tsx`
- [ ] `src/pages/dashboard/MyClientsPage.tsx`
- [ ] `src/pages/dashboard/ManageAvailabilityPage.tsx`
- [ ] `src/pages/practitioner/PractitionerDashboard.tsx`

**Steps:**
1. [ ] For each file above:
   - Remove all hardcoded arrays (MOCK_MATCHES, fake sessions, fake metrics)
   - Replace with empty state component OR "Coming Soon" message
   - Remove pravatar.cc references
   - Remove fake earnings/stats
2. [ ] Create `src/components/ui/EmptyState.tsx` if doesn't exist
3. [ ] Create `src/components/ui/ComingSoon.tsx` if doesn't exist
4. [ ] Run `npm run type-check` — must pass
5. [ ] Run `npm run build` — must succeed
6. [ ] Test: Visit each dashboard page — should show empty state, not fake data

**Verification:**
```bash
npm run type-check
npm run build
# Manually visit each dashboard page
```

**Done When:**
- [ ] All fake data removed
- [ ] Empty states or "Coming Soon" shown instead
- [ ] Type check passes
- [ ] Build succeeds

---

## P1 — HIGH (This Week — 3-5 days total)

### P1.1: Implement Razorpay Payment Processing
**Time:** 3 days  
**Files:** 8-12 files  
**Dependencies:** P0 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 002

**Steps:**
1. [ ] Install Razorpay SDK: `cd server && npm install razorpay`
2. [ ] Add to `server/.env.example`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```
3. [ ] Create `server/src/services/payment.service.ts`:
   - `createOrder(amount, currency, receipt)`
   - `verifyPayment(orderId, paymentId, signature)`
   - `handleWebhook(event, signature)`
4. [ ] Update `server/src/controllers/payments.controller.ts`:
   - POST `/payments/order` — Create Razorpay order
   - POST `/payments/verify` — Verify payment signature
   - POST `/payments/webhook` — Handle async events
5. [ ] Update Payment model status on success: PENDING → AUTHORIZED → CAPTURED
6. [ ] Add proper error handling and logging
7. [ ] Add rate limiting on payment endpoints
8. [ ] Create `src/hooks/useRazorpay.ts` on frontend
9. [ ] Test with Razorpay test mode

**Verification:**
```bash
cd server && npm run build
cd server && npm run lint:ci
# Test with Razorpay test mode
```

**Done When:**
- [ ] Razorpay SDK installed
- [ ] Order creation works
- [ ] Payment verification works
- [ ] Webhook handler implemented
- [ ] Environment variables documented
- [ ] All lint checks pass
- [ ] Manual test with Razorpay test mode succeeds

---

### P1.2: Implement Therapy Backend
**Time:** 2 days  
**Files:** 6-8 files  
**Dependencies:** P0 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 004

**Steps:**
1. [ ] Create `server/src/services/therapy.service.ts`:
   - `listSessions(userId, therapistId?, status?, pagination)`
   - `createSession(userId, therapistId, scheduledAt, duration)`
   - `getSession(sessionId, userId)`
   - `updateSession(sessionId, updates, userId)`
   - `cancelSession(sessionId, userId, reason)`
2. [ ] Implement listSessions with filters
3. [ ] Implement createSession with availability validation
4. [ ] Implement updateSession with authorization checks
5. [ ] Implement cancelSession with reason tracking
6. [ ] Update `server/src/controllers/therapy.controller.ts` to use service
7. [ ] Add validation schemas
8. [ ] Test all endpoints

**Verification:**
```bash
cd server && npm run build
cd server && npm run lint:ci
# Test session CRUD operations
```

**Done When:**
- [ ] All therapy endpoints functional
- [ ] Authorization checks in place
- [ ] Validation schemas implemented
- [ ] All lint checks pass
- [ ] Manual tests succeed

---

### P1.3: Add Email Service (Resend)
**Time:** 1 day  
**Files:** 4-5 files  
**Dependencies:** P0 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 005

**Steps:**
1. [ ] Install Resend: `cd server && npm install resend`
2. [ ] Add to `server/.env.example`:
   ```
   RESEND_API_KEY=your_api_key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=Soul Yatri
   ```
3. [ ] Create `server/src/services/email.service.ts`:
   - `sendWelcomeEmail(email, name)`
   - `sendPasswordReset(email, token, name)`
   - `sendSessionReminder(email, sessionDetails)`
   - `sendNotification(email, subject, body)`
4. [ ] Create email templates (HTML + text)
5. [ ] Integrate with auth controller for welcome/password reset
6. [ ] Add proper error handling
7. [ ] Add logging for sent emails
8. [ ] Test with real email

**Verification:**
```bash
cd server && npm run build
cd server && npm run lint:ci
# Sign up with real email — verify email received
```

**Done When:**
- [ ] Resend SDK installed
- [ ] All email templates created
- [ ] Welcome email sends on signup
- [ ] Password reset email sends on request
- [ ] Environment variables documented
- [ ] All lint checks pass

---

### P1.4: Add Video Integration (100ms or Daily.co)
**Time:** 2 days  
**Files:** 6-8 files  
**Dependencies:** P1.2 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 006

**Steps:**
1. [ ] Choose video provider (100ms recommended for India)
2. [ ] Install SDK: `cd server && npm install @100mslive/server-sdk`
3. [ ] Add to `server/.env.example`:
   ```
   VIDEO_API_KEY=your_api_key
   VIDEO_APP_ID=your_app_id
   ```
4. [ ] Create `server/src/services/video.service.ts`:
   - `createRoom(sessionId, duration)`
   - `getRoom(roomName)`
   - `deleteRoom(roomName)`
   - `generateToken(roomName, userId, role)`
5. [ ] Integrate with therapy controller
6. [ ] Create frontend video component
7. [ ] Test room creation and joining
8. [ ] Test video quality

**Verification:**
```bash
cd server && npm run build
cd server && npm run lint:ci
# Create test session and join video call
```

**Done When:**
- [ ] Video SDK installed
- [ ] Room creation works
- [ ] Token generation works for both roles
- [ ] Room deletion works
- [ ] Environment variables documented
- [ ] All lint checks pass
- [ ] Manual video test succeeds

---

## P2 — MEDIUM (This Month — 2-3 weeks total)

### P2.1: Add Unit Tests for Backend Controllers
**Time:** 3 days  
**Files:** 10+ test files  
**Dependencies:** P1 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 007

**Steps:**
1. [ ] Install test dependencies: `cd server && npm install -D vitest @types/node`
2. [ ] Create `server/vitest.config.ts`
3. [ ] Add test script to `server/package.json`: `"test": "vitest"`
4. [ ] Create test files for each controller:
   - `auth.controller.test.ts`
   - `users.controller.test.ts`
   - `health-tools.controller.test.ts`
   - `therapy.controller.test.ts`
   - `payments.controller.test.ts`
5. [ ] Each test file should cover:
   - Success cases
   - Error cases
   - Edge cases
   - Authorization checks
6. [ ] Use mocks for database calls and external services
7. [ ] Aim for 80%+ code coverage
8. [ ] Run tests and verify coverage

**Verification:**
```bash
cd server && npm run test
# Check coverage report — must show 80%+
```

**Done When:**
- [ ] All controllers have unit tests
- [ ] Test coverage is 80%+
- [ ] All tests pass
- [ ] Test script added to package.json

---

### P2.2: Add Structured Data for SEO
**Time:** 2 days  
**Files:** 6-8 files  
**Dependencies:** P0 complete  
**Prompt:** `14_execution_prompts.md` → PROMPT 008

**Steps:**
1. [ ] Create `src/lib/seo.ts` with helper functions:
   - `generateOrganizationSchema()`
   - `generateWebSiteSchema()`
   - `generateArticleSchema()`
   - `generateCourseSchema()`
   - `generateLocalBusinessSchema()`
2. [ ] Create `src/components/seo/StructuredData.tsx`
3. [ ] Add to LandingPage: Organization + WebSite schema
4. [ ] Add to AboutPage: Organization schema with team members
5. [ ] Add to BlogsPage: Article schema for each post
6. [ ] Add to CoursesPage: Course schema for each course
7. [ ] Validate with Google Rich Results Test
8. [ ] Test with schema validator

**Verification:**
```bash
npm run build
npm run type-check
# Test with Google Rich Results Test tool
```

**Done When:**
- [ ] All major pages have structured data
- [ ] Google Rich Results Test passes
- [ ] No TypeScript errors
- [ ] Build succeeds

---

### P2.3: Implement AI Session Matching
**Time:** 4-6 weeks  
**Files:** 8-10 files  
**Dependencies:** P1.2 complete  
**Prompt:** Custom (see `13_world_class_recommendations.md`)

**Steps:**
1. [ ] Create `server/src/services/matching.service.ts`
2. [ ] Implement weighted scoring algorithm:
   - Preference match (gender, language, approach)
   - Availability match
   - Specialization match
   - Personality match (from onboarding)
3. [ ] Create MatchScore interface
4. [ ] Integrate with therapy controller
5. [ ] Add ML optimization with feedback (phase 2)
6. [ ] Test matching quality

**Verification:**
```bash
cd server && npm run build
cd server && npm run lint:ci
# Test matching algorithm with sample data
```

**Done When:**
- [ ] Matching algorithm implemented
- [ ] Scores calculated correctly
- [ ] Integration with booking flow
- [ ] All lint checks pass

---

### P2.4: Add Verified Reviews System
**Time:** 2-3 weeks  
**Files:** 6-8 files  
**Dependencies:** P1.2 complete  
**Prompt:** Custom

**Steps:**
1. [ ] Create Review model in Prisma schema
2. [ ] Create `server/src/services/review.service.ts`
3. [ ] Implement review CRUD:
   - Only verified sessions can review
   - Therapist response capability
   - Review moderation
4. [ ] Add review aggregation to therapist profiles
5. [ ] Create frontend review components
6. [ ] Add anti-fraud measures
7. [ ] Test review flow

**Verification:**
```bash
cd server && npm run build
cd server && npm run lint:ci
# Test review submission and display
```

**Done When:**
- [ ] Review model created
- [ ] CRUD operations work
- [ ] Frontend components functional
- [ ] Anti-fraud measures in place

---

## P3 — LOW (Next Month — 1-2 weeks total)

### P3.1: Performance Optimization
**Time:** 2 days  
**Files:** 5-7 files  
**Dependencies:** P0 complete  
**Prompt:** Custom

**Steps:**
1. [ ] Run bundle analysis: `npm run build -- --analyze`
2. [ ] Identify large dependencies
3. [ ] Implement code splitting for routes
4. [ ] Optimize images (compress, lazy load)
5. [ ] Add service worker for caching
6. [ ] Implement lazy loading for heavy components
7. [ ] Test performance improvements

**Verification:**
```bash
npm run build -- --analyze
# Check bundle sizes — should be under budget
```

**Done When:**
- [ ] Bundle analysis complete
- [ ] Large dependencies optimized
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Performance metrics improved

---

### P3.2: Accessibility Improvements (WCAG 2.1 AA)
**Time:** 2 days  
**Files:** 10+ files  
**Dependencies:** P0 complete  
**Prompt:** Custom

**Steps:**
1. [ ] Run axe-core audit
2. [ ] Fix keyboard navigation issues
3. [ ] Add ARIA labels where missing
4. [ ] Fix color contrast issues
5. [ ] Add focus indicators
6. [ ] Test with screen reader
7. [ ] Document accessibility features

**Verification:**
```bash
npm run build
# Run axe-core tests
# Manual screen reader test
```

**Done When:**
- [ ] axe-core audit passes
- [ ] Keyboard navigation works
- [ ] ARIA labels added
- [ ] Color contrast fixed
- [ ] Screen reader test passes

---

### P3.3: Documentation Cleanup
**Time:** 1 day  
**Files:** 3-4 files  
**Dependencies:** None  
**Prompt:** Custom

**Steps:**
1. [ ] Update README.md to reflect actual stack
2. [ ] Remove claims about Socket.io, React Query, Zustand, Redis
3. [ ] Add accurate feature status (what's implemented vs stubbed)
4. [ ] Add security warnings about auth bypass (until fixed)
5. [ ] Add setup instructions for new developers
6. [ ] Create CONTRIBUTING.md with coding standards

**Verification:**
```bash
# Review README.md for accuracy
# Have new developer follow setup instructions
```

**Done When:**
- [ ] README accurate
- [ ] No false claims
- [ ] Security warnings present
- [ ] Setup instructions work

---

## PROGRESS TRACKING

Update this section after each batch:

### Completed Items

- [ ] P0.1: Remove Auth Bypass Flag
- [ ] P0.2: Disable Mock Auth in Production
- [ ] P0.3: Remove All Fake Data from Dashboards
- [ ] P1.1: Implement Razorpay Payment Processing
- [ ] P1.2: Implement Therapy Backend
- [ ] P1.3: Add Email Service (Resend)
- [ ] P1.4: Add Video Integration (100ms or Daily.co)
- [ ] P2.1: Add Unit Tests for Backend Controllers
- [ ] P2.2: Add Structured Data for SEO
- [ ] P2.3: Implement AI Session Matching
- [ ] P2.4: Add Verified Reviews System
- [ ] P3.1: Performance Optimization
- [ ] P3.2: Accessibility Improvements (WCAG 2.1 AA)
- [ ] P3.3: Documentation Cleanup

### Current Status

**Phase:** Not Started  
**Last Updated:** March 6, 2026  
**Next Action:** Start with P0.1

---

## DEPENDENCY GRAPH

```
P0.1 (Auth Bypass) ─────────────────┐
                                     ├──→ P1.x (All P1 items)
P0.2 (Mock Auth) ────────────────────┘
                                     │
P0.3 (Fake Data) ────────────────────┘
                                     │
P1.1 (Razorpay) ─────────────────────┼──→ P2.x (Some P2 items)
                                     │
P1.2 (Therapy Backend) ──────────────┼──→ P1.4 (Video)
                                     │    └─→ P2.3 (AI Matching)
P1.3 (Email) ────────────────────────┘    └─→ P2.4 (Reviews)
                                     │
P1.4 (Video) ────────────────────────┘
```

---

## VERIFICATION CHECKLIST

Before marking any item complete:

- [ ] Code changes made
- [ ] Type check passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint:ci`)
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] `_progress.json` updated
- [ ] This TODO list updated

---

**Document Created:** March 6, 2026  
**Review Cadence:** Daily during implementation  
**Owner:** Development Team
