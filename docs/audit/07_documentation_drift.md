# Documentation Drift Audit

**Generated:** March 6, 2026  
**Severity Scale:** Critical | High | Medium | Low

---

## Critical Drift (Security/Functionality Impact)

### 1. Socket.io Claim vs ws Reality

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "Socket.io for real-time features" | `ws` package used instead | HIGH |
| **server/package.json** | N/A | `"ws": "^8.19.0"` present | - |
| **server/src/index.ts** | N/A | `websocketService` uses `ws` | - |

**Impact:** Developer onboarding confusion; wrong integration assumptions  
**Fix:** Update README to state "WebSocket (ws) for real-time features"

---

### 2. React Query Claim vs Reality

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "React Query for data fetching" | NOT in package.json | HIGH |
| **package.json** | N/A | No `@tanstack/react-query` dependency | - |
| **src/services/api.service.ts** | N/A | Custom fetch wrapper used | - |

**Impact:** New developers expect React Query; code uses custom service  
**Fix:** Either add React Query or update docs to reflect custom service

---

### 3. Zustand Claim vs Reality

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "Zustand for state management" | NOT in package.json | HIGH |
| **package.json** | N/A | No `zustand` dependency | - |
| **src/context/** | N/A | React Context used instead | - |

**Impact:** State management architecture misunderstanding  
**Fix:** Update README to state "React Context for state management"

---

### 4. Redis Claim vs Reality

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "Redis for caching and sessions" | NOT in server dependencies | MEDIUM |
| **server/package.json** | N/A | No `redis` or `ioredis` | - |
| **server/src/services/cache.service.ts** | N/A | File exists but implementation unknown | - |

**Impact:** Infrastructure planning confusion  
**Fix:** Update README; clarify cache.service.ts implementation

---

## High Drift (Feature Implementation)

### 5. Therapy Booking Implementation

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "Therapy Booking: Connect with licensed therapists" | Backend throws `notImplemented` | HIGH |
| **server/src/controllers/therapy.controller.ts** | N/A | All methods stubbed | - |

**Impact:** Users cannot book therapy; core value proposition broken  
**Fix:** Implement therapy backend or update docs to "Coming Soon"

---

### 6. AI Features Implementation

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | Implies AI features exist | All AI endpoints stubbed | HIGH |
| **docs/COMPREHENSIVE_CODEBASE_AUDIT.md** | "AI Engine: Conversational AI, Predictive Analytics" | Methods throw `notImplemented` | HIGH |

**Impact:** False expectations about AI capabilities  
**Fix:** Implement AI features or clearly mark as roadmap items

---

### 7. Payment Processing Implementation

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | Implies payment integration | Razorpay SDK not installed | HIGH |
| **server/src/controllers/payments.controller.ts** | N/A | All methods throw `notImplemented` | - |

**Impact:** Cannot monetize platform  
**Fix:** Implement Razorpay integration

---

## Medium Drift (Architecture/Testing)

### 8. Testing Coverage Claims

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "15 Playwright smoke tests" | Accurate but overstates quality | MEDIUM |
| **tests/** | N/A | ~15 E2E tests; no unit/integration tests | - |

**Impact:** False sense of test coverage  
**Fix:** Add unit/integration tests; clarify coverage in docs

---

### 9. Video Call Implementation

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "Secure Video Calls: HIPAA-compliant video consultation platform" | No video SDK installed | MEDIUM |
| **server/package.json** | N/A | No Daily.co/Twilio/Agora SDK | - |

**Impact:** Therapy sessions cannot happen  
**Fix:** Integrate Daily.co or similar; update docs

---

## Low Drift (Minor Inaccuracies)

### 10. Infrastructure Claims

| Aspect | Documentation | Reality | Severity |
|--------|--------------|---------|----------|
| **README.md** | "Railway/Heroku for backend hosting" | No deployment config verified | LOW |
| **README.md** | "Vercel for frontend deployment" | vercel.json exists | - |

**Impact:** Minor deployment confusion  
**Fix:** Verify actual deployment targets; update docs

---

## Summary by Severity

| Severity | Count | Items |
|----------|-------|-------|
| Critical | 0 | - |
| High | 7 | Socket.io, React Query, Zustand, Therapy, AI, Payments, Video |
| Medium | 2 | Redis, Testing |
| Low | 1 | Infrastructure |

---

## Root Causes

1. **README written before implementation** - Features documented but not built
2. **Copy-paste from templates** - Stack section may be templated
3. **No documentation review process** - Docs not updated as code changes
4. **AI-generated documentation** - May overclaim capabilities

---

## Recommendations

1. **Immediate:** Update README to reflect actual stack (ws, no React Query/Zustand/Redis)
2. **This Week:** Mark stubbed features as "Coming Soon" or "In Development"
3. **This Month:** Implement missing core features (therapy, payments, video)
4. **Ongoing:** Add documentation review to PR checklist
