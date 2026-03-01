# SOUL YATRI - NEXT BUILD STEPS (Ultra-Detailed AI Agent Guide)

> **CURRENT STATE**: Auth (Phase 1) is DONE. Landing, About, Business, Blogs pages have UI. Dashboard is a shell.
> **NEXT**: Phase 2 (User Onboarding) -> Phase 3 (Dashboard) -> Phase 16 (Health Tools) -> Phase 4 (Therapy Booking)
> **RULE**: Only build what's in MVP Phases 1-8, 13-14, 16-17, 25. Nothing else.

---

## PHASE 2: USER ONBOARDING FLOW (10-Step Wizard)

### WHAT EXISTS NOW
- `src/features/onboarding/screens/OnboardingSignupPage.tsx` - Welcome screen with 5 journey steps (DONE)
- `src/features/onboarding/screens/OnboardingCreateAccountPage.tsx` - Account creation form (DONE)
- `src/features/onboarding/screens/OnboardingAstrologyPage.tsx` - Astrology intake (DONE)
- `src/features/onboarding/screens/OnboardingPartnerDetailsPage.tsx` - Partner details (DONE)
- `src/pages/auth/SignupPage.tsx` - Multi-step router (handles steps: initial, account, astrology, partner-details)
- Auth API working: POST `/api/v1/auth/register` creates user, returns JWT

### WHAT NEEDS TO BE BUILT
After account creation, user needs a 10-step onboarding wizard collecting: name, DOB, gender, location, struggles, therapy history, goals, therapist preferences, interests, emergency contact.

Currently after signup the user goes to astrology page then journey-preparation then dashboard. We need to ADD the onboarding steps between account creation and dashboard.

---

### TASK 2.1: Backend - Onboarding API Endpoints

**Files to modify:**
- `server/prisma/schema.prisma` - Add UserProfile + OnboardingProgress models
- `server/src/routes/users.ts` - Implement onboarding endpoints
- NEW: `server/src/controllers/users.controller.ts`
- NEW: `server/src/validators/users.validator.ts`

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Implement user onboarding backend API

CONTEXT:
- Express + TypeScript backend at server/src/
- Prisma ORM with PostgreSQL, schema at server/prisma/schema.prisma
- Existing models: User, RefreshToken, AuditLog (read schema.prisma first)
- Auth middleware at server/src/middleware/auth.middleware.ts exports `requireAuth`
- Existing pattern: see server/src/controllers/auth.controller.ts for controller pattern
- Existing pattern: see server/src/validators/auth.validator.ts for Zod validator pattern
- Route file already exists: server/src/routes/users.ts (has stub endpoints returning 501)

STEP 1: Add Prisma models to server/prisma/schema.prisma:

model UserProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dateOfBirth     DateTime?
  gender          String?    // "male", "female", "non-binary", "prefer-not-to-say"
  city            String?
  state           String?
  country         String?
  struggles       String[] // Array: ["anxiety", "depression", "relationships", "stress", "grief", "anger", "self-esteem", "trauma", "addiction", "other"]
  therapyHistory  String?  // "never", "currently", "past", "considering"
  goals           String[] // Array: ["reduce-anxiety", "better-sleep", "relationships", "self-discovery", "career", "spiritual-growth", "trauma-healing", "confidence"]
  therapistPreferences Json?  // { gender: string, language: string[], approach: string }
  interests       String[] // Array: ["meditation", "yoga", "journaling", "breathing", "astrology", "community"]
  emergencyName   String?
  emergencyPhone  String?
  emergencyRelation String?
  onboardingStep  Int      @default(0) // 0-10, tracks progress
  onboardingComplete Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

Also add to the existing User model:
  profile UserProfile?

STEP 2: Run `npx prisma migrate dev --name add-user-profile` to create migration.

STEP 3: Create server/src/validators/users.validator.ts with Zod schemas:
- onboardingStepSchema: validates step number (1-10) and step-specific data
- Each step has its own shape:
  - Step 1: { dateOfBirth: string (ISO date) } (optional)
  - Step 2: { gender: string } (required, enum)
  - Step 3: { city: string, state?: string, country?: string } (city required)
  - Step 4: { struggles: string[] } (at least 1 required)
  - Step 5: { therapyHistory: string } (required, enum)
  - Step 6: { goals: string[] } (at least 1 required)
  - Step 7: { therapistPreferences: { gender?: string, language?: string[], approach?: string } }
  - Step 8: { interests: string[] } (at least 1 required)
  - Step 9: { emergencyName: string, emergencyPhone: string, emergencyRelation: string } (all required)
  - Step 10: {} (confirmation step, no data)

STEP 4: Create server/src/controllers/users.controller.ts:
- POST /onboarding handler:
  - Requires auth (use requireAuth middleware)
  - Accepts { step: number, data: object }
  - Upserts UserProfile for the authenticated user
  - Updates only the fields for that step
  - Updates onboardingStep to max(current, submitted step)
  - If step === 10, set onboardingComplete = true
  - Returns { success: true, data: { step, onboardingComplete } }

- GET /onboarding handler:
  - Requires auth
  - Returns current onboarding progress: { step: number, data: object, isComplete: boolean }
  - If no profile exists, returns { step: 0, data: {}, isComplete: false }

STEP 5: Update server/src/routes/users.ts:
- Replace the stub POST /onboarding with the real controller
- Replace the stub GET /profile with a handler that returns user + profile
- Keep other stubs as 501

IMPORTANT:
- Follow the EXACT pattern from auth.controller.ts (response format: { success: true, data: {...} })
- Use the requestBodyValidator middleware pattern from auth.validator.ts
- Import requireAuth from '../middleware/auth.middleware.js'
- All route imports use .js extension (ES modules)
- Run `npx prisma generate` after schema changes
- Test: `curl -X POST http://localhost:3000/api/v1/users/onboarding -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"step": 1, "data": {"dateOfBirth": "1995-06-15"}}'`
```

---

### TASK 2.2: Frontend - Onboarding Step Components (Steps 1-5)

**Files to create/modify:**
- `src/features/onboarding/screens/OnboardingWizardPage.tsx` - NEW: Main wizard container
- `src/features/onboarding/components/steps/StepDOB.tsx` - NEW
- `src/features/onboarding/components/steps/StepGender.tsx` - NEW
- `src/features/onboarding/components/steps/StepLocation.tsx` - NEW
- `src/features/onboarding/components/steps/StepStruggles.tsx` - NEW
- `src/features/onboarding/components/steps/StepTherapyHistory.tsx` - NEW
- `src/pages/auth/SignupPage.tsx` - Add new step routing

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build onboarding wizard steps 1-5 (frontend)

CONTEXT:
- React 19 + TypeScript + Vite frontend
- Tailwind CSS for styling (dark theme - bg-black, text-white)
- Design matches OnboardingSignupPage.tsx (read it first for style reference)
- The app uses react-router-dom v7, routes defined in src/router/index.tsx
- API service at src/services/api.service.ts (has get/post/put/delete methods)
- Auth context at src/context/AuthContext.tsx (provides user, isAuthenticated)
- framer-motion available for animations
- Radix UI components in src/components/ui/ (button, input, select, checkbox, radio, calendar, progress)
- lucide-react for icons

DESIGN REQUIREMENTS:
- Each step fills 100dvh, no scrolling
- Dark background (bg-black) with subtle ambient gradient blobs (see OnboardingSignupPage.tsx for pattern)
- Include Navigation component at top
- Progress bar at top showing step X of 10
- Animated transitions between steps (framer-motion slide left/right)
- "Skip" button for optional steps (steps 1, 7, 8)
- "Back" button on all steps except step 1
- "Continue" button at bottom, disabled until valid input
- Mobile-first, responsive

STEP 1: Create src/features/onboarding/screens/OnboardingWizardPage.tsx
- This is the main wizard container
- URL: /signup?step=onboarding&s=1 (through s=10)
- Reads `s` query param to know which sub-step
- Manages shared state for all step data using useState
- Renders the correct step component based on `s`
- Has progress bar: `<div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-white rounded-full transition-all" style={{ width: `${(step/10)*100}%` }} /></div>`
- Wraps step content in AnimatePresence + motion.div for slide transitions
- On each step submit: calls POST /api/v1/users/onboarding with { step, data }
- On final step: navigates to /journey-preparation
- Auto-loads progress on mount: GET /api/v1/users/onboarding (resume capability)

STEP 2: Create src/features/onboarding/components/steps/StepDOB.tsx
- Step 1: Date of Birth (OPTIONAL - can skip)
- Shows a clean date picker (use the calendar from src/components/ui/calendar.tsx or react-day-picker)
- Or 3 dropdowns: Day, Month, Year (1940-2010 range)
- Title: "When were you born?"
- Subtitle: "This helps us personalize your wellness journey"
- Skip button available
- Props: { value: string | null, onChange: (date: string) => void, onNext: () => void, onSkip: () => void }

STEP 3: Create src/features/onboarding/components/steps/StepGender.tsx
- Step 2: Gender (REQUIRED)
- 4 large selectable cards in a 2x2 grid:
  - Male (icon: User)
  - Female (icon: User)
  - Non-Binary (icon: Users)
  - Prefer not to say (icon: HelpCircle)
- Selected card has white border, subtle glow
- Title: "How do you identify?"
- Props: { value: string | null, onChange: (gender: string) => void, onNext: () => void, onBack: () => void }

STEP 4: Create src/features/onboarding/components/steps/StepLocation.tsx
- Step 3: Location (REQUIRED - city at minimum)
- City text input (required)
- State text input (optional)
- Country text input (optional, default "India")
- "Detect my location" button that uses browser geolocation API or ipapi.co fallback
- Title: "Where are you based?"
- Props: { value: { city, state, country }, onChange: (loc) => void, onNext: () => void, onBack: () => void }

STEP 5: Create src/features/onboarding/components/steps/StepStruggles.tsx
- Step 4: What are you struggling with? (REQUIRED - pick at least 1)
- Grid of selectable chips/cards (multi-select):
  - Anxiety (icon: Zap)
  - Depression (icon: CloudRain)
  - Relationships (icon: Heart)
  - Stress (icon: Flame)
  - Grief (icon: Cloud)
  - Anger (icon: Angry - or AlertTriangle)
  - Self-esteem (icon: Star)
  - Trauma (icon: Shield)
  - Addiction (icon: Lock)
  - Other (icon: MoreHorizontal)
- Selected chips have white bg with black text, unselected have border-white/10
- Title: "What brings you here?"
- Subtitle: "Select all that apply"
- Props: { value: string[], onChange: (items: string[]) => void, onNext: () => void, onBack: () => void }

STEP 6: Create src/features/onboarding/components/steps/StepTherapyHistory.tsx
- Step 5: Therapy History (REQUIRED)
- 4 large selectable cards (single select, vertical stack):
  - "Never tried therapy" (icon: Sparkles)
  - "Currently in therapy" (icon: HeartPulse)
  - "Had therapy in the past" (icon: Clock)
  - "Considering it for the first time" (icon: Lightbulb)
- Title: "What's your experience with therapy?"
- Props: { value: string | null, onChange: (v: string) => void, onNext: () => void, onBack: () => void }

STEP 7: Update src/pages/auth/SignupPage.tsx
- Add case for step=onboarding that renders OnboardingWizardPage
- After account creation (step=account success), navigate to step=onboarding&s=1 instead of step=astrology
- Keep astrology step accessible but move it to AFTER onboarding (step=astrology comes after step=onboarding&s=10)

IMPORTANT STYLING RULES:
- All backgrounds: bg-black
- All text: text-white (headings), text-white/50 (subtitles), text-white/40 (descriptions)
- Cards/chips: border border-white/10, hover:border-white/20, selected: bg-white text-black
- Buttons: Continue = bg-white text-black rounded-full h-[52px] w-[200px]; Back = text-white/50 text-sm; Skip = text-white/30 text-sm
- Animations: framer-motion, enter from right (x: 50 -> 0), exit to left (x: 0 -> -50)
- Font sizes: Title text-[28px] sm:text-[32px] font-semibold; Subtitle text-[14px] text-white/50
- Spacing: gap-4 for grids, mt-8 between sections
```

---

### TASK 2.3: Frontend - Onboarding Step Components (Steps 6-10)

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build onboarding wizard steps 6-10 (frontend)

CONTEXT:
- Steps 1-5 already built (read them in src/features/onboarding/components/steps/ for pattern)
- Same styling, same props pattern, same animation pattern
- OnboardingWizardPage.tsx already handles routing and API calls

STEP 1: Create src/features/onboarding/components/steps/StepGoals.tsx
- Step 6: What are your goals? (REQUIRED - pick at least 1)
- Grid of selectable chips (multi-select), same pattern as StepStruggles:
  - Reduce Anxiety (icon: Wind)
  - Better Sleep (icon: Moon)
  - Improve Relationships (icon: Heart)
  - Self-Discovery (icon: Compass)
  - Career Growth (icon: Briefcase)
  - Spiritual Growth (icon: Sparkles)
  - Trauma Healing (icon: Shield)
  - Build Confidence (icon: Star)
- Title: "What do you hope to achieve?"
- Subtitle: "Select all that apply"

STEP 2: Create src/features/onboarding/components/steps/StepTherapistPreferences.tsx
- Step 7: Therapist Preferences (OPTIONAL - can skip)
- Three sections:
  1. Preferred therapist gender: 3 horizontal cards (Male, Female, No Preference)
  2. Preferred languages: Multi-select chips (English, Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, Malayalam, Gujarati)
  3. Preferred approach: Single-select cards:
     - "Talk Therapy (CBT)" - icon: MessageCircle
     - "Holistic / Indian Wisdom" - icon: Sparkles
     - "Mixed Approach" - icon: Shuffle
     - "No Preference" - icon: HelpCircle
- Title: "Any preferences for your therapist?"
- Skip button available

STEP 3: Create src/features/onboarding/components/steps/StepInterests.tsx
- Step 8: Interests (OPTIONAL - can skip)
- Grid of selectable chips (multi-select):
  - Meditation (icon: Brain)
  - Yoga (icon: Flower)
  - Journaling (icon: BookOpen)
  - Breathing Exercises (icon: Wind)
  - Astrology (icon: Star)
  - Community Support (icon: Users)
- Title: "What interests you?"
- Subtitle: "We'll personalize your dashboard based on this"
- Skip button available

STEP 4: Create src/features/onboarding/components/steps/StepEmergencyContact.tsx
- Step 9: Emergency Contact (REQUIRED)
- Three text inputs:
  - Contact Name (required) - text input with User icon
  - Phone Number (required) - tel input with Phone icon, validate 10-digit Indian number
  - Relationship (required) - select dropdown: Parent, Spouse, Sibling, Friend, Other
- Title: "Emergency Contact"
- Subtitle: "Someone we can reach in case of a crisis. This information is kept strictly confidential."
- Small note at bottom: "We take your safety seriously. This is only used in genuine emergencies."

STEP 5: Create src/features/onboarding/components/steps/StepConfirmation.tsx
- Step 10: All Done! (CONFIRMATION)
- Big checkmark icon or celebration animation (use framer-motion scale animation)
- Title: "You're all set!"
- Subtitle: "Your personalized healing journey is ready."
- Summary of what they selected (2-3 bullet points):
  - "We matched you based on: [struggles list]"
  - "Your goals: [goals list]"
  - "Preferred approach: [preference]"
- Big "Enter Dashboard" button (same style as Start Now button)
- On click: POST onboarding step 10, then navigate to /journey-preparation

IMPORTANT:
- Each component is self-contained with its own props
- Follow EXACT same styling as steps 1-5 (read those files first)
- All steps receive { value, onChange, onNext, onBack, onSkip? } props
- framer-motion AnimatePresence wrapping handled by parent OnboardingWizardPage
```

---

## PHASE 3: USER DASHBOARD

### WHAT EXISTS NOW
- `src/pages/DashboardPage.tsx` - Shell with "Welcome to Soul Yatri" text
- `src/components/layout/DashboardLayout.tsx` - Layout wrapper with sidebar placeholder
- Route: `/dashboard` (protected, requires auth)

### WHAT NEEDS TO BE BUILT
A personalized dashboard with: welcome banner, next appointment card, quick actions, healing progress, recent activity, mood graph.

---

### TASK 3.1: Backend - Dashboard API

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Implement dashboard API endpoint

CONTEXT:
- Express + TypeScript backend at server/src/
- Prisma ORM, schema at server/prisma/schema.prisma
- Auth middleware: requireAuth from server/src/middleware/auth.middleware.ts
- User model has profile relation (added in Phase 2)
- Route file: server/src/routes/users.ts (has GET /dashboard stub returning 501)

STEP 1: Create server/src/controllers/dashboard.controller.ts:

GET /users/dashboard handler:
- Requires auth
- Fetches user with profile from DB
- Returns dashboard data:
  {
    success: true,
    data: {
      user: { name, avatarUrl, onboardingComplete },
      stats: {
        sessionsCompleted: 0,  // placeholder for now
        moodStreak: 0,         // placeholder
        daysActive: calculateDaysSince(user.createdAt),
        goalsProgress: 0       // placeholder
      },
      quickActions: [
        { id: "book-session", label: "Book Session", icon: "calendar", route: "/therapy/book" },
        { id: "ai-assistant", label: "AI Assistant", icon: "bot", route: "/ai-chat" },
        { id: "mood-check", label: "Mood Check-in", icon: "smile", route: "/health-tools/mood" },
        { id: "meditate", label: "Meditate", icon: "brain", route: "/health-tools/meditation" }
      ],
      upcomingSession: null,  // placeholder, will be real data after Phase 4
      recentActivity: []      // placeholder
    }
  }

STEP 2: Update server/src/routes/users.ts:
- Replace GET /dashboard stub with real controller
- Add requireAuth middleware

Follow exact patterns from auth.controller.ts for response format.
```

---

### TASK 3.2: Frontend - Dashboard UI

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build the full user dashboard UI

CONTEXT:
- React 19 + TypeScript + Tailwind CSS
- Dashboard route: /dashboard (protected)
- Layout: src/components/layout/DashboardLayout.tsx wraps the page
- API: GET /api/v1/users/dashboard (returns user, stats, quickActions, upcomingSession, recentActivity)
- Auth context: src/context/AuthContext.tsx (provides user object)
- Radix UI components in src/components/ui/
- recharts available for charts
- lucide-react for icons
- framer-motion for animations

DESIGN: Dark theme dashboard (bg-[#0a0a0a])

STEP 1: Create src/features/dashboard/components/WelcomeBanner.tsx
- Greeting: "Good [morning/afternoon/evening], [firstName]"
- Subtitle: Motivational quote or tip (rotate from array of 10 quotes)
- Right side: small avatar circle (initials if no avatar)
- Subtle gradient background (dark, not flashy)

STEP 2: Create src/features/dashboard/components/StatsCards.tsx
- 4 stat cards in a row (grid-cols-2 on mobile, grid-cols-4 on desktop):
  - Sessions Completed (icon: Calendar, value: number)
  - Mood Streak (icon: Flame, value: "X days")
  - Days Active (icon: Activity, value: number)
  - Goals Progress (icon: Target, value: "X%")
- Each card: rounded-xl, border border-white/10, bg-white/[0.02], p-4
- Number in text-[24px] font-semibold, label in text-[12px] text-white/50

STEP 3: Create src/features/dashboard/components/QuickActions.tsx
- 4 action buttons in a row (grid):
  - Book Session, AI Assistant, Mood Check-in, Meditate
- Each: rounded-xl card with icon + label, clickable (navigate to route)
- Hover: scale-[1.02], border glow
- On click: navigate to the route from API data

STEP 4: Create src/features/dashboard/components/UpcomingSession.tsx
- If null: show "No upcoming sessions" with "Book your first session" button
- If has data: show therapist name, date/time, "Join" button (if within 5 min of start)
- Card style: slightly different border color (subtle blue/green accent)

STEP 5: Create src/features/dashboard/components/MoodChart.tsx
- Use recharts LineChart
- X-axis: last 7 days (Mon-Sun)
- Y-axis: mood 1-10
- If no data: show empty state "Start tracking your mood"
- Placeholder data for now (will be real after Phase 16)

STEP 6: Update src/pages/DashboardPage.tsx
- Remove the placeholder "Welcome" text
- Layout: single column on mobile, 2-column grid on desktop
  - Full width: WelcomeBanner
  - Full width: StatsCards
  - Full width: QuickActions
  - Left column (60%): UpcomingSession + MoodChart
  - Right column (40%): RecentActivity (placeholder list)
- Fetch data from GET /api/v1/users/dashboard on mount
- Loading state: skeleton cards while fetching
- Error state: "Failed to load dashboard" with retry button

STEP 7: Update src/components/layout/DashboardLayout.tsx
- Add left sidebar (hidden on mobile, shown on lg+):
  - Logo at top
  - Nav items: Dashboard (active), Health Tools, Sessions, AI Assistant, Profile, Settings
  - Each item: icon + label, rounded-lg hover state
  - Bottom: Logout button
- Mobile: bottom tab bar with 5 icons (Dashboard, Health, Sessions, AI, Profile)
- Main content area: flex-1 with px-6 py-8

STYLING:
- Background: bg-[#0a0a0a] (slightly lighter than pure black)
- Cards: bg-white/[0.02] border border-white/8 rounded-xl
- Sidebar: bg-black/50 border-r border-white/8 w-[240px]
- Active nav item: bg-white/10 text-white
- Inactive nav item: text-white/40 hover:text-white/70
```

---

## PHASE 16: HEALTH TOOLS (Mood Tracker, Meditation, Breathing, Journal)

### TASK 16.1: Backend - Health Tools API

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Implement health tools backend (mood tracker, meditation, breathing, journal)

CONTEXT:
- Express + TypeScript backend at server/src/
- Prisma ORM at server/prisma/schema.prisma
- Auth middleware: requireAuth
- Route file exists: server/src/routes/health-tools.ts (stubs returning 501)

STEP 1: Add Prisma models to server/prisma/schema.prisma:

model MoodEntry {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  score     Int      // 1-10
  note      String?  // optional text note
  tags      String[] // ["anxious", "calm", "happy", "sad", "stressed", "energetic", "tired"]
  createdAt DateTime @default(now())
  @@index([userId, createdAt])
}

model JournalEntry {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String?
  content   String   // the journal text
  mood      Int?     // optional mood at time of writing
  tags      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([userId, createdAt])
}

model MeditationLog {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  duration   Int      // seconds
  type       String   // "guided", "unguided", "breathing"
  trackName  String?  // name of guided track if applicable
  completed  Boolean  @default(true)
  createdAt  DateTime @default(now())
  @@index([userId, createdAt])
}

Add relations to User model:
  moodEntries    MoodEntry[]
  journalEntries JournalEntry[]
  meditationLogs MeditationLog[]

STEP 2: Run migration: npx prisma migrate dev --name add-health-tools

STEP 3: Create server/src/controllers/health-tools.controller.ts with handlers:

Mood:
- POST /health-tools/mood : Create mood entry { score: 1-10, note?: string, tags?: string[] }
- GET /health-tools/mood : Get mood entries (query: ?days=7 for last 7 days, default 30)
  Returns: { entries: MoodEntry[], average: number, streak: number }

Journal:
- POST /health-tools/journal : Create entry { title?: string, content: string, mood?: number, tags?: string[] }
- GET /health-tools/journal : Get entries (paginated: ?page=1&limit=10)
- PUT /health-tools/journal/:id : Update entry (only if owner)

Meditation:
- POST /health-tools/meditation : Log session { duration: number, type: string, trackName?: string, completed: boolean }
- GET /health-tools/meditation : Get logs (query: ?days=30)
  Returns: { logs: MeditationLog[], totalMinutes: number, sessionsThisWeek: number }

Breathing:
- POST /health-tools/breathing : Log session (same as meditation with type="breathing")
- GET /health-tools/breathing : Get logs

STEP 4: Create server/src/validators/health-tools.validator.ts with Zod schemas for each endpoint.

STEP 5: Update server/src/routes/health-tools.ts - replace stubs with real handlers.

All endpoints require requireAuth middleware. Follow auth.controller.ts patterns.
```

---

### TASK 16.2: Frontend - Mood Tracker

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build mood tracker UI

CONTEXT:
- React 19 + TypeScript + Tailwind (dark theme)
- API: POST/GET /api/v1/health-tools/mood
- recharts for charts
- framer-motion for animations
- lucide-react for icons
- Dashboard layout wraps all health tools pages

STEP 1: Add route /health-tools/mood to src/router/index.tsx (protected, inside DashboardLayout)

STEP 2: Create src/features/health-tools/screens/MoodTrackerPage.tsx
- Top: "How are you feeling?" with current date
- Mood slider or 5 emoji faces (1=Awful, 3=Okay, 5=Great, 7=Good, 10=Amazing)
  - Use large tappable circles with emoji + label
  - Selected one scales up with glow
- Optional note text area (max 500 chars)
- Tag chips (multi-select): Anxious, Calm, Happy, Sad, Stressed, Energetic, Tired
- "Log Mood" button
- Below: Mood history chart (recharts AreaChart, last 7 days)
- Below chart: List of recent entries with date, score, note preview

STEP 3: Create src/features/health-tools/components/MoodSelector.tsx
- Reusable mood selection component
- 5 or 10 levels with emoji representation
- Animated selection (framer-motion scale + color change)

STEP 4: Create src/features/health-tools/components/MoodHistoryChart.tsx
- recharts AreaChart with gradient fill
- X-axis: dates, Y-axis: 1-10
- Tooltip showing date + score + note
- Empty state if no data

STYLING: Same dark theme as dashboard. Cards with border-white/8, bg-white/[0.02].
```

---

### TASK 16.3: Frontend - Meditation Timer

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build meditation timer UI

CONTEXT:
- Same tech stack as mood tracker
- API: POST/GET /api/v1/health-tools/meditation

STEP 1: Add route /health-tools/meditation to router (protected)

STEP 2: Create src/features/health-tools/screens/MeditationPage.tsx
- Selection screen: Choose duration (5, 10, 15, 20 min) as large cards
- Selection screen: Choose type:
  - "Unguided" (just timer + ambient sound)
  - "Guided Track 1: Body Scan" (placeholder audio)
  - "Guided Track 2: Loving Kindness" (placeholder)
  - "Guided Track 3: Stress Relief" (placeholder)
- Timer screen (shown after selection):
  - Large circular timer (SVG circle with stroke-dasharray countdown)
  - Time remaining in center: "04:32"
  - Pause/Resume button
  - Stop button (asks "Are you sure? Your progress will be saved")
  - Subtle pulsing animation (breathing rhythm guide: 4s in, 7s hold, 8s out)
- Completion screen:
  - "Well done!" with duration
  - Logs session to API
  - "Done" button back to health tools

STEP 3: Create src/features/health-tools/components/CircularTimer.tsx
- SVG-based circular progress
- Props: { duration: number, isRunning: boolean, onComplete: () => void }
- Smooth countdown animation
- Color changes as time progresses (white -> subtle gradient)

STYLING: Full screen dark, minimal UI during meditation. Timer centered.
```

---

### TASK 16.4: Frontend - Breathing Exercise

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build box breathing exercise UI

STEP 1: Add route /health-tools/breathing to router

STEP 2: Create src/features/health-tools/screens/BreathingPage.tsx
- Box breathing pattern: Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s
- Visual: Large circle that expands (inhale), holds (hold), contracts (exhale), holds (hold)
- Text instruction changes: "Breathe In", "Hold", "Breathe Out", "Hold"
- Cycle counter: "Cycle 3 of 10"
- Duration options: 3 min (5 cycles), 5 min (8 cycles), 10 min (15 cycles)
- Completion: log to API, show stats

STEP 3: Create src/features/health-tools/components/BreathingCircle.tsx
- Animated circle using framer-motion
- Scales between 0.6 (exhaled) and 1.0 (inhaled)
- Smooth transitions matching breath timing
- Subtle ring glow effect

Reuse same dark theme. Full screen centered layout during exercise.
```

---

### TASK 16.5: Frontend - Journal

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build journaling feature UI

STEP 1: Add route /health-tools/journal to router

STEP 2: Create src/features/health-tools/screens/JournalPage.tsx
- Two views: List view (default) and Write view
- List view:
  - "My Journal" header with "New Entry" button (Plus icon)
  - List of entries: date, title (or first 50 chars of content), mood badge
  - Sorted by date descending
  - Empty state: "Start writing. Your thoughts are private and encrypted."
- Write view (/health-tools/journal/new or /health-tools/journal/:id):
  - Title input (optional, placeholder: "Untitled")
  - Large textarea for content (min-h-[300px])
  - Optional mood selector at top (inline, compact version)
  - Tag chips at bottom
  - Auto-save indicator ("Saved" / "Saving...")
  - Save button and Back button

STEP 3: Create src/features/health-tools/components/JournalEntryCard.tsx
- Compact card for list view
- Shows: date, title/preview, mood badge, tag chips
- Click navigates to full entry

STYLING: Same dark theme. Textarea should feel calm - no harsh borders.
```

---

## PHASE 4: THERAPY BOOKING (After Phase 3 + 16)

### TASK 4.1: Backend - Therapist & Booking Models + API

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Implement therapy booking backend

CONTEXT:
- Prisma schema at server/prisma/schema.prisma (has User, UserProfile, RefreshToken, AuditLog, MoodEntry, JournalEntry, MeditationLog)
- Route file: server/src/routes/therapy.ts (has extensive stubs)

STEP 1: Add Prisma models:

model TherapistProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  specializations String[] // ["anxiety", "depression", "relationships", "trauma", "addiction"]
  approach        String   // "cbt", "holistic", "mixed"
  languages       String[] // ["english", "hindi", "marathi"]
  experience      Int      // years
  bio             String
  photoUrl        String?
  pricePerSession Int      // in INR (e.g., 1500)
  rating          Float    @default(0)
  totalReviews    Int      @default(0)
  isVerified      Boolean  @default(false)
  isAvailable     Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  availabilities  TherapistAvailability[]
  sessions        Session[]
}

model TherapistAvailability {
  id           String   @id @default(uuid())
  therapistId  String
  therapist    TherapistProfile @relation(fields: [therapistId], references: [id], onDelete: Cascade)
  dayOfWeek    Int      // 0=Sunday, 6=Saturday
  startTime    String   // "09:00"
  endTime      String   // "17:00"
  @@index([therapistId])
}

model Session {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  therapistId   String
  therapist     TherapistProfile @relation(fields: [therapistId], references: [id])
  scheduledAt   DateTime
  duration      Int      @default(50) // minutes
  status        SessionStatus @default(SCHEDULED)
  cancelledBy   String?
  cancelReason  String?
  notes         String?
  paymentId     String?
  amountPaid    Int?     // in INR
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([userId])
  @@index([therapistId])
  @@index([scheduledAt])
}

enum SessionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

Add to User model:
  sessions       Session[]
  therapistProfile TherapistProfile?

STEP 2: Run migration.

STEP 3: Create server/src/controllers/therapy.controller.ts:

Therapist Listing:
- GET /therapy/therapists: List therapists (query: ?specialization=anxiety&language=english&approach=cbt&page=1&limit=10)
  - Only isVerified=true, isAvailable=true
  - Sort by rating desc
  - Include: name, photo, specializations, rating, price, experience, languages

- GET /therapy/therapists/:id: Get therapist detail
  - Full profile + availabilities for next 14 days
  - Calculate available time slots based on TherapistAvailability minus existing Sessions

Session Booking:
- POST /therapy/request: Book a session
  - Body: { therapistId, scheduledAt (ISO datetime) }
  - Validate: slot is available (check TherapistAvailability for that day + no conflicting Session)
  - Validate: scheduledAt is at least 24 hours in the future
  - Create Session with status SCHEDULED
  - Return session details

- GET /therapy/sessions: Get user's sessions (past + upcoming)
  - Query: ?status=SCHEDULED&page=1&limit=10
  - Sort: upcoming first, then past

- GET /therapy/sessions/:id: Get session detail

- PUT /therapy/sessions/:id/cancel: Cancel session
  - Only if status=SCHEDULED and scheduledAt > 24 hours from now
  - Set status=CANCELLED, cancelledBy=userId

STEP 4: Create validators and update routes. All endpoints require requireAuth.
```

---

### TASK 4.2: Frontend - Therapist Listing & Booking Flow

**PROMPT FOR AI AGENT:**
```
PROJECT: d:\soul-yatri-website
TASK: Build therapist listing and booking UI

CONTEXT:
- React 19 + TypeScript + Tailwind (dark theme)
- API: GET /api/v1/therapy/therapists, GET /api/v1/therapy/therapists/:id, POST /api/v1/therapy/request
- Dashboard layout wraps these pages
- Radix UI components available
- lucide-react icons, framer-motion animations

STEP 1: Add routes to router:
- /therapy/find -> TherapistListingPage
- /therapy/therapist/:id -> TherapistProfilePage
- /therapy/sessions -> SessionsListPage

STEP 2: Create src/features/therapy/screens/TherapistListingPage.tsx
- Header: "Find Your Therapist"
- Filter bar (horizontal scroll on mobile):
  - Specialization dropdown (multi-select)
  - Language dropdown (multi-select)
  - Approach: CBT / Holistic / Mixed / All
  - Price range slider
- Therapist cards grid (2 cols desktop, 1 col mobile):
  - Photo (circle avatar), Name, Specializations (chips), Rating (stars), Price, Experience
  - "View Profile" button
- Loading: skeleton cards
- Empty: "No therapists match your criteria"
- Pagination at bottom

STEP 3: Create src/features/therapy/screens/TherapistProfilePage.tsx
- Top: Photo, Name, Rating, Reviews count, Price
- Bio section
- Specializations, Languages, Approach badges
- "Available Slots" section:
  - Date picker (next 14 days)
  - Time slots grid for selected date
  - Available slots: white border, clickable
  - Booked slots: grayed out, not clickable
- Selected slot highlighted
- "Book Session - Rs.X" button at bottom (fixed on mobile)
- On click: confirm dialog -> POST /therapy/request -> Success screen

STEP 4: Create src/features/therapy/screens/SessionsListPage.tsx
- Tabs: "Upcoming" | "Past"
- Session cards: therapist name, date/time, status badge, duration
- Upcoming: "Join" button (if within 5 min of start time), "Cancel" button
- Past: "View Summary" button (placeholder for now)
- Empty states for each tab

STYLING: Dark theme, cards with subtle borders, therapist photos with ring border.
```

---

## PHASE ORDER SUMMARY

After the above 4 phases, continue with:
1. **Phase 13**: Payment Gateway (Razorpay integration) - Add to booking flow
2. **Phase 5**: Video Calling (Daily.co) - Add to session join
3. **Phase 6**: AI Voice Assistant (GPT-4o chat)
4. **Phase 7**: Astrologer System
5. **Phase 8**: Therapist Dashboard
6. **Phase 17**: Notifications
7. **Phase 14**: Admin Dashboard (MVP subset)
8. **Phase 25**: In-Session AI Monitoring

Each phase follows the same pattern: Backend API first, then Frontend UI. Each task prompt is self-contained with all context needed.

---

## RULES FOR ALL AI AGENTS

1. **READ before WRITE** - Always read existing files before modifying them
2. **Follow existing patterns** - Look at auth.controller.ts, OnboardingSignupPage.tsx for established patterns
3. **Dark theme ONLY** - bg-black, text-white, border-white/10, NO light mode for internal pages
4. **Mobile-first** - All UIs must work on 375px width screens
5. **100dvh pages** - Onboarding steps should not require scrolling
6. **API format** - Always return { success: true/false, data/error }
7. **TypeScript strict** - No `any` types, no `@ts-ignore`
8. **Test the build** - Run `npx vite build` (frontend) or `npx tsc --noEmit` (server) after changes
9. **Don't build post-MVP** - Only Phases 1-8, 13-14, 16-17, 25
10. **Commit after each task** - One commit per task with descriptive message
