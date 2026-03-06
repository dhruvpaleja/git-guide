# Soul Yatri — Design System Audit

**Audit Date:** 2026-03-06  
**Auditor:** Forensic Audit Agent  
**Confidence:** High (verified from src/index.css, tailwind.config.js, src/components/ui/, src/components/common/)

---

## Executive Summary

Soul Yatri has a **functional but incomplete design system** built on shadcn/ui + Tailwind CSS + Framer Motion. The foundation is sound — CSS custom properties for theming, 50+ Radix-backed UI components, dark mode by default — but the system has critical gaps: no TypeScript token file exists (contradicting BUILD_PLAN), the brand identity is inconsistent (black/teal vs documented purple/indigo), there is a single shadow token, Framer Motion animations use inline magic numbers throughout, and no semantic color system exists for wellness-specific states.

**Overall Design System Score: 52/100**

| Layer | Score | Key Gap |
|---|---|---|
| Token Architecture | 48/100 | No tokens.ts; CSS vars only; no TypeScript safety |
| Component Library | 72/100 | 50+ components; missing DateTimePicker, RatingInput, AvatarUpload |
| Typography | 62/100 | Inter + Playfair present; mobile scale not tested |
| Color System | 45/100 | Black/teal theme ≠ documented purple/indigo; no semantic colors |
| Spacing & Layout | 60/100 | 8px grid inconsistently applied; container widths vary |
| Shadow & Elevation | 30/100 | Only `shadow-xs` defined; no elevation hierarchy |
| Animation & Motion | 55/100 | Framer Motion used well but all durations are magic numbers |
| Button & CTA System | 68/100 | 6 variants in button.tsx; but 6 dead CTAs in pages |
| Form System | 65/100 | Radix form primitives; error states missing on ~40% |
| Dashboard Coherence | 50/100 | 3 dashboards (user/admin/practitioner) inconsistent |
| Trust & Reassurance | 35/100 | Missing trust signals critical for mental health platform |
| Premium Feel | 48/100 | Functional but not premium; too generic for ₹499/month |

---

## 1. Token Architecture

**Evidence:** `src/index.css` (CSS custom properties), `tailwind.config.js`

**Reality vs Docs:**  
- `docs/BUILD_PLAN.md` references `src/styles/tokens.ts` — **this file does not exist**
- All tokens live in CSS custom properties in `src/index.css`
- Tailwind `tailwind.config.js` maps CSS vars to Tailwind classes

**Color Tokens Defined:**
```
--background: 0 0% 0%          (pure black — dark mode default)
--foreground: 0 0% 100%        (pure white)
--card: 0 0% 4%                (near-black card)
--primary: 0 0% 100%           (white — primary button bg)
--primary-foreground: 0 0% 0%  (black text on primary button)
--secondary: 240 3.7% 15.9%    (dark grey)
--accent: 174 72% 40%          (teal — brand accent)
--ring: 174 72% 40%            (teal — focus ring)
--radius: 0.625rem             (border radius base)
```

**Light mode** defined under `.light` class (inverted from Tailwind convention where dark is `.dark`).

**Critical Gaps:**
- No `--success`, `--warning`, `--info` semantic tokens
- No `--brand-gradient` token (gradients are hardcoded inline in components)
- No spacing scale tokens (all margins/paddings use Tailwind's default 4px scale)
- No typography scale tokens (font sizes hardcoded per component)
- No z-index scale
- No animation duration tokens (all inline: `duration-300`, `duration-500` magic numbers)

**Score: 48/100**  
Missing: TypeScript token file, semantic colors, animation tokens, z-index scale, gradient tokens.

---

## 2. Component Library Quality

**Evidence:** `src/components/ui/` (50+ files), `src/components/common/`

**Components Present:**
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button-group, button, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input-group, input-otp, input, item, kbd, label, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle-group, toggle, tooltip

**API Consistency:**  
- Props naming consistent (shadcn convention: `className`, `variant`, `size`)
- All components export from `@/components/ui/*`
- Radix UI primitives underneath — accessibility built-in

**Missing Components for This Product:**
| Missing | Why Needed |
|---|---|
| DateTimePicker | Therapy appointment booking |
| TimePicker | Session scheduling |
| RatingInput (stars) | Practitioner reviews |
| AvatarUpload | Profile photo upload |
| AudioPlayer | Guided meditation playback |
| VideoPlayer | Session recordings |
| EmojiPicker (standalone) | Mood tracking |
| FileUpload | Document upload for therapy |
| PhoneInput (with country code) | Indian phone numbers |
| OTPInput (styled) | SMS verification |
| PriceDisplay (INR formatted) | Payment flows |

**Score: 72/100**  
Strong foundation. Missing ~10 product-specific components.

---

## 3. Typography System

**Fonts:** Inter (body) + Playfair Display (headings/display) — loaded via Google Fonts

**Assessment:**
- Inter: excellent choice for UI; excellent readability; widely supported
- Playfair Display: premium serif; appropriate for wellness/spiritual context; adds gravitas
- The pairing is appropriate for Soul Yatri's "premium wellness" positioning

**Gaps:**
- No documented type scale (no `text-display-xl`, `text-heading-1` etc. — just raw Tailwind `text-5xl`)
- Mobile typography not tested (desktop-first throughout)
- Line-height inconsistency: some components use `leading-relaxed`, others `leading-tight`
- Letter-spacing not standardized for headings

**Score: 62/100**

---

## 4. Color System

**Reality:** Black/teal dark theme (not purple/indigo as documented)

**Actual Brand Colors:**
- Background: `#000000` (pure black)
- Accent/Brand: `hsl(174, 72%, 40%)` = `#1bab96` (teal-green)
- Dark mode is the **default** (`.light` is the opt-in variant)

**Issues:**
1. BUILD_PLAN and ARCHITECTURE docs describe "deep purple/indigo gradient" — actual code is black/teal
2. No success/warning/info semantic colors defined
3. Gradients (`from-purple-900 via-slate-900 to-indigo-900`) appear hardcoded in page components — not from the token system
4. The teal accent `#1bab96` may have insufficient contrast on white background (light mode)
5. Pure black `#000000` background is harsher than premium wellness apps use (Calm uses `#062537`, Headspace uses `#F47D31` family)

**Score: 45/100**  
Brand identity conflict between docs and code. Missing semantic color system.

---

## 5. Spacing & Layout System

**Tailwind default 4px scale used throughout.**

- Container max-width: `max-w-7xl` on most pages (1280px) — consistent
- Section padding: `py-20 px-4` or `py-16 px-6` — inconsistent between pages
- Card padding: `p-6` or `p-8` — inconsistent
- Form element gap: `space-y-4` or `space-y-6` — inconsistent

**Score: 60/100**

---

## 6. Shadow & Elevation System

**Only one shadow token defined:** `shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)`

**No elevation hierarchy:**
- Cards, modals, tooltips, dropdowns all lack a documented elevation scale
- Glassmorphism (`backdrop-blur-*`) used as elevation signal but not standardized
- No `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` semantic tokens in tailwind.config.js

**Score: 30/100** — Critical gap for a product with complex modal and dashboard hierarchies.

---

## 7. Animation & Motion System

**Framer Motion** used throughout. Evidence in LandingPage, DashboardPage, auth flows.

**Strengths:**
- Consistent use of `initial/animate/exit` patterns
- Page transitions present
- Reduced-motion respected via `prefers-reduced-motion` CSS

**Weaknesses:**
- All durations are magic numbers: `duration: 0.3`, `duration: 0.5`, `transition: { delay: 0.1 }`
- No shared animation variants file (every component defines its own)
- No spring/physics tokens for natural motion
- Loading skeletons missing on ~40% of API-backed pages (static shimmer or none)

**Score: 55/100**

---

## 8. Button & CTA System

**`src/components/ui/button.tsx` — 6 variants × 6 sizes**

Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`  
Sizes: `default`, `sm`, `lg`, `xl`, `2xl`, `icon`

**Strengths:** Complete size range, loading state support, icon variants.

**Critical Gaps in Practice:**
- 6 dead CTAs across pages are `<div>` elements (no button component used):
  - LandingPage: "Book Now" service cards (4×)
  - CareersPage: "Apply" buttons
  - CorporatePage: "Request A Demo"
  - ContactPage: form submit
- Generic labels: "Get Started", "Learn More", "Book Now" — no action specificity
- No "therapy booking" CTA variant with trust-building visual treatment

**Score: 68/100**

---

## 9. Form System

**Radix UI + react-hook-form pattern used in auth forms.**

**Strengths:**
- `<Form>`, `<FormField>`, `<FormItem>`, `<FormMessage>` pattern consistent in auth
- Input OTP component present (`input-otp.tsx`)
- Label/input association correct

**Gaps:**
- Health-tools forms (mood emoji picker, meditation type) use custom non-Form-component patterns
- Error states: present in auth; missing in onboarding steps 6-10
- Real-time validation: login only; signup has post-submit only
- No loading/submitting state on ~40% of forms

**Score: 65/100**

---

## 10. Dashboard Visual Coherence

**Three dashboards exist:** UserDashboard, AdminDashboard, PractitionerDashboard

**Issues:**
- Card components differ: UserDashboard uses glassmorphism cards; AdminDashboard uses solid cards; PractitionerDashboard uses a different card style
- Chart library: `recharts` used in AdminDashboard; no charts in UserDashboard
- Sidebar: UserDashboard has a sidebar; AdminDashboard has its own sidebar; different width/padding
- Navigation: inconsistent between dashboards
- PractitionerDashboard in `/src/pages/practitioner/` is **orphaned** (not in router)

**Score: 50/100**

---

## 11. Trust & Reassurance Design

**Critical for a mental health platform. Current state: poor.**

**Missing:**
- No therapist credential badges
- No "licensed therapist" visual indicators
- No privacy guarantee callouts ("Your sessions are private and confidential")
- No crisis helpline visible anywhere
- No certification/compliance badges (HIPAA/DPDPA mentioned in docs but not surfaced in UI)
- Empty states are minimal (just text, no illustrative reassurance)
- Error states use generic "Something went wrong" messages — not reassuring for sensitive context

**Present:**
- About page has founder photos and credibility section
- FAQ section on landing page addresses trust questions

**Score: 35/100** — This is the most critical UX gap for a mental health product.

---

## 12. Premium Feel Assessment

**Target:** Feel like a ₹499-1999/month wellness subscription  
**Current:** Feels like a ₹0 free wellness dashboard

**What makes it feel less premium:**
1. Pure black background — harsher than premium wellness apps
2. Generic card designs — no unique soul/spiritual visual identity
3. Hardcoded data visible as obviously fake to real users
4. Missing micro-interactions on key moments (booking confirmation, mood logged, etc.)
5. NotFoundPage uses broken external Figma URL for image
6. No celebratory moments / delight animations
7. Meditation timer doesn't work
8. Loading states are instant (no skeleton) — feels abrupt

**Score: 48/100**

---

## 13. Critical Design System Fixes (Priority Order)

| # | Fix | File | Impact |
|---|---|---|---|
| 1 | Create `src/styles/tokens.ts` with TypeScript design tokens | New file | System foundation |
| 2 | Add semantic colors: `--success`, `--warning`, `--info`, `--crisis` | `src/index.css` | Error/health states |
| 3 | Define elevation scale: `shadow-sm/md/lg/xl/2xl` | `tailwind.config.js` | Card hierarchy |
| 4 | Add gradient tokens for brand gradients | `src/index.css` + `tailwind.config.js` | Brand consistency |
| 5 | Create `src/lib/motion.ts` with shared Framer Motion variants | New file | Animation consistency |
| 6 | Fix 6 dead CTAs — replace `<div>` with `<Button>` + routing | 6 page files | Core UX |
| 7 | Improve CTA labels: "Book Therapy Session" not "Book Now" | LandingPage + others | Conversion |
| 8 | Fix pure black → `hsl(222, 47%, 7%)` (premium dark) | `src/index.css` | Premium feel |
| 9 | Add `--crisis` red token + visible crisis helpline | Design tokens + layout | Trust & safety |
| 10 | Standardize dashboard card component across all 3 dashboards | `src/components/` | Coherence |
| 11 | Add `DateTimePicker` component for session booking | `src/components/ui/` | Core feature |
| 12 | Add `RatingInput` component for practitioner reviews | `src/components/ui/` | Core feature |
| 13 | Create shared animation variants in `src/lib/motion.ts` | New file | Consistency |
| 14 | Add `AvatarUpload` component | `src/components/ui/` | Profile UX |
| 15 | Add `TrustBadge` and `PrivacyBadge` components | `src/components/ui/` | Trust |
| 16 | Standardize section padding to `py-20 px-6` | All page components | Spacing |
| 17 | Add `PhoneInput` with +91 default for Indian users | `src/components/ui/` | Onboarding UX |
| 18 | Fix NotFoundPage to use local `/error/happy-face.png` | `src/pages/NotFoundPage.tsx` | Broken asset |
| 19 | Add skeleton loading pattern to all API-backed pages | 8+ page components | Perceived performance |
| 20 | Add documentation to 20 most-used components | `src/components/ui/` | DX / maintainability |
