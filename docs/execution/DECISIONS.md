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
