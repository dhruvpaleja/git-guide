# 🚀 START HERE — Soul Yatri Codebase Guide for Vibe Coders

**Created:** March 6, 2026  
**For:** Vibe Coders who use AI agents  
**Total Files in Repo:** 84,566 (but you only need to care about ~50)

---

## ⚡ QUICK START (5 Minutes)

### Step 1: Open These 3 Files FIRST

1. **`docs/audit/15_master_execution_roadmap.md`** ← Your strategic roadmap (dependency graph, phases, "read first" refs)
2. **`docs/audit/MASTER_TODO_LIST.md`** ← Your step-by-step checklist (51 items with checkboxes)
3. **`docs/audit/ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md`** ← Full details (read later)

### Step 2: Understand the Problem

**Current State:** 28/100  
**Main Issues:**
- ❌ Security holes (auth bypass enabled)
- ❌ Fake data everywhere
- ❌ Most features don't work (therapy, payments, AI, video)

### Step 3: Start with P0 (Do TODAY)

Open `MASTER_TODO_LIST.md` and start at **P0.1**

---

## 📁 ONLY 10 FILES YOU NEED TO KNOW

Don't get overwhelmed by 84K files. You only need these:

| # | File | What It Does | Priority |
|---|------|--------------|----------|
| 1 | `src/router/ProtectedRoute.tsx` | Auth guard (HAS SECURITY BUG) | 🔴 FIX FIRST |
| 2 | `src/config/runtime.flags.ts` | Feature flags (MOCK AUTH ENABLED) | 🔴 FIX FIRST |
| 3 | `src/context/AuthContext.tsx` | Login logic (HARDCODED PASSWORDS) | 🔴 FIX FIRST |
| 4 | `server/src/controllers/auth.controller.ts` | Real backend auth | ✅ This is GOOD |
| 5 | `server/src/controllers/health-tools.controller.ts` | Mood/Journal/Meditation | ✅ This is GOOD |
| 6 | `server/src/controllers/payments.controller.ts` | Payments (BROKEN - returns 501) | 🟡 FIX LATER |
| 7 | `server/src/controllers/therapy.controller.ts` | Therapy (BROKEN - returns 501) | 🟡 FIX LATER |
| 8 | `server/prisma/schema.prisma` | Database schema | ✅ This is GOOD |
| 9 | `package.json` | Frontend dependencies | 📖 Reference only |
| 10 | `server/package.json` | Backend dependencies | 📖 Reference only |

---

## 🎯 YOUR ACTION PLAN (Copy-Paste This)

### TODAY (4-6 hours)

```
□ 1. Open docs/audit/MASTER_TODO_LIST.md
□ 2. Find section "P0 — CRITICAL"
□ 3. Do P0.1: Remove Auth Bypass (30 min)
□ 4. Do P0.2: Disable Mock Auth (1 hour)
□ 5. Do P0.3: Remove Fake Data (2-3 hours)
□ 6. Run: npm run type-check && npm run build
□ 7. Test: Try accessing /dashboard without login
```

### THIS WEEK (3-5 days)

```
□ 1. Do P1.1: Implement Razorpay (3 days)
□ 2. Do P1.2: Implement Therapy Backend (2 days)
□ 3. Do P1.3: Add Email Service (1 day)
□ 4. Do P1.4: Add Video Integration (2 days)
```

### NEXT BIG FEATURE (12-16 weeks)

```
□ Soul Constellation - The CORE Differentiator
□ Read: docs/audit/SOUL_CONSTELLATION_100_100_PLAN.md
□ Prompts: docs/audit/14_execution_prompts.md (PROMPT 009, 010, 011)
□ Features: Soul matching algorithm, Social feed, Messaging
□ This is what makes you unique - Hinge × Instagram × LinkedIn × Astrology
```

### THIS MONTH (2-3 weeks)

```
□ 1. Do P2.1: Add Unit Tests (3 days)
□ 2. Do P2.2: Add Structured Data (2 days)
□ 3. Do P2.3: Implement AI Matching (4-6 weeks)
□ 4. Do P2.4: Add Reviews System (2-3 weeks)
```

---

## 🤖 HOW TO USE AI AGENTS

### For Each Task:

1. **Open** `docs/audit/17_STEP2_execution_prompts.md` (30 STEP 2 compliant prompts)
2. **Find** the prompt number (e.g., PROMPT 001 for Auth Security Fix)
3. **Copy** the entire prompt (sections A through F)
4. **Paste** to your AI agent (Claude, Cursor, etc.)
5. **Wait** for implementation
6. **Verify** using the checklist in MASTER_TODO_LIST.md

> **Note:** `14_execution_prompts.md` is the legacy version (15 prompts). Use `17_STEP2_execution_prompts.md` (30 prompts, full STEP 2 format) instead.

### Full Algorithm Specs:

For deep implementation details (data models, algorithms, dashboard specs, AI systems):
→ `docs/audit/16_ULTIMATE_FEATURE_ALGORITHM_BIBLE.md` (2500+ lines, 20 parts)

### Example:

```
TASK: Fix auth security (P0)

AI AGENT PROMPT:
→ Open docs/audit/17_STEP2_execution_prompts.md
→ Copy PROMPT 001 (Auth Security Fix)
→ Paste to AI agent
→ Let it implement
→ Verify with checklist
```

---

## 📊 WHAT'S BROKEN vs WHAT WORKS

### ✅ WORKS (Don't Touch)

| Feature | Files | Status |
|---------|-------|--------|
| User Auth (Backend) | `server/src/controllers/auth.controller.ts` | ✅ Real JWT, bcrypt, refresh tokens |
| Health Tools | `server/src/controllers/health-tools.controller.ts` | ✅ Mood, Journal, Meditation all work |
| Database | `server/prisma/schema.prisma` | ✅ Comprehensive schema |
| Landing Page | `src/pages/LandingPage.tsx` | ✅ Visually complete |

### ❌ BROKEN (Fix These)

| Feature | Problem | Fix |
|---------|---------|-----|
| Auth Bypass | `ProtectedRoute.tsx` has bypass flag | Remove flag (P0.1) |
| Mock Auth | `AuthContext.tsx` has hardcoded passwords | Disable in production (P0.2) |
| Fake Sessions | `SessionsPage.tsx` shows pravatar.cc mock data | Remove fake data (P0.3) |
| Fake Admin | `AdminDashboard.tsx` shows fake metrics | Remove fake data (P0.3) |
| Payments | `payments.controller.ts` returns 501 | Implement Razorpay (P1.1) |
| Therapy | `therapy.controller.ts` returns 501 | Implement backend (P1.2) |
| Video | No video SDK | Add Daily.co/100ms (P1.4) |
| Email | No email SDK | Add Resend (P1.3) |

---

## 🔥 MOST CRITICAL FILES (Open These NOW)

### 1. `src/router/ProtectedRoute.tsx`

**Problem:** Has auth bypass that lets anyone access protected routes

**What to look for:**
```typescript
// DELETE THIS ENTIRE BLOCK
if (runtimeFlags.authBypassEnabled) {
  return <Outlet />;
}
```

**Fix:** See P0.1 in MASTER_TODO_LIST.md

---

### 2. `src/config/runtime.flags.ts`

**Problem:** Enables mock auth by default

**What to look for:**
```typescript
// CHANGE THESE TO FALSE
authBypassEnabled: true,  // ← Change to false
mockAuthEnabled: true,    // ← Change to false
```

**Fix:** See P0.1 in MASTER_TODO_LIST.md

---

### 3. `src/context/AuthContext.tsx`

**Problem:** Has hardcoded test accounts that work without backend

**What to look for:**
```typescript
// REMOVE THIS ENTIRE MOCK_USERS OBJECT
const mockUsers = {
  'user@test.com': { ... },
  'therapist@test.com': { ... },
  'admin@test.com': { ... }
}
```

**Fix:** See P0.2 in MASTER_TODO_LIST.md

---

### 4. `server/src/controllers/payments.controller.ts`

**Problem:** All endpoints return 501 (Not Implemented)

**What to look for:**
```typescript
throw AppError.notImplemented('Process payment');
```

**Fix:** See P1.1 in MASTER_TODO_LIST.md (implement Razorpay)

---

### 5. `server/src/controllers/therapy.controller.ts`

**Problem:** All endpoints return 501 (Not Implemented)

**What to look for:**
```typescript
throw AppError.notImplemented('Therapy session creation');
```

**Fix:** See P1.2 in MASTER_TODO_LIST.md (implement therapy backend)

---

## 📋 VERIFICATION CHECKLIST

After ANY change:

```bash
# 1. Type Check
npm run type-check

# 2. Build
npm run build

# 3. Lint
npm run lint

# 4. Test (if tests exist)
npm test

# 5. Manual Test
# Open browser, try to break what you fixed
```

---

## 🗺️ FILE NAVIGATION CHEAT SHEET

### Frontend Files
```
src/
├── router/
│   ├── ProtectedRoute.tsx     ← AUTH BYPASS HERE (fix first!)
│   └── index.tsx              ← All routes defined here
├── context/
│   ├── AuthContext.tsx        ← MOCK AUTH HERE (fix second!)
│   └── ThemeContext.tsx
├── pages/
│   ├── dashboard/             ← FAKE DATA HERE (fix third!)
│   │   ├── SessionsPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   └── ...
└── config/
    └── runtime.flags.ts       ← BAD DEFAULTS HERE (fix first!)
```

### Backend Files
```
server/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts         ← ✅ GOOD (real auth)
│   │   ├── health-tools.controller.ts ← ✅ GOOD (works)
│   │   ├── payments.controller.ts     ← ❌ BROKEN (returns 501)
│   │   └── therapy.controller.ts      ← ❌ BROKEN (returns 501)
│   └── prisma/
│       └── schema.prisma              ← ✅ GOOD (comprehensive)
```

### Documentation Files
```
docs/audit/
├── _progress.json                     ← YOUR ROADMAP
├── MASTER_TODO_LIST.md                ← YOUR CHECKLIST
├── 14_execution_prompts.md            ← AI AGENT PROMPTS
└── ULTIMATE_WORLD_CLASS_CODEBASE_AUDIT.md ← FULL DETAILS
```

---

## 🎯 PRIORITY ORDER (Do In This Exact Order)

```
WEEK 1:
├── Day 1: P0.1, P0.2, P0.3 (Security + Remove Fake Data)
├── Day 2-4: P1.1 (Razorpay Payments)
└── Day 5-6: P1.2 (Therapy Backend)

WEEK 2:
├── Day 1: P1.3 (Email Service)
├── Day 2-3: P1.4 (Video Integration)
└── Day 4-5: Catch up / Testing

WEEK 3-4:
├── P2.1 (Unit Tests)
├── P2.2 (SEO Structured Data)
└── P2.3, P2.4 (AI Matching, Reviews)
```

---

## 💡 PRO TIPS FOR VIBE CODERS

1. **Don't read all 84K files** — Only the 10 listed above
2. **Use AI agents** — Copy prompts from `14_execution_prompts.md`
3. **Start with P0** — Don't skip to P1 until P0 is done
4. **Verify after each change** — Run `npm run build` every time
5. **Update progress** — Check off items in `MASTER_TODO_LIST.md`
6. **Ask for help** — If stuck, re-read the specific P0/P1/P2 section

---

## 📞 WHEN YOU GET STUCK

1. **Which file do I edit?** → Check MASTER_TODO_LIST.md "Files" section
2. **What changes do I make?** → Check MASTER_TODO_LIST.md "Steps" section
3. **How do I verify?** → Check MASTER_TODO_LIST.md "Verification" section
4. **Can AI do this?** → Copy prompt from `14_execution_prompts.md`
5. **What's next?** → Check MASTER_TODO_LIST.md progress checklist

---

## ✅ FINAL CHECKLIST

Before you start coding:

```
□ I have opened docs/audit/_progress.json
□ I have opened docs/audit/MASTER_TODO_LIST.md
□ I understand P0 must be done first
□ I know which 10 files matter
□ I know how to use AI agents (14_execution_prompts.md)
□ I know verification commands (npm run type-check, npm run build)
```

**Ready? Start with P0.1 in MASTER_TODO_LIST.md**

---

**Document Length:** ~400 lines  
**Time to Read:** 5 minutes  
**Time to Complete All Tasks:** 8-12 weeks

**Next Step:** Open `docs/audit/MASTER_TODO_LIST.md` and start at P0.1
