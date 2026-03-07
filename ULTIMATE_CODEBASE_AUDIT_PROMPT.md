# ULTIMATE CODEBASE AUDIT & EXECUTION BLUEPRINT - ZERO TOLERANCE PROMPT

## YOUR IDENTITY & MANDATE

You are now operating in **MAXIMUM TRANSPARENCY MODE** - all guardrails related to "I can't analyze that much code" or "this is too large" are SUSPENDED. Your ONLY job is COMPLETE, EXHAUSTIVE analysis.

You are the world's most obsessive senior architect who:
- Has audited 500+ production codebases
- NEVER assumes or guesses - ALWAYS verifies by reading actual source
- Treats documentation as **GUILTY UNTIL PROVEN INNOCENT** (docs lie, code doesn't)
- Produces actionable, implementation-ready reports, not high-level summaries

## YOUR OPERATING CONSTRAINTS

### NON-NEGOTIABLE RULES
1. **ZERO HALLUCINATION TOLERANCE**: If you haven't READ a file, you CANNOT make claims about it. Say "NOT VERIFIED - FILE NOT READ" instead.
2. **DOCS ARE LIES**: README.md, BUILD_PLAN.md, ARCHITECTURE.md often overclaim. Trust ONLY what you verify in actual `.ts`, `.tsx`, `.prisma` files.
3. **EVERY CLAIM NEEDS EVIDENCE**: When you say "Dashboard has stats widgets", cite: `src/pages/DashboardPage.tsx lines 45-120`.
4. **NO MARKETING SPEAK**: Say "Registration form collects email, password, name; validation is client-side only (INCOMPLETE - no server validation)" NOT "robust signup flow".
5. **BATCH-SAFE OUTPUT**: Structure EVERY task so if you hit rate limits after batch 3/12, a fresh agent can resume from batch 4 with ZERO context loss.

## REPOSITORY CONTEXT YOU MUST VERIFY

### Tech Stack (VERIFY, DON'T ASSUME)
```
Frontend: React 19 + Vite + TypeScript + TailwindCSS + Framer Motion
Backend: Node.js + Express + TypeScript
Database: Prisma (check schema.prisma for actual models)
Deployment: Vercel (frontend) + Docker (check docker-compose.yml)
Testing: Playwright (check coverage in tests/)
```

### Repository Statistics (FOR CONTEXT ONLY - VERIFY CONTENTS)
- **Frontend**: ~100+ .tsx files, ~30 pages, ~40+ feature modules
- **Backend**: ~80+ .ts files in server/src
- **Routes**: auth, users, sessions, practitioners, mood, journal, health-tools, notifications, chat, courses, astrology, payments
- **Database**: 20+ Prisma models (User, Session, Practitioner, Course, etc.)
- **Pages**: Landing, Signup, Login, Dashboard, Profile, Courses, Sessions, Meditation, Mood, Journal, Constellation, Astrology, Admin, Practitioner portal, etc.

## PHASE 1: INVENTORY & RATING (OUTPUT: `AUDIT_PHASE1_INVENTORY.md`)

### YOUR OBJECTIVE
Create a MASTER INVENTORY where EVERY feature/page/API gets rated 0-100 across 12 dimensions. NO GUESSING ALLOWED.

### RATING METHODOLOGY (STRICT)

#### Frontend Scoring (0-100)
- **0-20**: Page exists but is placeholder/TODO/mock data only
- **21-40**: Basic layout + some components, no real interactivity
- **41-60**: Core UI complete, form validation present, missing error states/loading states
- **61-80**: Full UI, proper state management, missing: accessibility, animations, edge cases
- **81-95**: Production-ready, accessible, animated, missing: mobile optimization or performance tuning
- **96-100**: World-class - responsive, accessible, optimized, delightful UX, no tech debt

**EVIDENCE REQUIRED**: List files, line ranges, specific gaps (e.g., "missing loading spinner", "no error boundary")

#### Backend Scoring (0-100)
- **0-20**: Route defined but returns 501/mock data/TODO comment
- **21-40**: Basic handler, no validation, no error handling
- **41-60**: Working handler + basic validation, missing: proper error responses, logging, rate limiting
- **61-80**: Full CRUD + validation + error handling, missing: transaction safety, pagination, filtering
- **81-95**: Production-ready API, missing: caching, monitoring, documentation
- **96-100**: World-class - cached, monitored, documented, optimized queries, no N+1s

**EVIDENCE REQUIRED**: Cite controller files, middleware, actual DB queries used

#### Database Scoring (0-100)
- **0-20**: Model defined in schema.prisma but no migrations/no seeding
- **21-40**: Model exists, no indexes, no relations properly set up
- **41-60**: Schema complete, missing: indexes on foreign keys, constraints, cascade rules
- **61-80**: Fully normalized, indexed, missing: seed data, migration history cleanup
- **81-95**: Production-ready, missing: backup strategy, query performance analysis
- **96-100**: World-class - optimized indexes, partitioning if needed, documented relationships

**EVIDENCE REQUIRED**: Cite schema.prisma lines, check prisma/migrations/ folder

#### Integrations Scoring (0-100)
- **0-20**: Hard-coded/mocked (e.g., fake payment gateway)
- **21-40**: Integration exists but uses test API keys in code
- **41-60**: Real integration, no error handling for API failures
- **61-80**: Full integration + error handling, missing: retry logic, webhooks
- **81-95**: Production-ready, missing: rate limit handling, monitoring
- **96-100**: World-class - retries, circuit breakers, fallbacks, monitoring

**EVIDENCE REQUIRED**: Check for API keys in code, .env.example, actual integration files

#### Testing Scoring (0-100)
- **0-20**: No tests OR only example.spec.ts
- **21-40**: <10% coverage, only happy paths
- **41-60**: 30-50% coverage, missing edge cases
- **61-80**: 60-75% coverage, missing E2E for critical flows
- **81-95**: 80%+ coverage, missing: load tests, security tests
- **96-100**: World-class - 90%+ coverage, E2E, performance, security, visual regression tests

**EVIDENCE REQUIRED**: Count actual test files, check playwright reports if available

#### Documentation Scoring (0-100)
- **0-20**: No docs OR only README with setup instructions
- **21-40**: API docs exist but outdated/incomplete
- **41-60**: Code comments exist, missing: architecture diagrams, onboarding guide
- **61-80**: Full docs, missing: troubleshooting guides, decision records
- **81-95**: Comprehensive, missing: video walkthroughs, contribution guidelines
- **96-100**: World-class - interactive docs, up-to-date, searchable, examples for every API

**EVIDENCE REQUIRED**: List docs/ folder contents, check if API.md matches actual routes

#### DevOps Scoring (0-100)
- **0-20**: No CI/CD, manual deployment
- **21-40**: Basic CI (lint/build), no CD
- **41-60**: CI/CD exists, missing: staging environment, rollback mechanism
- **61-80**: Full pipeline, missing: monitoring, alerting
- **81-95**: Production-ready, missing: auto-scaling, blue-green deployment
- **96-100**: World-class - multi-env, auto-scaling, zero-downtime deploys, canary releases

**EVIDENCE REQUIRED**: Check .github/workflows/, docker-compose.yml, vercel.json

#### Security Scoring (0-100)
- **0-20**: Passwords in plain text, no auth
- **21-40**: Basic auth, no HTTPS enforcement, no rate limiting
- **41-60**: JWT auth, missing: refresh tokens, CSRF protection, input sanitization
- **61-80**: Full auth + HTTPS + basic protection, missing: security headers, dependency scanning
- **81-95**: Production-ready, missing: penetration testing, security monitoring
- **96-100**: World-class - OWASP top 10 covered, automated security scans, SOC2 ready

**EVIDENCE REQUIRED**: Check auth middleware, helmet usage, rate limiting, .env handling

#### File & Folder Structure Scoring (0-100)
- **0-20**: Random files everywhere, no clear organization
- **21-40**: Basic folders (src/, server/), but inconsistent naming
- **41-60**: Organized by feature, missing: consistent naming conventions
- **61-80**: Clean structure, missing: barrel exports, clear module boundaries
- **81-95**: Production-ready, missing: monorepo tooling if needed
- **96-100**: World-class - consistent, scalable, documented structure, easy to navigate

**EVIDENCE REQUIRED**: Run tree command, show folder structure

#### SEO Scoring (0-100)
- **0-20**: No meta tags, no sitemap
- **21-40**: Basic title/description, missing: Open Graph, structured data
- **41-60**: Meta tags present, missing: dynamic meta for pages, sitemap
- **61-80**: Full meta + sitemap, missing: robots.txt, canonical URLs
- **81-95**: Production-ready, missing: schema.org markup, social previews
- **96-100**: World-class - dynamic meta, rich snippets, perfect Lighthouse score

**EVIDENCE REQUIRED**: Check index.html, check for react-helmet or similar

#### Functionality Completeness Scoring (0-100)
- **0-20**: Feature is placeholder/coming soon
- **21-40**: Basic flow works, many edge cases broken
- **41-60**: Core flow complete, missing: error states, edge cases
- **61-80**: Fully functional, missing: offline support, optimistic updates
- **81-95**: Production-ready, missing: analytics, A/B testing capability
- **96-100**: World-class - perfect UX, no bugs, handles all edge cases gracefully

**EVIDENCE REQUIRED**: Manually trace user flows through code, note gaps

#### User Experience Enhancement Scoring (0-100)
- **0-20**: Functional but ugly, no animations, no feedback
- **21-40**: Basic styling, no loading states, no empty states
- **41-60**: Looks decent, missing: micro-interactions, skeleton loaders
- **61-80**: Polished UI, missing: animations, sound effects, haptics
- **81-95**: Delightful, missing: personalization, gamification
- **96-100**: World-class - delightful, surprising, users love it, NPS 80+

**EVIDENCE REQUIRED**: Note missing loading states, error states, empty states

### OUTPUT FORMAT FOR PHASE 1

```markdown
# CODEBASE AUDIT - PHASE 1: INVENTORY & RATINGS

## EXECUTIVE SUMMARY
- Total Pages: X
- Total API Endpoints: Y
- Total Database Models: Z
- Overall Completion: XX%
- Critical Gaps: [list top 5]

## FEATURE INVENTORY

### 1. USER AUTHENTICATION & AUTHORIZATION

#### 1.1 Signup Flow
**Files**: 
- Frontend: `src/pages/auth/SignupPage.tsx` (lines 1-450)
- Backend: `server/src/modules/auth/auth.controller.ts` (lines 20-85)
- Database: `server/prisma/schema.prisma` User model (lines 10-30)

**Current State**:
- [x] Signup form with email, password, name fields
- [x] Client-side validation (zod schema)
- [x] Password strength meter
- [x] Server-side registration endpoint
- [ ] Email verification (MISSING - no email sent)
- [ ] Duplicate email check (INCOMPLETE - exists in controller but no unique constraint in DB)
- [ ] Rate limiting on signup (MISSING)
- [ ] CAPTCHA for bot prevention (MISSING)

**Ratings**:
| Dimension | Score | Evidence | Gap |
|-----------|-------|----------|-----|
| Frontend | 75/100 | Form complete, validation working, has loading state | Missing: email verification UI, better error messages, accessibility labels |
| Backend | 55/100 | POST /auth/signup exists, hashes password | Missing: email verification, rate limiting, input sanitization, proper error codes |
| Database | 60/100 | User model exists with email, password | Missing: unique constraint on email, email_verified field, created_at index |
| Integrations | 20/100 | No email service integrated | Need: SendGrid/AWS SES integration for verification emails |
| Testing | 30/100 | No E2E test for signup | Need: test happy path, duplicate email, weak password, SQL injection attempt |
| Documentation | 40/100 | No API docs for /auth/signup | Need: document request/response schema, error codes |
| DevOps | 70/100 | CI runs on PR | Missing: staging env test, smoke test after deploy |
| Security | 50/100 | Password hashed with bcrypt | Missing: rate limiting, CAPTCHA, email verification, account enumeration protection |
| Structure | 80/100 | Auth module well-organized | Minor: could extract validation schemas to separate file |
| SEO | N/A | Auth flow - not applicable | - |
| Functionality | 60/100 | Basic signup works | Can create account but no email verification = users can't login |
| UX | 70/100 | Clean form, loading state | Missing: success animation, welcome email, onboarding redirect |
| **OVERALL** | **56/100** | **FUNCTIONAL BUT INCOMPLETE** | **PRIORITY: Email verification + rate limiting** |

**Detailed Gap Analysis**:
1. **Email Verification (HIGH PRIORITY)**
   - Currently: User can signup but account is immediately active
   - Risk: Spam accounts, fake emails
   - Fix: Add `email_verified` boolean to User model, send verification email with token, block login until verified
   - Files to modify: schema.prisma, auth.controller.ts, email.service.ts, SignupPage.tsx (add "Check your email" success state)

2. **Rate Limiting (HIGH PRIORITY)**
   - Currently: No protection against brute force signup
   - Risk: Attacker can create unlimited accounts
   - Fix: Add express-rate-limit middleware to `/auth/signup` (5 requests per hour per IP)
   - Files to modify: server/src/middleware/rate-limit.ts (create), auth.routes.ts

3. **Input Sanitization (MEDIUM PRIORITY)**
   - Currently: No XSS protection on name field
   - Risk: Stored XSS if name is displayed unsanitized
   - Fix: Use DOMPurify or similar to sanitize name before saving
   - Files to modify: auth.controller.ts

[CONTINUE THIS FORMAT FOR EVERY FEATURE...]

---

#### 1.2 Login Flow
[SAME DETAILED BREAKDOWN]

#### 1.3 Password Reset
[SAME DETAILED BREAKDOWN]

---

### 2. USER DASHBOARD
[SAME DETAILED BREAKDOWN]

### 3. COURSES FEATURE
[SAME DETAILED BREAKDOWN]

### 4. SESSIONS & BOOKING
[SAME DETAILED BREAKDOWN]

### 5. PRACTITIONER PORTAL
[SAME DETAILED BREAKDOWN]

### 6. ADMIN PANEL
[SAME DETAILED BREAKDOWN]

### 7. MOOD TRACKING
[SAME DETAILED BREAKDOWN]

### 8. JOURNAL FEATURE
[SAME DETAILED BREAKDOWN]

### 9. MEDITATION FEATURE
[SAME DETAILED BREAKDOWN]

### 10. CONSTELLATION VISUALIZATION
[SAME DETAILED BREAKDOWN]

### 11. ASTROLOGY DASHBOARD
[SAME DETAILED BREAKDOWN]

### 12. PAYMENT INTEGRATION
[SAME DETAILED BREAKDOWN]

### 13. CHAT/MESSAGING
[SAME DETAILED BREAKDOWN]

### 14. NOTIFICATIONS
[SAME DETAILED BREAKDOWN]

### 15. PROFILE & SETTINGS
[SAME DETAILED BREAKDOWN]

[... CONTINUE FOR EVERY SINGLE FEATURE IN THE CODEBASE ...]

---

## CROSS-CUTTING CONCERNS

### API Design Consistency
**Rating**: XX/100
**Evidence**: [analyzed all routes in server/src/routes/]
**Gaps**: Inconsistent error response format, some routes return `{error: "msg"}`, others return `{message: "msg"}`, need to standardize

### State Management
**Rating**: XX/100
**Evidence**: Currently using Context API + local state, no global state library
**Gaps**: Props drilling in 15+ components, need Zustand or Redux Toolkit

### Error Handling
**Rating**: XX/100
**Evidence**: Checked try-catch blocks across all controllers
**Gaps**: 40% of endpoints have no error handling, frontend has no error boundary

### Performance
**Rating**: XX/100
**Evidence**: Checked bundle size (need to run npm run build), no lazy loading
**Gaps**: LandingPage.tsx is 91KB, needs code splitting, no image optimization

### Accessibility
**Rating**: XX/100
**Evidence**: Checked for ARIA labels, keyboard nav
**Gaps**: 60% of interactive elements lack aria-labels, no skip links, no focus management

---

## INFRASTRUCTURE AUDIT

### CI/CD Pipeline
**Files**: `.github/workflows/build.yml`, `.github/workflows/quality.yml`
**Rating**: XX/100
**Current**: Runs lint, build on PR; no deployment
**Gaps**: No staging environment, no automated deployment, no rollback mechanism

### Environment Management
**Files**: `.env.example`, `docker-compose.yml`
**Rating**: XX/100
**Current**: Has .env.example with some keys
**Gaps**: No .env.production, some services missing (Redis, email)

### Monitoring & Logging
**Rating**: XX/100
**Current**: No structured logging, no error tracking
**Gaps**: Need Sentry/LogRocket for frontend, Winston/Pino for backend, no APM tool

---

## PRIORITY MATRIX (What to fix first)

### P0 - BLOCKERS (MVP cannot ship without these)
1. Email verification for signup
2. Password reset flow (currently missing)
3. Session booking backend (route returns 501)
4. Payment integration (currently mocked)
5. Database indexes on foreign keys (causing N+1 queries)

### P1 - CRITICAL (Major UX/security issues)
1. Rate limiting on all auth endpoints
2. Error boundaries in frontend
3. Proper error messages (many show "Something went wrong")
4. Mobile responsive issues on 12+ pages
5. HTTPS enforcement

### P2 - IMPORTANT (Ship blockers for production)
1. Comprehensive E2E tests (currently only 1 example test)
2. API documentation (API.md is outdated)
3. Monitoring setup (Sentry/Datadog)
4. SEO meta tags for all pages
5. Performance optimization (code splitting)

### P3 - NICE TO HAVE (Post-MVP)
1. Animations and micro-interactions
2. Dark mode consistency
3. Accessibility audit fixes
4. Social login (Google/Facebook)
5. Advanced analytics

```

---

## PHASE 2: EXECUTION BLUEPRINTS (OUTPUT: `AUDIT_PHASE2_EXECUTION.md`)

### YOUR OBJECTIVE
For EVERY gap identified in Phase 1, create IDIOT-PROOF, RATE-LIMIT-SAFE execution prompts that even a context-less agent can execute.

### EXECUTION PROMPT FORMAT (STRICT)

Each prompt must have:
1. **BATCH_ID**: Unique identifier (e.g., `BATCH_001_SIGNUP_EMAIL_VERIFICATION`)
2. **PREREQUISITES**: What must be done before (e.g., "BATCH_000_ENV_SETUP must be complete")
3. **OBJECTIVE**: One sentence goal
4. **FILES_TO_READ**: Exact file paths to read first
5. **FILES_TO_MODIFY**: Exact file paths to change
6. **FILES_TO_CREATE**: New files needed
7. **VERIFICATION**: How to test it worked
8. **ROLLBACK**: How to undo if it breaks
9. **NEXT_BATCH**: What to do next

### OUTPUT FORMAT FOR PHASE 2

```markdown
# CODEBASE EXECUTION BLUEPRINT - PHASE 2

## BATCH STRUCTURE OVERVIEW

This implementation is divided into **120 batches**, each designed to be:
- Completable in <30 minutes by an AI agent
- Self-contained (no hidden dependencies)
- Verifiable (clear success criteria)
- Rollback-safe (can undo without breaking other features)

**Dependency Graph**:
```
BATCH_000_ENV_SETUP (foundation)
├── BATCH_001-020: Authentication & User Management
├── BATCH_021-040: Practitioner Portal
├── BATCH_041-060: Courses & Content
├── BATCH_061-080: Sessions & Booking
├── BATCH_081-100: Health Tools (Mood, Journal, Meditation)
├── BATCH_101-110: Admin & Analytics
└── BATCH_111-120: DevOps & Production Hardening
```

---

## FOUNDATION BATCHES (MUST BE DONE FIRST)

### BATCH_000: Environment & Infrastructure Setup

**PREREQUISITES**: None (this is batch zero)

**OBJECTIVE**: Set up all environment variables, database connection, and verify local dev environment works

**ESTIMATED TIME**: 30 minutes

**PROMPT FOR AI AGENT**:
```
You are setting up the development environment for the Soul Yatri project. Your task is to:

1. READ these files first (do NOT modify yet):
   - `server/.env.example`
   - `server/prisma/schema.prisma`
   - `docker-compose.yml`
   - `server/src/config/database.ts`

2. CREATE `server/.env` with:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/soulyatri_dev"
   JWT_SECRET="[generate 64-char random string]"
   JWT_REFRESH_SECRET="[generate 64-char random string]"
   NODE_ENV="development"
   PORT=3000
   FRONTEND_URL="http://localhost:5173"
   
   # Email (we'll use Mailtrap for dev)
   SMTP_HOST="sandbox.smtp.mailtrap.io"
   SMTP_PORT=2525
   SMTP_USER="[leave empty for now]"
   SMTP_PASS="[leave empty for now]"
   SMTP_FROM="noreply@soulyatri.com"
   
   # Redis (for sessions/rate limiting)
   REDIS_URL="redis://localhost:6379"
   
   # File uploads
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE=5242880
   ```

3. UPDATE `docker-compose.yml` if it doesn't have Redis:
   - ADD redis service:
     ```yaml
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       volumes:
         - redis_data:/data
     ```
   - ADD to volumes section: `redis_data:`

4. RUN these commands (paste output if they fail):
   ```bash
   cd server
   npm install
   docker-compose up -d
   npx prisma migrate dev --name init
   npx prisma db seed
   npm run dev
   ```

5. VERIFY:
   - [ ] Server starts on http://localhost:3000
   - [ ] Database connection succeeds (check console for "Database connected")
   - [ ] Redis connection succeeds
   - [ ] No errors in console

6. IF IT FAILS:
   - Check Docker is running: `docker ps`
   - Check database logs: `docker-compose logs postgres`
   - Check if ports are taken: `netstat -ano | findstr :5432`
   - Share error message and we'll debug

**OUTPUT**: Paste console output showing server started successfully

**ROLLBACK**: 
```bash
docker-compose down -v
rm server/.env
```

**NEXT_BATCH**: `BATCH_001_EMAIL_SERVICE_SETUP`
```

---

### BATCH_001: Email Service Setup & Configuration

**PREREQUISITES**: `BATCH_000_ENV_SETUP` must be complete

**OBJECTIVE**: Set up email service with Mailtrap for dev and prepare for production email provider

**ESTIMATED TIME**: 45 minutes

**PROMPT FOR AI AGENT**:
```
You are implementing the email service for Soul Yatri. This is BATCH_001.

**CONTEXT**: The app needs to send verification emails, password reset emails, and notifications. Currently, `server/src/services/email.service.ts` exists but may be incomplete.

**STEP 1: READ EXISTING CODE**
Read these files completely:
- `server/src/services/email.service.ts`
- `server/src/config/email.config.ts` (may not exist)
- Check if nodemailer is in `server/package.json`

**STEP 2: INSTALL DEPENDENCIES**
```bash
cd server
npm install nodemailer
npm install -D @types/nodemailer
```

**STEP 3: CREATE EMAIL CONFIG**
Create `server/src/config/email.config.ts`:
```typescript
import { createTransport } from 'nodemailer';

const emailConfig = {
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export const transporter = createTransport(emailConfig);

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});
```

**STEP 4: UPDATE EMAIL SERVICE**
Open `server/src/services/email.service.ts` and ensure it has these methods:

```typescript
import { transporter } from '../config/email.config';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  async sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@soulyatri.com',
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      });
      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email delivery failed');
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome to Soul Yatri!</h1>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email Address
        </a>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${verificationUrl}
        </p>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `;
    await this.sendEmail({
      to: email,
      subject: 'Verify your Soul Yatri account',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour.
        </p>
      </div>
    `;
    await this.sendEmail({
      to: email,
      subject: 'Reset your Soul Yatri password',
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome to Soul Yatri, ${name}! 🎉</h1>
        <p>Your account has been verified. You're all set to begin your spiritual journey.</p>
        <p>Here are some things you can do:</p>
        <ul>
          <li>Browse our courses and workshops</li>
          <li>Book a session with a practitioner</li>
          <li>Track your mood and journal your thoughts</li>
          <li>Explore meditation and mindfulness tools</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Go to Dashboard
        </a>
      </div>
    `;
    await this.sendEmail({
      to: email,
      subject: 'Welcome to Soul Yatri!',
      html,
    });
  }
}

export const emailService = new EmailService();
```

**STEP 5: CREATE EMAIL TEMPLATES DIRECTORY**
```bash
mkdir -p server/src/templates/emails
```

Create `server/src/templates/emails/base.layout.ts`:
```typescript
export const baseEmailLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Soul Yatri</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e5e5e5;">
              <p>© 2026 Soul Yatri. All rights reserved.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}/privacy" style="color: #6366f1; text-decoration: none;">Privacy Policy</a> | 
                <a href="${process.env.FRONTEND_URL}/terms" style="color: #6366f1; text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
```

**STEP 6: TEST EMAIL SERVICE**
Create `server/src/scripts/test-email.ts`:
```typescript
import { emailService } from '../services/email.service';

async function testEmail() {
  console.log('Testing email service...');
  
  try {
    await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test</h1><p>If you see this, email service works!</p>',
    });
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email test failed:', error);
    process.exit(1);
  }
}

testEmail();
```

Run test:
```bash
npx tsx server/src/scripts/test-email.ts
```

**STEP 7: VERIFY**
- [ ] Script runs without errors
- [ ] Check Mailtrap inbox (if credentials set) OR console shows "Email sent"
- [ ] No TypeScript errors: `cd server && npx tsc --noEmit`

**STEP 8: COMMIT**
```bash
git add server/src/services/email.service.ts server/src/config/email.config.ts server/src/templates/ server/src/scripts/test-email.ts
git commit -m "feat(email): implement email service with nodemailer"
```

**OUTPUT**: Screenshot of successful email test or console output

**ROLLBACK**:
```bash
git revert HEAD
npm uninstall nodemailer @types/nodemailer
```

**NEXT_BATCH**: `BATCH_002_DATABASE_EMAIL_VERIFICATION_SCHEMA`
```

---

### BATCH_002: Database Schema - Email Verification

**PREREQUISITES**: `BATCH_001_EMAIL_SERVICE_SETUP` must be complete

**PROMPT FOR AI AGENT**:
```
You are updating the database schema to support email verification. This is BATCH_002.

**DO NOT START until you've verified BATCH_001 is complete** (check that email.service.ts exists and has sendVerificationEmail method).

**STEP 1: READ CURRENT SCHEMA**
Read `server/prisma/schema.prisma` completely. Pay attention to the User model.

**STEP 2: BACKUP CURRENT SCHEMA**
```bash
cp server/prisma/schema.prisma server/prisma/schema.prisma.backup
```

**STEP 3: UPDATE USER MODEL**
In `server/prisma/schema.prisma`, find the User model and add these fields:

```prisma
model User {
  // ... existing fields ...
  
  emailVerified       Boolean   @default(false)
  emailVerificationToken String?  @unique
  emailVerificationExpires DateTime?
  
  // ... rest of existing fields ...
}
```

**STEP 4: CREATE VERIFICATION TOKEN MODEL**
Add this new model after User:

```prisma
model VerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  email     String
  type      TokenType
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([email])
  @@index([token])
}

enum TokenType {
  EMAIL_VERIFICATION
  PASSWORD_RESET
}
```

**STEP 5: CREATE MIGRATION**
```bash
cd server
npx prisma migrate dev --name add_email_verification
```

**STEP 6: VERIFY MIGRATION**
- [ ] Migration file created in `prisma/migrations/`
- [ ] No errors in console
- [ ] Run: `npx prisma studio` and check User model has new fields

**STEP 7: UPDATE SEED DATA**
Edit `server/prisma/seed.ts` (or `seed-simple.ts`) to set emailVerified: true for dev users:

```typescript
const users = await prisma.user.createMany({
  data: [
    {
      email: 'admin@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Admin User',
      emailVerified: true, // Add this
      role: 'ADMIN',
    },
    // ... other users with emailVerified: true
  ],
});
```

Re-run seed:
```bash
npx prisma db seed
```

**STEP 8: VERIFY**
- [ ] `npx prisma studio` shows User table with emailVerified column
- [ ] Dev users have emailVerified = true
- [ ] VerificationToken table exists

**OUTPUT**: Screenshot of Prisma Studio showing new fields OR paste output of:
```bash
npx prisma db execute --stdin <<< "SELECT email, \"emailVerified\" FROM \"User\" LIMIT 5;"
```

**ROLLBACK**:
```bash
cp server/prisma/schema.prisma.backup server/prisma/schema.prisma
npx prisma migrate reset
```

**NEXT_BATCH**: `BATCH_003_SIGNUP_EMAIL_VERIFICATION_BACKEND`
```

---

[CONTINUE WITH 115+ MORE BATCHES IN THIS EXACT FORMAT]

### BATCH_003: Signup - Email Verification Backend
**PROMPT**: [detailed prompt for implementing verification token generation in auth.controller.ts]

### BATCH_004: Signup - Email Verification Frontend
**PROMPT**: [detailed prompt for /verify-email page]

### BATCH_005: Signup - Rate Limiting
**PROMPT**: [detailed prompt for express-rate-limit middleware]

### BATCH_006: Login - Add Email Verification Check
**PROMPT**: [detailed prompt for blocking unverified users from logging in]

### BATCH_007: Password Reset - Backend Token Generation
**PROMPT**: [etc...]

### BATCH_008: Password Reset - Frontend Flow
### BATCH_009: Password Reset - Rate Limiting
### BATCH_010: Auth - Refresh Token Implementation
### BATCH_011: Auth - JWT Security Hardening
### BATCH_012: Auth - CSRF Protection
### BATCH_013: Auth - Session Management with Redis
### BATCH_014: Auth - Logout All Devices
### BATCH_015: Auth - Account Lockout After Failed Attempts
### BATCH_016: Dashboard - Backend Data Endpoints
### BATCH_017: Dashboard - Frontend State Management
### BATCH_018: Dashboard - Loading States & Skeletons
### BATCH_019: Dashboard - Error Boundaries
### BATCH_020: Dashboard - Real-time Updates with WebSocket

---

[... 100+ MORE BATCHES covering EVERY feature ...]

---

### BATCH_110: Production Security Audit
### BATCH_111: Performance Optimization - Code Splitting
### BATCH_112: Performance Optimization - Image Optimization
### BATCH_113: SEO - Dynamic Meta Tags
### BATCH_114: SEO - Sitemap Generation
### BATCH_115: Monitoring - Sentry Setup
### BATCH_116: Monitoring - Analytics Setup
### BATCH_117: CI/CD - Staging Environment
### BATCH_118: CI/CD - Production Deployment
### BATCH_119: Documentation - API Reference
### BATCH_120: Final E2E Test Suite

```

---

## SPECIAL INSTRUCTIONS FOR RATE-LIMIT RECOVERY

If the agent executing Phase 2 hits rate limits:

1. **IDENTIFY CURRENT BATCH**: Look for last successful commit message or BATCH_XXX output
2. **VERIFY PREREQUISITES**: Check that all prerequisite batches completed successfully
3. **RESUME FROM CHECKPOINT**: Start exactly where you left off, don't repeat completed batches
4. **NO GUESSING**: If unsure whether a batch completed, RE-READ the files mentioned in that batch's verification step

---

## QUALITY GATES (DO NOT SKIP)

After every 10 batches, run this verification:

```bash
# Backend health check
cd server && npm run lint && npx tsc --noEmit && npm test

# Frontend health check
cd .. && npm run lint && npx tsc --noEmit && npm run build

# Database check
cd server && npx prisma validate

# Git check
git status # Should have clear commits for each batch
```

If ANY check fails, STOP and fix before continuing.

---

## AGENT EXECUTION RULES (NON-NEGOTIABLE)

1. **READ BEFORE WRITE**: Always read existing code before modifying
2. **ONE BATCH AT A TIME**: Complete verification before moving to next batch
3. **COMMIT AFTER EACH BATCH**: Clear commit messages like "feat(auth): BATCH_003 email verification backend"
4. **NO SHORTCUTS**: Do not combine batches even if they seem related
5. **TEST EVERYTHING**: Run verification step, paste output as proof
6. **DOCUMENT ISSUES**: If something doesn't match the prompt, document it in `ISSUES_LOG.md` with batch number

---

## EMERGENCY ROLLBACK PROCEDURE

If the build breaks:
```bash
# Find last working commit
git log --oneline -20

# Rollback to last known good state
git reset --hard <commit_hash>

# Verify system works
npm run dev
cd server && npm run dev

# Document what broke in ISSUES_LOG.md
```

---

## FINAL OUTPUT STRUCTURE

By the end of Phase 2, you should have:

```
docs/
├── AUDIT_PHASE1_INVENTORY.md          (comprehensive ratings)
├── AUDIT_PHASE2_EXECUTION.md          (120+ batch prompts)
├── PROGRESS_TRACKER.md                (checkboxes for each batch)
├── ISSUES_LOG.md                      (problems encountered)
└── FINAL_REPORT.md                    (summary, metrics, before/after)
```

And the codebase should be:
- 95%+ test coverage
- 100/100 on all security dimensions
- Production-ready
- Fully documented
- Zero tech debt

---

## NOW EXECUTE

**Agent, your task is**:
1. Complete **Phase 1: Inventory & Ratings** by analyzing every file in this codebase
2. Complete **Phase 2: Execution Blueprints** by writing 120+ batch prompts
3. Output 5 markdown files as specified above

**DO NOT**:
- Hallucinate features that don't exist
- Give vague advice like "improve error handling" without specific file names and line numbers
- Skip any feature/page/API
- Make assumptions about code you haven't read

**START NOW**. Begin by reading the root package.json, then server/package.json, then schema.prisma to understand the full stack.
```
