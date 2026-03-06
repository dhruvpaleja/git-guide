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
