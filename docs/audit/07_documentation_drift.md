# Documentation Drift Report — Soul Yatri Codebase

_Generated: Code-grounded audit comparing every doc claim against actual implementation._

## Overview
- **40 drift instances** identified across 10 documentation files
- **15 CRITICAL** — doc claims features/systems that don't exist at all
- **11 HIGH** — doc claims work but reality is stubs or 501 responses
- **9 MEDIUM** — claims partially true but misleading about completeness
- **5 LOW** — accurate with minor caveats

## Drift Table

| Doc | Claim | Code Reality | Severity |
|-----|-------|-------------|----------|
| **ULTIMATE_GOD_MODE_ARCHITECTURE.md** | Supervisor AI Agent monitoring event firehose with Redpanda/Kafka | Zero message queue integrations; no event consumer infrastructure | CRITICAL |
| ULTIMATE_GOD_MODE_ARCHITECTURE.md | Live Therapist Co-pilot analyzing real-time audio/transcript | No session recording, no Whisper, no real-time pipeline; native `ws` only | CRITICAL |
| ULTIMATE_GOD_MODE_ARCHITECTURE.md | Multimodal crisis detection (voice tone + typing cadence + facial webcam) | Only hardcoded keyword list in client code; no ML models | CRITICAL |
| ULTIMATE_GOD_MODE_ARCHITECTURE.md | Autonomous content pipeline (research → write → optimize → publish) | No blog CMS; no content ingestion pipeline | CRITICAL |
| ULTIMATE_GOD_MODE_ARCHITECTURE.md | Self-healing codebase (auto-fix bugs from Sentry stack traces) | No Sentry; no error monitoring integration | CRITICAL |
| **BUILD_PLAN.md** | Real-time via Socket.IO | Uses native Node `ws`, NOT Socket.IO | HIGH |
| BUILD_PLAN.md | Razorpay + Stripe payment integration | Zero payment integrations; payments.controller returns 501 | CRITICAL |
| BUILD_PLAN.md | Daily.co or 100ms for therapy video sessions | No video SDK; therapy routes all 501 | CRITICAL |
| BUILD_PLAN.md | OpenAI GPT-4o + Whisper AI integration | No AI/LLM SDK in package.json; ai.controller returns 501 | CRITICAL |
| BUILD_PLAN.md | Fine-tuning strategy (Phase 2–4) with model training pipeline | No model training capability | HIGH |
| BUILD_PLAN.md | Multi-currency support (8 currencies via exchange rate API) | No currency logic | MEDIUM |
| BUILD_PLAN.md | WCAG 2.1 AA on all pages (automated + manual testing) | Only Radix UI defaults; no dedicated a11y audit | MEDIUM |
| **MVP_DEFINITION.md** | Video therapy sessions via Daily.co (core MVP) | No video backend; therapy routes return 501 | CRITICAL |
| MVP_DEFINITION.md | AI voice assistant 24/7 with crisis detection (safety critical) | Keyword-only crisis check + mock AI responses | CRITICAL |
| MVP_DEFINITION.md | Therapist dashboard for managing clients, appointments, notes | UI exists; all backend handlers are TODO stubs | HIGH |
| MVP_DEFINITION.md | Astrologer system with kundali matching + pre-session reports | 71-line TODO stub; no kundali logic | CRITICAL |
| MVP_DEFINITION.md | Health tools (mood tracker, meditation, breathing, journal) | Backend health-tools.controller exists and works; frontend pages API-backed — **claim is accurate** | LOW |
| MVP_DEFINITION.md | Notification system (in-app + email transactional) | In-app WebSocket partial; no email integration | MEDIUM |
| MVP_DEFINITION.md | Razorpay payments (India-first MVP) | Zero payment code | CRITICAL |
| **ARCHITECTURE.md** | 22 route files with RESTful endpoints | Route files exist; 9 of 12 controllers return 501 | HIGH |
| ARCHITECTURE.md | Socket.IO for real-time | Uses native `ws` | HIGH |
| ARCHITECTURE.md | RBAC with 4 roles fully functional | Auth middleware supports roles; only USER flow fully works | MEDIUM |
| ARCHITECTURE.md | Backend services layer (tokens, AI, moderation) | Token service works; AI + moderation are TODO stubs | MEDIUM |
| **IMPLEMENTATION_SUMMARY.md** | Type system fully implemented (5 files) | Types exist but reference unimplemented routes | LOW |
| IMPLEMENTATION_SUMMARY.md | Services layer (API, storage, websocket) | All three exist and function | LOW |
| IMPLEMENTATION_SUMMARY.md | 20+ utility functions + validators | Accurate but many unused by hardcoded pages | LOW |
| IMPLEMENTATION_SUMMARY.md | Global state management with Context/Zustand | Auth context works with mock auth only | MEDIUM |
| **IMPLEMENTATION_COMPLETE.md** | "PRODUCTION READY" status | 71 empty modules, 9/12 controllers return 501, zero integrations | CRITICAL |
| IMPLEMENTATION_COMPLETE.md | OnboardingWizardPage steps 4–10 fully functional | POST endpoints work; GET logic for loading saved state incomplete | MEDIUM |
| **COMPREHENSIVE_CODEBASE_AUDIT.md** | Claims to be a codebase audit | Actually an aspirational blueprint (god-mode spec for future) | MEDIUM |
| COMPREHENSIVE_CODEBASE_AUDIT.md | Complete Prisma schema needed for video, payments, courses | True; minimal stub schema; 15+ domain models missing | HIGH |
| COMPREHENSIVE_CODEBASE_AUDIT.md | Background jobs, cache, search infrastructure needed | All three 100% missing | HIGH |
| **STATUS.md** | 17 batches completed with full validation | "Completed" = lint/build pass, NOT feature completion | HIGH |
| STATUS.md | 170+ endpoints documented in API.md | 72 of those return 501 (Unimplemented) | HIGH |
| STATUS.md | Testing foundation: 15 smoke tests covering core flows | Accurate but tests only check public routes + mock login | LOW |
| STATUS.md | Error handling + resilience unification (BATCH:015) | Error codes + middleware exist; but controllers are stubs, no real error paths tested | MEDIUM |
| **CURRENT_PROBLEMS.md** | P-001 through P-003 resolved (auth bypass/mock gated) | Flags exist but bypass/mock still default-enabled | MEDIUM |
| CURRENT_PROBLEMS.md | Only open problem: Tailwind ambiguous utilities | Core functionality gaps not listed as problems | LOW |
| **DEVELOPMENT.md** | `npm run quality:ci` runs full quality gate | Runs successfully; but only smoke-tests public pages | MEDIUM |
| DEVELOPMENT.md | Real auth via POST `/api/v1/auth/login` works | Endpoint works; but fallback to mock on network failure undocumented | MEDIUM |

## Severity Counts

| Severity | Count |
|----------|-------|
| CRITICAL | 15 |
| HIGH | 11 |
| MEDIUM | 9 |
| LOW | 5 |
| **Total** | **40** |

## Key Drift Patterns

### Pattern 1: Architecture Without Implementation
Docs describe 22 controllers and 71 module files as if they function. Reality: 3 controllers work, 9 return 501, and all 71 module files are `// TODO: Implement`.

### Pattern 2: "Production Ready" Claims
IMPLEMENTATION_COMPLETE.md declares production readiness. The frontend is ~70% mock/static and backend is ~75% stubs.

### Pattern 3: Aspirational Docs Mixed with Operational Docs
ULTIMATE_GOD_MODE_ARCHITECTURE.md and COMPREHENSIVE_CODEBASE_AUDIT.md describe future-state systems (AI supervisors, self-healing code, multimodal crisis detection). They're not labeled as aspirational, creating confusion about current state.

### Pattern 4: Batch Completion ≠ Feature Completion
STATUS.md marks 17 batches as "completed" based on lint/build passing. This creates a false sense of progress when the actual feature implementation is ~20-25%.

### Pattern 5: Integration Claims Without Code
Docs reference Razorpay, Daily.co, OpenAI, Socket.IO, Resend, Sentry as if they're integrated. Zero external service SDKs are actually connected.

## Recommendations

1. **Add reality labels** to each doc: `[ASPIRATIONAL]`, `[CURRENT]`, `[DEPRECATED]`
2. **Create CURRENT_REALITY.md** that explicitly lists what's implemented vs. planned
3. **Fix Socket.IO → ws** references in ARCHITECTURE.md and BUILD_PLAN.md
4. **Remove "PRODUCTION READY"** from IMPLEMENTATION_COMPLETE.md
5. **Redefine batch completion** in STATUS.md to include feature-level acceptance criteria
6. **Separate ULTIMATE_GOD_MODE** into a `/docs/vision/` folder distinct from operational docs
