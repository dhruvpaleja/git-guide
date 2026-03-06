# Architecture Guide

## Overview

Soul Yatri is a full-stack mental wellness platform built as a monorepo with separate frontend and backend applications.

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + Prisma ORM + PostgreSQL
- **Shared contracts**: TypeScript types shared via `@contracts/*` path alias

## Directory Structure

### Frontend (`src/`)

```
src/
├── components/
│   ├── layout/        # Navigation, Footer, SmoothScrollProvider
│   └── ui/            # Reusable UI primitives (shadcn/ui based)
├── config/
│   ├── index.ts       # App/env config + runtime flag re-export
│   ├── runtime.flags.ts  # Feature flags (VITE_AUTH_BYPASS, VITE_ENABLE_MOCK_AUTH)
│   ├── routes.ts      # Route definitions
│   ├── permissions.ts # RBAC permission map
│   └── validation.schemas.ts  # Zod schemas
├── constants/         # Application constants
├── context/           # React Context providers (Auth, Theme)
├── features/          # Feature modules (domain-grouped)
│   ├── about/         # About page components
│   ├── auth/          # Auth forms and logic
│   ├── business/      # Corporate/business page components
│   ├── constellation/ # Soul Constellation Map widget
│   ├── courses/       # Course listing and detail
│   ├── dashboard/     # Dashboard widgets, layout, pages
│   ├── journey-preparation/  # Journey prep flow
│   ├── landing/       # Landing page sections (Hero, Stats, etc.)
│   ├── onboarding/    # User onboarding screens
│   ├── student-counselling/  # Student counselling feature
│   └── workshop/      # Workshop components
├── hooks/             # Custom React hooks (useDocumentTitle, etc.)
├── layouts/           # Page layout containers (DashboardLayout)
├── lib/               # Third-party library setup
├── middleware/         # Client-side request middleware
├── pages/             # Page-level route components
│   ├── auth/          # LoginPage, SignupPage
│   ├── dashboard/     # Dashboard sub-pages
│   └── practitioner/  # Practitioner pages
├── router/            # React Router config, ProtectedRoute
├── services/          # API service, WebSocket service, analytics
├── types/             # TypeScript type definitions
└── utils/
    ├── errors/        # Client error classes
    ├── helpers/       # Pure utility functions
    └── validators/    # Input validation
```

### Backend (`server/src/`)

```
server/src/
├── config/            # Server config (env vars, runtime flags)
├── controllers/       # Request handlers (auth, notifications, health-tools, users)
├── lib/
│   ├── errors.ts      # AppError class + canonical error codes
│   ├── response.ts    # sendSuccess / sendError helpers
│   ├── dev-login.ts   # Dev login helper
│   └── websocket.ts   # Socket.io setup
├── middleware/
│   ├── auth.middleware.ts      # requireAuth, requireRole
│   ├── rbac.middleware.ts      # Role-based access control
│   ├── error.ts               # Global error handler
│   ├── request-context.ts     # Correlation IDs, timing
│   ├── security.middleware.ts  # Security headers
│   └── user-rate-limit.middleware.ts  # Per-user rate limiting
├── modules/           # Domain module stubs (future service layer)
│   ├── admin/     ├── ai/       ├── astrology/
│   ├── auth/      ├── blog/     ├── careers/
│   ├── community/ ├── corporate/ ├── courses/
│   ├── events/    ├── health/   ├── health-tools/
│   ├── ngo/       ├── notifications/
│   ├── payments/  ├── shop/     ├── therapy/
│   └── users/
├── routes/            # Express routers (22 route files)
├── services/          # Business logic (tokens, etc.)
├── shared/
│   ├── constants/     # Error codes (ERROR_CODES, CANONICAL_ERROR_CODES)
│   ├── contracts/     # Shared TypeScript contracts (api, auth, websocket)
│   ├── middleware/     # Shared middleware
│   ├── types/         # Shared types
│   └── utils/         # Shared utilities
└── validators/        # Request body validators (Zod schemas)
```

### Other

```
docs/
├── API.md             # Full endpoint reference (170+ endpoints)
├── ARCHITECTURE.md    # This file
├── CONTRIBUTING.md    # Contribution guide
├── DEVELOPMENT.md     # Setup and development guide
└── execution/         # Batch execution tracking
    ├── MASTER_PLAN.md
    ├── STATUS.md
    ├── DECISIONS.md
    ├── RISKS.md
    └── BASELINE_METRICS.json

tests/                 # Playwright E2E tests
scripts/               # Build/audit scripts
public/images/         # Static assets
```

## Key Architecture Patterns

### Shared Contracts

Frontend and backend share TypeScript type contracts via the `@contracts/*` path alias, mapped to `server/src/shared/contracts/`:

- `api.contracts.ts` — API envelope types (`ApiEnvelope`)
- `auth.contracts.ts` — Auth role/token types
- `websocket.contracts.ts` — WebSocket event/payload types

### Error Handling

**Server**: Canonical error code system (`AUTH_001`–`SRV_005`) with `AppError` class and `sendSuccess`/`sendError` response helpers. Global error middleware catches all thrown errors and normalizes the response.

**Client**: `ApiMiddleware` + `api.service.ts` handle retry logic (GET transients), auth token refresh, and error normalization for the UI layer.

### Authentication & Authorization

- **JWT-based**: Access token (short-lived) + refresh token
- **Middleware**: `requireAuth` validates Bearer token, `requireRole` checks role hierarchy
- **RBAC**: Four roles — `USER`, `THERAPIST`, `ASTROLOGER`, `ADMIN`
- **Dev mode**: `VITE_AUTH_BYPASS` and `VITE_ENABLE_MOCK_AUTH` runtime flags allow testing without a running backend

### Runtime Feature Flags

Defined in `src/config/runtime.flags.ts`, controlled by `VITE_*` environment variables:

| Flag | Default (dev) | Purpose |
|------|:------------:|---------|
| `VITE_AUTH_BYPASS` | `true` | Skip real auth in dev |
| `VITE_ENABLE_MOCK_AUTH` | `true` | Enable mock login system |

### State Management

- **React Context**: Auth state, theme
- **Zustand**: Feature-specific stores (where needed)
- **React Query**: Server state and data fetching cache
- **Local state**: Component-level UI state

### Performance

- **Code splitting**: React `lazy()` for route-level chunks
- **Bundle budgets**: Enforced via `scripts/check-bundle-budgets.js`
- **Component memoization**: `React.memo` on render-heavy components
- **Chunk strategy**: Vendor, animation, and feature chunks split in Vite config

### WebSocket

- **Socket.io**: Real-time notifications and session events
- **Auth**: WebSocket connection validated via JWT
- **Typed events**: Shared contracts define event names and payload shapes

### API Route Status

Of ~170 registered server routes:
- **~30 implemented** (auth, users, health-tools, notifications, health, dev routes)
- **~140 stubs** returning `501 SRV_005 Not Implemented`

See [API.md](API.md) for the complete endpoint reference with implementation status.

### Running Linter
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## API Integration

The `ApiService` class handles all HTTP requests with:
- Automatic retry logic
- Request/response interceptors
- Error handling and logging
- Request cancellation support

Example usage:
```typescript
import { apiService } from '@/services';

const response = await apiService.get('/api/posts', { timeout: 5000 });
```

## Scalability Considerations

This structure supports:
- **2000+ pages**: Organized into logical modules
- **Large teams**: Clear separation of concerns
- **Code reusability**: Shared components and utilities
- **Performance**: Lazy loading and code splitting
- **Maintainability**: Consistent patterns and naming conventions
