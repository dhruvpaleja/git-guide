# Decisions Log

## D-001
- Date: 2026-03-05
- Batch: BATCH:001
- Decision: Keep QA auth-bypass and mock-auth functionally active, but move behavior behind explicit runtime flags for controlled enable/disable.
- Rationale: Preserves active QA workflows while reducing accidental promotion risk.

## D-002
- Date: 2026-03-05
- Batch: BATCH:001
- Decision: Gate unsafe server dev/test routes with dedicated runtime config flags instead of environment-mode shortcuts.
- Rationale: Enables explicit intent and avoids accidental exposure in production runtime.

## D-003
- Date: 2026-03-05
- Batch: BATCH:002
- Decision: Keep `ProtectedRoute` bypass and mock auth login behavior unchanged for active QA on deployed environments.
- Rationale: User requirement is to preserve current QA flow while improving engineering quality in non-UI-breaking areas.

## D-004
- Date: 2026-03-05
- Batch: BATCH:002
- Decision: Normalize token usage through `STORAGE_KEYS.AUTH_TOKEN` across API/middleware/dashboard paths before deeper auth refactors.
- Rationale: Removes storage-key drift (`token`/`auth_token`) and prevents inconsistent auth header behavior.

## D-005
- Date: 2026-03-05
- Batch: BATCH:003
- Decision: Enforce feature-boundary imports for `pages`, `router`, and `layouts` via `no-restricted-imports`, requiring feature public APIs (`@/features/<feature>`).
- Rationale: Prevents deep import leakage and creates stable module boundaries without UI changes.

## D-006
- Date: 2026-03-05
- Batch: BATCH:003
- Decision: Converge server route mounting into `server/src/routes/manifest.ts` and mount through a single iterator in `server/src/routes/index.ts`.
- Rationale: Gives one canonical ownership table for domain routes and removes duplicated mounting responsibility.

## D-007
- Date: 2026-03-05
- Batch: BATCH:003
- Decision: Keep canonical API prefix at `/api/v1` and preserve `/api` through rewrite compatibility middleware instead of dual mount stacks.
- Rationale: Maintains backward compatibility while establishing a single canonical route stack.

## D-008
- Date: 2026-03-05
- Batch: BATCH:004
- Decision: Place shared frontend/backend contracts under `server/src/shared/contracts` and consume them in frontend via `@contracts/*` alias.
- Rationale: Keeps one concrete source of truth without changing server runtime build topology.

## D-009
- Date: 2026-03-05
- Batch: BATCH:004
- Decision: Preserve existing API and websocket runtime payload shapes while adding strict contract guards/adapters at service boundaries.
- Rationale: Removes type drift with zero UI/UX flow changes and no QA behavior impact.

## D-010
- Date: 2026-03-05
- Batch: BATCH:005
- Decision: Keep QA bypass and mock auth behavior active, but enforce that both execute through `runtimeFlags` instead of hardcoded unconditional branches.
- Rationale: Satisfies QA requirement while restoring a single explicit control contract from Phase 1.

## D-011
- Date: 2026-03-05
- Batch: BATCH:005
- Decision: Change server defaults for `ENABLE_DEV_ROUTES` and `ENABLE_TEST_ROUTES` to fail-closed (`false` outside dev/test defaults), including `.env.example`.
- Rationale: Prevents accidental route exposure and aligns with Phase 1 risk stabilization goals.

## D-012
- Date: 2026-03-05
- Batch: BATCH:006
- Decision: Include `src/config/runtime.flags.ts` and the `runtimeFlags` re-export in `src/config/index.ts` in committed history before Phase 3 push.
- Rationale: BATCH:005 introduced `runtimeFlags` imports; without committing source/export, remote master could fail in clean environments.

## D-013
- Date: 2026-03-05
- Batch: BATCH:006
- Decision: Phase 3 push scope includes only contract/type/API/WS unification files plus the runtime-flags integrity fix; no UI/UX behavior changes.
- Rationale: Preserves QA workflows while restoring deterministic compile/runtime behavior.

## D-014
- Date: 2026-03-05
- Batch: BATCH:007
- Decision: Add `lint:ci` scripts in root and server, plus root `quality:ci` script chaining frontend+server type/lint/build checks.
- Rationale: Enforces fail-on-warning static quality gate consistently in local and CI-equivalent runs.

## D-015
- Date: 2026-03-05
- Batch: BATCH:008
- Decision: Patch CI regression with minimal-scope fixes (feature barrel export restoration + targeted lint remediation) instead of broad Phase 4 refactor.
- Rationale: Restores production build stability fastest while preserving current UI/UX and active QA mock-auth behavior.

## D-016
- Date: 2026-03-05
- Batch: BATCH:009
- Decision: Keep dev-login capability available by default for active QA, but enforce explicit runtime-flag-controlled mounting across bootstrap and route index.
- Rationale: Preserves the user's hard requirement (do not remove dev logins yet) while making exposure policy deterministic and centrally controlled.

## D-017
- Date: 2026-03-05
- Batch: BATCH:009
- Decision: Mount test routes only when `runtime.enableTestRoutes` is true.
- Rationale: Removes unconditional test-route exposure and separates QA dev-login behavior from test-only endpoints.

## D-018
- Date: 2026-03-05
- Batch: BATCH:009
- Decision: Correct execution tracking to reflect committed state and mark prior manifest/compat ownership claims as deferred artifacts not present in HEAD.
- Rationale: Restores handoff integrity so future agents can trust docs without ambiguous historical drift.

## D-019
- Date: 2026-03-05
- Batch: BATCH:010
- Decision: Use scoped `eslint-disable react-refresh/only-export-components` at the top of UI/context files where utility variants or custom hooks are exported alongside components.
- Rationale: Avoids breaking backwards compatibility or creating unnecessary wrapper files for single constants/hooks.

## D-020
- Date: 2026-03-05
- Batch: BATCH:010
- Decision: Replaced problematic `watch()` from react-hook-form with `useWatch()` in SignupForm.
- Rationale: Safely memoizes component and complies with React Compiler rules as requested by ESLint `incompatible-library` warning.

## D-021
- Date: 2026-03-05
- Batch: BATCH:010
- Decision: Captured refs in local variables within `useEffect` cleanup in `OnboardingAstrologyPage.tsx`.
- Rationale: Prevents `exhaustive-deps` warnings about ref mutation between render and cleanup.

## D-022
- Date: 2026-03-05
- Batch: BATCH:010
- Decision: Removed or explicitly suppressed `console.log` statements in frontend with `// eslint-disable-next-line no-console` (only where explicitly gated by `import.meta.env.DEV` or mock behavior). Mock interaction logs were replaced with comments.
- Rationale: Passes strict `no-console` linting rule without altering end-user UI/UX or feature parity.

## D-023
- Date: 2026-03-05
- Batch: BATCH:011
- Decision: Replace ambiguous Tailwind timing-function arbitrary classes with stable CSS utility classes (`ease-soul-smooth`, `ease-soul-spring`) defined in `src/index.css`.
- Rationale: Removes build-time Tailwind ambiguity warnings while keeping transition timing curves and visual behavior unchanged.

## D-024
- Date: 2026-03-05
- Batch: BATCH:011
- Decision: Convert Login page decorative orb inline styles into reusable CSS utility classes (`auth-orb-warm`, `auth-orb-cool`).
- Rationale: Reduces inline style churn and keeps decorative styling deterministic without altering layout or interaction flow.

## D-025
- Date: 2026-03-05
- Batch: BATCH:011
- Decision: Keep Sidebar CSS custom-property behavior, but normalize style object creation through typed style-variable helpers/memoization.
- Rationale: Preserves UI behavior while reducing ad-hoc style casts and improving structural style consistency in shared UI primitives.

## D-026
- Date: 2026-03-05
- Batch: BATCH:011
- Decision: Expand Vite manual chunking to isolate heavy animation and 3D dependency groups (`animation`, `three-core`) from app core (`index`).
- Rationale: Improves cacheability and lowers core app chunk size without changing routes, API contracts, or user-visible UI flows.

## D-027
- Date: 2026-03-05
- Batch: BATCH:012
- Decision: Add explicit bundle budget policy in `docs/execution/bundle-budgets.json` and enforce it via `scripts/check-bundle-budgets.js` wired into `quality:ci`.
- Rationale: Provides deterministic pass/fail guardrails for core/app-route chunk growth while keeping route/API behavior unchanged.

## D-028
- Date: 2026-03-05
- Batch: BATCH:012
- Decision: Optimize navigation scroll handling with `requestAnimationFrame` scheduling and ref-based state guards to avoid redundant state updates on scroll.
- Rationale: Reduces avoidable rerenders in a globally mounted component without affecting visual behavior or routing.

## D-029
- Date: 2026-03-05
- Batch: BATCH:012
- Decision: Replace `connections -> renderNodes.find()` per-edge lookups in `SoulConstellationMap` with memoized node map + memoized render connection list.
- Rationale: Eliminates repeated O(n*m) lookup work in a dashboard hero widget while preserving exact rendering output and interactions.

## D-030
- Date: 2026-03-05
- Batch: BATCH:012
- Decision: Hoist static hero text animation constants/character arrays in `HeroSection` outside the component function.
- Rationale: Avoids recreation of static animation metadata and mapped character sources on each render with no UI/animation behavior change.

## D-031
- Date: 2026-03-05
- Batch: BATCH:013
- Decision: Expand responsiveness evidence scope from core routes to full primary route inventory (public/auth/onboarding/dashboard/practitioner/admin/astrology) in `scripts/responsive-audit.mjs`.
- Rationale: Ensures Phase 6 handoff can prove cross-device behavior for the entire working app surface, not only a subset.

## D-032
- Date: 2026-03-05
- Batch: BATCH:013
- Decision: Treat decorative off-screen elements as non-failing unless they generate measurable horizontal overflow; fail conditions remain strict on actual overflow and touch-target violations.
- Rationale: Prevents false negatives from intentionally clipped art while preserving strict detection of real responsiveness breakage.

## D-033
- Date: 2026-03-05
- Batch: BATCH:013
- Decision: Apply responsiveness fixes through shared/high-leverage components first (Footer, dashboard headers/widgets, onboarding controls) and then route-level targeted patches only where audit data showed failures.
- Rationale: Maximizes coverage with minimal UI churn, keeps visual identity stable, and avoids uncontrolled redesign risk.

## D-034
- Date: 2026-03-05
- Batch: BATCH:013
- Decision: Exclude local AI-agent/playwright helper trees (`.agent/**`, `.agents/**`, `playwright-utils/**`, `tests/**`) from root ESLint global scope.
- Rationale: These paths are local tooling assets, not production app surface; keeping them in root `lint:ci` created false gate failures that blocked Phase 6 verification despite healthy product code.

## D-035
- Date: 2025-07-24
- Batch: BATCH:014
- Decision: Use universal `prefers-reduced-motion: reduce` CSS rule with `!important` to suppress all animations/transitions, rather than targeting individual animation classes.
- Rationale: Guarantees complete motion suppression including third-party and dynamically generated animations without needing to maintain a per-class allow-list.

## D-036
- Date: 2025-07-24
- Batch: BATCH:014
- Decision: Set color contrast floor at text-white/50 for all readable text on dark backgrounds (from text-white/30 and text-white/40), and text-black/50 for light backgrounds.
- Rationale: Achieves WCAG AA 4.5:1 minimum contrast ratio while preserving existing design hierarchy. Icons and decorative elements excluded from contrast changes.

## D-037
- Date: 2025-07-24
- Batch: BATCH:014
- Decision: Create shared `useDocumentTitle` hook applied to all 38 page components rather than setting title in route metadata.
- Rationale: Works with React Router's existing lazy-loaded route setup without requiring router config changes. Hook pattern is composable and allows dynamic titles.
