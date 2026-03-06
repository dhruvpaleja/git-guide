# Gap Register

**Generated:** March 6, 2026  
**Status:** Open items requiring implementation

---

## Missing Features

### P0 - Critical (Security)

| ID | Feature | Gap | Risk | Effort | Owner |
|----|---------|-----|------|--------|-------|
| GAP-001 | Auth Bypass Removal | `ProtectedRoute` has `authBypassEnabled` flag | CRITICAL - Anyone can access protected routes | 1 hour | Backend Lead |
| GAP-002 | Mock Auth Disable | `VITE_ENABLE_MOCK_AUTH=true` by default | HIGH - Test accounts work in production | 1 hour | Backend Lead |

### P1 - High (Core Functionality)

| ID | Feature | Gap | Risk | Effort | Owner |
|----|---------|-----|------|--------|-------|
| GAP-010 | Razorpay Integration | No payment SDK; methods throw `notImplemented` | Cannot monetize | 3 days | Backend Dev |
| GAP-011 | Therapy Backend | All therapy endpoints stubbed | Core feature broken | 2 days | Backend Dev |
| GAP-012 | Email Service | No email provider integrated | No password reset/notifications | 1 day | Backend Dev |
| GAP-013 | Video Integration | No Daily.co/Twilio SDK | Therapy sessions impossible | 2 days | Backend Dev |
| GAP-014 | Therapist Availability | No CRUD for availability | Cannot manage schedule | 1 day | Backend Dev |
| GAP-015 | Session Booking | No booking logic | Cannot book sessions | 2 days | Backend Dev |

### P2 - Medium (Quality)

| ID | Feature | Gap | Risk | Effort | Owner |
|----|---------|-----|------|--------|-------|
| GAP-020 | Unit Tests | No unit test coverage | Quality risk | 3 days | QA |
| GAP-021 | Integration Tests | No API integration tests | Regression risk | 2 days | QA |
| GAP-022 | SSR/SSG | Client-side rendering only | SEO limitation | 1 week | Frontend Lead |
| GAP-023 | Structured Data | No schema.org markup | SEO limitation | 2 days | Frontend Dev |
| GAP-024 | Sitemap | No sitemap.xml | SEO limitation | 1 day | Frontend Dev |
| GAP-025 | robots.txt | No robots.txt | SEO limitation | 1 day | Frontend Dev |
| GAP-026 | Password Reset | No reset flow | UX gap | 1 day | Full-stack |
| GAP-027 | Email Verification | No email verification | Security gap | 1 day | Full-stack |

### P3 - Low (Polish)

| ID | Feature | Gap | Risk | Effort | Owner |
|----|---------|-----|------|--------|-------|
| GAP-030 | Performance Optimization | Bundle sizes unverified | UX risk | 2 days | Frontend Dev |
| GAP-031 | Accessibility Audit | No axe-core testing | Compliance risk | 2 days | QA |
| GAP-032 | Image Optimization | Images unoptimized | Performance risk | 1 day | Frontend Dev |
| GAP-033 | Service Worker | No offline support | UX gap | 2 days | Frontend Dev |
| GAP-034 | Analytics | VITE_ENABLE_ANALYTICS=false | No usage insights | 1 day | Frontend Dev |
| GAP-035 | Error Tracking | VITE_SENTRY_DSN= empty | No error visibility | 1 day | Backend Dev |

---

## Weak Implementations

| ID | Area | Current State | Required State | Priority |
|----|------|---------------|----------------|----------|
| WEAK-001 | Blog | Returns empty array | Full CMS with CRUD | P2 |
| WEAK-002 | Courses | Hardcoded data | Course management system | P2 |
| WEAK-003 | Notifications | Schema exists; no endpoints | Push/email/SMS notifications | P2 |
| WEAK-004 | Admin Dashboard | Returns empty | Full admin panel | P2 |
| WEAK-005 | Constellation | Frontend exists; backend unclear | Full feature with API | P3 |
| WEAK-006 | Confessional | Frontend exists; backend unclear | Full feature with API | P3 |

---

## Risks

### Security Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| RISK-001 | Auth bypass via runtime flag | HIGH | CRITICAL | Remove flag immediately |
| RISK-002 | Mock auth in production | MEDIUM | HIGH | Disable in production env |
| RISK-003 | No rate limiting on sensitive endpoints | LOW | MEDIUM | Audit and add limits |
| RISK-004 | Dev routes exposed in production | LOW | MEDIUM | Verify config.runtime.enableDevRoutes |

### Business Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| RISK-010 | Cannot monetize (no payments) | CERTAIN | CRITICAL | Implement Razorpay P1 |
| RISK-011 | Core features non-functional | CERTAIN | HIGH | Complete therapy/video P1 |
| RISK-012 | Poor SEO ranking | HIGH | MEDIUM | Implement SSR/structured data P2 |
| RISK-013 | Low user trust (mock data visible) | MEDIUM | MEDIUM | Remove mock auth; use real data |

### Technical Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| RISK-020 | Low test coverage | CERTAIN | MEDIUM | Add comprehensive tests P2 |
| RISK-021 | Controller/module duplication | CERTAIN | LOW | Consolidate patterns P3 |
| RISK-022 | Documentation drift | CERTAIN | LOW | Regular docs review P3 |
| RISK-023 | No monitoring | MEDIUM | MEDIUM | Add Sentry/PostHog P2 |

---

## Blockers

| ID | Blocker | Blocked By | Resolution |
|----|---------|------------|------------|
| BLOCK-001 | Cannot test payment flow | GAP-010 (Razorpay) | Implement Razorpay |
| BLOCK-002 | Cannot test therapy booking | GAP-011 (Therapy backend) | Implement therapy endpoints |
| BLOCK-003 | Cannot test video calls | GAP-013 (Video integration) | Integrate Daily.co |
| BLOCK-004 | Cannot verify email flow | GAP-012 (Email service) | Integrate Resend/SendGrid |

---

## Dependencies

| ID | Feature | Depends On | Type |
|----|---------|------------|------|
| DEP-001 | Therapy Booking | GAP-011 (Therapy backend), GAP-013 (Video) | Technical |
| DEP-002 | Payment Flow | GAP-010 (Razorpay) | Technical |
| DEP-003 | Password Reset | GAP-012 (Email service) | Technical |
| DEP-004 | SEO Improvements | GAP-022 (SSR), GAP-023 (Structured Data) | Technical |

---

## Dead/Abandoned Code

| ID | File/Feature | Evidence | Recommendation |
|----|--------------|----------|----------------|
| DEAD-001 | `.agent/`, `.agents/`, `.kiro/` | Duplicate AI agent configs | Consolidate or remove |
| DEAD-002 | `server/src/modules/*` | Duplicates controllers | Consolidate into single pattern |
| DEAD-003 | `UserSettings` model | No CRUD endpoints | Implement or remove |
| DEAD-004 | `AuditLog` model | Only used by AIEventLogger | Expand usage or simplify |

---

## Duplicate Architecture

| ID | Duplication | Files | Recommendation |
|----|-------------|-------|----------------|
| DUP-001 | Auth Controller/Module | `controllers/auth.controller.ts` + `modules/auth/` | Keep modules pattern; remove controllers |
| DUP-002 | Admin Controller/Module | `controllers/admin.controller.ts` + `modules/admin/` | Keep modules pattern; remove controllers |
| DUP-003 | AI Agent Configs | `.agent/`, `.agents/`, `.kiro/` | Keep one; remove others |

---

## Summary

| Category | Count |
|----------|-------|
| P0 Critical Gaps | 2 |
| P1 High Gaps | 6 |
| P2 Medium Gaps | 8 |
| P3 Low Gaps | 6 |
| Weak Implementations | 6 |
| Security Risks | 4 |
| Business Risks | 4 |
| Technical Risks | 4 |
| Blockers | 4 |
| Dead Code | 4 |
| Duplicate Architecture | 3 |

**Total Action Items:** 51
