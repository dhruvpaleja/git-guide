# Development Guide

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** 14+ (for backend)
- **Git**

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/dhruvpaleja/soul-yatri-website.git
cd soul-yatri-website

# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..
```

### 2. Environment Setup

```bash
# Frontend env
cp .env.example .env.local

# Backend env
cp server/.env.example server/.env
# Edit server/.env — set DATABASE_URL and JWT_SECRET at minimum
```

### 3. Database Setup

```bash
cd server
npx prisma migrate dev
npx prisma generate
npm run seed        # optional: seed dev data
cd ..
```

### 4. Start Development Servers

```bash
# Frontend (http://localhost:5173)
npm run dev

# Backend (http://localhost:3000) — in a separate terminal
cd server && npm run dev
```

## Available Commands

### Frontend

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (type-check + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | ESLint with auto-fix |
| `npm run lint:ci` | ESLint with zero warnings (CI gate) |
| `npm run bundle:budget` | Check JS chunk sizes against budgets |
| `npm run quality:ci` | **Full quality gate** — type-check, lint:ci, build, bundle:budget, server build, server lint:ci |
| `npm run test:e2e` | Playwright smoke tests (chromium) |

### Backend (`cd server`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Express dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | ESLint with auto-fix |
| `npm run lint:ci` | ESLint with zero warnings (CI gate) |
| `npm run seed` | Seed database with dev data |

### Pre-commit Hooks (Optional)

```bash
npm install husky @commitlint/config-conventional @commitlint/cli --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run type-check && npm run lint:ci"
npx husky add .husky/commit-msg "commitlint -E HUSKY_GIT_PARAMS"
```

## Development Accounts

With mock auth enabled (default in dev via `VITE_ENABLE_MOCK_AUTH=true`), use these accounts:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| User | user@test.com | user123 | User Dashboard |
| Therapist | therapist@test.com | therapist123 | Practitioner Dashboard |
| Astrologer | astrologer@test.com | astrologer123 | Astrology Dashboard |
| Admin | admin@test.com | admin123 | Admin Dashboard |

> **Note**: With a running backend and seeded database, real auth uses `POST /api/v1/auth/login`. Mock auth is controlled by the `VITE_ENABLE_MOCK_AUTH` environment variable.

## Code Style Guide

### Naming Conventions

- **Components**: PascalCase (`HeroSection.tsx`)
- **Functions**: camelCase (`handleClick()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserProps`)
- **Utility files**: kebab-case (`string.helpers.ts`)

### Import Order

1. React and external libraries
2. Internal components
3. Types and interfaces
4. Services and utilities
5. Constants

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { User } from '@/types';
import { apiService } from '@/services';
import { APP_CONSTANTS } from '@/constants';
```

## Git Workflow

### Branch Naming

- Features: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(component): add new button variant
fix(api): handle network errors properly
docs(architecture): update structure guide
```

## Quality Gates

Before pushing, run the full quality gate:

```bash
npm run quality:ci
```

This runs all checks in sequence:
1. `npm run type-check` — frontend TypeScript
2. `npm run lint:ci` — frontend ESLint (zero warnings)
3. `npm run build` — frontend production build
4. `npm run bundle:budget` — JS chunk size checks
5. `cd server && npm run build` — backend TypeScript
6. `cd server && npm run lint:ci` — backend ESLint (zero warnings)

For E2E smoke tests:

```bash
npm run test:e2e
```

## Troubleshooting

### Module not found errors
- Check import paths and TypeScript path aliases (`@/`, `@contracts/`)
- Clear `node_modules` and reinstall

### Build errors
Run the type check first:
```bash
npm run type-check
```

### Hot reload not working
- Restart the Vite dev server
- Clear browser cache

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
