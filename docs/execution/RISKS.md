# Risk Register

| id | severity | owner | risk | mitigation | status |
| --- | --- | --- | --- | --- | --- |
| R-001 | high | codex | Existing dirty worktree may overlap with implementation targets | Hard-synced workspace to `origin/master` before BATCH:009 and continue scoped-only edits | mitigated |
| R-002 | high | codex | QA bypass may leak into unintended runtime | Keep behavior per user requirement; enforce explicit flags and document QA-only intent | accepted_for_qa |
| R-003 | medium | codex | WebSocket auth claim mismatch breaks targeted delivery | Aligned WS auth extraction to JWT `sub` via `tokensService.verifyToken` | mitigated |
| R-004 | medium | codex | Mixed token key usage (`token` vs `auth_token`) causes inconsistent client auth | Normalized to `STORAGE_KEYS.AUTH_TOKEN` in API/middleware/dashboard paths | mitigated |
| R-005 | low | codex | Tailwind ambiguous utility warnings appear during frontend build output | Schedule utility-class normalization in performance/style cleanup batch | open |
| R-006 | medium | codex | Architecture convergence touched multiple domains in one batch | Explicitly marked as cross-domain in STATUS and documented ownership/decisions | mitigated |
| R-007 | medium | codex | Frontend now consumes shared contracts from server source tree (`@contracts/*`) and could break if server contract path moves | Documented in decisions + path aliases; future path move must include alias migration and contract import audit | mitigated |
| R-008 | low | codex | Notification websocket payload remains permissive (`Record<string, unknown>`), requiring narrow cast in UI page | Keep runtime behavior unchanged for QA; add typed notification payload map in Phase 8 error/resilience or Phase 9 tests | open |
| R-009 | high | codex | Dev login exposure can remain broad during QA if left default-enabled in non-test environments | Keep as accepted QA behavior per explicit user instruction; exposure still deterministic via `runtime.enableDevRoutes` and removable later by config flip | accepted_for_qa |
| R-010 | high | codex | `runtimeFlags` imports were committed without guaranteed committed source/export in remote history | Added `src/config/runtime.flags.ts` and `src/config/index.ts` re-export to Phase 3 push scope; re-verified build/lint/typecheck | mitigated |
| R-011 | low | codex | Tailwind CLI warnings (ambiguous arbitrary utility tokens) are not captured by ESLint fail-on-warning gate | Track under Phase 5 style/performance cleanup; keep CI lint gate strict while documenting build-warning backlog | open |
| R-012 | high | codex | Previous commit left CI-critical fixes only in local workspace (not committed), causing production build/lint failures on master | Shipped BATCH:008 hotfix commit with only failing files + full quality gate verification before push | mitigated |
| R-013 | high | codex | Execution docs drifted from committed route architecture artifacts, causing handoff ambiguity | BATCH:009 corrected STATUS/DECISIONS and explicitly documented deferred artifacts; future batches must validate docs against `HEAD` before close | mitigated |
