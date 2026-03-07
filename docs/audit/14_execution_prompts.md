# Soul Yatri — AI Agent Execution Prompt Pack

**Audit Date:** 2026-03-06  
**Purpose:** Ready-to-use prompts for AI coding agents to implement every world-class recommendation  
**Usage:** Copy-paste each prompt into GitHub Copilot Agent, Claude, or GPT-4o to execute the specific task  
**Repo:** `dhruvpaleja/soul-yatri-website`

---

## HOW TO USE THESE PROMPTS

Each prompt is self-contained. It includes:
- The exact task
- All required file paths (use absolute paths in the repo)
- Acceptance criteria
- Key facts about the codebase needed to execute

Paste the prompt to your AI coding agent and it will implement the change.

---

## PROMPT-S-001: Fix Auth Bypass (CRITICAL SECURITY — do this first)

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Fix the critical auth bypass security vulnerability.

PROBLEM:
- File src/lib/runtime.flags.ts (or similar) sets VITE_AUTH_BYPASS to true by default
- ProtectedRoute in src/router/index.tsx returns <Outlet/> unconditionally when this flag is true
- This means ALL protected routes are publicly accessible in any environment where the env var isn't set to false

STEPS:
1. Read src/router/index.tsx to find the ProtectedRoute component
2. Read src/lib/runtime.flags.ts (or wherever VITE_AUTH_BYPASS is read) to see the default
3. Change the default to false: const authBypass = import.meta.env.VITE_AUTH_BYPASS === 'true' (not default true)
4. In .env.local, ensure VITE_AUTH_BYPASS=true is present but clearly commented as dev-only
5. Add a console.warn in ProtectedRoute if bypass is active: console.warn('[DEV ONLY] Auth bypass active - NEVER use in production')
6. Verify the frontend TypeScript build still passes

ACCEPTANCE CRITERIA:
- ProtectedRoute blocks unauthenticated users by default
- Bypass only works when VITE_AUTH_BYPASS=true explicitly in env
- No TypeScript errors
```

---

## PROMPT-S-002: Disable Dev Routes in Production (CRITICAL SECURITY)

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Fix the dev routes production exposure vulnerability.

PROBLEM:
- server/src/config/index.ts has enableDevRoutes: isDevelopment || isProduction which is ALWAYS true
- This exposes GET /dev-helper/dev-create-user/:email/:password/:name in production
- This endpoint creates real database users via URL parameters with no authentication

STEPS:
1. Read server/src/config/index.ts
2. Find the enableDevRoutes field
3. Change it to: enableDevRoutes: process.env.NODE_ENV === 'development'
4. Read server/src/routes/dev-helper.ts (or wherever dev routes are defined)
5. Add an early return if not in development: if (!config.enableDevRoutes) return res.status(404).json({ error: 'Not found' })
6. Run server TypeScript check: cd server && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- enableDevRoutes is false in any environment where NODE_ENV !== 'development'
- Dev route endpoints return 404 in non-development environments
- TypeScript compiles without errors
```

---

## PROMPT-S-003: Add Auth to Admin Router (CRITICAL SECURITY)

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Add authentication and authorization middleware to the admin router.

PROBLEM:
- server/src/routes/admin.ts mounts ~80 routes with NO auth middleware
- Any anonymous HTTP request can reach admin endpoints

CODEBASE FACTS:
- Auth middleware is in server/src/middleware/auth.middleware.ts
- The requireAuth function validates the JWT access token
- The requireRole function checks the user's role
- User roles are: USER, THERAPIST, ASTROLOGER, ADMIN, SUPER_ADMIN (defined in Prisma schema)

STEPS:
1. Read server/src/routes/admin.ts
2. Read server/src/middleware/auth.middleware.ts to understand requireAuth and requireRole signatures
3. At the TOP of admin.ts, before any route definitions, add:
   router.use(requireAuth);
   router.use(requireRole('ADMIN'));
4. For any super-admin-only routes (user deletion, system config), add requireRole('SUPER_ADMIN') at the route level
5. Run server TypeScript check: cd server && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- All admin routes return 401 without a valid JWT token
- All admin routes return 403 for non-ADMIN roles
- TypeScript compiles without errors
```

---

## PROMPT-S-004: Remove .env.local from Git

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Remove committed environment file from git tracking.

PROBLEM:
- .env.local is committed to the repository
- It contains JWT_SECRET and potentially other credentials
- Anyone with repo access can read these secrets

STEPS:
1. Read .gitignore to see current ignored patterns
2. Add these lines to .gitignore if not present:
   .env.local
   .env.*.local
   .env.production
   server/.env
   server/.env.local
3. Run: git rm --cached .env.local (this removes from git tracking but keeps local file)
4. If docker-compose.yml contains hardcoded credentials (kimi/kimi), replace with environment variable references
5. Create .env.example at root with placeholder values for all required env vars (no real values)
6. Update README.md or DEPLOYMENT.md with "copy .env.example to .env.local and fill in values"

ACCEPTANCE CRITERIA:
- .env.local is in .gitignore
- .env.local is removed from git tracking (git ls-files .env.local returns empty)
- .env.example exists with all required vars and placeholder values
- docker-compose.yml uses ${VAR} syntax not hardcoded values
```

---

## PROMPT-B-001: Implement Therapy Booking API

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Implement the therapy booking backend API (currently all routes return 501).

CODEBASE FACTS:
- Server uses Express + TypeScript + Prisma + PostgreSQL
- API prefix is /api/v1 (set in server/src/config/index.ts)
- Auth middleware: requireAuth in server/src/middleware/auth.middleware.ts
- Validation: Zod schemas, see server/src/controllers/auth.controller.ts for examples
- Prisma schema at server/prisma/schema.prisma - TherapistProfile and Session models exist
- TherapistAvailability model exists in schema but has NO controller code
- Existing working example to follow: server/src/controllers/health-tools.controller.ts

ENDPOINTS TO IMPLEMENT:

1. GET /api/v1/therapy/therapists
   - No auth required (browsing)
   - Query params: specialty, language, gender, minPrice, maxPrice, page, limit
   - Returns: paginated list of TherapistProfile with User.name and User.avatarUrl

2. GET /api/v1/therapy/therapists/:id
   - No auth required
   - Returns: full TherapistProfile + availability slots for next 7 days

3. GET /api/v1/therapy/availability/:therapistId
   - Query params: date (YYYY-MM-DD)
   - Returns: available time slots for that date

4. POST /api/v1/therapy/availability (requireAuth + requireRole('THERAPIST'))
   - Body: { date, startTime, endTime, slotDurationMinutes }
   - Creates TherapistAvailability slots

5. POST /api/v1/therapy/sessions/book (requireAuth)
   - Body: { therapistId, availabilitySlotId, sessionType, notes }
   - Creates Session record, marks slot as booked
   - Creates Notification for both user and therapist

6. GET /api/v1/therapy/sessions (requireAuth)
   - Query params: status (upcoming/past/all), page, limit
   - Returns user's sessions

7. PATCH /api/v1/therapy/sessions/:id/cancel (requireAuth)
   - Cancels session, restores availability slot
   - Returns 400 if less than 24h before session

STEPS:
1. Read server/prisma/schema.prisma to understand the full model structure
2. Read server/src/controllers/health-tools.controller.ts as the implementation pattern to follow
3. Create server/src/controllers/therapy.controller.ts with all 7 endpoint handlers
4. Create server/src/validators/therapy.validator.ts with Zod schemas for each request body
5. Update server/src/routes/therapy.ts to wire routes to controller (replacing 501 stubs)
6. Run: cd server && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- All 7 endpoints implemented (no 501 responses)
- Zod validation on all request bodies
- requireAuth on user-specific endpoints
- TypeScript compiles without errors
- GET /api/v1/therapy/therapists returns empty array (not 501) when no therapists in DB
```

---

## PROMPT-B-002: Wire Razorpay Payments

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Implement Razorpay payment integration (currently all payment routes return 501).

CODEBASE FACTS:
- Server: Express + TypeScript + Prisma
- Payment model exists in server/prisma/schema.prisma
- server/.env.example likely has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET as placeholders
- Razorpay SDK: install with npm install razorpay in server/
- For signature verification: use crypto.createHmac('sha256', secret).update(body).digest('hex')

ENDPOINTS TO IMPLEMENT:

1. POST /api/v1/payments/create-order (requireAuth)
   - Body: { amount, currency: 'INR', purpose: 'therapy_session' | 'astrology_reading' | 'membership', referenceId }
   - Creates Razorpay order via SDK
   - Stores pending Payment record in DB
   - Returns: { orderId, amount, currency, key }

2. POST /api/v1/payments/verify (requireAuth)  
   - Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   - Verifies HMAC signature
   - Updates Payment status to COMPLETED
   - Triggers downstream action based on purpose (e.g. confirm session booking)
   - Returns: { success: true, paymentId }

3. POST /api/v1/payments/webhook (no auth - verify by Razorpay signature header)
   - Handles: payment.captured, payment.failed, refund.created
   - Updates Payment records accordingly

4. GET /api/v1/payments/history (requireAuth)
   - Returns user's payment history paginated

STEPS:
1. cd server && npm install razorpay @types/razorpay
2. Read server/prisma/schema.prisma for the Payment model structure
3. Create server/src/services/razorpay.service.ts wrapping the Razorpay SDK
4. Create server/src/controllers/payments.controller.ts
5. Update server/src/routes/payments.ts to wire routes
6. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env.example with placeholder values
7. Run: cd server && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- create-order returns a Razorpay order object
- verify validates HMAC signature before updating DB
- webhook is secured by signature verification
- TypeScript compiles
```

---

## PROMPT-B-003: Wire OpenAI SoulBot

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Implement the AI SoulBot chatbot backend (currently returns 501).

CODEBASE FACTS:
- Server: Express + TypeScript + Prisma
- OpenAI package: check if already in server/package.json; if not, npm install openai
- GPT-4o-mini is the model to use (fast, cheap, good enough for chat)
- AuditLog model already exists and is used for auth events - use similar pattern for AI events
- Crisis detection is critical: recall must be >99.5% (flag any message with crisis keywords)

CRISIS KEYWORDS TO DETECT:
suicide, suicidal, end my life, kill myself, want to die, self-harm, cut myself, hurting myself, no reason to live, give up, can't go on

ENDPOINTS TO IMPLEMENT:

1. POST /api/v1/ai/chat (requireAuth)
   - Body: { message, conversationId? }
   - If no conversationId, create new AIConversation record
   - Run crisis detection on message BEFORE sending to OpenAI
   - If crisis detected: respond with crisis resources, create CRISIS_ALERT AuditLog, create admin Notification
   - Otherwise: get last 10 messages for context, call GPT-4o-mini with system prompt
   - System prompt should include: user's struggles (from UserProfile), recent mood trend summary
   - Store both user message and AI response in AIMessage records
   - Return: { message, conversationId, crisisDetected: false }

2. GET /api/v1/ai/conversations (requireAuth)
   - Returns list of user's AI conversation summaries (first message, last message date, message count)

3. GET /api/v1/ai/conversations/:id (requireAuth)
   - Returns full conversation with all messages

PRISMA MODELS TO ADD (add to server/prisma/schema.prisma):
model AIConversation {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages  AIMessage[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

model AIMessage {
  id             String         @id @default(uuid())
  conversationId String
  conversation   AIConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String         // 'user' | 'assistant'
  content        String
  crisisDetected Boolean        @default(false)
  tokensUsed     Int?
  createdAt      DateTime       @default(now())
}

STEPS:
1. Add the two models above to server/prisma/schema.prisma
2. Run: cd server && npx prisma migrate dev --name add_ai_conversations
3. Create server/src/services/openai.service.ts
4. Create server/src/services/crisis-detection.service.ts with keyword matching + confidence score
5. Create server/src/controllers/ai.controller.ts
6. Update server/src/routes/ai.ts to wire routes (replacing 501 stubs)
7. Run: cd server && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- Chat endpoint returns AI response
- Crisis keywords trigger crisis response + AuditLog + admin Notification
- All messages stored in DB
- TypeScript compiles
```

---

## PROMPT-B-004: Implement Event Analytics Tracking

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Implement comprehensive event tracking system for user behavior analytics.

WHY: Every user interaction is training data for our AI models. We need to track everything.

PRISMA MODEL TO ADD (add to server/prisma/schema.prisma):
model AnalyticsEvent {
  id         String   @id @default(uuid())
  userId     String?
  sessionId  String   // browser session UUID
  event      String   // snake_case event name
  properties Json     // arbitrary event context
  page       String?  // current route path
  deviceType String?  // mobile/tablet/desktop
  userAgent  String?
  ipHash     String?
  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([event])
  @@index([createdAt])
}

BACKEND STEPS:
1. Add model to server/prisma/schema.prisma
2. Run: cd server && npx prisma migrate dev --name add_analytics_events
3. Create server/src/controllers/analytics.controller.ts with:
   - POST /api/v1/analytics/track (no auth required, anonymous events OK)
     Body: { sessionId, event, properties, page, deviceType }
     Rate limited to 100 events per minute per IP
     Returns: { ok: true }
   - GET /api/v1/analytics/events (requireAuth + requireRole('ADMIN'))
     Query: event, userId, from, to, page, limit
     Returns: paginated events
4. Update server/src/routes/analytics.ts

FRONTEND STEPS:
5. Create src/lib/analytics.ts:
   - generateSessionId(): string  // UUID stored in sessionStorage
   - track(event: string, properties?: Record<string, unknown>): void
     // Posts to /api/v1/analytics/track
     // Silently fails (never throws)
   - page(path: string): void  // calls track('page_view', { path })

6. In src/router/index.tsx, add useEffect on location change to call analytics.page(location.pathname)

7. Add track() calls to key user actions:
   - MoodTracking submit: analytics.track('mood_logged', { value: mood.value })
   - Journal submit: analytics.track('journal_created', { wordCount })
   - Meditation complete: analytics.track('meditation_completed', { duration, type })
   - Login success: analytics.track('user_login')
   - Signup success: analytics.track('user_signup', { source })

ACCEPTANCE CRITERIA:
- POST /api/v1/analytics/track accepts and stores events
- Frontend analytics.track() works without throwing
- Page views tracked automatically via router
- TypeScript compiles on both frontend and backend
```

---

## PROMPT-U-001: Implement Mood Intelligence Engine

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Enhance the mood tracking system with intelligence and insights.

CODEBASE FACTS:
- Mood tracking API is LIVE at POST/GET /api/v1/health-tools/mood
- MoodEntry model in Prisma: { id, userId, value(1-10), note?, tags[], createdAt }
- Frontend mood page: src/pages/dashboard/MoodTrackingPage.tsx (implemented, live)
- Backend controller: server/src/controllers/health-tools.controller.ts (implemented)
- Dashboard returns moodTrend as 7-day array: server/src/controllers/users.controller.ts getDashboard()

BACKEND ENHANCEMENTS:

1. Add to GET /api/v1/health-tools/mood/insights (new endpoint, requireAuth):
   Response: {
     weeklyAverage: number,
     monthlyAverage: number,
     trend7d: 'improving' | 'declining' | 'stable',
     bestDay: string,  // "Monday" etc
     worstDay: string,
     streakDays: number,  // consecutive days with mood entry
     moodVariability: number,  // std deviation
     insights: string[]  // ["Your mood is 20% higher on days you meditate"]
   }

2. Enhance getDashboard in server/src/controllers/users.controller.ts:
   - Extend moodTrend from 7 days to 30 days
   - Add moodInsights field with the insights object above
   - Add streaks object: { mood: number, journal: number, meditation: number }

FRONTEND ENHANCEMENTS:

3. In src/pages/dashboard/MoodTrackingPage.tsx:
   - Add 30-day mood heatmap calendar (similar to GitHub contribution graph)
   - Use the recharts library (already in package.json) for the heatmap
   - Color scale: red (1-3) → yellow (4-6) → green (7-10)
   - Add insights cards below the heatmap showing the AI-generated insights

4. In src/pages/DashboardPage.tsx:
   - Add streak counters to the stats section
   - Show mood trend indicator (up/down arrow with % change)

STEPS:
1. Read server/src/controllers/health-tools.controller.ts and users.controller.ts
2. Read src/pages/dashboard/MoodTrackingPage.tsx
3. Implement backend insights endpoint
4. Update getDashboard to include streaks
5. Update MoodTrackingPage with heatmap
6. Run: cd server && npx tsc --noEmit && cd .. && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- GET /api/v1/health-tools/mood/insights returns all fields
- Dashboard includes streak counters
- MoodTrackingPage shows 30-day heatmap
- TypeScript compiles
```

---

## PROMPT-U-002: Fix All Dead CTA Buttons

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Fix 6 dead CTA buttons that are <div> elements with no onClick handler.

CODEBASE FACTS:
- All pages use React + TypeScript + Tailwind
- Navigation uses react-router-dom: import { useNavigate } from 'react-router-dom'
- Button component: import { Button } from '@/components/ui/button'
- Routes: /therapists (or /therapy), /contact, /careers

FIXES NEEDED:

1. src/pages/LandingPage.tsx — "Book Now" service cards (4 instances):
   Find: <div className="...cursor-pointer..." or similar dead clickable divs in the services section
   Fix: Replace with <Button onClick={() => navigate('/therapy')}>Book Therapy Session</Button>
   OR add onClick={()=>navigate('/therapy')} + role="button" + tabIndex={0} if structural div is needed

2. src/pages/CareersPage.tsx — "Apply" buttons:
   Find: Apply/Apply Now elements that are divs
   Fix: <Button asChild><a href={position.applyUrl} target="_blank" rel="noopener noreferrer">Apply for this Role</a></Button>
   If no apply URL exists: <Button onClick={() => navigate('/contact?type=job-application&role=' + encodeURIComponent(position.title))}>Apply</Button>

3. src/pages/CorporatePage.tsx or src/features/business/ — "Request A Demo":
   Find: the dead demo request element
   Fix: <Button onClick={() => navigate('/contact?type=corporate-demo')}>Request a Demo</Button>

4. src/pages/ContactPage.tsx — form submit button:
   Find: the form submit button that has no handler
   Fix: Ensure the <form> has onSubmit={handleSubmit} and the button has type="submit"
   Add a basic handleSubmit that posts to /api/v1/contact (if endpoint exists) or shows a toast

STEPS:
1. Read each file mentioned above
2. Find the dead CTA elements (search for cursor-pointer on div, or buttons without onClick)
3. Apply each fix
4. Run: npx tsc --noEmit (from repo root)

ACCEPTANCE CRITERIA:
- All 6 CTAs are functional (navigate or submit)
- No TypeScript errors
- Buttons use the Button component (not raw divs)
- Labels are specific: "Book Therapy Session" not "Book Now"
```

---

## PROMPT-U-003: Add Loading, Empty, and Error States

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Add loading, empty, and error states to all API-backed dashboard pages that are missing them.

CODEBASE FACTS:
- Skeleton component: src/components/ui/skeleton.tsx (already exists)
- Empty component: src/components/ui/empty.tsx (check if exists, if not create it)
- Alert component: src/components/ui/alert.tsx (already exists)
- Toast/Sonner: import { toast } from 'sonner' (already in package.json)
- useApiService pattern: see src/pages/dashboard/MoodTrackingPage.tsx for existing working example
- API calls use src/services/api.service.ts or similar

PAGES NEEDING ALL THREE STATES:

1. src/pages/dashboard/SessionsPage.tsx
   - Currently shows hardcoded array
   - Add: isLoading → skeleton cards; isEmpty → "No sessions yet. Book your first therapy session →"; isError → Alert with retry

2. src/pages/dashboard/MeditationPage.tsx  
   - Shows hardcoded mock data for meditation history
   - Add the three states to the history list section

3. src/pages/dashboard/NotificationsPage.tsx
   - Add loading skeleton, empty state "You're all caught up!", error state

4. src/pages/AdminDashboard.tsx
   - Stats cards show hardcoded numbers
   - Add loading state with skeleton numbers

PATTERN TO FOLLOW (copy from MoodTrackingPage.tsx):
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  apiService.get('/health-tools/mood')
    .then(res => setData(res.data))
    .catch(err => setError(err.message))
    .finally(() => setIsLoading(false));
}, []);

if (isLoading) return <LoadingSkeleton />;
if (error) return <Alert variant="destructive">...</Alert>;
if (!data?.length) return <EmptyState />;

STEPS:
1. Read src/pages/dashboard/MoodTrackingPage.tsx to understand the loading pattern
2. Apply the pattern to each of the 4 pages above
3. For each page, create appropriate skeleton (match the real content shape)
4. For each page, create specific empty state copy and CTA
5. Run: npx tsc --noEmit

ACCEPTANCE CRITERIA:
- All 4 pages show skeleton during loading
- All 4 pages show empty state when API returns empty array
- All 4 pages show error alert when API fails
- No TypeScript errors
```

---

## PROMPT-DS-001: Create Design Token File

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Create the missing TypeScript design token file that is referenced in BUILD_PLAN.md but does not exist.

PROBLEM: src/styles/tokens.ts does not exist. All design tokens are raw CSS custom properties in src/index.css with no TypeScript type safety or IntelliSense.

STEPS:

1. Read src/index.css to understand all CSS custom properties defined
2. Read tailwind.config.js to understand how they're mapped to Tailwind classes
3. Create src/styles/tokens.ts with this structure:

export const tokens = {
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    destructive: 'hsl(var(--destructive))',
    border: 'hsl(var(--border))',
    card: 'hsl(var(--card))',
    // Add semantic tokens not in CSS yet:
    success: 'hsl(142, 76%, 36%)',
    warning: 'hsl(38, 92%, 50%)',
    info: 'hsl(199, 89%, 48%)',
    crisis: 'hsl(0, 84%, 60%)',
  },
  radius: {
    xs: 'calc(var(--radius) - 6px)',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
    full: '9999px',
  },
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    verySlow: '800ms',
  },
  elevation: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  spacing: {
    page: 'px-6 py-20',
    section: 'py-16',
    card: 'p-6',
    cardLg: 'p-8',
    gap: 'gap-6',
    gapLg: 'gap-8',
  },
} as const;

export type TokenColors = keyof typeof tokens.colors;
export type TokenElevation = keyof typeof tokens.elevation;

4. Also add to src/index.css the missing semantic CSS variables:
   --success: 142 76% 36%;
   --warning: 38 92% 50%;
   --info: 199 89% 48%;
   --crisis: 0 84% 60%;

5. Add these to tailwind.config.js colors section

ACCEPTANCE CRITERIA:
- src/styles/tokens.ts exists and exports tokens object
- TypeScript compiles: npx tsc --noEmit
- src/index.css has success/warning/info/crisis CSS variables
- tailwind.config.js maps the new colors
```

---

## PROMPT-DS-002: Create Shared Animation Variants

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Create a shared Framer Motion animation variants file to replace inline magic number animations across the codebase.

PROBLEM: Every component defines its own Framer Motion variants with inline magic numbers like duration: 0.3, delay: 0.1. This makes animations inconsistent and unmaintainable.

STEPS:

1. Create src/lib/motion.ts:

import { Variants, Transition } from 'framer-motion';

export const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' } as Transition,
  normal: { duration: 0.3, ease: 'easeOut' } as Transition,
  slow: { duration: 0.5, ease: 'easeOut' } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 } as Transition,
} as const;

export const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transitions.normal },
  } as Variants,
  
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
  } as Variants,
  
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
  } as Variants,
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: transitions.spring },
  } as Variants,
  
  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: transitions.normal },
  } as Variants,
  
  staggerContainer: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  } as Variants,
  
  staggerItem: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
  } as Variants,
  
  modalOverlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: transitions.fast },
  } as Variants,
  
  modalContent: {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: transitions.spring },
  } as Variants,
  
  celebrateItem: {
    initial: { scale: 0, rotate: -45 },
    animate: { scale: 1, rotate: 0, transition: transitions.springBouncy },
  } as Variants,
} as const;

2. Run npx tsc --noEmit to verify no type errors

ACCEPTANCE CRITERIA:
- src/lib/motion.ts created with all variants above
- TypeScript compiles without errors
- Variants are usable as: <motion.div variants={variants.fadeInUp} initial="hidden" animate="visible">
```

---

## PROMPT-ADMIN-001: Wire Admin Dashboard to Real Data

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Replace hardcoded metrics in AdminDashboard with real database aggregation queries.

PROBLEM: src/pages/AdminDashboard.tsx shows hardcoded numbers like "1,247 users", "89 sessions". These are fake.

CODEBASE FACTS:
- Admin routes: server/src/routes/admin.ts (all return 501)
- Prisma models available: User, Session, Payment, MoodEntry, JournalEntry, MeditationLog, Notification
- API prefix: /api/v1
- Auth: requires ADMIN role (add auth middleware to admin router first per PROMPT-S-003)
- Pattern: follow server/src/controllers/users.controller.ts getDashboard() as template

BACKEND:

1. In server/src/controllers/admin.controller.ts, implement GET /api/v1/admin/dashboard:

const today = new Date(); today.setHours(0,0,0,0);
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const [
  totalUsers, newUsersToday, activeUsers30d,
  totalSessions, sessionsToday,
  totalRevenue, revenueToday,
  moodEntriesToday, journalEntriesToday
] = await Promise.all([
  prisma.user.count(),
  prisma.user.count({ where: { createdAt: { gte: today } } }),
  prisma.user.count({ where: { lastLoginAt: { gte: thirtyDaysAgo } } }),
  prisma.session.count({ where: { status: 'COMPLETED' } }),
  prisma.session.count({ where: { status: 'COMPLETED', updatedAt: { gte: today } } }),
  prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
  prisma.payment.aggregate({ where: { status: 'COMPLETED', createdAt: { gte: today } }, _sum: { amount: true } }),
  prisma.moodEntry.count({ where: { createdAt: { gte: today } } }),
  prisma.journalEntry.count({ where: { createdAt: { gte: today } } }),
]);

2. Update server/src/routes/admin.ts to wire this endpoint (and add requireAuth + requireRole('ADMIN'))

FRONTEND:

3. In src/pages/AdminDashboard.tsx:
   - Replace all hardcoded metrics with state variables
   - Add useEffect to fetch /api/v1/admin/dashboard on mount
   - Show skeleton cards during loading
   - Update metrics display with real data

ACCEPTANCE CRITERIA:
- GET /api/v1/admin/dashboard returns real DB counts
- AdminDashboard shows real numbers (0 if DB is empty, not 1247)
- Skeleton shown during loading
- TypeScript compiles
```

---

## PROMPT-SEO-001: Add Per-Page Meta Tags

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Add proper meta tags (title, description, Open Graph) to all public pages.

CODEBASE FACTS:
- Frontend: React + TypeScript + Vite
- useDocumentTitle hook already exists (check src/hooks/useDocumentTitle.ts)
- All public pages are in src/pages/ (LandingPage, AboutPage, BlogPage, CoursesPage, CareersPage, ContactPage, BusinessPage, CorporatePage, StudentCounsellingPage, WorkshopPage)
- react-helmet-async is likely not installed; check package.json

STEPS:

1. Check if react-helmet-async is in package.json
   If not: npm install react-helmet-async

2. In src/main.tsx, wrap <App /> with <HelmetProvider>

3. Create src/hooks/usePageMeta.ts:
   import { Helmet } from 'react-helmet-async';
   
   This hook sets title, meta description, og:title, og:description, og:type, og:image, canonical URL.

4. Add to each public page:
   - LandingPage: "Soul Yatri — Mental Wellness, Therapy & Astrology | India's Premier Wellness Platform"
     Description: "Book licensed therapists, connect with expert astrologers, and track your mental wellness journey. Soul Yatri — your complete wellness companion."
   - AboutPage: "About Soul Yatri | Our Mission to Make Mental Wellness Accessible in India"
   - BlogPage: "Wellness Blog | Mental Health Insights | Soul Yatri"
   - CoursesPage: "Wellness Courses | Therapy & Mindfulness Programs | Soul Yatri"
   - CareersPage: "Careers at Soul Yatri | Join India's Mental Wellness Revolution"
   - ContactPage: "Contact Soul Yatri | Get in Touch"

5. Create public/robots.txt:
   User-agent: *
   Allow: /
   Disallow: /dashboard
   Disallow: /admin
   Disallow: /api
   Sitemap: https://soulyatri.com/sitemap.xml

ACCEPTANCE CRITERIA:
- All 6+ public pages have unique title tags
- All pages have meta description
- Robots.txt exists and disallows private paths
- TypeScript compiles
```

---

## PROMPT-INFRA-001: Implement Redis Cache Layer

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Replace in-memory Map cache with Redis (Upstash) cache layer.

PROBLEM: server/src/services/cache.service.ts (or similar) uses an in-memory Map. This:
- Loses all cached data on server restart
- Doesn't work with multiple server instances
- Has no TTL enforcement

CODEBASE FACTS:
- Backend: Node.js + TypeScript
- Upstash Redis: @upstash/redis package (use this, not ioredis, for serverless compatibility)
- Free tier: 10,000 commands/day at upstash.com

STEPS:

1. cd server && npm install @upstash/redis

2. Add to server/.env.example:
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx

3. Create server/src/services/cache.service.ts:
   import { Redis } from '@upstash/redis';
   
   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_REST_URL!,
     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
   });
   
   export const cache = {
     get: <T>(key: string): Promise<T | null> => redis.get<T>(key),
     set: (key: string, value: unknown, ttlSeconds?: number) =>
       ttlSeconds ? redis.setex(key, ttlSeconds, value) : redis.set(key, value),
     del: (key: string) => redis.del(key),
     exists: (key: string) => redis.exists(key),
   };

4. Wrap with graceful fallback: if Redis env vars not set, use in-memory Map with console.warn

5. Find existing cache usage (search for 'Map' or 'cache' in server/src/services/) and replace with the new cache service

6. Run: cd server && npx tsc --noEmit

ACCEPTANCE CRITERIA:
- cache.service.ts uses Upstash Redis when env vars are set
- Falls back to in-memory Map when env vars are not set (dev mode)
- TTL is respected
- TypeScript compiles
```

---

## PROMPT-TEST-001: Add Server Unit Tests

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Add unit tests for the live server controllers.

CODEBASE FACTS:
- Server: Node.js + TypeScript
- Check if jest/vitest is in server/package.json
- If no test framework: npm install -D vitest @vitest/coverage-v8 (in server/)
- Live controllers: server/src/controllers/auth.controller.ts, users.controller.ts, health-tools.controller.ts, notifications.controller.ts
- Prisma: mock with jest.mock or use vitest mock

TESTS TO WRITE (server/src/controllers/__tests__/auth.controller.test.ts):

1. POST /api/v1/auth/register:
   - Returns 201 with user object on valid input
   - Returns 400 on invalid email
   - Returns 400 on weak password (zxcvbn score < 2)
   - Returns 409 on duplicate email

2. POST /api/v1/auth/login:
   - Returns 200 with accessToken on valid credentials
   - Returns 401 on wrong password
   - Returns 423 (locked) after 5 failed attempts
   - Sets httpOnly refresh token cookie

3. POST /api/v1/auth/refresh:
   - Returns new accessToken on valid refresh cookie
   - Returns 401 on missing/invalid/expired refresh token
   - Implements token rotation (old token invalidated)

STEPS:
1. Check server/package.json for test setup
2. If no test framework, add vitest: cd server && npm install -D vitest
3. Add "test": "vitest" to server/package.json scripts
4. Create server/src/controllers/__tests__/auth.controller.test.ts
5. Mock prisma: vi.mock('../../config/prisma', () => ({ prisma: mockPrisma }))
6. Write the test cases above
7. Run: cd server && npm test

ACCEPTANCE CRITERIA:
- All test cases pass
- At least 15 test cases covering auth controller
- npm test runs without error
```

---

## PROMPT-DEPLOY-001: Configure Production Environment

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Create production-ready environment configuration documentation and templates.

STEPS:

1. Create server/.env.production.example with ALL required production env vars:
   # App
   NODE_ENV=production
   PORT=3001
   API_URL=https://api.soulyatri.com
   FRONTEND_URL=https://soulyatri.com
   
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/soulyatri_prod?sslmode=require
   
   # Auth
   JWT_SECRET=<generate with: openssl rand -base64 64>
   JWT_REFRESH_SECRET=<generate with: openssl rand -base64 64>
   
   # Razorpay
   RAZORPAY_KEY_ID=rzp_live_xxx
   RAZORPAY_KEY_SECRET=xxx
   RAZORPAY_WEBHOOK_SECRET=xxx
   
   # OpenAI
   OPENAI_API_KEY=sk-xxx
   
   # Storage (Cloudflare R2)
   CLOUDFLARE_R2_ACCOUNT_ID=xxx
   CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx
   CLOUDFLARE_R2_BUCKET_NAME=soulyatri-prod
   CLOUDFLARE_R2_PUBLIC_URL=https://cdn.soulyatri.com
   
   # Email (Resend)
   RESEND_API_KEY=re_xxx
   EMAIL_FROM=noreply@soulyatri.com
   
   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   
   # Video (Daily.co)
   DAILY_API_KEY=xxx
   DAILY_DOMAIN=soulyatri.daily.co
   
   # SMS (MSG91)
   MSG91_AUTH_KEY=xxx
   MSG91_TEMPLATE_ID=xxx
   
   # Monitoring (Sentry)
   SENTRY_DSN=https://xxx@sentry.io/xxx
   
   # Analytics (PostHog)
   POSTHOG_API_KEY=phc_xxx

2. Create docs/DEPLOYMENT.md with step-by-step deployment guide:
   - Render.com deployment (recommended for backend)
   - Vercel deployment (frontend - already configured with vercel.json)
   - Neon.tech database setup
   - Required environment variables for each service
   - Post-deployment checklist

3. Create .env.example at root for frontend:
   VITE_API_URL=https://api.soulyatri.com
   VITE_RAZORPAY_KEY_ID=rzp_live_xxx
   VITE_DAILY_DOMAIN=soulyatri.daily.co
   VITE_POSTHOG_KEY=phc_xxx
   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
   VITE_AUTH_BYPASS=false

ACCEPTANCE CRITERIA:
- server/.env.production.example exists with all 25+ required vars
- docs/DEPLOYMENT.md exists with complete deployment guide
- .env.example at root exists for frontend vars
- No real credentials in any committed file
```

---

## PROMPT-MASTER: Full MVP Sprint Plan

```
You are working on the Soul Yatri repository at /home/runner/work/soul-yatri-website/soul-yatri-website.

TASK: Execute the full MVP sprint. Implement tasks in this exact order (each builds on the previous):

WEEK 1 — SECURITY (do ALL of these before anything else):
1. Run PROMPT-S-001 (fix auth bypass)
2. Run PROMPT-S-002 (fix dev routes in prod)
3. Run PROMPT-S-003 (add admin auth middleware)
4. Run PROMPT-S-004 (remove .env.local from git)

WEEK 2 — CORE BACKEND:
5. Run PROMPT-B-002 (Razorpay payments)
6. Run PROMPT-B-001 (therapy booking API)
7. Run PROMPT-B-004 (event analytics tracking)

WEEK 3 — AI & DATA:
8. Run PROMPT-B-003 (OpenAI SoulBot)
9. Run PROMPT-U-001 (mood intelligence engine)

WEEK 4 — FRONTEND WIRING:
10. Run PROMPT-U-002 (fix dead CTAs)
11. Run PROMPT-U-003 (loading/empty/error states)
12. Run PROMPT-ADMIN-001 (wire admin dashboard)

WEEK 5 — DESIGN:
13. Run PROMPT-DS-001 (design token file)
14. Run PROMPT-DS-002 (shared animation variants)

WEEK 6 — INFRASTRUCTURE:
15. Run PROMPT-INFRA-001 (Redis cache layer)
16. Run PROMPT-DEPLOY-001 (production env config)

WEEK 7 — SEO & TESTING:
17. Run PROMPT-SEO-001 (per-page meta tags)
18. Run PROMPT-TEST-001 (server unit tests)

After each week, run:
- cd server && npx tsc --noEmit (server TypeScript check)
- npx tsc --noEmit (frontend TypeScript check)
- git commit with descriptive message

FINAL STATE: All critical security issues fixed, therapy booking + payments live, AI SoulBot active, all analytics tracked, premium UI, 150+ tests passing.
```
