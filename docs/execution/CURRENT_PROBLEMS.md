# Current Problems (Workspace Audit)

## Status
Updated during `BATCH:005` (Phase 1/2 re-verification).

## P-001 (resolved)
- Area: Phase 1 guardrails
- Problem: `ProtectedRoute` bypass and mock auth path existed as hardcoded behavior instead of runtime-flag-controlled flow.
- Impact: Could not centrally disable QA bypass path via flag contract.
- Resolution:
  - `src/router/ProtectedRoute.tsx` now gates bypass through `runtimeFlags.authBypassEnabled`.
  - `src/context/AuthContext.tsx` now gates mock-auth path through `runtimeFlags.mockAuthEnabled`.

## P-002 (resolved)
- Area: Server route exposure
- Problem: `ENABLE_DEV_ROUTES` and `ENABLE_TEST_ROUTES` had default-open behavior in config (`true` effective in non-dev scenarios).
- Impact: Risk of accidental dev/test route exposure.
- Resolution:
  - `server/src/config/index.ts` now defaults:
    - `enableDevRoutes` => `isDevelopment`
    - `enableTestRoutes` => `isDevelopment || isTest`
  - `server/.env.example` switched to:
    - `ENABLE_DEV_ROUTES=false`
    - `ENABLE_TEST_ROUTES=false`

## P-003 (resolved)
- Area: Lint gate reliability
- Problem: Invalid inline ESLint rule references in `src/pages/dashboard/TodaysSessionsPage.tsx` caused lint hard-fail.
- Impact: False-negative build quality signal when running strict lint checks.
- Resolution:
  - Removed invalid inline rule comment while preserving same runtime styles/behavior.

## Open Problems
- OP-001: Tailwind ambiguous utility warnings during build (`delay-[...]`, `duration-[...]`, `ease-[...]` classes).
- Planned phase: Phase 5 (performance/style cleanup).
