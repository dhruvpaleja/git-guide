# BATCH:014 — PHASE 7: ACCESSIBILITY PASS

## CONTEXT RECOVERY BLOCK (READ THIS FIRST IF YOU LOST CONTEXT)

You are an AI coding agent executing **BATCH:014** of the Soul Yatri 10/10 Implementation Master Plan.
- **Phase**: 7 — Accessibility (a11y) pass
- **Previous batch**: BATCH:013 (Phase 6 — responsiveness pass) — COMPLETED, PASS
- **All prior batches 001–013**: COMPLETED, PASS
- **All quality gates currently passing**: `npm run type-check`, `npm run lint:ci`, `npm run build`, `cd server && npm run build`, `cd server && npm run lint:ci`, `npm run quality:ci`
- **Working branch**: `master` (origin/master)
- **Project**: Soul Yatri — React 19 + TypeScript + Vite + Tailwind CSS spiritual wellness SaaS platform
- **Workspace root**: `d:\Downloads\soul-yatri-website`

---

## NON-NEGOTIABLE CONSTRAINTS (NEVER VIOLATE THESE)

1. **DO NOT remove or break dev-login / mock-auth / QA bypass** — these must remain functional.
2. **DO NOT change UI visual appearance** — no color changes, no layout changes, no font changes, no spacing changes. A11y is additive (add attributes, landmarks, focus management) — NOT redesign.
3. **DO NOT change routing, API contracts, or auth behavior**.
4. **All quality gates MUST pass after every sub-task**:
   - `npm run type-check` → 0 errors
   - `npm run lint:ci` → 0 warnings, 0 errors
   - `npm run build` → success
   - `cd server && npm run build` → success
   - `cd server && npm run lint:ci` → 0 warnings
   - `npm run quality:ci` → full pass (includes bundle budget check)
5. **Backward compatibility**: No existing imports, exports, or component APIs may break.
6. **No over-engineering**: Only add what is directly required for WCAG 2.1 AA compliance. No new component libraries, no new state management, no abstractions.

---

## MANDATORY STARTUP SEQUENCE (DO THIS EVERY TIME YOU START OR RESUME)

```
STEP 1: HARD SYNC
  git fetch origin
  git checkout master
  git pull origin master
  git status   # MUST show "nothing to commit, working tree clean"

STEP 2: READ ALL EXECUTION DOCS (in order)
  Read: docs/execution/MASTER_PLAN.md
  Read: docs/execution/STATUS.md
  Read: docs/execution/DECISIONS.md
  Read: docs/execution/RISKS.md
  Read: docs/execution/BASELINE_METRICS.json

STEP 3: VERIFY CURRENT STATE
  Run: npm run quality:ci
  RESULT MUST BE: all checks pass
  If ANY check fails → STOP. Fix what's broken FIRST before making a11y changes.

STEP 4: CONFIRM BATCH IDENTITY
  You are executing BATCH:014, Phase 7 (Accessibility).
  If MASTER_PLAN.md or STATUS.md already shows BATCH:014 as completed → STOP. Do not re-execute.
  If BATCH:014 is not started → proceed.
  If BATCH:014 is partially started → read the evidence folder to see what's done, continue from there.
```

---

## WHAT PHASE 7 MUST ACCOMPLISH (SCOPE)

**Goal**: Bring the entire Soul Yatri frontend to WCAG 2.1 Level AA compliance without changing visual design or behavior.

**Categories of work** (in priority order):

### PRIORITY 1 — CRITICAL (Must fix)
| ID | Issue | What to do | Where |
|----|-------|------------|-------|
| A01 | No skip navigation link | Add a visually-hidden "Skip to main content" link as the first focusable element on every page | `Navigation.tsx`, `DashboardTopbar.tsx` |
| A02 | Missing landmark roles | Ensure every page has `<main>`, `<nav>`, `<header>`, `<footer>` landmarks. Verify layouts. | `MainLayout.tsx`, `DashboardLayout.tsx`, `AuthLayout.tsx`, `Navigation.tsx`, `Footer.tsx` |
| A03 | Mobile menu missing ARIA | Add `aria-expanded`, `aria-controls`, `aria-label` to hamburger button and mobile menu panel | `Navigation.tsx`, `DashboardTopbar.tsx` |
| A04 | Images missing alt text | Audit ALL `<img>` tags. Decorative images get `alt=""` + `aria-hidden="true"`. Meaningful images get descriptive alt text. | All pages/components with `<img>` tags |
| A05 | Form inputs missing labels | Every `<input>`, `<textarea>`, `<select>` MUST have an associated `<label>` (via `htmlFor`/`id` pair) OR `aria-label` / `aria-labelledby` | All forms: LoginForm, SignupForm, OnboardingPasswordField, all Step*.tsx, ContactPage, Footer email input |
| A06 | Color contrast insufficient | Verify all text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text). Fix any failures using only opacity/shade adjustments that maintain design intent. | `text-white/40`, `text-white/30`, `text-white/60`, `text-white/70` classes across codebase |
| A07 | Focus not visible | Ensure ALL interactive elements have visible focus indicators (`:focus-visible` ring). No focus trap dead-ends. | Buttons, links, form controls, cards, tabs, toggles |

### PRIORITY 2 — HIGH (Should fix)
| ID | Issue | What to do | Where |
|----|-------|------------|-------|
| A08 | Page titles not set | Each route should update `document.title` with a descriptive page title | All pages (add `useEffect` with `document.title = "..."` or a shared hook) |
| A09 | Heading hierarchy broken | Pages must have logical heading order: one `<h1>` per page, followed by `<h2>`, `<h3>` etc. No skipping levels. | All pages — audit heading structure |
| A10 | Live regions missing | Dynamic content changes (notifications, form errors, toast messages) must use `aria-live="polite"` or `aria-live="assertive"` | NotificationsPage, form validation messages, toast/sonner, dashboard widgets |
| A11 | Keyboard navigation incomplete | Tab order must be logical. All interactive elements must be keyboard-accessible. No keyboard traps. | All pages — full tab-through audit |
| A12 | ESLint a11y plugin missing | Install `eslint-plugin-jsx-a11y` and integrate into ESLint config for automated enforcement | `package.json`, `eslint.config.js` |
| A13 | Tables missing headers | Data tables need `<th>` with `scope="col"` or `scope="row"`. Complex tables need `headers`/`id` associations. | TodaysSessionsPage, MyClientsPage, any table component usage |
| A14 | `<html lang>` attribute | Ensure `<html lang="en">` is set in `index.html` | `index.html` |

### PRIORITY 3 — MEDIUM (Good to fix)
| ID | Issue | What to do | Where |
|----|-------|------------|-------|
| A15 | Animations respect reduced motion | All CSS/JS animations must respect `prefers-reduced-motion: reduce`. Add `motion-reduce:` Tailwind variants and/or `useReducedMotion` checks. | Framer Motion animations, CSS transitions, GSAP animations |
| A16 | Touch target size | All interactive elements must be at least 44x44px touch target (mostly done in Phase 6, verify) | Buttons, links, form controls |
| A17 | Error messages linked to inputs | Form error messages should use `aria-describedby` linking error to the input that has the error | All forms using react-hook-form |
| A18 | Autocomplete attributes | Login/signup forms should have `autocomplete` attributes (`username`, `current-password`, `new-password`, `email`, `name`, `tel`) | LoginForm, SignupForm, onboarding forms |
| A19 | `<button>` vs `<a>` audit | Interactive elements that navigate use `<a>`/`<Link>`. Elements that trigger actions use `<button>`. No `<div onClick>` patterns. | Full codebase audit |
| A20 | SVG accessibility | SVGs must have `role="img"` + `aria-label` if meaningful, or `aria-hidden="true"` if decorative | All SVG icons (lucide-react icons, custom SVGs) |

---

## COMPLETE FILE INVENTORY (Every file that may need changes)

### Layouts (3 files)
```
src/layouts/MainLayout.tsx          — needs <main> landmark verification, skip-nav target
src/layouts/DashboardLayout.tsx     — needs skip-nav target, landmark roles, mobile drawer ARIA
src/layouts/AuthLayout.tsx          — needs <main> landmark, page structure
```

### Navigation & Footer (2 files)
```
src/components/layout/Navigation.tsx  — needs skip-nav link, aria-expanded on mobile toggle, nav landmark
src/components/layout/Footer.tsx      — needs footer landmark, email input label, link a11y
```

### Public Pages (16 files)
```
src/pages/SplashScreen.tsx
src/pages/LandingPage.tsx
src/pages/AboutPage.tsx
src/pages/BlogsPage.tsx
src/pages/BlogPostPage.tsx
src/pages/BusinessPage.tsx
src/pages/CorporatePage.tsx
src/pages/CareerPage.tsx
src/pages/ContactPage.tsx
src/pages/CoursesPage.tsx
src/pages/CourseDetailsPage.tsx
src/pages/StudentCounsellingPage.tsx
src/pages/StudentCounsellingDemoPage.tsx
src/pages/WorkshopDemoPage.tsx
src/pages/DashboardPage.tsx
src/pages/NotFoundPage.tsx
```

### Auth Pages (2 files)
```
src/pages/auth/LoginPage.tsx
src/pages/auth/SignupPage.tsx
```

### Dashboard Pages (17 files)
```
src/pages/dashboard/AdminDashboard.tsx
src/pages/dashboard/AstrologyDashboard.tsx
src/pages/dashboard/ConfessionalPage.tsx
src/pages/dashboard/ConnectionsPage.tsx
src/pages/dashboard/EditProfilePage.tsx
src/pages/dashboard/JournalPage.tsx
src/pages/dashboard/LogoutPage.tsx
src/pages/dashboard/ManageAvailabilityPage.tsx
src/pages/dashboard/MeditationPage.tsx
src/pages/dashboard/MoodPage.tsx
src/pages/dashboard/MyClientsPage.tsx
src/pages/dashboard/NotificationsPage.tsx
src/pages/dashboard/ProfilePage.tsx
src/pages/dashboard/PractitionerDashboard.tsx
src/pages/dashboard/SessionsPage.tsx
src/pages/dashboard/SettingsPage.tsx
src/pages/dashboard/TodaysSessionsPage.tsx
```

### Practitioner Pages (1 file)
```
src/pages/practitioner/PractitionerDashboard.tsx
```

### Feature Components — Landing (9 files)
```
src/features/landing/components/HeroSection.tsx
src/features/landing/components/ServicesSection.tsx
src/features/landing/components/HowItWorksSection.tsx
src/features/landing/components/StatsSection.tsx
src/features/landing/components/WellnessSection.tsx
src/features/landing/components/SoulBotSection.tsx
src/features/landing/components/CorporateSection.tsx
src/features/landing/components/FAQSection.tsx
src/features/landing/components/CTASection.tsx
```

### Feature Components — About (5 files)
```
src/features/about/components/AboutHero.tsx
src/features/about/components/AboutStats.tsx
src/features/about/components/FoundersSection.tsx
src/features/about/components/ValuesSection.tsx
src/features/about/components/VisionMission.tsx
```

### Feature Components — Auth (2 files)
```
src/features/auth/components/LoginForm.tsx
src/features/auth/components/SignupForm.tsx
```

### Feature Components — Business (9 files)
```
src/features/business/components/BusinessHero.tsx
src/features/business/components/BusinessSolutions.tsx
src/features/business/components/SolutionCard.tsx
src/features/business/components/SolutionsIntro.tsx
src/features/business/components/corporate/CorporateHero.tsx
src/features/business/components/corporate/CorporateProblem.tsx
src/features/business/components/corporate/CorporateSolution.tsx
src/features/business/components/corporate/CorporateOfferings.tsx
src/features/business/components/corporate/CorporateCTA.tsx
```

### Feature Components — Courses (2 files)
```
src/features/courses/pages/CoursesProgramsPage.tsx
src/features/courses/components/CourseCard.tsx
```

### Feature Components — Dashboard (14 files)
```
src/features/dashboard/pages/PersonalizationPage.tsx
src/features/dashboard/components/layout/DashboardTopbar.tsx
src/features/dashboard/components/layout/DashboardSidebar.tsx
src/features/dashboard/components/ClientIntakeWidget.tsx
src/features/dashboard/components/MetricCard.tsx
src/features/dashboard/components/PendingApprovalsWidget.tsx
src/features/dashboard/components/QuickLinksWidget.tsx
src/features/dashboard/components/ScheduledSessionsWidget.tsx
src/features/dashboard/components/SessionsRecordsWidgets.tsx
src/features/dashboard/components/widgets/HumanMatchCard.tsx
src/features/dashboard/components/widgets/PatternAlerts.tsx
src/features/dashboard/components/widgets/SoulConstellationMap.tsx
src/features/dashboard/components/widgets/SoulSyncCard.tsx
src/features/dashboard/components/widgets/TheConfessional.tsx
```

### Feature Components — Onboarding (16 files)
```
src/features/onboarding/screens/PractitionerOnboardingPage.tsx
src/features/onboarding/screens/OnboardingSignupPage.tsx
src/features/onboarding/screens/OnboardingCreateAccountPage.tsx
src/features/onboarding/screens/OnboardingPartnerDetailsPage.tsx
src/features/onboarding/screens/OnboardingAstrologyPage.tsx
src/features/onboarding/components/OnboardingPasswordField.tsx
src/features/onboarding/components/steps/StepConfirmation.tsx
src/features/onboarding/components/steps/StepDOB.tsx
src/features/onboarding/components/steps/StepEmergencyContact.tsx
src/features/onboarding/components/steps/StepGender.tsx
src/features/onboarding/components/steps/StepGoals.tsx
src/features/onboarding/components/steps/StepInterests.tsx
src/features/onboarding/components/steps/StepLocation.tsx
src/features/onboarding/components/steps/StepStruggles.tsx
src/features/onboarding/components/steps/StepTherapyHistory.tsx
src/features/onboarding/components/steps/StepTherapistPrefs.tsx
```

### Feature Components — Other (11 files)
```
src/features/journey-preparation/pages/JourneyPreparationPage.tsx
src/features/journey-preparation/components/JourneyCard.tsx
src/features/journey-preparation/components/MandalaBackground.tsx
src/features/constellation/pages/ConstellationPage.tsx
src/features/constellation/components/ConstellationCanvas.tsx
src/features/constellation/components/InsightsPanel.tsx
src/features/constellation/components/NodeDetailPanel.tsx
src/features/constellation/components/AddNodeModal.tsx
src/features/student-counselling/components/StudentCounsellingHeroSection.tsx
src/features/student-counselling/components/StudentCounsellingHeroContent.tsx
src/features/student-counselling/components/StudentCounsellingCardsGrid.tsx
src/features/student-counselling/components/StudentCounsellingCard.tsx
src/features/workshop/components/WorkshopHeroSection.tsx
src/features/workshop/components/WorkshopHeroContent.tsx
src/features/workshop/components/WorkshopCardsGrid.tsx
src/features/workshop/components/WorkshopCard.tsx
```

### UI Primitives (52 files — Radix-based, mostly good a11y already)
```
src/components/ui/accordion.tsx     src/components/ui/alert.tsx
src/components/ui/alert-dialog.tsx  src/components/ui/aspect-ratio.tsx
src/components/ui/avatar.tsx        src/components/ui/badge.tsx
src/components/ui/breadcrumb.tsx    src/components/ui/button.tsx
src/components/ui/button-group.tsx  src/components/ui/calendar.tsx
src/components/ui/card.tsx          src/components/ui/carousel.tsx
src/components/ui/chart.tsx         src/components/ui/checkbox.tsx
src/components/ui/collapsible.tsx   src/components/ui/command.tsx
src/components/ui/context-menu.tsx  src/components/ui/dialog.tsx
src/components/ui/drawer.tsx        src/components/ui/dropdown-menu.tsx
src/components/ui/empty.tsx         src/components/ui/field.tsx
src/components/ui/form.tsx          src/components/ui/hover-card.tsx
src/components/ui/input.tsx         src/components/ui/input-group.tsx
src/components/ui/input-otp.tsx     src/components/ui/item.tsx
src/components/ui/kbd.tsx           src/components/ui/label.tsx
src/components/ui/menubar.tsx       src/components/ui/navigation-menu.tsx
src/components/ui/pagination.tsx    src/components/ui/popover.tsx
src/components/ui/progress.tsx      src/components/ui/radio-group.tsx
src/components/ui/resizable.tsx     src/components/ui/scroll-area.tsx
src/components/ui/select.tsx        src/components/ui/separator.tsx
src/components/ui/sheet.tsx         src/components/ui/sidebar.tsx
src/components/ui/skeleton.tsx      src/components/ui/slider.tsx
src/components/ui/sonner.tsx        src/components/ui/spinner.tsx
src/components/ui/switch.tsx        src/components/ui/table.tsx
src/components/ui/tabs.tsx          src/components/ui/textarea.tsx
src/components/ui/toggle.tsx        src/components/ui/toggle-group.tsx
src/components/ui/tooltip.tsx
```

### Config & Build Files
```
index.html                          — needs lang="en" verification
eslint.config.js                    — add eslint-plugin-jsx-a11y
package.json                        — add eslint-plugin-jsx-a11y dependency
src/index.css                       — may need sr-only class (verify if Tailwind provides it)
tailwind.config.js                  — verify focus-visible plugin availability
```

### Execution Docs (update at end)
```
docs/execution/MASTER_PLAN.md
docs/execution/STATUS.md
docs/execution/DECISIONS.md
docs/execution/RISKS.md
docs/execution/BASELINE_METRICS.json
```

---

## EXISTING A11Y STATE (What's already done — DO NOT re-do)

| Pattern | Status | Notes |
|---------|--------|-------|
| Radix UI primitives (Dialog, Select, Tabs, etc.) | ✅ Good | Built-in focus trap, ARIA, keyboard nav |
| `aria-label` on social links (Footer) | ✅ Done | Instagram, Facebook, LinkedIn |
| `sr-only` on dialog close buttons | ✅ Done | Via shadcn/ui Dialog component |
| `role="region"` on Carousel | ✅ Done | Radix carousel wrapper |
| `aria-roledescription` on Carousel | ✅ Done | |
| `aria-current="page"` on Breadcrumb | ✅ Done | |
| `focus-visible:` ring on Button, Input, Tabs | ✅ Done | |
| `aria-invalid` on form inputs | ✅ Done | Via react-hook-form integration |
| `<main>` tag in MainLayout | ✅ Done | `<main>` wraps `<Outlet />` |
| `<main>` tag in DashboardLayout | ✅ Done | `<main>` wraps `<Outlet />` |
| Touch targets ≥44px | ✅ Done (Phase 6) | Verified in BATCH:013 |
| Responsive layouts | ✅ Done (Phase 6) | Verified in BATCH:013 |

---

## EXECUTION PLAN (SUB-TASKS — Execute in order)

### SUB-TASK 1: Install eslint-plugin-jsx-a11y and configure

**Files**: `package.json`, `eslint.config.js`

**Steps**:
1. Run: `npm install --save-dev eslint-plugin-jsx-a11y`
2. Edit `eslint.config.js`:
   - Add import: `import jsxA11y from 'eslint-plugin-jsx-a11y'`
   - Add to the TS/TSX files block `extends`: `jsxA11y.flatConfigs.recommended`
3. Run: `npm run lint:ci` to see how many a11y violations are flagged
4. **DO NOT bulk-disable rules**. Note the violations — they become your audit checklist.
5. Fix violations that can be fixed without changing visual design.
6. For any rule that produces false positives on Radix components, add scoped `// eslint-disable-next-line` with a justification comment (never blanket-disable the rule).

**Checkpoint**: `npm run lint:ci` must pass with 0 warnings.

---

### SUB-TASK 2: HTML document-level fixes

**Files**: `index.html`

**Steps**:
1. Verify `<html lang="en">` exists. Add if missing.
2. Verify `<meta name="viewport" content="width=device-width, initial-scale=1">` exists.
3. Verify `<title>` tag exists with descriptive text (e.g., "Soul Yatri — Your Spiritual Wellness Journey").

**Checkpoint**: Open `index.html`, verify visually.

---

### SUB-TASK 3: Skip navigation link

**Files**: `src/components/layout/Navigation.tsx`, `src/features/dashboard/components/layout/DashboardTopbar.tsx`

**Steps**:
1. In `Navigation.tsx`, add a visually-hidden skip link as the VERY FIRST element inside `<header>`:
   ```tsx
   <a
     href="#main-content"
     className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm focus:font-semibold"
   >
     Skip to main content
   </a>
   ```
2. In `MainLayout.tsx`, add `id="main-content"` to the `<main>` tag.
3. In `DashboardLayout.tsx`, add `id="main-content"` to the `<main>` tag.
4. In `AuthLayout.tsx`, wrap `<Outlet />` in `<main id="main-content">`.
5. In `DashboardTopbar.tsx`, add a similar skip link if the topbar is the first focusable element in the dashboard.
6. Verify by tabbing: first Tab press on any page should highlight the skip link.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 4: Landmark roles audit

**Files**: All 3 layouts, Navigation.tsx, Footer.tsx

**Steps**:
1. `MainLayout.tsx` — verify: `<header>` (Navigation), `<main>` (content), `<footer>` (Footer). Navigation already renders `<header>`. Footer already renders `<footer>`. ✅ Likely OK.
2. `DashboardLayout.tsx` — verify: `<nav>` on sidebar, `<main>` on content area, `<header>` on topbar. Add `role` attributes if semantic elements aren't used.
3. `AuthLayout.tsx` — verify: has `<main>`. If not, add `<main>` wrapper.
4. **Test**: Use browser DevTools Accessibility tree or `document.querySelectorAll('main, nav, header, footer, [role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]')` to verify landmarks exist on each layout.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 5: Navigation ARIA attributes

**Files**: `src/components/layout/Navigation.tsx`

**Steps**:
1. Add `aria-label="Main navigation"` to the desktop `<nav>` element.
2. Add `aria-label="Mobile navigation"` to the mobile `<nav>` element.
3. On the mobile hamburger button, add:
   - `aria-expanded={isMobileMenuOpen}`
   - `aria-controls="mobile-nav-menu"`
   - `aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}`
4. On the mobile menu `<nav>`, add `id="mobile-nav-menu"`.
5. Ensure the mobile menu is hidden from the accessibility tree when closed (use `aria-hidden` or conditional rendering — currently uses conditional rendering which is ✅ correct).

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 6: Image alt text audit

**Approach**: Search the entire `src/` directory for `<img` tags. Categorize each as decorative or meaningful.

**Rules**:
- Decorative images (backgrounds, orbs, gradients, patterns): `alt="" aria-hidden="true"`
- Meaningful images (logos, service photos, founder photos, course images): descriptive `alt="..."` text
- Icons that convey meaning: `aria-label` on the parent interactive element

**Search command**: `grep -rn '<img' src/ --include="*.tsx" --include="*.ts"`

**Common patterns to fix**:
- Hero section background images → decorative → `alt=""`
- Service card images → meaningful → `alt="Breathwork therapy session"`
- Founder photos → meaningful → `alt="[Name], Co-founder of Soul Yatri"`
- Logo images → meaningful → already has `alt="Soul Yatri"` ✅

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 7: Form accessibility audit

**Files**: All form components listed in the inventory.

**Steps**:
1. **Footer email input** (`Footer.tsx`): Add `<label>` (sr-only) or `aria-label="Email address"` to the email input.
2. **LoginForm.tsx**: Verify all inputs have associated labels. Add `autocomplete="username"` to email field, `autocomplete="current-password"` to password field.
3. **SignupForm.tsx**: Verify labels. Add `autocomplete="email"`, `autocomplete="new-password"`, `autocomplete="name"` etc.
4. **OnboardingPasswordField.tsx**: Already has `aria-label` ✅. Verify `autocomplete="new-password"`.
5. **All Step*.tsx files**: Verify every input/select/radio has a label or aria-label.
6. **ContactPage.tsx**: Verify contact form inputs have labels.
7. **Error messages**: Ensure react-hook-form `FormMessage` renders with `aria-describedby` on the input. The shadcn form.tsx likely handles this — verify.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 8: Heading hierarchy audit

**Approach**: For each page, verify heading structure follows logical order.

**Rules**:
- Each page MUST have exactly one `<h1>` (the page title).
- Subsequent headings follow in order: `<h2>`, `<h3>`, etc.
- Never skip levels (e.g., `<h1>` → `<h3>` is invalid).
- Section headings should be `<h2>`, sub-sections `<h3>`.

**Pages to audit** (spot-check the most important ones):
1. `LandingPage.tsx` + all landing sections → one `<h1>` in HeroSection, `<h2>`s for each section
2. `AboutPage.tsx` → one `<h1>`, `<h2>`s for subsections
3. `BusinessPage.tsx` → one `<h1>`, `<h2>`s for solutions
4. `ContactPage.tsx` → one `<h1>` for page title
5. `DashboardPage.tsx` → one `<h1>` for dashboard title
6. All dashboard sub-pages → one `<h1>` per page

**Fix pattern**: Change `<div className="text-3xl font-bold">` to `<h2 className="text-3xl font-bold">` etc.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 9: Page title management

**Create a shared hook** (ONLY if needed — check if one exists first):

```tsx
// src/hooks/useDocumentTitle.ts
import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | Soul Yatri` : 'Soul Yatri';
    return () => { document.title = previousTitle; };
  }, [title]);
}
```

**Then add to every page component** at the top of the function body:
```tsx
useDocumentTitle('About Us');   // → "About Us | Soul Yatri"
useDocumentTitle('Login');      // → "Login | Soul Yatri"
useDocumentTitle('Dashboard');  // → "Dashboard | Soul Yatri"
```

**Full page title map**:
| Page | Title |
|------|-------|
| SplashScreen | Soul Yatri |
| LandingPage | Home |
| AboutPage | About Us |
| BusinessPage | Business Solutions |
| CorporatePage | Corporate Wellness |
| BlogsPage | Blog |
| BlogPostPage | Blog Post (dynamic if possible) |
| CareerPage | Careers |
| ContactPage | Contact Us |
| CoursesPage | Courses & Programs |
| CourseDetailsPage | Course Details |
| StudentCounsellingPage | Student Counselling |
| WorkshopDemoPage | Workshop Demo |
| StudentCounsellingDemoPage | Student Counselling Demo |
| LoginPage | Login |
| SignupPage | Sign Up |
| PractitionerOnboardingPage | Practitioner Onboarding |
| DashboardPage | Dashboard |
| PersonalizationPage | Personalize Your Experience |
| MoodPage | Mood Tracker |
| JournalPage | Journal |
| MeditationPage | Meditation |
| NotificationsPage | Notifications |
| ProfilePage | Profile |
| SettingsPage | Settings |
| SessionsPage | Sessions |
| ConnectionsPage | Connections |
| ConfessionalPage | The Confessional |
| ConstellationPage | Soul Constellation |
| PractitionerDashboard | Practitioner Dashboard |
| TodaysSessionsPage | Today's Sessions |
| MyClientsPage | My Clients |
| ManageAvailabilityPage | Manage Availability |
| EditProfilePage | Edit Profile |
| AstrologyDashboard | Astrology Dashboard |
| AdminDashboard | Admin Dashboard |
| NotFoundPage | Page Not Found |
| JourneyPreparationPage | Journey Preparation |

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 10: Keyboard navigation audit

**Approach**: Mentally trace (or test) the tab order through each page type.

**Checks**:
1. Tab through public pages: Skip link → Nav links → Page content → Footer → loops back
2. Tab through dashboard: Skip link → Topbar → Sidebar links → Main content → loops back
3. Tab through modals: Focus should be trapped inside the modal when open (Radix handles this ✅)
4. Tab through forms: Tab moves between form fields in visual order
5. Escape key: Closes open modals/drawers (Radix handles this ✅)
6. Enter/Space: Activates buttons, links, checkboxes, radio buttons

**Fix any issues found**: Most common fix is adding `tabIndex={0}` to custom interactive elements that aren't natively focusable, or converting `<div onClick>` to `<button>`.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 11: Color contrast verification

**Approach**: The most common low-contrast patterns in this codebase:

| Class | Approx Color | On Background | Estimated Ratio | WCAG AA? |
|-------|-------------|---------------|-----------------|----------|
| `text-white/30` | rgba(255,255,255,0.3) | #000000 | ~3.4:1 | ❌ FAIL (normal text) |
| `text-white/40` | rgba(255,255,255,0.4) | #000000 | ~4.4:1 | ❌ FAIL (just under 4.5:1) |
| `text-white/50` | rgba(255,255,255,0.5) | #000000 | ~5.7:1 | ✅ PASS |
| `text-white/60` | rgba(255,255,255,0.6) | #000000 | ~7.0:1 | ✅ PASS |
| `text-white/70` | rgba(255,255,255,0.7) | #000000 | ~8.4:1 | ✅ PASS |

**Fix rule**: 
- `text-white/30` on dark backgrounds → bump to `text-white/50` minimum (only for actual text content, NOT decorative elements)
- `text-white/40` on dark backgrounds → bump to `text-white/50` minimum
- `text-black/30` on light backgrounds → bump to `text-black/50` minimum
- Placeholder text: `placeholder-white/30` is exempt (WCAG doesn't require placeholder contrast), but consider bumping `placeholder-white/40` for usability

**CRITICAL**: Only change text that conveys information. Decorative text, watermarks, and disabled states are exempt.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 12: Reduced motion support

**Files**: Components using Framer Motion, GSAP, or CSS animations.

**Steps**:
1. Check if Framer Motion's `useReducedMotion` hook is available (it is — `import { useReducedMotion } from 'framer-motion'`).
2. In `src/index.css`, add:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
3. In `SmoothScrollProvider` or wherever GSAP smooth scroll is configured, respect the `prefers-reduced-motion` media query.
4. For Framer Motion `<AnimatePresence>` in layouts: conditionally disable animations when `useReducedMotion()` returns true (or simply rely on the CSS @media rule above which handles most cases).

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 13: ARIA live regions

**Files**: Components with dynamic content updates.

**Steps**:
1. **Toast/Sonner**: Verify the toast container has `role="alert"` or `aria-live="assertive"`. Sonner library likely handles this — verify.
2. **Form validation errors**: Ensure error containers have `aria-live="polite"` so screen readers announce errors.
3. **Dashboard widgets** (PatternAlerts, notifications): Add `aria-live="polite"` to containers that update dynamically.
4. **Loading states**: Add `aria-busy="true"` to containers while loading, `aria-busy="false"` when done.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 14: Button/Link semantic audit

**Search for anti-patterns**:
```
grep -rn 'div.*onClick\|span.*onClick' src/ --include="*.tsx"
```

**Fix**: Replace `<div onClick={...}>` with `<button onClick={...}>` or `<a>` as appropriate.

**Also check**: Any `<a>` tag without `href` should become a `<button>`. Any `<button>` that navigates should become a `<Link>`.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

### SUB-TASK 15: SVG accessibility

**Approach**: Lucide React icons (the icon library used) render as `<svg>` elements.

**Rules**:
- Icons inside buttons/links with visible text → `aria-hidden="true"` on the SVG (the text provides the label)
- Icon-only buttons → the `<button>` needs `aria-label="..."` describing the action
- Decorative SVGs → `aria-hidden="true"`

**Common lucide icons in this codebase**: `Menu`, `X`, `ChevronDown`, `Search`, `Bell`, `Settings`, `User`, etc.

**Checkpoint**: `npm run type-check && npm run lint:ci && npm run build`

---

## POST-IMPLEMENTATION VERIFICATION

After ALL sub-tasks are complete, run this full verification sequence:

```bash
# 1. Full quality gate
npm run quality:ci

# 2. Verify build output
npm run build

# 3. Start dev server and manually verify (or describe verification):
npm run dev
# Open in browser, verify:
#   - Tab through landing page: skip link appears on first Tab
#   - Skip link jumps to main content
#   - All images have alt text (inspect in DevTools)
#   - Mobile menu has aria-expanded
#   - Forms have labels
#   - Page titles change on navigation
#   - Focus rings visible on all interactive elements
```

---

## EVIDENCE CREATION

Create evidence folder: `docs/execution/evidence/BATCH_014_ACCESSIBILITY/`

### Create MATRIX.md
Create a comprehensive accessibility matrix similar to BATCH:013's responsiveness matrix:

```markdown
## BATCH 014 Accessibility Matrix

Generated: [timestamp]

### WCAG 2.1 AA Compliance Status by Category

| Category | Criteria | Status | Notes |
|----------|----------|--------|-------|
| Perceivable | 1.1.1 Non-text Content (alt text) | PASS/FAIL | ... |
| Perceivable | 1.3.1 Info and Relationships (landmarks, headings) | PASS/FAIL | ... |
| Perceivable | 1.4.3 Contrast (Minimum) | PASS/FAIL | ... |
| Perceivable | 1.4.11 Non-text Contrast | PASS/FAIL | ... |
| Operable | 2.1.1 Keyboard | PASS/FAIL | ... |
| Operable | 2.1.2 No Keyboard Trap | PASS/FAIL | ... |
| Operable | 2.4.1 Bypass Blocks (skip nav) | PASS/FAIL | ... |
| Operable | 2.4.2 Page Titled | PASS/FAIL | ... |
| Operable | 2.4.3 Focus Order | PASS/FAIL | ... |
| Operable | 2.4.4 Link Purpose | PASS/FAIL | ... |
| Operable | 2.4.6 Headings and Labels | PASS/FAIL | ... |
| Operable | 2.4.7 Focus Visible | PASS/FAIL | ... |
| Understandable | 3.1.1 Language of Page | PASS/FAIL | ... |
| Understandable | 3.2.1 On Focus | PASS/FAIL | ... |
| Understandable | 3.3.1 Error Identification | PASS/FAIL | ... |
| Understandable | 3.3.2 Labels or Instructions | PASS/FAIL | ... |
| Robust | 4.1.1 Parsing | PASS/FAIL | ... |
| Robust | 4.1.2 Name, Role, Value | PASS/FAIL | ... |

### Per-Page Status

| Page | Skip Nav | Landmarks | Heading Hierarchy | Page Title | Focus Order | Forms Labeled | Images Alt | Status |
|------|----------|-----------|-------------------|------------|-------------|---------------|------------|--------|
| Landing (/home) | ... | ... | ... | ... | ... | … | ... | PASS/FAIL |
| About (/about) | ... | ... | ... | ... | ... | … | ... | PASS/FAIL |
[... for every route in the route inventory ...]
```

---

## DOCUMENTATION UPDATES (Do at the very end)

### Update MASTER_PLAN.md
- Change `Current Batch` to `BATCH:014`
- Set phase target to `Phase 7 accessibility pass`
- Describe objective

### Update STATUS.md
Add row:
```
| BATCH:014 | Phase 7 accessibility pass: WCAG 2.1 AA compliance — skip nav, landmarks, ARIA, alt text, form labels, heading hierarchy, page titles, color contrast, keyboard nav, reduced motion, eslint-plugin-jsx-a11y enforcement | [files list] | npm run type-check; npm run lint:ci; npm run build; (cd server && npm run build); (cd server && npm run lint:ci); npm run quality:ci | completed |
```

### Update DECISIONS.md
Add decisions for any tradeoffs made (e.g., contrast bumps, disabled rules, etc.)

### Update RISKS.md
Add:
```
| R-019 | low | codex | Color contrast bumps (white/30→white/50) slightly alter visual warmth on dark backgrounds | Changes confined to information-bearing text only; decorative opacity preserved; visual impact minimal | mitigated |
| R-020 | low | codex | eslint-plugin-jsx-a11y may flag Radix primitives incorrectly | Scoped eslint-disable with justification comments on verified false positives | mitigated |
```

### Update BASELINE_METRICS.json
Add BATCH:014 entry with:
```json
{
  "batch_id": "BATCH:014",
  "phase": "7 accessibility",
  "checks": {
    "frontend_typecheck": "pass",
    "frontend_lint_ci": "pass",
    "frontend_build": "pass",
    "server_build": "pass",
    "server_lint_ci": "pass",
    "quality_ci": "pass"
  },
  "a11y_summary": {
    "eslint_jsx_a11y_violations_fixed": <count>,
    "skip_nav_added": true,
    "pages_with_document_title": <count>,
    "images_with_alt_text_fixed": <count>,
    "forms_with_labels_fixed": <count>,
    "contrast_fixes": <count>,
    "heading_hierarchy_fixes": <count>,
    "aria_attributes_added": <count>,
    "reduced_motion_support": true
  }
}
```

---

## COMMIT AND PUSH

```bash
git add -A
git status  # Review ALL changes, ensure no unintended files
git commit -m "BATCH:014 PHASE:7 accessibility pass — WCAG 2.1 AA: skip-nav, landmarks, ARIA, alt text, form labels, headings, page titles, contrast, keyboard nav, reduced motion, eslint-plugin-jsx-a11y"
git push origin master
```

---

## SELF-RECOVERY INSTRUCTIONS

If you are an AI agent picking this up mid-execution:

1. **Run the MANDATORY STARTUP SEQUENCE** at the top of this document.
2. **Check `docs/execution/evidence/BATCH_014_ACCESSIBILITY/`** — if it exists and has a MATRIX.md, read it to see what's already been done.
3. **Check git log** — `git log --oneline -5` — to see if BATCH:014 commit already exists.
4. **If partially done**: Read the evidence, determine which sub-tasks are complete, and continue from the next incomplete sub-task.
5. **If not started**: Execute from SUB-TASK 1.
6. **If completed**: Verify `npm run quality:ci` passes and move on.

**How to verify a sub-task is done**:
- SUB-TASK 1 (ESLint a11y): Check if `eslint-plugin-jsx-a11y` is in `package.json` devDependencies and `eslint.config.js` imports it
- SUB-TASK 2 (HTML): Check `index.html` for `lang="en"`
- SUB-TASK 3 (Skip nav): Search for `Skip to main content` in `Navigation.tsx`
- SUB-TASK 4 (Landmarks): Check layouts for `<main>`, `<nav>`, `<header>`, `<footer>` tags
- SUB-TASK 5 (Nav ARIA): Check `Navigation.tsx` for `aria-expanded`
- SUB-TASK 6 (Alt text): `grep -c 'alt=""' src/` should be > 0
- SUB-TASK 7 (Form labels): Check `Footer.tsx` for email input label
- SUB-TASK 8 (Headings): Check pages for `<h1>` tags
- SUB-TASK 9 (Page titles): Search for `useDocumentTitle` across pages
- SUB-TASK 10 (Keyboard): Check for `<div onClick>` → `<button>` conversions
- SUB-TASK 11 (Contrast): Check for `text-white/30` → `text-white/50` changes
- SUB-TASK 12 (Reduced motion): Check `src/index.css` for `prefers-reduced-motion`
- SUB-TASK 13 (Live regions): Check for `aria-live` in dashboard components
- SUB-TASK 14 (Semantics): Search for remaining `div.*onClick` patterns
- SUB-TASK 15 (SVGs): Check icon-only buttons for `aria-label`

---

## ANTI-PATTERNS (NEVER DO THESE)

1. ❌ Do NOT add `role="button"` to `<div>` elements — convert them to `<button>` instead.
2. ❌ Do NOT add `tabIndex={0}` everywhere — only on elements that aren't natively focusable but need to be.
3. ❌ Do NOT change the visual design — no new colors, no new spacing, no new layouts.
4. ❌ Do NOT install @axe-core/react in production deps — dev only or skip entirely.
5. ❌ Do NOT add redundant ARIA to native elements (e.g., don't add `role="button"` to `<button>`).
6. ❌ Do NOT add `aria-label` to elements that already have visible text labels.
7. ❌ Do NOT blanket-disable eslint-plugin-jsx-a11y rules. Only scoped disables with justification.
8. ❌ Do NOT change server code — Phase 7 is frontend-only.
9. ❌ Do NOT break any existing imports or component APIs.
10. ❌ Do NOT add new npm dependencies beyond `eslint-plugin-jsx-a11y`.

---

## QUICK REFERENCE: Quality Gate Commands

```bash
# Individual checks
npm run type-check                    # TypeScript compiler, 0 errors
npm run lint:ci                       # ESLint, 0 warnings + 0 errors  
npm run build                         # Vite production build
cd server && npm run build            # Server TypeScript build
cd server && npm run lint:ci          # Server ESLint
npm run bundle:budget                 # Bundle size check

# All-in-one
npm run quality:ci                    # Runs all of the above in sequence

# After EVERY sub-task, run at minimum:
npm run type-check && npm run lint:ci && npm run build
```

---

## TIMELINE STRUCTURE

The sub-tasks are ordered for maximum safety:

1. **SUB-TASK 1** (ESLint plugin) — gives you automated detection for remaining tasks
2. **SUB-TASKS 2–5** (HTML, skip-nav, landmarks, nav ARIA) — structural foundation
3. **SUB-TASKS 6–7** (Images, forms) — content accessibility
4. **SUB-TASKS 8–9** (Headings, titles) — document structure
5. **SUB-TASKS 10–11** (Keyboard, contrast) — interaction accessibility
6. **SUB-TASKS 12–15** (Motion, live regions, semantics, SVGs) — polish and completeness

Each sub-task is independently committable. If you lose context, you can resume at any sub-task boundary.

---

*This prompt was generated on 2026-03-05 with full knowledge of the codebase state at BATCH:013 completion.*
