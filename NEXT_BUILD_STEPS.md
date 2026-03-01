# SOUL YATRI - NEXT BUILD STEPS (Ultra-Detailed AI Agent Guide)

> **CURRENT STATE**: Auth (Phase 1) is DONE. Landing, About, Business, Blogs pages have UI. Dashboard is a shell. Backend infrastructure is PRODUCTION-GRADE.
> **NEXT**: Phase 2 (User Onboarding) -> Phase 3 (Dashboard) -> Phase 16 (Health Tools) -> Phase 4 (Therapy Booking)
> **RULE**: Only build what's in MVP Phases 1-8, 13-14, 16-17, 25. Nothing else.

---

## BACKEND INFRASTRUCTURE (COMPLETED — DO NOT REBUILD)

The following production-grade infrastructure is already in place. AI agents MUST use these utilities instead of rolling their own.

### Core Libraries (server/src/lib/)
| File | What it does | Usage |
|------|-------------|-------|
| `errors.ts` | `AppError` class with 30+ `ErrorCode` constants + factory methods (`AppError.badRequest()`, `.unauthorized()`, `.notFound()`, `.conflict()`, `.internal()`, etc.) | Throw `AppError.notFound('User')` in controllers/services |
| `response.ts` | `sendSuccess(res, data, status?, meta?)`, `sendError(res, status, code, msg)`, `parsePagination(query)`, `buildPaginationMeta(page, limit, total)` | Use in controllers: `sendSuccess(res, user, 201)` |
| `logger.ts` | Structured Winston logger (JSON in prod, colorized in dev). `createRequestLogger(requestId)`, `morganStream` | `logger.info('event', { key: value })` |
| `async-handler.ts` | `asyncHandler(fn)` — wraps async route handlers, auto-forwards errors | `router.get('/foo', asyncHandler(async (req, res) => { ... }))` |
| `prisma.ts` | `prisma` (PrismaClient singleton) + `checkDatabaseHealth()` | Import `prisma` for all DB operations |

### Middleware (server/src/middleware/)
| File | Exports | Usage |
|------|---------|-------|
| `request-context.ts` | `requestContext` — correlation IDs, timing, IP hashing | Already wired in index.ts |
| `auth.middleware.ts` | `requireAuth`, `AuthenticatedRequest` | `router.get('/me', requireAuth, handler)` |
| `rbac.middleware.ts` | `requireRole('ADMIN', 'SUPER_ADMIN')`, `requireOwnership('userId')` | After `requireAuth` |
| `security.middleware.ts` | `authLimiter` (5/15min), `apiLimiter` (100/15min), `strictLimiter` (3/15min), `sensitiveOpsLimiter` (10/hr), `uploadLimiter` (20/hr), `aiLimiter` (30/15min) | Apply per-route |
| `error.ts` | `errorHandler`, `notFound` — auto-normalizes Zod, Prisma, JWT errors | Already wired in index.ts |

### Infrastructure Services (server/src/services/)
| File | What it does | Status |
|------|-------------|--------|
| `email.service.ts` | `emailService.send(opts)`, `emailService.sendTemplate(to, template)` — 7 templates (WELCOME, PASSWORD_RESET, SESSION_CONFIRMATION, SESSION_REMINDER, SESSION_SUMMARY, PAYMENT_RECEIPT, CRISIS_ALERT) | Console fallback, swap to Resend |
| `storage.service.ts` | `storageService.upload(opts)`, `.delete(key)`, `.getSignedUrl(key)` — validates MIME types per folder | Memory fallback, swap to S3/R2 |
| `cache.service.ts` | `cacheService.get/set/del/has/flush/keys` + `cacheAside(key, ttl, fetcher)` helper | Memory fallback, swap to Redis |
| `queue.service.ts` | `queueService.enqueue(queue, data, opts)`, `.register(queue, handler)`, `.schedule(queue, data, interval)` — 7 queue types | Sync fallback, swap to BullMQ |
| `tokens.service.ts` | JWT token generation + verification | Fully implemented |
| `ai-event-logger.service.ts` | Audit logging to Prisma AuditLog table | Fully implemented |

### Config (server/src/config/index.ts)
All service configs in one place: `jwt`, `cookie`, `rateLimit`, `bodyLimit`, `database`, `email`, `storage`, `cache`, `queue`, `payment` (Razorpay), `video` (Daily.co), `ai` (OpenAI), `logging`, `security`.

### Prisma Schema (server/prisma/schema.prisma)
**12 models**: User, RefreshToken, AuditLog, UserProfile, TherapistProfile, TherapistAvailability, Session, MoodEntry, JournalEntry, MeditationLog, Payment, Notification
**9 enums**: Role, AuditCategory, SessionStatus, PaymentStatus, NotificationType, Gender, TherapyHistory, TherapistApproach

### Server Entry (server/src/index.ts)
- Helmet with HSTS in production
- CORS with exposed rate-limit headers
- Request context (correlation IDs) on every request
- Body size limits (10kb JSON/urlencoded)
- Graceful shutdown (SIGTERM/SIGINT, 30s timeout, DB disconnect)
- Uncaught exception + unhandled rejection handlers
- Trust proxy for load balancers

### PATTERN FOR NEW CONTROLLERS
```typescript
import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) throw AppError.notFound('User');
  sendSuccess(res, user);
});
```

### PATTERN FOR NEW VALIDATORS
```typescript
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const mySchema = z.object({ name: z.string().min(1) });

export function requestBodyValidator(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
}
```

### PATTERN FOR NEW FRONTEND PAGES (Dark Theme)
```
Background: bg-black or bg-[#0a0a0a]
Text: text-white (headings), text-white/50 (subtitles), text-white/30 (muted)
Cards: bg-white/[0.02] border border-white/8 rounded-xl
Inputs: bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-white/30
Buttons: bg-white text-black rounded-full h-[52px] font-semibold (primary); text-white/50 (secondary)
Selected chips: bg-white text-black; Unselected: bg-white/[0.03] border border-white/10 text-white/60
Full viewport: h-[100dvh] — no scroll on single-step pages
```

---

## PHASE 2: USER ONBOARDING (10-Step Wizard)

**What it is:** After signup, a 10-step wizard collects user preferences to feed into therapist matching + dashboard personalization.
**Frontend URL:** `/signup?step=onboarding` with `&s=1` through `&s=10`
**Backend API:** `POST /api/v1/users/onboarding` + `GET /api/v1/users/onboarding`
**Existing stub routes (server/src/routes/users.ts):** `POST /onboarding` (501), `GET /profile` (501), `GET /dashboard` (501)

---

### TASK 2.1.1: Create Onboarding Validators

**Files to READ first:** `server/src/validators/auth.validator.ts` (copy pattern)
**Files to CREATE:** `server/src/validators/users.validator.ts`
**Test after:** `cd "d:/soul-yatri-website/server" && ./node_modules/.bin/tsc --noEmit`

#### CONTEXT FOR AI AGENT
```
PROJECT: d:\soul-yatri-website\server
TYPE: ES modules — ALL imports use .js extension

READ server/src/validators/auth.validator.ts first to see the exact pattern.

CREATE server/src/validators/users.validator.ts:

import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// Step-specific data schemas
const stepSchemas = {
  1: z.object({ dateOfBirth: z.string().optional() }),
  2: z.object({ gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']) }),
  3: z.object({ city: z.string().min(1), state: z.string().optional(), country: z.string().optional() }),
  4: z.object({ struggles: z.array(z.string()).min(1).max(10) }),
  5: z.object({ therapyHistory: z.enum(['NEVER', 'CURRENTLY', 'PAST', 'CONSIDERING']) }),
  6: z.object({ goals: z.array(z.string()).min(1).max(8) }),
  7: z.object({
    therapistGenderPref: z.string().optional(),
    therapistLanguages: z.array(z.string()).optional(),
    therapistApproach: z.enum(['CBT', 'HOLISTIC', 'MIXED']).optional(),
  }),
  8: z.object({ interests: z.array(z.string()).min(1).max(6) }),
  9: z.object({
    emergencyName: z.string().min(1),
    emergencyPhone: z.string().min(10).max(15),
    emergencyRelation: z.string().min(1),
  }),
  10: z.object({}),
};

export const onboardingStepSchema = z.object({
  step: z.number().int().min(1).max(10),
  data: z.record(z.unknown()),
}).refine(
  (val) => {
    const schema = stepSchemas[val.step as keyof typeof stepSchemas];
    if (!schema) return false;
    return schema.safeParse(val.data).success;
  },
  { message: 'Invalid data for this onboarding step' }
);

// Re-export the validator middleware pattern
export function requestBodyValidator(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
}
```

---

### TASK 2.1.2: Create Onboarding Controller

**Files to READ first:** `server/src/controllers/auth.controller.ts`, `server/src/lib/async-handler.ts`, `server/src/lib/response.ts`, `server/src/lib/errors.ts`, `server/prisma/schema.prisma` (UserProfile model)
**Files to CREATE:** `server/src/controllers/users.controller.ts`
**Depends on:** 2.1.1
**Test after:** `cd "d:/soul-yatri-website/server" && ./node_modules/.bin/tsc --noEmit`

#### CONTEXT FOR AI AGENT
```
PROJECT: d:\soul-yatri-website\server (ES modules, .js imports)

CREATE server/src/controllers/users.controller.ts:

import { asyncHandler } from '../lib/async-handler.js';
import { sendSuccess } from '../lib/response.js';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { AuthenticatedRequest } from '../middleware/auth.middleware.js';

// --- POST /onboarding ---
export const submitOnboardingStep = asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth!;
  const { step, data } = req.body as { step: number; data: Record<string, unknown> };

  const mapped = mapStepData(step, data);

  await prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...mapped, onboardingStep: step, ...(step === 10 ? { onboardingComplete: true } : {}) },
    update: { ...mapped, onboardingStep: step, ...(step === 10 ? { onboardingComplete: true } : {}) },
  });

  sendSuccess(res, { step, onboardingComplete: step === 10 });
});

// --- GET /onboarding ---
export const getOnboardingProgress = asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth!;
  const profile = await prisma.userProfile.findUnique({ where: { userId } });

  if (!profile) {
    sendSuccess(res, { step: 0, data: {}, isComplete: false });
    return;
  }

  sendSuccess(res, { step: profile.onboardingStep, isComplete: profile.onboardingComplete, data: profile });
});

// --- GET /profile ---
export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth!;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
  if (!user) throw AppError.notFound('User');
  sendSuccess(res, user);
});

// --- GET /dashboard ---
export const getDashboard = asyncHandler(async (req, res) => {
  const { userId } = (req as AuthenticatedRequest).auth!;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
  if (!user) throw AppError.notFound('User');

  const [moodCount, journalCount, meditationCount, sessionCount] = await Promise.all([
    prisma.moodEntry.count({ where: { userId } }),
    prisma.journalEntry.count({ where: { userId } }),
    prisma.meditationLog.count({ where: { userId } }),
    prisma.session.count({ where: { userId, status: 'COMPLETED' } }),
  ]);

  const daysSinceJoin = Math.floor((Date.now() - user.createdAt.getTime()) / 86400000);

  sendSuccess(res, {
    user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, onboardingComplete: user.profile?.onboardingComplete ?? false },
    stats: { sessionsCompleted: sessionCount, moodEntries: moodCount, journalEntries: journalCount, meditationSessions: meditationCount, daysActive: daysSinceJoin },
    quickActions: [
      { id: 'book-session', label: 'Book Session', icon: 'calendar', route: '/therapy/find' },
      { id: 'mood-check', label: 'Mood Check-in', icon: 'smile', route: '/health-tools/mood' },
      { id: 'meditate', label: 'Meditate', icon: 'brain', route: '/health-tools/meditation' },
      { id: 'journal', label: 'Journal', icon: 'book-open', route: '/health-tools/journal' },
    ],
    upcomingSession: null,
  });
});

function mapStepData(step: number, data: Record<string, unknown>) {
  switch (step) {
    case 1: return { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined };
    case 2: return { gender: data.gender as string };
    case 3: return { city: data.city as string, state: data.state as string | undefined, country: data.country as string | undefined };
    case 4: return { struggles: data.struggles as string[] };
    case 5: return { therapyHistory: data.therapyHistory as string };
    case 6: return { goals: data.goals as string[] };
    case 7: return { therapistGenderPref: data.therapistGenderPref as string | undefined, therapistLanguages: (data.therapistLanguages || []) as string[], therapistApproach: data.therapistApproach as string | undefined };
    case 8: return { interests: data.interests as string[] };
    case 9: return { emergencyName: data.emergencyName as string, emergencyPhone: data.emergencyPhone as string, emergencyRelation: data.emergencyRelation as string };
    case 10: return { onboardingComplete: true };
    default: return {};
  }
}
```

---

### TASK 2.1.3: Wire User Routes

**Files to READ first:** `server/src/routes/users.ts`, `server/src/routes/auth.ts` (for pattern)
**Files to MODIFY:** `server/src/routes/users.ts`
**Depends on:** 2.1.1, 2.1.2
**Test after:** `cd "d:/soul-yatri-website/server" && ./node_modules/.bin/tsc --noEmit`

#### CONTEXT FOR AI AGENT
```
READ server/src/routes/users.ts — it has stub routes returning 501.

REPLACE with real handlers:

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requestBodyValidator } from '../validators/users.validator.js';
import { onboardingStepSchema } from '../validators/users.validator.js';
import { submitOnboardingStep, getOnboardingProgress, getProfile, getDashboard } from '../controllers/users.controller.js';

const router = Router();

router.post('/onboarding', requireAuth, requestBodyValidator(onboardingStepSchema), submitOnboardingStep);
router.get('/onboarding', requireAuth, getOnboardingProgress);
router.get('/profile', requireAuth, getProfile);
router.get('/dashboard', requireAuth, getDashboard);

// Keep remaining stubs
router.put('/profile', requireAuth, (_req, res) => res.status(501).json({ success: false, error: { code: 'SRV_005', message: 'Not implemented' } }));
router.get('/export-my-data', requireAuth, (_req, res) => res.status(501).json({ success: false, error: { code: 'SRV_005', message: 'Not implemented' } }));
router.delete('/delete-account', requireAuth, (_req, res) => res.status(501).json({ success: false, error: { code: 'SRV_005', message: 'Not implemented' } }));

export default router;
```

---

### TASK 2.2.1: Create Onboarding Wizard Page

**Files to READ first:** `src/features/onboarding/screens/OnboardingSignupPage.tsx` (styling), `src/pages/auth/SignupPage.tsx` (routing), `src/services/api.service.ts` (API calls), `src/context/AuthContext.tsx`
**Files to CREATE:** `src/features/onboarding/screens/OnboardingWizardPage.tsx`
**Test after:** `cd "d:/soul-yatri-website" && npx vite build`

#### CONTEXT FOR AI AGENT
```
PROJECT: d:\soul-yatri-website (React 19 + TypeScript + Tailwind + framer-motion)

CREATE src/features/onboarding/screens/OnboardingWizardPage.tsx

This is the MAIN CONTAINER for the 10-step onboarding wizard.
It reads the step number from URL (?step=onboarding&s=1), manages state, calls API.

Steps 1-10:
1=DOB, 2=Gender, 3=Location, 4=Struggles, 5=TherapyHistory,
6=Goals, 7=TherapistPrefs, 8=Interests, 9=EmergencyContact, 10=Confirmation

BEHAVIOR:
- On mount: GET /api/v1/users/onboarding → if step > 0, resume from that step
- On each step submit: POST /api/v1/users/onboarding { step, data }
- After step 10: navigate to '/journey-preparation'

FOR NOW: Render placeholder text for each step (e.g. "Step 1: DOB").
Step components will be created in tasks 2.3.x and 2.4.x and wired in task 2.5.1.

KEY CODE:
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';

export default function OnboardingWizardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentStep = parseInt(searchParams.get('s') || '1', 10);
  const [stepData, setStepData] = useState<Record<number, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(false);

  // Resume from saved progress
  useEffect(() => {
    fetch('/api/v1/users/onboarding', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data.step > 0 && currentStep === 1) {
          setSearchParams({ step: 'onboarding', s: String(res.data.step) });
        }
      })
      .catch(() => {});
  }, []);

  const submitStep = async (step: number, data: Record<string, unknown>) => {
    setLoading(true);
    try {
      await fetch('/api/v1/users/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ step, data }),
      });
      setStepData(prev => ({ ...prev, [step]: data }));
      if (step === 10) navigate('/journey-preparation');
      else setSearchParams({ step: 'onboarding', s: String(step + 1) });
    } finally { setLoading(false); }
  };

  const goBack = () => {
    if (currentStep > 1) setSearchParams({ step: 'onboarding', s: String(currentStep - 1) });
  };

  const skipStep = () => {
    setSearchParams({ step: 'onboarding', s: String(currentStep + 1) });
  };

  return (
    <div className="relative h-[100dvh] bg-black overflow-hidden flex flex-col">
      <Navigation />
      <div className="px-6 pt-20">
        <div className="h-1 bg-white/10 rounded-full max-w-md mx-auto">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(currentStep / 10) * 100}%` }} />
        </div>
        <p className="text-center text-white/30 text-[11px] mt-2 tracking-wider">STEP {currentStep} OF 10</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col justify-center px-4">
          <div className="text-white text-center">Step {currentStep} placeholder</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

---

### TASK 2.2.2: Add Wizard to SignupPage Router

**Files to READ first:** `src/pages/auth/SignupPage.tsx`, `src/features/onboarding/screens/OnboardingCreateAccountPage.tsx`
**Files to MODIFY:** `src/pages/auth/SignupPage.tsx`, `src/features/onboarding/screens/OnboardingCreateAccountPage.tsx`
**Depends on:** 2.2.1
**Test after:** `cd "d:/soul-yatri-website" && npx vite build`

#### CONTEXT FOR AI AGENT
```
1. READ src/pages/auth/SignupPage.tsx — it switches on searchParam "step":
   initial → OnboardingSignupPage, account → OnboardingCreateAccountPage, etc.

   ADD new case: 'onboarding' → OnboardingWizardPage
   Import: import OnboardingWizardPage from '@/features/onboarding/screens/OnboardingWizardPage';

2. READ src/features/onboarding/screens/OnboardingCreateAccountPage.tsx
   Find where it navigates after successful account creation.
   Change that navigation from 'astrology' to 'onboarding&s=1':
   navigate('/signup?step=onboarding&s=1')
```

---

### TASK 2.3.1: Create StepDOB (Step 1 — Optional)

**Files to CREATE:** `src/features/onboarding/components/steps/StepDOB.tsx`
**Test after:** `cd "d:/soul-yatri-website" && npx vite build`

#### CONTEXT FOR AI AGENT
```
PROJECT: d:\soul-yatri-website (React 19 + TypeScript + Tailwind)

PROPS INTERFACE (use for ALL step components):
interface StepProps {
  value: unknown;
  onChange: (value: unknown) => void;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
}

COMPONENT: Step 1 — Date of Birth (OPTIONAL)

LAYOUT:
<div className="text-center max-w-sm mx-auto">
  <h2 className="text-[28px] sm:text-[32px] font-semibold text-white">When were you born?</h2>
  <p className="text-[14px] text-white/50 mt-2">This helps us personalize your journey</p>
  <div className="mt-8 flex gap-3 justify-center">
    {/* Day select */}
    <select className="bg-white/5 border border-white/10 rounded-xl text-white px-3 py-3 text-[14px] appearance-none">
      <option value="">Day</option>
      {Array.from({length:31},(_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
    </select>
    {/* Month select */} (Jan-Dec)
    {/* Year select */} (2010 down to 1940)
  </div>
  <div className="mt-10 flex flex-col items-center gap-3">
    <button onClick={onNext} className="bg-white text-black rounded-full h-[52px] w-[200px] font-semibold text-[15px]">Continue</button>
    {onSkip && <button onClick={onSkip} className="text-white/30 text-sm">Skip for now</button>}
  </div>
</div>

When day+month+year selected, construct "YYYY-MM-DD" string and call onChange.
Continue always enabled (since optional). Export default StepDOB.
```

---

### TASK 2.3.2: Create StepGender (Step 2 — Required)

**Files to CREATE:** `src/features/onboarding/components/steps/StepGender.tsx`

#### CONTEXT FOR AI AGENT
```
Same StepProps interface. Step 2 — Gender (REQUIRED).

4 selectable cards in 2x2 grid (max-w-xs mx-auto grid grid-cols-2 gap-3):
- MALE → "Male" (icon: User from lucide-react)
- FEMALE → "Female" (icon: User)
- NON_BINARY → "Non-Binary" (icon: Users)
- PREFER_NOT_TO_SAY → "Prefer not to say" (icon: HelpCircle)

Each card: h-[90px] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
Unselected: bg-white/[0.02] border border-white/10 text-white/60
Selected: bg-white text-black border-white
Hover: border-white/20

Bottom: Back button (text-white/50 text-sm) + Continue (disabled until value selected).
Continue disabled state: opacity-40 cursor-not-allowed

value type: string | null. onChange called with 'MALE'|'FEMALE'|'NON_BINARY'|'PREFER_NOT_TO_SAY'.
```

---

### TASK 2.3.3: Create StepLocation (Step 3 — Required)

**Files to CREATE:** `src/features/onboarding/components/steps/StepLocation.tsx`

#### CONTEXT FOR AI AGENT
```
Step 3 — Location (city required).
value type: { city: string; state?: string; country?: string } | null

3 text inputs stacked (max-w-sm mx-auto space-y-3):
- City (required): <input type="text" placeholder="City" className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-[14px] placeholder:text-white/20 focus:border-white/30 focus:outline-none" />
- State (optional): same styling, placeholder "State"
- Country (optional): same styling, placeholder "Country", default value "India"

Continue enabled when city.length > 0.
Back + Continue buttons.
```

---

### TASK 2.3.4: Create StepStruggles (Step 4 — Required, multi-select)

**Files to CREATE:** `src/features/onboarding/components/steps/StepStruggles.tsx`

#### CONTEXT FOR AI AGENT
```
Step 4 — Struggles (at least 1 required). value type: string[]

Title: "What brings you here?" / Subtitle: "Select all that apply"

Grid of selectable chips (max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2):
OPTIONS = [
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'stress', label: 'Stress' },
  { value: 'grief', label: 'Grief' },
  { value: 'anger', label: 'Anger' },
  { value: 'self-esteem', label: 'Self-Esteem' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'addiction', label: 'Addiction' },
  { value: 'other', label: 'Other' },
]

Each chip: px-4 py-3 rounded-xl text-center text-[14px] cursor-pointer transition-all
Unselected: bg-white/[0.03] border border-white/10 text-white/60 hover:border-white/20
Selected: bg-white text-black border-white font-medium

Click toggles (add/remove from array).
Continue enabled when value.length >= 1.
Back + Continue buttons.
```

---

### TASK 2.3.5: Create StepTherapyHistory (Step 5 — Required)

**Files to CREATE:** `src/features/onboarding/components/steps/StepTherapyHistory.tsx`

#### CONTEXT FOR AI AGENT
```
Step 5 — Therapy History (single select, required). value type: string | null

4 vertical cards (max-w-sm mx-auto space-y-3):
OPTIONS = [
  { value: 'NEVER', label: 'Never tried therapy', icon: 'Sparkles' },
  { value: 'CURRENTLY', label: 'Currently in therapy', icon: 'HeartPulse' },
  { value: 'PAST', label: 'Had therapy in the past', icon: 'Clock' },
  { value: 'CONSIDERING', label: 'Considering for the first time', icon: 'Lightbulb' },
]

Each card: px-4 py-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all
Unselected: bg-white/[0.02] border border-white/10 text-white/60
Selected: bg-white text-black border-white
Icon on left (24x24), label text-[15px].
Continue enabled when value selected. Back + Continue.
```

---

### TASK 2.4.1: Create StepGoals (Step 6 — Required, multi-select)

**Files to CREATE:** `src/features/onboarding/components/steps/StepGoals.tsx`

#### CONTEXT FOR AI AGENT
```
EXACT same pattern as StepStruggles (task 2.3.4) but with different options:
Title: "What do you hope to achieve?"

OPTIONS = [
  { value: 'reduce-anxiety', label: 'Reduce Anxiety' },
  { value: 'better-sleep', label: 'Better Sleep' },
  { value: 'relationships', label: 'Improve Relationships' },
  { value: 'self-discovery', label: 'Self-Discovery' },
  { value: 'career', label: 'Career Growth' },
  { value: 'spiritual-growth', label: 'Spiritual Growth' },
  { value: 'trauma-healing', label: 'Trauma Healing' },
  { value: 'confidence', label: 'Build Confidence' },
]

Same styling, same multi-select behavior. At least 1 required.
```

---

### TASK 2.4.2: Create StepTherapistPrefs (Step 7 — Optional)

**Files to CREATE:** `src/features/onboarding/components/steps/StepTherapistPrefs.tsx`

#### CONTEXT FOR AI AGENT
```
Step 7 — Therapist Preferences (OPTIONAL, has Skip button).
value type: { therapistGenderPref?: string; therapistLanguages?: string[]; therapistApproach?: string } | null

3 sections stacked:

Section 1: "Preferred gender" — 3 horizontal cards:
  'male' → Male, 'female' → Female, 'no-preference' → No Preference

Section 2: "Languages" — multi-select chips:
  english, hindi, marathi, tamil, telugu, bengali, kannada, malayalam, gujarati

Section 3: "Preferred approach" — 3 cards:
  'CBT' → Talk Therapy (CBT), 'HOLISTIC' → Holistic / Indian Wisdom, 'MIXED' → Mixed Approach

Has Skip + Back + Continue buttons. All sections optional.
```

---

### TASK 2.4.3: Create StepInterests (Step 8 — Optional)

**Files to CREATE:** `src/features/onboarding/components/steps/StepInterests.tsx`

#### CONTEXT FOR AI AGENT
```
Same as StepStruggles pattern (multi-select chips) but OPTIONAL (has Skip button).
Title: "What interests you?" / Subtitle: "We'll personalize your dashboard"

OPTIONS = [
  { value: 'meditation', label: 'Meditation' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'journaling', label: 'Journaling' },
  { value: 'breathing', label: 'Breathing Exercises' },
  { value: 'astrology', label: 'Astrology' },
  { value: 'community', label: 'Community Support' },
]

Skip + Back + Continue. At least 1 required IF not skipping.
```

---

### TASK 2.4.4: Create StepEmergencyContact (Step 9 — Required)

**Files to CREATE:** `src/features/onboarding/components/steps/StepEmergencyContact.tsx`

#### CONTEXT FOR AI AGENT
```
Step 9 — Emergency Contact (all 3 fields required).
value type: { emergencyName: string; emergencyPhone: string; emergencyRelation: string } | null

Title: "Emergency Contact"
Subtitle: "Someone we can reach in case of crisis. Strictly confidential."

3 inputs stacked (max-w-sm mx-auto space-y-3):
- Name: text input, placeholder "Contact Name"
- Phone: tel input, placeholder "Phone Number (10 digits)"
- Relationship: <select> with options: Parent, Spouse, Sibling, Friend, Other

Same input styling as StepLocation.
Small muted note at bottom: "Only used in genuine emergencies" (text-[11px] text-white/20)
Continue enabled when all 3 filled (name.length > 0, phone.length >= 10, relation selected).
Back + Continue.
```

---

### TASK 2.4.5: Create StepConfirmation (Step 10)

**Files to CREATE:** `src/features/onboarding/components/steps/StepConfirmation.tsx`

#### CONTEXT FOR AI AGENT
```
Step 10 — Confirmation (no data to collect).

Layout:
- Animated checkmark: framer-motion circle that scales from 0 to 1 with a spring
  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
    <CheckCircle className="w-16 h-16 text-green-400" />
  </motion.div>
- Title: "You're all set!" (text-[32px] font-semibold text-white mt-6)
- Subtitle: "Your personalized healing journey is ready" (text-[14px] text-white/50 mt-2)
- Button: "Enter Dashboard" (bg-white text-black rounded-full h-[56px] w-[240px] font-semibold mt-10)
- On click: call onNext() which will POST step 10 and navigate to /journey-preparation

No Back button on this step. Import CheckCircle from lucide-react.
```

---

### TASK 2.5.1: Wire All Steps into OnboardingWizardPage

**Files to READ first:** `src/features/onboarding/screens/OnboardingWizardPage.tsx`, ALL step files in `src/features/onboarding/components/steps/`
**Files to MODIFY:** `src/features/onboarding/screens/OnboardingWizardPage.tsx`
**Depends on:** 2.3.1-2.3.5, 2.4.1-2.4.5
**Test after:** `cd "d:/soul-yatri-website" && npx vite build`

#### CONTEXT FOR AI AGENT
```
Replace the placeholder text in OnboardingWizardPage.tsx with actual step components.

Import all 10 step components:
import StepDOB from '../components/steps/StepDOB';
import StepGender from '../components/steps/StepGender';
import StepLocation from '../components/steps/StepLocation';
import StepStruggles from '../components/steps/StepStruggles';
import StepTherapyHistory from '../components/steps/StepTherapyHistory';
import StepGoals from '../components/steps/StepGoals';
import StepTherapistPrefs from '../components/steps/StepTherapistPrefs';
import StepInterests from '../components/steps/StepInterests';
import StepEmergencyContact from '../components/steps/StepEmergencyContact';
import StepConfirmation from '../components/steps/StepConfirmation';

In renderStep(step), return the matching component with props:
value={stepData[step]}, onChange={(val) => setStepData(prev => ({...prev, [step]: val}))},
onNext={() => submitStep(step, stepData[step] || {})},
onBack={step > 1 ? goBack : undefined},
onSkip={[1,7,8].includes(step) ? skipStep : undefined}

Step 10 gets onNext={() => submitStep(10, {})} only.
```

---

## PHASE 3: USER DASHBOARD

**What it is:** Real personalized dashboard replacing the shell page.
**Frontend URL:** `/dashboard`
**Backend API:** `GET /api/v1/users/dashboard` (already implemented in task 2.1.2 getDashboard)

---

### TASK 3.1.1: Create WelcomeBanner Component

**Files to CREATE:** `src/features/dashboard/components/WelcomeBanner.tsx`
**Test after:** `cd "d:/soul-yatri-website" && npx vite build`

#### CONTEXT FOR AI AGENT
```
Props: { userName: string; avatarUrl?: string | null }

Greeting based on time of day:
const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

LAYOUT:
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-[24px] sm:text-[28px] font-semibold text-white">{greeting}, {userName.split(' ')[0]}</h1>
    <p className="text-[13px] text-white/40 mt-1">{randomQuote}</p>
  </div>
  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-[14px] font-semibold">
    {avatarUrl ? <img src={avatarUrl} className="w-full h-full rounded-full object-cover" /> : userName[0].toUpperCase()}
  </div>
</div>

randomQuote: Pick from array of 10 motivational quotes.
```

---

### TASK 3.1.2: Create StatsCards Component

**Files to CREATE:** `src/features/dashboard/components/StatsCards.tsx`

#### CONTEXT FOR AI AGENT
```
Props: { stats: { sessionsCompleted: number; moodEntries: number; journalEntries: number; meditationSessions: number; daysActive: number } }

LAYOUT: grid grid-cols-2 lg:grid-cols-4 gap-3

4 cards, each:
<div className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
  <div className="flex items-center gap-2 text-white/40">
    <Icon className="w-4 h-4" />
    <span className="text-[11px] tracking-wider uppercase">{label}</span>
  </div>
  <div className="text-[24px] font-semibold text-white mt-2">{value}</div>
</div>

Cards:
1. icon=Calendar, label="Sessions", value=stats.sessionsCompleted
2. icon=SmilePlus, label="Mood Logs", value=stats.moodEntries
3. icon=BookOpen, label="Journal", value=stats.journalEntries
4. icon=Activity, label="Days Active", value=stats.daysActive

Import icons from lucide-react.
```

---

### TASK 3.1.3: Create QuickActions Component

**Files to CREATE:** `src/features/dashboard/components/QuickActions.tsx`

#### CONTEXT FOR AI AGENT
```
Props: { actions: { id: string; label: string; icon: string; route: string }[] }

LAYOUT: grid grid-cols-2 sm:grid-cols-4 gap-3

Each action:
<Link to={action.route} className="bg-white/[0.02] border border-white/8 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/[0.05] hover:border-white/15 transition-all group">
  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
    <IconComponent className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
  </div>
  <span className="text-[13px] text-white/60 group-hover:text-white transition-colors">{action.label}</span>
</Link>

Map icon string to lucide-react component:
'calendar' → Calendar, 'smile' → SmilePlus, 'brain' → Brain, 'book-open' → BookOpen

Import { Link } from 'react-router-dom'.
```

---

### TASK 3.1.4: Create UpcomingSession Component

**Files to CREATE:** `src/features/dashboard/components/UpcomingSession.tsx`

#### CONTEXT FOR AI AGENT
```
Props: { session: { id: string; therapistName: string; therapistPhoto?: string; scheduledAt: string; duration: number } | null }

If null (no upcoming session):
<div className="bg-white/[0.02] border border-white/8 rounded-xl p-6 text-center">
  <Calendar className="w-8 h-8 text-white/20 mx-auto" />
  <p className="text-white/40 text-[14px] mt-3">No upcoming sessions</p>
  <Link to="/therapy/find" className="inline-block mt-4 text-[13px] text-white/60 border border-white/10 rounded-full px-5 py-2 hover:bg-white/5">Book a session</Link>
</div>

If has session:
<div className="bg-white/[0.02] border border-white/8 rounded-xl p-4 flex items-center gap-4">
  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
    {therapistPhoto ? <img .../> : therapistName[0]}
  </div>
  <div className="flex-1">
    <p className="text-white text-[15px] font-medium">{session.therapistName}</p>
    <p className="text-white/40 text-[13px]">{formatted date + time} · {session.duration}min</p>
  </div>
  <Link to={`/session/${session.id}`} className="bg-white text-black rounded-full px-4 py-2 text-[13px] font-medium">Join</Link>
</div>
```

---

### TASK 3.1.5: Assemble DashboardPage

**Files to READ first:** `src/pages/DashboardPage.tsx` (current shell)
**Files to MODIFY:** `src/pages/DashboardPage.tsx`
**Depends on:** 3.1.1, 3.1.2, 3.1.3, 3.1.4
**Test after:** `cd "d:/soul-yatri-website" && npx vite build`

#### CONTEXT FOR AI AGENT
```
REPLACE the shell DashboardPage with a real dashboard.

READ src/pages/DashboardPage.tsx first.

REWRITE it:

import { useState, useEffect } from 'react';
import WelcomeBanner from '@/features/dashboard/components/WelcomeBanner';
import StatsCards from '@/features/dashboard/components/StatsCards';
import QuickActions from '@/features/dashboard/components/QuickActions';
import UpcomingSession from '@/features/dashboard/components/UpcomingSession';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/users/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)}</div>;
  if (!data) return <div className="p-6 text-white/40">Failed to load dashboard</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <WelcomeBanner userName={data.user.name} avatarUrl={data.user.avatarUrl} />
      <StatsCards stats={data.stats} />
      <QuickActions actions={data.quickActions} />
      <UpcomingSession session={data.upcomingSession} />
    </div>
  );
}
```

---

## PHASE 16: HEALTH TOOLS

**What it is:** Mood tracker, meditation timer, breathing exercise, journal.
**Frontend URLs:** `/health-tools/mood`, `/health-tools/meditation`, `/health-tools/breathing`, `/health-tools/journal`
**Backend API:** `POST/GET /api/v1/health-tools/mood`, `POST/GET /api/v1/health-tools/journal`, etc.
**Existing stubs:** All 9 endpoints in `server/src/routes/health-tools.ts` return 501.

---

### TASK 16.1.1: Create Health Tools Validators

**Files to CREATE:** `server/src/validators/health-tools.validator.ts`
**Test after:** `cd "d:/soul-yatri-website/server" && ./node_modules/.bin/tsc --noEmit`

#### CONTEXT FOR AI AGENT
```
Same pattern as users.validator.ts.

Schemas:
export const createMoodSchema = z.object({
  score: z.number().int().min(1).max(10),
  note: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export const createJournalSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(10000),
  mood: z.number().int().min(1).max(10).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export const updateJournalSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  mood: z.number().int().min(1).max(10).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export const logMeditationSchema = z.object({
  duration: z.number().int().min(1),
  type: z.enum(['guided', 'unguided', 'breathing', 'body-scan', 'loving-kindness']),
  trackName: z.string().optional(),
  completed: z.boolean().default(true),
});

Re-export requestBodyValidator.
```

---

### TASK 16.1.2: Create Health Tools Controller

**Files to CREATE:** `server/src/controllers/health-tools.controller.ts`
**Depends on:** 16.1.1
**Test after:** `cd "d:/soul-yatri-website/server" && ./node_modules/.bin/tsc --noEmit`

#### CONTEXT FOR AI AGENT
```
Same import pattern as users.controller.ts.
Also import: parsePagination, buildPaginationMeta from '../lib/response.js'

Handlers:
1. createMoodEntry — POST /mood: prisma.moodEntry.create, sendSuccess(res, entry, 201)
2. getMoodEntries — GET /mood?days=30: prisma.moodEntry.findMany where createdAt >= daysAgo, calc average score, return { entries, average }
3. createJournalEntry — POST /journal: prisma.journalEntry.create, sendSuccess 201
4. getJournalEntries — GET /journal?page=1&limit=10: paginated with parsePagination, prisma.journalEntry.count + findMany, buildPaginationMeta
5. updateJournalEntry — PUT /journal/:id: verify owner (where: { id, userId }), prisma.journalEntry.update
6. logMeditationSession — POST /meditation: prisma.meditationLog.create, sendSuccess 201
7. getMeditationLogs — GET /meditation?days=30: findMany, calc totalMinutes (sum duration/60), sessionsThisWeek
8. logBreathingSession — POST /breathing: same as meditation but force type="breathing"
9. getBreathingLogs — GET /breathing?days=30: same as meditation but filter type="breathing"

Export all handlers.
```

---

### TASK 16.1.3: Wire Health Tools Routes

**Files to READ first:** `server/src/routes/health-tools.ts`
**Files to MODIFY:** `server/src/routes/health-tools.ts`
**Depends on:** 16.1.1, 16.1.2

#### CONTEXT FOR AI AGENT
```
Replace all stubs. Import requireAuth, requestBodyValidator, all schemas, all controller handlers.

router.post('/mood', requireAuth, requestBodyValidator(createMoodSchema), createMoodEntry);
router.get('/mood', requireAuth, getMoodEntries);
router.post('/journal', requireAuth, requestBodyValidator(createJournalSchema), createJournalEntry);
router.get('/journal', requireAuth, getJournalEntries);
router.put('/journal/:id', requireAuth, requestBodyValidator(updateJournalSchema), updateJournalEntry);
router.post('/meditation', requireAuth, requestBodyValidator(logMeditationSchema), logMeditationSession);
router.get('/meditation', requireAuth, getMeditationLogs);
router.post('/breathing', requireAuth, requestBodyValidator(logMeditationSchema), logBreathingSession);
router.get('/breathing', requireAuth, getBreathingLogs);
```

---

### TASK 16.2.1: Add Health Tools Routes to Frontend Router

**Files to MODIFY:** `src/router/index.tsx`
**Test after:** `npx vite build`

#### CONTEXT FOR AI AGENT
```
READ src/router/index.tsx. Add these routes inside the protected/dashboard layout section:

{ path: 'health-tools/mood', element: <MoodTrackerPage /> }
{ path: 'health-tools/meditation', element: <MeditationPage /> }
{ path: 'health-tools/breathing', element: <BreathingPage /> }
{ path: 'health-tools/journal', element: <JournalPage /> }

Import the page components (create stub exports if they don't exist yet).
For now, create minimal stub pages that just render the page title.
```

---

### TASK 16.2.2: Create MoodTrackerPage

**Files to CREATE:** `src/features/health-tools/screens/MoodTrackerPage.tsx`
**Test after:** `npx vite build`

#### CONTEXT FOR AI AGENT
```
Full mood tracker page. Layout in dark theme.

Sections:
1. Title: "How are you feeling?" + today's date
2. Mood selector: 5 large circles in a row (1=Awful, 3=Meh, 5=Okay, 7=Good, 10=Amazing)
   - Each: w-14 h-14 rounded-full, selected scales up to w-16 h-16 with bg-white text-black
3. Optional note: <textarea className="w-full bg-white/5 border border-white/10 rounded-xl text-white p-3 text-[14px] min-h-[80px] resize-none" placeholder="Add a note (optional)" />
4. Tag chips (multi-select): Anxious, Calm, Happy, Sad, Stressed, Energetic, Tired
5. "Log Mood" button → POST /api/v1/health-tools/mood
6. Below: recharts AreaChart of last 7 days mood (GET /api/v1/health-tools/mood?days=7)
7. Below chart: list of recent entries

Use recharts: import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
Empty state for chart: "Start tracking to see your mood trends"
```

---

### TASK 16.3.1: Create MeditationPage

**Files to CREATE:** `src/features/health-tools/screens/MeditationPage.tsx`

#### CONTEXT FOR AI AGENT
```
Two-phase page: Selection → Timer

SELECTION PHASE:
- Title: "Choose your meditation"
- Duration cards (grid-cols-4 gap-3): 5, 10, 15, 20 minutes
  Each: rounded-xl border border-white/10 text-center py-4, selected bg-white text-black
- Type cards (grid-cols-1 gap-2):
  "Unguided" — just timer
  "Body Scan" — guided
  "Loving Kindness" — guided
- "Start" button

TIMER PHASE:
- Large SVG circular progress: <svg viewBox="0 0 120 120"> with <circle> for track and <circle> for progress
  - Progress circle: stroke-dasharray/dashoffset based on remaining/total
- Time in center: MM:SS (text-[40px] font-mono text-white)
- Pause/Resume button + Stop button
- Uses setInterval for countdown
- On complete: POST /api/v1/health-tools/meditation → show "Well done!" → Done button back

COMPLETION PHASE:
- "Well done!" + duration logged
- "Done" button
```

---

### TASK 16.4.1: Create BreathingPage

**Files to CREATE:** `src/features/health-tools/screens/BreathingPage.tsx`

#### CONTEXT FOR AI AGENT
```
Box breathing: Inhale 4s → Hold 4s → Exhale 4s → Hold 4s

SELECTION:
- Duration options: 3 min, 5 min, 10 min (cards)
- "Begin" button

EXERCISE:
- Large circle in center that scales with framer-motion:
  Inhale: scale 0.6 → 1.0 over 4s
  Hold: stay at 1.0 for 4s
  Exhale: scale 1.0 → 0.6 over 4s
  Hold: stay at 0.6 for 4s
- Text instruction: "Breathe In" / "Hold" / "Breathe Out" / "Hold"
  (text-[20px] text-white/70 mt-6)
- Cycle counter: "Cycle 3 of 10"
- The circle: <motion.div animate={{ scale }} transition={{ duration: 4, ease: 'easeInOut' }} className="w-40 h-40 rounded-full border-2 border-white/20 bg-white/5" />

COMPLETION:
- Log session: POST /api/v1/health-tools/breathing
- "Well done!" screen
```

---

### TASK 16.5.1: Create JournalPage

**Files to CREATE:** `src/features/health-tools/screens/JournalPage.tsx`

#### CONTEXT FOR AI AGENT
```
Two views: List and Write.

LIST VIEW (default):
- Title: "My Journal" + "New Entry" button (Plus icon)
- Fetch: GET /api/v1/health-tools/journal?page=1&limit=20
- Each entry card: date, title (or first 50 chars), mood badge if present
- Empty state: "Start writing. Your thoughts are private."

WRITE VIEW (new or edit):
- Title input: <input type="text" placeholder="Title (optional)" className="w-full bg-transparent text-white text-[20px] font-medium border-none outline-none placeholder:text-white/20" />
- Content: <textarea className="w-full bg-transparent text-white text-[15px] border-none outline-none min-h-[200px] resize-none leading-relaxed placeholder:text-white/20" placeholder="Write your thoughts..." />
- Save button → POST or PUT
- Back button → return to list

Toggle between views with state. Use useState<'list' | 'write'>('list').
```

---

## PHASE 4: THERAPY BOOKING

**What it is:** Browse therapists, view profiles, book sessions.
**Frontend URLs:** `/therapy/find`, `/therapy/therapist/:id`, `/therapy/sessions`
**Existing stubs (server/src/routes/therapy.ts):** 18 endpoints, all 501.

---

### TASK 4.1.1: Create Therapy Validators

**Files to CREATE:** `server/src/validators/therapy.validator.ts`

#### CONTEXT FOR AI AGENT
```
export const requestSessionSchema = z.object({
  therapistId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

export const cancelSessionSchema = z.object({
  reason: z.string().max(500).optional(),
});
```

---

### TASK 4.1.2: Create Therapy Controller

**Files to CREATE:** `server/src/controllers/therapy.controller.ts`

#### CONTEXT FOR AI AGENT
```
Handlers:
1. getTherapists — GET /therapists?specialization=anxiety&language=english&page=1&limit=10
   - prisma.therapistProfile.findMany with filters (isVerified: true, isAvailable: true)
   - Include user.name, user.avatarUrl
   - Paginated
   - Sort by rating desc

2. getTherapistById — GET /therapists/:id
   - Full profile + include availabilities + user.name
   - Calculate available slots for next 14 days:
     For each day, get TherapistAvailability for that dayOfWeek,
     generate time slots (startTime to endTime, slotDuration increments),
     exclude slots that overlap with existing Sessions (status != CANCELLED)

3. requestSession — POST /request
   - Validate therapistId exists and is available
   - Validate scheduledAt is in the future (>24hrs)
   - Validate no conflicting session at that time
   - Create Session with status SCHEDULED
   - sendSuccess(res, session, 201)

4. getUserSessions — GET /sessions?status=SCHEDULED&page=1&limit=10
   - prisma.session.findMany where userId, paginated
   - Include therapist.user.name

5. cancelSession — PUT /sessions/:id/cancel
   - Verify session belongs to user
   - Verify status is SCHEDULED and scheduledAt > 24hrs from now
   - Update status to CANCELLED
```

---

### TASK 4.1.3: Wire Therapy Routes

**Files to MODIFY:** `server/src/routes/therapy.ts`
**Depends on:** 4.1.1, 4.1.2

#### CONTEXT FOR AI AGENT
```
Replace these stubs with real handlers:
- GET /therapists → getTherapists
- GET /therapists/:id → getTherapistById
- POST /request → requireAuth, requestBodyValidator(requestSessionSchema), requestSession
- GET /sessions → requireAuth, getUserSessions
- PUT /sessions/:id/cancel → requireAuth, requestBodyValidator(cancelSessionSchema), cancelSession

Keep other stubs (therapist dashboard endpoints) as 501 — those are for Phase 8.
```

---

### TASK 4.2.1: Add Therapy Routes to Frontend Router

**Files to MODIFY:** `src/router/index.tsx`

#### CONTEXT FOR AI AGENT
```
Add routes:
{ path: 'therapy/find', element: <TherapistListingPage /> }
{ path: 'therapy/therapist/:id', element: <TherapistProfilePage /> }
{ path: 'therapy/sessions', element: <SessionsListPage /> }

Create stub page components initially.
```

---

### TASK 4.2.2: Create TherapistListingPage

**Files to CREATE:** `src/features/therapy/screens/TherapistListingPage.tsx`

#### CONTEXT FOR AI AGENT
```
- Title: "Find Your Therapist"
- Filter bar: Specialization multi-select, Language multi-select, Approach select
- Therapist cards grid (1 col mobile, 2 col desktop)
  Each card: photo circle + name + specializations chips + rating stars + price + "View Profile" link
- Fetch: GET /api/v1/therapy/therapists?page=1&limit=10
- Loading state: skeleton cards
- Pagination at bottom
```

---

### TASK 4.2.3: Create TherapistProfilePage

**Files to CREATE:** `src/features/therapy/screens/TherapistProfilePage.tsx`

#### CONTEXT FOR AI AGENT
```
- Top: Photo, Name, Rating, Reviews, Price
- Bio, Specializations, Languages badges
- Available Slots section:
  - Date picker: next 14 days as horizontal scrollable date chips
  - Time slots grid for selected date
  - Available: white border, clickable. Booked: grayed out.
- "Book Session" button at bottom
- On book: POST /api/v1/therapy/request → success modal
```

---

### TASK 4.2.4: Create SessionsListPage

**Files to CREATE:** `src/features/therapy/screens/SessionsListPage.tsx`

#### CONTEXT FOR AI AGENT
```
- Tabs: "Upcoming" | "Past"
- Fetch: GET /api/v1/therapy/sessions
- Session cards: therapist name, date/time, status badge, duration
- Upcoming: "Cancel" button
- Past: rating display
- Empty states
```

---

## PHASE 13: PAYMENTS (Razorpay)

### TASK 13.1.1: Install Razorpay SDK
```
cd "d:/soul-yatri-website/server" && npm install razorpay
```

### TASK 13.1.2: Create Payment Controller
**Files to CREATE:** `server/src/controllers/payments.controller.ts`
- createOrder: Create Razorpay order using config.payment.keyId/keySecret
- verifyPayment: Verify Razorpay signature using crypto.createHmac
- handleWebhook: Razorpay webhook verification + update Payment record
- getPaymentHistory: User's past payments, paginated

### TASK 13.1.3: Wire Payment Routes
Replace stubs in `server/src/routes/payments.ts`

### TASK 13.2.1: Create PaymentModal Frontend Component
Integrate Razorpay checkout.js in therapy booking flow.

---

## PHASE 5: VIDEO CALLING (Daily.co)

### TASK 5.1.1: Create Video Controller
- createRoom: POST to Daily.co API to create room
- getToken: Generate meeting token for user

### TASK 5.1.2: Wire Video Routes (new route file or add to therapy routes)

### TASK 5.2.1: Create VideoCallPage
- Daily.co iframe or @daily-co/daily-js SDK
- Shows when user clicks "Join" on upcoming session

---

## PHASE 17: NOTIFICATIONS

### TASK 17.1.1: Create Notifications Controller
- getNotifications: GET, paginated, filter by isRead
- markAsRead: PUT /:id/read → update isRead = true, readAt = now
- markAllRead: PUT /read-all

### TASK 17.1.2: Wire Notification Routes
Replace stubs in `server/src/routes/notifications.ts`

### TASK 17.2.1: Create NotificationBell Component
Add to Navigation: bell icon with unread count badge.
Dropdown shows recent notifications.

### TASK 17.2.2: Create NotificationsPage
Full page list with all notifications, mark as read on click.

---

## RULES FOR ALL AI AGENTS

1. **READ before WRITE** — Always read existing files before modifying
2. **Follow existing patterns** — Use asyncHandler, sendSuccess, AppError from lib/
3. **ES modules** — Server imports use `.js` extension always
4. **Dark theme** — bg-black, text-white, border-white/10, NO light mode
5. **Mobile-first** — All UIs work on 375px width
6. **100dvh** — Onboarding steps don't scroll
7. **API format** — `{ success: true/false, data/error, timestamp, requestId }`
8. **TypeScript strict** — No `any` (except useState generic), no `@ts-ignore`
9. **Test** — Run `npx tsc --noEmit` (server) or `npx vite build` (frontend) after EVERY task
10. **Commit** — One commit per completed task: `git add -A && git commit -m "type(scope): description"`
11. **Don't skip tasks** — Execute in exact numbered order
12. **Don't add extras** — Only build what's specified, nothing more
