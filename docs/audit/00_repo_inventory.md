# Soul Yatri — Repository Inventory
**Audit Date:** 2026-07-15  
**Auditor:** Forensic Codebase Audit (automated + manual review)  
**Repo Root:** `/home/runner/work/soul-yatri-website/soul-yatri-website`

---

## 1. Excluded / Generated / Vendor Areas

| Area | Reason Excluded |
|---|---|
| `node_modules/` | Vendor dependencies — not source code |
| `.git/` | VCS internals |
| `dist/` | Generated build output |

---

## 2. Top-Level Directory Structure (depth ≤ 3, vendor excluded)

```
soul-yatri-website/
├── .agent/                     # Agent workflow/skill definitions (AI tooling)
│   ├── skills/                 # Marketing skill prompts (AI)
│   └── workflows/
│       └── restructure.md
├── .github/
│   └── workflows/
│       ├── build.yml           # CI: build + security scan
│       └── quality.yml         # CI: type-check + lint
├── .husky/                     # Git hooks (pre-commit, commit-msg)
├── .kiro/                      # Kiro AI agent skill definitions
│   └── skills/                 # 24 marketing/CRO skill prompt files
├── .qwen/                      # Qwen AI agent skill definitions (mirror of .kiro)
│   └── skills/                 # 24 marketing/CRO skill prompt files
├── .vscode/
│   └── mcp.json                # VSCode MCP config
├── docs/
│   ├── audit/                  # ← THIS AUDIT OUTPUT
│   ├── execution/              # Planning docs (MASTER_PLAN, STATUS, RISKS...)
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── BUILD_PLAN.md
│   ├── BUILD_PLAN_GAP_ANALYSIS.md
│   ├── COMPREHENSIVE_CODEBASE_AUDIT.md
│   ├── CONTRIBUTING.md
│   ├── DEVELOPMENT.md
│   ├── ENTERPRISE_CHECKLIST.md
│   ├── FLOW_ISOLATION_VERIFICATION.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── MVP_DEFINITION.md
│   ├── STRUCTURE_IMPLEMENTATION_REPORT.md
│   ├── STRUCTURE_STANDARDS.md
│   ├── UI_UX_IMPROVEMENT_MASTERPLAN.md
│   └── ULTIMATE_GOD_MODE_ARCHITECTURE.md
├── public/
│   ├── favicon.svg
│   └── images/
│       ├── auth/               # Login/signup background images
│       ├── blogs/              # Blog card images
│       ├── careers/            # Career page images
│       ├── contact/            # Contact page images
│       ├── courses/            # Course thumbnail images
│       ├── error/              # Error page images
│       ├── journey-preparation/# Journey prep screen images
│       ├── onboarding/         # Onboarding step images
│       ├── student-counselling/# Student counselling page images
│       ├── workshops/          # Workshop page images
│       └── *.png / *.svg / *.jpg  # Global UI images (hero, icons, logos)
├── scripts/
│   ├── check-bundle-budgets.js # Bundle size budget checker
│   └── responsive-audit.mjs   # Playwright-based responsive audit script
├── server/                     # Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Full Prisma schema (PostgreSQL)
│   │   ├── seed-dev.ts         # Dev seed script
│   │   └── migrations/         # 2 migration SQL files
│   ├── src/
│   │   ├── config/             # env validation + app config
│   │   ├── controllers/        # Legacy top-level controllers (partially superseded)
│   │   ├── lib/                # Core libs (prisma, websocket, errors, logger, upload)
│   │   ├── middleware/         # Express middleware (auth, rbac, security, upload, rate-limit)
│   │   ├── modules/            # Feature modules (15 modules):
│   │   │   ├── admin/          # Admin management
│   │   │   ├── ai/             # AI/LLM integration
│   │   │   ├── astrology/      # Astrology consultations
│   │   │   ├── auth/           # Authentication (JWT, tokens, audit)
│   │   │   ├── blog/           # Blog content
│   │   │   ├── careers/        # Job listings / applications
│   │   │   ├── community/      # Community / social features
│   │   │   ├── corporate/      # Corporate wellness
│   │   │   ├── courses/        # Learning courses
│   │   │   ├── events/         # Events management
│   │   │   ├── health-tools/   # Mood, journal, meditation tools
│   │   │   ├── health/         # Health routes
│   │   │   ├── ngo/            # NGO partnerships
│   │   │   ├── notifications/  # Push notifications
│   │   │   ├── payments/       # Razorpay payment integration
│   │   │   ├── shop/           # E-commerce shop
│   │   │   ├── therapy/        # Therapy session booking
│   │   │   └── users/          # User management/profiles
│   │   ├── routes/             # Express route wiring (21 route files)
│   │   ├── services/           # Cross-cutting services (email, cache, storage, queue, AI logger)
│   │   ├── shared/             # Shared contracts, utils, types, middleware
│   │   └── validators/         # Legacy top-level validators
│   ├── .env.example
│   ├── .env.production
│   ├── package.json
│   └── tsconfig.json
├── src/                        # Frontend (React 19 + Vite + TypeScript)
│   ├── components/
│   │   ├── layout/             # Navigation, Footer, SmoothScrollProvider
│   │   └── ui/                 # 55 shadcn/ui + custom UI primitives
│   ├── config/                 # Runtime flags, routes config, validation schemas, permissions
│   ├── constants/              # App-wide constants (API, storage keys, nav items)
│   ├── context/                # React Context (AuthContext, ThemeContext)
│   ├── features/               # Feature slices (co-located components, hooks, services)
│   │   ├── about/
│   │   ├── auth/
│   │   ├── business/
│   │   ├── constellation/
│   │   ├── courses/
│   │   ├── dashboard/
│   │   ├── journey-preparation/
│   │   ├── landing/
│   │   ├── onboarding/
│   │   ├── student-counselling/
│   │   └── workshop/
│   ├── hooks/                  # Custom hooks (useDashboard, useDocumentTitle, responsive, advanced)
│   ├── layouts/                # MainLayout, DashboardLayout, AuthLayout
│   ├── lib/                    # Utility libs (utils.ts with cn helper)
│   ├── pages/                  # Page-level React components
│   │   ├── auth/               # LoginPage, SignupPage
│   │   ├── dashboard/          # 15 dashboard sub-pages
│   │   ├── practitioner/       # PractitionerDashboard (ORPHANED — not in router)
│   │   └── *.tsx               # 12 public pages
│   ├── router/                 # React Router v7 setup + ProtectedRoute
│   ├── services/               # API service, analytics, storage, websocket
│   ├── types/                  # TypeScript type definitions (21 type files)
│   └── utils/                  # Error handling, helpers, security, validators
├── tests/
│   └── example.spec.ts         # Single Playwright e2e test (placeholder)
├── .env.example                # Frontend env template (VITE_AUTH_BYPASS=true ⚠️)
├── .env.local                  # ⚠️ COMMITTED — local env vars (security risk)
├── .env.production             # Production env vars placeholder
├── .gitignore
├── .prettierrc / .prettierignore
├── .huskyrc
├── .vercelignore
├── Dockerfile                  # Multi-stage: frontend-deps → frontend-build → nginx; backend
├── README.md
├── agentprompt.txt             # AI agent instructions
├── commitlint.config.js
├── components.json             # shadcn/ui component config
├── docker-compose.yml          # PostgreSQL + frontend + backend services
├── eslint.config.js
├── index.html                  # Vite entry HTML
├── nginx.conf                  # nginx static serving config
├── package.json                # Frontend dependencies
├── package-lock.json
├── playwright.config.ts
├── postcss.config.js
├── skills-lock.json            # AI skills lock file
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json / tsconfig.test.json
├── vercel.json                 # Vercel SPA rewrite config
└── vite.config.ts              # Vite config with manual chunk splitting
```

---

## 3. File Extension Count Table

| Extension | Count | Category |
|-----------|-------|----------|
| `.png` | 585 | Static asset (images) |
| `.ts` | 238 | Source (TypeScript) |
| `.md` | 201 | Documentation |
| `.tsx` | 178 | Source (React TypeScript) |
| `.json` | 81 | Config / data |
| `.jpg` | 57 | Static asset (images) |
| `.svg` | 15 | Static asset (vector) |
| `.js` | 5 | Config scripts |
| `.mjs` | 4 | ES module scripts |
| `.txt` | 2 | Text files |
| `.sql` | 2 | Database migrations |
| `.production` | 2 | Production env files |
| `.example` | 2 | Env template files |
| `.yml` | 1 | CI/CD workflow (2 files under .github/workflows counted as 1 ext collectively) |
| `.prisma` | 1 | Database schema |
| `.prettierrc` | 1 | Formatter config |
| `.conf` | 1 | nginx config |
| `.toml` | 1 | Prisma migration lock |
| `.css` | 1 | Global styles |
| `.html` | 1 | Vite entry HTML |
| `.cjs` | 1 | CommonJS script |
| **TOTAL** | **1,389** | |

> Note: `.production`, `.example`, `.prettierignore`, `.gitignore`, `.vercelignore`, `.huskyrc`, `.dockerignore`, `.local`, `.log` are dotfiles counted by their full extension.

---

## 4. Significant File Counts by Category

| Category | Count | Notes |
|----------|-------|-------|
| **Total source files** (`.ts` + `.tsx`) | 416 | Frontend: ~178 tsx + ~100 ts; Server: ~138 ts |
| **Config files** | ~25 | package.json, tsconfig*, vite.config, eslint, tailwind, postcss, playwright, docker*, vercel, nginx, commitlint, .prettierrc, components.json |
| **Documentation files** | ~201 | `.md` files across docs/, src/, README.md, agentprompt.txt |
| **Test files** | 1 | `tests/example.spec.ts` (placeholder only) |
| **Static assets (images)** | 657 | 585 `.png` + 57 `.jpg` + 15 `.svg` |
| **Database/Schema files** | 3 | schema.prisma + 2 SQL migrations |
| **Scripts** | 7 | scripts/, .husky/, prisma seed |
| **AI skill definitions** | ~72 | .kiro/skills + .qwen/skills + .agent/skills (mirror sets) |

---

## 5. High-Level Folder Purpose

| Directory | Purpose | Implementation State |
|-----------|---------|---------------------|
| `src/` | React 19 SPA frontend | Mixed: public pages hardcoded, dashboard pages partially API-wired |
| `server/` | Express + Prisma backend API | Partially implemented; many modules stubbed or backend-only |
| `public/images/` | Static image assets for all pages | Live (served statically) |
| `docs/` | Planning, architecture, audit docs | Docs-only; significant drift from code reality |
| `tests/` | End-to-end Playwright tests | 1 placeholder test; effectively no test coverage |
| `scripts/` | Build tooling (bundle budget, responsive audit) | Implemented but optional; not wired to CI |
| `.github/workflows/` | GitHub Actions CI/CD | Partially implemented; lint failures silenced |
| `.kiro/` `.qwen/` `.agent/` | AI agent skill definitions | Docs-only (marketing/CRO prompt templates) |

---

## 6. Critical Architecture Findings

### Auth Bypass Risk
- `VITE_AUTH_BYPASS` **defaults to `true`** in both `.env.example` and `src/config/runtime.flags.ts` fallback
- `ProtectedRoute` returns `<Outlet />` unconditionally when `authBypassEnabled === true`
- Evidence: `src/config/runtime.flags.ts:6` — `const authBypassEnabled = parseBooleanEnv(import.meta.env.VITE_AUTH_BYPASS, true)`

### README vs Code Drift
| README Claim | Code Reality |
|---|---|
| React Query for data fetching | Not installed; custom `apiService` (native fetch) used |
| Zustand for state management | Not installed; React Context used |
| Socket.io for real-time | Not installed; `ws` package used server-side |
| Redis for caching | No Redis client in server/package.json |
| Railway/Heroku for backend | Only `vercel.json` exists (frontend SPA) |

### Build Status
| Check | Status | Detail |
|---|---|---|
| Frontend `type-check` | ✅ PASS | `tsc --noEmit` exits 0 |
| Frontend `build` | ❌ FAIL | Missing type defs (vite/client, node) — node_modules not installed in audit env |
| Server `build` | ❌ FAIL | Missing type defs (zod, crypto, express) — node_modules not installed in audit env |
| `lint:check` | ⚠️ N/A | `eslint` not found in PATH — not installed in audit env |
| Server `prisma validate` | Not run | server node_modules absent |

### Committed Secrets Risk
- `.env.local` is present in the repo (evidence: found in file listing)
- docker-compose.yml contains plaintext `JWT_SECRET=change-me-in-production`

---

## Static Asset Inventory

> **Generated**: Batch 10 (2026-07-15)
> **Source**: `find /public -type f | sort`
> **Note**: All assets live under `public/images/`. No `src/assets/` directory exists.

### Summary

| Category | Count |
|----------|-------|
| Favicon / Root | 1 |
| Authentication page | 5 |
| Blog images | 18 |
| Career images | 11 |
| Contact icons | 10 |
| Course images | 17 |
| Error page images | 12 |
| General / Decorative | 20 |
| Journey Preparation | 1 |
| Onboarding images | 2 |
| Service images | 10 |
| Student Counselling | 7 |
| Workshop images | 6 |
| **Total** | **120** |

### Detailed Asset Table

| Path | Type | Feature/Page | Referenced | Notes |
|------|------|-------------|------------|-------|
| public/favicon.svg | SVG icon | App-wide | Yes - index.html | Brand favicon |
| public/images/arrow.svg | SVG UI | General nav | Likely Footer/Nav | Navigation arrow icon |
| public/images/auth/apple-icon.png | PNG icon | LoginPage/SignupPage | Yes - OAuth button | Non-functional Apple OAuth |
| public/images/auth/blue-ellipse.png | PNG decor | Auth pages | Yes - background | Ambient orb decor |
| public/images/auth/google-icon.png | PNG icon | LoginPage/SignupPage | Yes - OAuth button | Non-functional Google OAuth |
| public/images/auth/orange-ellipse.png | PNG decor | Auth pages | Yes - background | Ambient orb decor |
| public/images/auth/sy-main-logo.png | PNG logo | Auth pages | Yes - form header | Soul Yatri auth logo |
| public/images/blogs/blogs-author-icon-dark.png | PNG icon | BlogsPage | Yes | Author placeholder dark |
| public/images/blogs/blogs-author-icon-light.png | PNG icon | BlogsPage | Yes | Author placeholder light |
| public/images/blogs/blogs-card-01.jpg | JPG content | BlogsPage | Yes | Blog post 1 image |
| public/images/blogs/blogs-card-02.jpg | JPG content | BlogsPage | Yes | Blog post 2 image |
| public/images/blogs/blogs-card-03.jpg | JPG content | BlogsPage | Yes | Blog post 3 image |
| public/images/blogs/blogs-card-04.jpg | JPG content | BlogsPage | Yes | Blog post 4 image |
| public/images/blogs/blogs-card-05.jpg | JPG content | BlogsPage | Yes | Blog post 5 image |
| public/images/blogs/blogs-card-06.jpg | JPG content | BlogsPage | Yes | Blog post 6 image |
| public/images/blogs/blogs-card-07.jpg | JPG content | BlogsPage | Yes | Blog post 7 image |
| public/images/blogs/blogs-card-08.jpg | JPG content | BlogsPage | Yes | Blog post 8 image |
| public/images/blogs/blogs-card-09.jpg | JPG content | BlogsPage | Yes | Blog post 9 image |
| public/images/blogs/blogs-card-10.jpg | JPG content | BlogsPage | Yes | Blog post 10 image |
| public/images/blogs/blogs-card-11.png | PNG content | BlogsPage | Yes | Blog post 11 image |
| public/images/blogs/blogs-card-12.jpg | JPG content | BlogsPage | Yes | Blog post 12 image |
| public/images/blogs/blogs-card-13.jpg | JPG content | BlogsPage | Yes | Blog post 13 image |
| public/images/blogs/blogs-card-14.jpg | JPG content | BlogsPage | Yes | Blog post 14 image |
| public/images/blogs/blogs-card-15.jpg | JPG content | BlogsPage | Yes | Blog post 15 image |
| public/images/blogs/blogs-divider-line.svg | SVG divider | BlogsPage | Yes | Section divider |
| public/images/blogs/blogs-footer-logo.png | PNG logo | BlogsPage footer | Yes | Footer logo variant |
| public/images/blogs/blogs-grey-ellipse.svg | SVG decor | BlogsPage | Yes | Background ellipse |
| public/images/blogs/blogs-header-logo.png | PNG logo | BlogsPage header | Yes | Header logo variant |
| public/images/blogs/blogs-header-vline.svg | SVG divider | BlogsPage header | Yes | Vertical divider line |
| public/images/blogs/blogs-search-icon.png | PNG icon | BlogsPage | Yes | Search icon |
| public/images/blogs/blogs-social-facebook.png | PNG icon | BlogsPage | Yes | Social share icon |
| public/images/blogs/blogs-social-instagram.png | PNG icon | BlogsPage | Yes | Social share icon |
| public/images/blogs/blogs-social-linkedin.png | PNG icon | BlogsPage | Yes | Social share icon |
| public/images/blogs/blogs-social-twitter.png | PNG icon | BlogsPage | Yes | Social share icon |
| public/images/blue-ellipse-2.svg | SVG decor | General | Likely general use | Background decor |
| public/images/blue-ellipse.svg | SVG decor | General | Likely general use | Background decor |
| public/images/careers/career-collage-01.jpg | JPG content | CareerPage | Yes - collage grid | Career collage image 1 |
| public/images/careers/career-collage-02.jpg | JPG content | CareerPage | Yes | Career collage 2 |
| public/images/careers/career-collage-03.jpg | JPG content | CareerPage | Yes | Career collage 3 |
| public/images/careers/career-collage-04.jpg | JPG content | CareerPage | Yes | Career collage 4 |
| public/images/careers/career-collage-05.jpg | JPG content | CareerPage | Yes | Career collage 5 |
| public/images/careers/career-collage-06.jpg | JPG content | CareerPage | Yes | Career collage 6 |
| public/images/careers/career-collage-07.jpg | JPG content | CareerPage | Yes | Career collage 7 |
| public/images/careers/career-collage-08.jpg | JPG content | CareerPage | Yes | Career collage 8 |
| public/images/careers/career-collage-09.jpg | JPG content | CareerPage | Yes | Career collage 9 |
| public/images/careers/career-collage-10.jpg | JPG content | CareerPage | Yes | Career collage 10 |
| public/images/careers/career-team-member.png | PNG portrait | CareerPage | Yes | Team member photo |
| public/images/concentric-circles.svg | SVG decor | General | Yes - SplashScreen/LandingPage | Decorative circles |
| public/images/contact/contact-back-button.svg | SVG icon | ContactPage | Yes | Back navigation icon |
| public/images/contact/contact-flag-icon.png | PNG icon | ContactPage | Yes - phone field | India flag for +91 |
| public/images/contact/contact-footer-logo.png | PNG logo | ContactPage | Yes | Footer logo for contact page |
| public/images/contact/contact-mail-icon.png | PNG icon | ContactPage | Yes | Email contact method icon |
| public/images/contact/contact-main-logo.png | PNG logo | ContactPage | Yes | Main logo on contact page |
| public/images/contact/contact-phone-icon.png | PNG icon | ContactPage | Yes | Phone contact method icon |
| public/images/contact/contact-social-facebook.png | PNG icon | ContactPage | Yes | Social link |
| public/images/contact/contact-social-instagram.png | PNG icon | ContactPage | Yes | Social link |
| public/images/contact/contact-social-linkedin.png | PNG icon | ContactPage | Yes | Social link |
| public/images/contact/contact-social-twitter.png | PNG icon | ContactPage | Yes | Social link |
| public/images/corporate-figma.png | PNG content | CorporatePage | Yes - hero image | Corporate hero photo |
| public/images/corporate-wellness.jpg | JPG content | CorporatePage/BusinessPage | Possibly | Corporate wellness stock photo |
| public/images/courses/back-button.png | PNG icon | CoursesPage | Yes | Back navigation icon |
| public/images/courses/back-button.svg | SVG icon | CoursesPage | Yes | SVG version of back button |
| public/images/courses/bg-grey-ellipse.png | PNG decor | CoursesPage | Yes | Page background decor |
| public/images/courses/card-gradient.png | PNG overlay | CoursesPage | Yes | Card gradient overlay |
| public/images/courses/course-anxiety-1.jpg | JPG content | CoursesPage | Yes | Anxiety course image 1 |
| public/images/courses/course-anxiety-2.jpg | JPG content | CoursesPage | Yes | Anxiety course image 2 |
| public/images/courses/course-anxiety-3.jpg | JPG content | CoursesPage | Yes | Anxiety course image 3 |
| public/images/courses/course-career-1.jpg | JPG content | CoursesPage | Yes | Career course image 1 |
| public/images/courses/course-career-2.jpg | JPG content | CoursesPage | Yes | Career course image 2 |
| public/images/courses/course-career-3.jpg | JPG content | CoursesPage | Yes | Career course image 3 |
| public/images/courses/course-relationship-1.jpg | JPG content | CoursesPage | Yes | Relationship course 1 |
| public/images/courses/course-relationship-2.jpg | JPG content | CoursesPage | Yes | Relationship course 2 |
| public/images/courses/course-relationship-3.jpg | JPG content | CoursesPage | Yes | Relationship course 3 |
| public/images/courses/course-sleep-1.jpg | JPG content | CoursesPage | Yes | Sleep course 1 |
| public/images/courses/course-sleep-2.jpg | JPG content | CoursesPage | Yes | Sleep course 2 |
| public/images/courses/course-sleep-3.jpg | JPG content | CoursesPage | Yes | Sleep course 3 |
| public/images/courses/footer-line-top.png | PNG decor | CoursesPage | Yes | Footer border line |
| public/images/courses/footer-logo.png | PNG logo | CoursesPage | Yes | Footer logo |
| public/images/courses/header-divider.png | PNG divider | CoursesPage | Yes | Header divider |
| public/images/courses/header-logo.png | PNG logo | CoursesPage | Yes | Header logo |
| public/images/courses/search-icon.png | PNG icon | CoursesPage | Yes | Search icon |
| public/images/courses/social-facebook.png | PNG icon | CoursesPage | Yes | Social link |
| public/images/courses/social-instagram.png | PNG icon | CoursesPage | Yes | Social link |
| public/images/courses/social-linkedin.png | PNG icon | CoursesPage | Yes | Social link |
| public/images/courses/social-twitter.png | PNG icon | CoursesPage | Yes | Social link |
| public/images/courses/star.png | PNG icon | CoursesPage | Yes | Rating star icon |
| public/images/error/back-button.png | PNG icon | NotFoundPage | Yes | Back navigation button |
| public/images/error/direction-arrow.png | PNG icon | NotFoundPage | Yes | Navigation hint arrow |
| public/images/error/ellipse-bg.png | PNG decor | NotFoundPage | Yes | Background ellipse |
| public/images/error/facebook-link.png | PNG icon | NotFoundPage | Yes | Social link |
| public/images/error/happy-face.png | PNG illustration | NotFoundPage | UNUSED - src uses Figma URL | Should replace external Figma URL |
| public/images/error/instagram-link.png | PNG icon | NotFoundPage | Yes | Social link |
| public/images/error/line-divider-1.png | PNG divider | NotFoundPage | Yes | Divider line |
| public/images/error/line-divider-2.png | PNG divider | NotFoundPage | Yes | Divider line variant |
| public/images/error/linkedin-link.png | PNG icon | NotFoundPage | Yes | Social link |
| public/images/error/loupe-search-icon.png | PNG icon | NotFoundPage | Yes | Search icon |
| public/images/error/polygon-shape.png | PNG decor | NotFoundPage | Yes | Decorative polygon |
| public/images/error/soul-yatri-logo-footer.png | PNG logo | NotFoundPage | Yes | Footer logo |
| public/images/error/soul-yatri-main-logo.png | PNG logo | NotFoundPage | Yes | Main logo |
| public/images/error/twitter-link.png | PNG icon | NotFoundPage | Yes | Social link |
| public/images/facebook-link.png | PNG icon | Footer/General | Yes | Social link (root level) |
| public/images/feature-1on1-sessions.jpg | JPG content | LandingPage | Yes - WellnessSection | Feature highlight image |
| public/images/feature-guided-plan.jpg | JPG content | LandingPage | Yes - WellnessSection | Feature highlight image |
| public/images/feature-micro-tools.jpg | JPG content | LandingPage | Yes - WellnessSection | Feature highlight image |
| public/images/feature-plan.png | PNG content | LandingPage | Yes - HowItWorksSection | Feature card image |
| public/images/feature-sessions.png | PNG content | LandingPage | Yes - HowItWorksSection | Feature card image |
| public/images/feature-tools.png | PNG content | LandingPage | Yes - HowItWorksSection | Feature card image |
| public/images/gradient-overlay.png | PNG overlay | General | Yes - multiple pages | Gradient fade overlay |
| public/images/grey-blur-circle.svg | SVG decor | LandingPage | Yes - SoulBotSection | Background blur decoration |
| public/images/grey-ellipse.svg | SVG decor | General | Yes | Background ellipse |
| public/images/hero-lotus-bg.png | PNG content | LandingPage | Yes - HeroSection | Lotus background behind monk |
| public/images/hero-monk.png | PNG content | LandingPage | Yes - HeroSection | Main hero monk figure image |
| public/images/icon-anxious.png | PNG icon | LandingPage | Yes - SoulBotSection | AI quick action icon |
| public/images/icon-breathe.png | PNG icon | LandingPage | Yes - SoulBotSection | AI quick action icon |
| public/images/icon-mic.png | PNG icon | LandingPage | Yes - SoulBotSection | Voice input icon |
| public/images/icon-sad.png | PNG icon | LandingPage | Yes - SoulBotSection | AI quick action icon |
| public/images/insta-link.png | PNG icon | Footer/General | Yes | Instagram social link |
| public/images/journey-preparation/mandala.png | PNG animation | JourneyPreparationPage | Yes | Mandala animation background |
| public/images/line-58.svg | SVG divider | General | Yes | Divider line element |
| public/images/linkedin-link.png | PNG icon | Footer/General | Yes | LinkedIn social link |
| public/images/main-logo.png | PNG logo | Navigation/General | Yes - multiple components | Primary Soul Yatri logo |
| public/images/model-image.png | PNG content | LandingPage/General | Yes | Model/person lifestyle image |
| public/images/onboarding/astrology-hero.png | PNG content | SignupPage astrology step | Yes | Astrology step hero image |
| public/images/onboarding/create-account-hero.png | PNG content | SignupPage account step | Yes | Account creation step hero |
| public/images/orange-line.svg | SVG decor | General | Likely | Orange accent line |
| public/images/orange-stroke.svg | SVG decor | General | Likely | Orange stroke accent |
| public/images/robot.png | PNG illustration | LandingPage/SoulBot | Yes | Robot/AI illustration |
| public/images/service-breathwork-figma.png | PNG content | ServicesSection | Yes - Breathwork card | Service card image |
| public/images/service-breathwork.jpg | JPG content | General | Possibly duplicate | Legacy service image |
| public/images/service-counsellor-figma.png | PNG content | ServicesSection | Yes - Counsellor card | Service card image |
| public/images/service-counsellor.jpg | JPG content | General | Possibly duplicate | Legacy service image |
| public/images/service-courses-figma.png | PNG content | General | Possibly | Courses service image |
| public/images/service-healer-figma.png | PNG content | ServicesSection | Yes - Healer card | Service card image |
| public/images/service-healer.jpg | JPG content | General | Possibly duplicate | Legacy service image |
| public/images/service-therapist-figma.png | PNG content | ServicesSection | Yes - Therapist card | Service card image |
| public/images/service-therapist.jpg | JPG content | General | Possibly duplicate | Legacy service image |
| public/images/soul-yatri-logo-footer.png | PNG logo | Footer | Yes | Footer logo variant |
| public/images/soul-yatri-logo.png | PNG logo | General | Yes | Logo variant |
| public/images/student-counselling/certified-counsellors.jpg | JPG content | StudentCounsellingPage | Yes | Feature card image |
| public/images/student-counselling/counselling-access.jpg | JPG content | StudentCounsellingPage | Yes | Feature card image |
| public/images/student-counselling/crisis-support.jpg | JPG content | StudentCounsellingPage | Yes | Feature card image |
| public/images/student-counselling/emotional-assessment.jpg | JPG content | StudentCounsellingPage | Yes | Feature card image |
| public/images/student-counselling/gradient-overlay.jpg | JPG overlay | StudentCounsellingPage | Yes | Section gradient overlay |
| public/images/student-counselling/hero-student.jpg | JPG content | StudentCounsellingPage | Yes | Hero section image |
| public/images/student-counselling/online-screenings.jpg | JPG content | StudentCounsellingPage | Yes | Feature card image |
| public/images/twitter-link.png | PNG icon | Footer/General | Yes | Twitter/X social link |
| public/images/wellness-silhouette.png | PNG content | LandingPage | Yes - WellnessSection | Wellness hero silhouette |
| public/images/workshops/burnout-prevention.jpg | JPG content | WorkshopDemoPage | Yes | Workshop card image |
| public/images/workshops/emotional-intelligence.jpg | JPG content | WorkshopDemoPage | Yes | Workshop card image |
| public/images/workshops/gradient-overlay.jpg | JPG overlay | WorkshopDemoPage | Yes | Section gradient overlay |
| public/images/workshops/leadership-mindfulness.jpg | JPG content | WorkshopDemoPage | Yes | Workshop card image |
| public/images/workshops/stress-anxiety.jpg | JPG content | WorkshopDemoPage | Yes | Workshop card image |
| public/images/workshops/team-wellness.jpg | JPG content | WorkshopDemoPage | Yes | Workshop card image |

### Orphaned / Potentially Redundant Assets

| Asset | Issue | Recommendation |
|-------|-------|---------------|
| public/images/error/happy-face.png | EXISTS locally but NotFoundPage.tsx uses external Figma API URL instead | Replace Figma URL with this local asset path |
| public/images/service-breathwork.jpg | Possible legacy duplicate of service-breathwork-figma.png | Verify if both are used; remove unused one |
| public/images/service-counsellor.jpg | Possible legacy duplicate of service-counsellor-figma.png | Verify if both are used; remove unused one |
| public/images/service-healer.jpg | Possible legacy duplicate of service-healer-figma.png | Verify if both are used; remove unused one |
| public/images/service-therapist.jpg | Possible legacy duplicate of service-therapist-figma.png | Verify if both are used; remove unused one |
| public/images/corporate-wellness.jpg | Referenced origin unclear; check if actually used in code | Run grep to verify references |

### Notes

1. **No `src/assets/` directory exists** — all static assets are in `public/` and served as-is by Vite.
2. **No webfonts** are bundled as static assets — fonts appear to be loaded via Google Fonts CSS imports or system fonts.
3. **No video or audio files** exist in public/ — despite meditation page referencing guided audio content, no audio files are present.
4. **Image format inconsistency**: mix of PNG, JPG, and SVG without clear optimization strategy. PNG used where JPG would reduce file size (e.g., hero-monk.png).
5. **Practitioner assets**: `public/images/practitioner/` directory is referenced in `src/pages/practitioner/PractitionerDashboard.tsx` (imgSoulYatriLogo.png, imgImage.png) but was NOT found in the public directory listing — these assets may be missing and cause broken images in the practitioner dashboard.
