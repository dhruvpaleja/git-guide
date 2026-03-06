# Repository Inventory

**Generated:** March 6, 2026  
**Total Files:** 84,566  
**Excluded (Vendor/Generated):** ~80,000 (node_modules, .git, dist, build)  
**Reviewable Files:** ~4,500

---

## File Extension Counts

| Extension | Count | Category |
|-----------|-------|----------|
| .ts/.tsx | ~1,200 | Source (Frontend) |
| .ts (server) | ~400 | Source (Backend) |
| .json | ~500 | Config/Data |
| .md | ~100 | Documentation |
| .svg/.png/.jpg | ~200 | Assets |
| .sql | ~10 | Migrations |
| .yml/.yaml | ~20 | CI/CD/Config |
| Other | ~70 | Misc |

---

## Directory Structure Map

```
soul-yatri-website/
├── src/                          # Frontend Source (~1,200 files)
│   ├── components/               # UI Components (shadcn/radix)
│   ├── context/                  # React Context (Auth, Theme)
│   ├── features/                 # Feature Modules
│   ├── hooks/                    # Custom Hooks
│   ├── layouts/                  # Layout Components
│   ├── pages/                    # Page Components
│   ├── router/                   # Routing Config
│   ├── services/                 # API Clients
│   ├── types/                    # TypeScript Types
│   ├── utils/                    # Utilities
│   ├── config/                   # App Configuration
│   ├── constants/                # Constants
│   └── middleware/               # API Middleware
├── server/                       # Backend Source (~400 files)
│   ├── src/
│   │   ├── config/              # Server Config
│   │   ├── controllers/         # Route Controllers
│   │   ├── lib/                 # Utilities
│   │   ├── middleware/          # Express Middleware
│   │   ├── modules/             # Domain Modules (duplicate?)
│   │   ├── routes/              # Route Definitions
│   │   ├── services/            # Business Logic
│   │   ├── shared/              # Shared Code
│   │   └── validators/          # Zod Schemas
│   ├── prisma/
│   │   ├── schema.prisma        # Database Schema
│   │   ├── migrations/          # DB Migrations
│   │   └── seed-dev.ts         # Seed Data
│   └── scripts/                 # Server Scripts
├── docs/                         # Documentation (~50 files)
│   ├── execution/               # Execution Tracking
│   └── *.md                     # Various Docs
├── tests/                        # E2E Tests (~20 files)
├── public/                       # Static Assets (~100 files)
│   └── images/                  # Image Assets
├── scripts/                      # Build Scripts (~5 files)
├── .github/workflows/            # CI/CD (~3 files)
├── .agent/, .agents/, .kiro/     # AI Agent Configs (~500 files)
└── Root Config Files            # (~20 files)
```

---

## Excluded/Generated/Vendor Areas

| Directory | Reason | Approx. Files |
|-----------|--------|---------------|
| node_modules/ | Vendor dependencies | ~60,000 |
| server/node_modules/ | Backend vendor | ~15,000 |
| .git/ | Version control | ~5,000 |
| dist/ | Frontend build output | ~100 |
| server/dist/ | Backend build output | ~200 |
| build/ | Alternative build output | ~100 |
| playwright-report/ | Test reports | ~50 |
| test-results/ | Test results | ~10 |

---

## High-Level Structure Quality: 70/100

### Strengths
- ✅ Clear separation of frontend/backend
- ✅ Feature-based organization in frontend
- ✅ Standard Express/Prisma backend structure
- ✅ Comprehensive UI component library (shadcn/radix)

### Weaknesses
- ⚠️ Controller/Module duplication in backend
- ⚠️ Multiple AI agent config directories (.agent, .agents, .kiro)
- ⚠️ Documentation overclaims implementation
- ⚠️ No clear ownership of shared types

### Recommendations
1. Consolidate `server/src/controllers/*` and `server/src/modules/*` into single pattern
2. Remove duplicate AI agent configurations
3. Add clear README in each major directory
4. Create architecture decision records (ADRs)
