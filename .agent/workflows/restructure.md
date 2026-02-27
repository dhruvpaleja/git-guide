---
description: Project restructure plan for Soul Yatri - enterprise-grade 2000+ page architecture
---

# Soul Yatri Project Restructure - Completed

## Issues Found & Fixed

### 1. Duplicate Assets (FIXED ✅)
- **Root `/assets/` folder** — Deleted (exact duplicate of public/)
- **`/app/dist/` folder** — Deleted (build output, should never be committed)
- All assets consolidated into single location: `public/images/`

### 2. Generic Asset Names → Semantic Names (FIXED ✅)
| Old Name | New Name |
|----------|----------|
| `asset_1.png` | `images/hero-lotus-bg.png` |
| `asset_2.png` | `images/wellness-silhouette.png` |
| `asset_3.jpg` | `images/service-breathwork.jpg` |
| `asset_4.jpg` | `images/service-therapist.jpg` |
| `asset_5.jpg` | `images/service-counsellor.jpg` |e
| `asset_6.jpg` | `images/service-healer.jpg` |
| `asset_7.jpg` | `images/feature-guided-plan.jpg` |
| `asset_8.jpg` | `images/feature-1on1-sessions.jpg` |
| `asset_9.jpg` | `images/feature-micro-tools.jpg` |
| `asset_10.jpg` | `images/corporate-wellness.jpg` |
| `hero-monk.png` | `images/hero-monk.png` |

### 3. Empty Placeholder Directories (FIXED ✅)
Removed 12 empty directories that were just scaffolding noise:
- `src/components/common/`, `src/components/layouts/`
- `src/assets/icons/`, `src/assets/images/`
- `src/features/*` (auth, blog, community, courses, dashboard, health-tools, therapy)
- `src/pages/` (was empty, now has real content)

### 4. Code Bugs (FIXED ✅)
- `constants/responsive.ts`: Moved `import React` from bottom to top, converted to named imports
- `App.css`: Deleted (Vite boilerplate, never imported)
- `CTASection.tsx`: Was orphaned, now wired into `LandingPage.tsx`
- `SplashScreen.tsx`: Updated from broken Vite asset imports to public paths

### 5. Package Configuration (FIXED ✅)
- `package.json` name: `"my-app"` → `"soul-yatri"`

### 6. Documentation (FIXED ✅)
- `docs/ARCHITECTURE.md`: Updated to reflect actual project structure

## Final Project Structure
```
app/
├── public/images/          # ALL static assets (single source of truth)
├── src/
│   ├── components/ui/      # 53 shadcn/ui primitives
│   ├── config/             # Routes, permissions, validation, env config
│   ├── constants/          # App constants, navigation, responsive utilities
│   ├── context/            # Auth + Theme providers
│   ├── hooks/              # Custom hooks (responsive, advanced, mobile)
│   ├── lib/                # Third-party utils (cn helper)
│   ├── middleware/         # API middleware
│   ├── pages/              # SplashScreen, LandingPage
│   ├── sections/           # 11 landing page sections
│   ├── services/           # API, analytics, storage services
│   ├── types/              # 12 type definition files
│   ├── utils/              # Helpers, validators, error classes
│   ├── App.tsx             # Router root
│   ├── main.tsx            # Entry point
│   └── index.css           # Design system tokens + animations
├── docs/                   # 6 documentation files
├── .github/workflows/      # CI/CD workflows
└── [config files]          # vite, tailwind, ts, eslint, prettier, husky
```