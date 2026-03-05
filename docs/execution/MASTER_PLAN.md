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
- `BATCH:005`
- Phase target: `1 + 2 verification hardening`
- Objective:
  - Re-verify Phase 1 and Phase 2 gates in-depth against implemented code.
  - Fix discovered guardrail regressions without changing QA-visible UI/UX behavior.
  - Keep mock auth + bypass behavior active for QA, but enforce runtime-flag control path.
  - Close accidental dev/test route exposure defaults in server runtime config/examples.
  - Keep mock auth + ProtectedRoute bypass behavior unchanged for QA.
