# Documentation Drift Register — Soul Yatri Codebase Audit

> Every claim in documentation checked against actual codebase reality.

## Severity Legend
- **🔴 CRITICAL**: Claim implies production-ready capability that does not exist
- **🟡 MAJOR**: Significant exaggeration or missing implementation
- **🟢 MINOR**: Cosmetic, outdated reference, or partial truth

---

## 🔴 CRITICAL DRIFT

### DRIFT-C01: React Query / TanStack Query
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md, ARCHITECTURE.md |
| Claim | "React Query: Server state and data fetching cache" |
| Reality | Not in package.json. Not imported anywhere. Zero files reference `useQuery` or `@tanstack/react-query`. |
| Impact | Data fetching has no cache, no background refetch, no optimistic updates. Every page re-fetches on mount. |
| Fix Effort | Medium — install + wrap existing fetch calls |

### DRIFT-C02: Zustand State Management
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Zustand: Feature-specific stores" |
| Reality | Not in package.json. Only React Context (AuthContext, ThemeContext). No feature stores. |
| Impact | State management is minimal; no shared state across features |
| Fix Effort | Low-Medium — install + create stores as needed |

### DRIFT-C03: AES-256 Encryption at Rest
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "All therapy session data: AES-256 encryption at rest", "Encrypted storage for therapy notes" |
| Reality | No encryption library installed (no crypto-js, no node:crypto usage for data encryption). Data stored in Prisma as plain text. |
| Impact | Privacy/compliance violation if therapy data is stored. Currently therapy is all stubs so no actual exposure. |
| Fix Effort | Medium — field-level encryption with Prisma middleware |

### DRIFT-C04: HIPAA-Style Audit Logging
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md, ARCHITECTURE.md |
| Claim | "HIPAA-style audit logs for all PHI access", "Complete audit trail" |
| Reality | AuditLog model exists in schema.prisma. ZERO code writes to it. No middleware logs data access. |
| Impact | No compliance capability. Legal risk if handling PHI. |
| Fix Effort | Medium — Prisma middleware + query logging |

### DRIFT-C05: Socket.IO Real-Time
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md, MVP_DEFINITION.md |
| Claim | "Socket.IO: Real-time notifications and live features" |
| Reality | Backend uses raw `ws` package (WebSocket). Frontend uses native WebSocket API. Socket.IO is NOT installed on either side. |
| Impact | Terminology confusion; actual WebSocket is simpler than Socket.IO |
| Correction | Docs should say "ws (raw WebSocket)" not "Socket.IO" |

### DRIFT-C06: Sentry Error Monitoring
| Field | Value |
|-------|-------|
| Document(s) | ARCHITECTURE.md, BUILD_PLAN.md |
| Claim | "Monitoring: Sentry + PostHog" |
| Reality | Neither @sentry/react nor @sentry/node in any package.json. No DSN configured. No Sentry.init() calls. |
| Impact | Zero error tracking in production. Errors silently lost. |
| Fix Effort | Low — standard Sentry SDK setup |

### DRIFT-C07: PostHog Analytics
| Field | Value |
|-------|-------|
| Document(s) | ARCHITECTURE.md |
| Claim | "PostHog for product analytics" |
| Reality | posthog-js not installed. No analytics events tracked. |
| Impact | Zero product analytics. No user behavior data. |
| Fix Effort | Low — standard PostHog setup |

### DRIFT-C08: Multi-Currency Payment Processing
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "8 currencies: INR, USD, EUR, GBP, AUD, CAD, SGD, AED" |
| Reality | Payment model has single `currency` field defaulting to "INR". No Stripe integration. No currency conversion logic. All payment endpoints return 501. |
| Impact | Only INR even conceptually; no payments work at all |
| Fix Effort | High — requires payment gateway integration + currency handling |

---

## 🟡 MAJOR DRIFT

### DRIFT-M01: Phase Claims (4-24 Phases)
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md (3,785 lines) |
| Claim | Detailed phases 4 through 24 describing marketplace, AI therapy, global expansion, blockchain, AR/VR, quantum computing |
| Reality | Phase 1 (Auth) partially complete. Phase 2 (Core) < 40% complete. Phases 3-24 are zero-implementation aspirational roadmap. |
| Impact | Massive documentation overhead maintaining fictional feature specs |
| Recommendation | Archive phases 4+ into a `ROADMAP_VISION.md`; keep BUILD_PLAN focused on next 2-3 phases |

### DRIFT-M02: Redis Caching
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md, docker-compose.yml |
| Claim | "Redis for session caching and rate limiting" |
| Reality | docker-compose.yml has Redis container. Cache service uses in-memory Map. No ioredis/redis package installed. |
| Impact | Cache evaporates on process restart |
| Fix Effort | Low — swap Map for Redis client |

### DRIFT-M03: Video/Telehealth Integration (Daily.co/Agora)
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Video call integration with Daily.co" |
| Reality | No Daily.co, Agora, Twilio, or any video SDK. Session model has `roomUrl` field that is never populated. |
| Impact | Remote therapy sessions impossible |
| Fix Effort | High — requires video SDK integration + UI |

### DRIFT-M04: AI Integration (OpenAI/GPT)
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md, ARCHITECTURE.md |
| Claim | "AI-Powered Support: SoulBot, AI journaling insights, crisis detection" |
| Reality | All 11 AI endpoints return 501. No openai package installed. AI routes have a TODO comment. |
| Impact | Central product differentiator is non-functional |
| Fix Effort | Medium-High — OpenAI integration + prompt engineering + safety filters |

### DRIFT-M05: Comprehensive Test Suite
| Field | Value |
|-------|-------|
| Document(s) | CONTRIBUTING.md, BUILD_PLAN.md |
| Claim | "Run test suite before submitting PRs", "Unit, integration, E2E tests" |
| Reality | 1 Playwright config file + 1 example spec with 2 smoke tests. Zero unit tests. Zero integration tests. No Vitest/Jest configured. |
| Impact | No automated quality assurance |
| Fix Effort | High — requires test infrastructure + writing tests |

### DRIFT-M06: Notification System Overclaimed
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Push notifications, email notifications, in-app notifications, SMS alerts" |
| Reality | In-app notifications work (WebSocket + Prisma). Push notifications: not implemented. Email: console.log stub. SMS: not implemented. |
| Impact | 75% of notification capability missing |

### DRIFT-M07: Community Features
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Support groups, community forums, peer connections, moderated discussions" |
| Reality | All community endpoints return 501. No CommunityPost/CommunityGroup models. Frontend pages use hardcoded mock data. |
| Impact | Social features non-functional |

### DRIFT-M08: E-Commerce / Shop
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Product marketplace, cart, checkout, order management" |
| Reality | All shop endpoints return 501. No Product/Order models in schema. |
| Impact | Merchandise/product revenue blocked |

---

## 🟢 MINOR DRIFT

### DRIFT-N01: "Enterprise-Grade" Architecture Claims
| Field | Value |
|-------|-------|
| Document(s) | ULTIMATE_GOD_MODE_ARCHITECTURE.md, ENTERPRISE_CHECKLIST.md |
| Claim | "God-mode architecture", "Enterprise-ready" |
| Reality | Standard Express + React app. No microservices, no message queues, no service mesh, no auto-scaling. |
| Impact | Misleading for stakeholders reading docs |

### DRIFT-N02: Rate Limiting Implementation
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Advanced rate limiting per role per endpoint" |
| Reality | express-rate-limit IS installed and configured, but with basic global limits. Not per-role or per-endpoint. |
| Impact | Works but less granular than claimed |

### DRIFT-N03: File Upload / Avatar
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "User avatar upload with image processing" |
| Reality | Multer + Sharp ARE installed. Storage service exists but uses in-memory (files lost on restart). |
| Impact | Partially works in dev; not production-ready |

### DRIFT-N04: Internationalization (i18n)
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Multi-language support (Phase 8)" |
| Reality | No i18n library. All strings hardcoded in English. |
| Impact | Expected since it's a future phase, but doc could be clearer |

### DRIFT-N05: PWA Support
| Field | Value |
|-------|-------|
| Document(s) | BUILD_PLAN.md |
| Claim | "Progressive Web App with offline support" |
| Reality | No service worker. No manifest.json. No offline capability. |
| Impact | Expected for future phase |

---

## Summary Statistics

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 8 |
| 🟡 MAJOR | 8 |
| 🟢 MINOR | 5 |
| **TOTAL** | **21** |

### Documentation Files Assessed
| File | Lines | Drift Items | Accuracy % |
|------|-------|-------------|------------|
| BUILD_PLAN.md | ~3,785 | 14 | ~40% |
| ARCHITECTURE.md | ~500 | 4 | ~60% |
| MVP_DEFINITION.md | ~300 | 2 | ~50% |
| CONTRIBUTING.md | ~100 | 1 | ~80% |
| ENTERPRISE_CHECKLIST.md | ~200 | 1 | ~50% |
| ULTIMATE_GOD_MODE_ARCHITECTURE.md | ~500 | 1 | ~30% |
| DEVELOPMENT.md | ~150 | 0 | ~90% |

### Root Cause
The BUILD_PLAN.md is a **forward-looking vision document** being treated as a **current state description**. It describes 24 phases of development but does not clearly distinguish "implemented" vs "planned" vs "aspirational". This creates confusion for developers, stakeholders, and AI agents reading the codebase.

### Recommendation
1. Split BUILD_PLAN.md into: `CURRENT_STATE.md` (what works today) + `ROADMAP.md` (what's planned)
2. Add status badges to each section: ✅ LIVE | 🚧 IN PROGRESS | 📋 PLANNED | 💡 VISION
3. Run this drift audit after every sprint to keep docs honest
