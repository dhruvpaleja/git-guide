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
5. AI conversations: encrypted, auto-purge after 90 days (configurable)
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

## Build Phases (Give ONE phase to an AI agent at a time)

### PHASE 1: Database & Auth Foundation
**Time estimate: 1-2 sessions**
**What to tell the AI agent:**

```
TASK: Set up PostgreSQL database with Prisma ORM and complete auth system.

CONTEXT: This is a mental health platform (Soul Yatri). The codebase is at the root
of this repo. Backend is in server/ using Express + TypeScript. Frontend is React + Vite.

STEP 1 — Install & configure Prisma in server/:
- npm install prisma @prisma/client in server/
- npx prisma init
- Create schema.prisma with these models:
  User (id, email, passwordHash, name, avatar, role, phone, dateOfBirth, bio, onboardingCompleted, createdAt, updatedAt)
  Role enum: USER, THERAPIST, ASTROLOGER, ADMIN, MODERATOR
  Session (refresh tokens)

STEP 2 — Auth API routes in server/src/routes/auth.ts:
- POST /api/v1/auth/register — register with email/password, hash with bcrypt
- POST /api/v1/auth/login — return JWT access token + httpOnly refresh token cookie
- POST /api/v1/auth/refresh — refresh access token using cookie
- POST /api/v1/auth/logout — clear refresh token
- GET /api/v1/auth/me — return current user from JWT

STEP 3 — Auth middleware in server/src/middleware/auth.ts:
- verifyToken middleware — extract JWT from Authorization header
- requireRole middleware — check user.role against allowed roles

STEP 4 — Frontend auth:
- Update src/context/AuthContext.tsx to call real API endpoints
- Create src/pages/LoginPage.tsx and src/pages/SignupPage.tsx
- Add login/signup routes to src/router/index.tsx under AuthLayout

VERIFY: Register a user, login, access /api/v1/auth/me with token, refresh token.
```

---

### PHASE 2: User Onboarding Flow
**Time estimate: 1-2 sessions**

```
TASK: Build 10-step onboarding flow that collects user profile data after signup.

CONTEXT: Types are defined in src/types/onboarding.types.ts. User signs up → redirected
to /onboarding → completes 10 steps → redirected to /dashboard.

STEP 1 — Create src/pages/OnboardingPage.tsx:
- Multi-step form with progress bar (step X of 10)
- Each step is its own component in src/pages/onboarding/ folder
- Steps:
  1. Welcome + Name
  2. Date of Birth + Gender
  3. Phone + Location
  4. Current mood & stress level (slider 1-10)
  5. What are you struggling with? (multi-select from Struggle type)
  6. What are your healing goals? (multi-select from HealingGoal type)
  7. Past therapy experience + current medications
  8. Therapist preferences (gender, language, time)
  9. Interests (astrology, meditation, breathwork, yoga)
  10. Emergency contact + Terms & Privacy consent

STEP 2 — Backend: POST /api/v1/users/onboarding — save all data
STEP 3 — After completion, set user.onboardingCompleted = true
STEP 4 — ProtectedRoute should redirect to /onboarding if not completed
STEP 5 — Add route to router: /onboarding (standalone, no layout chrome)

VERIFY: Sign up → land on onboarding → complete all steps → arrive at dashboard.
```

---

### PHASE 3: User Dashboard
**Time estimate: 2-3 sessions**

```
TASK: Build the main user dashboard with all sections.

CONTEXT: Dashboard is the home for logged-in users. It shows their healing journey,
upcoming sessions, tools, recommendations. Uses DashboardLayout (sidebar + main area).

STEP 1 — Create src/pages/dashboard/UserDashboardPage.tsx:
- Welcome message with user name
- Stats cards: mood trend, sessions completed, streak, meditation minutes
- Upcoming sessions list
- Recommended courses
- Quick actions: Book session, Journal, Meditate, AI Assistant

STEP 2 — Create sidebar navigation items for DashboardLayout:
- Dashboard (overview)
- My Sessions (therapy history + upcoming)
- Health Tools (mood tracker, meditation, journal, breathing)
- Courses (enrolled + recommended)
- Soul Circle (community)
- Soul Shop
- AI Assistant
- My Reports (personality reports, astrology reports)
- Settings / Profile
- Complaints

STEP 3 — Create placeholder pages for each sidebar item:
- src/pages/dashboard/SessionsPage.tsx
- src/pages/dashboard/HealthToolsPage.tsx
- src/pages/dashboard/CoursesPage.tsx
- src/pages/dashboard/SoulCirclePage.tsx
- src/pages/dashboard/ShopPage.tsx
- src/pages/dashboard/AIAssistantPage.tsx
- src/pages/dashboard/ReportsPage.tsx
- src/pages/dashboard/SettingsPage.tsx
- src/pages/dashboard/ComplaintsPage.tsx

STEP 4 — Wire all routes in src/router/index.tsx under ProtectedRoute + DashboardLayout

VERIFY: Login → see dashboard with all sidebar items → click each → pages load.
```

---

### PHASE 4: Therapy Booking & Session System
**Time estimate: 2-3 sessions**

```
TASK: Build the therapy booking flow with automatic therapist matching.

STEP 1 — Prisma models: Therapist, TherapySession, SessionRequest, SessionTask
STEP 2 — Matching algorithm API: POST /api/v1/therapy/request
  - Takes user's struggles, preferences
  - Queries therapists by specialization + rating + availability
  - Returns top 3 matches with match scores
  - Auto-assigns best match if user doesn't choose
STEP 3 — Booking flow UI: src/pages/dashboard/BookSessionPage.tsx
  - Select issue → see matched therapists → pick time slot → confirm → payment
STEP 4 — Session detail page: src/pages/dashboard/SessionDetailPage.tsx
  - Session info, therapist info, join button (when live), recording (after)
STEP 5 — Post-session: therapist adds tasks → shown to user on dashboard

VERIFY: Book a session → therapist matched → session created → tasks assigned.
```

---

### PHASE 5: Video Calling & Session Recording
**Time estimate: 1-2 sessions**

```
TASK: Integrate video calling for therapy sessions with recording + transcription.

STEP 1 — Integrate Daily.co (or 100ms) SDK
  - Create room when session is booked
  - Both user and therapist join via session detail page
  - Record session automatically (with consent)
STEP 2 — After session ends:
  - Upload recording to S3
  - Send audio to Whisper API for transcription
  - AI extracts key points and action items from transcript
  - Save to SessionRecording + SessionTranscription models
STEP 3 — User can view recording + key points in their sessions history

VERIFY: Start session → video works → recording saved → transcript generated.
```

---

### PHASE 6: AI Voice Assistant
**Time estimate: 2 sessions**

```
TASK: Build 24/7 AI voice/text assistant with emergency flagging.

STEP 1 — Backend: /api/v1/ai/chat — streaming chat endpoint using OpenAI
STEP 2 — Backend: /api/v1/ai/voice — accept audio, transcribe, respond, return audio
STEP 3 — Sentiment analysis on every message:
  - Detect negative keywords (harm, suicide, hopeless, etc.)
  - Score sentiment -1 to 1
  - If critical → create EmergencyFlag → notify assigned therapist instantly
STEP 4 — Frontend: src/pages/dashboard/AIAssistantPage.tsx
  - Chat interface (text mode)
  - Voice mode (push-to-talk or continuous)
  - Emergency banner if user seems in crisis (show helpline numbers)
STEP 5 — Pattern detection background job:
  - Analyze mood logs + journal + AI chats over 7-day windows
  - Flag declining patterns → notify therapist

VERIFY: Chat with AI → negative message → flag created → therapist notified.
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

STEP 1 — src/pages/therapist/:
  - TherapistDashboardPage: overview stats, upcoming sessions, alerts
  - ClientsPage: all assigned clients with healing journey progress
  - ClientDetailPage: full history, mood trends, session recordings, tasks
  - SessionsPage: calendar view of all sessions
  - RevenuePage: earnings breakdown
  - ReviewsPage: client feedback
STEP 2 — Proactive notification system:
  - If client's mood logs decline 3+ days → alert therapist
  - If client misses assigned tasks → notify
  - If emergency flag on client → urgent notification
  - Pre-session: astrology report ready notification
STEP 3 — Post-session workflow:
  - View session transcription key points
  - Add healing tasks for client
  - Write session notes
  - Rate astrology prediction accuracy

VERIFY: Login as therapist → see clients → get notification for negative pattern.
```

---

### PHASE 9: Blog System with SEO
**Time estimate: 1-2 sessions**

```
TASK: Build blog with admin approval and SEO optimization.

STEP 1 — Prisma models: BlogPost, BlogCategory, BlogComment
STEP 2 — Public blog listing: /blog — filterable by category, tag, search
STEP 3 — Blog detail page: /blog/:slug — full article with comments
STEP 4 — Blog editor: Markdown/rich text editor for therapists + admin
STEP 5 — Admin approval workflow: draft → review → published
STEP 6 — SEO:
  - Server-side rendering for blog pages (or pre-rendering)
  - Auto-generate meta tags, Open Graph, JSON-LD schema
  - Sitemap.xml auto-generation
  - AI-powered keyword suggestions based on trending searches
STEP 7 — Auto-update system: scheduled job to suggest new blog topics from Google Trends

VERIFY: Write blog → admin approves → published with proper SEO meta tags.
```

---

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

STEP 1 — Prisma models: Course, Module, Lesson, Enrollment, CourseReview
STEP 2 — Course listing: /courses — browse, filter, search
STEP 3 — Course detail: /courses/:id — modules, lessons, reviews, enroll button
STEP 4 — Course player: video player with progress tracking
STEP 5 — Course creator dashboard: upload course → admin reviews → publish
STEP 6 — Payment integration: one-time purchase or included in subscription
STEP 7 — Completion certificates

VERIFY: Browse courses → enroll → watch lessons → track progress → complete.
```

---

### PHASE 12: Soul Shop (E-commerce)
**Time estimate: 1-2 sessions**

```
TASK: Build merchandise and healing products shop.

STEP 1 — Prisma models: Product, Order, OrderItem, Cart, ShippingAddress, Review
STEP 2 — Shop listing: /shop — categories, filters, search
STEP 3 — Product detail page with images, reviews
STEP 4 — Cart + Checkout flow (Razorpay/Stripe integration)
STEP 5 — Order tracking
STEP 6 — Admin: product management, inventory, order fulfillment

VERIFY: Browse shop → add to cart → checkout → payment → order confirmed.
```

---

### PHASE 13: Payment Gateway
**Time estimate: 1 session**

```
TASK: Integrate Razorpay (and/or Stripe) for all payment flows.

STEP 1 — Server: /api/v1/payments/ routes
  - Create order → get payment link
  - Webhook handler for payment confirmation
  - Refund API
STEP 2 — Frontend: reusable PaymentModal component
  - Used by therapy booking, course enrollment, shop checkout, subscription
STEP 3 — Subscription management: plans, upgrades, cancellation
STEP 4 — Therapist/Astrologer payouts: track earnings, payout requests

VERIFY: Complete payment for therapy session → webhook confirms → session activated.
```

---

### PHASE 14: Admin Dashboard
**Time estimate: 2-3 sessions**

```
TASK: Build comprehensive admin/head office dashboard.
The HEAD OFFICE dashboard must have FULL visibility and control over EVERY
section of the platform. Nothing should be hidden from admin view.

STEP 1 — src/pages/admin/ (every page in the platform has an admin view):
  === CORE OVERVIEW ===
  - HeadOfficePage: CEO-level dashboard aggregating ALL stats from every section
    (uses HeadOfficeDashboard type from admin.types.ts)
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
  - PaymentsPage: all transactions, pending refunds, failed payments
  - CorporatePage: corporate account management
  - InstitutionsPage: school/college account management
  - IntegrationsPage: Slack, Teams, SAP, API webhooks management

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
  - Bulk actions where appropriate
  - Export to CSV/PDF
  - Real-time updates via WebSocket

VERIFY:
  Login as admin → Head Office shows ALL stats →
  Can see every user → Can see every session recording →
  Can see therapist quality scores → Can see fraud alerts →
  Can manage events, memberships, NGO → Can see all revenue →
  Can see all departments and targets → Can manage all content →
  Nothing is hidden from admin view.
```

---

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

STEP 1 — Mood tracker: daily mood logging with triggers, visualizations
STEP 2 — Meditation space: guided meditations, timer, ambient sounds
STEP 3 — Journal: rich text entries with mood tagging, private
STEP 4 — Breathing exercises: animated breathing guides (box, 4-7-8, alternate)
STEP 5 — All data feeds into personalization engine + therapist view

VERIFY: Log mood → meditate → journal → see data on dashboard charts.
```

---

### PHASE 17: Notifications & Real-time
**Time estimate: 1 session**

```
TASK: Build notification system with Socket.IO.

STEP 1 — Socket.IO server setup for real-time events
STEP 2 — In-app notifications (bell icon with dropdown)
STEP 3 — Push notifications (web push via service worker)
STEP 4 — Email notifications (Resend/SES)
STEP 5 — Notification preferences per user

VERIFY: Emergency flag created → therapist gets real-time notification.
```

---

### PHASE 18: Landing Page Animations & Polish
**Time estimate: 1 session**

```
TASK: Add Framer Motion animations and optional Three.js effects to landing page.

STEP 1 — Install framer-motion
STEP 2 — Scroll-triggered animations for each section
STEP 3 — Page transition animations
STEP 4 — Optional: Three.js particle effect or 3D element in hero section
STEP 5 — Performance: ensure animations don't hurt Lighthouse score

VERIFY: Landing page loads smoothly with animations, scores 90+ on Lighthouse.
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

---

### PHASE 20: Department Dashboards & Employee System
**Time estimate: 2 sessions**

```
TASK: Build centralized department-wise dashboards with targets, plans, and tracking.

CONTEXT: Every department in Soul Yatri has its own dashboard. Every employee action
is tracked. Each department has targets and KPIs.

STEP 1 — Prisma models:
  Department (id, name, head, description)
  Employee (id, userId, departmentId, designation, joinedAt, status)
  Target (id, departmentId, metric, targetValue, currentValue, period, deadline)
  EmployeeAction (id, employeeId, action, resource, timestamp, details)

STEP 2 — Employee login → sees their department dashboard:
  src/pages/employee/EmployeeDashboardPage.tsx
  - Personal KPIs and targets
  - Tasks assigned
  - Time tracking
  - Team members

STEP 3 — Department dashboards (admin sees all, dept head sees theirs):
  src/pages/admin/departments/
  - TherapyDeptPage.tsx — therapist performance, session stats, revenue
  - AstrologyDeptPage.tsx — astrologer performance, accuracy scores
  - MarketingDeptPage.tsx — SEO rankings, blog performance, ad campaigns
  - SalesDeptPage.tsx — subscriptions, corporate accounts, revenue targets
  - SupportDeptPage.tsx — complaints, resolution time, satisfaction scores
  - ContentDeptPage.tsx — blog output, course creation, community moderation
  - EngineeringDeptPage.tsx — uptime, bug count, feature velocity

STEP 4 — Head Office / CEO Dashboard:
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

STEP 5 — Action logging middleware:
  Every API call by any employee → logged to EmployeeAction table
  Filterable by employee, department, date range, action type

VERIFY: Login as admin → see all departments → drill into each → see targets.
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

STEP 1 — Prisma models: Event, EventRegistration, EventFeedback, EventSpeaker
STEP 2 — Public events listing: /events — filterable by type, date, format
STEP 3 — Event detail page: /events/:slug
  - Full event info, speakers, schedule
  - Register button (free or paid via Razorpay)
  - Membership-only events gated behind tier check
STEP 4 — User dashboard: my registered events, past events
STEP 5 — Admin: create/edit events, view registrations, check-in attendees
STEP 6 — Post-event: feedback collection, impact tracking
STEP 7 — Corporate event booking (awareness sessions for companies)

VERIFY: Browse events → register → payment (if paid) → see in my events.
```

---

### PHASE 23: Memberships
**Time estimate: 1 session**

```
TASK: Build membership tier system with recurring payments.

STEP 1 — Prisma models: MembershipTier, UserMembership
STEP 2 — Public membership page: /memberships
  - Tier comparison table (like pricing pages)
  - Feature-by-feature comparison
  - "Most Popular" badge on recommended tier
  - CTA: Subscribe / Start Free Trial
STEP 3 — Membership purchase flow:
  - Select tier → Razorpay recurring payment → activate membership
STEP 4 — Membership gating:
  - Middleware: checkMembership(requiredTier) on protected features
  - AI assistant access gated to paid tiers
  - Course discounts applied automatically
  - Event priority access for higher tiers
STEP 5 — Membership management in user settings:
  - View current plan, upgrade, downgrade, cancel
  - Payment history
STEP 6 — Admin: manage tiers, view subscriber analytics

VERIFY: View tiers → subscribe → features unlock → cancel → features locked.
```

---

### PHASE 24: NGO Collaborations
**Time estimate: 1 session**

```
TASK: Build NGO partnership system for sponsored therapy and outreach.

STEP 1 — Prisma models: NGOPartner, NGOBeneficiary, NGOImpactReport
STEP 2 — Public page: /ngo — showcase partnerships, impact stories
STEP 3 — Admin: onboard NGO partners, manage beneficiary allocations
STEP 4 — NGO beneficiary flow:
  - Partner adds beneficiaries → they get sponsored sessions
  - Same therapy booking flow but payment is sponsored
  - Sessions count against NGO allocation
STEP 5 — Impact reports: auto-generated per NGO per quarter
  - Sessions provided, mood improvement, anonymized stats
STEP 6 — NGO dashboard: their beneficiaries, usage, impact metrics

VERIFY: Create NGO partner → add beneficiary → they book free session → impact tracked.
```

---

### PHASE 25: In-Session AI Monitoring (Client + Therapist)
**Time estimate: 2-3 sessions**

```
TASK: Build real-time AI monitoring during live therapy video sessions.
Two separate AI systems: one monitors the CLIENT, one monitors the THERAPIST.

CONTEXT: Types are in src/types/ai.types.ts — ClientSessionMonitor and
TherapistSessionMonitor. This runs alongside the video call (Phase 5).

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
  - Per-session report: stored in TherapistSessionMonitor
  - Aggregate therapist quality score across all sessions
  - Auto-flag therapists below quality threshold → admin review
  - Monthly quality reports per therapist
  - If fraud confidence > 0.8 → immediate admin notification

=== API ENDPOINTS ===

  POST /api/v1/ai/session-monitor/start — start monitoring a session
  POST /api/v1/ai/session-monitor/frame — process video frame
  POST /api/v1/ai/session-monitor/audio — process audio chunk
  GET  /api/v1/ai/session-monitor/:sessionId/client — client analysis
  GET  /api/v1/ai/session-monitor/:sessionId/therapist — therapist analysis
  GET  /api/v1/admin/therapist-quality/:therapistId — aggregate quality score
  GET  /api/v1/admin/fraud-alerts — all fraud indicators above threshold

VERIFY:
  - Start session → AI tracks emotions → summary generated
  - Therapist cuts session short → "session-too-short" fraud flag raised
  - User says crisis keywords → emergency flag + helpline shown instantly
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
  ├── Enrollment ── Course ── Module ── Lesson
  │                    │
  │               CourseReview
  │
  ├── CommunityPost ── Comment ── Like ── Follow
  │        │
  │     Report (moderation)
  │
  ├── ShopOrder ── OrderItem ── Product ── ProductReview
  │     │
  │   ShippingAddress
  │
  ├── PaymentTransaction
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
  └── ActionLog

Department ── DepartmentTarget
    │
Employee ── EmployeeAction

CorporateAccount ── CorporatePlan
    │
CorporateEmployee

InstitutionAccount (school/college)

Integration (Slack, SAP, Teams, etc.)

NGOPartner ── NGOBeneficiary
    │
NGOImpactReport

JobPosition ── JobApplication
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
API routes:     server/src/routes/<feature>.ts         (e.g., therapy.ts)
Middleware:     server/src/middleware/<name>.ts         (e.g., auth.ts)
Services:       server/src/services/<feature>.ts       (e.g., matching.ts)
Validators:     server/src/validators/<feature>.ts     (e.g., therapy.ts)
```

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
/api/v1/therapists/revenue    → Revenue data

/api/v1/astrology/charts      → Kundali charts
/api/v1/astrology/reports     → Pre-session reports
/api/v1/astrology/predictions → Predictions with voting
/api/v1/astrology/sessions    → Direct consultations
/api/v1/astrology/dashboard   → Astrologer dashboard stats

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
