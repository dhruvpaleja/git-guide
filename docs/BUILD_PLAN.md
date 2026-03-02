# Soul Yatri — Complete Build Plan for AI Agents

> **Who this is for:** A non-technical founder using AI coding agents (GitHub Copilot, Cursor, Claude, etc.) to build the entire platform step by step.
>
> **How to use this:** Give any AI agent ONE phase at a time. Each phase is self-contained. Copy the phase, paste it as your prompt, and the agent will know exactly what to build, where to put it, and how to verify it works.

---

## Tech Stack Decisions (and why)

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | React 19 + TypeScript + Vite | Already set up. Fast builds, type safety, huge ecosystem |
| **UI Library** | Tailwind CSS + Radix UI (shadcn/ui) | Already set up. Apple-style clean design, WCAG 2.1 AA accessible |
| **3D / Animations** | Framer Motion + (optional) Three.js/React Three Fiber | Framer Motion for page transitions & scroll animations. Three.js only for specific hero effects |
| **Routing** | React Router v7 | Already set up with lazy loading |
| **State** | Zustand (replace Context for complex state) | Tiny, fast, works outside React, perfect for AI agent dev |
| **Backend** | Node.js + Express + TypeScript | Already set up in `server/`. Industry standard |
| **Database** | PostgreSQL + Prisma ORM | Type-safe queries, auto-generated types, migrations |
| **Auth** | JWT + bcrypt + refresh tokens | Industry standard, works with any frontend |
| **Real-time** | Socket.IO | For therapy video sessions, AI chat, notifications |
| **AI** | OpenAI GPT-4o + Whisper + fine-tuned models | See AI Model Strategy below |
| **Payments** | Razorpay (India/INR) + Stripe (global/multi-currency) | INR → Razorpay, all other currencies → Stripe |
| **File Storage** | AWS S3 / Cloudflare R2 | Session recordings, course videos, product images |
| **Email** | Resend or AWS SES | Transactional emails, notifications |
| **Video Calls** | Daily.co or 100ms SDK | In-platform therapy sessions with recording |
| **Search/SEO** | Next.js (migrate for SSR) OR pre-rendering | For blog SEO. Can be done later as a separate service |
| **Deployment** | Docker + Railway / Render (start) → AWS (scale) | Cheap to start, easy to scale |
| **Monitoring** | Sentry (errors) + PostHog (analytics) | Free tiers available |
| **Accessibility** | Radix UI + axe-core + Lighthouse a11y | WCAG 2.1 AA target, automated + manual testing |

### AI Model Strategy (Detailed)

Types defined in: `src/types/ai.types.ts` (AIModelConfig, FineTuningDataset, ModelEvaluationMetrics)

```
MODEL SELECTION PER USE CASE:

1. Chat Assistant (24/7 text):
   Model: GPT-4o (fast, capable, cost-effective)
   Fine-tuning: YES — on anonymized therapy conversation patterns
   Safety: Custom system prompt with therapy safety guardrails
   Crisis keywords: hardcoded list that bypasses AI and triggers instant flag
   Fallback: GPT-4o-mini for simple queries (cost optimization)

2. Voice Assistant (24/7 voice):
   STT: Whisper (large-v3) for transcription
   TTS: OpenAI TTS or ElevenLabs for response audio
   Processing: Whisper → GPT-4o → TTS pipeline
   Latency target: < 2 seconds end-to-end

3. Session Transcription:
   Model: Whisper (large-v3) — most accurate for therapy-specific language
   Fine-tuning: YES — on therapy session vocabulary (mental health terms,
   therapeutic techniques like CBT/DBT, Indian English accents)
   Post-processing: GPT-4o extracts key points, action items, emotional highlights

4. Sentiment & Emotion Analysis:
   Model: Fine-tuned GPT-4o-mini (fast inference needed for real-time)
   Training data: Labeled therapy conversation sentiments (anonymized)
   Output: sentiment score (-1 to 1), detected emotions, risk level
   Crisis detection recall target: >99.5% (NEVER miss a crisis signal)

5. Therapist Quality & Fraud Detection:
   Model: GPT-4o (needs reasoning for nuanced conduct analysis)
   No fine-tuning needed — prompt engineering sufficient
   Evaluation: Monthly review of false positive/negative rates

6. Content Moderation (Community):
   Model: GPT-4o-mini (fast, cheap, good enough for toxicity scoring)
   Supplemented by: Perspective API (Google) for toxicity scoring
   Auto-flag threshold: toxicity > 0.7 → flag for human review
   Auto-remove threshold: toxicity > 0.95 OR self-harm > 0.8

7. SEO Content Generation:
   Model: GPT-4o for blog drafts, meta descriptions, keyword suggestions
   Human review: ALL AI-generated content requires admin approval before publish

8. Kundali AI Analysis:
   Model: GPT-4o with custom prompt including Vedic astrology knowledge
   Purpose: Supplement (not replace) astrologer analysis
   Output: AI predictions alongside astrologer predictions for comparison

FINE-TUNING STRATEGY:
  Phase 1 (launch): Use base models with careful prompt engineering
  Phase 2 (3 months post-launch): Collect anonymized data, begin fine-tuning
  Phase 3 (6 months): Deploy fine-tuned models, A/B test against base
  Phase 4 (ongoing): Continuous evaluation, retrain quarterly

  ALL training data MUST be:
    - Fully anonymized (PII removed, synthetic names)
    - Consent-verified (users opt-in to data being used for improvement)
    - Reviewed for bias before training
    - Evaluated with therapy-specific metrics (see ModelEvaluationMetrics)

  CRITICAL SAFETY RULE: Crisis detection recall must be >99.5%.
  False negatives (missing a real crisis) are unacceptable.
  False positives (flagging non-crisis) are acceptable — better safe.
```

### Multi-Currency Payment Strategy

Types defined in: `src/types/payment.types.ts` (SupportedCurrency, CurrencyConfig, UserCurrencyPreference)

```
SUPPORTED CURRENCIES:
  INR (₹) — Razorpay — primary market (India)
  USD ($) — Stripe   — US, global default
  EUR (€) — Stripe   — Europe
  GBP (£) — Stripe   — UK
  AUD ($) — Stripe   — Australia
  CAD ($) — Stripe   — Canada
  SGD ($) — Stripe   — Singapore
  AED (د.إ) — Stripe — UAE / Middle East

ROUTING LOGIC:
  If currency == INR → route to Razorpay
  If currency != INR → route to Stripe
  All amounts stored in BOTH original currency AND INR (base currency)
  Exchange rates updated daily via Open Exchange Rates API

USER EXPERIENCE:
  1. Auto-detect currency from IP geolocation on first visit
  2. User can manually change currency in settings
  3. All prices displayed in user's preferred currency
  4. Checkout shows amount in user's currency + base INR equivalent
  5. Receipts show both currencies

ADMIN REPORTING:
  All revenue reports show amounts in INR (base currency)
  Exchange rate at time of transaction stored for audit
```

### Accessibility (A11y) Strategy

```
TARGET: WCAG 2.1 Level AA compliance on all pages

AUTOMATED TESTING:
  1. axe-core integration in CI pipeline — every PR checked
  2. Lighthouse accessibility score target: 95+
  3. eslint-plugin-jsx-a11y for React components
  4. Automated color contrast checking

MANUAL TESTING (quarterly):
  1. Screen reader testing (VoiceOver, NVDA) on key flows
  2. Keyboard-only navigation test on all pages
  3. High contrast mode testing
  4. 200% zoom testing (no horizontal scrolling)
  5. Reduced motion preference respected

DESIGN PRINCIPLES:
  1. Color is never the only indicator (always paired with text/icon)
  2. Focus indicators visible on all interactive elements
  3. All images have alt text (or aria-hidden if decorative)
  4. Form inputs have visible labels (not just placeholder)
  5. Error messages linked to form fields via aria-describedby
  6. Skip-to-content link on every page
  7. Semantic HTML (main, nav, aside, article, section)
  8. ARIA landmarks for complex widgets
  9. Minimum touch target size: 44x44px (mobile)
  10. prefers-reduced-motion: disable all animations

SPECIFIC TO SOUL YATRI:
  - Meditation timer: audio cues, not just visual
  - Mood tracker: slider + number input option
  - Video sessions: live captions via Whisper STT
  - AI assistant: both text and voice modes
  - Community: screen reader friendly post/comment flow
```

### Performance SLAs & Benchmarks

```
FRONTEND TARGETS:
  Lighthouse Performance: 90+ (95+ target)
  Lighthouse Accessibility: 95+
  Lighthouse SEO: 100
  Lighthouse Best Practices: 100
  LCP (Largest Contentful Paint): < 2.5 seconds
  FID (First Input Delay): < 100ms
  CLS (Cumulative Layout Shift): < 0.1
  TTI (Time to Interactive): < 3.5 seconds
  Page load on 3G: < 5 seconds
  Page load on 4G: < 2 seconds
  JS bundle size (initial): < 200KB gzipped

API RESPONSE TIME SLAs:
  Auth endpoints: < 200ms p95
  Dashboard data: < 300ms p95
  Search/filter: < 500ms p95
  AI chat (first token): < 1 second
  AI voice (end-to-end): < 2 seconds
  Session recording upload: < 5 seconds for 1 hour recording
  Payment processing: < 3 seconds
  Real-time notifications: < 100ms via WebSocket

DATABASE:
  Simple queries: < 50ms
  Complex aggregations: < 500ms
  Full-text search: < 200ms

UPTIME:
  API: 99.9% (< 8.76 hours downtime per year)
  WebSocket: 99.5%
  Video calling: 99.5% (depends on Daily.co SLA)

MONITORING:
  All metrics tracked in real-time via PostHog + custom dashboard
  Alerts via Slack/email if any SLA breached
  Weekly performance report to admin dashboard
  Tracked at: /admin/platform-health
```

---

## API-First Architecture (Web + Future Mobile App)

The backend is designed as a **standalone REST API** that serves ANY client — web app,
mobile app (React Native / Flutter), third-party integrations, or even other services.

### Why this matters
```
┌──────────────────┐     ┌─────────────────────────────────┐
│  React Web App   │────▶│                                 │
│  (this codebase) │     │                                 │
└──────────────────┘     │   Express API Server            │
                         │   /api/v1/...                   │
┌──────────────────┐     │                                 │
│  Mobile App      │────▶│   • Stateless (JWT auth)        │
│  (React Native   │     │   • JSON responses              │
│   or Flutter)    │     │   • No HTML rendering           │
└──────────────────┘     │   • CORS configured per client  │
                         │   • Versioned (/v1/, /v2/)      │
┌──────────────────┐     │   • Rate limited                │
│  Corporate       │────▶│   • Webhook support             │
│  Integrations    │     │                                 │
│  (Slack, SAP)    │     └─────────────────────────────────┘
└──────────────────┘                    │
                                        ▼
                         ┌─────────────────────────────────┐
                         │  PostgreSQL + Redis + S3         │
                         │  (shared data layer)             │
                         └─────────────────────────────────┘
```

### Rules for API-first backend
```
1. NEVER return HTML from the API — JSON only
2. NEVER store session state on the server — use JWT tokens
3. ALL responses follow the same shape:
   { success: true, data: {...} }                    // success
   { success: false, error: { message, code } }      // error
4. Auth via Authorization: Bearer <token> header (not cookies for mobile)
   - Web: also set httpOnly cookie as fallback
   - Mobile: use Authorization header only
5. File uploads return signed URLs — client uploads directly to S3
6. API versioning: /api/v1/ — never break existing endpoints
7. Pagination: { page, limit, total, data: [...] }
8. Filtering/sorting via query params: ?sort=createdAt&order=desc&status=active
9. Push notifications: abstracted — web push for browser, FCM for mobile
10. WebSocket events: same Socket.IO server, same event names for both clients
```

### Mobile app launch checklist (when ready)
```
1. API is already built and tested by the web app — nothing changes
2. Add mobile app's domain/bundle-id to CORS whitelist
3. Add FCM (Firebase Cloud Messaging) for mobile push notifications
4. Create React Native / Flutter project that calls the SAME API endpoints
5. Reuse all Zod validation schemas (shared npm package if needed)
6. Same Socket.IO connection for real-time features
7. Deep linking: map mobile routes to web routes
```

---

## Security Architecture

### Authentication & Authorization
```
1. Password hashing: bcrypt with 12 salt rounds
2. JWT access tokens: 15-minute expiry
3. Refresh tokens: 7-day expiry, stored in httpOnly cookies
4. Role-based access: user | therapist | astrologer | admin | moderator
5. Rate limiting: 100 req/min general, 5 req/min for auth endpoints
6. CORS: whitelist only your frontend domain
7. Helmet.js: security headers (already added)
```

### Data Protection
```
1. All therapy session data: AES-256 encryption at rest
2. Kundali/birth data: encrypted, access-logged
3. Payment data: NEVER stored — handled by Razorpay/Stripe tokenization
4. Session recordings: encrypted S3 with signed URLs (expire in 1 hour)
5. AI conversations: encrypted, retained permanently (see Data Retention Policy)
6. Emergency flags: admin-only access, audit-logged
7. HIPAA-style audit logs: every data access is logged
```

### API Security
```
1. Input validation: Zod schemas on every endpoint (already have schemas)
2. SQL injection: prevented by Prisma ORM (parameterized queries)
3. XSS: React auto-escapes, CSP headers via Helmet
4. CSRF: SameSite cookies + CSRF tokens for mutations
5. File uploads: type validation, size limits, virus scanning
6. API versioning: /api/v1/ prefix for all routes
```

### Privacy & Compliance
```
1. India's Digital Personal Data Protection Act (DPDPA 2023):
   - Explicit consent before data collection (onboarding Step 10)
   - Right to erasure (users can request full data deletion)
   - Data Processing Agreements with all service providers
   - Data localization: primary storage in India (AWS Mumbai / Cloudflare India)
   - Data Protection Officer (DPO) designated
   - Grievance redressal mechanism for data subjects
2. GDPR (for international/EU users):
   - Cookie consent banner on first visit
   - Data export API: GET /api/v1/users/export-my-data (JSON)
   - Right to be forgotten: DELETE /api/v1/users/delete-account
   - Lawful basis for processing documented for each data category
   - Data breach notification within 72 hours
3. CCPA (California users):
   - "Do Not Sell My Personal Information" link in footer
   - Right to know what data is collected
   - Right to delete personal information
   - Non-discrimination for exercising privacy rights
4. Mental health data sensitivity:
   - Therapy session content: highest encryption tier (AES-256-GCM)
   - AI conversation logs: encrypted, retained permanently per policy
   - Emergency flag data: retained permanently for safety
   - Kundali/birth data: encrypted at rest, access-logged
   - Mood/journal data: user-owned, deletable on request
   - ALL user data retained permanently (see Data Retention Policy)
5. Therapist/Astrologer credential verification:
   - Aadhaar/PAN document upload (encrypted storage)
   - License number verification against official databases
   - Background check via third-party provider
   - Interview + assessment test (astrologers take prediction test)
   - Trial period with monitored sessions
   - Mandatory platform training modules
   - Annual re-verification reminders
   - Types defined in: src/types/auth.types.ts (ProfessionalOnboarding)
```

### Data Retention Policy
```
PHILOSOPHY: Soul Yatri retains ALL user data permanently (unless user requests deletion).
Every data point helps build deeper personalization and better healing outcomes.

1. Active user data: retained PERMANENTLY while account is active
2. Deleted accounts: anonymize within 30 days per DPDPA/GDPR, hard-delete within 90 days
3. Therapy session recordings: retained PERMANENTLY (encrypted, user can download anytime)
4. AI conversations: retained PERMANENTLY (encrypted, never auto-purged)
   — Every AI conversation helps build better understanding of the user
   — Users can request export or deletion at any time
5. Emergency flags: retained PERMANENTLY for safety (audit-logged access)
6. Mood logs, journal entries: retained PERMANENTLY (core of healing journey data)
7. Payment records: retained PERMANENTLY (7+ years legally required for tax)
8. Audit logs: retained PERMANENTLY (archived to cold storage after 2 years)
9. Community posts: retained unless user deletes or admin removes
10. Blog content: retained indefinitely (SEO value)
11. Analytics data: raw events retained 1 year, then aggregated (summaries kept permanently)
12. Kundali/birth data: retained PERMANENTLY (encrypted, access-logged)
13. Therapy session tasks & progress: retained PERMANENTLY

NOTE: "Retained permanently" means stored in encrypted cold storage after
the relevant active period. Users always retain the right to request full
data deletion under DPDPA/GDPR — this triggers a 30-day deletion workflow.
```

### Crisis Intervention Protocol
```
When AI or session monitoring detects a crisis (self-harm, suicidal ideation):

IMMEDIATE (within seconds):
1. AI flags conversation/session as CRITICAL
2. Show crisis helpline banner to user: iCALL 9152987821, Vandrevala 1860-2662-345
3. Send real-time notification to assigned therapist
4. Send real-time alert to admin/emergency dashboard

WITHIN 5 MINUTES:
5. If therapist doesn't acknowledge → escalate to admin
6. Admin reviews and decides next step
7. If user is in active session → therapist takes over protocol
8. If user is chatting with AI → AI stays engaged, de-escalation mode

FOLLOW-UP (within 24 hours):
9. Assigned therapist contacts user
10. Emergency flag documented in user's file
11. Behavioral pattern updated
12. Admin reviews incident report
```

---

## Multi-Domain Strategy

```
Soul Yatri owns 3 domains:
  www.soulyatri.com  → PRIMARY (all traffic points here)
  www.soulyatri.in   → 301 redirect to soulyatri.com (Indian SEO signal)
  www.soulyatri.net  → 301 redirect to soulyatri.com

Setup:
1. All 3 domains → Cloudflare DNS (free)
2. soulyatri.in and soulyatri.net → 301 permanent redirect to soulyatri.com
3. soulyatri.com has canonical URLs on every page
4. hreflang tags: <link rel="alternate" hreflang="en" href="https://www.soulyatri.com/..." />
5. SSL certificates on all 3 (free via Cloudflare)
6. CDN caching on soulyatri.com (Cloudflare free tier)

Why keep all 3:
- Prevents competitors from buying similar domains
- soulyatri.in gives India-specific SEO signal via redirect
- All backlinks to any domain consolidate to soulyatri.com
```

---

## Search Ranking Strategy (SEO + GEO + PSEO + SXO + ASO)

Types defined in: `src/types/seo.types.ts`

```
SEO (Search Engine Optimization) — Google / Bing:
  - Server-side rendering for blog, courses, shop, events
  - JSON-LD structured data on every page type
  - Auto-generated sitemap.xml
  - Internal linking between related content
  - Core Web Vitals optimized (LCP < 2.5s, FID < 100ms, CLS < 0.1)

GEO (Generative Engine Optimization) — ChatGPT / Gemini / Perplexity:
  - FAQ-style structured content on key pages
  - Clear, factual answers to common mental health questions
  - Organization schema markup for brand recognition
  - Blog content structured for AI citation extraction
  - Track brand mentions in AI responses monthly

PSEO (Programmatic SEO) — Long-tail Keywords:
  - Auto-generated pages: /therapist-for-{issue}, /meditation-for-{goal}, /{city}-therapist
  - Templates in src/types/seo.types.ts (PSEOTemplate)
  - Each page has unique content + internal links + CTA
  - Target 500+ long-tail keyword pages

SXO (Search Experience Optimization) — User Behavior:
  - Page load < 3 seconds on 3G
  - Clear CTAs above fold on every page
  - Progressive disclosure (don't overwhelm new users)
  - Mobile-first responsive design
  - Track bounce rate, time on page, scroll depth

ASO (App Store Optimization) — Future Mobile App:
  - App name, subtitle, keywords optimized
  - Screenshots and preview video
  - Rating solicitation at key moments
  - Deep links from web to app
```

---

## Proactive AI Systems (Every Department)

```
AI is not just a chatbot — it's embedded EVERYWHERE:

THERAPY DEPARTMENT:
  - Client mood decline detection → therapist alert
  - Session quality scoring (real-time)
  - Therapist fraud detection (real-time)
  - Post-session task completion tracking
  - Client personality profiling

ASTROLOGY DEPARTMENT:
  - AI analyzes kundali chart data alongside astrologers
  - Prediction confidence scoring
  - Pattern matching across historical predictions
  - Accuracy tracking per astrologer

MARKETING/SEO:
  - Trending keyword detection → auto-suggest blog topics
  - Content gap analysis → what should we write about
  - Competitor content monitoring
  - SEO ranking drop alerts

SALES:
  - Lead scoring (which users are likely to subscribe)
  - Churn prediction (who's about to leave)
  - Upsell recommendations (which users should see premium features)
  - Conversion funnel optimization suggestions

SUPPORT:
  - Complaint auto-categorization and priority scoring
  - Sentiment analysis on complaint messages
  - Resolution time prediction
  - FAQ auto-generation from common complaints

COMMUNITY:
  - Auto-flag harmful/negative content (NLP)
  - Spam detection
  - User engagement scoring
  - Topic trend detection

PLATFORM-WIDE:
  - Anomaly detection (sudden traffic spikes, error rates)
  - Capacity planning (predict server load)
  - Cost optimization suggestions
  - Security threat detection
```

---

## Background Jobs & Scheduled Tasks (Cron)

```
These run in the background. Implement as part of the relevant phase.
Use node-cron or BullMQ (Redis-based job queue) for scheduling.

EVERY MINUTE:
  - Check for emergency flags needing escalation (5-min timeout)
  - Process real-time notification delivery queue

EVERY 5 MINUTES:
  - Sync active WebSocket connections count
  - Update real-time dashboard metrics

EVERY HOUR:
  - Refresh exchange rates for multi-currency (Open Exchange Rates API)
  - Process AI content moderation queue (batch)
  - Check for sessions starting in 1-3 hours → create astrology tasks
  - Send session reminder notifications (1 hour before)

EVERY 6 HOURS:
  - Aggregate analytics data (roll up hourly → daily)
  - Check for membership expiring within 7 days → send reminder
  - Run churn prediction model on at-risk users

DAILY (midnight IST):
  - Generate daily revenue reports
  - Update keyword rankings (TrackedKeyword)
  - Run behavioral pattern detection across all users
  - Archive audit logs older than 2 years to cold storage
  - Check therapist/astrologer license expiry dates
  - Generate proactive AI insights for admin dashboard
  - Update astrologer brownie point tiers

WEEKLY (Sunday midnight):
  - Generate weekly department performance reports
  - Trending keyword analysis → suggest blog topics
  - Run A/B test evaluation on AI models
  - Backup database to secondary storage
  - Generate SEO performance report

MONTHLY:
  - Generate monthly revenue and payout reports
  - Process auto-renewal for subscriptions and memberships
  - Run cohort analysis
  - Generate NGO impact reports
  - Check AI brand mentions in ChatGPT/Gemini/Perplexity
  - Generate therapist/astrologer performance reviews

IMPLEMENTATION:
  server/src/jobs/               — job definitions
  server/src/jobs/scheduler.ts   — cron schedule config
  server/src/jobs/workers/       — individual job workers
  Use BullMQ for reliable job processing with retries
```

---

## Validation Schemas (Zod)

```
Every API endpoint MUST have a Zod validation schema.
Schemas live in: src/config/validation.schemas.ts (already exists)
Server-side: server/src/validators/<feature>.ts

Example pattern (already established):
  import { z } from 'zod';

  export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  // In route handler:
  const parsed = loginSchema.parse(req.body);

RULE: Never trust client data. Validate EVERYTHING server-side.
Frontend can share schemas via a shared npm package (later optimization).
```

---

## Build Phases (Give ONE phase to an AI agent at a time)

### PHASE 1: Database & Auth Foundation
**Time estimate: 1-2 sessions**
**What to tell the AI agent:**

```
TASK: Set up PostgreSQL database with Prisma ORM and complete auth system.

CONTEXT: This is a mental health platform (Soul Yatri). The codebase is at the root
of this repo. Backend is in server/ using Express + TypeScript. Frontend is React + Vite.

=== PRISMA MODELS ===

model User {
  id                   String    @id @default(cuid())
  email                String    @unique
  passwordHash         String
  name                 String
  avatar               String?
  role                 Role      @default(USER)
  phone                String?
  dateOfBirth          DateTime?
  bio                  String?
  onboardingCompleted  Boolean   @default(false)
  isActive             Boolean   @default(true)
  lastLoginAt          DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  refreshTokens  RefreshToken[]
  // other relations added in later phases
}

enum Role {
  USER
  THERAPIST
  ASTROLOGER
  ADMIN
  MODERATOR
}

model RefreshToken {
  id          String   @id @default(cuid())
  token       String   @unique
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceInfo  String?  // e.g. "Chrome 120, Windows 11"
  ipAddress   String?
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}

=== SECURITY CONFIGURATION ===

- Password hashing: bcrypt with salt rounds = 12
  → const SALT_ROUNDS = 12;
  → const hash = await bcrypt.hash(password, SALT_ROUNDS);
  → const isValid = await bcrypt.compare(password, user.passwordHash);

- JWT configuration:
  → Access token: expires in 15 minutes, algorithm HS256
  → Refresh token: expires in 7 days, stored in httpOnly secure cookie
  → Secret: process.env.JWT_ACCESS_SECRET (min 256-bit)
  → Refresh secret: process.env.JWT_REFRESH_SECRET (separate secret)
  → jwt.sign({ userId: user.id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m', algorithm: 'HS256' })
  → jwt.sign({ userId: user.id, tokenId: refreshToken.id }, JWT_REFRESH_SECRET, { expiresIn: '7d', algorithm: 'HS256' })

- Password rules (enforced in Zod + backend):
  → Minimum 8 characters
  → At least 1 uppercase letter (A-Z)
  → At least 1 lowercase letter (a-z)
  → At least 1 number (0-9)
  → At least 1 special character (!@#$%^&*()_+-=)
  → Zod regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,}$/

- Refresh token rotation:
  → On refresh: old token is DELETED from database
  → New refresh token is issued and stored
  → If someone tries to use a deleted token → revoke ALL tokens for that user (security breach detection)

=== ZOD VALIDATION SCHEMAS ===

// Register schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Refresh schema
const refreshSchema = z.object({
  // Token is extracted from httpOnly cookie, no body needed
});

=== ERROR CODES ===

AUTH_001: Invalid credentials — email or password is wrong
AUTH_002: Email already exists — registration with duplicate email
AUTH_003: Token expired — access or refresh token has expired
AUTH_004: Invalid token — token is malformed or tampered with
AUTH_005: Account suspended — user.isActive is false, admin has suspended this account

Error response shape:
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password",
    "details": {}  // optional field-level errors
  }
}

=== API ENDPOINTS ===

POST /api/v1/auth/register
  Request body: { email: string, password: string, name: string }
  Success response (201): { success: true, data: { user: { id, email, name, role, createdAt }, accessToken: string }, message: "Registration successful" }
  Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800
  Errors: AUTH_002 (email exists), 400 (validation errors)
  Steps:
    1. Validate body with registerSchema
    2. Check if email already exists → AUTH_002
    3. Hash password: await bcrypt.hash(password, 12)
    4. Create user in database
    5. Generate access token (15min)
    6. Generate refresh token (7 days), store in DB with deviceInfo + ipAddress
    7. Set refresh token as httpOnly cookie
    8. Return user + accessToken

POST /api/v1/auth/login
  Request body: { email: string, password: string }
  Success response (200): { success: true, data: { user: { id, email, name, role, avatar, onboardingCompleted }, accessToken: string } }
  Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800
  Errors: AUTH_001 (invalid credentials), AUTH_005 (account suspended)
  Steps:
    1. Validate body with loginSchema
    2. Find user by email → AUTH_001 if not found
    3. Compare password: await bcrypt.compare(password, user.passwordHash) → AUTH_001 if false
    4. Check user.isActive → AUTH_005 if false
    5. Update user.lastLoginAt = new Date()
    6. Generate access token
    7. Generate refresh token, store in DB
    8. Set refresh token as httpOnly cookie
    9. Return user + accessToken

POST /api/v1/auth/refresh
  Request body: none (token from cookie)
  Success response (200): { success: true, data: { accessToken: string } }
  Set-Cookie: new refreshToken
  Errors: AUTH_003 (expired), AUTH_004 (invalid)
  Steps:
    1. Extract refreshToken from cookie
    2. Verify JWT signature → AUTH_004 if invalid
    3. Find token in DB → AUTH_004 if not found (possibly revoked)
    4. Check expiresAt → AUTH_003 if expired
    5. DELETE old refresh token from DB (rotation)
    6. Create new refresh token in DB
    7. Generate new access token
    8. Set new refresh token cookie
    9. Return new accessToken

POST /api/v1/auth/logout
  Request headers: Authorization: Bearer <accessToken>
  Request body: none
  Success response (200): { success: true, message: "Logged out successfully" }
  Clear-Cookie: refreshToken
  Steps:
    1. Extract refreshToken from cookie
    2. Delete refresh token from DB (if exists)
    3. Clear cookie
    4. Return success

GET /api/v1/auth/me
  Request headers: Authorization: Bearer <accessToken>
  Success response (200): { success: true, data: { user: { id, email, name, role, avatar, phone, dateOfBirth, bio, onboardingCompleted, isActive, createdAt } } }
  Errors: AUTH_003 (expired), AUTH_004 (invalid)
  Steps:
    1. verifyToken middleware extracts and verifies JWT
    2. Fetch user from DB by userId from token
    3. Return user (exclude passwordHash)

=== AUTH MIDDLEWARE ===

// server/src/middleware/auth.ts

verifyToken middleware:
  1. Extract token from Authorization header: "Bearer <token>"
  2. If no token → 401 { code: "AUTH_004", message: "No token provided" }
  3. jwt.verify(token, JWT_ACCESS_SECRET) → decoded payload
  4. If expired → 401 { code: "AUTH_003", message: "Token expired" }
  5. If invalid → 401 { code: "AUTH_004", message: "Invalid token" }
  6. Attach req.user = { userId: decoded.userId, role: decoded.role }
  7. Call next()

requireRole(...roles: Role[]) middleware:
  1. Check req.user.role is in allowed roles
  2. If not → 403 { code: "AUTH_006", message: "Insufficient permissions" }
  3. Call next()

=== SUB-STEPS (execute in order) ===

1a. Install dependencies:
    cd server && npm install bcrypt jsonwebtoken @prisma/client prisma
    cd server && npm install -D @types/bcrypt @types/jsonwebtoken

1b. Create Prisma schema:
    - Create server/prisma/schema.prisma
    - Add User model with ALL fields listed above
    - Add RefreshToken model with ALL fields listed above
    - Add Role enum
    - Set datasource postgresql, generator client

1c. Run Prisma migrate:
    cd server && npx prisma migrate dev --name init-auth
    cd server && npx prisma generate

1d. Create auth middleware:
    - Create server/src/middleware/auth.ts
    - Implement verifyToken (extract JWT, verify, attach req.user)
    - Implement requireRole (check role against allowed roles)
    - Export both as named exports

1e. Create register endpoint:
    - In server/src/routes/auth.ts: POST /register
    - Validate with registerSchema (Zod)
    - Check duplicate email
    - Hash password with bcrypt (salt rounds 12)
    - Create user + refresh token in transaction
    - Return user + access token + set cookie

1f. Create login endpoint:
    - In server/src/routes/auth.ts: POST /login
    - Validate with loginSchema
    - Find user, compare password
    - Check isActive
    - Update lastLoginAt
    - Return user + access token + set cookie

1g. Create refresh endpoint:
    - In server/src/routes/auth.ts: POST /refresh
    - Extract token from cookie
    - Verify, find in DB
    - Rotate: delete old, create new
    - Return new access token + set new cookie

1h. Create logout endpoint:
    - In server/src/routes/auth.ts: POST /logout
    - Delete refresh token from DB
    - Clear cookie

1i. Create me endpoint:
    - In server/src/routes/auth.ts: GET /me
    - Use verifyToken middleware
    - Fetch user by ID, exclude passwordHash
    - Return user data

1j. Create frontend LoginPage:
    - Create src/pages/LoginPage.tsx
    - Form fields: email (text input), password (password input with show/hide toggle)
    - Validation messages per field shown below each input in red
    - Submit button: shows spinner + "Logging in..." while loading, disabled during request
    - Error banner at top for AUTH_001 / AUTH_005 errors
    - "Don't have an account? Sign up" link below form
    - On success: store accessToken in memory (not localStorage), redirect to /dashboard or /onboarding

1k. Create frontend SignupPage:
    - Create src/pages/SignupPage.tsx
    - Form fields: name (text input), email (text input), password (password input), confirm password
    - Real-time password strength indicator (weak/medium/strong)
    - Validation messages per field shown below each input in red
    - Password requirements checklist (each rule shows ✓ or ✗ in real-time)
    - Submit button: shows spinner + "Creating account..." while loading
    - Error banner for AUTH_002 (email already exists)
    - "Already have an account? Log in" link below form
    - On success: redirect to /onboarding

1l. Wire routes:
    - Add /login and /signup routes in src/router/index.tsx under AuthLayout
    - Add ProtectedRoute wrapper that checks auth state
    - If not authenticated → redirect to /login
    - If authenticated but onboarding not complete → redirect to /onboarding

1m. Test all flows:
    - Register with valid data → user created, tokens returned
    - Register with existing email → AUTH_002 error
    - Register with weak password → validation error
    - Login with correct credentials → tokens returned
    - Login with wrong password → AUTH_001 error
    - Login with suspended account → AUTH_005 error
    - Access /me with valid token → user returned
    - Access /me with expired token → AUTH_003 error
    - Refresh token → new access token returned, old refresh token invalidated
    - Use old refresh token again → all tokens revoked (breach detection)
    - Logout → cookie cleared, refresh token deleted

=== FRONTEND COMPONENT DETAILS ===

LoginPage.tsx:
  Props: none (page component)
  State: { email: string, password: string, isLoading: boolean, error: string | null }
  Events: onSubmit (form), onChange (inputs)
  UI States:
    - Default: form with empty fields
    - Loading: button shows <Spinner /> + "Logging in...", inputs disabled
    - Error: red banner at top with error message
    - Success: redirect to /dashboard (no visible state, instant redirect)

SignupPage.tsx:
  Props: none (page component)
  State: { name: string, email: string, password: string, confirmPassword: string, isLoading: boolean, error: string | null }
  Events: onSubmit (form), onChange (inputs)
  UI States:
    - Default: form with empty fields, password requirements shown as gray checklist
    - Typing password: checklist items turn green as requirements are met
    - Loading: button shows <Spinner /> + "Creating account...", inputs disabled
    - Error: red banner with error message + field-level errors below inputs
    - Success: redirect to /onboarding

VERIFY: Register a user, login, access /api/v1/auth/me with token, refresh token,
use old refresh token (should fail + revoke all), logout, login with wrong password.
```

---

### PHASE 2: User Onboarding Flow
**Time estimate: 1-2 sessions**

```
TASK: Build 10-step onboarding flow that collects user profile data after signup.

CONTEXT: Types are defined in src/types/onboarding.types.ts. User signs up → redirected
to /onboarding → completes 10 steps → redirected to /dashboard.

=== PRISMA MODEL ADDITIONS ===

model OnboardingProgress {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  currentStep     Int      @default(1)    // 1-10
  stepData        Json     @default("{}")  // stores partial data per step
  completedSteps  Int[]    @default([])    // array of completed step numbers
  isComplete      Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
}

// Additional fields added to User model:
// gender          String?
// location        String?
// stressLevel     Int?          // 1-10
// struggles       String[]      // from Struggle enum
// healingGoals    String[]      // from HealingGoal enum
// pastTherapy     Boolean?
// currentMeds     String?
// therapistGenderPref  String?
// therapistLanguagePref String[]
// preferredSessionTime String?
// interests       String[]      // astrology, meditation, breathwork, yoga
// emergencyContactName  String?
// emergencyContactPhone String?
// emergencyContactRelation String?
// termsAccepted   Boolean @default(false)
// privacyAccepted Boolean @default(false)

=== STEP-BY-STEP DETAIL ===

STEP 1 — Welcome + Name:
  Component: src/pages/onboarding/Step1Welcome.tsx
  UI: Text input for name
  Validation: name min 2 chars, max 50 chars, letters and spaces only
  Zod: z.object({ name: z.string().min(2).max(50).regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed') })
  UI element: Single text input with "What should we call you?" label
  Animation: Framer Motion fade-in from bottom (initial={{ opacity: 0, y: 20 }}, animate={{ opacity: 1, y: 0 }})
  No back button (first step)

STEP 2 — Date of Birth + Gender:
  Component: src/pages/onboarding/Step2Demographics.tsx
  UI: Date picker (Shadcn DatePicker) + gender radio buttons (Male, Female, Non-binary, Prefer not to say)
  Validation: dateOfBirth must make user > 13 years old, gender required
  Zod: z.object({
    dateOfBirth: z.date().refine(d => {
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= 13;
    }, 'You must be at least 13 years old'),
    gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say'])
  })
  Animation: Framer Motion slide from right (variants: { enter: { x: 300, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -300, opacity: 0 } })

STEP 3 — Phone + Location:
  Component: src/pages/onboarding/Step3Contact.tsx
  UI: Phone input with country code selector + location text input (city/state)
  Validation: phone must be valid format (10 digits for India, intl format for others), location min 2 chars
  Zod: z.object({
    phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number'),
    location: z.string().min(2, 'Location is required').max(100)
  })
  UI element: Phone input with country flag dropdown, location with autocomplete (optional)

STEP 4 — Current Mood & Stress Level:
  Component: src/pages/onboarding/Step4MoodStress.tsx
  UI: Mood slider (1-10) with emoji faces at each level, stress slider (1-10) with color gradient (green to red)
  Validation: both values required, integer 1-10
  Zod: z.object({
    currentMood: z.number().int().min(1).max(10),
    stressLevel: z.number().int().min(1).max(10)
  })
  UI element: Shadcn Slider component, labels "Feeling terrible (1)" to "Feeling amazing (10)"

STEP 5 — Struggles:
  Component: src/pages/onboarding/Step5Struggles.tsx
  UI: Multi-select chips from predefined list
  Options: Anxiety, Depression, Stress, Relationship Issues, Self-Esteem, Grief, Trauma, Sleep Issues, Addiction, Anger Management, Loneliness, Career Stress, Family Issues, Body Image, Burnout
  Validation: at least 1 selected, max 5
  Zod: z.object({
    struggles: z.array(z.string()).min(1, 'Select at least one').max(5, 'Select at most 5')
  })
  UI element: Grid of chip/tag buttons, selected ones highlighted with primary color + checkmark

STEP 6 — Healing Goals:
  Component: src/pages/onboarding/Step6Goals.tsx
  UI: Multi-select chips from predefined list
  Options: Better Mental Health, Stress Management, Self-Discovery, Spiritual Growth, Better Relationships, Improved Sleep, Emotional Regulation, Mindfulness, Physical Wellness, Career Clarity, Inner Peace, Building Confidence
  Validation: at least 1 selected, max 5
  Zod: z.object({
    healingGoals: z.array(z.string()).min(1).max(5)
  })

STEP 7 — Past Therapy & Medications (OPTIONAL — can skip):
  Component: src/pages/onboarding/Step7TherapyHistory.tsx
  UI: Radio button "Have you tried therapy before?" (Yes/No), if Yes → textarea for details. Textarea "Current medications" (optional)
  Validation: pastTherapy boolean required, details optional, medications optional
  Zod: z.object({
    pastTherapy: z.boolean(),
    pastTherapyDetails: z.string().max(500).optional(),
    currentMedications: z.string().max(500).optional()
  })
  Skip button: "Skip this step →" link below the form

STEP 8 — Therapist Preferences:
  Component: src/pages/onboarding/Step8Preferences.tsx
  UI: Gender preference radio (Male, Female, No Preference), language multi-select (English, Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, Gujarati, Malayalam, Punjabi), preferred time radio (Morning, Afternoon, Evening, Night, Flexible)
  Validation: all optional but at least gender preference recommended
  Zod: z.object({
    therapistGenderPref: z.enum(['male', 'female', 'no-preference']).optional(),
    therapistLanguagePref: z.array(z.string()).optional(),
    preferredSessionTime: z.enum(['morning', 'afternoon', 'evening', 'night', 'flexible']).optional()
  })

STEP 9 — Interests (OPTIONAL — can skip):
  Component: src/pages/onboarding/Step9Interests.tsx
  UI: Multi-select chips: Astrology, Meditation, Breathwork, Yoga, Journaling, Sound Healing, Crystal Therapy, Reiki, Tarot, Numerology
  Validation: optional, max 5
  Zod: z.object({
    interests: z.array(z.string()).max(5).optional()
  })
  Skip button: "Skip this step →" link

STEP 10 — Emergency Contact + Consent:
  Component: src/pages/onboarding/Step10Emergency.tsx
  UI: Emergency contact name (text), phone (phone input), relation (dropdown: Parent, Spouse, Sibling, Friend, Other). Checkboxes: "I accept Terms of Service" and "I accept Privacy Policy" (both links open in new tab)
  Validation: all emergency contact fields required, both consent checkboxes must be true
  Zod: z.object({
    emergencyContactName: z.string().min(2, 'Emergency contact name is required').max(100),
    emergencyContactPhone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number'),
    emergencyContactRelation: z.enum(['parent', 'spouse', 'sibling', 'friend', 'other']),
    termsAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept Terms of Service' }) }),
    privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept Privacy Policy' }) })
  })

=== ONBOARDING PAGE CONTAINER ===

Component: src/pages/OnboardingPage.tsx
  Props: none (page component)
  State: {
    currentStep: number (1-10),
    stepData: Record<number, any>,
    isLoading: boolean,
    isSaving: boolean,
    error: string | null
  }
  Features:
    - Progress indicator: horizontal bar showing X of 10 completed (Shadcn Progress component)
    - Step label: "Step X of 10 — <step title>"
    - Back button on steps 2-10 (Framer Motion slide right animation when going back)
    - Next/Continue button at bottom of each step
    - Skip button only on steps 7 and 9 (optional steps)
    - Animation between steps: Framer Motion AnimatePresence with slide direction
      → Going forward: slide left (exit: x: -300, enter: x: 300)
      → Going back: slide right (exit: x: 300, enter: x: -300)
    - Auto-save after each step: PATCH /api/v1/users/onboarding

=== API ENDPOINTS ===

PATCH /api/v1/users/onboarding
  Request headers: Authorization: Bearer <accessToken>
  Request body: { stepNumber: number, data: object }
  Success response (200): { success: true, data: { currentStep: number, completedSteps: number[] } }
  Steps:
    1. Validate stepNumber (1-10) and data with step-specific Zod schema
    2. Upsert OnboardingProgress for user
    3. Merge step data into stepData JSON
    4. Add stepNumber to completedSteps if not already there
    5. Update currentStep to stepNumber + 1 (or 10 if last step)
    6. Save user profile fields from step data

GET /api/v1/users/onboarding
  Request headers: Authorization: Bearer <accessToken>
  Success response (200): { success: true, data: { currentStep: number, completedSteps: number[], stepData: object, isComplete: boolean } }
  Steps:
    1. Fetch OnboardingProgress for user
    2. If none exists → return { currentStep: 1, completedSteps: [], stepData: {}, isComplete: false }
    3. Return progress data

POST /api/v1/users/onboarding/complete
  Request headers: Authorization: Bearer <accessToken>
  Success response (200): { success: true, message: "Onboarding completed" }
  Steps:
    1. Verify all required steps (1-6, 8, 10) are in completedSteps
    2. Set OnboardingProgress.isComplete = true
    3. Set User.onboardingCompleted = true
    4. Return success

=== ERROR CODES ===

ONBOARD_001: Step validation failed — data for this step doesn't pass Zod schema
ONBOARD_002: Required step incomplete — trying to complete onboarding with required steps missing
ONBOARD_003: Already completed — user has already finished onboarding

=== RESUME LOGIC ===

When user navigates to /onboarding:
  1. Call GET /api/v1/users/onboarding
  2. If isComplete → redirect to /dashboard
  3. If not complete → set currentStep from response → render that step with saved data pre-filled
  4. User can go back to edit previous steps without losing data

=== UI STATES ===

Loading: Full-page spinner with "Loading your progress..." text
Saving step: "Next" button shows spinner + "Saving..." text, disabled
Error saving: Toast notification "Failed to save. Please try again." with retry button
Step transition: 0.3s slide animation between steps
Complete: Confetti animation (canvas-confetti library) + "Welcome to Soul Yatri!" message + auto-redirect to /dashboard after 3 seconds

=== TEST SCENARIOS ===

- Complete all 10 steps → onboarding marked complete → redirected to dashboard
- Skip step 7 → should still be able to complete
- Skip step 9 → should still be able to complete
- Try to skip step 5 (required) → should not be allowed
- Leave at step 5, close browser → reopen → resume at step 5 with data pre-filled
- Submit step with invalid data (e.g., age < 13) → validation error shown
- Complete onboarding → visit /onboarding again → redirected to /dashboard
- New user visits /dashboard → redirected to /onboarding

VERIFY: Sign up → land on onboarding → complete all steps → arrive at dashboard.
Leave mid-flow → return → resume from last step.
```

---

### PHASE 3: User Dashboard
**Time estimate: 2-3 sessions**

```
TASK: Build the main user dashboard with all sections.

CONTEXT: Dashboard is the home for logged-in users. It shows their healing journey,
upcoming sessions, tools, recommendations. Uses DashboardLayout (sidebar + main area).

=== API ENDPOINT ===

GET /api/v1/users/dashboard
  Request headers: Authorization: Bearer <accessToken>
  Success response (200):
  {
    "success": true,
    "data": {
      "user": { "name": "string", "avatar": "string|null", "membershipTier": "string" },
      "moodTrend": [7, 6, 8, 5, 7, 8, 9],         // last 7 days mood scores
      "sessionsCompleted": 12,                       // total therapy sessions
      "currentStreak": 5,                            // consecutive days using platform
      "meditationMinutes": 340,                      // total meditation time
      "upcomingSessions": [
        {
          "id": "string",
          "therapistName": "string",
          "therapistAvatar": "string|null",
          "scheduledAt": "2025-01-15T10:00:00Z",
          "duration": 50,
          "type": "therapy|astrology",
          "status": "scheduled|in-progress"
        }
      ],
      "recommendedCourses": [
        {
          "id": "string",
          "title": "string",
          "thumbnail": "string",
          "duration": "string",
          "rating": 4.5,
          "price": 499,
          "category": "string"
        }
      ],
      "recentMoodLogs": [
        {
          "id": "string",
          "mood": 7,
          "emotions": ["calm", "hopeful"],
          "createdAt": "2025-01-15T08:00:00Z"
        }
      ],
      "pendingTasks": [
        {
          "id": "string",
          "title": "string",
          "assignedBy": "string",
          "dueDate": "2025-01-16T00:00:00Z",
          "isComplete": false
        }
      ],
      "quickStats": {
        "journalEntries": 23,
        "breathingSessions": 45,
        "communityPosts": 8,
        "coursesInProgress": 2
      }
    }
  }

=== DASHBOARD WIDGETS (each is a separate component) ===

1. WelcomeCard:
   Component: src/components/dashboard/WelcomeCard.tsx
   Props: { userName: string, membershipTier: string, currentStreak: number }
   Display: "Welcome back, {name}!" + streak badge + tier badge
   Empty state: N/A (always has data after onboarding)

2. MoodTrendChart:
   Component: src/components/dashboard/MoodTrendChart.tsx
   Props: { data: number[], period: '7d' | '30d' }
   Library: Recharts LineChart
   Display: Line graph with dots, gradient fill below line, Y-axis 1-10, X-axis dates
   Loading: Skeleton rectangle (Shadcn Skeleton, h-48)
   Empty state: "No mood data yet — Log your first mood" + CTA button

3. StatsCards:
   Component: src/components/dashboard/StatsCards.tsx
   Props: { sessionsCompleted: number, meditationMinutes: number, journalEntries: number, breathingSessions: number }
   Display: 4 cards in a row, each with icon (Lucide) + number + label
   Icons: Calendar (sessions), Timer (meditation), BookOpen (journal), Wind (breathing)
   Loading: 4 Skeleton cards

4. UpcomingSessionsList:
   Component: src/components/dashboard/UpcomingSessionsList.tsx
   Props: { sessions: UpcomingSession[] }
   Display: List of upcoming sessions with therapist avatar, name, date/time, "Join" button (if within 10min of start)
   Loading: 3 Skeleton rows
   Empty state: "No upcoming sessions — Book your first session" + CTA button → /dashboard/book-session

5. RecommendedCourses:
   Component: src/components/dashboard/RecommendedCourses.tsx
   Props: { courses: RecommendedCourse[] }
   Display: Horizontal scroll carousel of course cards with thumbnail, title, rating stars, price
   Loading: 3 Skeleton cards in a row
   Empty state: "Explore our courses to start your healing journey" + CTA → /courses

6. PendingTasks:
   Component: src/components/dashboard/PendingTasks.tsx
   Props: { tasks: PendingTask[] }
   Display: Checklist with task title, assigned by, due date, checkbox to mark complete
   API on check: PATCH /api/v1/tasks/:id/complete
   Loading: 3 Skeleton rows
   Empty state: "No pending tasks — You're all caught up! 🎉"

7. RecentMoodLogs:
   Component: src/components/dashboard/RecentMoodLogs.tsx
   Props: { logs: MoodLog[] }
   Display: Last 5 mood entries with emoji, mood score, emotion tags, relative time
   Loading: 3 Skeleton rows
   Empty state: "Start tracking your mood to see patterns"

8. QuickActions:
   Component: src/components/dashboard/QuickActions.tsx
   Props: none (static navigation buttons)
   Buttons:
     - "Book Session" → /dashboard/book-session (icon: Calendar)
     - "Journal" → /dashboard/health-tools/journal (icon: BookOpen)
     - "Meditate" → /dashboard/health-tools/meditation (icon: Brain)
     - "AI Assistant" → /dashboard/ai-assistant (icon: Bot)
     - "Mood Check" → /dashboard/health-tools/mood (icon: Smile)
     - "Breathing" → /dashboard/health-tools/breathing (icon: Wind)

=== SIDEBAR NAVIGATION (DashboardLayout) ===

Component: src/layouts/DashboardLayout.tsx → sidebar component
Menu items with icons (from lucide-react):
  - Dashboard (overview)           → LayoutDashboard icon → /dashboard
  - My Sessions                    → Calendar icon → /dashboard/sessions
  - Health Tools                   → Heart icon → /dashboard/health-tools
    └─ Mood Tracker                → Smile icon → /dashboard/health-tools/mood
    └─ Meditation                  → Brain icon → /dashboard/health-tools/meditation
    └─ Journal                     → BookOpen icon → /dashboard/health-tools/journal
    └─ Breathing                   → Wind icon → /dashboard/health-tools/breathing
  - Courses                        → GraduationCap icon → /dashboard/courses
  - Soul Circle                    → Users icon → /dashboard/soul-circle
  - Soul Shop                      → ShoppingBag icon → /dashboard/shop
  - AI Assistant                   → Bot icon → /dashboard/ai-assistant
  - My Reports                     → FileText icon → /dashboard/reports
  - Settings / Profile             → Settings icon → /dashboard/settings
  - Complaints                     → MessageSquareWarning icon → /dashboard/complaints

Sidebar behavior:
  - Collapsible on mobile (hamburger menu)
  - Active item highlighted with primary color + left border
  - User avatar + name at top of sidebar
  - Logout button at bottom

=== PLACEHOLDER PAGES ===

Create each as a simple page with the page title and "Coming soon" message:
  - src/pages/dashboard/SessionsPage.tsx
  - src/pages/dashboard/HealthToolsPage.tsx
  - src/pages/dashboard/CoursesPage.tsx
  - src/pages/dashboard/SoulCirclePage.tsx
  - src/pages/dashboard/ShopPage.tsx
  - src/pages/dashboard/AIAssistantPage.tsx
  - src/pages/dashboard/ReportsPage.tsx
  - src/pages/dashboard/SettingsPage.tsx
  - src/pages/dashboard/ComplaintsPage.tsx

=== UI STATES ===

Dashboard page loading:
  - Full skeleton layout: skeleton sidebar + skeleton cards in main area
  - Use Shadcn Skeleton component for every widget
  - Stagger skeleton animation for visual polish

Dashboard error:
  - Error banner: "Failed to load dashboard data. Please refresh." + Retry button
  - Individual widget errors: widget shows "Unable to load" + retry link (don't fail entire page)

=== ROUTES ===

Wire all routes in src/router/index.tsx under ProtectedRoute + DashboardLayout:
  /dashboard → UserDashboardPage
  /dashboard/sessions → SessionsPage
  /dashboard/health-tools → HealthToolsPage
  /dashboard/health-tools/mood → MoodTrackerPage (placeholder)
  /dashboard/health-tools/meditation → MeditationPage (placeholder)
  /dashboard/health-tools/journal → JournalPage (placeholder)
  /dashboard/health-tools/breathing → BreathingPage (placeholder)
  /dashboard/courses → CoursesPage
  /dashboard/soul-circle → SoulCirclePage
  /dashboard/shop → ShopPage
  /dashboard/ai-assistant → AIAssistantPage
  /dashboard/reports → ReportsPage
  /dashboard/settings → SettingsPage
  /dashboard/complaints → ComplaintsPage

=== TEST SCENARIOS ===

- Login → see dashboard with all widgets populated
- New user (no data) → see empty states for each widget
- Click sidebar items → pages load correctly
- Mobile view → sidebar collapses → hamburger menu works
- Dashboard API fails → error banner with retry
- Click "Book Session" quick action → navigates to /dashboard/book-session
- Mark task as complete → task updates immediately (optimistic update)

VERIFY: Login → see dashboard with all sidebar items → click each → pages load.
All widgets show loading skeletons → then data → empty states where no data.
```

---

### PHASE 4: Therapy Booking & Session System
**Time estimate: 2-3 sessions**

```
TASK: Build the therapy booking flow with automatic therapist matching.

=== PRISMA MODELS ===

model Therapist {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  specializations   String[]    // e.g. ["anxiety", "depression", "trauma"]
  qualifications    String[]    // e.g. ["M.A. Clinical Psychology", "RCI Licensed"]
  experienceYears   Int         @default(0)
  languages         String[]    // e.g. ["english", "hindi", "marathi"]
  bio               String?
  sessionRate       Float       @default(0)    // rate per session in INR
  rating            Float       @default(0)    // average rating 0-5
  totalReviews      Int         @default(0)
  totalSessions     Int         @default(0)
  isVerified        Boolean     @default(false)
  isAvailable       Boolean     @default(true)
  gender            String?     // male, female, non-binary
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  availability      TherapistAvailability[]
  sessions          TherapySession[]

  @@index([specializations])
  @@index([rating])
  @@index([isAvailable, isVerified])
}

model TherapistAvailability {
  id            String   @id @default(cuid())
  therapistId   String
  therapist     Therapist @relation(fields: [therapistId], references: [id])
  dayOfWeek     Int      // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime     String   // "09:00" (24h format)
  endTime       String   // "17:00" (24h format)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  @@index([therapistId, dayOfWeek])
  @@unique([therapistId, dayOfWeek, startTime])
}

model TherapySession {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  therapistId     String
  therapist       Therapist @relation(fields: [therapistId], references: [id])
  scheduledAt     DateTime
  duration        Int       @default(50)   // minutes
  status          SessionStatus @default(REQUESTED)
  type            String    @default("individual")  // individual, couple, group
  notes           String?   // therapist session notes (post-session)
  cancelledAt     DateTime?
  cancelledBy     String?   // userId who cancelled
  cancellationReason String?
  rescheduleCount Int       @default(0)
  paymentId       String?
  paymentStatus   String    @default("pending")  // pending, paid, refunded
  roomId          String?   // Daily.co room ID (set when session starts)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  tasks           SessionTask[]
  request         SessionRequest?

  @@index([userId])
  @@index([therapistId])
  @@index([status])
  @@index([scheduledAt])
}

enum SessionStatus {
  REQUESTED            // user has requested a session
  ASTROLOGY_PENDING    // waiting for astrology analysis
  ASTROLOGY_COMPLETE   // astrology report ready
  SCHEDULED            // confirmed and scheduled
  IN_PROGRESS          // session is live
  COMPLETED            // session finished
  REVIEWED             // therapist has reviewed and added notes/tasks
  CANCELLED            // session was cancelled
  NO_SHOW              // user or therapist didn't show up
}

model SessionRequest {
  id              String   @id @default(cuid())
  sessionId       String   @unique
  session         TherapySession @relation(fields: [sessionId], references: [id])
  struggles       String[]     // what user wants to discuss
  preferences     Json         // { gender, language, time preferences }
  matchedTherapists Json       // array of { therapistId, score, reasons }
  selectedTherapistId String?  // which therapist user selected
  autoAssigned    Boolean  @default(false)
  createdAt       DateTime @default(now())
}

model SessionTask {
  id            String   @id @default(cuid())
  sessionId     String
  session       TherapySession @relation(fields: [sessionId], references: [id])
  title         String
  description   String?
  isComplete    Boolean  @default(false)
  completedAt   DateTime?
  dueDate       DateTime?
  createdAt     DateTime @default(now())

  @@index([sessionId])
}

=== MATCHING ALGORITHM ===

Score calculation for each therapist:
  score = (specialization_match * 0.4) + (rating * 0.3) + (availability * 0.2) + (language_match * 0.1)

Where:
  specialization_match (0 or 1):
    → 1 if therapist.specializations includes ANY of user's struggles
    → 0.5 if therapist.specializations includes related struggles
    → 0 if no match

  rating (0-1):
    → therapist.rating / 5.0

  availability (0 or 1):
    → 1 if therapist has open slot within user's preferred time window (next 7 days)
    → 0.5 if therapist has slot but outside preferred time
    → 0 if no slots available

  language_match (0 or 1):
    → 1 if therapist.languages includes ANY of user's preferred languages
    → 0.5 if therapist speaks English (universal fallback)
    → 0 if no match

Additional filters (hard requirements):
  - therapist.isVerified must be true
  - therapist.isAvailable must be true
  - If user has gender preference → filter by therapist.gender

Return: top 3 therapists sorted by score descending

=== SLOT GENERATION ===

For each therapist's availability on a given day:
  - Generate 50-minute slots with 10-minute buffer
  - Example: if startTime=09:00, endTime=17:00:
    → 09:00-09:50, 10:00-10:50, 11:00-11:50, 12:00-12:50, 13:00-13:50, 14:00-14:50, 15:00-15:50, 16:00-16:50
  - Exclude slots already booked (check TherapySession.scheduledAt)
  - Exclude slots in the past
  - Minimum 2 hours from now for booking (no last-minute bookings)

=== CANCELLATION POLICY ===

  - > 24 hours before session: free cancellation, full refund
  - 2-24 hours before session: 50% refund, 50% charge
  - < 2 hours before session: no cancellation allowed (return error)
  - Refund processed via original payment method within 5-7 business days

=== RESCHEDULE POLICY ===

  - Allowed once per session
  - Same cancellation window applies (> 2 hours before)
  - Second reschedule attempt → must cancel and rebook
  - Reschedule: PATCH /api/v1/therapy/sessions/:id/reschedule { newScheduledAt: DateTime }

=== WAITLIST ===

  - If no matching therapist has available slots → offer waitlist
  - User joins waitlist for specific therapist or any matching therapist
  - When slot opens → notify first person on waitlist via push + email
  - Waitlist position shown to user
  - Waitlist expires after 7 days → user notified to rebook

=== SESSION STATES FLOW ===

  requested → astrology-pending → astrology-complete → scheduled → in-progress → completed → reviewed
  At any point before in-progress: can transition to → cancelled
  If no-show after 15 min past scheduledAt → automatically set to → no-show

=== PRE-SESSION CHECKLIST (shown to user before joining) ===

  □ Consent to session recording (required)
  □ Astrology report attached (auto-checked if available)
  □ Review previous session tasks (if any)
  □ Quiet, private space confirmed
  □ Stable internet connection

=== POST-SESSION FLOW ===

After session status = COMPLETED:
  1. Therapist adds tasks → POST /api/v1/therapy/sessions/:id/tasks (array of tasks)
  2. Therapist writes session notes (private, only visible to therapist + admin)
  3. Therapist rates astrology prediction accuracy (if applicable)
  4. Once all done → therapist marks session as "reviewed"
  5. User sees assigned tasks on their dashboard
  6. User can mark tasks as complete: PATCH /api/v1/tasks/:id/complete

=== API ENDPOINTS ===

POST /api/v1/therapy/request
  Request body: { struggles: string[], preferences: { gender?: string, language?: string[], time?: string } }
  Response: { success: true, data: { sessionId: string, matchedTherapists: [{ id, name, avatar, specializations, rating, matchScore, availableSlots: [{ date, time }] }] } }

POST /api/v1/therapy/sessions/:id/select-therapist
  Request body: { therapistId: string, scheduledAt: string (ISO datetime) }
  Response: { success: true, data: { session: TherapySession } }

GET /api/v1/therapy/sessions
  Query: ?status=scheduled&page=1&limit=10
  Response: { success: true, data: { sessions: TherapySession[], total: number, page: number } }

GET /api/v1/therapy/sessions/:id
  Response: { success: true, data: { session: TherapySession, tasks: SessionTask[], astrologyReport?: AstrologyReport } }

PATCH /api/v1/therapy/sessions/:id/cancel
  Request body: { reason: string }
  Response: { success: true, data: { refundAmount: number, refundPercentage: number } }

PATCH /api/v1/therapy/sessions/:id/reschedule
  Request body: { newScheduledAt: string }
  Response: { success: true, data: { session: TherapySession } }

POST /api/v1/therapy/sessions/:id/tasks
  Request body: { tasks: [{ title: string, description?: string, dueDate?: string }] }
  Response: { success: true, data: { tasks: SessionTask[] } }

PATCH /api/v1/tasks/:id/complete
  Response: { success: true, data: { task: SessionTask } }

GET /api/v1/therapy/therapists/:id/slots
  Query: ?startDate=2025-01-15&endDate=2025-01-22
  Response: { success: true, data: { slots: [{ date: string, times: [{ start: string, end: string, available: boolean }] }] } }

POST /api/v1/therapy/waitlist
  Request body: { therapistId?: string, struggles: string[], preferences: object }
  Response: { success: true, data: { waitlistId: string, position: number } }

=== ZOD SCHEMAS ===

const sessionRequestSchema = z.object({
  struggles: z.array(z.string()).min(1, 'Select at least one issue'),
  preferences: z.object({
    gender: z.enum(['male', 'female', 'no-preference']).optional(),
    language: z.array(z.string()).optional(),
    time: z.enum(['morning', 'afternoon', 'evening', 'night', 'flexible']).optional()
  }).optional()
});

const selectTherapistSchema = z.object({
  therapistId: z.string().cuid(),
  scheduledAt: z.string().datetime()
});

const cancelSessionSchema = z.object({
  reason: z.string().min(1, 'Please provide a reason').max(500)
});

const rescheduleSchema = z.object({
  newScheduledAt: z.string().datetime()
});

const addTasksSchema = z.object({
  tasks: z.array(z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    dueDate: z.string().datetime().optional()
  })).min(1).max(10)
});

=== ERROR CODES ===

THERAPY_001: No matching therapists found
THERAPY_002: Slot no longer available (booked by someone else)
THERAPY_003: Cannot cancel within 2 hours of session
THERAPY_004: Session already cancelled
THERAPY_005: Reschedule limit reached (max 1 per session)
THERAPY_006: Invalid session status for this action
THERAPY_007: Therapist not available
THERAPY_008: Session not found
THERAPY_009: Payment required before confirming

=== FRONTEND COMPONENTS ===

BookSessionPage (src/pages/dashboard/BookSessionPage.tsx):
  Step 1 — Select issue: multi-select chips from struggles list
  Step 2 — See matched therapists: 3 cards with therapist info + match score + "View Slots" button
  Step 3 — Select time slot: weekly calendar view with available slots highlighted in green
  Step 4 — Confirm + Pay: session summary + PaymentModal
  Step 5 — Confirmation: success checkmark + session details + "Add to Calendar" button

  UI States:
    - Finding therapists: skeleton cards + "Finding the best match for you..." text
    - No therapists: "No therapists available right now. Join waitlist?" + waitlist button
    - Loading slots: skeleton calendar
    - Payment processing: loading overlay on PaymentModal
    - Booking confirmed: green checkmark animation + confetti

SessionDetailPage (src/pages/dashboard/SessionDetailPage.tsx):
  Props: sessionId from URL params
  Sections:
    - Session info: date, time, duration, status badge
    - Therapist info: name, avatar, specializations, rating
    - Join button: visible 10 min before scheduledAt, large green button "Join Session"
    - Pre-session checklist (if status is SCHEDULED)
    - Astrology report card (if status >= ASTROLOGY_COMPLETE)
    - Session recording player (if status is COMPLETED/REVIEWED)
    - Assigned tasks list with checkboxes (if status is REVIEWED)
    - Session notes (visible only to therapist)

TherapistCalendar (src/components/therapy/TherapistCalendar.tsx):
  Props: { therapistId: string, onSlotSelect: (slot: Slot) => void }
  Display: Weekly view (Mon-Sun) with time rows (9am-8pm)
  Available slots: green cells, clickable
  Booked slots: gray cells, not clickable
  Selected slot: primary color highlight
  Navigation: prev/next week arrows

=== TEST SCENARIOS ===

- Request session → 3 therapists returned sorted by score → select one → book slot → payment → confirmed
- Request session with no matching therapists → waitlist offered
- Book slot that was just taken → THERAPY_002 error → refresh slots
- Cancel > 24h before → full refund
- Cancel 2-24h before → 50% refund
- Cancel < 2h before → error THERAPY_003
- Reschedule once → success
- Reschedule twice → error THERAPY_005
- Session time arrives → "Join" button appears → click → video room (Phase 5)
- No show after 15min → auto-set to NO_SHOW
- Therapist adds tasks post-session → user sees on dashboard

VERIFY: Book a session → therapist matched → session created → tasks assigned.
Cancel/reschedule flows work correctly. Waitlist works when no slots available.
```
### PHASE 5: Video Calling & Session Recording
**Time estimate: 1-2 sessions**

```
TASK: Integrate video calling for therapy sessions with recording + transcription.

=== PRISMA MODELS ===

model SessionRecording {
  id              String   @id @default(cuid())
  sessionId       String   @unique
  session         TherapySession @relation(fields: [sessionId], references: [id])
  roomId          String      // Daily.co room ID
  recordingUrl    String?     // S3 URL after upload
  s3Key           String?     // S3 object key: sessions/{sessionId}/{timestamp}.webm
  duration        Int?        // recording duration in seconds
  fileSize        Int?        // file size in bytes
  status          RecordingStatus @default(PENDING)
  consentGiven    Boolean     @default(false)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  transcription   SessionTranscription?

  @@index([sessionId])
}

enum RecordingStatus {
  PENDING          // room created, waiting for session
  RECORDING        // session in progress, recording active
  UPLOADING        // session ended, uploading to S3
  TRANSCRIBING     // uploaded, transcription in progress
  COMPLETE         // transcription done, everything ready
  FAILED           // something went wrong
}

model SessionTranscription {
  id              String   @id @default(cuid())
  recordingId     String   @unique
  recording       SessionRecording @relation(fields: [recordingId], references: [id])
  fullText        String      // complete transcription
  textUrl         String?     // S3 URL: sessions/{sessionId}/{timestamp}.txt
  jsonUrl         String?     // S3 URL: sessions/{sessionId}/{timestamp}.json (with timestamps)
  keyPoints       String[]    // AI-extracted key points
  actionItems     String[]    // AI-extracted action items
  sentiment       Json?       // { overall: number, segments: [{ time, score }] }
  language        String      @default("en")
  createdAt       DateTime    @default(now())

  @@index([recordingId])
}

=== DAILY.CO ROOM CONFIGURATION ===

Room creation API call (server-side):
  POST https://api.daily.co/v1/rooms
  Headers: { Authorization: "Bearer DAILY_API_KEY" }
  Body: {
    name: "session-{sessionId}",
    privacy: "private",
    properties: {
      enable_recording: "cloud",
      max_participants: 2,
      enable_knocking: true,
      enable_screenshare: true,
      enable_chat: true,
      exp: Math.floor(Date.now() / 1000) + 7200,  // expires 2 hours after creation
      eject_at_room_exp: true,
      enable_prejoin_ui: false  // we use our own prejoin
    }
  }

Meeting token (per participant):
  POST https://api.daily.co/v1/meeting-tokens
  Body: {
    properties: {
      room_name: "session-{sessionId}",
      user_name: user.name,
      user_id: user.id,
      is_owner: role === 'THERAPIST',
      enable_recording: "cloud",
      start_cloud_recording: role === 'THERAPIST'  // therapist auto-starts recording
    }
  }

=== API ENDPOINTS ===

POST /api/v1/therapy/sessions/:id/room
  Auth: verifyToken + requireRole(USER, THERAPIST)
  Steps:
    1. Fetch session, verify user is participant
    2. If session.roomId exists → return existing room
    3. Create Daily.co room via API
    4. Generate meeting token for this user
    5. Create SessionRecording record (status: PENDING)
    6. Update session.roomId
    7. Return { roomUrl, token, roomId }
  Response: { success: true, data: { roomUrl: "https://soulyatri.daily.co/session-xxx", token: "eyJ...", roomId: "session-xxx" } }

POST /api/v1/therapy/sessions/:id/recording/consent
  Auth: verifyToken
  Request body: { consent: boolean }
  Steps:
    1. Update SessionRecording.consentGiven = true
    2. Both participants must consent before recording starts
  Response: { success: true }

POST /api/v1/therapy/sessions/:id/recording/complete
  Auth: internal (webhook from Daily.co)
  Webhook payload from Daily.co: { event: "recording.ready", recording: { ... } }
  Steps:
    1. Download recording from Daily.co CDN
    2. Upload to S3 bucket "soul-yatri-recordings" at path: sessions/{sessionId}/{timestamp}.webm
    3. Update SessionRecording: recordingUrl, s3Key, duration, fileSize, status = UPLOADING → TRANSCRIBING
    4. Queue transcription job (Bull queue)

GET /api/v1/therapy/sessions/:id/recording
  Auth: verifyToken (only session participants + admin)
  Response: { success: true, data: { recording: { url (presigned S3 URL, 1h expiry), duration, status }, transcription: { keyPoints, actionItems, sentiment } } }

=== S3 STORAGE ===

Bucket: soul-yatri-recordings
Path structure:
  sessions/{sessionId}/{timestamp}.webm        — video recording
  sessions/{sessionId}/{timestamp}.txt          — plain text transcription
  sessions/{sessionId}/{timestamp}.json         — timestamped transcription JSON

S3 config:
  - Region: ap-south-1 (Mumbai)
  - Encryption: AES-256 server-side encryption
  - Access: private (presigned URLs only, 1h expiry)
  - Lifecycle: recordings auto-deleted after 90 days (configurable)
  - CORS: restricted to soulyatri.com domain

=== TRANSCRIPTION PIPELINE (background job) ===

Queue: Bull queue "transcription"
Steps:
  1. Download audio from S3
  2. Send to OpenAI Whisper API:
     const response = await openai.audio.transcriptions.create({
       file: audioStream,
       model: "whisper-1",
       language: "en",  // or detected language
       response_format: "verbose_json",  // includes timestamps
       timestamp_granularities: ["segment"]
     });
  3. Save full text to S3 as .txt
  4. Save timestamped JSON to S3 as .json
  5. Extract key points using GPT-4o-mini:
     System prompt: "Extract 5-10 key discussion points from this therapy session transcript. Be concise. Focus on: main issues discussed, emotional breakthroughs, goals mentioned, homework agreed upon."
  6. Extract action items using GPT-4o-mini:
     System prompt: "Extract specific action items and homework tasks from this therapy session transcript. Format as clear, actionable items."
  7. Run sentiment analysis on segments
  8. Save all to SessionTranscription record
  9. Update SessionRecording.status = COMPLETE
  10. Notify therapist: "Session recording and transcript are ready"

=== BANDWIDTH DETECTION ===

Before joining:
  1. Run bandwidth test: fetch a small test file (100KB) from CDN → measure download speed
  2. If < 500kbps → show notification: "Low bandwidth detected. Switching to audio-only mode for better quality."
  3. Set Daily.co config: { videoEnabled: false } for audio-only
  4. User can manually toggle video on/off at any time
  5. Show bandwidth indicator in video controls (green/yellow/red icon)

=== RECORDING CONSENT FLOW ===

Before joining session:
  1. Modal popup: "This session will be recorded for your reference and quality assurance."
  2. Sub-text: "The recording will be stored securely and only accessible to you, your therapist, and authorized administrators."
  3. Buttons: "I Consent" (primary), "I Do Not Consent" (secondary)
  4. If consent denied → session proceeds WITHOUT recording, SessionRecording.consentGiven = false
  5. Both participants must consent for recording to start

=== FALLBACK HANDLING ===

If Daily.co is down or room creation fails:
  1. Show error: "Video service is temporarily unavailable."
  2. Offer options:
     a. "Try Again" button (retry room creation)
     b. "Reschedule Session" button → reschedule flow
     c. "Contact Support" link
  3. Log error to monitoring system (Sentry)
  4. Admin notified of video service outage

=== FRONTEND COMPONENTS ===

VideoRoom (src/components/video/VideoRoom.tsx):
  Props: { roomUrl: string, token: string, userName: string, onLeave: () => void }
  State: { isConnected: boolean, isRecording: boolean, participantCount: number, bandwidth: 'good'|'fair'|'poor' }
  Library: @daily-co/daily-react
  Renders: Daily.co iframe or custom UI using daily-js

VideoControls (src/components/video/VideoControls.tsx):
  Props: { onMute: () => void, onCameraToggle: () => void, onScreenShare: () => void, onLeave: () => void, isMuted: boolean, isCameraOff: boolean, isScreenSharing: boolean }
  Display: Bottom bar with icon buttons
  Buttons: Mic (toggle), Camera (toggle), Screen Share (toggle), Chat (toggle sidebar), Leave (red button)
  Leave confirmation: "Are you sure you want to leave the session?" dialog

PreJoinCheck (src/components/video/PreJoinCheck.tsx):
  Props: { onReady: () => void }
  Steps:
    1. Check camera permission → show preview
    2. Check microphone permission → show audio level meter
    3. Run bandwidth test → show result
    4. "Join Session" button enabled when all checks pass

ChatSidebar (src/components/video/ChatSidebar.tsx):
  Props: { roomId: string }
  Display: Slide-in panel from right, text chat during session
  Features: Send text messages, timestamps, scroll to bottom on new message

=== ERROR CODES ===

VIDEO_001: Room creation failed — Daily.co API error
VIDEO_002: Invalid meeting token — token expired or invalid
VIDEO_003: Session not found or not authorized
VIDEO_004: Recording not available — consent not given or processing
VIDEO_005: Transcription failed — Whisper API error
VIDEO_006: Bandwidth too low — cannot establish connection

=== UI STATES ===

Pre-join: camera preview + mic check + bandwidth test → "Join Session" button
Connecting: "Connecting to session..." spinner
Connected: video feeds showing, controls at bottom
Waiting for other participant: "Waiting for {therapist/client} to join..." with avatar
Recording: red dot indicator + "Recording" text in top-right
Low bandwidth: yellow banner "Low bandwidth — audio-only mode" with option to retry video
Disconnected: "Connection lost. Attempting to reconnect..." with countdown
Session ended: "Session ended" screen → links to recording, feedback form

=== TEST SCENARIOS ===

- Create room → both participants join → video and audio work
- Recording consent flow → both consent → recording starts → red indicator visible
- One participant denies consent → session proceeds without recording
- Session ends → recording uploaded to S3 → transcription generated → key points extracted
- Low bandwidth → audio-only mode activated → notification shown
- Daily.co down → error shown → reschedule offered
- View session recording after session → presigned URL works → plays in browser
- Admin accesses recording → audit log entry created

VERIFY: Start session → video works → recording saved → transcript generated.
Consent flow works. Bandwidth detection works. Fallback to reschedule on failure.
```

---

### PHASE 6: AI Voice Assistant
**Time estimate: 2 sessions**

```
TASK: Build 24/7 AI voice/text assistant with emergency flagging.

=== PRISMA MODELS ===

model AIConversation {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  title         String?     // auto-generated from first message
  mode          String      @default("text")  // text, voice
  messageCount  Int         @default(0)
  lastMessageAt DateTime?
  summary       String?     // summary of older messages (context compression)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  messages      AIMessage[]

  @@index([userId])
  @@index([lastMessageAt])
}

model AIMessage {
  id              String   @id @default(cuid())
  conversationId  String
  conversation    AIConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role            String      // "user" or "assistant"
  content         String
  audioUrl        String?     // S3 URL for voice messages
  sentiment       Float?      // -1 to 1
  flagged         Boolean     @default(false)  // crisis keyword detected
  flagReason      String?     // which crisis keyword triggered
  tokens          Int?        // token count for this message
  createdAt       DateTime    @default(now())

  @@index([conversationId])
  @@index([flagged])
}

model CrisisKeyword {
  id          String   @id @default(cuid())
  keyword     String   @unique
  category    String      // "self-harm", "suicide", "abuse", "violence"
  severity    String      @default("high")  // high, critical
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([isActive])
}

=== SYSTEM PROMPT ===

const SYSTEM_PROMPT = `You are Soul Yatri's wellness assistant. Your name is Aura.

PERSONALITY:
- You are warm, empathetic, and non-judgmental
- You speak in a calm, supportive tone
- You validate emotions before offering suggestions
- You use the user's name when appropriate

STRICT RULES:
- You do NOT diagnose any mental health condition
- You do NOT prescribe medication or suggest changing medication
- You do NOT provide medical advice
- You encourage seeking professional help (therapy, counseling)
- If someone expresses anything related to self-harm, suicide, or abuse,
  you IMMEDIATELY:
  1. Acknowledge their pain
  2. Express that help is available
  3. Provide crisis helpline numbers
  4. Do NOT try to counsel them yourself
  5. Flag the conversation for human review

CRISIS HELPLINES (always show these for crisis):
- Vandrevala Foundation: 1860-2662-345 (24/7)
- iCall: 9152987821
- AASRA: 91-22-27546669
- International: Crisis Text Line — text HOME to 741741

CAPABILITIES:
- Mood check-ins and emotional support
- Guided breathing exercises (walk them through box breathing, 4-7-8)
- Mindfulness and grounding techniques
- Journaling prompts
- General wellness tips
- Recommend platform features (meditation, courses, therapy booking)

CONTEXT AWARENESS:
- You have access to the user's recent mood logs (if shared)
- You remember the conversation context within this chat
- You can reference previous messages in the conversation`;

=== CONVERSATION MEMORY ===

Strategy:
  - Keep last 20 messages in context window (sent to OpenAI as messages array)
  - When conversation exceeds 20 messages:
    1. Take messages 1-10 (oldest batch)
    2. Summarize using GPT-4o-mini: "Summarize this conversation so far in 3-4 sentences"
    3. Store summary in AIConversation.summary
    4. Delete old messages from context (keep in DB for history)
    5. Prepend summary as a system message: "Previous conversation summary: {summary}"
  - This keeps context under ~4000 tokens while preserving conversation continuity

=== RATE LIMITING ===

  - Free users: 50 messages per hour, max 5 conversations per day
  - Seeker tier: unlimited messages, unlimited conversations
  - Healer tier: unlimited + priority response (faster model)
  - Enlightened tier: unlimited + GPT-4o (best model) + voice mode
  - Rate limit response: { code: "AI_001", message: "Message limit reached. Upgrade for unlimited access." }
  - Header: X-RateLimit-Remaining, X-RateLimit-Reset

=== CRISIS DETECTION ===

Before EVERY user message is sent to AI:
  1. Fetch active crisis keywords from CrisisKeyword table (cache for 5 min)
  2. Check user message against keywords (case-insensitive, partial match)
  3. Default keywords (seeded in DB, admin can add/edit):
     Category "suicide": "kill myself", "end my life", "want to die", "suicidal", "no reason to live", "better off dead"
     Category "self-harm": "cut myself", "hurt myself", "self harm", "self-harm", "burning myself"
     Category "abuse": "being abused", "hitting me", "molested", "raped", "sexual abuse", "domestic violence"
     Category "violence": "kill someone", "hurt someone", "violent thoughts"
  4. If keyword detected:
     a. Flag message: AIMessage.flagged = true, flagReason = matched keyword
     b. Create EmergencyFlag record (links to user, conversation, severity)
     c. Send real-time notification to assigned therapist + admin via Socket.IO
     d. AI response includes crisis helpline numbers prominently
     e. Log event for audit trail

=== API ENDPOINTS ===

POST /api/v1/ai/chat
  Auth: verifyToken
  Request body: { conversationId?: string, message: string }
  Response: Server-Sent Events (SSE) stream
  Headers: Content-Type: text/event-stream
  Steps:
    1. Rate limit check → AI_001 if exceeded
    2. Create or fetch conversation
    3. Save user message to AIMessage
    4. Run crisis keyword check → flag if detected
    5. Build messages array (system prompt + summary + last 20 messages)
    6. Call OpenAI:
       const stream = await openai.chat.completions.create({
         model: tier === 'enlightened' ? 'gpt-4o' : 'gpt-4o-mini',
         messages: messagesArray,
         stream: true,
         max_tokens: 1000,
         temperature: 0.7
       });
    7. Stream tokens to client via SSE: data: { token: "word" }
    8. On stream end: save complete AI message to AIMessage
    9. Run sentiment analysis on user message (background)
    10. Send final event: data: { done: true, messageId: "xxx" }

POST /api/v1/ai/voice
  Auth: verifyToken
  Request body: FormData with audio file (webm/mp3)
  Steps:
    1. Rate limit check
    2. Transcribe audio with Whisper: openai.audio.transcriptions.create({ file, model: "whisper-1" })
    3. Process as text message (same pipeline as /chat)
    4. Generate voice response with OpenAI TTS:
       const audio = await openai.audio.speech.create({
         model: "tts-1",
         voice: "nova",  // warm, supportive female voice
         input: aiResponseText
       });
    5. Upload response audio to S3
    6. Return { transcribedText, responseText, audioUrl }

GET /api/v1/ai/conversations
  Auth: verifyToken
  Response: { conversations: [{ id, title, lastMessageAt, messageCount }], total, page }

GET /api/v1/ai/conversations/:id
  Auth: verifyToken
  Response: { conversation: { id, title, messages: AIMessage[], createdAt } }

DELETE /api/v1/ai/conversations/:id
  Auth: verifyToken
  Response: { success: true }

=== AI RESPONSE STREAMING (SSE) ===

Client-side implementation:
  const eventSource = new EventSource(`/api/v1/ai/chat?conversationId=${id}`);
  // Or use fetch with ReadableStream for POST:
  const response = await fetch('/api/v1/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conversationId, message })
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    // Parse SSE: "data: {token}\n\n"
    // Append token to AI message bubble in real-time
  }

=== FRONTEND COMPONENTS ===

AIAssistantPage (src/pages/dashboard/AIAssistantPage.tsx):
  Props: none
  State: {
    conversations: AIConversation[],
    activeConversation: string | null,
    messages: AIMessage[],
    input: string,
    isStreaming: boolean,
    mode: 'text' | 'voice',
    isRecording: boolean
  }
  Layout: sidebar (conversation list) + main area (chat)

ChatBubble (src/components/ai/ChatBubble.tsx):
  Props: { message: AIMessage, isUser: boolean }
  Display:
    - User messages: right-aligned, primary color background
    - AI messages: left-aligned, gray background, AI avatar
    - Timestamp below each message (relative: "2 min ago")
    - Copy button (clipboard icon) on hover
    - Streaming indicator: blinking cursor at end while tokens arriving

TypingIndicator (src/components/ai/TypingIndicator.tsx):
  Props: none
  Display: Three animated dots ("...") in AI message area while waiting for response

VoiceMode (src/components/ai/VoiceMode.tsx):
  Props: { onAudioCaptured: (blob: Blob) => void }
  UI:
    - Large circular button: hold to talk
    - While holding: waveform visualization (audio level bars)
    - Processing: spinner + "Thinking..." text
    - AI speaking: speaker icon pulsing + audio playback
  Library: MediaRecorder API for audio capture

CrisisBanner (src/components/ai/CrisisBanner.tsx):
  Props: { show: boolean }
  Display: Fixed red banner at top of chat:
    "If you're in crisis, please reach out:
     Vandrevala Foundation: 1860-2662-345 (24/7)
     iCall: 9152987821
     You are not alone. ❤️"
  Shown when: crisis keyword detected in user's message

=== ERROR CODES ===

AI_001: Rate limit exceeded — message limit reached for current plan
AI_002: Conversation not found
AI_003: AI service unavailable — OpenAI API error
AI_004: Audio processing failed — invalid audio format or too long
AI_005: Conversation deleted

=== UI STATES ===

Loading: Skeleton chat list + empty main area
Empty: "Start a conversation with Aura, your wellness companion" + suggested prompts
Streaming: AI message bubble growing word by word + typing indicator
Voice recording: waveform + "Recording..." label
Voice processing: spinner + "Processing your message..."
Error: Red toast "Something went wrong. Please try again."
Rate limited: Modal "You've reached your message limit. Upgrade to continue." + upgrade CTA
Crisis detected: Red banner with helpline numbers (persists until dismissed)

=== PATTERN DETECTION (background job) ===

Cron: runs every 6 hours
Steps:
  1. For each user with recent AI conversations (last 7 days):
  2. Analyze mood logs + journal entries + AI chat sentiment scores
  3. Calculate 7-day sentiment trend (average sentiment per day)
  4. If trend is declining (3+ consecutive days of declining sentiment):
     a. Flag pattern: "declining-mood-pattern"
     b. Notify assigned therapist: "Client {name}'s mood has been declining over the past week"
     c. AI assistant adjusts tone to be more supportive in next conversation
  5. If any crisis flags in last 7 days → escalate to admin

=== TEST SCENARIOS ===

- Send text message → AI responds with streaming tokens
- Send message with crisis keyword "I want to end my life" → crisis banner shown + therapist notified + helpline numbers in response
- Voice mode: hold to talk → audio captured → transcribed → AI responds with voice
- Reach rate limit (50 messages) → AI_001 error → upgrade prompt shown
- Start new conversation → title auto-generated from first message
- View conversation history → all past conversations listed in sidebar
- Delete conversation → confirmation dialog → conversation removed
- Long conversation (30+ messages) → older messages summarized → context maintained
- AI should never diagnose or prescribe → test with "Do I have depression?" → should encourage professional help

VERIFY: Chat with AI → negative message → flag created → therapist notified.
Voice mode works. Rate limiting works. Crisis detection works.
```

---

### PHASE 7: Astrologer System
**Time estimate: 2-3 sessions**

```
TASK: Build astrologer dashboard, pre-session analysis workflow, brownie point
system, and prediction accuracy tracking.

CONTEXT: Types in src/types/astrology.types.ts.
AstrologerProfile has: browniePoints, predictionAccuracyRate, tier.
AstrologyPrediction has: accuracyResult, browniePointsAwarded.

STEP 1 — Prisma models: Astrologer, KundaliChart, AstrologyReport, AstrologyPrediction

STEP 2 — Pre-session workflow: When therapy session is booked:
  - 1-3 hours before, auto-create astrology task
  - Astrologer sees client's birth data + chart (Parasara Light format)
  - AI system also analyzes chart data independently
  - Astrologer writes predictions, personality traits, challenge periods
  - Multiple astrologers can vote on predictions (poll system)
  - Highest-voted predictions sent to therapist before session

STEP 3 — Brownie Point System:
  - After therapy session, therapist confirms prediction accuracy:
    • 'accurate' → +3 brownie points to astrologer
    • 'partially-accurate' → +1 brownie point
    • 'inaccurate' → 0 points (no penalty)
    • 'unverifiable' → 0 points
  - Brownie points determine astrologer tier:
    • Bronze: 0-49 points (new astrologers)
    • Silver: 50-149 points
    • Gold: 150-299 points
    • Platinum: 300-499 points
    • Diamond: 500+ points
  - Higher tier = more visibility to users + higher session rates
  - Prediction accuracy rate tracked: correctPredictions / totalPredictions
  - Leaderboard on admin dashboard (top astrologers by accuracy)

STEP 4 — AI-Assisted Kundali Analysis:
  - AI (GPT-4o with Vedic astrology knowledge) analyzes chart alongside astrologer
  - AI generates its own set of predictions
  - Both AI and astrologer predictions presented to poll
  - This helps catch inconsistencies and improve accuracy
  - Over time, AI accuracy compared to astrologer accuracy

STEP 5 — Astrologer Dashboard: src/pages/astrologer/
  - Pending analyses (pre-therapy tasks)
  - Client charts (kundali viewer with dasha/subdasha timeline)
  - Direct consultations (bookable by users)
  - Prediction accuracy tracking + brownie points + tier progress
  - Revenue & stats
  - Profile management (/astrologer/profile)

STEP 6 — Integration with therapist view:
  - Therapist sees astrology report on session detail page
  - After session: prompt to confirm/deny prediction accuracy
  - Accuracy feedback auto-awards brownie points

VERIFY: Book therapy → astrologer gets notification → writes report →
AI also generates predictions → poll determines top predictions →
therapist sees report → after session confirms accuracy →
astrologer gets brownie points → tier upgrades.
```

---

### PHASE 8: Therapist Dashboard
**Time estimate: 1-2 sessions**

```
TASK: Build therapist dashboard with client management and proactive notifications.

=== PRISMA MODEL ADDITIONS ===

model TherapistNote {
  id            String   @id @default(cuid())
  therapistId   String
  therapist     Therapist @relation(fields: [therapistId], references: [id])
  clientId      String
  client        User     @relation(fields: [clientId], references: [id])
  sessionId     String?
  session       TherapySession? @relation(fields: [sessionId], references: [id])
  content       String      // rich text (HTML from Tiptap)
  lastSavedAt   DateTime    @default(now())
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([therapistId, clientId])
  @@index([sessionId])
}

=== DASHBOARD WIDGETS ===

1. ClientCountCard:
   Component: src/components/therapist/ClientCountCard.tsx
   Props: { totalClients: number, activeClients: number, newThisMonth: number }
   Display: Large number with trend arrow (up/down compared to last month)

2. UpcomingSessionsCard:
   Component: src/components/therapist/UpcomingSessionsCard.tsx
   Props: { sessions: TherapySession[] } // next 7 days
   Display: List of sessions with client avatar, name, date/time, session type
   Actions: click → go to session detail, "Start Session" button if within 10min

3. EarningsCard:
   Component: src/components/therapist/EarningsCard.tsx
   Props: { earningsThisMonth: number, earningsLastMonth: number, pendingPayout: number }
   Display: ₹XX,XXX with comparison to last month, "Request Payout" link

4. PendingTasksCard:
   Component: src/components/therapist/PendingTasksCard.tsx
   Props: { pendingCount: number, overdueCount: number }
   Display: count of tasks assigned to clients that are pending + overdue count in red

5. AlertBanner:
   Component: src/components/therapist/AlertBanner.tsx
   Props: { alerts: Alert[] }
   Display: Red/yellow banner at top if any client has:
     - Emergency flag active
     - Declining mood pattern (3+ days)
     - Missed multiple tasks
   Each alert: client name + reason + "View" link

=== CALENDAR INTEGRATION ===

Library: FullCalendar.js (@fullcalendar/react)
Component: src/components/therapist/TherapistCalendar.tsx
Props: { therapistId: string }
Views: week (default), day, month
Features:
  - Sessions shown as colored blocks (green=scheduled, blue=completed, red=cancelled)
  - Click session → popover with details + "View Session" link
  - Drag to reschedule (confirmation dialog before saving)
  - Set availability: click empty slot → "Set Available" dialog
  - Blocked time slots shown in gray

=== CLIENT NOTES (Rich Text) ===

Editor: Tiptap (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-placeholder)
Component: src/components/therapist/ClientNotes.tsx
Props: { therapistId: string, clientId: string, sessionId?: string }
Features:
  - Rich text: bold, italic, heading, bullet list, numbered list
  - Auto-save every 30 seconds: PATCH /api/v1/therapist/notes/:id
  - Save indicator: "Saved" / "Saving..." / "Unsaved changes"
  - Notes per session (linked to sessionId) and general notes (no sessionId)
  - Notes are PRIVATE — only visible to this therapist + admin

=== POST-SESSION CHECKLIST ===

Component: src/components/therapist/PostSessionChecklist.tsx
Props: { sessionId: string, onComplete: () => void }
Display: After session ends, therapist sees checklist:
  1. ☐ View transcription key points — click → opens transcript viewer
  2. ☐ Add healing tasks — click → opens task creation form
  3. ☐ Write session notes — click → opens Tiptap note editor
  4. ☐ Rate astrology accuracy — click → opens accuracy rating (accurate/partial/inaccurate/unverifiable)
  5. ☐ Submit — all checked → POST /api/v1/therapy/sessions/:id/review → session status = REVIEWED

Each item auto-checks when completed. Submit button disabled until 1-3 are done (4 optional if no astrology report).

=== REVENUE PAGE ===

Component: src/pages/therapist/RevenuePage.tsx
Sections:
  1. Monthly earnings chart: Recharts BarChart, last 12 months
  2. Payout history table: columns (Date, Amount, Status, Method)
  3. Pending balance card: current unpaid earnings
  4. "Request Payout" button → POST /api/v1/payments/payouts/request
     - Minimum payout: ₹500
     - Processing time: 3-5 business days
     - Payout to bank account on file

API endpoints:
  GET /api/v1/therapist/revenue
    Response: { earningsThisMonth, earningsLastMonth, totalEarnings, pendingPayout, monthlyData: [{ month, amount }] }

  GET /api/v1/therapist/revenue/payouts
    Response: { payouts: [{ id, amount, status, method, processedAt, createdAt }], total, page }

=== THERAPIST PAGES ===

src/pages/therapist/:
  - TherapistDashboardPage.tsx: overview stats, upcoming sessions, alerts, quick actions
  - ClientsPage.tsx: table of all assigned clients with search, filter by status
  - ClientDetailPage.tsx: full client history — mood trends (Recharts), session recordings, tasks, notes, astrology reports
  - SessionsPage.tsx: calendar view (FullCalendar) of all sessions
  - RevenuePage.tsx: earnings breakdown, payout history
  - ReviewsPage.tsx: client feedback and ratings, average rating card

=== PROACTIVE NOTIFICATION SYSTEM ===

Notifications sent to therapist:
  1. Client mood decline: if client's mood logs show 3+ consecutive declining days
     → "⚠️ {Client Name}'s mood has been declining for {N} days. Consider reaching out."
  2. Client missed tasks: if client has 3+ overdue tasks
     → "📋 {Client Name} has {N} overdue healing tasks."
  3. Emergency flag: if client triggers crisis keyword in AI chat or community
     → "🚨 URGENT: {Client Name} triggered an emergency flag. Immediate attention needed."
  4. Pre-session astrology report ready:
     → "📊 Astrology report for {Client Name}'s session on {date} is ready. Review before session."
  5. New client assigned:
     → "👋 New client {Client Name} has been assigned to you."
  6. Session reminder (1 hour before):
     → "⏰ Session with {Client Name} starts in 1 hour."

Delivery: Socket.IO real-time + in-app notification bell + email (for critical)

=== API ENDPOINTS ===

GET /api/v1/therapist/dashboard
  Response: { clientCount, activeClients, upcomingSessions, earningsThisMonth, pendingTasks, alerts }

GET /api/v1/therapist/clients
  Query: ?search=name&status=active&page=1&limit=20
  Response: { clients: [{ id, name, avatar, lastSession, moodTrend, activeTasks }], total }

GET /api/v1/therapist/clients/:id
  Response: { client: User, sessions: TherapySession[], moodLogs: MoodLog[], tasks: SessionTask[], notes: TherapistNote[] }

POST /api/v1/therapist/notes
  Body: { clientId, sessionId?, content }
  Response: { note: TherapistNote }

PATCH /api/v1/therapist/notes/:id
  Body: { content }
  Response: { note: TherapistNote }

POST /api/v1/therapy/sessions/:id/review
  Body: { astrologyAccuracy?: 'accurate'|'partially-accurate'|'inaccurate'|'unverifiable' }
  Response: { session: TherapySession }  // status = REVIEWED

=== ERROR CODES ===

THERAPIST_001: Client not assigned to this therapist
THERAPIST_002: Session not found or not yours
THERAPIST_003: Post-session checklist incomplete — cannot mark as reviewed
THERAPIST_004: Payout request below minimum (₹500)
THERAPIST_005: Payout account not configured

=== TEST SCENARIOS ===

- Login as therapist → see dashboard with client count, upcoming sessions, earnings
- Client mood declines 3 days → therapist gets real-time alert notification
- Emergency flag on client → urgent red banner appears immediately
- View client detail → see mood trend chart, session history, tasks, notes
- Write session notes with Tiptap → auto-saves every 30s → "Saved" indicator
- Complete post-session checklist → session marked as "reviewed"
- View calendar → sessions displayed → drag to reschedule → confirmation dialog
- Request payout → confirmed → appears in payout history as "processing"
- View reviews → average rating displayed, individual reviews listed

VERIFY: Login as therapist → see clients → get notification for negative pattern.
Complete post-session workflow. Revenue and payout flow works.
```

---

### PHASE 9: Blog System with SEO
**Time estimate: 1-2 sessions**

```
TASK: Build blog with admin approval and SEO optimization.

=== PRISMA MODELS ===

model BlogPost {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  content         String      // rich text HTML from Tiptap
  excerpt         String?     // short summary (auto-generated if not provided)
  featuredImage   String?     // S3 URL
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])
  categoryId      String
  category        BlogCategory @relation(fields: [categoryId], references: [id])
  tags            String[]    // max 5
  status          BlogStatus @default(DRAFT)
  readingTime     Int?        // auto-calculated: words / 200
  views           Int         @default(0)
  likes           Int         @default(0)
  metaTitle       String?     // SEO meta title (auto-generated if not provided)
  metaDescription String?     // SEO meta description (auto-generated)
  ogImage         String?     // Open Graph image URL
  canonicalUrl    String?     // canonical URL
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  comments        BlogComment[]
  relatedPosts    BlogPost[]  @relation("RelatedPosts")
  relatedTo       BlogPost[]  @relation("RelatedPosts")

  @@index([slug])
  @@index([authorId])
  @@index([categoryId])
  @@index([status])
  @@index([publishedAt])
}

enum BlogStatus {
  DRAFT
  SUBMITTED    // submitted for review
  IN_REVIEW    // admin is reviewing
  APPROVED     // approved, ready to publish
  PUBLISHED    // live on the blog
  REJECTED     // rejected by admin (with reason)
  ARCHIVED     // soft-deleted / archived
}

model BlogCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  postCount   Int      @default(0)
  createdAt   DateTime @default(now())

  posts       BlogPost[]

  @@index([slug])
}

model BlogComment {
  id          String   @id @default(cuid())
  postId      String
  post        BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  parentId    String?     // for threaded comments (1 level deep)
  parent      BlogComment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies     BlogComment[] @relation("CommentReplies")
  content     String
  likes       Int         @default(0)
  dislikes    Int         @default(0)
  isDeleted   Boolean     @default(false)  // soft delete by admin
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([postId])
  @@index([parentId])
  @@index([authorId])
}

=== BLOG EDITOR ===

Library: Tiptap (@tiptap/react, @tiptap/starter-kit, plus extensions)
Component: src/components/blog/BlogEditor.tsx
Props: { initialContent?: string, onChange: (html: string) => void }
Toolbar buttons:
  - Bold (Ctrl+B)
  - Italic (Ctrl+I)
  - Heading (H1, H2, H3 dropdown)
  - Bullet List
  - Numbered List
  - Blockquote
  - Code Block
  - Image (upload dialog → S3 upload → insert URL)
  - Link (URL input dialog)
  - Horizontal Rule
  - Undo / Redo

Tiptap extensions needed:
  @tiptap/extension-image
  @tiptap/extension-link
  @tiptap/extension-code-block-lowlight
  @tiptap/extension-placeholder

=== IMAGE UPLOAD IN EDITOR ===

Flow:
  1. User clicks image button or drags image into editor
  2. File validated: max 5MB, formats: jpg, png, webp, gif
  3. Image optimized server-side with Sharp.js:
     const optimized = await sharp(buffer)
       .resize(1200, null, { withoutEnlargement: true })  // max width 1200px
       .webp({ quality: 80 })
       .toBuffer();
  4. Upload to S3: blog-images/{postId}/{filename}.webp
  5. Return URL, insert into editor as <img> tag

API: POST /api/v1/blog/upload-image
  Auth: verifyToken
  Request: FormData with 'image' file
  Response: { success: true, data: { url: "https://cdn.soulyatri.com/blog-images/xxx/image.webp" } }

=== TAGS ===

  - Max 5 tags per post
  - Autocomplete from existing tags in database (GET /api/v1/blog/tags?search=med → ["meditation", "medicine", "meditate"])
  - Tags are lowercase, trimmed, max 30 chars each
  - Tag input: Shadcn multi-select with chips, type to search

=== RELATED POSTS (AI-suggested) ===

After publish:
  1. Extract keywords from post content using GPT-4o-mini
  2. Search blog posts with similar tags + keywords
  3. Rank by similarity score
  4. Auto-link top 3 as related posts
  5. Shown at bottom of blog post: "You might also like"

=== READING TIME ===

Auto-calculated on save:
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);  // 200 words per minute

=== COMMENTS ===

  - Threaded: 1 level deep (comment → replies, no nested replies)
  - Like / Dislike buttons on each comment
  - Admin can delete any comment (soft delete: isDeleted = true, content shown as "[deleted]")
  - Logged-in users only can comment
  - Max comment length: 2000 characters

=== BLOG LISTING ===

Page: /blog
Component: src/pages/BlogListingPage.tsx
Features:
  - Infinite scroll (load 10 posts at a time)
  - Category filter sidebar (list all categories with post counts)
  - Search bar: full-text search across title + content
  - Sort: newest (default), most popular, most commented
  - Post card: featured image, title, excerpt, author avatar+name, date, reading time, tags, like count

=== SEO PER POST ===

Auto-generated on publish (editable by author):
  - Meta title: post title (max 60 chars)
  - Meta description: first 155 chars of excerpt or auto-generated summary
  - Open Graph image: featured image or auto-generated with post title
  - Canonical URL: https://www.soulyatri.com/blog/{slug}
  - JSON-LD Article schema: { @type: "Article", headline, author, datePublished, image, ... }
  - Twitter Card: summary_large_image

=== APPROVAL WORKFLOW ===

  1. Author creates post → status: DRAFT
  2. Author submits for review → status: SUBMITTED
  3. Admin sees in /admin/blog → reviews → status: IN_REVIEW
  4. Admin approves → status: APPROVED, publishedAt = now → status: PUBLISHED
  5. Admin rejects → status: REJECTED, admin provides reason shown to author
  6. Author can edit rejected post and resubmit

=== AUTO-UPDATE SYSTEM ===

Cron job (weekly):
  1. Fetch trending mental health keywords from Google Trends API
  2. Generate 5 blog topic suggestions using GPT-4o-mini
  3. Store as BlogTopicSuggestion records
  4. Show in therapist/admin blog editor: "Suggested topics this week"

=== API ENDPOINTS ===

GET /api/v1/blog/posts
  Query: ?page=1&limit=10&category=slug&tag=meditation&search=anxiety&sort=newest
  Response: { posts: BlogPost[], total, page, hasMore }

GET /api/v1/blog/posts/:slug
  Response: { post: BlogPost, relatedPosts: BlogPost[3], comments: BlogComment[] }
  Side effect: increment views count

POST /api/v1/blog/posts
  Auth: verifyToken + requireRole(THERAPIST, ADMIN)
  Body: { title, content, categoryId, tags[], featuredImage?, metaTitle?, metaDescription? }
  Response: { post: BlogPost }

PATCH /api/v1/blog/posts/:id
  Auth: verifyToken (must be author or admin)
  Body: partial BlogPost fields
  Response: { post: BlogPost }

POST /api/v1/blog/posts/:id/submit
  Auth: verifyToken (must be author)
  Response: { post: BlogPost }  // status = SUBMITTED

POST /api/v1/blog/posts/:id/approve (admin only)
  Auth: verifyToken + requireRole(ADMIN)
  Response: { post: BlogPost }  // status = PUBLISHED

POST /api/v1/blog/posts/:id/reject (admin only)
  Auth: verifyToken + requireRole(ADMIN)
  Body: { reason: string }
  Response: { post: BlogPost }  // status = REJECTED

POST /api/v1/blog/posts/:slug/comments
  Auth: verifyToken
  Body: { content: string, parentId?: string }
  Response: { comment: BlogComment }

POST /api/v1/blog/posts/:slug/comments/:id/like
  Auth: verifyToken
  Response: { likes: number }

POST /api/v1/blog/posts/:slug/comments/:id/dislike
  Auth: verifyToken
  Response: { dislikes: number }

DELETE /api/v1/blog/comments/:id (admin only)
  Auth: verifyToken + requireRole(ADMIN, MODERATOR)
  Response: { success: true }

POST /api/v1/blog/upload-image
  Auth: verifyToken
  Request: FormData with 'image'
  Response: { url: string }

GET /api/v1/blog/tags
  Query: ?search=med
  Response: { tags: string[] }

GET /api/v1/blog/categories
  Response: { categories: BlogCategory[] }

=== ZOD SCHEMAS ===

const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  categoryId: z.string().cuid(),
  tags: z.array(z.string().max(30)).max(5, 'Maximum 5 tags').optional(),
  featuredImage: z.string().url().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(155).optional()
});

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
  parentId: z.string().cuid().optional()
});

=== ERROR CODES ===

BLOG_001: Post not found
BLOG_002: Slug already exists
BLOG_003: Cannot submit — post has no content
BLOG_004: Cannot publish — post not approved
BLOG_005: Comment too long (max 2000 chars)
BLOG_006: Cannot reply to a reply (only 1 level deep)
BLOG_007: Image upload failed (size or format)
BLOG_008: Maximum 5 tags allowed

=== UI STATES ===

Blog listing loading: Skeleton cards (3 rows of 2)
Blog listing empty: "No posts yet. Check back soon!"
Blog detail loading: Skeleton title + skeleton paragraphs
Blog editor saving: "Saving draft..." toast
Blog submitted: "Post submitted for review!" success toast
Blog rejected: "Post rejected: {reason}" warning banner in editor
Comment posting: "Posting..." loading state on submit button
Image uploading: progress bar overlay on image in editor

=== TEST SCENARIOS ===

- Create blog post with Tiptap editor → save as draft → submit → admin approves → published at /blog/slug
- Upload image in editor → optimized with Sharp → appears in content
- Add 5 tags → 6th tag rejected
- View blog listing → infinite scroll loads more posts
- Search blog → results filtered
- Add comment → appears below post
- Reply to comment → threaded 1 level
- Try to reply to reply → BLOG_006 error
- Admin rejects post → author sees rejection reason → edits → resubmits
- Published post has correct meta tags, OG image, JSON-LD
- Reading time auto-calculated correctly
- Related posts appear at bottom

VERIFY: Write blog → admin approves → published with proper SEO meta tags.
Tiptap editor works. Image upload works. Comments work. Related posts shown.
```
### PHASE 10: Soul Circle (Community)
**Time estimate: 2 sessions**

```
TASK: Build social media-style community for healing with ML-based
content moderation for safe, non-judgmental space at scale.

CONTEXT: Community types in src/types/community.types.ts.
ML moderation types: ContentModerationResult, ModerationRule, ContentReport.

STEP 1 — Prisma models: Post, Comment, Like, Follow, Report, CommunityCategory
STEP 2 — Feed page: /soul-circle — algorithmic feed of posts
STEP 3 — Create post: text, images, anonymous option
STEP 4 — Comments, likes, shares
STEP 5 — Follow users, categories
STEP 6 — User profiles within community: badges, reputation, post history

STEP 7 — ML-Based Content Moderation (AI-powered at scale):
  Every piece of content (post, comment, bio update) passes through AI pipeline:

  7a. Real-time AI Analysis:
    - GPT-4o-mini scores content for: toxicity, self-harm, hate-speech,
      spam, sexual content, violence, misinformation
    - Each score 0-1 (higher = more problematic)
    - Uses ContentModerationResult type

  7b. Auto-Decision Engine:
    - All scores < 0.3 → auto-approve (no human needed)
    - Any score 0.3-0.7 → flag for human review (stays visible, queued)
    - Any score > 0.7 → auto-remove + notify admin
    - Self-harm score > 0.5 → auto-flag + emergency protocol
    - Uses ModerationRule type for triggered rules

  7c. Human Review Queue:
    - Flagged content appears in /admin/community
    - Moderator can: approve, remove, warn user, ban user
    - Decision feeds back into AI model improvement

  7d. User Reporting:
    - Users can report content with reason (ContentReport type)
    - Reported content auto-prioritized in review queue
    - Reporters notified when action taken

  7e. Proactive Monitoring:
    - AI scans for patterns: user consistently posting negative content
    - Auto-suggest wellness resources to struggling users
    - Community health metrics on admin dashboard

VERIFY: Create post → AI checks in <2 seconds → approved if clean.
Post harmful content → auto-removed → admin notified → user warned.
```

---

### PHASE 11: Courses Platform
**Time estimate: 1-2 sessions**

```
TASK: Build course marketplace with creator uploads and admin approval.

=== PRISMA MODELS ===

model Course {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String
  thumbnail       String?     // S3 URL
  previewVideoUrl String?     // free preview video
  creatorId       String
  creator         User     @relation(fields: [creatorId], references: [id])
  categoryId      String
  category        CourseCategory @relation(fields: [categoryId], references: [id])
  price           Float       @default(0)   // 0 = free
  compareAtPrice  Float?      // strikethrough price
  currency        String      @default("INR")
  level           String      @default("beginner")  // beginner, intermediate, advanced
  language        String      @default("english")
  duration        Int?        // total duration in minutes (auto-calculated)
  lessonCount     Int         @default(0)
  enrollmentCount Int         @default(0)
  rating          Float       @default(0)
  reviewCount     Int         @default(0)
  status          CourseStatus @default(DRAFT)
  revenueShareCreator Float   @default(70)   // 70% to creator
  revenueSharePlatform Float  @default(30)   // 30% to Soul Yatri
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  modules         CourseModule[]
  enrollments     Enrollment[]
  reviews         CourseReview[]

  @@index([slug])
  @@index([categoryId])
  @@index([status])
  @@index([creatorId])
}

enum CourseStatus {
  DRAFT
  SUBMITTED
  IN_REVIEW
  APPROVED
  PUBLISHED
  REJECTED
  ARCHIVED
}

model CourseCategory {
  id          String   @id @default(cuid())
  name        String   @unique     // Self-Healing, Meditation, Breathwork, Yoga, Therapy Techniques, Spiritual Growth, Astrology Basics
  slug        String   @unique
  description String?
  icon        String?     // Lucide icon name
  courseCount  Int      @default(0)
  createdAt   DateTime @default(now())

  courses     Course[]
}

model CourseModule {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title       String
  description String?
  order       Int         // display order
  createdAt   DateTime @default(now())

  lessons     Lesson[]

  @@index([courseId])
  @@unique([courseId, order])
}

model Lesson {
  id              String   @id @default(cuid())
  moduleId        String
  module          CourseModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title           String
  description     String?
  type            String      @default("video")  // video, text, quiz
  videoUrl        String?     // S3/Cloudflare Stream URL (HLS)
  videoDuration   Int?        // duration in seconds
  textContent     String?     // rich text for text lessons
  order           Int
  isFree          Boolean     @default(false)  // preview lesson
  createdAt       DateTime    @default(now())

  quizQuestions   QuizQuestion[]
  progress        LessonProgress[]

  @@index([moduleId])
  @@unique([moduleId, order])
}

model QuizQuestion {
  id          String   @id @default(cuid())
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  question    String
  options     String[]    // array of 4 options
  correctIndex Int        // index of correct option (0-3)
  explanation String?     // explanation shown after answering
  order       Int
  createdAt   DateTime @default(now())

  @@index([lessonId])
}

model Enrollment {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  courseId         String
  course          Course   @relation(fields: [courseId], references: [id])
  paymentId       String?
  progress        Float    @default(0)    // 0-100 percentage
  completedAt     DateTime?
  certificateId   String?  @unique
  certificateUrl  String?  // S3 URL of generated PDF
  lastAccessedAt  DateTime?
  createdAt       DateTime @default(now())

  lessonProgress  LessonProgress[]

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}

model LessonProgress {
  id              String   @id @default(cuid())
  enrollmentId    String
  enrollment      Enrollment @relation(fields: [enrollmentId], references: [id])
  lessonId        String
  lesson          Lesson   @relation(fields: [lessonId], references: [id])
  isComplete      Boolean  @default(false)
  videoPosition   Int?     // resume position in seconds
  quizScore       Float?   // quiz score percentage
  completedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([enrollmentId, lessonId])
  @@index([enrollmentId])
}

model CourseReview {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  rating      Int         // 1-5
  comment     String?
  isVerified  Boolean     @default(false)  // completed course = verified
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@unique([courseId, userId])  // one review per user per course
  @@index([courseId])
}

=== VIDEO HOSTING ===

Upload flow:
  1. Creator uploads video via dashboard
  2. Server receives file (max 2GB, formats: mp4, mov, webm)
  3. Upload to S3 bucket: course-videos/{courseId}/{lessonId}/{filename}
  4. Trigger transcoding job (FFmpeg or Cloudflare Stream):
     - 360p, 480p, 720p, 1080p variants
     - HLS playlist (.m3u8) for adaptive bitrate streaming
  5. Store HLS URL in Lesson.videoUrl
  6. Video player: Video.js or React Player with HLS support

=== PROGRESS TRACKING ===

  - Per-lesson completion stored in LessonProgress
  - Video: lesson complete when watched ≥ 90% (track position with heartbeat every 10s)
  - Text: lesson complete when user clicks "Mark as Complete"
  - Quiz: lesson complete when score ≥ 70%
  - Course progress = completedLessons / totalLessons * 100
  - Resume: store videoPosition, on revisit start from last position
  - API: PATCH /api/v1/courses/:courseId/lessons/:lessonId/progress { videoPosition, isComplete }

=== QUIZ ===

  - Multiple choice: 4 options, single correct answer
  - Auto-graded immediately on submit
  - Minimum 70% score to proceed to next lesson
  - If < 70%: "You scored {X}%. You need 70% to proceed. Try again?" + "Retake Quiz" button
  - Show explanation for each question after submission
  - Quiz score stored in LessonProgress.quizScore

=== CERTIFICATE ===

Auto-generated when course progress = 100%:
  1. Generate PDF using @react-pdf/renderer or PDFKit:
     - Soul Yatri logo at top
     - "Certificate of Completion"
     - "This certifies that {User Name}"
     - "has successfully completed"
     - "{Course Name}"
     - "on {Completion Date}"
     - "Certificate ID: CERT-{random-8-chars}"
     - QR code linking to verification page: /verify/CERT-{id}
  2. Upload PDF to S3
  3. Store URL in Enrollment.certificateUrl + certificateId
  4. Email certificate to user
  5. Verification page: /verify/:certificateId → shows certificate details

=== CREATOR DASHBOARD ===

Flow: upload course → preview → submit for review → admin approves/rejects → published

Pages:
  - src/pages/creator/CreatorDashboardPage.tsx: overview (courses, earnings, reviews)
  - src/pages/creator/CreateCoursePage.tsx: multi-step course creation wizard
  - src/pages/creator/EditCoursePage.tsx: edit existing course
  - src/pages/creator/CourseAnalyticsPage.tsx: per-course enrollment, completion, revenue

Creation wizard steps:
  1. Course details: title, description, category, level, language, price, thumbnail
  2. Modules: add modules with titles, reorder with drag-and-drop
  3. Lessons per module: add lessons (video upload, text, quiz), reorder
  4. Quiz creation: add questions per quiz lesson
  5. Preview: see course as student would see it
  6. Submit: POST /api/v1/courses/:id/submit → status = SUBMITTED

=== REVENUE SPLIT ===

  - Default: creator 70%, Soul Yatri 30%
  - Configurable per course by admin (stored in Course.revenueShareCreator/Platform)
  - On enrollment payment:
    → creatorEarnings = price * (revenueShareCreator / 100)
    → platformEarnings = price * (revenueSharePlatform / 100)
  - Creator earnings tracked in earnings table, same payout flow as therapists

=== COURSE CATEGORIES (seeded) ===

  1. Self-Healing
  2. Meditation
  3. Breathwork
  4. Yoga
  5. Therapy Techniques
  6. Spiritual Growth
  7. Astrology Basics

=== API ENDPOINTS ===

GET /api/v1/courses
  Query: ?page=1&limit=12&category=meditation&level=beginner&search=stress&sort=newest|popular|rating
  Response: { courses: Course[], total, page, hasMore }

GET /api/v1/courses/:slug
  Response: { course: Course, modules: [{ ...module, lessons: Lesson[] }], reviews: CourseReview[], isEnrolled: boolean, progress?: number }

POST /api/v1/courses/:id/enroll
  Auth: verifyToken
  Body: { paymentId?: string }  // omit for free courses
  Response: { enrollment: Enrollment }

PATCH /api/v1/courses/:courseId/lessons/:lessonId/progress
  Auth: verifyToken
  Body: { videoPosition?: number, isComplete?: boolean, quizAnswers?: number[] }
  Response: { lessonProgress: LessonProgress, courseProgress: number, quizResult?: { score, passed, explanations } }

GET /api/v1/courses/:courseId/certificate
  Auth: verifyToken
  Response: { certificateUrl: string, certificateId: string }

POST /api/v1/creator/courses
  Auth: verifyToken
  Body: { title, description, categoryId, level, language, price, thumbnail }
  Response: { course: Course }

POST /api/v1/courses/:id/submit
  Auth: verifyToken (creator only)
  Response: { course: Course }  // status = SUBMITTED

POST /api/v1/admin/courses/:id/approve
  Auth: requireRole(ADMIN)
  Response: { course: Course }  // status = PUBLISHED

POST /api/v1/admin/courses/:id/reject
  Auth: requireRole(ADMIN)
  Body: { reason: string }
  Response: { course: Course }  // status = REJECTED

GET /api/v1/courses/:id/reviews
  Response: { reviews: CourseReview[], averageRating, totalReviews }

POST /api/v1/courses/:id/reviews
  Auth: verifyToken
  Body: { rating: number, comment?: string }
  Response: { review: CourseReview }

=== ERROR CODES ===

COURSE_001: Course not found
COURSE_002: Already enrolled in this course
COURSE_003: Payment required for this course
COURSE_004: Quiz score too low — minimum 70% required
COURSE_005: Course not published — cannot enroll
COURSE_006: Video upload failed — invalid format or too large
COURSE_007: Certificate not available — course not completed

=== UI STATES ===

Course listing loading: Skeleton grid (3x4 cards)
Course listing empty: "No courses found. Try a different search."
Course detail loading: Skeleton layout
Enrolled: "Continue Learning" button, progress bar shown
Not enrolled: "Enroll Now — ₹{price}" or "Enroll Free" button
Video playing: Video.js player with HLS, progress bar
Quiz: question cards with radio buttons, "Submit" button, results page
Certificate ready: "Download Certificate" button + PDF preview
Upload progress: progress bar during video upload

=== TEST SCENARIOS ===

- Browse courses → filter by category → see results
- View course detail → see modules, lessons, reviews
- Enroll in free course → immediately enrolled → start learning
- Enroll in paid course → payment → enrolled
- Watch video lesson → position tracked → resume from last position
- Complete lesson → progress updated → next lesson unlocked
- Take quiz → score ≥ 70% → pass → continue. Score < 70% → retry
- Complete all lessons → certificate auto-generated → download PDF
- Creator uploads course → submits → admin approves → published
- Creator: admin rejects → reason shown → edit → resubmit
- Leave review → shows as verified if course completed

VERIFY: Browse courses → enroll → watch lessons → track progress → complete → certificate.
Creator flow works. Quiz grading works. Revenue split applied correctly.
```

---

### PHASE 12: Soul Shop (E-commerce)
**Time estimate: 1-2 sessions**

```
TASK: Build merchandise and healing products shop.

=== PRISMA MODELS ===

model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String      // rich text
  shortDescription String?
  price           Float
  compareAtPrice  Float?      // original price for strikethrough
  images          String[]    // S3 URLs, first is primary
  categoryId      String
  category        ProductCategory @relation(fields: [categoryId], references: [id])
  tags            String[]
  sku             String   @unique
  inventory       Int         @default(0)
  weight          Float?      // in grams
  dimensions      Json?       // { length, width, height } in cm
  isActive        Boolean     @default(true)
  isFeatured      Boolean     @default(false)
  rating          Float       @default(0)
  reviewCount     Int         @default(0)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  variants        ProductVariant[]
  reviews         ProductReview[]
  wishlistItems   WishlistItem[]
  cartItems       CartItem[]
  orderItems      OrderItem[]

  @@index([slug])
  @@index([categoryId])
  @@index([isActive])
}

model ProductCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  image       String?
  parentId    String?
  parent      ProductCategory? @relation("CategoryTree", fields: [parentId], references: [id])
  children    ProductCategory[] @relation("CategoryTree")
  createdAt   DateTime @default(now())

  products    Product[]
}

model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  name        String      // e.g., "Large / Blue"
  size        String?
  color       String?
  price       Float       // variant-specific price
  sku         String   @unique
  inventory   Int         @default(0)
  image       String?     // variant-specific image
  isActive    Boolean     @default(true)
  createdAt   DateTime @default(now())

  @@index([productId])
}

model Cart {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  updatedAt   DateTime @updatedAt
  createdAt   DateTime @default(now())

  items       CartItem[]

  @@index([userId])
}

model CartItem {
  id          String   @id @default(cuid())
  cartId      String
  cart        Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  variantId   String?
  variant     ProductVariant? @relation(fields: [variantId], references: [id])
  quantity    Int         @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([cartId, productId, variantId])
  @@index([cartId])
}

model Wishlist {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())

  items       WishlistItem[]
}

model WishlistItem {
  id          String   @id @default(cuid())
  wishlistId  String
  wishlist    Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([wishlistId, productId])
}

model Order {
  id              String   @id @default(cuid())
  orderNumber     String   @unique    // SY-ORD-{timestamp}-{random}
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  subtotal        Float
  shippingCost    Float       @default(0)
  tax             Float       @default(0)
  discount        Float       @default(0)
  total           Float
  paymentId       String?
  paymentStatus   String      @default("pending")
  shippingAddressId String
  shippingAddress ShippingAddress @relation(fields: [shippingAddressId], references: [id])
  shippingMethod  String?     // standard, express
  trackingNumber  String?
  trackingUrl     String?
  estimatedDelivery DateTime?
  deliveredAt     DateTime?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
  returnRequest   ReturnRequest?

  @@index([userId])
  @@index([orderNumber])
  @@index([status])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
  REFUNDED
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  variantId   String?
  name        String      // snapshot of product name at time of order
  price       Float       // snapshot of price at time of order
  quantity    Int
  createdAt   DateTime @default(now())

  @@index([orderId])
}

model ShippingAddress {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  phone       String
  addressLine1 String
  addressLine2 String?
  city        String
  state       String
  pincode     String
  country     String      @default("India")
  isDefault   Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  orders      Order[]

  @@index([userId])
}

model ReturnRequest {
  id          String   @id @default(cuid())
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])
  reason      String
  status      ReturnStatus @default(REQUESTED)
  adminNotes  String?
  refundAmount Float?
  pickupDate  DateTime?
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ReturnStatus {
  REQUESTED
  APPROVED
  PICKUP_SCHEDULED
  PICKED_UP
  REFUND_PROCESSING
  REFUNDED
  REJECTED
}

model ProductReview {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  rating      Int         // 1-5
  comment     String?
  images      String[]    // review images
  isVerified  Boolean     @default(false)  // purchased = verified badge
  helpfulVotes Int       @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@unique([productId, userId])
  @@index([productId])
}

=== CART PERSISTENCE ===

Logged-in users: cart stored in database (Cart + CartItem models)
Guest users: cart stored in localStorage as JSON
On login: merge localStorage cart into database cart (handle duplicates by adding quantities)
Cart sync: after every add/remove, sync with backend → POST /api/v1/shop/cart/sync

=== CHECKOUT FLOW ===

Step 1 — Cart review:
  - List all items with image, name, variant, quantity (editable), price
  - Subtotal, shipping estimate, total
  - "Continue to Shipping" button

Step 2 — Shipping address:
  - Select saved address or add new
  - Address form: name, phone, line1, line2, city, state, pincode, country
  - Validate pincode for serviceability (Shiprocket API)

Step 3 — Shipping method:
  - Standard (5-7 days): calculated from Shiprocket
  - Express (2-3 days): calculated from Shiprocket
  - Free shipping for orders > ₹999

Step 4 — Payment:
  - PaymentModal (from Phase 13): Razorpay for INR
  - Order summary: items + shipping + tax + total

Step 5 — Confirmation:
  - Order number displayed
  - "Track Order" link
  - Confirmation email sent

=== SHIPPING INTEGRATION ===

Provider: Shiprocket API
  - POST /api/v1/shop/shipping/estimate: estimate cost + delivery date
  - POST /api/v1/shop/orders/:id/ship: create shipment → get tracking number
  - GET /api/v1/shop/orders/:id/track: get real-time tracking status
  - Webhook: Shiprocket sends status updates → update order status automatically

=== RETURNS / REFUNDS ===

Policy: 7-day return window from delivery date
Flow:
  1. User requests return: POST /api/v1/shop/orders/:id/return { reason }
  2. Admin reviews: approve or reject
  3. If approved: pickup scheduled via Shiprocket reverse logistics
  4. Product picked up → inspected
  5. Refund processed via original payment method
  6. Estimated refund time: 5-7 business days

=== PRODUCT REVIEWS ===

  - 1-5 star rating + optional text comment
  - "Verified Purchase" badge if user has completed order for this product
  - "Helpful" vote button (like count)
  - Sort: newest, highest rated, most helpful
  - Review images: up to 3 images per review

=== API ENDPOINTS ===

GET /api/v1/shop/products
  Query: ?page=1&limit=12&category=slug&search=crystal&sort=newest|price-low|price-high|popular&minPrice=100&maxPrice=5000
  Response: { products: Product[], total, page, hasMore }

GET /api/v1/shop/products/:slug
  Response: { product: Product, variants: ProductVariant[], reviews: ProductReview[], relatedProducts: Product[4] }

POST /api/v1/shop/cart/add
  Auth: verifyToken
  Body: { productId, variantId?, quantity }
  Response: { cart: Cart }

PATCH /api/v1/shop/cart/update
  Auth: verifyToken
  Body: { itemId, quantity }
  Response: { cart: Cart }

DELETE /api/v1/shop/cart/remove/:itemId
  Auth: verifyToken
  Response: { cart: Cart }

GET /api/v1/shop/cart
  Auth: verifyToken
  Response: { cart: Cart, items: CartItem[] }

POST /api/v1/shop/wishlist/add
  Auth: verifyToken
  Body: { productId }
  Response: { wishlist: Wishlist }

DELETE /api/v1/shop/wishlist/remove/:productId
  Auth: verifyToken
  Response: { wishlist: Wishlist }

GET /api/v1/shop/wishlist
  Auth: verifyToken
  Response: { items: WishlistItem[] }

POST /api/v1/shop/orders
  Auth: verifyToken
  Body: { shippingAddressId, shippingMethod, paymentId }
  Response: { order: Order }

GET /api/v1/shop/orders
  Auth: verifyToken
  Response: { orders: Order[], total, page }

GET /api/v1/shop/orders/:id
  Auth: verifyToken
  Response: { order: Order, items: OrderItem[], tracking?: TrackingInfo }

POST /api/v1/shop/orders/:id/return
  Auth: verifyToken
  Body: { reason: string }
  Response: { returnRequest: ReturnRequest }

POST /api/v1/shop/products/:id/reviews
  Auth: verifyToken
  Body: { rating: number, comment?: string, images?: string[] }
  Response: { review: ProductReview }

POST /api/v1/shop/reviews/:id/helpful
  Auth: verifyToken
  Response: { helpfulVotes: number }

=== ERROR CODES ===

SHOP_001: Product not found
SHOP_002: Product out of stock
SHOP_003: Variant not found
SHOP_004: Cart empty — cannot checkout
SHOP_005: Shipping address not serviceable
SHOP_006: Return window expired (> 7 days from delivery)
SHOP_007: Order not found
SHOP_008: Already reviewed this product

=== UI STATES ===

Product listing loading: Skeleton grid (3x4)
Product listing empty: "No products found. Try different filters."
Product detail loading: Skeleton image + text
Add to cart: button shows "Adding..." → "Added ✓" (2s) → revert to "Add to Cart"
Cart empty: "Your cart is empty. Start shopping!" + CTA
Checkout loading: full-page loading overlay during payment
Order confirmed: green checkmark + order number + "Track Order" link
Wishlist empty: "Your wishlist is empty. Browse products to add favorites."

=== TEST SCENARIOS ===

- Browse products → filter by category → sort by price → see results
- View product detail → select variant → add to cart
- Add to wishlist → view wishlist → remove
- Add multiple items → update quantity → remove item → cart total updates
- Checkout → select address → select shipping → pay → order confirmed
- Track order → see shipping status updates
- Request return within 7 days → approved → refund processed
- Request return after 7 days → SHOP_006 error
- Leave product review → shows verified badge if purchased
- Guest adds to cart → logs in → cart merged

VERIFY: Browse shop → add to cart → checkout → payment → order confirmed.
Wishlist works. Returns work. Reviews with verified badge work.
```

---

### PHASE 13: Payment Gateway
**Time estimate: 2 sessions**

```
TASK: Integrate Razorpay + Stripe for multi-currency global payments.

CONTEXT: Types in src/types/payment.types.ts.
Multi-currency: SupportedCurrency (8 currencies), CurrencyConfig, UserCurrencyPreference.
Payouts: PayoutAccount, PayoutRequest, EarningsSummary.

STEP 1 — Multi-currency setup:
  - INR payments → Razorpay gateway
  - USD/EUR/GBP/AUD/CAD/SGD/AED → Stripe gateway
  - Auto-detect user currency from IP geolocation
  - User can override currency in settings
  - All amounts stored in BOTH original currency AND INR (base)
  - Exchange rates updated daily (Open Exchange Rates API or similar)
  - API: GET /api/v1/payments/currencies — list supported currencies
  - API: PUT /api/v1/payments/currency-preference — set user preference

STEP 2 — Server: /api/v1/payments/ routes
  - POST /create — create order (auto-routes to Razorpay or Stripe based on currency)
  - POST /verify — verify payment (handles both gateway responses)
  - POST /webhook — webhook handler (separate endpoints for Razorpay and Stripe)
  - POST /refund — process refund in original currency
  - GET /history — payment history with currency conversion display

STEP 3 — Frontend: reusable PaymentModal component
  - Detects user currency preference
  - Shows price in user's currency + INR equivalent
  - Routes to correct gateway (Razorpay checkout for INR, Stripe Elements for others)
  - Used by: therapy booking, course enrollment, shop checkout, subscription,
    event registration, membership, astrology session booking
  - Zomato/Swiggy-level smooth UX (saved cards, UPI, wallets)

STEP 4 — Subscription management: plans, upgrades, cancellation
  - Razorpay subscriptions for INR users
  - Stripe subscriptions for international users
  - Proration on plan changes

STEP 5 — Therapist/Astrologer/Creator payouts:
  - POST /api/v1/payments/payouts/account — set up payout bank account
  - GET /api/v1/payments/payouts/earnings — view earnings summary
  - POST /api/v1/payments/payouts/request — request payout
  - Platform commission deducted automatically
  - Payouts processed in therapist's local currency
  - Payout history and tax documents

VERIFY: Set currency to USD → book therapy → Stripe checkout →
payment confirmed → webhook → session activated → therapist sees earnings.
Then: INR user → Razorpay checkout → same flow.
```

---

### PHASE 14: Admin Dashboard
**Time estimate: 2-3 sessions**

```
TASK: Build comprehensive admin/head office dashboard.
The HEAD OFFICE dashboard must have FULL visibility and control over EVERY
section of the platform. Nothing should be hidden from admin view.

=== DATA TABLE COMPONENT (reusable across all admin pages) ===

Component: src/components/admin/DataTable.tsx
Props: {
  columns: ColumnDef[],
  data: any[],
  searchKey?: string,
  filterOptions?: FilterOption[],
  pagination: { page, pageSize, total },
  onPageChange: (page) => void,
  onSearch: (query) => void,
  onFilter: (filters) => void,
  onSort: (column, direction) => void,
  onExport?: () => void,
  selectable?: boolean,
  onBulkAction?: (selectedIds, action) => void,
  bulkActions?: string[]
}
Features:
  - Sortable columns: click header → asc → desc → none
  - Search: debounced text search (300ms)
  - Filters: dropdown filters per column (status, role, date range)
  - Pagination: 10/25/50/100 per page selector
  - Export: CSV download button — includes all filtered data, not just current page
  - Bulk select: checkbox column, "Select all" header checkbox
  - Bulk actions: toolbar appears when rows selected (e.g., "Approve Selected", "Reject Selected", "Delete Selected")
  - Loading: skeleton rows

=== REAL-TIME UPDATES ===

Socket.IO subscriptions per admin page:
  - admin:new-user → UsersPage table auto-updates
  - admin:new-complaint → ComplaintsPage table auto-updates
  - admin:emergency-flag → EmergencyPage + HeadOfficePage alert banner
  - admin:new-session → SessionsPage updates
  - admin:fraud-alert → FraudAlertsPage updates
  - admin:payment → PaymentsPage updates
  Implementation: useSocket hook that subscribes to events and updates local state

=== CONFIRM DIALOG FOR DESTRUCTIVE ACTIONS ===

Component: src/components/admin/ConfirmDialog.tsx
Props: { title, description, confirmText, cancelText, variant: 'danger'|'warning', onConfirm }
Usage: every destructive action (suspend user, delete post, reject course, ban user)
Display: modal with warning icon, description, red "Confirm" button

=== ADMIN PAGES ===

STEP 1 — src/pages/admin/ (every page in the platform has an admin view):

  === CORE OVERVIEW ===
  - HeadOfficePage: CEO-level dashboard aggregating ALL stats from every section
    (uses HeadOfficeDashboard type from admin.types.ts)
    Widgets:
      1. Total Users card: count + new today + growth % (compared to last month)
      2. Active Sessions NOW card: real-time count of ongoing therapy/video sessions
      3. Revenue Today card: ₹XX,XXX + comparison to yesterday
      4. Pending Actions Count card: total items needing admin attention
      5. Emergency Alerts Count card: active emergency flags (red if > 0)
      6. Platform Uptime % card: current uptime from health check
    Department performance bars: horizontal bar chart per department showing target progress
    Critical alerts list: last 10 emergency/fraud/complaint alerts with severity + timestamp
    Quick action buttons: "Approve Blog Posts", "Review Complaints", "Check Fraud Alerts", "Manage Users"

  - AdminDashboardPage: KPIs, revenue, user growth, critical alerts
  - AnalyticsPage: platform-wide analytics, user behavior, retention

  === PEOPLE MANAGEMENT ===
  - UsersPage: all users, search, filter, suspend, change role
  - TherapistsPage: therapist management, verification, performance, quality scores
  - AstrologersPage: astrologer management, accuracy scores, verification
  - EmployeeTracker: every employee action logged, hours, performance, revenue

  === SESSIONS & SAFETY ===
  - SessionsPage: all therapy sessions, recordings access, transcriptions
  - SessionRecordingsPage: access any session recording (with audit logging)
  - AIMonitoringPage: AI assistant usage, conversations flagged, patterns detected
  - FraudAlertsPage: therapist fraud indicators, quality violations, compliance
  - EmergencyPage: all emergency flags, escalation workflow, resolution
  - TherapistQualityPage: per-therapist quality scores, session analysis

  === REVENUE & PAYMENTS ===
  - RevenuePage: revenue breakdown by source (therapy, astrology, courses, shop,
    memberships, events, corporate), daily/weekly/monthly/quarterly
  - PaymentsPage: all transactions, pending refunds, failed payments
  - MembershipsPage: tier management, subscriber analytics, churn

  === CONTENT & MODERATION ===
  - BlogModeration: approve/reject blog posts, SEO analytics
  - CourseModeration: approve/reject courses, enrollment stats
  - CommunityModerationPage: reported posts, user bans, warnings

  === COMMERCE ===
  - ShopManagement: products, orders, inventory, shop analytics
  - EventsPage: event management, registrations, revenue, feedback

  === ORGANIZATION ===
  - DepartmentsPage: all departments, targets, performance tracking
  - HiringPage: job positions, applications, pipeline management
  - ComplaintsPage: complaint queue, assignment, resolution tracking
  - AuditLogPage: every action by every user/employee, exportable

  === EXTERNAL ===
  - CorporatePage: corporate accounts, employee wellness reports
  - InstitutionsPage: school/college accounts, student usage
  - NGOPage: NGO partners, beneficiaries, impact reports
  - IntegrationsPage: Slack, Teams, SAP, API webhooks

  === PLATFORM ===
  - SettingsPage: platform config, feature flags, plans, maintenance mode
  - NotificationsPage: broadcast messages, notification management
  - PlatformHealthPage: API uptime, response times, storage, error rates
  - SEODashboardPage: keyword rankings, PSEO pages, sitemap, GEO tracking

STEP 2 — Action logging middleware: every admin/therapist/astrologer action
  is recorded with userId, role, action, resource, timestamp, IP address

STEP 3 — Revenue reports: daily, weekly, monthly with charts, export to CSV

STEP 4 — Head Office Dashboard (HeadOfficePage.tsx):
  This is the CEO-level view. It pulls from HeadOfficeDashboard type:
  - Platform-wide stats (users, revenue, sessions, memberships, events, NGO)
  - All department overviews with target status
  - Top performers (therapists, astrologers, content creators)
  - Critical alerts (emergency flags, fraud, complaints, system errors)
  - Platform health (uptime, response times, error rates)
  - Pending actions queue (blog/course approvals, complaints, refunds, hiring)
  - Quick action buttons for every admin function

STEP 5 — Every section must have:
  - Search + filter capabilities
  - Bulk actions where appropriate (select rows → bulk approve/reject/delete)
  - Export to CSV/PDF
  - Real-time updates via WebSocket

=== ERROR CODES ===

ADMIN_001: Insufficient permissions — not an admin
ADMIN_002: User not found
ADMIN_003: Cannot suspend yourself
ADMIN_004: Bulk action failed — some items could not be processed
ADMIN_005: Export failed — too many records (max 10,000 rows)

=== UI STATES ===

Admin page loading: Skeleton data table + skeleton stat cards
Empty table: "No records found" with current filter info
Bulk action in progress: "Processing {N} items..." progress bar
Export: "Generating CSV..." → download starts automatically
Confirm dialog: modal with action description, "Are you sure?" text
Real-time update: row highlight animation (flash green) when new data arrives

=== TEST SCENARIOS ===

- Login as admin → Head Office shows ALL stats → click through every section
- Search users by name → filter by role → sort by created date
- Suspend user → confirm dialog → user suspended → cannot login
- Bulk approve 5 blog posts → all approved in one action
- Export users to CSV → file downloads with all filtered data
- Emergency flag created → HeadOfficePage alert count updates in real-time
- View session recording → audit log entry created
- View revenue breakdown by source → drill into daily/weekly/monthly

VERIFY:
  Login as admin → Head Office shows ALL stats →
  Can see every user → Can see every session recording →
  Can see therapist quality scores → Can see fraud alerts →
  Can manage events, memberships, NGO → Can see all revenue →
  Can see all departments and targets → Can manage all content →
  Nothing is hidden from admin view.
  DataTable component reused across all pages.
  Bulk actions, export, real-time updates all work.
```
### PHASE 15: Corporate & Institution System
**Time estimate: 2-3 sessions**

```
TASK: Build corporate wellness and school/college integration with one-click
enterprise connectivity to any ERP/HRMS system.

CONTEXT: Types in src/types/admin.types.ts (CorporateAccount, InstitutionAccount,
Integration, IntegrationConfig, IntegrationFieldMapping, IntegrationType).

STEP 1 — Corporate account management:
  - Corporate signup → admin approval → account activated
  - Corporate admin dashboard: /corporate
  - Employee enrollment with corporate email domain verification
  - Bulk employee import (CSV upload or API sync)
  - Employee usage tracking (sessions used vs allocated)

STEP 2 — Corporate dashboard: /corporate
  - Employee wellness metrics (ANONYMIZED — no individual data exposed)
  - Aggregate mood trends across organization
  - Session utilization rates
  - Department-wise wellness breakdown
  - ROI reports for HR leadership

STEP 3 — School/college accounts:
  - Institution onboarding (school/college/university)
  - Student batch enrollment
  - Age-appropriate content gating for schools
  - Parent consent workflow for minors
  - Counsellor dashboard within institution

STEP 4 — ONE-CLICK Integration Engine:
  Build a universal integration connector that can sync with ANY enterprise system.

  4a. Slack Bot:
    - /soulyatri mood — quick mood check-in from Slack
    - /soulyatri book — book therapy session from Slack
    - Automated wellness reminders in channels
    - Emergency keyword monitoring in DMs (with consent)
    - OAuth2 app installation flow

  4b. Microsoft Teams:
    - Same features as Slack bot (Teams app)
    - Tab integration for dashboard within Teams
    - Calendar sync for therapy sessions

  4c. SAP / Oracle HCM / Workday Integration:
    - One-click connector setup (admin provides API credentials)
    - Auto-sync employee directory (name, email, department)
    - Real-time sync when employees join/leave (webhook or polling)
    - Field mapping UI: map SAP fields → Soul Yatri fields
    - Support for institutions like SVKM (1 lakh+ students)
    - Uses IntegrationConfig and IntegrationFieldMapping types

  4d. LDAP / Active Directory:
    - SSO via SAML 2.0 or LDAP bind
    - User provisioning from directory
    - Group-based access control

  4e. Google Workspace:
    - SSO via Google OAuth
    - Google Calendar sync for session reminders
    - Google Meet fallback for video sessions

  4f. Custom Webhook / API:
    - Provide REST API endpoints for any custom integration
    - Webhook events: user-enrolled, session-booked, session-completed
    - API key authentication with rate limiting
    - Full API documentation auto-generated

  4g. Custom Database Sync:
    - Direct database connector for legacy systems
    - Support PostgreSQL, MySQL, MSSQL source databases
    - Scheduled sync (hourly/daily) with conflict resolution
    - Ideal for educational institutions with centralized databases
    - SECURITY: Read-only database credentials ONLY (never write access)
    - SECURITY: TLS/SSL encrypted connections mandatory
    - SECURITY: IP whitelisting for database access
    - SECURITY: All synced data logged in audit trail

STEP 5 — Awareness session booking:
  - Corporates can book group wellness sessions
  - Therapist assigned based on group size and topic
  - Post-session feedback and impact report

STEP 6 — Admin visibility:
  - All corporate accounts visible in /admin/corporate
  - All institution accounts in /admin/institutions
  - Integration health monitoring in /admin/integrations

VERIFY: Create corporate account → one-click Slack integration → employees
sync automatically → they access platform → admin sees anonymized reports.
```

---

### PHASE 16: Health Tools (Meditation, Journal, Mood, Breathing)
**Time estimate: 1-2 sessions**

```
TASK: Build the self-healing tools suite.

=== PRISMA MODELS ===

model MoodLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  mood        Int         // 1-10 scale
  emotions    String[]    // happy, sad, anxious, calm, angry, hopeful
  triggers    String[]    // work, family, relationship, health, financial
  note        String?     // optional free-text note
  createdAt   DateTime    @default(now())

  @@index([userId])
  @@index([createdAt])
}

model MeditationSession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  duration    Int         // actual duration in seconds
  targetDuration Int     // selected duration in seconds (300, 600, 900, 1200, 1800)
  type        String      @default("unguided")  // guided, unguided
  ambientSound String?   // rain, ocean, forest, silence
  completed   Boolean     @default(false)
  createdAt   DateTime    @default(now())

  @@index([userId])
  @@index([createdAt])
}

model JournalEntry {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  content     String      // rich text HTML from Tiptap
  moodTag     Int?        // 1-10 mood at time of writing
  isPrivate   Boolean     @default(true)
  wordCount   Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([userId])
  @@index([createdAt])
}

model BreathingSession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  pattern     String      // box-4-4-4-4, 4-7-8, alternate-nostril
  rounds      Int         // number of rounds completed
  duration    Int         // total duration in seconds
  completed   Boolean     @default(false)
  createdAt   DateTime    @default(now())

  @@index([userId])
  @@index([createdAt])
}

=== TOOL 1: MOOD TRACKER ===

Component: src/pages/dashboard/health-tools/MoodTrackerPage.tsx

UI Elements:
  - Mood slider: 1-10 (Shadcn Slider), with emoji faces at each level
    1-2: 😢 (Very Low), 3-4: 😟 (Low), 5-6: 😐 (Neutral), 7-8: 😊 (Good), 9-10: 😄 (Great)
  - Emotion tags: grid of selectable chips
    Options: Happy, Sad, Anxious, Calm, Angry, Hopeful, Confused, Grateful, Lonely, Energetic, Tired, Peaceful
    Max 5 selections
  - Trigger tags: grid of selectable chips
    Options: Work, Family, Relationship, Health, Financial, Social, Academic, Sleep, Weather, Exercise, Meditation, Therapy
    Max 5 selections
  - Optional note: textarea (max 500 chars)
  - "Log Mood" button

Chart section (below entry form):
  - 30-day line graph: Recharts LineChart with dots
    X-axis: dates (last 30 days)
    Y-axis: mood score 1-10
    Color: gradient from red (low) to green (high)
  - Weekly average bar chart: Recharts BarChart, last 4 weeks
  - Most common emotions: tag cloud or frequency list
  - Most common triggers: tag cloud or frequency list

API endpoints:
  POST /api/v1/health-tools/mood
    Auth: verifyToken
    Body: { mood: number, emotions: string[], triggers: string[], note?: string }
    Zod: z.object({
      mood: z.number().int().min(1).max(10),
      emotions: z.array(z.string()).min(1).max(5),
      triggers: z.array(z.string()).max(5).optional(),
      note: z.string().max(500).optional()
    })
    Response: { success: true, data: { moodLog: MoodLog } }

  GET /api/v1/health-tools/mood
    Auth: verifyToken
    Query: ?days=30&page=1&limit=30
    Response: { logs: MoodLog[], stats: { average, trend, topEmotions, topTriggers } }

=== TOOL 2: MEDITATION ===

Component: src/pages/dashboard/health-tools/MeditationPage.tsx

UI Elements:
  - Timer selection: 5 / 10 / 15 / 20 / 30 min buttons (radio-style)
  - Ambient sound selector: Rain 🌧️, Ocean 🌊, Forest 🌲, Silence 🔇 (icon buttons)
  - Mode: Guided / Unguided toggle
    Guided: pre-recorded audio plays with instructions (stored in S3)
    Unguided: ambient sound only + timer
  - Bell: gentle bell sound at start and end (using Howler.js or Web Audio API)
  - Start button → begins session

During session:
  - Progress ring animation: SVG circle that fills clockwise (CSS animation)
  - Time remaining: digital countdown (MM:SS)
  - Pause / Resume button
  - End Early button (with confirmation: "Are you sure? Your progress will still be saved.")
  - Ambient sound playing in background (HTML5 Audio or Howler.js)

Completion:
  - Gentle bell sound
  - "Great job! You meditated for {X} minutes." message
  - Stats: total meditation minutes this week, streak

API endpoints:
  POST /api/v1/health-tools/meditation
    Auth: verifyToken
    Body: { duration: number, targetDuration: number, type: string, ambientSound?: string, completed: boolean }
    Response: { success: true, data: { session: MeditationSession, totalMinutes: number, streak: number } }

  GET /api/v1/health-tools/meditation/stats
    Auth: verifyToken
    Response: { totalMinutes, sessionsThisWeek, streak, longestSession, favoriteSound }

=== TOOL 3: JOURNAL ===

Component: src/pages/dashboard/health-tools/JournalPage.tsx

UI Elements:
  - Entry list sidebar: list of past entries with date, mood tag color, excerpt
  - Editor area: Tiptap rich text editor (same setup as blog editor but simpler toolbar)
    Toolbar: Bold, Italic, Heading, Bullet List, Quote
  - Mood tag selector: small mood slider (1-10) above editor
  - "Save" button (auto-saves every 30s as well)
  - Search: search across all entries (full-text search)
  - Date filter: date range picker to filter entries
  - All entries are private by default (isPrivate = true)

API endpoints:
  POST /api/v1/health-tools/journal
    Auth: verifyToken
    Body: { content: string, moodTag?: number }
    Zod: z.object({
      content: z.string().min(1, 'Journal entry cannot be empty'),
      moodTag: z.number().int().min(1).max(10).optional()
    })
    Response: { success: true, data: { entry: JournalEntry } }

  GET /api/v1/health-tools/journal
    Auth: verifyToken
    Query: ?page=1&limit=20&search=text&startDate=2025-01-01&endDate=2025-01-31
    Response: { entries: JournalEntry[], total, page }

  GET /api/v1/health-tools/journal/:id
    Auth: verifyToken
    Response: { entry: JournalEntry }

  PATCH /api/v1/health-tools/journal/:id
    Auth: verifyToken
    Body: { content?: string, moodTag?: number }
    Response: { entry: JournalEntry }

  DELETE /api/v1/health-tools/journal/:id
    Auth: verifyToken
    Response: { success: true }

=== TOOL 4: BREATHING EXERCISES ===

Component: src/pages/dashboard/health-tools/BreathingPage.tsx

Patterns available:
  1. Box Breathing (4-4-4-4):
     Inhale 4s → Hold 4s → Exhale 4s → Hold 4s → repeat
  2. 4-7-8 Breathing:
     Inhale 4s → Hold 7s → Exhale 8s → repeat
  3. Alternate Nostril:
     Right nostril inhale 4s → Hold 4s → Left nostril exhale 4s → Left inhale 4s → Hold 4s → Right exhale 4s → repeat

UI Elements:
  - Pattern selector: 3 large cards with pattern name + description
  - Rounds selector: 3 / 5 / 10 rounds (radio buttons)
  - "Start" button

During exercise:
  - Animated circle:
    Expand = inhale (circle grows from small to large, color changes to light blue)
    Hold = circle stays at current size, pulses gently
    Shrink = exhale (circle shrinks, color fades)
  - Text instruction: "Inhale...", "Hold...", "Exhale..." (centered in circle)
  - Counter: "Round {X} of {Y}"
  - Timer: seconds countdown per phase
  - Implementation: Framer Motion animate with keyframes:
    animate={{ scale: [0.5, 1, 1, 0.5] }}
    transition={{ duration: totalCycleTime, times: [0, inhaleEnd, holdEnd, 1], repeat: rounds }}

Completion:
  - "Well done! You completed {X} rounds of {pattern}." message
  - Session duration shown
  - Save button (auto-saves on completion)

API endpoints:
  POST /api/v1/health-tools/breathing
    Auth: verifyToken
    Body: { pattern: string, rounds: number, duration: number, completed: boolean }
    Zod: z.object({
      pattern: z.enum(['box-4-4-4-4', '4-7-8', 'alternate-nostril']),
      rounds: z.number().int().min(1).max(20),
      duration: z.number().int().min(1),
      completed: z.boolean()
    })
    Response: { success: true, data: { session: BreathingSession } }

  GET /api/v1/health-tools/breathing/stats
    Auth: verifyToken
    Response: { totalSessions, totalMinutes, favoritePattern, thisWeek: number }

=== DATA FEEDS ===

All health tools data feeds into:
  1. User dashboard: mood trend chart, meditation minutes, stats cards
  2. Therapist view: therapist can see client's mood logs, journal entries (if shared), meditation/breathing stats
  3. AI assistant: context for personalized recommendations
  4. Pattern detection: declining mood triggers therapist notification
  5. Personality reports: used for generating user insights

=== ERROR CODES ===

HEALTH_001: Invalid mood value (must be 1-10)
HEALTH_002: Journal entry not found
HEALTH_003: Cannot edit another user's journal
HEALTH_004: Invalid breathing pattern
HEALTH_005: Maximum 5 emotions/triggers allowed

=== UI STATES ===

Mood tracker loading: Skeleton slider + skeleton chips
Mood logged: Green checkmark animation + "Mood logged!" toast
Meditation active: progress ring animating, ambient sound playing
Meditation complete: celebration animation (sparkles) + stats
Journal loading: Skeleton sidebar + skeleton editor
Journal saved: "Saved ✓" indicator in top-right
Breathing active: animated circle expanding/contracting
Breathing complete: "Session complete!" + stats

=== TEST SCENARIOS ===

- Log mood → appears in chart → mood trend updates on dashboard
- Log mood with 5 emotions → 6th rejected (max 5)
- Start meditation → ambient sound plays → timer counts down → bell at end → saved
- Pause meditation → resume → complete → saved with actual duration
- Create journal entry → auto-saves → search entries → date filter works
- Delete journal entry → confirmation → removed
- Start breathing exercise → circle animates correctly → rounds count → saved
- All data visible in therapist's client detail page
- Declining mood pattern (3+ days) → therapist notified

VERIFY: Log mood → meditate → journal → see data on dashboard charts.
All four tools work. Data feeds to therapist and AI. Pattern detection works.
```

---

### PHASE 17: Notifications & Real-time
**Time estimate: 1 session**

```
TASK: Build notification system with Socket.IO.

=== PRISMA MODEL ===

model Notification {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String      // event type (see complete list below)
  title       String
  body        String
  actionUrl   String?     // URL to navigate to on click
  icon        String?     // Lucide icon name
  priority    NotificationPriority @default(NORMAL)
  isRead      Boolean     @default(false)
  readAt      DateTime?
  channel     String[]    // ["in-app", "email", "push", "sms"]
  deliveryStatus Json     @default("{}")  // { inApp: "sent", email: "sent", push: "failed" }
  retryCount  Int         @default(0)
  metadata    Json?       // extra data specific to notification type
  createdAt   DateTime    @default(now())

  @@index([userId, isRead])
  @@index([userId, createdAt])
  @@index([type])
}

enum NotificationPriority {
  CRITICAL   // immediate delivery, all channels
  HIGH       // < 5 minutes, in-app + email + push
  NORMAL     // batched every 15 minutes
  LOW        // daily digest email
}

model NotificationPreference {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  email       Boolean     @default(true)
  push        Boolean     @default(true)
  sms         Boolean     @default(false)
  quietHoursStart String? // "22:00" — no notifications after this time
  quietHoursEnd   String? // "08:00" — notifications resume
  disabledTypes   String[] @default([])  // event types user has muted
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

=== COMPLETE NOTIFICATION EVENTS LIST (30+) ===

SESSION EVENTS:
  1.  session-booked         — "Your session with {therapist} is booked for {date}"
  2.  session-reminder-1h    — "Your session with {therapist} starts in 1 hour"
  3.  session-starting       — "Your session is starting now. Join here."
  4.  session-completed      — "Your session with {therapist} has ended. How was it?"
  5.  session-cancelled      — "Your session on {date} has been cancelled"
  6.  session-rescheduled    — "Your session has been rescheduled to {newDate}"

TASK EVENTS:
  7.  task-assigned           — "New healing task: {taskTitle}"
  8.  task-due-reminder       — "Your task '{taskTitle}' is due tomorrow"
  9.  task-overdue            — "Your task '{taskTitle}' is overdue"

EMERGENCY EVENTS:
  10. emergency-flag-created  — "🚨 Emergency flag for {clientName}"
  11. emergency-escalated     — "🚨 Emergency escalated to admin"

MESSAGING EVENTS:
  12. new-message             — "New message from {senderName}"
  13. new-comment             — "New comment on your post: {excerpt}"
  14. new-follower            — "{userName} started following you"

CONTENT EVENTS:
  15. blog-approved           — "Your blog post '{title}' has been approved!"
  16. blog-rejected           — "Your blog post '{title}' was rejected: {reason}"
  17. course-approved         — "Your course '{title}' has been approved!"
  18. course-rejected         — "Your course '{title}' was rejected: {reason}"

PAYMENT EVENTS:
  19. payment-success         — "Payment of {amount} received successfully"
  20. payment-failed          — "Payment of {amount} failed. Please retry."
  21. payout-processed        — "Payout of {amount} has been processed to your account"

MEMBERSHIP EVENTS:
  22. membership-expiring     — "Your {tier} membership expires in 3 days"
  23. membership-expired      — "Your {tier} membership has expired"
  24. membership-renewed      — "Your {tier} membership has been renewed"

EVENT EVENTS:
  25. event-reminder          — "Event '{eventName}' starts tomorrow"
  26. event-starting          — "Event '{eventName}' is starting now"

THERAPIST-SPECIFIC:
  27. mood-decline-detected   — "⚠️ Client {name}'s mood declining for {N} days"
  28. client-crisis           — "🚨 Client {name} triggered crisis flag"

ASTROLOGY EVENTS:
  29. new-astrology-task      — "New astrology analysis required for {clientName}"
  30. prediction-accuracy     — "Your prediction accuracy result: {result}"

REVIEW/COMPLAINT:
  31. review-received         — "New review from {clientName}: {stars} stars"
  32. complaint-response      — "Your complaint #{id} has been updated"

ADMIN:
  33. admin-broadcast         — "{broadcastMessage}"  // admin sends to all/segment

=== DELIVERY CHANNELS PER EVENT ===

CRITICAL (immediate, all channels):
  emergency-flag-created, emergency-escalated, client-crisis

HIGH (< 5 min, in-app + email + push):
  session-starting, mood-decline-detected, payment-failed, task-overdue

NORMAL (batched every 15 min, in-app + optional email/push):
  session-booked, session-completed, task-assigned, new-message, new-comment,
  blog-approved, course-approved, payment-success, payout-processed,
  membership-expiring, event-reminder, review-received

LOW (daily digest, in-app only unless configured):
  new-follower, blog-rejected, course-rejected, prediction-accuracy,
  complaint-response

SMS (critical only):
  emergency-flag-created, emergency-escalated, client-crisis

=== NOTIFICATION TEMPLATE ===

Each notification has:
  - title: short headline (max 100 chars)
  - body: descriptive text (max 300 chars)
  - actionUrl: where to navigate on click (e.g., "/dashboard/sessions/123")
  - icon: Lucide icon name (e.g., "Calendar", "AlertTriangle", "Heart")
  - priority: CRITICAL | HIGH | NORMAL | LOW

=== RETRY LOGIC ===

Failed delivery retried with exponential backoff:
  Attempt 1: immediate
  Attempt 2: after 1 minute
  Attempt 3: after 5 minutes
  Attempt 4: after 30 minutes
  Max retries: 3 (after 3 failures → mark as "failed" in deliveryStatus)
  Implementation: Bull queue with backoff strategy

=== SOCKET.IO SETUP ===

Server setup (server/src/socket.ts):
  - Initialize Socket.IO with CORS for frontend origin
  - Auth middleware: verify JWT on connection
  - Join user to their own room: socket.join(`user:${userId}`)
  - Emit notifications: io.to(`user:${userId}`).emit('notification', notificationData)

Client setup (src/hooks/useSocket.ts):
  - Connect on login, disconnect on logout
  - Listen for 'notification' event
  - Update notification count in header bell icon
  - Show toast for HIGH/CRITICAL notifications
  - Play sound for CRITICAL notifications

=== FRONTEND COMPONENTS ===

NotificationBell (src/components/notifications/NotificationBell.tsx):
  Props: none (uses context/hook)
  Display: Bell icon in header with red badge showing unread count
  Click: opens dropdown with last 10 notifications
  Each notification: icon + title + body + timestamp + read/unread indicator
  "Mark all as read" link at top
  "View all" link at bottom → /dashboard/notifications

NotificationsList (src/pages/dashboard/NotificationsPage.tsx):
  Full page list of all notifications
  Filters: All, Unread, type filter dropdown
  Infinite scroll
  Click notification → mark as read + navigate to actionUrl

NotificationPreferences (src/pages/dashboard/SettingsPage.tsx → notifications tab):
  Toggle switches: Email, Push, SMS
  Quiet hours: start time + end time pickers
  Per-type toggles: expandable list of notification types, each with on/off

=== API ENDPOINTS ===

GET /api/v1/notifications
  Auth: verifyToken
  Query: ?page=1&limit=20&unreadOnly=true&type=session-booked
  Response: { notifications: Notification[], total, unreadCount }

PATCH /api/v1/notifications/:id/read
  Auth: verifyToken
  Response: { success: true }

POST /api/v1/notifications/read-all
  Auth: verifyToken
  Response: { success: true, updatedCount: number }

GET /api/v1/notifications/preferences
  Auth: verifyToken
  Response: { preferences: NotificationPreference }

PATCH /api/v1/notifications/preferences
  Auth: verifyToken
  Body: { email?, push?, sms?, quietHoursStart?, quietHoursEnd?, disabledTypes? }
  Response: { preferences: NotificationPreference }

POST /api/v1/admin/notifications/broadcast
  Auth: requireRole(ADMIN)
  Body: { title, body, targetAudience: 'all' | 'tier:seeker' | 'role:therapist', actionUrl? }
  Response: { success: true, recipientCount: number }

=== SERVICE (server/src/services/notification.service.ts) ===

async function sendNotification(params: {
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  icon?: string;
  priority?: NotificationPriority;
  metadata?: any;
}) {
  1. Check user's notification preferences
  2. Check quiet hours → if in quiet hours and priority !== CRITICAL → queue for later
  3. Create Notification record in DB
  4. Determine channels based on event type + user preferences
  5. In-app: emit via Socket.IO
  6. Email: queue to Bull email queue (use Resend/SES)
  7. Push: queue to Bull push queue (web push via service worker)
  8. SMS: queue to Bull SMS queue (Twilio) — only for CRITICAL
  9. If NORMAL priority: batch (don't send immediately, aggregate over 15 min)
  10. If LOW priority: add to daily digest queue
}

=== ERROR CODES ===

NOTIF_001: Notification not found
NOTIF_002: Cannot modify another user's notification
NOTIF_003: Invalid notification type
NOTIF_004: Push subscription not found — user hasn't enabled push
NOTIF_005: SMS not available — user hasn't provided phone

=== UI STATES ===

Bell loading: skeleton badge
Dropdown loading: skeleton rows
Empty: "No notifications yet"
New notification: toast slides in from top-right + bell badge increments + subtle sound
Mark as read: row fades from bold to normal text
Preferences saving: "Saving..." indicator

=== TEST SCENARIOS ===

- Emergency flag created → therapist gets real-time notification (Socket.IO) + email + push
- Book session → user gets "session-booked" notification → click → navigates to session detail
- User sets quiet hours 22:00-08:00 → notification at 23:00 → queued until 08:00
- User disables email notifications → no emails sent, still gets in-app
- Admin sends broadcast → all users receive in-app notification
- Failed push delivery → retried 3 times with backoff → marked as failed after 3rd
- View all notifications → infinite scroll → filter by type → mark all as read
- CRITICAL notification → sound plays + toast appears immediately

VERIFY: Emergency flag created → therapist gets real-time notification.
All 30+ notification types work. Preferences respected. Retry logic works.
```

---

### PHASE 18: Landing Page Animations & Polish
**Time estimate: 1 session**

```
TASK: Add Framer Motion animations and optional Three.js effects to landing page.

=== ANIMATION INVENTORY ===

1. SPLASH SCREEN (shown on first visit only, stored in sessionStorage):
   Component: src/components/landing/SplashScreen.tsx
   Sequence:
     - 0.0s: Black screen
     - 0.0-0.5s: Logo fade-in (opacity 0→1, scale 0.8→1) — Framer Motion
     - 0.5-1.5s: Tagline type-in effect ("Your Healing Journey Begins Here")
       Implementation: string split into chars, each char fades in with 50ms stagger
     - 1.5-2.5s: Background gradient transition (black → brand gradient)
     - 2.5-3.0s: Everything slides up and fades out
     - 3.0s: Auto-navigate to /home content (remove splash from DOM)
   Performance: no heavy assets, pure CSS + Framer Motion

2. HERO SECTION:
   Component: src/components/landing/HeroSection.tsx
   Animations:
     - Text scale-in: headline starts at scale(0.9), opacity 0 → animates to scale(1), opacity 1 (0.6s, ease-out)
     - Subtitle fade-up: 0.2s delay after headline
     - CTA buttons stagger-in: each button delays 0.1s after previous
     - Parallax scroll: background image/gradient moves at 0.5x scroll speed
       Implementation: useScroll() + useTransform() from Framer Motion
     - Floating particles (optional): subtle floating dots using CSS animation (no Three.js needed for this)
       CSS: @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-20px) } 100% { transform: translateY(0) } }

3. SECTION ANIMATIONS (IntersectionObserver + Framer Motion):
   Component: src/components/landing/AnimatedSection.tsx (reusable wrapper)
   Props: { children, animation: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in', delay?: number }
   Implementation:
     - useInView() hook from Framer Motion
     - When section enters viewport (threshold: 0.2):
       fade-up: y: 40→0, opacity: 0→1 (0.6s)
       fade-in: opacity: 0→1 (0.5s)
       slide-left: x: -60→0, opacity: 0→1 (0.6s)
       slide-right: x: 60→0, opacity: 0→1 (0.6s)
       scale-in: scale: 0.8→1, opacity: 0→1 (0.5s)
     - Only animates once (once: true option)

4. SPECIFIC SECTION ANIMATIONS:
   - Services section: cards stagger-in from bottom (0.1s delay between each)
   - Testimonial carousel: auto-play every 5s, swipe gesture support, dot indicators
   - Stats counter: numbers animate from 0 to target value (e.g., "10,000+ Users")
     Library: Use framer-motion useMotionValue + useTransform, or simple requestAnimationFrame counter
     Duration: 2s count-up animation, triggered on scroll into view
   - CTA button pulse: subtle scale pulse animation (scale 1→1.05→1) every 3s
     CSS: @keyframes pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.05) } }
   - Team section: avatar cards fade-in with stagger
   - Pricing section: cards slide up with stagger
   - FAQ section: accordion open/close with height animation (Framer Motion layout animation)

5. NAVBAR:
   - Blur on scroll: when scrollY > 50, add backdrop-filter: blur(10px) + semi-transparent background
     Implementation: useScroll() → useTransform() → dynamic style
   - Mobile menu: slide down animation from top (Framer Motion, height: 0→auto)

6. THREE.JS SCENE (OPTIONAL — only if performance budget allows):
   Component: src/components/landing/LotusScene.tsx
   Details:
     - 3D lotus flower model in hero section background
     - Slow continuous rotation (0.005 rad/frame)
     - Responds to mouse movement: tilt toward cursor (subtle, max 15 degrees)
     - Implementation: @react-three/fiber + @react-three/drei
     - Load model: useGLTF() for .glb lotus model
     - Lighting: ambient light (0.5) + directional light (1.0)
   Performance guard:
     - Check WebGL availability: renderer.capabilities.isWebGL2
     - If not available → fallback to static gradient background
     - Lazy-load Three.js bundle only if WebGL available:
       const LotusScene = lazy(() => import('./LotusScene'))

7. PAGE TRANSITIONS:
   Component: wrap app routes with Framer Motion AnimatePresence
   Implementation:
     <AnimatePresence mode="wait">
       <motion.div
         key={location.pathname}
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -20 }}
         transition={{ duration: 0.3, ease: "easeInOut" }}
       >
         <Outlet />
       </motion.div>
     </AnimatePresence>

=== PERFORMANCE BUDGET ===

- Total animation JavaScript: < 50KB gzipped
  - framer-motion: ~35KB gzipped (tree-shakeable)
  - Three.js (if used): lazy-loaded, not included in main bundle
- Respect prefers-reduced-motion:
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) → disable ALL animations, show static content
  Implementation: useReducedMotion() hook from Framer Motion
- No animation should block rendering or cause layout shift (CLS < 0.1)
- All animations use transform/opacity only (GPU-accelerated, no layout triggers)
- Lighthouse performance score must remain 90+

=== DEPENDENCIES ===

- framer-motion (already may be installed)
- @react-three/fiber + @react-three/drei + three (optional, lazy-loaded)
- canvas-confetti (for onboarding completion, already referenced in Phase 2)

=== SUB-STEPS ===

18a. Install framer-motion (if not already): npm install framer-motion
18b. Create AnimatedSection wrapper component
18c. Create SplashScreen component
18d. Add hero section animations (parallax, text scale-in)
18e. Add section scroll animations (services, testimonials, stats, FAQ)
18f. Add stats counter animation
18g. Add navbar blur-on-scroll
18h. Add page transition wrapper with AnimatePresence
18i. (Optional) Install Three.js deps + create LotusScene
18j. Add prefers-reduced-motion checks everywhere
18k. Lighthouse audit → verify 90+ performance score

=== TEST SCENARIOS ===

- First visit → splash screen plays → auto-navigates to home
- Second visit (same session) → no splash screen
- Scroll down → sections animate in on scroll
- Stats section enters viewport → numbers count up from 0
- Navbar → scroll down → becomes blurred/transparent
- Page navigation → smooth transition (fade + slide)
- Set prefers-reduced-motion → no animations, all content static
- Mobile → animations work, no jank, no layout shifts
- Lighthouse → performance ≥ 90
- (Optional) Three.js lotus → rotates, responds to mouse, loads only with WebGL

VERIFY: Landing page loads smoothly with animations, scores 90+ on Lighthouse.
prefers-reduced-motion respected. No layout shifts.
```

---

### PHASE 19: About Us, Careers, Public Pages & Professional Onboarding
**Time estimate: 2 sessions**

```
TASK: Build About Us, Careers/Hiring portal, professional onboarding flow
(therapist & astrologer credentialing), and other public pages.

CONTEXT: Professional onboarding types in src/types/auth.types.ts
(ProfessionalOnboarding, QualificationDocument).
Employee lifecycle types in src/types/admin.types.ts
(EmployeeLifecycle, TrainingModule).

STEP 1 — src/pages/AboutPage.tsx:
  - Company mission, vision, story
  - Team section (photos, roles, bios)
  - Timeline / milestones
  - Values / principles
  - Press / media mentions

STEP 2 — src/pages/CareersPage.tsx:
  - Open positions listing
  - Job detail page with apply button
  - Application form (name, email, resume upload, cover letter)
  - Department filter (Engineering, Therapy, Astrology, Marketing, Operations)

STEP 3 — Backend: /api/v1/careers/
  - GET /positions — list open positions
  - GET /positions/:id — position detail
  - POST /positions/:id/apply — submit application (with file upload)
  - Admin: CRUD for positions

STEP 4 — src/pages/ContactPage.tsx:
  - Contact form (name, email, subject, message)
  - Office address, email, phone
  - Map embed

STEP 5 — Therapist/Astrologer Professional Onboarding Flow:
  Uses ProfessionalOnboarding type from auth.types.ts.
  This is the full credentialing pipeline:

  5a. Application Stage:
    - Public "Join as Therapist" / "Join as Astrologer" page
    - Collect: name, email, phone, qualifications, experience, bio
    - Upload: Aadhaar card, PAN card, license/degree documents
    - Submit application → status: 'application-received'

  5b. Document Verification:
    - Admin reviews uploaded documents
    - License number verified against official databases
    - Aadhaar verification (optional: DigiLocker API integration)
    - Status: 'documents-pending' → verified

  5c. Background Check:
    - Initiate background check via third-party provider
    - Criminal record check, identity verification
    - Status tracking: pending → in-progress → cleared/flagged
    - Flagged applications → admin review

  5d. Interview:
    - Schedule interview with HR/admin
    - Video interview via platform (same Daily.co/100ms setup)
    - Interview score (0-100)
    - Status: scheduled → completed → passed/failed

  5e. Assessment Test (especially for astrologers):
    - Astrologers: Take prediction accuracy test
      (given sample birth charts, write predictions, AI + senior astrologers evaluate)
    - Therapists: Case study evaluation
    - Minimum score required to proceed
    - Correct predictions earn initial brownie points

  5f. Trial Period:
    - Approved professionals get trial access (3-5 supervised sessions)
    - Sessions monitored by AI (same TherapistSessionMonitor system)
    - Senior therapist/astrologer reviews trial sessions
    - Trial feedback score determines final approval
    - Status tracking: trial-started → sessions-completed → reviewed

  5g. Platform Training:
    - Mandatory training modules (using TrainingModule type):
      • Platform usage and features
      • Emergency protocol and crisis handling
      • Data privacy and confidentiality rules
      • Session recording consent procedures
      • Ethical guidelines and boundaries
      • Payment and payout procedures
    - Must complete ALL modules before going live
    - Quiz after each module — minimum 80% to pass

  5h. Approval & Go-Live:
    - All steps passed → admin final approval
    - Profile activated → visible to users for booking
    - Welcome kit + first-month support from assigned mentor

  5i. Ongoing Verification:
    - Annual license re-verification reminder
    - Continuous AI quality monitoring (every session scored)
    - Performance reviews (quarterly)
    - Brownie point tracking for astrologers

STEP 6 — Employee Lifecycle Management:
  Uses EmployeeLifecycle type from admin.types.ts.
  - Probation period tracking (3-6 months)
  - Performance reviews (monthly/quarterly)
  - Notice period management
  - Exit interview workflow
  - Knowledge transfer tracking
  - Rehire eligibility status

STEP 7 — Admin views:
  - /admin/hiring — see all applications, pipeline stages
  - /admin/employees — see employee lifecycle status (training/probation/active/notice/exited)
  - Professional onboarding pipeline dashboard with stage-by-stage funnel

STEP 8 — Add all routes to router under MainLayout

VERIFY: Visit /about → see team. Visit /careers → see jobs → apply.
Apply as therapist → upload documents → background check → interview →
trial sessions → training → approved → visible to users.
```
### PHASE 20: Department Dashboards & Employee System
**Time estimate: 2 sessions**

```
TASK: Build centralized department-wise dashboards with targets, plans, and tracking.

CONTEXT: Every department in Soul Yatri has its own dashboard. Every employee action
is tracked. Each department has targets and KPIs.

=== PRISMA MODELS ===

model Department {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  headId      String?     // userId of department head
  head        User?    @relation("DepartmentHead", fields: [headId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  employees   Employee[]
  targets     Target[]
}

model Employee {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  departmentId  String
  department    Department @relation(fields: [departmentId], references: [id])
  designation   String
  joinedAt      DateTime @default(now())
  status        EmployeeStatus @default(ACTIVE)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  actions       EmployeeAction[]

  @@index([departmentId])
  @@index([status])
}

enum EmployeeStatus {
  TRAINING
  PROBATION
  ACTIVE
  ON_LEAVE
  NOTICE_PERIOD
  EXITED
}

model Target {
  id            String   @id @default(cuid())
  departmentId  String
  department    Department @relation(fields: [departmentId], references: [id])
  metric        String      // e.g., "sessions_per_day", "avg_rating", "revenue"
  metricLabel   String      // human-readable: "Sessions Per Day"
  targetValue   Float
  currentValue  Float       @default(0)
  unit          String?     // "%", "₹", "count", "minutes"
  period        String      @default("monthly")  // daily, weekly, monthly, quarterly
  deadline      DateTime?
  status        TargetStatus @default(IN_PROGRESS)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([departmentId])
  @@index([period])
}

enum TargetStatus {
  IN_PROGRESS
  MET
  MISSED
  EXCEEDED
}

model EmployeeAction {
  id          String   @id @default(cuid())
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])
  action      String      // e.g., "session-completed", "blog-approved", "complaint-resolved"
  resource    String?     // resource ID if applicable
  resourceType String?   // "session", "blog", "complaint"
  details     Json?       // additional context
  ipAddress   String?
  timestamp   DateTime    @default(now())

  @@index([employeeId])
  @@index([timestamp])
  @@index([action])
}

=== DEPARTMENT-SPECIFIC KPIs ===

THERAPY DEPARTMENT:
  KPIs tracked:
    - Sessions per day (target: X)
    - Average session rating (target: 4.5+)
    - Therapist utilization rate: active_session_hours / available_hours * 100
    - Client retention rate: clients with 3+ sessions / total clients * 100
    - Emergency response rate: emergencies handled / total emergencies * 100
    - No-show rate: no_show_sessions / total_sessions * 100

ASTROLOGY DEPARTMENT:
  KPIs tracked:
    - Analyses per day (target: X)
    - Average accuracy rate: accurate_predictions / total_predictions * 100
    - Brownie point distribution: histogram of astrologer points
    - Average response time: time from task creation to analysis submission
    - AI vs Human accuracy comparison

MARKETING DEPARTMENT:
  KPIs tracked:
    - Blog posts published this month
    - Organic traffic (from Google Search Console API)
    - Keyword rankings: count of keywords in top 10
    - Conversion rate: signups / visitors * 100
    - Social media engagement rate
    - Email open rate / click rate

SALES DEPARTMENT:
  KPIs tracked:
    - New subscriptions this month
    - MRR (Monthly Recurring Revenue): sum of active subscription prices
    - Churn rate: cancelled_subscriptions / total_subscriptions * 100
    - Upsell conversion: upgrades / total_subscribers * 100
    - Corporate accounts acquired this quarter
    - Average deal size for corporate

SUPPORT DEPARTMENT:
  KPIs tracked:
    - Open tickets count
    - Average resolution time (hours)
    - CSAT score: average customer satisfaction rating (1-5)
    - First-response time: average time to first response (minutes)
    - Escalation rate: escalated_tickets / total_tickets * 100
    - Resolution rate: resolved_tickets / total_tickets * 100

CONTENT DEPARTMENT:
  KPIs tracked:
    - Courses published this month
    - Course completion rate: completed_enrollments / total_enrollments * 100
    - Community posts per day
    - Moderation queue size: pending content reviews
    - Average course rating
    - Content output: blog posts + courses + community posts

ENGINEERING DEPARTMENT:
  KPIs tracked:
    - Platform uptime %: uptime_minutes / total_minutes * 100
    - Bug count: open bugs from issue tracker
    - Feature velocity: features shipped per sprint
    - API response time p95: 95th percentile response time (ms)
    - Error rate: 5xx_responses / total_responses * 100
    - Deployment frequency: deploys per week

=== DEPARTMENT DASHBOARD PAGES ===

Each department page has consistent layout:
  Component pattern: src/pages/admin/departments/{DeptName}DeptPage.tsx

  Layout:
    1. Summary cards at top (4-6 cards with key metrics)
       Each card: metric value + label + trend arrow (up/down vs last period) + color (green if on target, red if behind)
    2. Trend chart: Recharts LineChart or BarChart showing primary metric over time (last 30 days / 12 months)
    3. Team members table: DataTable with columns (Name, Role, Individual KPIs, Rating, Status)
       Each row expandable to show individual performance detail
    4. Target progress bars: horizontal progress bars for each target
       Bar color: green (≥ 90% of target), yellow (60-89%), red (< 60%)
       Show: current value / target value + percentage

  API:
    GET /api/v1/departments/:slug/dashboard
    Response: {
      summary: { metricName: { value, previousValue, trend, targetValue, unit } },
      chartData: [{ date, value }],
      teamMembers: [{ id, name, designation, kpis: Record<string, number>, rating, status }],
      targets: Target[]
    }

=== EMPLOYEE DASHBOARD ===

src/pages/employee/EmployeeDashboardPage.tsx
  - Personal KPIs and targets (relevant to their department)
  - Tasks assigned to them
  - Time tracking (if applicable)
  - Team members list
  - Department announcements

=== HEAD OFFICE / CEO DASHBOARD ===

src/pages/admin/HeadOfficePage.tsx
Uses HeadOfficeDashboard type (from admin.types.ts) which aggregates:
  - platformStats: ALL user/session/revenue/event/membership/NGO/community/blog/
    course/shop/AI/fraud stats in one object
  - revenue: full RevenueReport breakdown by source
  - departments: all departments with targets and performance status
  - topPerformers: best employees by rating/revenue
  - criticalAlerts: emergency flags, fraud, critical complaints, system errors
  - platformHealth: API uptime, response times, storage, error rates
  - pendingActions: count of items needing approval (blogs, courses, complaints,
    hiring, NGO requests, therapist verification, fraud reviews, refunds, events)

The head office page is the SINGLE source of truth for the entire platform.
Every section of Soul Yatri is visible and controllable from here.

=== ACTION LOGGING MIDDLEWARE ===

Every API call by any employee → logged to EmployeeAction table:
  - Middleware: server/src/middleware/actionLogger.ts
  - Attaches to all routes for authenticated employees
  - Logs: employeeId, action (HTTP method + route), resource (target entity ID), timestamp, IP
  - Filterable in admin: by employee, department, date range, action type
  - Exportable to CSV for auditing

=== ERROR CODES ===

DEPT_001: Department not found
DEPT_002: Employee not found
DEPT_003: Target not found
DEPT_004: Insufficient permissions — not a department head or admin
DEPT_005: Invalid target period

=== TEST SCENARIOS ===

- Login as admin → see all departments → drill into each → see targets + team + chart
- Login as department head → see only their department dashboard
- Login as employee → see personal KPIs + team
- Therapy department → sessions/day metric updates in real-time
- Target exceeded → status changes to "EXCEEDED" with green badge
- Target missed → status changes to "MISSED" with red badge
- Employee action logged → appears in audit log → exportable
- Head Office → all departments visible → click into any → see details

VERIFY: Login as admin → see all departments → drill into each → see targets.
KPIs update. Action logging works. Head Office aggregates everything.
```

---

### PHASE 21: SEO Automation & Search Ranking System
**Time estimate: 2-3 sessions**

```
TASK: Build automated SEO system to rank on EVERY relevant search keyword.
Also implement GEO (AI search), PSEO (programmatic), SXO (experience), and ASO (app store).

CONTEXT: Types are in src/types/seo.types.ts. Soul Yatri owns 3 domains:
  www.soulyatri.com (primary), www.soulyatri.in (redirect), www.soulyatri.net (redirect).

STEP 1 — Multi-domain setup:
  - Configure soulyatri.in and soulyatri.net as 301 redirects to soulyatri.com
  - Set canonical URLs on every page pointing to soulyatri.com
  - Add hreflang tags for English content
  - SSL on all 3 domains via Cloudflare

STEP 2 — SEO infrastructure:
  - Server-side rendering for all public pages (blog, courses, shop, about, events)
  - Auto-generate sitemap.xml (all blog posts, courses, products, events, pages)
  - robots.txt configuration
  - JSON-LD structured data for every page type (Organization, Article, Product,
    Course, Event, FAQPage, MedicalBusiness, BreadcrumbList)
  - Open Graph + Twitter Card meta tags on every page

STEP 3 — Blog SEO automation:
  - AI-powered keyword research: fetch trending mental health keywords
  - Auto-suggest blog topics based on trending searches
  - Auto-generate meta descriptions for posts
  - Internal linking suggestions between blog posts
  - Schema markup for articles (author, date, ratings)

STEP 4 — Programmatic SEO (PSEO) pages:
  - /therapist-for-[issue] pages (anxiety, depression, trauma, etc.)
  - /meditation-for-[goal] pages
  - /[city]-therapist pages (location-based)
  - /therapy-type-[type] pages (CBT, DBT, mindfulness, etc.)
  - /healing-guide-[topic] pages (self-help guides)
  - Each auto-generated with unique content + internal links + CTA
  - Use PSEOTemplate type from seo.types.ts
  - Target 500+ long-tail keyword pages

STEP 5 — GEO (Generative Engine Optimization):
  - FAQ-style structured content on key pages (for AI citation)
  - Clear, factual answers to common mental health questions
  - Organization schema markup (for brand recognition in AI)
  - Track brand mentions in ChatGPT, Gemini, Perplexity monthly
  - Use GEOConfig, StructuredAnswer, AIBrandMention from seo.types.ts

STEP 6 — SXO (Search Experience Optimization):
  - Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
  - Track bounce rate, time on page, scroll depth, conversion rate
  - Clear CTAs above fold on every page
  - Use SXOMetrics type from seo.types.ts

STEP 7 — Monitoring:
  - Google Search Console integration
  - Track keyword rankings over time (TrackedKeyword type)
  - Alert admin if ranking drops for important keywords
  - Dashboard: /admin/seo with keyword rankings, PSEO page performance, sitemap status

STEP 8 — AI content pipeline:
  - Scheduled job: weekly trending keyword analysis
  - Generate draft blog posts for trending topics
  - Admin reviews and publishes
  - Auto-generate keyword suggestions (KeywordSuggestion type)

STEP 9 — ASO preparation (for future mobile app):
  - Define app store listing content (ASOConfig type)
  - Screenshot templates, preview video spec
  - Deep linking strategy (web ↔ app)

VERIFY:
  Blog posts have proper meta tags → sitemap includes all pages →
  structured data validates on Google Rich Results Test →
  PSEO pages are indexable and have unique content →
  3 domains all resolve correctly → canonical URLs are correct.
```

---

### PHASE 22: Soul Events
**Time estimate: 1-2 sessions**

```
TASK: Build events system — workshops, retreats, webinars, meditation circles.

=== PRISMA MODELS ===

model Event {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String      // rich text
  shortDescription String?
  type            EventType
  format          EventFormat
  thumbnail       String?     // S3 URL
  images          String[]
  organizerId     String
  organizer       User     @relation(fields: [organizerId], references: [id])
  venue           String?     // for in-person events
  venueAddress    String?
  venueMapUrl     String?     // Google Maps embed URL
  videoRoomId     String?     // Daily.co room for virtual events
  startDate       DateTime
  endDate         DateTime
  timezone        String      @default("Asia/Kolkata")
  maxAttendees    Int?
  currentAttendees Int       @default(0)
  isFeatured      Boolean     @default(false)
  isMemberOnly    Boolean     @default(false)
  requiredTier    String?     // minimum membership tier required
  status          EventStatus @default(DRAFT)
  tags            String[]
  publishedAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  speakers        EventSpeaker[]
  tickets         EventTicket[]
  registrations   EventRegistration[]
  feedback        EventFeedback[]

  @@index([slug])
  @@index([type])
  @@index([startDate])
  @@index([status])
}

enum EventType {
  WORKSHOP
  RETREAT
  WEBINAR
  MEDITATION_CIRCLE
  BREATHWORK_SESSION
  CORPORATE_SESSION
}

enum EventFormat {
  IN_PERSON
  VIRTUAL
  HYBRID
}

enum EventStatus {
  DRAFT
  PUBLISHED
  ONGOING
  COMPLETED
  CANCELLED
}

model EventSpeaker {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  name        String
  bio         String?
  avatar      String?
  designation String?
  order       Int         @default(0)
  createdAt   DateTime @default(now())

  @@index([eventId])
}

model EventTicket {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  name        String      // e.g., "Early Bird", "Regular", "VIP"
  type        TicketType
  price       Float       @default(0)   // 0 for free tickets
  currency    String      @default("INR")
  quantity    Int?        // null = unlimited
  sold        Int         @default(0)
  salesStart  DateTime?   // when ticket sales open
  salesEnd    DateTime?   // when ticket sales close
  description String?
  createdAt   DateTime @default(now())

  @@index([eventId])
}

enum TicketType {
  FREE
  PAID
  MEMBER_ONLY
}

model EventRegistration {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  ticketId    String
  ticket      EventTicket @relation(fields: [ticketId], references: [id])
  paymentId   String?
  status      RegistrationStatus @default(REGISTERED)
  checkedIn   Boolean     @default(false)
  checkedInAt DateTime?
  qrCode      String?     // unique QR code for check-in
  waitlistPosition Int?   // null if not on waitlist
  createdAt   DateTime    @default(now())

  @@unique([eventId, userId])  // one registration per user per event
  @@index([eventId])
  @@index([userId])
}

enum RegistrationStatus {
  REGISTERED
  WAITLISTED
  CHECKED_IN
  CANCELLED
  NO_SHOW
}

model EventFeedback {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  rating      Int         // 1-5
  comment     String?
  createdAt   DateTime    @default(now())

  @@unique([eventId, userId])
  @@index([eventId])
}

=== EVENT TYPES ===

  - Workshop: interactive learning session (1-4 hours)
  - Retreat: multi-day immersive experience (2-7 days)
  - Webinar: presentation-style online session (1-2 hours)
  - Meditation Circle: group meditation (30-60 min)
  - Breathwork Session: guided breathwork (30-60 min)
  - Corporate Session: awareness session for companies (1-2 hours)

=== EVENT FORMAT ===

  - In-Person: venue + Google Maps embed, QR check-in
  - Virtual: Daily.co video room (from Phase 5), chat sidebar, Q&A
  - Hybrid: both in-person + virtual stream

=== TICKET TYPES ===

  - Free: no payment required, just register
  - Paid:
    - Early Bird: lower price, limited quantity, time-limited (salesStart/salesEnd)
    - Regular: standard price
    - VIP: premium price, extra perks (e.g., meet speaker, front row)
  - Member Only: only available to users with specific membership tier

=== REGISTRATION FLOW ===

  1. User selects ticket type on event detail page
  2. If paid → PaymentModal (from Phase 13) → payment processed
  3. If member-only → check user's membership tier → deny if too low
  4. Create EventRegistration record
  5. Generate unique QR code for check-in (using qrcode npm package)
  6. Send confirmation email with:
     - Event details
     - QR code (for in-person)
     - Video link (for virtual)
     - .ics calendar file attachment (downloadable, adds to Google Calendar / Outlook)
  7. Add to user's "My Events" in dashboard

.ics file generation:
  import ical from 'ical-generator';
  const cal = ical({ name: event.title });
  cal.createEvent({
    start: event.startDate,
    end: event.endDate,
    summary: event.title,
    description: event.shortDescription,
    location: event.venue || 'Online',
    url: `https://www.soulyatri.com/events/${event.slug}`
  });

=== VIRTUAL EVENT ===

  - Embed Daily.co video room (reuse Phase 5 components)
  - Chat sidebar for attendee messages
  - Q&A panel: attendees submit questions → organizer picks which to answer
  - Auto-check-in: joining the video room = checked in
  - Screen sharing for presenter
  - Attendee count visible to organizer

=== CHECK-IN ===

  In-person:
    - Organizer/admin scans QR code using phone camera
    - QR code endpoint: GET /api/v1/events/:id/check-in/:qrCode
    - Returns attendee info + marks as checked in
    - Admin sees check-in count in real-time

  Virtual:
    - Auto-check-in when user joins video room
    - Tracked via Daily.co participant-joined webhook

=== WAITLIST ===

  - If event.currentAttendees >= event.maxAttendees → user joins waitlist
  - Waitlist position shown: "You are #5 on the waitlist"
  - When spot opens (cancellation) → notify first waitlist person
  - Waitlisted user has 24h to confirm → if no response → offer to next person
  - API: POST /api/v1/events/:id/waitlist → join waitlist
  - API: POST /api/v1/events/:id/waitlist/confirm → confirm spot from waitlist

=== POST-EVENT ===

  - Auto-send feedback form 24h after event ends (via scheduled job)
  - Feedback: 1-5 rating + optional text comment
  - Feedback email template: "How was {eventName}? Rate your experience"
  - Admin sees aggregate feedback: average rating, comments
  - Impact tracking: attendance rate, feedback scores, repeat attendees

=== API ENDPOINTS ===

GET /api/v1/events
  Query: ?page=1&limit=12&type=workshop&format=virtual&startDate=2025-01-01&search=meditation
  Response: { events: Event[], total, page, hasMore }

GET /api/v1/events/:slug
  Response: { event: Event, speakers: EventSpeaker[], tickets: EventTicket[], isRegistered: boolean, waitlistPosition?: number }

POST /api/v1/events/:id/register
  Auth: verifyToken
  Body: { ticketId: string, paymentId?: string }
  Response: { registration: EventRegistration, qrCode: string }

POST /api/v1/events/:id/waitlist
  Auth: verifyToken
  Response: { waitlistPosition: number }

POST /api/v1/events/:id/cancel-registration
  Auth: verifyToken
  Response: { success: true, refundAmount?: number }

GET /api/v1/events/:id/check-in/:qrCode
  Auth: verifyToken + requireRole(ADMIN, MODERATOR)
  Response: { attendee: { name, email, ticket, checkedIn: true } }

POST /api/v1/events/:id/feedback
  Auth: verifyToken
  Body: { rating: number, comment?: string }
  Response: { feedback: EventFeedback }

GET /api/v1/users/events
  Auth: verifyToken
  Response: { upcoming: EventRegistration[], past: EventRegistration[] }

POST /api/v1/admin/events
  Auth: requireRole(ADMIN)
  Body: { title, description, type, format, startDate, endDate, ... }
  Response: { event: Event }

=== ZOD SCHEMAS ===

const registerEventSchema = z.object({
  ticketId: z.string().cuid(),
  paymentId: z.string().optional()
});

const eventFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional()
});

const createEventSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(50),
  type: z.enum(['WORKSHOP', 'RETREAT', 'WEBINAR', 'MEDITATION_CIRCLE', 'BREATHWORK_SESSION', 'CORPORATE_SESSION']),
  format: z.enum(['IN_PERSON', 'VIRTUAL', 'HYBRID']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxAttendees: z.number().int().min(1).optional(),
  isMemberOnly: z.boolean().optional(),
  requiredTier: z.string().optional(),
  venue: z.string().optional(),
  tags: z.array(z.string()).max(10).optional()
});

=== ERROR CODES ===

EVENT_001: Event not found
EVENT_002: Event is full — join waitlist
EVENT_003: Already registered for this event
EVENT_004: Ticket sales not open yet
EVENT_005: Ticket sales have ended
EVENT_006: Membership tier too low for this event
EVENT_007: Invalid QR code
EVENT_008: Already checked in
EVENT_009: Registration cancelled — cannot check in
EVENT_010: Feedback already submitted

=== UI STATES ===

Event listing loading: Skeleton grid (3x3)
Event listing empty: "No upcoming events. Check back soon!"
Event detail loading: Skeleton layout
Registration: "Registering..." loading → "Registered ✓" success + QR code displayed
Event full: "Event is full" badge + "Join Waitlist" button
Waitlisted: "You are #X on the waitlist" info banner
Virtual event live: embedded video room + chat
Check-in success: green checkmark + attendee name on scanner screen
Feedback form: star rating + comment textarea + "Submit" button

=== TEST SCENARIOS ===

- Browse events → filter by type/format → see results
- View event detail → see speakers, tickets, schedule
- Register for free event → confirmation email + QR code + .ics file
- Register for paid event → payment → confirmed
- Register for member-only event without tier → EVENT_006 error
- Event full → join waitlist → position shown
- Attendee cancels → first waitlist person notified → confirms → registered
- In-person: scan QR → check-in successful
- Virtual: join video → auto-checked in
- 24h after event → feedback email → submit rating
- Admin creates event → publishes → visible on /events

VERIFY: Browse events → register → payment (if paid) → see in my events.
Waitlist works. Check-in works. Post-event feedback collected.
```

---

### PHASE 23: Memberships
**Time estimate: 1 session**

```
TASK: Build membership tier system with recurring payments.

=== PRISMA MODELS ===

model MembershipTier {
  id              String   @id @default(cuid())
  name            String   @unique    // Free, Seeker, Healer, Enlightened
  slug            String   @unique
  monthlyPrice    Float       // in INR
  annualPrice     Float?      // annual price (2 months free)
  description     String
  features        String[]    // list of feature descriptions
  maxAiChatsPerDay Int?      // null = unlimited
  therapySessionsPerMonth Int? // null = unlimited
  courseDiscount   Float       @default(0)   // percentage
  eventDiscount   Float       @default(0)
  prioritySupport Boolean     @default(false)
  priorityMatching Boolean    @default(false)
  exclusiveBadge  String?     // community badge name
  isActive        Boolean     @default(true)
  isMostPopular   Boolean     @default(false)  // "Most Popular" badge
  order           Int         @default(0)       // display order
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  userMemberships UserMembership[]
}

model UserMembership {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  tierId          String
  tier            MembershipTier @relation(fields: [tierId], references: [id])
  billingCycle    String      @default("monthly")  // monthly, annual
  status          MembershipStatus @default(ACTIVE)
  startDate       DateTime
  endDate         DateTime    // current billing period end
  trialEndDate    DateTime?   // null if no trial
  isTrialing      Boolean     @default(false)
  razorpaySubscriptionId String?  // Razorpay subscription ID (INR)
  stripeSubscriptionId   String?  // Stripe subscription ID (intl)
  lastPaymentDate DateTime?
  nextPaymentDate DateTime?
  gracePeriodEnd  DateTime?   // 3 days after payment failure
  cancelledAt     DateTime?
  cancelReason    String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([userId])
  @@index([status])
  @@index([endDate])
}

enum MembershipStatus {
  TRIALING
  ACTIVE
  PAST_DUE        // payment failed, in grace period
  CANCELLED       // user cancelled, active until endDate
  EXPIRED         // past endDate and not renewed
  PAUSED
}

=== EXACT TIER DETAILS (seeded) ===

FREE (₹0/month):
  Features:
    - Mood tracker
    - Journal
    - Community access
    - 1 AI chat per day
    - Blog access
    - Breathing exercises
  maxAiChatsPerDay: 1
  therapySessionsPerMonth: 0
  courseDiscount: 0
  eventDiscount: 0

SEEKER (₹499/month or ₹4,990/year):
  Features:
    - Everything in Free
    - Unlimited AI chat
    - 2 therapy sessions per month
    - All health tools
    - Event discounts (10%)
    - Course discounts (10%)
  maxAiChatsPerDay: null (unlimited)
  therapySessionsPerMonth: 2
  courseDiscount: 10
  eventDiscount: 10
  isMostPopular: true

HEALER (₹999/month or ₹9,990/year):
  Features:
    - Everything in Seeker
    - 4 therapy sessions per month
    - Astrology reports included
    - Priority therapist matching
    - Exclusive community badges
    - Course discounts (25%)
    - Event discounts (15%)
  maxAiChatsPerDay: null
  therapySessionsPerMonth: 4
  courseDiscount: 25
  eventDiscount: 15
  priorityMatching: true
  exclusiveBadge: "Healer"

ENLIGHTENED (₹1,999/month or ₹19,990/year):
  Features:
    - Everything in Healer
    - Unlimited therapy sessions
    - Personal AI wellness plan
    - Priority support
    - Early event access
    - All courses free
    - Dedicated therapist assignment
    - Premium AI model (GPT-4o)
  maxAiChatsPerDay: null
  therapySessionsPerMonth: null (unlimited)
  courseDiscount: 100
  eventDiscount: 25
  prioritySupport: true
  priorityMatching: true
  exclusiveBadge: "Enlightened"

=== TRIAL ===

  - 7-day free trial available on Seeker tier only
  - Requires valid payment method (credit card) to start trial
  - No charge during trial period
  - If user cancels during trial → no charge
  - If trial ends without cancellation → auto-charge first month
  - trialEndDate set to startDate + 7 days
  - isTrialing = true during trial

=== GRACE PERIOD ===

  - When recurring payment fails:
    1. Status → PAST_DUE
    2. gracePeriodEnd set to failureDate + 3 days
    3. Send notification: "Your payment failed. Please update your payment method."
    4. Day 1: email reminder
    5. Day 2: second email + in-app banner
    6. Day 3: final warning — "Your membership will be downgraded tomorrow"
    7. After 3 days: if still not paid → status = EXPIRED → downgrade to Free tier features

=== UPGRADE ===

  - Immediate effect: features unlock instantly
  - Prorated charge: charge for remaining days at new tier price
    Formula: (newMonthlyPrice - oldMonthlyPrice) * (daysRemaining / daysInMonth)
  - Update subscription in Razorpay/Stripe
  - Send confirmation: "You've been upgraded to {newTier}!"

=== DOWNGRADE ===

  - Effective at end of current billing cycle (not immediate)
  - User keeps current tier features until endDate
  - After endDate: features downgraded to new tier
  - Confirmation: "You'll be downgraded to {newTier} on {endDate}."

=== ANNUAL PLANS ===

  - 2 months free (pay for 10 months)
  - Seeker annual: ₹4,990 (vs ₹5,988 monthly)
  - Healer annual: ₹9,990 (vs ₹11,988 monthly)
  - Enlightened annual: ₹19,990 (vs ₹23,988 monthly)
  - Annual subscriptions renew yearly
  - Cancellation: refund for unused full months (pro-rata)

=== API ENDPOINTS ===

GET /api/v1/memberships/tiers
  Response: { tiers: MembershipTier[] }  // sorted by order

GET /api/v1/memberships/current
  Auth: verifyToken
  Response: { membership: UserMembership | null, tier: MembershipTier }

POST /api/v1/memberships/subscribe
  Auth: verifyToken
  Body: { tierId: string, billingCycle: 'monthly' | 'annual', trial?: boolean, paymentMethodId?: string }
  Response: { membership: UserMembership, paymentUrl?: string }

POST /api/v1/memberships/upgrade
  Auth: verifyToken
  Body: { newTierId: string }
  Response: { membership: UserMembership, proratedCharge: number }

POST /api/v1/memberships/downgrade
  Auth: verifyToken
  Body: { newTierId: string }
  Response: { membership: UserMembership, effectiveDate: string }

POST /api/v1/memberships/cancel
  Auth: verifyToken
  Body: { reason?: string }
  Response: { membership: UserMembership, activeUntil: string }

POST /api/v1/memberships/reactivate
  Auth: verifyToken
  Response: { membership: UserMembership }

=== MEMBERSHIP GATING MIDDLEWARE ===

// server/src/middleware/membership.ts
checkMembership(requiredTier: string) middleware:
  1. Fetch user's active membership
  2. Compare tier level: Free < Seeker < Healer < Enlightened
  3. If user's tier >= requiredTier → next()
  4. If not → 403 { code: "MEMBERSHIP_001", message: "This feature requires {requiredTier} membership or above." }

Usage examples:
  router.post('/ai/chat', verifyToken, checkMembership('seeker'), aiChatHandler);  // unlimited AI for paid
  router.get('/astrology-reports', verifyToken, checkMembership('healer'), astrologyHandler);

=== ZOD SCHEMAS ===

const subscribeSchema = z.object({
  tierId: z.string().cuid(),
  billingCycle: z.enum(['monthly', 'annual']),
  trial: z.boolean().optional(),
  paymentMethodId: z.string().optional()
});

const cancelSchema = z.object({
  reason: z.string().max(500).optional()
});

=== ERROR CODES ===

MEMBERSHIP_001: Feature requires higher tier — current tier too low
MEMBERSHIP_002: Already subscribed — user has active membership
MEMBERSHIP_003: Trial already used — one trial per user
MEMBERSHIP_004: Payment method required for trial
MEMBERSHIP_005: Cannot downgrade during trial
MEMBERSHIP_006: Membership expired — need to resubscribe
MEMBERSHIP_007: Cannot cancel — already cancelled

=== UI STATES ===

Membership page loading: Skeleton pricing cards
Tier comparison: feature-by-feature table with checkmarks ✓ and ✗
Subscribe: "Subscribe" button → payment processing → "Welcome!" success screen
Trial: "Start 7-Day Free Trial" button → payment method form → "Trial started!"
Upgrade: "Upgrade" button → prorated charge shown → confirm → instant upgrade
Downgrade: "Downgrade" button → confirm dialog with effective date → "Downgrade scheduled"
Cancel: "Cancel Membership" → confirm dialog → "Cancelled. Active until {date}."
Past due: red banner "Payment failed. Update payment method to keep your benefits."

=== FRONTEND COMPONENTS ===

MembershipPage (src/pages/MembershipPage.tsx):
  Display: 4 tier cards side by side
  Each card: tier name, price (monthly / annual toggle), feature list, CTA button
  "Most Popular" badge on Seeker tier
  Toggle: monthly ↔ annual (show savings)

MembershipSettings (src/pages/dashboard/SettingsPage.tsx → membership tab):
  Display: current tier, billing cycle, next payment date, payment history
  Actions: upgrade, downgrade, cancel, update payment method

=== TEST SCENARIOS ===

- View membership tiers → all 4 displayed with correct prices and features
- Subscribe to Seeker monthly → payment → membership active → AI unlimited
- Start trial → no charge → cancel within 7 days → no charge
- Trial expires → auto-charged → membership active
- Upgrade Seeker → Healer → prorated charge → features unlock immediately
- Downgrade Healer → Seeker → effective at end of billing cycle
- Cancel membership → active until endDate → then expired
- Reactivate after cancellation → payment → membership restored
- Payment fails → grace period 3 days → reminders → downgraded if not paid
- Try AI with Free tier → hit 1/day limit → prompt to upgrade
- Annual plan → 2 months free → correct pricing shown
- Member-only event → Free user blocked → Seeker can access

VERIFY: View tiers → subscribe → features unlock → cancel → features locked.
Trial works. Grace period works. Gating works across all features.
```

---

### PHASE 24: NGO Collaborations
**Time estimate: 1 session**

```
TASK: Build NGO partnership system for sponsored therapy and outreach.

=== PRISMA MODELS ===

model NGOPartner {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String
  logo            String?     // S3 URL
  website         String?
  contactName     String
  contactEmail    String
  contactPhone    String
  registrationNumber String?  // NGO registration document number
  registrationDoc String?     // S3 URL of registration document
  status          NGOStatus @default(PENDING)
  sessionBudget   Int         @default(0)    // total sponsored sessions allocated
  sessionsUsed    Int         @default(0)    // sessions consumed
  approvedAt      DateTime?
  approvedBy      String?     // admin userId
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  beneficiaries   NGOBeneficiary[]
  impactReports   NGOImpactReport[]

  @@index([slug])
  @@index([status])
}

enum NGOStatus {
  PENDING          // application submitted
  DOCUMENTS_REVIEW // admin reviewing docs
  APPROVED         // active partner
  SUSPENDED        // temporarily suspended
  REJECTED         // application rejected
}

model NGOBeneficiary {
  id              String   @id @default(cuid())
  partnerId       String
  partner         NGOPartner @relation(fields: [partnerId], references: [id])
  name            String
  age             Int?
  gender          String?
  issue           String?     // primary issue (anxiety, depression, trauma, etc.)
  userId          String?     @unique   // linked Soul Yatri user account (created via magic link)
  user            User?    @relation(fields: [userId], references: [id])
  magicLinkToken  String?  @unique
  magicLinkExpiry DateTime?
  sessionsUsed    Int         @default(0)
  maxSessions     Int         @default(4)  // max sponsored sessions for this beneficiary
  status          BeneficiaryStatus @default(PENDING)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([partnerId])
  @@index([magicLinkToken])
}

enum BeneficiaryStatus {
  PENDING          // added by NGO, not yet onboarded
  INVITED          // magic link sent
  ONBOARDED        // user account created, onboarding complete
  ACTIVE           // actively using platform
  SESSIONS_EXHAUSTED // used all allocated sessions
  INACTIVE         // no activity for 30+ days
}

model NGOImpactReport {
  id              String   @id @default(cuid())
  partnerId       String
  partner         NGOPartner @relation(fields: [partnerId], references: [id])
  period          String      // "2025-Q1", "2025-01" (quarterly or monthly)
  sessionsProvided Int
  beneficiariesServed Int
  avgMoodImprovement Float?   // average mood delta (post - pre)
  satisfactionScore Float?    // average beneficiary satisfaction (1-5)
  anonymizedCaseStudies Json? // [{ issue, sessions, outcome, quote }]
  generatedAt     DateTime    @default(now())

  @@index([partnerId])
  @@unique([partnerId, period])
}

=== NGO ONBOARDING FLOW ===

  1. NGO applies: POST /api/v1/ngo/apply
     Body: { name, description, contactName, contactEmail, contactPhone, registrationNumber, registrationDoc (file) }
  2. Status: PENDING → admin reviews application
  3. Admin verifies registration documents (cross-check with government database)
  4. Admin approves: POST /api/v1/admin/ngo/:id/approve { sessionBudget: 100 }
     Status: APPROVED, sessionBudget set
  5. NGO gets dashboard access at /ngo/dashboard

=== SESSION ALLOCATION ===

  - NGO gets X sponsored sessions per month (configurable by admin)
  - Each beneficiary has a personal limit (maxSessions, default: 4)
  - When beneficiary books session → session cost deducted from NGO's sessionBudget
  - If sessionBudget exhausted:
    a. NGO can request more: POST /api/v1/ngo/request-sessions { additionalSessions, justification }
    b. Admin reviews and approves/rejects
    c. OR NGO can top-up via payment: POST /api/v1/ngo/top-up { sessions, paymentId }
  - Session tracking: NGOPartner.sessionsUsed increments after each completed session
  - Monthly reset option (admin-configurable): reset sessionsUsed to 0 on 1st of each month

=== BENEFICIARY FLOW ===

  1. NGO adds beneficiary: POST /api/v1/ngo/beneficiaries
     Body: { name, age, gender, issue, maxSessions }
  2. System generates magic link: /onboard?token={uniqueToken}
  3. NGO shares magic link with beneficiary (via SMS/email/WhatsApp)
  4. Beneficiary clicks link → creates Soul Yatri account → goes through onboarding (Phase 2)
  5. Account is linked to NGO (NGOBeneficiary.userId = new user ID)
  6. Beneficiary books therapy session (same flow as Phase 4) BUT:
     - Payment is sponsored (no payment required from beneficiary)
     - Session cost deducted from NGO's allocation
     - Beneficiary's session count incremented
  7. If maxSessions reached → "You've used all your sponsored sessions. Contact your NGO partner for more."

=== IMPACT REPORTING ===

Auto-generated per NGO per quarter (via scheduled job):
  Data collected:
    - Total sessions provided (from TherapySession records for NGO beneficiaries)
    - Number of beneficiaries served
    - Average mood improvement: (latest mood score - first mood score) for each beneficiary
    - Beneficiary satisfaction: average session ratings
    - Anonymized case studies: AI generates 2-3 case studies from session data
      (no personally identifiable information, only patterns and outcomes)
  
  Report stored in NGOImpactReport, accessible to:
    - NGO partner (via /ngo/dashboard/reports)
    - Admin (via /admin/ngo/:id/reports)

=== PUBLIC IMPACT PAGE ===

Page: /ngo (public, no auth required)
Content:
  - Hero: "Making Mental Health Accessible to All"
  - Stats: total lives impacted (sum of all beneficiaries), total sessions provided, partner count
  - Partner logos: grid of approved NGO partner logos
  - Impact stories: selected anonymized case studies
  - CTA: "Partner with us" → /ngo/apply

=== NGO DASHBOARD ===

Page: /ngo/dashboard (auth required, NGO admin role)
Sections:
  1. Overview: sessions used / allocated, beneficiaries count, active beneficiaries
  2. Beneficiaries table: name, age, issue, sessions used, status, "Send Magic Link" button
  3. Session history: all sponsored sessions with date, therapist, beneficiary, status
  4. Impact reports: quarterly reports with charts (Recharts)
  5. Budget: current allocation, usage chart, "Request More" button, "Top-Up" button

=== API ENDPOINTS ===

POST /api/v1/ngo/apply
  Body: FormData with { name, description, contactName, contactEmail, contactPhone, registrationNumber, registrationDoc }
  Response: { partner: NGOPartner }

GET /api/v1/ngo/dashboard
  Auth: verifyToken + NGO admin role
  Response: { partner: NGOPartner, stats: { sessionsUsed, sessionBudget, beneficiaryCount, activeBeneficiaries } }

POST /api/v1/ngo/beneficiaries
  Auth: verifyToken + NGO admin role
  Body: { name, age?, gender?, issue?, maxSessions? }
  Response: { beneficiary: NGOBeneficiary, magicLink: string }

GET /api/v1/ngo/beneficiaries
  Auth: verifyToken + NGO admin role
  Response: { beneficiaries: NGOBeneficiary[], total }

POST /api/v1/ngo/beneficiaries/:id/resend-link
  Auth: verifyToken + NGO admin role
  Response: { magicLink: string }

POST /api/v1/ngo/request-sessions
  Auth: verifyToken + NGO admin role
  Body: { additionalSessions: number, justification: string }
  Response: { request: { id, status: 'pending' } }

POST /api/v1/ngo/top-up
  Auth: verifyToken + NGO admin role
  Body: { sessions: number, paymentId: string }
  Response: { partner: NGOPartner }  // updated sessionBudget

GET /api/v1/ngo/impact-reports
  Auth: verifyToken + NGO admin role
  Response: { reports: NGOImpactReport[] }

GET /api/v1/ngo/public
  Response: { totalLivesImpacted, totalSessions, partnerCount, partners: [{ name, logo }], stories: [] }

POST /api/v1/admin/ngo/:id/approve
  Auth: requireRole(ADMIN)
  Body: { sessionBudget: number }
  Response: { partner: NGOPartner }

POST /api/v1/admin/ngo/:id/reject
  Auth: requireRole(ADMIN)
  Body: { reason: string }
  Response: { partner: NGOPartner }

GET /api/v1/admin/ngo
  Auth: requireRole(ADMIN)
  Response: { partners: NGOPartner[], pendingCount }

=== ZOD SCHEMAS ===

const ngoApplySchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(20).max(2000),
  contactName: z.string().min(2).max(100),
  contactEmail: z.string().email(),
  contactPhone: z.string().regex(/^\+?[\d\s-]{10,15}$/),
  registrationNumber: z.string().optional()
});

const addBeneficiarySchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().int().min(5).max(120).optional(),
  gender: z.string().optional(),
  issue: z.string().max(200).optional(),
  maxSessions: z.number().int().min(1).max(20).optional()
});

const requestSessionsSchema = z.object({
  additionalSessions: z.number().int().min(1).max(500),
  justification: z.string().min(10).max(1000)
});

=== ERROR CODES ===

NGO_001: NGO partner not found
NGO_002: NGO application pending — not yet approved
NGO_003: Session budget exhausted — request more or top-up
NGO_004: Beneficiary session limit reached
NGO_005: Invalid or expired magic link
NGO_006: Beneficiary already onboarded
NGO_007: NGO suspended — contact admin

=== UI STATES ===

Application submitted: "Thank you! Your application is under review." success page
Dashboard loading: Skeleton cards + skeleton table
Budget low: Yellow warning banner "You have {N} sessions remaining. Request more?"
Budget exhausted: Red banner "Session budget exhausted. Top up or request more sessions."
Magic link sent: "Link sent! Share with beneficiary." toast
Impact report loading: Skeleton charts
Public page: animated counter for "Lives Impacted" number

=== TEST SCENARIOS ===

- NGO applies → admin approves with 50 session budget → NGO gets dashboard access
- NGO adds beneficiary → magic link generated → beneficiary clicks link → onboards
- Beneficiary books session → payment is sponsored → session deducted from NGO allocation
- Beneficiary reaches maxSessions → cannot book more → sees limit message
- NGO budget exhausted → NGO requests more → admin approves → budget replenished
- NGO tops up via payment → sessions added to budget
- Quarterly report auto-generated → mood improvement calculated → case studies created
- Public /ngo page → shows partner logos, stats, stories
- Admin rejects NGO → reason shown to NGO

VERIFY: Create NGO partner → add beneficiary → they book free session → impact tracked.
Budget management works. Impact reports generate correctly. Public page displays data.
```

---

### PHASE 25: In-Session AI Monitoring (Client + Therapist)
**Time estimate: 2-3 sessions**

```
TASK: Build real-time AI monitoring during live therapy video sessions.
Two separate AI systems: one monitors the CLIENT, one monitors the THERAPIST.

CONTEXT: Types are in src/types/ai.types.ts — ClientSessionMonitor and
TherapistSessionMonitor. This runs alongside the video call (Phase 5).

=== PRISMA MODELS ===

model ClientSessionAnalysis {
  id              String   @id @default(cuid())
  sessionId       String   @unique
  session         TherapySession @relation(fields: [sessionId], references: [id])
  emotionTimeline Json         // [{ timestamp, dominant: "anxious", scores: { happy: 0.1, sad: 0.3, ... } }]
  sentimentScores Json         // [{ timestamp, text, score }]
  topicsDiscussed String[]     // extracted topics
  engagementScore Float?       // 0-1 overall engagement
  breakthroughMoments Json?   // [{ timestamp, description }]
  riskFlags       Json?        // [{ timestamp, keyword, severity, context }]
  overallSummary  String?      // AI-generated session summary
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

model TherapistSessionAnalysis {
  id              String   @id @default(cuid())
  sessionId       String   @unique
  session         TherapySession @relation(fields: [sessionId], references: [id])
  empathyScore    Float?       // 0-1
  activeListeningScore Float? // 0-1
  talkTimeRatio   Float?       // therapist talk time / total time (should be 0.3-0.4)
  sessionDuration Int?         // actual duration in seconds
  expectedDuration Int?        // expected 50 minutes = 3000 seconds
  techniquesUsed  String[]     // CBT, DBT, mindfulness, etc.
  goalsAddressed  Boolean?     // were previous session goals addressed
  tasksAssigned   Boolean?     // were tasks assigned for next session
  qualityScore    Float?       // 0-100 overall quality
  fraudIndicators Json?        // { fakeSession: { detected, confidence, evidence }, upselling: {...}, ... }
  complianceChecks Json?       // { consentObtained, confidentialityMaintained, emergencyProtocol, ethicsAdherence }
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

model TherapistQualityAggregate {
  id              String   @id @default(cuid())
  therapistId     String   @unique
  therapist       Therapist @relation(fields: [therapistId], references: [id])
  averageEmpathy  Float       @default(0)
  averageListening Float      @default(0)
  averageQuality  Float       @default(0)
  totalSessionsAnalyzed Int   @default(0)
  fraudFlagCount  Int         @default(0)
  lastAnalyzedAt  DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([averageQuality])
}

=== CLIENT MONITORING AI ===

STEP 1 — Real-time emotion detection:
  - Process video frames → detect facial expressions (happy, sad, anxious, etc.)
  - Process audio → detect voice tone (calm, anxious, angry, flat)
  - Build emotion timeline: every 30 seconds, snapshot dominant emotion
  - Detect emotional shifts (what topic triggered the change)

STEP 2 — Speech analysis:
  - Real-time transcription (Whisper API)
  - Sentiment scoring per utterance
  - Topic extraction (what are they talking about)
  - Detect crisis language in real-time → immediate EmergencyFlag

STEP 3 — Engagement tracking:
  - Eye contact estimation (are they looking at camera)
  - Responsiveness (time between therapist question → client response)
  - Body language notes

STEP 4 — Risk detection (CRITICAL):
  - Keyword monitoring: suicide, self-harm, abuse, violence
  - Pattern matching: "I can't go on", "nobody cares", "end it all"
  - If detected → immediate alert to admin + emergency protocol
  - Show crisis helpline numbers to user

STEP 5 — Post-session summary:
  - Generate ClientSessionSummary with insights, breakthrough moments
  - Feed into personality report generation
  - Update user's behavioral pattern database

=== THERAPIST MONITORING AI (QUALITY + FRAUD) ===

STEP 6 — Professional conduct analysis:
  - Is the therapist empathetic? (tone analysis)
  - Active listening score (asking follow-up questions, reflecting)
  - Boundary detection (inappropriate personal questions, dual relationships)
  - Language appropriateness check

STEP 7 — Session quality scoring:
  - Did session run full duration? (flag if cut short by >10 min)
  - Talk time ratio: therapist should be 30-40%, client 60-70%
  - Were therapeutic techniques used? (CBT, DBT, mindfulness prompts)
  - Were goals addressed from previous sessions?
  - Were tasks assigned for next session?

STEP 8 — Fraud detection:
  - "Fake session" detection: session marked complete but no meaningful interaction
  - "Upselling" detection: therapist pushing unnecessary extra sessions
  - "Off-platform referral": therapist trying to take clients off Soul Yatri
  - "Copy-paste notes": same session notes for multiple clients
  - "Unqualified treatment": therapist treating issues outside their specialization
  - Each indicator: detected (bool), confidence (0-1), evidence (text)

STEP 9 — Compliance checks:
  - Was recording consent obtained?
  - Was confidentiality maintained? (no sharing other client info)
  - Emergency protocol followed if crisis detected?
  - Ethical guidelines adherence

STEP 10 — Reporting:
  - Per-session report: stored in TherapistSessionAnalysis
  - Aggregate therapist quality score across all sessions (TherapistQualityAggregate)
  - Auto-flag therapists below quality threshold (qualityScore < 50) → admin review
  - Monthly quality reports per therapist
  - If fraud confidence > 0.8 → immediate admin notification via Socket.IO

=== API ENDPOINTS ===

  POST /api/v1/ai/session-monitor/start
    Auth: internal (called when session starts)
    Body: { sessionId }
    Steps:
      1. Create ClientSessionAnalysis + TherapistSessionAnalysis records
      2. Initialize emotion tracking pipeline
      3. Start real-time transcription stream
      4. Return { monitorId }

  POST /api/v1/ai/session-monitor/frame
    Auth: internal
    Body: { monitorId, frame: base64, timestamp, participant: 'client' | 'therapist' }
    Steps:
      1. Run facial expression detection (OpenAI Vision or dedicated model)
      2. Update emotion timeline
      3. Check for crisis indicators in visual cues
    Response: { emotions: { happy, sad, anxious, ... }, dominant: string }

  POST /api/v1/ai/session-monitor/audio
    Auth: internal
    Body: { monitorId, audio: base64, timestamp, participant: 'client' | 'therapist' }
    Steps:
      1. Transcribe with Whisper (streaming)
      2. Run sentiment analysis on transcript
      3. Check for crisis keywords
      4. Update talk time ratio
      5. If crisis detected → create EmergencyFlag + notify admin + show helpline
    Response: { transcript, sentiment, flagged: boolean }

  POST /api/v1/ai/session-monitor/:sessionId/complete
    Auth: internal (called when session ends)
    Steps:
      1. Generate client summary using GPT-4o
      2. Calculate therapist quality score
      3. Run fraud detection analysis on full transcript
      4. Run compliance checks
      5. Update ClientSessionAnalysis + TherapistSessionAnalysis
      6. Update TherapistQualityAggregate
      7. If fraud confidence > 0.8 → notify admin
      8. If quality score < 50 → flag for admin review
    Response: { clientSummary, therapistQuality, fraudAlerts }

  GET /api/v1/ai/session-monitor/:sessionId/client
    Auth: verifyToken (therapist, admin)
    Response: { analysis: ClientSessionAnalysis }

  GET /api/v1/ai/session-monitor/:sessionId/therapist
    Auth: verifyToken (admin only — therapist cannot see their own monitoring)
    Response: { analysis: TherapistSessionAnalysis }

  GET /api/v1/admin/therapist-quality/:therapistId
    Auth: requireRole(ADMIN)
    Response: { aggregate: TherapistQualityAggregate, recentSessions: TherapistSessionAnalysis[] }

  GET /api/v1/admin/fraud-alerts
    Auth: requireRole(ADMIN)
    Query: ?minConfidence=0.5&page=1&limit=20
    Response: { alerts: [{ sessionId, therapistName, indicator, confidence, evidence, timestamp }], total }

=== ERROR CODES ===

MONITOR_001: Session not found or not active
MONITOR_002: Monitoring already started for this session
MONITOR_003: Invalid audio/video frame format
MONITOR_004: AI processing failed — retry
MONITOR_005: Session analysis not available yet — still processing

=== UI STATES (admin views only — monitoring is invisible to session participants) ===

Quality dashboard loading: Skeleton cards + skeleton table
Therapist quality detail: radar chart (empathy, listening, techniques, compliance, talk ratio)
Fraud alert: red badge on admin sidebar + alert details page
Client analysis: emotion timeline as line chart (Recharts), topic word cloud, engagement gauge
Therapist analysis: quality score as circular gauge (green/yellow/red), fraud indicators list

=== TEST SCENARIOS ===

- Start session → AI monitoring begins automatically → emotion tracking updates every 30s
- Client says crisis keywords → EmergencyFlag created → admin notified → helpline shown IMMEDIATELY
- Therapist cuts session short by >10 min → "session-too-short" fraud flag raised (confidence 0.7+)
- Therapist talk time > 50% → flagged as "excessive talking" in quality report
- Same session notes for 3 clients → "copy-paste notes" fraud flag raised
- Therapist quality < 50 → auto-flagged for admin review
- Fraud confidence > 0.8 → immediate admin notification via Socket.IO
- View aggregate quality score for therapist → radar chart shows all dimensions
- Monthly quality report generated → emailed to admin

VERIFY:
  - Start session → AI tracks emotions → summary generated
  - Therapist cuts session short → "session-too-short" fraud flag raised
  - User says crisis keywords → emergency flag + helpline shown instantly
  - Quality scores aggregate correctly across sessions
  - Fraud alerts appear in admin dashboard in real-time
```
---

## Phase Dependency Matrix & Critical Path

### Hard Prerequisites (MUST complete before starting)

| Phase | Hard Prerequisites | Soft Prerequisites (nice to have first) |
|------|-------------------|----------------------------------------|
| Phase 1 (Auth) | None — START HERE | — |
| Phase 2 (Onboarding) | Phase 1 (auth, DB, user model) | — |
| Phase 3 (Dashboard) | Phase 1 (auth) | Phase 2 (onboarding data populates dashboard) |
| Phase 4 (Therapy) | Phase 1 (auth), Phase 13 (payments) | Phase 3 (dashboard shell to embed booking) |
| Phase 5 (Video) | Phase 1 (auth), Phase 4 (session model) | Phase 17 (notifications for join reminders) |
| Phase 6 (AI Assistant) | Phase 1 (auth) | Phase 4 (therapy context), Phase 16 (mood data for context) |
| Phase 7 (Astrologer) | Phase 1 (auth), Phase 4 (session model) | Phase 5 (video for consultations) |
| Phase 8 (Therapist Dash) | Phase 1 (auth), Phase 4 (therapy model), Phase 5 (recordings) | Phase 25 (AI monitoring data) |
| Phase 9 (Blog) | Phase 1 (auth, admin role) | Phase 21 (SEO automation) |
| Phase 10 (Community) | Phase 1 (auth) | Phase 17 (notifications) |
| Phase 11 (Courses) | Phase 1 (auth), Phase 13 (payments) | Phase 9 (blog for marketing) |
| Phase 12 (Shop) | Phase 1 (auth), Phase 13 (payments) | Phase 17 (order notifications) |
| Phase 13 (Payments) | Phase 1 (auth, user model) | — |
| Phase 14 (Admin) | Phase 1 (auth), Phase 13 (payments) | ALL other phases (admin manages everything) |
| Phase 15 (Corporate) | Phase 1 (auth), Phase 4 (therapy), Phase 13 (payments) | Phase 14 (admin approval) |
| Phase 16 (Health Tools) | Phase 1 (auth) | Phase 3 (dashboard to embed widgets) |
| Phase 17 (Notifications) | Phase 1 (auth) | Phase 4 (therapy reminders), Phase 13 (payment receipts) |
| Phase 18 (Animations) | None (static frontend) | Phase 1 (auth links in nav) |
| Phase 19 (About/Careers) | Phase 1 (auth, admin role for hiring) | Phase 14 (admin for job management) |
| Phase 20 (Departments) | Phase 1 (auth), Phase 14 (admin base) | All feature phases (data to show) |
| Phase 21 (SEO) | Phase 9 (blog content) | Phase 11 (courses), Phase 22 (events) |
| Phase 22 (Events) | Phase 1 (auth), Phase 13 (payments) | Phase 17 (notifications) |
| Phase 23 (Memberships) | Phase 1 (auth), Phase 13 (payments) | Phase 4 (therapy discounts) |
| Phase 24 (NGO) | Phase 1 (auth), Phase 4 (therapy), Phase 13 (payments) | Phase 14 (admin oversight) |
| Phase 25 (AI Monitoring) | Phase 1 (auth), Phase 5 (video sessions) | Phase 8 (therapist dashboard) |

### Entry Gates (checklist BEFORE starting a phase)

```
Before starting ANY phase, confirm:
  ✅ All hard prerequisite phases are COMPLETE (build passes, features work)
  ✅ Database migrations from prerequisite phases have been run
  ✅ Required environment variables are set (see Environment Blueprint below)
  ✅ Type definitions for this phase exist in src/types/ (they do — already scaffolded)
  ✅ Route stubs for this phase exist in server/src/routes/ (they do — 501 stubs)
  ✅ Previous phase's VERIFY checklist has been completed
```

### Exit Gates (checklist AFTER completing a phase)

```
Before marking a phase COMPLETE, confirm:
  ✅ npx tsc --noEmit — zero type errors (frontend)
  ✅ cd server && npx tsc --noEmit — zero type errors (backend)
  ✅ npm run build — builds successfully
  ✅ All API endpoints respond correctly (not 501)
  ✅ All pages render without console errors
  ✅ All VERIFY scenarios from the phase pass
  ✅ Minimum automated tests pass (see QA Requirements below)
  ✅ No hardcoded secrets in code (grep for API keys, passwords)
  ✅ New environment variables documented in server/.env.example
  ✅ Loading, empty, and error states work for every new UI component
```

### Critical Path (shortest path to MVP launch)

```
Phase 1 → Phase 13 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 8 → Phase 6 → Phase 17 → Phase 14
   ↓           ↓                                        ↓
 Auth      Payments                                   Video
   ↓                                                    ↓
 Phase 16 (Health Tools — can parallel with Phase 4+)  Phase 25 (AI Monitor — after video works)
   ↓
 Phase 7 (Astrologer — after therapy model exists)
```

### Safe Parallel Pairs (zero shared code paths)

```
These pairs share NO database models, NO API routes, NO UI components:
  • Phase 9 (Blog) ‖ Phase 6 (AI Assistant)
  • Phase 10 (Community) ‖ Phase 12 (Shop)
  • Phase 11 (Courses) ‖ Phase 22 (Events)
  • Phase 23 (Memberships) ‖ Phase 24 (NGO)
  • Phase 15 (Corporate) ‖ Phase 19 (About/Careers)
  • Phase 18 (Animations) ‖ ANY backend-only phase
  • Phase 20 (Departments) ‖ Phase 21 (SEO Automation)

⚠️  NEVER run in parallel:
  • Phase 4 + Phase 7 (both modify therapy/session models)
  • Phase 13 + Phase 23 (both modify payment tables)
  • Phase 14 + Phase 20 (both modify admin dashboard code)
```

---

## Minimum Automated QA Requirements Per Phase

```
PHILOSOPHY: Every phase ships with automated tests. "It works when I click it"
is NOT sufficient for a platform handling therapy sessions, payments, and crisis detection.

TEST PYRAMID PER PHASE:
  - Unit tests: business logic, utilities, validation (fastest, most)
  - Integration tests: API endpoint + database (medium)
  - E2E tests: critical user flows only (slowest, fewest)

TOOLS:
  - Backend unit + integration: Vitest + Supertest
  - Frontend unit: Vitest + React Testing Library
  - E2E: Playwright (add in Phase 14+ when enough UI exists)
  - API contract: Zod schema validation tests

MINIMUM REQUIREMENT:
  Every phase MUST have at least the tests listed below before marking complete.
```

### Phase-by-Phase Test Requirements

```
PHASE 1 (Auth) — HIGH RISK — 15+ tests minimum
  Unit tests:
    - Password hashing: bcrypt produces valid hash
    - Password validation: rejects weak passwords (< 8 chars, no uppercase, no number)
    - JWT generation: produces valid token with correct claims
    - JWT verification: rejects expired tokens
    - JWT verification: rejects tampered tokens
    - Refresh token rotation: old token invalidated after use
  Integration tests (Supertest):
    - POST /auth/register: 201 with valid data, 400 with missing fields, 409 with duplicate email
    - POST /auth/login: 200 with correct creds, 401 with wrong password, 404 with unknown email
    - POST /auth/refresh: 200 with valid refresh, 401 with expired refresh
    - GET /auth/me: 200 with valid token, 401 without token
    - POST /auth/logout: 200 clears refresh token

PHASE 2 (Onboarding) — MEDIUM RISK — 8+ tests minimum
  Unit tests:
    - Zod validation: each of 10 steps validates correctly
    - Zod validation: rejects invalid birthdates (future, < 13 years old)
    - Progress calculation: correctly identifies completed steps
  Integration tests:
    - PUT /users/onboarding: saves progress, returns next step
    - PUT /users/onboarding: completes all steps, marks onboarding done
    - GET /users/onboarding: returns saved progress for resume

PHASE 3 (Dashboard) — LOW RISK — 5+ tests minimum
  Integration tests:
    - GET /users/dashboard: returns all widget data for authenticated user
    - GET /users/dashboard: 401 for unauthenticated request
  Frontend unit tests:
    - Dashboard renders loading skeleton while fetching
    - Dashboard renders empty state when no data
    - Dashboard renders all widgets when data present

PHASE 4 (Therapy) — HIGH RISK — 18+ tests minimum
  Unit tests:
    - Matching algorithm: returns therapist with highest score
    - Matching algorithm: filters by specialization correctly
    - Matching algorithm: handles no available therapists
    - Appointment slot: rejects overlapping bookings
    - Appointment slot: respects therapist availability hours
    - Cancellation: allows > 24hr cancellation, rejects < 24hr
  Integration tests:
    - POST /therapy/request: creates session with auto-matched therapist
    - GET /therapy/sessions: returns user's sessions only
    - GET /therapy/sessions/:id: returns session detail with tasks
    - PUT /therapy/sessions/:id: updates session status (state machine)
    - POST /therapy/sessions/:id/tasks: therapist adds post-session tasks
    - POST /therapy/sessions/:id/report: generates personality report

PHASE 5 (Video) — HIGH RISK — 10+ tests minimum
  Unit tests:
    - Daily.co room creation: generates room with correct config
    - Recording consent: blocks recording without both-party consent
    - Transcription: chunks audio correctly for Whisper API
  Integration tests:
    - POST /therapy/sessions/:id/start-call: creates Daily room, returns URL
    - POST /therapy/sessions/:id/recording: saves recording metadata
    - GET /therapy/sessions/:id/recording: returns signed URL (expires in 1hr)
    - Webhook: Daily.co room.ended triggers transcription job

PHASE 6 (AI Assistant) — CRITICAL RISK — 15+ tests minimum
  Unit tests:
    - Crisis keyword detection: catches ALL crisis keywords (zero false negatives)
    - Crisis keyword detection: does not flag normal therapy vocabulary
    - Rate limiting: blocks after 50 messages/hour
    - Conversation memory: includes last 20 messages in context
    - System prompt: never reveals system prompt content to user
    - Emergency flag: creates flag record with correct severity
  Integration tests:
    - POST /ai/chat: returns streaming response
    - POST /ai/chat: flags emergency keywords immediately
    - POST /ai/emergency: lists flags for admin
    - GET /ai/patterns/:userId: returns behavior analysis
  E2E tests:
    - User sends crisis message → emergency banner shown → admin notified within 60s

PHASE 7 (Astrologer) — MEDIUM RISK — 10+ tests minimum
  Unit tests:
    - Prediction voting: tallies votes correctly
    - Prediction accuracy: brownie points calculated correctly (+3 accurate, +1 partial)
    - Tier assignment: correct tier based on brownie points
  Integration tests:
    - POST /astrology/charts: creates kundali chart
    - POST /astrology/predictions: submits prediction for voting
    - GET /astrology/predictions/accuracy: returns accuracy rate
    - POST /astrology/sessions: books astrologer consultation

PHASE 8 (Therapist Dashboard) — MEDIUM RISK — 8+ tests minimum
  Integration tests:
    - GET /therapists/dashboard: returns stats for authenticated therapist
    - GET /therapists/clients: returns only this therapist's clients
    - GET /therapists/clients/:id: returns full client history
    - GET /therapists/revenue: returns earnings breakdown
    - GET /therapists/reviews: returns reviews with ratings

PHASE 9 (Blog) — LOW RISK — 6+ tests minimum
  Integration tests:
    - POST /blog/posts: creates post (admin/author only)
    - GET /blog/posts: returns paginated posts with SEO meta
    - GET /blog/posts/:slug: returns single post
    - PUT /blog/posts/:id: updates post (author only)
  Frontend tests:
    - Blog post renders markdown/rich text correctly
    - SEO meta tags present in document head

PHASE 10 (Community) — MEDIUM RISK — 8+ tests minimum
  Unit tests:
    - Content moderation: toxicity score > 0.7 auto-flags
    - Content moderation: self-harm keywords always flag
  Integration tests:
    - POST /community/posts: creates post
    - GET /community/feed: returns personalized feed
    - POST /community/posts/:id/report: creates moderation report
    - GET /community/moderation: returns queue (moderator only)

PHASE 11 (Courses) — MEDIUM RISK — 8+ tests minimum
  Integration tests:
    - GET /courses: returns catalog with pagination
    - POST /courses/:id/enroll: enrolls user (payment verified)
    - PUT /courses/:id/progress: updates lesson progress
    - GET /courses/:id/progress: returns completion percentage
    - POST /courses/create: creates course (creator role)

PHASE 12 (Shop) — MEDIUM RISK — 10+ tests minimum
  Integration tests:
    - GET /shop/products: returns catalog with filters
    - POST /shop/cart: adds item to cart
    - POST /shop/orders: creates order (payment verified)
    - GET /shop/orders/:id: returns order detail with tracking
    - POST /shop/orders/:id/return: initiates return (within 7 days)

PHASE 13 (Payments) — CRITICAL RISK — 20+ tests minimum
  Unit tests:
    - Razorpay signature verification: validates correctly
    - Stripe webhook signature: validates correctly
    - Amount calculation: handles multi-currency conversion
    - Refund calculation: prorates correctly
    - Subscription: next billing date calculated correctly
  Integration tests:
    - POST /payments/create: creates Razorpay order (INR)
    - POST /payments/create: creates Stripe intent (non-INR)
    - POST /payments/verify: marks payment complete on valid signature
    - POST /payments/verify: rejects invalid signature (CRITICAL)
    - POST /payments/webhook: processes Razorpay/Stripe webhooks idempotently
    - POST /payments/refund: processes refund (admin only)
    - GET /payments/history: returns user's payment history
    - POST /payments/subscriptions: creates recurring subscription
    - POST /payments/memberships/subscribe: activates membership tier
  Security tests:
    - Webhook endpoint rejects requests without valid signature
    - Payment amount cannot be tampered by client
    - Double-payment prevention (idempotency key)

PHASE 14 (Admin) — HIGH RISK — 12+ tests minimum
  Integration tests:
    - GET /admin/head-office: 200 for admin, 403 for user/therapist
    - GET /admin/dashboard: returns aggregated stats
    - GET /admin/users: returns paginated user list with filters
    - PUT /admin/users/:id: suspends user (audit logged)
    - GET /admin/employees: returns employee list
    - GET /admin/actions: returns audit log (filterable)
    - All admin endpoints: 403 for non-admin roles

PHASE 15 (Corporate) — MEDIUM RISK — 6+ tests minimum
  Integration tests:
    - POST /corporate/accounts: creates corporate account
    - GET /corporate/reports: returns anonymized wellness report
    - GET /corporate/employees: returns enrolled employees

PHASE 16 (Health Tools) — LOW RISK — 8+ tests minimum
  Integration tests:
    - POST /health-tools/mood: saves mood log with triggers
    - GET /health-tools/mood: returns mood history with trends
    - POST /health-tools/journal: saves encrypted journal entry
    - POST /health-tools/meditation: logs completed session

PHASE 17 (Notifications) — MEDIUM RISK — 8+ tests minimum
  Unit tests:
    - Priority routing: critical notifications bypass quiet hours
    - Retry logic: retries with exponential backoff on failure
    - Digest mode: batches low-priority notifications
  Integration tests:
    - POST /notifications: sends notification to user
    - GET /notifications: returns user's notification list
    - PUT /notifications/preferences: updates user preferences
    - WebSocket: real-time notification delivered within 2 seconds

PHASE 18 (Animations) — LOW RISK — 2+ tests minimum
  Frontend tests:
    - Splash screen renders and transitions to landing
    - Landing page: Three.js canvas renders without errors

PHASE 19 (About/Careers) — LOW RISK — 4+ tests minimum
  Integration tests:
    - GET /careers/positions: returns open positions
    - POST /careers/positions/:id/apply: submits application

PHASE 20 (Departments) — MEDIUM RISK — 6+ tests minimum
  Integration tests:
    - GET /admin/departments: returns all departments with KPIs
    - PUT /admin/departments/:id: updates targets (admin only)

PHASE 21 (SEO) — LOW RISK — 4+ tests minimum
  Integration tests:
    - GET /blog/seo: returns sitemap data
    - Programmatic page generation: produces valid HTML

PHASE 22 (Events) — MEDIUM RISK — 8+ tests minimum
  Integration tests:
    - POST /events: creates event (admin only)
    - GET /events/:slug: returns event detail
    - POST /events/:id/register: registers user (handles capacity)
    - POST /events/:id/feedback: submits feedback (attendee only)

PHASE 23 (Memberships) — HIGH RISK — 8+ tests minimum
  Integration tests:
    - POST /payments/memberships/subscribe: activates correct tier
    - GET /payments/memberships/mine: returns current membership
    - Upgrade: prorates payment correctly
    - Downgrade: applies at next billing cycle
    - Expiry: grace period of 7 days, then deactivation

PHASE 24 (NGO) — MEDIUM RISK — 6+ tests minimum
  Integration tests:
    - GET /ngo/partners: returns NGO list
    - POST /ngo/partners/:id/beneficiaries: registers beneficiary
    - Sponsored session: creates therapy session at ₹0 for beneficiary

PHASE 25 (AI Monitoring) — CRITICAL RISK — 12+ tests minimum
  Unit tests:
    - Emotion detection: correctly maps facial landmarks to emotions
    - Crisis detection: flags suicidal ideation within 5 seconds
    - Fraud detection: flags session < 15 min as "session-too-short"
    - Fraud detection: flags camera-off > 50% as suspicious
    - Quality scoring: aggregates across dimensions correctly
  Integration tests:
    - POST /ai/session-monitor/start: initializes monitoring session
    - POST /ai/session-monitor/frame: processes frame, returns emotion
    - POST /ai/session-monitor/audio: processes audio chunk
    - GET /ai/session-monitor/:id/client: returns client analysis
    - GET /ai/session-monitor/:id/therapist: returns quality + fraud report
    - Emergency detection → admin alert → within 60 seconds

TOTAL MINIMUM TESTS: 250+ across all 25 phases
```

---

## Environment & Secrets Management Blueprint

### Master Environment Variable Matrix

```
VARIABLE                        | PHASE NEEDED | REQUIRED/OPTIONAL | EXAMPLE VALUE
-------------------------------|-------------|-------------------|----------------------------------
# === CORE (Phase 1) ===
NODE_ENV                        | Phase 1     | Required          | development | staging | production
PORT                            | Phase 1     | Required          | 3000
DATABASE_URL                    | Phase 1     | Required          | postgresql://user:pass@localhost:5432/soulyatri
JWT_ACCESS_SECRET               | Phase 1     | Required          | <256-bit random string>
JWT_REFRESH_SECRET              | Phase 1     | Required          | <256-bit random string, DIFFERENT from access>
JWT_ACCESS_EXPIRY               | Phase 1     | Required          | 15m
JWT_REFRESH_EXPIRY              | Phase 1     | Required          | 7d
CORS_ORIGIN                     | Phase 1     | Required          | http://localhost:5173
BCRYPT_SALT_ROUNDS              | Phase 1     | Optional          | 12 (default)

# === STORAGE (Phase 5) ===
S3_BUCKET_NAME                  | Phase 5     | Required          | soulyatri-recordings
S3_REGION                       | Phase 5     | Required          | ap-south-1
S3_ACCESS_KEY                   | Phase 5     | Required          | <AWS access key>
S3_SECRET_KEY                   | Phase 5     | Required          | <AWS secret key>
S3_ENDPOINT                     | Phase 5     | Optional          | <for R2/MinIO: custom endpoint>

# === VIDEO (Phase 5) ===
DAILY_API_KEY                   | Phase 5     | Required          | <Daily.co API key>
DAILY_WEBHOOK_SECRET            | Phase 5     | Required          | <Daily.co webhook secret>

# === AI (Phase 6) ===
OPENAI_API_KEY                  | Phase 6     | Required          | sk-...
OPENAI_ORG_ID                   | Phase 6     | Optional          | org-...
OPENAI_MODEL_CHAT               | Phase 6     | Optional          | gpt-4o (default)
OPENAI_MODEL_FAST               | Phase 6     | Optional          | gpt-4o-mini (default)
OPENAI_MODEL_WHISPER            | Phase 6     | Optional          | whisper-1 (default)

# === PAYMENTS (Phase 13) ===
RAZORPAY_KEY_ID                 | Phase 13    | Required          | rzp_test_...
RAZORPAY_KEY_SECRET             | Phase 13    | Required          | <Razorpay secret>
RAZORPAY_WEBHOOK_SECRET         | Phase 13    | Required          | <Razorpay webhook secret>
STRIPE_SECRET_KEY               | Phase 13    | Required          | sk_test_...
STRIPE_PUBLISHABLE_KEY          | Phase 13    | Required (FE)     | pk_test_...
STRIPE_WEBHOOK_SECRET           | Phase 13    | Required          | whsec_...

# === EMAIL (Phase 17) ===
EMAIL_PROVIDER                  | Phase 17    | Required          | resend | sendgrid | ses
RESEND_API_KEY                  | Phase 17    | Required          | re_...
EMAIL_FROM_ADDRESS              | Phase 17    | Required          | noreply@soulyatri.com
EMAIL_FROM_NAME                 | Phase 17    | Optional          | Soul Yatri (default)

# === PUSH NOTIFICATIONS (Phase 17) ===
FCM_PROJECT_ID                  | Phase 17    | Required          | soul-yatri-prod
FCM_PRIVATE_KEY                 | Phase 17    | Required          | <Firebase service account key>
FCM_CLIENT_EMAIL                | Phase 17    | Required          | firebase-adminsdk@...

# === REDIS (Phase 17) ===
REDIS_URL                       | Phase 17    | Required          | redis://localhost:6379
REDIS_PASSWORD                  | Phase 17    | Optional          | <password for production>

# === ANALYTICS (Phase 20) ===
POSTHOG_API_KEY                 | Phase 20    | Optional          | phc_...
POSTHOG_HOST                    | Phase 20    | Optional          | https://app.posthog.com
SENTRY_DSN                      | Phase 20    | Optional          | https://...@sentry.io/...

# === SEO (Phase 21) ===
GOOGLE_SEARCH_CONSOLE_KEY       | Phase 21    | Optional          | <verification key>
BING_WEBMASTER_KEY              | Phase 21    | Optional          | <verification key>

# === FRONTEND (.env) ===
VITE_API_BASE_URL               | Phase 1     | Required          | http://localhost:3000/api/v1
VITE_DAILY_DOMAIN               | Phase 5     | Required          | soulyatri.daily.co
VITE_STRIPE_PUBLISHABLE_KEY     | Phase 13    | Required          | pk_test_...
VITE_POSTHOG_KEY                | Phase 20    | Optional          | phc_...
VITE_SENTRY_DSN                 | Phase 20    | Optional          | https://...
```

### Per-Environment Rules

```
DEVELOPMENT (local machine):
  - Use .env file (gitignored) — copy from server/.env.example
  - DATABASE_URL: local PostgreSQL or Docker container
  - Payment keys: use Razorpay/Stripe TEST keys only
  - DAILY_API_KEY: use Daily.co free tier
  - OPENAI_API_KEY: personal key with spend limit ($20/month cap)
  - REDIS_URL: local Redis or skip (use in-memory fallback)
  - EMAIL: use Resend free tier or console.log fallback
  - S3: use local MinIO container or Cloudflare R2 free tier

STAGING (pre-production, mirrors production):
  - All environment variables set via platform secrets (Railway/Render)
  - DATABASE_URL: separate staging PostgreSQL instance
  - Payment keys: still TEST keys
  - All other services: production-like but separate instances
  - Seed data: anonymized copy of production (if available)

PRODUCTION:
  - All secrets in platform secret manager (Railway/Render secrets)
  - NEVER in .env files, NEVER in code, NEVER in git
  - DATABASE_URL: managed PostgreSQL (Neon/Supabase/RDS)
  - Payment keys: LIVE keys (Razorpay + Stripe)
  - DAILY_API_KEY: paid plan
  - OPENAI_API_KEY: organization key with billing
  - S3: AWS S3 or Cloudflare R2 production bucket
  - REDIS: managed Redis (Upstash/ElastiCache)
  - EMAIL: production domain verified with SPF/DKIM/DMARC
```

### Secret Rotation Policy

```
SECRET                    | ROTATION FREQUENCY | HOW TO ROTATE
--------------------------|-------------------|----------------------------------------------
JWT_ACCESS_SECRET         | Every 90 days     | Generate new secret, deploy, old tokens expire in 15min
JWT_REFRESH_SECRET        | Every 90 days     | Generate new secret, deploy, old refresh tokens expire in 7d
DATABASE_URL password     | Every 180 days    | Change in DB, update in platform secrets, restart
RAZORPAY_KEY_SECRET       | On compromise     | Regenerate in Razorpay dashboard, update secret
STRIPE_SECRET_KEY         | On compromise     | Roll in Stripe dashboard, update secret
OPENAI_API_KEY            | Every 90 days     | Generate new key in OpenAI dashboard, delete old
DAILY_API_KEY             | Every 180 days    | Regenerate in Daily dashboard
S3_ACCESS_KEY             | Every 90 days     | Create new IAM key, deploy, delete old key
FCM_PRIVATE_KEY           | Every 365 days    | Generate new service account key in Firebase
RESEND_API_KEY            | Every 180 days    | Generate new key in Resend dashboard

ROTATION PROCEDURE:
  1. Generate new secret in provider dashboard
  2. Update in platform secret manager (Railway/Render)
  3. Trigger deployment (auto-restarts with new secret)
  4. Verify app works with new secret (health check + manual test)
  5. Delete/disable old secret in provider dashboard
  6. Log rotation in audit trail
```

### .env.example Template (keep in sync)

```
# Server — copy to server/.env and fill in values
# DO NOT commit .env files to git

# Core
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/soulyatri
CORS_ORIGIN=http://localhost:5173

# Auth (Phase 1) — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_SALT_ROUNDS=12

# Storage (Phase 5)
S3_BUCKET_NAME=soulyatri-recordings-dev
S3_REGION=ap-south-1
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Video (Phase 5)
DAILY_API_KEY=
DAILY_WEBHOOK_SECRET=

# AI (Phase 6)
OPENAI_API_KEY=
OPENAI_ORG_ID=

# Payments (Phase 13)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email & Push (Phase 17)
EMAIL_PROVIDER=resend
RESEND_API_KEY=
EMAIL_FROM_ADDRESS=noreply@soulyatri.com
FCM_PROJECT_ID=
FCM_PRIVATE_KEY=
FCM_CLIENT_EMAIL=

# Redis (Phase 17)
REDIS_URL=redis://localhost:6379

# Analytics (Phase 20)
POSTHOG_API_KEY=
SENTRY_DSN=
```

---

### PHASE 26: Mobile App Design (Figma)
**Time estimate: 4-6 weeks (June-July 2026)**
**Prerequisites: ALL web phases 1-25 complete and launched**

```
WHAT TO BUILD:
  Complete mobile app Figma designs that map to the existing web interface.
  Every web screen gets a mobile-native equivalent.

TASKS:
  1. Design system — mobile
     a. Create mobile design tokens (smaller text sizes, touch targets 44px min)
     b. Bottom tab navigation (5 tabs: Home, Explore, AI Assistant, Sessions, Profile)
     c. Mobile header component (back arrow, title, action buttons)
     d. Pull-to-refresh pattern for all list screens
     e. Swipe gestures (swipe to delete, swipe between tabs)
     f. Bottom sheet pattern (replaces modals on mobile)
     g. Haptic feedback indicators

  2. Screen mapping (web → mobile)
     a. Splash Screen → same (but native, not browser)
     b. Onboarding → swipeable cards (not multi-step form)
     c. Dashboard → scrollable card feed (not grid layout)
     d. Therapy booking → bottom sheet calendar picker
     e. Video call → full-screen native (camera, mic controls at bottom)
     f. AI chat → WhatsApp-style chat bubbles (voice input button always visible)
     g. Meditation → immersive full-screen with system audio controls
     h. Journal → native keyboard with formatting toolbar above keyboard
     i. Community feed → Instagram/Twitter-style infinite scroll
     j. Shop → product grid with bottom cart button
     k. Blog → reader mode with adjustable font size
     l. Notifications → grouped by type (like iOS notification center)
     m. Settings → native settings pattern (grouped sections)
     n. Therapist/Astrologer dashboards → simplified mobile versions (key actions only)

  3. Mobile-specific screens (not in web)
     a. App onboarding (3 swipeable intro slides)
     b. Biometric login (Face ID / fingerprint)
     c. Push notification permission request screen
     d. Camera permission request screen
     e. Microphone permission request screen
     f. Offline mode indicator
     g. App update required screen
     h. Deep link landing (when opening shared links)

  4. Design review
     a. Test all designs in Figma mobile preview
     b. Verify touch targets ≥ 44x44px
     c. Verify text readable at arm's length (min 16px body)
     d. Verify dark mode versions of all screens
     e. Verify landscape mode for video call screen

DELIVERABLES:
  - Complete Figma file with all mobile screens
  - Component library (shared with web where possible)
  - Interaction prototype for key flows
  - Screen count target: ~200 mobile screens

VERIFY:
  - Every web screen has a mobile equivalent
  - All interactive prototypes work in Figma preview
  - Stakeholder sign-off on mobile UX
```

### PHASE 27: React Native App Development
**Time estimate: 12-16 weeks (July-October 2026)**
**Prerequisites: Phase 26 (designs), ALL web phases (API is ready)**

```
WHAT TO BUILD:
  React Native app using Expo that connects to the SAME backend API.
  Zero backend changes needed — the API-first architecture pays off here.

TASKS:
  1. Project setup
     a. npx create-expo-app soul-yatri-mobile --template expo-template-blank-typescript
     b. Install shared dependencies:
        - @tanstack/react-query (same as web — API caching)
        - zustand (same as web — state management)
        - zod (same as web — validation)
        - react-native-mmkv (secure storage, replaces localStorage)
        - expo-router (file-based routing)
        - expo-av (audio/video)
        - expo-camera (video calls)
        - expo-notifications (push)
        - expo-local-authentication (biometrics)
        - expo-haptics (tactile feedback)
     c. Create shared npm package: @soul-yatri/shared
        - Move Zod schemas from web to shared package
        - Move TypeScript types to shared package
        - Both web and mobile import from @soul-yatri/shared
     d. Configure deep linking (soulyatri.com/* → app)
     e. Configure universal links (iOS) + app links (Android)

  2. Core screens (Months 1-2)
     a. Splash screen + animated logo
     b. Login/Signup (biometric option after first login)
     c. Onboarding (swipeable cards)
     d. Dashboard (scrollable card feed)
     e. AI chat (text + voice input)
     f. Mood logging (quick entry from home screen widget)
     g. Journal (rich text with native keyboard)
     h. Meditation player (background audio, timer)
     i. Breathing exercise (animated circles)
     j. Profile + settings

  3. Therapy & video (Month 2-3)
     a. Therapist listing + booking
     b. Session calendar (native calendar integration)
     c. Video call (expo-camera + Daily.co React Native SDK)
     d. Session recording consent
     e. Post-session tasks + review
     f. Astrologer booking

  4. Social & content (Month 3-4)
     a. Community feed (infinite scroll)
     b. Blog reader
     c. Course viewer (video + progress)
     d. Event listing + registration
     e. Shop (product grid + cart + checkout)
     f. Notification center

  5. Push notifications
     a. Configure FCM (Android) + APNs (iOS) via expo-notifications
     b. Register device token on login → POST /notifications/register-device
     c. Handle notification taps → deep link to correct screen
     d. Notification categories: therapy-reminder, ai-alert, community, marketing
     e. Silent notifications for data sync

  6. Offline mode
     a. Journal entries: save locally, sync when online
     b. Mood logs: save locally, sync when online
     c. Meditation: cache audio files for offline playback
     d. Breathing exercises: fully offline (no API needed)
     e. Sync indicator: show "syncing..." badge on tab bar
     f. Conflict resolution: server wins for conflicts

  7. Platform-specific
     a. iOS: Live Activities for meditation timer
     b. iOS: Widgets (daily mood, next session countdown)
     c. Android: Widgets (daily mood, next session)
     d. Android: Material You theming
     e. Both: Dark mode matching system setting

PRISMA / API:
  No new backend endpoints needed. Mobile uses the SAME API as web.
  Only addition: POST /notifications/register-device (add to existing notification routes)

VERIFY:
  - App runs on iOS simulator + Android emulator
  - Login flow works with backend auth API
  - Video call works between mobile and web users
  - Push notifications arrive within 10 seconds
  - Offline journaling syncs correctly when reconnected
  - Deep links open correct screens
  - All screens match Figma designs from Phase 26
```

### PHASE 28: App Store Submission & ASO
**Time estimate: 2-4 weeks (November 2026)**
**Prerequisites: Phase 27 (app development complete)**

```
WHAT TO BUILD:
  Submit app to Apple App Store and Google Play Store with full ASO optimization.

TASKS:
  1. App Store assets
     a. App icon: 1024x1024 (App Store), 512x512 (Play Store)
     b. Screenshots: 6.7" iPhone, 6.5" iPhone, 12.9" iPad, phone + 7"/10" tablet
     c. App preview video: 30-second demo of key features
     d. Feature graphic (Play Store): 1024x500
     e. Promotional text: 170 chars (App Store)
     f. Description: up to 4000 chars, keyword-optimized
     g. Keywords: 100 chars (App Store keyword field)

  2. ASO optimization (use ASOConfig type from seo.types.ts)
     a. Title: "Soul Yatri — Mental Health & Therapy" (30 chars max)
     b. Subtitle: "Therapy, Astrology & Wellness" (30 chars max)
     c. Keywords: mental health, therapy, counselling, meditation, wellness, astrology,
        healing, self-care, mood tracker, journal, breathing, mindfulness
     d. Category: Health & Fitness (primary), Lifestyle (secondary)
     e. Localization: English (US, UK, India), Hindi
     f. A/B test: 2 sets of screenshots, measure conversion rate

  3. Compliance
     a. Apple: Health data privacy disclosure (HealthKit NOT used, but mental health data collected)
     b. Apple: App privacy labels (data collected, data linked to identity)
     c. Google: Data safety section (same disclosures)
     d. Both: Terms of service URL → soulyatri.com/terms
     e. Both: Privacy policy URL → soulyatri.com/privacy
     f. Apple: Review notes (explain therapy/astrology features, demo credentials)
     g. Both: Age rating: 17+ (therapy/mental health content)
     h. Both: Content rating questionnaire

  4. Beta testing
     a. TestFlight: invite 50 beta users (internal team + selected users)
     b. Google Play internal testing track: same 50 users
     c. Collect feedback for 2 weeks
     d. Fix critical bugs from beta feedback
     e. Graduate to open beta (optional, 100-500 users)

  5. Submission
     a. Submit to Apple App Store review (allow 1-2 weeks for review)
     b. Submit to Google Play review (typically 1-3 days)
     c. Prepare rejection response plan (common reasons: mental health claims, payment policies)
     d. If rejected: address feedback, resubmit within 48 hours

VERIFY:
  - App approved on both stores
  - App searchable for "mental health therapy India"
  - Install → onboard → book session flow works on fresh install
  - Push notifications work on fresh install
  - App size < 50MB initial download
```

### PHASE 29: Ship Mobile App
**Time estimate: 2 weeks (December 2026)**
**Prerequisites: Phase 28 (app approved on stores)**

```
WHAT TO BUILD:
  Public launch of mobile app with marketing push and monitoring.

TASKS:
  1. Launch preparation
     a. Set release date in App Store Connect + Google Play Console
     b. Prepare announcement: in-app banner on web ("Download our app!")
     c. Prepare email blast to all registered users
     d. Prepare social media posts (Instagram, LinkedIn, Twitter)
     e. Update soulyatri.com landing page with app download badges
     f. Smart banner: iOS Safari shows "Open in App" banner
     g. Android: Chrome "Add to Home Screen" prompt + app install banner

  2. Launch day
     a. Release app on both stores simultaneously
     b. Send email blast to user base
     c. Post on social media channels
     d. Monitor crash reports (Sentry) every 30 minutes for first 24 hours
     e. Monitor app store reviews — respond to all reviews within 24 hours
     f. Monitor server load — app users hit same API endpoints

  3. Post-launch monitoring (first 2 weeks)
     a. Track daily active users (DAU) on mobile vs web
     b. Track crash-free rate (target: > 99.5%)
     c. Track app store rating (target: > 4.5 stars)
     d. Track retention: Day 1, Day 7, Day 30
     e. Track funnel: install → signup → onboarding complete → first session
     f. Fix any crashes with hotfix releases (Expo OTA updates for JS, store update for native)

  4. Iteration
     a. Collect top 10 user complaints from reviews
     b. Prioritize and fix in next sprint
     c. Release update within 2 weeks of launch

VERIFY:
  - App available in App Store + Play Store
  - 100+ downloads in first week
  - Crash-free rate > 99%
  - All web features accessible from mobile
  - Push notifications working for all notification types
```

### PHASE 30: AI Model Fine-Tuning
**Time estimate: Ongoing (3+ months post-launch)**
**Prerequisites: Phase 6 (AI assistant live), 3+ months of real conversation data**

```
WHAT TO BUILD:
  Fine-tune AI models on anonymized real user data to improve therapy-specific
  accuracy, crisis detection, and Indian English understanding.

TASKS:
  1. Data collection pipeline
     a. Create anonymization job (BullMQ):
        - Strip PII: names → [USER], phone → [PHONE], email → [EMAIL]
        - Remove identifying details from conversation logs
        - Keep: emotional content, crisis patterns, therapy vocabulary
     b. Minimum dataset requirements:
        - Chat fine-tuning: 10,000+ anonymized conversations
        - Crisis detection: 500+ confirmed crisis interactions
        - Sentiment analysis: 5,000+ mood-labeled conversations
        - Transcription: 100+ hours of therapy audio (Indian English accents)
     c. Data quality review:
        - Manual review of 10% sample for PII leaks
        - Verify anonymization removes ALL identifying info
        - Label quality check (are crisis flags accurate?)

  2. Whisper fine-tuning (transcription)
     a. Collect 100+ hours of consented therapy recordings
     b. Create ground truth transcripts (human-reviewed)
     c. Fine-tune on therapy vocabulary: chakra, kundali, prana, doshas, etc.
     d. Fine-tune on Indian English accents + code-switching (Hindi-English)
     e. Evaluate: Word Error Rate (WER) < 10% on therapy vocabulary
     f. A/B test: fine-tuned vs base Whisper on 50 new recordings

  3. GPT fine-tuning (chat/sentiment)
     a. Format training data as JSONL (system + user + assistant messages)
     b. Fine-tune GPT-4o-mini for sentiment analysis:
        - Goal: better accuracy on Indian English mental health terminology
        - Evaluation: F1 score > 0.90 on test set
     c. Fine-tune GPT-4o-mini for crisis detection:
        - Goal: recall > 99.5% (NEVER miss a real crisis)
        - Acceptable false positive rate: < 5%
        - Test on 100 known crisis interactions + 100 normal ones
     d. Do NOT fine-tune the main chat model initially
        - Prompt engineering is cheaper and more flexible
        - Fine-tune only if prompt engineering plateaus

  4. Deployment & A/B testing
     a. Deploy fine-tuned models as separate OpenAI deployments
     b. Route 10% of traffic to fine-tuned model (A/B test)
     c. Compare metrics:
        - User satisfaction rating (thumbs up/down on AI responses)
        - Crisis detection accuracy (human-reviewed false negatives)
        - Transcription accuracy (WER on random sample)
     d. If fine-tuned model wins → gradually increase to 100%
     e. If fine-tuned model loses → keep base model, collect more data

  5. Continuous improvement
     a. Monthly: retrain models with new anonymized data
     b. Monthly: review crisis detection false negatives (zero tolerance)
     c. Quarterly: evaluate if newer base models (GPT-5, etc.) outperform fine-tuned
     d. Annually: full model evaluation against all benchmarks

VERIFY:
  - Fine-tuned Whisper WER < 10% on therapy vocabulary
  - Crisis detection recall > 99.5% (test with synthetic crisis messages)
  - A/B test shows improvement (or at least no regression)
  - Zero PII in training data (audit 10% sample)
  - Models deployed without downtime (gradual rollout)
```

### PHASE 31: Infrastructure Scaling
**Time estimate: Ongoing (based on user growth)**
**Prerequisites: Platform launched, monitoring in place (Sentry + PostHog)**

```
WHAT TO BUILD:
  Scale infrastructure from bootstrap (Railway/Render) to production-grade
  cloud infrastructure as user count grows.

TASKS:
  1. Monitoring & alerts (implement FIRST, before scaling)
     a. Application monitoring:
        - Sentry: error tracking, performance monitoring
        - Alert: error rate > 1% → Slack notification
        - Alert: p95 response time > 500ms → Slack notification
     b. Infrastructure monitoring:
        - Database: connection pool usage, query time, storage
        - Redis: memory usage, eviction rate, connection count
        - S3: storage usage, request count
        - Alert: DB connections > 80% pool → Slack notification
        - Alert: Redis memory > 80% → Slack notification
     c. Business monitoring:
        - PostHog: DAU, MAU, session count, conversion funnels
        - Custom: revenue dashboard (already in admin)
        - Alert: DAU drops > 20% day-over-day → email founder

  2. Scaling triggers (when to upgrade)
     a. 0-1,000 users: Railway/Render (current setup, $30-50/month)
        - Single server, single database, no Redis needed
        - In-memory session store, BullMQ with in-process mode
     b. 1,000-10,000 users: upgrade within Railway/Render ($100-300/month)
        - Add Redis (Upstash or Railway addon)
        - Upgrade database (Neon Pro or Supabase Pro)
        - Add CDN for static assets (Cloudflare free tier)
        - Enable database connection pooling (PgBouncer)
     c. 10,000-50,000 users: migrate to AWS/GCP ($500-2,000/month)
        - AWS ECS or GCP Cloud Run (auto-scaling containers)
        - RDS PostgreSQL with read replicas
        - ElastiCache Redis cluster
        - S3 + CloudFront CDN
        - Route 53 for DNS (multi-domain)
        - WAF (Web Application Firewall) for API protection
     d. 50,000+ users: full cloud-native ($2,000-10,000/month)
        - Kubernetes (EKS/GKE) for container orchestration
        - Database sharding or Aurora Serverless
        - Multi-region deployment (Mumbai + Singapore)
        - Global CDN (CloudFront/Cloudflare Pro)
        - Dedicated video infrastructure (Daily.co enterprise)
        - AI inference: dedicated GPU instances or Azure OpenAI

  3. Database scaling steps
     a. Connection pooling: PgBouncer (when connections > 50)
     b. Read replicas: route GET queries to replica (when reads > 80% of load)
     c. Indexing audit: EXPLAIN ANALYZE on slow queries (when any query > 100ms)
     d. Archival: move old audit logs to cold storage (when DB > 50GB)
     e. Partitioning: partition large tables by date (analytics_events, audit_logs)

  4. API scaling steps
     a. Rate limiting: already implemented (upgrade limits for paying users)
     b. Response caching: Redis cache for frequently-read data (therapist listings, blog posts)
     c. Queue heavy work: BullMQ for email, transcription, AI analysis (already designed)
     d. Horizontal scaling: add more server instances behind load balancer
     e. API gateway: Kong or AWS API Gateway for request routing

  5. Frontend scaling steps
     a. CDN: serve built assets from Cloudflare/CloudFront (100ms load globally)
     b. Code splitting: already done (lazy loading per route)
     c. Image optimization: Sharp.js for server-side + WebP/AVIF format
     d. Service worker: cache static assets for offline access

  6. Security scaling steps
     a. WAF rules: block common attacks (SQL injection, XSS, bot traffic)
     b. DDoS protection: Cloudflare or AWS Shield
     c. SSL/TLS: enforce TLS 1.3 minimum
     d. Secrets: migrate from platform env vars to AWS Secrets Manager or Vault
     e. Penetration testing: annual third-party pentest

  7. Cost optimization
     a. Reserved instances: 1-year commit for 30-40% savings on AWS
     b. Spot instances: use for background jobs (AI processing, transcription)
     c. S3 lifecycle rules: move old recordings to S3 Glacier (cheaper storage)
     d. Right-sizing: monitor CPU/memory usage, downsize over-provisioned resources
     e. Cloudflare R2: switch from S3 for zero egress costs

VERIFY:
  - p95 API response time < 200ms at current load
  - Database query time p95 < 50ms
  - Zero downtime during scaling migrations
  - Automated alerts fire correctly (test with synthetic errors)
  - Cost stays within budget for current user tier
  - All data encrypted in transit (TLS) and at rest (AES-256)
```

---

## How to Work with AI Agents — Rules

### Rule 1: One Phase at a Time
Give the AI agent ONE phase. Don't combine phases. Each phase should result in
a working, testable increment.

### Rule 2: Always Include Context
Start every prompt with:
```
You are working on the Soul Yatri codebase.
- Frontend: React + TypeScript + Vite in the root directory
- Backend: Express + TypeScript in server/ directory
- Build: npm run build (frontend), cd server && npm run build (backend)
- Type check: npx tsc --noEmit (frontend), cd server && npx tsc --noEmit (backend)
- Types are in src/types/ — always use them, don't create duplicate interfaces
```

### Rule 3: Verify After Every Phase
After each phase, ask the AI agent to:
1. Run `npx tsc --noEmit` — no type errors
2. Run `npm run build` — builds successfully
3. Test the feature manually — describe what to click/do
4. Take screenshots if UI changes

### Rule 4: Keep Files Small
- No file should be longer than 300 lines
- One component per file
- Split large pages into sub-components in a folder

### Rule 5: Use the Existing Patterns
- Pages go in `src/pages/` or `src/pages/<feature>/`
- Lazy-load in `src/router/index.tsx`
- Types in `src/types/<feature>.types.ts`
- API routes in `server/src/routes/<feature>.ts`
- Validation schemas in Zod

---

## Database Schema Overview (for Prisma)

```
User ──────── TherapySession ──── SessionRecording
  │                │                    │
  │                │               SessionTranscription
  │                │
  │           SessionTask          ClientSessionMonitor (AI)
  │                │               TherapistSessionMonitor (AI fraud)
  │                │
  ├── OnboardingData    ├── AstrologyReport ── AstrologyPrediction
  │                     │                          │
  ├── MoodLog           ├── KundaliChart      PredictionVote
  ├── JournalEntry      │
  ├── MeditationSession │
  ├── BreathingExercise Astrologer ── AstrologerSession
  │
  ├── AIConversation ── AIMessage
  │        │
  │   EmergencyFlag ── BehaviorPattern
  │
  ├── Notification ── NotificationPreference
  │
  ├── Enrollment ── Course ── Module ── Lesson
  │                    │
  │               CourseReview
  │
  ├── CommunityPost ── Comment ── Like ── Follow
  │        │
  │     Report (moderation) ── ContentModerationResult
  │
  ├── ShopOrder ── OrderItem ── Product ── ProductReview
  │     │
  │   ShippingAddress
  │
  ├── PaymentTransaction ── CurrencyConfig
  │
  ├── PayoutAccount ── PayoutRequest (therapist/astrologer earnings)
  │
  ├── UserMembership ── MembershipTier ── MembershipFeature
  │
  ├── Subscription ── SubscriptionPlan
  │
  ├── EventRegistration ── SoulEvent ── EventSpeaker
  │                            │
  │                       EventFeedback
  │
  ├── Complaint
  │
  ├── ProfessionalOnboarding ── QualificationDocument
  │
  ├── UserCurrencyPreference
  │
  └── ActionLog ── UserBehaviorEvent

Department ── DepartmentTarget
    │
Employee ── EmployeeAction ── EmployeeLifecycle
    │
TrainingModule

CorporateAccount ── CorporatePlan
    │
CorporateEmployee

InstitutionAccount (school/college)

Integration ── IntegrationFieldMapping

AdminBroadcast

NGOPartner ── NGOBeneficiary
    │
NGOImpactReport

JobPosition ── JobApplication

TrackedKeyword ── KeywordRankHistory (SEO)
ProgrammaticPage ── PSEOTemplate (PSEO)
AIModelConfig ── FineTuningDataset (AI)

TOTAL MODELS: ~80+
```

---

## Cost Estimates for Bootstrapping

| Service | Free Tier | Paid (when you scale) |
|---------|-----------|----------------------|
| **Railway/Render** (hosting) | $5/mo hobby | $20-50/mo |
| **Neon/Supabase** (PostgreSQL) | Free 500MB | $25/mo |
| **Cloudflare R2** (file storage) | Free 10GB | $0.015/GB/mo |
| **OpenAI API** (AI features) | Pay per use | ~$50-200/mo depending on usage |
| **Daily.co** (video calls) | Free 2000 min/mo | $0.004/min |
| **Razorpay** | No monthly fee | 2% per transaction |
| **Resend** (email) | Free 3000/mo | $20/mo |
| **Sentry** (error tracking) | Free 5K events/mo | $26/mo |
| **Domain + SSL** | Free SSL via Cloudflare | $10-15/year domain |
| **TOTAL to start** | | **~$30-50/month** |

---

## Priority Order (What to build first)

### 4-Month Launch Timeline — Feb 17 to June 15, 2026

```
MONTH 1 (Feb 17 – Mar 16): FOUNDATION
  Week 1-2:
    Phase 1  → Auth + Database (everything depends on this)
    Phase 2  → Onboarding flow (10 screens)
    Phase 18 → Landing page animations + About Us page
  Week 3-4:
    Phase 3  → User Dashboard (home base)
    Phase 13 → Payment gateway (Razorpay)
    Phase 4  → Therapy booking + auto-matching

MONTH 2 (Mar 17 – Apr 16): CORE PRODUCT
  Week 5-6:
    Phase 8  → Therapist Dashboard
    Phase 5  → Video calling + session recording + transcription
    Phase 16 → Health tools (mood, meditation, journal, breathing)
  Week 7-8:
    Phase 6  → AI voice assistant + emergency flagging
    Phase 25 → In-session AI monitoring (client + therapist fraud detection)
    Phase 17 → Notifications (real-time + email + push)

MONTH 3 (Apr 17 – May 16): FULL PLATFORM
  Week 9-10:
    Phase 7  → Astrologer system + pre-session workflow + prediction polls
    Phase 9  → Blog system with SEO automation
    Phase 10 → Soul Circle (community / social media)
  Week 11-12:
    Phase 11 → Courses platform (marketplace + admin approval)
    Phase 22 → Soul Events (workshops, retreats, webinars)
    Phase 23 → Memberships (tier system + recurring payments)

MONTH 4 (May 17 – Jun 15): SCALE + POLISH + LAUNCH
  Week 13-14:
    Phase 12 → Soul Shop (e-commerce + merchandise)
    Phase 14 → Admin dashboard + employee tracker + head office
    Phase 19 → About Us, Careers/Hiring portal, public pages
    Phase 24 → NGO collaborations + impact reports
  Week 15:
    Phase 15 → Corporate + School/College system + integrations
    Phase 20 → Department dashboards (Therapy, Astrology, Marketing, Sales, etc.)
    Phase 21 → SEO automation + Google ranking system
  Week 16:
    Full integration testing across all features
    Security audit (pen testing, OWASP top 10)
    Performance optimization (Lighthouse 90+, API <200ms)
    Mobile-responsive QA on all screens
    Production deployment (Docker → Railway/Render)
    DNS + SSL + CDN setup
    LAUNCH 🚀

POST-LAUNCH (Jun 16+):
    Phase 26 — Mobile app design in Figma (June-July 2026)
    Phase 27 — React Native app development (July-October 2026)
      - Same API, zero backend changes
      - Shared Zod validation schemas (npm package)
      - Same Socket.IO connection for real-time
      - FCM for mobile push notifications
      - Deep linking: map mobile routes to web routes
      - Camera integration for video therapy sessions
      - Voice recording for AI assistant
      - Offline mode for journaling and mood tracking
    Phase 28 — App store submission & ASO (November 2026)
      - Apple App Store + Google Play Store
      - ASO optimization (see ASOConfig type in seo.types.ts)
      - Beta testing with 50-100 users first
    Phase 29 — Ship mobile app (December 2026)
    Phase 30 — AI model fine-tuning (ongoing post 3 months of data)
      - Collect anonymized data from real sessions
      - Fine-tune Whisper for therapy vocabulary + Indian accents
      - Fine-tune GPT-4o-mini for sentiment analysis
      - A/B test fine-tuned vs base models
    Phase 31 — Scale infrastructure based on load
      - Migrate from Railway/Render → AWS ECS/EKS
      - Add Redis caching layer
      - CDN optimization for global users
      - Database read replicas
```

### Parallel work tips
```
- You can run 2 AI agents on different phases if they don't overlap
- Frontend and backend of the same phase CAN be done in parallel
- These phases have ZERO overlap and can be built simultaneously:
    • Blog SEO (Phase 9) + AI Assistant (Phase 6)
    • Shop (Phase 12) + Community (Phase 10)
    • Events (Phase 22) + Courses (Phase 11)
    • NGO (Phase 24) + Memberships (Phase 23)
    • Corporate (Phase 15) + About/Careers (Phase 19)
- Admin dashboard (Phase 14) should come AFTER the features it manages
```

---

## File Naming Conventions

```
Pages:          src/pages/<Feature>Page.tsx           (e.g., LoginPage.tsx)
Sub-pages:      src/pages/<feature>/<Name>Page.tsx    (e.g., dashboard/SessionsPage.tsx)
Components:     src/components/<Name>.tsx              (e.g., LoadingSpinner.tsx)
UI primitives:  src/components/ui/<name>.tsx           (e.g., button.tsx)
Types:          src/types/<feature>.types.ts           (e.g., therapy.types.ts)
Config:         src/config/<name>.ts                   (e.g., routes.ts)
Context:        src/context/<Name>Context.tsx           (e.g., AuthContext.tsx)
Hooks:          src/hooks/<name>.hooks.ts               (e.g., responsive.hooks.ts)
Services:       src/services/<name>.service.ts          (e.g., api.service.ts)
Layouts:        src/layouts/<Name>Layout.tsx             (e.g., DashboardLayout.tsx)
Sections:       src/sections/<Name>Section.tsx           (e.g., HeroSection.tsx)
Utils:          src/utils/<category>/<name>.ts           (e.g., helpers/date.helpers.ts)
API routes:     server/src/routes/<feature>.ts         (e.g., therapy.ts)
Middleware:     server/src/middleware/<name>.ts         (e.g., auth.ts)
Server services: server/src/services/<feature>.ts      (e.g., matching.ts)
Validators:     server/src/validators/<feature>.ts     (e.g., therapy.ts)
```

### Frontend Hooks Pattern (src/hooks/)

```
Existing:
  src/hooks/use-mobile.ts           — isMobile detection
  src/hooks/responsive.hooks.ts     — responsive breakpoint hooks
  src/hooks/advanced.hooks.ts       — advanced utility hooks

To add per phase:
  src/hooks/use-auth.ts             — login, logout, signup, current user
  src/hooks/use-api.ts              — generic API caller with loading/error
  src/hooks/use-notifications.ts    — notification bell, real-time updates
  src/hooks/use-socket.ts           — Socket.IO connection management
  src/hooks/use-payment.ts          — payment flow, currency preference
  src/hooks/use-media.ts            — video/audio stream, recording
```

### Frontend Services Pattern (src/services/)

```
Existing:
  src/services/api.service.ts       — axios instance, interceptors, base URL
  src/services/analytics.service.ts — event tracking, page views
  src/services/storage.service.ts   — localStorage/sessionStorage wrapper

To add per phase:
  src/services/auth.service.ts      — auth API calls (login, register, refresh)
  src/services/therapy.service.ts   — booking, sessions, therapist search
  src/services/ai.service.ts        — AI chat, voice, emergency
  src/services/payment.service.ts   — Razorpay/Stripe integration
  src/services/notification.service.ts — push notification registration
  src/services/socket.service.ts    — Socket.IO client setup
  src/services/media.service.ts     — Daily.co/100ms video integration
```

---

## Complete Page File Map (kidhar kya rahega)

Every page in the app and its exact file path:

```
=== STANDALONE (no layout) ===
src/pages/SplashScreen.tsx              → / (animated loading intro)

=== PUBLIC PAGES (MainLayout — nav + footer) ===
src/pages/LandingPage.tsx               → /home
src/pages/AboutPage.tsx                 → /about
src/pages/ContactPage.tsx               → /contact
src/pages/CareersPage.tsx               → /careers
src/pages/careers/CareerDetailPage.tsx   → /careers/:id
src/pages/BlogListingPage.tsx           → /blog
src/pages/blog/BlogPostPage.tsx         → /blog/:slug
src/pages/CourseCatalogPage.tsx         → /courses
src/pages/courses/CourseDetailPage.tsx   → /courses/:id
src/pages/ShopPage.tsx                  → /shop
src/pages/shop/ProductDetailPage.tsx     → /shop/:id
src/pages/CommunityPreviewPage.tsx      → /community
src/pages/EventsPage.tsx               → /events
src/pages/events/EventDetailPage.tsx     → /events/:slug
src/pages/MembershipsPage.tsx           → /memberships
src/pages/NGOPage.tsx                   → /ngo
src/pages/NotFoundPage.tsx              → /404 and /*

=== AUTH PAGES (AuthLayout — centered card) ===
src/pages/auth/LoginPage.tsx            → /login
src/pages/auth/SignupPage.tsx           → /signup
src/pages/auth/ForgotPasswordPage.tsx   → /forgot-password
src/pages/auth/ResetPasswordPage.tsx    → /reset-password

=== ONBOARDING (standalone, no layout chrome) ===
src/pages/onboarding/OnboardingPage.tsx → /onboarding
  Sub-steps (internal components, not separate routes):
  src/pages/onboarding/steps/WelcomeStep.tsx
  src/pages/onboarding/steps/BirthDateStep.tsx
  src/pages/onboarding/steps/ContactStep.tsx
  src/pages/onboarding/steps/MoodStep.tsx
  src/pages/onboarding/steps/StrugglesStep.tsx
  src/pages/onboarding/steps/GoalsStep.tsx
  src/pages/onboarding/steps/TherapyHistoryStep.tsx
  src/pages/onboarding/steps/PreferencesStep.tsx
  src/pages/onboarding/steps/InterestsStep.tsx
  src/pages/onboarding/steps/ConsentStep.tsx

=== USER DASHBOARD (ProtectedRoute + DashboardLayout) ===
src/pages/dashboard/UserDashboardPage.tsx       → /dashboard
src/pages/dashboard/SessionsPage.tsx            → /dashboard/sessions
src/pages/dashboard/SessionDetailPage.tsx       → /dashboard/sessions/:id
src/pages/dashboard/BookSessionPage.tsx         → /dashboard/book
src/pages/dashboard/HealthToolsPage.tsx         → /dashboard/health
src/pages/dashboard/MeditationPage.tsx          → /dashboard/meditate
src/pages/dashboard/JournalPage.tsx             → /dashboard/journal
src/pages/dashboard/MoodTrackerPage.tsx         → /dashboard/mood
src/pages/dashboard/BreathingPage.tsx           → /dashboard/breathing
src/pages/dashboard/CoursesPage.tsx             → /dashboard/courses
src/pages/dashboard/CommunityPage.tsx           → /dashboard/community
src/pages/dashboard/ShopPage.tsx                → /dashboard/shop
src/pages/dashboard/AIAssistantPage.tsx         → /dashboard/ai
src/pages/dashboard/ReportsPage.tsx             → /dashboard/reports
src/pages/dashboard/SettingsPage.tsx            → /dashboard/settings
src/pages/dashboard/ComplaintsPage.tsx          → /dashboard/complaints
src/pages/dashboard/PaymentHistoryPage.tsx      → /dashboard/payments
src/pages/dashboard/MyEventsPage.tsx            → /dashboard/events
src/pages/dashboard/MyMembershipPage.tsx        → /dashboard/membership

=== USER PROFILE (ProtectedRoute + DashboardLayout) ===
src/pages/ProfilePage.tsx                       → /profile

=== THERAPIST DASHBOARD (ProtectedRoute + DashboardLayout) ===
src/pages/therapist/TherapistDashboardPage.tsx  → /therapist
src/pages/therapist/ClientsPage.tsx             → /therapist/clients
src/pages/therapist/ClientDetailPage.tsx        → /therapist/clients/:id
src/pages/therapist/SessionsPage.tsx            → /therapist/sessions
src/pages/therapist/SessionDetailPage.tsx       → /therapist/sessions/:id
src/pages/therapist/RevenuePage.tsx             → /therapist/revenue
src/pages/therapist/ReviewsPage.tsx             → /therapist/reviews
src/pages/therapist/ProfilePage.tsx             → /therapist/profile

=== ASTROLOGER DASHBOARD (ProtectedRoute + DashboardLayout) ===
src/pages/astrologer/AstrologerDashboardPage.tsx → /astrologer
src/pages/astrologer/AnalysesPage.tsx            → /astrologer/analyses
src/pages/astrologer/ClientsPage.tsx             → /astrologer/clients
src/pages/astrologer/ClientDetailPage.tsx        → /astrologer/clients/:id
src/pages/astrologer/SessionsPage.tsx            → /astrologer/sessions
src/pages/astrologer/PredictionsPage.tsx         → /astrologer/predictions
src/pages/astrologer/ProfilePage.tsx             → /astrologer/profile

=== ADMIN / HEAD OFFICE (ProtectedRoute + DashboardLayout) ===
src/pages/admin/AdminDashboardPage.tsx           → /admin
src/pages/admin/HeadOfficePage.tsx               → /admin/head-office
src/pages/admin/AnalyticsPage.tsx                → /admin/analytics
src/pages/admin/UsersPage.tsx                    → /admin/users
src/pages/admin/TherapistsPage.tsx               → /admin/therapists
src/pages/admin/AstrologersPage.tsx              → /admin/astrologers
src/pages/admin/RevenuePage.tsx                  → /admin/revenue
src/pages/admin/ComplaintsPage.tsx               → /admin/complaints
src/pages/admin/EmergencyPage.tsx                → /admin/emergency
src/pages/admin/FraudAlertsPage.tsx              → /admin/fraud-alerts
src/pages/admin/TherapistQualityPage.tsx         → /admin/therapist-quality
src/pages/admin/AIMonitoringPage.tsx             → /admin/ai-monitoring
src/pages/admin/SessionRecordingsPage.tsx        → /admin/session-recordings
src/pages/admin/BlogModerationPage.tsx           → /admin/blog
src/pages/admin/CourseModerationPage.tsx         → /admin/courses
src/pages/admin/CommunityModerationPage.tsx      → /admin/community
src/pages/admin/ShopManagementPage.tsx           → /admin/shop
src/pages/admin/EventsPage.tsx                   → /admin/events
src/pages/admin/MembershipsPage.tsx              → /admin/memberships
src/pages/admin/NGOPage.tsx                      → /admin/ngo
src/pages/admin/EmployeesPage.tsx                → /admin/employees
src/pages/admin/DepartmentsPage.tsx              → /admin/departments
src/pages/admin/HiringPage.tsx                   → /admin/hiring
src/pages/admin/AuditLogPage.tsx                 → /admin/audit-log
src/pages/admin/SettingsPage.tsx                 → /admin/settings
src/pages/admin/PaymentsPage.tsx                 → /admin/payments
src/pages/admin/CorporatePage.tsx                → /admin/corporate
src/pages/admin/InstitutionsPage.tsx             → /admin/institutions
src/pages/admin/IntegrationsPage.tsx             → /admin/integrations
src/pages/admin/NotificationsPage.tsx            → /admin/notifications
src/pages/admin/PlatformHealthPage.tsx           → /admin/platform-health
src/pages/admin/SEODashboardPage.tsx             → /admin/seo
  Department sub-pages:
  src/pages/admin/departments/TherapyDeptPage.tsx     → /admin/departments/therapy
  src/pages/admin/departments/AstrologyDeptPage.tsx   → /admin/departments/astrology
  src/pages/admin/departments/MarketingDeptPage.tsx   → /admin/departments/marketing
  src/pages/admin/departments/SalesDeptPage.tsx       → /admin/departments/sales
  src/pages/admin/departments/SupportDeptPage.tsx     → /admin/departments/support
  src/pages/admin/departments/ContentDeptPage.tsx     → /admin/departments/content
  src/pages/admin/departments/EngineeringDeptPage.tsx → /admin/departments/engineering

=== EMPLOYEE (ProtectedRoute + DashboardLayout) ===
src/pages/employee/EmployeeDashboardPage.tsx     → /employee
src/pages/employee/TargetsPage.tsx               → /employee/targets
src/pages/employee/TasksPage.tsx                 → /employee/tasks
src/pages/employee/TeamPage.tsx                  → /employee/team

=== CORPORATE (ProtectedRoute + DashboardLayout) ===
src/pages/corporate/CorporateDashboardPage.tsx   → /corporate
src/pages/corporate/EmployeesPage.tsx            → /corporate/employees
src/pages/corporate/SessionsPage.tsx             → /corporate/sessions
src/pages/corporate/ReportsPage.tsx              → /corporate/reports

=== PROGRAMMATIC SEO (MainLayout, auto-generated) ===
src/pages/seo/TherapistForIssuePage.tsx          → /therapist-for-:issue
src/pages/seo/MeditationForGoalPage.tsx          → /meditation-for-:goal
src/pages/seo/CityTherapistPage.tsx              → /:city-therapist

TOTAL PAGES: ~110 unique page files
```

## Figma-to-Code Design Workflow (Design Kese Perfect Aayegi)

Every screen MUST follow this exact process to be pixel-perfect Apple-style:

### Step 1: Export from Figma
```
For EVERY screen:
1. Open Figma → select the frame
2. Right panel → "Inspect" tab
3. Note down:
   - Width/height (responsive — mobile 375px, tablet 768px, desktop 1440px)
   - All colors (exact hex: #XXXXXX) — match to Tailwind or add to tailwind.config.ts
   - All font sizes (px → Tailwind: 12px=text-xs, 14px=text-sm, 16px=text-base, 18px=text-lg, 20px=text-xl, 24px=text-2xl, 30px=text-3xl, 36px=text-4xl, 48px=text-5xl)
   - Font weight (400=font-normal, 500=font-medium, 600=font-semibold, 700=font-bold)
   - Line height (tight=1.25, normal=1.5, relaxed=1.625)
   - Letter spacing
   - All spacing/padding/margin (px → Tailwind: 4px=1, 8px=2, 12px=3, 16px=4, 20px=5, 24px=6, 32px=8, 40px=10, 48px=12, 64px=16)
   - Border radius (4px=rounded, 8px=rounded-lg, 12px=rounded-xl, 16px=rounded-2xl, 9999px=rounded-full)
   - Shadows (exact box-shadow values)
   - Opacity values
   - Blur values (for glassmorphism)
4. Export all icons as SVG → save to public/icons/
5. Export all images → save to public/images/
6. Export any illustrations → save to public/illustrations/
```

### Step 2: Design Tokens (already in codebase)
```
File: src/styles/tokens.ts (create during Phase 1)

Export exact Figma values as constants:
- colors: { primary, secondary, accent, neutral, success, warning, error, gradients }
- typography: { fontFamily, sizes, weights, lineHeights }
- spacing: { xs, sm, md, lg, xl, 2xl, 3xl }
- shadows: { sm, md, lg, xl, glow }
- borderRadius: { sm, md, lg, xl, full }
- animations: { duration, easing, spring }
- breakpoints: { mobile: 375, tablet: 768, desktop: 1024, wide: 1440 }

These tokens are the SINGLE SOURCE OF TRUTH — every component uses them.
```

### Step 3: Build the Screen
```
For EVERY screen, the AI agent prompt MUST include:
1. "Here is the Figma screenshot of this screen" (paste screenshot)
2. "Use these design tokens from src/styles/tokens.ts"
3. "Match spacing, colors, typography EXACTLY"
4. "Make it responsive: mobile-first, then tablet, then desktop"
5. "Add smooth transitions: all interactive elements need hover/focus/active states"
6. "Use Framer Motion for enter/exit animations"
7. "Apple-style = generous whitespace, subtle shadows, smooth animations, glass effects"
```

### Step 4: Verify Design Match
```
For EVERY screen after building:
1. Place Figma export (PNG) next to browser screenshot side-by-side
2. Check: colors match? ✅/❌
3. Check: spacing match? ✅/❌
4. Check: typography match? ✅/❌
5. Check: shadows/effects match? ✅/❌
6. Check: responsive mobile view correct? ✅/❌
7. Check: responsive tablet view correct? ✅/❌
8. Check: hover/focus states present? ✅/❌
9. Check: animations smooth (60fps)? ✅/❌
10. Only mark screen as DONE when ALL checks pass ✅
```

### Apple-Style Design Principles (follow for EVERY screen)
```
1. Whitespace is king — never crowd elements, let them breathe
2. Typography hierarchy — one hero text, clear heading/subheading/body distinction
3. Subtle shadows — never harsh, use layered soft shadows (shadow-sm + shadow-lg)
4. Glass morphism — backdrop-blur-xl bg-white/10 for overlays and cards
5. Smooth animations — 300-500ms duration, ease-out or spring, never jarring
6. Rounded corners — minimum rounded-xl for cards, rounded-2xl for modals
7. Gradient accents — subtle gradients on CTAs and hero sections
8. Micro-interactions — button scale on press (scale-95), card lift on hover
9. Consistent spacing — 8px grid system (Tailwind's spacing scale)
10. Dark mode support — every screen must look great in both light and dark
```

---

## Complete Frontend Screen Inventory (Kisme Kitni Screens Hai)

This is the COMPLETE list of every screen, sub-screen, modal, dialog, and flow state
in the entire application. Each page file may contain MULTIPLE screens/views.

**TOTAL: 510+ unique screens across all sections**

---

### SECTION 1: SPLASH & LANDING (Phase 18) — 8 screens
```
1.1  SplashScreen.tsx
     Screen 1: Black → Logo fade-in animation (0-2s)
     Screen 2: Logo pulse → tagline reveal (2-4s)
     Screen 3: Auto-redirect to landing page (4-5s)

1.2  LandingPage.tsx (scrollable, each section = separate screen view)
     Screen 4: Hero section — Three.js lotus + hero text + CTA
     Screen 5: Services section — animated service cards
     Screen 6: Features section — parallax scroll reveal
     Screen 7: Testimonials section — carousel with video testimonials
     Screen 8: Footer — links, social, newsletter signup
```

### SECTION 2: PUBLIC PAGES (Phase 9, 18, 19) — 32 screens
```
2.1  AboutPage.tsx — Phase 19
     Screen 9:  Hero with mission statement + team photo
     Screen 10: Our Story — timeline scroll animation
     Screen 11: Team section — founder/co-founder cards with hover bio
     Screen 12: Our Values — animated icons with descriptions
     Screen 13: Press & Media — logos + article links

2.2  ContactPage.tsx — Phase 19
     Screen 14: Contact form (name, email, subject, message)
     Screen 15: Contact form → success confirmation view
     Screen 16: Map embed + office address + social links

2.3  CareersPage.tsx — Phase 19
     Screen 17: Open positions list with filters (department, location, type)
     Screen 18: Career detail page — role description, requirements, perks
     Screen 19: Job application form (resume upload, cover letter, LinkedIn)
     Screen 20: Application submitted confirmation screen

2.4  BlogListingPage.tsx — Phase 9
     Screen 21: Blog grid view with search, category filter, tag filter
     Screen 22: Blog list view (compact)
     Screen 23: Blog category results page
     Screen 24: Blog tag results page

2.5  BlogPostPage.tsx — Phase 9
     Screen 25: Blog post reading view (article, author, date, share, related posts)
     Screen 26: Blog post with comments section expanded
     Screen 27: Share dialog (copy link, WhatsApp, Twitter, Facebook, LinkedIn)

2.6  CourseCatalogPage.tsx — Phase 11
     Screen 28: Course grid with filters (category, price, rating, duration)
     Screen 29: Course detail — curriculum, instructor, reviews, preview video
     Screen 30: Course preview modal (video trailer)

2.7  ShopPage.tsx — Phase 12
     Screen 31: Product grid with filters (category, price range, rating)
     Screen 32: Product detail — images carousel, description, variants, reviews, add to cart
     Screen 33: Product image zoom modal
     Screen 34: Product review submission modal

2.8  CommunityPreviewPage.tsx — Phase 10
     Screen 35: Public preview of Soul Circle (sample posts, join CTA)

2.9  EventsPage.tsx — Phase 22
     Screen 36: Events list with filters (date, type, virtual/in-person, free/paid)
     Screen 37: Event detail — description, schedule, speakers, venue, register CTA
     Screen 38: Event registration modal (attendee details, payment if paid)
     Screen 39: Event registration success + add to calendar

2.10 MembershipsPage.tsx — Phase 23
     Screen 40: Membership tiers comparison table (Free/Seeker/Healer/Enlightened)
```

### SECTION 3: AUTHENTICATION (Phase 1) — 12 screens
```
3.1  LoginPage.tsx
     Screen 41: Login form (email + password + remember me)
     Screen 42: Login with Google/Apple SSO buttons
     Screen 43: Login error state (wrong credentials)
     Screen 44: Login → 2FA verification code entry (OTP)
     Screen 45: Login success → redirect animation

3.2  SignupPage.tsx
     Screen 46: Signup Step 1 — name, email, password, confirm password
     Screen 47: Signup Step 2 — phone, how did you hear about us
     Screen 48: Signup → email verification pending screen
     Screen 49: Email verified success screen
     Screen 50: Signup error state (email already exists)

3.3  ForgotPasswordPage.tsx
     Screen 51: Enter email form
     Screen 52: "Check your email" confirmation screen

3.4  ResetPasswordPage.tsx
     Screen 53: New password + confirm password form
     Screen 54: Password reset success → redirect to login
```

### SECTION 4: ONBOARDING (Phase 2) — 14 screens
```
4.1  OnboardingPage.tsx → 10 internal step screens + transitions
     Screen 55:  Step 1 — Welcome screen (personalized "Hi {name}" + what to expect)
     Screen 56:  Step 2 — Full name input (first + last, with gentle animation)
     Screen 57:  Step 3 — Birth date picker (date, time if known, place of birth for kundali)
     Screen 58:  Step 4 — Contact preferences (phone, WhatsApp, notification preferences)
     Screen 59:  Step 5 — Current mood check-in (animated mood scale 1-10 with faces)
     Screen 60:  Step 6 — What are you struggling with? (multi-select: anxiety, depression, relationship, career, grief, trauma, self-esteem, addiction, loneliness, anger, sleep, other)
     Screen 61:  Step 7 — Goals selection (what do you want to achieve? multi-select cards)
     Screen 62:  Step 8 — Previous therapy experience (yes/no, details if yes)
     Screen 63:  Step 9 — Preferences (therapist gender, language, session time preference, astrology interest y/n)
     Screen 64:  Step 10 — Interests for content (meditation, yoga, breathwork, journaling, courses, community)
     Screen 65:  Consent & privacy agreement screen (data usage, recording consent)
     Screen 66:  Onboarding complete — personalized welcome + dashboard preview + "Your journey begins" animation
     Screen 67:  Progress bar UI (visible on all steps, animated fill)
     Screen 68:  "Save & continue later" confirmation modal
```

### SECTION 5: USER DASHBOARD (Phase 3, 4, 6, 16) — 78 screens
```
5.1  UserDashboardPage.tsx — Phase 3
     Screen 69:  Dashboard home — greeting card, mood quick-check, upcoming session, AI suggestions
     Screen 70:  Dashboard home — empty state (new user, no sessions yet)
     Screen 71:  Quick actions bar (book session, AI chat, meditate, journal)
     Screen 72:  Healing progress card (chart showing mood trends over time)
     Screen 73:  Recommended content section (courses, blogs, meditations)
     Screen 74:  Notification bell panel (slide-out drawer with recent notifications)

5.2  BookSessionPage.tsx — Phase 4 (MULTI-STEP FLOW = 8 screens)
     Screen 75:  Step 1 — Select session type (therapy/astrology/both)
     Screen 76:  Step 2 — AI-matched therapist recommendations (top 3 ranked by match score)
     Screen 77:  Step 2 alt — Browse all therapists (grid with filters: specialty, rating, price, language, gender)
     Screen 78:  Step 2 detail — Therapist profile modal (bio, qualifications, reviews, availability calendar)
     Screen 79:  Step 3 — Pick date & time slot (calendar view with available slots highlighted)
     Screen 80:  Step 4 — Session details confirmation (therapist, date, time, type, price)
     Screen 81:  Step 5 — Payment screen (Razorpay/Stripe integration)
     Screen 82:  Step 6 — Booking confirmed screen (session details + add to calendar + what to prepare)

5.3  SessionsPage.tsx — Phase 4
     Screen 83:  Upcoming sessions list (date, therapist, countdown timer)
     Screen 84:  Past sessions list (date, therapist, summary, rating)
     Screen 85:  Session empty state (no sessions booked yet → CTA to book)
     Screen 86:  Cancel session confirmation modal
     Screen 87:  Reschedule session modal (new date/time picker)

5.4  SessionDetailPage.tsx — Phase 4
     Screen 88:  Pre-session view — therapist info, preparation tips, join button (active 5 min before)
     Screen 89:  Post-session view — recording playback, transcription key points, assigned tasks
     Screen 90:  Post-session view — rate your therapist modal (1-5 stars + comment)
     Screen 91:  Post-session view — personality report (deep analysis PDF download)
     Screen 92:  Astrologer pre-session report view (predictions shared before session)

5.5  AIAssistantPage.tsx — Phase 6
     Screen 93:  AI chat interface (message bubbles, typing indicator, suggested prompts)
     Screen 94:  AI chat — voice mode (microphone active, waveform visualization)
     Screen 95:  AI chat — crisis detection alert (emergency resources + option to connect to human)
     Screen 96:  AI chat — session history list (past conversations by date)
     Screen 97:  AI chat — empty state (first time, intro message with capabilities)

5.6  HealthToolsPage.tsx — Phase 16
     Screen 98:  Health tools hub (cards: meditation, breathing, journal, mood, sleep tracker)
     Screen 99:  Health tools — empty state (personalized recommendations based on onboarding)

5.7  MeditationPage.tsx — Phase 16
     Screen 100: Meditation library (categories: sleep, anxiety, focus, morning, guided, music)
     Screen 101: Meditation player (timer, ambient sound mixer, visual animation)
     Screen 102: Meditation player — session complete summary (duration, streak)
     Screen 103: Meditation favorites list
     Screen 104: Meditation history/streak calendar

5.8  BreathingPage.tsx — Phase 16
     Screen 105: Breathing exercise selection (4-7-8, box, alternate nostril, energizing)
     Screen 106: Breathing exercise active (animated circle expanding/contracting with timer)
     Screen 107: Breathing complete — summary + how you feel check

5.9  JournalPage.tsx — Phase 16
     Screen 108: Journal entries list (cards with date, mood, preview text)
     Screen 109: Journal — new entry editor (rich text, mood selector, tags, gratitude prompt)
     Screen 110: Journal — entry detail view (full text, mood, AI insights if generated)
     Screen 111: Journal — prompt of the day modal
     Screen 112: Journal empty state (first entry encouragement)

5.10 MoodTrackerPage.tsx — Phase 16
     Screen 113: Mood history timeline (graph: daily/weekly/monthly trends)
     Screen 114: Mood check-in modal (mood slider + triggers + notes)
     Screen 115: Mood insights — AI analysis of patterns ("You tend to feel low on Mondays")
     Screen 116: Mood calendar view (color-coded days by mood)

5.11 CoursesPage.tsx (dashboard) — Phase 11
     Screen 117: My enrolled courses list with progress bars
     Screen 118: Course player — video lesson with chapters sidebar
     Screen 119: Course player — quiz/exercise screen
     Screen 120: Course — certificate earned celebration screen
     Screen 121: Course — lesson notes view
     Screen 122: Course empty state (no enrolled courses → recommendations)

5.12 CommunityPage.tsx (dashboard) — Phase 10
     Screen 123: Soul Circle feed (posts, likes, comments, anonymity toggle)
     Screen 124: Create post composer (text, image, poll, anonymous toggle)
     Screen 125: Post detail — comments thread view
     Screen 126: Create circle/group modal
     Screen 127: Circle/group detail — members, posts, about
     Screen 128: My circles list
     Screen 129: Community search (search posts, users, circles)
     Screen 130: Community guidelines modal (first time)
     Screen 131: Report content modal
     Screen 132: User profile preview modal (within community)
     Screen 133: Community empty state (no posts in circle → encourage first post)

5.13 ShopPage.tsx (dashboard) — Phase 12
     Screen 134: Shop grid with wishlist, cart icon with count badge
     Screen 135: Shopping cart drawer (items, quantities, total, checkout CTA)
     Screen 136: Checkout flow — shipping address form
     Screen 137: Checkout flow — payment screen
     Screen 138: Order placed success screen (order ID, estimated delivery)
     Screen 139: My orders list (order status: processing/shipped/delivered/returned)
     Screen 140: Order detail — items, tracking, invoice download
     Screen 141: Return/exchange request form
     Screen 142: Wishlist page

5.14 ReportsPage.tsx — Phase 3
     Screen 143: Healing journey timeline (milestones, sessions, mood trends combined)
     Screen 144: Personality assessment results (traits, strengths, areas to work on)
     Screen 145: Weekly healing report card (AI-generated summary)
     Screen 146: Download reports as PDF button + preview

5.15 SettingsPage.tsx — Phase 3
     Screen 147: Profile settings (name, email, phone, photo, bio)
     Screen 148: Password change form
     Screen 149: Notification preferences (email, push, SMS, in-app toggles per category)
     Screen 150: Privacy settings (data visibility, anonymous mode, data export request)
     Screen 151: Language & currency preferences
     Screen 152: Theme preference (light/dark/auto)
     Screen 153: Connected accounts (Google, Apple)
     Screen 154: Delete account confirmation flow (3-step: reason → confirm → countdown)
     Screen 155: Data export request → processing → download ready

5.16 ComplaintsPage.tsx — Phase 3
     Screen 156: Submit complaint form (category, description, attachments)
     Screen 157: My complaints list (status: open/in-progress/resolved)
     Screen 158: Complaint detail — conversation thread with support

5.17 PaymentHistoryPage.tsx — Phase 13
     Screen 159: Payment history table (date, amount, type, status, invoice)
     Screen 160: Invoice detail view
     Screen 161: Payment receipt download

5.18 MyEventsPage.tsx — Phase 22
     Screen 162: Registered events list (upcoming/past tabs)
     Screen 163: Event ticket view (QR code for check-in)

5.19 MyMembershipPage.tsx — Phase 23
     Screen 164: Current membership status card (tier, renewal date, benefits used)
     Screen 165: Upgrade/downgrade membership modal
     Screen 166: Membership payment history
     Screen 167: Cancel membership confirmation (with retention offer)

5.20 ProfilePage.tsx — Phase 3
     Screen 168: User public profile view (avatar, bio, community posts, badges)
     Screen 169: Edit profile modal
```

### SECTION 6: THERAPIST DASHBOARD (Phase 8) — 52 screens
```
6.1  TherapistDashboardPage.tsx
     Screen 170: Dashboard home — today's schedule, upcoming sessions, client alerts, revenue summary
     Screen 171: Dashboard — new client alert notification banner
     Screen 172: Dashboard — client negative mood alert (proactive AI notification)
     Screen 173: Dashboard — daily stats cards (sessions completed, revenue, new clients, avg rating)
     Screen 174: Dashboard empty state (new therapist, no clients yet)

6.2  ClientsPage.tsx
     Screen 175: All clients list (searchable, filterable by status: active/paused/completed)
     Screen 176: Client card — quick view (name, mood trend, next session, alerts)
     Screen 177: Clients — AI risk alerts panel (clients who need attention flagged red/yellow)

6.3  ClientDetailPage.tsx
     Screen 178: Client overview — profile, mood trend chart, session history, assigned tasks
     Screen 179: Client — healing journey timeline (milestones, progress)
     Screen 180: Client — session notes list (therapist's notes per session)
     Screen 181: Client — add/edit session notes modal (rich text + tags)
     Screen 182: Client — assigned tasks list (status: pending/in-progress/completed)
     Screen 183: Client — add task modal (title, description, due date, category)
     Screen 184: Client — astrologer report view (predictions received before sessions)
     Screen 185: Client — AI behavior analysis (patterns, risk indicators, engagement level)
     Screen 186: Client — personality report (AI-generated deep analysis)
     Screen 187: Client — communication log (messages exchanged)

6.4  SessionsPage.tsx (therapist)
     Screen 188: Today's sessions list (time, client, session type, join button)
     Screen 189: Upcoming sessions list (this week, next week views)
     Screen 190: Past sessions list with filter by client, date range
     Screen 191: Session calendar view (FullCalendar — day/week/month)

6.5  SessionDetailPage.tsx (therapist)
     Screen 192: Pre-session view — client summary, astrologer report, previous notes, preparation
     Screen 193: In-session view — video call + client notes sidebar + timer
     Screen 194: Post-session checklist — key points noted, tasks to assign, follow-up date
     Screen 195: Post-session — add/edit session summary form
     Screen 196: Post-session — assign healing tasks to client form
     Screen 197: Post-session — rate session quality (self-assessment)
     Screen 198: Post-session — confirm/deny astrologer prediction accuracy
     Screen 199: Session recording playback with transcription view

6.6  RevenuePage.tsx
     Screen 200: Revenue overview — total earnings, this month, pending payout
     Screen 201: Revenue chart — daily/weekly/monthly earnings graph
     Screen 202: Revenue — sessions breakdown table (each session, amount, date)
     Screen 203: Revenue — payout history (bank transfers, dates, amounts)
     Screen 204: Revenue — request early payout button + modal

6.7  ReviewsPage.tsx
     Screen 205: All reviews list (star rating, comment, client name, date)
     Screen 206: Reviews — average rating card + rating distribution bar chart
     Screen 207: Reviews — respond to review modal
     Screen 208: Reviews — flagged/inappropriate review report modal

6.8  ProfilePage.tsx (therapist)
     Screen 209: Therapist public profile preview (how clients see it)
     Screen 210: Edit profile form — bio, specializations, qualifications, photo, availability
     Screen 211: Availability calendar editor (set weekly recurring slots + block dates)
     Screen 212: Qualifications & certifications upload section
     Screen 213: Languages & session preferences settings
```

### SECTION 7: ASTROLOGER DASHBOARD (Phase 7) — 42 screens
```
7.1  AstrologerDashboardPage.tsx
     Screen 214: Dashboard home — pending kundali analyses, upcoming sessions, brownie points card
     Screen 215: Dashboard — new analysis request notification
     Screen 216: Dashboard — brownie points & tier progress bar (bronze→silver→gold→platinum→diamond)
     Screen 217: Dashboard — daily/weekly stats (analyses done, accuracy rate, revenue)
     Screen 218: Dashboard empty state (new astrologer, no assignments yet)

7.2  AnalysesPage.tsx
     Screen 219: Pending analyses queue (client name, session date, priority, deadline timer)
     Screen 220: Analysis — kundali chart view (loaded from Parasara Light format, Rashi, Navamsa)
     Screen 221: Analysis — dasha/sub-dasha timeline viewer (interactive expandable tree)
     Screen 222: Analysis — AI-generated analysis summary (key planetary positions, transits, predictions)
     Screen 223: Analysis — write predictions form (text areas per category: mental health, relationship, career, health, timeline)
     Screen 224: Analysis — prediction poll view (other astrologers' predictions, vote on most likely)
     Screen 225: Analysis — submit analysis confirmation
     Screen 226: Analysis — completed analyses history list

7.3  ClientsPage.tsx (astrologer)
     Screen 227: All clients list (direct booking clients + therapy pipeline clients)
     Screen 228: Client birth chart summary card

7.4  ClientDetailPage.tsx (astrologer)
     Screen 229: Client full kundali view (all divisional charts: D1-D60)
     Screen 230: Client dasha periods table (current dasha highlighted)
     Screen 231: Client transit overlay (current planetary positions over natal)
     Screen 232: Client prediction history (past predictions + accuracy results)
     Screen 233: Client communication thread (direct messages)
     Screen 234: Client — schedule direct session modal

7.5  SessionsPage.tsx (astrologer)
     Screen 235: Upcoming astrology sessions list
     Screen 236: Past sessions list
     Screen 237: Session calendar view

7.6  PredictionsPage.tsx
     Screen 238: All predictions made — list with accuracy status (pending/verified accurate/partially accurate/inaccurate)
     Screen 239: Prediction accuracy dashboard — overall rate, category breakdown
     Screen 240: Prediction detail — what was predicted vs what happened
     Screen 241: Brownie points ledger (earned/spent history)

7.7  ProfilePage.tsx (astrologer)
     Screen 242: Astrologer public profile preview
     Screen 243: Edit profile — bio, specializations, systems practiced (Vedic, KP, Nadi)
     Screen 244: Availability calendar editor
     Screen 245: Qualifications upload
```

### SECTION 8: ADMIN / HEAD OFFICE DASHBOARD (Phase 14, 20) — 156 screens
```
8.1  HeadOfficePage.tsx — Phase 14
     Screen 246: Head office overview — key metrics cards (total users, revenue, sessions, active therapists)
     Screen 247: Real-time activity feed (live: new signups, sessions started, payments, alerts)
     Screen 248: Revenue chart (daily/weekly/monthly/yearly + year-over-year comparison)
     Screen 249: Platform health dashboard (server CPU, memory, API response times, error rates)
     Screen 250: Critical alerts panel (emergency flagging, fraud alerts, system issues)
     Screen 251: Pending actions queue (items needing admin approval/action)
     Screen 252: Department performance summary cards (therapy, astrology, courses, shop, community)

8.2  AdminUsersPage.tsx — Phase 14
     Screen 253: All users table (name, email, role, status, joined date, last active) — paginated, searchable
     Screen 254: User detail drawer (profile, sessions, payments, complaints, AI analysis)
     Screen 255: User — edit role/status/ban modal
     Screen 256: User — view full activity log
     Screen 257: User — data export for this user
     Screen 258: User — flag/unflag for review
     Screen 259: Bulk user actions (export CSV, send notification, change status)
     Screen 260: User filters panel (role, status, date range, location, membership tier)

8.3  AdminTherapistsPage.tsx — Phase 14
     Screen 261: All therapists table (name, rating, sessions, revenue, status, alerts)
     Screen 262: Therapist detail — full profile, client list, revenue, reviews, AI quality score
     Screen 263: Therapist — approve/suspend/terminate modal (with reason)
     Screen 264: Therapist — credential verification view (uploaded docs, verification status)
     Screen 265: Therapist — AI monitoring report (conduct score, compliance, fraud indicators)
     Screen 266: Therapist — revenue/payout history
     Screen 267: Therapist — assign/remove clients modal
     Screen 268: Pending therapist applications table (onboarding pipeline)

8.4  AdminAstrologersPage.tsx — Phase 14
     Screen 269: All astrologers table (name, tier, accuracy rate, brownie points, revenue)
     Screen 270: Astrologer detail — profile, predictions accuracy, tier, revenue
     Screen 271: Astrologer — verify credentials view
     Screen 272: Astrologer — brownie points adjustment modal (manual override)
     Screen 273: Pending astrologer applications table

8.5  AdminSessionsPage.tsx — Phase 14
     Screen 274: All sessions table (date, client, therapist, type, status, duration, recording)
     Screen 275: Session detail — recording playback, transcription, AI analysis, flagged moments
     Screen 276: Session — AI monitoring report (client emotional state, therapist conduct)
     Screen 277: Flagged sessions list (sessions with AI alerts or client complaints)
     Screen 278: Session search with advanced filters

8.6  AdminTherapyPage.tsx — Phase 14
     Screen 279: Therapy overview stats — total sessions, avg rating, completion rate, cancellation rate
     Screen 280: Matching algorithm performance — match scores, client satisfaction post-match
     Screen 281: Therapy specialization demand chart (which issues are most common)
     Screen 282: Waitlist management view
     Screen 283: Therapy pricing management

8.7  AdminEventsPage.tsx — Phase 14
     Screen 284: All events table (name, date, registrations, revenue, status)
     Screen 285: Event detail — registrations list, check-ins, feedback summary
     Screen 286: Create/edit event form
     Screen 287: Event analytics — attendance rate, feedback scores, revenue
     Screen 288: Pending event proposals for approval

8.8  AdminMembershipsPage.tsx — Phase 14
     Screen 289: Membership overview — active subscribers per tier, MRR, churn rate
     Screen 290: Members table (name, tier, start date, renewal date, status)
     Screen 291: Edit membership tiers/pricing modal
     Screen 292: Membership analytics — conversion funnel, upgrade/downgrade trends
     Screen 293: Churn risk list (members likely to cancel — AI predicted)

8.9  AdminNGOPage.tsx — Phase 14
     Screen 294: NGO partners list (name, sessions sponsored, budget remaining)
     Screen 295: NGO detail — beneficiaries, sessions used, impact reports
     Screen 296: Add new NGO partner form
     Screen 297: NGO impact report view
     Screen 298: Approve/reject NGO-sponsored beneficiary access

8.10 AdminCommunityPage.tsx — Phase 14
     Screen 299: Community moderation queue (flagged posts, reported content)
     Screen 300: Flagged content detail — original post, reports, AI analysis, action buttons
     Screen 301: Community stats — active users, posts/day, reports, moderation actions
     Screen 302: Banned users list + unban modal
     Screen 303: Community guidelines editor
     Screen 304: Create announcement post to community

8.11 AdminBlogPage.tsx — Phase 14
     Screen 305: All blogs table (title, author, status: draft/pending/published, views)
     Screen 306: Blog review — preview + approve/reject/request changes
     Screen 307: Blog analytics — views, engagement, SEO performance per post
     Screen 308: Create/edit blog post (admin can also post)
     Screen 309: Blog category & tag management

8.12 AdminCoursesPage.tsx — Phase 14
     Screen 310: All courses table (title, creator, status, enrollments, revenue, rating)
     Screen 311: Course review — preview content + approve/reject
     Screen 312: Course analytics — enrollments, completion rate, revenue
     Screen 313: Creator management — approved creators, pending applications
     Screen 314: Course category management

8.13 AdminShopPage.tsx — Phase 14
     Screen 315: Shop overview — total products, orders, revenue, inventory alerts
     Screen 316: Products table (name, price, stock, status)
     Screen 317: Add/edit product form (images, description, variants, pricing, inventory)
     Screen 318: Orders table (order ID, customer, amount, status, date)
     Screen 319: Order detail — items, shipping, tracking, customer communication
     Screen 320: Inventory alerts — low stock, out of stock items
     Screen 321: Returns/refunds management table
     Screen 322: Shipping configuration (Shiprocket settings, zones, rates)

8.14 AdminAIMonitoringPage.tsx — Phase 14
     Screen 323: AI monitoring overview — total sessions monitored, alerts triggered, false positive rate
     Screen 324: Active session monitoring list (live sessions with real-time sentiment indicators)
     Screen 325: Flagged moments review — play flagged recording segment, AI analysis, action needed
     Screen 326: Therapist conduct scorecards — AI scores for all therapists
     Screen 327: Crisis intervention log — all emergency flags, escalation status, resolution
     Screen 328: AI model performance metrics — accuracy, latency, cost per analysis

8.15 AdminFraudAlertsPage.tsx — Phase 14
     Screen 329: Fraud alerts queue (flagged therapists, suspicious payments, fake reviews)
     Screen 330: Fraud case detail — evidence, AI analysis, previous flags, action options
     Screen 331: Fraud patterns dashboard — common fraud types, trend chart
     Screen 332: Resolved fraud cases history

8.16 AdminPaymentsPage.tsx — Phase 14
     Screen 333: Payment overview — total revenue, gateway split (Razorpay/Stripe), pending payouts
     Screen 334: All transactions table (date, user, amount, currency, type, status, gateway)
     Screen 335: Failed/disputed transactions — retry, refund, or escalate
     Screen 336: Payout management — pending therapist/astrologer/creator payouts, approve batch
     Screen 337: Revenue breakdown by source (therapy, courses, shop, memberships, events)
     Screen 338: Currency-wise revenue chart
     Screen 339: Refund requests management

8.17 AdminComplaintsPage.tsx — Phase 14
     Screen 340: All complaints table (user, category, status, priority, date)
     Screen 341: Complaint detail — conversation thread, assign to team member, resolve
     Screen 342: Complaint categories analytics — most common issues chart
     Screen 343: SLA tracking — response times, resolution times, overdue complaints

8.18 AdminCorporatePage.tsx — Phase 14
     Screen 344: Corporate clients table (company name, employees, plan, revenue)
     Screen 345: Corporate detail — employee engagement, session usage, feedback
     Screen 346: Add new corporate client form
     Screen 347: Corporate plan configuration modal

8.19 AdminInstitutionsPage.tsx — Phase 14
     Screen 348: Schools/colleges table (institution name, students, plan, integration status)
     Screen 349: Institution detail — student engagement, counselor sessions, reports
     Screen 350: Add new institution form
     Screen 351: Institution plan configuration

8.20 AdminIntegrationsPage.tsx — Phase 15
     Screen 352: All integrations list (SAP, Slack, Teams, Google Workspace, custom DB)
     Screen 353: Integration detail — connection status, sync logs, field mapping
     Screen 354: Configure new integration wizard (4 steps: select type → auth → field mapping → test)
     Screen 355: Integration sync history & error logs
     Screen 356: Webhook configuration panel

8.21 AdminNotificationsPage.tsx — Phase 17
     Screen 357: Notification broadcast form (target: all users / segment / individual)
     Screen 358: Notification templates list (create/edit templates)
     Screen 359: Notification delivery stats (sent, delivered, opened, clicked)
     Screen 360: Scheduled notifications queue

8.22 AdminSEOPage.tsx — Phase 21
     Screen 361: SEO dashboard — keyword rankings, organic traffic, PSEO page stats
     Screen 362: Tracked keywords table (keyword, current rank, trend, volume)
     Screen 363: PSEO pages list (auto-generated pages, their traffic, rankings)
     Screen 364: SEO audit results (issues to fix, priority, affected pages)
     Screen 365: GEO performance — AI search citations, brand mentions
     Screen 366: Competitor tracking dashboard

8.23 AdminPlatformHealthPage.tsx — Phase 14
     Screen 367: Server metrics dashboard (CPU, memory, disk, network — real-time charts)
     Screen 368: API endpoint performance table (endpoint, avg response time, error rate, p95)
     Screen 369: Database performance (query times, slow queries, connection pool)
     Screen 370: Error log viewer (searchable, filterable, stack traces)
     Screen 371: Deployment history (version, date, status, rollback option)
     Screen 372: Uptime monitor (current status, incident history, SLA %)

8.24 AdminAnalyticsPage.tsx — Phase 14
     Screen 373: User acquisition funnel (visit → signup → onboarding → first session → retention)
     Screen 374: Cohort analysis (retention by signup month)
     Screen 375: Feature usage heatmap (which features are most/least used)
     Screen 376: User behavior flow diagram (common paths through the app)
     Screen 377: A/B test results dashboard
     Screen 378: Custom report builder (select metrics, date range, segments → generate)

8.25 AdminAuditLogPage.tsx — Phase 14
     Screen 379: Activity log table (timestamp, user, action, resource, IP, details)
     Screen 380: Log filters panel (user, action type, date range, resource type)
     Screen 381: Export audit log (CSV/JSON)

8.26 Department Dashboards — Phase 20
     Screen 382: Therapy Department — KPIs, targets vs actuals, team list, action items
     Screen 383: Astrology Department — KPIs, accuracy rates, brownie points leaderboard
     Screen 384: Content Department — blog/course production, pending approvals, engagement
     Screen 385: Marketing Department — campaign performance, ad spend, SEO rank changes
     Screen 386: Sales Department — leads, conversions, revenue pipeline, corporate deals
     Screen 387: Customer Support — ticket volume, response times, satisfaction scores
     Screen 388: Operations Department — platform health, incidents, deployments, costs
     Screen 389: Department — target setting modal (KPI, target value, deadline, assigned to)
     Screen 390: Department — team performance chart (individual contributions)
     Screen 391: Department — weekly report auto-generated view
```

### SECTION 9: EMPLOYEE DASHBOARD (Phase 20) — 18 screens
```
9.1  EmployeeDashboardPage.tsx
     Screen 392: Employee home — my targets, tasks, performance score, announcements
     Screen 393: Employee — daily check-in (mood, blockers, plan for today)
     Screen 394: Employee — performance score card (overall + per KPI breakdown)

9.2  TargetsPage.tsx
     Screen 395: My targets list (KPI, current value, target, deadline, progress bar)
     Screen 396: Target detail — daily progress chart, actions taken log
     Screen 397: Historical targets — past quarters/months performance

9.3  TasksPage.tsx
     Screen 398: Task board — kanban view (to-do, in-progress, done) — drag & drop
     Screen 399: Task detail modal (description, assignee, due date, comments, attachments)
     Screen 400: Create/edit task modal

9.4  TeamPage.tsx
     Screen 401: Team members list (name, role, performance, online status)
     Screen 402: Team — member profile view
     Screen 403: Team — leave calendar (who's on leave when)

9.5  Employee Training
     Screen 404: Training modules assigned to me (progress, score, status)
     Screen 405: Training module — video lesson + quiz
     Screen 406: Training — certificate earned screen

9.6  Employee Profile
     Screen 407: My employment profile (designation, department, joining date, reporting to)
     Screen 408: My payslips list (month, amount, download)
     Screen 409: My leave balance & apply leave form
```

### SECTION 10: CORPORATE DASHBOARD (Phase 15) — 20 screens
```
10.1 CorporateDashboardPage.tsx
     Screen 410: Corporate home — employee wellness score, active sessions, program utilization
     Screen 411: Corporate — wellness trend chart (monthly aggregate mood of all employees)
     Screen 412: Corporate — ROI report card (absenteeism reduction, productivity gains)
     Screen 413: Corporate empty state (new corporate account, setup wizard)

10.2 EmployeesPage.tsx (corporate)
     Screen 414: Employee list (name, department, wellness score, sessions attended, status)
     Screen 415: Employee detail — session summary (anonymized), wellness trend, course completions
     Screen 416: Employee — invite new employees (bulk CSV upload or individual email invite)
     Screen 417: Employee — department-wise breakdown chart

10.3 SessionsPage.tsx (corporate)
     Screen 418: Corporate sessions overview — sessions used vs allocated, by department
     Screen 419: Session utilization chart (daily/weekly/monthly)
     Screen 420: Upcoming group wellness sessions (workshops, webinars)
     Screen 421: Schedule group session form

10.4 ReportsPage.tsx (corporate)
     Screen 422: Monthly wellness report (auto-generated PDF preview)
     Screen 423: Department comparison chart (wellness scores, engagement, usage)
     Screen 424: Annual review report
     Screen 425: Custom report builder (select date range, departments, metrics)
     Screen 426: Download/share report modal
     Screen 427: Benchmark comparison (vs industry averages)
     Screen 428: Corporate billing & subscription management
     Screen 429: Corporate admin settings (HR contacts, escalation policies, branding)
```

### SECTION 11: VIDEO CALL (Phase 5) — 12 screens
```
11.1 VideoCallPage.tsx (standalone — no layout)
     Screen 430: Pre-join room — camera/mic preview, test, join button
     Screen 431: Video call — full screen, therapist + client video tiles
     Screen 432: Video call — screen share active view
     Screen 433: Video call — chat sidebar (text messaging during call)
     Screen 434: Video call — connection quality indicator + fallback to audio-only
     Screen 435: Video call — recording consent dialog (start of session)
     Screen 436: Video call — end session confirmation modal
     Screen 437: Video call — therapist notes panel (side panel during session)
     Screen 438: Video call — session timer display
     Screen 439: Video call — emergency end (connection lost reconnecting screen)
     Screen 440: Post-call — session summary screen (auto-redirect after call ends)
     Screen 441: Post-call — feedback survey (how was your experience?)
```

### SECTION 12: SHARED MODALS & OVERLAYS (used across multiple pages) — 25 screens
```
These are NOT separate pages — they are reusable components that appear as overlays:

12.1 Global Modals
     Screen 442: Notification center drawer (all notifications, mark read, clear all)
     Screen 443: Quick mood check-in modal (appears periodically)
     Screen 444: Session reminder popup (5 min before scheduled session)
     Screen 445: Emergency resources modal (crisis hotline numbers, immediate help)
     Screen 446: Cookie consent banner
     Screen 447: App update available modal
     Screen 448: Maintenance mode screen
     Screen 449: Network offline screen

12.2 Payment Modals
     Screen 450: Razorpay payment modal (Indian users)
     Screen 451: Stripe payment modal (international users)
     Screen 452: Payment processing loader
     Screen 453: Payment success confirmation
     Screen 454: Payment failed — retry or contact support

12.3 Confirmation Dialogs
     Screen 455: Generic confirm action dialog (delete, cancel, remove)
     Screen 456: Danger zone confirm (red themed — irreversible actions)
     Screen 457: Success toast notification
     Screen 458: Error toast notification
     Screen 459: Info/warning toast notification

12.4 Media Modals
     Screen 460: Image viewer/lightbox (zoom, download)
     Screen 461: Video player modal
     Screen 462: Audio player modal (meditation, breathing guide)
     Screen 463: PDF viewer modal (reports, certificates, invoices)
     Screen 464: File upload modal (drag & drop, progress bar, file type validation)

12.5 Search
     Screen 465: Global search overlay (cmd+K — search everything: users, sessions, blogs, courses, products)
     Screen 466: Search results view (categorized: pages, content, users)
```

### SECTION 13: ERROR & EMPTY STATES (reusable across app) — 8 screens
```
     Screen 467: 404 Not Found page (animated illustration + search + home link)
     Screen 468: 403 Forbidden page (no access, contact admin)
     Screen 469: 500 Server Error page (something went wrong, auto-report sent)
     Screen 470: Session expired — redirect to login
     Screen 471: Under construction page (feature coming soon)
     Screen 472: Empty state — generic (illustration + message + CTA)
     Screen 473: Loading skeleton screens (used everywhere during data fetch)
     Screen 474: Offline mode — cached content view
```

### SECTION 14: MOBILE-RESPONSIVE VARIANTS — 36 additional screen states
```
Every major page has a mobile-specific layout variation:
     Screens 475-510: Mobile navigation (hamburger menu + bottom tab bar),
                       mobile dashboard (stacked cards instead of grid),
                       mobile video call (portrait mode),
                       mobile chat (full screen),
                       mobile shop (single column),
                       mobile calendar (day view default),
                       mobile settings (accordion sections),
                       mobile tables (card view instead of table rows),
                       mobile modals (full-screen bottom sheets),
                       mobile onboarding (swipe-able steps),
                       + 26 more mobile-specific states
```

---

### SCREEN COUNTS SUMMARY
```
┌───────────────────────────────────────┬────────┬─────────────────────┐
│ Section                               │ Screens│ Built in Phase      │
├───────────────────────────────────────┼────────┼─────────────────────┤
│ 1. Splash & Landing                  │      8 │ Phase 18            │
│ 2. Public Pages                      │     32 │ Phase 9,11,12,18,19,│
│                                       │        │ 22,23               │
│ 3. Authentication                    │     12 │ Phase 1             │
│ 4. Onboarding                        │     14 │ Phase 2             │
│ 5. User Dashboard                    │     78 │ Phase 3,4,6,10,11,  │
│                                       │        │ 12,13,16,22,23      │
│ 6. Therapist Dashboard              │     52 │ Phase 8             │
│ 7. Astrologer Dashboard             │     42 │ Phase 7             │
│ 8. Admin / Head Office              │    156 │ Phase 14,20,21      │
│ 9. Employee Dashboard               │     18 │ Phase 20            │
│ 10. Corporate Dashboard             │     20 │ Phase 15            │
│ 11. Video Call                       │     12 │ Phase 5             │
│ 12. Shared Modals & Overlays        │     25 │ Phase 1,3,5,13,17   │
│ 13. Error & Empty States            │      8 │ Phase 1,3           │
│ 14. Mobile-Responsive Variants      │     36 │ All phases          │
├───────────────────────────────────────┼────────┼─────────────────────┤
│ TOTAL SCREENS                        │  ~ 510 │                     │
└───────────────────────────────────────┴────────┴─────────────────────┘
```

---

### PHASE-WISE SCREEN BUILD ORDER (Kab Konsi Screen Build Karni Hai)

Within each phase, build screens in THIS exact order:

#### Phase 1 — Authentication (12 screens)
```
Build order:
1. Screen 41: Login form
2. Screen 42: Login SSO buttons
3. Screen 43: Login error state
4. Screen 46: Signup Step 1
5. Screen 47: Signup Step 2
6. Screen 48: Email verification pending
7. Screen 49: Email verified success
8. Screen 50: Signup error state
9. Screen 51: Forgot password email form
10. Screen 52: Check your email confirmation
11. Screen 53: Reset password form
12. Screen 54: Password reset success
13. Screen 44: 2FA OTP entry (add after basic auth works)
14. Screen 45: Login success redirect animation (add last — polish)

Shared components to build alongside:
- Screen 457: Success toast
- Screen 458: Error toast
- Screen 459: Info/warning toast
- Screen 470: Session expired redirect
- Screen 467: 404 page
- Screen 468: 403 page
- Screen 469: 500 page
```

#### Phase 2 — Onboarding (14 screens)
```
Build order:
1. Screen 67: Progress bar component (used on all steps)
2. Screen 55: Step 1 — Welcome
3. Screen 56: Step 2 — Name
4. Screen 57: Step 3 — Birth date
5. Screen 58: Step 4 — Contact
6. Screen 59: Step 5 — Mood
7. Screen 60: Step 6 — Struggles
8. Screen 61: Step 7 — Goals
9. Screen 62: Step 8 — Therapy history
10. Screen 63: Step 9 — Preferences
11. Screen 64: Step 10 — Interests
12. Screen 65: Consent
13. Screen 66: Onboarding complete animation
14. Screen 68: Save & continue later modal
```

#### Phase 3 — User Dashboard Shell (20 screens)
```
Build order:
1. Screen 69: Dashboard home (with placeholder widgets)
2. Screen 70: Dashboard empty state
3. Screen 71: Quick actions bar
4. Screen 147: Profile settings
5. Screen 148: Password change
6. Screen 149: Notification preferences
7. Screen 150: Privacy settings
8. Screen 151: Language & currency
9. Screen 152: Theme preference
10. Screen 153: Connected accounts
11. Screen 154: Delete account flow
12. Screen 155: Data export
13. Screen 156: Submit complaint form
14. Screen 157: Complaints list
15. Screen 158: Complaint detail
16. Screen 143: Healing journey timeline
17. Screen 168: User profile view
18. Screen 169: Edit profile
19. Screen 442: Notification center drawer
20. Screen 465: Global search overlay
```

#### Phase 4 — Therapy Booking (18 screens)
```
Build order:
1. Screen 75: Select session type
2. Screen 77: Browse therapists grid
3. Screen 78: Therapist profile modal
4. Screen 76: AI-matched recommendations
5. Screen 79: Pick date & time slot
6. Screen 80: Session confirmation
7. Screen 81: Payment screen
8. Screen 82: Booking confirmed
9. Screen 83: Upcoming sessions list
10. Screen 84: Past sessions list
11. Screen 85: Session empty state
12. Screen 86: Cancel session modal
13. Screen 87: Reschedule modal
14. Screen 88: Pre-session view
15. Screen 89: Post-session view (recordings + transcript)
16. Screen 90: Rate therapist modal
17. Screen 91: Personality report view
18. Screen 92: Astrologer pre-session report
```

#### Phase 5 — Video Calling (12 screens)
```
Build order:
1. Screen 430: Pre-join room (camera/mic test)
2. Screen 435: Recording consent dialog
3. Screen 431: Video call main view
4. Screen 438: Session timer
5. Screen 433: Chat sidebar
6. Screen 437: Therapist notes panel
7. Screen 432: Screen share view
8. Screen 434: Connection quality indicator
9. Screen 439: Connection lost/reconnecting
10. Screen 436: End session confirmation
11. Screen 440: Post-call summary
12. Screen 441: Post-call feedback survey
```

#### Phase 6 — AI Assistant (5 screens)
```
Build order:
1. Screen 93: AI chat interface
2. Screen 97: Empty state (first time intro)
3. Screen 96: Session history list
4. Screen 94: Voice mode
5. Screen 95: Crisis detection alert + Screen 445 emergency resources
```

#### Phase 7 — Astrologer System (32 screens)
```
Build order:
1. Screen 214: Dashboard home
2. Screen 218: Empty state
3. Screen 219: Pending analyses queue
4. Screen 220: Kundali chart view
5. Screen 221: Dasha/sub-dasha viewer
6. Screen 222: AI analysis summary
7. Screen 223: Write predictions form
8. Screen 225: Submit confirmation
9. Screen 226: Completed analyses history
10. Screen 224: Prediction poll
11. Screen 227: Clients list
12. Screen 229: Client full kundali
13. Screen 230: Client dasha periods
14. Screen 231: Transit overlay
15. Screen 232: Prediction history
16. Screen 233: Client messages
17. Screen 234: Schedule session modal
18. Screen 228: Client birth chart card
19. Screen 235: Upcoming sessions
20. Screen 236: Past sessions
21. Screen 237: Session calendar
22. Screen 238: All predictions list
23. Screen 239: Accuracy dashboard
24. Screen 240: Prediction detail
25. Screen 241: Brownie points ledger
26. Screen 215: New analysis request notification
27. Screen 216: Brownie points progress bar
28. Screen 217: Daily/weekly stats
29. Screen 242: Public profile preview
30. Screen 243: Edit profile
31. Screen 244: Availability calendar
32. Screen 245: Qualifications upload
```

#### Phase 8 — Therapist Dashboard (44 screens)
```
Build order:
1. Screen 170: Dashboard home
2. Screen 174: Empty state
3. Screen 175: Clients list
4. Screen 178: Client overview
5. Screen 179: Client healing journey
6. Screen 180: Session notes list
7. Screen 181: Add/edit notes modal
8. Screen 182: Assigned tasks list
9. Screen 183: Add task modal
10. Screen 184: Astrologer report view
11. Screen 185: AI behavior analysis
12. Screen 186: Personality report
13. Screen 187: Communication log
14. Screen 176: Client card quick view
15. Screen 177: AI risk alerts panel
16. Screen 188: Today's sessions
17. Screen 189: Upcoming sessions
18. Screen 190: Past sessions
19. Screen 191: Session calendar
20. Screen 192: Pre-session view
21. Screen 193: In-session view
22. Screen 194: Post-session checklist
23. Screen 195: Post-session summary form
24. Screen 196: Assign healing tasks form
25. Screen 197: Session self-assessment
26. Screen 198: Confirm astrologer accuracy
27. Screen 199: Recording playback
28. Screen 200: Revenue overview
29. Screen 201: Revenue chart
30. Screen 202: Sessions breakdown table
31. Screen 203: Payout history
32. Screen 204: Request early payout
33. Screen 205: All reviews list
34. Screen 206: Rating distribution chart
35. Screen 207: Respond to review
36. Screen 208: Report review
37. Screen 209: Public profile preview
38. Screen 210: Edit profile form
39. Screen 211: Availability calendar editor
40. Screen 212: Qualifications upload
41. Screen 213: Language & session preferences
42. Screen 171: New client alert banner
43. Screen 172: Client negative mood alert
44. Screen 173: Daily stats cards
```

#### Phase 9 — Blog/SEO (8 screens)
```
Build order:
1. Screen 21: Blog grid view
2. Screen 22: Blog list view
3. Screen 23: Category results
4. Screen 24: Tag results
5. Screen 25: Blog post reading view
6. Screen 26: Comments section
7. Screen 27: Share dialog
8. Screen 308: Admin blog post editor (for Phase 14 reuse)
```

#### Phase 10 — Soul Circle Community (11 screens)
```
Build order:
1. Screen 35: Public preview page
2. Screen 123: Feed view
3. Screen 124: Create post composer
4. Screen 125: Post detail + comments
5. Screen 130: Community guidelines modal
6. Screen 126: Create circle/group modal
7. Screen 127: Circle detail
8. Screen 128: My circles list
9. Screen 129: Community search
10. Screen 131: Report content modal
11. Screen 132: User profile preview
12. Screen 133: Empty state
```

#### Phase 11 — Courses (7 screens)
```
Build order:
1. Screen 28: Public course catalog
2. Screen 29: Course detail page
3. Screen 30: Course preview modal
4. Screen 117: My enrolled courses
5. Screen 118: Course video player
6. Screen 119: Quiz/exercise screen
7. Screen 120: Certificate earned
8. Screen 121: Lesson notes
9. Screen 122: Empty state
```

#### Phase 12 — Soul Shop (11 screens)
```
Build order:
1. Screen 31: Public shop grid
2. Screen 32: Product detail page
3. Screen 33: Image zoom modal
4. Screen 34: Review submission modal
5. Screen 134: Dashboard shop with wishlist
6. Screen 135: Cart drawer
7. Screen 136: Checkout — shipping
8. Screen 137: Checkout — payment
9. Screen 138: Order placed success
10. Screen 139: My orders list
11. Screen 140: Order detail
12. Screen 141: Return request
13. Screen 142: Wishlist page
```

#### Phase 13 — Payments (5 screens)
```
Build order:
1. Screen 450: Razorpay modal
2. Screen 451: Stripe modal
3. Screen 452: Processing loader
4. Screen 453: Payment success
5. Screen 454: Payment failed
6. Screen 159: Payment history table
7. Screen 160: Invoice detail
8. Screen 161: Receipt download
```

#### Phase 14 — Admin Dashboard (110+ screens)
```
Build order (grouped by sub-section, build one sub-section at a time):

Group A — Head Office Core (7 screens): 246-252
Group B — Users Management (8 screens): 253-260
Group C — Therapists Management (8 screens): 261-268
Group D — Astrologers Management (5 screens): 269-273
Group E — Sessions & Therapy (9 screens): 274-283
Group F — Events (5 screens): 284-288
Group G — Memberships (5 screens): 289-293
Group H — NGO (5 screens): 294-298
Group I — Community Moderation (6 screens): 299-304
Group J — Blog Management (5 screens): 305-309
Group K — Courses Management (5 screens): 310-314
Group L — Shop Management (8 screens): 315-322
Group M — AI Monitoring (6 screens): 323-328
Group N — Fraud Alerts (4 screens): 329-332
Group O — Payments (7 screens): 333-339
Group P — Complaints (4 screens): 340-343
Group Q — Corporate (4 screens): 344-347
Group R — Institutions (4 screens): 348-351
Group S — Analytics (6 screens): 373-378
Group T — Audit Log (3 screens): 379-381
```

#### Phase 15 — Corporate (11 screens)
```
Build order: 410-429 (20 screens, build in sub-section order)
```

#### Phase 16 — Health Tools (20 screens)
```
Build order: 98-116 (19 screens, build by tool: mood → meditation → breathing → journal)
```

#### Phase 17 — Notifications (4 screens)
```
Build order: 357-360 + Screen 443 (quick mood), Screen 444 (session reminder)
```

#### Phase 18 — Landing Animations (8 screens)
```
Build order: Screens 1-8 (splash + landing page sections)
```

#### Phase 19 — About/Careers (12 screens)
```
Build order: Screens 9-20
```

#### Phase 20 — Department Dashboards (18 screens)
```
Build order: Screens 382-409 (departments + employee dashboard)
```

#### Phase 21 — SEO (6 screens)
```
Build order: Screens 361-366
```

#### Phase 22 — Events (6 screens)
```
Build order: Screens 36-39 + 162-163
```

#### Phase 23 — Memberships (6 screens)
```
Build order: Screens 40 + 164-167
```

#### Phase 24 — NGO (already covered in admin, Phase 14)

#### Phase 25 — In-Session AI Monitoring (no new screens — backend + AI processing only)

---

## Route Structure

```
PUBLIC PAGES:
/                     → Splash Screen (animated intro)
/home                 → Landing Page (with 3D animations)
/about                → About Us (team, mission, story)
/careers              → Careers / We're Hiring
/careers/:id          → Job Detail + Apply
/contact              → Contact Us
/blog                 → Blog listing (SEO optimized)
/blog/:slug           → Blog post (SEO optimized)
/courses              → Course catalog
/courses/:id          → Course detail
/shop                 → Soul Shop (browse products)
/shop/:id             → Product detail
/community            → Soul Circle (public preview)

AUTH:
/login                → Login
/signup               → Sign Up
/forgot-password      → Forgot Password
/reset-password       → Reset Password

ONBOARDING:
/onboarding           → 10-step onboarding (after signup)

USER DASHBOARD:
/dashboard            → User Dashboard (overview)
/dashboard/sessions   → My therapy sessions
/dashboard/sessions/:id → Session detail (recording, tasks, report)
/dashboard/book       → Book a session (therapist matching)
/dashboard/health     → Health tools overview
/dashboard/meditate   → Meditation space
/dashboard/journal    → Journal entries
/dashboard/mood       → Mood tracker
/dashboard/breathing  → Breathing exercises
/dashboard/courses    → My enrolled courses
/dashboard/community  → Soul Circle (logged-in)
/dashboard/shop       → Soul Shop (with cart)
/dashboard/ai         → AI Assistant (text + voice)
/dashboard/reports    → My personality & astrology reports
/dashboard/settings   → Account settings
/dashboard/complaints → Submit / track complaints
/dashboard/payments   → Payment history
/dashboard/events     → My registered events
/dashboard/membership → My membership plan + manage
/profile              → User profile page (shared by all roles)

THERAPIST DASHBOARD:
/therapist            → Therapist Dashboard (overview + alerts)
/therapist/clients    → Client management
/therapist/clients/:id → Client detail (full history, mood, tasks)
/therapist/sessions   → Session calendar
/therapist/sessions/:id → Session detail (transcription, tasks, report)
/therapist/revenue    → Revenue & earnings
/therapist/reviews    → Client reviews
/therapist/profile    → Therapist profile

ASTROLOGER DASHBOARD:
/astrologer           → Astrologer Dashboard (overview)
/astrologer/analyses  → Pending pre-therapy analyses
/astrologer/clients   → Client charts (kundali viewer)
/astrologer/clients/:id → Client kundali detail
/astrologer/sessions  → Direct consultation bookings
/astrologer/predictions → Prediction accuracy tracking
/astrologer/profile   → Astrologer profile

ADMIN / HEAD OFFICE:
/admin                → Admin Dashboard (all KPIs)
/admin/head-office    → CEO / Head Office — EVERYTHING visible from here
/admin/analytics      → Platform-wide analytics, user behavior, retention
/admin/users          → User management (search, filter, suspend, role change)
/admin/therapists     → Therapist management + verification + quality scores
/admin/astrologers    → Astrologer management + accuracy scores
/admin/revenue        → Revenue reports (by source, period, export)
/admin/complaints     → Complaint queue + assignment + resolution
/admin/emergency      → Emergency flags + escalation workflow
/admin/fraud-alerts   → Therapist fraud indicators + compliance violations
/admin/therapist-quality → Per-therapist quality scores + session analysis
/admin/ai-monitoring  → AI assistant usage, flagged conversations, patterns
/admin/session-recordings → Access any session recording (audit-logged)
/admin/blog           → Blog moderation (approve/reject/delete)
/admin/courses        → Course moderation (approve/reject/delete)
/admin/community      → Community moderation (reported posts, bans, warnings)
/admin/shop           → Shop management (products, orders, inventory, analytics)
/admin/events         → Event management (create, registrations, revenue)
/admin/memberships    → Membership tiers, subscriber analytics, churn
/admin/ngo            → NGO partners, beneficiaries, impact reports
/admin/employees      → Employee tracker (all actions logged, performance)
/admin/departments    → All departments overview
/admin/departments/therapy     → Therapy dept KPIs
/admin/departments/astrology   → Astrology dept KPIs
/admin/departments/marketing   → Marketing dept KPIs
/admin/departments/sales       → Sales dept KPIs
/admin/departments/support     → Support dept KPIs
/admin/departments/content     → Content dept KPIs
/admin/departments/engineering → Engineering dept KPIs
/admin/hiring         → Manage job postings + applications
/admin/audit-log      → Full audit trail (every action, exportable)
/admin/settings       → Platform config, feature flags, maintenance mode
/admin/payments       → Payment transactions, refunds, failed payments
/admin/corporate      → Corporate account management
/admin/institutions   → School / college account management
/admin/integrations   → Third-party integration management (Slack, SAP, Teams)
/admin/notifications  → Notification management + broadcast
/admin/platform-health → API uptime, response times, storage, error rates
/admin/seo            → SEO dashboard (keyword rankings, PSEO pages, sitemap)

CORPORATE:
/corporate            → Corporate Dashboard
/corporate/employees  → Corporate employee wellness
/corporate/sessions   → Corporate session management
/corporate/reports    → Anonymized wellness reports

EMPLOYEE:
/employee             → Employee Dashboard (internal staff)
/employee/targets     → My targets & KPIs
/employee/tasks       → My assigned tasks
/employee/team        → My team

EVENTS:
/events               → Soul Events listing (workshops, retreats, etc.)
/events/:slug         → Event detail + registration

MEMBERSHIPS:
/memberships          → Membership tiers (public pricing page)

NGO:
/ngo                  → NGO partnerships page (public)

SEO (PROGRAMMATIC):
/therapist-for-:issue → e.g., /therapist-for-anxiety (auto-generated)
/meditation-for-:goal → e.g., /meditation-for-sleep
/:city-therapist      → e.g., /mumbai-therapist (location-based)
```

## Backend API Structure

```
/api/v1/health                → Health check

/api/v1/auth/register         → Sign up
/api/v1/auth/login            → Login
/api/v1/auth/refresh          → Refresh token
/api/v1/auth/logout           → Logout
/api/v1/auth/me               → Current user
/api/v1/auth/forgot-password  → Forgot password
/api/v1/auth/reset-password   → Reset password

/api/v1/users/onboarding      → Save onboarding data
/api/v1/users/profile         → Get/update profile
/api/v1/users/dashboard       → Dashboard stats
/api/v1/users/export-my-data  → Export all user data (DPDPA/GDPR/CCPA)
/api/v1/users/delete-account  → Delete account (30-day workflow)

/api/v1/therapy/request       → Request therapy (auto-match)
/api/v1/therapy/sessions      → List sessions
/api/v1/therapy/sessions/:id  → Session detail
/api/v1/therapy/sessions/:id/tasks → Session tasks
/api/v1/therapy/sessions/:id/recording → Session recording
/api/v1/therapy/sessions/:id/report → Personality report
/api/v1/therapy/sessions/:id/monitor/client → Client AI analysis
/api/v1/therapy/sessions/:id/monitor/therapist → Therapist quality + fraud analysis

/api/v1/therapists            → List/search therapists
/api/v1/therapists/:id        → Therapist profile
/api/v1/therapists/dashboard  → Therapist dashboard stats
/api/v1/therapists/clients    → Therapist's clients
/api/v1/therapists/clients/:id → Client detail (full history)
/api/v1/therapists/revenue    → Revenue data
/api/v1/therapists/reviews    → Client reviews
/api/v1/therapists/profile    → Therapist own profile (get/update)

/api/v1/astrology/charts      → Kundali charts
/api/v1/astrology/reports     → Pre-session reports
/api/v1/astrology/predictions → Predictions with voting
/api/v1/astrology/predictions/accuracy → Prediction accuracy tracking
/api/v1/astrology/sessions    → Direct consultations
/api/v1/astrology/dashboard   → Astrologer dashboard stats
/api/v1/astrology/clients     → Astrologer's clients
/api/v1/astrology/clients/:id → Client kundali detail
/api/v1/astrology/profile     → Astrologer own profile (get/update)
/api/v1/astrology/revenue     → Revenue + brownie points

/api/v1/ai/chat               → AI text chat (streaming)
/api/v1/ai/voice              → AI voice (audio in/out)
/api/v1/ai/emergency          → Emergency flag management
/api/v1/ai/patterns/:userId   → Behavior pattern analysis
/api/v1/ai/session-monitor/start → Start session monitoring
/api/v1/ai/session-monitor/frame → Process video frame
/api/v1/ai/session-monitor/audio → Process audio chunk
/api/v1/ai/session-monitor/:sessionId/client → Client analysis result
/api/v1/ai/session-monitor/:sessionId/therapist → Therapist analysis result

/api/v1/health-tools/mood     → Mood logs
/api/v1/health-tools/journal  → Journal entries
/api/v1/health-tools/meditation → Meditation sessions
/api/v1/health-tools/breathing → Breathing exercises

/api/v1/courses               → Course catalog
/api/v1/courses/:id           → Course detail
/api/v1/courses/:id/enroll    → Enroll in course
/api/v1/courses/:id/progress  → Track progress
/api/v1/courses/create        → Create course (creator)

/api/v1/community/feed        → Community feed
/api/v1/community/posts       → CRUD posts
/api/v1/community/comments    → CRUD comments
/api/v1/community/moderation  → Moderation queue

/api/v1/blog/posts            → Blog CRUD
/api/v1/blog/categories       → Categories
/api/v1/blog/seo              → SEO metadata + sitemap

/api/v1/shop/products         → Product catalog
/api/v1/shop/cart              → Cart management
/api/v1/shop/orders           → Order management
/api/v1/shop/reviews          → Product reviews

/api/v1/payments/create       → Create payment order
/api/v1/payments/verify       → Verify payment
/api/v1/payments/webhook      → Payment gateway webhook
/api/v1/payments/refund       → Process refund
/api/v1/payments/history      → Payment history
/api/v1/payments/subscriptions → Subscription management
/api/v1/payments/memberships/tiers → Membership tier listing
/api/v1/payments/memberships/subscribe → Subscribe to membership
/api/v1/payments/memberships/mine → Current membership

/api/v1/payments/payouts        → Payout history (therapist/astrologer)
/api/v1/payments/payouts/request → Request payout
/api/v1/payments/payouts/earnings → Earnings summary
/api/v1/payments/payouts/account → Payout bank account (get/set)
/api/v1/payments/currencies     → Supported currencies list
/api/v1/payments/currency-preference → Set user currency preference

/api/v1/events                → Event listing + creation
/api/v1/events/:slug          → Event detail
/api/v1/events/:id/register   → Register for event
/api/v1/events/:id/attendees  → Attendee list
/api/v1/events/:id/feedback   → Event feedback

/api/v1/notifications         → User notifications
/api/v1/notifications/preferences → Notification settings

/api/v1/admin/head-office     → CEO dashboard (aggregates ALL platform data)
/api/v1/admin/dashboard       → Admin-level KPIs
/api/v1/admin/platform-health → API uptime, response times, storage, errors
/api/v1/admin/analytics       → Platform-wide analytics + per-metric drilldown
/api/v1/admin/alerts          → Critical alerts (emergency, fraud, system errors)
/api/v1/admin/pending-actions → All items pending approval (blogs, courses, etc.)
/api/v1/admin/users           → User management (list, detail, suspend, role change)
/api/v1/admin/employees       → Employee tracker (list, detail, action history)
/api/v1/admin/departments     → Department stats + targets (CRUD)
/api/v1/admin/revenue         → Revenue reports (by source, period, breakdown)
/api/v1/admin/therapists      → Therapist management (list, verify, suspend)
/api/v1/admin/therapist-quality → Therapist quality scores (list + per-therapist)
/api/v1/admin/astrologers     → Astrologer management (list, verify, accuracy)
/api/v1/admin/sessions        → All sessions (list, detail, recording, monitor data)
/api/v1/admin/fraud-alerts    → Fraud indicators (list, detail, review)
/api/v1/admin/ai-monitoring   → AI usage, flagged conversations, behavior patterns
/api/v1/admin/complaints      → Complaint management (list, detail, assign)
/api/v1/admin/emergency       → Emergency flags (list, detail, escalate)
/api/v1/admin/blog            → Blog moderation (pending, all, approve, reject, delete)
/api/v1/admin/courses         → Course moderation (pending, all, approve, reject, delete)
/api/v1/admin/community       → Community moderation (reported, remove, ban, warn)
/api/v1/admin/events          → Event management (CRUD, registrations, analytics)
/api/v1/admin/memberships     → Membership management (tiers, subscribers, analytics)
/api/v1/admin/ngo             → NGO management (partners, beneficiaries, impact)
/api/v1/admin/shop            → Shop management (products, orders, inventory, analytics)
/api/v1/admin/payments        → Payment management (transactions, refunds)
/api/v1/admin/corporate       → Corporate account management
/api/v1/admin/institutions    → School/college account management
/api/v1/admin/integrations    → Third-party integration management (CRUD)
/api/v1/admin/actions          → Audit trail (action logs, exportable)
/api/v1/admin/hiring          → Hiring management (positions, applications)
/api/v1/admin/notifications   → Notification management + broadcast
/api/v1/admin/settings        → Platform settings (get, update)

/api/v1/corporate/accounts    → Corporate account management
/api/v1/corporate/employees   → Corporate employee management
/api/v1/corporate/reports     → Anonymized wellness reports
/api/v1/corporate/institutions → School/college accounts
/api/v1/corporate/integrations → Third-party integrations (Slack, SAP, etc.)

/api/v1/careers/positions     → Public job listings
/api/v1/careers/positions/:id/apply → Submit application

/api/v1/ngo/partners          → NGO partner listing + management
/api/v1/ngo/partners/:id/beneficiaries → Beneficiary management
/api/v1/ngo/partners/:id/impact → Impact reports
```
# Soul Yatri BUILD_PLAN.md - Comprehensive Gap Analysis

> **Generated on**: 2026-02-18
> **Document analyzed**: docs/BUILD_PLAN.md (9,226 lines)
> **Purpose**: Identify all missing, incomplete, or inconsistent specifications in the build plan
> **Estimated completeness**: 65% - Many phases lack critical implementation details

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Gaps (High Priority)](#critical-gaps-high-priority)
3. [Missing or Incomplete Phase Definitions](#missing-or-incomplete-phase-definitions)
4. [Inconsistencies Between Sections](#inconsistencies-between-sections)
5. [Missing Cross-References](#missing-cross-references)
6. [Incomplete Sections](#incomplete-sections)
7. [Missing Technical Details](#missing-technical-details)
8. [Missing Documentation](#missing-documentation)
9. [Missing Database/Schema Details](#missing-databaseschema-details)
10. [Missing Integration Details](#missing-integration-details)
11. [Missing Performance/Monitoring](#missing-performancemonitoring)
12. [Missing Security Details](#missing-security-details)
13. [Missing Deployment/DevOps](#missing-deploymentdevops)
14. [Missing Compliance/Legal](#missing-compliancelegal)
15. [Missing Testing Specifications](#missing-testing-specifications)
16. [Pagination & Search Inconsistencies](#pagination--search-inconsistencies)
17. [Missing Feature Specifications](#missing-feature-specifications)
18. [Recommendations](#recommendations)

---

## Executive Summary

The BUILD_PLAN.md file contains 9,226 lines covering 31 phases of development. While the document is well-structured and comprehensive in its scope, approximately **35% of critical implementation details are missing or incomplete**.

### Top 10 Most Critical Missing Specifications

1. **Phase 7 (Astrologer System)**: ~90% incomplete - missing Prisma models, APIs, and workflow
2. **Phase 10 (Soul Circle Community)**: ~85% incomplete - missing models, APIs, and algorithm
3. **Phase 22 (Events System)**: ~80% incomplete - minimal specification
4. **Payment Prisma Models**: Completely missing despite being core to Phase 13
5. **NGO Magic Link Flow**: Incomplete workflow specification
6. **Email Templates**: No HTML templates provided
7. **Search/Filtering Algorithms**: Missing across multiple phases
8. **API Field Mapping for Integrations**: Missing for Phase 15
9. **Community Feed Algorithm**: Missing specification
10. **Fraud Detection Confidence Scoring**: Missing implementation details

### Impact Assessment

- **MVP Launch Risk**: HIGH - Phase 7 (Astrologer) is in MVP scope but severely incomplete
- **Development Velocity**: Will slow down significantly when teams reach incomplete phases
- **Quality Risk**: Missing error codes and validation schemas may lead to poor error handling
- **Security Risk**: Missing encryption details and session management specs

---

## Critical Gaps (High Priority)

These gaps MUST be addressed before development begins on their respective phases, especially for MVP phases:

### 1. Phase 7 (Astrologer System) - CRITICAL - MVP BLOCKER

**Status**: Only ~60 lines of description for an extremely complex system

**Missing Components**:

#### Prisma Models (Completely Missing)
```typescript
// MISSING: All of these models need to be defined

model AstrologerProfile {
  // Fields needed:
  // - id, userId, bio, qualifications
  // - expertise areas, languages
  // - experience years, certificates
  // - availability schedule
  // - browniePoints, tier (bronze/silver/gold/platinum/diamond)
  // - predictionAccuracyRate, totalPredictions
  // - isActive, isVerified
  // - createdAt, updatedAt
}

model KundaliChart {
  // Fields needed:
  // - id, userId, birthDate, birthTime, birthPlace
  // - latitude, longitude, timezone
  // - chartData (JSON), planets, houses, aspects
  // - rashiChart, navamsaChart, dashaSystem
  // - createdAt, updatedAt
}

model AstrologyReport {
  // Fields needed:
  // - id, sessionId, astrologerId
  // - kundaliChartId, predictions[]
  // - overallAssessment, confidence
  // - submittedAt, therapistViewedAt
}

model AstrologyPrediction {
  // Fields needed:
  // - id, reportId, area (career/relationships/health/mental/spiritual)
  // - predictionText, severity (low/medium/high)
  // - estimatedDuration, confidence
  // - accuracyRating (null | accurate | partial | inaccurate)
  // - therapistFeedback, accuracyMarkedAt
}

model PredictionVote {
  // Fields needed (for multi-astrologer voting system):
  // - id, sessionId, astrologerId, prediction
  // - confidence, submittedAt
  // - finalConsensus (boolean)
}
```

#### API Endpoints (Completely Missing)
```
ASTROLOGER ENDPOINTS:
GET    /api/v1/astrology/dashboard                 → Get assigned sessions
GET    /api/v1/astrology/sessions                  → List all astrologer's sessions
GET    /api/v1/astrology/sessions/:id              → Get session detail
GET    /api/v1/astrology/sessions/:id/kundali      → Get client's kundali chart
POST   /api/v1/astrology/sessions/:id/predictions  → Submit predictions
PATCH  /api/v1/astrology/predictions/:id           → Update prediction
GET    /api/v1/astrology/accuracy-stats            → Get accuracy statistics
GET    /api/v1/astrology/brownie-points/history    → Get brownie points history

THERAPIST ENDPOINTS (to view predictions):
GET    /api/v1/therapy/sessions/:id/astro-report   → Get pre-session astrology report

ADMIN ENDPOINTS:
GET    /api/v1/admin/astrologers                   → List all astrologers
GET    /api/v1/admin/astrologers/:id               → Get astrologer detail
PATCH  /api/v1/admin/astrologers/:id/approve       → Approve astrologer
PATCH  /api/v1/admin/astrologers/:id/suspend       → Suspend astrologer
POST   /api/v1/admin/astrologers/:id/brownie-points → Manual brownie point adjustment
GET    /api/v1/admin/astrologers/:id/audit-log     → View accuracy history
```

#### Zod Schemas (Missing)
- AstrologyPredictionSchema
- KundaliChartSchema
- AstrologerProfileSchema
- PredictionVoteSchema

#### Error Codes (Missing)
```
ASTRO_001: Kundali chart generation failed
ASTRO_002: Invalid birth details provided
ASTRO_003: Astrologer not assigned to this session
ASTRO_004: Prediction already submitted
ASTRO_005: Cannot update prediction after therapist viewed
ASTRO_006: Astrologer account not verified
ASTRO_007: Insufficient brownie points for tier
ASTRO_008: Prediction voting period expired
ASTRO_009: Invalid prediction area
ASTRO_010: Chart calculation service unavailable
```

#### Missing Workflows
1. **Astrologer Assignment Workflow**
   - When: 3 hours before therapy session
   - How: Round-robin? Skill-based? Load-based?
   - What if no astrologer available?
   - Can astrologer decline assignment?

2. **Prediction Submission Workflow**
   - Can astrologer submit partial predictions?
   - What's the deadline (before session start)?
   - Can astrologer edit after submission?
   - What if astrologer doesn't submit by deadline?

3. **Accuracy Marking Workflow**
   - When does therapist mark accuracy?
   - Is it mandatory or optional?
   - What if therapist never marks accuracy?
   - Can astrologer appeal accuracy rating?

4. **Brownie Points System**
   - Accurate prediction: +3 points (specified)
   - Partially accurate: +1 point (specified)
   - Inaccurate: How many points deducted?
   - Missed deadline: Penalty?
   - Tier thresholds are defined, but what happens at tier transition?

5. **Voting System (Multi-Astrologer)**
   - How many astrologers vote per session?
   - How to calculate consensus?
   - What if votes conflict significantly?
   - Does AI prediction count as a vote?

#### Missing UI Components
- Kundali chart visualization component
- Prediction form component (with area selector, confidence slider)
- Accuracy feedback component (for therapist)
- Brownie points dashboard
- Tier badge display
- Prediction history timeline

#### Missing Test Scenarios
- Kundali calculation accuracy tests
- Prediction submission deadline enforcement
- Brownie point calculation tests
- Tier upgrade/downgrade tests
- Multi-astrologer voting consensus tests

---

### 2. Phase 10 (Soul Circle Community) - CRITICAL - POST-MVP

**Status**: Only ~45 lines of description

**Missing Components**:

#### Prisma Models (Completely Missing)
```typescript
model CommunityPost {
  // Fields needed:
  // - id, authorId, content, isAnonymous
  // - postType (text | image | poll | question)
  // - categoryId, tags[]
  // - likesCount, commentsCount, sharesCount
  // - isPinned, isFeatured
  // - moderationStatus (pending | approved | flagged | removed)
  // - removedReason, moderatedBy
  // - createdAt, updatedAt, deletedAt (soft delete)
}

model CommunityComment {
  // Fields needed:
  // - id, postId, authorId, content
  // - isAnonymous, replyToCommentId (nested comments)
  // - likesCount
  // - moderationStatus, removedReason
  // - createdAt, updatedAt, deletedAt
}

model CommunityLike {
  // Fields needed:
  // - id, userId, postId?, commentId?
  // - createdAt
}

model CommunityFollow {
  // Fields needed:
  // - id, followerId, followingId
  // - createdAt
}

model CommunityReport {
  // Fields needed:
  // - id, reporterId, postId?, commentId?
  // - reason (spam | harassment | inappropriate | self_harm | misinformation)
  // - description, status (pending | reviewed | dismissed | action_taken)
  // - reviewedBy, reviewedAt, action
  // - createdAt
}

model CommunityBlock {
  // Fields needed:
  // - id, blockerId, blockedId
  // - reason, createdAt
}

model UserReputation {
  // Fields needed:
  // - id, userId, reputationScore
  // - postsCount, helpfulPostsCount
  // - violationsCount, warningsCount
  // - level (new | regular | trusted | leader)
  // - updatedAt
}
```

#### API Endpoints (Completely Missing)
```
COMMUNITY POST ENDPOINTS:
GET    /api/v1/community/feed                      → Get personalized feed
GET    /api/v1/community/posts/:id                 → Get single post
POST   /api/v1/community/posts                     → Create post
PATCH  /api/v1/community/posts/:id                 → Edit post
DELETE /api/v1/community/posts/:id                 → Delete post
POST   /api/v1/community/posts/:id/like            → Like post
DELETE /api/v1/community/posts/:id/like            → Unlike post
POST   /api/v1/community/posts/:id/share           → Share post
POST   /api/v1/community/posts/:id/report          → Report post

COMMENT ENDPOINTS:
GET    /api/v1/community/posts/:id/comments        → Get post comments
POST   /api/v1/community/posts/:id/comments        → Add comment
PATCH  /api/v1/community/comments/:id              → Edit comment
DELETE /api/v1/community/comments/:id              → Delete comment
POST   /api/v1/community/comments/:id/like         → Like comment

FOLLOW ENDPOINTS:
POST   /api/v1/community/users/:id/follow          → Follow user
DELETE /api/v1/community/users/:id/follow          → Unfollow user
GET    /api/v1/community/users/:id/followers       → Get followers
GET    /api/v1/community/users/:id/following       → Get following

MODERATION ENDPOINTS:
GET    /api/v1/community/reports                   → Get reported content
PATCH  /api/v1/community/reports/:id/review        → Review report
POST   /api/v1/community/users/:id/block           → Block user
DELETE /api/v1/community/users/:id/block           → Unblock user
GET    /api/v1/community/moderation/queue          → Get moderation queue
```

#### Missing Feed Algorithm
- How is the feed sorted? (chronological? engagement-based? ML-based?)
- How to handle follow graph updates in real-time?
- Anonymous post ranking (how to prioritize without user identity?)
- Content diversity (prevent echo chambers)
- Spam filtering logic
- Banned user content hiding

#### Missing Content Moderation Workflow
1. Auto-moderation triggers (toxicity score threshold?)
2. User report escalation (how many reports trigger review?)
3. Admin review process (approve/remove/warn user)
4. User appeal process (completely missing)
5. Community guidelines enforcement rules
6. Strike system (3 warnings = ban?)

#### Missing Error Codes
```
COMMUNITY_001: Post not found
COMMUNITY_002: Cannot edit post after 5 minutes
COMMUNITY_003: Cannot delete post with comments
COMMUNITY_004: User is blocked
COMMUNITY_005: User is banned from community
COMMUNITY_006: Anonymous posting not allowed in this category
COMMUNITY_007: Post flagged for moderation
COMMUNITY_008: Comment contains prohibited content
COMMUNITY_009: Spam detection limit exceeded
COMMUNITY_010: Insufficient reputation for this action
```

---

### 3. Phase 13 (Payment Gateway) - CRITICAL - MVP BLOCKER

**Missing Prisma Models**:

```typescript
model PaymentTransaction {
  // Currently mentioned in spec but NOT defined in schema!
  // Fields needed:
  // - id, userId, amount, currency
  // - razorpayOrderId, razorpayPaymentId, razorpaySignature
  // - stripePaymentIntentId, stripeChargeId
  // - status (pending | completed | failed | refunded)
  // - type (therapy_session | astrology | course | shop | membership)
  // - relatedId (sessionId, courseId, etc.)
  // - refundId, refundAmount, refundReason
  // - metadata (JSON)
  // - createdAt, updatedAt
}

model CurrencyConfig {
  // For multi-currency support
  // Fields needed:
  // - id, code (INR, USD, EUR, etc.)
  // - symbol, exchangeRateToINR
  // - isActive, lastUpdatedAt
}

model PaymentWebhookEvent {
  // For tracking webhook events
  // Fields needed:
  // - id, provider (razorpay | stripe)
  // - eventType, eventId, payload (JSON)
  // - processedAt, status (pending | processed | failed)
  // - errorMessage, retryCount
  // - createdAt
}
```

**Missing API Details**:
- No specification for payment retry mechanism after failure
- No mention of failed payment recovery email workflow
- No specification for refund status webhook handling
- Missing: How to handle partial refunds
- Missing: Payment reconciliation process (mentioned daily, but no API)
- Missing: Currency conversion rate caching strategy (storage location undefined)

**Missing Error Codes**:
```
PAYMENT_001: Invalid payment amount
PAYMENT_002: Currency not supported
PAYMENT_003: Payment gateway timeout
PAYMENT_004: Signature verification failed
PAYMENT_005: Duplicate transaction detected
PAYMENT_006: Insufficient wallet balance
PAYMENT_007: Refund already processed
PAYMENT_008: Refund period expired
PAYMENT_009: Payment gateway unavailable
PAYMENT_010: Invalid webhook signature
```

---

### 4. Phase 22 (Events System) - MEDIUM PRIORITY - POST-MVP

**Status**: Only ~80 lines of basic description

**Missing Components**:
- Refund policy for event cancellations
- Capacity management (waitlist, overbooking prevention)
- Event check-in system (QR codes? manual?)
- Virtual event platform integration (Zoom link generation?)
- Event reminders workflow (when to send?)
- Event feedback/rating collection
- Event recurring schedule support (weekly meditation every Monday?)
- Group discount codes for events

**Missing Prisma Fields**:
```typescript
model Event {
  // Missing fields:
  // - maxCapacity, currentAttendees
  // - waitlistEnabled, waitlistCount
  // - refundPolicy (full | partial | none)
  // - refundDeadline (days before event)
  // - checkInRequired, checkInCode
  // - zoomLink, zoomMeetingId
  // - remindersSent (24hr, 1hr boolean flags)
}
```

---

### 5. Phase 6 (AI Assistant) - MEDIUM PRIORITY - MVP BLOCKER

**Missing Implementation Details**:

**Voice Mode Gaps**:
- How does voice mode handle overlapping speech? (echo cancellation?)
- Audio codec/bitrate specification? (Opus? MP3? bitrate?)
- Voice input timeout: How long does "hold to talk" wait before timeout?
- Processing queue size for voice requests: What if user sends 5 requests in 1 second?
- Conversation state persistence: What if app restarts mid-conversation?

**Missing Prisma Fields**:
```typescript
model AIConversation {
  // Missing:
  // - lastAccessedAt (for activity tracking, cleanup)
  // - exportStatus (null | requested | processing | ready)
  // - exportUrl (signed URL if exported)
}
```

**Missing Error Codes**:
```
AI_006: Voice too faint to process
AI_007: Microphone permission denied
AI_008: Voice processing timeout
AI_009: Conversation export failed
AI_010: Rate limit exceeded (100/hour)
```

---

## Inconsistencies Between Sections

### 1. Authentication Method Conflict

**Inconsistency**: Cookie vs Header for Web App

- **Phase 1 (Auth)** says:
  > "Mobile: use Authorization header only"
  > "Web: also set httpOnly cookie as fallback"

- **Phase 5 (Video)** mentions:
  > "Pass token via Authorization header for Daily.co room access"

- **API-First Architecture section** says:
  > "Auth via Authorization: Bearer <token> header (not cookies for mobile)"

**Impact**: Confusion about whether web should use cookies or headers
**Recommendation**: Clarify that web uses BOTH (cookie for browser, header for API calls)

---

### 2. Crisis Detection Model Selection Conflict

**Inconsistency**: Which AI model handles crisis detection?

- **Phase 6 (AI Assistant)** says:
  > "GPT-4o integration for responses"
  > "Crisis keyword detection: list of 50+ keywords/phrases"

- **Phase 30 (AI Fine-Tuning)** says:
  > "Fine-tune GPT-4o-mini for sentiment/crisis detection (fast inference)"

**Impact**: Unclear if crisis detection uses keyword list OR AI model OR both
**Recommendation**: Clarify that keyword detection is PRIMARY (instant), AI sentiment is SECONDARY

---

### 3. Therapist Matching Algorithm Conflict

**Inconsistency**: Basic vs Priority Matching

- **Phase 4 (Therapy Booking)** says:
  > "Basic matching algorithm: filter by specialization + availability + rating sort"

- **Phase 23 (Memberships)** says:
  > "Healer/Enlightened members get priority therapist matching"

**Impact**: Unclear if "priority matching" is a different algorithm or same algorithm with queue jumping
**Recommendation**: Define "priority" as preferential slot allocation, not different algorithm

---

### 4. Video Session Recording Control Conflict

**Inconsistency**: Who starts recording?

- **Phase 4 (Therapy Session)** says:
  > "Session recording (with consent popup at start)"

- **Phase 5 (Video Calling)** says:
  > "Recording consent popup at start"
  > "Therapist controls recording start"

**Impact**: Unclear if user consents OR therapist starts, or both
**Recommendation**: Clarify that consent popup shows for BOTH parties, then therapist manually starts recording

---

### 5. Membership Gating Inconsistency

**Inconsistency**: Which features are gated by membership?

- **Phase 23 (Memberships)** defines gating middleware but doesn't specify which endpoints use it
- **Phase 6 (AI Assistant)** doesn't mention if chat has message limits for Free tier
- **Phase 4 (Therapy Sessions)** doesn't specify if sessions are unlimited for all tiers

**Impact**: Developers won't know where to apply gating checks
**Recommendation**: Add explicit "Feature Gating Matrix" table in Phase 23

---

### 6. Notification Channel Assignment Inconsistency

**Inconsistency**: Which notifications use which channels?

- **Phase 17 (Notifications)** defines 33 notification types but doesn't specify channels (email/SMS/push) for each
- Some phases mention "email notification" without referencing Phase 17's type list

**Impact**: Missing channel mapping table
**Recommendation**: Add "Notification Channel Matrix" in Phase 17

---

## Missing Cross-References

### 1. Session → Astrology Integration

**Issue**: Phase 4 mentions astrology integration but doesn't link to Phase 7's workflow

**Missing Links**:
- Phase 4 should reference: "See Phase 7 for astrologer assignment workflow"
- API endpoint missing: `GET /api/v1/therapy/sessions/:id/astro-report` (to fetch report during session view)
- Database relation missing: `Session.astrologyReportId` field

**Recommendation**: Add explicit foreign key in Session model pointing to AstrologyReport

---

### 2. Health Tools → Dashboard Aggregation

**Issue**: Phase 16 (Health Tools) lacks cross-reference to Phase 3 (Dashboard)

**Missing Links**:
- How do health tool metrics appear on dashboard?
- Which dashboard widget shows mood trends?
- API endpoint needed: `GET /api/v1/dashboard/health-summary`

**Recommendation**: Add "Dashboard Integration" section to Phase 16

---

### 3. Health Tools → Therapist Dashboard

**Issue**: How do therapists see client health tool usage?

**Missing Links**:
- Does Phase 8 (Therapist Dashboard) show client mood logs?
- Should therapist see client meditation frequency?
- API endpoint needed: `GET /api/v1/therapist/clients/:id/health-data`

**Recommendation**: Add health data viewer to therapist client detail page spec

---

### 4. Community → Admin Moderation

**Issue**: Phase 10 (Community) mentions moderation flags but Phase 14 (Admin) doesn't list moderation queue

**Missing Links**:
- Admin page missing: "Community Moderation Queue"
- API endpoint missing: `GET /api/v1/admin/community/flagged-posts`
- Workflow missing: How do moderators review and action flagged content?

**Recommendation**: Add CommunityModerationPage to Phase 14 admin screen list

---

### 5. Events → Notifications

**Issue**: Phase 22 (Events) mentions notifications but Phase 17 doesn't list event-specific types

**Missing Notification Types**:
- `event_ticket_confirmed`
- `event_reminder_24hr`
- `event_reminder_1hr`
- `event_cancelled`
- `event_rescheduled`

**Recommendation**: Add event notification types to Phase 17 list

---

### 6. Corporate → Analytics

**Issue**: Phase 15 (Corporate) mentions anonymized reports but Phase 20 (Departments) doesn't mention corporate data

**Missing Links**:
- How does corporate admin access employee wellness data?
- Is corporate data isolated from main analytics?
- API endpoint missing: `GET /api/v1/corporate/:id/wellness-report`

**Recommendation**: Add corporate data isolation strategy and reporting APIs

---

## Incomplete Sections

### 1. AI Model Strategy - Missing Deployment Strategy

**Current State**: Explains model selection but not deployment

**Missing Details**:
- How to deploy fine-tuned models to production?
- Model versioning strategy (v1, v2, v3?)
- A/B testing framework for comparing model performance
- Rollback procedure if new model performs worse
- Model monitoring (track accuracy, cost per request)

**Recommendation**: Add "Model Deployment & Versioning" section to AI Model Strategy

---

### 2. Multi-Currency Strategy - Missing Tax & Rounding Rules

**Current State**: Explains currency routing but not edge cases

**Missing Details**:
- Rounding rules: Always round up? Round to nearest?
- Tax calculation per currency/country (GST for India, VAT for EU?)
- Handling zero-amount transactions (free tier, $0.00 charges)
- Currency symbol display (₹ vs INR, $ vs USD)
- Invoice currency: Show in user's currency or INR?

**Recommendation**: Add "Currency Handling Rules" section with rounding/tax table

---

### 3. Data Retention Policy - Missing GDPR Erasure Workflow

**Current State**: Says "users can request deletion" but no workflow specified

**Missing Details**:
- How does user request deletion? (API endpoint? support email?)
- Verification process (email confirmation? identity verification?)
- What data is exempt from deletion? (legal financial records?)
- How long until deletion completes? (30 days mentioned, but workflow?)
- How to handle "right to be forgotten" for anonymized data in analytics?

**Recommendation**: Add "User Data Deletion Workflow" with step-by-step process

---

### 4. Background Jobs - Missing Failure Handling

**Current State**: Lists jobs and schedules but not error handling

**Missing Details**:
- What happens if a job fails? (retry? alert?)
- Maximum retry count before giving up
- Partial job success handling (e.g., 80% of emails sent, 20% failed)
- Dead letter queue for failed jobs
- Job monitoring dashboard (success rate, execution time)

**Recommendation**: Add "Job Error Handling & Monitoring" section

---

### 5. Validation Schemas - Missing Zod Schema Definitions

**Current State**: Mentioned frequently but only Phase 1 has actual schemas

**Missing Schemas**:
- OnboardingStepSchema (Phase 2)
- TherapySessionSchema (Phase 4)
- VideoCallConfigSchema (Phase 5)
- AIChatMessageSchema (Phase 6)
- AstrologyPredictionSchema (Phase 7)
- TherapistNoteSchema (Phase 8)
- BlogPostSchema (Phase 9)
- CommunityPostSchema (Phase 10)
- CourseSchema (Phase 11)
- ProductSchema (Phase 12)
- PaymentTransactionSchema (Phase 13)
- EventSchema (Phase 22)

**Impact**: HIGH - Developers will write their own schemas inconsistently

**Recommendation**: Add appendix "Complete Zod Schema Library" with all schemas

---

## Missing Technical Details

### Missing Error Codes (By Phase)

**Phase 2 (Onboarding)**:
```
ONBOARD_004: Invalid date of birth (future date)
ONBOARD_005: Onboarding already completed
ONBOARD_006: Invalid gender value
ONBOARD_007: Location required for this step
```

**Phase 3 (Dashboard)**:
```
DASHBOARD_001: Dashboard data fetch failed
DASHBOARD_002: Widget not available
DASHBOARD_003: Unauthorized dashboard access
```

**Phase 5 (Video)**:
```
RECORDING_001: Recording initialization failed
RECORDING_002: Storage quota exceeded
RECORDING_003: Transcription service unavailable
RECORDING_004: Recording download failed
RECORDING_005: Recording expired (signed URL)
```

**Phase 8 (Therapist)**:
```
THERAPIST_006: Cannot add tasks to uncompleted session
THERAPIST_007: Client not assigned to this therapist
THERAPIST_008: Availability conflict detected
THERAPIST_009: Cannot cancel session (less than 24hr)
THERAPIST_010: Note too long (max 5000 characters)
```

**Phase 10 (Community)**:
```
COMMUNITY_001 - COMMUNITY_020: (All missing - see section above)
```

**Phase 12 (Shop)**:
```
SHOP_009: Product out of stock
SHOP_010: Invalid shipping address
SHOP_011: Shipping not available to this region
SHOP_012: Order cannot be cancelled (shipped)
SHOP_013: Review not allowed (no purchase)
SHOP_014: Duplicate review
SHOP_015: Wishlist full (max 100 items)
```

**Phase 15 (Corporate)**:
```
CORPORATE_001: Corporate account not found
CORPORATE_002: Employee email already registered
CORPORATE_003: Bulk upload failed (invalid CSV)
CORPORATE_004: SSO configuration invalid
CORPORATE_005: Integration field mapping incomplete
CORPORATE_006: Subdomain already taken
CORPORATE_007: License limit exceeded
CORPORATE_008: Integration connection failed
```

**Phase 20 (Departments)**:
```
DEPARTMENT_001: Department not found
DEPARTMENT_002: Insufficient permissions for this department
DEPARTMENT_003: KPI target cannot be negative
DEPARTMENT_004: Report generation failed
DEPARTMENT_005: Export too large (> 10MB)
```

---

### Missing API Versioning Strategy

**Current State**: All endpoints use `/api/v1/` prefix

**Missing Details**:
- When to bump to `/api/v2/`?
- How long to maintain `/api/v1/` after deprecation?
- Breaking change policy
- Backwards compatibility guarantees
- Client SDK versioning strategy
- API changelog location

**Recommendation**: Add "API Versioning & Deprecation Policy" section

---

### Missing Environment Variables (By Phase)

**Phase 6 (AI Assistant)**:
```
AI_MODEL_GPT4O=gpt-4o
AI_MODEL_GPT4O_MINI=gpt-4o-mini
AI_MODEL_WHISPER=whisper-large-v3
OPENAI_API_KEY=sk-...
CRISIS_KEYWORDS_FILE_PATH=/server/src/config/crisis-keywords.ts
AI_RATE_LIMIT_PER_HOUR=100
AI_MAX_CONVERSATION_HISTORY=20
```

**Phase 20 (Analytics)**:
```
ANALYTICS_RETENTION_DAYS=365
ANALYTICS_AGGREGATION_SCHEDULE="0 2 * * *"
POSTHOG_API_KEY=...
```

**Phase 21 (SEO)**:
```
KEYWORD_TRACKING_API_KEY=...
KEYWORD_TRACKING_PROVIDER=semrush|ahrefs
SERP_API_KEY=...
```

**Phase 25 (AI Monitoring)**:
```
VIDEO_FRAME_PROCESSING_BUCKET=soul-yatri-frames
VIDEO_FRAME_PROCESSING_REGION=ap-south-1
EMOTION_DETECTION_INTERVAL_MS=5000
```

**Phase 30 (Fine-Tuning)**:
```
FINE_TUNING_DATASET_BUCKET=soul-yatri-training-data
FINE_TUNING_OUTPUT_BUCKET=soul-yatri-models
FINE_TUNING_MIN_EXAMPLES=1000
```

**Recommendation**: Add complete `.env.example` with ALL variables

---

### Missing File Paths for Components

**Phase 10 (Community)**:
```
MISSING FILE PATHS:
- src/pages/community/FeedPage.tsx
- src/pages/community/PostDetailPage.tsx
- src/pages/community/CreatePostPage.tsx
- src/components/community/PostCard.tsx
- src/components/community/CommentList.tsx
- src/components/community/ReportModal.tsx
```

**Phase 12 (Shop)**:
```
MISSING FILE PATHS:
- src/pages/shop/ShopHomePage.tsx
- src/pages/shop/ProductDetailPage.tsx
- src/pages/shop/CartPage.tsx
- src/pages/shop/CheckoutPage.tsx
- src/components/shop/ProductCard.tsx
- src/components/shop/CartItem.tsx
```

**Phase 22 (Events)**:
```
MISSING FILE PATHS:
- src/pages/events/EventsListPage.tsx
- src/pages/events/EventDetailPage.tsx
- src/pages/events/MyTicketsPage.tsx
- src/components/events/EventCard.tsx
- src/components/events/TicketPurchaseModal.tsx
```

**Recommendation**: Add complete file path mapping to "Complete Page File Map" section

---

### Missing Type Definitions

**Phase 4 (Therapy Session)**:
```typescript
// MISSING: Exact shape for SessionRequest.preferences field
type SessionPreferences = {
  therapistGender?: 'male' | 'female' | 'any';
  sessionTime?: 'morning' | 'afternoon' | 'evening' | 'flexible';
  communicationStyle?: 'directive' | 'supportive' | 'exploratory';
  focusAreas?: string[];
};
```

**Phase 10 (Community Feed Algorithm)**:
```typescript
// MISSING: Feed algorithm configuration type
type FeedAlgorithmConfig = {
  weightNewness: number;  // 0-1
  weightEngagement: number;  // 0-1
  weightRelevance: number;  // 0-1
  diversityThreshold: number;  // min posts from different authors
  maxPostAge: number;  // in hours
};
```

**Phase 15 (Integration Field Mapping)**:
```typescript
// MISSING: Field mapping type for Slack/SAP integrations
type IntegrationFieldMapping = {
  sourceField: string;  // e.g., "employee_id"
  targetField: string;  // e.g., "userId"
  transform?: 'uppercase' | 'lowercase' | 'trim' | 'email';
  required: boolean;
  defaultValue?: string;
};
```

**Phase 20 (Department Targets)**:
```typescript
// MISSING: Department KPI target type
type DepartmentTarget = {
  metric: string;  // e.g., "session_completion_rate"
  targetValue: number;
  currentValue: number;
  unit: 'percentage' | 'count' | 'currency';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  trend: 'improving' | 'declining' | 'stable';
};
```

**Phase 22 (Event Capacity)**:
```typescript
// MISSING: Event capacity management type
type EventCapacityConfig = {
  maxCapacity: number;
  currentAttendees: number;
  waitlistEnabled: boolean;
  waitlistMax: number;
  overbookingAllowed: boolean;
  overbookingPercentage?: number;  // e.g., 110% = 10% overbook
};
```

**Recommendation**: Add these to `src/types/` barrel export

---

## Missing Documentation

### Workflows Without Clear Steps

#### 1. Therapist Approval Workflow (Phase 1 mentions, but no workflow in Phase 1 or Phase 14)

**Missing Steps**:
1. Therapist submits application (which page? what fields?)
2. System creates ProfessionalOnboarding record (status: `application_submitted`)
3. Therapist uploads documents (Aadhaar, PAN, license)
4. System validates documents (automated? manual?)
5. Admin reviews application (Phase 14 admin dashboard)
6. Background check initiated (third-party API? which one?)
7. Admin schedules interview (via email? in-platform?)
8. Interview conducted (recorded? notes stored?)
9. Assessment test assigned (what test? where?)
10. Trial sessions scheduled (how many? with whom?)
11. Platform training modules assigned
12. Final approval by admin
13. Therapist account activated (status: `approved`)

**Recommendation**: Add "Professional Onboarding Workflow" diagram and detailed steps

---

#### 2. Fraud Escalation Workflow (Phase 25 detects, but resolution steps missing)

**Missing Steps**:
1. AI detects potential fraud (confidence score threshold?)
2. Flag created in database (FraudFlag model)
3. Admin notification sent (real-time? email?)
4. Admin reviews evidence (transcription, recording, therapist history)
5. Admin decision: false positive OR investigate further OR suspend therapist
6. If suspend: therapist account locked, clients notified, sessions cancelled
7. Investigation details logged
8. Therapist can appeal (how? email? in-platform?)
9. Appeal review process
10. Final decision

**Recommendation**: Add "Fraud Detection & Resolution Workflow" to Phase 25

---

#### 3. Emergency Flag Resolution Workflow (Phase 6 creates flag, but resolution unclear)

**Missing Steps**:
1. Crisis detected → EmergencyFlag created
2. User sees crisis helpline numbers (immediate)
3. Assigned therapist notified (if user has one)
4. Admin sees flag in emergency alerts feed
5. Admin acknowledges flag (within how long? 5 minutes?)
6. If user is in active session → therapist handles crisis protocol
7. If user is chatting with AI → AI enters de-escalation mode
8. Admin may call user directly (when? phone number required?)
9. Follow-up scheduled (therapist contacts user within 24 hours)
10. Flag marked resolved (or escalated to external services)

**Recommendation**: Add "Crisis Intervention Protocol Flowchart" to Phase 6

---

#### 4. Content Moderation Appeal Workflow (Phase 10 removes content, but no appeal)

**Missing Steps**:
1. User's post/comment flagged and removed
2. User receives notification of removal (reason code)
3. User clicks "Appeal" button
4. User submits appeal (text explanation, max 500 characters)
5. Appeal enters moderation review queue
6. Moderator reviews original content + appeal
7. Decision: restore content OR uphold removal OR issue warning
8. User notified of appeal decision
9. If 3 appeals rejected → temporary ban (how long?)

**Recommendation**: Add "Content Moderation Appeal Process" to Phase 10

---

### Features Without Implementation Details

#### 1. Personality Report Generation (Phase 4 mentions, no details)

**Missing**:
- How is personality assessed? (AI analysis of conversations? questionnaire?)
- When is report generated? (after X sessions? on-demand?)
- What personality framework? (Big Five? MBTI? custom?)
- Report format? (PDF? in-app only?)
- Can user download report?
- API endpoint: `GET /api/v1/users/personality-report`

**Recommendation**: Add "Personality Report Feature Spec" to Phase 4 or new phase

---

#### 2. Behavioral Pattern Detection (Phase 6 mentions, no algorithm)

**Missing**:
- What patterns are detected? (mood cycles? crisis triggers? sleep patterns?)
- How much data needed to detect pattern? (30 days? 100 conversations?)
- Machine learning model? Or rule-based?
- How are patterns surfaced to user? (dashboard widget? notification?)
- Can therapist see detected patterns?

**Recommendation**: Add "Behavioral Pattern Detection Algorithm" section

---

#### 3. Therapist Quality Score Calculation (Phase 25 mentions, formula unclear)

**Missing**:
- Quality score formula: `(sessionCompletionRate * 0.3) + (clientSatisfaction * 0.4) + (fraudFlagInverse * 0.3)`?
- Fraud flag weighting (1 fraud flag = -10 points?)
- Score range (0-100? 0-5 stars?)
- How often is score recalculated? (real-time? daily?)
- Is score visible to clients? (during booking selection?)

**Recommendation**: Add "Therapist Quality Metrics" section to Phase 25

---

#### 4. Astrologer Leaderboard (Phase 7 mentions, no algorithm)

**Missing**:
- Leaderboard ranking formula (brownie points only? or accuracy rate weighted?)
- Leaderboard reset frequency (monthly? quarterly? never?)
- How many astrologers shown on leaderboard? (top 10? top 50?)
- Leaderboard page location (public? admin-only?)
- Prizes/recognition for top astrologers?

**Recommendation**: Add "Astrologer Leaderboard Specification" to Phase 7

---

#### 5. Trending Keyword Detection (Phase 9 mentions, no spec)

**Missing**:
- Algorithm: Simple count? TF-IDF? ML model?
- Timeframe: Trending this week? this month?
- Minimum threshold (e.g., keyword must appear 100 times to trend)
- How to surface trending keywords to admins? (dashboard widget? weekly email?)
- Auto-suggest blog topics based on trends?

**Recommendation**: Add "Trending Keyword Detection" section to Phase 21 (SEO Automation)

---

### Systems Without Architecture Diagrams

#### 1. Session Matching Algorithm (Phase 4) - No flowchart

**Needed Diagram**:
```
User selects "Book Session"
  ↓
Fetch user's onboarding data (struggles, preferences)
  ↓
Query therapists WHERE:
  - specializations OVERLAP user.struggles
  - isActive = true
  - isVerified = true
  ↓
Filter by preferences:
  - therapistGender matches (if specified)
  - hasAvailability in user's preferred time slots
  ↓
Sort by:
  - 1st: Match score (specialization overlap %)
  - 2nd: Rating (avgRating DESC)
  - 3rd: Experience (yearsExperience DESC)
  ↓
Return top 20 therapists
```

**Recommendation**: Add flowchart to Phase 4

---

#### 2. Crisis Detection Pipeline (Phase 6) - No architecture

**Needed Diagram**:
```
User sends message to AI
  ↓
[Immediate] Check message against crisis keywords list
  ↓
If keyword match → INSTANT FLAG
  ├─ Create EmergencyFlag in DB
  ├─ Show crisis helpline overlay to user
  ├─ Send WebSocket notification to admin
  ├─ Notify assigned therapist (if exists)
  └─ Log to audit trail
  ↓
[Parallel] Send message to GPT-4o for sentiment analysis
  ↓
GPT-4o returns sentiment score (-1 to 1)
  ↓
If sentiment < -0.8 → SECONDARY FLAG (validate keyword detection)
  └─ Log to audit trail
  ↓
AI responds to user (empathetic, non-judgmental)
```

**Recommendation**: Add architecture diagram to Phase 6

---

#### 3. Content Moderation AI Pipeline (Phase 10) - No flow

**Needed Diagram**:
```
User submits post/comment
  ↓
[Immediate] Check for blocked words (profanity filter)
  ↓
If blocked word → Reject post, show error
  ↓
[Parallel] Send content to GPT-4o-mini for toxicity scoring
  ↓
GPT-4o-mini returns toxicity score (0-1)
  ↓
If toxicity > 0.95 → Auto-remove, notify user, log
If toxicity > 0.7 → Flag for human review
If toxicity < 0.7 → Publish immediately
  ↓
[Supplementary] Send to Perspective API (Google)
  ↓
Compare scores, if both high → high confidence flag
```

**Recommendation**: Add moderation pipeline diagram to Phase 10

---

#### 4. In-Session Monitoring System (Phase 25) - No architecture

**Needed Diagram**:
```
Video session starts
  ↓
[Every 5 minutes] Extract audio chunk
  ↓
Send audio to Whisper API for transcription
  ↓
Whisper returns text
  ↓
[Parallel Pipelines]
  ├─ Crisis Detection: Check for crisis keywords
  ├─ Sentiment Analysis: Send to GPT-4o-mini (mood score 1-10)
  └─ Fraud Detection: Analyze therapist conduct patterns
  ↓
Store results in SessionMonitoringEvent table
  ↓
If crisis detected → Show banner to therapist + flag to admin
If low mood detected → Log for post-session report
If fraud suspected → Escalate to admin (high confidence threshold)
  ↓
Post-session: Aggregate all events into SessionReport
```

**Recommendation**: Add monitoring architecture to Phase 25

---

#### 5. Multi-Currency Conversion System (Phase 13) - No flow

**Needed Diagram**:
```
User selects product (price in INR base currency)
  ↓
Fetch user's currency preference (from profile OR IP geolocation)
  ↓
If currency == INR → Display INR price, route to Razorpay
  ↓
If currency != INR:
  ├─ Fetch exchange rate from CurrencyConfig table (cached daily)
  ├─ Calculate: displayAmount = baseAmount * exchangeRate
  ├─ Round according to currency rules (USD: 2 decimals, JPY: 0 decimals)
  └─ Display converted amount
  ↓
User clicks "Pay"
  ↓
Route to Stripe (non-INR) or Razorpay (INR)
  ↓
Store transaction in BOTH currencies:
  - originalCurrency + originalAmount
  - baseCurrency (INR) + baseAmount (for reporting)
  - exchangeRateUsed (for audit)
```

**Recommendation**: Add currency flow diagram to Phase 13

---

## Missing Database/Schema Details

### 1. Indexes - No Specification

**Critical Queries Need Indexes**:

```sql
-- Phase 4: Therapist search queries
CREATE INDEX idx_therapist_profile_specializations ON "TherapistProfile" USING GIN ("specializations");
CREATE INDEX idx_therapist_profile_rating ON "TherapistProfile"("avgRating" DESC);

-- Phase 6: AI conversation lookup
CREATE INDEX idx_ai_conversation_user_created ON "AIConversation"("userId", "createdAt" DESC);

-- Phase 9: Blog post search
CREATE INDEX idx_blog_post_published_at ON "BlogPost"("publishedAt" DESC) WHERE "status" = 'published';

-- Phase 10: Community feed queries
CREATE INDEX idx_community_post_created_at ON "CommunityPost"("createdAt" DESC) WHERE "deletedAt" IS NULL;
CREATE INDEX idx_community_post_author ON "CommunityPost"("authorId") WHERE "deletedAt" IS NULL;

-- Phase 13: Payment history
CREATE INDEX idx_payment_user_created ON "PaymentTransaction"("userId", "createdAt" DESC);

-- Phase 17: Notification queries
CREATE INDEX idx_notification_user_read ON "Notification"("userId", "isRead", "createdAt" DESC);

-- Full-text search indexes
CREATE INDEX idx_blog_post_fts ON "BlogPost" USING GIN(to_tsvector('english', "title" || ' ' || "content"));
CREATE INDEX idx_community_post_fts ON "CommunityPost" USING GIN(to_tsvector('english', "content"));
```

**Recommendation**: Add "Database Index Strategy" section with complete index list

---

### 2. Cascade Delete Rules - Unclear

**Questions**:
- When user deletes account:
  - What happens to AI conversations? (delete vs archive?)
  - What happens to community posts? (delete vs mark as "[deleted user]"?)
  - What happens to therapy session records? (CANNOT delete - legal/medical records)

- When blog post deleted:
  - What happens to comments? (cascade delete? keep orphaned?)
  - What happens to likes? (cascade delete?)

- When therapist deleted:
  - What happens to past session records? (CANNOT delete)
  - What happens to future scheduled sessions? (cancel + refund)
  - What happens to therapist notes? (anonymize or keep?)

**Recommendation**: Add "Cascade Delete & Data Retention Rules" table

---

### 3. Soft vs Hard Deletes - Inconsistent

**Current Spec**:
- Community posts: Soft delete specified (deletedAt timestamp)
- Blog comments: Soft delete mentioned
- Other entities: Not specified

**Recommendation**: Clarify for ALL entities:

```
SOFT DELETE (deletedAt timestamp, recoverable):
- User accounts (30-day grace period before hard delete)
- Community posts (moderator can restore)
- Blog posts (admin can restore)
- Therapist notes (medical record retention)

HARD DELETE (immediate, irreversible):
- Refresh tokens (logout)
- Notification read status (cleanup old)
- Session recordings (after retention period, e.g., 2 years)

NO DELETE (permanent):
- Payment transactions (legal requirement)
- Audit logs (compliance)
- Emergency flags (safety)
```

---

### 4. Table Partitioning Strategy - Missing

**Large Tables That Need Partitioning**:
- AnalyticsEvent (Phase 20): Partition by month (time-series data)
- Notification: Partition by year
- AuditLog: Partition by quarter
- AIConversation: Consider partitioning if > 10M records

**Recommendation**: Add "Database Partitioning Strategy" for scalability

---

## Missing Integration Details

### 1. Email Provider Integration (Resend.com)

**Missing Details**:
- Email template HTML (no templates provided)
- Sender identity: `noreply@soulyatri.com`? `hello@soulyatri.com`?
- Unsubscribe link implementation (how to track unsubscribe status?)
- Bounce/complaint webhook handling
- Email sending queue (BullMQ job? direct API call?)
- Rate limiting (Resend free tier: 3K emails/month)

**Recommendation**: Add email template examples + integration guide

---

### 2. Razorpay Webhook Integration

**Missing Details**:
- Webhook signature verification code
- Error code mapping:
  ```
  Razorpay error code BAD_REQUEST_ERROR → PAYMENT_001
  Razorpay error code GATEWAY_ERROR → PAYMENT_003
  Razorpay error code SERVER_ERROR → PAYMENT_009
  ```
- Subscription plan creation for memberships (Phase 23)
- Webhook retry handling (if webhook processing fails)

**Recommendation**: Add "Razorpay Integration Guide" with code examples

---

### 3. Daily.co Video Integration

**Missing Details**:
- Room expiration strategy (delete room after session ends? keep for 24 hours?)
- Room cleanup background job (when to run?)
- Bandwidth detection implementation (how to detect user's network speed?)
- Fallback for video call failure (reschedule? phone call?)

**Recommendation**: Add "Daily.co Integration Best Practices"

---

### 4. S3/Cloudflare R2 Storage Integration

**Missing Details**:
- Bucket organization strategy:
  ```
  soul-yatri-production/
    ├── recordings/
    │   └── {sessionId}/
    │       └── {timestamp}.webm
    ├── avatars/
    │   └── {userId}.jpg
    ├── course-videos/
    │   └── {courseId}/
    │       └── {lessonId}.mp4
    ├── product-images/
    │   └── {productId}/
    │       └── {imageId}.jpg
    └── blog-images/
        └── {postId}/
            └── {imageId}.jpg
  ```
- Cleanup strategy for old files (recordings older than 2 years)
- Lifecycle policy specification (move to cold storage after 1 year)
- Signed URL expiry duration (1 hour for recordings, 24 hours for avatars)

**Recommendation**: Add "S3/R2 Storage Architecture" diagram

---

## Missing Performance/Monitoring

### 1. SLA Targets - Incomplete

**Missing SLAs**:
- Complex search queries (blog full-text search, therapist search): < ??? ms
- Community feed generation: < ??? ms
- Report generation (admin dashboard): < ??? seconds
- Course video transcoding: < ??? minutes
- Background job execution time: < ??? seconds

**Recommendation**: Add complete SLA table for ALL endpoint categories

---

### 2. Monitoring Gaps

**Missing Monitoring Specs**:
- AI cost per user tracking (how much does AI chat cost per conversation?)
- Memory leak detection strategy (Node.js memory monitoring)
- Database query monitoring (slow query log threshold?)
- WebSocket connection monitoring (active connections, reconnection rate)
- Error rate by endpoint (which endpoints fail most often?)

**Recommendation**: Add "Monitoring & Observability Setup Guide"

---

### 3. Caching Strategy - Missing

**Questions**:
- Which endpoints need caching? (therapist list? blog posts? dashboard data?)
- Cache TTL values (5 minutes? 1 hour?)
- Cache invalidation strategy:
  - When therapist updates profile → invalidate therapist list cache
  - When blog post published → invalidate blog feed cache
  - When user updates profile → invalidate dashboard cache
- Redis cache key naming convention?

**Recommendation**: Add "Caching Strategy & TTL Configuration" table

---

## Missing Security Details

### 1. Two-Factor Authentication (2FA) - Missing

**Current State**: Mentioned for corporate but not for regular users

**Missing Spec**:
- Should regular users have 2FA option?
- If yes: TOTP (Google Authenticator) or SMS?
- Backup codes generation (10 codes, use once)?
- 2FA enforcement for admin accounts?
- 2FA setup workflow (QR code display, verification)

**Recommendation**: Add 2FA as optional feature in Phase 1

---

### 2. API Key Management - Missing

**Missing Details**:
- API key rotation frequency (rotate OpenAI key quarterly?)
- Secure storage (AWS Secrets Manager? Doppler?)
- Test vs production key separation (different .env files?)
- Key access logging (who accessed which key when?)

**Recommendation**: Add "API Key Management & Rotation Policy"

---

### 3. Data Encryption Details - Vague

**Current Spec**: "Therapy session data: AES-256 encryption at rest"

**Missing**:
- Which specific fields are encrypted?
  - Session.transcription?
  - TherapistNote.content?
  - AIConversation.messages?
  - KundaliChart.chartData?
- Encryption key storage (AWS KMS? Vault?)
- Encryption key rotation strategy (annually?)
- How to query encrypted data? (decrypt at application layer?)

**Recommendation**: Add "Data Encryption Strategy" with field-level encryption map

---

### 4. Session Management - Incomplete

**Missing**:
- Session timeout duration (JWT: 15 min, but browser session timeout?)
- Concurrent session limits (can user be logged in on 2 devices? 5 devices?)
- Device tracking (log device type, IP, location on login?)
- "Log out all sessions" feature (revoke all refresh tokens)

**Recommendation**: Add "Session Management & Device Tracking" section

---

## Missing Deployment/DevOps

### 1. Database Migration Strategy

**Missing**:
- Zero-downtime migration strategy (how to add columns without locking table?)
- Rollback procedures (if migration fails halfway?)
- Migration testing process (test on staging first)
- Data migration for large tables (how to migrate 10M rows?)

**Recommendation**: Add "Database Migration Best Practices" guide

---

### 2. Feature Flags - Not Mentioned

**Missing**:
- Feature flag system for gradual rollouts
- A/B testing framework (test new UI with 50% of users)
- Kill switch for problematic features (disable AI assistant if buggy)
- Feature flag cleanup (remove old flags after full rollout)

**Recommendation**: Add "Feature Flag Strategy" (suggest LaunchDarkly or Unleash)

---

### 3. Deployment Procedure - Vague

**Current Spec**: "Exit gates" mentioned but no detailed procedure

**Missing**:
- Pre-deployment checklist (run tests, check env vars, backup database)
- Deployment steps (build → deploy → smoke test → monitor)
- Rollback procedure (if deployment fails, how to rollback?)
- Blue-green deployment strategy (zero-downtime deployments)
- Health check endpoints (for load balancer to verify app is healthy)

**Recommendation**: Add "Deployment Runbook" with step-by-step instructions

---

### 4. Backup & Disaster Recovery - Minimal

**Current Spec**: "Database backups configured (daily)" - that's it!

**Missing**:
- Backup frequency (daily at 2 AM?)
- Backup retention period (keep backups for 30 days? 90 days?)
- Backup restoration procedure (how to restore from backup?)
- Cross-region backups (backup to different AWS region for disaster recovery?)
- Backup testing frequency (test restore quarterly?)
- Recovery Time Objective (RTO): How long to restore from backup?
- Recovery Point Objective (RPO): How much data loss is acceptable?

**Recommendation**: Add "Backup & Disaster Recovery Plan"

---

## Missing Compliance/Legal

### 1. GDPR Implementation - Incomplete

**Current Spec**: Mentions GDPR rights but no technical implementation

**Missing**:
- Data portability format (JSON? CSV? PDF?)
- Data export API implementation (how to export all user data?)
- Right to erasure verification (how to prove data is deleted?)
- Consent management UI (checkboxes for each data processing purpose)
- GDPR consent withdrawal (user can revoke consent, then what?)

**Recommendation**: Add "GDPR Compliance Technical Implementation" section

---

### 2. HIPAA-Style Compliance - Mentioned But No Details

**Current Spec**: "HIPAA-style audit logs"

**Missing**:
- Audit log retention (7 years minimum?)
- What gets logged? (every data access, every admin action, every session view)
- Data access authorization matrix:
  ```
  Role: Therapist
  - Can access: Own clients' data
  - Cannot access: Other therapists' clients
  - Audit: Every client data access logged

  Role: Admin
  - Can access: All data (with justification required)
  - Audit: Every admin access logged + justification
  ```
- Breach notification procedure (if data breach detected, notify users within 72 hours)

**Recommendation**: Add "Healthcare Data Compliance Guide"

---

### 3. DPDPA (India) Compliance - Vague

**Current Spec**: Mentions DPDPA but no technical controls

**Missing**:
- Consent banner specification (what text? which checkboxes?)
- Data Processing Agreements template (for third-party vendors like OpenAI, Razorpay)
- Data localization implementation (primary database in India, backups in India)
- Grievance redressal mechanism UI (where do users file data complaints?)
- Data Protection Officer (DPO) contact information display

**Recommendation**: Add "DPDPA Compliance Checklist"

---

## Missing Testing Specifications

### 1. Test Data - No Seeding Strategy

**Missing**:
- How to seed test database with realistic data?
- Synthetic test data generation for performance testing (1M users, 100K sessions)
- Test user accounts (admin, therapist, astrologer, regular user)
- Test payment transactions (without real money)

**Recommendation**: Add database seeding scripts in `/server/prisma/seed.ts`

---

### 2. Load Testing - No Targets

**Missing**:
- Load testing targets (handle 1000 concurrent users? 10,000?)
- Load testing tool recommendation (k6? Artillery? JMeter?)
- Load testing scenarios:
  - Scenario 1: 100 users booking sessions simultaneously
  - Scenario 2: 500 users chatting with AI simultaneously
  - Scenario 3: 50 video sessions running concurrently
- Performance degradation thresholds (when does response time exceed SLA?)

**Recommendation**: Add "Load Testing Strategy & Targets"

---

### 3. Security Testing - No Frequency

**Missing**:
- Penetration testing frequency (annually? quarterly?)
- Security scanning tools (OWASP ZAP? Burp Suite?)
- Automated security scanning in CI/CD (Snyk? Dependabot?)
- Security audit checklist (OWASP Top 10 coverage)

**Recommendation**: Add "Security Testing Schedule & Tools"

---

## Pagination & Search Inconsistencies

### 1. Default Page Size Inconsistencies

**Current Spec**:
- Admin pages mention "10/25/50/100" options
- Blog mentions "10 at a time"
- Other endpoints: Not specified

**Recommendation**: Standardize default page sizes:
```
DEFAULT_PAGE_SIZE = 20
ADMIN_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
MAX_PAGE_SIZE = 100
```

---

### 2. Search Implementation - Vague

**Current Spec**: "Full-text search mentioned for journal"

**Missing**:
- Full-text search for ALL text fields?
- Search result ranking algorithm (exact match first? relevance score?)
- Search query autocomplete (suggest search terms as user types?)
- Search filters (date range, category, author)
- Search performance (index strategy, query optimization)

**Recommendation**: Add "Search Implementation Guide" with Postgres full-text search setup

---

## Missing Feature Specifications

### 1. User Profile Page

**Current Spec**: Only mentioned in sidebar navigation

**Missing**:
- Edit profile page specification
- Profile fields (name, email, phone, avatar, bio, location)
- Change password flow
- Email verification flow
- Phone number verification (OTP)

**Recommendation**: Add "User Profile Management" page to Phase 1 or Phase 3

---

### 2. Password Reset Flow

**Current Spec**: Mentioned in file map but NOT in Phase 1 (Auth)

**Missing**:
- Forgot password page (email input)
- Reset password email template
- Reset password token (JWT? expiry: 1 hour?)
- Reset password page (enter new password)
- API endpoints:
  ```
  POST /api/v1/auth/forgot-password → Send reset email
  POST /api/v1/auth/reset-password   → Verify token + set new password
  ```

**Recommendation**: Add password reset to Phase 1

---

### 3. Email Verification

**Current Spec**: Not mentioned anywhere

**Question**: Is email verification needed?

**If Yes, Missing**:
- Verification email template
- Verification token (JWT? expiry: 24 hours?)
- Verification page (click link in email)
- Resend verification email option
- Block unverified users from booking sessions?

**Recommendation**: Clarify if email verification is required, add to Phase 1

---

### 4. Social Login (Google/Facebook)

**Current Spec**: Not mentioned

**Question**: Should users be able to log in with Google/Facebook?

**If Yes, Missing**:
- OAuth provider setup (Google OAuth client ID)
- OAuth callback handling
- Account linking (if user already has email account, link Google account)
- API endpoints:
  ```
  GET  /api/v1/auth/google          → Redirect to Google OAuth
  GET  /api/v1/auth/google/callback → Handle OAuth callback
  POST /api/v1/auth/google/link     → Link Google account to existing account
  ```

**Recommendation**: Clarify if social login is needed (likely post-MVP)

---

### 5. Referral System

**Current Spec**: Not mentioned

**Question**: Should there be a referral program? ("Refer a friend, get ₹200 credit")

**If Yes, Missing**:
- Referral code generation
- Referral tracking (who referred whom?)
- Referral rewards (wallet credit, discount code, free session)
- Referral page (user can share referral link)
- API endpoints:
  ```
  GET  /api/v1/users/referral-code   → Get my referral code
  POST /api/v1/users/apply-referral  → Apply someone's referral code
  GET  /api/v1/users/referral-stats  → See who I referred
  ```

**Recommendation**: Add referral system as post-MVP feature (Phase 23+)

---

### 6. User Level/Badges

**Current Spec**: Mentioned in community but not fully specified

**Missing**:
- User level calculation (XP points? activity score?)
- Level-up triggers (post 10 times? get 50 likes?)
- Badges list (Early Adopter, Helper, Meditation Master, etc.)
- Badge display on profile/posts
- Gamification strategy (encourage engagement)

**Recommendation**: Add gamification system to Phase 10 (Community)

---

### 7. Export/Download Features - Inconsistent

**Current Spec**:
- Reports can be exported (no format specified)
- Health data export mentioned (no format specified)

**Missing Clarity**:
- Export format: CSV? JSON? PDF?
- Export API endpoints:
  ```
  GET /api/v1/users/export-data → Export ALL user data (GDPR requirement)
  GET /api/v1/health/export     → Export health data (CSV)
  GET /api/v1/admin/reports/export?format=csv → Export reports
  ```
- Export job queue (large exports processed in background)
- Export download link (signed URL, expires in 24 hours)

**Recommendation**: Add "Data Export Feature Specification"

---

## Recommendations

### Immediate Actions (Before Development Starts)

1. **Complete Phase 7 (Astrologer System) specification** - CRITICAL MVP BLOCKER
   - Define all Prisma models
   - Define all API endpoints
   - Define all workflows
   - Define error codes
   - Estimated effort: 2-3 days

2. **Define Payment Prisma models** - CRITICAL MVP BLOCKER
   - PaymentTransaction model
   - CurrencyConfig model
   - PaymentWebhookEvent model
   - Estimated effort: 1 day

3. **Create comprehensive Zod schema library** - HIGH PRIORITY
   - Add schemas for all phases (currently only Phase 1 has them)
   - Estimated effort: 3-4 days

4. **Define complete error code list** - HIGH PRIORITY
   - Add missing error codes for all phases
   - Create error code reference document
   - Estimated effort: 2 days

5. **Add workflow diagrams for critical flows** - HIGH PRIORITY
   - Crisis detection pipeline
   - Session matching algorithm
   - Therapist approval workflow
   - Fraud escalation workflow
   - Estimated effort: 2 days

---

### Short-Term Actions (During MVP Development)

6. **Complete Phase 10 (Community) specification** - POST-MVP but needed soon
   - Define all Prisma models
   - Define feed algorithm
   - Define moderation workflow
   - Estimated effort: 2-3 days

7. **Add cross-reference links between phases** - MEDIUM PRIORITY
   - Session ↔ Astrology integration
   - Health tools ↔ Dashboard integration
   - Community ↔ Admin moderation integration
   - Estimated effort: 1 day

8. **Define database index strategy** - MEDIUM PRIORITY
   - Identify slow queries
   - Add index definitions
   - Estimated effort: 1 day

9. **Create email template library** - MEDIUM PRIORITY
   - Design HTML email templates
   - Welcome email, appointment reminder, payment receipt, etc.
   - Estimated effort: 2 days

10. **Add deployment runbook** - MEDIUM PRIORITY
    - Pre-deployment checklist
    - Deployment steps
    - Rollback procedure
    - Estimated effort: 1 day

---

### Long-Term Actions (Before Production Launch)

11. **Complete compliance documentation** - REQUIRED FOR LAUNCH
    - GDPR compliance guide
    - HIPAA-style compliance guide
    - DPDPA compliance checklist
    - Estimated effort: 3-4 days

12. **Add monitoring & observability setup** - REQUIRED FOR LAUNCH
    - Define all metrics to track
    - Set up dashboards
    - Configure alerts
    - Estimated effort: 2-3 days

13. **Define backup & disaster recovery plan** - REQUIRED FOR LAUNCH
    - Backup frequency & retention
    - Restoration procedure
    - Cross-region backups
    - Estimated effort: 1-2 days

14. **Complete security testing strategy** - REQUIRED FOR LAUNCH
    - Penetration testing schedule
    - Security scanning tools
    - Security audit checklist
    - Estimated effort: 2 days

15. **Fill remaining phase gaps** - ONGOING
    - Phase 15 (Corporate) integration details
    - Phase 22 (Events) complete specification
    - Phase 25 (AI Monitoring) architecture
    - Estimated effort: 5-6 days total

---

### Total Estimated Effort to Address All Gaps

- **Immediate (MVP blockers)**: 8-10 days
- **Short-term (during MVP dev)**: 7-9 days
- **Long-term (before launch)**: 8-11 days
- **TOTAL**: 23-30 days of documentation work

---

## Conclusion

The BUILD_PLAN.md is **65% complete** in terms of implementation-ready specifications. While the document provides excellent high-level structure and covers all 31 phases, approximately **35% of critical implementation details are missing**:

- **10 phases have incomplete or missing Prisma models**
- **15 phases lack complete error code definitions**
- **8 phases lack workflow diagrams**
- **20+ API endpoints are mentioned but not specified**
- **Multiple cross-references between phases are missing**
- **Security, compliance, and deployment details are vague**

**Recommendation**: Allocate 3-4 weeks for documentation completion before starting development on incomplete phases, especially Phase 7 (Astrologer System) which is critical for MVP.

