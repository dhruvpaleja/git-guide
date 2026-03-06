# Repository Inventory — Soul Yatri Website

## Overview

| Metric | Value |
|--------|-------|
| Total files | 4,684 |
| Semantic-reviewed (code/config/docs) | 416 |
| Inventoried only (images/SVG/binary) | 4,268 |
| Excluded from deep review | node_modules/, .git/, dist/ (not present) |

## Extension Breakdown

| Extension | Count | Category |
|-----------|-------|----------|
| .svg | 3,290 | Static Asset |
| .png | 593 | Static Asset |
| .ts | 238 | Source Code |
| .md | 201 | Documentation |
| .tsx | 178 | Source Code |
| .json | 81 | Config/Data |
| .jpg | 58 | Static Asset |
| .js | 9 | Config/Script |
| .mjs | 4 | Script |
| .yml | 3 | CI/CD |
| .cjs | 3 | Config/Script |
| .sql | 2 | Migration |
| .css | 1 | Stylesheet |
| .prisma | 1 | Schema |
| .html | 1 | Entry Point |
| .conf | 1 | Infra Config |
| .woff2 | 1 | Font |
| .log | 1 | Artifact (should not be committed) |

## High-Level Structure Map

```
soul-yatri-website/
├── src/                    # Frontend (React 19 + TypeScript + Vite)
│   ├── components/         # Shared UI (shadcn/ui + custom)
│   ├── config/             # App config, routes, runtime flags
│   ├── constants/          # App-wide constants
│   ├── context/            # React Context (Auth, Theme)
│   ├── features/           # Feature modules (landing, auth, dashboard, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # MainLayout, DashboardLayout, AuthLayout
│   ├── middleware/         # API request middleware
│   ├── pages/              # Route page components
│   ├── router/             # React Router config + ProtectedRoute
│   ├── services/           # API, WebSocket, Analytics, Storage services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helpers, validators, security, errors
│
├── server/                 # Backend (Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── config/         # Server config + env validation
│   │   ├── controllers/    # Route handlers (ACTIVE - 12 files)
│   │   ├── lib/            # Core libs (prisma, logger, websocket, errors)
│   │   ├── middleware/     # Auth, RBAC, security, upload, rate-limit
│   │   ├── modules/        # Feature modules (ABANDONED - 18 dirs, all stubs)
│   │   ├── routes/         # Express route definitions (23 files)
│   │   ├── services/       # Cache, email, queue, storage (mostly stubs)
│   │   ├── shared/         # Contracts, types, utils
│   │   └── validators/     # Zod validation schemas
│   └── prisma/
│       ├── schema.prisma   # 20 models, 2 migrations
│       └── migrations/     # 2 SQL migrations
│
├── public/                 # Static assets
│   ├── images/             # 130+ feature-mapped images
│   └── plugins/            # Situ design plugin bundles
│
├── docs/                   # Project documentation (20+ markdown files)
│   ├── audit/              # THIS audit output
│   └── execution/          # Build plan execution tracking
│
├── tests/                  # Playwright E2E tests (1 file)
├── scripts/                # Build scripts (bundle budget, responsive audit)
├── .github/workflows/      # CI/CD (build + quality pipelines)
├── .kiro/skills/           # Kiro AI marketing skill definitions
└── .qwen/skills/           # Qwen AI marketing skill definitions
```

## Actual Stack (Verified from package.json + code)

### Frontend
| Technology | Version | Status |
|-----------|---------|--------|
| React | 19.2.0 | ✅ Installed |
| TypeScript | ~5.9.3 | ✅ Installed |
| Vite | ^7.2.4 | ✅ Installed |
| Tailwind CSS | ^3.4.19 | ✅ Installed |
| React Router DOM | ^7.13.0 | ✅ Installed |
| Framer Motion | ^12.34.3 | ✅ Installed |
| GSAP | ^3.14.2 | ✅ Installed |
| Three.js | ^0.183.1 | ✅ Installed |
| Radix UI (15 primitives) | Various | ✅ Installed |
| shadcn/ui | N/A (copy-paste) | ✅ Present |
| Recharts | ^2.15.4 | ✅ Installed |
| React Hook Form + Zod | Latest | ✅ Installed |
| zxcvbn | ^4.4.2 | ✅ Installed |
| Zustand | — | ❌ NOT INSTALLED (docs claim it) |
| React Query | — | ❌ NOT INSTALLED (docs claim it) |

### Backend
| Technology | Version | Status |
|-----------|---------|--------|
| Express | 4.21.2 | ✅ Installed |
| TypeScript | ~5.9.3 | ✅ Installed |
| Prisma | 7.4.2 | ✅ Installed |
| PostgreSQL (adapter) | — | ✅ Via Prisma |
| jsonwebtoken | 9.0.3 | ✅ Installed |
| bcrypt | 6.0.0 | ✅ Installed |
| ws (WebSocket) | 8.19.0 | ✅ Installed |
| Winston (logging) | 3.19.0 | ✅ Installed |
| Multer + Sharp | Latest | ✅ Installed |
| Helmet + CORS | Latest | ✅ Installed |
| express-rate-limit | 8.2.1 | ✅ Installed |
| Zod + zxcvbn | Latest | ✅ Installed |
| Socket.io | — | ❌ NOT INSTALLED (docs claim it) |

## Excluded/Generated/Vendor Areas

| Area | Status | Reason |
|------|--------|--------|
| node_modules/ | NOT PRESENT | Dependencies not installed |
| dist/ | NOT PRESENT | No build output |
| .git/ | Excluded | Version control internal |
| .kiro/skills/ | Inventoried only | AI tool config, not app code |
| .qwen/skills/ | Inventoried only | AI tool config, not app code |
| public/plugins/situ-design/ | Inventoried only | Third-party design plugin bundles |
