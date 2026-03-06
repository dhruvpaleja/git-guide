# World-Class Recommendations — Soul Yatri Platform

## The 100/100 Roadmap: From Current State to World-Class

### Current Overall Score: 31/100
### Target Score: 100/100

---

## TIER 1: CRITICAL FIXES (Score → 50/100)
> Do these FIRST. Each one is blocking revenue, security, or basic functionality.

### R01: Disable Auth Bypass in Production
- **Current**: `VITE_AUTH_BYPASS=true` allows unauthenticated access to all routes
- **Fix**: Set default to `false` in `runtime.flags.ts`; only enable via explicit env var in dev
- **Impact**: Security score 0 → 60
- **Effort**: 10 minutes
- **Priority**: P0 — DO THIS RIGHT NOW

### R02: Disable Dev Login Routes in Production
- **Current**: `ENABLE_DEV_ROUTES=true` ships GET endpoints that auto-login as any user
- **Fix**: Wrap in `if (process.env.NODE_ENV !== 'production')` check
- **Impact**: Prevents unauthorized admin access
- **Effort**: 5 minutes
- **Priority**: P0 — DO THIS RIGHT NOW

### R03: Remove Client-Side Password "Hashing"
- **Current**: `src/utils/security.ts` uses `btoa()` (base64) labeled as `hashPassword()`
- **Fix**: Delete the function; send plaintext over HTTPS; bcrypt on server (already works)
- **Impact**: Removes false sense of security; simplifies auth flow
- **Effort**: 30 minutes
- **Priority**: P0

### R04: Remove Hardcoded Docker Secrets
- **Current**: `JWT_SECRET=change-me-in-production`, `POSTGRES_PASSWORD=kimi_secret` in docker-compose.yml
- **Fix**: Reference `.env` file; add `.env.docker.example` with placeholder values
- **Impact**: Prevents credential exposure in Git
- **Effort**: 15 minutes
- **Priority**: P0

### R05: Wire Contact Form to Email
- **Current**: "Send Request" button has no handler — primary lead capture is broken
- **Fix**: POST to `/api/contact` → Resend email → toast confirmation
- **Impact**: Lead capture score 0 → 80
- **Effort**: 2 hours (backend endpoint + frontend wiring)
- **Priority**: P1

### R06: Integrate Razorpay for Payments
- **Current**: 27 payment endpoints all return 501
- **Fix**: Install Razorpay SDK; implement order creation, verification, webhooks
- **Impact**: Revenue from ₹0 → possible
- **Effort**: 3-5 days
- **Priority**: P1

### R07: Install Node Modules & Verify Build
- **Current**: `node_modules` not installed; build status unknown
- **Fix**: `npm install` → `npm run build` → fix any TypeScript/build errors
- **Impact**: Deployability score 0 → 80
- **Effort**: 1-2 hours (depending on errors)
- **Priority**: P1

---

## TIER 2: CORE FEATURES (Score → 70/100)
> Build the features that make the product work. Focus on the 20% that drives 80% of value.

### R08: Implement Therapy Booking Flow
- **Scope**: Therapist listing → slot picker → booking → confirmation → video session
- **Requires**: Daily.co for video, Razorpay for payment, real therapist profiles
- **Impact**: Primary revenue stream enabled
- **Effort**: 2-3 weeks
- **Priority**: P1

### R09: Implement AI SoulBot
- **Scope**: OpenAI GPT-4o-mini integration → chat UI → crisis detection → escalation
- **Impact**: Product differentiator; user retention; premium feature gate
- **Effort**: 1-2 weeks
- **Priority**: P2

### R10: Build Real Blog System
- **Scope**: Add BlogPost model → Sanity CMS or admin editor → SSR-friendly pages
- **Impact**: SEO traffic; content marketing; organic growth
- **Effort**: 1 week
- **Priority**: P2

### R11: Build Real Course System
- **Scope**: Add Course/Module/Enrollment models → video hosting → progress tracking
- **Impact**: Passive revenue; user engagement
- **Effort**: 2-3 weeks
- **Priority**: P2

### R12: Wire All Practitioner Dashboard Pages
- **Scope**: Replace mock data with real API calls for sessions, clients, availability
- **Impact**: Practitioner workflow functional
- **Effort**: 1 week
- **Priority**: P2

### R13: Wire Admin Dashboard to Real Data
- **Scope**: Replace hardcoded "1,284 users" with real Prisma queries
- **Impact**: Platform management enabled
- **Effort**: 1 week
- **Priority**: P2

---

## TIER 3: PRODUCTION HARDENING (Score → 85/100)
> Make it reliable, fast, and trustworthy.

### R14: Add Sentry Error Tracking
- **Effort**: 2 hours
- **Impact**: Catch errors before users report them

### R15: Add PostHog Analytics
- **Effort**: 2 hours
- **Impact**: Data-driven product decisions

### R16: Replace In-Memory Services with Real Services
- **Cache**: In-memory Map → Upstash Redis
- **Storage**: In-memory → Cloudflare R2
- **Email**: console.log → Resend
- **Queue**: sync → BullMQ
- **Effort**: 1 week total
- **Impact**: Production-ready infrastructure

### R17: Add Unit Tests (Vitest)
- **Scope**: Install Vitest; test auth flows, API services, utility functions
- **Target**: 60% coverage on critical paths
- **Effort**: 2 weeks
- **Impact**: Confidence in refactoring; prevents regressions

### R18: Add E2E Tests (Playwright)
- **Scope**: Login, signup, mood logging, journal entry, therapy booking
- **Target**: 10 critical user journeys
- **Effort**: 1 week
- **Impact**: Deployment confidence

### R19: API Rate Limiting per Role
- **Current**: Global rate limit only
- **Fix**: Per-endpoint, per-role limits with Redis backing
- **Effort**: 1 day
- **Impact**: Abuse prevention

### R20: CSRF Protection
- **Current**: Token generated but never validated
- **Fix**: Wire CSRF middleware to all state-changing endpoints
- **Effort**: 4 hours
- **Impact**: Security compliance

---

## TIER 4: WORLD-CLASS POLISH (Score → 100/100)

### R21: SEO Optimization
- Per-page meta tags (react-helmet-async)
- OpenGraph images for social sharing
- Structured data (schema.org) for courses, therapists, blog posts
- Sitemap.xml generation
- robots.txt
- Canonical URLs

### R22: Performance Optimization
- Code splitting per route (already partially done via React.lazy)
- Image lazy loading with blur placeholder
- Service worker for offline support (PWA)
- Bundle analysis and tree shaking
- Core Web Vitals monitoring

### R23: Accessibility (WCAG 2.1 AA)
- Skip-to-content link
- prefers-reduced-motion support
- Color contrast audit (automated with axe)
- Keyboard navigation for all interactive elements
- Screen reader testing
- Focus management on route changes

### R24: Internationalization
- Install react-intl or i18next
- Extract all strings to translation files
- Support Hindi + English initially
- RTL preparation for future Arabic support

### R25: Design System Documentation
- Storybook for all shadcn/ui components
- Brand guidelines document
- Color palette with usage rules
- Animation guidelines
- Responsive breakpoint guidelines

### R26: CI/CD Pipeline Completion
- Automated tests on PR
- Type checking on PR
- Lint checking on PR
- Build verification
- Preview deployments (Vercel already supports this)
- Staging environment
- Production deploy with smoke tests

### R27: Data Encryption
- Field-level encryption for therapy notes (AES-256 via Prisma middleware)
- Encrypted backups
- Key rotation strategy

### R28: Audit Logging
- Wire AuditLog model to Prisma middleware
- Log all PHI access
- Exportable audit reports for compliance

### R29: Multi-Tenancy (Corporate)
- Organization model with team management
- White-label capabilities
- Usage analytics per organization
- Custom branding per tenant

### R30: Mobile App Foundation
- React Native or Capacitor wrapper
- Push notification setup (FCM)
- Biometric authentication
- Offline-first journal/mood tracking

---

## Implementation Priority Matrix

| Phase | Duration | Features | Score After |
|-------|----------|----------|------------|
| **Week 1** | 5 days | R01-R07 (Security + Contact + Build) | 50/100 |
| **Weeks 2-4** | 15 days | R08-R13 (Core Features) | 70/100 |
| **Weeks 5-7** | 15 days | R14-R20 (Production Hardening) | 85/100 |
| **Weeks 8-12** | 25 days | R21-R30 (World-Class Polish) | 100/100 |

### The "One Developer, 12 Weeks" Plan
If one full-time developer works on this platform:
- **End of Week 1**: Secure, buildable, contact form works, payments integrated
- **End of Week 4**: Therapy booking works, blog live, courses enrollable, AI chatbot running
- **End of Week 7**: Tests passing, monitoring live, production infrastructure solid
- **End of Week 12**: SEO optimized, accessible, documented, mobile-ready, enterprise-capable

### The "Weekend Warrior" Plan
If one developer works evenings/weekends (~10hrs/week):
- **Month 1**: Security fixes + contact form + Razorpay
- **Month 2-3**: Therapy booking + blog + courses
- **Month 4-5**: AI chatbot + admin dashboard + practitioner tools
- **Month 6+**: Testing, monitoring, SEO, accessibility, polish

---

## Quick Wins (< 2 hours each, high impact)

1. ✅ Fix auth bypass default (10 min)
2. ✅ Fix dev login guard (5 min)
3. ✅ Add Sentry (2 hrs)
4. ✅ Add PostHog (2 hrs)
5. ✅ Fix dark mode on 4 pages (1 hr)
6. ✅ Add skip-to-content link (30 min)
7. ✅ Wire contact form to toast at minimum (1 hr)
8. ✅ Fix hardcoded colors to use tokens (1 hr)
9. ✅ Add prefers-reduced-motion media query (30 min)
10. ✅ Remove btoa() password function (30 min)
