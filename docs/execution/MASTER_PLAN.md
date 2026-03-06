# Soul Yatri 10/10 Implementation Master Plan

## Scope
- Execute the approved 10/10 plan in controlled batches.
- Preserve existing UI/UX behavior unless a defect fix is required.
- Keep QA auth-bypass and mock-auth flows available during active QA.

## Batch Rules
- Each batch has one primary domain unless explicitly marked cross-domain.
- Every batch must record:
  - `batch_id`
  - `scope`
  - `files_touched`
  - `checks_run`
  - `result`
- Every batch starts by reading:
  - `MASTER_PLAN.md`
  - `STATUS.md`
  - `DECISIONS.md`
  - `RISKS.md`
  - `BASELINE_METRICS.json`

## Phase Execution Order
1. Phase 0 - Preflight and baseline freeze.
2. Phase 1 - Critical risk stabilization (no UX change).
3. Phase 2 - Architecture convergence.
4. Phase 3 - Shared contracts and type unification.
5. Phase 4 - Lint/static quality to zero warnings.
6. Phase 5 - Performance engineering pass.
7. Phase 6 - Responsiveness pass.
8. Phase 7 - Accessibility pass.
9. Phase 8 - Error handling and resilience.
10. Phase 9 - Testing foundation and coverage ramp.
11. Phase 10 - Documentation and operational hardening.
12. Phase 11 - Final verification and release readiness.

## Current Batch
- `BATCH:017`
- Phase target: `Phase 10 documentation and operational hardening`
- Objective:
  - Consolidate redundant setup docs (SETUP.md → docs/DEVELOPMENT.md).
  - Refresh README.md (React 19, quality:ci/test:e2e commands, correct dev account passwords).
  - Comprehensive API.md rewrite: 170+ endpoints documented with method, path, auth, status (LIVE/STUB), description.
  - Refresh ARCHITECTURE.md to reflect current directory structure, features/, shared contracts, runtime flags, middleware pipeline.
  - Update CONTRIBUTING.md with project-specific quality gates, commit conventions, code standards.
  - Close R-022: normalize all 241 ad-hoc 501 stub responses across 14 server route files to canonical `sendError(res, 501, 'SRV_005', 'Not implemented')`.
  - Add missing `VITE_AUTH_BYPASS` and `VITE_ENABLE_MOCK_AUTH` to root `.env.example`.
  - Delete 29 stale root markdown/output files and 12 stale server output files.
  - All quality gates passing: `type-check`, `lint:ci`, `build`, `bundle:budget`, server build, server lint:ci, `quality:ci`, chromium smoke (15/15).
  - Update execution docs at batch end.
