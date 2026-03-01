# Project Structure Standards

## Overview
This document defines the industry-standard file organization and naming conventions for Soul Yatri. It follows Next.js/React best practices with a feature-based modular architecture.

---

## Frontend Structure (`/src`)

### Top-Level Organization

```
src/
├── components/          # Shared UI components (not feature-specific)
├── config/             # Configuration files (API endpoints, constants)
├── constants/          # Global constants
├── context/            # React Context providers
├── features/           # Feature modules (see below)
├── hooks/              # Shared React hooks
├── layouts/            # Layout components (DashboardLayout, MainLayout)
├── lib/                # Utility libraries and helpers
├── middleware/         # Request/response middleware
├── pages/              # Legacy - being consolidated into features
├── router/             # Route configuration (router/index.tsx)
├── services/           # API service layer
├── types/              # Global TypeScript types
├── utils/              # Utility functions
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

### Feature Module Structure

Each feature under `/src/features/<feature-name>/` must follow this structure:

```
features/<feature-name>/
├── components/         # UI components specific to this feature
│   ├── ComponentName.tsx
│   ├── FormName.tsx
│   └── NestedComponent/
│       └── Component.tsx
├── pages/              # Route-level page components (lazy-loaded)
│   ├── FeatureNamePage.tsx
│   └── SubPage.tsx
├── hooks/              # Custom React hooks for this feature
│   └── useFeatureLogic.ts
├── services/           # API calls for this feature
│   └── featureName.service.ts
├── types/              # TypeScript interfaces/types
│   └── featureName.types.ts
├── constants/          # Feature-specific constants
│   └── featureName.constants.ts
├── index.ts            # Public API - re-exports
└── README.md           # Feature documentation (optional)
```

### Naming Conventions

**Components & Pages:**
- PascalCase (UpperCamelCase)
- Suffix: `Page` for route-level components, `Modal` for modals, `Dialog` for dialogs
- Examples: `UserProfilePage.tsx`, `AuthModal.tsx`, `ConfirmDialog.tsx`

**Files:**
- PascalCase for components and pages
- camelCase for utilities and services
- lowercase with hyphens for directories

**React Hooks:**
- Start with `use` prefix
- Examples: `useAuth.ts`, `useFetcher.ts`, `useFormValidation.ts`

**Services:**
- Suffix: `.service.ts`
- Examples: `auth.service.ts`, `users.service.ts`

**Types:**
- Suffix: `.types.ts`
- Use `Type` suffix for type definitions: `UserProfile`, `AuthResponse`

**Constants:**
- Suffix: `.constants.ts`
- UPPER_SNAKE_CASE for const values
- Examples: `MAX_UPLOAD_SIZE`, `API_TIMEOUT_MS`

---

## Backend Structure (`/server/src`)

### Organization

```
server/src/
├── config/             # Configuration (database, env variables)
├── controllers/        # Request handlers (one file per feature)
│   ├── auth.controller.ts
│   ├── users.controller.ts
│   └── <feature>.controller.ts
├── middleware/         # Express middleware
│   ├── auth.middleware.ts
│   └── errorHandler.middleware.ts
├── modules/            # Database models and Prisma schema
├── routes/             # Route definitions (one file per feature)
│   ├── auth.ts
│   ├── users.ts
│   └── <feature>.ts
├── validators/         # Zod schemas (one file per feature)
│   ├── auth.validator.ts
│   ├── users.validator.ts
│   └── <feature>.validator.ts
├── services/           # Business logic and external integrations
│   └── <feature>.service.ts
├── shared/             # Shared utilities and helpers
│   ├── types.ts        # Shared types
│   └── constants.ts    # Shared constants
├── lib/                # Library code (response handlers, errors)
│   ├── async-handler.ts
│   ├── errors.ts
│   ├── response.ts
│   └── prisma.ts
└── index.ts            # Server entry point
```

### Naming Conventions

**Controllers:**
- Suffix: `.controller.ts`
- Export named functions: `getUser`, `createUser`, `updateUser`, `deleteUser`
- Examples: `auth.controller.ts`, `users.controller.ts`

**Routes:**
- Suffix: `.ts` (no special suffix)
- Named export: `<featureName>Routes` or similar
- Examples: `auth.ts`, `users.ts`

**Validators:**
- Suffix: `.validator.ts`
- Export Zod schemas: `createUserSchema`, `loginSchema`
- Examples: `auth.validator.ts`, `users.validator.ts`

**Services:**
- Suffix: `.service.ts`
- Class-based or function-based (both acceptable)
- Examples: `email.service.ts`, `payment.service.ts`

---

## API Route Structure

### Naming Pattern

```
/api/v1/<resource>/<action>
```

**Routes:**
- Use kebab-case for multi-word routes: `/therapy-sessions`, `/health-checks`
- RESTful verbs: GET, POST, PUT, DELETE, PATCH
- No trailing slashes

**Examples:**
```
POST   /api/v1/users/register
POST   /api/v1/users/login
GET    /api/v1/users/profile
POST   /api/v1/users/onboarding
GET    /api/v1/therapy-sessions
POST   /api/v1/therapy-sessions
```

---

## Import Path Aliases

Use `@/` alias for absolute imports (configured in `tsconfig.json`):

```typescript
// ✅ Good
import Button from '@/components/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import apiService from '@/services/api.service';

// ❌ Avoid
import Button from '../../../../components/Button';
import { useAuth } from '../../../features/auth/hooks/useAuth';
```

---

## File Grouping by Feature

### Auth Feature Example

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── PasswordField.tsx
├── pages/
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useLogin.ts
├── services/
│   └── auth.service.ts
├── types/
│   └── auth.types.ts
├── constants/
│   └── auth.constants.ts
├── index.ts
└── README.md
```

### Onboarding Feature Example

```
features/onboarding/
├── components/
│   ├── StepCard.tsx
│   ├── ProgressBar.tsx
│   └── steps/
│       ├── StepStruggles.tsx
│       ├── StepGoals.tsx
│       └── StepConfirmation.tsx
├── pages/
│   ├── OnboardingPage.tsx
│   └── PersonalizePage.tsx
├── hooks/
│   ├── useOnboardingProgress.ts
│   └── useStepNavigation.ts
├── services/
│   └── onboarding.service.ts
├── types/
│   └── onboarding.types.ts
├── constants/
│   └── onboarding.constants.ts
├── index.ts
└── README.md
```

---

## Index.ts Pattern (Public API)

Each feature must export a clean public API through `index.ts`:

```typescript
// src/features/auth/index.ts

// Export components
export { default as LoginForm } from './components/LoginForm';
export { default as SignupForm } from './components/SignupForm';

// Export pages (usually lazy-loaded in router)
export { default as LoginPage } from './pages/LoginPage';
export { default as SignupPage } from './pages/SignupPage';

// Export hooks
export { useAuth } from './hooks/useAuth';
export { useLogin } from './hooks/useLogin';

// Export types (always safe to export)
export type { LoginFormValues, AuthContext } from './types/auth.types';

// Export services (use cautiously)
export { authService } from './services/auth.service';

// ❌ Don't export constants unless necessary (use directly in feature)
```

---

## Style & Tailwind Configuration

### Class Organization (ABEM pattern)

```tsx
// Blocks, Elements, Modifiers
className="
  // Block (main container)
  relative h-screen bg-black
  // Elements (child states)
  flex flex-col items-center
  // Modifiers (conditional classes)
  dark:bg-gray-900
"
```

### Naming Pattern

- Utility-first (Tailwind CSS)
- No custom CSS files unless absolutely necessary
- Use Tailwind plugins for complex patterns

---

## Testing Structure

```
tests/
├── unit/
│   ├── hooks/
│   ├── utils/
│   └── services/
├── integration/
│   ├── features/
│   └── api/
├── e2e/
│   └── user-flows/
└── fixtures/
    └── mockData.ts
```

---

## Git Ignore & Temporary Files

Clean up temporary files (tmpclaude-* folders should not be committed):

```
# .gitignore
node_modules/
dist/
build/
.env.local
.env.*.local
tmpclaude-*/
.DS_Store
*.swp
*.swo
```

---

## Documentation Files

- **README.md** - Project setup and overview
- **STRUCTURE_STANDARDS.md** - This file (structure and naming)
- **docs/BUILD_PLAN.md** - Feature roadmap and specifications
- **docs/ARCHITECTURE.md** - High-level architecture decisions
- **docs/DEVELOPMENT.md** - Development guidelines
- **features/<name>/README.md** - Feature-specific documentation

---

## Validation Checklist

- [ ] All components use PascalCase
- [ ] All pages end with `Page` suffix
- [ ] All features have `index.ts` with clean exports
- [ ] All API services use `@/` absolute imports
- [ ] Backend controllers/validators exist for all routes
- [ ] Routes follow REST conventions
- [ ] No circular imports
- [ ] Types defined at feature level or globally
- [ ] Constants properly scoped
- [ ] Build passes without errors
