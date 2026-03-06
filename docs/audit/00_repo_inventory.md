# Repository Inventory — Soul Yatri

## Overview
- **Product**: Soul Yatri — Wellness & mental health platform
- **Repository Type**: Monorepo (frontend + backend + docs)
- **Total Files** (excl. node_modules/.git): ~8,557
- **Core Source Files**: ~740 (src: 257, server: 481, scripts: 2)
- **Documentation Files**: 537 (docs/ directory)
- **Static Assets**: 153 (public/)
- **Test Files**: 1 (tests/example.spec.ts with 15 test cases)
- **AI Agent Cache**: 6,676 files (.agent/ — excluded from review)

## Extension Distribution (excluding vendor/generated)

| Extension | Count | Notes |
|-----------|-------|-------|
| .md | 3,733 | Mostly in .agent/ cache; ~40 meaningful docs |
| .patch | 1,298 | All in .agent/ cache |
| .py | 918 | All in .agent/ cache |
| .png | 594 | ~130 in public/, rest in .agent/ |
| .ts | 276 | Core backend source |
| .tsx | 212 | Core frontend source |
| .json | 161 | Config + data files |
| .xsd | 156 | All in .agent/ cache |
| .ttf | 108 | All in .agent/ cache |
| .js | 54 | Config + scripts |
| .csv | 46 | Mostly in .agent/ |
| .svg | 17 | public/ vector assets |
| .css | 7 | Tailwind + component styles |
| .html | 9 | Entry point + playwright reports |
| .yml/.yaml | 22 | CI/CD + docker configs |
| .sql | 4 | Database migrations |
| .mjs | 4 | ES module scripts |

## Top-Level Structure

```
soul-yatri-website/
├── src/                    # Frontend React app (257 files)
│   ├── components/         # 58 files (52 shadcn/ui + layout + error boundary)
│   ├── config/             # 5 files (app config, permissions, routes, runtime flags, validation)
│   ├── constants/          # 4 files (app, navigation, responsive)
│   ├── context/            # 3 files (AuthContext, ThemeContext)
│   ├── features/           # 95 files (12 feature modules)
│   ├── hooks/              # 5 files (async, responsive, mobile, dashboard, document title)
│   ├── layouts/            # 4 files (Auth, Dashboard, Main)
│   ├── lib/                # 1 file (cn utility)
│   ├── middleware/         # 2 files (API middleware)
│   ├── pages/              # 36 files (18+ route pages)
│   ├── router/             # 2 files (router + ProtectedRoute)
│   ├── services/           # 5 files (API, analytics, storage, websocket)
│   ├── types/              # 21 files (comprehensive type definitions)
│   └── utils/              # 12 files (errors, helpers, validators, security, testing)
│
├── server/                 # Backend Express app (481 files)
│   ├── src/
│   │   ├── config/         # 2 files (env validation, config index)
│   │   ├── controllers/    # 12 files (3 implemented, 9 stubbed)
│   │   ├── lib/            # 8 files (async-handler, logger, prisma, errors, response, ws, dev-login, upload)
│   │   ├── middleware/     # 7 files (auth, RBAC, security/rate-limit, request-context, error, upload, user-rate-limit)
│   │   ├── modules/        # 71 files (18 modules × 4 files each, ALL EMPTY STUBS)
│   │   ├── routes/         # 23 files (3 real, 20 stub routes)
│   │   ├── services/       # 6 files (tokens, email, cache, queue, storage, audit)
│   │   ├── shared/         # 13 files (contracts, constants, error codes)
│   │   └── validators/     # 12 files (Zod schemas for all domains)
│   └── prisma/             # Schema + 2 migrations
│
├── docs/                   # 537 files (documentation + execution tracking)
│   ├── *.md                # 17 top-level docs
│   ├── audit/              # THIS audit output
│   └── execution/          # Batch execution tracking
│
├── public/                 # 153 static assets
│   └── images/             # Organized by feature (auth, blogs, careers, contact, courses, etc.)
│
├── tests/                  # 1 file (example.spec.ts — 15 Playwright smoke tests)
├── scripts/                # 2 files (bundle budgets, responsive audit)
├── playwright-utils/       # 4 files (API testing, browser automation, web scraping, index)
├── .github/workflows/      # 2 files (build.yml, quality.yml)
├── .husky/                 # 2 files (pre-commit, commit-msg hooks)
└── [config files]          # 15+ top-level config files
```

## Excluded / Generated / Vendor Areas

| Area | Files | Reason |
|------|-------|--------|
| node_modules/ | ~thousands | NPM vendor dependencies |
| .git/ | ~thousands | Version control |
| dist/ | 256 | Build output (regenerated) |
| .agent/ | 6,676 | AI assistant cache (md, patch, py, xsd, ttf) |
| .agents/ | 117 | Marketing skills agent definitions |
| playwright-report/ | 37 | Test report (generated) |
| test-results/ | 1 | Test output |

## Technology Stack (Verified from Code)

### Frontend
- React 19.2.0 + TypeScript 5.9.3
- Vite 7.2.4 (build + dev server)
- Tailwind CSS 3.4.19 + shadcn/ui (New York style)
- React Router DOM 7.13.0 (SPA routing)
- Framer Motion 12.34.3 + GSAP 3.14.2 + Anime.js 4.3.6 (animation)
- Three.js 0.183.1 + @react-three/fiber + drei (3D, used for constellation)
- Recharts 2.15.4 (data visualization)
- React Hook Form 7.70.0 + Zod 4.3.5 (forms + validation)
- 28 @radix-ui packages (accessible UI primitives)

### Backend
- Express.js (TypeScript)
- Prisma 7.4 ORM
- PostgreSQL 16
- JWT (jsonwebtoken) + bcrypt (cost 12)
- Winston (structured logging)
- Helmet + cors + express-rate-limit (security)
- Multer + Sharp (file uploads + image processing)
- ws (native WebSocket, NOT Socket.io)
- Zod (runtime validation)

### DevOps
- Docker + docker-compose (multi-stage builds)
- Nginx (frontend static server)
- Vercel (SPA deployment config)
- GitHub Actions (CI: build + quality)
- Husky (pre-commit + commit-msg hooks)
- Commitlint (conventional commits)
- Playwright (E2E testing, 5 browser targets)
- ESLint 9 (strict + accessibility rules)

## Build Verification Results

| Command | Result | Notes |
|---------|--------|-------|
| `npm run type-check` | ✅ PASS | 0 TypeScript errors |
| `npx eslint ./src/` | ✅ PASS | 0 errors, 0 warnings in source |
| `npm run build` | ✅ PASS | 2261 modules, 41.59s |
| `server: npm run build` | ✅ PASS | Compiles clean |
| `prisma validate` | ✅ PASS | Schema valid |
| `npm run lint:check` (all) | ❌ FAIL | 775 errors in playwright-report/ generated JS (not source) |
